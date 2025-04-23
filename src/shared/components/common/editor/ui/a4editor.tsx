import { Editor } from '@tinymce/tinymce-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { A4EditorProps, A4EditorRef } from '../model/types';
import './document-preview.css';

const getBorderStyle = (borderType: string): string => {
  switch (borderType) {
    case 'thin':
      return '1px solid';
    case 'medium':
      return '2px solid';
    case 'thick':
      return '3px solid';
    case 'double':
      return '4px double';
    case 'dashed':
      return '2px dashed';
    case 'dotted':
      return '2px dotted';
    case 'none':
    default:
      return 'none';
  }
};

const A4DocumentEditor = forwardRef<A4EditorRef, A4EditorProps>((props, ref) => {
  const {
    apiKey,
    initialValue = '',
    onEditorChange,
    onSave,
    readOnly = false,
    autoResize = true,
    imageUploadHandler,
    pageBorder = 'none',
    pageBorderColor = '#000000',
    marginTop = 25,
    marginBottom = 25,
    marginLeft = 25,
    marginRight = 25,
    className = '',
    tinymceScriptSrc,
    language,
    toolbar,
    plugins = [],
  } = props;

  const editorRef = useRef<any>(null);
  const [printMode, setPrintMode] = useState(false);

  // Editor ref orqali metodlarni ochib berish
  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,

    getContent: (format = 'html') => {
      if (!editorRef.current) return '';
      return editorRef.current.getContent({ format });
    },

    setContent: (content: string) => {
      if (!editorRef.current) return;
      editorRef.current.setContent(content);
    },

    exportToPdf: () => {
      if (!editorRef.current) return;
      // Bu yerda PDF export qilish logikasi bo'lishi mumkin
      // Oddiy holatlarda bu browser print dialogini ochadi
      window.print();
    },

    print: () => {
      if (!editorRef.current) return;
      setPrintMode(true);
      setTimeout(() => {
        window.print();
        setPrintMode(false);
      }, 300);
    },
  }));

  // Editor o'rnatilganda ishlaydi
  const handleEditorInit = (evt: any, editor: any) => {
    editorRef.current = editor;
  };

  // A4 sahifa uchun CSS
  const a4PageCss = `
    /* Print rejimida sahifa ko'rinishi */
    @page {
      size: A4;
      margin: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm;
    }
    
    /* Normal rejim */
    body {
      background-color: #f0f0f0;
      padding: 30px;
      margin: 0;
      box-sizing: border-box;
    }
    
    .mce-content-body {
      /* A4 formati - 210x297 mm */
      width: 210mm;
      min-height: 297mm;
      padding: ${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm;
      margin: 0 auto;
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      border: ${getBorderStyle(pageBorder)} ${pageBorderColor};
    }
    
    /* Sahifa bo'linishi */
    .mce-pagebreak {
      page-break-before: always;
      page-break-after: always;
      border: none;
      display: block;
      border-top: 2px dashed #999;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    
    /* Print rejimida olib tashlash kerak bo'lgan elementlar */
    @media print {
      body {
        background-color: white;
        padding: 0;
      }
      
      .mce-content-body {
        box-shadow: none;
        width: 100%;
        min-height: auto;
        padding: 0;
      }
      
      .mce-pagebreak {
        border: none;
        margin: 0;
      }
    }
    
    /* Jadval checkered sifatida ko'rinishi */
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 10px;
    }
    
    table td, table th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    
    /* Paragraph stillari */
    p {
      margin: 0 0 10px 0;
    }
    
    /* Sarlavha stillari */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  `;

  // TinyMCE uchun standart pluginlar
  const defaultPlugins = [
    'advlist',
    'autolink',
    'lists',
    'link',
    'image',
    'charmap',
    'searchreplace',
    'code',
    'fullscreen',
    'table',
    'pagebreak',
    'insertdatetime',
    'media',
    'print',
    'preview',
    'hr',
    'directionality',
    'visualchars',
    'nonbreaking',
    'quickbars',
  ];

  // Pluginlarni birlashtirish
  const mergedPlugins = [...new Set([...defaultPlugins, ...plugins])];

  // Standart toolbar
  const defaultToolbar =
    'undo redo | formatselect | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | table link image media pagebreak | print preview help';

  // Editor konfiguratsiyasi
  const editorConfig = {
    height: autoResize ? 842 : 842, // A4 balandligi pikselda (297mm)
    min_height: 500,
    max_height: autoResize ? 2000 : 842,
    width: '100%',
    plugins: mergedPlugins.join(' '),
    toolbar: toolbar || defaultToolbar,
    menubar: 'file edit view insert format tools table help',
    content_style: a4PageCss,
    readonly: readOnly,
    branding: false,
    resize: false,
    browser_spellcheck: true,
    entity_encoding: 'raw',
    language: language,

    // Sahifa rejimi
    pagebreak_separator: '<div class="mce-pagebreak"></div>',
    pagebreak_split_block: true,

    // Print related
    print_with_body_styles: true,

    // Kontent sozlamalari
    content_css: 'default',

    // Rasm yuklash uchun
    images_upload_handler: imageUploadHandler,
    automatic_uploads: !!imageUploadHandler,
    autoresize_bottom_margin: 500,
    autoresize_min_height: 500,
    autoresize_max_height: 800,

    // Setup function to add custom buttons
    setup: function (editor: any) {
      // Page border selector button
      editor.ui.registry.addMenuButton('pageborder', {
        text: 'Page Border',
        tooltip: 'Set page border',
        fetch: function (callback: any) {
          const items = [
            {
              type: 'menuitem',
              text: 'None',
              onAction: function () {
                const style = editor.dom.getAttrib(editor.getBody(), 'style') || '';
                editor.dom.setAttrib(editor.getBody(), 'style', style.replace(/border:[^;]+;?/g, '') + 'border: none;');
              },
            },
            {
              type: 'menuitem',
              text: 'Thin',
              onAction: function () {
                const style = editor.dom.getAttrib(editor.getBody(), 'style') || '';
                editor.dom.setAttrib(
                  editor.getBody(),
                  'style',
                  style.replace(/border:[^;]+;?/g, '') + 'border: 1px solid #000;',
                );
              },
            },
            {
              type: 'menuitem',
              text: 'Medium',
              onAction: function () {
                const style = editor.dom.getAttrib(editor.getBody(), 'style') || '';
                editor.dom.setAttrib(
                  editor.getBody(),
                  'style',
                  style.replace(/border:[^;]+;?/g, '') + 'border: 2px solid #000;',
                );
              },
            },
            {
              type: 'menuitem',
              text: 'Thick',
              onAction: function () {
                const style = editor.dom.getAttrib(editor.getBody(), 'style') || '';
                editor.dom.setAttrib(
                  editor.getBody(),
                  'style',
                  style.replace(/border:[^;]+;?/g, '') + 'border: 3px solid #000;',
                );
              },
            },
            {
              type: 'menuitem',
              text: 'Double',
              onAction: function () {
                const style = editor.dom.getAttrib(editor.getBody(), 'style') || '';
                editor.dom.setAttrib(
                  editor.getBody(),
                  'style',
                  style.replace(/border:[^;]+;?/g, '') + 'border: 4px double #000;',
                );
              },
            },
            {
              type: 'menuitem',
              text: 'Dashed',
              onAction: function () {
                const style = editor.dom.getAttrib(editor.getBody(), 'style') || '';
                editor.dom.setAttrib(
                  editor.getBody(),
                  'style',
                  style.replace(/border:[^;]+;?/g, '') + 'border: 2px dashed #000;',
                );
              },
            },
            {
              type: 'menuitem',
              text: 'Dotted',
              onAction: function () {
                const style = editor.dom.getAttrib(editor.getBody(), 'style') || '';
                editor.dom.setAttrib(
                  editor.getBody(),
                  'style',
                  style.replace(/border:[^;]+;?/g, '') + 'border: 2px dotted #000;',
                );
              },
            },
          ];
          callback(items);
        },
      });

      // Save handler
      if (onSave) {
        editor.on('save', (e: any) => {
          e.preventDefault();
          onSave(editor.getContent(), editor);
          return false;
        });
      }
    },
  };

  return (
    <div className={`a4-document-editor ${className} ${printMode ? 'print-mode' : ''}`}>
      <Editor
        apiKey={apiKey}
        onInit={handleEditorInit}
        initialValue={initialValue}
        onEditorChange={onEditorChange}
        init={editorConfig}
        disabled={readOnly}
        tinymceScriptSrc={tinymceScriptSrc}
      />
    </div>
  );
});

A4DocumentEditor.displayName = 'A4DocumentEditor';

export default A4DocumentEditor;
