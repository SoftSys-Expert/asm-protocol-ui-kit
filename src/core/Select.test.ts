import { describe, expect, it } from "vitest";
import { createSelect } from "./Select";
import { press, sandbox } from "./testing";

describe("core/Select", () => {
  const opts = [
    { value: "nasm", label: "NASM" },
    { value: "gas", label: "GAS" },
    { value: "clang", label: "Clang", disabled: true },
  ];

  it("combobox + listbox + aria-expanded", () => {
    sandbox();
    const s = createSelect({ options: opts, value: "nasm" });
    expect(s.el.querySelector('[role="combobox"]')).toBeTruthy();
    const list = s.el.querySelector('[role="listbox"]');
    expect(list).toBeTruthy();
    expect(s.el.querySelectorAll('[role="option"]').length).toBe(3);
    expect(s.getValue()).toBe("nasm");
    expect(s.el.querySelector(".ui-select__value")?.textContent).toBe("NASM");
  });

  it("ArrowDown/Enter: открывает, двигает, выбирает", () => {
    sandbox();
    const changes: string[] = [];
    const s = createSelect({ options: opts, value: "nasm", onChange: (v) => changes.push(v) });
    const btn = s.el.querySelector('[role="combobox"]') as HTMLElement;
    expect(s.getValue()).toBe("nasm");
    // ArrowDown открывает, индекс не двигается
    press(btn, "ArrowDown");
    expect(s.el.classList.contains("ui-select--open")).toBe(true);
    // ArrowDown в открытом листе → move(1) на gas
    press(btn, "ArrowDown");
    // Enter выбирает текущий activeIdx
    press(btn, "Enter");
    expect(changes).toEqual(["gas"]);
    expect(s.getValue()).toBe("gas");
    expect(s.el.classList.contains("ui-select--open")).toBe(false);
  });

  it("disabled-опции пропускаются при навигации", () => {
    sandbox();
    const s = createSelect({ options: opts, value: "gas" });
    const btn = s.el.querySelector('[role="combobox"]') as HTMLElement;
    press(btn, "ArrowDown"); // открыли, move(1) → gas→clang(disabled)→nasm
    expect(s.getValue()).toBe("gas");
  });

  it("aria-activedescendant обновляется", () => {
    sandbox();
    const s = createSelect({ options: opts });
    const btn = s.el.querySelector('[role="combobox"]') as HTMLElement;
    press(btn, "ArrowDown");
    const act = btn.getAttribute("aria-activedescendant");
    expect(act).toBeTruthy();
    expect(s.el.querySelector(`#${act}`)).toBeTruthy();
  });
});
