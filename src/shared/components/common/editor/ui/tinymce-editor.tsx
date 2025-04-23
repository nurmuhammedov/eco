import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { TinyMCEEditorProps, TinyMCEEditorRef } from '../model/types';
import { Editor } from '@tinymce/tinymce-react';

// Border style utilities
const getBorderStyle = (style?: TinyMCEEditorProps['borderStyle'], color: string = '#000000'): string => {
  switch (style) {
    case 'thin':
      return `1px solid ${color}`;
    case 'medium':
      return `2px solid ${color}`;
    case 'thick':
      return `3px solid ${color}`;
    case 'double':
      return `4px double ${color}`;
    case 'dashed':
      return `2px dashed ${color}`;
    case 'dotted':
      return `2px dotted ${color}`;
    case 'none':
    default:
      return 'none';
  }
};

const BORDER_STYLE_OPTIONS = [
  { text: 'None', value: 'none' },
  { text: 'Thin', value: 'thin' },
  { text: 'Medium', value: 'medium' },
  { text: 'Thick', value: 'thick' },
  { text: 'Double', value: 'double' },
  { text: 'Dashed', value: 'dashed' },
  { text: 'Dotted', value: 'dotted' },
];

const TinyMCEEditor = forwardRef<TinyMCEEditorRef, TinyMCEEditorProps>((props, ref) => {
  // Props destructuring with defaults
  const {
    id,
    apiKey,
    initialValue = ` <div style="border: 1px solid #000000; padding: 20px; font-family: 'Times New Roman', Times, serif;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="display: flex; align-items: center;">
          <img src="gerb_image_url.png" alt="O'zbekiston gerbi" style="width: 80px; height: 80px; margin-right: 10px;" />
          <div style="font-weight: bold; width: 370px; line-height: 1.4; font-size: 14px; text-transform: uppercase;">
            O'zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi sanoat, yadro va radiatsiya xavfsizligi qo'mitasi
          </div>
        </div>
        <div style="text-align: right; font-size: 14px; line-height: 1.5;">
          Toshkent sh., Yunys Obod mavzesi,<br />
          12-daxa, 12-uy, 5-xonadonda<br />
          istiqomat qiluvchi fuqaro<br />
          T.T. Testovdan
        </div>
      </div>
      
      <div style="text-align: center; font-weight: bold; font-size: 24px; margin: 40px 0;">
        A R I Z A
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
        <div>№ 001-2024</div>
        <div>12 декабрь 2024 й.</div>
      </div>
      
      <div style="margin-bottom: 20px; line-height: 1.5;">
        4R148 "4R115 avtomobil yo'li-Yanqiqadam q.-Uchuy q.-Oltiariq sh.-Chimyon q.-Vodil q." avtomobil yo'tining 36-46 km obyektida
      </div>
      
      <div style="margin-bottom: 20px; line-height: 1.5;">
        "O'zyo'linspeksiya" davlat inspektori: Yo'ldoshev Dilshod Sodiqovich
      </div>
      
      <div style="margin-bottom: 20px; line-height: 1.5;">
        Buyurtmachi <strong>UFAYQ va RQD DUK</strong> texnik nazoratchisi <strong>Ikromjon Qodirov</strong>,<br />
        Loyihachi <strong>"Farg'onayo'lloyixa" instituti</strong> MChJ muallifilik nazoratchisi <strong>Shoxboz Sobirjonov</strong>,<br />
        Pudratchi <strong>"Best stroy-2020"</strong> MChJ ichki nazoratchisi <strong>Oltinjon Yusupov</strong>
      </div>
      
      <div style="margin-bottom: 40px; line-height: 1.5; text-align: justify;">
        ishtirokida, ushbu obyektda bajarilgan qurilish-montaj ishlarining loyiha va normativ hujjatlar talablariga rioya etilishi yuzasidan nazorat qilish ishlari o'tkazilishi natijasida quyidagilarni aniqladim:
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-top: 60px;">
        <div>12.12.24</div>
        <div>Testov T.T</div>
      </div>
    </div>`,
    value,
    onChange,
    onInit,
    onBlur,
    onFocus,
    onSave,
    height = 600,
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
    autoresize = false,
    autoresizeMinHeight = 500,
    autoresizeMaxHeight = 800,
    lazyLoad = false,
    touchEnabled = true,
    relativeUrls = false,
    removeScriptHost = false,
    convertUrls = false,
    imageAdvtab = true,
    automaticUploads = true,
    wordcount = true,
    quickbars = true,
    quickbarsSelectionToolbar,
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
    const basePlugins = [
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
      'fullscreen',
      'insertdatetime',
      'table',
      'help',
      'template',
      'paste',
      'importcss',
      'directionality',
      'print',
      'nonbreaking',
      'pagebreak',
      'quickbars',
      'codesample',
    ];

    // Add optional plugins
    if (autoresize) basePlugins.push('autoresize');
    if (wordcount) basePlugins.push('wordcount');

    return basePlugins;
  }, [autoresize, wordcount]);

  // Merge default plugins with custom plugins
  const mergedPlugins = useMemo(() => {
    return plugins ? [...new Set([...defaultPlugins, ...plugins])] : defaultPlugins;
  }, [defaultPlugins, plugins]);

  // Default toolbar configuration
  const defaultToolbar = useMemo(
    () => [
      'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
      'link image media table codesample | charmap emoticons | fullscreen preview | code | ltr rtl | pageborder | help',
    ],
    [],
  );

  // Build editor initialization config
  const editorInit = useMemo(() => {
    const config: any = {
      // Core settings
      selector: `#${editorId}`,
      plugins: mergedPlugins.join(' '),
      toolbar: toolbar || defaultToolbar,
      branding: false,
      height,
      placeholder,
      menubar,
      browser_spellcheck: browserSpellcheck,
      entity_encoding: 'raw',
      inline,
      readonly: readOnly || disabled,

      // Content appearance
      content_css: contentCss || (darkMode ? 'dark' : 'default'),
      content_style:
        contentStyle ||
        'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }',
      skin: darkMode ? 'oxide-dark' : 'oxide',

      // URL handling
      relative_urls: relativeUrls,
      remove_script_host: removeScriptHost,
      convert_urls: convertUrls,

      // Paste settings
      paste_data_images: true,
      paste_word_valid_elements: allowPasteFromWord
        ? 'p,b,strong,i,em,h1,h2,h3,h4,h5,h6,table,tr,td,th,div,ul,ol,li,a,span,br'
        : '',
      paste_as_text: pasteAsText,

      // Image settings
      image_advtab: imageAdvtab,
      automatic_uploads: automaticUploads,

      // QuickBars settings
      quickbars_selection_toolbar: quickbarsSelectionToolbar || 'bold italic | h2 h3 | blockquote quicklink',
      quickbars_insert_toolbar: quickbars ? 'quickimage quicktable' : false,

      // Autosave settings
      autosave_interval: autosaveInterval,
      autosave_prefix: `tinymce-autosave-${editorId}-`,

      // Internationalization
      language: language,
      language_url: languageUrl,

      // Auto-resize settings
      autoresize_bottom_margin: 50,
      autoresize_min_height: autoresizeMinHeight,
      autoresize_max_height: autoresizeMaxHeight,

      // Mobile settings
      mobile: {
        menubar: false,
        toolbar: 'undo redo | bold italic | link image',
        plugins: ['autosave', 'lists', 'autolink', 'link', 'image'],
      },

      // Templates and formats
      templates: templates,
      formats: formats,

      // Touch settings
      touch_enabled: touchEnabled,
      images_file_types: 'jpeg,jpg,png,gif,bmp,webp,svg',

      // Fayl tanlash turlari
      file_picker_types: 'file image media',

      // Boshqa fayllar uchun
      file_browser_callback_types: 'file image media',

      // Setup function that combines existing setup with additional functionality
      setup: (editor: any) => {
        // Add border style button to toolbar
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
  ]);

  return (
    <div className={`tinymce-editor-wrapper ${className}`} style={style}>
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
