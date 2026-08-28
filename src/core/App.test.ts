import { describe, expect, it } from "vitest";
import { createTopBar } from "./TopBar";
import { createSidebar } from "./Sidebar";
import { createTrackMap } from "./TrackMap";
import { createSkillsTree } from "./SkillsTree";
import { createWeeklyGoal } from "./WeeklyGoal";
import { createSandboxHealth } from "./SandboxHealth";
import { createNewsFeed } from "./NewsFeed";
import { createProfileChip } from "./ProfileChip";
import { createResumeHero } from "./ResumeHero";
import { createCurrentTrackCard } from "./CurrentTrackCard";
import { createGradesTable } from "./GradesTable";
import { createTakeawayCard } from "./TakeawayCard";
import { createQuickHelp } from "./QuickHelp";
import { createGuestPrompt } from "./GuestPrompt";
import { sandbox } from "./testing";

describe("core/TopBar", () => {
  it("banner со слотами", () => {
    sandbox();
    const tb = createTopBar({ brand: "ASM://PROTOCOL" });
    expect(tb.el.getAttribute("role")).toBe("banner");
    expect(tb.el.querySelector(".ui-topbar__brand-text")?.textContent).toBe("ASM://PROTOCOL");
  });
});

describe("core/Sidebar", () => {
  it("дерево: раскрытие модуля, выбор урока, статусы точек", () => {
    sandbox();
    const selected: string[] = [];
    const sb = createSidebar({
      modules: [
        {
          id: "m1",
          label: "M1 BASICS",
          expanded: true,
          lessons: [
            { id: "l1", label: "hello", dot: "passed" },
            { id: "l2", label: "registers", dot: "active" },
            { id: "l3", label: "stack", dot: "locked" },
          ],
        },
      ],
      onSelect: (id) => selected.push(id),
    });
    expect(sb.el.getAttribute("role")).toBe(null); // role на ul-tree, не на nav
    expect(sb.el.querySelector('[role="tree"]')).toBeTruthy();
    const lessons = sb.el.querySelectorAll(".ui-sidebar__lesson");
    expect(lessons.length).toBe(3);
    (lessons[1] as HTMLElement).click();
    expect(selected).toEqual(["l2"]);
    expect(sb.el.querySelectorAll('.ui-sidebar__dot[data-dot="locked"]').length).toBe(1);
    // свернуть модуль
    const modBtn = sb.el.querySelector(".ui-sidebar__module-btn") as HTMLElement;
    modBtn.click();
    expect(sb.el.querySelectorAll(".ui-sidebar__lesson").length).toBe(0);
    // весь сайдбар
    sb.toggle();
    expect(sb.isCollapsed()).toBe(true);
    expect(sb.el.classList.contains("ui-sidebar--collapsed")).toBe(true);
  });
});

describe("core/TrackMap", () => {
  it("узлы со статусами, locked не кликается", () => {
    sandbox();
    const picked: string[] = [];
    const tm = createTrackMap({
      nodes: [
        { id: "n1", label: "M1", state: "passed" },
        { id: "n2", label: "M2", state: "current" },
        { id: "n3", label: "M3", state: "locked" },
      ],
      onSelect: (id) => picked.push(id),
    });
    const items = tm.el.querySelectorAll(".ui-trackmap__item");
    expect(items.length).toBe(3);
    (items[0] as HTMLElement).click();
    (items[2] as HTMLElement).click(); // locked
    expect(picked).toEqual(["n1"]);
    tm.setState("n3", "available");
    expect(tm.el.querySelectorAll(".ui-trackmap__item")[2].getAttribute("data-state")).toBe(
      "available"
    );
  });
});

describe("core/SkillsTree", () => {
  it("порог открытия и прогресс", () => {
    sandbox();
    const st = createSkillsTree({
      skills: [
        {
          id: "mem",
          label: "Memory",
          threshold: 6,
          current: 6,
          children: [{ id: "stack", label: "Stack ops", threshold: 3, current: 1 }],
        },
      ],
    });
    const items = st.el.querySelectorAll(".ui-skills__item");
    expect(items[0].getAttribute("data-unlocked")).toBe("true");
    st.setProgress("stack", 3);
    const updated = st.el.querySelectorAll(".ui-skills__item");
    expect(updated[1].getAttribute("data-unlocked")).toBe("true");
  });
});

describe("core/WeeklyGoal", () => {
  it("счётчик и прогресс-бар", () => {
    sandbox();
    const wg = createWeeklyGoal({ goal: 12, done: 5 });
    expect(wg.el.querySelector(".ui-weekly__counter")?.textContent).toBe("5/12 lessons");
    wg.setDone(12);
    const fill = wg.el.querySelector(".ui-weekly__fill") as HTMLElement;
    expect(fill.style.width).toBe("100%");
    expect(fill.dataset.complete).toBe("true");
  });
});

