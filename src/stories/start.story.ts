import { createStory, node, section, button } from "./shared";
const story = createStory({
  id: "start",
  title: "Подключение и принципы",
  group: "start",
  description:
    "ASM://PROTOCOL — каталог компонентов учебного рабочего места. Образцы используют DOM и CSS сайта; выбирайте раздел слева, меняйте параметры в панели «Controls».",
  render(el) {
    el.append(
      section(
        "Два скина",
        node(
          "p",
          "lede",
          "operator — свечение, CRT и переход shred. tty — моноширинный текст, спокойные цвета и сдержанная анимация. Переключатель выше меняет body iframe."
        ),
        button("Ответить", "primary")
      )
    );
    el.append(
      node(
        "p",
        "",
        "Варианты и состояния собраны на одной странице. Hover — наведите курсор; focus-visible — используйте Tab. Все настройки действуют только внутри текущего превью."
      )
    );
  },
});
export default { ...story, docsOnly: true };
