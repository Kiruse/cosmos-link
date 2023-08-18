module.exports = class KeplrWallet
  signArbitrary: (msg) ->
    console.log getAminoSigner().signArbitrary

getAminoSigner =   -> window.keplr.getAminoSigner()
getOfflineSigner = -> window.keplr.getOfflineSigner()
