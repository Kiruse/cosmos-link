$ = require './dom.coffee'

$.ready ->
  $.on 'mousedown', 'button', (e) ->
    @addClass 'pressed'
  $.on 'mouseup', (e) ->
    $('button.pressed').removeClass 'pressed'

  $('#connect-wallet').on 'click', (e) ->
    e.preventDefault()
    return if @busy
    @busy = true
    @text 'sorry, still under construction :)'
