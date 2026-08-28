/**
 * dom.ts — общие DOM-хелперы для headless-ядер.
 * Ничего визуального: только создание элементов, классы, события.
 */

/** Создать элемент с тегом, классами и атрибутами (aria-*, data-* и т.п.). */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs: Record<string, string> = {}
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== "") el.setAttribute(k, v);
  }
  return el;
}

/** Проверить, что элемент смонтирован в document. */
export function isConnected(el: Element): boolean {
  return el.isConnected;
}

/** Уникальные id для aria-связей (tab→tabpanel, label→input и т.д.). */
let idSeq = 0;
export function uid(prefix: string): string {
  idSeq += 1;
  return `${prefix}-${idSeq}`;
}

/** Диспатч кастомного события (ui:change, ui:select и т.п.). */
export function emit<T>(el: Element, name: string, detail?: T): void {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/** Найти первого родителя с указанным селектором. */
export function closest(el: Element, selector: string): Element | null {
  return el.closest(selector);
}
