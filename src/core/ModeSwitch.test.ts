import { describe, expect, it } from "vitest";
import { createModeSwitch, createSkinSwitch } from "./ModeSwitch";
import { createLessonCard } from "./LessonCard";
import { createHintReveal } from "./HintReveal";
import { createResourcePressure } from "./ResourcePressure";
import { createTraceVisualizer } from "./TraceVisualizer";
import { createExerciseSwitcher } from "./ExerciseSwitcher";
import { press, sandbox } from "./testing";

describe("core/ModeSwitch", () => {
  it("radiogroup с aria-checked и сменой", () => {
    sandbox();
    const modes: string[] = [];
    const ms = createModeSwitch({
      modes: [
        { id: "kiddie", label: "Script Kiddie" },
        { id: "cowboy", label: "Console Cowboy" },
      ],
      active: "kiddie",
      onChange: (id) => modes.push(id),
    });
    expect(ms.el.getAttribute("role")).toBe("radiogroup");
    expect(ms.getActive()).toBe("kiddie");
    const btns = ms.el.querySelectorAll(".ui-modeswitch__btn");
    expect(btns[0].getAttribute("aria-checked")).toBe("true");
    (btns[1] as HTMLElement).click();
    expect(modes).toEqual(["cowboy"]);
    expect(ms.getActive()).toBe("cowboy");
  });

  it("стрелки переключают режим", () => {
    sandbox();
    const ms = createModeSwitch({
      modes: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
    });
    press(ms.el.querySelector(".ui-modeswitch__btn") as HTMLElement, "ArrowRight");
    expect(ms.getActive()).toBe("b");
  });
});

describe("core/SkinSwitch", () => {
  it("меняет data-skin на целевом элементе", () => {
    sandbox();
    const target = document.createElement("div");
    document.body.appendChild(target);
    const ss = createSkinSwitch({ active: "operator", target });
    expect(target.getAttribute("data-skin")).toBe("operator");
    ss.setSkin("tty");
    expect(target.getAttribute("data-skin")).toBe("tty");
  });
});

describe("core/LessonCard", () => {
  it("статусы и блокировка", () => {
    sandbox();
    const opened: string[] = [];
    const card = createLessonCard({
      id: "asm/004",
      title: "Stack operations",
      status: "active",
      onOpen: (id) => opened.push(id),
    });
    expect(card.el.dataset.status).toBe("active");
    (card.el as HTMLElement).click();
    expect(opened).toEqual(["asm/004"]);
    card.setStatus("locked");
    (card.el as HTMLElement).click();
    expect(opened).toEqual(["asm/004"]); // locked не открывается
    expect(card.el.getAttribute("aria-disabled")).toBe("true");
  });
});

describe("core/HintReveal", () => {
  it("уровни по одному + пометка решения", () => {
    sandbox();
    const hints = createHintReveal({
      hints: ["check rsp", "push before call", "solution: mov rdi, buf"],
    });
    expect(hints.revealedCount()).toBe(0);
    hints.revealNext();
    hints.revealNext();
    expect(hints.revealedCount()).toBe(2);
    expect(hints.isSolutionUsed()).toBe(false);
    hints.revealNext();
    expect(hints.isSolutionUsed()).toBe(true);
    expect(hints.el.dataset.solutionUsed).toBe("true");
    expect(hints.el.querySelectorAll(".ui-hint__item--solution").length).toBe(1);
  });
});

describe("core/ResourcePressure", () => {
  it("warn при >80%", () => {
    sandbox();
    const rp = createResourcePressure({
      bars: [
        { id: "cycles", label: "cycles", used: 850, limit: 1000 },
        { id: "mem", label: "memory", used: 100, limit: 1000 },
      ],
    });
    expect(rp.el.querySelectorAll(".ui-pressure__row").length).toBe(2);
    const fills = rp.el.querySelectorAll(".ui-pressure__fill");
    expect(fills[0].getAttribute("data-level")).toBe("warn");
    expect(fills[1].getAttribute("data-level")).toBe("ok");
    rp.setBar("mem", 950);
    const updated = rp.el.querySelectorAll(".ui-pressure__fill");
    expect(updated[1].getAttribute("data-level")).toBe("warn");
  });
});

describe("core/TraceVisualizer", () => {
  it("шаги, подсветка изменений, prev/next", () => {
    sandbox();
    const tv = createTraceVisualizer({
      steps: [
        { regs: { rax: "0x1", rbx: "0x2" }, label: "mov rax, 1" },
        { regs: { rax: "0x5" }, label: "mov rax, 5" },
      ],
    });
    expect(tv.getStep()).toBe(0);
    expect(tv.el.querySelector(".ui-trace__counter")?.textContent).toBe("step 1/2");
    // на шаге 0 ничего не изменено
    expect(tv.el.querySelectorAll(".ui-trace__value--changed").length).toBe(0);
    tv.next();
    expect(tv.getStep()).toBe(1);
    const changed = tv.el.querySelector(".ui-trace__value--changed");
    expect(changed?.textContent).toBe("0x5");
    // rbx наследуется
    const rows = tv.el.querySelectorAll(".ui-trace__row");
    expect(rows[1].textContent).toContain("0x2");
    tv.prev();
    expect(tv.getStep()).toBe(0);
  });
});

describe("core/ExerciseSwitcher", () => {
  it("переключение типа и feedback", () => {
    sandbox();
    const ex = createExerciseSwitcher({ type: "choose", prompt: "What is RSP?" });
    expect(ex.getType()).toBe("choose");
    const btns = ex.el.querySelectorAll(".ui-exercise__typebtn");
    expect(btns.length).toBe(5);
    (btns[3] as HTMLElement).click();
    expect(ex.getType()).toBe("trace");
    expect(ex.el.dataset.type).toBe("trace");
    ex.showFeedback("correct", "exit 0", ["+10 xp"]);
    expect(ex.feedbackSlot.textContent).toContain("PASSED");
    expect(ex.feedbackSlot.getAttribute("role")).toBe("status");
  });
});
