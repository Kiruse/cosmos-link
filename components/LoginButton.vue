<template lang="pug">
Button.LoginButton(
  :loading='loading'
  :disabled='!wallet'
  @click='onClick'
) login
</template>

<script lang="coffee">
import Button from '@/comp/Button.vue'
import { showNotices } from '@/comp/Notices.vue'
import { getQueryParam, login, RequestError } from '@/lib/helpers'
import { useWallets } from '@/store/wallet-switch'

export default
  components: { Button }
  setup: ->
    { wallet } = useWallets()
    return { wallet }
  data: ->
    loading: false
    token: null
  methods:
    onClick: ->
      @loading = true
      try
        @token = await login @wallet
        if url = getQueryParam 'redirect'
          showNotices 'success', [{ name: 'Login Success', message: 'Redirecting...' }]
          window.location.assign "#{url}?token=#{@token}"
      catch err
        switch
          when err.message is 'Request rejected'
            console.info 'User rejected'
          when err.status in [401, 403]
            showNotices 'error', [{ name: 'Login Error', message: err.message }]
          else
            showNotices 'error', [err]
      finally
        @loading = false
</script>
