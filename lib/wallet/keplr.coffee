{DEFAULT_CHAINID} = require '@/lib/helpers'
{getLoginMessage} = require '@common'

module.exports = class KeplrWallet
  connect: (chainId = DEFAULT_CHAINID) -> await window.keplr.enable chainId
  address: (chainId = DEFAULT_CHAINID) -> (await window.keplr.getKey(chainId)).bech32Address

  signLogin: (chainId = DEFAULT_CHAINID) ->
    {algo, bech32Address: addr, pubKey} = await window.keplr.getKey chainId
    {signature: sig} = await signArbitrary chainId, getLoginMessage(addr)
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
