import React from "react";
import { attrsToProps } from "./attrsToProps";

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
            case "script":
              return;
            case "style":
              // The child of a style tag will be CSS syntax, but it's not valid
              // for React to escape that syntax as if it were HTML. So, stick
              // it in `dangerouslySetInnerHTML` instead of `children`.
              if (children[0]) {
                props.dangerouslySetInnerHTML = {
                  __html: children[0].data,
                };
                children = [];
              }
              break;
            case "textarea":
              // Convert `textarea` children to `defaultValue`, since using
              // children is not recommended in React.
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

  switch (nodes.length) {
    case 0:
      return null;
    case 1:
      return nodes[0];
    default:
      return nodes;
  }
}
