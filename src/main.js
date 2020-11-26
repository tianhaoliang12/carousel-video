import Vue from 'vue'
import App from './App.vue'

import vueCarouselVideo from './lib/index.js'
Vue.use(vueCarouselVideo)

new Vue({
  el: '#app',
  render: h => h(App)
})
