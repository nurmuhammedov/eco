/**
 * Registers document export functionality
 */
export const registerExportControls = (editor: any): void => {
  editor.ui.registry.addButton('exportdocx', {
    text: 'Export DOCX',
    tooltip: 'Export as Word Document',
    icon: 'document-properties',
    onAction: () => {
      editor.notificationManager.open({
        text: 'Exporting document as DOCX...',
        type: 'info',
        timeout: 2000,
      })
    },
  })

  editor.ui.registry.addButton('exportpdf', {
    text: 'Export PDF',
    tooltip: 'Export as PDF Document',
    icon: 'document-properties',
    onAction: () => {
      editor.notificationManager.open({
        text: 'Exporting document as PDF...',
        type: 'info',
        timeout: 2000,
      })
    },
  })
}
