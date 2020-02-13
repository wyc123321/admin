import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
import axios from 'axios';
import { Message } from 'element-ui';
axios.interceptors.request.use(function (config) {
    config.headers={'x-access-token': localStorage.getItem('token')};
  return config;
}, function (error) {
  return Promise.reject(error);
});
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (err) {
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 401:
  //       // 返回 401 清除token信息并跳转到登录页面
  //       //store.commit(types.LOGOUT);
  //       router.replace({
  //         path: 'login',
  //         query: {redirect: router.currentRoute.fullPath}
  //       })
  //   }
  // }
  // return Promise.reject(error.response.data);
  if (err && err.response) {
    switch (err.response.status) {
      case 400: err.message = '请求错误' ; break;
      case 401: err.message = '未授权，请重新登录'; break;
      case 403: err.message = '拒绝访问'; break;
      case 404: err.message = '请求出错'; break;
      case 408: err.message = '请求超时'; break;
      case 500: err.message = '服务器错误'; break;
      case 501: err.message = '服务未实现'; break;
      case 502: err.message = '网络错误'; break;
      case 503: err.message = '服务不可用'; break;
      case 504: err.message = '网络超时'; break;
      case 505: err.message = 'HTTP版本不受支持'; break;
      default: err.message = `连接出错(${err.response.status})!`;
    }
  }else{
    err.message = '连接服务器失败!'
  }
  Message.error(err.message);
  return Promise.reject(err);
});
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
