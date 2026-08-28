import { h } from "./dom";

/**
 * Skeleton — headless-ядро скелетона загрузки.
 * Варианты: line / block / circle; пульс — на скине.
 */
export interface SkeletonProps {
  /** Форма первого элемента. */
  shape?: "line" | "block" | "circle";
  /** Сколько элементов. */
  count?: number;
  /** Ширина последней строки в % (обрыв текста). */
  lastWidth?: number;
  label?: string;
}

export interface SkeletonApi {
  el: HTMLElement;
}

export function createSkeleton(props: SkeletonProps): SkeletonApi {
  const p = { shape: "line" as NonNullable<SkeletonProps["shape"]>, count: 3, lastWidth: 60, ...props };
  const el = h("div", "ui-skeleton", {
    role: "status",
    "aria-label": p.label ?? "Loading",
  });
  for (let i = 0; i < p.count; i++) {
    const part = h("div", `ui-skeleton__part ui-skeleton__part--${p.shape}`);
    if (i === p.count - 1 && p.shape === "line" && p.lastWidth) {
      part.style.width = `${p.lastWidth}%`;
    }
    el.appendChild(part);
  }
  return { el };
}
