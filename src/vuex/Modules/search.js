const state = {
  hourForm:{
    tableNumber:'',
    startAndEndDate:[],
    startDate:null,
    endDate:null
  },
  hourSearchFlag:false,
  dayForm:{
    tableNumber:'',
    startAndEndDate:[],
    startDate:null,
    endDate:null
  },
  daySearchFlag:false,
  monthForm:{
    tableNumber:'',
    startAndEndDate:[],
    startMonth:null,
    endMonth:null
  },
  monthSearchFlag:false
}

const actions = {
  changeHourForm({commit}, payload) {
      commit('changeHourForm2', payload)
  },
  changeHourSearchFlag({commit}, payload) {
    commit('changeHourSearchFlag2', payload)
  },
  changeDayForm({commit}, payload) {
    commit('changeDayForm2', payload)
  },
  changeDaySearchFlag({commit}, payload) {
    commit('changeDaySearchFlag2', payload)
  },
  changeMonthForm({commit}, payload) {
    commit('changeMonthForm2', payload)
  },
  changeMonthSearchFlag({commit}, payload) {
    commit('changeMonthSearchFlag2', payload)
  },
}

//mutations，真正用来修改state的方法集
const mutations = {
  changeHourForm2(state, payload) {
      state.hourForm = payload
  },

  changeHourSearchFlag2(state, payload) {
    state.hourSearchFlag = payload
  },

  changeDayForm2(state, payload) {
    state.dayForm = payload
  },

  changeDaySearchFlag2(state, payload) {
    state.daySearchFlag = payload
  },

  changeMonthForm2(state, payload) {
    state.monthForm = payload
  },

  changeMonthSearchFlag2(state, payload) {
    state.monthSearchFlag = payload
  }
}

const getter = {

}

const moduleSearch = {
state: state,
mutations: mutations,
actions: actions,
getter: getter
}

export default moduleSearch;