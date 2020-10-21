import { ExcelComponent } from '../../core/ExcelComponent';
import { shoudResize } from './table.functions';
import { resizeHeandler } from './table.resize';
import { createTable } from './table.template';

export class Table extends ExcelComponent {
  static className = 'excel__table';
  toHTML() {
    return createTable(30);
  }

  constructor($root) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
    });
  }

  onMousedown(event) {
    if (shoudResize(event)) {
      resizeHeandler(event, this.$root);
    }
  }
}
