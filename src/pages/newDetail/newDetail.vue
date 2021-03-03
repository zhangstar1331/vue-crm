<template>
    <div ref="trues" id="ngTit">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:13px">
            <el-breadcrumb-item id="top" class='separator-id'><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
            <el-breadcrumb-item class='separator-ic'><span class="bread" @click="turnDown()">{{detailName}}</span></el-breadcrumb-item>
            <el-breadcrumb-item class='separator-ie'>{{detailLang}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--基础信息-->
        <div id="sister-title">
            <div id="sister-base">基础信息</div>
            <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                            <el-form-item label="制度类别：" prop="region" required>
                                <span>{{categor}}</span>
                            </el-form-item>
                            <el-form-item label="生效日期：" required>
                                <span>{{startDates}}</span>
                            </el-form-item>
                            <el-form-item label="制度文号：" prop="name" required>
                                <span>{{dfwindow}}号</span>
                            </el-form-item>
                            <el-form-item label="录入人员：" prop="operatorName" v-if="companySource == '0'">
                                <span>{{operatorName}}</span>
                            </el-form-item>
                        </el-form>
                        <div class="grid-content bg-purple-light"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                            <el-form-item label="维护部门：" required v-if="companySource == '0'">
                                <span>{{department}}</span>
                            </el-form-item>
                            <el-form-item label="适用范围：" required v-if="companySource == '1'">
                                <span>{{department}}</span>
                            </el-form-item>
                            <el-form-item label="有效期限：" required>
                                <span>{{endDate == '3019-12-12'?'长期有效':endDate}}</span>
                            </el-form-item>
                            <el-form-item label="制度名称：" required>
                                <span>{{name}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                        <el-form-item label="发文机关：" required prop="name">
                            <span style="margin-left: 3px;">{{publish == null?'--':publishType[publish]}}</span>
                        </el-form-item>
                        <el-form-item label="发布日期：" required>
                            <span style="margin-left: 3px;">{{issuedDate}}</span>
                        </el-form-item>
                        <el-form-item label="适用范围：" required v-if="companySource == '0'">
                            <span style="margin-left: 3px;">{{placeName}}</span>
                        </el-form-item>
                        <el-form-item label="录入人员：" prop="operatorName" v-if="companySource == '1'">
                            <span>{{operatorName}}</span>
                        </el-form-item>
                    </el-form>
                </el-col>
                <div class="grid-content bg-purple"></div>
            </el-row>
        </div>
        <!--相关文件-->
        <div id="section-rowdcc">
            <div id="section-dealis">相关文件</div>
            <el-table :header-cell-style="getRowClass" :data="tableData" style="width:100%;margin:66px 10px 10px; background: #F9F9F9; border: 1px solid #E9E9E9;text-indent: 0px;" :row-class-name="tableRowClassName">
                <el-table-column prop="date" width="100" label="序号" type="index" :index="indexMethod" style="background: #F9F9F9; text-indent: 0px">
                </el-table-column>
                <el-table-column prop="name" label="文件名" width="500" style="text-indent:125px; background: #F9F9F9;">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="loadFile(scope.$index, scope.row)" type="text" size="small">
                            {{scope.row.name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="文件类型" style="text-indent: 271px;background: #F9F9F9;">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">
                            {{scope.row.type==1?"制度":"附件"}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="addresse" label="操作" style="text-indent:271px;background: #F9F9F9;">
                    <template slot-scope="scope">
                        <el-button @click="change(scope.row)" type="text" size="small">
                            查看拆分详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--拆分导入-->
        <div id="section-rowdccs" v-show="isShow">
            <div>
                <div id="section-dealise" style="font-weight: 700;">拆分导入</div>
                <div id="chrome-cli">{{name}} -- {{fileName}}</div>
            </div>
            <el-table :data="tableDatas" style="width: 100%;text-indent: 25px;background: #F9F9F9;
      border: 1px solid #E9E9E9;" row-key="id" border :header-cell-style="getRowClass" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="chapter" label="章节" width="240"></el-table-column>
                <el-table-column prop="clause" label="法条" width="150"></el-table-column>
                <el-table-column prop="content" label="制度内容"></el-table-column>
            </el-table>
            <el-pagination style="text-align: center;margin-top: 16px;" :current-page.sync="currentPage" background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="totalPage" @size-change="" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <!--修订记录-->
        <div id="section-rowdccEnd" v-if="panelShow">
            <div id="section-dealisEnd">维护记录</div>
            <el-table :data="tableDatass" :header-cell-style="getRowClass" style="width: 100%;margin: 66px 10px 20px; background: #FFFFFF;border: 1px solid #E9E9E9;" :total="userList.length" :row-class-name="tableRowClassName">
                <el-table-column prop="date" label="序号" type="index" :index="indexMethod" width="100" style=" background: #F9F9F9; border: 1px solid #E9E9E9;"> </el-table-column>
                <el-table-column prop="fileName" label="外规文号" width="300" style="text-indent: 125px;"> </el-table-column>
                <el-table-column prop="name,fileName" :row-class-name="tableRowClassNames" label="外规名称">
                    <template slot-scope="scope">
                        <span class="wgSpan textOverFlow" :title="scope.row.name" style="color: #4285F4;" :class="[scope.row.status == 9?'disabled':'']" @click="jumpLog(scope.$index,scope.row)"><span v-show="scope.row.status == 3" class="wgSpan fzCss">废止</span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startDate" label="生效日期" width="280" style="text-indent: 125px;"> </el-table-column>
                <el-table-column prop="issueDate" label="发布日期" width="280" style="text-indent: 125px;">
                </el-table-column>
            </el-table>
        </div>
        <div id="sectionBtn" class="section-scry">
            <span class="section-return" @click="turnDown()">返回</span>
            <span class="section-beauted" v-if="reserveBtn" @click="reverseFt">维护</span>
            <span class="section-edit" v-if="editBtn" @click="edit()">编辑</span>
        </div>
    </div>
</template>
<script>
import { fileDownload, fileNameCombine } from 'src/utils/utils.js'
import { mapState, mapActions } from 'vuex'
import qs from 'qs'
export default {
    name: 'newDetails',
    data() {
        return {
            detailLang: '',
            detailName: '',
            operatorName: '',
            dfwindow: '',
            //基础信息
            innerUrl: '#top',
            panelShow: true,
            reserveBtn: true,
            editBtn: false,
            totalPage: 0,
            placeName: '',
            id: [],
            chapter: '',
            isShow: false,
            publish: '',
            department: '',
            startDates: '',
            issuedDate: '',
            endDate: '',
            baseForm: [],
            categor: '',
            fileName: '', //上传的文件名字
            dynamicValidateForm: {
                domains: [{
                    value: ''
                }],
                email: ''
            },
            ruleForm: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            placeDatas: {
                user: '',
                region: '  ',
                unitsData: [
                    { label: '00', value: '全系统' },
                    { label: '01', value: '集团本级' },
                    { label: '02', value: '保险子公司' },
                    { label: '03', value: '非保险子公司' },
                    { label: '04', value: '产险公司' },
                    { label: '05', value: '人身险公司' },
                    { label: '06', value: '资管公司' }
                ],
            },
            currentPage: 1, //初始页
            pagesize: 10, //每页的数据
            userList: [],
            fileId: "",
            tableDatass: [{
                    name: "",
                    status: 2,
                },
                {
                    name: "",
                    status: 3,
                }
            ],
            tableData: [],
            tableDatas: [],
            outName: '',
            outFileNo: '',
            startDate: '',
            institutionId: [],
            name: '',
            publishType: {
                '01': '全国人大',
                '02': '国务院',
                '03': '地方人大',
                '04': '银保监会',
                '05': '保监会',
                '06': '人民银行',
                '07': '财政部',
                '08': '税务总局',
                '99': '其他',
            },
        }
    },
    created() {
        var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
        let ic = this.getUrlParam('ic');
        let fz = this.getUrlParam('fz');
        let whFlag = this.getUrlParam('whFlag')
        if (ic == '1' && handleIds.indexOf('1_coutered') > -1) {
            this.panelShow = false;
            this.reserveBtn = false;
            if (whFlag != 1) {
                this.editBtn = true;
            }
        }
        if (handleIds.indexOf('1_couterr') == -1 || ic == '1' || fz == '3' || fz == '1') {
            this.reserveBtn = false;
        }
    },
    mounted() {
        let id = this.$route.query.id
        this.init(id)
    },
    directives: {
        trigger: {
            inserted(el, binging) {
                el.click()
            }
        }
    },
    watch: {
        $route(to, from) {
            if (to.fullPath.includes('fz') || to.fullPath.includes('whFlag')) {
                this.editBtn = false;
                this.reserveBtn = false;
                return;
            }
            var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
            if (handleIds.indexOf('1_couterr') > -1) {
                this.reserveBtn = true;
            }
            this.editBtn = false;

            if (to.fullPath.includes('ic')) {
                if(this.companySource == '1'){
                    this.detailName = '制度库（编辑中）'
                    this.detailLang = '制度库（编辑中）详情'
                } else{
                    this.detailName = '待维护制度管理'
                    this.detailLang = '待维护制度详情'
                }
            } else {
                this.detailName = '外部管理'
                this.detailLang = '外部详情'
            }
        }
    },
    computed: {
        ...mapState(['companySource']),
    },
    methods: {
        getParameterByName(paramName) {
            var args = new Object();
            var argsStr = location.search; //获取URL参数字符串
            if (argsStr.length > 0) {
                argsStr = argsStr.substring(1);
                var nameValueArr = argsStr.split("&"); //多参数
                for (var i = 0; i < nameValueArr.length; i++) {
                    var pos = nameValueArr[i].indexOf('=');
                    if (pos == -1) continue; //如果没有找到就跳过
                    var argName = nameValueArr[i].substring(0, pos); //提取name
                    var argVal = nameValueArr[i].substring(pos + 1); //提取value
                    args[argName] = unescape(argVal);
                }
                return args[paramName];
            }
        },
        init(id) {
            this.axios.post('/instweb/detail',
                JSON.stringify({
                    "id": id,
                    "key": "1",
                    "type": "2"
                }), { headers: { 'Content-Type': 'application/json' } }
            ).then((res) => {
                if (res.code == 200) {
                    this.tableData = res.file;
                    this.operatorName = res.data.operatorName
                    //获取url参数IC
                    this.getParameterByName(name)
                    //制度文号显示
                    if (res.data.fileNoFoot == undefined || res.data.fileNoHead == undefined || res.data.fileNoBody == undefined) {
                        res.data.fileNoFoot == '8.5.2';
                        res.data.fileNoHead == '中东发';
                        res.data.fileNoBody == '2019'
                    }
                    this.dfwindow = res.data.fileNoHead + ' [ ' + res.data.fileNoBody + ' ] ' + res.data.fileNoFoot

                    function getUrlParam(name) {
                        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                        var r = window.location.search.substr(1).match(reg);
                        if (r != null) return unescape(r[2]);
                        return null;
                    }
                    if (this.$route.query.ic == 1) {
                        if(this.companySource == '1'){
                            this.detailName = '制度库（编辑中）'
                            this.detailLang = '制度库（编辑中）详情'
                        } else{
                            this.detailName = '待维护制度管理'
                            this.detailLang = '外规详情'
                        }
                    } else {
                        this.detailName = '外规管理';
                        this.detailLang = '外规详情'
                    }
                    this.tableData = res.data.file;
                    this.tableDatass = res.data.log;
                    this.name = res.data.name;
                    /*存id*/
                    this.id = res.data.file;
                    //维护部门
                    this.department = res.data.departmentName;
                    //发文机关
                    this.publish = res.data.publish;
                    //拿生效日期
                    this.startDates = res.data.startDate;
                    this.issuedDate = res.data.issuedDate;
                    this.endDate = res.data.endDate;
                    //拿制度类别
                    if (res.data.category == '04') {
                        this.categor = '部门规章'
                    } else if (res.data.category == '01') {
                        this.categor = '法律'
                    } else if (res.data.category == '02') {
                        this.categor = '行政法规'
                    } else if (res.data.category == '03') {
                        this.categor = '地方性法规'
                    } else if (res.data.category == '00') {
                        this.categor = '全部'
                    } else if (res.data.category == '05') {
                        this.categor = '规范性文件'
                    }
                    //回填适用范围
                    this.placeName = [];
                    if (res.data.range) {
                        for (var i = 0; i < res.data.range.length; i++) {
                            for (var j = 0; j < this.placeDatas.unitsData.length; j++) {
                                if (res.data.range[i] == this.placeDatas.unitsData[j].label) {
                                    this.placeName += this.placeDatas.unitsData[j].value + '  '
                                }
                            }
                        }
                    }
                    if (res.data.log != undefined) {
                        res.data.log.forEach((item, index) => {
                            let fileName = item.fileNoHead + ' [ ' + item.fileNoBody + ' ] ' + item.fileNoFoot + '号'
                            this.tableDatass[index].fileName = fileName
                        })
                    }
                    const { daste } = []
                    if (res.data.query == undefined) {
                        return daste
                    } else {
                        this.daste = res.data.query.data
                    }
                    this.tableDatas = daste;
                    if (res.data.query.data != null) {
                        this.fileId = res.data.query.data[0].fileId
                    }
                    this.totalPage = parseInt(res.data.query.totalResults)
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },

        edit() {
            let id = this.$route.query.id;
            this.$router.push({
                path: '/reverseEdit', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    id: id
                }
            })
        },
        loadFile(index, row) {
            var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
            if (handleIds.indexOf('1_couterdl') > -1) {
                var obj = new Object()
                obj.filePath = row.url;
                obj.fileName = encodeURIComponent(row.name);
                this.axios.post('comm/download/102', qs.stringify(obj), { responseType: 'arraybuffer' }).then((res) => {
                    fileDownload(res, fileNameCombine(row.name, row.url));
                })
            } else {
                return;
            }
        },
        //返回修订页面
        reverseFt() {
            let id = this.$route.query.id;
            this.$router.push({
                path: '/reverse', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    id: id
                }
            })
        },
        jumpLog(index, row) {
            this.isShow = false;
            if (row.status == 2) {
                //有效
                var element = document.getElementById("top");
                element.scrollIntoView({ block: 'start', behavior: "smooth" });
                this.init(row.id);
                var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
                if (handleIds.indexOf('1_couterr') > -1) {
                    this.reserveBtn = true;
                }
            } else if (row.status == 3) {
                var element = document.getElementById("top");
                element.scrollIntoView({ block: 'start', behavior: "smooth" });
                // 废止
                this.init(row.id)
                this.reserveBtn = false;
            } else if (row.status == 9) {
                this.reserveBtn = false;
            }
            this.init(row.id)
            if (row.status == 3) {
                this.$router.push({
                    path: '/newDetail', //跳转的路径
                    query: { //路由传参时push和query搭配使用 ，作用时传递参数
                        'id': row.id,
                        'fz': 1
                    }
                })
            } else {
                this.$router.push({
                    path: '/newDetail', //跳转的路径
                    query: { //路由传参时push和query搭配使用 ，作用时传递参数
                        'id': row.id
                    }
                })
            }

        },
        //返回
        turnDown() {
            //获取连接地址后面的参数
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
            getUrlParam('ic');
            var ic = getUrlParam('ic');
            if (ic == '1') {
                this.$router.push({ path: '/repository/white-manage', query: { 'id': '1_cdw' } });
            } else {
                this.$router.push({ path: '/repository/out-manage', query: { 'id': '1_couter' } });
            }
        },
        //获取参数
        getParams() {
            // 取到路由带过来的参数
            const routerParams = this.$route.params.state
        },
        /*索引值*/
        indexMethod(index) {
            return index + 1;
        },
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        change(row) {
            this.currentPage = 1;
            this.fileName = row.name;
            const id = row.id;
            this.fileId = row.id;
            this.isShow = true;
            let institutionId = this.$route.query.id
            this.axios.post('instweb/item/query',
                JSON.stringify({
                    "fileId": id,
                    "institutionId": institutionId,
                    "key": "1",
                    "resolve": 0
                }), { headers: { 'Content-Type': 'application/json' } }
            ).then((res) => {
                if (res.code == 200) {
                    this.fileName = row.name;
                    this.isShow = true
                    if (res.data.data == null) {
                        this.tableDatas = [];
                        this.totalPage = res.data.data === null ? 0 : res.data.totalPage / 1 * 10;
                        return
                    } else {
                        this.tableDatas = [];
                        this.tableDatas = res.data.data;
                        this.totalPage = res.data.data === null ? 0 : res.data.totalPage / 1 * 10;
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1)
            }
        },
        tableRowClassName({ row, rowIndex }) {

            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        tableRowClassNames({ row, rowIndex }) {
            if (this.tableDatass.state == 9) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        handleSizeChange(value) {
            this.pagesize = value;
        },
        handleCurrentChange(value) {
            this.currentpage = value;
            this.getfatiao()
        },
        handleCurrentChanges(value) {
            this.currentpage = value;
            this.getfatiao()
        },
        getfatiao() {
            const { currentpage } = this;
            this.axios.post(
                'instweb/item/query', JSON.stringify({
                    "institutionId": this.$route.query.id,
                    "pageNo": currentpage,
                    "pageSize": 10,
                    "fileId": this.fileId,
                    "key": "1",
                    "resolve": 0
                }), { headers: { 'Content-Type': 'application/json' } }).then((res) => {
                if (res.code == 200) {
                    if (!res.data.data) {
                        res.data.data = []
                    } else {
                        var daste = res.data.data;
                        this.tableDatas = daste;
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        addDomain() {
            this.dynamicValidateForm.domains.push({
                value: '',
                key: Date.now()
            });
        },
        //设置表格第一行的颜色
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#F9F9F9'
            } else {
                return ''
            }
        }
    },

}

</script>
<style>
#sister-title .el-form-item__label {
    padding-right: 0;
}
#sister-title .el-form-item .el-form-item__content {
    width: 100%;
    text-align: left;
}
#sister-title .el-col-8:first-of-type {
    padding-left: 30px;
}
#sister-title .el-col-8 span {
    display: inline-block;
    width: 60%;
}
#section-rowdccs .el-table__body-wrapper /deep/ tr td:last-of-type>.cell {
    white-space: pre-line !important;
    text-indent: 0 !important;
    text-align: left !important;
    padding-left: 5%;
}
#section-rowdccs .el-table__body-wrapper /deep/ tr td {
    text-align: center;
    text-indent: 0;
    border-right: none !important;
}
#section-rowdccs .el-table__header /deep/ th {
    border-right: none !important;
}
#section-rowdccs .el-table__header /deep/ th>.cell {
    text-align: center;
    float: left;
    text-indent: 0;
}
/**{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }*/
.el-table__empty-block {
    background: #fff;
}
.section-scry span {
    cursor: pointer;
}
.disabled {
    pointer-events: none;
    cursor: default;
    color: #9B9B9B !important
}
.wgSpan {
    cursor: pointer;
}
.fzCss {
    display: inline-block;
    width: 38px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: #FFFFFF;
    background: #FF6363;
    font-size: 12px;
    margin-right: 10px;
}
.grid-content .el-form-item__label {
    padding-right: 1px !important;
}
/*按钮*/
#sectionBtn {
    text-align: center;
    margin-bottom: 26px;
    margin-top: 40px;
}
#sectionBtn span {
    display: inline-block;
    width: 68px;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    background: #4285F4;
    color: #fff;
    margin-right: 20px;
    border-radius: 3px;
}
#chrome-cli {
    font-size: 14px;
    text-indent: 90px;
    padding-bottom: 29px;
    margin-top: -46px;
}
#sister-title {
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin-top: 19px;
    padding-top: 41px;
}
#sister-base {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 21px;
    border-width: 0px;
    position: absolute;
    left: 30px;
    top: 49px;
    width: 1336px;
    height: 21px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-style: normal;
    font-weight: 550;
    text-align: left;
    border-left: solid 2px rgba(0, 121, 254, 1);
    text-indent: 9px;
    font-weight: 600;
}
#ngTit .el-breadcrumb__inner {
    color: #909191 !important;
    font-weight: 700;

}
#ngTit .separator-ie span {
    color: #4285F4 !important;
    font-weight: 500;
}
#ngTit .bread:hover {
    cursor: pointer;
}
#section-beauted {
    background: #4285F4;
    border-radius: 3px;
    width: 68px;
    height: 26px;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 25px;
}
#section-return {
    background: #4285F4;
    border-radius: 3px;
    width: 68px;
    height: 26px;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    margin-right: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 25px;
}

