import type {
  HistoireVanillaState,
  HistoireVanillaStory,
  HistoireVanillaVariant,
} from "../histoire.d";
import { resetFx } from "../site/fx";
import { mountStyles } from "./styles";

export type State = HistoireVanillaState;
export type Render = (el: HTMLElement, state: State, redraw: () => void) => void;
export interface Control {
  key: string;
  label: string;
  type?: "text" | "checkbox" | "range" | "color";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  value: string | number | boolean;
}
export function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  text?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
export function button(text: string, kind = "secondary", action?: () => void): HTMLButtonElement {
  const el = node("button", kind === "link" ? "text-link" : `button button--${kind}`, text);
  el.type = "button";
  if (action) el.onclick = action;
  return el;
}
export function layout(...children: HTMLElement[]): HTMLDivElement {
  const el = node("div");
  el.style.cssText = "display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start";
  el.append(...children);
  return el;
}
export function section(title: string, ...children: HTMLElement[]): HTMLElement {
  const el = node("section");
  el.style.marginBottom = "28px";
  el.append(node("h2", "", title), ...children);
  return el;
}
export function skinSwitch(state: State, redraw: () => void): HTMLElement {
  const el = node("div", "skin-switch");
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", "Оформление");
  for (const skin of ["operator", "tty"]) {
    const item = node("button", state.skin === skin ? "is-on" : "", skin);
    item.type = "button";
    item.setAttribute("aria-pressed", String(state.skin === skin));
    item.onclick = () => {
      state.skin = skin;
      redraw();
    };
    el.append(item);
  }
  return el;
}
export function controls(api: HistoireVanillaVariant, specs: Control[]): void {
  const { el, state, onUpdate } = api;
  const form = node("div");
  form.style.cssText = "display:grid;gap:16px;padding:16px";
  const inputs: (() => void)[] = [];
  for (const spec of specs) {
    const label = node("label");
    label.style.cssText = "display:grid;gap:6px";
    const caption = node("span", "", spec.label);
    const input = spec.options ? node("select") : node("input");
    input.dataset.control = spec.key;
    input.setAttribute("aria-label", spec.label);
    if (input instanceof HTMLSelectElement) {
      for (const value of spec.options!) {
        const option = node("option", "", value);
        option.value = value;
        input.append(option);
      }
    } else {
      input.type = spec.type ?? "text";
      if (spec.min !== undefined) input.min = String(spec.min);
      if (spec.max !== undefined) input.max = String(spec.max);
      if (spec.step !== undefined) input.step = String(spec.step);
    }
    const output = node("output");
    const update = () => {
      const value = state[spec.key] ?? spec.value;
      if (input instanceof HTMLInputElement && input.type === "checkbox")
        input.checked = Boolean(value);
      else input.value = String(value);
      output.textContent = spec.type === "range" ? String(value) : "";
    };
    input.oninput = () => {
      state[spec.key] =
        input instanceof HTMLInputElement && input.type === "checkbox"
          ? input.checked
          : spec.type === "range"
            ? Number(input.value)
            : input.value;
      update();
    };
    update();
    inputs.push(update);
    label.append(caption, input, output);
    form.append(label);
  }
  onUpdate(() => inputs.forEach((update) => update()));
  el.append(form);
}
export interface Page {
  id: string;
  title: string;
  group: string;
  description: string;
  controls?: Control[];
  render: Render;
  defaults?: State;
}
export function createStory(page: Page): HistoireVanillaStory {
  const specs: Control[] = [
    { key: "skin", label: "Скин", options: ["operator", "tty"], value: "operator" },
    ...(page.controls ?? []),
  ];
  return {
    id: page.id,
    title: page.title,
    group: page.group,
    layout: { type: "single", iframe: true },
    variants: [
      {
        id: "preview",
        title: "Варианты и настройки",
        onMount(api) {
          const { el, state, onUpdate, onUnmount } = api;
          const doc = el.ownerDocument;
          const removeStyles = mountStyles(doc);
          const originalClass = doc.body.className;
          for (const spec of specs) state[spec.key] ??= spec.value;
          for (const [key, value] of Object.entries(page.defaults ?? {})) state[key] ??= value;
          const querySkin = new URLSearchParams(doc.defaultView?.location.search).get("skin");
          if (querySkin === "operator" || querySkin === "tty") state.skin = querySkin;
          const main = node("main");
          main.dataset.showcase = page.id;
          main.style.cssText = "padding:28px;max-width:1400px;margin:0 auto";
          el.append(main);
          const render = () => {
            // FX remains scoped to this iframe. Every change renders from shared Histoire state.
            doc.body.classList.remove("skin-operator", "skin-tty");
            doc.body.classList.add(`skin-${state.skin}`);
            main.replaceChildren();
            const header = section(
              page.title,
              node("p", "lede", page.description),
              layout(skinSwitch(state, render))
            );
            header.firstElementChild?.replaceWith(node("h1", "", page.title));
            main.append(header);
            const content = node(
              "div",
              [
                "topbar",
                "topnav",
                "skin",
                "footer",
                "dialog",
                "effects",
                "glitch",
                "glow",
                "crt",
              ].includes(page.id)
                ? ""
                : [
                      "code",
                      "order",
                      "feedback",
                      "hint",
                      "text-answer",
                      "answer-field",
                      "textarea",
                    ].includes(page.id)
                  ? "exercise"
                  : "screen"
            );
            content.dataset.demo = "";
            main.append(content);
            page.render(content, state, render);
          };
          onUpdate(render);
          render();
          onUnmount(() => {
            resetFx(doc.documentElement);
            doc.body.className = originalClass;
            main.remove();
            removeStyles();
          });
        },
        onMountControls(api) {
          controls(api, specs);
        },
      },
    ],
  };
}
