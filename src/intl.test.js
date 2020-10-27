const { createFormat } = require("../dist/index.cjs");
const {
  formatDate,
  formatTime,
  formatNumber,
  formatPlural,
  formatSelect,
  formatSelectOrdinal,
} = require("../dist/index.cjs");

const format = createFormat({
  locale: "en-US",
  defaultCurrency: "USD",
  formatters: {
    date: formatDate,
    time: formatTime,
    number: formatNumber,
    select: formatSelect,
    plural: formatPlural,
    selectordinal: formatSelectOrdinal,
  },
});

test("date", () => {
  const date = new Date(2012, 11, 20, 3, 0, 0);
  expect(format("Date: {date, date}", { date })).toBe("Date: 12/20/2012");
  expect(format("Date: {date, date, short}", { date })).toBe("Date: 12/20/12");
  expect(format("Date: {date, date, full}", { date })).toBe(
    "Date: Thursday, December 20, 2012"
  );
});

test("time", () => {
  const date = new Date(2012, 11, 20, 3, 20, 59);
  expect(format("Time: {date, time}", { date })).toBe("Time: 3:20 AM");
  expect(format("Time: {date, time, medium}", { date })).toBe(
    "Time: 3:20:59 AM"
  );
  expect(format("Time: {date, time, full}", { date })).toMatch(
    /^Time: 3:20:59 AM [\w ]+ Time$/
  );
});

test("select", () => {
  expect(
    format(
      `{gender, select,
  male {He replied to your message}
  female {She replied to your message}
  other {They replied to your message}
}`,
      { gender: "female" }
    )
  ).toBe("She replied to your message");

  expect(
    format(
      `{gender, select,
  male {He replied to your message}
  female {She replied to your message}
  other {They replied to your message}
}`,
      { gender: null }
    )
  ).toBe("They replied to your message");
});

test("number", () => {
  expect(format("Put in the {amount, number} hours.", { amount: 10000 })).toBe(
    "Put in the 10,000 hours."
  );

  expect(
    format("This code will make me {amount, number, currency}.", {
      amount: 1234567,
    })
  ).toBe("This code will make me $1,234,567.00.");

  expect(
    format("I hope this is at least {amount, number, percent} faster!", {
      amount: 2.5,
    })
  ).toBe("I hope this is at least 250% faster!");
});

test("plural", () => {
  expect(
    format(
      `I would like {count, plural,
  =0 {no apples}
  =7 {seven apples}
  one {an apple}
  other {some apples}
}.`,
      { count: 0 }
    )
  ).toBe("I would like no apples.");

  expect(
    format(
      `I would like {count, plural,
  =0 {no apples}
  =7 {seven apples}
  one {an apple}
  other {some apples}
}.`,
      { count: 1 }
    )
  ).toBe("I would like an apple.");

  expect(
    format(
      `I would like {count, plural,
  =0 {no apples}
  =7 {seven apples}
  one {an apple}
  other {some apples}
}.`,
      { count: 7 }
    )
  ).toBe("I would like seven apples.");

  expect(
    format(
      `I would like {count, plural,
  =0 {no apples}
  =7 {seven apples}
  one {an apple}
  other {some apples}
}.`,
      { count: 2 }
    )
  ).toBe("I would like some apples.");
});

test("selectordinal", () => {
  expect(
    format(
      `It's my cat's {year, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} birthday!`,
      { year: 0 }
    )
  ).toBe("It's my cat's 0th birthday!");

  expect(
    format(
      `It's my cat's {year, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} birthday!`,
      { year: 1 }
    )
  ).toBe("It's my cat's 1st birthday!");

  expect(
    format(
      `It's my cat's {year, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} birthday!`,
      { year: 2 }
    )
  ).toBe("It's my cat's 2nd birthday!");

  expect(
    format(
      `It's my cat's {year, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} birthday!`,
      { year: 3 }
    )
  ).toBe("It's my cat's 3rd birthday!");

  expect(
    format(
      `It's my cat's {year, selectordinal,
  one {#st}
  two {#nd}
  few {#rd}
  other {#th}
} birthday!`,
      { year: 12 }
    )
  ).toBe("It's my cat's 12th birthday!");
});

test("complex", () => {
  const string = `{gender_of_host, select, 
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
      other {{host} invites {guest} and # other people to their party.}}}
}`;

  expect(
    format(string, {
      host: "Alice",
      guest: "Bob",
      gender_of_host: "female",
      num_guests: 1,
    })
  ).toBe("Alice invites Bob to her party.");

  expect(
    format(string, {
      host: "Alice",
      guest: "Bob",
      gender_of_host: "female",
      num_guests: 2,
    })
  ).toBe("Alice invites Bob and one other person to her party.");

  expect(
    format(string, {
      host: "Alice",
      guest: "Bob",
      gender_of_host: "female",
      num_guests: 10,
    })
  ).toBe("Alice invites Bob and 9 other people to her party.");
});
