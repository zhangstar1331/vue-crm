<template>
  <div id="formSingleList">
    <el-table
      v-if="listShow == 1"
      :data="tableData4"
      style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;"
    >
      <el-table-column prop="code" label="事件所属公司" align="center">
        <template slot-scope="scope">{{
          scope.row.code.toUpperCase()
        }}</template>
      </el-table-column>
      <el-table-column prop="name" label="事件发生机构" align="center">
        <template slot-scope="scope">
          <span
            :title="scope.row.name"
            class="textOverFlow"
            style="color: #4285F4;"
            @click="goDetail(scope.$index, scope.row)"
            >{{ scope.row.name == null ? "--" : scope.row.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="catName" label="分支机构" align="center">
        <template slot-scope="scope">
          <span :title="scope.row.catName" class="textOverFlow">{{
            scope.row.catName == null ? "--" : scope.row.catName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="损失事件数（件）" align="center">
        <template slot-scope="scope">
          <p
            v-for="item in JSON.parse(scope.row.value)"
            :class="{
              redBg: scope.row.rybStatus == 1,
              yellowBg: scope.row.rybStatus == 2,
              blueBg: scope.row.rybStatus == 3
            }"
            :title="item"
          >
            {{ item }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="objName"
        label="损失总额（万元）"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="depName"
        label="回收总额（万元）"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="depName"
        label="净损失总额（万元）"
        align="center"
      ></el-table-column>
    </el-table>
    <el-table
      v-if="listShow == 2"
      :data="tableData4"
      style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;"
    >
      <el-table-column prop="code" label="事件类型">
        <template slot-scope="scope">{{
          scope.row.code.toUpperCase()
        }}</template>
      </el-table-column>
      <el-table-column prop="name" label="损失事件数（件）">
        <template slot-scope="scope">
          <span
            :title="scope.row.name"
            class="textOverFlow"
            style="color: #4285F4;"
            @click="goDetail(scope.$index, scope.row)"
            >{{ scope.row.name == null ? "--" : scope.row.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="catName" label="损失总额（万元）">
        <template slot-scope="scope">
          <span :title="scope.row.catName" class="textOverFlow">{{
            scope.row.catName == null ? "--" : scope.row.catName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="回收总额（万元）" align="center">
        <template slot-scope="scope">
          <p
            v-for="item in JSON.parse(scope.row.value)"
            :class="{
              redBg: scope.row.rybStatus == 1,
              yellowBg: scope.row.rybStatus == 2,
              blueBg: scope.row.rybStatus == 3
            }"
            :title="item"
          >
            {{ item }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="objName"
        label="净损失总额（万元）"
        align="center"
      ></el-table-column>
    </el-table>
    <el-table
      v-if="listShow == 3"
      :data="tableData4"
      style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;"
    >
      <el-table-column prop="code" label="指标" align="center">
        <template slot-scope="scope">{{
          scope.row.code.toUpperCase()
        }}</template>
      </el-table-column>
      <el-table-column prop="name" label="2019Q1" align="center">
        <template slot-scope="scope">
          <span
            :title="scope.row.name"
            class="textOverFlow"
            style="color: #4285F4;"
            @click="goDetail(scope.$index, scope.row)"
            >{{ scope.row.name == null ? "--" : scope.row.name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="catName" label="2019Q2" align="center">
      </el-table-column>
      <el-table-column prop="value" label="2019Q3" align="center">
      </el-table-column>
      <el-table-column
        prop="objName"
        label="2019Q4"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="depName"
        label="合计（万元）"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="depName"
        label="同比增幅（%）"
        align="center"
      ></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      prev-text="上一页"
      next-text="下一页"
      :total="totalResults"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import Bus from "src/bus/bus.js";
import { mapState } from "vuex";
import { getUrlKey } from "src/utils/utils.js";
import qs from "qs";
export default {
  props: ["isFlag"],
  data() {
    return {
      currentPage: 1,
      tableData4: [],
      totalResults: 0,
      listShow: 1
    };
  },
  created() {
    //获取数据判断是否显示更多操作
    Bus.$off("formDatas");
    Bus.$on("formDatas", data => {
      this.totalResults = data.total == undefined ? 1 : data.total;
      this.tableData4 = [];
      this.tableData4 = data.instats == undefined ? [] : data.instats;
      this.currentPage = 1;
    });
    this.listShow = this.isFlag;
  },
  methods: {
    refresh() {
      var askData = JSON.parse(sessionStorage.getItem("askData"));
      this.axios
        .post("rmIndStass/indReportInfo", qs.stringify(askData))
        .then(res => {
          if (res.code == 200) {
            if (res.data != null) {
              this.totalResults = res.data.total;
              this.tableData4 = [];
              this.tableData4 =
                res.data.instats == undefined ? [] : res.data.instats;
            }
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        });
    },
    handleSizeChange(value) {
      var askData = JSON.parse(sessionStorage.getItem("askData"));
      askData.pageNum = value;
      sessionStorage.setItem("askData", JSON.stringify(askData));
      this.refresh();
    },
    handleCurrentChange(value) {
      var askData = JSON.parse(sessionStorage.getItem("askData"));
      askData.pageNum = value;
      sessionStorage.setItem("askData", JSON.stringify(askData));
      //下一页请求数据
      this.refresh();
    },
    // 详情
    goDetail(index, row) {
      var askData = JSON.parse(sessionStorage.getItem("askData"));
      this.$router.push({
        path: "/checkForm", //跳转的路径
        query: {
          //路由传参时push和query搭配使用 ，作用时传递参数
          indId: row.id,
          subDateEnd: askData.submissionDate
        }
      });
    }
  }
};
</script>
<style lang="css">
.el-tooltip__popper {
  max-width: 50%;
}
</style>
<style lang="scss">
#formSingleList {
  table tr:last-child td {
    border-bottom: none;
  }
  .el-table::before {
    background-color: transparent !important;
  }
  .el-table td .cell,
  .el-table__empty-text {
    font-weight: normal;
    cursor: pointer;
  }
  .textOverFlow {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .el-table__body-wrapper {
    background: #fff;
  }
  .el-pagination {
    text-align: center;
    padding-bottom: 50px;
    border: 0;
    margin-top: 20px;
  }
  .el-table::before {
    height: 0;
  }
  .el-table th {
    background: #f9f9f9;
    text-align: center;
  }
  .el-table .cell {
    text-align: center;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-pagination button,
  .el-pagination span:not([class*="suffix"]) {
    padding: 0 5px;
    font-size: 12px;
  }
  .moreBtn,
  .detailBtn {
    color: #4285f4;
    padding: 0 2px;
  }
  .detailBtn:hover,
  .moreBtn:hover {
    cursor: pointer;
  }
  .el-dropdown-menu--mini {
    width: 80px;
    text-align: center;
  }
  .jumpA {
    color: #fff;
    text-decoration: none;
  }
  .dealBtn {
    float: right;
    margin-right: 5px;
    width: 68px;
    height: 26px;
    padding: 0;
    font-size: 12px;
  }
  .redBg,
  .yellowBg,
  .blueBg {
    display: inline-block;
    color: #fff;
    padding: 2px 10px;
    border-radius: 2px;
    background: #ff6363;
    word-break: normal;
  }
  .yellowBg {
    background: #ffd824;
  }
  .blueBg {
    background: #4285f4;
  }
  .cell p {
    margin-bottom: 15px;
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
  }
  .cell p:last-child {
    margin-bottom: 0;
  }
}
</style>
