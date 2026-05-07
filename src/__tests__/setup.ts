import "@testing-library/jest-dom";

// localStorage stub for jsdom
const localStorageStore: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => localStorageStore[k] ?? null,
    setItem: (k: string, v: string) => { localStorageStore[k] = v; },
    removeItem: (k: string) => { delete localStorageStore[k]; },
    clear: () => { Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]); },
  },
  writable: true,
});
