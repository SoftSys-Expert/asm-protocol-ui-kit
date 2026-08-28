import { h, emit } from "./dom";

/**
 * HintReveal — headless-ядро пошаговых подсказок.
 * Уровни раскрываются по одному; финальный уровень = решение
 * (честная пометка solutionUsed).
 */
export interface HintRevealProps {
  hints: string[];
  /** Лейбл финального уровня (обычно «решение»). */
  solutionLabel?: string;
  /** Последняя подсказка — это решение. */
  lastIsSolution?: boolean;
  onReveal?: (level: number, isSolution: boolean) => void;
}

export interface HintRevealApi {
  el: HTMLElement;
  revealNext: () => void;
  revealedCount: () => number;
  isSolutionUsed: () => boolean;
  destroy: () => void;
}

export function createHintReveal(props: HintRevealProps): HintRevealApi {
  const p = { solutionLabel: "solution", lastIsSolution: true, ...props };
  const el = h("div", "ui-hint");
  const list = h("div", "ui-hint__list");
  const btn = h("button", "ui-hint__btn");
  btn.type = "button";
  el.append(list, btn);

  let revealed = 0;

  function apply() {
    list.innerHTML = "";
    for (let i = 0; i < revealed; i++) {
      const isSolution = p.lastIsSolution && i === p.hints.length - 1;
      const item = h("div", `ui-hint__item${isSolution ? " ui-hint__item--solution" : ""}`);
      const tag = h("span", "ui-hint__tag");
      tag.textContent = isSolution ? p.solutionLabel : `hint ${i + 1}`;
      const text = h("span", "ui-hint__text");
      text.textContent = p.hints[i];
      item.append(tag, text);
      list.appendChild(item);
    }
    const remaining = p.hints.length - revealed;
    const nextIsSolution = p.lastIsSolution && revealed === p.hints.length - 1;
    btn.textContent =
      remaining <= 0 ? "no more hints" : nextIsSolution ? `reveal ${p.solutionLabel}` : "hint";
    btn.setAttribute("aria-disabled", String(remaining <= 0));
    btn.tabIndex = remaining <= 0 ? -1 : 0;
    el.dataset.revealed = String(revealed);
    el.dataset.solutionUsed = String(p.lastIsSolution && revealed >= p.hints.length);
  }
  apply();

  function revealNext() {
    if (revealed >= p.hints.length) return;
    revealed += 1;
    apply();
    const isSolution = p.lastIsSolution && revealed === p.hints.length;
    p.onReveal?.(revealed - 1, isSolution);
    emit(el, "ui:reveal", { level: revealed, isSolution });
  }
  const onClick = () => revealNext();
  btn.addEventListener("click", onClick);

  return {
    el,
    revealNext,
    revealedCount: () => revealed,
    isSolutionUsed: () => p.lastIsSolution && revealed >= p.hints.length,
    destroy() {
      btn.removeEventListener("click", onClick);
    },
  };
}
