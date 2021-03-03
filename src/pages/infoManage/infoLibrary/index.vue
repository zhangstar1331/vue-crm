<!-- 合规信息库首页 -->
<template>
  <div>
    <looseEventStore
    code='inspectInfo'
    :title="title" 
    :bannerListProp="bannerList"
    :tableHeadProp=tableHead
    >
    </looseEventStore>
  </div>
</template>

<script>
import looseEventStore from "../../lossEvent/lossEventStore";
export default {
  props: [],
  components: {
    looseEventStore
  },
  data() {
    return {
      title: {
        title: "监管处罚信息库",
        routeInfo: {text:'查看全部监管处罚信息',route:'inspectInfo'},
      },
      bannerList: ["合规信息管理", "合规信息库", "监管处罚信息库"],
      tableHead: [
        {
          prop: "losscp",
          label: "公司"
        },
        {
          prop: "counts",
          label: "年度累计合规处罚事件数量"
        },
        {
          prop: "jgfine",
          label: "机构罚款金额"
        },
        {
          prop: "pefine",
          label: "个人罚款金额"
        },
        {
          prop: "warnc",
          label: "警告人次"
        },
        {
          prop: "cz",
          label: "撤职人次"
        }
      ]
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang='less' scoped>
</style>