import { h } from "./dom";

/**
 * Spinner — headless-ядро ASCII-спиннера (`\|/-`) + label.
 * A11y: role=status + aria-live=polite + визуально скрытый текст.
 */
export interface SpinnerProps {
  label?: string;
  /** Символы кадров. */
  frames?: string[];
  /** Интервал кадра, мс. */
  interval?: number;
}

export interface SpinnerApi {
  el: HTMLElement;
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
  destroy: () => void;
}

export function createSpinner(props: SpinnerProps): SpinnerApi {
  const p = {
    label: "loading",
    frames: ["|", "/", "-", "\\"],
    interval: 120,
    ...props,
  };
  const el = h("div", "ui-spinner", { role: "status", "aria-live": "polite" });
  const frame = h("span", "ui-spinner__frame", { "aria-hidden": "true" });
  frame.textContent = p.frames[0] ?? "|";
  const label = h("span", "ui-spinner__label");
  label.textContent = p.label ?? "";
  const sr = h("span", "ui-sr-only");
  sr.textContent = p.label ?? "";
  el.append(frame, label, sr);

  let timer: ReturnType<typeof setInterval> | undefined;
  let idx = 0;
  let running = false;

  function tick() {
    idx = (idx + 1) % p.frames.length;
    frame.textContent = p.frames[idx];
  }
  function start() {
    if (running) return;
    running = true;
    el.classList.add("ui-spinner--running");
    timer = setInterval(tick, p.interval);
  }
  function stop() {
    running = false;
    el.classList.remove("ui-spinner--running");
    clearInterval(timer);
  }

  return {
    el,
    start,
    stop,
    isRunning: () => running,
    destroy: stop,
  };
}
