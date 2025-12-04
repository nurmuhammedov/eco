// src/features/editor/lib/borderUtils.ts
import { BorderStyleType } from '../model/types'

/**
 * Border style options for TinyMCE editor
 */
export const BORDER_STYLE_OPTIONS = [
  { text: 'None', value: 'none' },
  { text: 'Thin', value: 'thin' },
  { text: 'Medium', value: 'medium' },
  { text: 'Thick', value: 'thick' },
  { text: 'Double', value: 'double' },
  { text: 'Dashed', value: 'dashed' },
  { text: 'Dotted', value: 'dotted' },
]

/**
 * Get CSS border string based on style and color
 * @param style Border style type
 * @param color Border color in hex format
 * @returns CSS border style string
 */
export const getBorderStyle = (style?: BorderStyleType, color: string = '#000000'): string => {
  switch (style) {
    case 'thin':
      return `1px solid ${color}`
    case 'medium':
      return `2px solid ${color}`
    case 'thick':
      return `3px solid ${color}`
    case 'double':
      return `4px double ${color}`
    case 'dashed':
      return `2px dashed ${color}`
    case 'dotted':
      return `2px dotted ${color}`
    case 'none':
    default:
      return 'none'
  }
}
