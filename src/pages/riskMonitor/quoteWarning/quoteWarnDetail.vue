<template>
  	<el-container id="quoteWarnDetail">
	  	<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span class="textColor1">风险监测指标管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor1 bread" @click="back">风险提示</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor">{{warnTit}}</span></el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="9">
					<el-button type="primary" class="fx_uploadBtn" size="mini" @click="back">返回</el-button>
					<el-button type="primary" v-if="subDetailBtn" class="fx_uploadBtn" size="mini" @click="submitAll">提交</el-button>
			  		<!-- <el-button type="primary" @click="submitAll" size="mini">提交</el-button> -->
			  	</el-col>
		  	</el-row>
	  	</el-header>
  		<div class="box">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">提示单基本信息</span></div>
			<div class="taskInfo">
				<el-row>
					<el-col :span="8">
						<div class="itemDiv">
							<span>风险提示单名称：</span>{{baseInfo.warnName}}<span></span>
						</div>
						<div class="itemDiv" v-if="sendTimeShow">
							<span>报送时间：</span><span>{{baseInfo.createDate == null?' --':baseInfo.createDate}}</span>
						</div>
	                </el-col>
	                <el-col :span="8">
						<div class="itemDiv">
							<span>提示级别：</span><span>{{baseInfo.level == '1'?'风险提示':'风险警示'}}</span>
						</div>
	                </el-col>
	                <el-col :span="8">
						<div class="itemDiv">
							<span>处理截止日期：</span><span>{{baseInfo.dealEndDate}}</span>
						</div>
	                </el-col>
				</el-row>
			</div>
			<div class="boxInfo" style="width: 100%;border: 1px solid #E9E9E9;min-height: 50px;border-bottom: none;">
				<el-row>
				  <el-col :span="6">
				  	<div class="thtit"><span style="color: transparent;">none</span></div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="thtit">单位</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="thtit">部门</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="thtit">人员</div>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="6">
				  	<div class="tdtit">创建人信息</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="tdtit">{{baseInfo.cObjName == null||baseInfo.cObjName == ""?'--':baseInfo.cObjName}}</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="tdtit">{{baseInfo.cDepName == null||baseInfo.cDepName == ""?'--':baseInfo.cDepName}}</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="tdtit">{{baseInfo.cUserName == null||baseInfo.cUserName == ""?'--':baseInfo.cUserName}}</div>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="6">
				  	<div class="tdtit">经办人信息</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="tdtit">{{baseInfo.reformObjName == null||baseInfo.reformObjName == ""?'--':baseInfo.reformObjName}}</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="tdtit">{{baseInfo.leadDepartName == null||baseInfo.leadDepartName == ""?'--':baseInfo.leadDepartName}}</div>
				  </el-col>
				  <el-col :span="6">
				  	<div class="tdtit">{{baseInfo.agentUserName == null || baseInfo.agentUserName == ""?'--':baseInfo.agentUserName}}</div>
				  </el-col>
				</el-row>
				<el-row>
					<div v-for="item in baseInfo.copyList">
					  <el-col :span="6">
					  	<div class="tdtit">抄送人信息</div>
					  </el-col>
					  <el-col :span="6">
					  	<div class="tdtit">{{item.copyObjName == null||item.copyObjName == ""?'--':item.copyObjName}}</div>
					  </el-col>
					  <el-col :span="6">
					  	<div class="tdtit">{{item.copyDepartName == null||item.copyDepartName == ""?'--':item.copyDepartName}}</div>
					  </el-col>
					  <el-col :span="6">
					  	<div class="tdtit">{{item.copyUserName == null||item.copyUserName == ""?'--':item.copyUserName}}</div>
					  </el-col>
					</div>
				</el-row>
			</div>
		</div>
		<el-collapse v-model="activeNames">
		  <el-collapse-item title="" name="1">
		  	<template slot="title">
		      <em></em><span>指标信息</span>
		    </template>
			<p style="font-size: 14px;margin-bottom: 20px;">风险提示要求：</p>
			<el-input type="textarea" :rows="2" placeholder="请输入内容" :disabled="forbidText" v-model="baseInfo.riskWarnRequire"> </el-input>
			<el-table :data="tableDatas" style="width: 100%;margin:20px 0; background: #FFFFFF; border: 1px solid #E9E9E9;">
		        <el-table-column type="index" label="序号" align="center" width="80"> </el-table-column>
	            <el-table-column prop="indName" label="指标名称" align="center" width="200">
	            	<template slot-scope="scope">
	                    <span :title="scope.row.indName" class="textOverFlow">{{scope.row.indName == null?'--':scope.row.indName}}</span>
	              </template>
	            </el-table-column>
	            <el-table-column prop="catName" label="风险分类" align="center" width="120"> </el-table-column>
	            <!-- <el-table-column prop="indLevel" label="指标等级" align="center" width="120">
	            	<template slot-scope="scope">
		              <span>{{scope.row.indLevel == '1'?'一级指标':'二级指标'}}</span>
		            </template>
	            </el-table-column> -->
	            <el-table-column prop="frequency" label="监测频率" align="center" width="80">
	            	<template slot-scope="scope">
	            		<span>{{frequency[scope.row.frequency]}}</span>
	            	</template>
	            </el-table-column>
	            <el-table-column prop="indValue" label="异常数据" align="center">
                	<template slot-scope="scope">
			          		<div :class="{'redBg':scope.row.rybStatus == 1,'yellowBg':scope.row.rybStatus == 2,'blueBg':scope.row.rybStatus == 3}">
			            		<p :title="item" v-for="item in scope.row.indValue">{{item}}</p>
			            	</div>
		            </template>
             	</el-table-column>
	            <el-table-column prop="causeAnalysis" label="原因分析" align="center" width="">
	            		<template slot-scope="scope">
		            		<span>{{scope.row.causeAnalysis == null?'--':scope.row.causeAnalysis}}</span>
		            	</template>
	            </el-table-column>
	            <el-table-column prop="correctiveAction" label="整改措施" align="center" width="">
	            		<template slot-scope="scope">
		            		<span>{{scope.row.correctiveAction == null?'--':scope.row.correctiveAction}}</span>
		            	</template>
	            </el-table-column>
	            <el-table-column prop="objName" label="报送对象" align="center" width="">
	            </el-table-column>
	            <el-table-column prop="taskName" label="报送任务名称" align="center" width="180"> 
	            	<template slot-scope="scope">
	                    <span :title="scope.row.taskName" class="textOverFlow">{{scope.row.taskName == null?'--':scope.row.taskName}}</span>
	              	</template>
	            </el-table-column>
	            <el-table-column prop="taskDate" label="报送时间" align="center" width=""> </el-table-column>
	      	</el-table>
	      	<!--<el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>-->
		  </el-collapse-item>
		</el-collapse>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">整改措施列表</span>
				<el-button type="primary" size="mini" class="btnCss" v-if="!hideBtn" @click="downLoadTemp">下载整改模板</el-button>
				<el-upload style="float: right;" class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload" action="" :http-request="uploadTemplate">
				  <el-button type="primary" size="mini" class="btnCss" v-if="!hideBtn">导入整改数据</el-button>
				</el-upload>
			</div>
			<el-table :data="tableData4" style="width: 100%;margin:30px 10px; background: #FFFFFF; border: 1px solid #E9E9E9;">
		        <el-table-column type="index" label="序号"  align="center" width="80"></el-table-column>
		        <el-table-column prop="measure" label="整改措施" align="center" >
		        	<template slot-scope="scope">
	                    <span :title="scope.row.measure" class="textOverFlow">{{scope.row.measure == null?'--':scope.row.measure}}</span>
	                </template>
		        </el-table-column>
		        <el-table-column prop="department" label="整改部门/机构" align="center"> </el-table-column>
		        <el-table-column prop="date" label="完成日期" align="center" > </el-table-column>
		        <el-table-column prop="condition" label="进展情况" align="center"></el-table-column>
	      	</el-table>
	      	<div class="fileBox" v-if="!hideBtn">
	        	<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx" :file-list="fileList">
	        		<el-button  type="primary" class="fx_uploadBtn">附件上传</el-button>
	        		<div slot="tip" class="el-upload__tip">附件：支持扩展名：doc、docx、pdf、xls、xlsx.</div>
				</el-upload>
	        </div>
	        <div class="fileDetail" v-if="hideBtn">
	        	<h4>附件：</h4>
	        	<p v-for="(item,index) in this.fileList" @click="loadFile(item.path,item.fileName)"><i class="el-icon-document"></i>{{item.fileName}}</p>
	        </div>
		</div>
  	</el-container>
