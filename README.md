# PostHTML Content <img align="right" width="220" height="200" title="PostHTML logo" src="https://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm-shield]][npm-url]
[![Build][github-ci-shield]][github-ci-url]
[![Downloads][npm-stats-shield]][npm-stats-url]
[![License][license-shield]][license-url]

Flexible content transform for PostHTML.

> **Note:** This project is in early development, and versioning is a little different. [Read this](https://semver.org/#spec-item-4) for more details.

## Why Should You Care?

Rather than having a separate plugin for each kind of content transform you want to be able to do, why not just have one? Parse natural language, markdown, or whatever else you want with a minimalistic and simple interface 🍻

## Installation

```bash
npm i posthtml-content --save
```

> **Note:** This project is compatible with node v12+ only

## Usage

Start with some HTML you want to transform in some way. Add an attribute of your choosing to an element that has contents you want to transform.

```html
<p windoge>Please use windows 98</p>
```

Now pass in an object to `posthtml-content`.

Each key in the object represents an attribute that will be searched for in the HTML. The value is a function that will receive that element's contents as a string, and will replace them with whatever string is returned from the function.

```js
const content = require('posthtml-content')({
  windoge: (str) => str.replace(/windows/g, 'winDOGE')
})

posthtml([plugin]).process(html)
```

The plugin will remove the custom attribute from the element and replace its contents with your transformed version.

```html
<p>Please use winDOGE 98</p>
```

If you return an [A+ compliant promise](https://promisesaplus.com/) from your content function, it will resolve and work in your templates as well.

You can use external libraries for this as well, no problem. Just make sure you are passing in a function that takes a string and returns a string. You might have to wrap the library function if it doesn't behave like this, but it will work with anything that transforms content.

## Examples

### Markdown

```html
<p md>Wow, it's **Markdown**!</p>
```

```js
const markdown = require('markdown-it')(/* options */)

const plugin = require('posthtml-content')({
  md: (md) => markdown.renderInline(md)
})

const {html} = await posthtml([plugin]).process(html)
```

Result:

```html
<p>Wow, it's <strong>Markdown</strong>!</p>
```

### PostCSS

```postcss
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
const postcss = require('postcss')([ require('postcss-nested') ])

const plugin = require('posthtml-content')({
  postcss: css => postcss.process(css).css
})

const {html} = await posthtml([plugin]).process(html)
```

Result:

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
    greet(msg) { alert (msg) }
  }
  greeter.greet(hello)
</script>
```

```js
const babel = require('babel-core')
const options = { presets: ["es2015"], sourceMaps: false }

const plugin = require('posthtml-content')({
  babel: js => babel.transform(js, options).code
})

const {html} = await posthtml([plugin]).process(html)
```

Result:

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

### Return a Promise

```postcss
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
const postcss = require('postcss')([ require('postcss-nested') ])

const plugin = require('posthtml-content')({
  postcss: css => {
    return postcss.process(css).then(res => res.css)
  }
})

const {html} = await posthtml([plugin]).process(html)
```

## License

`posthtml-content` is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Contributing

See [contributing.md](contributing.md) for details on running tests and contributing.

[npm-url]: https://npmjs.com/package/posthtml-content
[npm-shield]: https://img.shields.io/npm/v/posthtml-content.svg

[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-content.svg
[npm-stats-url]: https://npm-stat.com/charts.html?package=posthtml-content&from=2016-06-25

[github-ci-url]: https://github.com/posthtml/posthtml-content/actions
[github-ci-shield]: https://github.com/posthtml/posthtml-content/actions/workflows/nodejs.yml/badge.svg

[license-url]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-content.svg
