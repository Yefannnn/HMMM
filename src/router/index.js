import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import Layout from '@/module-dashboard/pages/layout'
import { getToken } from '@/utils/auth'

// 定义
// 没上线之前_import 采用 require 导入    上线之后 _import 采用 import 导入
const _import = require('./import_' + process.env.NODE_ENV) // 懒加载 导包
const whiteList = ['/login', '/authredirect'] // 设置白名单，无权限也可以访问

// 配置
Vue.use(Router)
NProgress.configure({ showSpinner: false }) // NProgress Configuration

/**
   * 基础路由
   *
  * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
  * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
  *                                if not set alwaysShow, only more than one route under the children
  *                                it will becomes nested mode, otherwise not show the root menu
  * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
  * name:'router-name'             the name is used by <keep-alive> (must set!!!)
  * meta : {
      roles: ['admin','editor']     will control the page roles (you can set multiple roles)
      title: 'title'               the name show in submenu and breadcrumb (recommend set)
      icon: 'svg-name'             the icon show in the sidebar,
      noCache: true                if true ,the page will no be cached(default is false)
    }
  **/
export const constantRouterMap = [
  {
    path: '/login',
    component: _import('dashboard/pages/login'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: _import('dashboard/pages/authredirect'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/pages/dashboard'),
        name: 'dashboard',
        meta: { title: '面板', icon: 'dashboard', noCache: true }
      }
    ]
  },
  { path: '/404', component: _import('dashboard/pages/404'), hidden: true },
  { path: '/401', component: _import('dashboard/pages/401'), hidden: true }
]

/**
   * 配置路由
   **/
const router = new Router({
  // mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return {
      x: 0,
      y: 0
    }
  },
  routes: constantRouterMap
})

// 路由全局前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // 有权限
  if (getToken()) {
    // 有权限还去login
    if (to.path === '/login') {
      // 让页面回到顶部
      document.documentElement.scrollTop = 0
      // 不允许，给我直接去首页
      next({ path: '/' })
      // 关闭进度条
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetUserInfo')
          .then(res => {
            // 拉取user_info
            const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              // 让页面回到顶部
              document.documentElement.scrollTop = 0
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          })
          .catch(() => {
            store.dispatch('FedLogOut').then(() => {
              Message.error('验证失败, 请重新登录')
              // 让页面回到顶部
              document.documentElement.scrollTop = 0
              next({ path: '/login' })
            })
          })
      } else {
        // 让页面回到顶部
        document.documentElement.scrollTop = 0
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      // 让页面回到顶部
      document.documentElement.scrollTop = 0
      next()
    } else {
      // 让页面回到顶部
      document.documentElement.scrollTop = 0
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
   * 导出 基础路由
   **/
export default router

/**
   * 导出 业务路由
   **/
export const asyncRouterMap = [{ path: '*', redirect: '/404', hidden: true }]
