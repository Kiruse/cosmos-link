rng = require 'seedrandom'

exports.DEFAULT_CHAINID = 'phoenix-1'

exports.getCode = ->
  period = Math.floor(Date.now() / 60000)
  rnd = rng("R#{period}", { entropy: false })
  return rnd().toString(36).toUpperCase().slice(2, 10)

exports.login = (wallet) ->
  payload = await wallet.signLogin()
  response = await fetch '/api/token',
    method: 'POST'
    headers:
      'Content-Type': 'application/json'
    body: JSON.stringify payload

  unless response.ok
    throw new RequestError response, "Login failed"
  if response.headers.get 'Content-Type' isnt 'application/json'
    throw Error("Unexpected response type: #{response.headers.get 'Content-Type'}")
  return await response.json()

exports.RequestError = class RequestError extends Error
  constructor: (response, message) ->
    super(message)
    @name = "RequestError #{response.status}"
    @response = response
    @status = response.status
