// src/features/editor/lib/styleUtils.ts
import { CSSProperties, useMemo } from 'react';

/**
 * Custom hook for editor styling
 *
 * @param style Custom style props passed to the editor
 * @returns Computed styles for editor components
 */
export const useEditorStyles = (style?: CSSProperties) => {
  // Compute editor wrapper style
  const editorWrapperStyle = useMemo<CSSProperties>(() => {
    return {
      height: '100vh', // Full viewport height
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      ...style, // Apply custom styles
    };
  }, [style]);

  // Add additional style properties if needed
  const editorContentStyle = useMemo<string>(() => {
    return `
      body {
        min-height: calc(100vh - 150px);
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        padding: 20px;
        box-sizing: border-box;
      }
      .mce-content-body {
        flex: 1;
      }
      
      /* Word-like styling for tables */
      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 1em;
      }
      table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      table tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #f8f9fa;
      }
      
      /* Word-like styling for images */
      img {
        max-width: 100%;
        height: auto;
      }
      img.align-left {
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      img.align-right {
        float: right;
        margin-left: 10px;
        margin-bottom: 10px;
      }
      img.align-center {
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      img.border {
        border: 1px solid #ddd;
        padding: 5px;
      }
      img.shadow {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      /* Page break styling */
      .mce-pagebreak {
        border-top: 2px dashed #999;
        margin-top: 15px;
        margin-bottom: 15px;
        page-break-before: always;
        cursor: default;
      }
      
      /* Table of contents styling */
      .mce-toc {
        border: 1px solid #ddd;
        background: #f8f9fa;
        padding: 15px;
        margin: 15px 0;
      }
      .mce-toc h2 {
        margin-top: 0;
      }
      
      /* Footnotes styling */
      .mce-footnote {
        cursor: pointer;
        color: blue;
        text-decoration: none;
      }
      .mce-footnotes-separator {
        margin: 40px 0 10px;
        border: none;
        border-top: 1px solid #ddd;
      }
      .mce-footnotes-section {
        font-size: 0.9em;
      }
      .mce-footnotes-list {
        padding-left: 20px;
      }
      
      /* Track changes styling */
      .mce-tracked-change {
        background-color: #e6f3ff;
      }
      .mce-tracked-deletion {
        text-decoration: line-through;
        color: #ff0000;
      }
      .mce-tracked-insertion {
        background-color: #e6ffe6;
      }
      
      /* Comments styling */
      .mce-comment {
        background-color: #fff9c4;
      }
      
      /* Code blocks */
      pre {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 3px;
        font-family: monospace;
        white-space: pre-wrap;
      }
      
      /* Blockquote styling */
      blockquote {
        border-left: 3px solid #ddd;
        padding-left: 10px;
        margin-left: 20px;
        color: #666;
      }
    `;
  }, []);

  return {
    editorWrapperStyle,
    editorContentStyle,
  };
};
