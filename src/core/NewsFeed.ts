import { h, emit } from "./dom";

/**
 * NewsFeed — headless-ядро ленты новостей платформы.
 * 3-5 строк, даты в ISO.
 */
export interface NewsItem {
  id: string;
  date: string; // ISO
  text: string;
  /** Тег (module/changelog). */
  tag?: string;
}

export interface NewsFeedProps {
  items: NewsItem[];
  title?: string;
}

export interface NewsFeedApi {
  el: HTMLElement;
  setItems: (items: NewsItem[]) => void;
}

export function createNewsFeed(props: NewsFeedProps): NewsFeedApi {
  const p = { title: "NEWS", ...props };
  const el = h("section", "ui-news");
  const head = h("h3", "ui-news__title");
  head.textContent = p.title;
  el.appendChild(head);
  const list = h("ul", "ui-news__list");

  function apply() {
    list.innerHTML = "";
    for (const item of p.items) {
      const li = h("li", "ui-news__item");
      const time = h("time", "ui-news__date");
      time.dateTime = item.date;
      time.textContent = item.date;
      li.appendChild(time);
      if (item.tag) {
        const tag = h("span", "ui-news__tag");
        tag.textContent = item.tag;
        li.appendChild(tag);
      }
      const text = h("span", "ui-news__text");
      text.textContent = item.text;
      li.appendChild(text);
      list.appendChild(li);
    }
  }
  apply();
  el.appendChild(list);

  return {
    el,
    setItems(items) {
      p.items = items;
      apply();
      emit(el, "ui:change", {});
    },
  };
}
