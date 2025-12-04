// src/features/editor/model/types.ts

/**
 * Border style options for the TinyMCE editor
 */
export type BorderStyleType = 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted'

/**
 * A4 formatga moslashtirilgan TinyMCE editor props uchun yozilgan tiplar
 */
export interface TinyMCEEditorProps {
  /** Unique ID for the editor instance */
  id?: string

  /** Initial editor content */
  initialValue?: string

  /** Current editor content (controlled mode) */
  value?: string

  /** Callback when editor content changes */
  onChange?: (content: string, editor: any) => void

  /** Callback when editor is initialized */
  onInit?: (editor: any) => void

  /** Callback when editor loses focus */
  onBlur?: (event: any, editor: any) => void

  /** Callback when editor gains focus */
  onFocus?: (event: any, editor: any) => void

  /** Callback when editor content is saved */
  onSave?: (content: string, editor: any) => void

  /** Editor height in pixels */
  height?: number

  /** Read-only mode */
  readOnly?: boolean

  /** Disabled mode */
  disabled?: boolean

  /** Placeholder text when editor is empty */
  placeholder?: string

  /** Additional CSS classes for the editor container */
  className?: string

  /** Inline styles for the editor container */
  style?: React.CSSProperties

  /** Inline mode (toolbar appears on selection) */
  inline?: boolean

  /** Dark mode theme */
  darkMode?: boolean

  /** Custom toolbar configuration */
  toolbar?: string | string[]

  /** Custom plugins to load */
  plugins?: string[]

  /** Menu bar visibility or config */
  menubar?: boolean | string

  /** Custom content CSS to load */
  contentCss?: string

  /** Additional inline styles for the editor content */
  contentStyle?: string

  /** Border style for the editor content */
  borderStyle?: BorderStyleType

  /** Border color for the editor content */
  borderColor?: string

  /** Enable browser's native spellchecker */
  browserSpellcheck?: boolean

  /** Custom image upload handler */
  imageUploadHandler?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>

  /** Custom file picker callback */
  filePickerCallback?: (callback: any, value: any, meta: any) => void

  /** Paste preprocessing handler */
  pastePreprocess?: (editor: any, args: any) => void

  /** Paste postprocessing handler */
  pastePostprocess?: (editor: any, args: any) => void

  /** Editor UI language */
  language?: string

  /** Custom language URL */
  languageUrl?: string

  /** Autosave interval in milliseconds */
  autosaveInterval?: number

  /** Custom templates */
  templates?: Array<{ title: string; description: string; content: string }>

  /** Custom formats */
  formats?: Record<string, any>

  /** Allow paste from MS Word */
  allowPasteFromWord?: boolean

  /** Paste as plain text */
  pasteAsText?: boolean

  /** Enable auto-resize */
  autoresize?: boolean

  /** Minimum height for auto-resize */
  autoresizeMinHeight?: number

  /** Maximum height for auto-resize */
  autoresizeMaxHeight?: number

  /** Lazy load the TinyMCE script */
  lazyLoad?: boolean

  /** Enable touch device support */
  touchEnabled?: boolean

  /** Use relative URLs */
  relativeUrls?: boolean

  /** Remove script host from URLs */
  removeScriptHost?: boolean

  /** Convert URLs to specified format */
  convertUrls?: boolean

  /** Enable image advanced tab */
  imageAdvtab?: boolean

  /** Enable automatic uploads */
  automaticUploads?: boolean

  /** Show word count */
  wordcount?: boolean

  /** Enable quick formatting toolbar */
  quickbars?: boolean

  /** Custom quick selection toolbar */
  quickbarsSelectionToolbar?: string

  /** The page size for A4 format */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  pageSize?: 'a4' | 'letter' | 'legal' | string

  /** Page orientation */
  orientation?: 'portrait' | 'landscape'

  /** Page margins in millimeters */
  pageMargin?: number

  /** Custom buttons for adding to toolbar */
  customButtons?: Array<{
    name: string
    text: string
    icon?: string
    tooltip?: string
    onAction: (editor: any) => void
  }>

  /** Custom menu items */
  customMenuItems?: Record<string, any>

  /** Enable context menu */
  contextMenu?: boolean

  /** Custom font formats */
  fontFormats?: string

  /** Custom font size formats */
  fontSizeFormats?: string

  /** Custom line height formats */
  lineHeightFormats?: string

  /** Custom style formats */
  styleFormats?: any[]

  /** Enable watermark on printing */
  printWatermark?: boolean

  /** Watermark text for printing */
  watermarkText?: string

  /** Footer template for each page */
  footerTemplate?: string

  /** Header template for each page */
  headerTemplate?: string

  /** Setup function for custom advanced TinyMCE setup */
  setup?: (editor: any) => void
}

/**
 * TinyMCE editor ref interface, exposes editor methods
 * Enhanced for A4 format features
 */
export interface TinyMCEEditorRef {
  /** Get the underlying TinyMCE editor instance */
  getEditor: () => any

  /** Get editor content with optional arguments */
  getContent: (args?: Record<string, any>) => string

  /** Set editor content */
  setContent: (content: string) => void

  /** Insert content at current cursor position */
  insertContent: (content: string) => void

  /** Focus the editor */
  focus: () => void

  /** Remove focus from the editor */
  blur: () => void

  /** Save the editor content */
  save: () => void

  /** Check if editor content has changed */
  isDirty: () => boolean

  /** Reset the dirty state */
  resetDirty: () => void

  /** Enable the editor */
  enable: () => void

  /** Disable the editor (read-only mode) */
  disable: () => void

  /** Show the editor */
  show: () => void

  /** Hide the editor */
  hide: () => void

  /** Get selected content */
  getSelectedContent: () => string

  /** Set border style */
  setBorderStyle?: (style: BorderStyleType, color?: string) => void

  /** Create a new empty document */
  createNewDocument?: () => void

  /** Apply page format settings */
  applyPageFormat: (format: string, orientation: 'portrait' | 'landscape', margin: number) => void

  /** Set page orientation */
  setOrientation: (orientation: 'portrait' | 'landscape') => void

  /** Set page margins */
  setMargin: (margin: number) => void

  /** Insert page break at cursor position */
  insertPageBreak?: () => void

  /** Open print preview */
  printPreview: () => void

  /** Print the document directly */
  print?: () => void

  /** Export content as PDF */
  exportPDF: () => void

  /** Export content as Word document */
  exportDOCX?: () => void

  /** Add header to document */
  addHeader?: (content: string) => void

  /** Add footer to document */
  addFooter?: (content: string) => void

  /** Get page count in the document */
  getPageCount?: () => number

  /** Update all page numbers in the document */
  updatePageNumbers?: () => void

  /** Add watermark to all pages */
  addWatermark?: (text: string) => void
}
