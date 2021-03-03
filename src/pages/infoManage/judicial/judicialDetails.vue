<!-- 涉刑案件信息详情 -->
<template>
  <div>
    <backBanner :bannerList="bannerList" :route="bannerRoute"></backBanner>
    <div class="shadowBox clearFloat" style="margin-top:75px;font-size:14px">
      <div class="titIcon" v-if="tag!=='violationDetails'">
        <em></em>
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <div style='text-align:right;margin:20px 0'>
        <span v-if="tag==='judicialDetails'">案件信息编号：</span>
        <span v-else>内部违规事件编号：</span>
      </div>
      <transition
        enter-active-class="animated fadelnRight"
        leave-active-class="animated fadeOutLeft"
        :duration="600"
        mode="out-in"
      >
        <basicInfo v-if="pageIndex === 0" :code="tag==='judicialDetails'?'judicial':'violation'"></basicInfo>
        <changeInfo v-if="pageIndex === 1 && tag==='violationDetails'" :tag='tag'></changeInfo>
        <dutyInfo v-if="(pageIndex === 1 && tag==='judicialDetails') || (pageIndex === 2 && tag==='violationDetails')" code="dutyInfo" :tag='tag'></dutyInfo>
      </transition>
      <div style="text-align:center;margin-top:20px">
        <el-button
          type="primary"
          size="mini"
          @click="next"
          :disabled="disabled"
          >下一步</el-button
        >
      </div>
    </div>
    <maintainRecord :code='tag'></maintainRecord>
  </div>
</template>

<script>
import backBanner from "src/components/commonModel/backBanner";
// 引入基本信息
import basicInfo from '../infoLibrary/inspactInfo/basicInfo'
//引入问责情况
import dutyInfo from '../infoLibrary/punishInfo/changeInfo'
//引入整改情况
import changeInfo from '../infoLibrary/punishInfo/changeInfo'
//引入维护记录
import maintainRecord from '../infoLibrary/maintainRecord'
export default {
  props: ['code','bannerListProp'],
  components: {
    backBanner,
    basicInfo,
    dutyInfo,
    changeInfo,
    maintainRecord
  },
  data() {
    let params = this.$route.params || {};
    return {
      tag:this.code || 'judicialDetails',
      bannerList:this.bannerListProp ||  [
        "合规信息管理",
        "合规信息库",
        "涉刑案件信息库",
        "涉刑案件信息详情"
      ],
      pageIndex: params.index || 0,
      tableData: [],
      tableHead: [
        {
          prop: "",
          label: "涉刑案件信息编号"
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
      ]
    };
  },
  computed: {
    bannerRoute(){
      return this.tag==='judicialDetails'?'judicialInfo':'violationInfo'
    },
    disabled(){
      if(this.tag==='judicialDetails'){
        return this.pageIndex===1
      }else{
         return this.pageIndex===2
      }
    }
  },
  methods: {
    next() {
      this.pageIndex+=1;
    }
  }
};
</script>
<style lang="less" scoped></style>
