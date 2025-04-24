/**
 * Registers controls for visual elements like SmartArt
 */
export const registerVisualControls = (editor: any): void => {
  // Register Word-like SmartArt button
  editor.ui.registry.addButton('smartart', {
    text: 'SmartArt',
    tooltip: 'Insert SmartArt graphic',
    icon: 'diagram-tree',
    onAction: () => {
      editor.windowManager.open({
        title: 'Insert SmartArt',
        body: {
          type: 'panel',
          items: [
            {
              type: 'selectbox',
              name: 'diagramType',
              label: 'Diagram type',
              items: [
                { text: 'Process', value: 'process' },
                { text: 'Cycle', value: 'cycle' },
                { text: 'Hierarchy', value: 'hierarchy' },
                { text: 'Relationship', value: 'relationship' },
                { text: 'Matrix', value: 'matrix' },
                { text: 'Pyramid', value: 'pyramid' },
              ],
            },
            {
              type: 'input',
              name: 'itemCount',
              label: 'Number of items',
              inputMode: 'numeric',
              value: '3',
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
            text: 'Insert',
            primary: true,
          },
        ],
        onSubmit: (api: any) => {
          const data = api.getData();
          const diagramType = data.diagramType;
          const itemCount = parseInt(data.itemCount, 10) || 3;

          // Generate appropriate SmartArt HTML based on selection
          let smartArtHtml = '';

          switch (diagramType) {
            case 'process':
              smartArtHtml = generateProcessDiagram(itemCount);
              break;
            case 'cycle':
              smartArtHtml = generateCycleDiagram(itemCount);
              break;
            case 'hierarchy':
              smartArtHtml = generateHierarchyDiagram(itemCount);
              break;
            case 'relationship':
              smartArtHtml = generateRelationshipDiagram(itemCount);
              break;
            case 'matrix':
              smartArtHtml = generateMatrixDiagram(itemCount);
              break;
            case 'pyramid':
              smartArtHtml = generatePyramidDiagram(itemCount);
              break;
            default:
              smartArtHtml = generateProcessDiagram(itemCount);
          }

          editor.insertContent(smartArtHtml);
          api.close();
        },
      });
    },
  });
};

/**
 * Generate process diagram HTML
 */
const generateProcessDiagram = (itemCount: number): string => {
  let items = '';
  for (let i = 1; i <= itemCount; i++) {
    items += `
      <div class="process-item">
        <div class="process-item-inner">
          <h3>Step ${i}</h3>
          <p>Description for step ${i}</p>
        </div>
        ${i < itemCount ? '<div class="process-arrow">→</div>' : ''}
      </div>
    `;
  }

  return `
    <div class="mce-smartart mce-process-diagram" contenteditable="true">
      <div class="process-container">
        ${items}
      </div>
      <style>
        .mce-process-diagram {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          background: #f9f9f9;
        }
        .process-container {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .process-item {
          display: flex;
          align-items: center;
          margin: 5px;
        }
        .process-item-inner {
          min-width: 150px;
          min-height: 80px;
          padding: 10px;
          background: #4472C4;
          color: white;
          border-radius: 5px;
          text-align: center;
        }
        .process-item-inner h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
        }
        .process-item-inner p {
          margin: 0;
          font-size: 14px;
        }
        .process-arrow {
          font-size: 24px;
          margin: 0 10px;
          color: #666;
        }
      </style>
    </div>
  `;
};

/**
 * Generate cycle diagram HTML
 */
const generateCycleDiagram = (itemCount: number): string => {
  let items = '';
  const degreeIncrement = 360 / itemCount;

  for (let i = 1; i <= itemCount; i++) {
    items += `
      <div class="cycle-item" style="transform: rotate(${(i - 1) * degreeIncrement}deg) translate(120px) rotate(-${(i - 1) * degreeIncrement}deg);">
        <div class="cycle-item-inner">
          <h3>Step ${i}</h3>
          <p>Description</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="mce-smartart mce-cycle-diagram" contenteditable="true">
      <div class="cycle-container">
        ${items}
        <div class="cycle-center"></div>
      </div>
      <style>
        .mce-cycle-diagram {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          background: #f9f9f9;
        }
        .cycle-container {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 40px auto;
        }
        .cycle-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: #4472C4;
          border-radius: 50%;
        }
        .cycle-item {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 80px;
        }
        .cycle-item-inner {
          width: 100%;
          height: 100%;
          background: #4472C4;
          color: white;
          border-radius: 5px;
          text-align: center;
          padding: 5px;
        }
        .cycle-item-inner h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }
        .cycle-item-inner p {
          margin: 0;
          font-size: 12px;
        }
      </style>
    </div>
  `;
};

/**
 * Generate hierarchy diagram HTML
 */
const generateHierarchyDiagram = (itemCount: number): string => {
  let childItems = '';
  for (let i = 1; i <= itemCount; i++) {
    childItems += `
      <div class="hierarchy-child">
        <div class="hierarchy-item">
          <h3>Item ${i}</h3>
          <p>Description</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="mce-smartart mce-hierarchy-diagram" contenteditable="true">
      <div class="hierarchy-container">
        <div class="hierarchy-parent">
          <div class="hierarchy-item">
            <h3>Main Topic</h3>
            <p>Description</p>
          </div>
        </div>
        <div class="hierarchy-connector"></div>
        <div class="hierarchy-children">
          ${childItems}
        </div>
      </div>
      <style>
        .mce-hierarchy-diagram {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          background: #f9f9f9;
        }
        .hierarchy-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hierarchy-parent {
          margin-bottom: 20px;
        }
        .hierarchy-connector {
          width: 2px;
          height: 20px;
          background: #666;
          margin-bottom: 10px;
        }
        .hierarchy-children {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hierarchy-child {
          margin: 10px;
          position: relative;
        }
        .hierarchy-child:before {
          content: '';
          position: absolute;
          top: -20px;
          left: 50%;
          width: 2px;
          height: 10px;
          background: #666;
        }
        .hierarchy-item {
          min-width: 120px;
          min-height: 60px;
          padding: 10px;
          background: #4472C4;
          color: white;
          border-radius: 5px;
          text-align: center;
        }
        .hierarchy-item h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }
        .hierarchy-item p {
          margin: 0;
          font-size: 12px;
        }
      </style>
    </div>
  `;
};

/**
 * Generate relationship diagram HTML
 */
const generateRelationshipDiagram = (itemCount: number): string => {
  // Simplified relationship diagram - just shows items around a central item
  let items = '';
  const degreeIncrement = 360 / itemCount;

  for (let i = 1; i <= itemCount; i++) {
    const angle = (i - 1) * degreeIncrement;
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians) * 120;
    const y = Math.sin(radians) * 120;

    items += `
      <div class="relationship-item" style="transform: translate(${x}px, ${y}px);">
        <div class="relationship-item-inner">
          <h3>Item ${i}</h3>
          <p>Description</p>
        </div>
        <div class="relationship-line" style="width: ${Math.sqrt(x * x + y * y)}px; transform: rotate(${angle}deg) translateX(-50%);"></div>
      </div>
    `;
  }

  return `
    <div class="mce-smartart mce-relationship-diagram" contenteditable="true">
      <div class="relationship-container">
        <div class="relationship-center">
          <h3>Central Idea</h3>
          <p>Main concept</p>
        </div>
        ${items}
      </div>
      <style>
        .mce-relationship-diagram {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          background: #f9f9f9;
          overflow: hidden;
        }
        .relationship-container {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 40px auto;
        }
        .relationship-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: #4472C4;
          color: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          z-index: 2;
        }
        .relationship-center h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }
        .relationship-center p {
          margin: 0;
          font-size: 12px;
        }
        .relationship-item {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 60px;
        }
        .relationship-item-inner {
          width: 100%;
          height: 100%;
          background: #70AD47;
          color: white;
          border-radius: 5px;
          text-align: center;
          padding: 5px;
          z-index: 2;
          position: relative;
        }
        .relationship-item-inner h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }
        .relationship-item-inner p {
          margin: 0;
          font-size: 12px;
        }
        .relationship-line {
          position: absolute;
          top: 50%;
          left: 0;
          height: 2px;
          background: #666;
          transform-origin: left;
          z-index: 1;
        }
      </style>
    </div>
  `;
};

/**
 * Generate matrix diagram HTML
 */
const generateMatrixDiagram = (itemCount: number): string => {
  // For matrix, we'll make a square grid if possible
  const size = Math.ceil(Math.sqrt(itemCount));
  let cells = '';

  for (let i = 0; i < size; i++) {
    let row = '';
    for (let j = 0; j < size; j++) {
      const index = i * size + j + 1;
      if (index <= itemCount) {
        row += `
          <div class="matrix-cell">
            <h3>Item ${index}</h3>
            <p>Description</p>
          </div>
        `;
      } else {
        row += `<div class="matrix-cell matrix-empty"></div>`;
      }
    }
    cells += `<div class="matrix-row">${row}</div>`;
  }

  return `
    <div class="mce-smartart mce-matrix-diagram" contenteditable="true">
      <div class="matrix-container">
        ${cells}
      </div>
      <style>
        .mce-matrix-diagram {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          background: #f9f9f9;
        }
        .matrix-container {
          display: flex;
          flex-direction: column;
        }
        .matrix-row {
          display: flex;
        }
        .matrix-cell {
          width: 120px;
          height: 90px;
          margin: 5px;
          padding: 10px;
          background: #4472C4;
          color: white;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .matrix-empty {
          background: #f0f0f0;
        }
        .matrix-cell h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }
        .matrix-cell p {
          margin: 0;
          font-size: 12px;
        }
      </style>
    </div>
  `;
};

/**
 * Generate pyramid diagram HTML
 */
const generatePyramidDiagram = (itemCount: number): string => {
  // Create a pyramid with layers
  let layers = '';
  const maxWidth = 80;

  for (let i = 1; i <= itemCount; i++) {
    const width = maxWidth - (i - 1) * (maxWidth / itemCount);
    layers += `
      <div class="pyramid-layer" style="width: ${width}%;">
        <div class="pyramid-item">
          <h3>Level ${itemCount - i + 1}</h3>
          <p>Description</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="mce-smartart mce-pyramid-diagram" contenteditable="true">
      <div class="pyramid-container">
        ${layers}
      </div>
      <style>
        .mce-pyramid-diagram {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ddd;
          background: #f9f9f9;
        }
        .pyramid-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pyramid-layer {
          margin-bottom: 2px;
        }
        .pyramid-item {
          background: #4472C4;
          color: white;
          text-align: center;
          padding: 10px;
          min-height: 40px;
        }
        .pyramid-item h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }
        .pyramid-item p {
          margin: 0;
          font-size: 12px;
        }
      </style>
    </div>
  `;
};
