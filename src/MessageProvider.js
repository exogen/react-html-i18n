import React, { useMemo } from "react";
import { parse } from "./parse";
import { createFormat } from "./format";
import {
  formatDate,
  formatTime,
  formatNumber,
  formatPlural,
  formatSelect,
  formatSelectOrdinal,
} from "./intl";
import { defaultReactFormatter, htmlToReact } from "./react";
import QuickLRU from "quick-lru";

const parseCache = new QuickLRU({ maxSize: 200 });

/**
 * A version of `parse` that uses an LRU cache to parse the resulting ASTs.
 */
function parseMessage(string) {
  let ast = parseCache.get(string);
  if (!ast) {
    ast = parse(string);
    parseCache.set(string, ast);
  }
  return ast;
}

export const MessageContext = React.createContext();
MessageContext.displayName = "MessageContext";

const defaultFormatters = {
  date: formatDate,
  time: formatTime,
  number: formatNumber,
  select: formatSelect,
  plural: formatPlural,
  selectordinal: formatSelectOrdinal,
};

export function MessageProvider({ children, locale, messages }) {
  const context = useMemo(() => {
    const formatMessage = (message, values) => {
      if (typeof message !== "string") {
        const { id, defaultMessage } = message;
        message = messages[id];
        if (message == null) {
          message = defaultMessage;
        }
      }
      let placeholders;
      const formatHTML = createFormat({
        locale,
        parseMessage,
        defaultFormatter: defaultReactFormatter,
        // Custom `defaultFormatter` implementation calls this whenever there
        // are non- primitive values to insert into the HTML.
        onInsertPlaceholder(value) {
          placeholders = placeholders || [];
          const index = placeholders.push(value) - 1;
          return index;
        },
        formatters: defaultFormatters,
      });
      const html = formatHTML(message, values);
      // Substitution values and tag handler functions are both passed in the
      // same `values` object, to pass `values` as the `tagHandlers` object
      // here.
      return htmlToReact(html, placeholders, values);
    };

    return { locale, messages, formatMessage };
  }, [locale, messages]);

  return (
    <MessageContext.Provider value={context}>
      {children}
    </MessageContext.Provider>
  );
}
