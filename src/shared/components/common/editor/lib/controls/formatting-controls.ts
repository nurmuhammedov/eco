// src/features/editor/lib/controls/formattingControls.ts

/**
 * Registers controls for text formatting and styles
 */
export const registerFormattingControls = (editor: any): void => {
  // Register Word-like styles gallery button
  editor.ui.registry.addMenuButton('stylesgallery', {
    text: 'Styles',
    tooltip: 'Text styles gallery',
    icon: 'format',
    fetch: (callback: any) => {
      const items = [
        // Heading styles
        {
          type: 'menuitem',
          text: 'Title',
          onAction: () => {
            editor.formatter.apply('h1');
          },
        },
        {
          type: 'menuitem',
          text: 'Subtitle',
          onAction: () => {
            editor.formatter.apply('h2');
          },
        },
        {
          type: 'menuitem',
          text: 'Heading 1',
          onAction: () => {
            editor.formatter.apply('h1');
          },
        },
        {
          type: 'menuitem',
          text: 'Heading 2',
          onAction: () => {
            editor.formatter.apply('h2');
          },
        },
        {
          type: 'menuitem',
          text: 'Heading 3',
          onAction: () => {
            editor.formatter.apply('h3');
          },
        },

        // Paragraph styles
        {
          type: 'menuitem',
          text: 'Normal',
          onAction: () => {
            editor.formatter.apply('p');
          },
        },
        {
          type: 'menuitem',
          text: 'Quote',
          onAction: () => {
            editor.formatter.apply('blockquote');
          },
        },
        {
          type: 'menuitem',
          text: 'Code Block',
          onAction: () => {
            editor.formatter.apply('pre');
          },
        },

        // Custom styles
        {
          type: 'menuitem',
          text: 'Highlighted Text',
          onAction: () => {
            editor.formatter.apply('hilitecolor', { value: '#ffff00' });
          },
        },
        {
          type: 'menuitem',
          text: 'Important Text',
          onAction: () => {
            editor.execCommand('FontName', false, 'Arial');
            editor.execCommand('ForeColor', false, '#C0504D');
            editor.execCommand('Bold', false);
          },
        },
        {
          type: 'menuitem',
          text: 'Subtle Reference',
          onAction: () => {
            editor.execCommand('FontSize', false, '8pt');
            editor.execCommand('ForeColor', false, '#808080');
            editor.execCommand('FontName', false, 'Calibri');
          },
        },
        {
          type: 'menuitem',
          text: 'Emphasis',
          onAction: () => {
            editor.formatter.apply('italic');
          },
        },
        {
          type: 'menuitem',
          text: 'Strong',
          onAction: () => {
            editor.formatter.apply('bold');
          },
        },
        {
          type: 'menuitem',
          text: 'Intense Emphasis',
          onAction: () => {
            editor.execCommand('Bold', false);
            editor.execCommand('Italic', false);
            editor.execCommand('ForeColor', false, '#4F81BD');
          },
        },
        {
          type: 'menuitem',
          text: 'Subtle Emphasis',
          onAction: () => {
            editor.execCommand('Italic', false);
            editor.execCommand('ForeColor', false, '#808080');
          },
        },
      ];

      callback(items);
    },
  });

  // Register Word-like theme colors button
  editor.ui.registry.addMenuButton('themecolors', {
    text: 'Theme Colors',
    tooltip: 'Apply theme colors',
    icon: 'color-picker',
    fetch: (callback: any) => {
      const items = [
        {
          type: 'menuitem',
          text: 'Theme 1 - Blue Office',
          onAction: () => {
            applyThemeColors(editor, [
              '#4472C4', // Primary
              '#ED7D31', // Secondary
              '#A5A5A5', // Accent 1
              '#FFC000', // Accent 2
              '#5B9BD5', // Accent 3
              '#70AD47', // Accent 4
            ]);
          },
        },
        {
          type: 'menuitem',
          text: 'Theme 2 - Green Earth',
          onAction: () => {
            applyThemeColors(editor, [
              '#548235', // Primary
              '#C55A11', // Secondary
              '#7F7F7F', // Accent 1
              '#BF8F00', // Accent 2
              '#2E75B6', // Accent 3
              '#9B9B9B', // Accent 4
            ]);
          },
        },
        {
          type: 'menuitem',
          text: 'Theme 3 - Colorful',
          onAction: () => {
            applyThemeColors(editor, [
              '#5B9BD5', // Primary
              '#ED7D31', // Secondary
              '#A5A5A5', // Accent 1
              '#FFC000', // Accent 2
              '#4472C4', // Accent 3
              '#70AD47', // Accent 4
            ]);
          },
        },
        {
          type: 'menuitem',
          text: 'Theme 4 - Red Accent',
          onAction: () => {
            applyThemeColors(editor, [
              '#C00000', // Primary
              '#384C7D', // Secondary
              '#938953', // Accent 1
              '#76923C', // Accent 2
              '#215967', // Accent 3
              '#7F497E', // Accent 4
            ]);
          },
        },
        {
          type: 'menuitem',
          text: 'Theme 5 - Dark',
          onAction: () => {
            applyThemeColors(editor, [
              '#1F4E79', // Primary
              '#843C0C', // Secondary
              '#525252', // Accent 1
              '#BF8F00', // Accent 2
              '#2E75B6', // Accent 3
              '#548235', // Accent 4
            ]);
          },
        },
      ];

      callback(items);
    },
  });

  // Register theme colors application buttons
  editor.ui.registry.addMenuButton('applythemecolor', {
    text: 'Apply Color',
    tooltip: 'Apply theme color to selection',
    icon: 'color-levels',
    fetch: (callback: any) => {
      const body = editor.getBody();
      const themeColorsAttr = body.getAttribute('data-theme-colors');
      let themeColors = ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'];

      if (themeColorsAttr) {
        try {
          themeColors = JSON.parse(themeColorsAttr);
        } catch (e) {
          console.error('Error parsing theme colors', e);
        }
      }

      const items = [
        {
          type: 'menuitem',
          text: 'Primary',
          onAction: () => {
            editor.execCommand('ForeColor', false, themeColors[0]);
          },
        },
        {
          type: 'menuitem',
          text: 'Secondary',
          onAction: () => {
            editor.execCommand('ForeColor', false, themeColors[1]);
          },
        },
        {
          type: 'menuitem',
          text: 'Accent 1',
          onAction: () => {
            editor.execCommand('ForeColor', false, themeColors[2]);
          },
        },
        {
          type: 'menuitem',
          text: 'Accent 2',
          onAction: () => {
            editor.execCommand('ForeColor', false, themeColors[3]);
          },
        },
        {
          type: 'menuitem',
          text: 'Accent 3',
          onAction: () => {
            editor.execCommand('ForeColor', false, themeColors[4]);
          },
        },
        {
          type: 'menuitem',
          text: 'Accent 4',
          onAction: () => {
            editor.execCommand('ForeColor', false, themeColors[5]);
          },
        },
      ];

      callback(items);
    },
  });
};

