<template lang="pug">
.WalletSwitch
  WalletSwitchItem(
    :disabled='!wallets.keplr'
    :selected='selected === "keplr"'
    @click='select("keplr")'
  )
    img(:width='40' :height='40' src='@/assets/images/keplr-logo.svg')
  WalletSwitchItem(
    :disabled='!wallets.leap'
    :selected='selected === "leap"'
    @click='select("leap")'
  )
    img(:width='40' :height='40' src='@/assets/images/leap-logo.svg')
  WalletSwitchItem(
    :disabled='!wallets.station'
    :selected='selected === "station"'
    @click='select("station")'
  )
    img(:width='40' :height='40' src='@/assets/images/station-logo.svg')
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
import WalletSwitchItem from './WalletSwitchItem.vue'
import { useWallets } from '@/store/wallet-switch'

export default
  components: {
    WalletSwitchItem,
  }
  setup: ->
    { wallets, selectedWallet } = useWallets()
    return { wallets, selected: selectedWallet }
  methods:
    select: (type) -> @selected = type if !!@wallets[type]
</script>