#section-dealisEnd {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 17px;
    border-width: 0px;
    position: absolute;
    left: 30px;
    top: 26px;
    width: 1336px;
    height: 18px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-style: normal;
    font-weight: 600;
    text-align: left;
    border-left: solid 2px rgba(0, 121, 254, 1);
    text-indent: 9px;
}
#section-rowdccEnd {
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    display: flex;
    position: relative;
    padding: 20px;
    margin-top: 20px;
}
#section-rowdccEnd .cell {
    text-align: center;
}
#section-dealis {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 20px;
    border-width: 0px;
    position: absolute;
    left: 30px;
    top: 29px;
    width: 1336px;
    height: 20px;
    display: flex;
    font-style: normal;
    font-weight: 600;
    text-align: left;
    border-left: solid 2px rgba(0, 121, 254, 1);
    text-indent: 9px;
}

#section-dealise {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #515151;
    letter-spacing: 0;
    line-height: 20px;
    border-width: 0px;
    position: absolute;
    left: 30px;
    top: 32px;
    width: 1336px;
    height: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-style: normal;
    font-weight: 550;
    text-align: left;
    text-indent: 9px;
    z-index: 1000;
    border-left: solid 2px rgba(0, 121, 254, 1);
}
#section-rowdcc {
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    display: flex;
    position: relative;
    padding: 20px;
    margin-top: 20px;
}
#section-rowdcc .cell {
    text-align: center !important;
}
#section-rowdccs {
    padding: 80px 30px 10px;
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    display: flex;
    position: relative;
    flex-direction: column;
    margin-top: 20px;
}
.el-tooltip__popper {
    min-height: 80%
}
.textOverFlow {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

</style>
