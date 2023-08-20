<template lang="pug">
Button.LoginButton(
  :loading='loading'
  :disabled='!wallet || done'
  @click='onClick'
) login
</template>

<script lang="coffee">
import Button from '@/comp/Button.vue'
import { getQueryParam, login, RequestError } from '@/lib/helpers'
import { showNotices, showNotice } from '@/store/notices'
import { useWallets } from '@/store/wallet-switch'
import { testTokenID } from '@common'

export default
  components: { Button }
  props:
    tid:
      type: String
      required: true
      validator: testTokenID
  setup: ->
    { wallet } = useWallets()
    return { wallet }
  data: ->
    done: false
    loading: false
  methods:
    onClick: ->
      @loading = true
      try
        token = await login @tid, @wallet
        @done = true
        if url = getQueryParam 'redirect'
          showNotice
            type: 'success'
            name: 'Login Success'
            message: 'Redirecting...'
          window.location.assign "#{url}?token=#{token}"
        else
          showNotice
            type: 'success'
            name: 'Login Success'
            message: 'Return to the original dApp and enter your Token ID above.'
      catch err
        switch
          when err.message is 'Request rejected'
            console.info 'User rejected'
          when err.status in [401, 403]
            showNotice
              type: 'error'
              name: 'Login Error'
              message: err.message
          else
            showNotices 'error', [err]
      finally
        @loading = false
</script>
