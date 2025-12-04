import { QRCodeSVG } from 'qrcode.react'
import { getDate } from '@/shared/utils/date.ts'

// Komponent qabul qiladigan ma'lumotlar uchun interfeys
interface PrintableQrStickerProps {
  data: {
    registrationDate?: string | Date
    registryNumber?: string
    ownerIdentity?: string // STIR
    detailUrl: string
  }
}

export const PrintableQrSticker = ({ data }: PrintableQrStickerProps) => {
  const formattedDate = data.registrationDate
    ? data.registrationDate instanceof Date
      ? data.registrationDate.toISOString().split('T')[0]
      : String(data.registrationDate).split('T')[0]
    : undefined

  return (
    // Bu `div` chop etish uchun mo'ljallangan
    <div
      className="flex items-center justify-start gap-4 border border-dashed border-gray-400 p-2"
      style={{ width: '100mm', height: '40mm' }}
    >
      <div className="flex-shrink-0">
        <QRCodeSVG value={data.detailUrl} size={120} level="H" />
      </div>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Hisobga olish sanasi:</strong> {getDate(formattedDate)}
        </p>
        <p>
          <strong>Hisobga olish raqami:</strong> {data.registryNumber || '-'}
        </p>
        <p>
          <strong>Tashkilot STIR:</strong> {data.ownerIdentity || '-'}
        </p>
      </div>
    </div>
  )
}
