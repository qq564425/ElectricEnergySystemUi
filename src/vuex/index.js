import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import main from './Modules/moduleMain'
import shipBaseInfo from './Modules/ShipBaseInfo'
export default new Vuex.Store({
    modules: {
       main: main,
       shipBaseInfo,shipBaseInfo
    }
})