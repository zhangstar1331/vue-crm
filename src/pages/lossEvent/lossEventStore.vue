<!-- 损失事件库 -->
<template>
<div>
    <stepBar :bannerList="bannerList"></stepBar>
    <div class="shadowBox">
        <div class="titIcon">
            <em></em>
            <span style="font-weight: 600;">{{ titles.title }}</span>
        </div>
        <div style="height:20px;position:relative">
            <span style="color:#4285f4;position:absolute;right:0px;top:0px;cursor:pointer" @click="gotoall" v-if="btnData.checkbtn">{{ titles.routeInfo.text }}>></span>
        </div>
        <div>
            <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
                <el-table-column :prop="item.prop" align="center" :label="item.label" v-for="(item, index) in tableHead" :key="index"></el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <span @click="show(scope.$index, scope.row)" style="color:#4285f4;cursor:pointer" v-if="btnData.checkbtn">查看</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</div>
</template>

<script>
// 引入步骤条
import stepBar from "src/components/commonModel/stepBar";
import { mapState } from 'vuex'
export default {
    props: ["code", "title", "bannerListProp", "tableHeadProp"],
    components: {
        stepBar
    },
    data() {
        return {
            bannerList: this.bannerListProp || ["损失事件管理", "损失事件库"],
            titles: this.title || {
                title: "损失事件库",
                routeInfo: {
                    text: "查看全部损失事件",
                    route: "leStoreAall"
                }
            },
            tableData: [],
            tableHead: this.tableHeadProp || [{
                    prop: "losscp",
                    label: "单位"
                },
                {
                    prop: "counts",
                    label: "损失事件数（件）"
                },
                {
                    prop: "allLoss_money",
                    label: "损失总额（万元）"
                },
                {
                    prop: "allrece_money",
                    label: "追回总额（万元）"
                },
                {
                    prop: "allnet_money",
                    label: "净损失总额（万元）"
                }
            ],
            codeObj: {
                getDataUrl: ""
            },
            btnData: { //按钮显示隐藏
                checkbtn: false,
                punishbtn: false,
            },
        };
    },
    computed: {
        ...mapState(['companySource']),
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
        this.getBtnData(this.$store.state.orgBtnData)
        this.assignmentCode();
        this.getData();
    },
    methods: {
        //跳转全部损失事件
        gotoall(row) {
            if (this.titles.routeInfo.route == "inspectInfo" && this.btnData.punishbtn) {
                sessionStorage.setItem("inspectInfoPath", 1);
            }
            this.$router.push({
                name: this.titles.routeInfo.route,
                query: {
                    id: this.$route.query.id
                }
            });
        },
        show(index, row) {
            if (this.titles.routeInfo.route == "inspectInfo" && this.btnData.punishbtn) {
                sessionStorage.setItem("inspectInfoPath", 1);
            }
            if (this.code == 'superviseInfo') {
                if(this.companySource == "1"){//财险
                    this.$router.push({
                        name: this.titles.routeInfo.route,
                        query: {
                            belongCompany: row.org,
                            company: row.orgName,
                            id: this.$route.query.id
                        }
                    });
                } else{
                    this.$router.push({
                        name: this.titles.routeInfo.route,
                        query: {
                            belongCompany: row.lossOneId,
                            company: row.lossOneName,
                            id: this.$route.query.id
                        }
                    });
                }
            } else if(this.code == 'inspectInfo' && this.companySource == "1"){
                this.$router.push({
                    name: this.titles.routeInfo.route,
                    query: {
                        belongCompany: row.org,
                        company: row.orgName,
                        id: this.$route.query.id
                    }
                });
            } else {
                this.$router.push({
                    name: this.titles.routeInfo.route,
                    query: {
                        belongCompany: row.losscpId,
                        company: row.losscp,
                        id: this.$route.query.id
                    }
                });
            }
        },
        //参数赋值
        assignmentCode() {
            switch (this.code) {
                case "inspectInfo":
                    if(this.companySource == '1'){//财险
                        var date = new Date()
                        var year = date.getFullYear();
						this.codeObj = {
							getDataUrl: "cx_penalize/stat?org=&beginDate=" + year + "0101" + "&endDate=" + year + '1231'
						};
					} else{
						this.codeObj = {
                            getDataUrl: "complianceStatistics/getStatisticsByJgcf?btime=&etime=&LOSS_ONE_ID=&LOSS_TWO_ID=&LOSS_THREE_ID="
                        };
					}
                    break;
                case "judicialInfo":
                    this.codeObj = {
                        getDataUrl: "/complianceStatistics/getStatisticsByJudicial?btime=&etime=&LOSS_ONE_ID=&LOSS_TWO_ID=&LOSS_THREE_ID="
                    };
                    break;
                case "violationInfo":
                    this.codeObj = {
                        getDataUrl: "/complianceStatistics/getStatisticsByInner?btime=&etime=&LOSS_ONE_ID=&LOSS_TWO_ID=&LOSS_THREE_ID="
                    };
                    break;
                case "accountInfo":
                    this.codeObj = {
                        getDataUrl: "/complianceStatistics/getStatisticsByAccountable?btime=&etime=&LOSS_ONE_ID=&LOSS_TWO_ID=&LOSS_THREE_ID=&wzlx="
                    };
                    break;
                case "superviseInfo":
                    if(this.companySource == '1'){//财险
                        var date = new Date()
                        var year = date.getFullYear();
						this.codeObj = {
							getDataUrl: "cx_supervise/stat?org=&beginDate=" + year + "0101" + "&endDate=" + year + '1231'
						};
					} else{
						this.codeObj = {
							getDataUrl: "complianceStatistics/getStatisticsBySupervise?btime=&etime=&LOSS_ONE_ID=&LOSS_TWO_ID=&LOSS_THREE_ID="
						};
					}
                    break;
                default:
                    var date = new Date()
                    var year = date.getFullYear();
                    this.codeObj = {
                        getDataUrl: "/lossevent/getStatisticsByHjg?btime=" + year + '0101' + '&etime=' + year + '1231'
                    };
                    break;
            }
        },
        async getData() {
            let respond = await this.axios.get(this.codeObj.getDataUrl);
            if (this.code == 'superviseInfo'||this.code == 'inspectInfo') {
                this.tableData = respond.data || []
            } else {
                this.tableData = respond.rlist || [];
                if (respond.hline) {
                    JSON.stringify(respond.hline) !== "{}" &&
                        this.tableData.unshift(respond.hline);
                }
                respond.eline && this.tableData.push(respond.eline);
            }
        },
        getBtnData(handleData) {
            if (handleData !== undefined) {
                switch (this.code) {
                    case "inspectInfo":
                        if (handleData.indexOf('1_hjgjccfxxkjq') >= 0 || handleData.indexOf('1_hjgjccfxxkcq') >= 0) { //查看
                            this.btnData.checkbtn = true
                        } else {
                            this.btnData.checkbtn = false
                        }
                        if (handleData.indexOf('1_hjgjccfxxkcq') >= 0) { //查看
                            this.btnData.punishbtn = true
                        }
                        break;
                    case "judicialInfo":
                        if (handleData.indexOf('1_hsfajxxkq') >= 0) { //查看
                            this.btnData.checkbtn = true
                        } else {
                            this.btnData.checkbtn = false
                        }
                        break;
                    case "violationInfo":
                        if (handleData.indexOf('1_hnbwgxxkq') >= 0) { //查看
                            this.btnData.checkbtn = true
                        } else {
                            this.btnData.checkbtn = false
                        }
                        break;
                    case "accountInfo":
                        if (handleData.indexOf('1_hwzxxkq') >= 0) { //查看
                            this.btnData.checkbtn = true
                        } else {
                            this.btnData.checkbtn = false
                        }
                        break;
                    case "superviseInfo":
                        if (handleData.indexOf('1_hjgjcxxkq') >= 0||handleData.indexOf('1_hjgjcxxkqcx') >= 0) { //查看
                            this.btnData.checkbtn = true
                        } else {
                            this.btnData.checkbtn = false
                        }
                        break;
                    default:
                        if (handleData.indexOf('1_lsjkq') >= 0) { //查看
                            this.btnData.checkbtn = true
                        } else {
                            this.btnData.checkbtn = false
                        }
                        break;
                }
            }
        },
    }
};
</script>

<style lang="less" scoped></style>
