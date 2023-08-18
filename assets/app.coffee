vue = require 'vue'
{default: HomeView} = require '@/view/home.vue'

app = vue.createApp HomeView
app.mount '#app'
