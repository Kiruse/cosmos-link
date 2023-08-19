<template lang="pug">
Button.LoginButton(
  :loading='loading'
  :disabled='!wallet'
  @click='onClick'
) Login
</template>

<script lang="coffee">
import Button from '@/comp/Button.vue'

export default
  components: { Button }
  props:
    wallet:
      validator: (value) -> typeof value is 'object'
  data: ->
    loading: false
  methods:
    onClick: ->
      @loading = true
      try
        await @wallet.signLogin()
      catch err
        if err.message is 'Request rejected'
          console.info 'User rejected'
        else
          console.error 'Error signing login message:', err
      finally
        @loading = false
</script>
