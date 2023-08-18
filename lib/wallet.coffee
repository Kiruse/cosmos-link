KeplrWallet   = require './wallet/keplr.coffee'
LeapWallet    = require './wallet/leap.coffee'
StationWallet = require './wallet/station.coffee'

exports.wallet = byType = (type) ->
  switch type?.toLowerCase()
    when 'keplr' then new KeplrWallet()
    # when 'leap' then new LeapWallet()
    # when 'station' then new StationWallet()
    # when 'connect'
    #   new require('./wallet/connect.coffee')
    else
      throw new Error "Unsupported wallet type: #{type}"

exports.detect = ->
  keplr:   'keplr' of window
  leap:    'leap'  of window
  station: false # currently not supported

exports.connect = (type, chainId) ->
  byType(type).connect(chainId)
