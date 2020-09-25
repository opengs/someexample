import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    clientId: null,
    authSecret: null
  },
  mutations: {
    login(state, data) {
      state.loggedIn = data['status']
      state.clientId = data['clientId']
      state.authSecret = data['authSecret']
    }
  },
  actions: {
  },
  modules: {
  }
})
