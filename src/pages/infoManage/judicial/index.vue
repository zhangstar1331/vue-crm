<!-- 涉刑案件信息库 -->
<template>
  <div>
    <looseEventStore
    code='judicialInfo'
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
  props:[],
  components: {
    looseEventStore
  },
  data () {
    return {
      title: {
        title: "涉刑案件信息库",
        routeInfo: {text:'查看全部涉刑案件信息',route:'judicialInfo'},
      },
      bannerList: ["合规信息管理", "合规信息库", "涉刑案件信息库"],
      tableHead: [
        {
          prop: "losscp",
          label: "公司"
        },
        {
          prop: "innercount",
          label: "年度累计业内案件数量"
        },
        {
          prop: "innersamoney",
          label: "涉案金额(万元)"
        },
        {
          prop: "innerlossmoney",
          label: "损失金额(万元)"
        },
        {
          prop: "innerwzcount",
          label: "已问责案件数量"
        },
        {
          prop: "outercount",
          label: "年度累计业外案件数量"
        },
        {
          prop: "outersamoney",
          label: "涉案金额(万元)"
        },
        {
          prop: "outerlossmoney",
          label: "损失金额(万元)"
        },
        {
          prop: "outerwzcount",
          label: "已问责案件数量"
        },
      ]
    };
  },
  computed: {},
  methods: {}
}

</script>
<style lang='less' scoped>
</style>