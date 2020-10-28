const { htmlToDom, domToReact } = require("../dist/index.cjs");

test("returns an array if there are multiple nodes", () => {
  const result = domToReact(
    htmlToDom(
      'test <span style="color: red">one</span> two <div class="foo">three</div>'
    )
  );
  expect(result).toMatchInlineSnapshot(`
    Array [
      "test ",
      <span
        style={
          Object {
            "color": "red",
          }
        }
      >
        one
      </span>,
      " two ",
      <div
        className="foo"
      >
        three
      </div>,
    ]
  `);
  expect(result[1].key).toBe("1");
  expect(result[3].key).toBe("3");
});

test("returns a single node if there is only one", () => {
  const result = domToReact(htmlToDom("<span>one two three</span>"));
  expect(result).toMatchInlineSnapshot(`
    <span>
      one two three
    </span>
  `);
  expect(result.key).toBe("0");
});

test("returns a string if there is only text", () => {
  const result = domToReact(htmlToDom("one two three"));
  expect(result).toMatchInlineSnapshot(`"one two three"`);
});

test("style is rendered with dangerouslySetInnerHTML", () => {
  const result = domToReact(
    htmlToDom("<style>strong { font-weight: bold; }</style>")
  );
  expect(result).toMatchInlineSnapshot(`
    <style
      dangerouslySetInnerHTML={
        Object {
          "__html": "strong { font-weight: bold; }",
        }
      }
    />
  `);
});

test("text is rendered with defaultValue", () => {
  const result = domToReact(htmlToDom("<textarea>one two three</textarea>"));
  expect(result).toMatchInlineSnapshot(`
    <textarea
      defaultValue="one two three"
    />
  `);
});

test("replace can return any renderable type", () => {
  const options = {
    replace(node) {
      if (node.type === "text") {
        return 5;
      }
      if (node.type === "tag" && node.name === "test") {
        return null;
      }
    },
  };
  expect(domToReact(htmlToDom("one <test>two</test> three"), options))
    .toMatchInlineSnapshot(`
    Array [
      5,
      null,
      5,
    ]
  `);
});

test("invalid syntax", () => {
  expect(domToReact(htmlToDom("one <b<< two"))).toMatchInlineSnapshot(`"one "`);
});
