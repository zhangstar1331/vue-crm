<!-- 清单报表 -->
<template>
<div>
    <div style="padding-bottom:20px">
        <stepBar :bannerList="bannerList"></stepBar>
    </div>
    <div class="myTabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="监管检查信息报表" name="fifth" :key="'fifth'" v-if="btnData.supersivebtn"></el-tab-pane>
            <el-tab-pane label="行政处罚事先告知书（存量）" name="seventh" :key="'seventh'" v-if="btnData.punishNoticebtn"></el-tab-pane>
            <el-tab-pane label="监管处罚信息报表" name="first" :key="'first'" v-if="btnData.punishbtn"></el-tab-pane>
            <el-tab-pane label="涉刑案件信息报表" name="second" :key="'second'" v-if="btnData.justicebtn"></el-tab-pane>
            <el-tab-pane label="内部违规信息报表" name="third" :key="'third'" v-if="btnData.violationbtn"></el-tab-pane>
            <el-tab-pane label="问责信息报表" name="fourth" :key="'fourth'" v-if="btnData.accountbtn"></el-tab-pane>
            <el-tab-pane label="迟报错报表" name="sixth" :key="'sixth'" v-if="companySource == '1'&&btnData.missbtn"></el-tab-pane>
        </el-tabs>
    </div>
    <div class="tabShadowBox myForm clearFloat" style="min-height:20px">
        <div class="titIcon">
            <em></em>
            <span style="font-weight: 600;">筛选查询</span>
        </div>
        <el-form ref="form" :model="form" label-width="150px" size="mini" class="clearFloat">
            <el-col :span="8">
                <el-form-item :label="itemLabel.timeLable" :class="{'isPunishNotice1':activeName=='seventh'}">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.repDateBegin" :picker-options="reportStartLimit" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2" style="text-align:center">至</el-col>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.repDateEnd" :picker-options="reportEndLimit" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="activeName === 'second'">
                <el-form-item label="案件专报时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.startZbDate" value-format="yyyy-MM-dd" :picker-options="specialBeginLimit" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2" style="text-align:center">至</el-col>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.endZbDate" value-format="yyyy-MM-dd" :picker-options="specialEndLimit" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="8" v-show="activeName === 'first'">
                <el-form-item label="是否关联检查">
                    <el-select v-model="form.relate" placeholder>
                        <el-option v-for="item in relateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col> -->
            <el-col :span="8" v-show="activeName === 'fourth'">
                <el-form-item label="问责报表类型">
                    <el-select v-model="form.type" placeholder>
                        <el-option v-for="item in accountType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <treeOrg :label="itemLabel.orgLabel" ref="treeOrg" @orgChange="orgChange"></treeOrg>
            </el-col>
            <el-col :span="8" v-show="activeName === 'second'">
                <el-form-item label="是否问责">
                    <el-select v-model="form.isWz" placeholder>
                        <el-option v-for="item in isWzList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="activeName === 'first'||activeName === 'seventh'">
                <el-form-item label="实施主体类型">
                    <el-select v-model="form.subjectType" placeholder>
                        <el-option v-for="item in mainList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="activeName === 'first'">
                <el-form-item label="处罚类型">
                    <el-select v-model="form.punishType" placeholder>
                        <el-option v-for="item in punishList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="activeName === 'sixth'">
                <el-form-item label="报送事项">
                    <el-select v-model="form.category" placeholder>
                        <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-show="activeName === 'sixth'">
                <el-form-item label="错报类型">
                    <el-select v-model="form.missType" placeholder>
                        <el-option v-for="item in missType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="activeName === 'seventh'">
                <el-form-item label="是否存量行政处罚事先告知书" class="isPunishNotice1">
					<el-select v-model="form.stock">
                        <el-option v-for="item in ispunishNotice" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-button type="primary" class="search" size="mini" @click="getData(1)">查询</el-button>
        </el-form>
    </div>
    <div class="tabShadowBox" style="margin-top:20px">
        <div class="titIcon" style="margin-bottom:0px">
            <em></em>
            <span style="font-weight: 600;">结果查询</span>
        </div>
        <div class="clearFloat">
            <el-button type="primary" class="search" size="mini" style="margin-top:0px;margin-left:10px" @click="exportBtn(1)" v-if="btnData.isShow&&activeName === 'first'">导出问责</el-button>
            <el-button type="primary" class="search" size="mini" style="margin-top:0px" @click="exportBtn" v-if="btnData.isShow">导出</el-button>
        </div>
        <el-table :data="dataList" class="myTable">
            <el-table-column v-for="(item, index) in tableHeadFilter" :key="index" :fixed="item.fixed" align="center" :prop="item.prop" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true" :formatter="item.formatter">
            </el-table-column>
            <el-table-column align="center" label="操作" v-if="this.wzFormType=='0'">
                <template slot-scope="scope">
                    <span @click="show(scope.row)" class="tabSpan">详情</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align:center;margin-top:15px" background layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>
</template>

