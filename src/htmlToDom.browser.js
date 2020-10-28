const isTemplate = typeof HTMLTemplateElement === "function";
const host = document.createElement(isTemplate ? "template" : "div");

export function htmlToDom(html) {
  host.innerHTML = html;
  const { childNodes } = isTemplate ? host.content : host;
  return childNodes;
}
