<template lang="pug">
button(:disabled='disabled' @click='onClick').ConnectWallet connect wallet
</template>

<script lang="coffee">
import * as Wallet from '~lib/wallet'

export default
  data: ->
    disabled: true
  methods:
    onClick: ->
      console.log Wallet
</script>
