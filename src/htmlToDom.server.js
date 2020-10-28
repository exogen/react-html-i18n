import { parseFragment } from "parse5";

export function htmlToDom(html) {
  return parseFragment(html).childNodes;
}
