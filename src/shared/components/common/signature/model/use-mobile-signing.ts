import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import CRC32 from 'crc-32'
import { ozdst1106 } from './ozdst1106'
import { getMobileSign, getMobileStatus, verifyMobileDocument } from '../api/mobile-imzo'
import { convertPdfToBase64 } from './index'

interface UseMobileDocumentSigningProps {
  documentUrl: string
  onSuccess?: (result: any) => void
}

export function useMobileDocumentSigning({ documentUrl, onSuccess }: UseMobileDocumentSigningProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [deepLink, setDeepLink] = useState<string | null>(null)
  const [didRedirect, setDidRedirect] = useState(false)
  const [isPolling, setIsPolling] = useState(false)

  // Polling management
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const isPollingRunningRef = useRef<boolean>(false)

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    isPollingRunningRef.current = false
    setIsPolling(false)
  }, [])

  // To cleanup when the component unmounts
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  // Auto-redirect when deepLink is ready
  useEffect(() => {
    if (deepLink && !didRedirect) {
      console.log('Auto-redirecting to:', deepLink)
      window.location.href = deepLink
      setDidRedirect(true)
    }
  }, [deepLink, didRedirect])

  const zeroPad = (s: string, count: number) => {
    if (s.length >= count) return s
    return '0'.repeat(count - s.length) + s
  }

  const startSigning = useCallback(async () => {
    try {
      setDidRedirect(false)
      setIsStarting(true)
      setIsSigning(true)
      setIsPolling(false)

      // 1. Convert PDF to base64
      const documentBase64 = await convertPdfToBase64(documentUrl)
      if (!documentBase64) {
        toast.error('Hujjatni qayta ishlashda xatolik yuz berdi')
        setIsStarting(false)
        setIsSigning(false)
        return
      }

      // 2. Start Document Sign session
      const signRes = await getMobileSign()

      // Note: The /sign endpoint returns siteId and documentId.
      // The hash should be calculated using the document data, not an auth challenge.
      const { documentId, siteId } = signRes

      if (!documentId || !siteId) {
        toast.error('Imzolash seansini boshlashda xatolik yuz berdi')
        setIsStarting(false)
        setIsSigning(false)
        return
      }

      // 3. Calculate Hash for QR (from document data)
      // We must hash the actual binary bytes of the PDF, not the base64 string itself
      const base64ToBytes = (base64: string) => {
        const binString = window.atob(base64)
        const len = binString.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binString.charCodeAt(i)
        }
        return bytes
      }

      const documentBytes = base64ToBytes(documentBase64)
      const hashBytes = ozdst1106(documentBytes)
      const hashString = Array.from(hashBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()

      // 4. Generate QR Body and CRC32
      const qrBody = (siteId + documentId + hashString).toUpperCase()

      console.log('Generating QR for:', { siteId, documentId, hashString, qrBody })

      // Standard CRC32 on BINARY bytes (Hex decoded qrBody)
      const hexToBytes = (hex: string) => {
        const bytes = new Uint8Array(hex.length / 2)
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
        }
        return bytes
      }

      const qrBytes = hexToBytes(qrBody)
      const crcValue = CRC32.buf(qrBytes)
      const crcHex = (crcValue >>> 0).toString(16).toUpperCase()

      const crc32Str = zeroPad(crcHex, 8).toUpperCase()
      const qrCode = (qrBody + crc32Str).toUpperCase()

      console.log('Final QR Code:', qrCode)
      console.log('QR Code Length:', qrCode.length)
      setQrCodeData(qrCode)
      setDeepLink(`eimzo://sign?qc=${qrCode}`)
      setIsStarting(false)
      setIsPolling(true)

      let checkCount = 0
      const STATUS_CHECK_LIMIT = 24

      isPollingRunningRef.current = true
      pollingRef.current = setInterval(async () => {
        if (!isPollingRunningRef.current) return

        checkCount++
        if (checkCount > STATUS_CHECK_LIMIT) {
          stopPolling()
          toast.error('Kutish vaqti tugadi. Qaytadan urinib ko‘ring')
          setIsSigning(false)
          return
        }

        try {
          const statusRes = await getMobileStatus(documentId)

          if (statusRes.status === 1) {
            try {
              const verifyRes = await verifyMobileDocument(documentId, documentBase64)
              console.log('Verify Mobile Document Result:', verifyRes)

              stopPolling()
              setIsSigning(false)

              // verifyMobileDocument now returns the unwrapped data payload
              const payload = verifyRes
              let finalPkcs7 =
                payload?.pkcs7Attached || payload?.pkcs7b64 || payload?.pkcs7 || payload?.pkcs7Info?.documentBase64

              if (finalPkcs7) {
                finalPkcs7 = finalPkcs7.replace(/\s/g, '')
                if (onSuccess) onSuccess(finalPkcs7)
              } else if (onSuccess && statusRes.pkcs7b64) {
                const cleanPkcs7 = statusRes.pkcs7b64.replace(/\s/g, '')
                onSuccess(cleanPkcs7)
              } else {
                console.error('Missing PKCS7 in response:', verifyRes)
                toast.error('Imzo formati olinganida xatolik yuz berdi: ' + JSON.stringify(verifyRes))
              }
            } catch (verifyError: any) {
              console.error('Verify document error:', verifyError)
              stopPolling()
              setIsSigning(false)
              toast.error('Hujjatni imzolashda server xatoligi: ' + (verifyError.message || verifyError))
            }
          } else if (statusRes.status !== 2) {
            stopPolling()
            toast.error('Imzolash jarayoni bekor qilindi yoki xatolik (' + statusRes.status + ')')
            setIsSigning(false)
          }
        } catch (err) {
          console.error('Status check error', err)
        }
      }, 5000)
    } catch (error: any) {
      console.error('Mobil imzolashda xatolik:', error)
      toast.error(error?.message || 'Mobil imzolashda xatolik yuz berdi')
      setIsStarting(false)
      setIsSigning(false)
    }
  }, [documentUrl, onSuccess, stopPolling])

  return {
    startSigning,
    isStarting,
    isSigning,
    isPolling,
    deepLink,
    qrCodeData,
    stopPolling,
  }
}
