import { h, uid, emit } from "./dom";

/**
 * TextInput — headless-ядро текстового поля.
 * A11y: label (aria-labelledby), сообщение об ошибке (aria-invalid + aria-describedby).
 */
export interface TextInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  /** mono-режим (для id/кода). */
  mono?: boolean;
  error?: string;
  hint?: string;
  /** Префикс-символ (например «>» или «$»). */
  prefix?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

export interface TextInputApi {
  el: HTMLElement;
  input: HTMLInputElement;
  getValue: () => string;
  setValue: (v: string) => void;
  setError: (msg: string | null) => void;
  focus: () => void;
  destroy: () => void;
}

export function createTextInput(props: TextInputProps): TextInputApi {
  const p = { value: "", ...props };
  const id = uid("textinput");
  const el = h("div", "ui-textinput");
  const input = h("input", "ui-textinput__input");
  input.id = id;
  input.type = "text";
  input.value = p.value;
  if (p.placeholder) input.placeholder = p.placeholder;
  if (p.disabled) input.disabled = true;
  if (p.readonly) input.readOnly = true;
  if (p.mono !== false) input.classList.add("ui-mono");
  if (p.prefix) {
    el.classList.add("ui-textinput--prefix");
    const pre = h("span", "ui-textinput__prefix", { "aria-hidden": "true" });
    pre.textContent = p.prefix;
    el.appendChild(pre);
  }
  el.appendChild(input);

  const msgId = `${id}-msg`;
  let msgEl: HTMLElement | null = null;
  function applyMsg() {
    if (msgEl) {
      msgEl.remove();
      msgEl = null;
    }
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    if (p.error) {
      msgEl = h("div", "ui-textinput__msg ui-textinput__msg--error", { role: "alert" });
      msgEl.id = msgId;
      msgEl.textContent = p.error;
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", msgId);
    } else if (p.hint) {
      msgEl = h("div", "ui-textinput__msg");
      msgEl.id = msgId;
      msgEl.textContent = p.hint;
      input.setAttribute("aria-describedby", msgId);
    }
    if (msgEl) el.appendChild(msgEl);
    el.classList.toggle("ui-textinput--error", Boolean(p.error));
  }

  let labelEl: HTMLElement | null = null;
  if (p.label) {
    labelEl = h("label", "ui-textinput__label", { for: id });
    labelEl.textContent = p.label;
    el.prepend(labelEl);
  }
  applyMsg();

  const onInput = () => {
    p.value = input.value;
    p.onChange?.(p.value);
    emit(el, "ui:change", { value: p.value });
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      p.onEnter?.(input.value);
      emit(el, "ui:enter", { value: input.value });
    }
  };
  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKey);

  return {
    el,
    input,
    getValue: () => input.value,
    setValue(v) {
      input.value = v;
      p.value = v;
    },
    setError(msg) {
      p.error = msg ?? undefined;
      applyMsg();
    },
    focus: () => input.focus(),
    destroy() {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKey);
    },
  };
}
