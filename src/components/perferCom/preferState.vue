<template>
    <div id="fxStateBox" class="state_container">
		<el-header class="header" style="padding-left: 218px;">
		  	<el-row>
			  	<el-col :span="12">
		  			<el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 60px;">
					  <el-breadcrumb-item :to="{ path: '/perfer/state?id=1_pstate' }">风险偏好管理</el-breadcrumb-item>
					  <el-breadcrumb-item class="txtColor">{{fxName}}</el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="12">
					<div class="state_btnBox" >
			        	<el-button type="primary" @click.native="submitData" class="state_submit" v-if="hideBtn">提 交</el-button>
			        	<el-button type="primary" @click.native="backList" class="state_submit">返回</el-button>
			        </div>
				  </el-col>
			  </el-row>
		  </el-header>
        <div class="text-center">
	        	<div class="titIcon">
	        		<em></em><span style="font-weight: 600;">风险陈述书</span>
	        		<el-button type="primary" v-show="hideBtn" class="state_uploadBtn" @click="maskToggle">导入风险偏好陈述书</el-button>
	        		<el-button type="primary" v-show="hideBtn" @click="deleteStateBook" class="state_deleteBtn">删除风险偏好陈述书</el-button>
	        	</div>
	        	<div class="readTxt">
	        		<iframe id="fileRead" src="" width="100%" height="100%"></iframe>
	        		<div class="uploadMask" v-if="maskShow">
	        			<div class="up">
	        				<i class="el-icon-close" @click="maskToggle"></i>
			        		<el-upload class="upload-demo" drag action="" ref="uploads" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" :limit="1" accept=".doc,.docx,.pdf" :file-list="fileList1">
		  						<i class="el-icon-upload"></i>
								<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							</el-upload>
							<el-button type="primary" @click="saveFile" class="state_saveFile">保存</el-button>
	        			</div>
	        		</div>
	        		<div class="readBox"></div>
	        	</div>
		        <div class="fileBox" v-if="hideBtn">
		        	<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx" :file-list="fileList">
		        		<el-button v-show="hideBtn" type="primary" class="fx_uploadBtn">附件上传</el-button>
		        		<div slot= "tip" v-show="hideBtn" class="el-upload__tip">附件：支持扩展名：doc、docx、pdf、xls、xlsx.</div>
					</el-upload>
		        </div>
		        <div class="fileDetail" v-if="backFlag">
		        	<h4>附件：</h4>
		        	<p v-for="(item,index) in this.fileList" :title="item.name" @click="loadFile(item.fileUrl,item.name)"><i class="el-icon-document"></i>{{item.name}}</p>
		        </div>
        </div>
        <div class="versionRecord" v-if="backFlag">
        	<div class="titIcon">
        		<em></em><span style="font-weight: 600;">版本记录</span>
        	</div>
        	<template>
			    <el-table :data="versionData" style="width: 100%">
			      <el-table-column type="index" align="center" label="序号" width="180"> </el-table-column>
			      <el-table-column prop="name" align="center" label="名称"> 
			      	<template slot-scope="scope">
			            <span class="jumpName" @click="jumpLog(scope.$index,scope.row)">{{scope.row.name}}</span>
			        </template>
			      </el-table-column>
			      <el-table-column prop="updateDate" align="center" label="修改时间" width="200"> </el-table-column>
			      <el-table-column prop="stopDate" align="center" label="停用时间" width="200"> </el-table-column>
			    </el-table>
			</template>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
