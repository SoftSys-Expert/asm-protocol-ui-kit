import { h, emit } from "./dom";

/**
 * TraceVisualizer — headless-ядро пошаговой трассировки регистров.
 * Таблица рег/значение по шагам; изменённые значения подсвечены (класс).
 * Навигация: prev/next шаг, стрелки.
 */
export interface TraceStep {
  /** Значения регистров на шаге (только изменения или полный слепок). */
  regs: Record<string, string>;
  /** Подпись шага (например дизассемблер). */
  label?: string;
}

export interface TraceVisualizerProps {
  steps: TraceStep[];
  /** Полный список регистров (порядок строк). */
  regOrder?: string[];
  onStep?: (index: number) => void;
}

export interface TraceVisualizerApi {
  el: HTMLElement;
  next: () => void;
  prev: () => void;
  setStep: (i: number) => void;
  getStep: () => number;
  destroy: () => void;
}

export function createTraceVisualizer(props: TraceVisualizerProps): TraceVisualizerApi {
  const p = { ...props };
  const regs =
    p.regOrder ??
    Array.from(new Set(p.steps.flatMap((s) => Object.keys(s.regs))));
  const el = h("div", "ui-trace", { role: "group", "aria-label": "Execution trace" });
  const head = h("div", "ui-trace__head");
  const prevBtn = h("button", "ui-trace__btn", { "aria-label": "Previous step" });
  prevBtn.type = "button";
  prevBtn.textContent = "‹ prev";
  const counter = h("span", "ui-trace__counter");
  const nextBtn = h("button", "ui-trace__btn", { "aria-label": "Next step" });
  nextBtn.type = "button";
  nextBtn.textContent = "next ›";
  const stepLabel = h("span", "ui-trace__steplabel");
  head.append(prevBtn, counter, nextBtn, stepLabel);
  const table = h("table", "ui-trace__table");
  const thead = h("thead");
  const hr = h("tr");
  const thReg = h("th", "", { scope: "col" });
  thReg.textContent = "reg";
  hr.appendChild(thReg);
  const thVal = h("th", "", { scope: "col" });
  thVal.textContent = "value";
  hr.appendChild(thVal);
  thead.appendChild(hr);
  table.appendChild(thead);
  const tbody = h("tbody");
  table.appendChild(tbody);
  el.append(head, table);

  let step = 0;

  /** Слепок регистров на шаге i (наследование от предыдущих шагей). */
  function snapshot(i: number): Record<string, string> {
    const acc: Record<string, string> = {};
    for (let k = 0; k <= i && k < p.steps.length; k++) {
      Object.assign(acc, p.steps[k].regs);
    }
    return acc;
  }

  function apply() {
    step = Math.max(0, Math.min(step, Math.max(0, p.steps.length - 1)));
    counter.textContent = p.steps.length ? `step ${step + 1}/${p.steps.length}` : "no steps";
    stepLabel.textContent = p.steps[step]?.label ?? "";
    prevBtn.setAttribute("aria-disabled", String(step === 0));
    nextBtn.setAttribute("aria-disabled", String(step >= p.steps.length - 1));
    tbody.innerHTML = "";
    const cur = snapshot(step);
    const prev = step > 0 ? snapshot(step - 1) : {};
    for (const reg of regs) {
      const tr = h("tr", "ui-trace__row");
      const tdR = h("td", "ui-trace__reg");
      tdR.textContent = reg;
      const tdV = h("td", "ui-trace__value");
      tdV.textContent = cur[reg] ?? "—";
      if (step > 0 && cur[reg] !== prev[reg]) {
        tdV.classList.add("ui-trace__value--changed");
      }
      tr.append(tdR, tdV);
      tbody.appendChild(tr);
    }
    el.dataset.step = String(step);
  }
  apply();

  function setStep(i: number) {
    const clamped = Math.max(0, Math.min(i, p.steps.length - 1));
    if (clamped === step) return;
    step = clamped;
    apply();
    p.onStep?.(step);
    emit(el, "ui:step", { step });
  }

  const onNext = () => setStep(step + 1);
  const onPrev = () => setStep(step - 1);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") setStep(step + 1);
    else if (e.key === "ArrowLeft") setStep(step - 1);
  };
  nextBtn.addEventListener("click", onNext);
  prevBtn.addEventListener("click", onPrev);
  el.addEventListener("keydown", onKey);

  return {
    el,
    next: () => setStep(step + 1),
    prev: () => setStep(step - 1),
    setStep,
    getStep: () => step,
    destroy() {
      nextBtn.removeEventListener("click", onNext);
      prevBtn.removeEventListener("click", onPrev);
      el.removeEventListener("keydown", onKey);
    },
  };
}
