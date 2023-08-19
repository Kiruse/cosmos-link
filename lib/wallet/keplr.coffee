{DEFAULT_CHAINID, getCode} = require '@/lib/helpers'

module.exports = class KeplrWallet
  connect: (chainId = DEFAULT_CHAINID) -> await window.keplr.enable chainId
  address: (chainId = DEFAULT_CHAINID) -> (await window.keplr.getKey(chainId)).bech32Address

  signLogin: (chainId = DEFAULT_CHAINID) ->
    {algo, bech32Address: addr, pubKey} = await window.keplr.getKey chainId
    code = getCode()
    msg = "I certify ownership over wallet #{addr}.\n\nCode: #{code}"
    {signature: sig} = await signArbitrary chainId, msg
    return { algo, addr, pubKey, sig }

signArbitrary = (chainId, msg) ->
  unless chainId and msg
    throw new Error 'chainId and msg are required'
  {bech32Address} = await window.keplr.getKey chainId
  await window.keplr.signArbitrary(
    chainId,
    bech32Address,
    msg,
  )
