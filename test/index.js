const {readFileSync} = require('fs')
const {join} = require('path')
const test = require('ava')
const posthtml = require('posthtml')
const plugin = require('..')

const getFixture = file => readFileSync(join(__dirname, 'fixtures', file), 'utf8')

test('Text', async t => {
  const fixture = getFixture('text.html')
  const plugins = [plugin({
    'replace-with-lorem': () => 'Lorem',
    ceil: content => Math.ceil(Number.parseFloat(content)),
  })]

  const {html} = await posthtml(plugins).process(fixture)

  t.truthy((/<p>Lorem<\/p>/).exec(html))
  t.truthy((/<div>2<\/div>/).exec(html))
})

test('Attr', async t => {
  const fixture = getFixture('attr.html')
  const plugins = [plugin({text: (content, attribute) => content + attribute})]

  const {html} = await posthtml(plugins).process(fixture)

  t.is(html.replaceAll(/\s+/g, '').trim(), '<p>Textfromattr.<span>withtextfromattr.</span>fromattr.</p>')
})

test('As-is', async t => {
  const fixture = getFixture('attr.html')
  const plugins = [plugin({text: 'as is'})]

  const {html} = await posthtml(plugins).process(fixture)

  t.is(html.replaceAll(/\s+/g, '').trim(), '<p>Text<span>withtext</span></p>')
})

test('Nested', async t => {
  const fixture = getFixture('nested.html')
  const plugins = [plugin({uppercase: content => content.toUpperCase()})]

  const {html} = await posthtml(plugins).process(fixture)

  t.is(html.replaceAll(/\s+/g, '').trim(), '<div>SOME<br><span>TEXT</span></div>')
})

test('Order keys', async t => {
  const fixture = getFixture('order-keys.html')
  const plugins = [plugin({
    z: s => s.replace(/foo/g, 'foo bar Z'),
    a: s => s.replace(/foo/g, 'foo bar A')
  })]

  const {html} = await posthtml(plugins).process(fixture)

  t.truthy((/<div>Here's some foo bar Z<\/div>/).exec(html))
  t.truthy((/<div>Here's some foo bar A<\/div>/).exec(html))
})

test('Strings ES2015', async t => {
  const fixture = getFixture('es6.html')
  const text = 'exercitation'
  const plugins = [plugin({
    es6: () => `Lorem ipsum dolor sit ${text.toUpperCase()}.`
  })]

  const {html} = await posthtml(plugins).process(fixture)

  t.truthy((/<article>Lorem ipsum dolor sit EXERCITATION.<\/article>/).exec(html))
})

test('Markdown', async t => {
  const fixture = getFixture('markdown.html')
  const markdown = require('markdown-it')()
  const plugins = [plugin({
    md: s => markdown.renderInline(s)
  })]

  const {html} = await posthtml(plugins).process(fixture)

  t.truthy((/<p>much <strong>markdown<\/strong><\/p>/).exec(html))
})

test('PostCSS', async t => {
  const fixture = getFixture('style.html')
  const postcss = require('postcss')([
    require('postcss-nested')
  ])

  const plugins = [
    plugin({
      postcss: ctx => postcss.process(ctx).css
    })
  ]

  const {html} = await posthtml(plugins).process(fixture)

  t.truthy((/.test__hello\s{\s*color:\sred;\s*}/).exec(html))
  t.truthy((/.test__world\s{\s*color:\sblue;\s*}/).exec(html))
})

test('Babel', async t => {
  const fixture = getFixture('script.html')
  const babel = require('babel-core')
  const options = {
    presets: ['es2015'],
    compact: false,
    sourceMaps: false
  }
  const plugins = [
    plugin({
      babel: ctx => babel.transform(ctx, options).code
    })
  ]

  const {html} = await posthtml(plugins).process(fixture)

  t.truthy((/<script>'use\sstrict';\n\nvar\shello\s=\s'Hello!';\nvar\sperson\s=\s{\s*greeting:\sfunction\sgreeting\(txt\)\s{\s*console\.log\(text\);\s*}\n};\nperson\.greeting\(hello\);<\/script>/).exec(html))
})

test('Async promise', async t => {
  const fixture = getFixture('style.html')
  const postcss = require('postcss')([
    require('postcss-nested')
  ])
  const plugins = [
    plugin({
      postcss: ctx => postcss.process(ctx, {from: undefined}).then(({css}) => css)
    })
  ]

  const {html} = await posthtml(plugins).process(fixture)

  t.truthy((/.test__hello\s{\s*color:\sred;\s*}/).exec(html))
  t.truthy((/.test__world\s{\s*color:\sblue;\s*}/).exec(html))
})
