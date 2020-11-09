import { defaultStyles } from '../../constants';
import { toInlineStyles } from '../../core/utils';
import { parse } from '../../core/parse';

const CODES = {
  A: 65,
  Z: 90,
};

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;
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
function toCell(state, row) {
  return function (_, col) {
    const id = `${row}:${col}`;
    const data = state.dataState[id];
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id],
    });
    return `
    <div 
      class="cell" 
      contenteditable 
      data-type="cell" 
      data-col=${col}
      data-id=${id}
      data-value="${data || ''}"
      style="${styles}; width:${getWidth(state.colState, col)}"
    >
      ${parse(data) || ''}
    </div>
    `;
  };
}

function toColumn({ col, index, width }) {
  return `
    <div 
      class="column" 
      data-type="resizable"
      data-col="${index}" 
      style="width:${width}"
      >
        ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>`;
}

function createRow(content, index, state) {
  const resize = index
    ? '<div class="row-resize" data-resize="row"></div>'
    : '';
  return `
    <div 
      class="row" 
      data-type="resizable" 
      data-row="${index}" 
      style="height:${getHeight(state, index)}">
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

function getWidth(state, index) {
  return (state[index] || DEFAULT_WIDTH) + 'px';
}
function getHeight(state, index) {
  return (state[index] || DEFAULT_HEIGHT) + 'px';
}

function widthWidthFrom(state) {
  return function (col, index) {
    return {
      col,
      index,
      width: getWidth(state.colState, index),
    };
  };
}

export function createTable(rowsCount = 15, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
    .fill('')
    .map(toChart)
    .map(widthWidthFrom(state))
    .map(toColumn)
    .join('');

  rows.push(createRow(cols, null, {}));

  for (let index = 0; index < rowsCount; index++) {
    const cels = new Array(colsCount)
      .fill('')
      .map(toCell(state, index))
      .join('');

    rows.push(createRow(cels, index + 1, state.rowState));
  }

  return rows.join('');
}
