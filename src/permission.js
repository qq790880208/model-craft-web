import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  console.log('Step1')
  console.log(document.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  console.log(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      if (store.getters.roles.length === 0) {
        console.log('99999999999999999999999999999')
        store
          .dispatch('user/getInfo')
          .then(res => {
            console.log(store.getters.menus)
            store.dispatch('permission/GenerateRoutes', store.getters.menus).then(accessRoutes => {
              console.log('/////***********////')
              console.log(store.getters.permission_routes)
              console.log(accessRoutes)
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              console.log(router)
              next({ ...to, replace: true })
            })
          })
          .catch(err => {
            store.dispatch('user/resetToken').then(() => {
              Message.error(err || 'Has Error')
              next(`/login?redirect=${to.path}`)
              NProgress.done()
            })
          })
      } else {
        // next({ path: '/401', replace: true, query: { noGoBack: true }})
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
