const W = require('when')
const intersectKeys = require('./intersectKeys')

function walk (options, tree, ctx) {
  return W.all(tree.map((node) => {
    // bottom-up recurse
    if (node.type === 'tag' && node.content) {
      walk(options, node.content, ctx)
    }

    // We're only looking for tags here
    if (node.type !== 'tag') return node

    // Also only looking for tags with attributes
    if (node.attrs) {
      // This function cross-checks to see if any of the attribute keys match
      // any of the keys in the user config.
      const opt = intersectKeys(options, node.attrs)[0]

      if (opt) {
        // If it does, remove the attribute from the tag, it's just a marker
        delete node.attrs[opt]
        // Now for each entry in the node's content, we run the user-provided
        // function, which can be a promise or not. We take the results and
        // assign them back to the node, then return the modified node
        return W.map(node.content, (c) => options[opt](c.content))
          .then((res) => {
            node.content = {
              type: 'text',
              content: res.join(''),
              location: node.location
            }
            return node
          })
      }

      // If we don't match any attribute keys, return the node as usual
      return node
    }
  }))
}

module.exports = function PostHTMLContent (options = {}) {
  return walk.bind(null, options)
}
