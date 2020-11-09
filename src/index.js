import { Excel } from './components/excel/Excel';
import { Formula } from './components/formula/Formula';
import { Header } from './components/header/Header';
import { Toolbar } from './components/toolbar/Toolbar';
import { Table } from './components/table/Table';
import './scss/index.scss';
import { createStore } from './core/createStore';
import { rootReduser } from './redux/roorReduser';
import { storage, debounce } from './core/utils';
import { initialState } from './redux/initialState';

const store = createStore(rootReduser, initialState);

const stateListener = debounce((state) => {
  console.log('App state', state);
  storage('excel-state', state);
}, 300);

store.subscribe(stateListener);

const excel = new Excel('#app', {
  components: [Header, Toolbar, Formula, Table],
  store,
});

excel.render();
