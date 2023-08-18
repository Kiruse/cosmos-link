<template lang="pug">
.WalletSwitch-item(:class='classes' @click='$emit("click")')
  slot
</template>

<style lang="sass">
.WalletSwitch-item
  padding: 5px
  cursor: pointer
  > *
    display: block

.WalletSwitch-disabled
  opacity: 0.5

.WalletSwitch-selected
  background-color: #6bdcff
  border-radius: 10px
</style>

<script lang="coffee">
import cx from 'classnames'

export default
  props:
    selected: Boolean
    disabled: Boolean
  computed:
    classes: -> cx
      'WalletSwitch-selected': @selected
      'WalletSwitch-disabled': @disabled
</script>
