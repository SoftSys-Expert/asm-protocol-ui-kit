import { h, emit } from "./dom";

/**
 * ResumeHero — headless-ядро hero «продолжить обучение».
 * Точный урок + CTA RESUME. Ноль трения.
 */
export interface ResumeHeroProps {
  /** Например `heap/003`. */
  lessonId: string;
  lessonTitle?: string;
  trackName?: string;
  onResume?: () => void;
}

export interface ResumeHeroApi {
  el: HTMLElement;
  destroy: () => void;
}

export function createResumeHero(props: ResumeHeroProps): ResumeHeroApi {
  const p = { ...props };
  const el = h("section", "ui-resumehero");
  const label = h("div", "ui-resumehero__label");
  label.textContent = "CONTINUE";
  const title = h("h1", "ui-resumehero__title");
  title.textContent = p.lessonId;
  const sub = h("div", "ui-resumehero__sub");
  sub.textContent = [p.lessonTitle, p.trackName].filter(Boolean).join(" — ");
  const cta = h("button", "ui-resumehero__cta");
  cta.type = "button";
  cta.textContent = "RESUME ›";
  el.append(label, title, sub, cta);

  const onClick = () => {
    p.onResume?.();
    emit(el, "ui:resume", { lessonId: p.lessonId });
  };
  cta.addEventListener("click", onClick);
  return {
    el,
    destroy() {
      cta.removeEventListener("click", onClick);
    },
  };
}
