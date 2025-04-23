import { A4EditorRef } from '@/shared/components/common/editor';
import { useRef } from 'react';
import A4DocumentEditor from '@/shared/components/common/editor/ui/a4editor.tsx';

const DocumentCreator = () => {
  const editorRef = useRef<A4EditorRef>(null);

  const handleSave = (content: string) => {
    // Hujjatni saqlash logikasi
    console.log('Saving document:', content);
  };

  const handleImageUpload = async (blobInfo: any, progress: any) => {
    // Rasm yuklash logikasi
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blobInfo.blob());
      }, 2000);
    });
  };

  const handlePrint = () => {
    editorRef.current?.print();
  };

  const handleExportPdf = () => {
    editorRef.current?.exportToPdf();
  };

  return (
    <div className="document-creator">
      <div className="document-toolbar">
        <button onClick={handlePrint}>Print</button>
        <button onClick={handleExportPdf}>Export to PDF</button>
      </div>

      <A4DocumentEditor
        ref={editorRef}
        apiKey="i2gzr3l3xi13o8ja2ssqch7jlrlau3xokciwv3x4it8t6u56"
        initialValue="<h1>My A4 Document</h1><p>This is a document in A4 format.</p>"
        onSave={handleSave}
        imageUploadHandler={handleImageUpload}
        pageBorder="thin"
        pageBorderColor="#000000"
      />
    </div>
  );
};

export default DocumentCreator;
