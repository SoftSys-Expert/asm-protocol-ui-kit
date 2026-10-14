import { describe, expect, it } from "vitest";
import { h, uid, emit } from "./dom";
import { sandbox } from "./testing";

describe("core/dom", () => {
  it("h() создаёт элемент с классами и атрибутами", () => {
    sandbox();
    const btn = h("button", "ui-btn", { "aria-pressed": "true", "data-variant": "primary" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.className).toBe("ui-btn");
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    expect(btn.getAttribute("data-variant")).toBe("primary");
  });

  it("uid() даёт уникальные значения", () => {
    sandbox();
    const a = uid("tab");
    const b = uid("tab");
    expect(a).not.toBe(b);
    expect(a.startsWith("tab-")).toBe(true);
  });

  it("emit() диспатчит всплывающее CustomEvent с detail", () => {
    const box = sandbox();
    let got = 0;
    box.body.addEventListener("ui:test", (e) => {
      got = (e as CustomEvent<number>).detail;
    });
    const btn = h("button");
    box.body.appendChild(btn);
    emit(btn, "ui:test", 42);
    expect(got).toBe(42);
  });
});
