const path = require('path')

const keys = require('./lib/keys')
const load = require('./lib/load')
const transform = require('./lib/transform')

module.exports = (options) => {
  return function posthtmlContent (tree) {
    if (!tree.messages) tree.messages = []

    const dir = tree.options.from
      ? path.dirname(tree.options.from)
      : __dirname

    const contents = []

    tree.walk((node) => {
      if (node.attrs) {
        let option = keys(options, node.attrs)[0]

        if (option) {
          if (tree.options.sync) {
            if (node.attrs[option]) {
              let file = path.resolve(dir, node.attrs[option])

              node.content = [ load.sync(file) ]

              tree.messages.push({ type: 'dependency', file: file })
            }

            node.content = node.content.map((content) => {
              return options[option](content)
            })

            delete node.attrs[option]

            return node
          }

          if (node.attrs[option]) {
            let file = path.resolve(dir, node.attrs[option])

            contents.push(new Promise((resolve) => {
              load.async(file)
                .then((file) => transform(options[option](file)))
                .then((content) => {
                  node.content = [ content ]

                  resolve(node.content)
                })
            }))

            tree.messages.push({ type: 'dependency', file: file })
          }

          contents.push(new Promise((resolve) => {
            node.content.map((content) => {
              transform(options[option](content))
                .then((content) => {
                  node.content = [ content ]

                  resolve(node.content)
                })
            })
          }))

          delete node.attrs[option]

          return node
        }
      }

      return node
    })

    return contents.length > 0 ? Promise.all(contents).then(() => tree) : tree
  }
}
