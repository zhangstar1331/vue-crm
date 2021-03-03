import Layout from 'src/pages/layout/layout';

// 不作为main组件子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () =>
        import('src/pages/login/login')
};

// 错误页面
export const errorRouter = {
  path: '/error/:code',
  name: 'error',
  meta: {
    title: 'error'
  },
  component: () =>
        import('src/pages/error/index')
};

// 作为main组件子页面展示  但不在左侧菜单显示的路由卸载otherRoter里
export const otherRouter = {
  path: '',
  name: 'otherRouter',
  redirect: 'login',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: '/cataloguePage',
    name: 'cataloguePage',
    title: '外规目录',
    component: () =>
    import('src/pages/repository/cataloguePage')
  },
  {
    path: '/inNewRegulations',
    name: 'inNewRegulations',
    title: '新增内规',
    component: () =>
    import('src/pages/newRegulations/inNewRegulations')
  }, {
    path: '/newRegulations',
    name: 'newRegulations',
    title: '新增外规',
    component: () =>
    import('src/pages/newRegulations/newRegulations')
  }, {
    path: '/dfNewRegulations',
    name: 'dfNewRegulations',
    title: '新增东方外规',
    component: () =>
    import('src/pages/newRegulations/dfNewRegulations')
  }, {
    path: '/reverseEdit',
    name: 'reverseEdit',
    title: '编辑外规',
    component: () =>
    import('src/pages/reverseEdit/reverseEdit')
  }, {
    path: '/inReverseEdit',
    name: 'inReverseEdit',
    title: '编辑内规',
    component: () =>
    import('src/pages/reverseEdit/inReverseEdit')
  }, {
    path: '/dfReverseEdit',
    name: 'dfReverseEdit',
    title: '编辑内规',
    component: () =>
    import('src/pages/reverseEdit/dfReverseEdit')
  }, {
    path: '/reverse',
    name: 'reverse',
    title: '修订外规',
    component: () =>
    import('src/pages/reverse/reverse')
  }, {
    path: '/dfReverse',
    name: 'dfReverse',
    title: '修订东方制度',
    component: () =>
    import('src/pages/reverse/dfReverse')
  }, {
    path: '/inReverse',
    name: 'inReverse',
    title: '修订内规',
    component: () =>
    import('src/pages/reverse/inReverse')
  }, {
    path: '/newDetail',
    name: 'newDetail',
    title: '修订详情',
    component: () =>
    import('src/pages/newDetail/newDetail')
  },
  {
    path: '/innewDetail',
    name: 'innewDetail',
    title: '修订详情',
    component: () =>
    import('src/pages/innewDetail/innewDetail')
  },
  {
    path: '/dfnewDetail',
    name: 'dfnewDetail',
    title: '修订详情',
    component: () =>
    import('src/pages/dfnewDetail/dfnewDetail')
  },
  {
    path: '/buildState',
    name: 'buildState',
    title: '新增风险陈述书',
    component: () =>
    import('src/pages/perfer/buildState')
  }, {
    path: '/buildLimit',
    name: 'buildLimit',
    title: '新增风险限额',
    component: () =>
    import('src/pages/perfer/buildLimit')
  }, {
    path: '/newOrganization',
    name: 'newOrganization',
    title: '新增机构',
    component: () =>
    import('src/pages/newSetting/newOrganization')
  },
  {
    path: '/newUser',
    name: 'newUser',
    title: '新增用户',
    component: () =>
    import('src/pages/newSetting/newUser')
  },
  {
    path: '/newRole',
    name: 'newRole',
    title: '新增角色',
    component: () =>
    import('src/pages/newSetting/newRole')
  },
  {
    path: '/viewDefend',
    name: 'viewDefend',
    title: '视图维护',
    component: () =>
    import('src/pages/roleManage/viewDefend')
  },
  {
    path: '/accessDefend',
    name: 'accessDefend',
    title: '权限维护',
    component: () =>
    import('src/pages/roleManage/accessDefend')
  },
  {
    path: '/editRole',
    name: 'editRole',
    title: '编辑角色',
    component: () =>
    import('src/pages/roleManage/editRole')
  },
  {
    path: '/editOrganization',
    name: 'editOrganization',
    title: '编辑机构',
    component: () =>
    import('src/pages/newSetting/editOrganization')
  },
  {
    path: '/editUser',
    name: 'editUser',
    title: '编辑用户',
    component: () =>
    import('src/pages/newSetting/editUser')
  }, {
    path: '/paramRegulations',
    name: 'paramRegulations',
    title: '新建参数',
    component: () =>
    import('src/pages/riskMonitor/paramRegulations')
  }, {
    path: '/riskMonitor/quoteManage/createIndicato',
    name: 'createIndicator',
    title: '新建指标',
    component: () =>
    import('src/pages/riskMonitor/quoteManage/createIndicator')
  }, {
    path: '/riskMonitor/quoteManage/createIndicato/:editid',
    name: 'createIndicator',
    title: '新建指标',
    component: () =>
    import('src/pages/riskMonitor/quoteManage/createIndicator')
  }, {
    path: '/riskMonitor/quoteManage/detailIndicator',
    name: 'detailIndicator',
    title: '指标详情',
    component: () =>
    import('src/pages/riskMonitor/quoteManage/detailIndicator')
  }, {
    path: '/checkAssign',
    name: 'checkAssign',
    title: '已派发任务详情',
    component: () =>
    import('src/pages/riskMonitor/quoteAssign/checkAssign')
  }, {
    path: '/editAssign',
    name: 'editAssign',
    title: '未派发任务详情',
    component: () =>
    import('src/pages/riskMonitor/quoteAssign/editAssign')
  }, {
    path: '/taskReport',
    name: 'taskReport',
    title: '任务呈报',
    component: () =>
    import('src/pages/riskMonitor/taskReporting')
  },
  {
    path: '/focusAssignment',
    name: 'taskReport',
    title: '集中度分配',
    component: () =>
    import('src/pages/riskMonitor/focusAssignment')
  }, {
    path: '/checkForm',
    name: 'checkForm',
    title: '详情',
    component: () =>
    import('src/pages/riskMonitor/quoteForm/checkForm')
  },
  {
    path: '/buildWarnSheet',
    name: 'buildWarnSheet',
    title: '新增预警单',
    component: () =>
    import('src/pages/riskMonitor/quoteWarning/buildWarnSheet')
  }, {
    path: '/quoteWarnDetail',
    name: 'quoteWarnDetail',
    title: '新增预警单',
    component: () =>
    import('src/pages/riskMonitor/quoteWarning/quoteWarnDetail')
  }, {
    path: '/seasonReport',
    name: 'seasonReport',
    title: '损失事件季报',
    component: () =>
    import('src/pages/lossEvent/seasonReport')
  }, {
    path: '/specialReport',
    name: 'specialReport',
    title: '损失事件专报',
    component: () =>
    import('src/pages/lossEvent/specialReport')
  }, {
    path: '/leSendDetail',
    name: 'leSendDetail',
    title: '损失事件详情',
    component: () =>
    import('src/pages/lossEvent/leSendDetail')
  }, {
    path: '/superviseSpecialReport',
    name: 'superviseSpecialReport',
    title: '监管检查事项信息专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/supervise/superviseSpecialReport')
  }, {
    path: '/superviseDetail',
    name: 'superviseDetail',
    title: '监管检查事项信息详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/supervise/superviseDetail')
  }, {
    path: '/punishSpecialReport',
    name: 'punishSpecialReport',
    title: '监管处罚信息专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punish/punishSpecialReport')
  }, {
    path: '/punishDetail',
    name: 'punishDetail',
    title: '监管处罚信息详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punish/punishDetail')
  }, {
    path: '/caseSpecialReport',
    name: 'caseSpecialReport',
    title: '案件风险事件专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/case/caseSpecialReport')
  }, {
    path: '/caseDetail',
    name: 'caseDetail',
    title: '案件风险事件详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/case/caseDetail')
  }, {
    path: '/justiceSpecialReport',
    name: 'justiceSpecialReport',
    title: '涉刑案件信息专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/justice/justiceSpecialReport')
  }, {
    path: '/justiceDetail',
    name: 'justiceDetail',
    title: '涉刑案件信息详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/justice/justiceDetail')
  }, {
    path: '/violationSpecialReport',
    name: 'violationSpecialReport',
    title: '内部违规信息专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/violation/violationSpecialReport')
  }, {
    path: '/violationDetail',
    name: 'violationDetail',
    title: '内部违规信息详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/violation/violationDetail')
  }, {
    path: '/accountSpecialReport',
    name: 'accountSpecialReport',
    title: '问责信息专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/account/accountSpecialReport')
  }, {
    path: '/accountDetail',
    name: 'accountDetail',
    title: '问责信息详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/account/accountDetail')
  },
  {
    path: '/superviseSeasonReport',
    name: 'superviseSeasonReport',
    title: '监管检查事项信息季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/supervise/superviseSeasonReport')
  },
  {
    path: '/punishSeasonReport',
    name: 'punishSeasonReport',
    title: '监管处罚信息季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punish/punishSeasonReport')
  },
  {
    path: '/caseSeasonReport',
    name: 'caseSeasonReport',
    title: '案件风险事件季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/case/caseSeasonReport')
  },
  {
    path: '/justiceSeasonReport',
    name: 'justiceSeasonReport',
    title: '涉刑案件信息季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/justice/justiceSeasonReport')
  },
  {
    path: '/violationSeasonReport',
    name: 'violationSeasonReport',
    title: '内部违规信息季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/violation/violationSeasonReport')
  },
  {
    path: '/accountSeasonReport',
    name: 'accountSeasonReport',
    title: '问责信息报送季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/account/accountSeasonReport')
  },
  {
    path: '/assessResult',
    name: 'assessResult',
    title: '填写风控评估任务呈报',
    component: () =>
    import('src/components/riskAssess/assessResult')
  },
  {
    path: '/assessPoint',
    name: 'assessPoint',
    title: '填写风控评估任务呈报',
    component: () =>
    import('src/pages/riskAssess/assessLibrary/index')
  },
  {
    path: '/assessCB',
    name: 'assessCB',
    title: '控评估任务呈报列表',
    component: () =>
    import('src/pages/riskAssess/bringAssess/taskReport')
  },
  {
    path: '/perfer/conduction/addSolvencyData',
    name: 'addSolvencyData',
    title: '新增动态偿付能力数据',
    component: () =>
    import('src/pages/perfer/solvencyData/addSolvencyData')
  },
  {
    path: '/perfer/conduction/addModelManagement',
    name: 'addModelManagement',
    title: '新增偏好模型管理',
    component: () =>
    import('src/pages/perfer/modelManagement/addModelManagement')
  },
  {
    path: '/superviseSpecialReportCX',
    name: 'superviseSpecialReportCX',
    title: '监管检查事项信息专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/supervise/superviseSpecialReportCX')
  }, {
    path: '/superviseDetailCX',
    name: 'superviseDetailCX',
    title: '监管检查事项信息详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/supervise/superviseDetailCX')
  }, {
    path: '/superviseSeasonReportCX',
    name: 'superviseSeasonReportCX',
    title: '监管检查事项信息季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/supervise/superviseSeasonReportCX')
  }, {
    path: '/punishNoticeSpecialReport',
    name: 'punishNoticeSpecialReport',
    title: '行政处罚事先告知书专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punishNotice/punishSpecialReport')
  }, {
    path: '/punishNoticeDetail',
    name: 'punishNoticeDetail',
    title: '行政处罚事先告知书详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punishNotice/punishDetail')
  },
  {
    path: 'pressure/addPressureTest',
    name: 'addPressureTest',
    title: '新增压力测试报告',
    component: () =>
    import('src/pages/pressureTest/addPressureTest')
  },

  {
    path: '/punishSpecialReportCX',
    name: 'punishSpecialReportCX',
    title: '监管处罚信息专报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punish/punishSpecialReportCX')
  }, {
    path: '/punishDetailCX',
    name: 'punishDetailCX',
    title: '监管处罚信息详情',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punish/punishDetailCX')
  },
  {
    path: '/punishSeasonReportCX',
    name: 'punishSeasonReportCX',
    title: '监管处罚信息季报',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punish/punishSeasonReportCX')
  },
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
var powerData = [{
  path: '/home',
  name: 'hom',
  title: '首页',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'index',
    name: 'index',
    title: '风险监测指标管理',
    component: () =>
import('src/pages/home/index')
  }]
}];

