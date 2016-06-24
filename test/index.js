const fs = require('fs')
const path = require('path')
const test = require('ava')
const posthtml = require('posthtml')
const markdown = require('markdown-it')
const content = require('..')
const fixtures = path.join(__dirname, 'fixtures')

test('basic', (t) => {
  const html = fs.readFileSync(path.join(fixtures, 'basic.html'))
  const plugins = [content({ custom: () => 'foo' })]

  posthtml(plugins)
    .process(html)
    .then((res) => res.html)
    .then((html) => {
      t.regex(/<p>foo<\/p>/, html)
    })
})

test('markdown', (t) => {
  const md = markdown()
  const html = fs.readFileSync(path.join(fixtures, 'markdown.html'))
  const plugins = [content({ md: md.renderInline.bind(md) })]

  posthtml(plugins)
    .process(html)
    .then((res) => res.html)
    .then((html) => {
      t.regex(/<p>much <strong>markdown<\/strong><\/p>/, html)
    })
})
