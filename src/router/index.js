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
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
]
export const asyncRoutes = [
  {
    path: '/label',
    component: Layout,
    redirect: '/label/rectangle',
    name: 'label',
    meta: {
      title: '数据集标注',
      icon: 'form',
      roles: ['admin', 'user']
    },
    children: [
      {
        path: '/label/d2',
        component: () => import('@/views/label/d2/index'),
        name: 'd2',
        meta: { title: '图片标注', icon: 'excel', roles: ['admin', 'user'] }
      },
      {
        path: '/label/d3',
        component: () => import ('@/views/label/d3/index'),
        name: 'd3',
        meta: { title: '3D目标标注', icon: 'excel', roles: ['admin', 'user'] }
      },
      {
        path: '/label/voice',
        component: () => import ('@/views/label/voice/index'),
        name: 'voice',
        meta: { title: '语音标注', icon: 'excel', roles: ['admin', 'user'] }
      },
      {
        path: '/label/pointcloud',
        component: () => import ('@/views/label/pointcloud/index'),
        name: 'pointcloud',
        meta: { title: '点云数据标注', icon: 'excel', roles: ['admin', 'user'] }
      }
    ]
  },
  {
    path: '/models',
    component: Layout,
    name: 'model',
    meta: {
      title: '模型管理',
      icon: 'form',
      roles: ['admin', 'user']
    },
    children: [
      {
        path: '/model',
        component: () => import('@/views/model/index'),
        name: 'model admin',
        meta: { title: '模型', icon: 'nested', roles: ['admin', 'user'] }
      },
      {
        path: '/model-eval',
        component: () => import('@/views/model/index'),
        name: 'model eval',
        meta: { title: '模型评估', icon: 'excel', roles: ['admin', 'user'] }
      }
    ]
  },
  {
    path: '/teamManagement',
    component: Layout,
    redirect: '/teamManagement/rectangle',
    name: 'teamManagement',
    meta: {
      title: '团队管理',
      icon: 'form',
      roles: ['admin', 'user']
    },
    children: [
      {
        path: '/teamManagement/annotateTeamManagement',
        component: () => import('@/views/teamManagement/annotateTeamManagement/index'),
        name: 'annotateTeamManagement',
        meta: { title: '标注团队管理', icon: 'excel', roles: ['admin', 'user'] }
      },
      {
        path: '/teamManagement/annotateMemberManagement',
        component: () => import('@/views/teamManagement/annotateMemberManagement/index'),
        name: 'annotateMemberManagement',
        meta: { title: '标注成员管理', icon: 'excel', roles: ['admin', 'user'] }
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
      icon: 'form',
      roles: ['admin']
    },
    children: [
      {
        path: '/systemManagement/authorityManagement',
        component: () => import('@/views/systemManagement/authorityManagement/index'),
        name: 'authorityManagement',
        meta: { title: '权限管理', icon: 'excel', roles: ['admin'] }
      },
      {
        path: '/systemManagement/userManagement',
        component: () => import('@/views/systemManagement/userManagement/index'),
        name: 'userManagement',
        meta: { title: '用户管理', icon: 'excel', roles: ['admin'] }
      },
      {
        path: '/systemManagement/systemResourceManagement',
        component: () => import('@/views/systemManagement/systemResourceManagement/index'),
        name: 'systemResourceManagement',
        meta: { title: '系统资源管理', icon: 'excel', roles: ['admin'] }
      },
      {
        path: '/systemManagement/platformOperation',
        component: () => import('@/views/systemManagement/platformOperation/index'),
        name: 'platformOperation',
        meta: { title: '平台运行情况', icon: 'excel', roles: ['admin'] }
      },
      {
        path: '/systemManagement/systemLogManagement',
        component: () => import('@/views/systemManagement/systemLogManagement/index'),
        name: 'systemLogManagement',
        meta: { title: '系统日志管理', icon: 'excel', roles: ['admin'] }
      },
      {
        path: '/systemManagement/userOperatingSystemManagement',
        component: () => import('@/views/systemManagement/userOperatingSystemManagement/index'),
        name: 'userOperatingSystemManagement',
        meta: { title: '用户操作日志', icon: 'excel', roles: ['admin'] }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/zh/',
        meta: { title: 'vue-element-admin文档', icon: 'link', roles: ['admin'] }
      }
    ]
  },
  {
    path: 'external-link2',
    component: Layout,
    children: [
      {
        path: 'https://element.eleme.cn/#/zh-CN/component/layout',
        meta: { title: 'element-ui文档', icon: 'link', roles: ['admin'] }
      }
    ]
  },
  {
    path: 'external-link2',
    component: Layout,
    children: [
      {
        path: 'https://element.eleme.cn/#/zh-CN/component/layout',
        meta: { title: 'element-ui文档', icon: 'link' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help', roles: ['admin'] },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table', roles: ['admin'] }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree', roles: ['admin'] }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form', roles: ['admin'] }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested',
      roles: ['admin']
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1', roles: ['admin'] },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1', roles: ['admin'] }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2', roles: ['admin'] },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1', roles: ['admin'] }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2', roles: ['admin'] }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
<<<<<<< HEAD
        meta: { title: 'menu2', roles: ['admin'] }
=======
        meta: { title: 'menu2' }
>>>>>>> origin/dev
      }
    ]
  },
  // 404 page must be placed at the end !!!
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
