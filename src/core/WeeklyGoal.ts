import { h, emit } from "./dom";

/**
 * WeeklyGoal — headless-ядро недельной цели.
 * «12 lessons / week» редактируется; недостача — dim, не стыд.
 */
export interface WeeklyGoalProps {
  goal: number;
  done: number;
  /** Период для подписи. */
  weekLabel?: string;
  onGoalChange?: (goal: number) => void;
}

export interface WeeklyGoalApi {
  el: HTMLElement;
  setDone: (n: number) => void;
  setGoal: (n: number) => void;
  destroy: () => void;
}

export function createWeeklyGoal(props: WeeklyGoalProps): WeeklyApi {
  const p = { ...props };
  const el = h("section", "ui-weekly", { "aria-label": "Weekly goal" });
  const head = h("div", "ui-weekly__head");
  const title = h("h3", "ui-weekly__title");
  title.textContent = "WEEKLY GOAL";
  const goalBtn = h("button", "ui-weekly__goal-edit", { "aria-label": "Edit weekly goal" });
  goalBtn.type = "button";
  const goalText = h("span");
  head.append(title, goalBtn);
  const counter = h("div", "ui-weekly__counter");
  const track = h("div", "ui-weekly__track", {
    role: "progressbar",
    "aria-label": "Weekly goal progress",
  });
  const fill = h("div", "ui-weekly__fill");
  track.append(fill);
  el.append(head, counter, track);

  function apply() {
    goalText.textContent = `${p.goal} / week`;
    goalBtn.textContent = "";
    goalBtn.appendChild(goalText);
    const done = Math.min(p.done, p.goal);
    counter.textContent = `${p.done}/${p.goal} lessons`;
    counter.dataset.behind = p.done < p.goal ? "true" : "false";
    const pct = p.goal === 0 ? 0 : Math.round((done / p.goal) * 100);
    fill.style.width = `${pct}%`;
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(p.goal));
    track.setAttribute("aria-valuenow", String(p.done));
    track.setAttribute("aria-valuetext", `${p.done} of ${p.goal}`);
    fill.dataset.complete = p.done >= p.goal ? "true" : "false";
    if (p.weekLabel) el.dataset.week = p.weekLabel;
  }
  apply();

  /** Редактирование цели: +/− кнопки в поповере (упрощённо — клик циклит +1, shift клик −1). */
  const onGoalClick = (e: MouseEvent) => {
    const delta = e.shiftKey ? -1 : 1;
    const next = Math.max(1, p.goal + delta);
    if (next !== p.goal) {
      p.goal = next;
      apply();
      p.onGoalChange?.(p.goal);
      emit(el, "ui:goalchange", { goal: p.goal });
    }
  };
  goalBtn.addEventListener("click", onGoalClick);

  return {
    el,
    setDone(n) {
      p.done = n;
      apply();
      emit(el, "ui:change", { done: n });
    },
    setGoal(n) {
      p.goal = n;
      apply();
    },
    destroy() {
      goalBtn.removeEventListener("click", onGoalClick);
    },
  };
}

type WeeklyApi = WeeklyGoalApi;
