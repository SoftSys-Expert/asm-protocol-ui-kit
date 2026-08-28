import { h, emit } from "./dom";
import { createProgressBar } from "./ProgressBar";

/**
 * CurrentTrackCard — headless-ядро карточки текущего трека.
 * Полоса-прогресс по краю + карандаш смены трека.
 */
export interface CurrentTrackCardProps {
  trackId: string;
  trackName: string;
  /** Прогресс 0..100. */
  progress: number;
  /** «12/48 lessons». */
  meta?: string;
  onChangeTrack?: () => void;
}

export interface CurrentTrackCardApi {
  el: HTMLElement;
  setProgress: (v: number) => void;
  destroy: () => void;
}

export function createCurrentTrackCard(props: CurrentTrackCardProps): CurrentTrackCardApi {
  const p = { ...props };
  const el = h("section", "ui-trackcard");
  const edge = h("div", "ui-trackcard__edge", { "aria-hidden": "true" });
  const content = h("div", "ui-trackcard__content");
  const label = h("div", "ui-trackcard__label");
  label.textContent = "CURRENT TRACK";
  const name = h("h3", "ui-trackcard__name");
  name.textContent = p.trackName;
  const meta = h("div", "ui-trackcard__meta");
  meta.textContent = p.meta ?? "";
  const progress = createProgressBar({
    value: p.progress,
    label: `Track ${p.trackId} progress`,
    showValue: true,
  });
  progress.el.classList.add("ui-trackcard__progress");
  const editBtn = h("button", "ui-trackcard__edit", { "aria-label": "Change track" });
  editBtn.type = "button";
  editBtn.textContent = "edit";
  content.append(label, name, meta, progress.el, editBtn);
  el.append(edge, content);

  const onClick = () => {
    p.onChangeTrack?.();
    emit(el, "ui:changetrack", {});
  };
  editBtn.addEventListener("click", onClick);

  return {
    el,
    setProgress(v) {
      progress.setValue(v);
    },
    destroy() {
      editBtn.removeEventListener("click", onClick);
      progress.destroy();
    },
  };
}
