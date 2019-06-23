import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import moduleSearch from './Modules/search'
export default new Vuex.Store({
    modules: {
        moduleSearch,moduleSearch
    }
})