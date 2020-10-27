const { parse } = require("../dist/index.cjs");

test("escaping", () => {
  expect(parse("hey it''s me!")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "hey it's me!",
        },
      ],
      "type": "doc",
    }
  `);
  expect(parse("hey it'{test}'s me!")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "hey it{test}s me!",
        },
      ],
      "type": "doc",
    }
  `);
});

test("apostrophe mode is DOUBLE_OPTIONAL", () => {
  expect(parse("hey it's me!")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "hey it's me!",
        },
      ],
      "type": "doc",
    }
  `);
  expect(parse("This '{isn''t}' obvious.")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "This {isn't} obvious.",
        },
      ],
      "type": "doc",
    }
  `);
});

test("substitution", () => {
  expect(parse("hello, {name}.")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "hello, ",
        },
        Object {
          "args": Array [
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "name",
                },
              ],
              "type": "arg",
            },
          ],
          "type": "sub",
        },
        Object {
          "type": "lit",
          "value": ".",
        },
      ],
      "type": "doc",
    }
  `);
});

test("substitution type", () => {
  expect(parse("hello, {n, number}.")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "hello, ",
        },
        Object {
          "args": Array [
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "n",
                },
              ],
              "type": "arg",
            },
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "number",
                },
              ],
              "type": "arg",
            },
          ],
          "type": "sub",
        },
        Object {
          "type": "lit",
          "value": ".",
        },
      ],
      "type": "doc",
    }
  `);
});

