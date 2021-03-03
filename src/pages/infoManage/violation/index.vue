<!-- 内部违规信息库 -->
<template>
  <div>
    <looseEventStore
    code='violationInfo'
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
        title: "内部违规信息库",
        routeInfo: {text:'查看全部内部违规信息',route:'violationInfo'},
      },
      bannerList: ["合规信息管理", "合规信息库", "内部违规信息库"],
      tableHead: [
        {
          prop: "losscp",
          label: "公司"
        },
        {
          prop: "counter",
          label: "年度累计违规事件数量"
        },
        {
          prop: "lossmoney",
          label: "累计造成的财产损失（万元）"
        }]
    };
  },
  computed: {},
  methods: {}
}

</script>
<style lang='less' scoped>
</style>