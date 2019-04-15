const state = {
  baseUrl: 'http://hdnav.zicp.net:8008/hdmap/styles/',
  map: null
}

const actions = {
  changeMapProxy({commit}, payload) {
      commit('changeMap', payload)
  },

}

//mutations，真正用来修改state的方法集
const mutations = {
  changeMap(state, payload) {
      state.map = payload
  },
}

const getter = {

}

const moduleMain = {
state: state,
mutations: mutations,
actions: actions,
getter: getter
}

export default moduleMain;