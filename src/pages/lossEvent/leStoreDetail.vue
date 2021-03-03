<!-- 损失事件库详情 -->
<template>
  <div id="leStoreDetail">
    <backBanner :bannerList="bannerList" route="leStoreAall"></backBanner>
    <div class="shadowBox" style="margin-top:72px;min-height:60px">
      <div class="lossNo">
        损失事件编号：
        <span>{{lossNo}}</span>
      </div>
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">事件名称</span>
      </div>
      <el-col :span="12">
        <div>事件名称：{{form.eventName}}</div>
      </el-col>
      <el-col :span="12">
        <div>是否关联合规信息：{{form.compInfo}}</div>
      </el-col>
    </div>
    <div class="shadowBox" style="min-height:60px">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">事件时间</span>
      </div>
      <el-col :span="12">
        <div>事件发生时间：{{form.happenTime}}</div>
      </el-col>
      <el-col :span="12">
        <div>事件报告时间：{{form.reportTime}}</div>
      </el-col>
    </div>
    <div class="shadowBox" style="min-height:60px">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">事件所属机构</span>
      </div>
      <el-col :span="12">
        <div>事件所属公司：{{form.company}}</div>
      </el-col>
      <el-col :span="12">
        <div>事件涉及部门：{{form.department}}</div>
      </el-col>
    </div>
    <div class="shadowBox" style="min-height:386px">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">事件描述</span>
      </div>
      <el-col :span="12">
        <div>
          <span class="colName">事件类型：</span>
          {{form.eventType}}
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span class="colName">发现方式：</span>
          {{form.findType}}
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span class="colName">文件依据：</span>
          {{form.documentBasis}}
        </div>
        <div class="annex">
          <i class="el-icon-paperclip"></i>
          <span>附件：{{form.annex}}</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span class="colName">是否属于重大风险事件：</span>
          {{form.majorRisks}}
        </div>
        <div class="annex">
          <i class="el-icon-paperclip"></i>
          <span>附件：{{form.annexOther}}</span>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span class="colName">事件描述：</span>
          {{form.findType}}
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span class="colName">已采取措施：</span>
          {{form.measure}}
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span class="colName">未来损失预测：</span>
          {{form.measure}}
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <span class="colName">下一步拟采取措施：</span>
          {{form.measure}}
        </div>
      </el-col>
    </div>
    <div class="shadowBox">
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">事件损失明细<i class='el-icon-question' style='color:#4285f4;margin-left:5px'></i></span>
      </div>
      <div class="lossDetails">
        <div class="detailsTitle">
          损失总额(A){{form.damagesAmount}}
          <span>(A=A1+A2+A3+A4+A5+A6+A7)</span>
        </div>
        <div class="detailsList">
          <div
            class="listBox"
            v-for="(item,index) in damagesAmountList"
            :key="index"
            :class="{hasBorder:item.border}"
          >
            <div class="listTitle">{{item.type}}</div>
            <div class="listContent">
              <span>{{item.title}}：</span>
              <span>{{form[item.value]}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="lossDetails">
        <div class="detailsTitle bodderBottom">追回金额</div>
        <div class="detailsList">
          <div class="listBox" style='border-top:0px'>
            <div class="listTitle">B</div>
            <div class="listContent">
              <span>法律成本：</span>
              <span>{{}}</span>
            </div>
          </div>
          <div class="listBox" style='border-top:0px'>
            <div class="listTitle">E</div>
            <div class="listContent">
              <span>监管罚没：</span>
              <span>{{}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="lossDetails">
        <div class="detailsTitle bodderBottom">净损失金额信息<span>(D=A+C-B-E)</span></div>
        <div class="detailsList">
          <div class="listBox" style='border-right:1px solid #ddd;border-top:0px'>
            <div class="listTitle">D</div>
            <div class="listContent">
              <span>法律成本：</span>
              <span>{{}}</span>
            </div>
          </div>
        </div>
      </div>
      <div>备注：</div>
    </div>
    <div class="shadowBox" style='margin-bottom:20px'>
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
            v-for="(item,index) in tableHead"
            :key="index"
          ></el-table-column>
        </el-table>
        <div style="display:flex;justify-content:center;margin-top:15px">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            prev-text="上一页"
            next-text="下一页"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backBanner from "src/components/commonModel/backBanner";
export default {
  props: [],
  components: {
    backBanner
  },
  data() {
    return {
      bannerList: ["损失事件管理", "损失事件库", "损失事件详情"],
      lossNo: "LCD123456",
      form: {
        eventName: null,
        compInfo: null,
        happenTime: null,
        reportTime: null,
        company: null,
        department: null,
        eventDes: null,
        eventType: null,
        findType: null,
        documentBasis:
          "请填写损失事件正式的内外部文件依据，如监管行政处罚文号、公司OA系统文号",
        annex: null,
        measure: null,
        lossPrediction: null,
        nextMeasure: null,
        majorRisks: null,
        annexOther: null,
        damagesAmount: null,
        legalCost: "1000000",
        regulatoryFines: null,
        lossAssets: null,
        externalCompensation: null,
        recourseFailure: null,
        bookImpairment: null,
        otherLosses: null,
        estimatedLoss: null,
        estimatedAmount: null,
        remark: "11111111111111",
        netLossAmount: null
      },
      damagesAmountList: [
        {
          title: "法律成本",
          value: "legalCost",
          type: "A1"
        },
        {
          title: "监管罚没",
          value: "regulatoryFines",
          type: "A2"
        },
        {
          title: "资产损失",
          value: "lossAssets",
          type: "A3"
        },
        {
          title: "对外赔偿",
          value: "externalCompensation",
          type: "A4"
        },
        {
          title: "追索失败",
          value: "recourseFailure",
          type: "A5"
        },
        {
          title: "账面减值",
          value: "bookImpairment",
          type: "A6",
          border: true
        },
        {
          title: "其他损失",
          value: "otherLosses",
          type: "A7"
        },
        {
          title: "预计还会发生的损失",
          value: "estimatedLoss",
          type: "C"
        }
      ],
      tableHead: [
        {
          label: "损失事件编号",
          prop: "lossEventNo"
        },
        {
          label: "事件名称",
          prop: "eventName"
        },
        {
          label: "报送时间",
          prop: "reportTime"
        },
        {
          label: "维护时间",
          prop: "repairTime"
        }
      ],
      tableData: [{}],
      currentPage: 1,
      total: 50
    };
  },
  computed: {},
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {}
  }
};
</script>
<style lang='less' scoped>
.lossNo {
  height: 40px;
  display: inline-block;
  padding: 2px 10px;
  position: absolute;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  top: 15px;
  right: 10px;
  span {
    color: #ccc;
  }
}
.borderBox {
  border: 1px solid #ccc;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    width: 50%;
  }
}
/deep/.borderFormi {
  .el-row {
    border: 1px solid #ccc;
    padding: 20px;
    margin-bottom: 30px;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-input__inner {
      border: 0px solid #fff;
    }
    .rowDiv {
      font-size: 14px;
      color: #606266;
    }
  }
}
#leStoreDetail {
  .colName {
    display: inline-block;
    width: 135px;
    text-align: right;
    margin-right: 5px;
    text-align-last: justify;
  }
  .el-col {
    padding: 5px 0 25px 0;
  }
  .annex {
    margin: 20px 0 0 142px;
    i {
      margin-right: 5px;
    }
  }
  .lossDetails {
    width: 100%;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }
  .detailsTitle {
    width: 100%;
    height: 49px;
    line-height: 49px;
    text-align: center;
    font-weight: bold;
    background-color: #f9f9f9;
    font-size: 14px;
    span {
      font-size: 12px;
    }
  }
  .detailsList {
    display: flex;
    flex-wrap: wrap;
    .listBox {
      height: 50px;
      box-sizing: border-box;
      width: 33.333%;
      border-top: 1px solid #ddd;
      div {
        display: inline-block;
      }
      .listTitle {
        width: 50px;
        height: 49px;
        background-color: #f9f9f9;
        text-align: center;
        line-height: 49px;
        font-size: 14px;
      }
      .listContent {
        margin-left: 20px;
        position: relative;
        //top:-20px;
      }
    }
    .hasBorder {
      border-bottom: 1px solid #ddd;
    }
  }
  .bodderBottom {
    border-bottom: 1px solid #ddd;
  }
}
</style>