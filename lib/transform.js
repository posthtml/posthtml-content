'use strict'

module.exports = function transform (fn) {
  if (fn.then) {
    return Promise.resolve(fn)
  }

  return new Promise((resolve) => {
    return resolve(fn)
  })
}
