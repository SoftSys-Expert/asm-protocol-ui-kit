/**
 * testing.ts — sandboxed JSDOM для тестов компонентов без браузера.
 */
import { afterEach } from "vitest";
import type { JSDOM as JSDOMType } from "jsdom";
import { JSDOM } from "jsdom";

export interface DomSandbox {
  body: HTMLElement;
  cleanup: () => void;
}

const ACTIVE: DomSandbox[] = [];

export function sandbox(): DomSandbox {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    pretendToBeVisual: true,
  }) as unknown as JSDOMType;
  const prevDocument = globalThis.document;
  const prevWindow = globalThis.window;
  const prevNode = globalThis.Node;
  const prevElCtor = globalThis.HTMLElement;
  const prevInputCtor = globalThis.HTMLInputElement;
  const prevEventCtor = globalThis.Event;
  const prevCustomEvent = globalThis.CustomEvent;
  const prevKeyboardEventCtor = globalThis.KeyboardEvent;
  const prevFocusEventCtor = globalThis.FocusEvent;

  const win = dom.window as unknown as Window & typeof globalThis;
  globalThis.document = win.document;
  globalThis.window = win;
  globalThis.Node = win.Node;
  globalThis.HTMLElement = win.HTMLElement;
  globalThis.HTMLInputElement = win.HTMLInputElement;
  globalThis.Event = win.Event;
  globalThis.CustomEvent = win.CustomEvent;
  globalThis.KeyboardEvent = win.KeyboardEvent;
  globalThis.FocusEvent = win.FocusEvent;

  const box: DomSandbox = {
    body: win.document.body,
    cleanup: () => {
      globalThis.document = prevDocument;
      globalThis.window = prevWindow;
      globalThis.Node = prevNode;
      globalThis.HTMLElement = prevElCtor;
      globalThis.HTMLInputElement = prevInputCtor;
      globalThis.Event = prevEventCtor;
      globalThis.CustomEvent = prevCustomEvent;
      globalThis.KeyboardEvent = prevKeyboardEventCtor;
      globalThis.FocusEvent = prevFocusEventCtor;
      win.close();
    },
  };
  ACTIVE.push(box);
  return box;
}

/** Нажатие клавиши (упрощённый хелпер). */
export function press(el: Element, key: string): void {
  el.dispatchEvent(
    new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );
}

/** Клик по элементу. */
export function click(el: Element): void {
  el.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
}

afterEach(() => {
  while (ACTIVE.length) ACTIVE.pop()?.cleanup();
});
