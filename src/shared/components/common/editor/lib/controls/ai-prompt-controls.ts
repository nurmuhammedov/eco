// src/features/editor/lib/controls/aiPromptControls.ts

/**
 * Registers AI prompt assistant functionality
 */
export const registerAIPromptControls = (editor: any): void => {
  editor.ui.registry.addButton('aiprompt', {
    text: 'AI Assist',
    tooltip: 'Get AI assistance for your content',
    icon: 'accessibility-check',
    onAction: () => {
      editor.windowManager.open({
        title: 'AI Writing Assistant',
        body: {
          type: 'panel',
          items: [
            {
              type: 'input',
              name: 'prompt',
              label: 'What would you like help with?',
              placeholder: 'e.g., Rewrite this paragraph, Summarize this text, Fix grammar...',
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
            text: 'Generate',
            primary: true,
          },
        ],
        onSubmit: (api: any) => {
          const data = api.getData();
          // Here you would integrate with an AI API
          editor.notificationManager.open({
            text: 'AI processing: ' + data.prompt,
            type: 'info',
            timeout: 2000,
          });
          api.close();
        },
      });
    },
  });

  // Add AI prompt to menu
  editor.ui.registry.addMenuItem('aiprompt', {
    text: 'AI Writing Assistant',
    icon: 'accessibility-check',
    onAction: () => {
      // Trigger the AI prompt dialog
      editor.execCommand('mceAIPrompt');
    },
  });

  // Register command for AI prompt
  editor.addCommand('mceAIPrompt', () => {
    editor.execCommand('mceAIPromptButton');
  });
};
