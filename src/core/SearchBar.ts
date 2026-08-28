import { h, uid, emit } from "./dom";
import { createTextInput, TextInputApi } from "./TextInput";

/**
 * SearchBar — headless-ядро поиска: инпут + результаты.
 * Поведение: `/` фокус из любого места, стрелки по результатам, Enter — выбор.
 * A11y: role=combobox + listbox (расширенный patthern), aria-activedescendant.
 */
export interface SearchResult {
  id: string;
  title: string;
  /** Тип результата: lesson / term / module. */
  type: string;
}

export interface SearchBarProps {
  placeholder?: string;
  /** Поиск по строке; возвращает результаты (синхронно). */
  onSearch?: (query: string) => SearchResult[];
  onSelect?: (result: SearchResult) => void;
}

export interface SearchBarApi {
  el: HTMLElement;
  input: HTMLInputElement;
  focus: () => void;
  destroy: () => void;
}

export function createSearchBar(props: SearchBarProps): SearchBarApi {
  const p = { placeholder: "Search… /", ...props };
  const id = uid("search");
  const el = h("div", "ui-search", { role: "search" });
  const input = h("input", "ui-search__input", {
    role: "combobox",
    "aria-expanded": "false",
    "aria-controls": `${id}-results`,
    "aria-autocomplete": "list",
    type: "text",
  });
  input.placeholder = p.placeholder;
  const list = h("ul", "ui-search__results", { role: "listbox", hidden: "" });
  list.id = `${id}-results`;
  el.append(input, list);

  let results: SearchResult[] = [];
  let activeIdx = -1;

  function renderResults() {
    list.innerHTML = "";
    if (results.length === 0) {
      list.setAttribute("hidden", "");
      el.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      return;
    }
    list.removeAttribute("hidden");
    el.setAttribute("aria-expanded", "true");
    for (const r of results) {
      const li = h("li", "ui-search__result", { role: "option", id: `${id}-opt-${r.id}` });
      li.dataset.id = r.id;
      const type = h("span", "ui-search__result-type");
      type.textContent = r.type;
      const title = h("span", "ui-search__result-title");
      title.textContent = r.title;
      li.append(type, title);
      list.appendChild(li);
    }
    const open = results.length > 0;
    if (open) list.removeAttribute("hidden");
    else list.setAttribute("hidden", "");
    input.setAttribute("aria-expanded", String(open));
    applyActive();
  }
  function applyActive() {
    const lis = Array.from(list.querySelectorAll('[role="option"]'));
    lis.forEach((li, i) => {
      const act = i === activeIdx;
      li.setAttribute("aria-selected", String(act));
      li.classList.toggle("ui-search__result--active", act);
    });
    const act = lis[activeIdx];
    if (act) input.setAttribute("aria-activedescendant", act.id);
    else input.removeAttribute("aria-activedescendant");
  }

  function search(q: string) {
    results = p.onSearch?.(q) ?? [];
    activeIdx = results.length ? 0 : -1;
    renderResults();
    emit(el, "ui:search", { query: q });
  }

  function choose(idx: number) {
    const r = results[idx];
    if (!r) return;
    p.onSelect?.(r);
    emit(el, "ui:select", { result: r });
    results = [];
    renderResults();
    input.value = "";
  }

  const onInput = () => search(input.value);
  input.addEventListener("input", onInput);

  const onKey = (e: KeyboardEvent) => {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % results.length;
      applyActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + results.length) % results.length;
      applyActive();
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(activeIdx);
    } else if (e.key === "Escape") {
      results = [];
      renderResults();
    }
  };
  input.addEventListener("keydown", onKey);

  const onClick = (e: Event) => {
    const li = (e.target as Element).closest('[role="option"]') as HTMLElement | null;
    if (li && list.contains(li)) {
      choose(results.findIndex((r) => r.id === li.dataset.id));
    }
  };
  list.addEventListener("click", onClick);

  // `/` фокусирует поиск из любого места документа.
  const onDocKey = (e: KeyboardEvent) => {
    if (
      e.key === "/" &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      input.focus();
    }
  };
  document.addEventListener("keydown", onDocKey);

  return {
    el,
    input,
    focus: () => input.focus(),
    destroy() {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKey);
      list.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onDocKey);
    },
  };
}

// Реэкспорт для удобства (SearchBar может включать TextInput).
export { createTextInput, type TextInputApi };
