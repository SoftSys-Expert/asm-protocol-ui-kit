import { h, emit } from "./dom";

/**
 * GuestPrompt — headless-ядро гостевого входа в hero.
 * `> выбрать трек_` — терминальная строка как CTA.
 */
export interface GuestPromptProps {
  placeholder?: string;
  /** Подсказка под строкой. */
  hint?: string;
  onSubmit?: (value: string) => void;
}

export interface GuestPromptApi {
  el: HTMLElement;
  focus: () => void;
  destroy: () => void;
}

export function createGuestPrompt(props: GuestPromptProps): GuestPromptApi {
  const p = { placeholder: "выбрать трек", ...props };
  const el = h("form", "ui-guest", { role: "search", "aria-label": "Start as guest" });
  const line = h("div", "ui-guest__line");
  const prompt = h("span", "ui-guest__prompt", { "aria-hidden": "true" });
  prompt.textContent = "›";
  const input = h("input", "ui-guest__input", { type: "text", "aria-label": "Track name" });
  input.placeholder = `${p.placeholder}_`;
  const cursor = h("span", "ui-guest__cursor", { "aria-hidden": "true" });
  cursor.textContent = "_";
  line.append(prompt, input, cursor);
  el.appendChild(line);
  if (p.hint) {
    const hint = h("div", "ui-guest__hint");
    hint.textContent = p.hint;
    el.appendChild(hint);
  }

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const v = input.value.trim();
    if (v) {
      p.onSubmit?.(v);
      emit(el, "ui:submit", { value: v });
    }
  };
  el.addEventListener("submit", onSubmit);
  return {
    el,
    focus: () => input.focus(),
    destroy() {
      el.removeEventListener("submit", onSubmit);
    },
  };
}
