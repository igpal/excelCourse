import { $ } from '../../core/dom';

export class Excel {
  constructor(selector, options) {
    this.$el = $(selector);
    this.components = options.components || [];
  }

  getRoot() {
    const $root = $.create('div', 'excel');

    this.components = this.components.map((Component) => {
      const $el = $.create('div', Component.className);
      const component = new Component($el);

      // // DEBUG
      // if (component.name) {
      //   console.log(component);
      //   window['c' + component.name] = component;
      // }

      $el.html(component.toHTML());
      $root.append($el);
      return component;
    });
    return $root;
  }
  render() {
    // afterbegin, afterend, beforeend, beforebegin
    // this.$el.insertAdjacentHTML('afterbegin', `<h1>Test</h1>`);
    this.$el.append(this.getRoot());

    this.components.forEach((component) => component.init());
  }
}
