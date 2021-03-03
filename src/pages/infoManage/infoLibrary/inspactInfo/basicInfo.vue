<!-- 检查事项基本页面 -->
<template>
  <div>
    <div class="titIcon" v-if="sign === 'violation'">
      <em></em>
      <span style="font-weight: 600;">基本信息</span>
    </div>
    <div class="inspectBox">
      <el-col :span="12" class="boxLeft">
        <div v-for="(item, index) in infoListFilter" :key="index">
          <i class="el-icon-paperclip" v-if="item.annex"></i>
          {{ item.label }}：
        </div>
      </el-col>
      <el-col :span="12" class="boxRight">
        <div>JC+年度+子公司缩写+编号</div>
      </el-col>
    </div>
    <div class="titIcon" v-if="sign === 'violation'">
      <em></em>
      <span style="font-weight: 600;">造成损失</span>
    </div>
    <div class="inspectBox" v-if="sign === 'violation'">
      <el-col :span="12" class="boxLeft">
        <div v-for="(item, index) in violationList" :key="index">
          <i class="el-icon-paperclip" v-if="item.annex"></i>
          {{ item.label }}：
        </div>
      </el-col>
      <el-col :span="12" class="boxRight">
        <div></div>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  props: ["code"],
  components: {},
  data() {
    return {
      annex: null,
      sign: this.code || "inspect",
      infoList: [
        {
          label: "监管检查事项编号",
          value: "",
          sign: "inspect"
        },
        {
          label: "检查事项",
          value: "",
          sign: "inspect"
        },
        {
          label: "实施主体",
          value: "",
          sign: "inspect"
        },
        {
          label: "实施主体名称",
          value: "",
          sign: "inspect"
        },
        {
          label: "检查开始时间",
          value: "",
          sign: "inspect"
        },
        {
          label: "检查结束时间",
          value: "",
          sign: "inspect"
        },
        {
          label: "被检查机构",
          value: "",
          sign: "inspect"
        },
        {
          label: "四级机构",
          value: "",
          sign: "inspect"
        },
        {
          label: "案件名称",
          value: "",
          sign: "judicial"
        },
        {
          label: "案发时间",
          value: "",
          sign: "judicial"
        },
        {
          label: "案件专报时间",
          value: "",
          sign: "judicial"
        },
        {
          label: "涉案金额",
          value: "",
          sign: "judicial"
        },
        {
          label: "损失金额",
          value: "",
          sign: "judicial"
        },
        {
          label: "案件发生机构",
          value: "",
          sign: "judicial"
        },
        {
          label: "违规事由",
          value: "",
          sign: "violation"
        },
        {
          label: "违规主体",
          value: "",
          sign: "violation"
        },
        {
          label: "事件发现时间",
          value: "",
          sign: "violation"
        },
        {
          label: "所属子公司",
          value: "",
          sign: "violation"
        },
        {
          label: "附件",
          value: "",
          annex: true
        }
      ],
      violationList: [
        {
          label: "财产损失",
          value: "",
        },{
          label: "社会影响",
          value: "",
        },{
          label: "其他",
          value: "",
        },{
          label: "附件",
          value: "",
          annex: true
        }
      ]
    };
  },
  computed: {
    infoListFilter() {
      return this.infoList.filter(
        item => item.sign === this.sign || !item.sign
      );
    }
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.inspectBox {
  font-size: 14px;
  .boxLeft div {
    text-align: right;
    margin-bottom: 20px;
    padding-right: 20px;
  }
}
.inspectBox:after {
  display: block;
  clear: both;
  content: "";
}
</style>
