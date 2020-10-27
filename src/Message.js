import React from "react";
import { useMessage } from "./useMessage";

export function Message({ children, id, defaultMessage, string, values }) {
  const nodes = useMessage(string || { id, defaultMessage }, values);
  return typeof children === "function" ? children(nodes) : nodes;
}
