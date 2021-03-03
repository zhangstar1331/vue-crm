<!-- 监管处罚信息详情 -->
<template>
  <div>
    <div class="punishBox clearFloat">
      <el-col :span="12">
        <div>监管处罚信息编号：</div>
      </el-col>
      <el-col :span="6">
        <div>监管处罚文件编号：</div>
      </el-col>
      <el-col :span="12">
        <div>监管处罚决定书落款时间：</div>
      </el-col>
      <el-col :span="12">
        <div>被处罚机构：</div>
      </el-col>
      <el-col :span="12">
        <div>处罚金额：</div>
      </el-col>
      <el-col :span="24">
        <div>其他机构处罚措施：</div>
      </el-col>
      <el-col :span="12">
        <div>被处罚个人：</div>
      </el-col>
      <el-col :span="12">
        <div>处罚金额：</div>
      </el-col>
      <el-col :span="24">
        <div>其他个人处罚措施：</div>
      </el-col>
      <el-col :span="24">
        <div>附件：</div>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
<style lang='less' scoped>
.punishBox {
  font-size: 14px;
  .el-col {
    margin-bottom: 25px;
    padding-left:150px;
  }
}
</style>