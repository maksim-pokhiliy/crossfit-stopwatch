import "@testing-library/jest-dom";

class LocalStorageMock implements Storage {
  private store: { [key: string]: string } = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }

  get length() {
    return Object.keys(this.store).length;
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});
