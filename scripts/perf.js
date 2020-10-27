const Benchmark = require("benchmark");

const libs = {
  "this library": () => require("../dist/index.cjs").parse,
  "format-message-parse": () => require("format-message-parse"),
  "intl-messageformat-parser": () => require("intl-messageformat-parser").parse,
  "messageformat-parser": () => require("messageformat-parser").parse,
  "@ffz/icu-msgparser": () => {
    const Parser = require("@ffz/icu-msgparser");
    const parser = new Parser();
    return (string) => parser.parse(string);
  },
};

const lib = process.argv[2] || "this library";
const getParse = libs[lib];
const parse = getParse();

const simpleString = "Nothing to see here, haha!";

const selectString = `
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
`;

function run(string) {
  const suite = new Benchmark.Suite();
  suite.add(lib, () => {
    return parse(string);
  });
  suite.on("cycle", (event) => {
    console.log(event.target.toString());
  });
  suite.run();
}

run(selectString);
