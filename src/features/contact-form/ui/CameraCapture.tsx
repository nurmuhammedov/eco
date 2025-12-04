// src/features/contact-form/ui/CameraCapture.tsx

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'

interface CameraCaptureProps {
  onCapture: (file: File) => void
}

export const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 1. Video oqimini `<video>` elementiga bog'lash uchun useEffect
  useEffect(() => {
    // Agar kamera ochiq bo'lsa, oqim mavjud bo'lsa va video elementi DOMda bo'lsa
    if (isCameraOpen && stream && videoRef.current) {
      // Oqimni video elementiga manba sifatida bog'laymiz
      videoRef.current.srcObject = stream
    }
  }, [isCameraOpen, stream]) // Bu effekt `isCameraOpen` yoki `stream` o'zgarganda ishlaydi

  // Kamera oqimini to'liq to'xtatish uchun yordamchi funksiya
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()) // Barcha oqimlarni to'xtatadi
      setStream(null)
      setIsCameraOpen(false)
    }
  }

  const startCamera = async () => {
    try {
      // 2. Orqa kamerani so'raymiz (`environment`)
      // Agar orqa kamera bo'lmasa, brauzer avtomatik mavjudini tanlaydi
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      })
      setStream(mediaStream)
      setIsCameraOpen(true)
    } catch (error) {
      console.error('Kameraga kirishda xatolik:', error)
      alert('Kameraga kirishga ruxsat berilmadi yoki qurilmada kamera mavjud emas.')
      setIsCameraOpen(false) // Xatolik bo'lsa, oynani yopamiz
    }
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas && video.readyState >= 2) {
      // Video kadrni ko'rsatishga tayyorligini tekshiramiz
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
            onCapture(capturedFile)
            stopCamera()
          }
        },
        'image/jpeg',
        0.9
      ) // 0.9 - rasm sifati
    }
  }

  // Komponent yo'q qilinganda (masalan, sahifadan o'tganda) kamerani o'chirish
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, []) // [] - faqat bir marta, komponent o'rnatilganda va yo'q qilinganda ishlaydi

  if (!isCameraOpen) {
    return (
      <Button type="button" variant="outline" onClick={startCamera}>
        Rasmga olish
      </Button>
    )
  }

  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-4">
      <div className="bg-card w-full max-w-lg rounded-lg p-4 shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline // iOS qurilmalarida to'liq ekranga o'tib ketmasligi uchun
          muted // `autoplay` ishlashi uchun kerak
          className="w-full rounded-md"
        />
        {/* Rasm chizish uchun yashirin canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="mt-4 flex justify-center space-x-4">
          <Button type="button" onClick={handleCapture} className="flex-grow">
            Suratga olish
          </Button>
          <Button type="button" variant="destructive" onClick={stopCamera} className="flex-grow">
            Bekor qilish
          </Button>
        </div>
      </div>
    </div>
  )
}
