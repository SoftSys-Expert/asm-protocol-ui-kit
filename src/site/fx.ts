/** Site effects are opt-in styles; importing this module never touches the DOM. */
export interface GlitchOptions {
  enabled?: boolean;
  duration?: string;
  shift?: string;
  rgb?: string;
  colorA?: string;
  colorB?: string;
}

export interface GlowOptions {
  enabled?: boolean;
  rgb?: string;
  textRadius?: string;
  textAlpha?: number;
  boxRadius?: string;
  boxAlpha?: number;
  subtleRadius?: string;
  subtleAlpha?: number;
  sessionRadius?: string;
  registerRadius?: string;
  registerAlpha?: number;
  flagRadius?: string;
  flagAlpha?: number;
}

export interface CrtOptions {
  enabled?: boolean;
  scanAlpha?: number;
  scanLine?: string;
  scanPeriod?: string;
  insetAlpha?: number;
  insetRadius?: string;
  insetSpread?: string;
  tintAlpha?: number;
  tintRadius?: string;
  vignetteAlpha?: number;
  vignetteStart?: string;
}

export interface FxOptions {
  mode?: "on" | "off" | "static";
  transitionDuration?: string;
  glitch?: GlitchOptions;
  glow?: GlowOptions;
  crt?: CrtOptions;
}

export interface FxState {
  mode: NonNullable<FxOptions["mode"]>;
  transitionDuration: string;
  glitch: Required<GlitchOptions>;
  glow: Required<GlowOptions>;
  crt: Required<CrtOptions>;
}

type Parameters<T> = { [K in Exclude<keyof T, "enabled">]-?: readonly [string, T[K]] };

const glitch: Parameters<GlitchOptions> = {
  duration: ["--fx-glitch-duration", "0.3s"],
  shift: ["--fx-glitch-shift", "12px"],
  rgb: ["--fx-glitch-rgb", "2px"],
  colorA: ["--fx-glitch-color-a", "#f47777"],
  colorB: ["--fx-glitch-color-b", "#68bde7"],
};
const glow: Parameters<GlowOptions> = {
  rgb: ["--fx-glow-rgb", "114 242 176"],
  textRadius: ["--fx-glow-text-radius", "9px"],
  textAlpha: ["--fx-glow-text-alpha", 0.9],
  boxRadius: ["--fx-glow-box-radius", "16px"],
  boxAlpha: ["--fx-glow-box-alpha", 0.2],
  subtleRadius: ["--fx-glow-subtle-radius", "10px"],
  subtleAlpha: ["--fx-glow-subtle-alpha", 0.07],
  sessionRadius: ["--fx-glow-session-radius", "8px"],
  registerRadius: ["--fx-glow-register-radius", "8px"],
  registerAlpha: ["--fx-glow-register-alpha", 0.35],
  flagRadius: ["--fx-glow-flag-radius", "6px"],
  flagAlpha: ["--fx-glow-flag-alpha", 0.6],
};
const crt: Parameters<CrtOptions> = {
  scanAlpha: ["--fx-scan-alpha", 0.2],
  scanLine: ["--fx-scan-line", "1px"],
  scanPeriod: ["--fx-scan-period", "3px"],
  insetAlpha: ["--fx-crt-inset-alpha", 0.45],
  insetRadius: ["--fx-crt-inset-radius", "120px"],
  insetSpread: ["--fx-crt-inset-spread", "6px"],
  tintAlpha: ["--fx-crt-tint-alpha", 0.04],
  tintRadius: ["--fx-crt-tint-radius", "50px"],
  vignetteAlpha: ["--fx-vignette-alpha", 0.5],
  vignetteStart: ["--fx-vignette-start", "64%"],
};
const groups = { glitch, glow, crt };
const transition = "--fx-transition-duration";

/** Patch only supplied settings. CSS lengths/times/colors use ordinary CSS strings. */
export function setFx(options: FxOptions, root: HTMLElement = document.documentElement): void {
  if (options.mode !== undefined) root.setAttribute("data-fx", options.mode);
  if (options.transitionDuration !== undefined) {
    root.style.setProperty(transition, options.transitionDuration);
  }
  for (const group of ["glitch", "glow", "crt"] as const) {
    const values = options[group];
    if (!values) continue;
    if (values.enabled !== undefined) {
      root.setAttribute(`data-fx-${group}`, values.enabled ? "on" : "off");
    }
    for (const [key, [property]] of Object.entries(groups[group])) {
      const value = values[key as keyof typeof values];
      if (value !== undefined) root.style.setProperty(property, String(value));
    }
  }
}

/** Read effective custom properties; mode and enabled flags remain independent. */
export function getFx(root: HTMLElement = document.documentElement): FxState {
  const style = root.ownerDocument.defaultView?.getComputedStyle(root) ?? root.style;
  const read = (parameters: Record<string, readonly [string, string | number | undefined]>) =>
    Object.fromEntries(
      Object.entries(parameters).map(([key, [property, fallback]]) => {
        const value = style.getPropertyValue(property).trim();
        return [key, value ? (typeof fallback === "number" ? Number(value) : value) : fallback];
      })
    );
  const mode = root.getAttribute("data-fx");
  return {
    mode: mode === "off" || mode === "static" ? mode : "on",
    transitionDuration: style.getPropertyValue(transition).trim() || "120ms",
    glitch: { ...read(glitch), enabled: root.getAttribute("data-fx-glitch") !== "off" },
    glow: { ...read(glow), enabled: root.getAttribute("data-fx-glow") !== "off" },
    crt: { ...read(crt), enabled: root.getAttribute("data-fx-crt") !== "off" },
  } as FxState;
}

/** Remove API-owned overrides only, revealing the host stylesheet defaults. */
export function resetFx(root: HTMLElement = document.documentElement): void {
  root.removeAttribute("data-fx");
  root.style.removeProperty(transition);
  for (const group of ["glitch", "glow", "crt"] as const) {
    root.removeAttribute(`data-fx-${group}`);
    for (const [property] of Object.values(groups[group])) root.style.removeProperty(property);
  }
}
