<!-- 统计报表 -->
<template>
<div>
    <div style="margin-bottom:20px">
        <stepBar :bannerList="bannerList"></stepBar>
    </div>
    <div class="myTabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="监管检查信息报表" name="fifth" :key="'fifth'" v-if="btnData.supervisebtn"></el-tab-pane>
            <el-tab-pane label="行政处罚事先告知书" name="sixth" :key="'sixth'" v-if="btnData.punishNoticebtn"></el-tab-pane>
            <el-tab-pane label="监管处罚信息报表" name="first" :key="'first'" v-if="btnData.punishbtn"></el-tab-pane>
            <el-tab-pane label="按险种统计" name="seventh" :key="'seventh'" v-if="companySource == '1'"></el-tab-pane>
            <!-- <el-tab-pane label="按险种统计" name="sixth" :key="'seventh'" v-if="btnData.insurebtn"></el-tab-pane> -->
            <el-tab-pane label="按处罚事由统计" name="eighth" :key="'eighth'" v-if="companySource == '1'"></el-tab-pane>
            <el-tab-pane label="涉刑案件信息报表" name="second" :key="'second'" v-if="btnData.justicebtn"></el-tab-pane>
            <el-tab-pane label="内部违规信息报表" name="third" :key="'third'" v-if="btnData.violationbtn"></el-tab-pane>
            <el-tab-pane label="问责信息报表" name="fourth" :key="'fourth'" v-if="btnData.accountbtn"></el-tab-pane>
        </el-tabs>
    </div>
    <div class="tabShadowBox myForm clearFloat" style="min-height:20px">
        <div class="titIcon">
            <em></em>
            <span style="font-weight: 600;">筛选查询</span>
        </div>
        <el-form ref="form" :model="form" label-width="150px" size="mini" class="clearFloat">
            <el-col :span="8">
                <treeOrg label="统计单位" ref="treeOrg"></treeOrg>
            </el-col>
            <el-col :span="8">
                <el-form-item label="统计时间">
                    <el-col :span="11">
                        <el-date-picker type="year" placeholder="选择日期" v-model="form.repDateBegin" :picker-options="reportStartLimit" value-format="yyyy" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2" style="text-align:center">至</el-col>
                    <el-col :span="11">
                        <el-date-picker type="year" placeholder="选择日期" v-model="form.repDateEnd" :picker-options="reportEndLimit" value-format="yyyy" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="activeName === 'fourth'">
                <el-form-item label="问责对象类型">
                    <el-select v-model="form.implementType" placeholder>
                        <el-option v-for="item in implementTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
			<el-col :span="8" v-if="activeName === 'first'||activeName === 'sixth'||activeName === 'eighth'">
                <el-form-item label="险种">
					<el-select v-model="form.insuranceType">
                        <el-option v-for="item in insureList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="activeName === 'first'">
                <el-form-item label="处罚类型">
					<el-select v-model="form.punishType">
                        <el-option v-for="item in punishList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="activeName === 'sixth'">
                <el-form-item label="拟处罚类型">
					<el-select v-model="form.punishType">
                        <el-option v-for="item in punishList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="activeName === 'sixth'">
                <el-form-item label="是否存量行政处罚事先告知书" class="isPunishNotice">
					<el-select v-model="form.stock">
                        <el-option v-for="item in ispunishNotice" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8" v-if="activeName === 'seventh'">
                <el-form-item label="合规类型">
                    <el-select v-model="form.hgType">
                        <el-option v-for="item in hgList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
			<el-col :span="8" v-if="activeName === 'seventh'&&form.hgType =='2'">
                <el-form-item label="处罚类型">
					<el-select v-model="form.punishType">
                        <el-option v-for="item in punishList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-button type="primary" class="search" size="mini" @click="getData">查询</el-button>
        </el-form>
    </div>
    <div class="tabShadowBox" style="margin-top:20px">
        <div class="titIcon" style="margin-bottom:0px">
            <em></em>
            <span style="font-weight: 600;">结果查询</span>
        </div>
        <div class="clearFloat">
            <el-button type="primary" class="search" size="mini" style="margin-top:0px" @click="exportBut" v-if="btnData.isShow">导出</el-button>
        </div>
        <el-table :data="form.dataList" class="myTable">
            <el-table-column v-for="(item, index) in tableHeadFilter" :key="index" align="center" :prop="item.prop" :label="item.label" :formatter="item.formatter" :min-width="item.width">
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
import {fileDownload} from 'src/utils/utils.js'
import qs from 'qs'
import { mapActions, mapState } from 'vuex';
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
                        return time.getTime() <= new Date(this.form.repDateBegin).getTime();
                    }
                }
            },
            bannerList: [],
            activeName: "first",
            form: {
                repDateBegin: "",
                repDateEnd: "",
                implementType: "",
                dataList: [],
                hgType:"2",
				punishType:"",
                insuranceType:"",
                stock:""
            },
            formfirst: {},
            formsecond: {},
            formthird: {},
            formfourth: {},
            formfifth: {},
            formsixth: {},
            formseventh: {},
            formeighth: {},
            implementTypeList: [{
                    value: "",
                    label: "全部"
                },
                {
                    value: "0",
                    label: "集体问责"
                },
                {
                    value: "1",
                    label: "个人问责"
                }
            ],
            tableHead: [
                {
                    prop: "losscp",
                    label: "统计单位",
                    tags: "third+fourth+seventh+eighth"
                },
                {
                    prop: "losscp",
                    label: "统计单位",
                    tags: "first",
                    isCompany:"0"
                },
                {
                    prop: "lossOneName",
                    label: "统计单位",
                    tags: "fifth",
                    isCompany:"0"
                },
                {
                    prop: "firstOrg",
                    label: "统计单位",
                    tags: "first+fifth",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    isCompany:"1"
                },
                {
                    prop: "firstOrg",
                    label: "统计单位",
                    tags: "sixth",
                    formatter: (row, column, val) => {
                        return val || "--";
                    }
                },
                {
                    prop: "losscp",
                    label: "子公司",
                    tags: "second"
                },
                {
                    prop: "hjg",
                    label: "分支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "second+third+fourth+seventh+eighth"
                },
                {
                    prop: "hjg",
                    label: "分支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "first",
                    isCompany:"0"
                },
                {
                    prop: "lossTwoName",
                    label: "分支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "fifth",
                    isCompany:"0"
                },
                {
                    prop: "secondOrg",
                    label: "分支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "first+fifth",
                    isCompany:"1"
                },
                {
                    prop: "secondOrg",
                    label: "分支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "sixth"
                },
                {
                    prop: "bjg",
                    label: "中支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "second+third+fourth+seventh+eighth"
                },
                {
                    prop: "bjg",
                    label: "中支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "first",
                    isCompany:"0"
                },
                {
                    prop: "lossThreeName",
                    label: "中支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "fifth",
                    isCompany:"0"
                },
                {
                    prop: "thirdOrg",
                    label: "中支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "first+fifth",
                    isCompany:"1"
                },
                {
                    prop: "thirdOrg",
                    label: "中支机构",
                    formatter: (row, column, val) => {
                        return val || "--";
                    },
                    tags: "sixth"
                },
                {
                    prop: "counter",
                    label: "年度累计问责数量",
                    tags: "fourth"
                },
                {
                    prop: "bwzjgsl",
                    label: "被问责机构数量",
                    tags: "fourth"
                },
                {
                    prop: "bwzrcsl",
                    label: "被问责人次数量",
                    tags: "fourth"
                },
                {
                    prop: "zzcfrc",
                    label: "累计组织处分人次",
                    tags: "fourth"
                },
                {
                    prop: "jlcfrc",
                    label: "累计政纪处分人次",
                    tags: "fourth"
                },
                {
                    prop: "djcfrc",
                    label: "累计党纪处分人次",
                    tags: "fourth"
                },
                {
                    prop: "jjcfrc",
                    label: "累计经济处分人次",
                    tags: "fourth"
                },
                {
                    prop: "counter",
                    label: "年度累计违规事件数量",
                    tags: "third"
                },
                {
                    prop: "lossmoney",
                    label: "累计造成的财产损失(万元)",
                    tags: "third"
                },
                {
                    prop: "innercount",
                    label: "年度累计业内案件数量",
                    tags: "second",
                    width: 120
                },
                {
                    prop: "innersamoney",
                    label: "涉案金额(万元)",
                    tags: "second"
                },
                {
                    prop: "innerlossmoney",
                    label: "损失金额(万元)",
                    tags: "second"
                },
                {
                    prop: "innerwzcount",
                    label: "已问责案件数量",
                    tags: "second"
                },
                {
                    prop: "outercount",
                    label: "年度累计业外案件数量",
                    tags: "second",
                    width: 120
                },
                {
                    prop: "outersamoney",
                    label: "涉案金额(万元)",
                    tags: "second"
                },
                {
                    prop: "outerlossmoney",
                    label: "损失金额(万元)",
                    tags: "second"
                },
                {
                    prop: "outerwzcount",
                    label: "已问责案件数量",
                    tags: "second"
                },
                {
                    prop: "counts",
                    label: "年度累计合规处罚事件数量",
                    tags: "first",
                    width: 190,
                    isCompany:"0+1"
                },
                {
                    prop: "jgfine",
                    label: "机构罚款金额",
                    tags: "first",
                    isCompany:"0+1"
                },
                {
                    prop: "pefine",
                    label: "个人罚款金额",
                    tags: "first",
                    isCompany:"0+1"
                },
                {
                    prop: "warnc",
                    label: "警告人次",
                    tags: "first",
                    isCompany:"0+1"
                },
                {
                    prop: "cz",
                    label: "撤职人次",
                    tags: "first",
                    isCompany:"0+1"
                },
                {
                    prop: "",
                    label: "检查时间",
                    tags: "first",
                    formatter: (row, column, val) => {
                        return this.timeFormat(row);
                    },
                    isCompany:"0+1"
                },
                {
                    prop: "",
                    label: "案件发生时间",
                    tags: "second",
                    formatter: (row, column, val) => {
                        return this.timeFormat(row);
                    }
                },
                {
                    prop: "",
                    label: "事件发现时间",
                    tags: "third",
                    formatter: (row, column, val) => {
                        return this.timeFormat(row);
                    }
                },
                {
                    prop: "",
                    label: "问责时间",
                    tags: "fourth",
                    formatter: (row, column, val) => {
                        return this.timeFormat(row);
                    }
                },
                {
                    prop: "yBCount",
                    label: "银保监系统检查次数",
                    tags: "fifth",
                    isCompany:"0"
                },
                {
                    prop: "ybjCount",
                    label: "银保监系统检查次数",
                    tags: "fifth",
                    isCompany:"1"
                },
                {
                    prop: "noYBCount",
                    label: "非银保监系统检查次数",
                    tags: "fifth",
                    isCompany:"0"
                },
                {
                    prop: "noYbjCount",
                    label: "非银保监系统检查次数",
                    tags: "fifth",
                    isCompany:"1"
                },
                {
                    prop: "resultCount",
                    label: "已收到检查结果",
                    tags: "fifth",
                    isCompany:"0+1"
                },
                {
                    prop: "resultCfjgCount",
                    label: "受到行政处罚或者其他监管措施次数",
                    tags: "fifth",
                    isCompany:"0",
                    width:"100"
                },
                {
                    prop: "punishCount",
                    label: "受到行政处罚或者其他监管措施次数",
                    tags: "fifth",
                    isCompany:"1",
                    width:"100"
                },
                {
                    prop: "count",
                    label: "累计行政处罚事项告知书",
                    tags: "sixth",
                    width:"100"
                },
                {
                    prop: "orgAmt",
                    label: "拟机构罚款金额",
                    tags: "sixth"
                },
                {
                    prop: "personAmt",
                    label: "拟个人罚款金额",
                    tags: "sixth"
                },
                {
                    prop: "alertCount",
                    label: "拟警告人次",
                    tags: "sixth"
                },
                {
                    prop: "dismissCount",
                    label: "拟撤职人次",
                    tags: "sixth"
                },
                {
                    prop: "",
                    label: "检查时间",
                    tags: "sixth",
                    formatter: (row, column, val) => {
                        return this.timeFormat1();
                    }
                },
                {
                    prop: "",
                    label: "全部险种",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "车险",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "农险",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "财产险",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "责任险",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "信用保证",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "健康险",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "意外险",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "其他险种",
                    tags: "seventh"
				},
				{
                    prop: "",
                    label: "全部处罚事由",
                    tags: "eighth"
				},
				{
                    prop: "",
                    label: "行政处罚",
                    tags: "eighth"
				},
				{
                    prop: "",
                    label: "监管函",
                    tags: "eighth"
				},
				{
                    prop: "",
                    label: "监管意见书",
                    tags: "eighth"
				},
				{
                    prop: "",
                    label: "监管提示函",
                    tags: "eighth"
				},
				{
                    prop: "",
                    label: "其他监管措施或文件",
                    tags: "eighth"
				},
            ],
            btnData: {
                supervisebtn: false,
                superviseEbtn: false,
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
                insurebtn:false,
                insureEbtn:false,
                causebtn:false,
                causeEbtn:false,
                isShow: false,
            },
            hgList: [
                {
                    value: "1",
                    label: "合规检查"
                },
                {
                    value: "2",
                    label: "监管处罚"
                },
                {
                    value: "3",
                    label: "涉刑案件"
                }
			],
			hgpunishList: [{
				value: "",
				label: "全部"
			},
			{
				value: "0",
				label: "合规检查"
			},
			{
				value: "1",
				label: "监管处罚"
			},
			{
				value: "2",
				label: "涉刑案件"
            }],
            ispunishNotice:[{
                name: '全部',
                id:''
            }, {
                name: '存量',
                id: '1'
            }],
            insureList: [{
                name: '全部',
                id: ''
            }, {
                name: '车险',
                id: '1'
            }, {
                name: '农险',
                id: '2'
            }, {
                name: '财产险',
                id: '3'
            }, {
                name: '责任险',
                id: '4'
            }, {
                name: '信用保证保险',
                id: '5'
            }, {
                name: '健康险',
                id: '6'
            }, {
                name: '意外险',
                id: '7'
            }, {
                name: '其他险种',
                id: '9'
            }],
        };
    },
    computed: {
        ...mapState(['companySource',"punishList"]),
        tableHeadFilter() {
            return this.tableHead.filter(item => {
                if (this.activeName == 'fifth' || this.activeName == 'first'){
                    return !item.tags || item.tags.includes(this.activeName) && item.isCompany.includes(this.companySource)
                } else{
                    return !item.tags || item.tags.includes(this.activeName)
                }
            })
        },
        f1() {
            return this.$store.state.orgBtnData
        },
    },
    watch: {
        f1(newdata, olddata) {
            this.getBtnData(newdata)
        }
    },
    mounted() {
        this.form.repDateBegin = new Date().getFullYear() + ''
        this.form.repDateEnd = new Date().getFullYear() + ''
        //创建switchObj
        this.switchObj = {};
        this.switchType();
        //tab页签赋值
        let list = ["fifth", "first", "second", "third", "fourth","sixth","seventh","eighth"];
        list.forEach(item => {
            this["form" + item] = {
                ...this.form
            };
        });
        this.activeName = 'fifth'
        this.getBtnData(this.$store.state.orgBtnData)
        this.$nextTick(() => {
            this.getData();
        });
        if(this.companySource == "1"){
            this.bannerList = ["合规信息管理", "历年情况统计"]
        } else{
            this.bannerList = ["合规信息管理", "合规信息统计"]
        }
    },
    methods: {
        getBtnData(handleData) {
            if (handleData !== undefined) {
                if (handleData.indexOf('1_htjbbul') >= 0||handleData.indexOf('1_htjbbulcx') >= 0) { //监管处罚信息列表
                    this.btnData.supervisebtn = true
                } else {
                    this.btnData.supervisebtn = false
                }
                if (handleData.indexOf('1_htjbbuq') >= 0||handleData.indexOf('1_htjbbuqcx') >= 0) { //监管处罚信息导出
                    this.btnData.superviseEbtn = true
                } else {
                    this.btnData.superviseEbtn = false
                }

                if (handleData.indexOf('1_htjbbpnl') >= 0) { //监管处罚信息列表
                    if (!this.btnData.supervisebtn) {
                        this.activeName = 'sixth'
                        this.handleClick({
                            name: 'sixth'
                        })
                    }
                    this.btnData.punishNoticebtn = true
                } else {
                    this.btnData.punishNoticebtn = false
                }
                if (handleData.indexOf('1_htjbbpnq') >= 0) { //监管处罚信息导出
                    this.btnData.punishNoticeEbtn = true
                } else {
                    this.btnData.punishNoticeEbtn = false
                }
                if (handleData.indexOf('1_htjbbl') >= 0) { //监管处罚信息列表
                    if (!this.btnData.punishNoticebtn && !this.btnData.supervisebtn) {
                        this.activeName = 'first'
                        this.handleClick({
                            name: 'first'
                        })
                    }
                    this.btnData.punishbtn = true
                } else {
                    this.btnData.punishbtn = false
                }
                if (handleData.indexOf('1_htjbbq') >= 0) { //监管处罚信息导出
                    this.btnData.punishEbtn = true
                } else {
                    this.btnData.punishEbtn = false
                }
                // if (handleData.indexOf('1_htjbbl') >= 0) { //监管处罚信息列表
                //     if (!this.btnData.punishbtn && !this.btnData.punishNoticebtn && !this.btnData.supervisebtn) {
                //         this.activeName = 'seventh'
                //         this.handleClick({
                //             name: 'seventh'
                //         })
                //     }
                //     this.btnData.insurebtn = true
                // } else {
                //     this.btnData.insurebtn = false
                // }
                // if (handleData.indexOf('1_htjbbq') >= 0) { //监管处罚信息导出
                //     this.btnData.insureEbtn = true
                // } else {
                //     this.btnData.insureEbtn = false
                // }
                if (handleData.indexOf('1_htjbbsl') >= 0) { //涉刑案件信息列表
                    if (!this.btnData.punishNoticebtn &&!this.btnData.supervisebtn && !this.btnData.punishbtn) {
                        this.activeName = 'second'
                        this.handleClick({
                            name: 'second'
                        })
                    }
                    this.btnData.justicebtn = true
                } else {
                    this.btnData.justicebtn = false
                }
                if (handleData.indexOf('1_htjbbsq') >= 0) { //涉刑案件信息导出
                    this.btnData.justiceEbtn = true
                } else {
                    this.btnData.justiceEbtn = false
                }
                if (handleData.indexOf('1_htjbbnl') >= 0) { //内部违规信息列表
                    if (!this.btnData.punishNoticebtn &&!this.btnData.supervisebtn && !this.btnData.punishbtn && !this.btnData.justicebtn) {
                        this.activeName = 'third'
                        this.handleClick({
                            name: 'third'
                        })
                    }
                    this.btnData.violationbtn = true
                } else {
                    this.btnData.violationbtn = false
                }
                if (handleData.indexOf('1_htjbbnq') >= 0) { //内部违规信息导出
                    this.btnData.violationEbtn = true
                } else {
                    this.btnData.violationEbtn = false
                }
                if (handleData.indexOf('1_htjbbwl') >= 0) { //问责信息列表
                    if (!this.btnData.punishNoticebtn &&!this.btnData.supervisebtn && !this.btnData.punishbtn && !this.btnData.justicebtn && !this.btnData.violationbtn) {
                        this.activeName = 'fourth'
                        this.handleClick({
                            name: 'fourth'
                        })
                    }
                    this.btnData.accountbtn = true
                } else {
                    this.btnData.accountbtn = false
                }
                if (handleData.indexOf('1_htjbbwq') >= 0) { //问责信息导出
                    this.btnData.accountEbtn = true
                } else {
                    this.btnData.accountEbtn = false
                }
            }
            this.switchType();
        },
        switchType() {
            let treeOrg = this.$refs.treeOrg;
            let btime = this.form.repDateBegin || new Date().getFullYear();
            let etime = this.form.repDateEnd || new Date().getFullYear();
            let url = `btime=${btime}&etime=${etime}&LOSS_ONE_ID=${treeOrg.id.level_1}&LOSS_TWO_ID=${treeOrg.id.level_2}&LOSS_THREE_ID=${treeOrg.id.level_3}`;
            switch (this.activeName) {
                case "fifth":
                    if(this.companySource == "1"){
                        url = `beginDate=${btime+'0101'}&endDate=${etime+'1231'}&org=${treeOrg.form.id}`;
                        this.switchObj.getDataUrl =
                        `cx_supervise/stat?` + url;
                        this.switchObj.exportUrl =
                        `cx_supervise/exportStat?` + url;
                        this.switchObj.exportFileName = "监管检查历年情况统计报表"
                    } else{
                        this.switchObj.getDataUrl =
                        `complianceStatistics/getStatisticsBySupervise?` + url;
                        this.switchObj.exportUrl =
                        `/complianceStatistics/exportStatisticsByJgjc?` + url;
                        this.switchObj.exportFileName = "监管检查信息统计报表"
                    }
                    if (this.btnData.superviseEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "sixth":
                    url = `beginDate=${btime+'0101'}&endDate=${etime+'1231'}&org=${treeOrg.form.id}&punishType=${this.form.punishType}&insuranceType=${this.form.insuranceType}&stock=${this.form.stock}`;
                    this.switchObj.getDataUrl =
                    `cx_penalizeNotice/stat?` + url;
                    this.switchObj.exportUrl =
                    `cx_penalizeNotice/exportStat?` + url;
                    this.switchObj.exportFileName = "行政处罚事先告知书信息统计报表信息统计报表"
                    if (this.btnData.punishNoticeEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "first":
                    if(this.companySource == "1"){
                        url = `beginDate=${btime+'0101'}&endDate=${etime+'1231'}&org=${treeOrg.form.id}&punishType=${this.form.punishType}&insuranceType=${this.form.insuranceType}`;
                        this.switchObj.getDataUrl =
                        `cx_penalize/statBase?` + url;
                        this.switchObj.exportUrl =
                        `cx_penalize/exportBaseStat?` + url;
                        this.switchObj.exportFileName = "监管处罚历年情况统计报表"
                    } else{
                        this.switchObj.getDataUrl =
                        `complianceStatistics/getStatisticsByJgcf?` + url;
                        this.switchObj.exportUrl =
                        `/complianceStatistics/exportStatisticsByJgcf?` + url;
                        this.switchObj.exportFileName = "监管处罚信息统计报表"
                    }
                    if (this.btnData.punishEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "second":
                    this.switchObj.getDataUrl =
                        `/complianceStatistics/getStatisticsByJudicial?` + url;
                    this.switchObj.exportUrl =
                        `/complianceStatistics/exportStatisticsBySfaj?` + url;
                    this.switchObj.exportFileName = "涉刑案件信息统计报表"
                    if (this.btnData.justiceEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "third":
                    this.switchObj.getDataUrl =
                        `/complianceStatistics/getStatisticsByInner?` + url;
                    this.switchObj.exportUrl =
                        `/complianceStatistics/exportStatisticsByNbwg?` + url;
                    this.switchObj.exportFileName = "内部违规信息统计报表"    
                    if (this.btnData.violationEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "fourth":
                    this.switchObj.getDataUrl =
                        `/complianceStatistics/getStatisticsByAccountable?` +
                        url +
                        `&wzlx=${this.form.implementType}`;
                    this.switchObj.exportUrl =
                        `/complianceStatistics/exportStatisticsByWzxx?` +
                        url +
                        `&wzlx=${this.form.implementType}`;
                    this.switchObj.exportFileName = "问责信息统计报表"   
                    if (this.btnData.accountEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                case "seventh":
                    url = `beginDate=${btime+'0101'}&endDate=${etime+'1231'}&org=${treeOrg.form.id}&punishType=${this.form.punishType}&insuranceType=${this.form.insuranceType}`;
                    this.switchObj.getDataUrl =
                    `cx_penalizeNotice/stat?` + url;
                    this.switchObj.exportUrl =
                    `cx_penalizeNotice/exportStat?` + url;
                    this.switchObj.exportFileName = "按险种统计报表"
                    if (this.btnData.insureEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
				case "eighth":
                    url = `beginDate=${btime+'0101'}&endDate=${etime+'1231'}&org=${treeOrg.form.id}&punishType=${this.form.punishType}&insuranceType=${this.form.insuranceType}`;
                    this.switchObj.getDataUrl =
                    `cx_penalizeNotice/stat?` + url;
                    this.switchObj.exportUrl =
                    `cx_penalizeNotice/exportStat?` + url;
                    this.switchObj.exportFileName = "按处罚事由统计报表"
                    if (this.btnData.causeEbtn) {
                        this.btnData.isShow = true
                    } else {
                        this.btnData.isShow = false
                    }
                    break;
                default:
                    break;
            }
        },
        handleClick() {
            this.switchType();
            this.form = this["form" + this.activeName];
            this.getData();
        },
        async getData() {
            this.switchType();
            let respond = await this.axios.get(this.switchObj.getDataUrl);
            if (this.activeName == 'fifth'||this.activeName == 'sixth'||this.activeName == 'seventh'||this.activeName == 'eighth') {
                this.form.dataList = respond.data || [];
            } else {
                this.form.dataList = respond.rlist || [];
                respond.hline && JSON.stringify(respond.hline) !== '{}' && this.form.dataList.unshift(respond.hline);
                respond.eline && this.form.dataList.push(respond.eline);
            }
        },
        exportBut() {
            this.switchType();
		  	this.axios.post(this.switchObj.exportUrl,qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
                fileDownload(res, this.switchObj.exportFileName + ".xlsx");
			})
        },
        timeFormat(row) {
            return row.btime === row.etime ? row.btime : row.btime + "-" + row.etime;
        },
        timeFormat1() {
            let btime = this.form.repDateBegin || new Date().getFullYear();
            let etime = this.form.repDateEnd || new Date().getFullYear();
            return btime === etime ? btime : btime + "-" + etime;
        },
    }
};
</script>

<style lang="scss">
    .isPunishNotice{
        .el-form-item__label{
            width:320px!important;
        }
        .el-form-item__content{
           margin-left:320px!important;
        }   
    }
</style>
