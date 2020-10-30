import { useFormatMessage } from "./useFormatMessage";

export function useMessage(message, values) {
  const formatMessage = useFormatMessage();
  return formatMessage(message, values);
}
