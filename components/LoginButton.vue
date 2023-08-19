<template lang="pug">
Button.LoginButton(
  :loading='loading'
  :disabled='!wallet'
  @click='onClick'
) login
</template>

<script lang="coffee">
import Button from '@/comp/Button.vue'
import { login, RequestError } from '@/lib/helpers'
import { useWallets } from '@/store/wallet-switch'

export default
  components: { Button }
  setup: ->
    { wallet } = useWallets()
    return { wallet }
  data: ->
    loading: false
  methods:
    onClick: ->
      @loading = true
      try
        await login @wallet
      catch err
        switch
          when err.message is 'Request rejected'
            console.info 'User rejected'
          when err instanceof RequestError

          else
            console.error 'Error signing login message:', err
      finally
        @loading = false
</script>
