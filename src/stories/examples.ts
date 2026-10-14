// DOM structure mirrors app.ts, skills-view.ts, auth/auth-gate.ts and bench.ts.
import { course, ui, lessonPrompts, skillNames } from "./course";
import { button, layout, node, section, skinSwitch, type State } from "./shared";
export const escape = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
export function html(markup: string): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild as HTMLElement;
}
export function feedback(ok: boolean): HTMLElement {
  return html(
    `<section class="feedback ${ok ? "ok" : "fail"}"><strong>${ok ? ui.ok : ui.fail}</strong><p>${escape(course.choice.explanation.ru)}</p></section>`
  );
}
export function option(text: string, index = 0, state = "", disabled = false): HTMLButtonElement {
  const el = node("button", `option${state ? ` ${state}` : ""}`);
  el.type = "button";
  el.disabled = disabled;
  el.setAttribute("aria-pressed", String(["is-selected", "correct", "wrong"].includes(state)));
  el.append(node("span", "", String.fromCharCode(65 + index)), text);
  return el;
}
export function modeSwitch(state: State, redraw: () => void): HTMLElement {
  const el = node("div", "mode-switch");
  for (const mode of ["Script Kiddie", "Console Cowboy"]) {
    const item = node("button", (state.mode ?? "Script Kiddie") === mode ? "is-on" : "", mode);
    item.type = "button";
    item.setAttribute("aria-pressed", String((state.mode ?? "Script Kiddie") === mode));
    item.onclick = () => {
      state.mode = mode;
      redraw();
    };
    el.append(item);
  }
  return el;
}
export function grouping(state: State, redraw: () => void): HTMLElement {
  const el = node("div", "skills-grouping");
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", ui.tracks_group_label);
  [ui.tracks_group_domain, ui.tracks_group_track].forEach((label, i) => {
    const item = node("button", Number(state.grouping ?? 0) === i ? "is-on" : "", label);
    item.dataset.grouping = i ? "track" : "domain";
    item.setAttribute("aria-pressed", String(Number(state.grouping ?? 0) === i));
    item.onclick = () => {
      state.grouping = i;
      redraw();
    };
    el.append(item);
  });
  return el;
}
export function topnav(state: State, redraw: () => void): HTMLElement {
  const el = node("nav", "topnav");
  el.setAttribute("aria-label", ui.main_nav);
  [ui.home, ui.directions, ui.skills_nav, ui.lab].forEach((label, i) => {
    const item = node("button", Number(state.nav ?? 0) === i ? "is-current" : "", label);
    item.onclick = () => {
      state.nav = i;
      redraw();
    };
    el.append(item);
  });
  return el;
}
export function topbar(state: State, redraw: () => void): HTMLElement {
  const el = node("header", "topbar");
  const brand = html(
    '<button class="brand" aria-label="ASM Protocol — начало">ASM<span>://</span>PROTOCOL</button>'
  );
  brand.onclick = () => {
    state.nav = 0;
    redraw();
  };
  const session = node("span", "session");
  session.append(node("i"), ui.local_session);
  const account = node("button", "account-button", ui.account);
  account.onclick = () => openDialog(account);
  el.append(brand, topnav(state, redraw), session, skinSwitch(state, redraw), account);
  return el;
}
export function dialog(close: () => void = () => {}): HTMLElement {
  const el = node("section", "account-dialog");
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "account-title");
  const header = node("header");
  const title = node("strong", "", ui.account_title);
  title.id = "account-title";
  const esc = button("ESC", "secondary", close);
  esc.setAttribute("aria-label", ui.close);
  header.append(title, esc);
  const signout = node("button", "button", ui.auth_signout);
  signout.dataset.signout = "";
  signout.onclick = close;
  el.append(
    header,
    node("p", "", ui.auth_signed_in_as.replace("{name}", "operator")),
    node("p", "", ui.nothing_local),
    signout,
    button(ui.clear_local, "danger", close)
  );
  return el;
}
export function openDialog(trigger: HTMLElement): void {
  const backdrop = node("div", "dialog-backdrop");
  const close = () => {
    backdrop.remove();
    trigger.focus();
  };
  const content = dialog(close);
  backdrop.append(content);
  backdrop.onclick = (event) => {
    if (event.target === backdrop) close();
  };
  backdrop.onkeydown = (event) => {
    if (event.key === "Escape") close();
    if (event.key !== "Tab") return;
    const items = [...content.querySelectorAll<HTMLButtonElement>("button")];
    const first = items[0],
      last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  // Owned by the preview, so changing stories unmounts the overlay as well.
  trigger.closest("[data-showcase]")!.append(backdrop);
  content.querySelector("button")?.focus();
}
export function track(done: number): HTMLElement {
  const mods = course.modules.filter((m) => m.module === 16 || m.module === 17);
  const el = node("article", "track-card");
  el.dataset.track = "ada";
  el.append(
    html(
      `<header class="track-head"><span class="tag violet">ADA</span><h2>${ui.course_ada_title}</h2><p>МОДУЛЕЙ РЕШЕНО: ${done === 8 ? 2 : done >= 4 ? 1 : 0} ИЗ 2</p></header>`
    )
  );
  const list = node("div", "track-list");
  mods.forEach((mod, i) => {
    const n = Math.max(0, Math.min(4, done - 4 * i));
    const next = n < 4 && (i === 0 || done >= 4);
    list.append(
      html(
        `<button class="track-module${next ? " is-next" : ""}" data-module="${mod.id}" data-solved="${n === 4}"><span class="track-module-num">${n === 4 ? "✓" : `M${mod.module}`}</span><span class="track-module-body"><b>${mod.title.ru}</b><small>${n === 4 ? ui.passed : n ? `${n} / 4` : ui.not_started}</small></span>${next ? '<span class="track-module-next">ДАЛЕЕ</span>' : ""}</button>`
      )
    );
  });
  el.append(
    list,
    html(
      `<footer class="track-foot"><small class="track-next${done === 8 ? " done" : ""}">${done === 8 ? ui.track_all_done : `СЛЕДУЮЩИЙ НЕРЕШЁННЫЙ: M${done >= 4 ? 17 : 16} · УРОК ${String((done % 4) + 1).padStart(2, "0")}`}</small><small>2 МОДУЛЯ · ${done} / 8 УРОКОВ</small></footer>`
    )
  );
  return el;
}
export function modules(lessons = false): HTMLElement {
  const el = node("section", lessons ? "lesson-list" : "module-list");
  if (lessons) {
    lessonPrompts
      .slice(0, 3)
      .forEach((prompt, i) =>
        el.append(
          html(
            `<button class="lesson-row"><span>${i === 2 ? "✓" : String(i + 1).padStart(2, "0")}</span><span><b>${escape(prompt)}</b><small>Урок ${i + 1}</small></span></button>`
          )
        )
      );
    return el;
  }

  course.modules
    .filter((m) => m.module >= 8)
    .slice(0, 3)
    .forEach((mod, i) => {
      el.append(
        html(
          `<button class="${lessons ? "lesson-row" : "module-row"}"><span>${lessons ? String(i + 1).padStart(2, "0") : `M${mod.module}`}</span><span><b>${lessons ? `Урок ${i + 1}` : mod.title.ru}</b><small>${mod.description.ru}</small></span><span class="status${i === 2 ? " done" : ""}">${i === 0 ? ui.not_started : i === 1 ? "2 / 4" : ui.passed}</span></button>`
        )
      );
    });
  return el;
}
export function catalog(): HTMLElement {
  const mod = course.modules[0];
  return html(
    `<section class="catalog-row prologue"><div><span class="tag green">${ui.prologue_tag}</span><h2>${mod.title.ru}</h2><p>${mod.description.ru}</p></div><div><small>${ui.prep}</small><p>${ui.prep_none}</p></div><div class="actions column"><small>${mod.lessons} УРОКА</small><button class="button button--primary">${ui.open_m0}</button></div></section>`
  );
}
export function skills(): HTMLElement {
  const el = node("div", "skills-list");
  [
    [skillNames[0], "", ui.skill_unproven],
    [skillNames[1], "partial", ui.skill_partial.replace("{done}", "1").replace("{total}", "2")],
    [skillNames[2], "done", ui.skill_proven],
  ].forEach(([title, status, text]) =>
    el.append(
      html(
        `<button class="skill-row"><span class="skill-title">${title}</span><span class="skill-status ${status}" data-status="${status === "done" ? "proven" : status || "unproven"}">${text}</span></button>`
      )
    )
  );
  return el;
}
export function panel(): HTMLElement {
  return html(`<section class="panel"><h2>${ui.prep}</h2><p>${ui.prep_none}</p></section>`);
}
export function nextStep(): HTMLElement {
  return html(
    `<p class="next-step"><strong>${ui.next_step_label}</strong><span>&gt; ${ui.next_step_catalog}</span></p>`
  );
}
export function values(): HTMLElement {
  return html(
    `<div class="value-grid">${["calm", "feedback", "local"].map((id) => `<div class="value"><strong>${ui[`value_${id}` as keyof typeof ui]}</strong><p>${ui[`value_${id}_body` as keyof typeof ui]}</p></div>`).join("")}</div>`
  );
}
export function auth(error: boolean, signup: boolean): HTMLElement {
  const el = node("form", "auth-form");
  [
    [ui.auth_name, "text", "username"],
    [ui.auth_passphrase, "password", signup ? "new-password" : "current-password"],
    ...(signup ? [[ui.auth_passphrase_repeat, "password", "new-password"]] : []),
  ].forEach(([text, type, autocomplete]) => {
    const label = node("label", "auth-field");
    const input = node("input");
    input.type = type;
    input.autocomplete = autocomplete as AutoFill;
    input.spellcheck = false;
    label.append(node("span", "", text), input);
    el.append(label);
  });
  if (error) el.append(html(`<p class="auth-error" role="alert">${ui.auth_error_mismatch}</p>`));
  const actions = node("div", "actions");
  const submit = button(signup ? ui.auth_signup : ui.auth_signin, "primary");
  submit.type = "submit";
  actions.append(
    submit,
    button(signup ? ui.auth_to_signin : ui.auth_to_signup, "secondary", () =>
      el.replaceWith(auth(false, !signup))
    )
  );
  el.append(actions);
  el.onsubmit = (event) => {
    event.preventDefault();
    if (!el.querySelector(".auth-error"))
      actions.before(html(`<p class="auth-error" role="alert">${ui.auth_error_invalid}</p>`));
  };
  return el;
}
export function answerField(multiline: boolean, disabled = false): HTMLElement {
  const el = node("div", "answer-box");
  const input = multiline ? node("textarea") : node("input");
  input.setAttribute("aria-label", ui.prompt_answer);
  input.placeholder = ui.prompt_answer;
  input.spellcheck = false;
  input.disabled = disabled;
  if (input instanceof HTMLTextAreaElement) input.rows = 5;
  const submit = button(ui.check, "primary");
  submit.disabled = true;
  input.oninput = () => {
    submit.disabled = !input.value.trim();
  };
  const check = () => {
    if (!input.value.trim() || input.disabled) return;
    input.disabled = true;
    submit.remove();
    el.after(feedback(multiline ? /Server\.Stop;/.test(input.value) : input.value.trim() === "2"));
  };
  submit.onclick = check;
  input.onkeydown = (event) => {
    if (event.key === "Enter" && (!multiline || event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      check();
    }
  };
  el.append(input);
  if (!disabled) el.append(submit);
  return el;
}
export function choices(el: HTMLElement, state: State, redraw: () => void): void {
  const states = node("div", "options");
  states.dataset.optionStates = "";
  ["", "is-selected", "correct", "wrong", "disabled"].forEach((status, i) => {
    const opt = option(
      course.choice.options[i % 4].ru,
      i % 4,
      status === "disabled" ? "" : status,
      ["correct", "wrong", "disabled"].includes(status)
    );
    opt.dataset.state = status || "normal";
    states.append(opt);
  });
  el.append(section("Состояния: обычный · выбран · верно · неверно · заблокирован", states));
  const exercise = node("div", "exercise");
  exercise.dataset.liveChoice = "";
  exercise.append(node("h1", "", course.choice.prompt.ru));
  const options = node("div", "options");
  const chosen = Number(state.chosen ?? -1),
    answered = Boolean(state.answered);
  course.choice.options.forEach((text, i) => {
    const status = answered
      ? i === course.choice.answer_index
        ? "correct"
        : i === chosen
          ? "wrong"
          : ""
      : i === chosen
        ? "is-selected"
        : "";
    const opt = option(text.ru, i, status, answered);
    opt.setAttribute("aria-pressed", String(chosen === i));
    opt.onclick = () => {
      state.chosen = i;
      redraw();
    };
    options.append(opt);
  });
  exercise.append(options);
  if (answered) {
    const result = feedback(chosen === course.choice.answer_index);
    result.append(
      button(ui.retry, "secondary", () => {
        state.chosen = -1;
        state.answered = false;
        redraw();
      })
    );
    exercise.append(result);
  } else {
    const row = node("div", "answer-submit");
    const submit = button(ui.check, "primary", () => {
      state.answered = true;
      redraw();
    });
    submit.disabled = chosen < 0;
    row.append(submit);
    exercise.append(row);
  }
  el.append(section("Живое задание", exercise));
}
export function order(el: HTMLElement, state: State, redraw: () => void): void {
  const source = course.order.items;
  const indices =
    (state.order as number[] | undefined) ?? source.map((_, i) => source.length - i - 1);
  const list = node("div", "order-list");
  list.setAttribute("data-testid", "order-list");
  indices.forEach((index, pos) => {
    const row = node(
      "div",
      `order-item${state.orderAnswered ? (index === pos ? " correct" : " wrong") : ""}`
    );
    const actions = node("span", "order-controls");
    [-1, 1].forEach((delta) => {
      const control = node("button", "order-btn", delta < 0 ? "↑" : "↓");
      control.disabled =
        Boolean(state.orderAnswered) || pos + delta < 0 || pos + delta >= indices.length;
      control.setAttribute("aria-label", delta < 0 ? ui.order_move_up : ui.order_move_down);
      control.onclick = () => {
        const next = [...indices];
        [next[pos], next[pos + delta]] = [next[pos + delta], next[pos]];
        state.order = next;
        redraw();
      };
      actions.append(control);
    });
    row.append(
      node("span", "order-num", String(pos + 1)),
      node("span", "order-text", source[index].ru),
      actions
    );
    list.append(row);
  });
  const submit = button(ui.order_check, "primary", () => {
    state.orderAnswered = true;
    redraw();
  });
  submit.disabled = Boolean(state.orderAnswered);
  list.append(submit);
  el.append(node("p", "", course.order.prompt.ru), list);
  if (state.orderAnswered)
    el.append(
      node("p", "", indices.every((index, i) => index === i) ? ui.order_correct : ui.order_wrong),
      button(ui.retry, "secondary", () => {
        state.orderAnswered = false;
        redraw();
      })
    );
}
