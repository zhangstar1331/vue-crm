<!-- 监管处罚整改详情 -->
<template>
  <div class="changeBox clearFloat">
    <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">{{tag}}情况</span>
      </div>
    <el-col :span="12" class="boxLeft">
      <div v-if="code==='resultFollow'">检查结果跟进：</div>
      <div v-if="code==='resultFollow'">监管意见：</div>
      <div v-if="code!=='resultFollow'">是否{{tag}}：</div>
      <div v-if="code!=='resultFollow'">{{tag}}情况：</div>
      <div>附件：</div>
    </el-col>
    <el-col :span="12" class="boxRight">
      <div v-if="code!=='resultFollow'">
        <el-radio v-model="radio" label="1">是</el-radio>
        <el-radio v-model="radio" label="2">否</el-radio>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  props: ["code"],
  components: {},
  data() {
    return {
      radio: "1",
      value:'',
      options: [
        {
          value: "",
          label: "受到行政处罚或其他监管措施"
        },
        {
          value: "",
          label: "未受到处罚"
        },
        {
          value: "",
          label: "暂未收到检查反馈"
        }
      ]
    };
  },
  computed: {
    tag() {
      return this.code === "dutyInfo" ? "问责" : "整改";
    }
  },
  methods: {}
};
</script>
<style lang='less' scoped>
.changeBox {
  font-size: 14px;
  .boxLeft div {
    text-align: right;
    margin-bottom: 20px;
    padding-right: 20px;
  }
}
</style>