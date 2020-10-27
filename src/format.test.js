const { format } = require("../dist/index.cjs");

test("escaping", () => {
  expect(format("hey it''s me!")).toBe("hey it's me!");
  expect(format("hey it'{test}'s me!")).toBe("hey it{test}s me!");
});

test("substitution", () => {
  expect(format("hello, {name}.", { name: "Alice" })).toBe("hello, Alice.");
});

test("# substitution", () => {
  expect(format("Amount: #", { "#": 3 })).toBe("Amount: 3");
  expect(format("Amount: '#'", { "#": 3 })).toBe("Amount: #");
  expect(format("#1 fan")).toBe("#1 fan");
});
