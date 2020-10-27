import { parse } from "./parse";

export const defaultContext = {
  defaultFormatter: formatValue,
  parseMessage: parse,
  formatters: {},
};

export function format(string, values = {}, context = defaultContext) {
  const ast = context.parseMessage(string);
  return formatNode(ast, values, context);
}

export function createContext(context) {
  return context
    ? {
        ...defaultContext,
        ...context,
        formatters: { ...defaultContext.formatters, ...context.formatters },
      }
    : defaultContext;
}

export function createFormat(context) {
  context = createContext(context);
  return (string, values) => format(string, values, context);
}

export function formatNode(node, values, context) {
  switch (node.type) {
    case "doc":
      return node.nodes
        .map((node) => formatNode(node, values, context))
        .join("");
    case "lit":
      return node.value;
    case "sub":
      return formatSubstitution(node, values, context);
    default:
      return "";
  }
}

export function formatSubstitution(node, values, context) {
  const [nameArg, formatArg, ...rest] = node.args;
  const nameExpr = nameArg.exprs[0];
  if (!nameExpr) {
    return "";
  }
  const name = nameExpr.value;
  const format = formatArg ? formatArg.exprs[0].value : null;
  const formatter =
    (format && context.formatters[format]) || context.defaultFormatter;
  let value = values[name];
  // If it's a # substitution and no # is defined in this context, render a
  // literal #.
  if (value == null && name === "#") {
    value = "#";
  }
  return formatter(value, node.args, values, context);
}

export function formatValue(value) {
  if (value != null) {
    switch (typeof value) {
      case "number":
      case "bigint":
        return value.toString();
      case "string":
        return value;
      case "object":
        return value.toString();
    }
  }
  return "";
}
