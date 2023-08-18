<template lang="pug">
button(:disabled='busy || disabled' @click='onClick').ConnectWallet connect wallet
</template>

<script lang="coffee">
import * as Wallet from '@/lib/wallet'
import { selected } from '@/comp/WalletSwitch'

export default
  setup: ->
    return {
      selected,
    }
  data: ->
    busy: false
  computed:
    disabled: -> !@selected
  methods:
    onClick: ->
      @busy = true
      try
        wallet = Wallet.wallet @selected
        await wallet.connect 'phoenix-1'
        @$emit 'connect', wallet
      finally
        @busy = false
</script>
