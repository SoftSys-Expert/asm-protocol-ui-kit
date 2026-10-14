import { getFx, resetFx, setFx, type FxOptions } from "../site/fx";
import { button, layout, node, section, type Control, type Page, type State } from "./shared";
import { course, ui } from "./course";
import { modeSwitch, option, topbar } from "./examples";
import { machine } from "./machine";

type Group = "glitch" | "glow" | "crt";
interface Parameter {
  group?: Group;
  prop: string;
  css: string;
  unit?: string;
  value: number | string;
  max?: number;
  step?: number;
  type?: "text" | "color";
}
const parameters: Parameter[] = [
  {
    prop: "transitionDuration",
    css: "--fx-transition-duration",
    unit: "ms",
    value: 120,
    max: 1000,
    step: 10,
  },
  {
    group: "glitch",
    prop: "duration",
    css: "--fx-glitch-duration",
    unit: "s",
    value: 0.3,
    max: 2,
    step: 0.01,
  },
  { group: "glitch", prop: "shift", css: "--fx-glitch-shift", unit: "px", value: 12, max: 48 },
  {
    group: "glitch",
    prop: "rgb",
    css: "--fx-glitch-rgb",
    unit: "px",
    value: 2,
    max: 12,
    step: 0.5,
  },
  { group: "glitch", prop: "colorA", css: "--fx-glitch-color-a", value: "#f47777", type: "color" },
  { group: "glitch", prop: "colorB", css: "--fx-glitch-color-b", value: "#68bde7", type: "color" },
  { group: "glow", prop: "rgb", css: "--fx-glow-rgb", value: "114 242 176", type: "text" },
  ...(
    [
      ["text", 9, 0.9],
      ["box", 16, 0.2],
      ["subtle", 10, 0.07],
      ["register", 8, 0.35],
      ["flag", 6, 0.6],
    ] as const
  ).flatMap(([name, radius, alpha]): Parameter[] => [
    {
      group: "glow",
      prop: `${name}Radius`,
      css: `--fx-glow-${name}-radius`,
      unit: "px",
      value: radius,
      max: 60,
    },
    {
      group: "glow",
      prop: `${name}Alpha`,
      css: `--fx-glow-${name}-alpha`,
      value: alpha,
      max: 1,
      step: 0.01,
    },
  ]),
  {
    group: "glow",
    prop: "sessionRadius",
    css: "--fx-glow-session-radius",
    unit: "px",
    value: 8,
    max: 40,
  },
  { group: "crt", prop: "scanAlpha", css: "--fx-scan-alpha", value: 0.2, max: 1, step: 0.01 },
  {
    group: "crt",
    prop: "scanLine",
    css: "--fx-scan-line",
    unit: "px",
    value: 1,
    max: 5,
    step: 0.5,
  },
  {
    group: "crt",
    prop: "scanPeriod",
    css: "--fx-scan-period",
    unit: "px",
    value: 3,
    max: 16,
    step: 0.5,
  },
  {
    group: "crt",
    prop: "insetAlpha",
    css: "--fx-crt-inset-alpha",
    value: 0.45,
    max: 1,
    step: 0.01,
  },
  {
    group: "crt",
    prop: "insetRadius",
    css: "--fx-crt-inset-radius",
    unit: "px",
    value: 120,
    max: 300,
  },
  {
    group: "crt",
    prop: "insetSpread",
    css: "--fx-crt-inset-spread",
    unit: "px",
    value: 6,
    max: 40,
  },
  { group: "crt", prop: "tintAlpha", css: "--fx-crt-tint-alpha", value: 0.04, max: 1, step: 0.01 },
  {
    group: "crt",
    prop: "tintRadius",
    css: "--fx-crt-tint-radius",
    unit: "px",
    value: 50,
    max: 200,
  },
  {
    group: "crt",
    prop: "vignetteAlpha",
    css: "--fx-vignette-alpha",
    value: 0.5,
    max: 1,
    step: 0.01,
  },
  {
    group: "crt",
    prop: "vignetteStart",
    css: "--fx-vignette-start",
    unit: "%",
    value: 64,
    max: 100,
  },
];
const keyFor = (p: Parameter) => `fx.${p.group ? `${p.group}.` : ""}${p.prop}`;
export function effectPage(id: string, title: string, group?: Group): Page {
  const selected = parameters.filter((p) => !group || p.group === group);
  const groups: Group[] = group ? [group] : ["glitch", "glow", "crt"];
  const controls: Control[] = [
    ...(!group
      ? [{ key: "fx.mode", label: "Режим эффектов", options: ["on", "static", "off"], value: "on" }]
      : []),
    ...groups.map((name) => ({
      key: `fx.${name}.enabled`,
      label: `${name}: включён`,
      type: "checkbox" as const,
      value: true,
    })),
    ...(!group || group === "glitch"
      ? [
          {
            key: "fx.glitch.preset",
            label: "Пресет glitch",
            options: ["shred", "hard-cut", "tape-track", "blackout"],
            value: "shred",
          },
        ]
      : []),
    ...selected.map((p): Control => ({
      key: keyFor(p),
      label: `${p.css}${p.unit ? ` (${p.unit})` : ""}`,
      value: p.value,
      type: p.type ?? "range",
      min: p.prop === "scanPeriod" ? 1 : 0,
      max: p.max,
      step: p.step ?? 1,
    })),
  ];
  return {
    id,
    title,
    group: "effects",
    controls,
    description:
      "Эффекты заголовков, заданий и стенда. setFx меняет параметры на <html>, скин — на <body>. TTY сохраняет спокойный режим сайта. Для свечения наведите курсор на кнопку; CRT виден поверх всего превью.",
    render(el, state, redraw) {
      const root = el.ownerDocument.documentElement;
      resetFx(root);
      const options: Record<string, unknown> = {};
      for (const spec of controls) {
        const value = state[spec.key] ?? spec.value;
        if (value === spec.value) continue;
        const parts = spec.key.split(".").slice(1);
        const p = selected.find((p) => keyFor(p) === spec.key);
        const effective = p?.unit ? `${value}${p.unit}` : value;
        if (parts.length === 1) options[parts[0]] = effective;
        else {
          const target = (options[parts[0]] ??= {}) as Record<string, unknown>;
          target[parts[1]] = effective;
        }
      }
      setFx(options as FxOptions, root);
      const sample = node("div");
      sample.dataset.fxSample = "";
      sample.append(topbar(state, redraw));
      const exercise = node("div", "exercise");
      exercise.dataset.glitchTarget = "";
      exercise.append(
        node("h1", "", course.choice.prompt.ru),
        node("p", "", course.choice.explanation.ru)
      );
      const choices = node("div", "options");
      choices.append(option(course.choice.options[1].ru, 1, "is-selected"));
      exercise.append(
        choices,
        layout(button(ui.check, "primary"), button(ui.retry), button(ui.clear_local, "danger"))
      );
      const workbench = node("section", "workbench");
      const head = node("header", "workbench-head");
      head.append(node("span", "", "УРОК 1 ИЗ 4"), modeSwitch(state, redraw));
      workbench.append(
        head,
        exercise,
        machine({ step: 2 }, () => {})
      );
      sample.append(workbench);
      // A changed register and an active flag are present together to preview both glow channels.
      const reg = sample.querySelector(".machine-reg")!;
      reg.classList.add("is-changed");
      el.append(sample);
      const actions = layout();
      actions.append(
        button("Повторить glitch", "primary", () => {
          // Reinsert the same DOM: restart CSS animation without inline animation overrides.
          const parent = exercise.parentElement!;
          const next = exercise.nextSibling;
          exercise.remove();
          void parent.offsetWidth;
          parent.insertBefore(exercise, next);
        }),
        button("Сбросить", "secondary", () => {
          for (const spec of controls) state[spec.key] = spec.value;
          resetFx(root);
          redraw();
        })
      );
      const effective = getFx(root);
      const js = `setFx(${JSON.stringify(effective, null, 2)});`;
      const attributes = `data-fx="${effective.mode}" data-fx-glitch="${effective.glitch.enabled ? "on" : "off"}" data-fx-glow="${effective.glow.enabled ? "on" : "off"}" data-fx-crt="${effective.crt.enabled ? "on" : "off"}"${effective.glitch.preset !== "shred" ? ` data-fx-glitch-preset="${effective.glitch.preset}"` : ""}`;
      const css = `/* <html ${attributes}> */\n:root {\n${parameters
        .map((p) => {
          const source = p.group ? effective[p.group] : effective;
          return `  ${p.css}: ${source[p.prop as keyof typeof source]};`;
        })
        .join("\n")}\n}`;
      const result = node("p", "", "Код можно скопировать кнопкой или выделить ниже.");
      result.setAttribute("role", "status");
      const copy = (text: string) => async () => {
        try {
          await navigator.clipboard.writeText(text);
          result.textContent = "Настройки скопированы.";
        } catch {
          result.textContent =
            "Браузер запретил буфер обмена. Выделите код ниже и скопируйте вручную.";
        }
      };
      actions.append(
        button("Скопировать setFx", "secondary", copy(js)),
        button("Скопировать CSS", "secondary", copy(css))
      );
      el.append(
        actions,
        section("Скопировать настройки", result, node("pre", "code", js), node("pre", "code", css))
      );
    },
  };
}
