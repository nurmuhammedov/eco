import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { useMutation } from '@tanstack/react-query'
import { SignatureClient, SignatureKey } from '@/shared/types/signature'
import { convertPdfToBase64 } from '@/shared/components/common/signature/model'
import { getTimeStamp } from '@/shared/components/common/signature/api/get-time-stamp'

interface SignDocumentParams {
  documentUrl: string
  Client: SignatureClient
  signature: SignatureKey | string | null
  onSuccess?: (result: any) => void
}

export function useDocumentSigning() {
  return useMutation({
    mutationFn: signDocumentWithMetadata,
    onSuccess: (result, variables) => {
      if (variables.onSuccess) {
        variables.onSuccess(result)
      }
    },
    onError: (error) => {
      console.error('Imzolash xatoligi:', error)
    },
  })
}

export const signDocumentWithMetadata = async ({ Client, signature, documentUrl = '' }: SignDocumentParams) => {
  try {
    if (!signature) {
      toast.error('Imzolash kaliti topilmadi!')
      return false
    }

    let keyId

    if (signature !== 'ckc') {
      const keyResponse = await Client.loadKey(signature as unknown as SignatureKey).catch(() => {
        toast.error('Kiritilgan parol noto‘g‘ri!', { richColors: true })
      })
      keyId = keyResponse?.id
    } else {
      keyId = 'ckc'
    }

    if (!keyId) {
      return false
    }

    const documentBase64 = await convertPdfToBase64(documentUrl)
    if (!documentBase64) {
      toast.error('Hujjat ustida ishlashda xatolik!')
      return false
    }

    const pkcs7Signature = await Client.createPkcs7(keyId, documentBase64)
    if (!pkcs7Signature) {
      toast.error('Hujjat imzolashda xatolik!')
      return false
    }

    const timestampResponse = await getTimeStamp({ sign: pkcs7Signature })
    const { pkcs7b64, status } = timestampResponse

    if (status !== '1' || !pkcs7b64) {
      toast.error('Vaqt belgisi olishda xatolik!')
      return false
    }

    const signatureResponse = await apiClient.post('/e-imzo/attached', { sign: pkcs7b64 })

    if (signatureResponse.status !== 200) {
      toast.error('Imzo serverda yuborishda xatolik!')
      return false
    }

    return pkcs7b64
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Imzolash bilan bog‘liq xatolik!')
    return false
  }
}
