/**
 * @param  {Function} fn       [user's processing function]
 * @param  {Object}   node     [posthtml node object]
 * @param  {Array}    promises [array of promises to push a Promise if function is async (!mutable)]
 * @return {void}
 */
module.exports = function resolveProcessingFunction (fn, node, promises) {
  if (fn.length === 2) {
    promises.push(new Promise((resolve) => fn(node.content[0], (result) => resolve(node.content = [result]))))
  } else {
    const f = fn(node.content[0])

    if (f instanceof Promise) {
      promises.push(f.then((result) => (node.content = [result])))
    } else {
      node.content = [f]
    }
  }
}
