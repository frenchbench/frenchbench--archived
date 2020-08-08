export class Cache {
  constructor() {
    this.items = {};
  }

  getItem(key, defaultValue = null) {
    return key in this.items ? this.items[key] : defaultValue;
  }

  setItem(key, item) {
    return this.items[key] = item;
  }

  delItem(key) {
    delete this.items[key];
  }

  clear() {
    this.items = {};
  }
}