<template>
  <div class="page">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好管理</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好传导体系</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item class="txtColor">动态偿付能力数据</el-breadcrumb-item>
        </el-breadcrumb>
      <div class="page-btn">
          <el-button type="primary" class="btn" @click="handleSubmit" v-if="!isDetail">提交</el-button>
          <el-button type="primary" class="btn" @click="handleBack">返回</el-button>
      </div>
      <div class="info">
          <div class="info-title"><i></i>基本信息</div>
          <div class="info-body">
            <el-form :inline="true" class="info-form">
                <el-form-item label="动态偿付能力数据：" class="info-form__item">
                    <div v-if="isDetail">{{ payAbilityDataName }}</div>
                    <el-input v-model.trim="payAbilityDataName" placeholder="请输入动态偿付能力数据名称" style="width:280px" v-else size="small"></el-input>
                </el-form-item>
                <el-form-item label="报告年度：" class="info-form__item">
                    <div v-if="year">{{ payYear }}</div>
                    <el-select v-model="payYear" placeholder="请选择" v-else size="small">
                        <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用对象：" class="info-form__item">
                    <div>{{ applyObject }}</div>
                </el-form-item>
                <el-form-item label="创建部门：" class="info-form__item">
                    <div>{{ createDep }}</div>
                </el-form-item>
                <el-form-item label="创建人：" class="info-form__item">
                    <div>{{ creator }}</div>
                </el-form-item>
            </el-form>
          </div>
      </div>
      <div class="main">
          <div class="main-title"><i></i>动态偿付能力数据</div>
          <el-tabs v-model="activeName" type="card" class="main-tab">
            <el-tab-pane label="偿付能力压力测试表" name="first">
                <div class="main-header">
                    <el-form :inline="true" class="main-header__form">
                        <el-form-item label="公司:" class="main-header__form--item">
                            <div>中华联合财产保险股份有限公司</div>
                        </el-form-item>
                        <el-form-item label="情景:" class="main-header__form--item">
                            <div>基本情景</div>
                        </el-form-item>
                        <el-form-item label="单位:" class="main-header__form--item">
                            <div>万元</div>
                        </el-form-item>
                    </el-form>
                    <div class="main-btn" v-if="!isDetail">
                        <el-button type="primary" class="btn" @click="loadFile">下载模板</el-button>
                        <el-upload
                        class=""
                        ref="upload"
                        action="#"
                        :show-file-list="false"
                        :file-list="fileList"
                        :on-change="handleExport"
                        :auto-upload="false">
                        <el-button slot="trigger" type="primary" class="btn">导入数据</el-button>
                        </el-upload>
                    </div>
                </div>
                <div >
                    <el-table :data="payAbilityList" :header-cell-style="{ background: '#f5f7fa'}"  class="main-table" key=1>
                        <el-table-column label="项目" align='center'>
                            <template slot-scope="scope">
                                <div>{{scope.row.project}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="行次" align='center'>
                             <template slot-scope="scope">
                                <div>{{scope.row.line}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="报告年度末"  align='center'>
                            <template slot-scope="scope">
                                 <div v-if="isDetail">{{scope.row.reportYearLine}}</div>
                                <el-input v-model.trim="scope.row.reportYearLine" 
                                @change="handleChange(scope.row.reportYearLine,scope.$index,'reportYearLine')"
                                size="small" v-else :placeholder="scope.row.reportYearLine|filterPlaceholder(scope.row.project)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align='center'>
                            <template slot="header">
                                <div class="col-title">报告年度后第一年</div>
                            </template>
                            <template slot-scope="scope">
                                 <div v-if="isDetail">{{scope.row.reportFirstYear}}</div>
                                <el-input v-model.trim="scope.row.reportFirstYear" @change="handleChange(scope.row.reportFirstYear,scope.$index,'reportFirstYear')" 
                                    size="small" v-else :placeholder="scope.row.reportFirstYear|filterPlaceholder(scope.row.project)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column  label="报告年度后第二年"  align='center'>
                            <template slot-scope="scope">
                                 <div v-if="isDetail">{{scope.row.reportSecondYear}}</div>
                                <el-input v-model.trim="scope.row.reportSecondYear" 
                                 @change="handleChange(scope.row.reportSecondYear,scope.$index,'reportSecondYear')"
                                size="small" v-else :placeholder="scope.row.reportSecondYear|filterPlaceholder(scope.row.project)"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>  
            </el-tab-pane>
            <el-tab-pane label="预测最低资本表" name="second" class="main-label">
                <div class="main-header">
                    <el-form :inline="true" class="main-header__form">
                        <el-form-item label="公司:" class="main-header__form--item">
                            <div>中华联合财产保险股份有限公司</div>
                        </el-form-item>
                        <el-form-item label="情景:" class="main-header__form--item">
                            <div>基本情景</div>
                        </el-form-item>
                        <el-form-item label="单位:" class="main-header__form--item">
                            <div>万元</div>
                        </el-form-item>
                    </el-form>
                    <div class="main-btn"  v-if="!isDetail">
                        <el-button type="primary" class="btn" @click="loadFile">下载模板</el-button>
                        <el-upload
                        class=""
                        ref="upload"
                        action="#"
                        :show-file-list="false"
                        :file-list="fileList"
                        :on-change="handleExport"
                        :auto-upload="false">
                        <el-button slot="trigger" type="primary" class="btn">导入数据</el-button>
                        </el-upload>
                    </div>
                </div>
                 <el-table :data="forcastLowCapitalList" class="main-table" :header-cell-style="{ background: '#f5f7fa'}" key=2>
                        <el-table-column  label="行次" align='center'>
                            <template slot-scope="scope">
                                <div>{{scope.row.line}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="项目" align='center'>
                             <template slot-scope="scope">
                                <div>{{scope.row.project}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="报告年度末"  align='center'>
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.reportYearLine}}</div>
                                <el-input v-model.trim="scope.row.reportYearLine" 
                                 @change="handleChange1(scope.row.reportYearLine,scope.$index,'reportYearLine')"
                                size="small" v-else :placeholder="scope.row.reportYearLine|filterPlaceholder(scope.row.project)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align='center'>
                            <template slot="header">
                                <div class="col-title">报告年度后第一年</div>
                            </template>
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.reportFirstYear}}</div>
                                <el-input v-model.trim="scope.row.reportFirstYear" 
                                 @change="handleChange1(scope.row.reportFirstYear,scope.$index,'reportFirstYear')"
                                size="small" v-else :placeholder="scope.row.reportFirstYear|filterPlaceholder(scope.row.project)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column  label="报告年度后第二年"  align='center'>
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.reportSecondYear}}</div>
                                <el-input v-model.trim="scope.row.reportSecondYear" 
                                 @change="handleChange1(scope.row.reportSecondYear,scope.$index,'reportSecondYear')"
                                size="small" v-else :placeholder="scope.row.reportSecondYear|filterPlaceholder(scope.row.project)"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
            </el-tab-pane>
          </el-tabs>
      </div>
      <div class="version main" v-if="isDetail">
            <div class="main-title"><i></i>版本记录</div>
            <el-table :data="versionList" :header-cell-style="{ background: '#f5f7fa'}"> 
                <el-table-column type="index" label="序号"  align='center' :index="handleIndex"></el-table-column>
                <el-table-column label="动态偿付能力数据" align='center' :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div @click="goDetail(scope.row)" 
                            style="cursor: pointer; color:#4285f4;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
                            word-break: break-all;">{{scope.row.payAbilityDataName}}</div>
                        </template>
                </el-table-column>
                <el-table-column prop="creator" label="报送人员"  align='center'></el-table-column>
                <el-table-column prop="_createDate" label="报送时间"  align='center'></el-table-column>
                <el-table-column prop="_updateDate" label="维护时间"  align='center'></el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import tableData from "./src/data.js"
