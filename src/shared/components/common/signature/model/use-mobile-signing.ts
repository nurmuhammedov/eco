import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import CRC32 from 'crc-32'
import { ozdst1106 } from './ozdst1106'
import { getMobileSign, getMobileStatus, verifyMobileDocument } from '../api/mobile-imzo'
import { convertPdfToBase64 } from './index'

interface UseMobileDocumentSigningProps {
  documentUrl: string
  onSuccess?: (result: any) => void
}

const POLL_INTERVAL_MS = 5000
const POLL_LIMIT = 24

const STATUS_SIGNED = 1
const STATUS_PENDING = 2

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

const hexToBytes = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2)

  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }

  return bytes
}

const base64ToBytes = (base64: string) => {
  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

const buildQrCode = (siteId: string, documentId: string, documentBase64: string) => {
  const hash = bytesToHex(ozdst1106(base64ToBytes(documentBase64)))
  const body = (siteId + documentId + hash).toUpperCase()
  const crc = (CRC32.buf(hexToBytes(body)) >>> 0).toString(16).toUpperCase().padStart(8, '0')

  return body + crc
}

const extractPkcs7 = (payload: any): string | undefined => {
  const value = payload?.pkcs7Attached || payload?.pkcs7b64 || payload?.pkcs7 || payload?.pkcs7Info?.documentBase64

  return typeof value === 'string' ? value.replace(/\s/g, '') : undefined
}

export function useMobileDocumentSigning({ documentUrl, onSuccess }: UseMobileDocumentSigningProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [deepLink, setDeepLink] = useState<string | null>(null)
  const [didRedirect, setDidRedirect] = useState(false)
  const [isPolling, setIsPolling] = useState(false)

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollRef = useRef<(() => Promise<void>) | null>(null)
  /**
   * The signed document is handed out once and then dropped by the E-IMZO server.
   * This guard makes sure only one poll cycle ever reaches the verify call.
   */
  const isSettledRef = useRef(false)

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }

    setIsPolling(false)
  }, [])

  useEffect(() => stopPolling, [stopPolling])

  // Coming back from the E-IMZO app should show the result at once, not after the next tick.
  useEffect(() => {
    const checkOnReturn = () => {
      if (document.visibilityState !== 'visible' || !pollRef.current || isSettledRef.current) return

      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
      void pollRef.current()
    }

    document.addEventListener('visibilitychange', checkOnReturn)

    return () => document.removeEventListener('visibilitychange', checkOnReturn)
  }, [])

  useEffect(() => {
    if (deepLink && !didRedirect) {
      window.location.href = deepLink
      setDidRedirect(true)
    }
  }, [deepLink, didRedirect])

  const settle = useCallback(
    (pkcs7?: string, errorMessage?: string) => {
      if (isSettledRef.current) return

      isSettledRef.current = true
      pollRef.current = null
      stopPolling()
      setIsSigning(false)

      if (pkcs7) onSuccess?.(pkcs7)
      else if (errorMessage) toast.error(errorMessage)
    },
    [onSuccess, stopPolling]
  )

  const startSigning = useCallback(async () => {
    if (isSigning || isStarting) return

    try {
      isSettledRef.current = false
      setDidRedirect(false)
      setIsStarting(true)
      setIsSigning(true)
      setIsPolling(false)

      const documentBase64 = await convertPdfToBase64(documentUrl)

      if (!documentBase64) {
        toast.error('Hujjatni qayta ishlashda xatolik yuz berdi')
        setIsStarting(false)
        setIsSigning(false)
        return
      }

      const { documentId, siteId } = await getMobileSign()

      if (!documentId || !siteId) {
        toast.error('Imzolash seansini boshlashda xatolik yuz berdi')
        setIsStarting(false)
        setIsSigning(false)
        return
      }

      const qrCode = buildQrCode(siteId, documentId, documentBase64)

      setQrCodeData(qrCode)
      setDeepLink(`eimzo://sign?qc=${qrCode}`)
      setIsStarting(false)
      setIsPolling(true)

      let attempts = 0

      // Self-scheduling instead of setInterval: a slow request can never overlap the next tick.
      const poll = async () => {
        if (isSettledRef.current) return

        attempts++

        if (attempts > POLL_LIMIT) {
          settle(undefined, 'Kutish vaqti tugadi. Qaytadan urinib ko‘ring')
          return
        }

        let status: number | undefined

        try {
          status = (await getMobileStatus(documentId))?.status
        } catch {
          // A single failed status check is not fatal; the next tick retries.
        }

        if (isSettledRef.current) return

        if (status === STATUS_SIGNED) {
          // Claim the result before awaiting, so no second request can be issued.
          isSettledRef.current = true
          stopPolling()

          try {
            const pkcs7 = extractPkcs7(await verifyMobileDocument(documentId, documentBase64))

            setIsSigning(false)

            if (pkcs7) onSuccess?.(pkcs7)
            else toast.error('Imzo olinmadi. Iltimos, qaytadan urinib ko‘ring')
          } catch (error: any) {
            const message: string = error?.message || ''

            setIsSigning(false)
            toast.error(
              /not found/i.test(message)
                ? 'Imzolash seansi muddati tugagan. Iltimos, qaytadan urinib ko‘ring'
                : message || 'Hujjatni imzolashda server xatoligi'
            )
          }

          return
        }

        if (status !== undefined && status !== STATUS_PENDING) {
          settle(undefined, 'Imzolash bekor qilindi yoki xatolik yuz berdi')
          return
        }

        pollTimerRef.current = setTimeout(() => void poll(), POLL_INTERVAL_MS)
      }

      pollRef.current = poll
      pollTimerRef.current = setTimeout(() => void poll(), POLL_INTERVAL_MS)
    } catch (error: any) {
      toast.error(error?.message || 'Mobil imzolashda xatolik yuz berdi')
      setIsStarting(false)
      setIsSigning(false)
    }
  }, [documentUrl, isSigning, isStarting, onSuccess, settle, stopPolling])

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
