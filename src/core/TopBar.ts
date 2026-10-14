import { h, uid, emit } from "./dom";

/**
 * TopBar — headless-ядро шапки приложения.
 * Слоты: бренд, поиск, режим, профиль. Sticky на скине.
 */
export interface TopBarProps {
  brand?: string;
  /** Слот поиска (SearchBar). */
  search?: HTMLElement | null;
  /** Слот ModeSwitch. */
  modeSwitch?: HTMLElement | null;
  /** Слот ProfileChip. */
  profile?: HTMLElement | null;
}

export interface TopBarApi {
  el: HTMLElement;
  brandSlot: HTMLElement;
  actionsSlot: HTMLElement;
  destroy: () => void;
}

export function createTopBar(props: TopBarProps): TopBarApi {
  const p = { brand: "ASM://PROTOCOL", ...props };
  const el = h("header", "ui-topbar", { role: "banner" });
  const brandSlot = h("div", "ui-topbar__brand");
  const brand = h("span", "ui-topbar__brand-text");
  brand.textContent = p.brand;
  brandSlot.appendChild(brand);
  const searchSlot = h("div", "ui-topbar__search");
  if (p.search) searchSlot.appendChild(p.search);
  const actionsSlot = h("div", "ui-topbar__actions");
  if (p.modeSwitch) actionsSlot.appendChild(p.modeSwitch);
  if (p.profile) actionsSlot.appendChild(p.profile);
  el.append(brandSlot, searchSlot, actionsSlot);
  return { el, brandSlot, actionsSlot, destroy() {} };
}