import {fomatFloat} from 'src/utils/utils.js'
function getDate(date){
    date = date*1000;
    var time = new Date(date);
    var year= time.getFullYear()  //年
    var month = ("0" + (time.getMonth() + 1)).slice(-2); //月
    var day = ("0" + time.getDate()).slice(-2); //日
    var hour = ("0" + time.getHours()).slice(-2);
    var minute = ("0" + time.getMinutes()).slice(-2);
    var second = ("0" + time.getSeconds()).slice(-2);
    var mydate = year + "-" + month + "-" + day + ' ' + hour + ":" + minute + ':' + second;
    return mydate
}
function Trim(str){ 
  return str.replace(/(^\s*)|(\s*$)/g, ""); 
}
import XLSX from 'xlsx';
import qs from 'qs'
import { fileDownload } from 'src/utils/utils.js';
export default {
    props:{
    },
    data(){
        return {
            payAbilityDataName:'',
            payYear:'',
            applyObject:'中华财险',
            createDep:'',
            creator:'',
            activeName:'first',
            payAbilityTest:null,
            payAbilityList:tableData.payAbilityList,
            fileList:[],
            forcastLowCapital:null,
            forcastLowCapitalList:tableData.forcastLowCapitalList,
            versionList:[],
            payAbilityKey:tableData.payAbilityKey,
            forcastLowCapitalkey:tableData.forcastLowCapitalkey,
            payAbilityXlsx:tableData.payAbilityXlsx,
            forcastLowCapitalXlsx:tableData.forcastLowCapitalXlsx,
        }
    },
    beforeMount(){
        if(this.year){
            this.getDetail();
        }
         
    },
    filters:{
        filterPlaceholder(val,project){
            if(project!=='综合偿付能力充足率'&&project!=='核心偿付能力充足率'){
                return '请输入数字'
            }
            return '请输入百分数'

        }
    },
    computed:{
        yearList(){
            let now=new Date().getFullYear();
            let ary=[];
            for(let i=now;i>=2015;i--){
                ary.push (i);
            }
            return ary;
        },
        isDetail(){
            return !!this.$route.query.isDetail;
        },
        year(){
            return this.$route.query.year?this.$route.query.year:''
        },

    },
    methods:{
        getDetail(){
            const params={ year:this.year }
            this.axios.get('riskPayability/showDetail',{params}).then((res)=>{
                if(res.code == 200) {
                    this.payAbilityDataName = res.data.payAbilityDetail.payAbilityDataName;
                    this.payYear = res.data.payAbilityDetail.payYear;
                    this.applyObject = res.data.payAbilityDetail.applyObject;
                    this.createDep = res.data.payAbilityDetail.createDep;
                    this.creator = res.data.payAbilityDetail.creator;
                    this.payAbilityTest = res.data.payAbilityDetail.payAbilityTest;
                    this.forcastLowCapital = res.data.payAbilityDetail.forcastLowCapital;
                    this.versionList = res.data.versionList;
                    this.payAbilityList=[];
                    this.forcastLowCapitalList=[]; 
                    this.payAbilityKey.forEach(item=>{
                        if(this.payAbilityTest[item.key]){
                             this.payAbilityList.push(this.payAbilityTest[item.key])
                        }
                    })
                    this.forcastLowCapitalkey.forEach(item=>{
                        if(this.forcastLowCapital[item.key]){
                             this.forcastLowCapitalList.push(this.forcastLowCapital[item.key])
                        }
                    })
                    this.versionList.forEach(item=>{
                        if(item.createDate){
                            item._createDate = getDate(item.createDate);
                        }
                        if(item.updateDate){
                            item._updateDate = getDate(item.updateDate);
                        }
                    })

                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
  			}).catch((response) => {
                this.$alert('操作失败', '提示', {
                    confirmButtonText: '确定'
                });
            })
        },
        handleBack(){
            this.$router.back();
        },
        handleParams(payAbilityList,forcastLowCapitalList){
            let msg='';
            let reg=/^(-?\d+)(\.\d+)?$/;
            let reg1=/^(-?[1-9]?\d+(\.\d+)?)%$/;
            forcastLowCapitalList&&forcastLowCapitalList.forEach(item=>{
                if(item.reportYearLine&&!reg.test(item.reportYearLine)){
                    msg=`${item.project}格式不正确`
                }
                if(item.reportSecondYear&&!reg.test(item.reportSecondYear)){
                    msg=`${item.project}格式不正确`
                }
                if(item.reportFirstYear&&!reg.test(item.reportFirstYear)){
                    msg=`${item.project}格式不正确`
                }
            })
            payAbilityList&&payAbilityList.forEach(item=>{
                if(item.project!=='综合偿付能力充足率'&&item.project!=='核心偿付能力充足率'){               
                    if(item.reportYearLine&&!reg.test(item.reportYearLine)){
                        msg=`${item.project}格式不正确1`
                    }
                    if(item.reportSecondYear&&!reg.test(item.reportSecondYear)){
                        msg=`${item.project}格式不正确2`
                    }
                    if(item.reportFirstYear&&!reg.test(item.reportFirstYear)){
                        msg=`${item.project}格式不正确3`
                    }
                } else {
                   if(item.reportYearLine&&!reg1.test(item.reportYearLine)){
                        msg=`${item.project}格式不正确`
                    }
                    if(item.reportSecondYear&&!reg1.test(item.reportSecondYear)){
                        msg=`${item.project}格式不正确`
                    }
                    if(item.reportFirstYear&&!reg1.test(item.reportFirstYear)){
                       
                        msg=`${item.project}格式不正确`
                    } 
                }
            }) 
            if(msg){
                this.$alert(msg, '提示', {
                    confirmButtonText: '确定'
                });
                return false;
            }
            return true;
        },
        handleSubmit(){
            let msg='';
            let reg=/^(-?\d+)(\.\d+)?$/;
            let reg1=/^(-?[1-9]?\d+(\.\d+)?)%$/;
            this.forcastLowCapitalList.forEach(item=>{
                if(item.reportYearLine&&!reg.test(item.reportYearLine)){
                    msg=`${item.project}格式不正确`
                }
                if(item.reportSecondYear&&!reg.test(item.reportSecondYear)){
                    msg=`${item.project}格式不正确`
                }
                if(item.reportFirstYear&&!reg.test(item.reportFirstYear)){
                    msg=`${item.project}格式不正确`
                }
                if(item.reportFirstYear===''){
                    msg='预测最低资本表填报不完整'; 
                }
            })
            this.payAbilityList.forEach(item=>{
                if(item.project!=='综合偿付能力充足率'&&item.project!=='核心偿付能力充足率'){               
                    if(item.reportYearLine&&!reg.test(item.reportYearLine)){
                        msg=`${item.project}格式不正确1`
                    }
                    if(item.reportSecondYear&&!reg.test(item.reportSecondYear)){
                        msg=`${item.project}格式不正确2`
                    }
                    if(item.reportFirstYear&&!reg.test(item.reportFirstYear)){
                        msg=`${item.project}格式不正确3`
                    }
                } else {
                   if(item.reportYearLine&&!reg1.test(item.reportYearLine)){
                        msg=`${item.project}格式不正确`
                    }
                    if(item.reportSecondYear&&!reg1.test(item.reportSecondYear)){
                        msg=`${item.project}格式不正确`
                    }
                    if(item.reportFirstYear&&!reg1.test(item.reportFirstYear)){
                        msg=`${item.project}格式不正确`
                    } 
                }
                if(item.reportFirstYear===''){
                    msg='偿付能力压力测试表填报不完整'
                }
            })
            if(!this.forcastLowCapitalList.length){
                msg='请导入预测最低资本表'
            }
            if(!this.payAbilityList.length){
                msg='请导入偿付能力压力测试表'
            }
            if(!this.payYear){
                msg='请选择报告年度'
            } 
            if(!this.payAbilityDataName){
                msg='请填写动态偿付能力数据'
            }  
            if(msg){
                this.$alert(msg, '提示', {
                    confirmButtonText: '确定'
                });
                return false;
            }
            let url=this.year?'riskPayability/editPayAbility':"riskPayability/addPayAbility";
            let payAbilityTest={};
            let forcastLowCapital={};
            this.payAbilityKey.forEach(item=>{
                let obj=this.payAbilityList.find(el=>el.project===item.project);
                if(obj){
                    payAbilityTest[item.key]=obj
                }   
            })
            this.forcastLowCapitalkey.forEach(item=>{               
                let obj=this.forcastLowCapitalList.find(el=>el.project===item.project);
                if(obj){
                    forcastLowCapital[item.key]=obj
                }   
            })
            const params = {
                payYear:this.payYear,
                payAbilityDataName:this.payAbilityDataName,
                applyObject:this.applyObject,
                createDep :this.createDep,
                creator :this.creator,
                payAbilityTest:payAbilityTest,
                forcastLowCapital :forcastLowCapital
            }
           this.axios.post(url,JSON.stringify(params),{headers:{'Content-Type':'application/json'}}).then((res)=>{
                if(res.code === 200) {
                    this.$alert('提交成功', '提示', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.$router.push({name:'solvencyData'});
                        }
                    });
                   
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
  			}).catch((response) => {
                this.$alert('操作失败', '提示', {
                    confirmButtonText: '确定'
                });
            })
        },
        handleExport(file, fileList){
            const reader = new FileReader();
            let _this=this;
            reader.onload = (e) => {
                /* 解析数据 */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, {type: 'binary'});
                /* 获取文件的第一个工作表（WorkSheet） */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* 数组转换 */
                let title= this.activeName==='first'?['project','line','reportYearLine','reportFirstYear','reportSecondYear']:['line','project','reportYearLine','reportFirstYear','reportSecondYear']
                const data = XLSX.utils.sheet_to_json(ws, {header:title,raw:false});
                /* 进行表格数据更新 */
                
                let tableData=[];
                data.forEach(item=>{
                    if(item.project&&item.line&&item.line!=='行次'){
                        title.forEach(ele=>{
                            // 去掉前后空格
                            if(item[ele]){
                                item[ele]=Trim(item[ele]);
                                if(ele!=='line'&&ele!=='project'){
                                    if(!item[ele].includes('%')){
                                        // 有小数的保留两位小数
                                        item[ele]=this.handleNum(item[ele])
                                    } else {
                                        let index=item[ele].split('').findIndex(i=>i==='%');
                                        let num=index>0?item[ele].split('').slice(0,index).join(''):item[ele];
                                        item[ele]=index>0?this.handleNum(num)+'%':item[ele];
                                    }
                               }
                            }
                            if(typeof(item[ele])==='undefined'){
                                this.$set(item,ele,'')
                            }
                        })
                        tableData.push(item)
                    }
                })
                let cloneData=JSON.parse(JSON.stringify(data));
                
                if(this.activeName==='first') {
                    cloneData.forEach((item,index)=>{
                        if(index>4&&item.line){
                            Reflect.deleteProperty(item, 'reportYearLine');
                            Reflect.deleteProperty(item, 'reportFirstYear');
                            Reflect.deleteProperty(item, 'reportSecondYear')
                            item.reportYearLine='';
                            item.reportFirstYear='';                  
                            item.reportSecondYear=''; 
                        }
                                        
                    })
                     cloneData[2]=JSON.parse(JSON.stringify(this.payAbilityXlsx[2]))
                    if(JSON.stringify(cloneData)!==JSON.stringify(this.payAbilityXlsx)){
                        this.$alert('请导入正确的表格', '提示', {
                            confirmButtonText: '确定'
                        });
                        return false;
                    }
                    let flag=this.handleParams(tableData,null);
                    if(flag){
                        this.payAbilityList=tableData;
                    }
                   
                } else {
                   
                    cloneData.forEach((item,index)=>{
                        if(index>4&&item.project){
                            Reflect.deleteProperty(item, 'reportYearLine');
                            Reflect.deleteProperty(item, 'reportFirstYear');
                            Reflect.deleteProperty(item, 'reportSecondYear')
                            item.reportYearLine='';
                            item.reportFirstYear='';                  
                            item.reportSecondYear=''; 
                        }
                                        
                    }) 
                    cloneData[2]=JSON.parse(JSON.stringify(this.forcastLowCapitalXlsx[2]))
                    if(JSON.stringify(cloneData)!==JSON.stringify(this.forcastLowCapitalXlsx)){
                        this.$alert('请导入正确的表格', '提示', {
                            confirmButtonText: '确定'
                        });
                        return false;
                    }
                    let flag=this.handleParams(null ,tableData)
                    if(flag){
                        this.forcastLowCapitalList = tableData;
                    }
                   
                }
            };
            reader.readAsBinaryString(file.raw);
        },
        goDetail(row){
            const params={ id:row.id }
           this.axios.get('riskPayability/showHistoryDetail',{params}).then((res)=>{
                if(res.code == 200) {
                    this.payAbilityDataName = res.data.payAbilityDetail.payAbilityDataName;
                    this.payYear = res.data.payAbilityDetail.payYear;
                    this.applyObject = res.data.payAbilityDetail.applyObject;
                    this.createDep = res.data.payAbilityDetail.createDep;
                    this.creator = res.data.payAbilityDetail.creator;
                    this.payAbilityTest = res.data.payAbilityDetail.payAbilityTest;
                    this.forcastLowCapital = res.data.payAbilityDetail.forcastLowCapital;
                    this.payAbilityList=[];
                    this.forcastLowCapitalList=[]; 
                    this.payAbilityKey.forEach(item=>{
                        if(this.payAbilityTest[item.key]){
                             this.payAbilityList.push(this.payAbilityTest[item.key])
                        }
                    })
                    this.forcastLowCapitalkey.forEach(item=>{
                        if(this.forcastLowCapital[item.key]){
                             this.forcastLowCapitalList.push(this.payAbilityTest[item.key])
                        }
                    })
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
  			}).catch((response) => {
                this.$alert('操作失败', '提示', {
                    confirmButtonText: '确定'
                });
            })
        },
        handleIndex(index){
            let num=index+1
            num=('0'+num).slice(-2);
            return `FX-${num}`
        },
        loadFile(){
            const msg="①只填写表内数据，表样其余部分不需要填写。<br/>②数值不能使用千位分隔符。<br/>③百分比数据应以百分比格式填入。"
            this.$alert(msg, '提示', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true,
                callback:action=>{
                    if(action==='confirm'){
                            let url=this.activeName==='first'?'/tpl/download/201':'/tpl/download/202';
                            let name=this.activeName==='first'?'偿付能力压力测试表':'预测最低资本表';
                            let path = url+"?name="+encodeURIComponent(name)
                            this.axios.post(path,qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
                                fileDownload(res, name+".xlsx");
                            })
                        }
                    }
            });
              
        },
        handleChange(val,index,key){
            
             if(!val.includes('%')){
                    // 有小数的保留两位小数
                this.payAbilityList[index][key]=this.handleNum(val);
            } else {
                let i=val.split('').findIndex(i=>i==='%');
                let num=val.split('').slice(0,i).join('');
                this.payAbilityList[index][key] =i>0?this.handleNum(num)+'%':val;
            }
           
        },
        handleChange1(val,index,key){
            this.forcastLowCapitalList[index][key]=this.handleNum(val);
        },
        handleNum(num){
            if(fomatFloat(num,2)){
                return num
            }
            return num
        },
        // getHeaderRow(sheet) {
        //     const headers = [];
        //     /* sheet['!ref']表示所有单元格的范围，例如从A1到F8则记录为 A1:F8*/
        //     const range = XLSX.utils.decode_range(sheet['!ref']);
        //     let C, R = range.s.r; /* 从第一行开始 */
        //     /* 按列进行数据遍历 */
        //     for (C = range.s.c; C <= range.e.c; ++C) {
        //         /* 查找第一行中的单元格 */
        //         const cell = sheet[XLSX.utils.encode_cell({c: C, r: R})] 

        //         let hdr = "UNKNOWN " + C; // <-- 进行默认值设置
        //         if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        //         headers.push(hdr);
        //     }
        //     return headers;
        // }
    }
}
</script>

