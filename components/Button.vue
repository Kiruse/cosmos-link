<template lang="pug">
button(
  @mousedown='setPressed()'
  :disabled='disabled || loading'
  :class='classes'
)
  if showLeft || loading
    .Button-left
      if loading
        Spinner(:size='16')
      else
        slot(name='left')
  .Button-center: slot
  if showRight
    .Button-right: slot(name='right')
</template>

<style lang="sass">
@use 'sass:color'
@use '@/style/_vars'

.Button
  display: flex
  flex-direction: row
  align-items: center
  justify-content: center
  gap: 1em
  padding: 1em 1.5em

  &:disabled
    $color: color.scale(vars.$secondary)
  &.pressed
    background: rgba(20, 20, 20, 0.25)
</style>

<script lang="coffee">
import Spinner from '@/comp/Spinner.vue'

export default
  components: { Spinner }
  mounted: ->
    document.addEventListener 'mouseup', => @setUnpressed()
  props:
    disabled: Boolean
    loading: Boolean
  data: ->
    pressed: false
  computed:
    showLeft:  -> !!@$slots.left
    showRight: -> !!@$slots.right
    classes: ->
      'Button': true
      'pressed': @pressed
  methods:
    setPressed:   -> @pressed = true
    setUnpressed: -> @pressed = false
</script>
