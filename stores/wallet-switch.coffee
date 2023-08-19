import { ref } from 'vue'
import * as Wallet from '@/lib/wallet'

selectedWallet = ref undefined # the currently selected wallet type
wallets = ref {}               # mapping of available wallet types
wallet  = ref undefined        # the actual wallet instance

window.addEventListener 'load', ->
  wallets.value = Wallet.detect()

export useWallets = -> {
  wallet,
  wallets,
  selectedWallet,
}
