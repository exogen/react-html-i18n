const { getChildNodes } = process.browser
  ? require("./htmlToDom.browser")
  : require("./htmlToDom.server");

const attrListProperty = process.browser ? "attributes" : "attrs";
const dataProperty = process.browser ? "data" : "value";

function htmlToDom(html) {
  return adaptNodes(getChildNodes(html));
}

function createAttrs(attrList) {
  let attrs = null;
  for (let i = 0; i < attrList.length; i++) {
    const attr = attrList[i];
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
        nodes.push({ type: "text", data: domNode[dataProperty] });
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
