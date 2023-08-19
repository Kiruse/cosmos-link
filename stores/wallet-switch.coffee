import { ref } from 'vue'
import * as Wallet from '@/lib/wallet'
import { showNotices } from '@/comp/Notices.vue'

selectedWallet = ref undefined # the currently selected wallet type
wallets = ref {}               # mapping of available wallet types
wallet  = ref undefined        # the actual wallet instance

window.addEventListener 'load', ->
  wallets.value = Wallet.detect()
  unless Object.values(wallets.value).some(Boolean)
    showNotices 'warn', [{ name: 'Attention', message: 'No wallets detected' }]

export useWallets = -> {
  wallet,
  wallets,
  selectedWallet,
}
