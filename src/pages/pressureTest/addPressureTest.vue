<template>
    <div class="state_container" id="fxStateBox">
		<el-header class="header" style="padding-left: 218px;">
		  	<el-row>
			  	<el-col :span="12">
		  			<el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 60px;">
					    <el-breadcrumb-item>压力测试</el-breadcrumb-item>
                        <el-breadcrumb-item>压力测试报告</el-breadcrumb-item>
					  <el-breadcrumb-item class="txtColor">{{fxName}}</el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="12">
					<div class="state_btnBox" >
			        	<el-button type="primary" @click.native="submitData" class="state_submit" v-if="type!==3">提 交</el-button>
			        	<el-button type="primary" @click.native="backList" class="state_submit">返回</el-button>
			        </div>
				  </el-col>
			  </el-row>
		</el-header>
        <div class="main info">
            <div class="main-title"><i class="line"></i>基本信息</div>
            <div class="main-header">
            <div class="main-search">
                <el-form :inline="true" size="small">
                    <el-form-item label="报告名称：" style="margin-bottom:0" > 
                        <el-input v-model.trim="reportName" class="main-text" v-if="type!==3" placeholder="请输入报告名称" :maxlength="50"></el-input>
                        <div v-else class="main-text">{{reportName}}</div>
                    </el-form-item>
                    <el-form-item label="年份：" style="margin-left:20px;margin-bottom:0">
                        <el-select v-model="year" placeholder="请选择" style="width:120px;" v-if="type===1">
                            <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                        <div v-else class="main-year">{{year}}</div>
                    </el-form-item>
                    <el-form-item label="审批发布记录：" style="margin-left:20px;margin-bottom:0"> 
                        <el-input v-model.trim="approveRecord" class="main-text" v-if="type!==3" placeholder="填入提示：经董事会**次会议审议通过，**年**月印发，发文号**" :maxlength="50"></el-input>
                        <div v-else class="main-text">{{approveRecord}}</div>
                    </el-form-item>
                </el-form>
            </div>
            </div>
        </div>
        <div class="main">
            <div class="main-title">
                <i class="line"></i>压力测试报告
                <div class="main-btn">
                    <el-button type="primary" class="btn" @click="maskToggle" v-if="type!==3">导入压力测试报告</el-button>
                    <el-button type="primary" class="btn" @click="deleteStateBook" v-if="type!==3">删除压力测试报告</el-button>
                </div>
            </div>
            <div class="main-body">
                <iframe id="fileRead" src="" width="100%" height="100%"></iframe>
                <div class="uploadMask" v-if="maskShow">
                    <div class="up">
                        <i class="el-icon-close" @click="maskToggle"></i>
                        <el-upload class="upload-demo" drag action="" 
                            ref="uploads" :http-request="uploadFile" 
                            :before-remove="beforeRemove" 
                            :on-remove="handleRemove"
                            :on-change="handleError"
                            :limit="1"
                            :before-upload="beforeAvatarUpload" 
                            accept=".doc,.docx,.pdf" 
                            :file-list="fileList1">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div slot="tip" class="el-upload__tip">只能上传.doc,.docx,.pdf文件,且不超过10M</div>
                        </el-upload>
                        <el-button type="primary" @click="saveFile" class="state_saveFile">保存</el-button>
                    </div>
                </div>
            </div>
            <div class="attachment">
                <el-upload class="upload-demo" action="" v-if="type!==3" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx" :file-list="fileList">
                    <div class="attachment-btn">
                        <div slot="tip">附件：支持扩展名：doc、docx、pdf、xls、xlsx，文件大小不超过10M.</div>
                        <el-button type="primary" class="btn">附件上传</el-button>
                    </div>
                </el-upload>
                <div class="fileDetail" v-if="type===3">
		        	<h4>附件：</h4>
		        	<p v-for="(item,index) in this.fileList" :title="item.name" @click="loadFile(item.url,item.name)"><i class="el-icon-document"></i>{{item.name}}</p>
		        </div>
            </div>
        </div>
          <div class="main" v-if="type===3" style="">
            <div class="main-title"><i class="line"></i>版本记录</div>
             <el-table :data="hisRecordList" class="main-table" :header-cell-style="{ background: '#f5f7fa'}" empty-text="暂无修订记录"> 
                <el-table-column type="index" label="序号" align='center'></el-table-column>
                <el-table-column label="压力测试报告" :show-overflow-tooltip="true" align='center'>
                        <template slot-scope="scope">
                            <div @click="getDetails(scope.row.id)" class="row-title">{{scope.row.reportName}}</div>
                        </template>
                </el-table-column>
                <el-table-column prop="reportYear" label="年份" align='center'></el-table-column>
                <el-table-column prop="_createDate" label="报送时间" align='center'></el-table-column>
                <el-table-column prop="_updateDate" label="维护时间" align='center'></el-table-column>
            </el-table>           
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import jquery from 'jquery'
import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
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
export default {
  data() {
    return {
        reportName:'',
        approveRecord:'',
    	"fileType":2,//附件上传类型
    	"maskShow":false,
    	"fileList": [],
    	"fileList1":[],
        "url":'',
        hisRecordList:[],
        year:''
    };
  },
  computed:{
    fxName(){
        if(this.$route.query.type==='1'){
            return '新增压力测试报告'
        }
        if(this.$route.query.type==='2'){
            return '维护压力测试报告'
        }
        if(this.$route.query.type==='3'){
            return '压力测试报告详情'
        }
    },
    yearList(){
        let now=new Date().getFullYear();
        let ary=[];
        for(let i=now;i>=2015;i--){
            ary.push (i);
        }
        return ary;
    },
    id(){
        return this.$route.query.id;
    },
    type(){
        return +this.$route.query.type;
    }
  },
  beforeMount(){
      this.year=this.$route.query.year?this.$route.query.year:new Date().getFullYear();
       if(this.id){
           this.getDetails();
       }
  },
  methods: {
  	maskToggle(){
  		this.maskShow = !this.maskShow
  		if(this.maskShow){
  			this.fileType = 1
  		}else{
  			this.fileType = 2
  		}
  	},
  	saveFile(){
  		if(this.url.length == 0){
  			this.$alert('请上传压力测试报告', '提示', {
		          confirmButtonText: '确定'
		        });
		    return;    
  		}
  		this.maskShow = false;
  		this.fileType = 2;
  		$('#fileRead').attr('src','http://10.196.23.34:8237/v1/view/preview?filePath='+encodeURIComponent(this.url))
  	},
  	deleteStateBook(){
  		this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
                  this.fileList1.splice(0,1);
                  this.url='';
				$('#fileRead').attr('src','')
          }).catch(() => {
          });
  	},
    uploadFile(param){
        var fileObj = param.file;
        var form = new FormData();
        form.append("file", fileObj);
		form.append('type',this.fileType) //type:1,陈述书；2，附件
		return this.axios.post('pressureTest/uploadFile',form,
			{onUploadProgress:function(event){
                  let percent=(event.loaded / event.total * 100) | 0;
	              param.onProgress({percent:percent})
	           }
		}).then((res)=>{
			if(res.code == 200){
				if(this.fileType == 1){
					this.fileList1=[{
						name:res.data.fileName,
						url:res.data.path,
						id:res.data.FileId
					}]
					this.url = res.data.path
				}else{
					this.fileList.push({
						name:res.data.fileName,
						url:res.data.path,
						id:res.data.FileId
					})
				}
			} else if(res.code == 640){
				this.fileList = []
                    this.$alert(res.data.message, '提示', {
                    confirmButtonText: '确定'
                    });
				}
			}).catch((response) => {
                this.fileList1=[]
				this.$alert('文件过大，上传失败', '提示', {
		          confirmButtonText: '确定'
		        });
			})
    },
    beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if(!isLt2M) {
            this.$message({
                message: '上传文件大小不能超过 10MB!',
                type: 'warning'
            });
        }
        return isLt2M
    },
    beforeRemove(file, fileList) {
        if(file.size / 1024 / 1024 > 10){
            return;
        }
        return this.$confirm(`确定移除 ${ file.name }附件吗？`);
    },
    handleRemove(file,fileList){
        if(this.fileType == 1){
                this.fileList1.splice(0,1);
                this.url = '';
                $('#fileRead').attr('src','')
        }else{
            for (var i = 0; i < this.fileList.length; i++) {
                if(this.fileList[i].uid == file.uid){
                    this.fileList.splice(i,1)
                }
            }
        }
    },
    loadFile(url,name){
        var obj = new Object()
        obj.filePath = url;
        obj.fileName = encodeURIComponent(name);
        this.axios.post('comm/download/v2',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
            fileDownload(res, fileNameCombine(name,url));
        })
    },
    backList(){
        this.$router.push({  //核心语句
            name:'pressureReport'
        })
    },
    submitData(){
        if(this.reportName===''){
            this.$alert('报告名称不能为空', '提示', {
                confirmButtonText: '确定'
            });
            return
        }
        if(this.reportName.length>50){
            this.$alert('报告名称最长为50个字符', '提示', {
                confirmButtonText: '确定'
            });
            return
        }
        if(this.approveRecord === ''){
            this.$alert('审批发布记录不能为空', '提示', {
                confirmButtonText: '确定'
            });
            return
        } 
         if(this.approveRecord.length>50){
            this.$alert('审批发布记录最长为50个字符', '提示', {
                confirmButtonText: '确定'
            });
            return
        }
        if(this.fileList1.length === 0){
            this.$alert('请上传压力测试报告', '提示', {
                confirmButtonText: '确定'
            });
            return
        }
        let params={
            reportName:this.reportName,
            reportYear:this.year,
            desfiles:this.fileList1[0],
            files:this.fileList,
            approveRecord:this.approveRecord
        };
        if(this.id){
            params.id=this.id;
        }
        if(this.$route.query.historyRecordId){
                params.historyRecordId=this.$route.query.historyRecordId
            }
        this.axios.post('pressureTest/submitPressureTest',JSON.stringify(params),{headers:{'Content-Type': 'application/json'}}).then((res)=>{
            if(res.code == 200){
            this.$alert('提交成功', '提示', {
                    confirmButtonText: '确定',
                    callback:action=>{
                        if(action==='confirm'){
                            this.$router.push({  //核心语句
                                name:'pressureReport'
                            })
                        }
                    }
                });
            }else{
                this.$alert(res.data, '提示', {
                    confirmButtonText: '确定'
                });
                return;
                }
        }).catch((response) => {
            this.$alert('操作失败', '提示', {
                    confirmButtonText: '确定'
                });
            })
    },
    getDetails(id=this.id){
        const params={
               id:id
            }
            if(this.$route.query.historyRecordId){
                params.historyRecordId=this.$route.query.historyRecordId
            }
            this.axios.get('pressureTest/pressureTestDetail',{params}).then((res)=>{
                if(res.code === 200){
                    let pressureTest=res.data.pressureTest;
                    this.reportName=pressureTest.reportName;
                    this.approveRecord=pressureTest.approveRecord;
                    this.fileList1=[pressureTest.desfiles];
                    this.fileList=pressureTest.files?pressureTest.files:[];
                    if(res.data.hisRecordList){
                        this.hisRecordList=res.data.hisRecordList;
                        this.hisRecordList.forEach(item=>{
                            if(item.createDate){
                                item._createDate = getDate(item.createDate);
                            }
                            if(item.updateDate){
                                item._updateDate = getDate(item.updateDate);
                            }
                        })
                    }
                    this.url=pressureTest.desfiles.url;
                    $('#fileRead').attr('src','http://10.196.23.34:8237/v1/view/preview?filePath='+encodeURIComponent(pressureTest.desfiles.url));
                }else{
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
    handleError(err){
        console.log(err,11)
    }
  }
};
</script>
<style lang="scss" scoped>
.txtColor{
    /deep/ .el-breadcrumb__inner{
        color: #4285F4 ;
        font-weight: 700 ;
    }  
}
.state_container{
    padding-bottom:20px;
}
.header {
    padding-left: 0;
    padding-right: 2.6%;
    padding-top: 0;
    position: fixed;
    width: 100%;
    box-shadow: 4px 2px 6px #888;
    height: 52px;
    top: 60px;
    left: 0;
    background: #fff;
    z-index: 99999;
}
#fileRead{
	border: none;
}
.main{
    min-height: 126px;
    background: #fff;
    padding: 16px 16px 0 16px;
    box-shadow: 4px 2px 6px #888;
    margin-top: 20px;
    border-radius: 8px;
    padding-bottom:20px;
    &-title{
        font-size:14px;
        margin-bottom:30px;
        font-weight:600;
        display: flex;
        align-items: center;
        .line{
            display: inline-block;
            width: 2px;
            height: 14px;
            background: #4285F4;
            vertical-align: middle;
            margin-right: 6px;
        }
    }
    &-header{
      display: flex;
      justify-content: space-between;
      margin-bottom:30px;
    }
    &-btn{
        display:flex;
        justify-content:flex-end;
        align-items: center;
        .btn{
            padding:0 15px;
            line-height: 30px;
            padding:0;
            margin-left:20px;
        }
    }
    &-body{
        width: 100%;
 	  	height: 494px;
 	  	border: 1px solid #E9E9E9;
 	  	margin: 12px 0 14px 0;
    }
    &-table{
        background:#f9f9f9;
        border: 1px solid #E9E9E9;
        margin-bottom:20px;
        .row-title{
            cursor: pointer;
            color:#4285F4;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }
    }
    .uploadMask{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,.3);
		z-index: 99;
		.up{
			width: 700px;
			min-height: 365px;
			background: #fff;
			margin:25vh auto 0;
            padding-bottom:30px;
			position: relative;
			/deep/ .el-icon-close{
				float: right;
				margin-top: 10px;
				margin-right: 10px;
			}
			/deep/ .el-icon-close:hover{
				color: #4285F4;
			}
			.upload-demo{
                width:100%;
                padding:30px 20px;
                box-sizing: border-box;
				// overflow: hidden;
				// /deep/ .el-icon-close{
				// 	margin:0!important;
				// }
				/deep/ .el-upload--text{
					width: 100%;
				}
			}
			/deep/ .el-upload-dragger{
				width: 100%;
				height: 210px;
			}
			/deep/ .el-icon-upload:before{
				color: #4285F4;
				font-size: 50px;
    			vertical-align: top;
			}
			/deep/ .el-icon-upload{
				width: 88px;
				height: 88px;
				line-height: 88px;
				border-radius: 50%;
				background: #ECF5FF;
			}
			/deep/ .el-upload-list{
				padding: 10px 0;
			}
			.state_saveFile{
				width: 68px;
				height: 26px;
				padding:0;
				font-size: 12px;
				margin-left: 316px;
			}
		}
	}
    &-text{
        width: 400px;
        word-break: break-all;
    }
    &-year{
        width: 200px;
    }
}
.state_btnBox{
	position: relative;
	text-align: right;
	height: 60px;
	line-height: 60px;
	button{
		width: 68px;
		height: 26px;
		padding:0;
		font-size: 12px;
	}
}
.info{
    margin-top:100px;
    margin-bottom: 20px;
}
.attachment{
    /deep/ .el-upload{
        width:100%
    }
    &-btn{
        width:100%;
        display: flex;
        justify-content: space-between;
        .btn{
            padding:0 15px;
            line-height: 30px;
            margin-left:20px;
        }
    }
    /deep/ .el-upload-list{
        width:50%;
    }
    .fileDetail{
	padding-left: 1%;
	p:hover{
		cursor: pointer;
		color: #4285F4;
	}
	p{
		color: #909191;
		font-size: 12px;
		line-height: 24px;
		i{
			display: inline-block;
			margin-right: 10px;
		}
	}
	h4{
		color: #909191;
		font-size: 12px;
		font-weight: normal;
		margin-bottom: 5px;
	}
}
}
</style>
