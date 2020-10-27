import { formatNode } from "./format";

export function formatDate(value, args, values, context) {
  const params = {};
  const styleExpr = args[2] && args[2].exprs[0];
  if (styleExpr) {
    params.dateStyle = styleExpr.value;
  }
  const dateFormat = new Intl.DateTimeFormat(context.locale, params);
  return dateFormat.format(value);
}

export function formatTime(value, args, values, context) {
  const params = { timeStyle: "short" };
  const styleExpr = args[2] && args[2].exprs[0];
  if (styleExpr) {
    params.timeStyle = styleExpr.value;
  }
  const dateFormat = new Intl.DateTimeFormat(context.locale, params);
  return dateFormat.format(value);
}

export function formatNumber(value, args, values, context) {
  const params = {};
  const styleExpr = args[2] && args[2].exprs[0];
  if (styleExpr) {
    params.style = styleExpr.value;
  }
  if (params.style === "currency") {
    params.currency = context.defaultCurrency;
  }
  const numberFormat = new Intl.NumberFormat(context.locale, params);
  return numberFormat.format(value);
}

export function formatPlural(value, args, values, context) {
  const choicesArg = args[2];
  if (!choicesArg) {
    return "";
  }
  const choices = {};
  let offset = 0;
  for (let i = 0; i < choicesArg.exprs.length; i++) {
    const expr = choicesArg.exprs[i];
    if (expr.type === "exp") {
      if (i === 0 && /^offset:[+-]?\d+$/.test(expr.value)) {
        offset = parseInt(expr.value.split(":")[1], 10);
      } else {
        const nextExpr = choicesArg.exprs[i + 1];
        if (nextExpr && nextExpr.type === "doc") {
          const stringToMatch = expr.value;
          choices[stringToMatch] = nextExpr;
          i++;
        }
      }
    }
  }
  const valueString = context.defaultFormatter(value);
  let choice = choices[`=${valueString}`];
  if (!choice) {
    const pluralRules = new Intl.PluralRules(context.locale, {
      type: context.pluralType,
    });
    const choiceKey = pluralRules.select(value);
    choice = choices[choiceKey] || choices.other;
  }
  values = { ...values, "#": value - offset };
  return choice ? formatNode(choice, values, context) : "";
}

export function formatSelect(value, args, values, context) {
  const choicesArg = args[2];
  if (!choicesArg) {
    return "";
  }
  let choice;
  const valueString = context.defaultFormatter(value);
  for (let i = 0; i < choicesArg.exprs.length; i++) {
    const expr = choicesArg.exprs[i];
    if (expr.type === "exp") {
      const nextExpr = choicesArg.exprs[i + 1];
      if (nextExpr && nextExpr.type === "doc") {
        const stringToMatch = expr.value;
        if (valueString === stringToMatch) {
          choice = nextExpr;
          break;
        } else {
          if (stringToMatch === "other") {
            choice = nextExpr;
          }
          i++;
        }
      }
    }
  }

  return choice ? formatNode(choice, values, context) : "";
}

export function formatSelectOrdinal(value, args, values, context) {
  context = { ...context, pluralType: "ordinal" };
  return formatPlural(value, args, values, context);
}
