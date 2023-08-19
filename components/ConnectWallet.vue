<template lang="pug">
Button(:disabled='busy || disabled' @click='onClick').ConnectWallet connect wallet
</template>

<script lang="coffee">
import * as Wallet from '@/lib/wallet'
import Button from '@/comp/Button'
import { selected } from '@/comp/WalletSwitch'

export default
  components: { Button }
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
