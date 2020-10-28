import { parseFragment } from "parse5";

export function getChildNodes(html) {
  return parseFragment(html).childNodes;
}
