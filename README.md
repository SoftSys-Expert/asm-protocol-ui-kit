# ASM Protocol UI Kit

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)

UI component kit for [ASM Protocol](https://github.com/kokhlo/asm-protocol) — an educational portal teaching low-level programming (assembly, registers, memory model, C/C++/Ada). Components feature a cyberpunk terminal aesthetic with CRT effects (scanlines, phosphor glow, glitch), two design skins (**operator** and **tty**), and interactive **Histoire** stories.

---

## 🎨 Skins

### **operator** — Full terminal with panels and CRT effects
- IBM Plex Mono + IBM Plex Sans
- Background `#070A09`, accent `#72F2B0`, info `#68BDE7`
- CRT scanlines, vignette, sweep, pixel grid, glitch on hover
- Feedback blocks (success = `exit 0`, fail = SIGSEGV/`exit 139`)
- Button variants: `.btn-primary`, `.btn-secondary`, `.btn-link`

### **tty** — Pure ASCII with box-drawing
- Monochrome, 108-column layout
- `┌─┐│└┘` box borders, color-coded state: complete (`#4E8E72`), active (`#72F2B0`), ready (`#68BDE7`), locked (`#6E7E77`)
- Terminal prompt `operator@asm:/map$` with blinking cursor

---

## 📦 Components

1. **Button** — Primary/secondary/link variants (operator) & inline command link (tty)
2. **Panel** — Card container with header, content, status bar
3. **CodeBlock** — Syntax-highlighted code (asm/C) with line numbers
4. **TextInput** — `$`-prefixed terminal prompt input
5. **OptionList** — Multiple-choice quiz buttons (operator) / bracketed indices (tty)
6. **Feedback** — Result panel: `process exited with code 0` or `Segmentation fault (core dumped)`
7. **ModeSwitch** — Tabbed skin selector
8. **Badge** — Module state indicator (complete/active/available/locked)

Each component has **two stories**: `ComponentName.story.ts` with variants:
```typescript
{
  title: 'Button',
  variants: [
    { id: 'operator-primary', title: 'Operator Primary', onMount: ... },
    { id: 'tty-link', title: 'TTY Link', onMount: ... },
  ]
}
```

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run story:dev      # Launch Histoire dev server (http://localhost:6006)
npm run dev            # Alias for story:dev
```

### Build
```bash
npm run build          # Vite lib build (dist/)
npm run story:build    # Histoire static build (.histoire/dist/)
```

### Lint & Typecheck
```bash
npm run lint           # Run ESLint, Prettier, Stylelint
npm run lint:fix       # Auto-fix linting issues
npm run typecheck      # TypeScript type check (no emit)
```

---

## 🏗 Architecture

```
src/
├── styles/
│   ├── tokens.css          # CSS variables (colors, fonts, spacing) from design/system/variables.css
│   ├── skin-operator.css   # Operator skin: CRT effects, panel styles
│   └── skin-tty.css        # TTY skin: box-drawing, ASCII table layout
├── components/
│   ├── Button.ts           # Web component definition
│   ├── Button.story.ts     # Histoire story
│   ├── Panel.ts
│   ├── Panel.story.ts
│   └── ... (8 components total)
└── index.ts                # Public exports (components, CSS imports)
```

---

## 📖 Usage in Main Project

```typescript
// In your app's entry point
import '@asm-protocol/ui-kit';            // Auto-registers all web components
import '@asm-protocol/ui-kit/skin-operator.css';  // or skin-tty.css

// Now use custom elements:
<asm-button skin="operator" variant="primary">Run</asm-button>
<asm-panel skin="tty" title="MODULE M1">...</asm-panel>
```

---

## 🧪 CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- **Lint**: ESLint + Prettier + Stylelint
- **Typecheck**: `tsc --noEmit`
- **Build**: Vite lib build + Histoire static build
- Runs on push/PR to `master`, `develop`

---

## 🎯 Design System

Tokens extracted from `design/system/variables.css` (146 variables):
- **Colors**: `--bg-dark: #070A09`, `--acc-primary: #72F2B0`, `--info-primary: #68BDE7`
- **Typography**: `--font-mono: IBM Plex Mono`, `--font-sans: IBM Plex Sans`
- **CRT Effects**: `--glow-primary`, `--shadow-terminal`, `@keyframes sweep`
- **Layout**: `--header-height: 46px`, `--terminal-height: 340px`, `--module-card-w: 108px`

---

## 📄 License

MIT — free to use, modify, distribute.

---

## 👤 Author

**Konstantin Khlopkov** ([kokhlo](https://github.com/kokhlo))

## Слой сайта ASM://PROTOCOL

`src/site/` переносит визуальный слой сайта без изменения его разметки. Он независим
от фабрик `src/core`, `src/styles/ui.css` и компонентных скинов `src/styles/skins/`.
Порядок файлов в `site/index.css` намеренно сохраняет каскад исходного сайта,
включая последовательные уточнения селекторов и два исторических `@keyframes shred`.
Последнее определение из `glitch.css` является действующим.

Перед подключением локальной зависимости выполните `npm ci`, затем `npm run build`
в UI-ките. Сборка создаёт ES modules, декларации TypeScript и копии CSS в `dist/`.
Импорт JS сам по себе не включает стили и не обращается к DOM.

```ts
// Порядок подключения на существующем сайте:
import "@asm-protocol/ui-kit/site/sandbox.css";
import "@asm-protocol/ui-kit/styles/tokens.css";
import "@asm-protocol/ui-kit/styles/skin-operator.css";
import "@asm-protocol/ui-kit/styles/skin-tty.css";
import "@asm-protocol/ui-kit/site/index.css";

import { setFx, getFx, resetFx, type FxOptions } from "@asm-protocol/ui-kit/site/fx";
// Те же функции и типы экспортируются из "@asm-protocol/ui-kit".
const options: FxOptions = {
  glitch: { duration: "0.6s", shift: "24px" },
  glow: { textRadius: "14px", textAlpha: 0.7 },
  crt: { scanAlpha: 0.1 },
};
setFx(options);
const current = getFx();
resetFx();
```

По умолчанию API работает с `document.documentElement`; можно передать корневой
HTML-элемент другого документа вторым аргументом. `setFx` изменяет только переданные
поля, `getFx` читает вычисленные переменные и флаги, `resetFx` удаляет только
переопределения API и возвращает значения из CSS. Другие inline-стили и атрибуты
сохраняются. Длины, длительности и цвета передаются валидными CSS-строками,
прозрачности — числами от 0 до 1. Проверку произвольного пользовательского ввода
должно выполнять вызывающее приложение.

`mode: "off"` выключает анимации, переходы, CRT и свечение. `mode: "static"`
выключает анимации и переходы, сохраняя CRT и свечение. `mode: "on"` снимает общий
запрет, сохраняя индивидуальные `enabled` каждого эффекта. Они записываются как
`data-fx`, `data-fx-glitch`, `data-fx-glow`, `data-fx-crt` на `<html>`.
`getFx().glitch.enabled` и аналогичные поля отражают индивидуальный флаг,
а не итог с учётом общего режима, TTY или системного reduced motion.

`--glitch-duration` остаётся алиасом `--fx-glitch-duration`. Имя анимации `shred`,
точные смещения −12/+10/−7/+5/−2 px, конечный `clip-path: inset(0)`, отсутствие CRT
до первого входа и прежняя reduced-motion/TTY-политика сохранены. TTY отключает
`shred` на экранах, диалоге, feedback и hint; `.exercise` сохраняет исходное поведение.
В CRT-градиентах оставлена legacy-запись `rgba()` для точной растеризации эталона.

Токены `--site-*` задают фиксированную семантическую палитру и не перекрашиваются
скином TTY. Цвета кнопок, зависящие от `--green`, `--ink` и других переменных скина,
используют fallback непосредственно в правиле элемента: это сохраняет их разрешение
на `body.skin-tty`. Такие `--btn-*` намеренно не объявлены на `:root`, но доступны
для настройки там или на конкретной кнопке. Численные параметры объявлены на `:root`.
Размеры `.button--sm` (32px, 6px 10px, 10px) и `.button--lg` (52px, 15px 22px, 13px)
применяются только при явном добавлении класса; разметка существующего сайта их не использует.

На сайте временно используется зависимость
`"@asm-protocol/ui-kit": "file:../../../asm-protocol-ui-kit"` и узкое расширение
`server.fs.allow` на соседний UI-кит. При изменении кита нужно повторять его сборку.
После публикации замените `file:` на версию пакета и удалите дополнительный `fs.allow`.
Публикация требует отдельного решения: пакет пока `private: true`; нужно выбрать
версию, registry, состав runtime dependencies и проверить содержимое `npm pack`.

### Параметры эффектов

| CSS-переменная | По умолчанию | Что меняет (селектор: свойство) |
| --- | --- | --- |
| `--fx-crt-inset-alpha` | `0.45` | `body.skin-operator::before: box-shadow` |
| `--fx-crt-inset-radius` | `120px` | `body.skin-operator::before: box-shadow` |
| `--fx-crt-inset-spread` | `6px` | `body.skin-operator::before: box-shadow` |
| `--fx-crt-tint-alpha` | `0.04` | `body.skin-operator::before: box-shadow` |
| `--fx-crt-tint-radius` | `50px` | `body.skin-operator::before: box-shadow` |
| `--fx-glitch-color-a` | `#f47777` | `55%: text-shadow`; `75%: text-shadow` |
| `--fx-glitch-color-b` | `#68bde7` | `55%: text-shadow`; `75%: text-shadow` |
| `--fx-glitch-duration` | `0.3s` | `@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500&display=swap&subset=cyrillic");  :root: --glitch-duration` |
| `--fx-glitch-rgb` | `2px` | `55%: text-shadow`; `75%: text-shadow` |
| `--fx-glitch-shift` | `12px` | `0%: transform`; `20%: transform`; `40%: transform`; `50%: transform`; `55%: transform`; `75%: transform` |
| `--fx-glow-box-alpha` | `0.2` | `body.skin-operator .button--primary:hover:not(:disabled), body.skin-operator .button--primary:focus-visible:not(:disabled): box-shadow` |
| `--fx-glow-box-radius` | `16px` | `body.skin-operator .button--primary:hover:not(:disabled), body.skin-operator .button--primary:focus-visible:not(:disabled): box-shadow` |
| `--fx-glow-flag-alpha` | `0.6` | `.machine-flag.is-on .machine-lamp: text-shadow` |
| `--fx-glow-flag-radius` | `6px` | `.machine-flag.is-on .machine-lamp: text-shadow` |
| `--fx-glow-register-alpha` | `0.35` | `.machine-reg.is-changed .machine-val: text-shadow` |
| `--fx-glow-register-radius` | `8px` | `.machine-reg.is-changed .machine-val: text-shadow` |
| `--fx-glow-rgb` | `114 242 176` | `.button--primary:hover:not(:disabled): box-shadow`; `.machine-flag.is-on .machine-lamp: text-shadow`; `.machine-reg.is-changed .machine-val: text-shadow`; `.session i: box-shadow`; `body.skin-operator .brand:hover, body.skin-operator .brand:focus-visible, body.skin-operator .topnav button:hover:not(:disabled), body.skin-operator .topnav button:focus-visible:not(:disabled), body.skin-operator .topnav button.is-current: text-shadow`; `body.skin-operator .button--primary:hover:not(:disabled), body.skin-operator .button--primary:focus-visible:not(:disabled): box-shadow`; `body.skin-operator .button:hover:not(:disabled), body.skin-operator .button:focus-visible:not(:disabled), body.skin-operator .option:hover:not(:disabled), body.skin-operator .option:focus-visible:not(:disabled): text-shadow`; `body.skin-operator::before: box-shadow` |
| `--fx-glow-session-radius` | `8px` | `.session i: box-shadow` |
| `--fx-glow-subtle-alpha` | `0.07` | `.button--primary:hover:not(:disabled): box-shadow` |
| `--fx-glow-subtle-radius` | `10px` | `.button--primary:hover:not(:disabled): box-shadow` |
| `--fx-glow-text-alpha` | `0.9` | `body.skin-operator .brand:hover, body.skin-operator .brand:focus-visible, body.skin-operator .topnav button:hover:not(:disabled), body.skin-operator .topnav button:focus-visible:not(:disabled), body.skin-operator .topnav button.is-current: text-shadow`; `body.skin-operator .button:hover:not(:disabled), body.skin-operator .button:focus-visible:not(:disabled), body.skin-operator .option:hover:not(:disabled), body.skin-operator .option:focus-visible:not(:disabled): text-shadow` |
| `--fx-glow-text-radius` | `9px` | `body.skin-operator .brand:hover, body.skin-operator .brand:focus-visible, body.skin-operator .topnav button:hover:not(:disabled), body.skin-operator .topnav button:focus-visible:not(:disabled), body.skin-operator .topnav button.is-current: text-shadow`; `body.skin-operator .button:hover:not(:disabled), body.skin-operator .button:focus-visible:not(:disabled), body.skin-operator .option:hover:not(:disabled), body.skin-operator .option:focus-visible:not(:disabled): text-shadow` |
| `--fx-scan-alpha` | `0.2` | `body.skin-operator::before: background-image` |
| `--fx-scan-line` | `1px` | `body.skin-operator::before: background-image` |
| `--fx-scan-period` | `3px` | `body.skin-operator::before: background-image` |
| `--fx-transition-duration` | `120ms` | `.button, .account-button, .topnav button: transition`; `.topnav button, .button, .option, .account-button, .text-link, .breadcrumb button, .brand: transition` |
| `--fx-vignette-alpha` | `0.5` | `body.skin-operator::after: background-image` |
| `--fx-vignette-start` | `64%` | `body.skin-operator::after: background-image` |

### Параметры кнопок

| CSS-переменная | По умолчанию | Что меняет (селектор: свойство) |
| --- | --- | --- |
| `--btn-bench-bg` | `var(--site-panel-fixed)` | `.bench-btn: background` |
| `--btn-bench-color` | `var(--ink)` | `.bench-btn: color` |
| `--btn-bench-disabled-opacity` | `0.4` | `.bench-btn:disabled: opacity` |
| `--btn-bench-font` | `13px/1 var(--mono)` | `.bench-btn: font` |
| `--btn-bench-hover-border` | `var(--green)` | `.bench-btn:hover:not(:disabled): border-color` |
| `--btn-bench-hover-color` | `var(--green)` | `.bench-btn:hover:not(:disabled): color` |
| `--btn-bench-padding` | `0 12px` | `.bench-btn: padding` |
| `--btn-bench-width` | `44px` | `.bench-btn: min-width` |
| `--btn-bg` | `transparent` | `.button: background` |
| `--btn-border` | `var(--site-control-border)` | `.bench-btn: border`; `.button: border`; `.option: border`; `.order-btn: border` |
| `--btn-color` | `var(--ink)` | `.button: color` |
| `--btn-danger-border` | `var(--site-danger-border)` | `.button--danger: border-color` |
| `--btn-danger-color` | `var(--red)` | `.button--danger: color` |
| `--btn-disabled-opacity` | `0.45` | `.button:disabled: opacity` |
| `--btn-font-size` | `11px` | `.button: font-size` |
| `--btn-font-weight` | `500` | `.button: font-weight` |
| `--btn-group-active-border` | `var(--green)` | `.skills-grouping button.is-on: border-color` |
| `--btn-group-active-color` | `var(--green)` | `.skills-grouping button.is-on: color` |
| `--btn-group-bg` | `transparent` | `.skills-grouping button: background` |
| `--btn-group-color` | `var(--muted)` | `.skills-grouping button: color` |
| `--btn-group-font` | `10px/1.6 var(--mono)` | `.skills-grouping button: font` |
| `--btn-group-padding` | `6px 12px` | `.skills-grouping button: padding` |
| `--btn-group-radius` | `2px` | `.skills-grouping button: border-radius` |
| `--btn-group-tracking` | `0.1em` | `.skills-grouping button: letter-spacing` |
| `--btn-height` | `42px` | `.bench-btn: min-height`; `.button: min-height` |
| `--btn-hover-bg` | `var(--site-control-hover)` | `.button:hover:not(:disabled): background` |
| `--btn-hover-border` | `var(--site-control-hover-border)` | `.button:hover:not(:disabled): border-color`; `body.skin-operator .button:not(.button--primary):hover:not(:disabled), body.skin-operator .account-button:hover:not(:disabled), body.skin-operator .account-button:focus-visible:not(:disabled): border-color` |
| `--btn-hover-color` | `var(--site-ink-fixed)` | `body.skin-operator .button:not(.button--primary):hover:not(:disabled), body.skin-operator .account-button:hover:not(:disabled), body.skin-operator .account-button:focus-visible:not(:disabled): color` |
| `--btn-link-bg` | `none` | `.text-link, .breadcrumb button: background` |
| `--btn-link-color` | `var(--blue)` | `.text-link, .breadcrumb button: color` |
| `--btn-link-font` | `11px var(--mono)` | `.text-link, .breadcrumb button: font` |
| `--btn-link-hover-color` | `var(--site-link-hover)` | `body.skin-operator .text-link:hover:not(:disabled), body.skin-operator .text-link:focus-visible:not(:disabled), body.skin-operator .breadcrumb button:hover:not(:disabled), body.skin-operator .breadcrumb button:focus-visible:not(:disabled): color` |
| `--btn-link-padding` | `5px 0` | `.text-link, .breadcrumb button: padding` |
| `--btn-mode-active-bg` | `var(--site-mode-active)` | `.mode-switch .is-on: background` |
| `--btn-mode-active-color` | `var(--green)` | `.mode-switch .is-on: color` |
| `--btn-mode-bg` | `transparent` | `.mode-switch button: background` |
| `--btn-mode-color` | `var(--muted)` | `.mode-switch button: color` |
| `--btn-mode-font` | `10px var(--mono)` | `.mode-switch button: font` |
| `--btn-mode-padding` | `6px` | `.mode-switch button: padding` |
| `--btn-nav-active-color` | `var(--green)` | `.topnav .is-current: color` |
| `--btn-nav-active-outline` | `1px solid var(--site-nav-active-border)` | `.topnav .is-current: outline` |
| `--btn-nav-bg` | `transparent` | `.topnav button: background` |
| `--btn-nav-color` | `var(--muted)` | `.topnav button: color` |
| `--btn-nav-hover-bg` | `var(--site-nav-hover)` | `.topnav button:hover, .topnav .is-current: background` |
| `--btn-nav-hover-color` | `var(--ink)` | `.topnav button:hover, .topnav .is-current: color` |
| `--btn-nav-padding` | `9px 10px` | `.topnav button: padding` |
| `--btn-nav-tracking` | `0.12em` | `.topnav button: letter-spacing` |
| `--btn-nav-weight` | `500` | `.topnav button: font-weight` |
| `--btn-option-bg` | `transparent` | `.option: background` |
| `--btn-option-color` | `var(--ink)` | `.option: color` |
| `--btn-option-correct-border` | `var(--green)` | `.option.correct: border-color` |
| `--btn-option-correct-color` | `var(--green)` | `.option.correct: color` |
| `--btn-option-gap` | `14px` | `.option: gap` |
| `--btn-option-hover-bg` | `var(--site-option-hover)` | `.option:hover: background` |
| `--btn-option-label-color` | `var(--muted)` | `.option span: color` |
| `--btn-option-label-font` | `11px var(--mono)` | `.option span: font` |
| `--btn-option-padding` | `12px` | `.option: padding` |
| `--btn-option-selected-bg` | `var(--site-primary-surface)` | `.option.is-selected: background` |
| `--btn-option-selected-border` | `var(--green)` | `.option.is-selected: border-color` |
| `--btn-option-selected-label` | `var(--green)` | `.option.is-selected span: color` |
| `--btn-option-selected-shadow` | `inset 2px 0 0 var(--green)` | `.option.is-selected: box-shadow` |
| `--btn-option-wrong-border` | `var(--red)` | `.option.wrong: border-color` |
| `--btn-option-wrong-color` | `var(--red)` | `.option.wrong: color` |
| `--btn-order-bg` | `transparent` | `.order-btn: background` |
| `--btn-order-color` | `var(--muted)` | `.order-btn: color` |
| `--btn-order-disabled-opacity` | `0.35` | `.order-btn:disabled: opacity` |
| `--btn-order-font` | `12px var(--mono)` | `.order-btn: font` |
| `--btn-order-hover-bg` | `var(--site-option-hover)` | `.order-btn:hover:not(:disabled): background` |
| `--btn-order-hover-color` | `var(--green)` | `.order-btn:hover:not(:disabled): color` |
| `--btn-order-line-height` | `1` | `.order-btn: line-height` |
| `--btn-order-padding` | `4px 9px` | `.order-btn: padding` |
| `--btn-pad-x` | `16px` | `.button: padding` |
| `--btn-pad-y` | `11px` | `.button: padding` |
| `--btn-primary-bg` | `var(--site-primary-surface)` | `.button--primary: background` |
| `--btn-primary-border` | `var(--green)` | `.button--primary: border-color` |
| `--btn-primary-color` | `var(--green)` | `.button--primary: color` |
| `--btn-primary-hover-bg` | `var(--site-primary-hover)` | `.button--primary:hover:not(:disabled): background` |
| `--btn-primary-hover-border` | `var(--green)` | `body.skin-operator .button--primary:hover:not(:disabled), body.skin-operator .button--primary:focus-visible:not(:disabled): border-color` |
| `--btn-radius` | `3px` | `.bench-btn: border-radius`; `.button: border-radius`; `.option: border-radius`; `.order-btn: border-radius` |
| `--btn-skin-active-bg` | `var(--site-skin-active)` | `.skin-switch button.is-on: background` |
| `--btn-skin-active-color` | `var(--green)` | `.skin-switch button.is-on: color` |
| `--btn-skin-bg` | `transparent` | `.skin-switch button: background` |
| `--btn-skin-color` | `var(--muted)` | `.skin-switch button: color` |
| `--btn-skin-font` | `9px var(--mono)` | `.skin-switch button: font` |
| `--btn-skin-padding` | `5px 6px` | `.skin-switch button: padding` |
| `--btn-step-bg` | `var(--site-primary-surface)` | `.bench-btn--step: background` |
| `--btn-step-border` | `var(--green)` | `.bench-btn--step: border-color` |
| `--btn-step-color` | `var(--green)` | `.bench-btn--step: color` |
| `--btn-step-width` | `112px` | `.bench-btn--step: min-width` |
| `--btn-tracking` | `.16em` | `.button: letter-spacing` |
