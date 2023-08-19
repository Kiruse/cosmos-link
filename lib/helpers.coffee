rng = require 'seedrandom'

exports.DEFAULT_CHAINID = 'phoenix-1'

exports.getCode = ->
  period = Math.floor(Date.now() / 60000)
  rnd = rng("R#{period}", { entropy: false })
  return rnd().toString(36).toUpperCase().slice(2, 10)
