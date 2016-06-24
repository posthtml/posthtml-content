function walk (options, nodes) {
  nodes.map((node) => {
    if (typeof node !== 'object') return
    if (node.attrs) {
      const opt = intersectKeys(options, node.attrs)[0]
      delete node.attrs[opt]
      node.content = [options[opt](node.content[0])]
    }
    walk(options, node.content)
  })
}

// helper: because it's very fast and doesnt need a dependency
function intersectKeys (_a, _b) {
  let ai = 0
  let bi = 0
  let a = Object.keys(_a)
  let b = Object.keys(_b)
  const result = []

  while (ai < a.length && bi < b.length) {
    if (a[ai] < b[bi]) {
      ai++
    } else if (a[ai] > b[bi]) {
      bi++
    } else {
      result.push(a[ai])
      ai++
      bi++
    }
  }
  return result
}

module.exports = (options) => walk.bind(null, options)
