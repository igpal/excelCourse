import { $ } from '../../core/dom';
import { ActiveRoute } from './ActiveRoute';
export class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('Selector is not provided in Router');
    }
    this.$placeholder = $(selector);
    this.routes = routes;
    this.changePageHeandler = this.changePageHeandler.bind(this);
    this.page = null;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', this.changePageHeandler);
    this.changePageHeandler();
  }

  changePageHeandler() {
    if (this.page) {
      this.page.destroy();
    }

    this.$placeholder.clear();
    const Page = ActiveRoute.path.includes('excel')
      ? this.routes.excel
      : this.routes.dashboard;

    this.page = new Page(ActiveRoute.param);

    this.$placeholder.append(this.page.getRoot());
    this.page.afterRender();
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePageHeandler);
  }
}
