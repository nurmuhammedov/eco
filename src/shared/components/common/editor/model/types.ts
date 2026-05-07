export type BorderStyleType = 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted'

export interface TinyMCEEditorProps {
  id?: string
  initialValue?: string
  value?: string
  onChange?: (content: string, editor: any) => void
  onInit?: (editor: any) => void
  onBlur?: (event: any, editor: any) => void
  onFocus?: (event: any, editor: any) => void
  onSave?: (content: string, editor: any) => void
  height?: number
  readOnly?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  inline?: boolean
  darkMode?: boolean
  toolbar?: string | string[]
  plugins?: string[]
  menubar?: boolean | string
  contentCss?: string
  contentStyle?: string
  borderStyle?: BorderStyleType
  borderColor?: string
  browserSpellcheck?: boolean
  imageUploadHandler?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>
  filePickerCallback?: (callback: any, value: any, meta: any) => void
  pastePreprocess?: (editor: any, args: any) => void
  pastePostprocess?: (editor: any, args: any) => void
  language?: string
  languageUrl?: string
  autosaveInterval?: number
  templates?: Array<{ title: string; description: string; content: string }>
  formats?: Record<string, any>
  allowPasteFromWord?: boolean
  pasteAsText?: boolean
  autoresize?: boolean
  autoresizeMinHeight?: number
  autoresizeMaxHeight?: number
  lazyLoad?: boolean
  touchEnabled?: boolean
  relativeUrls?: boolean
  removeScriptHost?: boolean
  convertUrls?: boolean
  imageAdvtab?: boolean
  automaticUploads?: boolean
  wordcount?: boolean
  quickbars?: boolean
  quickbarsSelectionToolbar?: string
  pageSize?: 'a4' | 'letter' | 'legal' | (string & {})
  orientation?: 'portrait' | 'landscape'
  pageMargin?: number
  customButtons?: Array<{
    name: string
    text: string
    icon?: string
    tooltip?: string
    onAction: (editor: any) => void
  }>
  customMenuItems?: Record<string, any>
  contextMenu?: boolean
  fontFormats?: string
  fontSizeFormats?: string
  lineHeightFormats?: string
  styleFormats?: any[]
  printWatermark?: boolean
  watermarkText?: string
  footerTemplate?: string
  headerTemplate?: string
  setup?: (editor: any) => void
  isPageLayout?: boolean
}

export interface TinyMCEEditorRef {
  getEditor: () => any
  getContent: (args?: Record<string, any>) => string
  setContent: (content: string) => void
  insertContent: (content: string) => void
  focus: () => void
  blur: () => void
  save: () => void
  isDirty: () => boolean
  resetDirty: () => void
  enable: () => void
  disable: () => void
  show: () => void
  hide: () => void
  getSelectedContent: () => string
  setBorderStyle?: (style: BorderStyleType, color?: string) => void
  createNewDocument?: () => void
  applyPageFormat: (format: string, orientation: 'portrait' | 'landscape', margin: number) => void
  setOrientation: (orientation: 'portrait' | 'landscape') => void
  setMargin: (margin: number) => void
  insertPageBreak?: () => void
  printPreview: () => void
  print?: () => void
  exportPDF: () => void
  exportDOCX?: () => void
  addHeader?: (content: string) => void
  addFooter?: (content: string) => void
  getPageCount?: () => number
  updatePageNumbers?: () => void
  addWatermark?: (text: string) => void
}
