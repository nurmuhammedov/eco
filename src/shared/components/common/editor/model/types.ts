// src/features/editor/model/types.ts

/**
 * Border style options for the TinyMCE editor
 */
export type BorderStyleType = 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';

/**
 * TinyMCE Editor component props
 * @tinymce/tinymce-react v6.1.0 uchun moslashtirilgan
 */
export interface TinyMCEEditorProps {
  /** Unique ID for the editor instance */
  id?: string;
  /** TinyMCE API key */
  apiKey?: string;
  /** Initial editor content (used for uncontrolled component mode) */
  initialValue?: string;
  /** Current editor content (used for controlled component mode) */
  value?: string;
  /** Callback when editor content changes */
  onChange?: (content: string, editor: any) => void;
  /** Callback when editor is initialized */
  onInit?: (editor: any) => void;
  /** Callback when editor loses focus */
  onBlur?: (event: any, editor: any) => void;
  /** Callback when editor gains focus */
  onFocus?: (event: any, editor: any) => void;
  /** Callback when editor content is saved */
  onSave?: (content: string, editor: any) => void;
  /** Editor height */
  height?: number | string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Disabled mode */
  disabled?: boolean;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Additional CSS classes for the editor container */
  className?: string;
  /** Inline styles for the editor container */
  style?: React.CSSProperties;
  /** Inline mode (toolbar appears on selection) */
  inline?: boolean;
  /** Dark mode theme */
  darkMode?: boolean;
  /** Custom toolbar configuration */
  toolbar?: string | string[];
  /** Custom plugins to load */
  plugins?: string[];
  /** Menu bar visibility or config */
  menubar?: boolean | string;
  /** Custom content CSS to load */
  contentCss?: string;
  /** Additional inline styles for the editor content */
  contentStyle?: string;
  /** Border style for the editor content */
  borderStyle?: BorderStyleType;
  /** Border color for the editor content */
  borderColor?: string;
  /** Enable browser's native spellchecker */
  browserSpellcheck?: boolean;
  /** Custom TinyMCE script source */
  tinymceScriptSrc?: string;
  /** Custom image upload handler */
  imageUploadHandler?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>;
  /** Custom file picker callback */
  filePickerCallback?: (callback: any, value: any, meta: any) => void;
  /** Paste preprocessing handler */
  pastePreprocess?: (editor: any, args: any) => void;
  /** Paste postprocessing handler */
  pastePostprocess?: (editor: any, args: any) => void;
  /** Editor UI language */
  language?: string;
  /** Custom language URL */
  languageUrl?: string;
  /** Autosave interval in milliseconds */
  autosaveInterval?: number;
  /** Custom templates */
  templates?: Array<{ title: string; description: string; content: string }>;
  /** Custom formats */
  formats?: Record<string, any>;
  /** Allow paste from MS Word */
  allowPasteFromWord?: boolean;
  /** Paste as plain text */
  pasteAsText?: boolean;
  /** Enable auto-resize */
  autoresize?: boolean;
  /** Minimum height for auto-resize */
  autoresizeMinHeight?: number;
  /** Maximum height for auto-resize */
  autoresizeMaxHeight?: number;
  /** Lazy load the TinyMCE script */
  lazyLoad?: boolean;
  /** Enable touch device support */
  touchEnabled?: boolean;
  /** Use relative URLs */
  relativeUrls?: boolean;
  /** Remove script host from URLs */
  removeScriptHost?: boolean;
  /** Convert URLs to specified format */
  convertUrls?: boolean;
  /** Enable image advanced tab */
  imageAdvtab?: boolean;
  /** Enable automatic uploads */
  automaticUploads?: boolean;
  /** Show word count */
  wordcount?: boolean;
  /** Enable quick formatting toolbar */
  quickbars?: boolean;
  /** Custom quick selection toolbar */
  quickbarsSelectionToolbar?: string;
  /** Setup function for advanced customization */
  setup?: (editor: any) => void;
}

/**
 * Ref interface for the TinyMCE editor component
 * Provides access to editor methods and functionality
 */
export interface TinyMCEEditorRef {
  /** Get the underlying TinyMCE editor instance */
  getEditor: () => any;

  /** Get editor content with optional arguments */
  getContent: (args?: Record<string, any>) => string;

  /** Set editor content */
  setContent: (content: string) => void;

  /** Insert content at current cursor position */
  insertContent: (content: string) => void;

  /** Focus the editor */
  focus: () => void;

  /** Remove focus from the editor */
  blur: () => void;

  /** Save the editor content */
  save: () => void;

  /** Check if editor content has changed */
  isDirty: () => boolean;

  /** Reset the dirty state */
  resetDirty: () => void;

  /** Enable the editor */
  enable: () => void;

  /** Disable the editor (read-only mode) */
  disable: () => void;

  /** Show the editor */
  show: () => void;

  /** Hide the editor */
  hide: () => void;

  /** Get selected content */
  getSelectedContent: () => string;

  /** Set border style */
  setBorderStyle: (style: BorderStyleType, color?: string) => void;
}