<style scoped lang="scss">
.txtColor{
    /deep/ .el-breadcrumb__inner{
        color: #4285F4 ;
        font-weight: 700 ;
    }  
}
.page{
    position: relative;
    padding-bottom:30px;
    &-btn{
        display: flex;
        justify-content: flex-end;
        top:20px;
        right:0;
        position: absolute;
        .btn{
            width: 80px;
            height: 26px;
            padding:0;
            margin-right:27px;
        }
    }
    .info{
        background: #fff;
        padding: 16px;
        box-shadow: 4px 2px 6px #888;
        margin-top: 2px;
        border-radius: 8px;
        &-title{
            font-size:14px;
            margin-bottom:30px;
            font-weight:600;
            display: flex;
            align-items: center;
            i{
                display: inline-block;
                width: 2px;
                height: 14px;
                background: #4285F4;
                vertical-align: middle;
                margin-right: 6px;
            }
        }
        &-form{
            display: flex;
            flex-wrap: wrap;
           
            &__item{
                &:nth-child(3n+1){
                    width:40%;
                    /deep/ .el-form-item__label{
                        width:210px;
                    }
                }
                 &:nth-child(3n+2){
                    width:30%;
                }
            }
        }
    }
    .main{
        min-height: 300px;
        background: #fff;
        padding: 16px;
        box-shadow: 4px 2px 6px #888;
        margin: 20px 0;
        border-radius: 8px;
        &-tab{
            /deep/ .el-tabs__nav{
                 border:0;
                 border-radius: 8px 8px 0 0;
            }
            /deep/ .el-tabs__item{
                border:0;
                border-radius: 8px 8px 0 0;
            }
            /deep/ .el-tabs__item.is-active{
                background: #409EFF;
                color:#fff;
                border-radius: 8px 8px 0 0;
            }
        }
        &-title{
            font-size:14px;
            margin-bottom:30px;
            font-weight:600;
            display: flex;
            align-items: center;
            i{
                display: inline-block;
                width: 2px;
                height: 14px;
                background: #4285F4;
                vertical-align: middle;
                margin-right: 6px;
            }
        }
        &-header{
            display:flex;
            justify-content: space-between;
            margin-bottom:20px;
            &__form{
                &--item{
                    margin-right:50px;
                    margin-bottom:0;
                }
            }
        }
        &-btn{
            display: flex;
            align-items: center;
             .btn{
                width: 100px;
                height: 26px;
                padding:0;
                margin-right:27px;
            }
        }
        &-table{
            border: 1px solid #E9E9E9;
            height: calc(100vh - 500px);
            min-height:200px;
            overflow-y:scroll;
            .col-title:before{
                content: "*";
                color: #f56c6c;
                margin-right: 4px;
            }
        }
    }
    .version{
        background: #fff;
        padding: 16px;
        box-shadow: 4px 2px 6px #888;
        margin: 20px 0;
        border-radius: 8px;
        min-height:200px;
    }
}
</style>