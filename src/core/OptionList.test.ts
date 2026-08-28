import { describe, expect, it } from "vitest";
import { createOptionList } from "./OptionList";
import { createFeedback } from "./Feedback";
import { createCodeBlock } from "./CodeBlock";
import { createStats } from "./Stats";
import { createSlider } from "./Slider";
import { createEmptyState } from "./EmptyState";
import { createSkeleton } from "./Skeleton";
import { createSearchBar } from "./SearchBar";
import { press, sandbox } from "./testing";

describe("core/OptionList", () => {
  const opts = [
    { value: "mov", label: "MOV" },
    { value: "lea", label: "LEA" },
    { value: "nop", label: "NOP", disabled: true },
  ];

  it("listbox/option + выбор", () => {
    sandbox();
    let sel: string[] = [];
    const ol = createOptionList({ options: opts, onChange: (v) => (sel = v) });
    expect(ol.el.getAttribute("role")).toBe("listbox");
    const items = ol.el.querySelectorAll('[role="option"]');
    expect(items.length).toBe(3);
    (items[1] as HTMLElement).click();
    expect(sel).toEqual(["lea"]);
    expect(items[1].getAttribute("aria-selected")).toBe("true");
  });

  it("disabled не выбирается", () => {
    sandbox();
    const ol = createOptionList({ options: opts });
    const items = ol.el.querySelectorAll('[role="option"]');
    (items[2] as HTMLElement).click();
    expect(ol.getSelected()).toEqual([]);
  });

  it("multiple-режим накапливает выбор", () => {
    sandbox();
    const ol = createOptionList({ options: opts, multiple: true });
    const items = ol.el.querySelectorAll('[role="option"]');
    (items[0] as HTMLElement).click();
    (items[1] as HTMLElement).click();
    expect(ol.getSelected()).toEqual(["mov", "lea"]);
    expect(ol.el.getAttribute("aria-multiselectable")).toBe("true");
  });

  it("Space выбирает сфокусированный вариант", () => {
    sandbox();
    const ol = createOptionList({ options: opts });
    const items = ol.el.querySelectorAll('[role="option"]');
    press(items[0] as HTMLElement, " ");
    expect(ol.getSelected()).toEqual(["mov"]);
  });
});

describe("core/Feedback", () => {
  it("kind через data-атрибут + role=status", () => {
    sandbox();
    const f = createFeedback({ kind: "correct", title: "exit 0", lines: ["+4 pts"] });
    expect(f.el.dataset.kind).toBe("correct");
    expect(f.el.getAttribute("role")).toBe("status");
    expect(f.el.querySelector(".ui-feedback__title")?.textContent).toBe("exit 0");
    f.setProps({ kind: "error" });
    expect(f.el.dataset.kind).toBe("error");
  });
});

describe("core/CodeBlock", () => {
  it("pre>code + копирование", () => {
    sandbox();
    const cb = createCodeBlock({ code: "mov rax, 1\nret", language: "nasm", showLineNumbers: true });
    expect(cb.el.querySelectorAll(".ui-codeblock__line").length).toBe(2);
    expect(cb.el.querySelectorAll(".ui-codeblock__ln").length).toBe(2);
    expect(cb.el.querySelector("code")?.dataset.language).toBe("nasm");
    cb.setCode("xor rax, rax");
    expect(cb.el.querySelectorAll(".ui-codeblock__line").length).toBe(1);
  });
});

describe("core/Stats", () => {
  it("dl-семантика: dt=лейбл dd=значение", () => {
    sandbox();
    const s = createStats({
      items: [
        { id: "exit0", label: "exit_code=0 / month", value: "34" },
        { id: "streak", label: "streak", value: "6d", tone: "accent" },
      ],
    });
    const dts = s.el.querySelectorAll("dt");
    const dds = s.el.querySelectorAll("dd");
    expect(dts.length).toBe(2);
    expect(dds[0].textContent).toBe("34");
    expect(s.el.querySelectorAll(".ui-stats__tile")[1].getAttribute("data-tone")).toBe("accent");
  });
});

describe("core/Slider", () => {
  it("нативный range + aria-связи", () => {
    sandbox();
    const sl = createSlider({ min: 0, max: 50, value: 25, label: "cycles" });
    expect(sl.input.type).toBe("range");
    expect(sl.getValue()).toBe(25);
    sl.setValue(40);
    expect(sl.getValue()).toBe(40);
    expect(sl.el.querySelector(".ui-slider__label")?.textContent).toBe("cycles");
  });
});

describe("core/EmptyState / Skeleton", () => {
  it("пустое состояние с action", () => {
    sandbox();
    let acted = false;
    const es = createEmptyState({ title: "no entries found", hint: "pass a lesson", actionLabel: "GO", onAction: () => (acted = true) });
    (es.el.querySelector(".ui-emptystate__action") as HTMLButtonElement).click();
    expect(acted).toBe(true);
  });

  it("скелетон с count и lastWidth", () => {
    sandbox();
    const sk = createSkeleton({ count: 4, lastWidth: 40 });
    expect(sk.el.getAttribute("role")).toBe("status");
    expect(sk.el.querySelectorAll(".ui-skeleton__part").length).toBe(4);
    const last = sk.el.querySelectorAll(".ui-skeleton__part")[3] as HTMLElement;
    expect(last.style.width).toBe("40%");
  });
});

describe("core/SearchBar", () => {
  it("поиск → listbox → Enter выбирает", () => {
    sandbox();
    const picked: string[] = [];
    const sb = createSearchBar({
      onSearch: (q) =>
        q === "heap"
          ? [
              { id: "l1", title: "heap/003 — dynamic alloc", type: "lesson" },
              { id: "t1", title: "heap allocation", type: "term" },
            ]
          : [],
      onSelect: (r) => picked.push(r.id),
    });
    sb.input.value = "heap";
    sb.input.dispatchEvent(new window.Event("input", { bubbles: true }));
    expect(sb.el.getAttribute("aria-expanded")).toBe("true");
    expect(sb.el.querySelector(".ui-search__results")?.hasAttribute("hidden")).toBe(false);
    expect(sb.el.querySelectorAll('[role="option"]').length).toBe(2);
    press(sb.input, "Enter");
    expect(picked).toEqual(["l1"]);
    expect(sb.el.querySelector(".ui-search__results")?.hasAttribute("hidden")).toBe(true);
  });
});
