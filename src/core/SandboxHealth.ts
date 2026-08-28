import { h, emit } from "./dom";

/**
 * SandboxHealth — headless-ядро статуса песочницы.
 * LED-статусы компиляторов: online / queue / offline.
 */
export type SandboxState = "online" | "queue" | "offline";

export interface SandboxService {
  id: string;
  label: string;
  state?: SandboxState;
}

export interface SandboxHealthProps {
  services: SandboxService[];
  title?: string;
}

export interface SandboxHealthApi {
  el: HTMLElement;
  setState: (id: string, state: SandboxState) => void;
}

export function createSandboxHealth(props: SandboxHealthProps): SandboxHealthApi {
  const p = { title: "SANDBOX", ...props };
  const el = h("section", "ui-sandbox");
  const head = h("h3", "ui-sandbox__title");
  head.textContent = p.title;
  el.appendChild(head);
  const list = h("ul", "ui-sandbox__list", { role: "status" });

  function apply() {
    list.innerHTML = "";
    for (const s of p.services) {
      const li = h("li", "ui-sandbox__item");
      li.dataset.state = s.state ?? "offline";
      const led = h("span", "ui-sandbox__led", { "aria-hidden": "true" });
      led.dataset.state = s.state ?? "offline";
      const label = h("span", "ui-sandbox__label");
      label.textContent = s.label;
      const state = h("span", "ui-sandbox__state");
      state.textContent = s.state ?? "offline";
      li.append(led, label, state);
      list.appendChild(li);
    }
  }
  apply();
  el.appendChild(list);

  return {
    el,
    setState(id, state) {
      const s = p.services.find((x) => x.id === id);
      if (s) {
        s.state = state;
        apply();
        emit(el, "ui:change", { id, state });
      }
    },
  };
}
