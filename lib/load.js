'use strict'

const cache = require('read-cache')

module.exports = {
  sync: (file) => cache.sync(file, 'utf8'),
  async: (file) => cache(file, 'utf8')
}
