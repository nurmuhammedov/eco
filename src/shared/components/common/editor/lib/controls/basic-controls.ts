import { BorderStyleType } from '../../model/types.ts';

/**
 * Registers basic editor controls like border styling
 */
export const registerBasicControls = (
  editor: any,
  options: {
    borderStyleOptions: Array<{ text: string; value: string }>;
    updateBorderStyle: (style: BorderStyleType, color: string) => void;
    currentBorderColor: string;
  },
): void => {
  const { borderStyleOptions, updateBorderStyle, currentBorderColor } = options;

  // Register page border button
  editor.ui.registry.addMenuButton('pageborder', {
    text: 'Border',
    tooltip: 'Set page border',
    icon: 'line',
    fetch: (callback: any) => {
      const items = borderStyleOptions.map((option) => ({
        type: 'menuitem',
        text: option.text,
        onAction: () => {
          updateBorderStyle(option.value as BorderStyleType, currentBorderColor);
        },
      }));

      callback(items);
    },
  });

  // Register border color picker in context menu
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
                  updateBorderStyle(editor.bodyElement.style.border ? 'medium' : 'none', data.bordercolor);
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
};
