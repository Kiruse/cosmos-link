import { ref } from 'vue'

msgs = ref []

export showNotices = (_type, _msgs) ->
  msgs.value = []
  addNotices _type, _msgs
export showNotice = (msg) -> showNotices [msg]
export addNotices = (type, _msgs) ->
  # _type arg is optional
  if _msgs?
    _msgs = _msgs.map (msg) -> Object.assign msg, {type}
  else
    _msgs = type
  msgs.value = msgs.value.concat _msgs
  return
export addNotice = (msg) -> addNotices [msg]

export useNotices = -> { msgs }
