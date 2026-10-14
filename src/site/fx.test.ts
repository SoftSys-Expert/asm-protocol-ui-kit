// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { getFx, resetFx, setFx, type FxOptions } from "./fx";

const doms: JSDOM[] = [];
function fixture(css = "") {
  const dom = new JSDOM(`<style>${css}</style>`);
  doms.push(dom);
  return dom.window.document.documentElement;
}
afterEach(() => {
  for (const dom of doms.splice(0)) dom.window.close();
});

describe("site effects API", () => {
  it("can be imported and used with an explicit root without a global document", () => {
    const root = fixture();
    expect(getFx(root)).toMatchObject({
      mode: "on",
      transitionDuration: "120ms",
      glitch: { enabled: true, duration: "0.3s", shift: "12px", rgb: "2px" },
      glow: { textRadius: "9px", textAlpha: 0.9, boxRadius: "16px", boxAlpha: 0.2 },
      crt: { scanAlpha: 0.2, scanLine: "1px", scanPeriod: "3px", vignetteStart: "64%" },
    });
    expect(root.getAttribute("style")).toBeNull();
  });

  it("patches independent options and reads primitive CSS values", () => {
    const root = fixture();
    const options: FxOptions = {
      mode: "static",
      glitch: { enabled: false, duration: "2s", shift: "24px", colorA: "#ffffff" },
      glow: { rgb: "1 2 3", textRadius: "25px", textAlpha: 0.5 },
      crt: { scanAlpha: 0.8, scanPeriod: "6px" },
    };
    setFx(options, root);
    setFx({ glitch: { duration: "1s" }, crt: { enabled: false } }, root);
    expect(root.style.getPropertyValue("--fx-glitch-shift")).toBe("24px");
    expect(getFx(root)).toMatchObject({
      ...options,
      glitch: { ...options.glitch, duration: "1s" },
      crt: { ...options.crt, enabled: false },
    });
    expect(root.getAttribute("data-fx-glitch")).toBe("off");
    expect(JSON.parse(JSON.stringify(getFx(root)))).toEqual(getFx(root));
  });

  it("reads stylesheet customization and resets only API-owned overrides", () => {
    const root = fixture(":root { --fx-glitch-shift: 18px; --fx-glow-text-alpha: 0.7; }");
    root.style.setProperty("--host-color", "red");
    root.setAttribute("data-host", "keep");
    setFx(
      {
        mode: "off",
        glitch: { shift: "36px" },
        glow: { enabled: false },
        transitionDuration: "1s",
      },
      root
    );
    resetFx(root);
    expect(getFx(root).glitch.shift).toBe("18px");
    expect(getFx(root).glow.textAlpha).toBe(0.7);
    expect(root.style.getPropertyValue("--host-color")).toBe("red");
    expect(root.getAttribute("data-host")).toBe("keep");
    expect(root.hasAttribute("data-fx")).toBe(false);
    expect(root.hasAttribute("data-fx-glow")).toBe(false);
  });

  it("keeps roots isolated and lets enabled effects be restored independently", () => {
    const a = fixture();
    const b = fixture();
    setFx(
      {
        mode: "off",
        glitch: { enabled: false },
        glow: { enabled: false },
        crt: { enabled: false },
      },
      a
    );
    setFx({ mode: "on", glitch: { enabled: true } }, a);
    expect(getFx(a)).toMatchObject({
      mode: "on",
      glitch: { enabled: true },
      glow: { enabled: false },
      crt: { enabled: false },
    });
    expect(getFx(b)).toMatchObject({ mode: "on", glow: { enabled: true }, crt: { enabled: true } });
  });
});

describe("opt-in glitch presets", () => {
  it.each(["hard-cut", "tape-track", "blackout"] as const)(
    "round-trips %s without changing independent settings",
    (preset) => {
      const root = fixture();
      expect(getFx(root).glitch.preset).toBe("shred");
      expect(root.hasAttribute("data-fx-glitch-preset")).toBe(false);
      setFx(
        {
          glitch: { preset, duration: "0.45s", shift: "18px", rgb: "3px" },
          glow: { enabled: false },
        },
        root
      );
      expect(root.getAttribute("data-fx-glitch-preset")).toBe(preset);
      expect(getFx(root).glitch).toMatchObject({
        preset,
        duration: "0.45s",
        shift: "18px",
        rgb: "3px",
      });
      setFx({ glitch: { shift: "24px" } }, root);
      expect(getFx(root).glitch.preset).toBe(preset);
      setFx({ glitch: { preset: "shred" } }, root);
      expect(root.hasAttribute("data-fx-glitch-preset")).toBe(false);
      expect(getFx(root).glow.enabled).toBe(false);
      setFx({ glitch: { preset } }, root);
      resetFx(root);
      expect(root.hasAttribute("data-fx-glitch-preset")).toBe(false);
      expect(getFx(root).glitch.preset).toBe("shred");
      expect(root.getAttribute("style")).toBe("");
    }
  );
  it("reads an unrecognized external attribute as the default", () => {
    const root = fixture();
    root.setAttribute("data-fx-glitch-preset", "unknown");
    expect(getFx(root).glitch.preset).toBe("shred");
  });
});
