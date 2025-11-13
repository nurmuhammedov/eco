import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { getDate } from '@/shared/utils/date';

interface PdfData {
  registryNumber?: string;
  ownerName?: string;
  registrationDate?: string;
  attractionName?: string;
  qrCodeDataUrl: string;
}

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' }, // public papkasidagi faylga to'g'ridan-to'g'ri yo'l
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    // 2. Butun hujjat uchun asosiy shriftni belgilash
    fontFamily: 'Roboto',
  },
  a5Section: {
    width: '50%',
    height: '100%',
    padding: 20,
    border: '1px solid #EAEAEA',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold', // Bu Roboto-Bold shriftini ishlatadi
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    marginBottom: 8,
    borderBottom: '1px dotted #CCCCCC',
    paddingBottom: 4,
  },
  infoLabel: {
    // Qo'shimcha shrift belgilash shart emas, `page` stilidan meros oladi
  },
  infoValue: {
    fontWeight: 'bold', // Bu ham Roboto-Bold shriftini ishlatadi
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
});
const noHyphenate = (word: string) => [word];
export const EquipmentPdfDocument = ({ data }: { data: PdfData }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* 1-chi A5 qismi */}
      <View style={styles.a5Section}>
        <Text hyphenationCallback={noHyphenate} style={styles.headerText}>
          O'zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Sanoat, radiatsiya va yadro xavfsizligi qo'mitasi
        </Text>
        <Text style={styles.title}>Batafsil ma'lumot va murojaat yuborish uchun quyidagi QR kodni skanerlang</Text>
        <Image style={styles.qrCode} src={data.qrCodeDataUrl} />
        <View style={styles.infoContainer}>
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
      </View>
      {/* 2-chi A5 qismi */}
      <View style={styles.a5Section}>
        <Text hyphenationCallback={noHyphenate} style={styles.headerText}>
          O'zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Sanoat, radiatsiya va yadro xavfsizligi qo'mitasi
        </Text>
        <Text style={styles.title}>Batafsil ma'lumot va murojaat yuborish uchun quyidagi QR kodni skanerlang</Text>
        <Image style={styles.qrCode} src={data.qrCodeDataUrl} />
        <View style={styles.infoContainer}>
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
      </View>
    </Page>
  </Document>
);
