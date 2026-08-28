import { h, uid, emit } from "./dom";

/**
 * Table — headless-ядро таблицы с сортировкой по клику на заголовок.
 * A11y: role=table/grid не нужен (нативный <table>), aria-sort на th.
 */
export interface TableCol<T> {
  key: keyof T & string;
  header: string;
  /** Числовая колонка (выравнивание/сортировка). */
  numeric?: boolean;
  render?: (row: T) => string;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: TableCol<T>[];
  rows: T[];
  caption?: string;
  /** Инициализировать пустым без сортировки. */
  onSortChange?: (key: string, dir: "asc" | "desc") => void;
}

export interface TableApi<T> {
  el: HTMLTableElement;
  setRows: (rows: T[]) => void;
  sortBy: (key: string, dir?: "asc" | "desc") => void;
  destroy: () => void;
}

export function createTable<T extends Record<string, unknown>>(props: TableProps<T>): TableApi<T> {
  const p = { ...props };
  const el = h("table", "ui-table");
  if (p.caption) {
    const cap = h("caption", "ui-table__caption");
    cap.textContent = p.caption;
    el.appendChild(cap);
  }
  const thead = h("thead", "ui-table__head");
  const trh = h("tr", "ui-table__row");
  for (const col of p.columns) {
    const th = h("th", "ui-table__th", { scope: "col" });
    th.textContent = col.header;
    th.dataset.key = col.key;
    if (col.numeric) th.dataset.numeric = "";
    if (col.sortable !== false) {
      th.setAttribute("aria-sort", "none");
      th.classList.add("ui-table__th--sortable");
      th.tabIndex = 0;
    }
    trh.appendChild(th);
  }
  thead.appendChild(trh);
  el.appendChild(thead);
  const tbody = h("tbody", "ui-table__body");
  el.appendChild(tbody);

  let sortKey = "";
  let sortDir: "asc" | "desc" = "asc";

  function cellText(row: T, col: TableCol<T>): string {
    return col.render ? col.render(row) : String(row[col.key] ?? "");
  }

  function sortedRows(): T[] {
    if (!sortKey) return p.rows;
    const col = p.columns.find((c) => c.key === sortKey);
    if (!col) return p.rows;
    const copy = [...p.rows];
    copy.sort((a, b) => {
      const av = cellText(a, col);
      const bv = cellText(b, col);
      const an = Number(av);
      const bn = Number(bv);
      const cmp =
        !Number.isNaN(an) && !Number.isNaN(bn) && av !== "" && bv !== ""
          ? an - bn
          : av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }

  function renderBody() {
    tbody.innerHTML = "";
    for (const row of sortedRows()) {
      const tr = h("tr", "ui-table__row");
      for (const col of p.columns) {
        const td = h("td", "ui-table__td");
        if (col.numeric) td.dataset.numeric = "";
        td.textContent = cellText(row, col);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
  renderBody();

  function applySortAttrs() {
    for (const th of Array.from(thead.querySelectorAll("th"))) {
      const isCur = th.dataset.key === sortKey && th.classList.contains("ui-table__th--sortable");
      th.setAttribute("aria-sort", isCur ? (sortDir === "asc" ? "ascending" : "descending") : "none");
      th.classList.toggle("ui-table__th--sorted", isCur);
    }
  }

  function sortBy(key: string, dir?: "asc" | "desc") {
    const col = p.columns.find((c) => c.key === key);
    if (!col || col.sortable === false) return;
    if (sortKey === key) sortDir = sortDir === "asc" ? "desc" : "asc";
    else {
      sortKey = key;
      sortDir = "asc";
    }
    if (dir) sortDir = dir;
    renderBody();
    applySortAttrs();
    p.onSortChange?.(key, sortDir);
    emit(el, "ui:sort", { key, dir: sortDir });
  }

  const onActivate = (e: Event) => {
    const th = (e.target as Element).closest("th.ui-table__th--sortable") as HTMLTableCellElement | null;
    if (th && el.contains(th)) sortBy(th.dataset.key ?? "");
  };
  el.addEventListener("click", onActivate);
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const th = (e.target as Element).closest("th.ui-table__th--sortable") as HTMLTableCellElement | null;
    if (th && el.contains(th)) {
      e.preventDefault();
      sortBy(th.dataset.key ?? "");
    }
  };
  el.addEventListener("keydown", onKey);

  return {
    el,
    setRows(rows) {
      p.rows = rows;
      renderBody();
    },
    sortBy,
    destroy() {
      el.removeEventListener("click", onActivate);
      el.removeEventListener("keydown", onKey);
    },
  };
}
