import { useEquipmentsDetail } from '@/features/register/equipments/hooks/use-equipments-detail.tsx'
import { PrintableQrSticker } from '@/shared/components/common/printable-qr-sticker/PrintableQrSticker.tsx'
import { useParams } from 'react-router-dom'
import { CSSProperties } from 'react'

const printPageStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  background: '#f0f2f5',
}

const EquipmentPrintPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading } = useEquipmentsDetail()

  if (isLoading || !data) {
    return <div style={printPageStyles}>Yuklanmoqda...</div>
  }

  const detailPageUrl = `${window.location.origin}/qr/${id}/equipments`

  return (
    <div style={printPageStyles}>
      <PrintableQrSticker
        data={{
          registrationDate: data.registrationDate,
          registryNumber: data.registryNumber,
          ownerIdentity: data.ownerIdentity,
          detailUrl: detailPageUrl,
        }}
      />
    </div>
  )
}

export default EquipmentPrintPage
