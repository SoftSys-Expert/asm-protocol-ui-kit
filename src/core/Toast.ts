import { h, uid, emit } from "./dom";

/**
 * Toast — headless-ядро всплывающих уведомлений (контейнер + тосты).
 * Поведение: show({message,tone,duration}) снизу-справа, авто-скрытие.
 * A11y: контейнер role=region aria-label, тост role=status.
 */
export type ToastTone = "info" | "success" | "warn" | "fail";

export interface ToastOptions {
  message: string;
  tone?: ToastTone;
  /** Время жизни, мс (0 = вручную). */
  duration?: number;
  /** Код статуса (exit code) для показа. */
  code?: string;
}

export interface ToastApi {
  /** Контейнер-регион (обычноappendTo body). */
  el: HTMLElement;
  show: (opts: ToastOptions) => void;
  dismissAll: () => void;
  destroy: () => void;
}

export function createToast(props?: {
  position?: "bottom-right" | "bottom-left" | "top-right";
}): ToastApi {
  const p = { position: "bottom-right", ...props };
  const el = h("div", "ui-toast-region", {
    role: "region",
    "aria-label": "Notifications",
  });
  el.dataset.position = p.position;

  const timers = new Set<ReturnType<typeof setTimeout>>();

  function show(opts: ToastOptions) {
    const tone = opts.tone ?? "info";
    const toast = h("div", `ui-toast ui-toast--${tone}`, { role: "status" });
    const msg = h("span", "ui-toast__message");
    msg.textContent = opts.message;
    toast.appendChild(msg);
    if (opts.code) {
      const code = h("span", "ui-toast__code");
      code.textContent = opts.code;
      toast.appendChild(code);
    }
    const close = h("button", "ui-toast__close", { "aria-label": "Dismiss notification" });
    close.type = "button";
    close.textContent = "×";
    toast.appendChild(close);
    el.appendChild(toast);
    const remove = () => {
      toast.remove();
      emit(el, "ui:dismiss", { message: opts.message });
    };
    close.addEventListener("click", remove);
    if (opts.duration !== 0) {
      const t = setTimeout(remove, opts.duration ?? 4000);
      timers.add(t);
    }
  }

  return {
    el,
    show,
    dismissAll() {
      el.innerHTML = "";
      for (const t of timers) clearTimeout(t);
      timers.clear();
    },
    destroy() {
      for (const t of timers) clearTimeout(t);
      timers.clear();
      el.remove();
    },
  };
}
