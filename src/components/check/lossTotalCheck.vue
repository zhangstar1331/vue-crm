<template>
  <div id="lossCheck">
    <el-form ref="form" size="mini" :inline="true">
      <template>
        <div class="ids">
          <el-form
            :model="quoteAssignForm"
            label-position="left"
            ref="quoteAssignForm"
            size="mini"
          >
            <el-row v-if="checkShow == 3">
              <el-col :span="7">
                <el-form-item label="事件所属公司">
                  <el-select
                    v-model="application.region"
                    @change="changeApply"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in application.unitsData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align: right;">
                <el-form-item label="报送部门">
                  <el-select
                    v-model="testDepartment.region"
                    @change="changeDepart"
                    placeholder="请选择检测部门"
                  >
                    <el-option
                      v-for="item in testDepartment.unitsData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col id="timeDuring" :span="9">
                <el-form-item label="事件发生期间" align="right">
                  <el-date-picker
                    v-model="quoteAssignForm.subDateBegin"
                    @change="changeBegin"
                    type="date"
                    placeholder="报送批次"
                    :picker-options="starDatePicker"
                  >
                  </el-date-picker>
                  <div style="float: left;margin:0 10px">至</div>
                  <el-date-picker
                    v-model="quoteAssignForm.subDateEnd"
                    @change="changeEnd"
                    type="date"
                    placeholder="报送批次"
                    :picker-options="endDatePicker"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-button type="primary" class="search" @click="searchData"
                >查询</el-button
              >
            </el-row>
            <el-row v-if="checkShow == 1 || checkShow == 2">
              <el-col :span="7" v-if="checkShow == 2">
                <el-form-item label="事件类型">
                  <el-select v-model="typemap.region">
                    <el-option
                      v-for="item in typemap.unitsData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="事件所属公司">
                  <el-select v-model="application.region" ref="comSelect">
                    <el-option
                      style="height:auto;background-color:#fff;"
                    >
                      <el-tree
                        :props="insprops"
                        :key="treeKey"
                        ref="tree"
                        :expand-on-click-node="false"
                        @node-click="handleNodeClick"
                        :load="loadNode"
                        lazy
                        node-key="id"
                      ></el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col id="timeDuring" :span="10">
                <el-form-item label="事件发生期间" align="left">
                  <el-date-picker
                    v-model="quoteAssignForm.subDateBegin"
                    @change="changeBegin"
                    type="month"
                    placeholder="报送批次"
                    :picker-options="starDatePicker"
                  >
                  </el-date-picker>
                  <div style="float: left;margin:0 10px">至</div>
                  <el-date-picker
                    v-model="quoteAssignForm.subDateEnd"
                    @change="changeEnd"
                    type="month"
                    placeholder="报送批次"
                    :picker-options="endDatePicker"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-button type="primary" class="search" @click="searchData"
                >查询</el-button
              >
            </el-row>
          </el-form>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
