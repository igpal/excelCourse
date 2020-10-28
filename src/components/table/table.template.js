const CODES = {
  A: 65,
  Z: 90,
};

// function createCell(_, col) {
//   return `
//     <div
//       class="cell"
//       contenteditable
//       data-type="resizable"
//       data-col=${col}>
//       ${col}
//     </div>
//     `;
// }
function createCell(row) {
  return function(_, col) {
    return `
    <div 
      class="cell" 
      contenteditable 
      data-type="cell" 
      data-col=${col}
      data-id=${row}:${col}>
      ${row + ':' + col}
    </div>
    `;
  };
}

function toColumn(col, index) {
  return `
    <div class="column" data-type="resizable" data-col=${index}>
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>`;
}

function createRow(content, index = '') {
  const resize = index
    ? '<div class="row-resize" data-resize="row"></div>'
    : '';
  return `
    <div class="row" data-type="resizable">
    <div class="row-info">
      ${index}
      ${resize}
    </div>
    <div class="row-data">${content}</div>
    </div>
    `;
}

function toChart(_, index) {
  return String.fromCharCode(CODES.A + index);
}

export function createTable(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
    .fill('')
    .map(toChart)
    .map(toColumn)
    .join('');

  rows.push(createRow(cols));

  for (let index = 0; index < rowsCount; index++) {
    const cels = new Array(colsCount).fill('').map(createCell(index)).join('');

    rows.push(createRow(cels, index + 1));
  }

  return rows.join('');
}
