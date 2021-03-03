<!-- 监管处罚信息详情 -->
<template>
  <div>
    <backBanner :bannerList="bannerList" :route="route"></backBanner>
    <div class="shadowBox" style="margin-top:75px;font-size:14px">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <transition
        enter-active-class="animated fadelnRight"
        leave-active-class="animated fadeOutLeft"
        :duration="600"
        mode="out-in"
      >
        <basicInfo v-if="pageIndex===0"></basicInfo>
        <changeInfo v-if="pageIndex===1"></changeInfo>
        <dutyInfo v-if="pageIndex===2" code='dutyInfo'></dutyInfo>
      </transition>
      <div style="text-align:center;margin-top:20px">
        <el-button type="primary" size="mini" @click="next" :disabled="pageIndex===2">下一步</el-button>
      </div>
    </div>
    <maintainRecord code='punish'></maintainRecord>
  </div>
</template>

<script>
import backBanner from "src/components/commonModel/backBanner";
import basicInfo from "../punishInfo/baseInfo";
import changeInfo from "../punishInfo/changeInfo";
import dutyInfo from "../punishInfo/changeInfo";
//引入维护记录
import maintainRecord from '../maintainRecord'
export default {
  props: [],
  components: {
    backBanner,
    basicInfo,
    changeInfo,
    dutyInfo,
    maintainRecord
  },
  data() {
     let params = this.$route.params || {};
    return {
      annex: null,
      bannerList: [
        "合规信息管理",
        "合规信息库",
        "监管检查事项信息库",
        "监管处罚信息详情"
      ],
      tableData: [],
      route: {
        name: "inspectInfo",
        params: {
          index: "second"
        }
      },
      tableHead: [
        {
          prop: "",
          label: "监管检查事项版本号"
        },
        {
          prop: "",
          label: "检查事项"
        },
        {
          prop: "",
          label: "报送时间"
        },
        {
          prop: "",
          label: "维护时间"
        }
      ],
      pageIndex: params.index || 0
    };
  },
  created() {
    
  },
  computed: {},
  methods: {
    next() {
      if (this.pageIndex < 2) {
        this.pageIndex += 1;
      }
    }
  }
};
</script>
<style lang='less' scoped>
</style>