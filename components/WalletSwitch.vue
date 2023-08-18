<template lang="pug">
.WalletSwitch
  WalletSwitchItem(:disabled='!wallets.keplr' :selected='selected === "keplr"' @click='select("keplr")')
    img(src='@/assets/images/keplr-logo.svg')
  WalletSwitchItem(:disabled='!wallets.leap' :selected='selected === "leap"' @click='select("leap")')
    img(src='@/assets/images/leap-logo.svg')
</template>

<style lang="sass">
.WalletSwitch
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  gap: 5px
</style>

<script lang="coffee">
import cs from 'classnames'
import { ref } from 'vue'
import * as Wallet from '@/lib/wallet'
import WalletSwitchItem from './WalletSwitchItem.vue'

export selected = ref(undefined)
wallets = ref({})

window.addEventListener 'load', ->
  wallets.value = Wallet.detect()

export default
  components: {
    WalletSwitchItem,
  }
  setup: ->
    return {
      selected,
      wallets,
    }
  methods:
    select: (type) -> selected.value = type if !!wallets.value[type]
</script>
