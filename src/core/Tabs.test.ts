import { describe, expect, it } from "vitest";
import { createTabs } from "./Tabs";
import { press, sandbox } from "./testing";

describe("core/Tabs (a11y-эталон)", () => {
  const mk = () =>
    createTabs({
      tabs: [
        { id: "content", label: "Content" },
        { id: "code", label: "Code" },
        { id: "refs", label: "Refs", disabled: true },
      ],
    });

  it("строит role=tablist/tab/tabpanel со связями", () => {
    sandbox();
    const t = mk();
    expect(t.el.getAttribute("role")).toBe("tablist");
    const tabs = t.el.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
    const panels = t.el.querySelectorAll('[role="tabpanel"]');
    expect(panels.length).toBe(3);
    // aria-controls ↔ id
    const first = tabs[0] as HTMLElement;
    const panelId = first.getAttribute("aria-controls")!;
    expect(t.el.querySelector(`#${panelId}`)?.getAttribute("role")).toBe("tabpanel");
    expect(panelId.includes("content")).toBe(true);
  });

  it("первая вкладка активна: aria-selected + roving tabindex", () => {
    sandbox();
    const t = mk();
    const tabs = Array.from(t.el.querySelectorAll('[role="tab"]')) as HTMLElement[];
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].tabIndex).toBe(-1);
    expect(t.activeId()).toBe("content");
  });

  it("select() переключает панель и снимает hidden", () => {
    sandbox();
    const t = mk();
    t.select("code");
    expect(t.activeId()).toBe("code");
    const panels = t.el.querySelectorAll('[role="tabpanel"]');
    expect(panels[0].hasAttribute("hidden")).toBe(true);
    expect(panels[1].hasAttribute("hidden")).toBe(false);
  });

  it("disabled-вкладка не выбирается", () => {
    sandbox();
    const t = mk();
    t.select("refs");
    expect(t.activeId()).toBe("content");
  });

  it("ArrowRight перемещает активную вкладку через disabled", () => {
    sandbox();
    const t = mk();
    const tabs = Array.from(t.el.querySelectorAll('[role="tab"]')) as HTMLElement[];
    press(tabs[0], "ArrowRight");
    expect(t.activeId()).toBe("code");
    press(tabs[1], "ArrowRight"); // refs disabled → wraps to content
    expect(t.activeId()).toBe("content");
  });

  it("Home/End работают", () => {
    sandbox();
    const t = mk();
    const tabs = Array.from(t.el.querySelectorAll('[role="tab"]')) as HTMLElement[];
    press(tabs[0], "End");
    expect(t.activeId()).toBe("code"); // refs disabled → последний доступный
    press(tabs[1], "Home");
    expect(t.activeId()).toBe("content");
  });

  it("клик по вкладке выбирает её и зовёт onChange", () => {
    sandbox();
    const changes: string[] = [];
    const t = createTabs({
      tabs: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      onChange: (id) => changes.push(id),
    });
    const tabs = t.el.querySelectorAll('[role="tab"]');
    (tabs[1] as HTMLElement).click();
    expect(changes).toEqual(["b"]);
    expect(t.activeId()).toBe("b");
  });
});
