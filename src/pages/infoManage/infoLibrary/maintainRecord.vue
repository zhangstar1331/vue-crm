<!-- 维护记录 -->
<template>
  <div style='margin-bottom:10px'>
    <div class="shadowBox">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">维护记录</span>
      </div>
      <div class="myTable">
        <el-table
          :data="tableData"
          style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px"
        >
          <el-table-column
            :prop="item.prop"
            align="center"
            :label="item.label"
            v-for="(item, index) in tableHead"
            :key="index"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['code'],
  components: {},
  data() {
    return {
      tableData: [],
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
    };
  },
  computed: {},
  methods: {}
};
</script>
<style lang="less" scoped></style>
