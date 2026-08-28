import { h, emit } from "./dom";

/**
 * GradesTable — headless-ядро таблицы оценок.
 * Композиция Table: урок / попытки / exit / такты. Только факты, без цветов-оценок.
 */
export interface GradeRow {
  lesson: string;
  attempts: number;
  exitCode: number;
  cycles: number;
}

export interface GradesTableProps {
  rows: GradeRow[];
  caption?: string;
}

export interface GradesTableApi {
  el: HTMLTableElement;
  setRows: (rows: GradeRow[]) => void;
  destroy: () => void;
}

export function createGradesTable(props: GradesTableProps): GradesTableApi {
  const p = { caption: "GRADES", ...props };

  function exitTone(row: GradeRow): string {
    return row.exitCode === 0 ? "ok" : "fail";
  }

  const table = h("table", "ui-grades ui-table");
  if (p.caption) {
    const cap = h("caption", "ui-table__caption");
    cap.textContent = p.caption;
    table.appendChild(cap);
  }
  const thead = h("thead");
  const hr = h("tr");
  for (const th of ["lesson", "attempts", "exit", "cycles"]) {
    const el = h("th", "ui-table__th", { scope: "col" });
    el.textContent = th;
    hr.appendChild(el);
  }
  thead.appendChild(hr);
  table.appendChild(thead);
  const tbody = h("tbody");
  table.appendChild(tbody);

  function render() {
    tbody.innerHTML = "";
    for (const row of p.rows) {
      const tr = h("tr", "ui-table__row");
      const tdL = h("td", "ui-grades__lesson");
      tdL.textContent = row.lesson;
      const tdA = h("td", "ui-table__td");
      tdA.dataset.numeric = "";
      tdA.textContent = String(row.attempts);
      const tdE = h("td", "ui-grades__exit");
      tdE.textContent = String(row.exitCode);
      tdE.dataset.exit = exitTone(row);
      const tdC = h("td", "ui-table__td");
      tdC.dataset.numeric = "";
      tdC.textContent = String(row.cycles);
      tr.append(tdL, tdA, tdE, tdC);
      tbody.appendChild(tr);
    }
  }
  render();

  return {
    el: table,
    setRows(rows) {
      p.rows = rows;
      render();
      emit(table, "ui:change", {});
    },
    destroy() {
      /* нет листенеров */
    },
  };
}
