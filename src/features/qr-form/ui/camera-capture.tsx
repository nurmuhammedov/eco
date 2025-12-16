import { useCallback, useEffect, useRef, useState } from 'react'
import { Aperture, Camera, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface CameraCaptureProps {
  onCapture: (file: File) => void
}

export const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [isCameraOpen, stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      setStream(mediaStream)
      setIsCameraOpen(true)
    } catch (error) {
      console.error('Kameraga kirishda xatolik:', error)
      alert('Kameraga ulanib bo‘lmadi. Qurilma sozlamalarini tekshiring.')
    }
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `photo-${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              onCapture(file)
              stopCamera()
            }
          },
          'image/jpeg',
          0.9
        )
      }
    }
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  if (!isCameraOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={startCamera}
        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 sm:w-auto"
      >
        <Camera className="mr-2 h-4 w-4" />
        Rasmga olish
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/90 p-4 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <h3 className="flex items-center text-lg font-medium text-slate-100">
            <Aperture className="mr-2 h-5 w-5 text-blue-400" />
            Kamera
          </h3>
          <button
            onClick={stopCamera}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-[3/4] w-full bg-slate-900 sm:aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
            <div className="border-r border-b border-white/30"></div>
            <div className="border-r border-b border-white/30"></div>
            <div className="border-b border-white/30"></div>
            <div className="border-r border-b border-white/30"></div>
            <div className="border-r border-b border-white/30"></div>
            <div className="border-b border-white/30"></div>
            <div className="border-r border-white/30"></div>
            <div className="border-r border-white/30"></div>
            <div></div>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center border-t border-slate-700 bg-slate-800 p-5">
          <div className="flex justify-start">
            <Button
              type="button"
              variant="ghost"
              onClick={stopCamera}
              className="text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Bekor qilish
            </Button>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCapture}
              className="group relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500/30 bg-transparent transition-all duration-200 active:scale-95"
              aria-label="Suratga olish"
            >
              <div className="h-12 w-12 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 transition-all duration-200 group-hover:bg-blue-400 group-active:h-10 group-active:w-10" />
            </button>
          </div>

          <div className="flex justify-end"></div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
