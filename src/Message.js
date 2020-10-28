import React from "react";
import { useMessage } from "./useMessage";

export function Message({ children, id, defaultMessage, string, values }) {
  const nodes = useMessage(
    string == null ? { id, defaultMessage } : string,
    values
  );
  return typeof children === "function" ? children(nodes) : nodes;
}
