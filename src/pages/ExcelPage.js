import { Page } from '../core/Page';
import { rootReduser } from '../redux/roorReduser';
import { storage, debounce } from '../core/utils';
import { normalizeInitialState } from '../redux/initialState';
import { Excel } from '../components/excel/Excel';
import { Formula } from '../components/formula/Formula';
import { Header } from '../components/header/Header';
import { Toolbar } from '../components/toolbar/Toolbar';
import { Table } from '../components/table/Table';
import { createStore } from '../core/createStore';

function storageName(param) {
  return 'excel:' + param;
}

export class ExcelPage extends Page {
  getRoot() {
    const params = this.params ? this.params : Date.now.toString();
    const state = storage(storageName(params));
    const store = createStore(rootReduser, normalizeInitialState(state));

    const stateListener = debounce((state) => {
      console.log('App state', state);
      storage(storageName(params), state);
    }, 300);

    store.subscribe(stateListener);

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
  }
}
