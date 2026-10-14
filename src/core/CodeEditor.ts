import { h } from "./dom";

/**
 * CodeEditor — headless-ядро обёртки редактора кода (Monaco внешний).
 * Только каркас: тулбар (язык/файл), контейнер под Monaco, строка статуса.
 * A11y: приложение Monaco подключает само; каркас держит aria-метки.
 */
export interface CodeEditorProps {
  fileName?: string;
  language?: string;
  /** Высота контейнера, px. */
  height?: number;
  /** stdin-панель. */
  stdin?: boolean;
  /** Подпись строки статуса (позиция курсора и т.п.). */
  statusText?: string;
}

export interface CodeEditorApi {
  el: HTMLElement;
  /** Слот, куда приложение монтирует Monaco. */
  mount: HTMLElement;
  /** Слот stdin-панели. */
  stdinSlot: HTMLElement | null;
  setStatus: (text: string) => void;
}

export function createCodeEditor(props: CodeEditorProps): CodeEditorApi {
  const p = { height: 320, ...props };
  const el = h("div", "ui-codeeditor");
  const head = h("div", "ui-codeeditor__head");
  const file = h("span", "ui-codeeditor__file");
  file.textContent = p.fileName ?? "main.asm";
  const lang = h("span", "ui-codeeditor__lang");
  lang.textContent = p.language ?? "nasm";
  head.append(file, lang);
  el.appendChild(head);
  const mount = h("div", "ui-codeeditor__mount", {
    role: "textbox",
    "aria-label": `Code editor: ${p.fileName ?? "untitled"}`,
    "aria-multiline": "true",
    "aria-readonly": "false",
  });
  mount.style.height = `${p.height}px`;
  el.appendChild(mount);
  let stdinSlot: HTMLElement | null = null;
  if (p.stdin) {
    stdinSlot = h("div", "ui-codeeditor__stdin");
    const lbl = h("div", "ui-codeeditor__stdin-label");
    lbl.textContent = "stdin";
    stdinSlot.appendChild(lbl);
    el.appendChild(stdinSlot);
  }
  const status = h("div", "ui-codeeditor__status");
  status.textContent = p.statusText ?? "";
  el.appendChild(status);

  return {
    el,
    mount,
    stdinSlot,
    setStatus(text) {
      status.textContent = text;
    },
  };
}
