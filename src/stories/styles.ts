// Same order as packages/frontend/src/main.ts. Inject only into the preview document,
// so application selectors never restyle Histoire's own navigation and controls.
import sandbox from "../site/sandbox.css?inline";
import tokens from "../styles/tokens.css?inline";
import operator from "../styles/skin-operator.css?inline";
import tty from "../styles/skin-tty.css?inline";
import site from "../site/index.css?inline";

export const siteCSS = [sandbox, tokens, operator, tty, site];
export function mountStyles(doc: Document): () => void {
  // Histoire's Tailwind preflight also ships into its sandbox. Disable it here:
  // a component preview must have exactly the site's author styles and browser defaults.
  const previous = [...doc.styleSheets].map((sheet) => ({ sheet, disabled: sheet.disabled }));
  previous.forEach(({ sheet }) => {
    sheet.disabled = true;
  });
  const nodes = siteCSS.map((css) => {
    const node = doc.createElement("style");
    node.dataset.showcaseStyles = "";
    node.textContent = css;
    doc.head.append(node);
    return node;
  });
  return () => {
    nodes.forEach((node) => node.remove());
    previous.forEach(({ sheet, disabled }) => {
      sheet.disabled = disabled;
    });
  };
}
export const tokenNames = [
  ...new Set([...site.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1])),
].sort();