import Bus from "src/bus/bus.js";
import { formatDate } from "src/utils/utils.js";
import qs from "qs";
export default {
  props: ["isFlag"],
  data() {
    return {
      quoteAssignForm: {
        quoteName: "", //指标名称
        subDateBegin: "",
        subDateEnd: ""
      },
      disabeldEndYear: "",
      application: {
        region: "",
        id:null,
      },
      typemap: {
        region: "类型",
        unitsData: [
          {
            id: "1",
            name: "外部事件"
          },
          {
            id: "2",
            name: "业务活动"
          },
          {
            id: "3",
            name: "业外案件"
          },
          {
            id: "4",
            name: "业内活动"
          },
          {
            id: "5",
            name: "行政处罚"
          },
          {
            id: "6",
            name: "人员风险"
          },
          {
            id: "7",
            name: "信息系统风险"
          },
          {
            id: "8",
            name: "流程风险"
          }
        ]
      },
      treeKey: "",
      insprops: {
        label: "name",
        isLeaf: false,
        id: ""
      },
      testDepartment: {
        region: "集团",
        unitsData: []
      },
      //	        starDatePicker1:{
      //	        	disabledDate: (time) => {
      //	        		return time.getTime() > Date.now();
      //	        	}
      //	        },
      starDatePicker: {
        disabledDate: time => {
          if (this.quoteAssignForm.subDateEnd != "") {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.quoteAssignForm.subDateEnd
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return (
            time.getTime() < this.quoteAssignForm.subDateBegin ||
            time.getTime() > Date.now()
          );
        }
      },
      checkData: {
        subDateBegin: null,
        subDateEnd: null,
        pageNo: "1",
        pageSize: "10"
      }
    };
  },
  created() {
    // 获取适用对象、监测部门、报送批次数据
    this.getCommon();
    this.searchData();
    this.checkShow = this.isFlag;
  },
  methods: {
    handleNodeClick(node) {
			this.application.region = node.name;
			this.application.id = node.id || node.groupId
      this.$refs.comSelect.blur();
    },
    //加载数据
    async loadNode(node, resolve) {
      //获取第一层数据
      if (node.level == 0) {
        let respond = await this.axios.get("lossincident/companyInfo");
        if (respond.code === 200) {
          resolve(respond.data);
        }
      } else {
        //获取第二、三层数据
        let respondTwo = await this.axios.get(
          `lossincident/namesByPids?groupId=${node.data.groupId}&status=1`
        );
        if (respondTwo.code === 200 && respondTwo.data) {
          resolve(respondTwo.data);
        } else {
          resolve([]);
        }
      }
    },
    //适用对象
    changeApply(val) {
      this.checkData.applayObject = val;
      // 获取报送部门
      if (val !== "") {
        this.getDepartMent(val);
      }
      sessionStorage.askData = JSON.stringify(this.checkData);
    },
    //监测部门
    changeDepart(val) {
      this.checkData.monitorDepartment = val;
      sessionStorage.askData = JSON.stringify(this.checkData);
    },
    //开始时间
    changeBegin(val) {
      if (val != null) {
        this.checkData.subDateBegin = formatDate(val, "yyyy-MM");
        this.checkData.subDateBegin = this.checkData.subDateBegin
          .split("-")
          .join("");
      } else {
        this.checkData.subDateBegin = "";
      }
    },
    //结束时间
    changeEnd(val) {
      if (val != null) {
        this.checkData.subDateEnd = formatDate(val, "yyyy-MM");
        this.checkData.subDateEnd = this.checkData.subDateEnd
          .split("-")
          .join("");
      } else {
        this.checkData.subDateEnd = "";
        this.starDatePicker = {
          disabledDate: time => {
            return time.getTime() > Date.now();
          }
        };
      }
    },
    // 获取适用对象、监测部门、报送批次数据
    getCommon() {
      this.axios
        .post("indjob/comm", qs.stringify({}), {
          headers: { "Content-Type": "application/json" }
        })
        .then(res => {
          if (res.code == 200) {
            // 适用对象
            this.application.unitsData = this.application.unitsData.concat(
              res.data.company
            );
            this.taskName = res.data.codpNames;
            sessionStorage.setItem("taskName", JSON.stringify(this.taskName));
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        });
    },
    // 报送部门根据适用对象变化
    getDepartMent(str) {
      this.axios
        .post("indicator/department", qs.stringify({ company: str }))
        .then(res => {
          if (res.code == 200) {
            if (res.data != null) {
              this.testDepartment.region = "全部";
              this.checkData.monitorDepartment = "";
              this.testDepartment.unitsData = [{ name: "全部", id: "" }];
              this.testDepartment.unitsData = this.testDepartment.unitsData.concat(
                res.data
              );
            } else {
              this.testDepartment.region = "全部";
              this.checkData.monitorDepartment = "";
              this.testDepartment.unitsData = [{ name: "全部", id: "" }];
            }
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        });
    },
    searchData() {
      // 获取表格数据
      if (this.isFlag == "1") {
        this.checkData.submission = 1;
      } else if (this.isFlag == "2") {
        this.checkData.submission = 2;
      } else if (this.isFlag == "3") {
        this.checkData.submission = 0;
      }
      sessionStorage.askData = JSON.stringify(this.checkData);
      this.axios
        .post("indjob/joblist", qs.stringify(this.checkData))
        .then(res => {
          if (res.code == 200) {
            if (res.data != null) {
              Bus.$emit("formDatas", res.data);
            } else {
              Bus.$emit("formDatas", []);
            }
          } else {
            this.$alert(res.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        });
    }
  }
};
</script>

<style lang="scss">
#lossCheck {
  .el-input-group__append {
    background: #4285f4;
    width: 20%;
    text-align: center;
    font-size: 16px;
    color: #fff;
  }
  .el-col .el-input input {
    height: 32px;
    line-height: 32px;
  }
  .el-form-item {
    margin-right: 18px;
    margin-bottom: 20px;
    width: 100%;
    .el-form-item__content {
      .el-select--mini {
        width: 100%;
      }
      .el-date-editor {
        width: 130px;
        float: left;
      }
    }
  }
  .el-form-item__content {
    width: 70%;
  }
  #timeDuring {
    .el-form-item__content {
      width: initial;
    }
  }
  .search {
    float: right;
    width: 68px;
    height: 26px;
    margin-top: 5px;
    margin-right: 5px;
    padding: 0;
    font-size: 12px;
  }
}
</style>
