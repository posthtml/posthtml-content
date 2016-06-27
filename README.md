[![NPM][npm]][npm-url]
[![Deps][deps]][deps-url]
[![Tests][travis]][travis-url]
[![Coverage][cover]][cover-url]  
[![Standard Code Style][style]][style-url]

<div align="center">
  <a href="https://github.com/posthtml/posthtml">
    <img width="180" height="180"
      src="http://posthtml.github.io/posthtml/logo.svg">
    <strong style="font-size: 48px;">Content</strong>
  </a>
  <p>A plugin for that allows customized content transforms.<p>
</div>

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

## Why?

Rather than having a separate plugin for each kind of content transform you want to be able to do, why not just have one? Parse natural language, markdown, or whatever else you want with a minimalistic and simple interface 🍻

## Install

```bash
npm i -S posthtml-content
```

> **Note:** This project is compatible with node v6+ only

## Usage

Start with some html you want to transform in some way. Add an attribute of your choosing to an element that has contents you want to transform.

```html
<p windoge>Please use windows 98</p>
```

Now pass in an object to posthtml-content. Each key in the object represents an attribute that will be searched for in the html. The value is a function that will get that element's contents as a string, and replace the contents with whatever string is returned from the function.

```js
const content = require('posthtml-content')({
  windoge: (str) => str.replace(/windows/g, 'winDOGE')
})

posthtml([plugin]).process(html)
```

The plugin will remove the custom attribute from the element and replace its contents with your transformed version. Wow!

```html
<p>Please use winDOGE 98</p>
```

You can use external libraries for this as well, no problem. Just make sure you are passing in a function that takes a string and returns a string. You might have to wrap the library function if it doesn't behave like this, but it will work with anything that transforms content.

```html
<p name>Transform me!</p>
```

```js
const transform = require('transform')

const plugin = require('posthtml-content')({
  name: (content) => transform(content)
})

posthtml([plugin]).process(html)
```

```js
const transform = require('transform')

const plugin = require('posthtml-content')({
  name: transform.bind(transform)
})

posthtml([plugin]).process(html)
```

```html
<p>👍</p>
```

## Examples

#### Markdown

```html
<p md>Wow, it's **Markdown**!</p>
```

```js
const markdown = require('markdown-it')(/* options */)

const plugin = require('posthtml-content')({
  md: (md) => markdown.renderInline(md)
})

posthtml([plugin]).process(html)
```

```html
<p>Wow, it's <strong>Markdown</strong>!</p>
```

#### PostCSS

```sugarss
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
const postcss = require('postcss')([ require('postcss-nested')() ])
const options = { parser: require('sugarss'), map: false }

const plugin = require('posthtml-content')({
  postcss: (css) => postcss.process(css, options).css
})

posthtml([plugin]).process(html)

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

#### Babel

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
const options = { presets: ["es2015"], sourceMaps: false }

const plugin = require('posthtml-content')({
  babel: (js) => babel.transform(js, options).code
})

posthtml([plugin]).process(html)
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

## LICENSE & CONTRIBUTING

- Details on the license [can be found here](LICENSE)
- Details on running tests and contributing [can be found here](CONTRIBUTING.md)

[npm]: https://img.shields.io/npm/v/posthtml-content.svg
[npm-url]: https://npmjs.com/package/posthtml-content

[node]: https://img.shields.io/node/v/gh-badges.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/static-dev/posthtml-content.svg
[deps-url]: https://david-dm.org/static-dev/posthtml-content

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[travis]: http://img.shields.io/travis/static-dev/posthtml-content.svg
[travis-url]: https://travis-ci.org/static-dev/posthtml-content

[cover]: https://coveralls.io/repos/github/static-dev/posthtml-content/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/static-dev/posthtml-content?branch=master

[license]: https://img.shields.io/github/license/static-dev/posthtml-content.svg
[license-url]: https://raw.githubusercontent.com/static-dev/posthtml-content/master/LICENSE