describe("core/SandboxHealth", () => {
  it("LED-статусы и смена состояния", () => {
    sandbox();
    const sh = createSandboxHealth({
      services: [
        { id: "gcc", label: "gcc", state: "online" },
        { id: "nasm", label: "nasm", state: "queue" },
      ],
    });
    expect(sh.el.querySelectorAll(".ui-sandbox__item").length).toBe(2);
    sh.setState("nasm", "online");
    expect(sh.el.querySelectorAll('.ui-sandbox__led[data-state="online"]').length).toBe(2);
  });
});

describe("core/NewsFeed", () => {
  it("ISO-даты в time[datetime]", () => {
    sandbox();
    const nf = createNewsFeed({
      items: [{ id: "n1", date: "2026-08-27", text: "module M16 released", tag: "module" }],
    });
    const time = nf.el.querySelector("time");
    expect(time?.dateTime).toBe("2026-08-27");
    expect(nf.el.querySelector(".ui-news__tag")?.textContent).toBe("module");
  });
});

describe("core/ProfileChip", () => {
  it("имя+режим+скин, клик открывает", () => {
    sandbox();
    let opened = 0;
    const pc = createProfileChip({
      name: "kokhlo",
      mode: "cowboy",
      skin: "tty",
      onClick: () => opened++,
    });
    expect(pc.el.querySelector(".ui-profilechip__meta")?.textContent).toBe("cowboy · tty");
    (pc.el as HTMLButtonElement).click();
    expect(opened).toBe(1);
  });
});

describe("core/ResumeHero", () => {
  it("CTA RESUME эмитит событие", () => {
    sandbox();
    let resumed = false;
    const hero = createResumeHero({
      lessonId: "heap/003",
      lessonTitle: "Dynamic alloc",
      onResume: () => (resumed = true),
    });
    expect(hero.el.querySelector(".ui-resumehero__title")?.textContent).toBe("heap/003");
    (hero.el.querySelector(".ui-resumehero__cta") as HTMLButtonElement).click();
    expect(resumed).toBe(true);
  });
});

describe("core/CurrentTrackCard", () => {
  it("прогресс по краю карточки", () => {
    sandbox();
    const card = createCurrentTrackCard({
      trackId: "asm",
      trackName: "x86 ASM",
      progress: 40,
      meta: "12/48 lessons",
    });
    expect(card.el.querySelector(".ui-trackcard__name")?.textContent).toBe("x86 ASM");
    card.setProgress(90);
    const track = card.el.querySelector('[role="progressbar"]');
    expect(track?.getAttribute("aria-valuenow")).toBe("90");
  });
});

describe("core/GradesTable", () => {
  it("факты: exit-код тонировруется только классом", () => {
    sandbox();
    const gt = createGradesTable({
      rows: [
        { lesson: "asm/001", attempts: 2, exitCode: 0, cycles: 90 },
        { lesson: "asm/002", attempts: 5, exitCode: 1, cycles: 400 },
      ],
    });
    const exits = gt.el.querySelectorAll(".ui-grades__exit");
    expect(exits[0].getAttribute("data-exit")).toBe("ok");
    expect(exits[1].getAttribute("data-exit")).toBe("fail");
    expect(gt.el.querySelectorAll("tbody tr").length).toBe(2);
  });
});

describe("core/TakeawayCard", () => {
  it("синтаксис + примеры", () => {
    sandbox();
    const tk = createTakeawayCard({
      lessonId: "asm/004",
      takeaways: [{ title: "push/pop", code: "push rbp", comment: "сохраняет rbp" }],
    });
    expect(tk.el.querySelectorAll(".ui-takeaway__item").length).toBe(1);
    expect(tk.el.querySelector(".ui-takeaway__code")?.textContent).toBe("push rbp");
  });
});

describe("core/QuickHelp", () => {
  it("секции + подмена контента", () => {
    sandbox();
    const qh = createQuickHelp({
      sections: [{ id: "start", title: "Начать", lines: ["1. выбрать трек"] }],
    });
    const custom = document.createElement("div");
    custom.textContent = "custom";
    qh.setSectionContent("start", custom);
    expect(qh.el.querySelector(".ui-quickhelp__section-body")?.textContent).toBe("custom");
  });
});

describe("core/GuestPrompt", () => {
  it("форма с терминальным промптом", () => {
    sandbox();
    const submitted: string[] = [];
    const gp = createGuestPrompt({ onSubmit: (v) => submitted.push(v) });
    const input = gp.el.querySelector("input") as HTMLInputElement;
    input.value = "asm";
    gp.el.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    expect(submitted).toEqual(["asm"]);
  });
});
