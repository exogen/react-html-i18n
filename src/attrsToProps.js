import styleToObject from "style-to-object";

function camelCase(str) {
  if (str.indexOf("-") === -1 && str.indexOf(":") === -1) {
    return str;
  }
  return str.replace(/[:-]([a-z])/g, (str, char) => char.toUpperCase());
}

const attrHandlers = {};

function defaultHandler(props, name, value) {
  props[name] = value;
}

function addHandler(names, handler) {
  const attrs = names.split(",");
  attrs.forEach((attr) => {
    const [attrName, propName] = attr.split("=");
    attrHandlers[attrName] = propName
      ? (props, name, value) => handler(props, propName, value)
      : handler;
  });
}

// Below are the HTML/SVG attributes that (1) are not type STRING, which is the
// default, or (2) have different React prop names than attribute names and
// (3) aren't just the camel-cased equivalent. Basically, anything we can't
// figure out automatically. It's designed to be as compact as possible for
// bundle size purposes. The categories (RESERVED, STRING, etc.) are from the
// `react-dom` codebase.

addHandler(
  // RESERVED
  "children,dangerouslySetInnerHTML,defaultChecked,defaultValue,innerHTML,suppressContentEditableWarning,suppressHydrationWarning",
  () => {}
);

// style is RESERVED according to React, but gets special handling.
addHandler("style", (props, name, value) => {
  props[name] = parseStyleAttribute(value);
});

addHandler(
  // STRING
  "class=className,crossorigin=crossOrigin,for=htmlFor,formaction=formAction,tabindex=tabIndex" +
    // BOOLEANISH_STRING
    "contenteditable=contentEditable,spellcheck=spellCheck",
  defaultHandler
);

addHandler(
  // BOOLEAN
  "allowfullscreen=allowFullScreen,async,autofocus=autoFocus,autoplay=autoPlay,checked,controls,default,defer,disabled,disablepictureinpicture=disablePictureInPicture,disableremoteplayback=disableRemotePlayback,formnovalidate=formNoValidate,hidden,itemscope=itemScope,loop,multiple,muted,nomodule=noModule,novalidate=noValidate,open,playsinline=playsInline,readonly=readOnly,required,reversed,scoped,seamless,selected",
  (props, name, value) => {
    props[name] = true;
  }
);

addHandler("capture,download", (props, name, value) => {
  // OVERLOADED_BOOLEAN
  props[name] = value === "" || value === attr || value;
});

addHandler(
  // NUMERIC
  "rowspan=rowSpan,start" +
    // POSITIVE_NUMERIC
    "cols,rows,size,span",
  (props, name, value) => {
    if (numericValue.test(value)) {
      props[name] = parseFloat(value);
    } else {
      props[name] = value;
    }
  }
);

// Attributes to include as-is.
const customAttribute = /^(data|aria)-/;
// Numeric value (potentially with decimal) strings.
const numericValue = /^\s*[+-]?(\d+\.?\d*|\.\d+)\s*$/;
// Style properties to include as-is.
const okStyleProperty = /^(--|[^-]+$)/;

function parseStyleAttribute(string) {
  const style = {};
  if (string) {
    try {
      styleToObject(string, (property, value) => {
        if (property && value) {
          const key = okStyleProperty.test(property)
            ? property
            : camelCase(property);
          style[key] = value;
        }
      });
    } catch (err) {
      // Invalid syntax; don't throw, instead return empty styles.
    }
  }
  return style;
}

export function attrsToProps(attrs) {
  const props = {};

  for (const attr in attrs) {
    const value = attrs[attr];
    if (customAttribute.test(attr)) {
      props[attr] = value;
    } else {
      const handler = attrHandlers[attr] || defaultHandler;
      handler(props, attr, value);
    }
  }

  return props;
}
