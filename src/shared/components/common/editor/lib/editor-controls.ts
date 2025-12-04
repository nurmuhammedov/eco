import { BorderStyleType } from '../model/types'
import {
  registerAIPromptControls,
  registerBasicControls,
  registerCollaborationControls,
  registerDocumentStructureControls,
  registerExportControls,
  registerFormattingControls,
  registerLayoutControls,
  registerReferenceControls,
  registerVisualControls,
} from './controls'

interface EditorControlsOptions {
  borderStyleOptions: Array<{ text: string; value: string }>
  updateBorderStyle: (style: BorderStyleType, color: string) => void
  currentBorderColor: string
  customButtons?: Array<{
    name: string
    text: string
    icon?: string
    tooltip?: string
    onAction: (editor: any) => void
  }>
  enablePromptAI?: boolean
}

/**
 * Registers custom controls and extensions for the TinyMCE editor
 *
 * @param editor TinyMCE editor instance
 * @param options Configuration options for custom controls
 */
export const registerCustomControls = (editor: any, options: EditorControlsOptions): void => {
  const {
    borderStyleOptions,
    updateBorderStyle,
    currentBorderColor,
    customButtons = [],
    enablePromptAI = false,
  } = options

  // Register basic controls
  registerBasicControls(editor, { borderStyleOptions, updateBorderStyle, currentBorderColor })

  // Register document export buttons
  registerExportControls(editor)

  // Register AI prompt functionality if enabled
  if (enablePromptAI) {
    registerAIPromptControls(editor)
  }

  // Register custom buttons
  customButtons.forEach((button) => {
    editor.ui.registry.addButton(button.name, {
      text: button.text,
      tooltip: button.tooltip || button.text,
      icon: button.icon,
      onAction: () => button.onAction(editor),
    })
  })

  // Register document structure controls
  registerDocumentStructureControls(editor)

  // Register collaboration controls
  registerCollaborationControls(editor)

  // Register citation and reference controls
  registerReferenceControls(editor)

  // Register formatting controls
  registerFormattingControls(editor)

  // Register layout controls
  registerLayoutControls(editor)

  // Register visual elements controls
  registerVisualControls(editor)
}
