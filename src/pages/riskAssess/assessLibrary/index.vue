<template>
  <div id="assessLibrary">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风控评估</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="textColor1">风控评估点库</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
      	<el-tab-pane label="现行评估点库" name="first" :key="'first'"></el-tab-pane>
      	<el-tab-pane label="历史评估点库" name="second" :key="'second'" style="font-weight: 600"></el-tab-pane>
    </el-tabs>
		<div class="quoteSys">
	    <el-form class="demo-ruleForm" size="mini">
	        <el-row>
	            <el-col :span="5">
	               <el-form-item label="评估类型">
							    <el-select v-model="SuitObj.assessType" @change="selectAssessType" placeholder="请选择评估类型">
							    	<el-option v-for="item in assTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
								</el-form-item>
							</el-col>
							<el-col :span="10">
	               <el-form-item label="部门">
							    <el-select v-model="SuitObj.department" @change="getDepart" placeholder="请选择参与部门">
							    	<el-option v-for="item,index in department" :key="index" :label="item.name" :value="item.code"></el-option>
							    </el-select>
								</el-form-item>
							</el-col>
	            <el-col :span="9" style="text-align: right;">
	            	<el-button type="primary" class="saveBtn" @click="searchData">查询</el-button>
	            	<el-button type="primary" v-if="orgBtnData.indexOf('1_afkpgdke')>=0" class="saveBtn" @click="exportForm">导出</el-button>
	            	<el-button type="primary" class="saveBtn" @click="exportMore" v-if="orgBtnData.indexOf('1_afkpgdki')>=0">导入评估点</el-button>
	            	<!--<el-button type="primary" class="saveBtn" @click="downLodaMore" v-if="orgBtnData.indexOf('1_afkpgdkdw')>=0">下载模板</el-button>-->
	            	<el-button type="primary" class="saveBtn" v-if="activeName=='first'&&orgBtnData.indexOf('1_afkpgdka')>=0" @click="isShow=true">新增</el-button>
	            </el-col>
	        </el-row>
	    </el-form>
			<div class="cagy-run">
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
	          <el-table-column  type="index" label="序号" align="center" > </el-table-column>
	          <el-table-column  prop="department"  label="填写部门" align="center">
	          	<template slot-scope="scope">
	          		<span>{{scope.row.department == undefined?'--':scope.row.department}}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="firstLevel"  label="一级流程" align="center">
	          	<template slot-scope="scope">
	          		<span>{{scope.row.firstLevel == ''?'--':scope.row.firstLevel}}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="secondLevel"  label="二级流程"  align="center"> 
	          	<template slot-scope="scope">
	          		<span>{{scope.row.secondLevel == ''?'--':scope.row.secondLevel}}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="nodeName"  label="节点名称"  align="center">
	          	<template slot-scope="scope">
	          		<span>{{scope.row.nodeName == ''?'--':scope.row.nodeName}}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="riskPointNo"  label="风险点编号" align="center">
	          	<template slot-scope="scope">
	          		<span>{{scope.row.riskPointNo == ''?'--':scope.row.riskPointNo}}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="riskPointDesc" label="风险点描述" align="center">
	          	<template slot-scope="scope">
	          		<span :title="scope.row.riskPointDesc"  class="textOverFlow">{{scope.row.riskPointDesc == ''?'--':scope.row.riskPointDesc}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="ctrlPointNo"  label="控制点编号" align="center">
	          	<template slot-scope="scope">
	          		<span :title="scope.row.ctrlPointNo"  class="textOverFlow">{{scope.row.ctrlPointNo == ''?'--':scope.row.ctrlPointNo}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="ctrlPointDesc"  label="控制点描述" align="center">
	          	<template slot-scope="scope">
	          		<span :title="scope.row.ctrlPointDesc"  class="textOverFlow">{{scope.row.ctrlPointDesc == ''?'--':scope.row.ctrlPointDesc}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="ctrlRate"  label="控制频率" align="center">
	          	<template slot-scope="scope">
	          		<span v-if="scope.row.ctrlRate == 1">每周一次或更高频率</span>
	          		<span v-if="scope.row.ctrlRate == 2">每月一次</span>
	          		<span v-if="scope.row.ctrlRate == 3">每季度一次</span>
	          		<span v-if="scope.row.ctrlRate == 4">每半年一次</span>
	          		<span v-if="scope.row.ctrlRate == 5">每年一次或更低频率</span>
	          		<span v-if="scope.row.ctrlRate == 6">不定期</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="ctrlType"  label="控制方式（人工/人工依赖系统/系统控制）" align="center">
	          	<template slot-scope="scope">
	          		<span v-if="scope.row.ctrlType == 1">人工控制</span>
	          		<span v-if="scope.row.ctrlType == 2">人工依赖系统控制</span>
	          		<span v-if="scope.row.ctrlType == 3">系统控制</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="hanndle" label="操作" width="180" align="center" v-if="true">
	            <template slot-scope="scope">
	              <span class="handleBtn moreBtn" @click="editDetail(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px" v-if="orgBtnData.indexOf('1_afkpgdkd')>=0">详情 </span>
	              <span class="handleBtn moreBtne" @click="stopUse(scope.$index, scope.row,1)" style="color: red;padding:0 5px" v-if="activeName=='second'&&orgBtnData.indexOf('1_afkpgdkq')>=0&&addDepartment.addDepartmentNo==scope.row.departmentNo">启用</span>
	            	<span class="handleBtn moreBtne" @click="editItem(scope.$index, scope.row)" style="color: red;padding:0 5px" v-if="activeName=='first'&&orgBtnData.indexOf('1_afkpgdku')>=0&&addDepartment.addDepartmentNo==scope.row.departmentNo">编辑</span>
	            	<span class="handleBtn moreBtne" @click="stopUse(scope.$index, scope.row,0)" style="color: red;padding:0 5px" v-if="activeName=='first'&&orgBtnData.indexOf('1_afkpgdkt')>=0&&addDepartment.addDepartmentNo==scope.row.departmentNo">停用</span>
	            </template>
	          </el-table-column>
	        </el-table>
      </div>
      <el-pagination v-if="totalResults>0" background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
		</div>
		<add-library v-if="isShow" :addDepartment="addDepartment" @closeMask="getMsgFormSon"></add-library>
		<library-detail v-if="detailShow" :itemId="itemId" @closeMask="getMsgFromDetail"></library-detail>
		<library-edit v-if="editShow" :itemId="itemId" @closeMask="getMsgFromEdit"></library-edit>
		<div class="readTxt">
			<div class="uploadMask" v-if="maskShow">
				<div class="up">
					<i class="el-icon-close" @click="maskShow = false"></i>
    			<el-upload class="upload-demo" drag action="" ref="uploads" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" accept=".Excel,.xls,.xlsx" :file-list="fileList">
  						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
					<div class="btnBox" style="text-align: center;margin-bottom: 20px;">
						<el-button type="primary" @click="cancelFile" class="state_saveFile">取消</el-button>
						<el-button type="primary" @click="submitFile" class="state_saveFile">确定</el-button>
					</div>
				</div>
			</div>
			<div class="readBox"></div>
		</div>
  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import addLibrary from 'src/components/riskAssess/addLibrary'
	import libraryDetail from 'src/components/riskAssess/libraryDetail'
	import libraryEdit from 'src/components/riskAssess/libraryEdit'
	import qs from 'qs'
  export default {
  	data() {
      return {
      	activeName:'first',
      	currentPage:1,
      	totalResults:0,
      	isShow:false,
      	itemId:null,
      	editShow:false,
      	detailShow:false,
      	maskShow:false,
      	addDepartment:{
      		department:null,
      		addDepartmentNo:null,
      	},
      	SuitObj:{
      		assessType:'定期评估',
      		department:'全部'
      	},
      	assTypeList:[{
         	code:'1',
         	name:'定期评估'
        },{
         	code:'2',
         	name:'专项评估'
        }],
        fileList:[],
        uploadData:'',
        department:[],
        tableData:[],
        checkData:{
        	assType:1,
        	departmentNo:null, 
        	onOff:1, //1代表现行启用 0：历史停用
        	pageNo:1,
        	pageSize:10
        }
			}
   	},
   	components:{
   		addLibrary,
   		libraryDetail,
   		libraryEdit
   	},
   	computed:{
   		...mapState(['riskAssess','orgBtnData'])
   	},
   	created(){
   		//获取部门信息
   		this.getDepartment()
   	},
   	methods:{
			handleClick(tab) {
	       if(tab.name == "first") {
	       		this.currentPage = 1
	       		this.checkData.pageNo = 1
	       		this.checkData.onOff = '1'
	       		this.searchData()
	       }else{
	       		this.currentPage = 1
	       		this.checkData.pageNo = 1
		       	this.checkData.onOff = '0'
		       	this.searchData()
	        }
	      },
   		getMsgFormSon(data){
				this.isShow = data.status;
				if(data.fromId == '1'){
					this.currentPage = 1
	       	this.checkData.pageNo = 1
					this.searchData();
				}
			},
			getMsgFromDetail(data){
				this.detailShow = data.status;
			},
			getMsgFromEdit(data){
				this.editShow = data.status;
				if(data.fromFlag == '1'){
					this.getDepartment()
   				this.getList(this.checkData,1)
				}
			},
			selectAssessType(val){
				this.checkData.assType = val;
			},
			uploadFile(param){
					var fileObj = param.file;
					var form = new FormData();
					form.append("file", fileObj);
					this.uploadData = form
		  },
			exportMore(){
				this.maskShow = true;
			},
			cancelFile(){
				this.maskShow = false
			},
			beforeAvatarUpload(file) {
			  const isLt2M = file.size / 1024 / 1024 < 10
			    if(!isLt2M) {
						this.fileList = this.$refs.uploads.fileList
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
						for (var i = 0; i < this.fileList.length; i++) {
							if(this.fileList[i].uid == file.uid){
								this.fileList.splice(i,1)
							}
						}
			},
			submitFile(){
				if(this.uploadData){
					this.axios.post('/riskctrl/uptpl',this.uploadData).then((res)=>{
						if(res.code==200){
							this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定',
					        	callback: action => {
						            	//执行刷新
			        						this.searchData();
						          }
					        })
							this.maskShow = false
						}else{
							this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定',
					        	callback: action => {
						            	//执行刷新
			        						this.searchData();
						          }
					        })
						}
		  		})
				}else{
					this.$alert("请先上传文件！")
				}
			},
			getList(params,type){
				this.axios.post('riskctrl/getriskctrllist',qs.stringify(params)).then((res)=>{
						this.tableData = []
						if(res.code == 200){
							if(res.data.data != null){
								if(type==0){
									this.currentPage = 1;
								}
								if(res.data.data != null){
									this.tableData = res.data.data
									this.totalResults = res.data.totalResults
								}
								if(res.data.department != undefined){
									this.addDepartment.department = res.data.department
								}
								if(res.data.departmentNo != undefined){
									this.addDepartment.addDepartmentNo = res.data.departmentNo
								}
							}else{
								this.totalResults = 0;
							}
						}else{
							this.$alert(res.message, '提示', {confirmButtonText: '确定'})
						}
				})
			},
			getDepartment(){
				this.axios.post('rmAssTask/getGroupDept',{}).then((res)=>{
					if(res.code == 200){
						if(res.data.length>1){
							var obj =	{code: null, name: "全部"}
							res.data.unshift(obj)
						}else{
							this.SuitObj.department = res.data[0].code
							this.checkData.departmentNo = res.data[0].code
						}
						this.department = res.data;
						this.getList(this.checkData,0);
					}else{
						this.$alert(res.message, '提示', {confirmButtonText: '确定'})
					}
				})
			},
			downLodaMore(){
				this.axios.post('/tpl/download/801',qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
					var filename = "风控评估点库.xlsx";
          this.fileDownload(res, filename);
				})
			},
			exportForm(){
				var obj = new Object()
				obj.assType = this.checkData.assType;
				obj.department = this.checkData.departmentNo;
				obj.onOff = this.checkData.onOff;
				this.axios.post('riskctrl/exportriskctrl',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
					if(this.activeName == 'first'){
						var filename = "风险评估-现行评估点库.xlsx";
					}else{
						var filename = "风险评估-历史评估点库.xlsx";
					}
          this.fileDownload(res, filename);
    		})
			},
			fileDownload(data, fileName) {
	      	let blob = new Blob([data], {
	        	type: "application/octet-stream"
	      	})
	      	let filename = fileName || "filename.xlsx";
	      	if (typeof window.navigator.msSaveBlob !== "undefined") {
	        	window.navigator.msSaveBlob(blob, filename);
	      	} else {
		        var blobURL = window.URL.createObjectURL(blob);
		        var tempLink = document.createElement("a");
		        tempLink.style.display = "none";
		        tempLink.href = blobURL;
		        tempLink.setAttribute("download", filename);
		        if (typeof tempLink.download === "undefined") {
		          tempLink.setAttribute("target", "_blank");
		        }
		        document.body.appendChild(tempLink);
		        tempLink.click();
		        document.body.removeChild(tempLink);
		        window.URL.revokeObjectURL(blobURL);
	      	}
	    },
			getDepart(val){
				this.checkData.departmentNo = val
			},
			searchData(){
				if(this.checkData.pageNo!=1){
					this.checkData.pageNo = 1
				}
				this.getList(this.checkData,0)
			},
			handleSizeChange(val){
				this.checkData.pageNo = val
				this.getList(this.checkData,1)
			},
			handleCurrentChange(val){
				this.checkData.pageNo = val;
				this.getList(this.checkData,1)
			},
			editDetail(index,row){
				this.detailShow = true;
				this.itemId = row.id
			},
			editItem(index,row){
				this.editShow = true;
				this.itemId = row.id
			},
			stopUse(index,row,isUse){
				var msg = '确认停用？'
				if(isUse == '1'){
						msg = '确认启用？'					
				}
				this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
          	this.axios.post('riskctrl/turnOnOff',qs.stringify({id:row.id,onOff:isUse})).then((res)=>{
							if(res.code == 200){
								this.getList(this.checkData,0);
								this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定'
					        })
							}
		    		})
          }).catch(_ => {});
			}
			
   	},
   	watch:{
   		activeName(newVal,oldVal){
   			
   		}
   	}
	}    
