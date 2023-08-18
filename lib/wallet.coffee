exports.wallet = (type) ->
  switch type?.toLowerCase()
    when 'keplr'
      new require('./wallet/keplr.coffee')
    # when 'leap'
    #   new require('./wallet/leap.coffee')
    # when 'station'
    #   new require('./wallet/station.coffee')
    # when 'connect'
    #   new require('./wallet/connect.coffee')
    else
      throw new Error "Unsupported wallet type: #{type}"

exports.detect = ->
  keplr:   'keplr' of window
  leap:    'leap'  of window
  station: false # currently not supported
  connect: false # currently not supported