export const appRouter = [{
  path: '/home',
  name: 'hom',
  title: '首页',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'index',
    name: 'index',
    title: '首页',
    component: () =>
    import('src/pages/home/index')
  }]
}, {
  path: '/tables',
  name: 'tables',
  title: '风险管理仪表盘',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'sort',
    name: 'sort',
    title: '风险监测指标管理',
    component: () =>
    import('src/pages/tables/sort')
  },
  {
    path: 'filter',
    name: 'filter',
    title: '损失时间库',
    component: () =>
    import('src/pages/tables/filter')
  }
  ]
},
{
  path: '/perfer',
  name: 'perfer',
  title: '风险偏好管理',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'state',
    name: 'state',
    title: '风险偏好陈述管理',
    component: () =>
    import('src/pages/perfer/state')
  },
  {
    path: 'limit',
    name: 'limit',
    title: '风险限额管理',
    component: () =>
    import('src/pages/perfer/limit')
  },
  {
    path: 'conduction/solvencyData',
    name: 'solvencyData',
    title: '动态偿付能力数据',
    component: () =>
    import('src/pages/perfer/solvencyData/solvencyData')
  },
  {
    path: 'conduction/modelManagement',
    name: 'modelManagement',
    title: '偏好模型管理',
    component: () =>
    import('src/pages/perfer/modelManagement/modelManagement')
  },
  {
    path: 'conduction/systemShow',
    name: 'systemShow',
    title: '风险偏好传导体系展现',
    component: () =>
    import('src/pages/perfer/systemShow/systemShow')
  }
  ]
},
{
  path: '/riskMonitor',
  name: 'riskMonitor',
  title: '风险监测指标管理',
  meta: {
    requireAuth: true
  },

  component: Layout,
  children: [{
    path: 'riskTreasury',
    name: 'riskTreasury',
    title: '风险大类库',
    component: () =>
    import('src/pages/riskMonitor/riskTreasury')
  },
  {
    path: 'quoteManage',
    name: 'quote',
    title: '指标库',
    component: () =>
    import('src/pages/riskMonitor/quoteManage/quote')
  },
  {
    path: 'quoteManage/createIndicator',
    name: 'createIndicator',
    title: '新建指标',
    component: () =>
    import('src/pages/riskMonitor/quoteManage/createIndicator')
  },
  {
    path: 'quoteManage/createIndicator/:editid',
    name: 'createIndicator',
    title: '新建指标',
    component: () =>
    import('src/pages/riskMonitor/quoteManage/createIndicator')
  },
  {
    path: 'paramManage',
    name: 'paramManage',
    title: '参数管理',
    component: () =>
    import('src/pages/riskMonitor/paramManage')
  }, {
    path: 'timeOutTask',
    name: 'timeOutTask',
    title: '定时任务时间点配置',
    component: () =>
    import('src/pages/riskMonitor/timeOutTask')
  }, {
    path: 'indexReporting',
    name: 'indexReporting',
    title: '指标呈报',
    component: () =>
    import('src/pages/riskMonitor/indexReporting')
  }, {
    path: 'quoteAssign/sendAssign',
    name: 'sendAssign',
    title: '已派发任务',
    component: () =>
    import('src/pages/riskMonitor/quoteAssign/sendAssign')
  }, {
    path: 'quoteAssign/unsendAssign',
    name: 'unsendAssign',
    title: '未派发任务',
    component: () =>
    import('src/pages/riskMonitor/quoteAssign/unsendAssign')
  }, {
    path: 'focusAssignment',
    name: 'focusAssignment',
    title: '集中度分配',
    component: () =>
    import('src/pages/riskMonitor/focusAssignment')
  }, {
    path: 'focusReport',
    name: 'focusReport',
    title: '集中度呈报',
    component: () =>
    import('src/pages/riskMonitor/focusReport')
  },
  {
    path: 'quoteForm/perferForm',
    name: 'perferForm',
    title: '风险偏好指标监测表',
    component: () =>
    import('src/pages/riskMonitor/quoteForm/perferForm')
  },
  {
    path: 'quoteForm/limitForm',
    name: 'limitForm',
    title: '风险限额监测表',
    component: () =>
    import('src/pages/riskMonitor/quoteForm/limitForm')
  },
  {
    path: 'quoteForm/rybForm',
    name: 'rybForm',
    title: '评价类指标监测表',
    component: () =>
    import('src/pages/riskMonitor/quoteForm/rybForm')
  },
  {
    path: 'quoteForm/gcForm',
    name: 'gcForm',
    title: '观测类指标监测表',
    component: () =>
    import('src/pages/riskMonitor/quoteForm/gcForm')
  },
  {
    path: 'quoteForm/focusForm',
    name: 'focusForm',
    title: '集中度报表',
    component: () =>
      import('src/pages/riskMonitor/quoteForm/focusForm')
  },
  {
    path: 'quoteForm/searchForm',
    name: 'searchForm',
    title: '风险指标报表查询',
    component: () =>
      import('src/pages/riskMonitor/quoteForm/searchForm')
  },
  {
    path: 'quoteWarning/unusualQuote',
    name: 'unusualQuote',
    title: '异常指标列表',
    component: () =>
      import('src/pages/riskMonitor/quoteWarning/unusualQuote')
  },
  {
    path: 'quoteWarning/riskyQuoteWarn',
    name: 'riskyQuoteWarn',
    title: '风险指标预警',
    component: () =>
      import('src/pages/riskMonitor/quoteWarning/riskyQuoteWarn')
  },
  {
    path: 'quoteWarning/riskyWarnMeasure',
    name: 'riskyWarnMeasure',
    title: '风险指标预警',
    component: () =>
      import('src/pages/riskMonitor/quoteWarning/riskyWarnMeasure')
  },
  {
    path: 'quotequoteAnalysis/rgbAnalysisResult',
    name: 'rgbAnalysisResult',
    title: '红黄蓝指标检测评价结果',
    component: () =>
      import('src/pages/riskMonitor/quotequoteAnalysis/rgbAnalysisResult')
  },
  {
    path: 'quotequoteAnalysis/rgbQuoteSituation',
    name: 'rgbQuoteSituation',
    title: '红黄蓝指标分布情况',
    component: () =>
      import('src/pages/riskMonitor/quotequoteAnalysis/rgbQuoteSituation')
  },
  {
    path: 'quotequoteAnalysis/rgbCompareAnalysis',
    name: 'rgbCompareAnalysis',
    title: '红黄蓝指标同比、环比分析',
    component: () =>
      import('src/pages/riskMonitor/quotequoteAnalysis/rgbCompareAnalysis')
  },
  {
    path: 'quotequoteAnalysis/rgbWarningTotal',
    name: 'rgbWarningTotal',
    title: '风险指标预警情况统计',
    component: () =>
      import('src/pages/riskMonitor/quotequoteAnalysis/rgbWarningTotal')
  },
  {
    path: 'quotequoteAnalysis/riskyHotPic',
    name: 'riskyHotPic',
    title: '风险热力图',
    component: () =>
      import('src/pages/riskMonitor/quotequoteAnalysis/riskyHotPic')
  }
  ]
},
{
  path: '/repository',
  name: 'repository',
  title: '制度库',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'out-manage',
    name: 'out-manage',
    title: '外规制度管理',
    component: () =>
    import('src/pages/repository/out-manage')
  },
  {
    path: 'in-manage',
    name: 'in-manage',
    title: '内部制度管理',
    component: () =>
    import('src/pages/repository/in-manage')
  },
  {
    path: 'df-manage',
    name: 'df-manage',
    title: '东方制度管理',
    component: () =>
    import('src/pages/repository/df-manage')
  },
  {
    path: 'white-manage',
    name: 'white-manage',
    title: '待维护制度管理',
    component: () =>
    import('src/pages/repository/white-manage')
  },
  {
    path: 'mapping',
    name: 'mapping',
    title: '映射关系管理',
    component: () =>
    import('src/pages/repository/mapping')
  }

  ]
},
{
  path: '/charts',
  name: 'charts',
  title: '合规信息报送',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'bar',
    name: 'bar',
    title: '柱状图',
    component: () =>
    import('src/pages/charts/bar')
  },
  {
    path: 'line',
    name: 'line',
    title: '折线图',
    component: () =>
    import('src/pages/charts/line')
  },
  {
    path: 'pie',
    name: 'pie',
    title: '饼图',
    component: () =>
    import('src/pages/charts/pie')
  }
  ]
},
{
  path: '/form',
  name: 'form',
  title: '内控自评估',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'render',
    name: 'render',
    title: '渲染表单',
    component: () =>
import('src/pages/form/render/render')
  }]
},
{
  path: '/setting',
  name: 'setting',
  title: '系统设置',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'organization',
    name: 'organization',
    title: '机构管理',
    component: () =>
    import('src/pages/setting/organization')
  },
  {
    path: 'user',
    name: 'user',
    title: '用户管理',
    component: () =>
    import('src/pages/setting/user')
  },
  {
    path: 'access',
    name: 'access',
    title: '权限管理',
    component: () =>
    import('src/pages/setting/access')
  },
  {
    path: 'log',
    name: 'log',
    title: '日志管理',
    component: () =>
    import('src/pages/setting/log')
  },
  {
    path: 'setpwd',
    name: 'setpwd',
    title: '修改密码',
    component: () =>
    import('src/pages/setting/setpwd')
  },
  {
    path: 'tool',
    name: 'tool',
    title: '管理工具',
    component: () =>
    import('src/pages/setting/tool')
  }
  ]
},
{
  path: '/meter',
  name: 'meter',
  title: '风险管理仪表盘',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'index',
    name: 'index',
    title: '风险管理仪表盘',
    component: () =>
import('src/pages/meter/index')
  }]
},
{
  path: '/lossEvent',
  name: 'lossEvent',
  title: '损失事件管理',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'lossEventStore',
    name: 'lossEventStore',
    title: '损失事件库',
    component: () =>
    import('src/pages/lossEvent/lossEventStore')
  },
  {
    path: 'lossEventSend',
    name: 'lossEventSend',
    title: '损失事件报送',
    component: () =>
    import('src/pages/lossEvent/lossEventSend')
  },
  {
    path: 'leStoreAall',
    name: 'leStoreAall',
    component: () =>
    import('src/pages/lossEvent/leStoreAll')
  },
  {
    path: 'leStoreDetail',
    name: 'leStoreDetail',
    component: () =>
    import('src/pages/lossEvent/leStoreDetail')
  },
  {
    path: 'lossEventTotal',
    name: 'lossEventTotal',
    title: '损失事件报送',
    component: () =>
    import('src/pages/lossEvent/lossEventTotal')
  }
  ]
},
{
  path: '/infoManage',
  name: 'infoManage',
  title: '合规信息管理',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'infoLibrary/index',
    title: '监管检查事项信息目录',
    component: () =>
    import('src/pages/infoManage/infoLibrary/index')
  },
  {
    path: 'infoLibrary/inspectInfo',
    name: 'inspectInfo',
    title: '监管检查事项信息列表',
    component: () =>
    import('src/pages/infoManage/infoLibrary/inspectInfo')
  },
  {
    path: 'infoLibrary/inspactInfo/inspectDetails',
    name: 'inspectDetails',
    title: '监管检查事项信息详情',
    component: () =>
    import('src/pages/infoManage/infoLibrary/inspactInfo/inspectDetails')
  },
  {
    path: 'infoLibrary/punishInfo/punishDetails',
    name: 'punishDetails',
    title: '监管处罚信息详情',
    component: () =>
    import('src/pages/infoManage/infoLibrary/punishInfo/punishDetails')
  },
  {
    path: 'judicial/index',
    title: '涉刑案件信息目录',
    component: () =>
    import('src/pages/infoManage/judicial/index')
  },
  {
    path: 'judicial/judicialInfo',
    name: 'judicialInfo',
    title: '涉刑案件信息列表',
    component: () =>
    import('src/pages/infoManage/judicial/judicialInfo')
  },
  {
    path: 'judicial/judicialDetails',
    name: 'judicialDetails',
    title: '涉刑案件信息详情',
    component: () =>
    import('src/pages/infoManage/judicial/judicialDetails')
  },
  {
    path: 'violation/index',
    title: '内部违规信息库',
    component: () =>
    import('src/pages/infoManage/violation/index')
  },
  {
    path: 'violation/violationInfo',
    title: '内部违规信息列表',
    name: 'violationInfo',
    component: () =>
    import('src/pages/infoManage/violation/violationInfo')
  },
  {
    path: 'violation/violationDetails',
    title: '内部违规信息详情',
    name: 'violationDetails',
    component: () =>
    import('src/pages/infoManage/violation/violationDetails')
  },
  {
    path: 'accountability/index',
    title: '问责信息库目录',
    component: () =>
    import('src/pages/infoManage/accountability/index')
  },
  {
    path: 'accountability/accountInfo',
    name: 'accountInfo',
    title: '问责信息库列表',
    component: () =>
    import('src/pages/infoManage/accountability/accountInfo')
  },
  {
    path: 'accountability/accountDetails',
    name: 'accountDetails',
    title: '问责信息库详情',
    component: () =>
    import('src/pages/infoManage/accountability/accountDetails')
  },
  {
    path: 'infoStatistics/report',
    title: '统计报表',
    component: () =>
    import('src/pages/infoManage/infoStatistics/report')
  },
  {
    path: 'infoStatistics/detialList',
    title: '清单报表',
    component: () =>
    import('src/pages/infoManage/infoStatistics/detialList')
  },
  {
    path: 'infoManageSend/supervise/superviseSend',
    name: 'supervise/superviseSend',
    title: '监管检查事项信息报送',
    component: () =>
    import('src/pages/infoManage/infoManageSend/supervise/superviseSend')
  },
  {
    path: 'infoManageSend/punish/punishSend',
    name: 'punish/punishSend',
    title: '监管处罚信息报送',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punish/punishSend')
  },
  {
    path: 'infoManageSend/case/caseSend',
    name: 'case/caseSend',
    title: '案件风险事件报送',
    component: () =>
    import('src/pages/infoManage/infoManageSend/case/caseSend')
  },
  {
    path: 'infoManageSend/justice/justiceSend',
    name: 'justice/justiceSend',
    title: '涉刑案件信息报送',
    component: () =>
    import('src/pages/infoManage/infoManageSend/justice/justiceSend')
  },
  {
    path: 'infoManageSend/violation/violationSend',
    name: 'violation/violationSend',
    title: '内部违规信息报送',
    component: () =>
    import('src/pages/infoManage/infoManageSend/violation/violationSend')
  },
  {
    path: 'infoManageSend/account/accountSend',
    name: 'account/accountSend',
    title: '问责信息报送',
    component: () =>
    import('src/pages/infoManage/infoManageSend/account/accountSend')
  },
  {
    path: 'infoManageSend/sendBack',
    name: 'sendBack',
    title: '合规报送信息管理',
    component: () =>
    import('src/pages/infoManage/infoManageSend/sendBack')
  },
  {
    path: 'supervise/index',
    title: '监管检查信息库',
    component: () =>
    import('src/pages/infoManage/supervise/index')
  },
  {
    path: 'supervise/superviseInfo',
    name: 'superviseInfo',
    title: '监管检查事项信息列表',
    component: () =>
    import('src/pages/infoManage/supervise/superviseInfo')
  },
  {
    path: 'infoManageSend/punishNotice/punishSend',
    name: 'punishNotice',
    title: '监管检查事项信息报送',
    component: () =>
    import('src/pages/infoManage/infoManageSend/punishNotice/punishSend')
  }
  ]
},
{
  path: '/riskAssess',
  name: 'riskAssess',
  title: '风控评估',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'processManage',
    name: 'processManage',
    title: '流程管理',
    component: () =>
import('src/pages/riskAssess/processManage/index')
  }, {
    path: 'assessLibrary',
    name: 'assessLibrary',
    title: '流程管理',
    component: () =>
import('src/pages/riskAssess/assessLibrary/index')
  }, {
    path: 'bringAssess/taskDistribute',
    name: 'taskDistribute',
    title: '风控评估任务分配',
    component: () =>
import('src/pages/riskAssess/bringAssess/taskDistribute')
  }, {
    path: 'bringAssess/taskReport',
    name: 'taskReport',
    title: '风控评估任务呈报',
    component: () =>
import('src/pages/riskAssess/bringAssess/taskReport')
  }, {
    path: 'assessStatistics/assessResult',
    name: 'assessResult',
    title: '风控评估结果',
    component: () =>
import('src/pages/riskAssess/assessStatistics/assessResult')
  }, {
    path: 'assessStatistics/inherentAssess',
    name: 'inherentAssess',
    title: '固有风险分布',
    component: () =>
import('src/pages/riskAssess/assessStatistics/assessSpread')
  }, {
    path: 'assessStatistics/surplusAssess',
    name: 'surplusAssess',
    title: '剩余风险分布',
    component: () =>
import('src/pages/riskAssess/assessStatistics/assessSpread')
  }]
},
{
  path: '/pressure',
  name: 'pressure',
  title: '压力测试',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [{
    path: 'report',
    name: 'pressureReport',
    title: '压力测试报告',
    component: () =>
import('src/pages/pressureTest/pressureTest')
  }]
}
];

export const routers = [
  loginRouter,
  errorRouter,
  otherRouter,
  ...appRouter
];
