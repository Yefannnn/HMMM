import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router' // 默认导出的是一个包含静态路由的 路由实例，业务动态路由都是在vue.use中注册的
import store from './store' // 默认导出的store 是没有模块的，模块是在vue.use中注册的
import i18n from './lang' // 语言包
import './icons' // icon
import './errorLog' // error log
import * as filters from './filters' // global filters
import './mock' // simulation data
// font-awesome
import 'font-awesome/css/font-awesome.css'
/*
 * 注册 - 业务模块
 */
import dashboard from '@/module-dashboard/' // 面板
import base from '@/module-manage/' // 后台管理
import hmmm from '@/module-hmmm/' // 动态注册 hmmm 的业务路由，我们开发的几个模块主要就是再这里注册的
/*
 * 注册 - 组件
 */

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css' // 用户管理

// 默认调用第一个参数中的install方法，第二个参数开始就是传参
Vue.use(dashboard, store) // 注册主页时候，将store实例传入，可以调用registerModule，即可 注册store 的模块

Vue.use(base, store) // 注册路由base后台管理的路由
// Vue.use(list, store)
// Vue.use(form, store)
// Vue.use(details, store)

Vue.use(hmmm, store)
Vue.use(VideoPlayer)

// 饿了么
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// 循环注册过滤器，挺好的~
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
