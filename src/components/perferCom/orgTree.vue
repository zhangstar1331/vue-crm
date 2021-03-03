<template>
    <div class="fx_container">
    	<el-header class="header" style="padding-left: 218px;">
		  	<el-row>
			  	<el-col :span="12">
		  			<el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 60px;">
					  <el-breadcrumb-item :to="{ path: '/perfer/limit?id=1_plimit'}">风险偏好管理</el-breadcrumb-item>
					  <el-breadcrumb-item class="txtColor">{{fxName}}</el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="12">
					<div class="state_btnBox" >
			        	<el-button type="primary" @click="submit" class="state_submit" v-if="hideBtn">提 交</el-button>
			        	<el-button type="primary" @click="backList" class="state_submit">返回</el-button>
			        </div>
				  </el-col>
			  </el-row>
		  </el-header>
        <div class="text-center">
	          <div class="titIcon"><em></em><span style="font-weight: 600;">风险限额</span></div>
	          <vue2-org-tree name="test" :data="data" :horizontal="horizontal" :label-class-name="labelClassName" :render-content="renderContent" @on-node-dblclick="addGsForm" />
	        	<el-dialog :modal-append-to-body='false' :title="title" :contId="contId" class="dialogAdd" top="35vh" width="50%"  :visible.sync="dialogAddgsVisible"  @close="closeDialogAddgsVisible">
		          <el-form :model="addForm" ref="addForm" style="margin-right: 20px;" label-position="right" label-width="110px">
		            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addForm.desc" value="addForm.desc"></el-input>
		          </el-form>
		          <div slot="footer" class="dialog-footer">
		            <el-button size="mini" @click="dialogAddgsVisible = false">取 消</el-button>
		            <el-button size="mini" type="primary" @click="saveAddForm">确 定</el-button>
		          </div>
		        </el-dialog>
		        <div class="fileBox" v-if="hideBtn">
		        	<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx" :file-list="fileList">
		        		<el-button  type="primary" class="fx_uploadBtn">附件上传</el-button>
		        		<div slot="tip" class="el-upload__tip">附件：支持扩展名：doc、docx、pdf、xls、xlsx.</div>
					</el-upload>
		        </div>
		        <div class="fileDetail" v-if="downLoadFileToggle">
		        	<h4>附件：</h4>
		        	<p v-for="(item,index) in this.fileList" @click="loadFile(item.fileUrl,item.name)"><i class="el-icon-document"></i>{{item.name}}</p>
		        </div>
        </div>
        <div class="versionRecord" v-if="downLoadFileToggle">
        	<div class="titIcon">
        		<em></em><span style="font-weight: 600;">版本记录</span>
        	</div>
        	<template>
			    <el-table :data="versionData" style="width: 100%">
			      <el-table-column type="index" align="center" label="序号" width="180"> </el-table-column>
			      <el-table-column prop="name" align="center" label="名称"> 
			      	<template slot-scope="scope">
			            <span @click="jumpLog(scope.$index,scope.row)" class="jumpName">{{scope.row.name}}</span>
			        </template>
			      </el-table-column>
			      <el-table-column prop="updateDate" align="center" label="修改时间" width="250"> </el-table-column>
			      <el-table-column prop="stopDate" align="center" label="停用时间" width="250"> </el-table-column>
			    </el-table>
			</template>
        </div>
    </div>
</template>
<script>
	import qs from 'qs'
	import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
