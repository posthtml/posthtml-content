const W = require('when')
const intersectKeys = require('./intersect-keys.js')

const tasks = []
const contentNodes = []

function walk(options, nodes) {
  return nodes.forEach(node => {
    // Only looking for tags with attributes
    if (node.attrs) {
      // This function cross-checks to see if any of the attribute keys match
      // any of the keys in the user config.
      const opt = intersectKeys(options, node.attrs)[0]

      if (opt) {
        const attribute = node.attrs[opt]
        // If it does, remove the attribute from the tag, it's just a marker
        delete node.attrs[opt]
        // Now for each entry in the node's content, we run the user-provided
        // function, which can be a promise or not. We take the results and
        // assign them back to the node, then return the modified node
        contentNodes.push(node)

        node.content.map((content, index) => {
          return tasks.push(new Promise(resolve => {
            resolve(options[opt](content, attribute, index))
          }))
        })
      }
    }

    // Now we recurse through the nested content if content exists
    if (node.content) {
      walk(options, node.content)
    }
  })
}

// Options passed in by user
module.exports = options => {
  // Nodes passed from PostHTML
  return nodes => {
    walk(options, nodes)

    return W.map(tasks, (content, index) => {
      contentNodes[index].content = content
    }).then(() => nodes)
  }
}
