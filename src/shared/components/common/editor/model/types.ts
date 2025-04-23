export interface TinyMCEEditorProps {
  // Core props
  id?: string;
  apiKey?: string;
  initialValue?: string;
  value?: string;
  onChange?: (content: string, editor: any) => void;
  onInit?: (editor: any) => void;
  onBlur?: (event: any, editor: any) => void;
  onFocus?: (event: any, editor: any) => void;
  onSave?: (content: string, editor: any) => void;

  // Appearance props
  height?: number | string;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
  darkMode?: boolean;

  // Editor configuration
  toolbar?: string | string[];
  plugins?: string[];
  menubar?: boolean | string;
  contentCss?: string | string[];
  contentStyle?: string;

  // Border style props
  borderStyle?: 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';
  borderColor?: string;

  // Advanced props
  browserSpellcheck?: boolean;
  tinymceScriptSrc?: string;
  imageUploadHandler?: (blobInfo: any, progress: any) => Promise<string>;
  filePickerCallback?: (callback: any, value: string, meta: any) => void;
  pastePreprocess?: (plugin: any, args: any) => void;
  pastePostprocess?: (plugin: any, args: any) => void;
  language?: string;
  languageUrl?: string;
  autosaveInterval?: number;
  templates?: Array<{ title: string; description: string; content: string }>;
  formats?: Record<string, any>;
  allowPasteFromWord?: boolean;
  pasteAsText?: boolean;
  autoresize?: boolean;
  autoresizeMinHeight?: number;
  autoresizeMaxHeight?: number;
  lazyLoad?: boolean;
  touchEnabled?: boolean;
  relativeUrls?: boolean;
  removeScriptHost?: boolean;
  convertUrls?: boolean;
  imageAdvtab?: boolean;
  automaticUploads?: boolean;
  wordcount?: boolean;
  quickbars?: boolean;
  quickbarsSelectionToolbar?: string;
  setup?: (editor: any) => void;
}

export interface TinyMCEEditorRef {
  // Core methods
  getEditor: () => any;
  getContent: (args?: any) => string;
  setContent: (content: string) => void;
  insertContent: (content: string) => void;

  // Editor state methods
  focus: () => void;
  blur: () => void;
  save: () => void;
  isDirty: () => boolean;
  resetDirty: () => void;

  // Visibility methods
  enable: () => void;
  disable: () => void;
  show: () => void;
  hide: () => void;

  // Selection methods
  getSelectedContent: () => string;

  // Border methods
  setBorderStyle: (style: TinyMCEEditorProps['borderStyle'], color?: string) => void;
}

export interface A4EditorProps {
  /**
   * TinyMCE API key
   */
  apiKey: string;

  /**
   * Dastlabki hujjat mazmuni
   */
  initialValue?: string;

  /**
   * Kontent o'zgarganda ishlaydi
   */
  onEditorChange?: (content: string, editor: any) => void;

  /**
   * Saqlash tugmasi bosilganda ishlaydi
   */
  onSave?: (content: string, editor: any) => void;

  /**
   * Faqat o'qish rejimi
   */
  readOnly?: boolean;

  /**
   * Sahifani avtomatik ravishda o'lchamini o'zgartirish
   */
  autoResize?: boolean;

  /**
   * Rasmlarni yuklash uchun funkciya
   */
  imageUploadHandler?: (blobInfo: any, progress: any) => Promise<string>;

  /**
   * Sahifa chegarasi (sahifa ramkasi) ko'rinishi
   */
  pageBorder?: 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';

  /**
   * Sahifa chegarasi (ramka) rangi
   */
  pageBorderColor?: string;

  /**
   * Sahifaning tepasidagi joy (mm)
   */
  marginTop?: number;

  /**
   * Sahifaning pastidagi joy (mm)
   */
  marginBottom?: number;

  /**
   * Sahifaning chapidagi joy (mm)
   */
  marginLeft?: number;

  /**
   * Sahifaning o'ngidagi joy (mm)
   */
  marginRight?: number;

  /**
   * Qo'shimcha CSS klassi
   */
  className?: string;

  /**
   * TinyMCE skript manzili (self-host qilish uchun)
   */
  tinymceScriptSrc?: string;

  /**
   * Interfeys tili
   */
  language?: string;

  /**
   * Qo'shimcha toolbar opsiyalari
   */
  toolbar?: string;

  /**
   * Qo'shimcha pluginlar
   */
  plugins?: string[];
}

export interface A4EditorRef {
  /**
   * Editor obyekti
   */
  getEditor: () => any;

  /**
   * Contentni olish
   */
  getContent: (format?: string) => string;

  /**
   * Contentni o'rnatish
   */
  setContent: (content: string) => void;

  /**
   * PDF sifatida saqlash
   */
  exportToPdf: () => void;

  /**
   * Hujjatni chop etish
   */
  print: () => void;
}
