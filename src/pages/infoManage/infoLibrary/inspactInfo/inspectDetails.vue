<!-- 监管检查事项信息详情 -->
<template>
  <div>
    <backBanner :bannerList="bannerList" route="inspectInfo"></backBanner>
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
        <resultFollow v-if="pageIndex===1" code="resultFollow"></resultFollow>
        <changeInfo v-if="pageIndex===2"></changeInfo>
        <dutyInfo code="dutyInfo" v-if="pageIndex===3"></dutyInfo>
      </transition>
      <div style="text-align:center;margin-top:20px">
        <el-button type="primary" size="mini" @click="next" :disabled="pageIndex===3">下一步</el-button>
      </div>
    </div>
    <maintainRecord code='inspact'></maintainRecord>
  </div>
</template>

<script>
import backBanner from "src/components/commonModel/backBanner";
import basicInfo from "../inspactInfo/basicInfo";
import changeInfo from "../punishInfo/changeInfo";
import dutyInfo from "../punishInfo/changeInfo";
import resultFollow from "../punishInfo/changeInfo";
//引入维护记录
import maintainRecord from '../maintainRecord'
export default {
  props: [],
  components: {
    backBanner,
    basicInfo,
    changeInfo,
    dutyInfo,
    resultFollow,
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
        "监管检查信息详情"
      ],
      pageIndex: params.index || 0
    };
  },
  computed: {},
  created() {
  },
  methods: {
    next() {
      if (this.pageIndex < 3) {
        this.pageIndex += 1;
      }
    }
  }
};
</script>
<style lang='less' scoped>
</style>