import { describe, expect, it } from "vitest";
import { createButton } from "./Button";
import { sandbox } from "./testing";

describe("core/Button", () => {
  it("рендерит label и variant-атрибуты", () => {
    sandbox();
    const btn = createButton({ label: "RUN", variant: "primary", icon: "▶" });
    expect(btn.el.querySelector(".ui-btn__label")?.textContent).toBe("RUN");
    expect(btn.el.dataset.variant).toBe("primary");
    expect(btn.el.querySelector(".ui-btn__icon")?.textContent).toBe("▶");
  });

  it("disabled блокирует клики", () => {
    sandbox();
    let clicked = 0;
    const btn = createButton({ label: "x", onClick: () => clicked++ });
    btn.el.click();
    expect(clicked).toBe(1);
    btn.setProps({ disabled: true });
    expect(btn.el.hasAttribute("disabled")).toBe(true);
    expect(btn.isDisabled()).toBe(true);
    btn.el.click();
    expect(clicked).toBe(1); // disabled → не вызван
  });

  it("loading ставит aria-busy", () => {
    sandbox();
    const btn = createButton({ label: "x" });
    btn.setLoading(true);
    expect(btn.el.getAttribute("aria-busy")).toBe("true");
    expect(btn.el.classList.contains("ui-btn--loading")).toBe(true);
  });
});
