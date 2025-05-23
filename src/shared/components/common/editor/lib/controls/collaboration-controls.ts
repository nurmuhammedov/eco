/**
 * Registers controls for collaboration (comments, track changes)
 */
export const registerCollaborationControls = (editor: any): void => {
  // Track changes functionality (if available)
  if (editor.plugins.trackchanges) {
    editor.ui.registry.addToggleButton('trackchanges', {
      text: 'Track Changes',
      tooltip: 'Toggle Track Changes',
      icon: 'user',
      onAction: () => {
        const trackChangesPlugin = editor.plugins.trackchanges;
        if (trackChangesPlugin.isEnabled()) {
          trackChangesPlugin.disable();
        } else {
          trackChangesPlugin.enable();
        }
      },
      onSetup: (api: any) => {
        api.setActive(editor.plugins.trackchanges?.isEnabled() || false);
        return () => {};
      },
    });
  }

  // Comments functionality (if available)
  if (editor.plugins.comments) {
    editor.ui.registry.addButton('addcomment', {
      text: 'Comment',
      tooltip: 'Add Comment',
      icon: 'comment',
      onAction: () => {
        if (editor.selection.getContent()) {
          // Open comment dialog
          editor.windowManager.open({
            title: 'Add Comment',
            body: {
              type: 'panel',
              items: [
                {
                  type: 'textarea',
                  name: 'comment',
                  label: 'Comment text',
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
                text: 'Add Comment',
                primary: true,
              },
            ],
            onSubmit: (api: any) => {
              const data = api.getData();
              editor.plugins.comments.addComment(data.comment);
              api.close();
            },
          });
        } else {
          editor.notificationManager.open({
            text: 'Please select text to comment on',
            type: 'warning',
            timeout: 2000,
          });
        }
      },
    });
  }
};
