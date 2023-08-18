<template lang="pug">
#home
  header: h1 Cosmos Link
  main
    p #[i Cosmos Link] is in #[i alpha]. Please keep this in mind while using this micro-dApp.
    ConnectWallet
    p
      | If you are interested in using #[i Cosmos Link] for your own project or have other
      | questions, #[a(href=`mailto:${email}`) drop me an email].
</template>

<style lang="sass">
@use '~style/home'

.ConnectWallet
  align-self: center
</style>

<script lang="coffee">
import ConnectWallet from '~comp/ConnectWallet.vue'

export default
  components: {
    ConnectWallet,
  }
</script>
