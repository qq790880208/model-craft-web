import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'), /* 懒加载 */
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard', /* chong */
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    },
    {
      path: '/dataSet/userLabel',
      component: () => import('@/views/dataSet/userLabel'),
      name: 'userLabel',
      meta: { title: 'userLabel', resources: 'userLabel' },
      hidden: true
    },
    {
      path: '/dataSet/message',
      component: () => import('@/views/dataSet/message'),
      name: 'message',
      meta: { title: 'message', resources: 'message' },
      hidden: true
    }
  ]
  }
]
export const asyncRoutes = [
  {
    path: '/teamManagement',
    component: Layout,
    redirect: '/teamManagement/rectangle',
    name: 'teamManagement',
    meta: {
      title: '团队管理',
      resources: 'teamManagement',
      icon: 'peoples'
    },
    children: [
      {
        path: '/teamManagement/annotateTeamManagement',
        component: () => import('@/views/teamManagement/annotateTeamManagement/index'),
        name: 'annotateTeamManagement',
        meta: { title: '标注团队管理', resources: 'annotateTeamManagement', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/label',
    component: Layout,
    redirect: '/label/rectangle',
    name: 'label',
    meta: {
      title: '数据集标注',
      resources: 'label'
    },
    children: [
      {
        path: '/label/d2imageview',
        component: () => import('@/views/label/d2/imageview'),
        name: 'd2view',
        meta: { title: '2D拉框标注', resources: 'd2' },
        hidden: true
      },
      {
        path: '/label/polygonimageview',
        component: () => import ('@/views/label/polygon/imageview'),
        name: 'polygon',
        meta: { title: '像素级标注', resources: 'polygon' },
        hidden: true
      },
      {
        path: '/label/voice',
        component: () => import ('@/views/label/voice/index'),
        name: 'voice',
        meta: { title: '语音标注',  resources: 'voice' }
      },
      {
        path: '/label/d3',
        component: () => import ('@/views/label/d3/index'),
        name: 'd3',
        meta: { title: '3D标注', resources: 'd3' }
      }
    ]
  },
  {
    path: '/newtrain',
    component: Layout,
    name: 'newtrain',
    redirect: '/newtrain/table',
    meta: {
      title: '训练管理',
      resources: 'newtrain',
      icon: 'skill'
    },
    children: [
      {
        path: '/newtrain/table',
        component: () => import('@/views/newtrain/table'),
        name: 'newTable',
        meta: { title: '训练管理',  resources: 'newTable', icon: 'skill' }
      }
    ]
  },
  {
    path: '/dataSet',
    component: Layout,
    name: 'dataSet',
    redirect: '/dataSet/rectangle',
    meta: {
      title: '数据管理',
      resources: 'dataSet',
      icon: 'zip'
    },
    children: [
      {
        path: '/data',
        component: () => import('@/views/dataSet/index'),
        name: 'data manage',
        meta: { title: '数据集管理', resources: 'data', icon: 'tree-table' }
      },
      {
        path: '/oss',
        component: () => import('@/views/dataSet/oss'),
        name: 'oss manage',
        meta: { title: '对象存储', resources: 'oss', icon: 'tree' }
      },
    ]
  },
  {
    path: '/models',
    component: Layout,
    name: 'model',
    meta: {
      title: '模型管理',
      resources: 'models',
      icon: 'international'
    },
    children: [
      {
        path: '/model',
        component: () => import('@/views/model/index'),
        name: 'model admin',
        meta: { title: '模型管理', resources: 'model', icon: 'international' }
      }
    ]
  },
  {
    path: '/system_management',
    component: Layout,
    redirect: '/system_management/rectangle',
    name: 'system_management',
    meta: {
      title: '系统设置',
      resources: 'system_management',
      icon: 'edit'
    },
    children: [
      {
        path: '/systemManagement/authorityManagement',
        component: () => import('@/views/systemManagement/authorityManagement/index'),
        name: 'authorityManagement',
        meta: { title: '权限管理', resources: 'authorityManagement' }
      },
      {
        path: '/systemManagement/userManagement',
        component: () => import('@/views/systemManagement/userManagement/index'),
        name: 'userManagement',
        meta: { title: '用户管理', resources: 'userManagement' }
      },
      {
        path: '/systemManagement/log',
        component: () => import('@/views/systemManagement/log/index'),
        name: 'log',
        meta: { title: '系统日志管理', resources: 'log' }
      },
      {
        path: '/systemManagement/loginLog',
        component: () => import('@/views/systemManagement/loginLog/index'),
        name: 'longinLog',
        meta: { title: '用户登录日志', resources: 'loginLog' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  model: 'history'
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
