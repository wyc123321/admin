import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login'
import address from '../components/address/address'
import report from '../components/report/report'
import user from '../components/user/user'
import navigate from '../components/public/navigate'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '登录',
        isShow: false
      }
    },
    {
      path: '/navigate',
      component: navigate,
      children: [
        {
          path: '/navigate/address',
          name: 'address',
          component: address,
          meta: {
            title: '地址管理',
            isShow: true
          }
        },
        {
          path: '/navigate/report',
          name: 'report',
          component: report,
          meta: {
            title: '报表管理',
            isShow: true
          }
        },
        {
          path: '/navigate/user',
          name: 'user',
          component: user,
          meta: {
            title: '用户管理',
            isShow: true
            }
        },
        {
          path: '',
          redirect: '/navigate/report'
        },
      ]
    },

    {path: '*', redirect: '/login'}
  ]
})
/** *  修改网站title的值 */
router.beforeEach((to, from, next) => {  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
/** * 路由拦截器 * 1.判断该路由是否需要登录权限 * 2.通过vuex state获取当前的token是否存在 * 3.将跳转的路由path作为参数，登录成功后跳转到该路由 */
router.beforeEach((to, from, next) => {
  next()
})
/** * 路由输出 */
export default router
