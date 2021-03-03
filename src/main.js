// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import http from './http';
import store from './store/index';
import router from './router/index';
import Root from './Root.vue';
import axios from 'axios';
import $ from 'jquery';

// 引入公共样式表
import 'normalize.css';
import 'animate.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/utils/flexible'
// 引入echarts主模块（基础模块）
import ECharts from 'vue-echarts/components/ECharts.vue'
import Vue2OrgTree from 'vue2-org-tree'

// 引入全局组件
import GL_Component from './utils/globalComponents'
Vue.use(GL_Component)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 引入需要的echarts如表
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';

// 引入需要的 echarts的交互 组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markLine';

import 'src/assets/styles/variable.scss';
import 'src/assets/styles/base.scss';
import 'src/assets/styles/common.scss';
import 'src/assets/styles/iconfont.css';

Vue.use(ElementUI);
Vue.use(Vue2OrgTree);

Vue.component('chart', ECharts);

axios.defaults.baseURL = 'http://172.24.248.12:8980/riskm' //测试
Vue.prototype.serveUrl = 'http://172.24.248.12:8980/riskm' //测试
//axios.defaults.baseURL = 'http://100.39.8.51:8980/riskm' //测试
//Vue.prototype.serveUrl = 'http://100.39.8.51:8980/riskm' //测试
//axios.defaults.baseURL = 'http://100.39.6.22:8980/riskm' //测试
//Vue.prototype.serveUrl = 'http://100.39.6.22:8980/riskm' //测试
//axios.defaults.baseURL = 'http://100.39.8.103:8980/riskm/'
//Vue.prototype.serveUrl = 'http://100.39.8.103:8980/riskm/'

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = http;
 
new Vue({
  el: '#app',
  store,
  router,
  template: '<Root/>',
  components: { Root }
});
