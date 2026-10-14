import { h, emit } from "./dom";

/**
 * ProfileChip — headless-ядро мини-профиля.
 * Имя, режим, скин; клик = открыть профиль.
 */
export interface ProfileChipProps {
  name: string;
  mode?: string;
  skin?: string;
  /** Инициалы/символ аватара. */
  avatar?: string;
  onClick?: () => void;
}

export interface ProfileChipApi {
  el: HTMLElement;
  destroy: () => void;
}

export function createProfileChip(props: ProfileChipProps): ProfileChipApi {
  const p = { ...props };
  const el = h("button", "ui-profilechip");
  el.type = "button";
  el.setAttribute("aria-label", `Profile: ${p.name}`);
  const avatar = h("span", "ui-profilechip__avatar", { "aria-hidden": "true" });
  avatar.textContent = p.avatar ?? p.name.slice(0, 2).toUpperCase();
  const info = h("span", "ui-profilechip__info");
  const name = h("span", "ui-profilechip__name");
  name.textContent = p.name;
  info.appendChild(name);
  const meta = h("span", "ui-profilechip__meta");
  meta.textContent = [p.mode, p.skin].filter(Boolean).join(" · ");
  info.appendChild(meta);
  el.append(avatar, info);

  const onClick = () => {
    p.onClick?.();
    emit(el, "ui:open", {});
  };
  el.addEventListener("click", onClick);
  return {
    el,
    destroy() {
      el.removeEventListener("click", onClick);
    },
  };
}
