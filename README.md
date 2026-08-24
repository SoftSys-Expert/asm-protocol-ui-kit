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
