import { Editor } from '@tinymce/tinymce-react';
import { TinyMCEEditorProps, TinyMCEEditorRef } from '../model/types';
import { BORDER_STYLE_OPTIONS, getBorderStyle } from '../lib/border-utils';
import { DEFAULT_PLUGINS, DEFAULT_TOOLBAR } from '../config/editor-config';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

const TinyMCEEditor = forwardRef<TinyMCEEditorRef, TinyMCEEditorProps>((props, ref) => {
  // Props destructuring with defaults
  const {
    id,
    apiKey = 'yacgnjyvp8096uz8au6ipnf1ti0odomsp03locp9bpgdpeie',
    initialValue,
    value,
    onChange,
    onInit,
    onBlur,
    onFocus,
    onSave,
    height = 500,
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
    borderStyle = 'none',
    borderColor = '#000000',
    browserSpellcheck = true,
    tinymceScriptSrc,
    imageUploadHandler,
    filePickerCallback,
    pastePreprocess,
    pastePostprocess,
    language,
    languageUrl,
    autosaveInterval = 30000,
    templates,
    formats,
    allowPasteFromWord = true,
    pasteAsText = false,
    autoresize = true,
    autoresizeMinHeight = 500,
    autoresizeMaxHeight = 1000,
    lazyLoad = false,
    touchEnabled = true,
    relativeUrls = false,
    removeScriptHost = false,
    convertUrls = false,
    imageAdvtab = true,
    automaticUploads = true,
    quickbars = true,
    quickbarsSelectionToolbar = 'bold italic | h2 h3 | blockquote link | alignleft aligncenter alignright',
    setup,
  } = props;

  // Component state
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [currentBorderStyle, setCurrentBorderStyle] = useState(borderStyle);
  const [currentBorderColor, setCurrentBorderColor] = useState(borderColor);

  // Memoize editor ID to avoid regenerating on each render
  const editorId = useMemo(() => id || `tinymce-editor-${Math.random().toString(36).substring(2, 11)}`, [id]);

  // Update editor content when controlled value changes
  useEffect(() => {
    if (isEditorReady && editorRef.current && value !== undefined && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value);
    }
  }, [value, isEditorReady]);

  // Update border style when props change
  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      updateEditorBorderStyle(borderStyle, borderColor);
    }
  }, [borderStyle, borderColor, isEditorReady]);

  // Internal function for updating border style
  const updateEditorBorderStyle = (style: TinyMCEEditorProps['borderStyle'], color: string = '#000000') => {
    if (!editorRef.current) return;

    const editorBody = editorRef.current.getBody();
    if (editorBody) {
      const currentStyle = editorBody.style.cssText || '';
      const newStyle = currentStyle.replace(/border:[^;]+;?/g, '');
      editorBody.style.cssText = `${newStyle}; border: ${getBorderStyle(style, color)};`;

      setCurrentBorderStyle(style || 'none');
      setCurrentBorderColor(color);
    }
  };

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      // Core editor methods
      getEditor: () => editorRef.current,

      getContent: (args = {}) => {
        if (!editorRef.current) return '';
        return editorRef.current.getContent(args);
      },

      setContent: (content: string) => {
        if (!editorRef.current) return;
        editorRef.current.setContent(content);
      },

      insertContent: (content: string) => {
        if (!editorRef.current) return;
        editorRef.current.insertContent(content);
      },

      // Editor state methods
      focus: () => {
        if (!editorRef.current) return;
        editorRef.current.focus();
      },

      blur: () => {
        if (!editorRef.current) return;
        editorRef.current.blur();
      },

      save: () => {
        if (!editorRef.current) return;
        editorRef.current.save();
      },

      isDirty: () => {
        if (!editorRef.current) return false;
        return editorRef.current.isDirty();
      },

      resetDirty: () => {
        if (!editorRef.current) return;
        editorRef.current.setDirty(false);
      },

      // Visibility methods
      enable: () => {
        if (!editorRef.current) return;
        editorRef.current.mode.set('design');
      },

      disable: () => {
        if (!editorRef.current) return;
        editorRef.current.mode.set('readonly');
      },

      show: () => {
        if (!editorRef.current) return;
        editorRef.current.show();
      },

      hide: () => {
        if (!editorRef.current) return;
        editorRef.current.hide();
      },

      // Selection methods
      getSelectedContent: () => {
        if (!editorRef.current) return '';
        return editorRef.current.selection.getContent();
      },

      // Border methods
      setBorderStyle: (style: TinyMCEEditorProps['borderStyle'], color?: string) => {
        updateEditorBorderStyle(style, color || currentBorderColor);
      },
    }),
    [editorRef, isEditorReady, currentBorderColor],
  );

  // Editor initialization handler
  const handleEditorInit = (_evt: any, editor: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Set initial border style
    updateEditorBorderStyle(currentBorderStyle, currentBorderColor);

    // Optimize editor container styling
    const editorContainer = editor.getContainer();
    if (editorContainer) {
      editorContainer.style.height = '100%';
      editorContainer.style.display = 'flex';
      editorContainer.style.flexDirection = 'column';

      // Editor content element styling
      const contentElement = editorContainer.querySelector('.tox-edit-area');
      if (contentElement) {
        contentElement.style.flex = '1';
      }
    }

    // Call the onInit callback if provided
    if (onInit) {
      onInit(editor);
    }
  };

  // Editor content change handler
  const handleEditorChange = (content: string, editor: any) => {
    // Only call onChange if provided
    if (onChange) {
      onChange(content, editor);
    }
  };

  // Default plugins
  const defaultPlugins = useMemo(() => {
    // Use reliable default plugins for TinyMCE 6
    return DEFAULT_PLUGINS;
  }, []);

  // Merge default plugins with custom plugins
  const mergedPlugins = useMemo(() => {
    return plugins ? [...new Set([...defaultPlugins, ...plugins])] : defaultPlugins;
  }, [defaultPlugins, plugins]);

  // Default toolbar configuration
  const defaultToolbar = useMemo(() => DEFAULT_TOOLBAR, []);

  const editorWrapperStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  // Build editor initialization config
  const editorInit = useMemo(() => {
    const config: any = {
      // Core settings
      selector: `#${editorId}`,
      plugins: mergedPlugins.join(' '),
      toolbar: toolbar || defaultToolbar,
      branding: false,
      height: autoresize ? 'auto' : height,
      min_height: autoresizeMinHeight,
      max_height: autoresizeMaxHeight,
      placeholder,
      menubar: menubar ? 'file edit view insert format tools table help' : menubar,
      browser_spellcheck: browserSpellcheck,
      entity_encoding: 'raw',
      inline,
      readonly: readOnly || disabled,

      // Content appearance
      content_css: contentCss || (darkMode ? 'dark' : 'default'),
      content_style: `
        ${contentStyle || ''}
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-size: 16px;
          line-height: 1.5;
          padding: 10px;
        }
        table {
          border-collapse: collapse;
        }
        table td, table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `,
      skin: darkMode ? 'oxide-dark' : 'oxide',

      // URL handling
      relative_urls: relativeUrls,
      remove_script_host: removeScriptHost,
      convert_urls: convertUrls,

      // Paste settings
      paste_data_images: true,
      paste_word_valid_elements: allowPasteFromWord
        ? 'p,b,strong,i,em,h1,h2,h3,h4,h5,h6,table,tr,td,th,div,ul,ol,li,a,span,br,img,hr,pre,code,blockquote'
        : '',
      paste_as_text: pasteAsText,

      // Image settings
      image_advtab: imageAdvtab,
      automatic_uploads: automaticUploads,
      images_upload_credentials: true,
      image_caption: true,

      // QuickBars settings
      quickbars_selection_toolbar: quickbarsSelectionToolbar || 'bold italic | h2 h3 | blockquote quicklink',
      quickbars_insert_toolbar: quickbars ? 'quickimage quicktable' : false,

      // Autosave settings
      autosave_interval: autosaveInterval,
      autosave_prefix: `tinymce-autosave-${editorId}-`,
      autosave_restore_when_empty: true,

      // Internationalization
      language: language,
      language_url: languageUrl,
      // Templates and formats
      templates: templates,
      formats: formats,

      // Touch settings
      touch_enabled: touchEnabled,

      setup: (editor: any) => {
        // Add border style button to toolbar if borderStyle prop is provided
        if (borderStyle !== 'none' || borderColor !== '#000000') {
          editor.ui.registry.addMenuButton('pageborder', {
            text: 'Border',
            tooltip: 'Set page border',
            icon: 'line',
            fetch: (callback: any) => {
              const items = BORDER_STYLE_OPTIONS.map((option) => ({
                type: 'menuitem',
                text: option.text,
                onAction: () => {
                  updateEditorBorderStyle(option.value as TinyMCEEditorProps['borderStyle'], currentBorderColor);
                },
              }));

              callback(items);
            },
          });

          // Register custom color picker for border
          editor.ui.registry.addContextMenu('bordermenu', {
            update: (element: any) => {
              if (element.nodeName === 'BODY') {
                return [
                  {
                    text: 'Border Color...',
                    icon: 'color-picker',
                    onAction: () => {
                      // Open color picker dialog
                      editor.windowManager.open({
                        title: 'Border Color',
                        body: {
                          type: 'panel',
                          items: [
                            {
                              type: 'colorinput',
                              name: 'bordercolor',
                              label: 'Border color',
                            },
                          ],
                        },
                        initialData: {
                          bordercolor: currentBorderColor,
                        },
                        buttons: [
                          {
                            type: 'cancel',
                            text: 'Cancel',
                          },
                          {
                            type: 'submit',
                            text: 'Save',
                            primary: true,
                          },
                        ],
                        onSubmit: (api: any) => {
                          const data = api.getData();
                          updateEditorBorderStyle(currentBorderStyle, data.bordercolor);
                          api.close();
                        },
                      });
                    },
                  },
                ];
              }
              return [];
            },
          });
        }

        // Register custom setup if provided
        if (setup) {
          setup(editor);
        }

        // Register event handlers
        if (onSave) {
          editor.on('save', (e: any) => {
            e.preventDefault();
            onSave(editor.getContent(), editor);
            return false;
          });
        }

        if (onBlur) {
          editor.on('blur', (e: any) => {
            onBlur(e, editor);
          });
        }

        if (onFocus) {
          editor.on('focus', (e: any) => {
            onFocus(e, editor);
          });
        }

        // Register paste handlers
        if (pastePreprocess) {
          editor.on('PastePreProcess', (args: any) => {
            pastePreprocess(editor, args);
          });
        }

        if (pastePostprocess) {
          editor.on('PastePostProcess', (args: any) => {
            pastePostprocess(editor, args);
          });
        }
      },
    };

    // Configure image upload handler
    if (imageUploadHandler) {
      config.images_upload_handler = async (blobInfo: any, progress: any) => {
        try {
          return await imageUploadHandler(blobInfo, progress);
        } catch (error) {
          console.error('Image upload error:', error);
          throw error;
        }
      };
    }

    // Configure file picker callback
    if (filePickerCallback) {
      config.file_picker_callback = filePickerCallback;
    }

    return config;
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
    relativeUrls,
    removeScriptHost,
    convertUrls,
    allowPasteFromWord,
    pasteAsText,
    imageAdvtab,
    automaticUploads,
    quickbarsSelectionToolbar,
    quickbars,
    autosaveInterval,
    language,
    languageUrl,
    autoresizeMinHeight,
    autoresizeMaxHeight,
    touchEnabled,
    templates,
    formats,
    currentBorderColor,
    currentBorderStyle,
    setup,
    onSave,
    onBlur,
    onFocus,
    pastePreprocess,
    pastePostprocess,
    imageUploadHandler,
    filePickerCallback,
    updateEditorBorderStyle,
    borderStyle,
    borderColor,
    autoresize,
  ]);

  return (
    <div
      className={`tinymce-editor-wrapper !h-[calc(100vh-130px)] ${className}`}
      style={{ ...editorWrapperStyle, ...style }}
    >
      <Editor
        id={editorId}
        apiKey={apiKey}
        onInit={handleEditorInit}
        initialValue={initialValue}
        value={value}
        onEditorChange={handleEditorChange}
        init={editorInit}
        disabled={disabled}
        tinymceScriptSrc={tinymceScriptSrc}
        scriptLoading={{ async: lazyLoad, defer: lazyLoad }}
      />
    </div>
  );
});

TinyMCEEditor.displayName = 'TinyMCEEditor';

export default TinyMCEEditor;
