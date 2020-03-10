const test = require('ava')
const {join} = require('path')
const {readFileSync} = require('fs')
const posthtml = require('posthtml')
const plugin = require('..')

const getFixture = (file) => readFileSync(join(__dirname, 'fixtures', file), 'utf8')

test('Text', (t) => {
  const html = getFixture('txt.html')
  const plugins = [ plugin({ txt: () => 'Lorem' }) ]

  return posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => { t.truthy((/<p>Lorem<\/p>/).exec(html)) })
})

test('Strings ES2015', (t) => {
  const html = getFixture('es6.html')
  const text = 'exercitation'
  const plugins = [ plugin({
    es6: () => `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ${text.toUpperCase()}.`
  }) ]

  return posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      t.truthy((/<article>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud EXERCITATION.<\/article>/).exec(html))
    })
})

test('Markdown', (t) => {
  const html = getFixture('md.html')
  const markdown = require('markdown-it')()
  const plugins = [ plugin({
    md: (ctx) => markdown.renderInline(ctx)
  }) ]

  return posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      t.truthy((/<h1><strong>Markdown<\/strong><\/h1>\n\s\s\s\s<article>Markdown is an <strong>easy<\/strong> to <em>learn<\/em> and <em>write<\/em> language. If you want to learn more about it checkout the following link: <a href="https:\/\/github.com\/markdown-it\/markdown-it">Markdown<\/a><\/article>/).exec(html))
    })
})

test('PostCSS', (t) => {
  const html = getFixture('style.html')
  const postcss = require('postcss')([ require('postcss-nested')() ])
  const options = { map: false }

  const plugins = [ plugin({
    postcss: (ctx) => postcss.process(ctx, options).css
  }) ]

  return posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      t.truthy((/<style>\s*\.test\s{\s*text-transform:\suppercase;\s*}\s*\.test__hello\s{\s*color:\sred;\s*}\n\.test__world\s{\s*color:\sblue;\s*}\s*<\/style>/).exec(html))
    })
})

test('Babel', (t) => {
  const html = getFixture('script.html')
  const babel = require('babel-core')
  const options = { presets: ['es2015'], compact: false, sourceMaps: false }
  const plugins = [ plugin({
    babel: (ctx) => babel.transform(ctx, options).code
  }) ]

  return posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      t.truthy((/<script>'use\sstrict';\n\nvar\shello\s=\s'Hello!';\nvar\sperson\s=\s{\s*greeting:\sfunction\sgreeting\(txt\)\s{\s*console\.log\(text\);\s*}\n};\nperson\.greeting\(hello\);<\/script>/).exec(html))
    })
})

test('Async promise', (t) => {
  const html = getFixture('style.html')

  const postcss = require('postcss')([ require('postcss-nested')() ])
  const options = { map: false }

  const plugins = [ plugin({
    postcss: (ctx, callback) => {
      return postcss.process(ctx, options).then((res) => res.css)
    }
  }) ]

  return posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      t.truthy((/<style>\s*\.test\s{\s*text-transform:\suppercase;\s*}\s*\.test__hello\s{\s*color:\sred;\s*}\n\.test__world\s{\s*color:\sblue;\s*}\s*<\/style>/).exec(html))
    })
})
