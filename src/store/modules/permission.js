import { asyncRoutes, constantRoutes } from '@/router'

// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }
/**
 * Filter asynchronous routing tables by recursion
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouter  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */

export function filterAsyncRoutes(allRouter = [], userRouter = []) {
  console.log('allRouter =========' + allRouter)
  var realRoutes = []
  console.log('llllllllll' + allRouter.length)
  console.log('fffffffffffffff' + userRouter.length)
  for (var i = 0; i < allRouter.length; i++) {
    var v = allRouter[i]
    // 处理hidden类型路由
    if (v.hidden && v.hidden === true) {
      realRoutes.push(v)
      continue
    }
    console.log('hhhhhhhhhhh' + i)
    for (var j = 0; j < userRouter.length; j++) {
      var item = userRouter[j]
      if (v.meta && v.meta.resources) {
        if (item.resources === v.meta.resources) {
          if (item.children && item.children.length > 0) {
            console.log('hhhhhhh' + j)
            v.children = filterAsyncRoutes(v.children, item.children)
          }
          // v.meta.title = item.title
          // 处理图标，优先显示配置的图标
          if (item.icon) {
            v.meta.icon = item.icon
          }
          console.log('vvvvvvvvvvvvvvvvvvvvvvv')
          console.log(v)
          realRoutes.push(v)
          console.log('real-----------')
          console.log(realRoutes)
        }
      }
    }
  }
  return realRoutes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   console.log(roles)
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     console.log('22222222222')
  //     if (roles.includes('admin')) {
  //       console.log('1111111')
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // },
  GenerateRoutes({ commit }, data) {
    return new Promise(resolve => {
      // 使用权限
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, data)
      console.log(accessedRoutes)
      // console.log(accessedRoutes);
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)

      // 不使用权限
      // commit('SET_ROUTES', asyncRoutes)
      // resolve(asyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
