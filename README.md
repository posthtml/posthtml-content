[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![code style][style]][style-url]
[![chat][chat]][chat-url]

<div align="center">
  <a href="https://github.com/posthtml/posthtml">
    <img width="220" height="200" title="PosHTML"           src="http://posthtml.github.io/posthtml/logo.svg">
  </a>
  <h1>Content Plugin</h1>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D posthtml-content
```

<h2 align="center">Usage</h2>

Add an attribute of your choosing to an element that has contents you want to transform.

```html
<p txt>Please use Windows 98</p>
```

```js
const content = require('posthtml-content')

const options = { txt: (str) => str.replace(/Windows/g, 'winDOGE') }

posthtml([ content(options) ])
  .process(html)
  .then((result) => result.html)
```

```html
<p>Please use WinDOGE 98</p>
```

Now pass in an object to `posthtml-content`. Each object property represents an attribute that will be searched for in the HTML. The value is a function that will get that element's contents as a string, and replace the contents with whatever string is returned from the function.

The custom attribute will be removed from the element and its contents are replaced with your transformed version.

You can use any external library (e.g PostCSS, Babel, Marked) within the transform function. Just make sure you are passing in a function that takes a string and returns a string. You might have to wrap the library function if it doesn't behave like this, but it will work with anything that transforms content.

It also possible to load contents from an external file, which gets transformed and applied as the elements content.

```html
<article txt="lorem.txt"></article>
```

```js
const content = require('posthtml-content')

const options = { txt: (file) => file.toUpperCase() }

posthtml([ content(options) ])
  .process(html)
  .then((result) => result.html)
```

```html
<artcile>LOREM IPSUM DOLOR SIT AMET,...</article>
```

<h2 align="center">Examples</h2>

### Markdown

```html
<p md>Wow, it's **Markdown**!</p>
```

```js
const marked = require('marked')
const content = require('posthtml-content')

const options = { md: (md) => marked.render(md) }

posthtml([ content(options) ])
  .process(html)
  .then((result) => result.html)
```

```html
<p>Wow, it's <strong>Markdown</strong>!</p>
```

### PostCSS

```html
<style postcss>
  .test
    text-transform: uppercase;

    &__hello
      color: red;

    &__world
      color: blue;
</style>
```

```js
const postcss = require('postcss')

const content = require('posthtml-content')

const options = {
  css: (css) => {
    const plugins = [ require('postcss-nested')() ]
    const options = { parser: require('sugarss'), map: false }

    return postcss(plugins).process(css, options).css
  }
}

posthtml([ content(options) ])
  .process(html)
  .then((result) => result.html)
```

```html
<style>
  .test {
    text-transform: uppercase;
  }

  .test__hello {
    color: red;
  }

  .test__world {
    color: blue;
  }
</style>
```

### Babel

```html
<script babel>
  const hello = 'Hello World!'

  let greeter = {
    greet (msg) { alert (msg) }
  }

  greeter.greet(hello)
</script>
```

```js
const babel = require('babel-core')

const content = require('posthtml-content')

const options = {
  babel: (js) => {
    const options = { presets: [ "es2015" ], sourceMaps: false }

    return babel.transform(js, options).code
  }
}

posthtml([ content(options) ])
  .process(html)
  .then((result) => result.html)
```

```html
<script>
  'use strict';

  var hello = "Hello World!";

  var greeter = {
    greet: function greet (msg) {
      alert(msg);
    };
  };

  greeter.greet(hello);
</script>
```

### Async

```html
<style postcss>
  .test
    text-transform: uppercase;

    &__hello
      color: red;

    &__world
      color: blue;
</style>
```

```js
const postcss = require('postcss')

const content = require('posthtml-content')

const options = {
  css: (css) => {
    const plugins = [ require('postcss-nested')() ]
    const options = { parser: require('sugarss'), map: false }

    return postcss(plugins)
      .process(css, options)
      .then((result) => result.css)
  }
}

posthtml([ content(options) ])
  .process(html)
  .then((result) => result.html)
```

```html
<style>
  .test {
    text-transform: uppercase;
  }

  .test__hello {
    color: red;
  }

  .test__world {
    color: blue;
  }
</style>
```

<h2 align="center">Maintainer</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150 height="150"
        src="https://github.com/michael-ciniawsky.png?v=3&s=150">
        <br>
        <a href="https://github.com/michael-ciniawsky">Michael Ciniawsky</a>
      </td>
    </tr>
  <tbody>
</table>

<h2 align="center">Contributors</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150 height="150"
        src="https://github.com/jescalan.png?v=3&s=150">
        <br>
        <a href="https://github.com/jescalan">Jeff Escalante</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/posthtml-content.svg
[npm-url]: https://npmjs.com/package/posthtml-content

[node]: https://img.shields.io/node/v/posthtml-content.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/posthtml/posthtml-content.svg
[deps-url]: https://david-dm.org/posthtml/posthtml-content

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[tests]: http://img.shields.io/travis/posthtml/posthtml-content.svg
[tests-url]: https://travis-ci.org/posthtml/posthtml-content

[cover]: https://coveralls.io/repos/github/posthtml/posthtml-content/badge.svg
[cover-url]: https://coveralls.io/github/posthtml/posthtml-content

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[chat]: https://badges.gitter.im/posthtml/posthtml.svg
[chat-url]: https://gitter.im/posthtml/posthtml
