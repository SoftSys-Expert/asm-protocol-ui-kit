import { h } from "./dom";

/**
 * TakeawayCard — headless-ядро итоговой карточки урока.
 * Синтаксис + примеры; экспорт PDF/cheatsheet — на уровне приложения.
 */
export interface Takeaway {
  title: string;
  code?: string;
  comment?: string;
}

export interface TakeawayCardProps {
  lessonId: string;
  takeaways: Takeaway[];
}

export interface TakeawayCardApi {
  el: HTMLElement;
}

export function createTakeawayCard(props: TakeawayCardProps): TakeawayCardApi {
  const p = { ...props };
  const el = h("section", "ui-takeaway");
  const head = h("div", "ui-takeaway__head");
  const title = h("h3", "ui-takeaway__title");
  title.textContent = "TAKEAWAYS";
  const id = h("span", "ui-takeaway__lesson");
  id.textContent = p.lessonId;
  head.append(title, id);
  el.appendChild(head);
  const list = h("ul", "ui-takeaway__list");
  for (const t of p.takeaways) {
    const li = h("li", "ui-takeaway__item");
    const tEl = h("div", "ui-takeaway__item-title");
    tEl.textContent = t.title;
    li.appendChild(tEl);
    if (t.code) {
      const c = h("pre", "ui-takeaway__code");
      c.textContent = t.code;
      li.appendChild(c);
    }
    if (t.comment) {
      const cm = h("div", "ui-takeaway__comment");
      cm.textContent = `; ${t.comment}`;
      li.appendChild(cm);
    }
    list.appendChild(li);
  }
  el.appendChild(list);
  return { el };
}
