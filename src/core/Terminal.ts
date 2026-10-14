import { h, emit } from "./dom";

/**
 * Terminal — headless-ядро терминала: строки stdout/stderr + exit-code.
 * Поведение: appendLine(stream, text), setExit(code), clear().
 * A11y: role=log aria-live=polite, exit-строка — status.
 */
export type TermStream = "stdout" | "stderr" | "echo" | "info";

export interface TerminalProps {
  title?: string;
  /** Уже существующие строки. */
  lines?: { stream: TermStream; text: string }[];
  exitCode?: number | null;
  height?: number;
  /** Автоскролл вниз при добавлении. */
  autoScroll?: boolean;
}

export interface TerminalApi {
  el: HTMLElement;
  body: HTMLElement;
  appendLine: (stream: TermStream, text: string) => void;
  setExit: (code: number) => void;
  clear: () => void;
  destroy: () => void;
}

export function createTerminal(props: TerminalProps): TerminalApi {
  const p = { autoScroll: true, ...props };
  const el = h("div", "ui-terminal");
  if (p.title !== undefined) {
    const head = h("div", "ui-terminal__head");
    const t = h("span", "ui-terminal__title");
    t.textContent = p.title;
    const meta = h("span", "ui-terminal__meta");
    head.append(t, meta);
    el.appendChild(head);
  }
  const body = h("div", "ui-terminal__body", { role: "log", "aria-live": "polite", tabindex: "0" });
  if (p.height) body.style.height = `${p.height}px`;
  el.appendChild(body);
  const status = h("div", "ui-terminal__status", { role: "status" });
  status.setAttribute("hidden", "");
  el.appendChild(status);

  function appendLine(stream: TermStream, text: string) {
    const line = h("div", `ui-terminal__line ui-terminal__line--${stream}`);
    line.textContent = text;
    body.appendChild(line);
    if (p.autoScroll) body.scrollTop = body.scrollHeight;
  }
  for (const l of p.lines ?? []) appendLine(l.stream, l.text);

  function setExit(code: number) {
    status.removeAttribute("hidden");
    status.dataset.exit = String(code);
    status.classList.toggle("ui-terminal__status--ok", code === 0);
    status.classList.toggle("ui-terminal__status--fail", code !== 0);
    status.textContent = `Process exited with code ${code}`;
  }
  if (p.exitCode !== null && p.exitCode !== undefined) setExit(p.exitCode);

  return {
    el,
    body,
    appendLine,
    setExit,
    clear() {
      body.innerHTML = "";
      status.setAttribute("hidden", "");
    },
    destroy() {
      /* нет глобальных листенеров */
    },
  };
}
