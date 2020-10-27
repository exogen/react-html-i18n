import React, { useContext, useMemo } from "react";
import { Context } from "./MessageProvider";

export function useMessage(message, values) {
  const { formatMessage, messages } = useContext(Context);

  if (typeof message !== "string") {
    const { id, defaultMessage } = message;
    message = id ? messages[id] : null;
    if (message == null) {
      message = defaultMessage;
    }
  }

  return formatMessage(message, values);
}
