import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from './router'
import store from './vuex'
import axios from 'axios'
import qs from 'qs'
import 'jquery/src/jquery'
import 'ztree/js/jquery.ztree.all.min'
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'

Vue.use(Antd)
Vue.use(ElementUI);
Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
Vue.use(echarts)
Vue.prototype.$echarts = echarts

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
