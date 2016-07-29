const test = require('ava')
const {join} = require('path')
const {readFileSync} = require('fs')
const posthtml = require('posthtml')
const content = require('..')

const getFixture = (file) => readFileSync(join(__dirname, 'fixtures', file), 'utf8')

test('plain text', (t) => {
  const html = getFixture('txt.html')

  return posthtml({ plugins: content({ txt: () => 'Lorem' }) })
    .process(html)
    .then((res) => { t.truthy((/<p>Lorem<\/p>/).exec(res.output())) })
})

test('Strings ES2015', (t) => {
  const html = getFixture('es6.html')
  const text = 'exercitation'
  const plugin = content({
    es6: () => `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ${text.toUpperCase()}.`
  })

  return posthtml({ plugins: plugin })
    .process(html)
    .then((res) => {
      t.truthy((/<article>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud EXERCITATION.<\/article>/).exec(res.output()))
    })
})

test('markdown', (t) => {
  const html = getFixture('md.html')
  const markdown = require('markdown-it')()
  const plugin = content({
    md: (ctx) => markdown.renderInline(ctx)
  })

  return posthtml({ plugins: plugin })
    .process(html)
    .then((res) => {
      t.truthy((/<h1><strong>Markdown<\/strong><\/h1>\n\s\s\s\s<article>Markdown is an <strong>easy<\/strong> to <em>learn<\/em> and <em>write<\/em> language. If you want to learn more about it checkout the following link: <a href="https:\/\/github.com\/markdown-it\/markdown-it">Markdown<\/a><\/article>/).exec(res.output()))
    })
})

test('postcss', (t) => {
  const html = getFixture('style.html')
  const postcss = require('postcss')([ require('postcss-nested')() ])
  const options = { map: false }
  const plugin = content({
    postcss: (ctx) => postcss.process(ctx, options).css
  })

  return posthtml({ plugins: plugin })
    .process(html)
    .then((res) => {
      t.truthy((/<style>\s*\.test\s{\s*text-transform:\suppercase;\s*}\s*\.test__hello\s{\s*color:\sred;\s*}\n\.test__world\s{\s*color:\sblue;\s*}\s*<\/style>/).exec(res.output()))
    })
})

test('babel', (t) => {
  const html = getFixture('script.html')
  const babel = require('babel-core')
  const options = { presets: ['es2015'], compact: false, sourceMaps: false }
  const plugin = content({
    babel: (ctx) => babel.transform(ctx, options).code
  })

  return posthtml({ plugins: plugin })
    .process(html)
    .then((res) => {
      t.truthy((/<script>'use\sstrict';\n\nvar\shello\s=\s'Hello!';\nvar\sperson\s=\s{\s*greeting:\sfunction\sgreeting\(txt\)\s{\s*console\.log\(text\);\s*}\n};\nperson\.greeting\(hello\);<\/script>/).exec(res.output()))
    })
})

test('async promise', (t) => {
  const html = getFixture('style.html')
  const postcss = require('postcss')([ require('postcss-nested')() ])
  const options = { map: false }
  const plugin = content({
    postcss: (ctx, callback) => {
      return postcss.process(ctx, options).then((res) => res.css)
    }
  })

  return posthtml({ plugins: plugin })
    .process(html)
    .then((res) => {
      t.truthy((/<style>\s*\.test\s{\s*text-transform:\suppercase;\s*}\s*\.test__hello\s{\s*color:\sred;\s*}\n\.test__world\s{\s*color:\sblue;\s*}\s*<\/style>/).exec(res.output()))
    })
})
