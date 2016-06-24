# PostHTML Content

[![npm](http://img.shields.io/npm/v/posthtml-content.svg?style=flat)](https://badge.fury.io/js/posthtml-content) [![tests](http://img.shields.io/travis/static-dev/posthtml-content/master.svg?style=flat)](https://travis-ci.org/static-dev/posthtml-content) [![dependencies](http://img.shields.io/david/static-dev/posthtml-content.svg?style=flat)](https://david-dm.org/static-dev/posthtml-content) [![coverage](http://img.shields.io/coveralls/static-dev/posthtml-content.svg?style=flat)](https://coveralls.io/github/static-dev/posthtml-content)

A plugin for [posthtml](https://github.com/posthtml/posthtml) that allows customized content transforms.

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

### Why should you care?

Rather than having a separate plugin for each kind of content transform you want to be able to do, why not just have one? Parse natural language, markdown, or whatever else you want with a minimalistic and simple interface 🍻

### Installation

`npm install posthtml-content -S`

> **Note:** This project is compatible with node v6+ only

### Usage

Start with some html you want to transform in some way. Add an attribute of your choosing to an element that has contents you want to transform.

```html
<p windoge>Please use windows 98</p>
```

Now pass in an object to posthtml-content. Each key in the object represents an attribute that will be searched for in the html. The value is a function that will get that element's contents as a string, and replace the contents with whatever string is returned from the function.

```js
const content = require('posthtml-content')({
  windoge: (str) => str.replace(/windows/g, 'windoge')
})

posthtml([plugin]).process(html)
```

The plugin will remove the custom attribute from the element and replace its contents with your transformed version. Wow!

```html
<p>Please use windoge 98</p>
```

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
