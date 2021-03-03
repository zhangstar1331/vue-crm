<!-- 损失事件统计 -->
<template>
  <div>
    <div style="margin-bottom:20px">
      <stepBar :bannerList="bannerList"></stepBar>
    </div>
    <div class="myTabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          label="按发生机构"
          name="first"
          :key="'first'"
          v-if="btnData.orgbtn"
        ></el-tab-pane>
        <el-tab-pane
          label="按事件类型"
          name="second"
          :key="'second'"
          v-if="btnData.eventbtn"
        ></el-tab-pane>
        <el-tab-pane
          label="按时间维度"
          name="third"
          :key="'third'"
          v-if="btnData.timebtn"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tabShadowBox myForm clearFloat" style="min-height:20px">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">损失事件统计</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        size="mini"
        class="clearFloat"
      >
        <el-col :span="8">
          <treeOrg
            label="事件所属公司"
            ref="treeOrg"
            @orgChange="orgChange"
          ></treeOrg>
        </el-col>
        <el-col :span="8" v-show="this.activeName === 'second'">
          <el-form-item label="事件类型">
            <el-select v-model="form.eventType" clearable>
              <el-option
                v-for="item in eventTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事件发生期间">
            <el-col :span="11">
              <el-date-picker
                :clearable="activeName !== 'third'"
                :type="activeName === 'third' ? 'month' : 'date'"
                placeholder="选择日期"
                v-model="form.subDateBegin"
                :picker-options="starDatePicker"
                :value-format="
                  activeName === 'third' ? 'yyyy-MM' : 'yyyy-MM-dd'
                "
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align:center">至</el-col>
            <el-col :span="11">
              <el-date-picker
                :clearable="activeName !== 'third'"
                :type="activeName === 'third' ? 'month' : 'date'"
                placeholder="选择日期"
                v-model="form.subDateEnd"
                :picker-options="endDatePicker"
                :value-format="
                  activeName === 'third' ? 'yyyy-MM' : 'yyyy-MM-dd'
                "
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-button type="primary" class="search" size="mini" @click="searchData"
          >查询</el-button
        >
      </el-form>
    </div>
    <div class="tabShadowBox" style="margin-top:20px">
      <div class="titIcon" style="margin-bottom:0px">
        <em></em>
        <span style="font-weight: 600;">损失事件统计结果</span>
      </div>
      <div class="clearFloat" v-if="activeName == 'first'">
        <el-button
          type="primary"
          class="search"
          size="mini"
          style="margin-top:0px"
          @click="exportData"
          v-if="btnData.orgexportbtn"
          >导出</el-button
        >
      </div>
      <div class="clearFloat" v-if="activeName == 'second'">
        <el-button
          type="primary"
          class="search"
          size="mini"
          style="margin-top:0px"
          @click="exportData"
          v-if="btnData.eventexportbtn"
          >导出</el-button
        >
      </div>
      <div class="clearFloat" v-if="activeName == 'third'">
        <el-button
          type="primary"
          class="search"
          size="mini"
          style="margin-top:0px"
          @click="exportData"
          v-if="btnData.timeexportbtn"
          >导出</el-button
        >
      </div>
      <el-table :data="form.dataList" class="myTable">
        <el-table-column
          v-for="(item, index) in tableHeadFilter"
          :key="index"
          align="center"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 引入步骤条
