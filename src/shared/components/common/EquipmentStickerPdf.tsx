import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { getDate } from '@/shared/utils/date';

// Ma'lumotlar uchun tip
interface StickerData {
  registryNumber?: string;
  registrationDate?: string;
  ownerName?: string;
  attractionName?: string;
  qrCodeDataUrl: string;
}

// Stillar (millimetrni pikselga o'tkazish uchun taxminan ~3.78 koeffitsientidan foydalanamiz)
// 100mm ~ 378pt, 40mm ~ 151pt
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
    width: 378,
    height: 151,
  },
  qrSection: {
    width: '35%', // ~35mm
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  qrCode: {
    width: 114, // ~30mm
    height: 114,
  },
  infoSection: {
    width: '65%', // ~65mm
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 10,
    borderLeft: '1px dotted #999',
  },
  infoRow: {
    fontSize: 9,
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: 'Helvetica',
    color: '#333',
  },
  infoValue: {
    fontFamily: 'Helvetica-Bold',
    color: '#000',
  },
});

export const EquipmentStickerPdf = ({ data }: { data: StickerData }) => (
  <Document>
    {/* Sahifa: 100mm x 40mm */}
    <Page size={[378, 151]} style={styles.page}>
      {/* Chap taraf: QR Kod */}
      <View style={styles.qrSection}>
        <Image style={styles.qrCode} src={data.qrCodeDataUrl} />
      </View>

      {/* O'ng taraf: Ma'lumotlar */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ro'yxatga olingan sana:</Text>
          <Text style={styles.infoValue}>{getDate(data.registrationDate) || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ro'yxatga olingan raqam:</Text>
          <Text style={styles.infoValue}>{data.registryNumber || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tashkilot nomi:</Text>
          <Text style={styles.infoValue}>{data.ownerName || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Qurilma nomi:</Text>
          <Text style={styles.infoValue}>{data.attractionName || '-'}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
