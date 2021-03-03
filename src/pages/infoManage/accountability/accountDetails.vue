<!-- 问责信息详情 -->
<template>
  <div class="accountDetails">
    <backBanner :bannerList="bannerList" route="accountInfo"></backBanner>
    <div class="clearFloat shadowBox" style="margin-top:70px;font-size:14px;">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <div
        style="font-size:16px;color:#909399;position:absolute;right:16px;top:16px"
      >
        问责事件编号：
      </div>
      <el-col :span="12">
        <div>
          <span>问责对象类型：</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span>问责事项类型：</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span>问责事由：</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span>问责时间：</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span>被问责主体：</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span>四级机构：</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span><i class="el-icon-paperclip"></i>附件：</span>
        </div>
      </el-col>
    </div>
    <div class="shadowBox clearFloat" style="font-size:14px;">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">集体问责结果</span>
      </div>
      <el-col :span="12">
        <div>
          <span>经济处罚：</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span>被问责机构数量：</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span>经济处分：</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span>其他问责：</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span><i class="el-icon-paperclip"></i>附件：</span>
        </div>
      </el-col>
    </div>
    <div class="shadowBox clearFloat" style="font-size:14px;">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">个人问责结果</span>
      </div>
      <el-col :span="24">
        <div>
          <span>被问责个人：</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span>组织处理：</span>
          涉及人次数量：30人
          <p>组织处分组织</p>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span>纪律处分：</span>
          <p></p>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span>经济处罚：</span>
          <p></p>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span><i class="el-icon-paperclip"></i>附件：</span>
        </div>
      </el-col>
    </div>
    <maintainRecord></maintainRecord>
  </div>
</template>

<script>
import backBanner from "src/components/commonModel/backBanner";
//引入维护记录
import maintainRecord from '../infoLibrary/maintainRecord'
export default {
  props: [],
  components: {
    backBanner,
    maintainRecord
  },
  data() {
    return {
      bannerList: ["合规信息管理", "合规信息库", "问责信息库", "问责信息详情"]
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang="less" scoped>
.accountDetails {
  .el-col {
    span {
      display: inline-block;
      width: 150px;
      text-align: right;
    }
    i {
      margin-right: 5px;
    }
    p {
      margin: 10px 0 10px 150px;
    }
    margin-bottom: 20px;
  }
}
</style>