import stepBar from "src/components/commonModel/stepBar";
//引入树形组件
import treeOrg from "src/components/commonModel/treeOrg";
export default {
  props: [],
  components: {
    stepBar,
    treeOrg
  },
  data() {
    return {
      starDatePicker: {
        disabledDate: time => {
          if (this.form.subDateEnd) {
            if (this.activeName !== "third") {
              return time.getTime() >= new Date(this.form.subDateEnd).getTime();
            } else {
              return (
                time.getTime() >= new Date(this.form.subDateEnd).getTime() ||
                time.getTime() <=
                  new Date(this.form.subDateEnd).getTime() -
                    365 * 3 * 24 * 60 * 60 * 1000
              );
            }
          }
        }
      },
      endDatePicker: {
        disabledDate: time => {
          if (this.form.subDateBegin) {
            if (this.activeName !== "third") {
              return (
                time.getTime() <= new Date(this.form.subDateBegin).getTime()
              );
            } else {
              return (
                time.getTime() <=
                  new Date(this.form.subDateBegin).getTime() +
                    30 * 24 * 60 * 60 * 1000 ||
                time.getTime() >=
                  new Date(this.form.subDateBegin).getTime() +
                    365 * 3 * 24 * 60 * 60 * 1000
              );
            }
          }
        }
      },
      bannerList: ["损失事件管理", "损失事件统计"],
      activeName: "first",
      form: {
        subDateBegin: "",
        subDateEnd: "",
        eventType: "",
        dataList: [],
        region: "",
        id: {
          level_1: "",
          level_2: "",
          level_3: ""
        }
      },
      formfirst: {},
      formsecond: {},
      formthird: {},
      eventTypeList: [
        {
          value: "1",
          label: "外部事件"
        },
        {
          value: "2",
          label: "业务活动"
        },
        {
          value: "3",
          label: "业外案件"
        },
        {
          value: "4",
          label: "业内案件"
        },
        {
          value: "5",
          label: "行政处罚"
        },
        {
          value: "6",
          label: "人员风险"
        },
        {
          value: "7",
          label: "信息系统风险"
        },
        {
          value: "8",
          label: "流程风险"
        }
      ],
      type: {},
      tableHead: [
        {
          prop: "losscp",
          label: "事件所属公司",
          tags: "first"
        },
        {
          prop: "target",
          label: "指标",
          tags: "third"
        },
        {
          prop: "hjg",
          label: "事件发生机构",
          tags: "first",
          formatter: (row, column, val) => {
            return val || "--";
          }
        },
        {
          prop: "bjg",
          label: "分支机构",
          tags: "first",
          formatter: (row, column, val) => {
            return val || "--";
          }
        },
        {
          prop: "tname",
          label: "事件类型",
          tags: "second"
        },
        {
          prop: "counts",
          label: "损失事件数(件)",
          tags: "first+second"
        },
        {
          prop: "allLoss_money",
          label: "损失总额(万元)",
          tags: "first+second"
        },
        {
          prop: "allrece_money",
          label: "回收总额(万元)",
          tags: "first+second"
        },
        {
          prop: "allnet_money",
          label: "净损失总额(万元)",
          tags: "first+second"
        },
        {
          prop: "countTotal",
          label: "合计(万元)",
          tags: "third"
        },
        {
          prop: "mincreace",
          label: "同比增幅(%)",
          tags: "third",
          formatter: (row, column, val) => {
            return val === "Infinity" || !val ? "--" : val;
          }
        }
      ],
      tableHeadCopy: [],
      btnData:{
        orgbtn:false,
        orgexportbtn:false,
        eventbtn:false,
        eventexportbtn:false,
        timebtn:false,
        timeexportbtn:false,
      }
    };
  },
  created() {
    this.formfirst = { ...this.form };
    this.formsecond = { ...this.form };
    this.formthird = { ...this.form };
    this.form = this.formfirst;
    this.tableHeadCopy = [...this.tableHead];
    this.getData(this.$store.state.orgBtnData)
  },
  mounted() {
    this.$nextTick(() => {
      this.searchData();
    });
  },
  computed: {
    tableHeadFilter() {
      //切换tab页面
      return this.tableHead.filter(
        item => !item.tags || item.tags.includes(this.activeName)
      );
    },
    f1(){
      return this.$store.state.orgBtnData
    }
  },
  watch:{
    f1(newdata,olddata){
      this.getData(newdata)
    }
  },
  methods: {
    // 权限
    getData(handleData){
        if(handleData !== undefined){
            if(handleData.indexOf('1_lsjtja')>=0){//机构查询
              this.btnData.orgbtn = true
            }else{
              this.btnData.orgbtn = false
            }
            if(handleData.indexOf('1_lsjtjb')>=0){//导出
              this.btnData.orgexportbtn = true
            }else{
              this.btnData.orgexportbtn = false
            }
            if(handleData.indexOf('1_lsjtjc')>=0){//事件查询
              if(!this.btnData.orgbtn){
                this.activeName = 'second'
                this.handleClick({name:'second'})
              }
              this.btnData.eventbtn = true
            }else{
              this.btnData.eventbtn = false
            }
            if(handleData.indexOf('1_lsjtjd')>=0){//事件导出
              this.btnData.eventexportbtn = true
            }else{
              this.btnData.eventexportbtn = false
            }
            if(handleData.indexOf('1_lsjtje')>=0){//时间查询
              if(!this.btnData.orgbtn&&!this.btnData.eventbtn){
                this.activeName = 'third'
                this.handleClick({name:'third'})
              }
              this.btnData.timebtn = true
            }else{
              this.btnData.timebtn = false
            }
            if(handleData.indexOf('1_lsjtjf')>=0){//时间导出
              this.btnData.timeexportbtn = true
            }else{
              this.btnData.timeexportbtn = false
            }
          }
    },
    handleClick() {
      this.form = this["form" + this.activeName];
      this.$refs.treeOrg.form.region = this.form.region;
      this.$refs.treeOrg.id = { ...this.form.id };
      this.searchData();
    },
    // 分类判断赋值
    typeData() {
      let orgTree = this.$refs.treeOrg;
      let urlParam = `btime=
				${this.form.subDateBegin}&etime=${this.form.subDateEnd}&LOSS_ONE_ID=
				${orgTree.id.level_1}&LOSS_TWO_ID=${orgTree.id.level_2}&LOSS_THREE_ID=
				${orgTree.id.level_3}`;
      switch (this.activeName) {
        case "first":
          this.type = {
            getDataUrl: "/lossevent/getStatisticsByHjg?" + urlParam,
            exportUrl: "/lossevent/exporttStatisticsByHjg?" + urlParam
          };
          break;
        case "second":
          this.type = {
            getDataUrl:
              "/lossevent/getStatisticsByEtype?" +
              urlParam +
              "&etype=" +
              this.form.eventType,
            exportUrl:
              "/lossevent/exporttStatisticsByEtype?" +
              urlParam +
              "&etype=" +
              this.form.eventType
          };
          break;
        default:
          this.type = {
            getDataUrl: "/lossevent/getStatisticsByTime?" + urlParam,
            exportUrl: "/lossevent/exporttStatisticsByTime?" + urlParam
          };
      }
    },
    async searchData() {
      if (this.activeName === "third") {
        this.form.subDateBegin =
          this.form.subDateBegin || new Date().getFullYear() + "-01";
        this.form.subDateEnd =
          this.form.subDateEnd || new Date().getFullYear() + "-12";
      }
      // 获取表格数据
      this.typeData();
      let respond = await this.axios.get(this.type.getDataUrl);
      if (this.activeName !== "third") {
        if (this.activeName === "first") {
          this.form.dataList = respond.rlist || [];
          respond.hline && this.form.dataList.unshift(respond.hline);
          respond.eline && this.form.dataList.push(respond.eline);
        } else {
          this.form.dataList = respond;
        }
      } else {
        if(JSON.stringify(respond) !== "{}"){
          this.dataHandle(respond)
        }else{
          this.form.dataList = [];
          this.tableHead = [...this.tableHeadCopy];
        }
      }
    },
    //导出
    exportData() {
      this.typeData();
      window.location.href = this.serveUrl + this.type.exportUrl;
    },
    //数据处理
    dataHandle(data) {
      let that = this;
      this.form.dataList = [];
      this.tableHead = [...this.tableHeadCopy];
      data.totalLine.reverse().forEach((item, index) => {
        let headProp;
        headProp = parseInt(item.split("Q")[1]) * 3;
        let [subDateBegin, subDateEnd] = [
          this.form.subDateBegin.split("-")[1],
          this.form.subDateEnd.split("-")[1]
        ];
        let head = {
          prop: item,
          label: `${item}(${
            index === data.totalLine.length-1
              ? subDateBegin >= 10
                ? subDateBegin
                : subDateBegin.replace(/0/, "")
              : headProp - 2
          }-${
            index === 0
              ? subDateEnd >= 10
                ? subDateEnd
                : subDateEnd.replace(/0/, "")
              : headProp
          })`,
          tags: "third"
        };
        that.tableHead.splice(2, 0, head);
      });
      let targetList = [
        "损失事件数（件）",
        "损失总额（万元）",
        "回收总额（万元）",
        "净损失总额（万元）"
      ];
      targetList.forEach(target => {
        this.form.dataList.push({
          target
        });
      });
      let key = [];
      let valueList = [
        "totalEventCount",
        "totalLossMoney",
        "totalReceiveMoney",
        "totalinfactMoney"
      ];
      for (let i = 0; i < data.totalLine.length + 2; i++) {
        valueList.forEach((value, index) => {
          key[index] = Object.keys(data[value][i])[0];
          this.form.dataList[index][key[index]] = data[value][i][key[index]];
        });
      }
    },
    orgChange(org) {
      this.form.id = { ...org.id };
      this.form.region = org.region;
    }
  }
};
</script>
<style lang="less" scoped></style>
