const CODES = {
  A: 65,
  Z: 90,
};

function createCell() {
  return `
    <div class="cell" contenteditable></div>
    `;
}

function toColumn(col) {
  return `
    <div class="column">${col}</div>`;
}

function createRow(content, index = '') {
  return `
    <div class="row">
    <div class="row-info">${index}</div>
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
    const cels = new Array(colsCount).fill('').map(createCell).join('');

    rows.push(createRow(cels, index + 1));
  }

  return rows.join('');
}
