import { defineConfig } from "histoire";

export default defineConfig({
  // Match vanilla JS/TS story files, not .vue/.svelte
  storyMatch: ["src/stories/*.story.ts"],

  // Extend vanilla-support plugin patterns to include .ts files
  supportMatch: [
    {
      id: "vanilla",
      patterns: ["**/*.story.js", "**/*.story.ts"],
      pluginIds: ["vanilla"],
    },
  ],

  // Don't create node_modules for histoire-sandbox, use alias to project node_modules
  vite: (viteConfig, { mode, command }) => {
    return {
      ...viteConfig,
      // Base path for GitHub Pages hosting (subdirectory site)
      base: "/asm-protocol-ui-kit/",
      optimizeDeps: {
        ...viteConfig.optimizeDeps,
        exclude: ["@histoire/controls", "@histoire/vendors/vue"],
      },
    };
  },

  // Minimal theme colors matching asm-protocol palette
  theme: {
    title: "ASM://PROTOCOL · Витрина",
    colors: {
      primary: {
        50: "#B6FFD8",
        100: "#9AD5F2",
        200: "#72F2B0",
        300: "#4E8E72",
        400: "#2AAE68",
        500: "#1F6B45",
        600: "#0F1A15",
        700: "#0C1712",
        800: "#0A100D",
        900: "#080C0A",
        950: "#070A09",
      },
      gray: {
        50: "#DDE8E3",
        100: "#C7D4CE",
        200: "#A9B7B1",
        300: "#93A29C",
        400: "#7C8B85",
        500: "#7A8A83",
        600: "#6E7E77",
        700: "#52625B",
        750: "#2C4A3C",
        800: "#1A2521",
        850: "#16201C",
        900: "#101915",
        950: "#0B100E",
      },
    },
    defaultColorScheme: "dark",
    storeColorScheme: false,
    darkClass: "dark",
  },

  // Section order and page order follow the showcase catalog.
  tree: {
    groups: [
      { id: "start", title: "Начало" },
      { id: "foundations", title: "Основы" },
      { id: "effects", title: "Эффекты" },
      { id: "buttons", title: "Кнопки" },
      { id: "switches", title: "Переключатели" },
      { id: "answers", title: "Ответы" },
      { id: "feedback", title: "Обратная связь" },
      { id: "collections", title: "Карточки и списки" },
      { id: "machine", title: "Стенд «Машина»" },
      { id: "shell", title: "Каркас" },
      { id: "forms", title: "Формы и диалоги" },
    ],
    file: "title",
    order: (a, b) => {
      const pages = [
        "Подключение и принципы",
        "Цвета",
        "Типографика",
        "Пульт эффектов",
        "Glitch",
        "Свечение",
        "CRT",
        "Кнопка",
        "Кнопки стенда и порядка",
        "Режим задания",
        "Скин",
        "Группировка навыков",
        "Верхняя навигация",
        "Варианты ответа",
        "Текстовый ответ",
        "Порядок шагов",
        "Результат ответа",
        "Подсказка",
        "Уведомление",
        "Следующий шаг",
        "Вступление к модулю",
        "Карточка трека",
        "Модули и уроки",
        "Каталог",
        "Навыки и статусы",
        "Теги",
        "Панель",
        "Сетка ценностей",
        "Листинг, регистры и флаги",
        "Верхняя панель",
        "Хлебные крошки",
        "Навигация по урокам",
        "Подвал",
        "Форма входа",
        "Поле ответа",
        "Многострочный ответ",
        "Диалог аккаунта",
        "Блок кода",
      ];
      const first = pages.indexOf(a),
        second = pages.indexOf(b);
      return first >= 0 && second >= 0 ? first - second : a.localeCompare(b, "ru");
    },
  },
});
