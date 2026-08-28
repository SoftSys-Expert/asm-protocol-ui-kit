import { h, uid, emit } from "./dom";
import { createBadge, BadgeApi } from "./Badge";

/**
 * ExerciseSwitcher — headless-ядро переключателя упражнений.
 * Типы: choose / translate / fill / trace / write.
 * Внутри: Tabs-подобный селектор типа + контейнер упражнения + check → Feedback.
 */
export type ExerciseType = "choose" | "translate" | "fill" | "trace" | "write";

export const EXERCISE_TYPES: ExerciseType[] = ["choose", "translate", "fill", "trace", "write"];

export interface ExerciseSwitcherProps {
  /** Активный тип. */
  type?: ExerciseType;
  /** Заголовок упражнения. */
  prompt?: string;
  label?: string;
  onTypeChange?: (type: ExerciseType) => void;
  onCheck?: () => boolean;
}

export interface ExerciseSwitcherApi {
  el: HTMLElement;
  /** Контейнер для DOM упражнения. */
  body: HTMLElement;
  /** Слот для Feedback. */
  feedbackSlot: HTMLElement;
  getType: () => ExerciseType;
  setType: (t: ExerciseType) => void;
  /** Показать результат проверки. */
  showFeedback: (kind: "correct" | "error", title?: string, lines?: string[]) => void;
  destroy: () => void;
}

export function createExerciseSwitcher(props: ExerciseSwitcherProps): ExerciseSwitcherApi {
  const p = { type: "choose" as ExerciseType, ...props };
  const el = h("section", "ui-exercise", { "aria-label": p.label ?? "Exercise" });
  const bar = h("div", "ui-exercise__typebar", { role: "tablist", "aria-label": "Exercise type" });
  const btns: { btn: HTMLButtonElement; type: ExerciseType }[] = [];
  for (const t of EXERCISE_TYPES) {
    const btn = h("button", "ui-exercise__typebtn", { role: "tab" });
    btn.type = "button";
    btn.textContent = t;
    btn.dataset.type = t;
    btns.push({ btn, type: t });
    bar.appendChild(btn);
  }
  const prompt = h("div", "ui-exercise__prompt");
  if (p.prompt) prompt.textContent = p.prompt;
  const body = h("div", "ui-exercise__body");
  const feedbackSlot = h("div", "ui-exercise__feedback");
  el.append(bar, prompt, body, feedbackSlot);

  function apply() {
    for (const b of btns) {
      const on = b.type === p.type;
      b.btn.setAttribute("aria-selected", String(on));
      b.btn.classList.toggle("ui-exercise__typebtn--active", on);
      b.btn.tabIndex = on ? 0 : -1;
    }
    el.dataset.type = p.type;
  }
  apply();

  function setType(t: ExerciseType) {
    if (t === p.type) return;
    p.type = t;
    apply();
    p.onTypeChange?.(t);
    emit(el, "ui:typechange", { type: t });
  }
  const onClick = (e: Event) => {
    const btn = (e.target as Element).closest(".ui-exercise__typebtn") as HTMLElement | null;
    if (btn) setType(btn.dataset.type as ExerciseType);
  };
  const onKey = (e: KeyboardEvent) => {
    const btn = (e.target as Element).closest(".ui-exercise__typebtn") as HTMLElement | null;
    if (!btn) return;
    const idx = btns.findIndex((b) => b.btn === btn);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % btns.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + btns.length) % btns.length;
    if (next >= 0) {
      e.preventDefault();
      setType(btns[next].type);
      btns[next].btn.focus();
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  let fb: BadgeApi | null = null;

  return {
    el,
    body,
    feedbackSlot,
    getType: () => p.type,
    setType,
    showFeedback(kind, title, lines) {
      feedbackSlot.innerHTML = "";
      fb = createBadge({ label: kind === "correct" ? "PASSED" : "FAILED", tone: kind === "correct" ? "success" : "fail" });
      feedbackSlot.appendChild(fb.el);
      if (title) {
        const t = h("div", "ui-exercise__feedback-title");
        t.textContent = title;
        feedbackSlot.appendChild(t);
      }
      for (const line of lines ?? []) {
        const l = h("div", "ui-exercise__feedback-line");
        l.textContent = line;
        feedbackSlot.appendChild(l);
      }
      feedbackSlot.setAttribute("role", "status");
    },
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}
