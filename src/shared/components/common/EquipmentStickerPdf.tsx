import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { getDate } from '@/shared/utils/date'

interface StickerData {
  registryNumber?: string
  registrationDate?: string
  ownerName?: string
  attractionName?: string
  qrCodeDataUrl: string
}

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' }],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
    width: 378,
    height: 151,
    fontFamily: 'Roboto',
  },
  qrSection: {
    width: '35%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  qrCode: {
    width: 114,
    height: 114,
  },
  infoSection: {
    width: '65%',
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
    color: '#333',
  },
  infoValue: {
    color: '#000',
  },
})

export const EquipmentStickerPdf = ({ data }: { data: StickerData }) => (
  <Document>
    <Page size={[378, 151]} style={styles.page}>
      <View style={styles.qrSection}>
        <Image style={styles.qrCode} src={data.qrCodeDataUrl} />
      </View>

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
)
