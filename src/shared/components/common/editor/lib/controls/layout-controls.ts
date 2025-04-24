/**
 * Registers controls for page layout
 */
export const registerLayoutControls = (editor: any): void => {
  // Register Word-like table styles button
  editor.ui.registry.addMenuButton('tablestyles', {
    text: 'Table Styles',
    tooltip: 'Apply table styles',
    icon: 'table',
    fetch: (callback: any) => {
      const table = editor.dom.getParent(editor.selection.getStart(), 'table');
      if (!table) {
        callback([]);
        return;
      }

      const items = [
        {
          type: 'menuitem',
          text: 'Plain Table',
          onAction: () => {
            editor.dom.removeClass(table, 'table-striped table-bordered table-hover table-condensed');
          },
        },
        {
          type: 'menuitem',
          text: 'Striped Rows',
          onAction: () => {
            editor.dom.removeClass(table, 'table-bordered table-hover table-condensed');
            editor.dom.addClass(table, 'table-striped');
          },
        },
        {
          type: 'menuitem',
          text: 'Bordered',
          onAction: () => {
            editor.dom.removeClass(table, 'table-striped table-hover table-condensed');
            editor.dom.addClass(table, 'table-bordered');
          },
        },
        {
          type: 'menuitem',
          text: 'Hover Effect',
          onAction: () => {
            editor.dom.removeClass(table, 'table-striped table-bordered table-condensed');
            editor.dom.addClass(table, 'table-hover');
          },
        },
        {
          type: 'menuitem',
          text: 'Condensed',
          onAction: () => {
            editor.dom.removeClass(table, 'table-striped table-bordered table-hover');
            editor.dom.addClass(table, 'table-condensed');
          },
        },
      ];

      callback(items);
    },
  });

  // Register Word-like page layout button
  editor.ui.registry.addMenuButton('pagelayout', {
    text: 'Layout',
    tooltip: 'Page layout settings',
    icon: 'resize',
    fetch: (callback: any) => {
      const items = [
        {
          type: 'menuitem',
          text: 'Page Margins',
          onAction: () => {
            editor.windowManager.open({
              title: 'Page Margins',
              body: {
                type: 'panel',
                items: [
                  {
                    type: 'input',
                    name: 'top',
                    label: 'Top (px)',
                    value: '20',
                  },
                  {
                    type: 'input',
                    name: 'right',
                    label: 'Right (px)',
                    value: '20',
                  },
                  {
                    type: 'input',
                    name: 'bottom',
                    label: 'Bottom (px)',
                    value: '20',
                  },
                  {
                    type: 'input',
                    name: 'left',
                    label: 'Left (px)',
                    value: '20',
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
              onSubmit: (api: any) => {
                const data = api.getData();

                // Apply margins to editor body
                const body = editor.getBody();
                body.style.paddingTop = `${data.top}px`;
                body.style.paddingRight = `${data.right}px`;
                body.style.paddingBottom = `${data.bottom}px`;
                body.style.paddingLeft = `${data.left}px`;

                api.close();
              },
            });
          },
        },
        {
          type: 'menuitem',
          text: 'Page Size',
          onAction: () => {
            editor.windowManager.open({
              title: 'Page Size',
              body: {
                type: 'panel',
                items: [
                  {
                    type: 'selectbox',
                    name: 'pageSize',
                    label: 'Page size',
                    items: [
                      { text: 'A4', value: 'a4' },
                      { text: 'Letter', value: 'letter' },
                      { text: 'Legal', value: 'legal' },
                      { text: 'Custom', value: 'custom' },
                    ],
                  },
                  {
                    type: 'input',
                    name: 'width',
                    label: 'Width (mm)',
                    value: '210',
                  },
                  {
                    type: 'input',
                    name: 'height',
                    label: 'Height (mm)',
                    value: '297',
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
              onSubmit: (api: any) => {
                const data = api.getData();

                let width = data.width;
                let height = data.height;

                // Standard paper sizes
                if (data.pageSize === 'a4') {
                  width = 210;
                  height = 297;
                } else if (data.pageSize === 'letter') {
                  width = 215.9;
                  height = 279.4;
                } else if (data.pageSize === 'legal') {
                  width = 215.9;
                  height = 355.6;
                }

                // Set content style for editor
                // This is just visual and would need additional handling for actual printing
                const oldStyle = editor.dom.get('mce-page-size');
                if (oldStyle) {
                  editor.dom.remove(oldStyle);
                }

                const style = editor.dom.create(
                  'style',
                  { id: 'mce-page-size', type: 'text/css' },
                  `.mce-content-body {
                    max-width: ${width}mm;
                    min-height: ${height}mm;
                    margin: 0 auto;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    background-color: white;
                  }`,
                );

                editor.getDoc().head.appendChild(style);

                api.close();
              },
            });
          },
        },
        {
          type: 'menuitem',
          text: 'Page Orientation',
          onAction: () => {
            editor.windowManager.open({
              title: 'Page Orientation',
              body: {
                type: 'panel',
                items: [
                  {
                    type: 'selectbox',
                    name: 'orientation',
                    label: 'Orientation',
                    items: [
                      { text: 'Portrait', value: 'portrait' },
                      { text: 'Landscape', value: 'landscape' },
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
              onSubmit: (api: any) => {
                const data = api.getData();

                // Change the orientation by swapping width and height
                const oldStyle = editor.dom.get('mce-page-orientation');
                if (oldStyle) {
                  editor.dom.remove(oldStyle);
                }

                const style = editor.dom.create('style', { id: 'mce-page-orientation', type: 'text/css' });

                if (data.orientation === 'landscape') {
                  style.innerHTML = `
                    .mce-content-body {
                      max-width: 297mm;
                      min-height: 210mm;
                    }
                  `;
                } else {
                  style.innerHTML = `
                    .mce-content-body {
                      max-width: 210mm;
                      min-height: 297mm;
                    }
                  `;
                }

                editor.getDoc().head.appendChild(style);

                api.close();
              },
            });
          },
        },
        {
          type: 'menuitem',
          text: 'Columns',
          onAction: () => {
            editor.windowManager.open({
              title: 'Text Columns',
              body: {
                type: 'panel',
                items: [
                  {
                    type: 'selectbox',
                    name: 'columns',
                    label: 'Number of columns',
                    items: [
                      { text: 'One (Normal)', value: '1' },
                      { text: 'Two', value: '2' },
                      { text: 'Three', value: '3' },
                    ],
                  },
                  {
                    type: 'input',
                    name: 'gap',
                    label: 'Gap between columns (px)',
                    value: '20',
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
              onSubmit: (api: any) => {
                const data = api.getData();

                // Get selected content or create a div around the cursor
                const selectedContent = editor.selection.getContent();
                let columnsHtml = '';

                if (selectedContent) {
                  // Wrap selected content in a columns div
                  columnsHtml = `<div class="mce-columns" style="column-count: ${data.columns}; column-gap: ${data.gap}px;">${selectedContent}</div>`;
                  editor.selection.setContent(columnsHtml);
                } else {
                  // Insert an empty columns div
                  columnsHtml = `<div class="mce-columns" style="column-count: ${data.columns}; column-gap: ${data.gap}px;"><p>Type your content here...</p></div>`;
                  editor.insertContent(columnsHtml);
                }

                api.close();
              },
            });
          },
        },
      ];

      callback(items);
    },
  });
};