test("substitution complex args", () => {
  expect(parse("hello, {n, plural, =0 {none} one {you} other {y''all}}."))
    .toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "hello, ",
        },
        Object {
          "args": Array [
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "n",
                },
              ],
              "type": "arg",
            },
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "plural",
                },
              ],
              "type": "arg",
            },
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "=0",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "type": "lit",
                      "value": "none",
                    },
                  ],
                  "type": "doc",
                },
                Object {
                  "type": "exp",
                  "value": "one",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "type": "lit",
                      "value": "you",
                    },
                  ],
                  "type": "doc",
                },
                Object {
                  "type": "exp",
                  "value": "other",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "type": "lit",
                      "value": "y'all",
                    },
                  ],
                  "type": "doc",
                },
              ],
              "type": "arg",
            },
          ],
          "type": "sub",
        },
        Object {
          "type": "lit",
          "value": ".",
        },
      ],
      "type": "doc",
    }
  `);
});

test("invalid syntax", () => {
  expect(parse("stray } end block")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "stray } end block",
        },
      ],
      "type": "doc",
    }
  `);
  expect(parse("empty {} block")).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "empty ",
        },
        Object {
          "args": Array [
            Object {
              "exprs": Array [],
              "type": "arg",
            },
          ],
          "type": "sub",
        },
        Object {
          "type": "lit",
          "value": " block",
        },
      ],
      "type": "doc",
    }
  `);
});

test("select example", () => {
  expect(
    parse(`
  {gender_of_host, select, 
  female {
    {num_guests, plural, offset:1 
      =0 {{host} does not give a party.}
      =1 {{host} invites {guest} to her party.}
      =2 {{host} invites {guest} and one other person to her party.}
      other {{host} invites {guest} and # other people to her party.}}}
  male {
    {num_guests, plural, offset:1 
      =0 {{host} does not give a party.}
      =1 {{host} invites {guest} to his party.}
      =2 {{host} invites {guest} and one other person to his party.}
      other {{host} invites {guest} and # other people to his party.}}}
  other {
    {num_guests, plural, offset:1 
      =0 {{host} does not give a party.}
      =1 {{host} invites {guest} to their party.}
      =2 {{host} invites {guest} and one other person to their party.}
      other {{host} invites {guest} and # other people to their party.}}}}
`)
  ).toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "type": "lit",
          "value": "
      ",
        },
        Object {
          "args": Array [
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "gender_of_host",
                },
              ],
              "type": "arg",
            },
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "select",
                },
              ],
              "type": "arg",
            },
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "female",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "args": Array [
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "num_guests",
                            },
                          ],
                          "type": "arg",
                        },
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "plural",
                            },
                          ],
                          "type": "arg",
                        },
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "offset:1",
                            },
                            Object {
                              "type": "exp",
                              "value": "=0",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " does not give a party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "=1",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " to her party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "=2",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " and one other person to her party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "other",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " and ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "#",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " other people to her party.",
                                },
                              ],
                              "type": "doc",
                            },
                          ],
                          "type": "arg",
                        },
                      ],
                      "type": "sub",
                    },
                  ],
                  "type": "doc",
                },
                Object {
                  "type": "exp",
                  "value": "male",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "args": Array [
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "num_guests",
                            },
                          ],
                          "type": "arg",
                        },
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "plural",
                            },
                          ],
                          "type": "arg",
                        },
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "offset:1",
                            },
                            Object {
                              "type": "exp",
                              "value": "=0",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " does not give a party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "=1",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " to his party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "=2",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " and one other person to his party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "other",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " and ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "#",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " other people to his party.",
                                },
                              ],
                              "type": "doc",
                            },
                          ],
                          "type": "arg",
                        },
                      ],
                      "type": "sub",
                    },
                  ],
                  "type": "doc",
                },
                Object {
                  "type": "exp",
                  "value": "other",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "args": Array [
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "num_guests",
                            },
                          ],
                          "type": "arg",
                        },
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "plural",
                            },
                          ],
                          "type": "arg",
                        },
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "offset:1",
                            },
                            Object {
                              "type": "exp",
                              "value": "=0",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " does not give a party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "=1",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " to their party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "=2",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " and one other person to their party.",
                                },
                              ],
                              "type": "doc",
                            },
                            Object {
                              "type": "exp",
                              "value": "other",
                            },
                            Object {
                              "nodes": Array [
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "host",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " invites ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "guest",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " and ",
                                },
                                Object {
                                  "args": Array [
                                    Object {
                                      "exprs": Array [
                                        Object {
                                          "type": "exp",
                                          "value": "#",
                                        },
                                      ],
                                      "type": "arg",
                                    },
                                  ],
                                  "type": "sub",
                                },
                                Object {
                                  "type": "lit",
                                  "value": " other people to their party.",
                                },
                              ],
                              "type": "doc",
                            },
                          ],
                          "type": "arg",
                        },
                      ],
                      "type": "sub",
                    },
                  ],
                  "type": "doc",
                },
              ],
              "type": "arg",
            },
          ],
          "type": "sub",
        },
        Object {
          "type": "lit",
          "value": "
    ",
        },
      ],
      "type": "doc",
    }
  `);
});

test("html", () => {
  expect(parse("{n, plural, one {<h1># person.</h1>} other {# people.}}"))
    .toMatchInlineSnapshot(`
    Object {
      "nodes": Array [
        Object {
          "args": Array [
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "n",
                },
              ],
              "type": "arg",
            },
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "plural",
                },
              ],
              "type": "arg",
            },
            Object {
              "exprs": Array [
                Object {
                  "type": "exp",
                  "value": "one",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "type": "lit",
                      "value": "<h1>",
                    },
                    Object {
                      "args": Array [
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "#",
                            },
                          ],
                          "type": "arg",
                        },
                      ],
                      "type": "sub",
                    },
                    Object {
                      "type": "lit",
                      "value": " person.</h1>",
                    },
                  ],
                  "type": "doc",
                },
                Object {
                  "type": "exp",
                  "value": "other",
                },
                Object {
                  "nodes": Array [
                    Object {
                      "args": Array [
                        Object {
                          "exprs": Array [
                            Object {
                              "type": "exp",
                              "value": "#",
                            },
                          ],
                          "type": "arg",
                        },
                      ],
                      "type": "sub",
                    },
                    Object {
                      "type": "lit",
                      "value": " people.",
                    },
                  ],
                  "type": "doc",
                },
              ],
              "type": "arg",
            },
          ],
          "type": "sub",
        },
      ],
      "type": "doc",
    }
  `);
});
