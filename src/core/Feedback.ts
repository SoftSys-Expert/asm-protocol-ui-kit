import { h } from "./dom";

/**
 * Feedback — headless-ядро обратной связи проверки (correct/error).
 * A11y: role=status, успех/провал через data-статус.
 */
export type FeedbackKind = "correct" | "error" | "partial" | "info";

export interface FeedbackProps {
  kind: FeedbackKind;
  title?: string;
  /** Строки деталей (например, diff). */
  lines?: string[];
}

export interface FeedbackApi {
  el: HTMLElement;
  setProps: (patch: Partial<FeedbackProps>) => void;
}

export function createFeedback(props: FeedbackProps): FeedbackApi {
  const p = { ...props };
  const el = h("div", "ui-feedback", { role: "status" });

  function apply() {
    el.innerHTML = "";
    el.dataset.kind = p.kind;
    const icon = h("span", "ui-feedback__icon", { "aria-hidden": "true" });
    icon.textContent = p.kind === "correct" ? "[ok]" : p.kind === "error" ? "[fail]" : "[i]";
    el.appendChild(icon);
    const body = h("div", "ui-feedback__body");
    if (p.title) {
      const t = h("div", "ui-feedback__title");
      t.textContent = p.title;
      body.appendChild(t);
    }
    for (const line of p.lines ?? []) {
      const l = h("div", "ui-feedback__line");
      l.textContent = line;
      body.appendChild(l);
    }
    el.appendChild(body);
  }
  apply();

  return { el, setProps: (patch) => { Object.assign(p, patch); apply(); } };
}
