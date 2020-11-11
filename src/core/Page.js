export class Page {
  constructor(params) {
    this.params = params;
  }
  getRoot() {
    throw new Error('Method "getRoot" shoot be implemented');
  }

  afterRender() {}

  destroy() {}
}
