import Vue from 'vue';
import VueRouter from 'vue-router';
import { routers } from './route';
import { Loading } from 'element-ui';
import { setTitle } from 'src/assets/js/util';


Vue.use(VueRouter);

const routerConfig = {
  mode: 'history',
	base:'/risks/',
  linkActiveClass: 'active',
  routes: routers
};

const router = new VueRouter(routerConfig);
router.beforeEach((to, form, next) => {
  let token = window.localStorage.token;
  if(to.path === '/login'){
    if(token ==='null' || token ==='' || token === undefined){
      next()
    } else{
      next('/home/index');
    }
  }else{
    if(token ==='null' || token ==='' || token === undefined){
      next('/login');
    }else{
      next();
    }
  }
});
let loading;
router.beforeEach((to, form, next) => {
  loading = Loading.service({
    // fullscreen: true,
    target: '.content-wrapper',
    text: '跳转中...'
  });
  
  // 设置window.document.title 的名称
  setTitle(to.meta.title);
	if (!to.matched.length) {
	    next({
	      path: '/error/404',
	      replace: true
	    });
	} else {
	    next();
	}
});

router.afterEach((to, from) => {
  // 解决某些情况下loading无法关闭的情况
  setTimeout(() => {
    loading.close();
  }, 0)
});

export default router;
