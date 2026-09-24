import { useEffect, useMemo, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { axiosInstance } from '@/shared/api/axios-instance'
import { apiConfig } from '@/shared/api/constants'

/**
 * The part of TinyMCE's editor instance used here. Its full types ship with the
 * `tinymce` package, which the project does not install (the editor loads from
 * the cloud).
 */
interface EditorInstance {
  getContent: () => string
  setContent: (content: string) => void
  getContainer: () => HTMLElement | null
}

interface BlobInfo {
  blob: () => Blob
  filename: () => string
}

export interface TinyMCEEditorProps {
  value?: string
  onChange?: (content: string) => void
  height?: number
  placeholder?: string
  disabled?: boolean
  className?: string
}

const PLUGINS = [
  'advlist',
  'autolink',
  'lists',
  'link',
  'image',
  'charmap',
  'preview',
  'anchor',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  'help',
  'wordcount',
  'pagebreak',
  'template',
  'nonbreaking',
  'emoticons',
].join(' ')

const TOOLBAR =
  'undo redo | bold italic underline | fontfamily fontsize | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image table | code preview'

const DEFAULT_HEIGHT = 500

/** Pasted and inserted images go to the announcements store; the editor keeps their link */
const uploadImage = async (blobInfo: BlobInfo) => {
  const formData = new FormData()
  formData.append('file', blobInfo.blob(), blobInfo.filename())

  try {
    const response = await axiosInstance.post<{ data?: unknown }>('/api/v1/attachments/announcements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    const path = response.data?.data
    if (typeof path === 'string') {
      return path.startsWith('http') ? path : `${apiConfig.baseURL}${path}`
    }
    return ''
  } catch (error) {
    console.error('TinyMCE image upload failed:', error)
    throw error
  }
}

const TinyMCEEditor = ({
  value,
  onChange,
  height = DEFAULT_HEIGHT,
  placeholder,
  disabled = false,
  className = '',
}: TinyMCEEditorProps) => {
  const editorRef = useRef<EditorInstance | null>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  // The value can change from outside (a record loading) after the editor is up
  useEffect(() => {
    if (isEditorReady && editorRef.current && value !== undefined && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value)
    }
  }, [value, isEditorReady])

  const handleEditorInit = (_event: unknown, editor: EditorInstance) => {
    editorRef.current = editor
    setIsEditorReady(true)

    const container = editor.getContainer()
    if (container) {
      container.style.height = '100%'
      container.style.border = 'none'
    }
  }

  const editorInit = useMemo(
    () => ({
      plugins: PLUGINS,
      toolbar: TOOLBAR,
      height,
      placeholder,
      menubar: false,
      statusbar: false,
      promotion: false,
      browser_spellcheck: true,
      entity_encoding: 'raw' as const,
      branding: false,
      skin: 'oxide',
      content_css: 'default',
      content_style:
        " body { font-family: 'Golos Text', sans-serif; font-size: 11pt; line-height: 1.5; background-color: white !important; }",
      images_upload_handler: uploadImage,
      language: 'ru',
      automatic_uploads: true,
    }),
    [height, placeholder]
  )

  useEffect(() => {
    const styleId = 'tinymce-custom-style'
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement('style')
      styleTag.id = styleId
      styleTag.innerHTML = `
        .tox-tinymce { border: none !important; border-radius: 0 !important; box-shadow: none !important; height: 100% !important; }
        .tox-tinymce--focused { border: none !important; box-shadow: none !important; }
        .tox .tox-edit-area__iframe { border: none !important; outline: none !important; }
        .tox .tox-edit-area { border: none !important; outline: none !important; }
        .tox .tox-edit-area:focus-within { border: none !important; outline: none !important; }
        .tox .tox-sidebar-wrap { border: none !important; }
        .tox .tox-editor-container { border: none !important; }
      `
      document.head.appendChild(styleTag)
    }
  }, [])

  return (
    <div
      className={`tinymce-editor-wrapper ${className}`}
      style={{
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem 0.75rem 0 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      {!isEditorReady && <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-md" />}
      <div style={{ visibility: isEditorReady ? 'visible' : 'hidden', height: '100%' }}>
        <Editor
          apiKey="tubsto5n41v7s78fm8eukfhvygmxpq5sue580awa4va9d383"
          licenseKey="gpl"
          onInit={handleEditorInit}
          value={value}
          onEditorChange={(content) => onChange?.(content)}
          init={editorInit}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default TinyMCEEditor
