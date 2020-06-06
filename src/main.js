import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
// import echarts from 'echarts'
// 根据版本路径不同会有差异，按照自己版本路径
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/base.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
// Vue.prototype.$echarts = echarts
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
