<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>PostHTML Content</h1>
  <p>Apply functions to nodes through custom attributes</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![Downloads][npm-stats-shield]][npm-stats]
  [![License][license-shield]][license]
</div>

## About

`posthtml-content` allows you to define functions that map to custom HTML attributes. When the plugin runs, it will search for those attributes and apply the corresponding function to the contents of the node.

## Install

```
npm i posthtml posthtml-content
```

## Usage

Start with some HTML you want to transform in some way. Add an attribute of your choosing to an element that has contents you want to transform. For example:

```html
<p uppercase>posthtml is great</p>
```

Now process your HTML with `posthtml-content`:

```js
import posthtml from'posthtml'
import content from'posthtml-content'

const html = posthtml([
  content({
    // Map your custom attribute to a function that takes and returns a string
    uppercase: str => str.toUpperCase()
  })
])
  .process('<p uppercase>posthtml is great</p>')
  .then(result => result.html)
```

Result:

```html
<p>POSTHTML IS GREAT</p>
```

If you return an [A+ compliant promise](https://promisesaplus.com/) from your content function, it will resolve and work in your templates as well.

You can use external libraries for this as well, no problem. Just make sure you are passing in a function that takes a string and returns a string. You might have to wrap the library function if it doesn't behave like this, but it will work with anything that transforms content.

### Using the attribute's value

You can also access the attribute's value in your function, as the second argument.

```js
import posthtml from'posthtml'
import content from'posthtml-content'

const html = posthtml([
  content({
    append: (content, attrValue) => content + attrValue
  })
])
  .process('<p append=" bar">foo</p>')
  .then(result => result.html)
```

Result:

```html
<p>foo bar</p>
```

## Examples

### Markdown

```html
<p md>Wow, it's **Markdown**!</p>
```

```js
import markdown from 'markdown-it'
import content from 'posthtml-content'

const {html} = await posthtml([
  content({
    md: md => markdown.renderInline(md)
  })
]).process(html)
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
import postcss from 'postcss'
import nested from 'postcss-nested'
import content from 'posthtml-content'

const plugin = content({
  postcss: css => postcss(nested()).process(css).css
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
import babel from 'babel-core'
import content from 'posthtml-content'

const options = {
  presets: ['es2015'],
  sourceMaps: false
}

const plugin = content({
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
import postcss from 'postcss'
import nested from 'postcss-nested'
import content from 'posthtml-content'

const plugin = content({
  postcss: css => {
    return postcss(nested()).process(css).then(res => res.css)
  }
})

const {html} = await posthtml([plugin]).process(html)
```

## License

`posthtml-content` is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

[npm]: https://www.npmjs.com/package/posthtml-content
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-content.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-content
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-content.svg
[github-ci]: https://github.com/posthtml/posthtml-content/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-content/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-content.svg
