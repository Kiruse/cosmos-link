<template lang="pug">
.Notices(v-show='msgs.length' :class='cls')
  ul
    for msg in msgs
      li.Notices-item #[b {{ msg.name }}:] {{ msg.message }}
</template>

<style lang="sass">
.Notices
  --color: #ccc
  padding: 8px
  margin: 4px 0
  color: var(--color)
  border: 1px solid var(--color)

  &.Notices-success
    --color: var(--success)
  &.Notices-warn
    --color: var(--warn)
  &.Notices-error
    --color: var(--error)

  > ul
    list-style: none
    padding: 0
    margin: 0

  .Notices-item
    border-bottom: 1px solid var(--color)
    &:last-child
      border-bottom: none
</style>

<script lang="coffee">
import { ref } from 'vue'

type = ref 'info'
msgs = ref []

export showNotices = (_type, _msgs) ->
  type.value = _type
  msgs.value = _msgs
  return

export default
  setup: -> { msgs, type }
  computed:
    cls: -> "Notices-#{@type}"
</script>
