'use strict'

const intersectKeys = require('./intersectKeys')
const resolveProcessingFunction = require('./resolveProcessingFunction')

module.exports = function PostHTMLContent (options) {
  return function content (options, nodes) {
    const promises = []

    nodes.map((node) => {
      if (typeof node !== 'object') return

      if (options[node.tag]) {
        const option = node.tag
        resolveProcessingFunction(options[option], node, promises)
      }

      if (node.attrs) {
        const option = intersectKeys(options, node.attrs)[0]
        delete node.attrs[option]
        resolveProcessingFunction(options[option], node, promises)
      }

      const next = content(options, node.content)
      next instanceof Promise ? promises.push(next) : next
    })

    return promises.length ? Promise.all(promises).then(function () {
      return nodes
    }) : nodes
  }.bind(null, options)
}
