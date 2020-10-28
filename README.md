# react-html-i18n

<div align="center">

**[Demo!](https://exogen.github.io/react-html-i18n/)**

</div>

- [ICU message format](https://unicode-org.github.io/icu/userguide/format_parse/messages/).
- Argument values can be React elements.
- Full HTML support (including attributes).
- Custom argument formatters.
- Custom HTML tags and tag overrides.
- Server-side rendering (SSR) compatible.
- Fast and [lightweight](https://bundlephobia.com/result?p=react-html-i18n)!

## Install

```console
$ yarn add react-html-i18n
```

```console
$ npm install react-html-i18n
```

## Motivation

No other translation library (that I’m aware of) supports both HTML and React
elements in the same message.

Some libraries support custom tags, like this:

```html
Hello, <tag>{name}</tag>.
```

However, it’s not really HTML, as translators can’t add attributes, and each tag
must have its behavior defined by the programmer. If you only need basic rich
text features like bold and italics, that might be good enough. But what if the
translator wants to control the `href` of a link, or add inline `style` to an
element?

If you have an existing collection of translation strings containing HTML,
you’re out of luck with most i18n libraries. At best, the ones that support HTML
(like old versions of `react-intl`) only allow substitution of primitive values.
This library supports substitution of any value that React can render –
including React elements!
