import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { TinyMCEEditorProps, TinyMCEEditorRef } from '../model/types'
import { getContentDimensions, PAPER_SIZES } from '../lib/paper-utils'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { axiosInstance } from '@/shared/api/axios-instance'
import { apiConfig } from '@/shared/api/constants'

const TinyMCEEditor = forwardRef<TinyMCEEditorRef, TinyMCEEditorProps>((props, ref) => {
  const {
    id,
    initialValue,
    value,
    onChange,
    onInit,
    onBlur,
    onFocus,
    onSave,
    height,
    readOnly = false,
    disabled = false,
    placeholder,
    className = '',
    style,
    inline = false,
    darkMode = false,
    toolbar,
    plugins,
    contentCss,
    contentStyle,
    browserSpellcheck = true,
    imageUploadHandler,
    filePickerCallback,
    language,
    pageSize = 'a4',
    orientation = 'portrait',
    pageMargin = 20,
    customButtons = [],
    setup,
    isPageLayout = true,
  } = props

  const editorRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [currentOrientation, setCurrentOrientation] = useState(orientation)
  const [currentMargin, setCurrentMargin] = useState(pageMargin)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)

  const paperDimensions = useMemo(() => {
    return getContentDimensions(currentPageSize, currentOrientation, currentMargin)
  }, [currentPageSize, currentOrientation, currentMargin])

  const editorId = useMemo(() => id || `tinymce-editor-${Math.random().toString(36).substring(2, 11)}`, [id])

  useEffect(() => {
    if (isEditorReady && editorRef.current && value !== undefined && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value)
    }
  }, [value, isEditorReady])

  useEffect(() => {
    if (isEditorReady && editorRef.current && isPageLayout) {
      applyPageFormat(editorRef.current, currentPageSize, currentOrientation, currentMargin)
    }
  }, [currentPageSize, currentOrientation, currentMargin, isEditorReady, isPageLayout])

  const applyPageFormat = (editor: any, format: string, orient: 'portrait' | 'landscape', margin: number) => {
    const { widthPx, heightPx } = getContentDimensions(format, orient, margin)
    const doc = editor.getDoc()
    let style = doc.getElementById('mce-page-format')

    if (!style) {
      style = doc.createElement('style')
      style.id = 'mce-page-format'
      doc.head.appendChild(style)
    }

    style.innerHTML = `
      body {
        background-color: #f0f0f0 !important;
        padding: 20px !important;
        margin: 0 !important;
        display: flex !important;
        justify-content: center !important;
      }
      .mce-content-container {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
        background-color: #fff !important;
        width: ${widthPx}px !important;
        min-height: ${heightPx}px !important;
        margin: 0 auto !important;
        padding: ${margin}mm !important;
        box-sizing: border-box !important;
      }
    `

    if (!doc.querySelector('.mce-content-container')) {
      const bodyContent = doc.body.innerHTML
      const container = doc.createElement('div')
      container.className = 'mce-content-container'
      container.innerHTML = bodyContent
      doc.body.innerHTML = ''
      doc.body.appendChild(container)
    }

    setCurrentPageSize(format)
    setCurrentOrientation(orient)
    setCurrentMargin(margin)
  }

  useImperativeHandle(
    ref,
    () => ({
      getEditor: () => editorRef.current,
      getContent: (args = {}) => editorRef.current?.getContent(args) || '',
      setContent: (content: string) => editorRef.current?.setContent(content),
      insertContent: (content: string) => editorRef.current?.insertContent(content),
      focus: () => editorRef.current?.focus(),
      blur: () => editorRef.current?.blur(),
      save: () => editorRef.current?.save(),
      isDirty: () => !!editorRef.current?.isDirty(),
      resetDirty: () => editorRef.current?.setDirty(false),
      enable: () => editorRef.current?.mode.set('design'),
      disable: () => editorRef.current?.mode.set('readonly'),
      show: () => editorRef.current?.show(),
      hide: () => editorRef.current?.hide(),
      getSelectedContent: () => editorRef.current?.selection.getContent() || '',
      applyPageFormat: (f: string, o: any, m: number) =>
        editorRef.current && applyPageFormat(editorRef.current, f, o, m),
      setPageSize: (f: string) =>
        editorRef.current && applyPageFormat(editorRef.current, f, currentOrientation, currentMargin),
      setOrientation: (o: any) =>
        editorRef.current && applyPageFormat(editorRef.current, currentPageSize, o, currentMargin),
      setMargin: (m: number) =>
        editorRef.current && applyPageFormat(editorRef.current, currentPageSize, currentOrientation, m),
      insertPageBreak: () => editorRef.current?.execCommand('mcePageBreak'),
      printPreview: () => {
        if (!editorRef.current) return
        const content = editorRef.current.getContent()
        const printWindow = window.open('', '_blank')
        if (!printWindow) return
        const paperSize = PAPER_SIZES[currentPageSize] || PAPER_SIZES.a4
        let { width, height } = paperSize
        if (currentOrientation === 'landscape') [width, height] = [height, width]
        printWindow.document.write(`
          <html>
            <head>
              <style>
                @page { size: ${width}mm ${height}mm; margin: ${currentMargin}mm; }
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              </style>
            </head>
            <body onload="window.print();window.close()">${content}</body>
          </html>
        `)
        printWindow.document.close()
      },
      exportPDF: () => console.log('Implement PDF export'),
    }),
    [editorRef, isEditorReady, currentPageSize, currentOrientation, currentMargin]
  )

  const handleEditorInit = (_evt: any, editor: any) => {
    editorRef.current = editor
    setIsEditorReady(true)
    const container = editor.getContainer()
    if (container) {
      container.style.height = '100%'
      container.style.border = 'none'
    }
    if (isPageLayout) applyPageFormat(editor, pageSize, orientation, pageMargin)
    if (onInit) onInit(editor)
  }

  const handleEditorChange = (content: string, editor: any) => onChange?.(content, editor)

  const defaultPlugins = useMemo(
    () => [
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
    ],
    []
  )

  const mergedPlugins = useMemo(
    () => (plugins ? [...new Set([...defaultPlugins, ...plugins])] : defaultPlugins),
    [defaultPlugins, plugins]
  )

  const defaultToolbar = useMemo(
    () => [
      'undo redo | bold italic underline | fontfamily fontsize | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image table | code preview',
    ],
    []
  )

  const defaultImageUploadHandler = async (blobInfo: any) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    try {
      const response = await axiosInstance.post('/api/v1/attachments/announcements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  const editorInit = useMemo(
    () => ({
      plugins: mergedPlugins.join(' '),
      toolbar: toolbar || defaultToolbar,
      height: height || (isPageLayout ? paperDimensions.heightPx + 200 : 500),
      placeholder,
      menubar: false,
      statusbar: false,
      promotion: false,
      browser_spellcheck: browserSpellcheck,
      entity_encoding: 'raw',
      inline,
      branding: false,
      skin: darkMode ? 'oxide-dark' : 'oxide',
      content_css: contentCss || (darkMode ? 'dark' : 'default'),
      content_style: `${contentStyle || ''} body { font-family: 'Golos Text', sans-serif; font-size: 11pt; line-height: 1.5; background-color: white !important; }`,
      setup: (editor: any) => {
        customButtons.forEach((btn) => {
          editor.ui.registry.addButton(btn.name, {
            text: btn.text,
            tooltip: btn.tooltip || btn.text,
            icon: btn.icon,
            onAction: () => btn.onAction(editor),
          })
        })
        if (setup) setup(editor)
        if (onSave)
          editor.on('save', (e: any) => {
            e.preventDefault()
            onSave(editor.getContent(), editor)
            return false
          })
        if (onBlur) editor.on('blur', (e: any) => onBlur(e, editor))
        if (onFocus) editor.on('focus', (e: any) => onFocus(e, editor))
      },
      images_upload_handler: imageUploadHandler || defaultImageUploadHandler,
      file_picker_callback: filePickerCallback,
      language: language || 'ru',
      automatic_uploads: true,
    }),
    [
      editorId,
      mergedPlugins,
      toolbar,
      defaultToolbar,
      height,
      isPageLayout,
      paperDimensions.heightPx,
      placeholder,
      browserSpellcheck,
      inline,
      readOnly,
      disabled,
      darkMode,
      contentCss,
      contentStyle,
      customButtons,
      setup,
      onSave,
      onBlur,
      onFocus,
      imageUploadHandler,
      filePickerCallback,
      language,
    ]
  )

  const editorWrapperStyle: React.CSSProperties = {
    height: height ? `${height}px` : `${paperDimensions.heightPx + 200}px`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem 0.75rem 0 0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    ...style,
  }

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
    <div className={`tinymce-editor-wrapper ${className}`} style={editorWrapperStyle}>
      {!isEditorReady && <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-md" />}
      <div style={{ visibility: isEditorReady ? 'visible' : 'hidden', height: '100%' }}>
        <Editor
          id={editorId}
          apiKey="i2gzr3l3xi13o8ja2ssqch7jlrlau3xokciwv3x4it8t6u56"
          licenseKey="gpl"
          onInit={handleEditorInit}
          initialValue={initialValue}
          value={value}
          onEditorChange={handleEditorChange}
          init={editorInit}
          disabled={disabled}
        />
      </div>
    </div>
  )
})

TinyMCEEditor.displayName = 'TinyMCEEditor'
export default TinyMCEEditor
