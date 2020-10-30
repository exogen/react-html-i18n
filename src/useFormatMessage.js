import { useContext } from "react";
import { MessageContext } from "./MessageProvider";

export function useFormatMessage() {
  const { formatMessage } = useContext(MessageContext);
  return formatMessage;
}
