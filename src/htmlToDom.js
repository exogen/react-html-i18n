const fn = process.browser
  ? require("./htmlToDom.browser").htmlToDom
  : require("./htmlToDom.server").htmlToDom;

const attrListProperty = process.browser ? "attributes" : "attrs";
const textProperty = process.browser ? "data" : "value";

function htmlToDom(html) {
  return adaptNodes(fn(html));
}

function createAttrs(list) {
  let attrs = null;
  for (let i = 0; i < list.length; i++) {
    const attr = list[i];
    const key = `${attr.prefix || ""}${attr.name}`;
    attrs = attrs || {};
    attrs[key] = attr.value;
  }
  return attrs;
}

function adaptNodes(domNodes) {
  const nodes = [];
  domNodes.forEach((domNode) => {
    switch (domNode.nodeName) {
      case "#text":
        nodes.push({ type: "text", data: domNode[textProperty] });
        break;
      case domNode.tagName: {
        const name = domNode.tagName.toLowerCase();
        const attrList = domNode[attrListProperty];
        const attrs = createAttrs(attrList);
        nodes.push({
          type: "tag",
          name,
          attrs,
          children: adaptNodes(domNode.childNodes),
        });
      }
    }
  });
  return nodes;
}

module.exports = { htmlToDom };
