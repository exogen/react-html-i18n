# react-html-i18n

- ICU message format.
- Values can be React elements.
- Full HTML support (including attributes).
- Custom formatters.
- Custom HTML tags and tag overrides.
- Server-side rendering (SSR) compatible.
- Fast and relatively lightweight!

## Install

```console
$ yarn add react-html-i18n
```

```console
$ npm install react-html-i18n
```

## Motivation

No other translation library (that I’m aware of) supports both HTML in
translations and React elements in variable substitutions.

Some libraries support custom tags, like this:

```html
Hello, <tag>{name}</tag>.
```

However, it’s not actually HTML, as translators can’t add attributes, and each
tag must have its behavior defined by the library consumer. (What if the
translator wants to define the `href` of a link, or add `style` to an element?)
If you have an existing collection of translation strings containing HTML,
you’re out of luck with most i18n libraries. At best, the ones that support HTML
only allow substitution of primitive values.

This library supports substitution of any value that React can render – like
React elements!
