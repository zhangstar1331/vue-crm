# 简介：

---


 最近公司项目采用vue搭建了一个后台管理系统，一路上遇到了许多问题，都是通过google来自己研究解决。在这个过程中学到了许多，于是决定把最基础的部分拿出来，单独做一个项目，以后再遇到类似的后台系统，直接可以拿过来用，免去了一开始的搭建环境、写基础代码的麻烦。同时也想分享出来，与大家交流交流，各位给提提意见，毕竟整个项目从头到尾都是自己一个人搞得，有点闭门造车的感觉，哈哈。
如果觉得还可以的话，麻烦给点个⭐⭐，谢谢各位喽😊
## github:  [https://github.com/luichooy/vue-admin.git](https://github.com/luichooy/vue-admin.git)

## 技术栈：

​vue@2.5.2+vue-router@3.0.1+vuex@3.0.0+axios@0.17.0+element-ui@2.0.0+vue-echarts@2.5.1

# Build Setup:


```plain
# 将项目克隆到本地
git clone https://github.com/luichooy/vue-admin.git

# 进入到项目目录
cd vue-admin

# 安装依赖
npm install

# 在开发环境运行项目，并且在浏览器打开 http://localhost:7999
npm run dev

# 项目打包
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test

```

# 目录结构：


```
├── build
├── config
├── src
│   ├── assets
│   │   ├── images
│   │   ├── js
|   |   |   ├── addressData.js
│   │   │   ├── localStorage.js
│   │   │   ├── util.js
│   │   └── styles
│   │   │   ├── base.scss
│   │   │   ├── common.scss
│   │   │   ├── iconfont.css
│   │   │   ├── mixin.scss
│   │   │   ├── table.scss
│   │   │   ├── variable.scss
│   ├── components
│   │   ├── card
│   │   ├── filterbar
│   │   └── score
│   │   ├── selfAdd
│   │   ├── tableRadio
│   │   ├── validateCode
│   │   ├── Vmodel
│   ├── data
│   ├── pages
│   │   ├── charts
│   │   ├── error
│   │   ├── form
│   │   └── login
│   │   ├── main
│   │   ├── setting
│   │   ├── tables
│   │   ├── test
│   ├── router
│   │   ├── index.js
│   │   ├── route.js
│   ├── store
│   │   ├── getters.js
│   │   ├── index.js
│   │   ├── mutations.js
│   │   ├── state.js
│   ├── utils
│       ├── utils.js
│   ├── http.js
│   ├── main.js
│   ├── Root.vue
├── static
├── test
├── babelrc
├── eslintignore
├── eslintrc.js
├── .gitignore
├── postcssrc.js
├── index.html
├── package.json
└── readme.md
```

# 功能实现：


* [x] 登陆，登出
* [x] 验证码插件的实现
* [x] 通过vuex管理用户信息和token
* [x] 左侧菜单栏，上方顶部栏
* [x] 利用express完成api开发，实现数据mock
* [x] 利用axios设置请求，响应拦截器，对http请求进行统一管理
* [x] 设置vue-router的导航守卫，实现页面访问权限控制及页面跳转loading的同意管理
* [x] 引入vue-echarts,实现多种柱状图/折线图/饼图
* [x] 表格-基本表格示例，该部分会继续扩充
* [x] 自由表单渲染及自定义表单元素的实现
* [x] 测试部分有自己实现的各种组件，该部分会继续补充

# 效果预览：

---


![login.gif | center | 832x585](https://cdn.yuque.com/yuque/2018/gif/95048/1522651362860-40c6bf1f-45c7-429d-8dea-f90bbdb45b22.gif "")

![basic.gif | center | 832x585](https://cdn.yuque.com/yuque/2018/gif/95048/1522651400348-538008f4-4d55-45d9-933a-a72449a1bbaf.gif "")


![charts.gif | center | 832x585](https://cdn.yuque.com/yuque/2018/gif/95048/1522651417218-cef6f977-a7a8-44e9-9902-2e1b29c142fb.gif "")

![form.gif | center | 832x585](https://cdn.yuque.com/yuque/2018/gif/95048/1522651426493-b10d5605-70ff-47dd-b35b-f5959380498b.gif "")

![test.gif | center | 1316x926](https://cdn.yuque.com/yuque/2018/gif/95048/1522651433603-32edb860-2099-4783-a1ca-f28ceb560000.gif "")
