import Vue from 'vue'
import VueX from 'vuex'
import basicStore from './store'

Vue.use(VueX)

const store = new VueX.Store({
  modules: {
    basicStore
  }
})

export default store
