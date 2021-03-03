<template>
    <div id="lossSendList">
        <el-button type="primary" @click.native="goSpecialReport" class="dealBtn" v-if="this.isFlag == 2&&btnData.specialbtn">专报</el-button>
        <el-button type="primary" @click.native="goSeasonReport" class="dealBtn" v-if="this.isFlag == 2&&btnData.seasonbtn">季报</el-button>
        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
            <el-table-column type="index" label="序号" align="center" width="80" v-if="this.isFlag == 2"></el-table-column>
            <el-table-column prop="sn" label="监管检查事项编号" align="center" width="150" v-if="this.isFlag == 1">
                <template slot-scope="scope">
                    <span :title="scope.row.sn" class="textOverFlow">{{scope.row.sn == null||scope.row.sn == ''?'--':scope.row.sn}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="thingName" label="检查事项" align="center" width="200" v-if="this.isFlag == 2">
                <template slot-scope="scope">
                    <span :title="scope.row.thingName" class="textOverFlow">{{scope.row.thingName == null||scope.row.thingName == ''?'--':scope.row.thingName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="thingName" label="检查事项" align="center" width="200" v-if="this.isFlag == 1&&!this.isStore&&!this.isSend">
                <template slot-scope="scope">
                    <span :title="scope.row.thingName" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn">{{scope.row.thingName == null||scope.row.thingName == ''?'--':scope.row.thingName}}</span>
                    <span :title="scope.row.thingName" class="textOverFlow" v-else>{{scope.row.thingName == null||scope.row.thingName == ''?'--':scope.row.thingName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="thingName" label="检查事项" align="center" width="200" v-if="this.isStore == 1">
                <template slot-scope="scope">
                    <span :title="scope.row.thingName" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn1">{{scope.row.thingName == null||scope.row.thingName == ''?'--':scope.row.thingName}}</span>
                    <span :title="scope.row.thingName" class="textOverFlow" v-else>{{scope.row.thingName == null||scope.row.thingName == ''?'--':scope.row.thingName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="subjectType" label="实施主体类型" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.subjectType == null||scope.row.subjectType == ''?'--':subject[scope.row.subjectType]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="orgName" label="被检查机构" align="center" width="300">
                <template slot-scope="scope">
                    <span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null||scope.row.orgName == ''?'--':scope.row.orgName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="startDate" label="检查开始时间" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.startDate == null||scope.row.startDate == ''?'--':timeFormat(scope.row.startDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="insuranceType" label="险种" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.insuranceType == null||scope.row.insuranceType == ''?'--':insureList.find(item =>{ return item.id == scope.row.insuranceType}).name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="submitGrop" label="是否报送集团" align="center" v-if="this.isFlag == 1" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.submitGrop == 1?"已报送":"未报送"}}</span>
                </template>
            </el-table-column>
            <!-- 草稿箱 -->
            <el-table-column prop="baseStatus,resultStatus,abarStatus,dutyStatus" label="操作" align="center" v-if="this.isFlag == 2">
                <template slot-scope="scope">
                    <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
                    <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.editbtn&&scope.row.draftStatus==0">编辑</span>
                    <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.submitbtn&&scope.row.draftStatus==0">提交</span>
                    <span class="handleBtn detailBtn" @click="goDelete(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.deletebtn&&scope.row.draftStatus==0">删除</span>
                    <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.editbtn&&scope.row.draftStatus==1">修改</span>
                    <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row, 1)" style="color: #4285F4;" v-if="btnData.approvebtn&&scope.row.draftStatus==1">审批通过</span>
                    <span class="handleBtn detailBtn" @click="goRollback(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.rollbackbtn&&scope.row.rollback==1">退回</span>
                    <span class="handleBtn detailBtn" @click="goMark(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.markbtn&&scope.row.draftStatus==1">迟报/错报标记</span>
                </template>
            </el-table-column>
            <!-- 生效库 -->
            <el-table-column prop="baseStatus,resultStatus,abarStatus,dutyStatus" label="操作" align="center" width="450" v-if="this.isFlag == 1&&!this.isStore&&!this.isSend">
                <template slot-scope="scope">
                    <span :class="{'handleBtn detailBtn redFont':scope.row.baseStatus == 0,'handleBtn detailBtn':scope.row.baseStatus == 1}" @click="goDfend(scope.$index, scope.row,0)" style="color: #4285F4;" v-if="btnData.editbtn">基本信息</span>
                    <span :class="{'handleBtn detailBtn redFont':scope.row.resultStatus == 0,'handleBtn detailBtn':scope.row.resultStatus == 1}" @click="goDfend(scope.$index, scope.row,1)" style="color: #4285F4;" v-if="btnData.editbtn">结果跟进</span>
                    <span :class="{'handleBtn detailBtn redFont':scope.row.abarStatus == 0,'handleBtn detailBtn':scope.row.abarStatus == 1}" @click="goDfend(scope.$index, scope.row,2)" style="color: #4285F4;" v-if="btnData.editbtn">整改跟进</span>
                    <span :class="{'handleBtn detailBtn redFont':scope.row.dutyStatus == 0,'handleBtn detailBtn':scope.row.dutyStatus == 1}" @click="goDfend(scope.$index, scope.row,3)" style="color: #4285F4;" v-if="btnData.editbtn">问责跟进</span>
                    <span class="handleBtn detailBtn redFont" style="color: #4285F4;" v-if="btnData.rollbackbtn&&scope.row.rollback == 0">退回</span>
                    <span class="handleBtn detailBtn" @click="goRollback(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.rollbackbtn&&scope.row.rollback == 1">退回</span>
                    <span class="handleBtn detailBtn" @click="goSubmitGroup(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.submitbtn">提交集团</span>
                    <span class="handleBtn detailBtn" @click="goMark(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.markbtn">迟报/错报标记</span>
                </template>
            </el-table-column>
            <!-- 检查库 -->
            <el-table-column prop="baseStatus,resultStatus,abarStatus,dutyStatus" label="操作" align="center" width="450" v-if="this.isStore == 1">
                <template slot-scope="scope">
                    <span :class="{'handleBtn detailBtn redFont':scope.row.baseStatus == 0,'handleBtn detailBtn':scope.row.baseStatus == 1}" @click="goDetail(scope.$index, scope.row,0)" style="color: #4285F4;" v-if="btnData.detailbtn1">基本信息</span>
                    <span :class="{'handleBtn detailBtn redFont':scope.row.resultStatus == 0,'handleBtn detailBtn':scope.row.resultStatus == 1}" @click="goDetail(scope.$index, scope.row,1)" style="color: #4285F4;" v-if="btnData.detailbtn1">结果跟进</span>
                    <span :class="{'handleBtn detailBtn redFont':scope.row.abarStatus == 0,'handleBtn detailBtn':scope.row.abarStatus == 1}" @click="goDetail(scope.$index, scope.row,2)" style="color: #4285F4;" v-if="btnData.detailbtn1">整改跟进</span>
                    <span :class="{'handleBtn detailBtn redFont':scope.row.dutyStatus == 0,'handleBtn detailBtn':scope.row.dutyStatus == 1}" @click="goDetail(scope.$index, scope.row,3)" style="color: #4285F4;" v-if="btnData.detailbtn1">问责跟进</span>
                    <span class="handleBtn detailBtn redFont" style="color: #4285F4;" v-if="btnData.detailbtn1&&scope.row.rollback == 0">退回</span>
                    <span class="handleBtn detailBtn" @click="goRollback(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn1&&scope.row.rollback==1">退回</span>
                    <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn1">提交集团</span>
                    <span class="handleBtn detailBtn" @click="goMark(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn1">迟报/错报标记</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
        <hg-mark :delay="delay" url="cx_supervise/updateMark" v-if="isShow" @closeMask="closeMask"></hg-mark>
    </div>
</template>
<script>
import Bus from 'src/bus/bus.js'
import hgMark from 'src/components/infoManage/hgMark'
import { mapState } from 'vuex'
import { getUrlKey } from 'src/utils/utils.js'
import qs from 'qs'
export default {
    props: ['isFlag', 'isStore', 'isSend'],
    data() {
        return {
            currentPage: 1,
            tableData4: [],
            totalResults: 0,
            subject: {
                '1': '银保监系统',
                '2': '人民银行',
                '3': '财政部',
                '4': '审计署',
                '5': '其他'
            },
            discoverWay: {
                '1': '外部检查',
                '2': '上级检查',
                '3': '公司自查',
                '4': '客户投诉',
                '5': '举报',
                '6': '其他'
            },
            btnData: { //按钮显示隐藏
                specialbtn: false,
                seasonbtn: false,
                detailbtn: false,
                detailbtn1: false,
                editbtn: false,
                submitbtn: false,
                deletebtn: false,
                approvebtn:false,
                rollbackbtn:false,
                markbtn:false,
                groupbtn:false
            },
            isShow: false,
            delay: "",
        }
    },
    computed: {
        ...mapState(['insureList']),
        f1() {
            return this.$store.state.orgBtnData
        }
    },
    components: {
        hgMark
    },
    watch: {
        f1(newdata, olddata) {
            this.getData(newdata)
        }
    },
    created() {
        //获取数据判断是否显示更多操作
        Bus.$off('formDatas')
        Bus.$on('formDatas', (data) => {
            this.totalResults = data.totalResults == undefined ? 1 : data.totalResults;
            this.tableData4 = [];
            this.tableData4 = data.data == undefined ? [] : data.data;
            this.currentPage = data.currentPage == undefined ? 1 : data.currentPage;
        })
        this.getData(this.$store.state.orgBtnData)
    },
    methods: {
        // 权限
        getData(handleData) {
            if (handleData !== undefined) {
                if (handleData.indexOf('1_hjgjcsxxxbsjcx') >= 0) { //季报
                    this.btnData.seasonbtn = true
                } else {
                    this.btnData.seasonbtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbszcx') >= 0) { //专报
                    this.btnData.specialbtn = true
                } else {
                    this.btnData.specialbtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbsdcx') >= 0) { //详情
                    this.btnData.detailbtn = true
                } else {
                    this.btnData.detailbtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbsecx') >= 0) { //编辑
                    this.btnData.editbtn = true
                } else {
                    this.btnData.editbtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbsscx') >= 0) { //提交
                    this.btnData.submitbtn = true
                } else {
                    this.btnData.submitbtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbswcx') >= 0) { //删除
                    this.btnData.deletebtn = true
                } else {
                    this.btnData.deletebtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbsapcx') >= 0) { //审批
                    this.btnData.approvebtn = true
                } else {
                    this.btnData.approvebtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbsrbcx') >= 0) { //退回
                    this.btnData.rollbackbtn = true
                } else {
                    this.btnData.rollbackbtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbsmkcx') >= 0) { //退回
                    this.btnData.markbtn = true
                } else {
                    this.btnData.markbtn = false
                }
                if (handleData.indexOf('1_hjgjcsxxxbsjtcx') >= 0) { //集团
                    this.btnData.groupbtn = true
                } else {
                    this.btnData.groupbtn = false
                }
                this.$emit('accessChange',this.btnData.groupbtn)
                if (handleData.indexOf('1_hjgjcxxkdcx') >= 0) { //信息库详情
                    this.btnData.detailbtn1 = true
                } else {
                    this.btnData.detailbtn1 = false
                }
            }
        },
        // 季报
        goSeasonReport() {
            this.$router.push({
                path: '/superviseSeasonReportCX', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    id: this.$route.query.id
                }
            })
        },
        // 专报
        goSpecialReport() {
            this.$router.push({
                path: '/superviseSpecialReportCX', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    id: this.$route.query.id
                }
            })
        },
        refresh() {
            var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
            if(askData.org&&askData.org.indexOf("1_01")>=0){
                this.$set(askData,'org','')
            }
            this.axios.post('cx_supervise/query', JSON.stringify(askData), { headers: { 'Content-Type': 'application/json' } }).then((res) => {
                if (res.code == 200) {
                    if (res.data != null) {
                        this.totalResults = res.data.totalResults == undefined ? 1 : res.data.totalResults;
                        this.tableData4 = []
                        this.tableData4 = res.data.data == undefined ? [] : res.data.data
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
        handleSizeChange(value) {
            var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
            askData.pageNo = value;
            sessionStorage.setItem('askData' + this.isFlag, JSON.stringify(askData))
            this.refresh()
        },
        handleCurrentChange(value) {
            var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
            askData.pageNo = value;
            sessionStorage.setItem('askData' + this.isFlag, JSON.stringify(askData))
            //下一页请求数据
            this.refresh()
        },
        // 详情
        goDetail(index, row, val) {
            var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
            this.$router.push({
                path: '/superviseDetailCX', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    infoId: row.id,
                    flag: this.isFlag,
                    step: val,
                    belongCompany: this.$route.query.belongCompany,
                    company: this.$route.query.company,
                    id: this.$route.query.id
                }
            })
        },
        // 退回
        goRollback(index, row) {
            this.$prompt('请输入退回原因', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '返回',
                inputPattern: /\S/,
                inputErrorMessage: '退回原因不能为空'
            }).then(({ value }) => {
                this.axios.post('cx_supervise/rollback', qs.stringify({ id: row.id, msg: value,status: this.isFlag })).then((res) => {
                    if (res.code == 200) {
                        this.$alert('退回成功', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                if (this.tableData4.length == 1) {
                                    var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
                                    askData.pageNo = askData.pageNo - 1;
                                    sessionStorage.setItem('askData' + this.isFlag, JSON.stringify(askData))
                                }
                                this.refresh();
                            }
                        });
                    } else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: '确定'
                        })
                    }
                })
            })
        },
        // 编辑或维护
        goEdit(index, row, val) {
            var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
            this.$router.push({
                path: '/superviseSpecialReportCX', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    infoId: row.id,
                    flag: this.isFlag,
                    step: val,
                    id: this.$route.query.id
                }
            })
        },
        // 提交
        goSubmit(index, row, type) {
            this.axios.post('cx_supervise/submit', JSON.stringify({ id: row.id, status: 1 }), { headers: { 'Content-Type': 'application/json' } }).then((res) => {
                if (res.code == 200) {
                    if (res.data == 0) {
                        this.$alert('请完善信息后再次提交', '提示', {
                            confirmButtonText: '确定'
                        });
                    } else {
                        var tip = "提交成功"
                        if(type == 1){
                            tip = '审批意见为"同意"，审批已通过'
                        }
                        this.$alert(tip, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                if (this.tableData4.length == 1) {
                                    var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
                                    askData.pageNo = askData.pageNo - 1;
                                    sessionStorage.setItem('askData' + this.isFlag, JSON.stringify(askData))
                                }
                                this.refresh()
                            }
                        });
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
        goSubmitGroup(index, row) {
            this.axios.post('cx_supervise/submitGroup', qs.stringify({ id: row.id})).then((res) => {
                if (res.code == 200) {
                    this.$alert("提交成功", '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if (this.tableData4.length == 1) {
                                var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
                                askData.pageNo = askData.pageNo - 1;
                                sessionStorage.setItem('askData' + this.isFlag, JSON.stringify(askData))
                            }
                            this.refresh()
                        }
                    });
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
        goDelete(index, row) {
            this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.axios.post('cx_supervise/delete', qs.stringify({ id: row.id })).then((res) => {
                        if (res.code == 200) {
                            this.$alert('删除成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    if (this.tableData4.length == 1) {
                                        var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
                                        askData.pageNo = askData.pageNo - 1;
                                        sessionStorage.setItem('askData' + this.isFlag, JSON.stringify(askData))
                                    }
                                    this.refresh();
                                }
                            });
                        } else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: '确定'
                            })
                        }
                    })
                })
                .catch(_ => {});
        },
        goDfend(index, row, val) {
            var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
            this.$router.push({
                path: '/superviseSpecialReportCX', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    infoId: row.id,
                    flag: this.isFlag,
                    step: val,
                    id: this.$route.query.id
                }
            })
        },
        closeMask(data) {
            this.isShow = data.status;
        },
        // 标记
        goMark(index, row) {
            this.axios.post('cx_supervise/queryMark', qs.stringify({ id: row.id})).then((res) => {
                if (res.code == 200) {
                    this.isShow = true
                    this.delay = res.data
                    this.$set(this.delay,'id',row.id)
                    if(res.data.missDays){
                        this.$set(this.delay,'day',res.data.missDays)
                    }
                    if(res.data.missType){
                        this.$set(this.delay,'type',res.data.missType)
                    }
                    if(res.data.submitDate){
                        this.$set(this.delay,'submitDate',res.data.submitDate)
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
        timeFormat(str){
            return str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6,8)
        }
    }
}

</script>
<style lang="css">
.el-tooltip__popper {
    max-width: 50%
}

</style>
<style lang="scss">
#lossSendList {
    table tr:last-child td {
        border-bottom: none
    }
    .el-table::before {
        background-color: transparent !important
    }
    .el-table td .cell,
    .el-table__empty-text {
        font-weight: normal;
        cursor: pointer
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
    .el-dropdown+.el-dropdown {
        margin-left: 15px;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .el-pagination button,
    .el-pagination span:not([class*=suffix]) {
        padding: 0 5px;
        font-size: 12px;
    }
    .moreBtn,
    .detailBtn {
        color: #4285F4;
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
        text-decoration: none
    }
    .dealBtn {
        float: right;
        margin-right: 5px;
        width: 68px;
        height: 26px;
        padding: 0;
        font-size: 12px;
    }
    .redFont {
        color: #FF6363 !important
    }
    .mark {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 100000;
        padding-top: 15%;
        padding-left: 15%;
        padding-right: 100px;
        text-align: center;
        .maskBox {
            position: relative;
            width: 600px;
            padding: 40px 0;
            background: #fff;
            margin: 0 auto;
            .el-tag {
                position: fixed;
                margin: -40px 260px;
                background: transparent;
                border: none;
                padding: 4px;
                .el-icon-close {
                    font-size: 18px;
                    padding: 1px;
                }
                .el-icon-close:hover {
                    background: transparent;
                    color: #409eff;
                }
            }
            .markInfo {
                text-align: center;
                font-size: 16px;
                padding: 0 50px;
                .infoTitle {
                    font-size: 20px;
                    font-weight: 1000;
                    margin-bottom: 40px
                }
            }
            .search {
                width: 68px;
                height: 26px;
                margin-right: 5px;
                margin-top: 20px;
                padding: 0;
                font-size: 12px;
            }
            .el-form-item__label {
                width: 35%;
                height: 36px;
                line-height: 36px;
                font-weight: normal;
                padding: 0 4% 0 0;
                text-align: right
            }
            .el-input__inner {
                height: 36px;
                line-height: 36px;
            }
            .el-form-item__content {
                float: left;
                width: 65%;
                height: 36px;
                line-height: 36px;
            }
            .el-input{
                float:left;
                width:90%
            }
            .el-select{
                width: 100%;
                .el-input{
                    width:90%
                }
            }
        }
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
}

</style>