</template>
<script>
	import vCheck from 'src/components/check/quoteAssignCheck'
	import {mapState} from 'vuex'
	import {getUrlKey,fileDownload,fileNameCombine,formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
	  	data() {
	        return {
	        	warnTit:'风险提示单详情',
	        	riskWarnRequire:'',
	        	saveAllData:{},
		        tableDatas:[],
		        tableData4:[],
		        forbidText:true,
		        editInfo:{},
		        baseInfo:{},
		        fileList: [],
		        sendTimeShow:false,
		        currentPage:1,
		        totalResults:0,
		        activeNames: [],
		        hideBtn:false,
		        checkData:{
		        	warnId:null,
		        	measure:null,
		        	report:null,
		        	type:'1'
		        },
		        subDetailBtn:false,
		        frequency:{
		        	'1':'月度',
		        	'2':'季度',
		        	'3':'年度',
		        	'4':'半年度'
		        },
		        bsStatus:{
		        	'0':'未报送',
		        	'1':'已报送',
		        	'2':'报送中'
		        },
		        aa:"11"
			}
	   	},
	    components:{
	    	vCheck
	    },
	    created(){
	    	// 获取详情数据
	    	this.getInfo()
	    },
	    methods:{
	    	// 获取基础信息
	    	getInfo(){
	    		//判断进入页面来源
	    		if(this.$route.query.warnId != undefined){
	    			//从预警列表进来
	    			this.activeNames = ['1']
	    			this.hideBtn = true
	    			this.forbidText = true
	    			this.checkData.warnId = this.$route.query.warnId
	    		}else if(this.$route.query.measureId != undefined){
	    			//从预警整改措施列表进来的详情
	    			this.activeNames = ['1']
	    			this.forbidText = true
	    			this.hideBtn = true
	    			this.sendTimeShow = true
	    			this.checkData.warnId = this.$route.query.measureId
	    		}else if(this.$route.query.writeId != undefined){
	    			//从预警整改措施列表进来的填写
	    			this.forbidText = true
	    			this.hideBtn = false
	    			this.warnTit = '填报风险预警整改措施'
	    			//指标信息展开
	    			this.activeNames = ['1']
	    			//提交按钮显示
	    			this.subDetailBtn = true
	    			this.sendTimeShow = false
	    			this.checkData.warnId = this.$route.query.writeId
	    		}
    			this.axios.post('rmIndWarn/getIndWarnDetail',qs.stringify({warnId:this.checkData.warnId})).then((res)=>{
					if(res.code == '200'){
						if(res.data != null){
							this.$set(this.baseInfo,'warnName',res.data.warnName)
							this.$set(this.baseInfo,'level',res.data.level)
							if(res.data.dealEndDate != undefined){
								this.$set(this.baseInfo,'dealEndDate',formatDate(new Date(parseInt(res.data.dealEndDate)*1000),'yyyy-MM-dd hh:mm:ss'))
							}else{
								this.$set(this.baseInfo,'dealEndDate','--')
							}
							if(res.data.submitDate == undefined){
								this.$set(this.baseInfo,'createDate',null)
							}else{
								this.$set(this.baseInfo,'createDate',formatDate(new Date(parseInt(res.data.submitDate)*1000),'yyyy-MM-dd hh:mm:ss'))
							}
							this.$set(this.baseInfo,'reformObjName',res.data.reformObjName)
							this.$set(this.baseInfo,'leadDepartName',res.data.leadDepartName)
							this.$set(this.baseInfo,'agentUserName',res.data.agentUserName)
							this.$set(this.baseInfo,'cObjName',res.data.cObjName)
							this.$set(this.baseInfo,'cDepName',res.data.cDepName)
							this.$set(this.baseInfo,'cUserName',res.data.cUserName)
							this.$set(this.baseInfo,'copyList',res.data.copyToList)
							this.$set(this.baseInfo,'riskWarnRequire',res.data.riskWarnRequire)
							if(res.data.indList	!= null){
								for (var i = 0; i < res.data.indList.length; i++) {
									res.data.indList[i].indValue = eval("("+res.data.indList[i].indValue+")")
									res.data.indList[i].taskDate = formatDate(new Date(res.data.indList[i].taskDate),'yyyy-MM-dd hh:mm:ss')
								}
							}
							this.tableDatas = res.data.indList
							//整改措施列表
							this.tableData4 = res.data.mendList
							this.checkData.measure = JSON.stringify(res.data.mendList)
							//附件列表
							if(res.data.files != undefined){
								for (var i = 0; i < res.data.files.length; i++) {
									res.data.files[i].name = res.data.files[i].fileName;
								}
							}
							this.fileList = res.data.files == undefined?[]:res.data.files
							this.checkData.report = this.fileList
						}
					} else {
	        			this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
	        		}
	    		})
    		},
	        back(){
	        	if(this.$route.query.listType == '1'){
		        	this.$router.push({  //核心语句
				        path:'/riskMonitor/quoteWarning/riskyQuoteWarn',//跳转的路径
				        query:{
				        	id:'1_ifxzbyjd'
				        }
				    })
	        	}else{
	        		this.$router.push({  //核心语句
				        path:'/riskMonitor/quoteWarning/riskyWarnMeasure',//跳转的路径
				        query:{
				        	id:'1_ifxyjzgcs'
				        }
				    })
	        	}
	        },
	    	uploadFile(param){
				var fileObj = param.file;
				var form = new FormData();
				form.append("file", fileObj);
				this.axios.post('rmIndWarn/uploadFile',form).then((res)=>{
					if(res.code == 200){
						let obj = new Object()
						obj.name = res.data.name
						obj.url = res.data.url
						obj.id = res.data.id
						this.fileList.push(obj)
						this.checkData.report = JSON.stringify(this.fileList)
					}else if(res.code == 640){
						this.fileList = []
						this.$alert(res.data.message, '提示', {
				          confirmButtonText: '确定'
				        });
						}
					})
			},
			uploadTemplate(param){
				var fileObj = param.file;
				var form = new FormData();
				form.append("file", fileObj);
				return this.axios.post('rmIndWarn/fileUpload',form,
					{onUploadProgress:function(event){
			              let percent=(event.loaded / event.total * 100) | 0
			              param.onProgress({percent:percent})
			           }
				}).then((res)=>{
					if(res.code == 200){
						this.tableData4 = res.data
						this.checkData.measure = JSON.stringify(res.data)
					}else if(res.code == 640){
						this.fileList = []
						this.$alert(res.data.message, '提示', {
				          confirmButtonText: '确定'
				        });
						}
					}).catch((response) => {
						this.$alert('不支持上传文件的格式', '提示', {
				          confirmButtonText: '确定'
				        });
					})
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
			handleSizeChange (value) {
			    this.checkData.pageNo = value;
			    this.searchData(this.checkData)
		    },
			handleCurrentChange (value) {
			    this.checkData.pageNo = value;
			    this.searchData(this.checkData)
			},
			downLoadTemp(){
				window.open(this.$axios.defaults.baseURL+'/rmIndWarn/templateDownload')
			},
			loadFile(url,name){
				var obj = new Object()
				obj.filePath = url;
				obj.fileName = name;
				this.axios.post('comm/download/305',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
					fileDownload(res, fileNameCombine(name,url));
				})
			},
			submitAll(){
				this.axios.post('rmIndWarn/indWarnMeaAdd',qs.stringify(this.checkData)).then((res)=>{
					if(res.code == '200'){
						this.$alert('提交成功', '提示', {
				          confirmButtonText: '确定',
				          callback: action => {
				          	this.$router.push({  //核心语句
						        path:'/riskMonitor/quoteWarning/riskyWarnMeasure',//跳转的路径
						        query:{
						        	id:''
						        }
						    })
				          }
				        });
						
					}else {
	        			this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
	        		}
	    		})
			}
		}
  	};
