import React, { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import theme from "prism-react-renderer/themes/palenight";
import { MessageProvider, Message } from "../src";

theme.plain.fontSize = "1rem";
theme.plain.fontFamily = '"Dank Mono", Menlo, Monaco, Consolas, monospace';

function CounterButton() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Click me! {count}
    </button>
  );
}

function FancyLink({ className, ...rest }) {
  className = className ? `${className} fancy-link` : "fancy-link";
  return <a className={className} {...rest} />;
}

const scope = { MessageProvider, Message, CounterButton, FancyLink };

function Example({ code, intro }) {
  return (
    <LiveProvider code={code} scope={scope} theme={theme}>
      <div className="Intro">{intro}</div>
      <div className="EditArea">
        <LiveEditor className="LiveEditor" />
        <LivePreview className="LivePreview" />
      </div>
      <LiveError />
    </LiveProvider>
  );
}

export default function DemoPage() {
  return (
    <MessageProvider>
      <Example
        intro={
          <p>
            Neat, it’s ICU Message Format with full HTML and React element
            support.
          </p>
        }
        code={`<Message
  values={{ title: "It worked! Try editing this code." }}
  string="<h1>{title}</h1>"
/>`}
      />
      <Example
        intro={
          <p>Values can be React elements, even interactive ones with state!</p>
        }
        code={`<Message
  values={{ button: <CounterButton /> }}
  string="Like this: {button} …or how about another? {button}"
/>`}
      />
      <Example
        intro={<p>Tag replacement? You got it.</p>}
        code={`<Message
  values={{
    // Customize how tags are rendered:
    hr: () => <hr className="rule" />,
    // Attributes and children become props:
    a: (props) => <FancyLink rel="noopener" {...props} />,
    // Define custom tags:
    important: ({ children }) =>
      <h2 className="important">👉 {children} 👈</h2>,
    // Substitution works in any part of the HTML string:
    url: "https://bailproject.org/",
  }}
  string={\`
    <important>Read this!</important>

    <hr>

    Perhaps my <a href="https://github.com/exogen">other projects</a> would be of interest?

    <hr>

    How about a <a href="{url}">dynamic link</a>?
  \`}
/>`}
      />
      <Example
        intro={
          <p>
            Here’s an example of a complex message from the ICU docs. You can
            define completely custom formatters, or import the built-ins defined
            by the ICU Message Format spec, like: <code>date</code>,{" "}
            <code>time</code>, <code>number</code>, <code>select</code>,{" "}
            <code>plural</code>, and <code>selectordinal</code>.
          </p>
        }
        code={`<Message
  // Try changing these values.
  values={{
    host: "Alex",
    guest: "Sam",
    gender_of_host: "other",
    num_guests: 2,
  }}
  string={\` 
    {gender_of_host, select, 
      female {
        {num_guests, plural, offset:1 
          =0 {{host} does not give a party.}
          =1 {{host} invites {guest} to her party.}
          =2 {{host} invites {guest} and one other person to her party.}
          other {{host} invites {guest} and # other people to her party.}
        }
      }
      male {
        {num_guests, plural, offset:1 
          =0 {{host} does not give a party.}
          =1 {{host} invites {guest} to his party.}
          =2 {{host} invites {guest} and one other person to his party.}
          other {{host} invites {guest} and # other people to his party.}
        }
      }
      other {
        {num_guests, plural, offset:1 
          =0 {{host} does not give a party.}
          =1 {{host} invites {guest} to their party.}
          =2 {{host} invites {guest} and one other person to their party.}
          other {{host} invites {guest} and # other people to their party.}
        }
      }
    }
  \`}
/>`}
      />
    </MessageProvider>
  );
}
