// src/features/editor/config/editorConfig.ts

/**
 * Default plugins for TinyMCE 6 with @tinymce/tinymce-react 6.1.0
 *
 * TinyMCE 6 da barqaror ishlaydigan pluginlar ro'yxati
 */
export const DEFAULT_PLUGINS = [
  // Essential plugins
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
  'visualchars',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  'help',
  'wordcount',

  // Content formatting
  'emoticons',
  'codesample',

  // File operations
  'save',
  'autosave',

  // Layout and structure
  'pagebreak',
  'nonbreaking',
  'quickbars',

  // Direction
  'directionality',

  // Useful extras
  'importcss',
  'autoresize',
];

/**
 * Default toolbar configuration for TinyMCE 6
 */
export const DEFAULT_TOOLBAR = [
  'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
  'link image table | charmap emoticons | fullscreen preview | code | pageborder | help',
];

/**
 * Default menu configuration for TinyMCE 6
 */
export const DEFAULT_MENU = {
  file: {
    title: 'Fayl',
    items: 'newdocument restoredraft | preview | wordcount',
  },
  edit: {
    title: 'Edit',
    items: 'undo redo | cut copy paste pastetext | selectall | searchreplace',
  },
  view: {
    title: 'View',
    items: 'code | visualaid visualchars visualblocks | preview fullscreen',
  },
  insert: {
    title: 'Insert',
    items: 'image link media table hr | charmap emoticons | pagebreak nonbreaking anchor | insertdatetime',
  },
  format: {
    title: 'Format',
    items:
      'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
  },
  tools: {
    title: 'Tools',
    items: 'code wordcount',
  },
  table: {
    title: 'Table',
    items: 'inserttable | cell row column | tableprops deletetable',
  },
  help: {
    title: 'Help',
    items: 'help',
  },
};
