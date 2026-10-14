import { describe, expect, it } from "vitest";
import { createTerminal } from "./Terminal";
import { createProgressBar } from "./ProgressBar";
import { createBadge } from "./Badge";
import { createTable } from "./Table";
import { createBreadcrumbs } from "./Breadcrumbs";
import { createToast } from "./Toast";
import { sandbox } from "./testing";

describe("core/Terminal", () => {
  it("строки по потокам + exit-код", () => {
    sandbox();
    const t = createTerminal({});
    t.appendLine("stdout", "hello");
    t.appendLine("stderr", "segfault at 0x0");
    expect(t.body.querySelectorAll(".ui-terminal__line").length).toBe(2);
    expect(t.body.querySelector(".ui-terminal__line--stderr")?.textContent).toContain("segfault");
    t.setExit(1);
    const status = t.el.querySelector(".ui-terminal__status");
    expect(status?.textContent).toBe("Process exited with code 1");
    expect(status?.classList.contains("ui-terminal__status--fail")).toBe(true);
    t.setExit(0);
    expect(status?.classList.contains("ui-terminal__status--ok")).toBe(true);
  });

  it("role=log + aria-live", () => {
    sandbox();
    const t = createTerminal({});
    expect(t.body.getAttribute("role")).toBe("log");
    expect(t.body.getAttribute("aria-live")).toBe("polite");
  });
});

describe("core/ProgressBar", () => {
  it("aria-valuenow и проценты", () => {
    sandbox();
    const bar = createProgressBar({ value: 42, label: "lesson" });
    const track = bar.el.querySelector('[role="progressbar"]') as HTMLElement;
    expect(track.getAttribute("aria-valuenow")).toBe("42");
    expect(track.getAttribute("aria-valuetext")).toBe("42%");
    expect(bar.el.querySelector(".ui-progress__value")?.textContent).toBe("42%");
    bar.setValue(100);
    expect(bar.el.classList.contains("ui-progress--complete")).toBe(true);
  });
});

describe("core/Badge", () => {
  it("tone через data-атрибут", () => {
    sandbox();
    const b = createBadge({ label: "PASSED", tone: "success", dot: true });
    expect(b.el.dataset.tone).toBe("success");
    expect(b.el.querySelector(".ui-badge__dot")).toBeTruthy();
    b.setProps({ tone: "fail" });
    expect(b.el.dataset.tone).toBe("fail");
  });
});

describe("core/Table", () => {
  it("сортировка по клику на th + aria-sort", () => {
    sandbox();
    const table = createTable({
      columns: [
        { key: "lesson", header: "lesson" },
        { key: "cycles", header: "cycles", numeric: true },
      ],
      rows: [
        { lesson: "asm/004", cycles: 120 },
        { lesson: "asm/002", cycles: 90 },
        { lesson: "asm/001", cycles: 300 },
      ],
    });
    const ths = table.el.querySelectorAll("th");
    (ths[1] as HTMLElement).click();
    expect(ths[1].getAttribute("aria-sort")).toBe("ascending");
    const firstRow = table.el.querySelector("tbody tr td")?.textContent;
    expect(firstRow).toBe("asm/002"); // 90 мин
    (ths[1] as HTMLElement).click();
    expect(ths[1].getAttribute("aria-sort")).toBe("descending");
  });
});

describe("core/Breadcrumbs", () => {
  it("последний сегмент aria-current=page", () => {
    sandbox();
    const nav: string[] = [];
    const bc = createBreadcrumbs({
      items: [
        { id: "track", label: "asm" },
        { id: "module", label: "M1" },
        { id: "lesson", label: "004" },
      ],
      onNavigate: (id) => nav.push(id),
    });
    expect(bc.el.getAttribute("aria-label")).toBe("Breadcrumb");
    expect(bc.el.querySelector('[aria-current="page"]')?.textContent).toBe("004");
    const links = bc.el.querySelectorAll(".ui-breadcrumbs__link");
    (links[1] as HTMLElement).click();
    expect(nav).toEqual(["module"]);
  });
});

describe("core/Toast", () => {
  it("show добавляет role=status тост с тоном", () => {
    sandbox();
    const t = createToast();
    t.show({ message: "Compiled", tone: "success", code: "exit 0" });
    const toast = t.el.querySelector(".ui-toast");
    expect(toast?.getAttribute("role")).toBe("status");
    expect(toast?.className).toContain("ui-toast--success");
    expect(toast?.querySelector(".ui-toast__code")?.textContent).toBe("exit 0");
    expect(t.el.getAttribute("aria-label")).toBe("Notifications");
  });
});
