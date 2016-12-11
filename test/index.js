const test = require('ava')

const join = require('path').join
const read = require('fs').readFileSync

const posthtml = require('posthtml')
const plugin = require('../')

const fixture = (file) => read(join(__dirname, 'fixtures', file), 'utf8')
const expect = (file) => read(join(__dirname, 'expect', file), 'utf8')

test('Sync', (t) => {
  const plugins = [ plugin({ txt: () => 'Lorem' }) ]

  const html = posthtml(plugins)
    .process(
      fixture('file.html'), { sync: true, from: 'test/fixtures/file.html' }
    )
    .html

  return t.is(html, expect('sync.html'))
})

test('Sync Load', (t) => {
  const plugins = [ plugin({ txt: (content) => content.toUpperCase() }) ]

  const html = posthtml(plugins)
    .process(
      fixture('file.html'), { sync: true, from: 'test/fixtures/file.html' }
    )
    .html

  const tree = posthtml(plugins)
    .process(
      fixture('file.html'), { sync: true, from: 'test/fixtures/file.html' }
    )
    .tree

  t.is(html, expect('sync_load.html'))
  t.is(JSON.stringify(tree.messages), expect('messages.json'))

  return
})

test('Sync Transform', (t) => {
  const plugins = [ plugin({ txt: (content) => content.toUpperCase() }) ]

  const html = posthtml(plugins)
    .process(
      fixture('file.html'), { sync: true, from: 'test/fixtures/file.html' }
    )
    .html

  return t.is(html, expect('sync_transform.html'))
})

test('Async', (t) => {
  const plugins = [ plugin({ txt: () => 'Lorem' }) ]

  return posthtml(plugins)
    .process(fixture('file.html'), { from: 'test/fixtures/file.html' })
    .then((result) => t.is(result.html, expect('async.html')))
})

test('Async Load', (t) => {
  const plugins = [ plugin({ txt: (content) => content.toUpperCase() }) ]

  return posthtml(plugins)
    .process(fixture('file.html'), { from: 'test/fixtures/file.html' })
    .then((result) => {
      t.is(JSON.stringify(result.tree.messages), expect('messages.json'))
      t.is(result.html, expect('async_load.html'))
    })
})

test('Async Transform', (t) => {
  const postcss = require('postcss')([ require('postcss-nested')() ])

  const plugins = [
    plugin({
      postcss: (css) => {
        return postcss
          .process(css, { map: false })
          .then((result) => result.css)
      }
    })
  ]

  return posthtml(plugins)
    .process(fixture('transform.html'), { from: 'test/fixtures/transform.html' })
    .then((result) => t.is(result.html, expect('async_transform.html')))
})
