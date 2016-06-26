// --------------------------------
// #POSTHTML - CONTENT
// ------------------------------------

'use strict'

const intersectKeys = require('./intersectKeys')

module.exports = function PostHTMLContent (options) {
  return function content (options, nodes) {
    nodes.map((node) => {
      if (typeof node !== 'object') return

      if (options[node.tag]) {
        const option = node.tag
        node.content = [options[option](node.content[0])]
      }

      if (node.attrs) {
        const option = intersectKeys(options, node.attrs)[0]
        delete node.attrs[option]
        node.content = [options[option](node.content[0])]
      }

      content(options, node.content)
    })
  }.bind(null, options)
}
