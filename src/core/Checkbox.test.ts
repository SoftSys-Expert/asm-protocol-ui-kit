import { describe, expect, it } from "vitest";
import { createCheckbox } from "./Checkbox";
import { createToggle } from "./Toggle";
import { createRadioGroup } from "./RadioGroup";
import { sandbox } from "./testing";

describe("core/Checkbox", () => {
  it("нативный input[type=checkbox] + смена состояния", () => {
    sandbox();
    let checked = false;
    const c = createCheckbox({ label: "vim", onChange: (v) => (checked = v) });
    expect(c.input.type).toBe("checkbox");
    c.input.click();
    c.input.dispatchEvent(new window.Event("change", { bubbles: true })); // JSDOM workaround
    expect(checked).toBe(true);
    expect(c.el.classList.contains("ui-checkbox--checked")).toBe(true);
  });

  it("setChecked программно меняет DOM и зовёт onChange", () => {
    sandbox();
    const events: boolean[] = [];
    const c = createCheckbox({ label: "x", onChange: (v) => events.push(v) });
    c.setChecked(true);
    expect(c.input.checked).toBe(true);
    expect(events).toEqual([true]);
  });
});

describe("core/Toggle", () => {
  it("role=switch + aria-checked", () => {
    sandbox();
    const t = createToggle({ label: "CRT", checked: true });
    expect(t.el.getAttribute("role")).toBe("switch");
    expect(t.el.getAttribute("aria-checked")).toBe("true");
    expect(t.el.classList.contains("ui-toggle--on")).toBe(true);
  });

  it("Space переключает и зовёт onChange", () => {
    sandbox();
    let v = false;
    const t = createToggle({ label: "x", onChange: (nv) => (v = nv) });
    t.el.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }),
    );
    expect(v).toBe(true);
    expect(t.el.getAttribute("aria-checked")).toBe("true");
  });

  it("disabled не переключает", () => {
    sandbox();
    const t = createToggle({ label: "x", disabled: true });
    (t.el as HTMLButtonElement).click();
    expect(t.isChecked()).toBe(false);
  });
});

describe("core/RadioGroup", () => {
  it("radiogroup + нативные радио с одним name", () => {
    sandbox();
    const g = createRadioGroup({
      options: [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ],
      value: "a",
    });
    expect(g.el.getAttribute("role")).toBe("radiogroup");
    const inputs = g.el.querySelectorAll("input[type=radio]");
    expect(inputs.length).toBe(2);
    expect((inputs[0] as HTMLInputElement).name).toBe((inputs[1] as HTMLInputElement).name);
    expect(g.getValue()).toBe("a");
  });

  it("выбор через клик обновляет getValue", () => {
    sandbox();
    const g = createRadioGroup({
      options: [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ],
    });
    (g.el.querySelectorAll("input")[1] as HTMLInputElement).click();
    expect(g.getValue()).toBe("b");
  });
});
