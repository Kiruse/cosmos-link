<template lang="pug">
- const email = 'contact.rabp1@simplelogin.com'
#home
  header
    h1 Cosmos Link
    if !redirect
      p#TID Your token ID: #[b= tid]
  main
    p #[i Cosmos Link] is in #[i alpha]. Please keep this in mind while using this micro-dApp.
    if !wallet
      WalletSwitch
      ConnectWallet(@connect='onConnect')
    else
      LoginButton(:tid='tid')
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

#TID
  text-align: center
  color: var(--secondary)
</style>

<script lang="coffee" src="./home.coffee"></script>
