<template lang="pug">
.Notices(v-show='msgs.length')
  ul
    for msg in msgs
      li.Notices-item(:class='`Notices-${msg.type || "info"}`') #[b {{ msg.name }}:] {{ msg.message }}
</template>

<style lang="sass">
.Notices > ul
  list-style: none
  padding: 0
  margin: 0

.Notices-item
  --color: #ccc
  color: var(--color)
  border: 1px solid var(--color)
  border-radius: 10px
  margin: 4px 0
  padding: 8px

  &.Notices-success
    --color: var(--success)
  &.Notices-info
    --color: var(--info)
  &.Notices-warn
    --color: var(--warn)
  &.Notices-error
    --color: var(--error)
</style>

<script lang="coffee">
import { useNotices } from '@/store/notices'
export default
  setup: -> useNotices()
</script>
