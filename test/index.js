const fs = require('fs')
const path = require('path')
const test = require('ava')
const posthtml = require('posthtml')
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
