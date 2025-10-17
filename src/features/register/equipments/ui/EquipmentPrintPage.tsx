import { useEquipmentsDetail } from '@/features/register/equipments/hooks/use-equipments-detail.tsx';
import { PrintableQrSticker } from '@/shared/components/common/printable-qr-sticker/PrintableQrSticker.tsx';

// Chop etish uchun maxsus stil
const printPageStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  background: '#f0f2f5', // Orqa fonni kulrang qilamiz, faqat stiker oq bo'ladi
};

const EquipmentPrintPage = () => {
  // URL'dan `id` parametrini olamiz. marshrut sozlamalariga mos bo'lishi kerak.

  // Ma'lumotlarni ID bo'yicha yuklaymiz.
  // Eslatma: `useEquipmentsDetail` ID'ni URL'dan o'zi oladigan bo'lsa, unga `id` yuborish shart emas.
  const { data, isLoading } = useEquipmentsDetail();

  if (isLoading || !data) {
    return <div style={printPageStyles}>Yuklanmoqda...</div>;
  }

  // QR kod ichida shifrlanadigan URL
  const detailPageUrl = `${window.location.origin}/equipments/detail/${data.id}`;

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
  );
};

export default EquipmentPrintPage;
