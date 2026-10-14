import { h, emit } from "./dom";

/**
 * LessonCard — headless-ядро карточки урока.
 * Статусы: passed / active / locked / available.
 */
export type LessonStatus = "passed" | "active" | "locked" | "available";

export interface LessonCardProps {
  id: string;
  title: string;
  status?: LessonStatus;
  /** Оценка/время (например «18 min»). */
  meta?: string;
  disabled?: boolean;
  onOpen?: (id: string) => void;
}

export interface LessonCardApi {
  el: HTMLElement;
  setStatus: (s: LessonStatus) => void;
  destroy: () => void;
}

export function createLessonCard(props: LessonCardProps): LessonCardApi {
  const p = { status: "available" as LessonStatus, ...props };
  const el = h("article", "ui-lessoncard");

  function apply() {
    el.innerHTML = "";
    el.dataset.status = p.status;
    el.classList.toggle("ui-lessoncard--disabled", Boolean(p.disabled));
    const dot = h("span", "ui-lessoncard__dot", { "aria-hidden": "true" });
    dot.dataset.status = p.status;
    const id = h("span", "ui-lessoncard__id");
    id.textContent = p.id;
    const head = h("div", "ui-lessoncard__head");
    head.append(dot, id);
    el.appendChild(head);
    const title = h("h3", "ui-lessoncard__title");
    title.textContent = p.title;
    el.appendChild(title);
    if (p.meta) {
      const meta = h("div", "ui-lessoncard__meta");
      meta.textContent = p.meta;
      el.appendChild(meta);
    }
    el.setAttribute("role", p.status === "locked" || p.disabled ? "link" : "button");
    el.tabIndex = p.status === "locked" || p.disabled ? -1 : 0;
    if (p.status === "locked" || p.disabled) el.setAttribute("aria-disabled", "true");
    else el.removeAttribute("aria-disabled");
  }
  apply();

  const open = () => {
    if (p.status === "locked" || p.disabled) return;
    p.onOpen?.(p.id);
    emit(el, "ui:open", { id: p.id });
  };
  const onClick = () => open();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };
  el.addEventListener("click", onClick);
  el.addEventListener("keydown", onKey);

  return {
    el,
    setStatus(s) {
      p.status = s;
      apply();
    },
    destroy() {
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    },
  };
}
