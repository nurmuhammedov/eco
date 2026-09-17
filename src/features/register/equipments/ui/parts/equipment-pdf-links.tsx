import { PDFDownloadLink } from '@react-pdf/renderer'
import DetailRow from '@/shared/components/common/detail-row'
import { EquipmentPdfDocument } from '@/shared/components/common/equipment-pdf-document'
import { EquipmentStickerPdf } from '@/shared/components/common/equipment-sticker-pdf'

interface EquipmentPdfData {
  ownerName?: string
  registryNumber?: string
  registrationDate?: string
  attractionName?: string
  qrCodeDataUrl: string
}

const linkLabel = (label: string, { loading }: { loading: boolean }) =>
  loading ? 'Tayyorlanmoqda...' : <span className="cursor-pointer text-blue-400 hover:underline">{label}</span>

/**
 * Kept apart so the page can load it on its own: `@react-pdf/renderer` is the
 * heaviest library in the build, and importing it from the detail page meant
 * every visit downloaded it - including the visits that never print anything.
 */
export const EquipmentPdfLinks = ({ data }: { data: EquipmentPdfData }) => (
  <>
    <DetailRow
      title="QR Etiketka shaklida 100x40:"
      value={
        <PDFDownloadLink
          document={<EquipmentStickerPdf data={data} />}
          fileName={`etiketka-${data.registryNumber}.pdf`}
        >
          {(state) => linkLabel('Chop etish', state)}
        </PDFDownloadLink>
      }
    />

    <DetailRow
      title="PDF A5 formatida:"
      value={
        <PDFDownloadLink
          document={<EquipmentPdfDocument data={data} />}
          fileName={`passport-${data.registryNumber}.pdf`}
        >
          {(state) => linkLabel('Yuklab olish', state)}
        </PDFDownloadLink>
      }
    />
  </>
)

export default EquipmentPdfLinks
