import { toast } from 'sonner';
import { axiosInstance } from '@/shared/api';
import { AxiosError, AxiosRequestConfig } from 'axios';

export async function getBase64FromPdfUrl(
  pdfUrl: string,
  options?: {
    timeout?: number;
    showLogs?: boolean;
  },
): Promise<string | null> {
  const timeout = options?.timeout || 30000;
  const showLogs = options?.showLogs || false;

  try {
    const config: AxiosRequestConfig = {
      timeout,
      responseType: 'arraybuffer',
      headers: { Accept: 'application/pdf, application/octet-stream' },
    };

    if (showLogs) {
      console.log(`PDF yuklanmoqda: ${pdfUrl}`);
    }

    // PDF faylini yuklash
    const response = await axiosInstance.get(pdfUrl, config);

    // Response statusi tekshirish
    if (response.status !== 200) {
      console.error(`Server xatosi: ${response.status} ${response.statusText}`);
      return null;
    }

    // Response data validatsiyasi
    if (
      !response.data ||
      !(response.data instanceof ArrayBuffer || (typeof response.data === 'object' && 'byteLength' in response.data))
    ) {
      console.error(`PDF ma'lumotlari noto'g'ri formatda:`, typeof response.data);
      return null;
    }

    if (showLogs) {
      console.log(`PDF yuklandi (${response.data.byteLength} bayt)`);
    }

    // Base64 ga o'girish
    let base64: string;

    // Node.js muhitida
    if (typeof Buffer !== 'undefined') {
      base64 = Buffer.from(response.data).toString('base64');
    }

    // Browser muhitida
    else {
      const uint8Array = new Uint8Array(response.data);
      const chunkSize = 16384; // ~16KB
      let binaryString = '';

      // Katta fayllarni qismlar bo'yicha ishlash
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, Math.min(i + chunkSize, uint8Array.length));
        binaryString += String.fromCharCode.apply(null, Array.from(chunk));
      }
      base64 = btoa(binaryString);
    }

    if (showLogs) {
      console.log(`PDF base64 formatiga o'girildi (${base64.length} belgi)`);
    }

    return base64;
  } catch (error) {
    // Xatolikni boshqarish
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        toast.error(axiosError.message);
        // Server javob qaytardi, lekin status kod 2xx emas
        console.error(`Server xatosi (${axiosError.response.status}): ${axiosError.message}`);
      } else if (axiosError.request) {
        // So'rov yuborildi, lekin javob qaytmadi
        toast.error(axiosError.message);
        console.error(`Tarmoq xatosi: ${axiosError.message}`);
      } else {
        // So'rovni o'rnatishda xatolik
        console.error(`So'rovni yaratishda xatolik: ${axiosError.message}`);
      }
    } else {
      // Boshqa turdagi xatoliklar
      console.error(`PDF konvertatsiya xatoligi:`, error);
    }

    return null;
  }
}
