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
    icon: 'svg-name'             the icon show in the sidebar
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
    component: () => import('@/views/login/index'),
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
    children: [
      {
        path: 'subway',
        name: 'subway',
        component: () => import('@/views/subway/MainContainer'),
        meta: { title: '地铁流量', icon: 'ditie' }
      }
    ]
  },
  {
    path: '/wenyu',
    component: Layout,
    redirect: '/wenyu',
    children: [{
      path: 'index',
      name: 'Dashboard',
      component: () => import('@/views/wenyu/trackList'),
      meta: { title: '室外轨迹', icon: 'dashboard' }
    },
    {
      path: 'showTrack',
      name: 'Dashboard',
      component: () => import('@/views/wenyu/showTrack'),
      meta: { title: '轨迹展示', icon: '' },
      hidden: true
    },
    {
      path: 'list',
      name: 'Dashboard',
      component: () => import('@/views/wenyu/list'),
      meta: { title: '轨迹选择', icon: '' },
      hidden: true
    }]
  },
  /* {
    path: '/yuruijie',
    component: Layout,
    children: [
      {
        path: '/index',
        name: 'yuruijie',
        component: () => import('@/views/yuruijie/index'),
        meta: { title: '于瑞杰', icon: 'dashboard' }
      }
    ]
  },*/
  {
    path: '/dengyuankang',
    component: Layout,
    redirect: '/dengyuankang',
    children: [{
      path: 'trackList',
      name: 'Dashboard',
      component: () => import('@/views/dengyuankang/trackList'),
      meta: { title: 'trackList', icon: 'dashboard' },
      hidden: true
    },
    {
      path: 'showTrack',
      name: 'Dashboard',
      component: () => import('@/views/dengyuankang/showTrack'),
      meta: { title: 'showTrack', icon: 'dashboard' },
      hidden: true
    },
    {
      path: 'useList',
      name: 'Dashboard',
      component: () => import('@/views/dengyuankang/userList'),
      meta: { title: '室内轨迹', icon: 'dashboard' }
    }]
  },
  {
    path: '/zhangyilei',
    component: Layout,
    meta: { title: '兴趣点与经验值', icon: 'xingqudingxiang' },
    redirect: '/zhangyilei',
    children: [{
      path: '1',
      name: 'trackforecast',
      component: () => import('@/views/zhangyilei/trackforecast'),
      meta: { title: '终点预测', icon: 'zhongdian' }
    }, {
      path: '3',
      name: 'experienceshow',
      component: () => import('@/views/zhangyilei/experienceshow'),
      meta: { title: '经验值', icon: 'jingyanzhi' }
    }, {
      path: '2',
      name: 'interestshow',
      component: () => import('@/views/zhangyilei/interestshow'),
      meta: { title: '兴趣点', icon: 'ganxingqu' }
    }]
  },
  {
    path: '/zhaoyunyun',
    name: 'zhaoyunyun',
    component: Layout,
    meta: { title: '赵云云', icon: 'dashboard' },
    children: [
      {
        path: '/zhaoyunyun',
        name: 'dashboard-zhaoyunyun',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '轨迹相似度', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '电子围栏',
      icon: 'dianziweilan'
    },
    children: [
      {
        path: 'homePage',
        component: () => import('@/views/nested/homePage/index'),
        meta: { title: '主页' }
      },
      {
        path: 'realTimeTrack',
        component: () => import('@/views/nested/realTimeTracking/index'),
        meta: { title: '实时追踪' }
      },
      {
        name: 'fenceCreateInfo', // 围栏创建填写具体信息
        path: '/fenceCreateInfo',
        component: () => import('@/views/nested/fenceCreate/fenceCreateInfo')
      },
      {
        path: 'fenceOut',
        name: 'fenceOut',
        meta: { title: '室外电子围栏' },
        component: () => import('@/views/nested/fenceCreate/fenceOutCreate/index')
      },
      {
        path: 'fenceMana',
        component: () => import('@/views/nested/fenceMana/index'),
        meta: { title: '围栏管理' }
      },
      {
        path: 'userGroup',
        component: () => import('@/views/nested/userGroup/index'),
        meta: { title: '用户组' }
      },
      {
        path: 'deviceMana',
        component: () => import('@/views/nested/deviceMana/index'),
        meta: { title: '设备管理' }
      },
      {
        path: 'createElecSign',
        component: () => import('@/views/nested/elecSign/createElecSign/index'),
        meta: { title: '创建电子签到' }
      },
      {
        path: 'elecSignMana',
        component: () => import('@/views/nested/elecSign/elecSignMana/index'),
        meta: { title: '管理电子签到' }
      },
      {
        path: 'alarmMana',
        component: () => import('@/views/nested/alarmMana/index'),
        meta: { title: '警报管理' }
      },
      {
        path: 'sysMana',
        component: () => import('@/views/nested/sysMana/index'),
        meta: { title: '系统管理' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
