import React from "react";
import { attrsToProps } from "./attrsToProps";

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
        case "tag": {
          let { name, attrs, children } = node;
          const props = { key: i };
          switch (name) {
            case "style":
              if (children[0]) {
                props.dangerouslySetInnerHTML = {
                  __html: children[0].data,
                };
                children = [];
              }
              break;
            case "textarea":
              if (children[0]) {
                props.defaultValue = children[0].data;
                children = [];
              }
          }
          if (attrs) {
            Object.assign(props, attrsToProps(attrs));
          }
          const reactChildren = domToReact(children, options);
          nodes.push(createElement(name, props, reactChildren));
        }
      }
    } else if (isValidElement(replacement)) {
      const key = replacement.key == null ? i : replacement.key;
      nodes.push(cloneElement(replacement, { key }));
    } else {
      nodes.push(replacement);
    }
  });

  return nodes.length === 1 ? nodes[0] : nodes;
}