import jquery from 'jquery'
import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
export default {
  props:['detailData'],
  data() {
    return {
    	"fxName":'新增风险偏好陈述',
    	"backFlag":false,
    	"hideBtn":true,
    	dir:null,
    	"downLoadFileToggle":false,
    	"fileType":2,//附件上传类型
    	"maskShow":false,
    	"percentage":0,
    	"fileList": [],
    	"fileList1":[],
    	"fileName":'',
    	"stateFileList":[],
    	"reWriteInfo":true,
	  	"addForm":{
	        "desf":''
	    },
	    versionData:[],
	    "desfiles":[]
    };
  },
  created(){
  	let id = this.$route.query.id
  	if(id != undefined){
  		this.fxName = '维护风险偏好陈述'
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
  		if(this.fileName.length == 0){
  			this.$alert('请上传风险陈述书', '提示', {
		          confirmButtonText: '确定'
		        });
		    return;    
  		}
  		this.maskShow = false;
  		this.fileType = 2;
  		$('#fileRead').attr('src','http://10.196.23.34:8237/v1/view/preview?filePath='+encodeURIComponent(this.fileName))
  	},
  	deleteStateBook(){
  		this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
	          	this.fileList1.splice(0,1);
				this.reWriteInfo = false;
				$('#fileRead').attr('src','')
          }).catch(() => {
                });
  	},
    uploadFile(param){
		var fileObj = param.file;
		var form = new FormData();
		form.append("file", fileObj);
		form.append('type',this.fileType) //type:1,陈述书；2，附件
		return this.axios.post('riskmana/uploadFile',form,
			{onUploadProgress:function(event){
	              let percent=(event.loaded / event.total * 100) | 0
	              param.onProgress({percent:percent})
	           }
		}).then((res)=>{
			sessionStorage.reWriteInfo = 1;
			if(res.code == 200){
				if(this.fileType == 1){
					this.fileList1.push({
						name:res.data.fileName,
						url:res.data.path,
						id:res.data.FileId
					})
					this.fileName = res.data.path
				}else{
					this.fileList.push({
						name:res.data.fileName,
						url:res.data.path,
						id:res.data.FileId
					})
				}
			}else if(res.code == 640){
				this.fileList = []
				this.$alert(res.data.message, '提示', {
		          confirmButtonText: '确定'
		        });
				}
			}).catch((response) => {
				this.$alert('文件过大，上传失败', '提示', {
		          confirmButtonText: '确定'
		        });
			})
   		},
   		beforeAvatarUpload(file) {
	        const isLt2M = file.size / 1024 / 1024 < 10
	        if(!isLt2M) {
				this.fileList = this.$refs.upload.fileList
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
					this.fileName = '';
					this.reWriteInfo = false;
					$('#fileRead').attr('src','')
			}else{
				for (var i = 0; i < this.fileList.length; i++) {
					if(this.fileList[i].uid == file.uid){
						this.fileList.splice(i,1)
					}
				}
				this.reWriteInfo = false;
				sessionStorage.reWriteInfo = 1;
			}
		},
		loadFile(url,name){
				var obj = new Object()
				obj.filePath = url;
				obj.fileName = encodeURIComponent(name);
				this.axios.post('comm/download/201',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
					fileDownload(res, fileNameCombine(name,url));
				})
