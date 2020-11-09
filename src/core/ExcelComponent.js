import { DomListener } from './DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || '';
    this.emitter = options.emitter;
    this.subscribe = options.subscribe || [];
    this.store = options.store;
    this.unsubscribers = [];
    this.prepare();
  }
  // возвращает шаблон компонента
  toHTML() {
    return '';
  }

  $dispatch(action) {
    this.store.dispatch(action);
  }

  // Сюда приходят тллько изменения по тем полям, на которые мы подписались
  storeChanged() {}

  isWatching(key) {
    return this.subscribe.includes(key);
  }

  // Инициализируем компонент. Добавляем DOM слушатели
  init() {
    this.initDOMListeners();
  }
  // Удаляем компонен. Чистим слушатели
  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach((unsub) => unsub());
  }
  // Настраиваем компонент до init()
  prepare() {}
  // Уведомляем слушатели про событие event
  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }

  // Подписываемся на событие event
  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubscribers.push(unsub);
  }
}