</script>
<style lang="scss">
#quoteWarnDetail{
	.header{
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
		.el-breadcrumb{
			line-height: 30px;
		}
		.textColor1{
			color: #909191 !important;
    		font-weight: 700!important;
		}
		.textColor{
			color: #4285F4 !important;
    		font-weight: 700!important;
		}
		.el-col-9{
			float: right;
			text-align: right;
		}
	}
	.bread:hover{
		cursor: pointer;
	}
	.box{
    	background: #fff;
    	padding: 16px 16px 30px 16px;
    	-webkit-box-shadow: 4px 2px 6px #888;
    	margin-top: 75px;
    	margin-bottom: 20px;
    	border-radius: 8px;
    	.titIcon{
    		font-size:14px;
    		margin-bottom:30px;
    		em{
    			display: inline-block;
    			width: 2px;
    			height: 14px;
    			background: #4285F4;
    			vertical-align: middle;
    			margin-right: 6px;
    		}
    	}
    	.thtit{
    		background: #F9F9F9;
    		color: #909399;
    		line-height: 40px;
    		font-weight: bold;
    		font-size: 14px;
    		border-bottom: 1px solid #E9E9E9;
    		text-align: center;
    	}
    	.tdtit{
    		line-height: 40px;
    		font-size: 14px;
    		color: #515151;
    		border-bottom: 1px solid #E9E9E9;
    		text-align: center;
    	}
	}
	.el-collapse{
		padding: 16px 16px 16px 16px;
		background: #fff;
		border-radius: 8px;
    	-webkit-box-shadow: 4px 2px 6px #888;
    	margin-bottom: 20px;
    	.el-collapse-item__header{
    		font-weight: 600;
    		font-size: 15px;
    		font-family: 'Microsoft YaHei';
    		border: none;
    	}
    	textarea{
    		height: 300px;
    	}
    	em{
			display: inline-block;
			width: 2px;
			height: 14px;
			background: #4285F4;
			vertical-align: middle;
			margin-right: 6px;
		}
		.el-collapse-item__wrap{
			border: none;
		}
		.el-icon-arrow-right{
			font-size: 16px;
		}
	}
	.quoteInfos{
		margin-top: 0;
		textarea{
			height: 300px;
		}
		.el-icon-arrow-down{
			float: right;
			font-size: 20px;
		}
	}
	th{
		background: #F9F9F9;
	    color: #909399;
	    font-weight: bold;
	}
	.el-tabs__content{
		-webkit-box-shadow: 1px 0px 6px #888;
		border-radius: 8px;
	}
	.el-table__empty-block{
		background: #fff;
	}
	.el-table td .cell,.el-table__empty-text{
      font-weight:normal;
      cursor:pointer
    }
    .el-pagination{
    	margin-top: 30px;
    }
    .el-tabs__active-bar{
    	display: none;
    }
    .handleBtn{
    	display: inline-block;
    	padding: 0 5px
    }
    .handleBtn:hover{
    	cursor: pointer;
    }
    .textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.contList{
		background: #fff;
		padding: 16px 16px 30px 16px;
		-webkit-box-shadow: 4px 2px 6px #888;
		border-radius: 8px;
		th{
			background: #F9F9F9;
		}
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
	table tr:last-child td{
		border-bottom: none
	}
	.el-table::before{
		background-color: transparent!important
	}
	.el-form-item .el-form-item__content{
		width:70%;
		display:inline-block;
		vertical-align:top
	}
	.el-form-item .el-form-item__content .el-select--mini{
		width:100%
	}
	.el-form--label-left .el-form-item__label{
		float:none
	}
	.taskInfo{
    	.taskTit{
    		display: block;
    		margin-bottom: 10px;
    		font-size: 14px;
    		font-weight: 600;
    	}
    	.itemDiv{
    		height: 40px;
    		line-height: 40px;
    		margin-bottom: 20px;
    		font-size: 14px;
    	}
    }
    .moreBtn,.detailBtn{
        color: #4285F4;
        padding: 0 2px;
    }
    .detailBtn:hover,.moreBtn:hover{
        cursor: pointer;
    }
	.fileBox{
		margin-top: 30px;
		.el-upload{
			float: right;
		}
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
	.fileDetail{
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
	.fx_uploadBtn{
		width: 68px;
		height: 26px;
		padding:0;
		font-size: 12px;
	}
	.redBg p{
		display: inline-block;
		background: #FF6363;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
	.yellowBg p{
		display: inline-block;
		background: #FFD824;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
	.blueBg p{
		display: inline-block;
		background: #4285F4;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
    .cell p{
		margin-bottom:15px;
		overflow:hidden;
		-webkit-line-clamp: 2;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    /*! autoprefixer: off */
	    -webkit-box-orient: vertical;
	    /* autoprefixer: on */
    }
    .btnCss{
    	width: 86px;
		height: 26px;
		padding:0;
		font-size: 12px;
		float: right;
		margin-left: 10px;
    }
}	

</style>