/**
 * Helper function to apply theme colors
 */
const applyThemeColors = (editor: any, colors: string[]): void => {
  // Store theme colors in editor body data attribute
  const body = editor.getBody();
  body.setAttribute('data-theme-colors', JSON.stringify(colors));

  // Create or update theme colors style
  const head = editor.getDoc().head;
  let themeStyle = head.querySelector('#mce-theme-colors');
  if (!themeStyle) {
    themeStyle = document.createElement('style');
    themeStyle.id = 'mce-theme-colors';
    head.appendChild(themeStyle);
  }

  // Set CSS variables for theme colors
  themeStyle.innerHTML = `
    :root {
      --theme-primary: ${colors[0]};
      --theme-secondary: ${colors[1]};
      --theme-accent1: ${colors[2]};
      --theme-accent2: ${colors[3]};
      --theme-accent3: ${colors[4]};
      --theme-accent4: ${colors[5]};
    }
    
    .mce-theme-primary { color: var(--theme-primary) !important; }
    .mce-theme-secondary { color: var(--theme-secondary) !important; }
    .mce-theme-accent1 { color: var(--theme-accent1) !important; }
    .mce-theme-accent2 { color: var(--theme-accent2) !important; }
    .mce-theme-accent3 { color: var(--theme-accent3) !important; }
    .mce-theme-accent4 { color: var(--theme-accent4) !important; }
    
    .mce-theme-bg-primary { background-color: var(--theme-primary) !important; }
    .mce-theme-bg-secondary { background-color: var(--theme-secondary) !important; }
    .mce-theme-bg-accent1 { background-color: var(--theme-accent1) !important; }
    .mce-theme-bg-accent2 { background-color: var(--theme-accent2) !important; }
    .mce-theme-bg-accent3 { background-color: var(--theme-accent3) !important; }
    .mce-theme-bg-accent4 { background-color: var(--theme-accent4) !important; }
  `;

  editor.notificationManager.open({
    text: 'Theme colors applied',
    type: 'success',
    timeout: 2000,
  });
};
