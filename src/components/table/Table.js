import { $ } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';

import { isCell, matrix, shoudResize, nextSelector } from './table.functions';
import { resizeHeandler } from './table.resize';
import { createTable } from './table.template';
import { TableSelection } from './TableSelectiom';
import * as actions from '../../redux/action';
import { defaultStyles } from '../../constants';
import { parse } from '../../core/parse';
export class Table extends ExcelComponent {
  static className = 'excel__table';
  toHTML() {
    return createTable(30, this.store.getState());
  }

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);

    this.$on('formula:input', (value) => {
      this.selection.current.attr('data-value', value).text(parse(value));
      this.updateTextInStore(value);
    });

    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value);
      this.$dispatch(
        actions.applyStyle({
          value,
          ids: this.selection.selectedIds,
        })
      );
    });

    this.$on('formula:done', () => this.selection.current.focus());
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles));
    console.log(styles);
  }

  async resizeTable(event) {
    try {
      const data = await resizeHeandler(event, this.$root);
      this.$dispatch(actions.tableResize(data));
    } catch (error) {
      console.warn(error);
    }
  }

  onMousedown(event) {
    if (shoudResize(event)) {
      this.resizeTable(event);
    } else if (isCell(event)) {
      const $target = $(event.target);

      if (event.shiftKey) {
        const $cells = matrix($target, this.selection.current).map((id) =>
          this.$root.find(`[data-id="${id}"]`)
        );
        this.selection.selectGroup($cells);
      } else {
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
    ];

    const { key } = event;
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }

  updateTextInStore(value) {
    this.$dispatch(
      actions.changeText({
        id: this.selection.current.id(),
        value,
      })
    );
  }

  onInput(event) {
    this.updateTextInStore($(event.target).text());
    // this.$emit('table:input', $(event.target));
  }
}
