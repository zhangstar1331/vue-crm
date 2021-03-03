<!-- 问责信息库目录 -->
<template>
  <div>
    <lossEventStore
      code="accountInfo"
      :title="title"
      :bannerListProp="bannerList"
      :tableHeadProp="tableHead"
    ></lossEventStore>
  </div>
</template>

<script>
import lossEventStore from "../../lossEvent/lossEventStore";
export default {
  props: [],
  components: {
    lossEventStore
  },
  data() {
    return {
      title:{
        title: "问责信息库",
        routeInfo: {text:'查看全部问责信息',route:'accountInfo'},
      },
      bannerList: ["合规信息管理", "合规信息库", "问责信息库"],
      tableHead:[{
        prop:'losscp',
        label:'公司',
      },{
        prop:'counter',
        label:'年度累计问责数量',
      },{
        prop:'zzcfrc',
        label:'累计组织处分人次',
      },{
        prop:'jlcfrc',
        label:'累计政纪处分人次',
      },{
        prop:'djcfrc',
        label:'累计党纪处分人次',
      },{
        prop:'jjcfrc',
        label:'累计经济处分人次',
      }],
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang="less" scoped></style>
