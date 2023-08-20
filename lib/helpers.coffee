{ testTokenID } = require '@common'

exports.DEFAULT_CHAINID = 'phoenix-1'

# see https://stackoverflow.com/a/66046176
exports.toBase64 = toBase64 = (u8a) ->
  url = await new Promise (resolve) ->
    reader = new FileReader()
    reader.onload = -> resolve reader.result
    reader.readAsDataURL new Blob([u8a])
  url.slice url.indexOf(',') + 1

exports.getQueryParam = (name) ->
  [, value] = (window.location.search ? '')
    .slice 1
    .split '&'
    .map (param) => param.split('=', 2).map(decodeURIComponent)
    .find((param) -> param[0] is name) ? []
  value

exports.getTokenID = ->
  adjectives = require('@/assets/wordlists/adjectives.txt').default.split('\n').map((w) => w.trim()).filter(Boolean)
  nouns      = require('@/assets/wordlists/nouns.txt').default.split('\n').map((w) => w.trim()).filter(Boolean)
  unless adjectives.length and nouns.length
    throw Error "Empty wordlists"

  adj  = adjectives[Math.floor(Math.random() * adjectives.length)]
  noun = nouns[Math.floor(Math.random() * nouns.length)]
  num  = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  "#{adj} #{noun} #{num}"

exports.login = (tid, wallet) ->
  unless testTokenID tid
    throw Error "Invalid token ID: #{tid}"

  payload = await wallet.signLogin()
  payload.pubKey = await toBase64 payload.pubKey
  response = await fetch '/api/token',
    method: 'POST'
    headers:
      'Content-Type': 'application/json'
    body: JSON.stringify {payload..., tid}

  unless response.ok
    reason = await response.text()
    throw new RequestError response, reason
  if response.headers.get 'Content-Type' isnt 'application/json'
    throw Error("Unexpected response type: #{response.headers.get 'Content-Type'}")
  return await response.text() # JWT

exports.RequestError = class RequestError extends Error
  constructor: (response, message) ->
    super(RequestError.getMessage response.status, message)
    @name = "RequestError #{response.status}"
    @response = response
    @status = response.status

  @getMessage: (status, message) ->
    return message if message
    switch status
      when 401 then 'Signature verification failed'
      when 403 then 'Access forbidden'
      when 404 then 'Not found'
      when 500 then 'Internal server error'
      else 'Unknown error'