export default {
  props:['detailData'],
  data() {
    return {
		percentage:0,
		"fileList": [],
	  	"addForm":{
	        "desf":''
	    },
	    "fxName":'新增风险限额管理',
	    "hideBtn":true,
	    "downLoadFileToggle":false,
	    "contId":'',
	    "dialogAddgsVisible":false,
	    "title":'',
		"data": {},
		"horizontal": true,
		"collapsable": false,
		"expandAll": false,
		"stopClick":true,
		"labelClassName": "bg-white",
		"submitData":{}
    };
  },
  created(){
  	let id = this.$route.query.id
  	if(id != undefined){
  		this.fxName = '维护风险限额'
  	}
  	if(!this.$route.query.id){
  		this.getTreeData()
  	}
  },
  methods: {
  	getTreeData(){
  		var params = qs.stringify({
			type:1,
		})
		this.axios.post('riskmana/templatequo',params).then((res)=>{
          if(res.code == 200){
          	this.data = res.data;
        }else{
				statusCode(res.code,res.message)
     		 }
    	}).catch((response) => {
				this.$alert('操作失败', '提示', {
			          confirmButtonText: '确定'
			        });
		 })
  	},
    renderContent(h, data) {
      return data.label;
    },
    addGsForm(e,data){
    	if(this.$route.query.deFlag){
    		return;
    	}
    	this.closeDialogAddgsVisible()
    	this.dialogAddgsVisible = true;
        this.title=data.label
        this.contId = data.id;
        this.addForm.desc = data.desc
        sessionStorage.reWriteInfo = 1;
    },
    closeDialogAddgsVisible(){
          this.title="" //初始化title的值
          this.addForm={//初始化addForm中的值
              desc:''  
          }
      },
	  saveAddForm() {
			this.$refs.addForm.validate(valid => {
  			if(!this.addForm.id){
  				this.deepTree(this.data,this.contId,this.addForm.desc)
  			}
	  	})
		  	this.dialogAddgsVisible = false
	    },
    deepTree(obj,cid,desc){
    	if(obj.id == cid){
    		obj.desc = desc
    		return;
    	}
    	if(obj.children !=null  &&  obj.children instanceof Array && obj.children.length != 0){ 
    		 for (var i = 0; i < obj.children.length; i++) {
    		 			this.deepTree(obj.children[i],cid,desc)
    		 }
    	}
    },
    uploadFile(param){
		var fileObj = param.file;
		var form = new FormData();
		form.append("file", fileObj);
		form.append('type',2) //type:1,陈述书；2，附件
		return this.axios.post('riskmana/uploadFile',form,
			{onUploadProgress:function(event){
	              let percent=(event.loaded / event.total * 100) | 0
	              param.onProgress({percent:percent})
	           }
		}).then((res)=>{
			if(res.code == 200){
				this.fileList.push({
					name:res.data.fileName,
					url:res.data.path,
					id:res.data.FileId
				})
				sessionStorage.reWriteInfo = 1;
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
    jumpLog(index,row){
		var element = document.getElementById("top");
	        element.scrollIntoView({block: 'start', behavior: "smooth"});
	    this.$emit('fatherMethod',row.id)    
		this.$router.push({
      		path:'/buildLimit',
      		query:{
      			id:row.id,
      			deFlag:1
      		}
      	})
	},
	beforeRemove(file, fileList) {
		if(file.size / 1024 / 1024 > 10){
	    		return;
	    	}
	    return this.$confirm(`确定移除 ${ file.name }附件吗？`);
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
	loadFile(url,name){
				var obj = new Object()
				obj.filePath = url;
				obj.fileName = encodeURIComponent(name);
				this.axios.post('comm/download/202',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
					fileDownload(res, fileNameCombine(name,url));
				})
//			window.open(this.serveUrl+"/instweb/download/institutionfile?url="+url+"&fileName="+encodeURIComponent(name));
		}, 
	backList(){
			this.$router.push({  //核心语句
			        path:'perfer/limit',  //跳转的路径
			        query:{
			        	id:'1_plimit'
			        }
			      })
		},	
	handleRemove(file,fileList){
			for (var i = 0; i < this.fileList.length; i++) {
				if(this.fileList[i].uid == file.uid){
					this.fileList.splice(i,1)
				}
			}
		},
	submit(){
			var submitData = JSON.parse(sessionStorage.getItem('submitData'))
				submitData.files = this.fileList;
				submitData.riskDegree = this.data;
				if(this.$route.query.id){
					submitData.id = this.$route.query.id;
				}
			if(submitData.describe == '' || submitData.describe == null){
				this.$alert('审批发布记录不能为空', '提示', {
		          confirmButtonText: '确定'
		        });
		        return
			}
			this.axios.post('riskmana/submitquota',JSON.stringify(submitData),{headers:{'Content-Type': 'application/json'}}).then((res)=>{
	          if(res.code == 200){
	          	this.$alert('提交成功', '提示', {
			          confirmButtonText: '确定',
			          callback:action=>{
			          	this.$router.push({  //核心语句
			        	    path:'perfer/limit'  //跳转的路径
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
        	if(sessionStorage.reWriteInfo == 1){
	        			return;
	        		}
        	var fxSaveData = JSON.parse(sessionStorage.getItem('submitData'));
        	if(newVal.isDetails == true){
	        		this.hideBtn = false
	        		this.downLoadFileToggle = true
	        		this.versionData = newVal.versions
	        		this.fxName = '风险限额详情'
	        	}else{
	        		this.downLoadFileToggle = false;
	        	}
        	//回填风险限额
			//回填附件
			this.fileList = newVal.quota.files == null?[]:newVal.quota.files;
	      	fxSaveData.files = newVal.quota.files;
	      	this.data = newVal.quota.riskDegree;
	      	fxSaveData.riskDegree = newVal.quota.riskDegree;
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
.org-tree-container{
	padding-top: 0!important;
	width: 100%;
	border-bottom: 1px solid #dedede;
	margin-bottom: 20px;
	padding-right: 15%;
}
.org-tree-node-label {
  white-space: nowrap;
}
.bg-white {
  background-color: white;
}
.bg-orange {
  background-color: orange;
}
.bg-gold {
  background-color: gold;
}
.bg-gray {
  background-color: gray;
}
.bg-lightpink {
  background-color: lightpink;
}
.bg-chocolate {
  background-color: chocolate;
}
.bg-tomato {
  background-color: tomato;
}
.jumpName{
	color: #4285F4;
}
.org-tree-node-desc{
	width: 360px!important;
	height: 100px;
	border:.006rem solid #D8D7D7;
	position: relative;
	background: #fff;
	margin-top: 15px;
	font-size: 12px;
	text-align: left;
	padding:16px 14px 0;
	line-height: 20px;
	z-index: 3;
	overflow-y: scroll;
	border-radius: 8px;
	white-space:pre-line;
}
.org-tree-node-label .org-tree-node-label-inner{
	width:160px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    background: #4285F4;
    color: #fff;
    padding: 0!important;
    margin: 0 auto;
    position: absolute;
    left: 100px;
    z-index: 4;
}
.org-tree-node-desc:hover{
	cursor: pointer;
}
.horizontal .org-tree-node-children:before{
	width: 120px!important;
}
.horizontal .org-tree-node-children{
	padding-left: 120px!important;
}
.horizontal .org-tree-node-label{
	width: 200px;
	left: 55px;
}
.org-tree-node-label{
	white-space:normal!important
}
.horizontal .org-tree-node:before, .horizontal .org-tree-node:after{
	width: 70px!important;
	}
.fx_container{
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
}	
/*.fx_container ::-webkit-scrollbar{
		width:1px;
	}*/
.fx_btnBox{
	position: relative;
	text-align: center;
	padding-top: 30px;
	padding-bottom: 30px;
	button{
		width: 68px;
		height: 26px;
		padding:0;
		font-size: 12px;
		margin-right: 30px;
	}
}	
.fileBox{
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
		.el-upload-list__item-name{
			color: #909191;
			font-size: 12px;
			text-indent: -9px;
    		padding-left: 16px;
    		white-space:initial!important;
		}
	}
}
.el-upload--text{
	float: right;
	.fx_uploadBtn{
		width: 68px;
		height: 26px;
		padding:0;
		font-size: 12px;
	}
}
.fx_container .fileDetail{
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
</style>
