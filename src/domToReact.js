import React from "react";
import htmlDomParser from "html-dom-parser";
import { attrsToProps } from "./attrsToProps";

const domParserOptions = {
  decodeEntities: true,
  lowerCaseAttributeNames: false,
};

export function htmlToDom(html, options = domParserOptions) {
  return htmlDomParser(html, options);
}

const validTagName = /^[0-9a-z-]+$/i;
const defaultOptions = {};

export function domToReact(dom, options = defaultOptions) {
  const { createElement, cloneElement, isValidElement } = React;
  const nodes = [];

  dom.forEach((node, i) => {
    const replacement = options.replace ? options.replace(node) : undefined;
    if (typeof replacement === "undefined") {
      switch (node.type) {
        case "text":
          nodes.push(node.data);
          return;
        case "style":
        case "tag": {
          const props = { key: i };
          let { name, attribs, children: childNodes } = node;
          switch (name) {
            case "style":
              if (childNodes[0]) {
                props.dangerouslySetInnerHTML = {
                  __html: childNodes[0].data,
                };
                childNodes = undefined;
              }
              break;
            case "textarea":
              if (childNodes[0]) {
                props.defaultValue = childNodes[0].data;
                childNodes = undefined;
              }
              break;
            default:
              if (!validTagName.test(name)) {
                return;
              }
          }
          if (attribs) {
            Object.assign(props, attrsToProps(attribs));
          }
          const children = childNodes && domToReact(childNodes, options);
          nodes.push(createElement(name, props, children));
        }
      }
    } else if (isValidElement(replacement)) {
      nodes.push(cloneElement(replacement, { key: i }));
    } else {
      nodes.push(replacement);
    }
  });

  return nodes.length === 1 ? nodes[0] : nodes;
}
