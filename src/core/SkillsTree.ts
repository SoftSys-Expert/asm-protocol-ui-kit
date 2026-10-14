import { h, emit } from "./dom";

/**
 * SkillsTree — headless-ядро дерева навыков.
 * Skill = узел с порогом (unlock по урокам); прогресс до порога.
 * Каркас: вложенные списки + прогресс; визуальные ветви — на скине.
 */
export interface Skill {
  id: string;
  label: string;
  /** Порог открытия (например «6 уроков»). */
  threshold: number;
  /** Текущее значение. */
  current?: number;
  children?: Skill[];
}

export interface SkillsTreeProps {
  skills: Skill[];
  title?: string;
}

export interface SkillsTreeApi {
  el: HTMLElement;
  setProgress: (id: string, current: number) => void;
}

export function createSkillsTree(props: SkillsTreeProps): SkillsTreeApi {
  const p = { title: "SKILLS", ...props };
  const el = h("section", "ui-skills");
  const head = h("h3", "ui-skills__title");
  head.textContent = p.title;
  el.appendChild(head);
  const list = h("ul", "ui-skills__list");

  function unlocked(s: Skill): boolean {
    return (s.current ?? 0) >= s.threshold;
  }

  function skillRow(s: Skill, depth: number): HTMLElement {
    const li = h("li", "ui-skills__item");
    li.dataset.unlocked = String(unlocked(s));
    li.dataset.depth = String(depth);
    const row = h("div", "ui-skills__row");
    const marker = h("span", "ui-skills__marker", { "aria-hidden": "true" });
    marker.textContent = unlocked(s) ? "[x]" : "[ ]";
    const label = h("span", "ui-skills__label");
    label.textContent = s.label;
    const count = h("span", "ui-skills__count");
    count.textContent = `${Math.min(s.current ?? 0, s.threshold)}/${s.threshold}`;
    const track = h("span", "ui-skills__track", {
      role: "progressbar",
      "aria-label": s.label,
    });
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(s.threshold));
    track.setAttribute("aria-valuenow", String(s.current ?? 0));
    const fill = h("span", "ui-skills__fill");
    fill.style.width = `${Math.min(100, Math.round(((s.current ?? 0) / s.threshold) * 100))}%`;
    track.appendChild(fill);
    row.append(marker, label, track, count);
    li.appendChild(row);
    if (s.children?.length) {
      const ul = h("ul", "ui-skills__children");
      for (const c of s.children) ul.appendChild(skillRow(c, depth + 1));
      li.appendChild(ul);
    }
    return li;
  }

  function apply() {
    list.innerHTML = "";
    for (const s of p.skills) list.appendChild(skillRow(s, 0));
  }
  apply();
  el.appendChild(list);

  function setProgressDeep(skills: Skill[], id: string, current: number): boolean {
    for (const s of skills) {
      if (s.id === id) {
        s.current = current;
        return true;
      }
      if (s.children && setProgressDeep(s.children, id, current)) return true;
    }
    return false;
  }

  return {
    el,
    setProgress(id, current) {
      if (setProgressDeep(p.skills, id, current)) {
        apply();
        emit(el, "ui:change", { id, current });
      }
    },
  };
}
