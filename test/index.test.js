import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { test, expect } from 'vitest'
import posthtml from 'posthtml'
import plugin from '../lib/index.js'
import markdown from 'markdown-it'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import babel from 'babel-core'

const __dirname = dirname(fileURLToPath(import.meta.url))

const getFixture = file => readFileSync(join(__dirname, 'fixtures', file), 'utf8')

test('Text', async () => {
  const fixture = getFixture('text.html')
  const plugins = [plugin({
    'replace-with-lorem': () => 'Lorem',
    ceil: content => Math.ceil(Number.parseFloat(content)),
  })]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html).toContain('<p>Lorem</p>')
  expect(html).toContain('<div>2</div>')
})

test('Attr', async () => {
  const fixture = getFixture('attr.html')
  const plugins = [plugin({text: (content, attribute) => content + attribute})]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html).toBe('<p>\n  Text\n   from attr.<span>with text from attr.</span>\n from attr.</p>\n')
})

test('As-is', async () => {
  const fixture = getFixture('attr.html')
  const plugins = [plugin({text: 'as is'})]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html).toBe('<p>\n  Text\n  <span>with text</span>\n</p>\n')
})

test('Nested', async () => {
  const fixture = getFixture('nested.html')
  const plugins = [plugin({uppercase: content => content.toUpperCase()})]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html).toBe('<div>\n  SOME\n  <br>\n  <span>TEXT</span>\n</div>\n')
})

test('Order keys', async () => {
  const fixture = getFixture('order-keys.html')
  const plugins = [plugin({
    z: s => s.replace(/foo/g, 'foo bar Z'),
    a: s => s.replace(/foo/g, 'foo bar A')
  })]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html).toContain('<div>Here\'s some foo bar A</div>')
  expect(html).toContain('<div>Here\'s some foo bar Z</div>')
})

test('Strings ES2015', async () => {
  const fixture = getFixture('es6.html')
  const text = 'exercitation'
  const plugins = [plugin({
    es6: () => `Lorem ipsum dolor sit ${text.toUpperCase()}.`
  })]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html).toContain('<article>Lorem ipsum dolor sit EXERCITATION.</article>')
})

test('Markdown', async () => {
  const fixture = getFixture('markdown.html')
  const md = markdown()
  const plugins = [plugin({
    md: s => md.renderInline(s)
  })]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html).toContain('<p>much <strong>markdown</strong></p>')
})

test('PostCSS', async () => {
  const fixture = getFixture('style.html')

  const plugins = [
    plugin({
      postcss: ctx => postcss([postcssNested]).process(ctx).css
    })
  ]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html.replace(/\s+/g, '').trim()).toContain('.test__hello{color:red;}')
  expect(html.replace(/\s+/g, '').trim()).toContain('.test__world{color:blue;}')
})

test('Babel', async () => {
  const fixture = getFixture('script.html')
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

  expect(html).toContain('greeting: function greeting(txt) {')
})

test('Async promise', async () => {
  const fixture = getFixture('style.html')
  const plugins = [
    plugin({
      postcss: ctx => postcss([postcssNested]).process(ctx, {from: undefined}).then(({css}) => css)
    })
  ]

  const {html} = await posthtml(plugins).process(fixture)

  expect(html.replace(/\s+/g, '').trim()).toContain('.test__hello{color:red;}')

  expect(html.replace(/\s+/g, '').trim()).toContain('.test__world{color:blue;}')
})
