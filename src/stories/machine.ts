import { course, ui, jumpTrace } from "./course";
import { node, type State } from "./shared";
import { html } from "./examples";

interface Step {
  line: number;
  registers: Record<string, string>;
  flags?: Record<string, string>;
  changed: string[];
  note: { ru: string };
}
export function machine(state: State, redraw: () => void): HTMLElement {
  const trace = state.trace === "M3.4" ? jumpTrace : course.trace;
  const steps: Step[] = trace.steps;
  const locked = Boolean(state.locked);
  const position = locked ? 0 : Math.min(steps.length, Math.max(0, Number(state.step ?? 1)));
  const last = steps[position - 1],
    previous = steps[position - 2];
  const known = new Set(steps.slice(0, position).flatMap((s) => s.changed));
  const knownBefore = new Set(steps.slice(0, Math.max(0, position - 1)).flatMap((s) => s.changed));
  const changed = new Set(last?.changed ?? []);
  const executed = new Set(steps.slice(0, position).map((s) => s.line));
  const next = steps[position]?.line;
  const skipped = new Set<number>();
  const instruction = (line: string) =>
    line.trim() && !line.trim().endsWith(":") && !line.trim().startsWith(";");
  for (let i = 0; i < position; i++)
    for (
      let line = steps[i].line + 1;
      line < (steps[i + 1]?.line ?? trace.code_lines.length);
      line++
    ) {
      if (instruction(trace.code_lines[line]) && !executed.has(line)) skipped.add(line);
    }
  const go = (n: number) => {
    state.step = Math.min(steps.length, Math.max(0, n));
    redraw();
  };
  const wrapper = node("div", `bench${locked ? " is-locked" : ""}`);
  const listing = node("div", "bench-code");
  listing.dataset.testid = "bench";
  listing.append(
    html(
      `<header class="bench-code__head"><span class="bench-file">${state.trace === "M3.4" ? "m3_l4.asm" : "m3_l2.asm"}</span><span>${ui.bench_lang}</span><span>строк: ${trace.code_lines.length}</span></header>`
    )
  );
  const lines = node("ol", "bench-lines");
  trace.code_lines.forEach((line, i) => {
    const isNext = !locked && next === i,
      current = !locked && last?.line === i,
      skip = !locked && skipped.has(i),
      done = !locked && executed.has(i) && !current;
    const row = node(
      "li",
      [
        "bench-line",
        !instruction(line) ? "is-label" : "",
        isNext ? "is-next" : "",
        current ? "is-current" : "",
        skip ? "is-skipped" : "",
        done ? "is-done" : "",
      ]
        .filter(Boolean)
        .join(" ")
    );
    const ln = node("span", "bench-ln", String(i + 1));
    ln.setAttribute("aria-hidden", "true");
    const mark = node(
      "span",
      "bench-mark",
      isNext ? "▸" : skip ? "↷" : current ? "●" : done ? "✓" : ""
    );
    mark.setAttribute("aria-hidden", "true");
    row.append(ln, mark, node("code", "bench-src", line));
    const note = isNext ? ui.bench_next : skip ? ui.bench_skipped : current ? ui.bench_current : "";
    if (note) row.append(node("span", "bench-ann", note));
    lines.append(row);
  });
  listing.append(lines);
  if (locked) listing.append(node("p", "bench-locked", ui.bench_locked));
  else {
    const tape = node("ol", "bench-tape");
    tape.setAttribute("aria-label", ui.bench_tape);
    steps.forEach((step, i) => {
      const cell = node(
        "button",
        `bench-cell${i < position ? (i === position - 1 ? " is-current" : " is-done") : ""}`
      );
      cell.type = "button";
      cell.setAttribute("aria-label", `Перейти к шагу ${i + 1}`);
      cell.append(
        node("b", "", String(i + 1)),
        node(
          "span",
          "",
          i < position
            ? (() => {
                const registers = step.changed.filter((name) => name in step.registers);
                if (registers.length)
                  return registers.map((name) => `${name}←${step.registers[name]}`).join(" ");
                if (step.changed.length) return ui.bench_tape_flags;
                const following = steps[i + 1]?.line ?? trace.code_lines.length;
                return following <= step.line ||
                  (following > step.line + 1 &&
                    trace.code_lines.slice(step.line + 1, following).some(instruction))
                  ? ui.bench_tape_jump
                  : ui.bench_tape_pass;
              })()
            : "—"
        )
      );
      cell.onclick = () => go(i + 1);
      const li = node("li");
      li.append(cell);
      tape.append(li);
    });
    const controls = node("div", "bench-controls");
    [
      ["⏮", 0, position === 0, ui.bench_first],
      ["◀", position - 1, position === 0, ui.bench_prev],
      [
        position === 0 ? ui.bench_run : ui.bench_step,
        position + 1,
        position === steps.length,
        ui.bench_step,
      ],
      ["⏭", steps.length, position === steps.length, ui.bench_last],
    ].forEach(([label, to, disabled, title], i) => {
      const control = node(
        "button",
        `bench-btn${i === 2 ? " bench-btn--step" : ""}`,
        String(label)
      );
      control.type = "button";
      control.disabled = Boolean(disabled);
      control.title = String(title);
      control.setAttribute("aria-label", String(title));
      if (i === 2) control.dataset.benchStep = "";
      control.onclick = () => go(Number(to));
      controls.append(control);
    });
    controls.append(
      node(
        "span",
        "bench-pos",
        position === 0
          ? ui.bench_before
          : position === steps.length
            ? `конец · шагов: ${steps.length}`
            : `шаг ${position} из ${steps.length}`
      ),
      node("small", "bench-keys", ui.bench_keys)
    );
    const note = node("p", "bench-note");
    note.setAttribute("role", "status");
    note.setAttribute("aria-live", "polite");
    if (last) note.append(node("b", "", `строка ${last.line + 1}: `), last.note.ru);
    else note.textContent = ui.bench_note_start;
    listing.append(tape, controls, note);
  }
  const panel = node("section", "machine");
  panel.append(
    html(
      `<header class="machine-head"><h2>${ui.bench_machine}</h2><small>${ui.bench_source}</small></header>`
    )
  );
  const registers = node("div", "machine-group");
  registers.append(node("h3", "", ui.bench_registers));
  for (const reg of trace.registers) {
    const value = locked ? "?" : known.has(reg) ? (last?.registers[reg] ?? "—") : "—";
    const row = node("div", `machine-reg${!locked && changed.has(reg) ? " is-changed" : ""}`);
    row.append(node("span", "machine-name", reg), node("span", "machine-val", value));
    if (!locked && changed.has(reg))
      row.append(
        node(
          "small",
          "machine-was",
          ui.bench_was.replace(
            "{value}",
            knownBefore.has(reg) ? (previous?.registers[reg] ?? "—") : "—"
          )
        )
      );
    registers.append(row);
  }
  panel.append(registers);
  const flags = node("div", "machine-group");
  flags.append(node("h3", "", ui.bench_flags));
  const flagList = node("div", "machine-flags");
  for (const flag of trace.flags) {
    const value = locked ? "?" : known.has(flag) ? (last?.flags?.[flag] ?? "—") : "—";
    const el = node(
      "div",
      `machine-flag${value === "1" ? " is-on" : ""}${!locked && changed.has(flag) ? " is-changed" : ""}`
    );
    const lamp = node("span", "machine-lamp", value === "1" ? "■" : "□");
    lamp.setAttribute("aria-hidden", "true");
    el.append(
      lamp,
      node("b", "", flag),
      node("span", "machine-flag-val", value),
      node("small", "", ui[`bench_flag_${flag.toLowerCase()}` as keyof typeof ui] ?? "")
    );
    flagList.append(el);
  }
  flags.append(flagList);
  panel.append(
    flags,
    html(
      `<div class="machine-group machine-ptr"><h3>${ui.bench_pointer}</h3><p>${locked ? ui.bench_locked_short : next === undefined ? ui.bench_pointer_end : ui.bench_pointer_line.replace("{line}", String(next + 1))}</p></div>`
    )
  );
  wrapper.append(listing, panel);
  const exercise = node("div", "exercise");
  exercise.append(wrapper);
  return exercise;
}
