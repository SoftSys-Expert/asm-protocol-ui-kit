import { course, ui } from "./course";
import { button, layout, node, section, skinSwitch, type Page, type Control } from "./shared";
import {
  answerField,
  auth,
  catalog,
  choices,
  dialog,
  feedback,
  grouping,
  html,
  modeSwitch,
  modules,
  nextStep,
  openDialog,
  order,
  panel,
  skills,
  topbar,
  topnav,
  track,
  values,
} from "./examples";
import { machine } from "./machine";
import { effectPage } from "./effects";
import { tokenNames } from "./styles";
const toggle = (key: string, label: string, value = false): Control => ({
  key,
  label,
  type: "checkbox",
  value,
});
const range = (key: string, label: string, value: number, max: number): Control => ({
  key,
  label,
  type: "range",
  min: 0,
  max,
  step: 1,
  value,
});
const text = (key: string, label: string, value: string): Control => ({ key, label, value });
const select = (key: string, label: string, options: string[], value = options[0]): Control => ({
  key,
  label,
  options,
  value,
});
export const pages: Page[] = [
  {
    id: "colors",
    title: "Цвета",
    group: "foundations",
    description:
      "Все токены слоя сайта: имя и вычисленное значение для operator и tty. Цветные образцы — значения CSS-переменных, не отдельная палитра. Поиск работает по имени.",
    controls: [text("filter", "Имя токена", "")],
    render(el, state) {
      const body = el.ownerDocument.body,
        original = body.className;
      const values = ["operator", "tty"].map((skin) => {
        body.className = `skin-${skin}`;
        const style = getComputedStyle(body);
        return Object.fromEntries(
          tokenNames.map((name) => [name, style.getPropertyValue(name).trim()])
        );
      });
      body.className = original;
      const table = node("table");
      const head = node("thead");
      head.innerHTML = "<tr><th>Токен</th><th>operator</th><th>tty</th></tr>";
      table.append(head);
      const rows = node("tbody");
      for (const name of tokenNames.filter((name) => name.includes(String(state.filter ?? "")))) {
        const row = node("tr");
        row.append(node("th", "", name));
        values.forEach((map) => {
          const cell = node("td");
          const value = map[name];
          if (CSS.supports("color", value)) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "40");
            svg.setAttribute("height", "20");
            svg.setAttribute("aria-label", value);
            const rect = document.createElementNS(svg.namespaceURI, "rect");
            rect.setAttribute("width", "40");
            rect.setAttribute("height", "20");
            rect.setAttribute("fill", value);
            svg.append(rect);
            cell.append(svg);
          }
          cell.append(node("code", "", value || "—"));
          row.append(cell);
        });
        rows.append(row);
      }
      table.append(rows);
      el.append(table);
    },
  },
  {
    id: "typography",
    title: "Типографика",
    group: "foundations",
    description:
      "IBM Plex Mono — заголовки, код и подписи; IBM Plex Sans — текст. В tty весь текст становится моноширинным. h1 / h2 / h3, .lede, .eyebrow, small, pre.code.",
    controls: [text("text", "Текст образца", course.modules[0].title.ru)],
    render(el, state) {
      el.append(
        node("div", "eyebrow", ui.directions),
        node("h1", "", String(state.text)),
        node("h2", "", String(state.text)),
        node("h3", "", String(state.text)),
        node("p", "lede", course.modules[0].description.ru),
        node("small", "", ui.local_session),
        node("pre", "code", "mov eax, 3\nadd eax, 4")
      );
      const table = node("dl");
      for (const item of [...el.children]) {
        const style = getComputedStyle(item);
        table.append(
          node("dt", "", item.tagName.toLowerCase() + (item.className ? `.${item.className}` : "")),
          node(
            "dd",
            "",
            `${style.fontFamily} · ${style.fontSize} / ${style.lineHeight} · ${style.fontWeight}`
          )
        );
      }
      el.append(table);
    },
  },
  effectPage("effects", "Пульт эффектов"),
  effectPage("glitch", "Glitch", "glitch"),
  effectPage("glow", "Свечение", "glow"),
  effectPage("crt", "CRT", "crt"),
  {
    id: "buttons",
    title: "Кнопка",
    group: "buttons",
    description:
      "Действия app.ts: button.button.button--primary / secondary / danger и button.text-link. Размеры .button--sm / без модификатора (md) / .button--lg. Hover — наведением, focus-visible — клавишей Tab; disabled — настоящий атрибут.",
    controls: [
      text("text", "Текст", ui.check),
      select("variant", "Вариант", ["primary", "secondary", "danger", "link"]),
      select("size", "Размер", ["sm", "md", "lg"], "md"),
      toggle("disabled", "Заблокирована"),
    ],
    render(el, state) {
      const live = button(String(state.text), String(state.variant));
      if (state.size !== "md" && state.variant !== "link")
        live.classList.add(`button--${state.size}`);
      live.disabled = Boolean(state.disabled);
      live.dataset.liveButton = "";
      el.append(section("Настраиваемая кнопка", live));
      const prerequisite = node("div", "prerequisites");
      prerequisite.append(button("M8 · Указатели и Адреса", "link"));
      el.append(section("Ссылка на необходимый модуль · .prerequisites .text-link", prerequisite));
      const grid = node("div");
      grid.style.cssText = "display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px";
      for (const size of ["sm", "md", "lg"]) {
        const rows = node("div");
        rows.style.cssText = "display:grid;gap:12px";
        for (const kind of ["primary", "secondary", "danger", "link"]) {
          const label =
            kind === "danger"
              ? ui.clear_local
              : kind === "secondary"
                ? ui.overview
                : kind === "link"
                  ? ui.directions
                  : ui.check;
          const normal = button(label, kind);
          if (size !== "md" && kind !== "link") normal.classList.add(`button--${size}`);
          normal.dataset.example = `${kind}-${size}`;
          const disabled = normal.cloneNode(true) as HTMLButtonElement;
          disabled.disabled = true;
          disabled.dataset.example += "-disabled";
          if (kind === "link") {
            const links = node("div");
            links.append(normal, "　", disabled);
            rows.append(links);
          } else rows.append(layout(normal, disabled));
        }
        grid.append(section(size, rows));
      }
      el.append(
        grid,
        node(
          "p",
          "",
          "Обычная и заблокированная кнопки стоят рядом. Наведите курсор или перейдите Tab на любую доступную кнопку, чтобы увидеть её реальные hover / focus-visible."
        )
      );
    },
  },
  {
    id: "bench-buttons",
    title: "Кнопки стенда и порядка",
    group: "buttons",
    description:
      "bench.ts и app.ts: button.bench-btn, .bench-btn--step, button.order-btn; disabled блокирует действие. Кнопка шага передвигает позицию в примере.",
    controls: [range("step", "Номер шага", 1, 4), toggle("disabled", "Заблокированы")],
    render(el, state, redraw) {
      const row = layout();
      for (const [label, classes] of [
        ["◀", "bench-btn"],
        [ui.bench_step, "bench-btn bench-btn--step"],
        ["↑", "order-btn"],
        ["↓", "order-btn"],
      ]) {
        const b = node("button", classes, label);
        b.disabled = Boolean(state.disabled);
        b.onclick = () => {
          state.step = (Number(state.step) + 1) % 5;
          redraw();
        };
        row.append(b);
        const disabled = b.cloneNode(true) as HTMLButtonElement;
        disabled.disabled = true;
        row.append(disabled);
      }
      el.append(row, node("p", "bench-pos", `шаг ${state.step} из 4`));
    },
  },
  {
    id: "mode",
    title: "Режим задания",
    group: "switches",
    description:
      "Рабочее место урока: div.mode-switch > button.is-on. Выбор меняет режим и пример задания.",
    controls: [select("mode", "Режим", ["Script Kiddie", "Console Cowboy"])],
    render(el, state, redraw) {
      const head = node("header", "workbench-head");
      head.append(node("span", "", "УРОК 1 ИЗ 4"), modeSwitch(state, redraw));
      el.append(
        head,
        node(
          "p",
          "",
          state.mode === "Console Cowboy"
            ? "Что будет в EBX после выполнения? Считай построчно."
            : course.choice.prompt.ru
        )
      );
    },
  },
  {
    id: "skin",
    title: "Скин",
    group: "switches",
    description:
      "Верхняя панель: div.skin-switch[role=group] > button[aria-pressed].is-on. Переключает body.skin-operator / body.skin-tty во всём iframe.",
    render(el, state, redraw) {
      const head = node("header", "topbar");
      head.append(skinSwitch(state, redraw));
      el.append(head, panel(), button(ui.check, "primary"));
    },
  },
  {
    id: "grouping",
    title: "Группировка навыков",
    group: "switches",
    description:
      "Экран НАВЫКИ: .skills-grouping > button[data-grouping][aria-pressed].is-on. Меняет заголовок группы по доменам / по трекам.",
    controls: [range("grouping", "Группа: 0 — домен, 1 — трек", 0, 1)],
    render(el, state, redraw) {
      el.append(
        grouping(state, redraw),
        node("h2", "", Number(state.grouping) ? ui.track_prologue : ui.skills_domain_machine),
        skills()
      );
    },
  },
  {
    id: "topnav",
    title: "Верхняя навигация",
    group: "switches",
    description:
      "nav.topnav > button.is-current из app.ts. Клик переключает текущий раздел в примере.",
    controls: [range("nav", "Раздел: начало / направления / навыки / лаборатория", 0, 3)],
    render(el, state, redraw) {
      el.append(
        topnav(state, redraw),
        node("p", "eyebrow", [ui.home, ui.directions, ui.skills_nav, ui.lab][Number(state.nav)])
      );
    },
  },
  {
    id: "options",
    title: "Варианты ответа",
    group: "answers",
    description:
      "Урок M0.1: .options > button.option > span. Состояния .is-selected / .correct / .wrong и disabled. В живом задании «Ответить» доступна только после выбора.",
    controls: [
      range("chosen", "Выбор: −1 — нет ответа", -1, 3),
      toggle("answered", "Ответ отправлен"),
    ].map((c) => (c.key === "chosen" ? { ...c, min: -1 } : c)),
    render: choices,
  },
  {
    id: "text-answer",
    title: "Текстовый ответ",
    group: "answers",
    description:
      "Урок M18.3: .answer-box > input + button.button--primary. Пустой ответ блокирует кнопку, Enter отправляет ответ; ожидается 2.",
    controls: [toggle("disabled", "Ответ уже отправлен")],
    render(el, state) {
      el.append(node("p", "", course.text.prompt.ru), answerField(false, Boolean(state.disabled)));
    },
  },
  {
    id: "order",
    title: "Порядок шагов",
    group: "answers",
    description:
      "Урок M0.2: .order-list > .order-item > .order-num + .order-text + .order-controls. Стрелки переставляют шаги; проверка показывает .correct / .wrong и блокирует стрелки.",
    controls: [toggle("orderAnswered", "Порядок проверен")],
    render: order,
  },
  {
    id: "feedback",
    title: "Результат ответа",
    group: "feedback",
    description:
      "section.feedback.ok / .fail > strong + p из app.ts. Разбор ответа M0.1; оба результата рядом.",
    controls: [
      toggle("showOk", "Показать верный результат", true),
      toggle("showFail", "Показать ошибку", true),
    ],
    render(el, state) {
      if (state.showOk) el.append(feedback(true));
      if (state.showFail) el.append(feedback(false));
    },
  },
  {
    id: "hint",
    title: "Подсказка",
    group: "feedback",
    description: "Урок: .hint-row и div.hint. Кнопка открывает и скрывает подсказку курса.",
    controls: [toggle("visible", "Подсказка открыта", true)],
    render(el, state, redraw) {
      el.append(
        button(state.visible ? ui.hide_hint : ui.hint_show, "secondary", () => {
          state.visible = !state.visible;
          redraw();
        })
      );
      if (state.visible) el.append(node("div", "hint", course.choice.hint.ru));
    },
  },
  {
    id: "notice",
    title: "Уведомление",
    group: "feedback",
    description:
      "p.notice — предупреждение о недоступном режиме урока; классы и текст из app.ts / i18n.ts.",
    controls: [text("text", "Сообщение", ui.mode_unavailable)],
    render(el, state) {
      el.append(node("p", "notice", String(state.text)));
    },
  },
  {
    id: "next-step",
    title: "Следующий шаг",
    group: "feedback",
    description:
      "p.next-step > strong + span — направление дальнейшего действия на главной, в каталоге и модуле.",
    render(el) {
      el.append(nextStep());
    },
  },
  {
    id: "story",
    title: "Вступление к модулю",
    group: "feedback",
    description: "p.story — сюжетное вступление модуля M8, взятое из curriculum.",
    render(el) {
      el.append(node("p", "story", course.modules.find((m) => m.module === 8)!.story_intro.ru));
    },
  },
  {
    id: "track",
    title: "Карточка трека",
    group: "collections",
    description:
      "article.track-card > header.track-head + div.track-list + footer.track-foot. Трек Ada, M16–M17: n из m, ✓, .is-next и ДАЛЕЕ. Настройте число решённых уроков.",
    controls: [range("done", "Решено уроков", 4, 8)],
    render(el, state) {
      const tracks = node("section", "tracks");
      const fresh = track(0);
      fresh.dataset.example = "fresh";
      const complete = track(8);
      complete.dataset.example = "complete";
      tracks.append(track(Number(state.done)), fresh, complete);
      el.append(tracks);
    },
  },
  {
    id: "modules",
    title: "Модули и уроки",
    group: "collections",
    description:
      "section.module-list / .lesson-list > button.module-row / .lesson-row. Номер, название, пояснение и .status.done; обычный, частичный и завершённый прогресс.",
    render(el) {
      el.append(section("Модули", modules()), section("Уроки", modules(true)));
    },
  },
  {
    id: "catalog",
    title: "Каталог",
    group: "collections",
    description:
      "section.catalog-row.prologue — вводный модуль в каталоге направлений. Структура трёх колонок из app.ts.",
    render(el) {
      el.append(
        node("div", "eyebrow", ui.directions),
        node("h1", "", ui.tracks_title),
        node("p", "lede", ui.tracks_intro),
        nextStep(),
        catalog()
      );
    },
  },
  {
    id: "skills",
    title: "Навыки и статусы",
    group: "collections",
    description:
      "div.skills-list > button.skill-row > span.skill-title + span.skill-status. Статусы: не доказан, .partial, .done; без очков и уровней.",
    render(el) {
      el.append(skills());
    },
  },
  {
    id: "tags",
    title: "Теги",
    group: "collections",
    description: "span.tag.green / .blue / .amber / .violet — цветовые метки направлений в app.ts.",
    controls: [select("tone", "Цвет настраиваемого тега", ["green", "blue", "amber", "violet"])],
    render(el, state) {
      const tags = node("div");
      tags.append(
        node("span", "tag green", "ASM"),
        node("span", "tag blue", "C"),
        node("span", "tag amber", "C++"),
        node("span", "tag violet", "ADA")
      );
      for (const child of [...tags.children]) child.after("　");
      el.append(tags, section("Настройка", node("span", `tag ${state.tone}`, "ASM")));
    },
  },
  {
    id: "panel",
    title: "Панель",
    group: "collections",
    description:
      "section.panel > h2 + p — вспомогательная информация на главной, в программе и уроке.",
    render(el) {
      const stack = node("aside", "info-stack");
      stack.append(panel());
      el.append(stack);
    },
  },
  {
    id: "values",
    title: "Сетка ценностей",
    group: "collections",
    description:
      "div.value-grid > div.value > strong + p — три принципа обучения на главной странице.",
    render(el) {
      el.append(values());
    },
  },
  {
    id: "machine",
    title: "Листинг, регистры и флаги",
    group: "machine",
    description:
      "Стенд M3.2 и M3.4 из bench.ts. M3.4 показывает пропущенную инструкцию после перехода. .bench-line: .is-next / .is-current / .is-skipped / .is-label; .machine-reg.is-changed, .machine-flag.is-on, .bench-cell. Шаг меняет реальные снимки курса; закрытый стенд скрывает значения.",
    controls: [
      select("trace", "Сценарий", ["M3.2", "M3.4"]),
      range("step", "Номер шага", 1, course.trace.steps.length),
      toggle("locked", "Стенд закрыт"),
    ],
    render(el, state, redraw) {
      el.append(machine(state, redraw));
    },
  },
  {
    id: "topbar",
    title: "Верхняя панель",
    group: "shell",
    description:
      "header.topbar > button.brand + nav.topnav + span.session + div.skin-switch + button.account-button. Все переключатели работают, аккаунт открывает диалог.",
    controls: [range("nav", "Текущий раздел", 0, 3)],
    render(el, state, redraw) {
      el.append(topbar(state, redraw));
    },
  },
  {
    id: "breadcrumb",
    title: "Хлебные крошки",
    group: "shell",
    description:
      "div.breadcrumb > button из урока: переходы M3 / ASM / урок. Нажатие меняет выбранную ступень примера.",
    controls: [text("location", "Текущая ступень", "Урок 02")],
    render(el, state, redraw) {
      const row = node("div", "breadcrumb");
      for (const label of ["M3", "ASM"]) {
        const b = node("button", "", label);
        b.onclick = () => {
          state.location = label;
          redraw();
        };
        row.append(b, " / ");
      }
      row.append(String(state.location));
      el.append(row);
    },
  },
  {
    id: "lesson-nav",
    title: "Навигация по урокам",
    group: "shell",
    description:
      "aside.lesson-nav > strong + button.active[aria-current=step]. Клик переключает выбранный урок.",
    controls: [range("lesson", "Урок", 1, 4)].map((c) => ({ ...c, min: 1 })),
    render(el, state, redraw) {
      const nav = node("aside", "lesson-nav");
      nav.append(node("strong", "", "M0 · Пролог"));
      for (let i = 1; i <= 4; i++) {
        const b = node(
          "button",
          Number(state.lesson) === i ? "active" : "",
          `Урок ${String(i).padStart(2, "0")}`
        );
        if (Number(state.lesson) === i) b.setAttribute("aria-current", "step");
        b.onclick = () => {
          state.lesson = i;
          redraw();
        };
        nav.append(b);
      }
      nav.append(button(ui.overview));
      el.append(nav);
    },
  },
  {
    id: "footer",
    title: "Подвал",
    group: "shell",
    description:
      "footer.site-footer > span + span.footer-meta; источник курса и локальный прогресс — как в app.ts.",
    render(el) {
      el.append(
        html(
          `<footer class="site-footer"><span>${ui.footer}</span><span class="footer-meta"><span class="corpus-source" data-origin="local">${ui.corpus_source_local}</span><span>${ui.footer_local}</span></span></footer>`
        )
      );
    },
  },
  {
    id: "auth",
    title: "Форма входа",
    group: "forms",
    description:
      "form.auth-form > label.auth-field > span + input; p.auth-error[role=alert]. Обычная форма и форма с ошибкой показаны вместе. Данные никуда не отправляются.",
    controls: [toggle("signup", "Создание профиля")],
    render(el, state) {
      for (const [title, form] of [
        ["Обычная форма", auth(false, Boolean(state.signup))],
        ["Ошибка", auth(true, true)],
      ] as const) {
        const wrapper = section(title, form);
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        el.append(wrapper);
      }
    },
  },
  {
    id: "answer-field",
    title: "Поле ответа",
    group: "forms",
    description:
      "div.answer-box > input — однострочное поле урока; реальный disabled, ввод и отправка Enter.",
    controls: [toggle("disabled", "Заблокировано")],
    render(el, state) {
      el.append(answerField(false, Boolean(state.disabled)));
    },
  },
  {
    id: "textarea",
    title: "Многострочный ответ",
    group: "forms",
    description:
      "div.answer-box > textarea[rows=5][spellcheck=false] — упражнение M18.4. Ctrl/⌘+Enter отправляет введённый код.",
    controls: [toggle("disabled", "Заблокировано")],
    render(el, state) {
      el.append(node("p", "", course.write.prompt.ru), answerField(true, Boolean(state.disabled)));
    },
  },
  {
    id: "dialog",
    title: "Диалог аккаунта",
    group: "forms",
    description:
      "section.account-dialog[role=dialog][aria-modal=true] внутри .dialog-backdrop. Ниже — содержимое; кнопка открывает настоящую модалку с Escape, возвратом фокуса и циклом Tab.",
    render(el) {
      const open = button(ui.account, "primary", () => openDialog(open));
      el.append(open);
      const specimen = dialog();
      specimen.removeAttribute("aria-modal");
      el.append(specimen);
    },
  },
  {
    id: "code",
    title: "Блок кода",
    group: "forms",
    description: "pre.code — листинг задания. Текст взят из M18.3; пробелы и переносы сохранены.",
    controls: [text("code", "Код", course.text.code_lines.join("\n"))],
    render(el, state) {
      el.append(node("pre", "code", String(state.code)));
    },
  },
];
