import { PDFViewer } from '@/features/view-pdf';

export default function Index() {
  return (
    <div className="mx-auto">
      <PDFViewer
        url="https://ekotizim.technocorp.uz/files/registry-files/2025/april/28/1745819738102.pdf"
        title={'title'}
      />
    </div>
  );
}
