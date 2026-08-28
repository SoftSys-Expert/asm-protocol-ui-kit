import { h, uid } from "./dom";

/**
 * Tooltip — headless-ядро подсказки по hover/focus с задержкой.
 * A11y: aria-describedby на триггере, role=tooltip, ESC закрывает.
 */
export interface TooltipProps {
  /** Текст подсказки. */
  text: string;
  /** Задержка показа, мс. */
  delay?: number;
  /** Сторона по умолчанию (скин может игнорировать). */
  side?: "top" | "bottom" | "left" | "right";
}

export interface TooltipApi {
  el: HTMLElement;
  attach: (trigger: HTMLElement) => void;
  show: () => void;
  hide: () => void;
  destroy: () => void;
}

export function createTooltip(props: TooltipProps): TooltipApi {
  const p = { delay: 300, side: "top", ...props };
  const id = uid("tooltip");
  const el = h("div", "ui-tooltip", { id, role: "tooltip" });
  el.setAttribute("hidden", "");
  el.dataset.side = p.side;
  el.textContent = p.text;

  let trigger: HTMLElement | null = null;
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  function show() {
    clearTimeout(hideTimer);
    showTimer = setTimeout(() => {
      el.removeAttribute("hidden");
      // Позиционирование — примитивное структурное; точная геометрия у скина.
      if (trigger) {
        const r = trigger.getBoundingClientRect();
        el.style.setProperty("--ui-tip-x", `${r.left + r.width / 2}px`);
        el.style.setProperty("--ui-tip-y", `${r.top}px`);
      }
    }, p.delay);
  }
  function hide() {
    clearTimeout(showTimer);
    hideTimer = setTimeout(() => el.setAttribute("hidden", ""), 80);
  }

  function attach(target: HTMLElement) {
    trigger = target;
    target.setAttribute("aria-describedby", id);
    target.addEventListener("mouseenter", show);
    target.addEventListener("mouseleave", hide);
    target.addEventListener("focusin", show);
    target.addEventListener("focusout", hide);
    target.addEventListener("keydown", onKey);
    document.body.appendChild(el);
  }
  function detach() {
    if (!trigger) return;
    trigger.removeAttribute("aria-describedby");
    trigger.removeEventListener("mouseenter", show);
    trigger.removeEventListener("mouseleave", hide);
    trigger.removeEventListener("focusin", show);
    trigger.removeEventListener("focusout", hide);
    trigger.removeEventListener("keydown", onKey);
    trigger = null;
    el.remove();
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") hide();
  };

  return {
    el,
    attach,
    show,
    hide,
    destroy: detach,
  };
}
