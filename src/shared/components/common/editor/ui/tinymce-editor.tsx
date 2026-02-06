// src/features/editor/ui/TinyMCEEditor.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { TinyMCEEditorProps, TinyMCEEditorRef } from '../model/types'
import { getContentDimensions, mmToPx, PAPER_SIZES } from '../lib/paper-utils'

/**
 * A4 formatga moslashtirilgan TinyMCE Editor komponenti
 * API kalitsiz mahalliy rejimda ishlaydi
 * Clean code prinsiplari asosida optimallashtirilgan
 */
const TinyMCEEditor = forwardRef<TinyMCEEditorRef, TinyMCEEditorProps>((props, ref) => {
  // Props destructuring with defaults
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
    menubar = true,
    contentCss,
    contentStyle,
    browserSpellcheck = true,
    imageUploadHandler,
    filePickerCallback,
    language,
    autosaveInterval = 30000,
    templates,
    formats,
    pageSize = 'a4',
    orientation = 'portrait',
    pageMargin = 20, // mm
    customButtons = [],
    setup,
  } = props

  // Component state
  const editorRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [currentOrientation, setCurrentOrientation] = useState(orientation)
  const [currentMargin, setCurrentMargin] = useState(pageMargin)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)

  // Memoize paper dimensions
  const paperDimensions = useMemo(() => {
    return getContentDimensions(currentPageSize, currentOrientation, currentMargin)
  }, [currentPageSize, currentOrientation, currentMargin])

  // Editor ID
  const editorId = useMemo(() => id || `tinymce-editor-${Math.random().toString(36).substring(2, 11)}`, [id])

  // Update content when value prop changes
  useEffect(() => {
    if (isEditorReady && editorRef.current && value !== undefined && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value)
    }
  }, [value, isEditorReady])

  // Apply paper format when any of format parameters change
  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      applyPageFormat(editorRef.current, currentPageSize, currentOrientation, currentMargin)
    }
  }, [currentPageSize, currentOrientation, currentMargin, isEditorReady])

  const applyPageFormat = (editor: any, format: string, orient: 'portrait' | 'landscape', margin: number) => {
    const { widthPx, heightPx, widthMm, heightMm } = getContentDimensions(format, orient, margin)

    const doc = editor.getDoc()
    let style = doc.getElementById('mce-page-format')

    if (!style) {
      style = doc.createElement('style')
      style.id = 'mce-page-format'
      doc.head.appendChild(style)
    }

    const pageStyles = `
      /* Paper format styles */
      body {
        background-color: #f0f0f0 !important;
        padding: 20px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        display: flex !important;
        justify-content: center !important;
      }
      
      .mce-content-container {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
        background-color: #fff !important;
        width: ${widthPx}px !important;
        min-height: ${heightPx}px !important;
        margin: 0 auto !important;
        padding: ${mmToPx(margin)}px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }
      
      /* Printing styles */
      @media print {
        body {
          background-color: white !important;
          padding: 0 !important;
        }
        
        .mce-content-container {
          box-shadow: none !important;
          width: ${widthMm}mm !important;
          min-height: ${heightMm}mm !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      }
      
      /* Page break style */
      .mce-pagebreak {
        border-top: 2px dashed #999;
        page-break-before: always;
        page-break-inside: avoid;
        width: 100%;
        display: block;
        height: 5px;
        margin: 15px 0;
      }
    `

    style.innerHTML = pageStyles

    // Body elementi uchun container yaratish
    if (!doc.querySelector('.mce-content-container')) {
      const bodyContent = doc.body.innerHTML
      const container = doc.createElement('div')
      container.className = 'mce-content-container'
      container.innerHTML = bodyContent
      doc.body.innerHTML = ''
      doc.body.appendChild(container)
    }

    // Current values saqlash
    setCurrentPageSize(format)
    setCurrentOrientation(orient)
    setCurrentMargin(margin)
  }

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      getEditor: () => editorRef.current,

      getContent: (args = {}) => {
        if (!editorRef.current) return ''
        return editorRef.current.getContent(args)
      },

      setContent: (content: string) => {
        if (!editorRef.current) return
        editorRef.current.setContent(content)
      },

      insertContent: (content: string) => {
        if (!editorRef.current) return
        editorRef.current.insertContent(content)
      },

      focus: () => {
        if (!editorRef.current) return
        editorRef.current.focus()
      },

      blur: () => {
        if (!editorRef.current) return
        editorRef.current.blur()
      },

      save: () => {
        if (!editorRef.current) return
        editorRef.current.save()
      },

      isDirty: () => {
        if (!editorRef.current) return false
        return editorRef.current.isDirty()
      },

      resetDirty: () => {
        if (!editorRef.current) return
        editorRef.current.setDirty(false)
      },

      enable: () => {
        if (!editorRef.current) return
        editorRef.current.mode.set('design')
      },

      disable: () => {
        if (!editorRef.current) return
        editorRef.current.mode.set('readonly')
      },

      show: () => {
        if (!editorRef.current) return
        editorRef.current.show()
      },

      hide: () => {
        if (!editorRef.current) return
        editorRef.current.hide()
      },

      getSelectedContent: () => {
        if (!editorRef.current) return ''
        return editorRef.current.selection.getContent()
      },

      // A4 formatni boshqarish metodlari
      applyPageFormat: (format: string, orient: 'portrait' | 'landscape', margin: number) => {
        if (!editorRef.current) return
        applyPageFormat(editorRef.current, format, orient, margin)
      },

      setPageSize: (format: string) => {
        if (!editorRef.current) return
        applyPageFormat(editorRef.current, format, currentOrientation, currentMargin)
      },

      setOrientation: (orient: 'portrait' | 'landscape') => {
        if (!editorRef.current) return
        applyPageFormat(editorRef.current, currentPageSize, orient, currentMargin)
      },

      setMargin: (margin: number) => {
        if (!editorRef.current) return
        applyPageFormat(editorRef.current, currentPageSize, currentOrientation, margin)
      },

      insertPageBreak: () => {
        if (!editorRef.current) return
        editorRef.current.execCommand('mcePageBreak')
      },

      printPreview: () => {
        if (!editorRef.current) return
        const content = editorRef.current.getContent()

        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const paperSize = PAPER_SIZES[currentPageSize] || PAPER_SIZES.a4
        let { width, height } = paperSize

        if (currentOrientation === 'landscape') {
          ;[width, height] = [height, width]
        }

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              @page {
                size: ${width}mm ${height}mm;
                margin: ${currentMargin}mm;
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
              .mce-pagebreak {
                page-break-before: always;
                height: 0;
                border: 0;
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            ${content}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
          </html>
        `)

        printWindow.document.close()
      },

      // Export as PDF (requires implementation)
      exportPDF: () => {
        if (!editorRef.current) return
        console.log('PDF export method. Implement with a PDF library like jsPDF')
      },
    }),
    [editorRef, isEditorReady, currentPageSize, currentOrientation, currentMargin, applyPageFormat]
  )

  // Init handler
  const handleEditorInit = (_evt: any, editor: any) => {
    editorRef.current = editor
    setIsEditorReady(true)

    // Optimize editor container
    const editorContainer = editor.getContainer()
    if (editorContainer) {
      editorContainer.style.display = 'flex'
      editorContainer.style.flexDirection = 'column'
      editorContainer.style.height = `${height || paperDimensions.heightPx + 200}px`

      const contentElement = editorContainer.querySelector('.tox-edit-area')
      if (contentElement) {
        contentElement.style.flex = '1'
      }
    }

    applyPageFormat(editor, pageSize, orientation, pageMargin)

    if (onInit) {
      onInit(editor)
    }
  }

  // Content change handler
  const handleEditorChange = (content: string, editor: any) => {
    if (onChange) {
      onChange(content, editor)
    }
  }

  // Default plugins
  const defaultPlugins = useMemo(() => {
    return [
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
      'print',
      'template',
      'nonbreaking',
      'hr',
      'emoticons',
    ]
  }, [])

  // Merge plugins
  const mergedPlugins = useMemo(() => {
    return plugins ? [...new Set([...defaultPlugins, ...plugins])] : defaultPlugins
  }, [defaultPlugins, plugins])

  // Default toolbar
  const defaultToolbar = useMemo(
    () => [
      'undo redo | formatselect | fontselect fontsizeselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
      'link image media table | pagebreak nonbreaking hr | charmap emoticons | fullscreen preview print | code | pageformat printpreview | help',
    ],
    []
  )

  // Editor config
  const editorInit = useMemo(() => {
    const config: any = {
      // Core settings
      selector: `#${editorId}`,
      plugins: mergedPlugins.join(' '),
      toolbar: toolbar || defaultToolbar,
      height: height || paperDimensions.heightPx + 200,
      placeholder,
      menubar,
      browser_spellcheck: browserSpellcheck,
      entity_encoding: 'raw',
      inline,
      readonly: readOnly || disabled,

      // API kalitsiz rejimda ishlashi uchun
      branding: false,

      // Content appearance
      content_css: contentCss || (darkMode ? 'dark' : 'default'),
      content_style: `
        ${contentStyle || ''}
        body {
          font-family: 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
        }
      `,
      skin: darkMode ? 'oxide-dark' : 'oxide',
      print_watermark: false,
      pagebreak_separator: '<div class="mce-pagebreak"></div>',
      pagebreak_split_block: true,
      menu: {
        file: { title: 'File', items: 'newdocument restoredraft | preview | print | pagesetup' },
        edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
        view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen' },
        insert: {
          title: 'Insert',
          items: 'image link media | pagebreak hr nonbreaking | charmap emoticons | template',
        },
        format: {
          title: 'Format',
          items:
            'bold italic underline strikethrough | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
        },
        tools: { title: 'Tools', items: 'code wordcount' },
        table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
        help: { title: 'Help', items: 'help' },
      },

      // Image settings
      automatic_uploads: true,

      // Autosave settings
      autosave_interval: autosaveInterval,
      autosave_prefix: `tinymce-autosave-${editorId}-`,

      // Internationalization
      language: language,

      // Templates and formats
      templates,

      formats: formats,

      setup: (editor: any) => {
        editor.ui.registry.addMenuItem('pagesetup', {
          text: 'Page Setup',
          icon: 'document-properties',
          onAction: () => {
            editor.windowManager.open({
              title: 'Page Setup',
              body: {
                type: 'tabpanel',
                tabs: [
                  {
                    title: 'Page',
                    items: [
                      {
                        type: 'selectbox',
                        name: 'pageSize',
                        label: 'Page size',
                        items: [
                          { text: 'A4', value: 'a4' },
                          { text: 'Letter', value: 'letter' },
                          { text: 'Legal', value: 'legal' },
                        ],
                        value: currentPageSize,
                      },
                      {
                        type: 'selectbox',
                        name: 'orientation',
                        label: 'Orientation',
                        items: [
                          { text: 'Portrait', value: 'portrait' },
                          { text: 'Landscape', value: 'landscape' },
                        ],
                        value: currentOrientation,
                      },
                    ],
                  },
                  {
                    title: 'Margins',
                    items: [
                      {
                        type: 'input',
                        name: 'margin',
                        label: 'Margins (mm)',
                        inputMode: 'numeric',
                        value: String(currentMargin),
                      },
                    ],
                  },
                ],
              },
              buttons: [
                {
                  type: 'cancel',
                  text: 'Cancel',
                },
                {
                  type: 'submit',
                  text: 'Apply',
                  primary: true,
                },
              ],
              initialData: {
                pageSize: currentPageSize,
                orientation: currentOrientation,
                margin: String(currentMargin),
              },
              onSubmit: (api: any) => {
                const data = api.getData()
                const newSize = data.pageSize
                const newOrientation = data.orientation as 'portrait' | 'landscape'
                const newMargin = parseInt(data.margin, 10) || 20

                applyPageFormat(editor, newSize, newOrientation, newMargin)

                api.close()
              },
            })
          },
        })

        customButtons.forEach((button) => {
          editor.ui.registry.addButton(button.name, {
            text: button.text,
            tooltip: button.tooltip || button.text,
            icon: button.icon,
            onAction: () => button.onAction(editor),
          })
        })

        // Custom setup
        if (setup) {
          setup(editor)
        }

        // Event handlers
        if (onSave) {
          editor.on('save', (e: any) => {
            e.preventDefault()
            onSave(editor.getContent(), editor)
            return false
          })
        }

        if (onBlur) {
          editor.on('blur', (e: any) => {
            onBlur(e, editor)
          })
        }

        if (onFocus) {
          editor.on('focus', (e: any) => {
            onFocus(e, editor)
          })
        }
      },
    }

    // Configure image upload handler
    if (imageUploadHandler) {
      config.images_upload_handler = async (blobInfo: any, progress: any) => {
        try {
          return await imageUploadHandler(blobInfo, progress)
        } catch (error) {
          console.error('Image upload error:', error)
          throw error
        }
      }
    }

    // Configure file picker callback
    if (filePickerCallback) {
      config.file_picker_callback = filePickerCallback
    }

    return config
  }, [
    editorId,
    defaultToolbar,
    toolbar,
    mergedPlugins,
    height,
    placeholder,
    menubar,
    browserSpellcheck,
    inline,
    readOnly,
    disabled,
    contentCss,
    contentStyle,
    darkMode,
    autosaveInterval,
    language,
    templates,
    formats,
    setup,
    onSave,
    onBlur,
    onFocus,
    imageUploadHandler,
    filePickerCallback,
    currentPageSize,
    currentOrientation,
    currentMargin,
    paperDimensions.heightPx,
    customButtons,
    applyPageFormat,
  ])

  // Editor wrapper style
  const editorWrapperStyle: React.CSSProperties = {
    height: height ? `${height}px` : `${paperDimensions.heightPx + 200}px`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ...style,
  }

  return (
    <div className={`tinymce-editor-wrapper ${className}`} style={editorWrapperStyle}>
      <Editor
        id={editorId}
        apiKey="i2gzr3l3xi13o8ja2ssqch7jlrlau3xokciwv3x4it8t6u56"
        onInit={handleEditorInit}
        initialValue={initialValue}
        value={value}
        onEditorChange={handleEditorChange}
        init={editorInit}
        disabled={disabled}
      />
    </div>
  )
})

TinyMCEEditor.displayName = 'TinyMCEEditor'

export default TinyMCEEditor
