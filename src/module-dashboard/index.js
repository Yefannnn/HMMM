// vue-router
// import { asyncRouterMap } from '@/router'
// import routerMaps from './router'
// vuex
import app from './store/app'
import errorLog from './store/errorLog'
import permission from './store/permission'
import tagsView from './store/tagsView'
import user from './store/user'

export default {
  install (module, store) {
    console.log('module', module)
    console.log('store', store)
    // 注册路由
    // asyncRouterMap.push(routerMaps[0])
    // 注册状态管理，如果vue.use的时候不传递store这个参数，这里就没办法注册，所以注册之前判断一下是否有store，如果没有的话直接使用registerModule方法会报错，很厉害
    if (store !== undefined) {
      store.registerModule('app', app)
      store.registerModule('errorLog', errorLog)
      store.registerModule('permission', permission)
      store.registerModule('tagsView', tagsView)
      store.registerModule('user', user)
    }
  }
}
