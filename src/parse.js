/**
 * Parses ICU message syntax into an AST.
 * Supports these features:
 * - Apostrophe escapes (uses DOUBLE_OPTIONAL mode).
 * - {simple} substitution.
 * - {var, type} substitution.
 * - {var, type, format} substitution, where format can contain complex nesting
 *   of additional ICU messages, for example:
 *   “I’ve invited {n, plural, offset:1
 *      =0 {nobody!}
 *      =1 {Alice.}
 *      =2 {Alice and a friend.}
 *      other {Alice and # more people.}}”
 * - # substitution.
 */
export function parse(string) {
  const tree = { type: "doc", nodes: [] };
  const stack = [tree];
  let node = tree;
  let prevLit = null;

  const pushLiteral = (value) => {
    if (prevLit) {
      prevLit.value += value;
    } else {
      const literal = { type: "lit", value };
      node.nodes.push(literal);
      prevLit = literal;
    }
  };

  // It's likely that most translation strings won't have any special syntax.
  // For a performance boost we can bail out early if the string only consists
  // of literal text.
  if (
    string.indexOf("'") === -1 &&
    string.indexOf("{") === -1 &&
    string.indexOf("#") === -1
  ) {
    pushLiteral(string);
    return tree;
  }

  const push = (...nodes) => {
    const length = stack.push(...nodes);
    node = stack[length - 1];
    prevLit = null;
  };

  const pop = (num) => {
    const newLength = stack.length - num;
    const nodes = stack.splice(newLength, num);
    node = stack[newLength - 1];
    prevLit = null;
    return nodes;
  };

  const pushExpr = (arg, expr) => {
    if (expr.value) {
      arg.exprs.push(expr);
    }
  };

  const regex = /('')|(?:'([{}#](?:''|.)*)')|(')|({\s*)|(\s*})|(\s*,\s*)|(\s+)|(#)|([^'{},\s#]+)/g;

  let match;
  while ((match = regex.exec(string))) {
    let [
      str,
      escapeChar,
      escapeString,
      literalApostrophe,
      startBlock,
      endBlock,
      argSeparator,
      spaceString,
      numberString,
      literalString,
    ] = match;
    if (literalApostrophe || escapeChar) {
      literalString = "'";
    } else if (escapeString) {
      literalString = escapeString.replace(/''/g, "'");
    }
    if (node.type === "doc") {
      if (literalString) {
        pushLiteral(literalString);
      } else if (startBlock) {
        push(
          { type: "sub", args: [] },
          { type: "arg", exprs: [] },
          { type: "exp", value: "" }
        );
      } else if (endBlock) {
        if (node === tree) {
          pushLiteral(endBlock);
        } else {
          const [doc] = pop(1);
          node.exprs.push(doc);
          push({ type: "exp", value: "" });
        }
      } else if (numberString) {
        node.nodes.push({
          type: "sub",
          args: [{ type: "arg", exprs: [{ type: "exp", value: "#" }] }],
        });
        prevLit = null;
      } else {
        pushLiteral(str);
      }
    } else {
      if (literalString) {
        node.value += literalString;
      } else if (spaceString) {
        const [prevExpr] = pop(1);
        pushExpr(node, prevExpr);
        push({ type: "exp", value: "" });
      } else if (argSeparator) {
        const [prevArg, prevExpr] = pop(2);
        pushExpr(prevArg, prevExpr);
        node.args.push(prevArg);
        push({ type: "arg", exprs: [] }, { type: "exp", value: "" });
      } else if (startBlock) {
        const [prevExpr] = pop(1);
        pushExpr(node, prevExpr);
        push({ type: "doc", nodes: [] });
      } else if (endBlock) {
        const [block, arg, expr] = pop(3);
        pushExpr(arg, expr);
        block.args.push(arg);
        node.nodes.push(block);
      } else if (numberString) {
        node.value += numberString;
      }
    }
  }

  return tree;
}
