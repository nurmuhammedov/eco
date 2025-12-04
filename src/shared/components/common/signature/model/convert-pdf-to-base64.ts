import { toast } from 'sonner'
import { axiosInstance } from '@/shared/api'
import { AxiosError, AxiosRequestConfig } from 'axios'

export async function convertPdfToBase64(pdfUrl: string): Promise<string | null> {
  try {
    const config: AxiosRequestConfig = {
      responseType: 'arraybuffer',
      headers: { Accept: 'application/pdf, application/octet-stream' },
    }

    const response = await axiosInstance.get(pdfUrl, config)

    if (response.status !== 200) {
      console.error(`Server xatosi: ${response.status} ${response.statusText}`)
      return null
    }

    if (
      !response.data ||
      !(response.data instanceof ArrayBuffer || (typeof response.data === 'object' && 'byteLength' in response.data))
    ) {
      console.error(`PDF ma'lumotlari noto'g'ri formatda:`, typeof response.data)
      return null
    }

    let base64: string

    // Node.js environment
    if (typeof Buffer !== 'undefined') {
      base64 = Buffer.from(response.data).toString('base64')
    }

    // Browser environment
    else {
      const uint8Array = new Uint8Array(response.data)
      const chunkSize = 16384 // ~16KB
      let binaryString = ''

      // Processing large files by parts
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, Math.min(i + chunkSize, uint8Array.length))
        binaryString += String.fromCharCode.apply(null, Array.from(chunk))
      }
      base64 = btoa(binaryString)
    }

    return base64
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError

      if (axiosError.response) {
        toast.error(axiosError.message)
      } else if (axiosError.request) {
        toast.error(axiosError.message)
      }
    } else {
      console.error(`PDF konvertatsiya xatoligi:`, error)
    }

    return null
  }
}
