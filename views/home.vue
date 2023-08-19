<template lang="pug">
- const email = 'contact.rabp1@simplelogin.com'
#home
  header: h1 Cosmos Link
  main
    p #[i Cosmos Link] is in #[i alpha]. Please keep this in mind while using this micro-dApp.
    if !wallet
      WalletSwitch
      ConnectWallet(@connect='onConnect')
    else
      LoginButton
    Notices
    p
      | If you are interested in using #[i Cosmos Link] for your own project or have other
      | questions, #[a(href=`mailto:${email}`) drop me an email].
</template>

<style lang="sass">
@use '@/style/home'

.WalletSwitch
  align-self: center
  padding: 5px 0

.ConnectWallet
  align-self: center
</style>

<script lang="coffee">
import ConnectWallet from '@/comp/ConnectWallet.vue'
import Notices, { showNotices } from '@/comp/Notices.vue'
import LoginButton from '@/comp/LoginButton.vue'
import WalletSwitch from '@/comp/WalletSwitch.vue'
import { useWallets } from '@/store/wallet-switch'
import { getQueryParam } from '@/lib/helpers'

unless url = getQueryParam 'redirect'
  showNotices 'warn', [{ name: 'Attention', message: 'No redirect URL provided. This is a problem with the dApp that brought you here.' }]

export default
  components: {
    ConnectWallet,
    Notices,
    LoginButton,
    WalletSwitch,
  }
  setup: ->
    { wallet } = useWallets()
    return { wallet }
  methods:
    onConnect: (wallet) -> @wallet = wallet
</script>
