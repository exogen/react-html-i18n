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
    <>
      <style jsx global>{`
        html {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-size: 100%;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        body {
          margin: 0;
          padding: 1rem;
          font-family: Lato, Helvetica, sans-serif;
          line-height: 1.5;
          background: #e6e2da;
          color: #222;
        }

        h1 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        pre,
        code,
        tt {
          font-family: "Dank Mono", Menlo, Monaco, Consolas, monospace;
        }

        .rule {
          margin: 1rem 0;
          border: 0;
          border-top: 2px solid #1671f0;
        }

        .fancy-link {
          padding: 0.2rem 0.4rem;
          border-radius: 2px;
          text-decoration: none;
          background: #157ce8;
          color: #fff;
          box-shadow: 0 3px 0 #03407e;
          text-shadow: 0 -1px 0 #03407e;
        }

        .important {
          text-transform: uppercase;
          color: red;
        }

        .Intro {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 50rem;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .Intro code {
          border-radius: 2px;
          padding: 0.1em 0.2em;
          font-size: 0.9em;
          background: rgba(0, 0, 0, 0.08);
          color: #000;
        }

        .EditArea {
          display: flex;
        }

        .LiveEditor {
          flex: 0 0 50%;
        }

        .LivePreview {
          flex: 0 0 50%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
      <MessageProvider>
        <Example
          intro={
            <p>
              Neat, it’s ICU Message Format with full HTML and React element
              support.
            </p>
          }
          code={`<Message
  string="<h1>{title}</h1>"
  values={{ title: "It worked! Try editing this code." }}
/>`}
        />
        <Example
          intro={
            <p>
              Values can be React elements, even interactive ones with state!
            </p>
          }
          code={`<Message
  string="Like this: {button} …or how about another? {button}"
  values={{ button: <CounterButton /> }}
/>`}
        />
        <Example
          intro={<p>Tag replacement? You got it.</p>}
          code={`<Message
  string={\`
    <important>Read this!</important>

    <hr>

    Perhaps my <a href="https://github.com/exogen">other projects</a> would be
    of interest?

    <hr>

    How about a <a href="{url}">dynamic link</a>?
  \`}
  values={{
    // Define custom tag names:
    important: ({ children }) =>
      <h2 className="important">👉 {children} 👈</h2>,
    // Customize how tags are rendered:
    hr: () => <hr className="rule" />,
    // Attributes and children become props:
    a: (props) => <FancyLink rel="noopener" {...props} />,
    // Substitution works in any part of the HTML string:
    url: "https://bailproject.org/"
  }}
/>`}
        />
        <Example
          intro={
            <p>
              Here’s an example of a complex message from the ICU docs. You can
              define completely custom formatters, or import the built-ins
              defined by the ICU Message Format spec, like: <code>date</code>,{" "}
              <code>time</code>, <code>number</code>, <code>select</code>,{" "}
              <code>plural</code>, and <code>selectordinal</code>.
            </p>
          }
          code={`<Message
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
  values={{
    host: "Alex",
    guest: "Sam",
    gender_of_host: "other",
    num_guests: 2,
  }}
/>`}
        />
      </MessageProvider>
    </>
  );
}
