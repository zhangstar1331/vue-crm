import axios from "axios";
import { Loading, Message, MessageBox } from "element-ui";
import store from "./store/index";
import router from "./router/index";
// import { localStorage } from 'src/assets/js/storage';

if (!store.state.token) {
  store.commit("SET_TOKEN", localStorage.getItem("token"));
}

// axios 配置

const http = axios.create({
  timeout: 120000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
  transformRequest: [
    function(data, headers) {
      headers.tn = store.state.token;
      return data;
    }
  ]
});

var loadingInstance;
// 请求拦截器
http.interceptors.request.use(
  config => {
    //字符串化数据
    if (config.headers["Content-Type"] === "application/json") {
      config.data =
        typeof config.data === "string"
          ? config.data
          : JSON.stringify(config.data);
    }
    loadingInstance = Loading.service({
      fullscreen: true,
      lock: true,
      text: "正在请求数据..."
    });

    // 开发环境下，如果请求是 post,put,patch,则打印数据体，方便调试
    if (process.env.NODE_ENV === "development") {
      const { method } = config;
      if (method === "post" || method === "put" || method === "patch") {
        console.log(config.data);
      }
    }

    return config;
  },
  error => {
    loadingInstance.close();
    Message.error({
      message: "请求失败"
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  res => {
    loadingInstance.close();
    return res.data;
  },
  error => {
    loadingInstance.close();
    if (error && error.response) {
      console.log(error.response);

      switch (error.response.status) {
        // 401 token失效
        case 401:
          localStorage.removeItem("token");
          MessageBox.alert("身份信息已过期，请重新登陆", "提示", {
            confirmButtonText: "重新登陆",
            showClose: false,
            type: "error",
            callback: action => {
              router.replace({
                path: "/login",
                query: {
                  redirect: router.currentRoute.fullPath
                }
              });
            }
          });
          break;

        // 403 服务器拒绝访问
        case 403:
          router.push("/error/403");
          break;

        // 404 访问的资源不存在
        case 404:
          router.push("/error/404");
          break;

        // 500 服务器错误
        case 500:
          router.push("/error/500");
          break;

        case 413:
          MessageBox.alert("文件过大，上传失败!", "提示", {
            confirmButtonText: '确定'
          });
          break;

        //非200，上传文件失败
        default:
          MessageBox.alert("网络错误或者系统异常，请您稍后重试!", "提示", {
            confirmButtonText: '确定'
          });
          break;
      }

      return Promise.reject(error);
    }
  }
);
http.adornData = (data = {}, openDefultdata = true, contentType = "json") => {
  var defaults = {
    t: new Date().getTime()
  };
  data = openDefultdata ? merge(defaults, data) : data;
  return contentType === "json" ? JSON.stringify(data) : qs.stringify(data);
};
export default http;
