SELF = Symbol 'DOM-SELF'

module.exports = wrap = DOM = (els) ->
  return els if els instanceof DOM

  if typeof els isnt 'string' and SELF of els
    return els[SELF]

  return new DOM els unless @ instanceof DOM
  els = if typeof els is 'string' then document.querySelectorAll(els) else els
  @els = els = if 'length' of els then Array.from(els) else [els]
  if els.length is 1
    els[0][SELF] = @
  return @

DOM::each = (fn) ->
  @els.forEach fn
  return @
DOM::map  = (fn) -> @els.map fn

DOM::text = (value) -> @each (el) -> el.textContent = value

DOM::on = (event, target, fn) ->
  _els = @els.slice()
  [target, fn] = normalizeEventArgs target, fn
  listeners = @map (el) ->
    el.addEventListener event, listener = (e) ->
      if target
        target.each (t) -> fn.call(wrap(t), e) if isEventTarget e, wrap(t)
      else
        fn.call wrap(e.target), e
    listener
  return ->
    listeners.forEach (l, i) -> _els[i].removeEventListener event, l
    return
DOM::once = (event, target, fn) ->
  [target, fn] = normalizeEventArgs target, fn
  unbind = @on event, target, (e) ->
    unbind()
    fn.call this, e

DOM::head = (n = 1) -> if n is 1 then @els[0] else @els.slice(0, n)
DOM::tail = (n = 1) -> if n is 1 then @els[@els.length - 1] else @els.slice(-n)

DOM::addClass    = (cls) -> @each (el) ->
  el.classList.add(cls)
  return @
DOM::removeClass = (cls) -> @each (el) ->
  el.classList.remove cls
  return @

Object.defineProperties DOM::,
  length: get: -> @els.length

DOM.ready = (fn) ->
  if document.readyState is 'complete'
    fn()
  else
    document.addEventListener 'DOMContentLoaded', fn

$body = () => wrap document.body
DOM.on  = (args...) => $body().on  args...
DOM.off = (args...) => $body().off args...

normalizeEventArgs = (target, fn) ->
  if typeof fn isnt 'function'
    fn = target
    target = undefined
  target = wrap target if target
  return [target, fn]
isEventTarget = (e, target) -> e.target and e.target is target.head()
