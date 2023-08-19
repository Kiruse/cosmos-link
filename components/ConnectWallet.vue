<template lang="pug">
Button(:loading='loading' :disabled='disabled' @click='onClick').ConnectWallet connect wallet
</template>

<script lang="coffee">
import * as Wallet from '@/lib/wallet'
import Button from '@/comp/Button'
import { useWallets } from '@/store/wallet-switch'

export default
  components: { Button }
  setup: ->
    { wallet, selectedWallet } = useWallets()
    return { wallet, selectedWallet }
  data: ->
    loading: false
  computed:
    disabled: -> !@selectedWallet
  methods:
    onClick: ->
      @loading = true
      try
        wallet = Wallet.wallet @selectedWallet
        await wallet.connect 'phoenix-1'
        @wallet = wallet
      catch error
        console.error 'Failed to enable wallet:', error
      finally
        @loading = false
</script>