//			window.open(this.serveUrl+"/instweb/download/institutionfile?url="+url+"&fileName="+encodeURIComponent(name));
		},
		jumpLog(index,row){
			var element = document.getElementById("top");
		        element.scrollIntoView({block: 'start', behavior: "smooth"});
		    $('#fileRead').attr('src','http://10.196.23.34:8237/v1/view/preview?fileName='+row.na)    
		    this.$emit('fatherMethod',row.id)    
			this.$router.push({
	      		path:'/buildState',
	      		query:{
	      			id:row.id,
	      			deFlag:1
	      		}
	      	})
		},
		backList(){
			this.$router.push({  //核心语句
			        path:'perfer/state',//跳转的路径
			        query:{
			        	id:'1_pstate'
			        }
			      })
		},
		submitData(){
			var submitData = JSON.parse(sessionStorage.getItem('submitData'))
				submitData.files = this.fileList;
				submitData.desfiles = this.fileList1[0];
				if(this.$route.query.id){
					submitData.id = this.$route.query.id;
				}
			if(submitData.describe == ''){
				this.$alert('审批发布记录不能为空', '提示', {
		          confirmButtonText: '确定'
		        });
		        return
			}else if(this.fileList1.length == 0){
				this.$alert('请上传风险陈述书', '提示', {
		          confirmButtonText: '确定'
		        });
		        return
			}
			this.axios.post('riskmana/submitpref',JSON.stringify(submitData),{headers:{'Content-Type': 'application/json'}}).then((res)=>{
	          if(res.code == 200){
	          	this.$alert('提交成功', '提示', {
			          confirmButtonText: '确定',
			          callback:action=>{
			          	this.$router.push({  //核心语句
			        	    path:'perfer/state',//跳转的路径
			        	    query:{
			        	    	id:'1_pstate'
			        	    }
			        	  })
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
		}
  },
  watch:{
  	'detailData': {
        handler: function (newVal, oldVal) {
        	if(!this.reWriteInfo){
        		return;
        	}
        	var fxSaveData = JSON.parse(sessionStorage.getItem('submitData'));
        	if(newVal.isDetails == true){
	        		this.hideBtn = false
	        		this.backFlag = true;
	        		this.versionData = newVal.versions
	        		this.fxName = '风险偏好陈述详情'
	        	}else{
	        		this.downLoadFileToggle = false;
	        		this.backFlag = false;
	        	}
        	//回填风险偏好陈述书
        	if(this.fileList1.length == 0){
        		this.fileList1.push(newVal.pref.desfiles);
        		fxSaveData.desfiles = newVal.pref.desfiles;
        		this.fileName = newVal.pref.desfiles.url;
        		$('#fileRead').attr('src','http://10.196.23.34:8237/v1/view/preview?filePath='+encodeURIComponent(this.fileName))
        	}	
			//回填附件
			this.fileList = newVal.pref.files == null?[]:newVal.pref.files;
	      	fxSaveData.files = newVal.pref.files == null?[]:newVal.pref.files;
	      	sessionStorage.setItem('submitData',JSON.stringify(fxSaveData))
        },
        deep: true
      }
  }
};
</script>
<style lang="scss">
*{
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
#fxStateBox{
	.el-dialog__title{
		font-size: 12px;
		color: #515151;
	} 
	.el-dialog__body{
		padding: 10px 20px;
	}
	.el-textarea__inner{
		color: #515151;
	}
	.el-textarea{
		textarea{
			min-height: 100px!important;
		}
	}
	.text-center{
		padding: 16px 20px 40px 20px;
		background: #fff;
		border-radius: 8px;
		-webkit-box-shadow: 4px 2px 6px #888;
		.titIcon{
	    font-size:14px;
	    em{
	      display: inline-block;
	      width: 2px;
	      height: 14px;
	      background: #4285F4;
	      vertical-align: middle;
	      margin-right: 6px;
	    }
	  }
	  .readTxt{
	  	width: 100%;
	  	height: 494px;
	  	border: 1px solid #E9E9E9;
	  	margin: 12px 0 14px 0;
	  }
	}
	#fileRead{
		border: none;
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
			height: 365px;
			background: #fff;
			margin:25vh auto 0;
			position: relative;
			.el-icon-close{
				float: right;
				margin-top: 10px;
				margin-right: 10px;
			}
			.el-icon-close:hover{
				color: #4285F4;
			}
			.upload-demo{
				overflow: hidden;
				.el-icon-close{
					margin:0!important;
				}
				.el-upload-list{
					float: left;
					width: 100%;
				}
				.el-upload--text{
					width: 100%;
				}
			}
			.el-upload-dragger{
				width: 640px;
				height: 210px;
				left: 30px;
				top: 22px;
				margin-top: 20px;
			}
			.el-icon-upload:before{
				color: #4285F4;
				font-size: 50px;
    			vertical-align: top;
			}
			.el-icon-upload{
				width: 88px;
				height: 88px;
				line-height: 88px;
				border-radius: 50%;
				background: #ECF5FF;
			}
			.el-upload-list{
				padding: 24px;
			}
			.state_saveFile{
				width: 68px;
				height: 26px;
				padding:0;
				font-size: 12px;
				margin-left: 316px;
				position: absolute;
				bottom: 24px;
			}
		}
	}
	.jumpName{
		color: #4285F4;
	}
	.header {
	    padding-left: 0;
	    padding-right: 2.6%;
	    padding-top: 0;
	    position: fixed;
	    width: 100%;
	    -webkit-box-shadow: 4px 2px 6px #888;
	    height: 52px;
	    top: 60px;
	    left: 0;
	    background: #fff;
	    z-index: 99999;
	}
	.el-upload-list__item-name{
		color: #909191;
		font-size: 12px;
		text-indent: -9px;
		padding-left: 16px;
		white-space:initial!important;		
	}
}	
.state_uploadBtn{
	width: 120px;
	height: 26px;
	padding:0;
	font-size: 12px;
	margin-left: 20px;
}
.state_deleteBtn{
	width: 120px;
	height: 26px;
	font-size: 12px;
	padding:0;	
}
.state_container ::-webkit-scrollbar {
		width:1px;
	}
.state_container .state_btnBox{
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
.state_container .fileBox{
	margin-top: 30px;
	.el-upload__tip{
		color: #909191;
	}
	.el-upload-list{
		width: 50%;
		.el-upload-list__item{
			a:hover{
				color:#4285F4;
			}
		}
	}
}
.state_container .fileDetail{
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
.state_container .fileBox .el-upload--text{
	float: right;
	.fx_uploadBtn{
		width: 68px;
		height: 26px;
		padding:0;
		font-size: 12px;
	}
}
.versionRecord{
	margin-top: 20px;
	padding: 20px;
	background: #FFFFFF;
	-webkit-box-shadow: 4px 2px 6px #888;
	border-radius: 8px;
	.titIcon{
	    font-size:14px;
	    em{
	      display: inline-block;
	      width: 2px;
	      height: 14px;
	      background: #4285F4;
	      vertical-align: middle;
	      margin-right: 6px;
	    }
	  }
	.el-table{
		margin-top: 20px;
		border: 1px solid #EBEEF5;
		th{
			background: #F9F9F9;
		}
		span:hover{
			cursor: pointer;
		}
	}
}
</style>
