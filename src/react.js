import React from "react";
import { attrsToProps } from "./attrsToProps";
import { htmlToDom, domToReact } from "./domToReact";

const escapeChars = {
  '"': "&#34;",
  "&": "&amp;",
  "'": "&#39;",
  "<": "&lt;",
  ">": "&gt;",
};

/**
 * Since we're substitution values into an HTML string, some characters need to
 * be escaped.
 */
function escape(value) {
  return value.replace(/['"&<>]/g, (char) => escapeChars[char]);
}

/**
 * Check whether a string *potentially* has HTML syntax. Note that in addition
 * to the less-than sign, the presence of an ampersand and semicolon also
 * potentially indicate HTML due to entities, which need to be decoded.
 */
function hasHTMLSyntax(string) {
  return string.indexOf("<") !== -1 || string.indexOf("&") !== -1;
}

/**
 * A value formatter for the `format` function that renders (and escapes)
 * primitive values, and inserts placeholder `<span>` elements for values that
 * React should render, like arrays and React elements. When `htmlToReact` is
 * called on the resulting string, it uses the `replace` option to turn the
 * placeholder spans back into their respective values.
 */
export function defaultReactFormatter(value, args, values, context) {
  if (value != null) {
    switch (typeof value) {
      case "number":
      case "bigint":
        return value.toString();
      case "string":
        return escape(value);
      case "object":
        if (Array.isArray(value) || React.isValidElement(value)) {
          const key = context.onInsertPlaceholder(value);
          return `<span data-react-placeholder-key="${key}"></span>`;
        }
        return escape(value.toString());
    }
  }
  return "";
}

/**
 * A wrapper around `html-react-parser` with several additions:
 *
 * - If the string has no HTML syntax, it skips parsing altogether for a
 *   performance boost.
 * - If a placeholder `<span>` is found (see above), it replaces it with the
 *   matching value in `placeholders` object or array.
 * - If a tag name matches a function in `tagHandlers`, the function will be
 *   called with that element's props. You can use this to render custom tags
 *   or replace HTML tags with custom components.
 * - Improved error handling for invalid tags.
 */
export function htmlToReact(html, placeholders, tagHandlers) {
  if (!hasHTMLSyntax(html)) {
    return html;
  }
  const dom = htmlToDom(html);
  const options = {
    replace(node) {
      if (node.type === "tag") {
        if (node.attribs) {
          const key = node.attribs["data-react-placeholder-key"];
          if (key) {
            return placeholders[key];
          }
        }
        const tagName = node.name;
        const tagHandler = tagHandlers && tagHandlers[tagName];
        if (typeof tagHandler === "function") {
          const props = attrsToProps(node.attribs);
          if (node.children.length) {
            props.children = domToReact(node.children, options);
          }
          return tagHandler(props);
        }
      }
    },
  };
  try {
    return domToReact(dom, options);
  } catch (err) {
    // Don't throw; instead return the raw HTML string.
    return html;
  }
}
