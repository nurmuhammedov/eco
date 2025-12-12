import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { getDate } from '@/shared/utils/date'

interface PdfData {
  registryNumber?: string
  ownerName?: string
  registrationDate?: string
  attractionName?: string
  qrCodeDataUrl: string
}

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Roboto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  a5Section: {
    width: '100%',
    height: '100%',
    padding: 20,
    border: '1px solid #EAEAEA',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textWrapper: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    marginBottom: 8,
    borderBottom: '1px dotted #CCCCCC',
    paddingBottom: 4,
  },
  infoLabel: {},
  infoValue: {
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '60%',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
})

const noHyphenate = (word: string) => [word]

export const EquipmentPdfDocument = ({ data }: { data: PdfData }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.a5Section}>
        <View style={styles.textWrapper}>
          <Text hyphenationCallback={noHyphenate} style={styles.headerText}>
            O‘zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi
          </Text>
          <Text style={styles.title}>Batafsil ma’lumot va murojaat yuborish uchun quyidagi QR kodni skanerlang</Text>
        </View>

        <Image style={styles.qrCode} src={data.qrCodeDataUrl} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ro‘yxatga olingan sana:</Text>
            <Text style={styles.infoValue}>{getDate(data.registrationDate) || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ro‘yxatga olingan raqam:</Text>
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
)