<script>
// 引入步骤条
import stepBar from "src/components/commonModel/stepBar";
//引入树形组件
import treeOrg from "src/components/commonModel/treeOrg1";
import qs from "qs";
import {
    mapState
} from 'vuex';
export default {
    props: [],
    components: {
        stepBar,
        treeOrg
    },
    data() {
        return {
            reportStartLimit: {
                disabledDate: time => {
                    if (this.form.repDateEnd) {
                        return time.getTime() >= new Date(this.form.repDateEnd).getTime();
                    }
                }
            },
            reportEndLimit: {
                disabledDate: time => {
                    if (this.form.repDateBegin) {
                        return time.getTime() < new Date(this.form.repDateBegin).getTime();
                    }
                }
            },
            specialBeginLimit: {
                disabledDate: time => {
                    if (this.form.endZbDate) {
                        return time.getTime() >= new Date(this.form.endZbDate).getTime();
                    }
                }
            },
            specialEndLimit: {
                disabledDate: time => {
                    if (this.form.startZbDate) {
                        return time.getTime() < new Date(this.form.startZbDate).getTime();
                    }
                }
            },
            bannerList: [],
            activeName: "first",
            form: {
                repDateBegin: "",
                repDateEnd: "",
                isWz: "",
                zt: "",
                subjectType:"",
                startZbDate: "",
                endZbDate: "",
                pageNo: 1,
                id: {},
                region: "全部",
                type: "0",
                category:"",//报送事项
                missType: "",//错报类型
                stock:"",
                punishType:""
            },
            formfirst: {},
            formsecond: {},
            formthird: {},
            formfourth: {},
            formfifth: {},
            formsixth: {},
            formseventh: {},
            dataList: [],
            currentPage:1,
            total: 0,
            isWzList: [{
                    value: "",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "是"
                },
                {
                    value: "0",
                    label: "否"
                }
            ],
            mainList: [{
                    value: "",
                    label: "全部"
                },
                {
                    value: "1",
                    label: "银保监系统"
                },
                {
                    value: "2",
                    label: "人民银行"
                },
                {
                    value: "3",
                    label: "财政部"
                },
                {
                    value: "4",
                    label: "审计署"
                },
                {
                    value: "5",
                    label: "其他"
                }
            ],
            orgCsList: [{
                    value: "1",
                    label: "没收违法所得"
                },
                {
                    value: "2",
                    label: "责令停业整顿"
                },
                {
                    value: "3",
                    label: "吊销金融（业务）许可证"
                },
                {
                    value: "4",
                    label: "限制保险业机构业务范围"
                },
                {
                    value: "5",
                    label: "责令保险业机构停止接收新业务"
                },
                {
                    value: "6",
                    label: "监管函"
                },
                {
                    value: "7",
                    label: "其他"
                }
            ],
            puninshType: [{
                    value: "1",
                    label: "行政处罚"
                },
                {
                    value: "2",
                    label: "监管函"
                },
                {
                    value: "3",
                    label: "行政监管措施"
                },
                {
                    value: "4",
                    label: "监管提示函"
                },
                {
                    value: "5",
                    label: "其他"
                }, 
                {
                    name: '行政监管措施',
                    id: '6'
                }
            ],
            tableHead: [{
                    prop: "sn",
                    label: "监管处罚信息编号",
                    tags: "first",
                    fixed: true,
                    width: 140,
                    isCompany:"0+1"
                },
                {
                    prop: "sn",
                    label: "案件信息编号",
                    tags: "second",
                    fixed: true,
                    width: 140
                },
                {
                    prop: "sn",
                    label: "内部违规事件编号",
                    tags: "third",
                    fixed: true,
                    width: 140
                },
                {
                    prop: "no",
                    label: "问责事件编号",
                    tags: "fourth",
                    fixed: true,
                    width: 200,
                    accountType: '0',
                },
                {
                    prop: "reason",
                    label: "问责事由",
                    tags: "fourth",
                    fixed: true,
                    width: 140,
                    accountType: '0',
                },
                {
                    prop: "cause",
                    label: "违规事由",
                    tags: "third",
                    fixed: true,
                    width: 140
                },
                {
                    prop: "occurDate",
                    label: "事件发现时间",
                    tags: "third",
                    width: 140
                },
                {
                    prop: "objType",
                    label: "问责对象类型",
                    tags: "fourth",
                    width: 160,
                    accountType: '0',
                    formatter: (row, column, val) => {
                        if (val === "1") {
                            return "集体问责";
                        } else if (val === "2") {
                            return "个人问责";
                        } else {
                            return "集体问责+个人问责";
                        }
                    }
                },
                {
                    prop: "itemType",
                    label: "问责事项类型",
                    tags: "fourth",
                    width: 140,
                    accountType: '0',
                    formatter: (row, column, val) => {
                        return val == null ? '--' : val == 1 ? '业务经营问责' : '案件责任追究'
                    }
                },
                {
                    prop: "time",
                    label: "问责时间",
                    tags: "fourth",
                    width: 120,
                    accountType: '0',
                },
                {
                    prop: "orgName",
                    label: "被问责/人员所属机构",
                    tags: "fourth",
                    width: 180,
                    accountType: '0',
                    formatter: (row, column, val) => {
                        return val == null || val == '' ? '' : val.substr(val.length - 1, 1) == '|' ? val.substr(0, val.length - 1) : val
                    }
                },
                {
                    prop: "involveCount",
                    label: "经济处罚涉及机构数量",
                    tags: "fourth",
                    width: 160,
                    accountType: '0',
                },
                {
                    prop: "accountabilityCount",
                    label: "经济处罚被问责机构数量",
                    tags: "fourth",
                    width: 180,
                    accountType: '0',
                },
                {
                    prop: "organDisposeCount",
                    label: "组织处理涉及人次",
                    tags: "fourth",
                    width: 140,
                    accountType: '0',
                },
                {
                    prop: "politicsDisposeCount",
                    label: "政纪处分涉及人次",
                    tags: "fourth",
                    width: 140,
                    accountType: '0',
                },
                {
                    prop: "partyDisposeCount",
                    label: "党纪处分涉及人次",
                    tags: "fourth",
                    width: 140,
                    accountType: '0',
                },
                {
                    prop: "economicsDisposeCount",
                    label: "经济处罚涉及人次",
                    tags: "fourth",
                    width: 140,
                    accountType: '0',
                },
                {
                    prop: "org",
                    label: "违规主体",
                    tags: "third"
                },
                {
                    prop: "fourthOrganization",
                    label: "四级机构",
                    tags: "third",
                    width: 120
                },
                {
                    prop: "losss",
                    label: "财产损失(财产)",
                    tags: "third"
                },
                {
                    prop: "name",
                    label: "案件名称",
                    tags: "second",
                    fixed: true,
                    width: 140
                },
                {
                    prop: "justiceType",
                    label: "案件类型",
                    tags: "second",
                    width: 140,
                    formatter: (row, column, val) => {
                        return val === null ? "" : val === "1" ? "业内案件" : "业外案件";
                    }
                },
                {
                    prop: "occurDate",
                    label: "案发时间",
                    tags: "second",
                    width: 140
                },
                {
                    prop: "reportDate",
                    label: "案件专报时间",
                    tags: "second",
                    width: 140
                },
                {
                    prop: "org",
                    label: "案件发生机构",
                    tags: "second",
                    width: 140
                },
                {
                    prop: "fourthOrg",
                    label: "四级机构",
                    tags: "second"
                },
                {
                    prop: "amount",
                    label: "涉案金额",
                    tags: "second"
                },
                {
                    prop: "lossAmount",
                    label: "损失金额",
                    tags: "second"
                },
                {
                    prop: "pt",
                    label: "处罚类型",
                    fixed: true,
                    tags: "first",
                    width: 100,
                    formatter: (row, column, val) => {
                        let data = this.puninshType.filter(item => val === item.value);
                        return data[0] && data[0].label;
                    },
                    isCompany:"0"
                },
                {
                    prop: "punishType",
                    label: "处罚类型",
                    fixed: true,
                    tags: "first",
                    width: 100,
                    formatter: (row, column, val) => {
                        let data = this.puninshType.filter(item => val === item.value);
                        return data[0] && data[0].label;
                    },
                    isCompany:"1"
                },
                {
                    prop: "cause",
                    label: "处罚事由",
                    fixed: true,
                    tags: "first",
                    width: 100,
                    isCompany:"0+1"
                },
                {
                    prop: "fileNo",
                    label: "监管处罚文件编号",
                    tags: "first",
                    width: 140,
                    isCompany:"0+1"
                },
                {
                    prop: "lkDate",
                    label: "监管处罚决定书落款时间",
                    tags: "first",
                    width: 180,
                    isCompany:"0"
                },
                {
                    prop: "lkDate",
                    label: "监管处罚决定书落款时间",
                    tags: "first",
                    width: 180,
                    formatter: (row, column, val) => {
                        return val == null ? '--' : val.substring(0,4)+'/'+val.substring(4,6)+'/'+val.substring(6,8)
                    },
                    isCompany:"1"
                },
                {
                    prop: "zt",
                    label: "实施主体类型",
                    tags: "first",
                    width: 110,
                    formatter: (row, column, val) => {
                        let data = this.mainList.filter(item => val === item.value);
                        return data[0] && data[0].label;
                    },
                    isCompany:"0"
                },
                {
                    prop: "subjectType",
                    label: "实施主体类型",
                    tags: "first",
                    width: 110,
                    formatter: (row, column, val) => {
                        let data = this.mainList.filter(item => val === item.value);
                        return data[0] && data[0].label;
                    },
                    isCompany:"1"
                },
                {
                    prop: "name",
                    label: "实施主体名称",
                    tags: "first",
                    width: 110,
                    isCompany:"0+1"
                },
                {
                    prop: "orgNames",
                    label: "被处罚机构",
                    tags: "first",
                    width: 200,
                    isCompany:"0"
                },
                {
                    prop: "orgName",
                    label: "被处罚机构",
                    tags: "first",
                    width: 200,
                    isCompany:"1"
                },
                {
                    prop: "orgAmts",
                    label: "机构处罚金额",
                    tags: "first",
                    width: 110,
                    isCompany:"0"
                },
                {
                    prop: "orgAmt",
                    label: "机构处罚金额",
                    tags: "first",
                    width: 110,
                    isCompany:"1"
                },
                {
                    prop: "orgCs",
                    label: "其他机构处罚措施",
                    tags: "first",
                    width: 140,
                    formatter: (row, column, val) => {
                        let data = this.orgCsList.filter(item => item.value === val);
                        return data[0] && data[0].label;
                    },
                    isCompany:"0"
                },
                {
                    prop: "orgCs",
                    label: "其他机构处罚措施",
                    tags: "first",
                    width: 140,
                    isCompany:"1"
                },
                {
                    prop: "personNames",
                    label: "被处罚个人",
                    tags: "first",
                    width: 100,
                    isCompany:"0"
                },
                {
                    prop: "personName",
                    label: "被处罚个人",
                    tags: "first",
                    width: 100,
                    isCompany:"1"
                },
                {
                    prop: "personAmts",
                    label: "个人处罚金额",
                    tags: "first",
                    width: 110,
                    isCompany:"0"
                },
                {
                    prop: "personAmt",
                    label: "个人处罚金额",
                    tags: "first",
                    width: 110,
                    isCompany:"1"
                },
                {
                    prop: "aType",
                    label: "是否整改",
                    tags: "third",
                    formatter: (row, column, val) => {
                        return this.formatData(val, "整改");
                    },
                    isCompany:"0+1"
                },
                {
                    prop: "aType",
                    label: "是否整改",
                    tags: "first",
                    formatter: (row, column, val) => {
                        return this.formatData(val, "整改");
                    },
                    isCompany:"0"
                },
                {
                    prop: "abarType",
                    label: "是否整改",
                    tags: "first",
                    formatter: (row, column, val) => {
                        return this.formatData(val, "整改");
                    },
                    isCompany:"1"
                },
                {
                    prop: "dType",
                    label: "是否问责",
                    tags: "second+third",
                    formatter: (row, column, val) => {
                        return this.formatData(val, "问责");
                    },
                    isCompany:"0+1"
                },
                {
                    prop: "dType",
                    label: "是否问责",
                    tags: "first",
                    formatter: (row, column, val) => {
                        return this.formatData(val, "问责");
                    },
                    isCompany:"0"
                },
                {
                    prop: "dutyType",
                    label: "是否问责",
                    tags: "first",
                    formatter: (row, column, val) => {
                        return this.formatData(val, "问责");
                    },
                    isCompany:"1"
                },
                {
                    prop: "sd",
                    label: "报送时间",
                    tags: "first",
                    width: 110,
                    isCompany:"0"
                },
                {
                    prop: "submitDate",
                    label: "报送时间",
                    tags: "first",
                    width: 110,
                    formatter: (row, column, val) => {
                        return val == null ? '--' : val.substring(0,4)+'/'+val.substring(4,6)+'/'+val.substring(6,8)
                    },
                    isCompany:"1"
                },
                {
                    prop: "sn",
                    label: "监管检查事项编号",
                    tags: "fifth",
                    width: 140,
                    isCompany:"0+1"
                },
                {
                    prop: "thingName",
                    label: "检查事项",
                    tags: "fifth",
                    width: 140,
                    isCompany:"0+1"
                },
                {
                    prop: "zt",
                    label: "实施主体类型",
                    tags: "fifth",
                    formatter: (row, column, val) => {
                        let data = this.mainList.filter(item => val === item.value);
                        return data[0] && data[0].label;
                    },
                    isCompany:"0"
                },
                {
                    prop: "subjectTypeName",
                    label: "实施主体类型",
                    tags: "fifth",
                    isCompany:"1"
                },
                {
                    prop: "name",
                    label: "实施主体名称",
                    tags: "fifth",
                    isCompany:"1"
                },
                {
                    prop: "org",
                    label: "被检查机构",
                    tags: "fifth",
                    width: 140,
                    isCompany:"0"
                },
                {
                    prop: "orgName",
                    label: "被检查机构",
                    tags: "fifth",
                    width: 140,
                    isCompany:"1"
                },
                {
                    prop: "startDate",
                    label: "检查开始时间",
                    tags: "fifth",
                    isCompany:"0"
                },
                {
                    prop: "startDate",
                    label: "检查开始时间",
                    tags: "fifth",
                    formatter: (row, column, val) => {
                        return val == null ? '--' : val.substring(0,4)+'/'+val.substring(4,6)+'/'+val.substring(6,8)
                    },
                    isCompany:"1",
                },
                {
                    prop: "endDate",
                    label: "检查结束时间",
                    tags: "fifth",
                    isCompany:"1",
                    formatter: (row, column, val) => {
                        return val == null ? '--' : val.substring(0,4)+'/'+val.substring(4,6)+'/'+val.substring(6,8)
                    },
                },
                {
                    prop: "resultTypeName",
                    label: "检查结果跟进",
                    tags: "fifth",
                    isCompany:"1"
                },
                {
                    prop: "accountIndex",
                    label: "序号",
                    tags: "fourth",
                    accountType: '1+2',
                    width: 80,
                    fixed: true
                },
                {
                    prop: "orgName",
                    label: "机构名称",
                    tags: "fourth",
                    accountType: '1',
                    width: 180,
                    fixed: true
                },
                {
                    prop: "des",
                    label: "问题描述",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "amount",
                    label: "问题涉及金额",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "happendDate",
                    label: "问题发生时间",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "findDate",
                    label: "发现问题的时间",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "jcType",
                    label: "发现问题的检查类别",
                    tags: "fourth",
                    accountType: '1',
                    width: 140
                },
                {
                    prop: "cfType",
                    label: "处分类型",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "fileNo",
                    label: "处分文件文号",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "xdDate",
                    label: "文件下达时间",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "xdOffice",
                    label: "处分下达机关",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "zxDate",
                    label: "处分执行时间",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "mark",
                    label: "备注",
                    tags: "fourth",
                    accountType: '1',
                    width: 120
                },
                {
                    prop: "orgName",
                    label: "单位名称",
                    tags: "fourth",
                    accountType: '2',
                    width: 180,
                    fixed: true
                },
                {
                    prop: "name",
                    label: "人员姓名",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "jobLevel",
                    label: "职级",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "politicsStatus",
                    label: "政治面貌",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "des",
                    label: "问题描述",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "amount",
                    label: "问题涉及金额",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "happendDate",
                    label: "问题发生时间",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "findDate",
                    label: "发现问题的时间",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "jcType",
                    label: "发现问题的检查类别",
                    tags: "fourth",
                    accountType: '2',
                    width: 140
                },
                {
                    prop: "zrType",
                    label: "责任类型",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "zzType",
                    label: "组织处理",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "zjType",
                    label: "政纪处分",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "djType",
                    label: "党纪处分",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "jjType",
                    label: "经济处罚类型",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "jjAmount",
                    label: "经济处罚金额（单位：元）",
                    tags: "fourth",
                    accountType: '2',
                    width: 180
                },
                {
                    prop: "other",
                    label: "其他处分",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "fileNo",
                    label: "处分文件文号",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "xdDate",
                    label: "文件下达时间",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "xdOffice",
                    label: "处分下达机关",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "zxDate",
                    label: "处分执行时间",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "mark",
                    label: "备注",
                    tags: "fourth",
                    accountType: '2',
                    width: 120
                },
                {
                    prop: "submitDate",
                    label: "报送日期",
                    tags: "sixth",
                    formatter: (row, column, val) => {
                        return val == null ? '--' : val.substring(0,4)+'/'+val.substring(4,6)+'/'+val.substring(6,8)
                    },
                },
                {
                    prop: "orgName",
                    label: "涉及机构",
                    tags: "sixth",
                    width: 140
                },
                {
                    prop: "company",
                    label: "所属分公司",
                    tags: "sixth"
                },
                {
                    prop: "category",
                    label: "报送事项",
                    tags: "sixth",
                    formatter: (row, column, val) => {
                        let data = this.category.filter(item => val === item.id);
                        return data[0] && data[0].name;
                    }
                },
                {
                    prop: "missDays",
                    label: "迟报天数",
                    tags: "sixth"
                },
                {
                    prop: "missType",
                    label: "错报类型",
                    tags: "sixth",
                    formatter: (row, column, val) => {
                        let data = this.missType.filter(item => val === item.id);
                        return data[0] && data[0].name;
                    }
                },
                {
                    prop: "sn",
                    label: "行政处罚事先告知书信息编号",
                    tags: "seventh",
                    width:"180"
                },
                {
                    prop: "punishType",
                    label: "拟处罚类型",
                    tags: "seventh",
                    width: 100,
                    formatter: (row, column, val) => {
                        let data = this.puninshType.filter(item => val === item.value);
                        return data[0] && data[0].label;
                    }
                },
                {
                    prop: "cause",
                    label: "拟处罚事由",
                    tags: "seventh",
                    width: 100
                },
                {
                    prop: "fileNo",
                    label: "行政处罚事先告知书文件编号",
                    tags: "seventh",
                    width: 180
                },
                {
                    prop: "lkDate",
                    label: "行政处罚事先告知书落款时间",
                    tags: "seventh",
                    width: 180,
                    formatter: (row, column, val) => {
                        return val == null ? '--' : val.substring(0,4)+'/'+val.substring(4,6)+'/'+val.substring(6,8)
                    },
                },
                {
                    prop: "subjectType",
                    label: "实施主体类型",
                    tags: "seventh",
                    width: 110,
                    formatter: (row, column, val) => {
                        let data = this.mainList.filter(item => val === item.value);
                        return data[0] && data[0].label;
                    }
                },
                {
                    prop: "name",
                    label: "实施主体名称",
                    tags: "seventh",
                    width: 110
                },
                {
                    prop: "orgName",
                    label: "拟被处罚机构",
                    tags: "seventh",
                    width: 200
                },
            ],
            accountType: [{
                id: '0',
                name: '问责事由统计表'
            }, {
                id: '1',
                name: '集体问责情况统计表'
            }, {
                id: '2',
                name: '个人问责情况统计表'
            }],
            btnData: {
                supersivebtn: false,
                supersiveEbtn: false,
                punishNoticebtn: false,
                punishNoticeEbtn: false,
                punishbtn: false,
                punishEbtn: false,
                justicebtn: false,
                justiceEbtn: false,
                violationbtn: false,
                violationEbtn: false,
                accountbtn: false,
                accountEbtn: false,
                missbtn: false,
                missEbtn: false,
                isShow: false,
            },
            wzFormType: '',
            missType: [{
                id: '',
                name: '全部'
            }, {
                id: '1',
                name: '无错报/漏报'
            }, {
                id: '2',
                name: '一般'
            }, {
                id: '3',
                name: '重大'
            }],
            category: [{
                id: '',
                name: '全部'
            }, {
                id: 1,
                name: '监管检查'
            }, {
                id: 2,
                name: '监管处罚'
            }, {
                id: 3,
                name: '涉刑案件'
            }, {
                id: 4,
                name: '内部违规'
            }, {
                id: 5,
                name: '问责'
            }, {
                id: 6,
                name: '案件风险'
            }, {
                id: 7,
                name: '行政处罚事先告知书'
            }],
            ispunishNotice:[{
                name: '全部',
                id:''
            }, {
                name: '存量',
                id: '1'
            }],
        };
    },
    computed: {
        ...mapState(['companySource',"punishList"]),
        tableHeadFilter() {
            return this.tableHead.filter(item => {
                if (this.activeName == 'fourth') {
                    return !item.tags || item.tags.includes(this.activeName) && item.accountType.includes(this.wzFormType)
                } else if(this.activeName == 'fifth'||this.activeName == 'first'){
                    return !item.tags || item.tags.includes(this.activeName) && item.isCompany.includes(this.companySource)
                } else {
                    return !item.tags || item.tags.includes(this.activeName)
                }
            })
        },
        //事件描述
        itemLabel() {
            switch (this.activeName) {
                case "first":
                    return {
                        timeLable: "处罚时间",
                            orgLabel: "被处罚机构"
                    };
                case "second":
                    return {
                        timeLable: "案件发生时间",
                            orgLabel: "案件发生机构"
                    };
                case "third":
                    return {
                        timeLable: "事件发生时间",
                            orgLabel: "违规主体"
                    };
                case "fourth":
                    var orgLabel = "被问责/人员所属机构"
                    if (this.form.type == '1') {
                        orgLabel = '被问责机构'
                    } else if (this.form.type == '2') {
                        orgLabel = '被问责个人所属机构'
                    }
                    return {
                        timeLable: "问责时间",
                        orgLabel: orgLabel
                    };
                case "fifth":
                    return {
                        timeLable: "检查开始时间",
                        orgLabel: "被检查机构"
                    };
                case "sixth":
                    return {
                        timeLable: "报送时间",
                        orgLabel: "涉及机构"
                    };
                case "seventh":
                    return {
                        timeLable: "行政处罚事先告知书落款时间",
                        orgLabel: "拟被处罚机构"
                    };
                default:
                    break;
            }
        },
        f1() {
            return this.$store.state.orgBtnData
        }
    },
    watch: {
        f1(newdata, olddata) {
            this.getBtnData(newdata)
        }
    },
    mounted() {
        //创建switchObj
        this.switchObj = {};
        //创建查询参
        this.queryData = {};
        //tab页签赋值
        let list = ["first", "second", "third", "fourth","fifth", "sixth","seventh"];
        if (JSON.parse(sessionStorage.getItem("searchData"))) {
            let searchData = JSON.parse(sessionStorage.getItem("searchData"))
            list.forEach((item,index) => {
                this["form" + item] = searchData[index]
            });
        } else{
            list.forEach(item => {
                this["form" + item] = {
                    ...this.form
                };
            });
        }
        // 详情返回
        var path = sessionStorage.getItem("statisPath");
        if (path == 1) {
            this.activeName = "first";
        } else if (path == 2) {
            this.activeName = "second";
        } else if (path == 3) {
            this.activeName = "third";
        } else if (path == 4) {
            this.activeName = "fourth";
        } else if (path == 6){
            this.activeName = "sixth";
        } else if (path == 7){
            this.activeName = "seventh";
        } else {
            this.activeName = "fifth";
        }
        this.handleClick({
            name: this.activeName
        });
        sessionStorage.removeItem("statisPath");
        this.getBtnData(this.$store.state.orgBtnData)
        //查询数据
        if(this.companySource == "1"){
            this.bannerList = ["合规信息管理", "台账"]
        } else{
            this.bannerList = ["合规信息管理", "合规信息清单报表"]
        }
    },
    methods: {
        getBtnData(handleData) {
            if (handleData !== undefined) {
                if (handleData.indexOf('1_hqdbbul') >= 0||handleData.indexOf('1_hqdbbulcx') >= 0) { //监管处罚信息列表
                    this.btnData.supersivebtn = true
                } else {
                    this.btnData.supersivebtn = false
                }
                if (handleData.indexOf('1_hqdbbuq') >= 0||handleData.indexOf('1_hqdbbuqcx') >= 0) { //监管处罚信息导出
                    this.btnData.supersiveEbtn = true
                } else {
                    this.btnData.supersiveEbtn = false
                }
                if (handleData.indexOf('1_hqdbbpnl') >= 0) { //监管处罚信息列表
                    if (!this.btnData.supersivebtn) {
                        this.activeName = 'seventh'
                        this.handleClick({
                            name: 'seventh'
                        })
                    }
                    this.btnData.punishNoticebtn = true
                } else {
                    this.btnData.punishNoticebtn = false
                }
                if (handleData.indexOf('1_hqdbbpnq') >= 0) { //监管处罚信息导出
                    this.btnData.punishNoticeEbtn = true
                } else {
                    this.btnData.punishNoticeEbtn = false
                }
                if (handleData.indexOf('1_hqdbbjl') >= 0) { //监管处罚信息列表
                    if (!this.btnData.punishNoticebtn&&!this.btnData.supersivebtn) {
                        this.activeName = 'first'
                        this.handleClick({
                            name: 'first'
                        })
                    }
                    this.btnData.punishbtn = true
                } else {
                    this.btnData.punishbtn = false
                }
                if (handleData.indexOf('1_hqdbbjq') >= 0) { //监管处罚信息导出
                    this.btnData.punishEbtn = true
                } else {
                    this.btnData.punishEbtn = false
                }
                if (handleData.indexOf('1_hqdbbsl') >= 0) { //涉刑案件信息列表
                    if (!this.btnData.punishNoticebtn&&!this.btnData.supersivebtn && !this.btnData.punishbtn) {
                        this.activeName = 'second'
                        this.handleClick({
                            name: 'second'
                        })
                    }
                    this.btnData.justicebtn = true
                } else {
                    this.btnData.justicebtn = false
                }
                if (handleData.indexOf('1_hqdbbsq') >= 0) { //涉刑案件信息导出
                    this.btnData.justiceEbtn = true
                } else {
                    this.btnData.justiceEbtn = false
                }
                if (handleData.indexOf('1_hqdbbnl') >= 0) { //内部违规信息列表
                    if (!this.btnData.punishNoticebtn&&!this.btnData.supersivebtn && !this.btnData.punishbtn && !this.btnData.justicebtn) {
                        this.activeName = 'third'
                        this.handleClick({
                            name: 'third'
                        })
                    }
                    this.btnData.violationbtn = true
                } else {
                    this.btnData.violationbtn = false
                }
                if (handleData.indexOf('1_hqdbbnq') >= 0) { //内部违规信息导出
                    this.btnData.violationEbtn = true
                } else {
                    this.btnData.violationEbtn = false
                }
                if (handleData.indexOf('1_hqdbbwl') >= 0) { //问责信息列表
                    if (!this.btnData.punishNoticebtn&&!this.btnData.supersivebtn && !this.btnData.punishbtn && !this.btnData.justicebtn && !this.btnData.violationbtn) {
                        this.activeName = 'fourth'
                        this.handleClick({
                            name: 'fourth'
                        })
                    }
                    this.btnData.accountbtn = true
                } else {
                    this.btnData.accountbtn = false
                }
                if (handleData.indexOf('1_hqdbbwq') >= 0) { //问责信息导出
                    this.btnData.accountEbtn = true
                } else {
                    this.btnData.accountEbtn = false
                }

                if (handleData.indexOf('1_hqdbbmklcx') >= 0) { //问责信息列表
                    if (!this.btnData.punishNoticebtn&&!this.btnData.supersivebtn && !this.btnData.punishbtn && !this.btnData.justicebtn && !this.btnData.violationbtn && !this.btnData.accountbtn) {
                        this.activeName = 'sixth'
                        this.handleClick({
                            name: 'sixth'
                        })
                    }
                    this.btnData.missbtn = true
                } else {
                    this.btnData.missbtn = false
                }
                if (handleData.indexOf('1_hqdbbmkpcx') >= 0) { //问责信息导出
                    this.btnData.missEbtn = true
                } else {
                    this.btnData.missEbtn = false
                }
            }
            this.switchType();
        },
        handleClick() {
            this.form = this["form" + this.activeName];
            this.$refs.treeOrg.form.org = ''
            this.$refs.treeOrg.form.mineStatus = []
            this.$refs.treeOrg.form.viewList = [];
            this.$refs.treeOrg.form.copy = []
            this.$refs.treeOrg.form.arrLabel = []
            this.$refs.treeOrg.$refs.tree.setCheckedKeys([])
            if (this.form.region && this.form.region !== '全部') {
                this.$refs.treeOrg.form.org = this.form.org
                this.$refs.treeOrg.form.mineStatus = this.form.region
                this.$refs.treeOrg.form.viewList = this.form.org.split(',')
                this.$refs.treeOrg.form.copy = this.form.region
                this.$refs.treeOrg.form.arrLabel = this.form.region
                this.$refs.treeOrg.$refs.tree.setCheckedKeys(this.form.org.split(','))
            }
            this.getData();
        },
        async getData(val) {
            this.switchType(val);
            let respond = await this.axios.post(
                this.switchObj.getListUrl,
                this.queryData, {
                    headers: {
                        "Content-Type": this.activeName === "fourth" ?
                            "application/x-www-form-urlencoded; charset=UTF-8" : "application/json"
                    }
                }
            );
            if (respond.code === 200) {
                if (respond.data.data !== null) {
                    respond.data.data.forEach((item, index) => {
                        item.accountIndex = index + 1
                    })
                    this.dataList = respond.data.data;
                } else {
                    this.dataList = []
                }
                this.currentPage = respond.data.currentPage
                this.total = respond.data.totalResults;
            }
        },
        show(row) {
            var path = "";
            if(this.companySource == "1"){
                if (this.activeName == "first") {
                    path = "/punishDetailCX";
                } else if (this.activeName == "second") {
                    path = "/justiceDetail";
                } else if (this.activeName == "third") {
                    path = "/violationDetail";
                } else if (this.activeName == "fourth") {
                    path = "/accountDetail";
                } else if (this.activeName == "fifth") {
                    path = "/superviseDetailCX";
                } else if (this.activeName == "sixth") {
                    switch(row.category){
                        case 1:
                            path = "/superviseDetailCX";
                            break
                    }
                } else if (this.activeName == "seventh") {
                    path = "/punishNoticeDetail";
                }
            } else{
                if (this.activeName == "first") {
                    path = "/punishDetail";
                } else if (this.activeName == "second") {
                    path = "/justiceDetail";
                } else if (this.activeName == "third") {
                    path = "/violationDetail";
                } else if (this.activeName == "fourth") {
                    path = "/accountDetail";
                } else if (this.activeName == "fifth") {
                    path = "/superviseDetail";
                }
            }
            this.$router.push({
                path: path, //跳转的路径
                query: {
                    //路由传参时push和query搭配使用 ，作用时传递参数
                    infoId: this.activeName == "sixth"?row.groupId:row.id,
                    flag: this.activeName == "sixth"?3:1,
                    sn: row.sn,
                    id: this.$route.query.id
                }
            });
            this.saveData()
        },
        //跳转指定页
        handleCurrentChange(val) {
            this.currentPage = val
            this.form.pageNo = val;
            this.saveData()
            this.getData();
        },
        switchType(val) {
            this.queryData = {
                ...this.form,
                region: this.form.region === "全部" ? "" : this.form.region,
                org: this.form.org,
                startDate: this.formatDate(this.form.repDateBegin), //开始时间
                endDate: this.formatDate(this.form.repDateEnd), //结束时间
                startZbDate: this.formatDate(this.form.startZbDate), //案件专报开始时间
                endZbDate: this.formatDate(this.form.endZbDate), //案件专报结束时间
                subject: this.form.org,
                pageSize: 10, //每页条数
            };
            this.wzFormType = this.queryData.type
            if (val) {
                this.form.pageNo = 1
                this.queryData.pageNo = 1
            }
            this.saveData()
            //问责信息报表参数序列化
            if (this.activeName === "fourth") {
                this.queryData = qs.stringify(this.queryData);
            }
            switch (this.activeName) {
                case "fifth":
                    if(this.companySource == "1"){
                        this.switchObj = {
                            getListUrl: "/cx_supervise/query",
                            exportUrl: "/cx_supervise/export",
                            exportFileName: "监管检查台账报表"
                        };
                        this.queryData.status = 1
                        this.queryData.beginDate = this.formatDate(this.form.repDateBegin)
                        for (let key in this.queryData){
                            if(!this.queryData[key]){
                                delete this.queryData[key]
                            }
                            delete this.queryData.startDate
                            delete this.queryData.repDateBegin
                            delete this.queryData.repDateEnd
                            delete this.queryData.id
                            delete this.queryData.type
                        }
                    } else{
                        this.switchObj = {
                            getListUrl: "/supervise/list",
                            exportUrl: "/supervise/export",
                            exportFileName: "监管检查信息清单报表"
                        };
                    }
                    if (this.btnData.supersiveEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "seventh":
                    this.switchObj = {
                        getListUrl: "/cx_penalizeNotice/query",
                        exportUrl: "/cx_penalizeNotice/export",
                        exportFileName: "行政处罚事先告知书台账报表"
                    };
                    this.queryData.status = 1
                    this.queryData.beginDate = this.formatDate(this.form.repDateBegin)
                    for (let key in this.queryData){
                        if(!this.queryData[key]){
                            delete this.queryData[key]
                        }
                        delete this.queryData.startDate
                        delete this.queryData.repDateBegin
                        delete this.queryData.repDateEnd
                        delete this.queryData.id
                        delete this.queryData.type
                    }
                    if (this.btnData.punishNoticeEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "first":
                    if(this.companySource == "1"){
                        this.switchObj = {
                            getListUrl: "/cx_penalize/query",
                            exportUrl: "/cx_penalize/exportBaseList",
                            exportUrlWZ: "/cx_penalize/exportWzList",
                            exportFileName: "监管处罚台账报表",
                            exportFileNameWZ: "监管处罚问责报表"
                        };
                        this.queryData.status = 1
                        this.queryData.beginDate = this.formatDate(this.form.repDateBegin)
                        for (let key in this.queryData){
                            if(!this.queryData[key]){
                                delete this.queryData[key]
                            }
                            delete this.queryData.startDate
                            delete this.queryData.repDateBegin
                            delete this.queryData.repDateEnd
                            delete this.queryData.id
                            delete this.queryData.type
                        }
                    } else{
                        this.switchObj = {
                            getListUrl: "/penalize/list",
                            exportUrl: "/penalize/export",
                            exportFileName: "监管处罚信息清单报表"
                        };
                    }
                    if (this.btnData.punishEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "second":
                    this.switchObj = {
                        getListUrl: "/justice/list",
                        exportUrl: "/justice/export",
                        exportFileName: "涉刑案件信息清单报表"
                    };
                    if (this.btnData.justiceEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "third":
                    this.switchObj = {
                        getListUrl: "/violate/list",
                        exportUrl: "/violate/export",
                        exportFileName: "内部违规信息清单报表"
                    };
                    if (this.btnData.violationEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "sixth":
                    this.switchObj = {
                        getListUrl: "/cx_supervise/listMark",
                        exportUrl: "/cx_supervise/exportMark",
                        exportFileName: "迟报错台账报表"
                    };
                    this.queryData.beginDate = this.formatDate(this.form.repDateBegin)
                    for (let key in this.queryData){
                        if(!this.queryData[key]){
                            delete this.queryData[key]
                        }
                        delete this.queryData.startDate
                        delete this.queryData.repDateBegin
                        delete this.queryData.repDateEnd
                        delete this.queryData.id
                        delete this.queryData.type
                    }
                    if (this.btnData.supersiveEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                default:
                    var exportFileName = '问责事由统计表'
                    if (this.form.type == '1') {
                        exportFileName = '集体问责情况统计表'
                    } else if (this.form.type == '2') {
                        exportFileName = '个人问责情况统计表'
                    }
                    this.switchObj = {
                        getListUrl: "/compliance/findComplianceSubReportList",
                        exportUrl: "/compliance/exporAccountability",
                        exportFileName: exportFileName
                    };
                    if (this.btnData.accountEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
            }
        },
        formatData(value, label) {
            if (value === "1") {
                return "已" + label;
            } else if (value === "0") {
                return "未" + label;
            } else {
                return "--";
            }
        },
        formatDate(value) {
            return value && value.replace(/-/g, "");
        },
        exportBtn(type) {
            this.switchType();
            var path = type==1?this.switchObj.exportUrlWZ:this.switchObj.exportUrl
            var name = type==1?this.switchObj.exportFileNameWZ:this.switchObj.exportFileName
            this.axios.post(path, this.queryData, {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": this.activeName === "fourth" ?
                        "application/x-www-form-urlencoded; charset=UTF-8" : "application/json"
                }
            })
            .then(res => {
                this.fileDownload(res, name + ".xlsx");
            });
        },
        fileDownload(data, fileName) {
            let blob = new Blob([data], {
                type: "application/octet-stream"
            });
            let filename = fileName || "filename.xls";
            if (typeof window.navigator.msSaveBlob !== "undefined") {
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var blobURL = window.URL.createObjectURL(blob);
                var tempLink = document.createElement("a");
                tempLink.style.display = "none";
                tempLink.href = blobURL;
                tempLink.setAttribute("download", filename);
                if (typeof tempLink.download === "undefined") {
                    tempLink.setAttribute("target", "_blank");
                }
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobURL);
            }
        },
        orgChange(org) {
            this.form = this["form" + this.activeName];
            this.form.id = {
                ...org.id
            };
            this.form.org = org.id
            this.form.region = org.region
            this.saveData()
        },
        saveData(){
            let arr = [this.formfirst, this.formsecond, this.formthird, this.formfourth, this.formfifth, this.formsixth, this.formseventh]
            sessionStorage.searchData = JSON.stringify(arr)
        }
    },
    beforeRouteLeave(to, from, next) {
        let arr = ['superviseDetail', 'punishDetail', 'punishNoticeDetail','justiceDetail', 'violationDetail', 'accountDetail','superviseDetailCX', 'punishDetailCX']
        if (arr.indexOf(to.name) < 0) {
            sessionStorage.removeItem("searchData");
        }
        next()
    }
};
</script>

<style lang="less" scoped>
.tabSpan {
    color: #4285f4;
    cursor: pointer;
}
</style>
<style lang="scss">
    .isPunishNotice1{
        .el-form-item__label{
            width:210px!important;
        }
        .el-form-item__content{
           margin-left:210px!important;
        }   
    }
</style>
