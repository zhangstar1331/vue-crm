<template>
<el-container class="container">
    <maskTable :faShow="faShow" @closeMask="closeMaskTable"></maskTable>
    <el-header id="inBuild" class="header" style="padding-left: 218px;">
        <el-row>
            <el-col :span="12">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/repository/in-manage',query:{'id':'1_couter'}}">内部制度管理</el-breadcrumb-item>
                    <el-breadcrumb-item class="txtColor">新增内部制度</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
            <el-col :span="12" align="right">
                <el-button type="primary" class="standardBtn" size="mini" @click="submitReturn">返回</el-button>
                <el-button type="primary" class="standardBtn" @click="submitAll" size="mini">提交</el-button>
                <el-button type="primary" class="standardBtn" @click="saveAll" size="mini">保存</el-button>
            </el-col>
        </el-row>
    </el-header>
    <div class="render">
        <div class="box" style="margin-top: 50px;">
            <div class="titIcon"><em></em><span style="font-weight: 700;">基础信息</span></div>
            <regulationsCheck></regulationsCheck>
        </div>
    </div>
    <!--相关文件-->
    <div class="render mbtm20">
        <div class="box">
            <!--tittle-->
            <el-row>
                <el-col :span="12">
                    <div class="titIcon"><em></em><span style="font-weight: 700;">相关文件</span></div>
                </el-col>
                <el-col :span="12" align="right">
                    <el-upload class="upload-demo" :show-file-list="false" ref="upload" action="" :http-request="uploadFile" multiple accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx">
                        <el-button class="standardBtn" size="small" type="primary">上传附件</el-button>
                    </el-upload>
                </el-col>
            </el-row>
            <!--content-->
            <el-table :data="tableData" style="width: 100%;border: 1px solid #E9E9E9;">
                <el-table-column type="index" width="82" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="文件名">
                    <template slot-scope="scope">
                        <i class="el-icon-document"></i> {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="文件类型">
                    <template slot-scope="scope">
                        <!--<el-radio v-model="scope.row.radio" @change="getFileType(scope.$index,scope.row)"  :value="1" :label="1">制度</el-radio>

<el-radio v-model="scope.row.radio" @change="getFileType(scope.$index,scope.row)"  :value="0" :label="0">附件</el-radio>-->
                        <el-radio-group v-model="scope.row.radio">
                            <template v-for="(item, index) in status_arr">
                                <el-radio @change="getFileType(scope.$index,scope.row)" :label="item.code">{{item.text}}</el-radio>
                            </template>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column prop="address" width="140" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">拆分</el-button>
                        <el-button size="mini" type="text" style="color: red;" @click="deleteFile(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>
    <!--拆分导入-->
    <div class="section-rowdccs" id="inNewbu" v-if="tableShow">
        <div class="section-dealise">
            <div class="titIcon">
                <em></em><span style="font-weight: 600;float: left;">拆分导入</span>
                <span class="zdName" style="color: #4285F4;">{{zdName}}</span>
                <span style="display: inline-block;float: left;padding-left: 6px;padding-right: 6px;">--</span>
                <span class="zdName" style="margin-left: 5px;color: #000;">{{fileName}}</span>
                <el-button class="standardBtn" type="primary" v-if="downLoadBtn" style="margin-right: 0;" @click="downLoadTemplate">下载模板</el-button>
                <el-upload v-if="exportBtn" class="upload-demo exportUpload" ref="upload" :show-file-list="false" action="" :http-request="uploadTemplate" multiple accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx">
                    <el-button class="standardBtn" size="small" type="primary">导入数据</el-button>
                </el-upload>
                <el-button class="standardBtn" type="primary" v-if="deleteBtn" @click="deleteAll">删除列表</el-button>
                <el-button class="standardBtn" type="primary" v-if="createdBtn" @click="createFt">创建法条</el-button>
            </div>
        </div>
        <el-table :data="tableCont" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" row-key="id" border default-expand-all>
            <el-table-column prop="chapter" align="center" label="章节" width="180">
            </el-table-column>
            <el-table-column prop="clause" align="center" label="法条" width="180">
            </el-table-column>
            <el-table-column prop="content" align="left" label="制度内容">
            </el-table-column>
            <el-table-column v-if="handleShow" prop="address" align="center" width="120" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">
                        <el-button type="text" class='detail' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" class="edit" @click="tdEdit(scope.$index,scope.row)">编辑</el-button>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align: center;margin-top: 16px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="total"></el-pagination>
    </div>

</el-container>
</template>

<script>
import regulationsCheck from 'src/components/check/inRegulationsCheck'
import maskTable from 'src/components/maskTable/inMaskTable'
import {
    fileDownload
} from 'src/utils/utils.js'
import {
    mapState,
    mapActions
} from 'vuex'
import qs from 'qs'
export default {
    data() {
        return {
            zdName: '',
            status_arr: [],
            radios: '',
            tableCont: [],
            isHsow: false,
            tableShow: false,
            fileFlag: [],
            fileName: '', //上传的文件名字
            institutionId: '', //制度id,
            fileId: '', //文件id
            handleShow: true, //操作列是否显示
            createdBtn: true, //创建法条按钮是否显示
            exportBtn: true, //导出法条是否显示
            deleteBtn: true, //删除法条是否显示
            downLoadBtn: true, //下载模板按钮是否显示
            faShow: false,
            total: 0,
            saveAllData: {},
            infoData: [],
            singleTdTxt: {},
            splitData: {
                institutionId: '',
                fileId: '',
                pageSize: 10,
                pageNo: 1
            },
            deleteSingleData: {
                institutionId: '',
                fileId: '',
                id: '' //法条Id
            },
            deleteFileData: {

            },
            deleteAllData: {
                institutionId: '',
                fileId: '',
                reviseId: ''
            },
            saveAllData: {},
            tableData: []
        }
    },
    components: {
        regulationsCheck,
        maskTable
    },
    created() {
        this.removeLocalStorage()
        sessionStorage.instId = ''
    },
    computed: {
        ...mapState(['companySource']),
    },
    methods: {
        //上传文件
        uploadFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            const infoData = JSON.parse(localStorage.getItem('infoData'))
            var id = sessionStorage.instId;
            //设置保存时候的入参的制度id
            const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
            saveDatas.id = id;
            form.append("file", fileObj);
            this.getInfoData();
            form.append('id', id)
            return this.axios.post('instweb/saveFile', form).then((res) => {
                if (res.code === 200) {
                    this.fileName = res.data.fileName;
                    this.tableData.push({
                        name: res.data.fileName,
                        fileId: res.data.FileId,
                        path: res.data.path,
                        radio: '1'
                    })
                    var fileKey = res.data.FileId;
                    this.status_arr = [];
                    this.status_arr.push({
                        text: "制度",
                        code: '1'
                    }, {
                        text: "附件",
                        code: "0"
                    })
                    if (res.data.fileName.indexOf('附件') != -1) {
                        this.tableData[this.tableData.length - 1].radio = '0';
                        this.fileFlag.push({
                            fileKey: fileKey + '_0'
                        })
                    } else {
                        this.fileFlag.push({
                            fileKey: fileKey + '_1'
                        })
                    }
                    const infoData = {
                        'institutionId': '', //制度id
                    };
                    infoData.institutionId = res.data.id === undefined ? '' : res.data.id;
                    infoData.fileId = res.data.FileId === undefined ? '' : res.data.FileId;
                    infoData.reviseId = res.data.reviseId === undefined ? '' : res.data.reviseId;

                    saveDatas.fileFlag = this.fileFlag;
                    saveDatas.id = res.data.id === undefined ? '' : res.data.id;
                    sessionStorage.instId = res.data.id === undefined ? '' : res.data.id
                    localStorage.setItem('infoData', JSON.stringify(infoData))
                    sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas))
                } else if (res.code == 640) {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            }).catch((response) => {
                this.$alert('文件过大，上传失败', '提示', {
                    confirmButtonText: '确定'
                });
                console.log(response)
            })
        },
        getFileType(index, row) {
            const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
            var str = this.fileFlag[index].fileKey;
            str = this.fileFlag[index].fileKey.split('_')[0].toString();
            str += '_' + row.radio;
            saveDatas.fileFlag[index].fileKey = str;
            sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas))
        },
        //上传模板文件
        uploadTemplate(param) {
            const infoData = JSON.parse(localStorage.getItem('infoData'))
            const fileID = localStorage.getItem('fileId')
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            form.append('fileId', fileID);
            form.append('institutionId', infoData.institutionId)
            return this.axios.post('instweb/fileUpload', form).then((res) => {
				if (res.code == 200) {
                    //设置拆分时候入参用到的制度id 和 文件id
                    this.splitData.institutionId = res.data;
					this.splitData.fileId = fileID;
					this.checkData(this.splitData)
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
        //查询法条数据
        checkData(data) {
            this.axios.post('instweb/item/query', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                this.tableCont = res.data.data === null ? [] : res.data.data;
                this.total = res.data.data === null ? 0 : res.data.totalPage / 1 * 10;
                sessionStorage.setItem('r_' + res.data.fileId, res.data.resolve)
            })
        },
        //创建法条 蒙版出现
        createFt() {
            localStorage.removeItem('singleData')
            this.faShow = true;
        },
        //创建法条完毕，关闭蒙版
        closeMaskTable(data) {
            this.faShow = data.status;
            if (data.handle === 'add') {
                this.getInfoData();
                this.splitData.institutionId = this.infoData.institutionId;
                this.splitData.fileId = localStorage.getItem('fileId');
                this.checkData(this.splitData)
            }
        },
        //下载法条模板
        downLoadTemplate() {
            this.axios.post('tpl/download/101', qs.stringify({}), {
                responseType: 'arraybuffer'
            }).then((res) => {
                fileDownload(res, '法条模板.xlsx');
            })
        },
        //删除文件
        deleteFile(index, row) {
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                this.getInfoData();
                this.deleteFileData.id = this.infoData.institutionId
                this.deleteFileData.fileId = row.fileId;
                this.axios.post('instweb/delFile', JSON.stringify(this.deleteFileData), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    this.deleteFileData = {};
                    this.deleteFileData.institutionId = this.infoData.institutionId
                    this.deleteFileData.fileId = row.fileId;
                    if (res.code === 200) {
                        var saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
                        saveDatas.fileFlag.splice(index, 1)
                        this.fileFlag.splice(index, 1)
                        if (saveDatas.fileFlag.length == 0) {
                            delete saveDatas.fileFlag;
                        }
                        sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas))
                        this.tableData.splice(index, 1)
                        this.tableShow = false;
                    } else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
            }).catch(_ => {});
        },
        //拆分文件
        handleEdit(index, row) {
            this.zdName = JSON.parse(sessionStorage.getItem('saveDatas')).name == undefined ? '' : JSON.parse(sessionStorage.getItem('saveDatas')).name
            this.fileName = row.name;
            this.tableShow = true
            this.getInfoData();
            this.splitData.institutionId = this.infoData.institutionId;
            this.splitData.fileId = row.fileId;
            localStorage.setItem('fileId', row.fileId)
            this.splitData.resolve = this.getResolve(row.fileId) / 1;
            this.splitData.pageNo = 1;
            this.splitData.cf = '1';
            this.currentPage = 1;
            this.checkData(this.splitData)
        },
        getResolve(fileId) {
            var vre = sessionStorage.getItem('r_' + fileId)
            if (vre == undefined || vre == null) {
                return 1
            } else {
                return vre
            }
        },
        //删除单条制度
        handleDelete(index, row) {
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                this.getInfoData();
                const fileID = localStorage.getItem('fileId')
                this.deleteSingleData.id = row.id;
                this.deleteSingleData.institutionId = this.infoData.institutionId;
                this.deleteSingleData.fileId = fileID;
                this.axios.post('instweb/item/del', JSON.stringify(this.deleteSingleData), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    this.splitData.institutionId = this.infoData.institutionId;
                    this.splitData.fileId = fileID;
                    if (res.code === 200) {
                        if (this.tableCont.length == 1) {
                            this.splitData.pageNo = this.splitData.pageNo - 1
                        }
                        delete this.splitData.cf;
                        this.checkData(this.splitData)
                    } else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
            }).catch(_ => {});
        },
        //删除所有法条
        deleteAll() {
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                const fileID = localStorage.getItem('fileId')
                this.getInfoData();
                this.deleteAllData.institutionId = this.infoData.institutionId;
                this.deleteAllData.fileId = fileID;
                this.deleteAllData.reviseId = this.infoData.reviseId;
                this.axios.post('instweb/item/delAll', JSON.stringify(this.deleteAllData), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        this.getInfoData();
                        this.deleteAllData.institutionId = this.infoData.institutionId;
                        this.deleteAllData.fileId = fileID;
                        this.deleteAllData.reviseId = this.infoData.reviseId;
                        this.checkData(this.deleteAllData)
                    } else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
            }).catch(_ => {});
        },
        tdEdit(index, row) {
            this.getInfoData();
            this.singleTdTxt.institutionId = this.infoData.institutionId;
            this.singleTdTxt.chapter = row.chapter;
            this.singleTdTxt.clause = row.clause;
            this.singleTdTxt.content = row.content;
            this.singleTdTxt.fileId = row.fileId;
            this.singleTdTxt.id = row.id;
            this.singleTdTxt.type = 1;
            localStorage.setItem('singleData', JSON.stringify(this.singleTdTxt))
            this.faShow = true;
        },
        getInfoData() {
            var infoData = JSON.parse(localStorage.getItem('infoData'));
            this.infoData = infoData;
        },
        removeLocalStorage() {
            localStorage.removeItem('singleData');
            localStorage.removeItem('infoData');
            localStorage.removeItem('fileId');
        },
        handleSizeChange(value) {
            //下一页请求数据
            this.getInfoData();
            this.splitData.institutionId = this.infoData.institutionId;
            this.splitData.fileId = localStorage.getItem('fileId');
            this.splitData.pageNo = value;
            delete this.splitData.cf;
            this.checkData(this.splitData)
        },
        handleCurrentChange(value) {
            //下一页请求数据
            this.getInfoData();
            this.splitData.institutionId = this.infoData.institutionId;
            this.splitData.fileId = localStorage.getItem('fileId');
            this.splitData.pageNo = value;
            delete this.splitData.cf;
            this.checkData(this.splitData)
        },

        saveAll() {
            const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
            //校验基本信息是否为空
            if (!(saveDatas.fileNoHead != undefined && saveDatas.fileNoHead != '' && saveDatas.fileNoBody != undefined && saveDatas.fileNoFoot != undefined)) {
                this.$alert('制度文号不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (this.companySource == '0' && (saveDatas.riskLevel == undefined || saveDatas.riskLevel == '')) {
                this.$alert('风险类别不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (this.companySource == '0' && (saveDatas.riskLevel !== 1 && saveDatas.fatherId == undefined)) {
                this.$alert('制度层级不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if ((saveDatas.manageCategory == undefined || saveDatas.manageCategory == '') || (this.companySource == '0' && (saveDatas.manageLevel == undefined || saveDatas.manageLevel == ''))) {
                this.$alert('公司管理类别不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.issuedDate == undefined || saveDatas.issuedDate == '') {
                this.$alert('发布日期不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.startDate == undefined || saveDatas.startDate == '') {
                this.$alert('生效日期不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (this.companySource == '0' && (saveDatas.range == undefined || saveDatas.range == '')) {
                this.$alert('适用范围不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.department == undefined || saveDatas.department == '') {
                if (this.companySource == '0') {
                    this.$alert('维护部门不能为空', '提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                } else {
                    this.$alert('适用范围不能为空', '提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
            } else if (saveDatas.name == undefined || saveDatas.name == '') {
                this.$alert('制度名称不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.endDate == undefined || saveDatas.endDate == '') {
                saveDatas.endDate = '3019-12-12'
            }
            saveDatas.id = sessionStorage.instId;
            this.axios.post('instweb/saveBase', JSON.stringify(saveDatas), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                    sessionStorage.instId = res.data;
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        //返回
        submitReturn() {
            this.$router.push({
                path: '/repository/in-manage', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    'id': '1_cinner'
                }
            })
        },
        //提交成功跳转的路径
        open() {
            this.$alert('提交成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$router.push({
                        path: '/repository/in-manage', //跳转的路径
                        query: { //路由传参时push和query搭配使用 ，作用时传递参数
                            'id': '1_cinner',
                        }
                    })
                }
            });
        },
        opens() {
            this.$alert('提交成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$router.push({
                        path: '/repository/in-manage', //跳转的路径
                        query: { //路由传参时push和query搭配使用 ，作用时传递参数
                            'id': '1_cinner'
                        }
                    })
                }
            });
        },
        submitAll() {
            const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
            if (!(saveDatas.fileNoHead != undefined && saveDatas.fileNoHead != '' && saveDatas.fileNoBody != undefined && saveDatas.fileNoFoot != undefined)) {
                this.$alert('制度文号不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (this.companySource == '0' && (saveDatas.riskLevel == undefined || saveDatas.riskLevel == '')) {
                this.$alert('风险类别不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (this.companySource == '0' && (saveDatas.riskLevel !== 1 && saveDatas.fatherId == undefined)) {
                this.$alert('制度层级不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if ((saveDatas.manageCategory == undefined || saveDatas.manageCategory == '') || (this.companySource == '0' && (saveDatas.manageLevel == undefined || saveDatas.manageLevel == ''))) {
                this.$alert('公司管理类别不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.issuedDate == undefined || saveDatas.issuedDate == '') {
                this.$alert('发布日期不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.startDate == undefined || saveDatas.startDate == '') {
                this.$alert('生效日期不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (this.companySource == '0' && (saveDatas.range == undefined || saveDatas.range == '')) {
                this.$alert('适用范围不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.department == undefined || saveDatas.department == '') {
                if (this.companySource == '0') {
                    this.$alert('维护部门不能为空', '提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                } else {
                    this.$alert('适用范围不能为空', '提示', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
            } else if (saveDatas.name == undefined || saveDatas.name == '') {
                this.$alert('制度名称不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.fileFlag == undefined) {
                this.$alert('请先上传制度文件', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.endDate == undefined || saveDatas.endDate == '') {
                saveDatas.endDate = '3019-12-12'
            }
            this.axios.post('instweb/submit', JSON.stringify(saveDatas), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {

                if (res.code == 200) {
                    this.opens()
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        }
    }
};
</script>

<style lang="scss">
.el-table th {
    background: #f9f9f9;
}

#inNewbu .el-table__body-wrapper /deep/ tr td:nth-child(3)>.cell {
    white-space: pre-line !important;
    text-indent: 0 !important;
    text-align: left !important;
    padding-left: 5%;
}

#inNewbu .el-table__body-wrapper /deep/ tr td {
    text-align: center;
    text-indent: 0;
    border-right: none !important;
}

#inNewbu .el-table__header /deep/ th {
    border-right: none !important;
}

#inNewbu .el-table__header /deep/ th>.cell {
    text-align: center;
    float: left;
    text-indent: 0;
}

.header {
    padding-left: 0;
    padding-right: 2.6%;
    padding-top: 15px;
    position: fixed;
    width: 100%;
    -webkit-box-shadow: 4px 2px 6px #888;
    height: 52px;
    top: 60px;
    left: 0;
    background: #fff;
    z-index: 99999;

    .el-breadcrumb {
        line-height: 30px;
    }
}

.exportUpload {
    float: right;
}

.edit,
.detail {
    float: right;
    display: block;
    padding: 0;
    background: transparent;
    border: none;
}

.edit {
    color: #4285F4;
}

.detail {
    color: #FF2B2B;
}

.detail:visited {
    color: #FF2B2B;
}

.edit {
    margin-right: 20px;
}

.container {
    padding-top: 20px;
}

.section-dealise {
    font-size: 14px;

    .titIcon {
        em {
            display: inline-block;
            width: 2px;
            height: 14px;
            background: #4285F4;
            vertical-align: middle;
            margin-right: 6px;
            float: left;
            margin-top: 28px;
        }

        .zdName {
            margin-left: 15px;
            display: inline-block;
            max-width: 320px;
            line-height: 20px;
            float: left;
            padding-top: 24px;
        }

        .el-button--primary {
            float: right;
            padding: 6px 10px;
            font-size: 12px;
            margin-right: 20px;
            margin-left: 0;
            margin-top: 15px;
        }
		.standardBtn {
			width:auto;
			padding:0 10px!important;
		}
    }
}

.render {
    .el-breadcrumb {
        margin-bottom: 16px;
    }

    .box {
        min-height: 250px;
        background: #fff;
        padding: 16px 16px 0 16px;
        -webkit-box-shadow: 4px 2px 6px #888;
        margin-top: 2px;
        border-radius: 8px;

        .titIcon {
            font-size: 14px;
            margin-bottom: 30px;

            em {
                display: inline-block;
                width: 2px;
                height: 14px;
                background: #4285F4;
                vertical-align: middle;
                margin-right: 6px;
            }
        }
    }

    .el-tabs__active-bar {
        display: none;
    }

    .is-active {
        background: #4285F4 !important;
        color: #fff !important;
        text-align: center;
    }
}

.exportBtn,
.newBuildBtn {
    float: right;
    margin-right: 5px;
    width: 68px;
    height: 26px;
    padding: 0;
    font-size: 12px;
}

.exportBtn {
    margin-right: 20px;
}

.el-table__row {
    text-indent: 0px;
}

t-body {
    text-indent: 0px;
}

.section-rowdccs {
    margin-bottom: 50px;
    padding: 0 16px 16px;
    background: #FFFFFF;
    box-shadow: 4px 2px 6px #888;
    border-radius: 8px;
    top: 26px;
    display: flex;
    position: relative;
    flex-direction: column;
}

.section-dealise {
    line-height: 70px;
}

.el-table--border td,
.el-table--border th {
    border-right: none;
}

.mbtm20 {
    margin-top: 20px;

    .cell {
        text-align: center;
    }
}

.zdNo .el-form-item__label {
    padding-left: 5%;
    padding-right: 4%;
}

.zdNo .el-form-item__content .el-select {
    width: 50%;
}

.inOdd .el-form-item__content .el-select {
    width: 50%;
    float: left;
}

.el-table__empty-block {
    background: #fff;
}

.standardBtn {
    width: 68px;
    height: 26px;
    padding: 0;
    font-size: 12px;
}
</style>
