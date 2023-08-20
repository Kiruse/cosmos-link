import ConnectWallet from '@/comp/ConnectWallet.vue'
import Notices from '@/comp/Notices.vue'
import LoginButton from '@/comp/LoginButton.vue'
import WalletSwitch from '@/comp/WalletSwitch.vue'
import { useWallets } from '@/store/wallet-switch'
import { getTokenID, getQueryParam } from '@/lib/helpers'

export default
  components: {
    ConnectWallet,
    Notices,
    LoginButton,
    WalletSwitch,
  }
  setup: ->
    { wallet } = useWallets()
    return { wallet }
  data: ->
    tid: getTokenID()
  computed:
    redirect: -> getQueryParam 'redirect'
  methods:
    onConnect: (wallet) -> @wallet = wallet
