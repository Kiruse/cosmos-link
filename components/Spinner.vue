<template lang="pug">
.Spinner: .Spinner-inner
  svg(:width='size' :height='size' viewBox='0 0 40 40' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg')
    path(
      :fill='computedColor'
      d='M33.812 28.1461C33.812 28.1461 37.2271 30.1602 37.2271 30.1602C39.0185 27.1227 39.975 23.6655 39.9995 20.1391C40.024 16.6127 39.1157 13.1426 37.3667 10.0804C35.6177 7.01828 33.09 4.47302 30.0402 2.70273C26.9902 0.932434 23.5265 0 20 0C20 0 20 3.96472 20 3.96472C22.8274 3.96472 25.6045 4.71228 28.0498 6.13165C30.4951 7.55103 32.5217 9.59171 33.924 12.0468C35.3263 14.502 36.0546 17.2842 36.0349 20.1115C36.0153 22.9388 35.2484 25.7107 33.812 28.1461Z'
      fill-rule='evenodd'
      stroke='none'
    )
</template>

<style lang="sass">
@keyframes SpinnerSpinFrames
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
@keyframes SpinnerPulseFrames
  from
    transform: scale(1)
  to
    transform: scale(1.25)

.Spinner
  animation: SpinnerSpinFrames 0.5s linear infinite
  .Spinner-inner
    animation: SpinnerPulseFrames 0.8s ease-in-out infinite alternate
    > svg
      display: block
</style>

<script lang="coffee">
export default
  props:
    color:
      type: String
      default: 'secondary'
    size:
      type: Number
      default: 35
  computed:
    computedColor: ->
      style = getComputedStyle(document.body)
      switch @color
        when 'primary'   then style.getPropertyValue '--primary'
        when 'secondary' then style.getPropertyValue '--secondary'
        else @color
</script>