</script>
<style lang="scss">
    #assessLibrary{
    	.saveBtn{
    		min-width: 68px;
				height: 26px;
				line-height: 1px;
				font-size: 12px;
				padding:0 4px;
			}
			.el-input{
				width: 220px;
			}
    	th{
    		background: #F9F9F9;
		    color: #909399;
		    font-weight: bold;
    	}
    	.el-breadcrumb{
	    		margin-bottom: 30px;
	    		margin-top: 20px;
	    	}
	    	.el-tabs__content{
	    		-webkit-box-shadow: 1px 0px 6px #888;
	    		border-radius: 8px;
	    	}
	    	.el-table__empty-block{
	    		background: #fff;
	    	}
	    .el-pagination{
	    	margin-top: 30px;
	    }
	    .quoteSys{
	    	background: #fff;
	    	min-height: 250px;
	    	padding: 16px 16px 30px 16px;
	    	border-radius: 8px;
	    	th{
	    		background: #F9F9F9 ;
	    	}
	    	-webkit-box-shadow: 2px 0px 6px #888;
	    	.titIcon{
	    		font-size:14px;
	    		margin-bottom:30px;
	    		float: left;
	    		width: 100%;
	    		em{
	    			display: inline-block;
	    			width: 2px;
	    			height: 14px;
	    			background: #4285F4;
	    			vertical-align: middle;
	    			margin-right: 5px;
	    		}
	    	}
	    }
	    .el-tabs__item{
	    	padding:0;
    		background: #fff;
	      width: 120px;
	      border-top-left-radius: 8px;
	      border-top-right-radius: 8px;
	      border-right: 1px solid #E9E9E9;
	      text-align: center;
    	}
	    .el-tabs__active-bar{
	    	display: none;
	    }
	    .el-tabs__header{
	    	margin:0;
	    }
    	.is-active{
	    	background: #4285F4!important;
	    	color: #fff!important;
	    	text-align: center;
	    }
	    .handleBtn:hover{
	    	cursor: pointer;
	    }
	    .el-breadcrumb__inner{
	    	color: #4285F4!important;
	    	font-weight: 700!important;
	    }
	    .is-link{
	    	color: #909191!important;
	    }
	    .exportBtn,.newBuildBtn{
	    	  float: right;
	    	  margin-right: 5px;
			    width: 68px;
			    height: 26px;
			    padding: 0;
			    font-size: 12px;
	    }
	    .exportBtn{
	    	margin-right: 20px;
	    }
	    .wgTxtColor span{
	    	color: #909191 !important;
	    	font-weight: 700;
	    }
	    .textOverFlow{
				width: 100%;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.readTxt{
		  	width: 100%;
		  	/*height: 494px;*/
		  	/*border: 1px solid #E9E9E9;*/
		  	margin: 12px 0 14px 0;
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
					overflow:auto;
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
							width: 96%;
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
						bottom: 24px;
					}
				}
			}
			.maskFile{
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(0,0,0,.4);
					z-index: 100000;
					padding-top: 10%;
					padding-left: 15%;
					text-align: center;
					.readTxt{
					  	position: relative;
						width: 80%;
					  	height: 494px;
					  	border: 1px solid #E9E9E9;
					  	margin:0 auto;
					  	background: #fff;
					}
					.el-tag{
						position: absolute;
						right: 0;
				    background: transparent;
				    border: none;
				    padding: 4px 15px 4px 4px;
					.el-icon-close{
						font-size: 18px;
						padding: 1px;
					}
					.el-icon-close:hover{
						background: transparent;
						color: #409eff;
					}
				}
			}
	  }
</style>
