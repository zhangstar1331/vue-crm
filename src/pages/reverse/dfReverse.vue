<template>
<el-container id="dfContainer" class="container">
    <maskTable :faShow="faShow" @closeMask="closeMaskTable"></maskTable>
    <el-header class="header" style="padding-left:218px">
        <el-row>
            <el-col :span="12">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/repository/df-manage',query:{'id':'1_cdf'}}">东方制度管理</el-breadcrumb-item>
                    <el-breadcrumb-item class="txtColor">{{wgName}}</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
            <el-col :span="12" align="right">
                <el-button type="primary" class="standardBtn" size="mini" @click="back">返回</el-button>
                <el-button type="primary" class="standardBtn" @click="submitAll" size="mini">提交</el-button>
                <el-button type="primary" class="standardBtn" @click="saveAll" size="mini">保存</el-button>
            </el-col>
        </el-row>
    </el-header>
    <div class="render" style="margin-top: 55px;">
        <div class="box" style="min-height: 200px;">
            <div class="titIcon"><em></em><span style="font-weight: 600">基本信息</span></div>
            <regulationsCheck :echoData="detailDatas"></regulationsCheck>
        </div>
    </div>
    <!--相关文件-->
    <div class="render mbtm20">
        <div class="box" style="padding-bottom: 16px;min-height: 200px;">
            <!--tittle-->
            <el-row>
                <el-col :span="12">
                    <div class="titIcon"><em></em><span style="font-weight: 600">相关文件</span></div>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-upload class="upload-demo" :show-file-list="false" ref="upload" action="" :http-request="uploadFile" multiple accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx">
                        <el-button size="small" class="standardBtn" type="primary">上传附件</el-button>
                    </el-upload>
                </el-col>
            </el-row>
            <!--content-->
            <el-table :data="tableData" style="width: 100%;border: 1px solid #E9E9E9;">
                <el-table-column type="index" width="82" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="文件名">
                    <template slot-scope="scope">
                        <span class="fileCss">
                            <i class="el-icon-document"></i> {{scope.row.name}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="文件类型">
                    <template slot-scope="scope">
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
    <div class="section-rowdccs" id="dfReser" v-if="tableShow">
        <div class="section-dealise">
            <div class="titIcon">
                <em></em><span style="font-weight: 600;float: left;">拆分导入</span>
                <span class="zdName" style="color: #4285F4;color: #000;">{{zdName}}</span>
                <span style="display: inline-block;float: left;padding-left: 6px;padding-right: 6px;">--</span>
                <span class="zdName" style="margin-left: 5px;">{{fileName}}</span>
                <el-button type="primary" class="standardBtn" style="margin-right:0" v-if="downLoadBtn" @click="downLoadTemplate">下载模板</el-button>
                <el-upload v-if="exportBtn" class="upload-demo exportUpload" ref="upload" :show-file-list="false" action="" :http-request="uploadTemplate" multiple accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx">
                    <el-button size="small" class="standardBtn" type="primary">导入数据</el-button>
                </el-upload>
                <el-button type="primary" class="standardBtn" v-if="deleteBtn" @click="deleteAll">删除列表</el-button>
                <el-button type="primary" class="standardBtn" v-if="createdBtn" @click="createFt">创建法条</el-button>
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
        <el-pagination style="text-align: center;margin-top: 16px;" @size-change="handleSizeChange" :current-page.sync="currentPage" @current-change="handleCurrentChange" background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="total"></el-pagination>
    </div>

</el-container>
</template>

<script>
import regulationsCheck from 'src/components/check/dfRegulationsCheck'
import maskTable from 'src/components/maskTable/dfMaskTable'
import {
    fileDownload,
    fileNameCombine
} from 'src/utils/utils.js'
import qs from 'qs'
export default {
    data() {
        return {
            status_arr: [],
            zdName: '',
            currentPage: 1,
            radios: '',
            reviseId: '', //watch监听
            wgName: '维护东方制度',
            instId: '',
            tableCont: [],
            detailDatas: '',
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
        this.getReviseId()
        sessionStorage.saveDatas = JSON.stringify({
            'type': '2'
        });
    },
    methods: {
        loadFile(index, row) {
            var obj = new Object()
            obj.filePath = row.url;
            obj.fileName = encodeURIComponent(row.name);
            this.axios.post('comm/download/103', qs.stringify(obj), {
                responseType: 'arraybuffer'
            }).then((res) => {
                fileDownload(res, fileNameCombine(row.name, row.url));
            })
            //window.open(this.serveUrl+"/instweb/download/institutionfile?url="+row.path+"&fileName="+encodeURIComponent(row.name));
        },
        getReviseId() {
            sessionStorage.instId = '';
            const instIds = sessionStorage.instId === undefined ? '' : sessionStorage.instId;
            if (instIds != '') {
                this.instId = sessionStorage.instId;
            } else {
                this.instId = this.$route.query.id
            }
            this.getDetail(this.instId)
            this.reviseId = this.$route.query.id
            const infoDatas = {
                'institutionId': '',
                'reviseId': this.reviseId
            }
            localStorage.setItem('infoData', JSON.stringify(infoDatas))

        },
        getDetail(id) {
            this.axios.post('instweb/detail', JSON.stringify({
                id: id
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                sessionStorage.setItem('detailData', JSON.stringify(res.data))
                this.detailDatas = res.data;
                this.zdName = res.data.name;
                if (res.data.file != undefined) {
                    localStorage.setItem('fileId', res.data.file[0].id)
                }
                var saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'));
                saveDatas.reviseId = JSON.parse(localStorage.getItem('infoData')).reviseId;
                saveDatas.id = '';
                sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas));
                //回填相关文件
                if (res.data.file != undefined) {
                    localStorage.setItem('fileId', res.data.file[0].id)
                    this.fileName = res.data.file[0].name;
                    for (var i = 0; i < res.data.file.length; i++) {
                        this.tableData.push({
                            name: res.data.file[i].name,
                            fileId: res.data.file[i].id,
                            path: res.data.file[i].url,
                            radio: res.data.file[i].type
                        })
                        var fileKey = res.data.file[i].id
                        this.status_arr = [];
                        this.status_arr.push({
                            text: "制度",
                            code: '1'
                        }, {
                            text: "附件",
                            code: "0"
                        })
                        if (res.data.file[i].name.indexOf('附件') != -1) {
                            this.tableData[this.tableData.length - 1].radio = '0';
                            this.fileFlag.push({
                                fileKey: fileKey + '_0'
                            })
                        } else {
                            this.tableData[this.tableData.length - 1].radio = '1';
                            this.fileFlag.push({
                                fileKey: fileKey + '_1'
                            })
                        }
                        this.filePath = res.data.file[i].url;
                        this.radios = res.data.file[i].type;
                        const saveDatas = JSON.parse(sessionStorage.saveDatas);
                        saveDatas.fileFlag = this.fileFlag;
                        sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas))
                    }
                }
                //回填法条
                if (res.data.query != undefined) {
                    this.tableShow = true;
                    if (res.data.query.data != null) {
                        this.tableCont = res.data.query.data;
                    }
                    this.total = (res.data.query.totalPage) / 1 * 10;
                }

            })
        },
        //上传文件
        uploadFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            var infoData = JSON.parse(localStorage.getItem('infoData'))
            var id = sessionStorage.instId;
            var reviseId = infoData === null ? "" : infoData.reviseId;
            //设置保存时候的入参的制度id
            const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
            saveDatas.id = id;
            sessionStorage.setItem('saveDatas', saveDatas)
            form.append("file", fileObj);
            this.getInfoData();
            form.append('id', id)
            form.append('reviseId', reviseId)
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
                        this.tableData[this.tableData.length - 1].radio = '1';
                        this.fileFlag.push({
                            fileKey: fileKey + '_1'
                        })
                    }
                    infoData.institutionId = res.data.id === undefined ? '' : res.data.id;
                    infoData.fileId = res.data.FileId === undefined ? '' : res.data.FileId;
                    infoData.reviseId = infoData.reviseId;
                    //存储每次操作后返回的修订id
                    sessionStorage.instId = res.data.id;

                    saveDatas.fileFlag = this.fileFlag;
                    saveDatas.id = res.data.id === undefined ? '' : res.data.id;
                    localStorage.setItem('infoData', JSON.stringify(infoData))
                    sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas))
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
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
            const instId = sessionStorage.instId;
            const fileID = localStorage.getItem('fileId')
            const reviseId = infoData.reviseId;
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            form.append('fileId', fileID);
            form.append('reviseId', reviseId);
            form.append('institutionId', instId);
            return this.axios.post('instweb/fileUpload', form).then((res) => {
				if (res.code == 200) {
                    //设置拆分时候入参用到的制度id 和 文件id
					sessionStorage.instId = res.data;
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
                sessionStorage.instId = res.data.institutionId
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
                this.splitData.institutionId = sessionStorage.instId;
                this.splitData.fileId = localStorage.getItem('fileId');
                this.splitData.reviseId = this.infoData.reviseId;
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
                this.deleteFileData.id = sessionStorage.instId;
                this.deleteFileData.reviseId = this.infoData.reviseId
                this.deleteFileData.fileId = row.fileId;
                this.axios.post('instweb/delFile', JSON.stringify(this.deleteFileData), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    const infoData = JSON.parse(localStorage.getItem('infoData'));
                    const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
                    infoData.institutionId = res.data;
                    sessionStorage.instId = res.data;
                    saveDatas.id = res.data;
                    saveDatas.fileFlag.splice(index, 1)
                    this.fileFlag.splice(index, 1)
                    if (saveDatas.fileFlag.length == 0) {
                        delete saveDatas.fileFlag;
                    }
                    localStorage.setItem('infoData', JSON.stringify(infoData))
                    sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas));
                    this.deleteFileData = {};
                    this.deleteFileData.institutionId = infoData.institutionId;
                    this.deleteFileData.fileId = row.fileId;
                    if (res.code === 200) {
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
            this.fileName = row.name;
            this.tableShow = true
            this.getInfoData();
            this.splitData.institutionId = this.instId == undefined ? '' : this.instId;
            this.splitData.fileId = row.fileId;
            this.splitData.reviseId = this.infoData.reviseId;
            localStorage.setItem('fileId', row.fileId)
            this.splitData.resolve = this.getResolve(row.fileId) / 1;
            this.splitData.pageNo = 1;
            this.splitData.cf = "1";
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
                this.deleteSingleData.institutionId = this.instId;
                this.deleteSingleData.fileId = fileID;
                this.deleteSingleData.reviseId = this.infoData.reviseId;
                this.axios.post('instweb/item/del', JSON.stringify(this.deleteSingleData), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    sessionStorage.instId = res.data;
                    this.splitData.institutionId = this.instId === undefined ? '' : res.data;
                    this.splitData.reviseId = this.infoData.reviseId;
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
                    this.deleteAllData.institutionId = this.instId;
                    this.deleteAllData.fileId = fileID;
                    this.deleteAllData.reviseId = this.infoData.reviseId;
                    this.axios.post('instweb/item/delAll', JSON.stringify(this.deleteAllData), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                        if (res.code == 200) {
                            var saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'));
                            saveDatas.id = res.data;
                            sessionStorage.setItem('saveDatas', JSON.stringify(saveDatas));
                            this.getInfoData();
                            sessionStorage.instId = res.data; //删除后更新修订id instId;
                            this.deleteAllData.institutionId = res.data;
                            this.deleteAllData.fileId = fileID;
                            this.deleteAllData.reviseId = this.infoData.reviseId;
                            this.checkData(this.deleteAllData)

                        } else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    })
                })
                .catch(_ => {});
        },
        tdEdit(index, row) {
            this.getInfoData();
            this.singleTdTxt.institutionId = this.instId;
            this.singleTdTxt.chapter = row.chapter;
            this.singleTdTxt.clause = row.clause;
            this.singleTdTxt.content = row.content;
            this.singleTdTxt.fileId = row.fileId;
            this.singleTdTxt.reviseId = this.infoData.reviseId;
            this.singleTdTxt.id = row.id;
            this.singleTdTxt.type = 1;
            localStorage.setItem('singleData', JSON.stringify(this.singleTdTxt))
            this.faShow = true;
        },
        getInfoData() {
            var infoData = JSON.parse(localStorage.getItem('infoData'));
            this.infoData = infoData;
            this.instId = sessionStorage.instId;
        },
        handleSizeChange(value) {
            //下一页请求数据
            this.getInfoData();
            this.splitData.institutionId = this.instId;
            this.splitData.fileId = localStorage.getItem('fileId');
            this.splitData.pageNo = value;
            if (this.splitData.reviseId == undefined) {
                var reviseId = JSON.parse(localStorage.getItem('infoData')).reviseId;
                this.splitData.reviseId = reviseId
            }
            this.splitData.resolve = 0;
            delete this.splitData.cf;
            this.checkData(this.splitData)
        },
        handleCurrentChange(value) {
            //下一页请求数据
            this.getInfoData();
            this.splitData.institutionId = this.instId;
            this.splitData.fileId = localStorage.getItem('fileId');
            this.splitData.pageNo = value;
            if (this.splitData.reviseId == undefined) {
                var reviseId = JSON.parse(localStorage.getItem('infoData')).reviseId;
                this.splitData.reviseId = reviseId
            }
            this.splitData.resolve = 0;
            delete this.splitData.cf;
            this.checkData(this.splitData)
        },
        saveAll() {
            const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))

            if (!(saveDatas.fileNoHead != undefined && saveDatas.fileNoHead != '' && saveDatas.fileNoBody != '' && saveDatas.fileNoFoot != '')) {
                this.$alert('制度文号不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.name == undefined || saveDatas.name == '') {
                this.$alert('制度名称不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.department == undefined || saveDatas.department == '') {
                this.$alert('维护部门不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.dfCategory == '00' || saveDatas.dfCategory == '') {
                this.$alert('适用类型不能为空', '提示', {
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
            } else if (saveDatas.endDate == undefined || saveDatas.endDate == '') {
                this.$alert('使用期限不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
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
        submitAll() {
            const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
            if (saveDatas.id == '') {
                saveDatas.id = sessionStorage.instId;
            }
            if (!(saveDatas.fileNoHead != undefined && saveDatas.fileNoHead != '' && saveDatas.fileNoBody != '' && saveDatas.fileNoFoot != '')) {
                this.$alert('制度文号不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.name == undefined || saveDatas.name == '') {
                this.$alert('制度名称不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.department == undefined || saveDatas.department == '') {
                this.$alert('维护部门不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.dfCategory == undefined || saveDatas.dfCategory == '') {
                this.$alert('适用范围不能为空', '提示', {
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
            } else if (saveDatas.endDate == undefined || saveDatas.endDate == '') {
                this.$alert('使用期限不能为空', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.fileFlag == undefined || saveDatas.fileFlag == '') {
                this.$alert('请先上传制度文件', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            } else if (saveDatas.fileNoHead == this.detailDatas.fileNoHead && saveDatas.fileNoBody == this.detailDatas.fileNoBody && saveDatas.fileNoFoot == this.detailDatas.fileNoFoot) {
                this.$alert('请联系系统超级管理员进行回退操作，并到待维护制度中修改后提交', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.axios.post('instweb/submit', JSON.stringify(saveDatas), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if (res.code == 200) {
                    sessionStorage.removeItem('instId')
                    this.$alert('提交成功', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$router.push({
                                path: '/repository/df-manage', //跳转的路径
                                query: {
                                    'id': '1_cdf'
                                }
                            })
                        }
                    });
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        back() {
            this.$router.push({
                path: '/repository/df-manage', //跳转的路径
                query: { //路由传参时push和query搭配使用 ，作用时传递参数
                    'id': '1_cdf'
                }
            })
        }
    }
};
</script>

<style lang="scss">
#dfReser .el-table__body-wrapper /deep/ tr td:nth-child(3)>.cell {
    white-space: pre-line !important;
    text-indent: 0 !important;
    text-align: left !important;
    padding-left: 5%;
}

#dfReser .el-table__body-wrapper /deep/ tr td {
    text-align: center;
    text-indent: 0;
    border-right: none !important;
}

#dfReser .el-table__header /deep/ th {
    border-right: none !important;
}

#dfReser .el-table__header /deep/ th>.cell {
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

#dfReser {
    margin-bottom: 50px;
    padding: 0 16px 16px;
    background: #FFFFFF;
    box-shadow: 4px 2px 6px #888;
    border-radius: 8px;
    top: 25px;
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

.fileCss {
    color: #4285F4;
}

.fileCss:hover {
    cursor: pointer;
}

.standardBtn {
    width: 68px;
    height: 26px;
    padding: 0;
    font-size: 12px;
}
</style>
