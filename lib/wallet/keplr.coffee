module.exports = class KeplrWallet
  connect: (chainId) -> await window.keplr.enable chainId
  getWallet: (chainId) -> await window.keplr.getKey chainId

  signArbitrary: (msg) ->
    console.log keplr.signArbitrary
    # getAminoSigner().signArbitrary(
    #   'phoenix-1', # exact chainId doesn't matter, but we choose terra2 since it's our home chain

    # )

getAminoSigner =   -> window.keplr.getAminoSigner()
getOfflineSigner = -> window.keplr.getOfflineSigner()
