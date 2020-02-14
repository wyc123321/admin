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
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        router.replace({
          path: 'login',
          query: {redirect: router.currentRoute.fullPath}
        })
    }
  }
   Message.error(error.response.data);
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
