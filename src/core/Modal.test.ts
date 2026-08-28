import { describe, expect, it } from "vitest";
import { createModal } from "./Modal";
import { press, sandbox } from "./testing";

describe("core/Modal", () => {
  it("закрыт по умолчанию: hidden + aria-modal при открытии", () => {
    sandbox();
    const m = createModal({ title: "rm --progress?" });
    expect(m.el.hasAttribute("hidden")).toBe(true);
    expect(m.el.getAttribute("aria-modal")).toBe("true");
    expect(m.el.getAttribute("role")).toBe("dialog");
    m.open();
    expect(m.el.hasAttribute("hidden")).toBe(false);
    expect(m.isOpen()).toBe(true);
  });

  it("ESC закрывает открытый модал", () => {
    sandbox();
    const m = createModal({ title: "x" });
    m.open();
    expect(m.isOpen()).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
    );
    expect(m.isOpen()).toBe(false);
  });

  it("confirm зовёт onConfirm и закрывает", () => {
    sandbox();
    let confirmed = 0;
    const m = createModal({ title: "x", confirmLabel: "YES", onConfirm: () => confirmed++ });
    m.open();
    const btn = m.el.querySelector(".ui-modal__btn--confirm") as HTMLButtonElement;
    btn.click();
    expect(confirmed).toBe(1);
    expect(m.isOpen()).toBe(false);
  });

  it("aria-labelledby указывает на заголовок", () => {
    sandbox();
    const m = createModal({ title: "CONFIRM" });
    const labelledby = m.el.getAttribute("aria-labelledby")!;
    expect(m.el.querySelector(`#${labelledby}`)?.textContent).toBe("CONFIRM");
  });
});
