import { h } from "./dom";

/**
 * Badge — headless-ядро бейджа (статус/тег/счётчик).
 * A11y: текст статуса дублируется data-статусом для скинов.
 */
export type BadgeTone = "neutral" | "accent" | "info" | "warn" | "fail" | "success";

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /** Точка-статус перед текстом. */
  dot?: boolean;
}

export interface BadgeApi {
  el: HTMLElement;
  setProps: (patch: Partial<BadgeProps>) => void;
}

export function createBadge(props: BadgeProps): BadgeApi {
  const p = { tone: "neutral" as BadgeTone, dot: false, ...props };
  const el = h("span", "ui-badge");

  function apply() {
    el.innerHTML = "";
    el.dataset.tone = p.tone;
    if (p.dot) {
      const d = h("span", "ui-badge__dot", { "aria-hidden": "true" });
      el.appendChild(d);
    }
    const label = h("span", "ui-badge__label");
    label.textContent = p.label;
    el.appendChild(label);
  }
  apply();

  return {
    el,
    setProps(patch) {
      Object.assign(p, patch);
      apply();
    },
  };
}
