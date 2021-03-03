<template>
  <div id="taskReport1">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风控评估</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor">实施风控评估</el-breadcrumb-item>
		  <el-breadcrumb-item>风控评估任务呈报</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys" v-if="!isShow">
    	<div class="titIcon"><em></em><span style="font-weight: 600;">风控评估任务呈报</span></div>
			<div class="cagy-run">
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
	          <el-table-column  type="index"  label="编号" align="center" > </el-table-column>
	          <el-table-column  prop="name"  label="评估任务名称" align="center"> </el-table-column>
	          <el-table-column  prop="assBeginDate,assEndDate"  label="评估期间" align="center">
	          	<template slot-scope="scope">
	          		{{scope.row.assBeginDate}} 至 {{scope.row.assEndDate}}
	          	</template>
	          </el-table-column>
	          <el-table-column prop="depName"  label="部门名称" align="center"></el-table-column>
	          <el-table-column prop="status"  label="评估进度"  align="center">
	          	<template slot-scope="scope">
	          		<span v-if="scope.row.status == 0" class="statusCss">未评估</span>
	          		<span v-if="scope.row.status == 2" class="statusCss">已提交评估表</span>
	          		<span v-if="scope.row.status == 3">已完成</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="endDate" width="160" label="评估表、评估报告截止日期"  align="center"> </el-table-column>
	          <el-table-column prop="submitDate" label="评估完成日期"  align="center"> </el-table-column>
	          <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
	            <template slot-scope="scope">
	              <span class="handleBtn moreBtn" @click="writeInfo(scope.$index, scope.row)" v-if="scope.row.status == 0&&orgBtnData.indexOf('1_afkpgrwcba')>=0" style="color: #4285F4 ;padding:0 5px">填报 </span>
	              <span class="handleBtn moreBtne" @click="submit(scope.$index, scope.row)" v-if="scope.row.status == 0&&orgBtnData.indexOf('1_afkpgrwcbs')>=0" style="color: #4285F4;padding:0 5px">提交评估表</span>
	              <span class="handleBtn moreBtn" @click="maskToggle(scope.$index, scope.row)" v-if="scope.row.status == 2&&orgBtnData.indexOf('1_afkpgrwcbc')>=0" style="color: #4285F4 ;padding:0 5px">提交评估报告</span>
	              <span class="handleBtn moreBtne" @click="jumpDetail(scope.$index, scope.row)" v-if="scope.row.status == 3&&orgBtnData.indexOf('1_afkpgrwcbd')>=0" style="color: #4285F4;padding:0 5px">详情</span>
	            </template>
	          </el-table-column>
	        </el-table>
	        <div class="readTxt">
        		<div class="uploadMask" v-if="maskShow">
        			<div class="up">
	        				<i class="el-icon-close" @click="maskShow = false"></i>
			        		<el-upload class="upload-demo" drag action="" ref="uploads" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf" :file-list="fileList">
				  						<i class="el-icon-upload"></i>
										<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
									</el-upload>
									<div class="btnBox" style="text-align: center;margin-bottom: 20px;">
										<el-button type="primary" @click="cancelFile" class="state_saveFile">取消</el-button>
										<el-button type="primary" @click="saveFile" class="state_saveFile">保存</el-button>
										<el-button type="primary" @click="submitFiles" class="state_saveFile">提交</el-button>
									</div>
        			</div>
        		</div>
        		<div class="readBox"></div>
        	</div>
      </div>
      <el-pagination v-if="!isShow" background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
		</div>
		<assess-result v-if="isShow"></assess-result>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import assessResult from 'src/components/riskAssess/assessResult'
	import qs from 'qs'
	import {formatDate} from 'src/utils/utils.js'
  export default {
  	data() {
      return {
      	isShow:false,//展示详情页面
        tableData:[],
        currentPage:1,
        totalResults:1,
        maskShow:false,
        itemId:null,
        fileList:[],
        removeFileIds:[],
       	checkData:{
       		pageNo:1,
       		pageSize:10
       	}
			}
   	},
   	created(){
			this.getList(this.checkData)
		},
   	methods:{
   		...mapActions(['setData']),
   		jumpDetail(index,row){
   			this.$router.push({
        		path:'/assessResult',
        		query:{
        			itemId:row.taskId,
        			isDetail:1
        		}
        	})
   		},
   		handleSizeChange(val){
				this.checkData.pageNo = val
				this.getList(this.checkData)
			},
			handleCurrentChange(val){
				this.checkData.pageNo = val;
				this.getList(this.checkData)
			},
			writeInfo(index,row){
				this.$confirm('请确认评估前已在“风控评估点库"更新了评估点。', '提示', {
          confirmButtonText: '已维护评估点库，继续填报',
          cancelButtonText: '更新评估点库',
          distinguishCancelAndClose: true,
          center:true,
          type: 'warning',
        }).then(() => {
        	this.$router.push({
        		path:'/assessResult',
        		query:{
        			itemId:row.taskId,
        			depId:row.depId
        		}
        	})
        }).catch(action => {
        	if(action === 'cancel'){
        		this.axios.post('rmUser/permissionIds',qs.stringify({roleId: sessionStorage.getItem('roleId'),moduleId: "1_afkpgdk"})).then((res)=>{
        			this.setData({orgBtnData:res.data})
        			this.$router.push({
		        		path:'/assessPoint',
		        		query:{}
	        		})
        		})
        	}
        });
			},
   		getList(params){
   			this.axios.post('subrep/getsublist',qs.stringify(params)).then((res)=>{
   				if(res.data.data != null){
   					for (var i = 0; i < res.data.data.length; i++) {
							if(res.data.data[i].assBeginDate != null){
								res.data.data[i].assBeginDate = formatDate(new Date(parseInt(res.data.data[i].assBeginDate)*1000),'yyyy-MM-dd')
							}
							if(res.data.data[i].assEndDate != null){
								res.data.data[i].assEndDate = formatDate(new Date(parseInt(res.data.data[i].assEndDate)*1000),'yyyy-MM-dd')
							}
							if(res.data.data[i].endDate != null){
								res.data.data[i].endDate = formatDate(new Date(parseInt(res.data.data[i].endDate)*1000),'yyyy-MM-dd hh:mm:ss')
							}
							if(res.data.data[i].submitDate != null){
								res.data.data[i].submitDate = formatDate(new Date(parseInt(res.data.data[i].submitDate)*1000),'yyyy-MM-dd hh:mm:ss')
							}
						}
						this.tableData = []
						this.tableData = res.data.data
						this.totalResults = res.data.totalResults
   				}
				})
   		},
   		maskToggle(index,row){
   			this.itemId = row.taskId
	  		this.maskShow = !this.maskShow
	  		this.fileList = row.files == undefined?[]:row.files
	  		this.removeFileIds = []
	  	},
	  	uploadFile(param){
					var fileObj = param.file;
					var form = new FormData();
					form.append("file", fileObj);
					form.append('taskId',this.itemId)
					return this.axios.post('rmAssTask/upload',form,
						{onUploadProgress:function(event){
	              let percent=(event.loaded / event.total * 100) | 0
	              param.onProgress({percent:percent})
	           }
					}).then((res)=>{
							if(res.code == 200){
								debugger;
								this.fileList = []; 
								for (var i = 0; i < res.data.length; i++) {
									var b = this.removeFileIds
									var hasId = this.removeFileIds.indexOf(res.data[i].id)
									if(hasId == -1){
										var obj = new Object()
										obj.name = res.data[i].name
										obj.path = res.data[i].path
										obj.id = res.data[i].id
										this.fileList.push(obj)
									}
								}
							}else{
								this.$alert(res.message, '提示', {
	               confirmButtonText: '确定'}
								)
							}
						})
		   		},
		   		beforeAvatarUpload(file) {
			        const isLt2M = file.size / 1024 / 1024 < 10
			        if(!isLt2M) {
									this.fileList = this.$refs.uploads.fileList
									this.$alert('上传文件大小不能超过 10MB!')
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
								this.removeFileIds.push(this.fileList[i].id)
								this.fileList.splice(i,1)
							}
						}
				},
			cancelFile(){
				this.maskShow = false
				this.getList(this.checkData)
			},
			saveFile(){
				var obj = new Object()
				obj.taskId = this.itemId;
				obj.files = JSON.stringify(this.fileList);
				this.axios.post('rmAssTask/savesubfiles',qs.stringify(obj)).then((res)=>{
						if(res.code == 200){
							this.$alert('操作成功', '提示', {
	              confirmButtonText: '确定',
	              callback: action => {
	              			this.maskShow = false;
					          	this.getList(this.checkData)
					          }
									}
								)
						}else{
							this.$alert(res.message, '提示', {
	               confirmButtonText: '确定'})
						}
	  		})
			},
			submitFiles(){
				if(this.fileList.length == 0){
						this.$alert('请至少上传一个文件', '提示', {
		          confirmButtonText: '确定'
						})
						return;
					}
				this.axios.post('rmAssTask/changstatus',qs.stringify({id:this.itemId,status:3,files:JSON.stringify(this.fileList)})).then((res)=>{
						if(res.code == 200){
							this.$alert('操作成功', '提示', {
	              confirmButtonText: '确定',
	              callback: action => {
	              			this.maskShow = false;
					          	this.getList(this.checkData)
					          }
									}
								)
						}else{
							this.$alert(res.message, '提示', {
	               confirmButtonText: '确定'})
						}
	  		})
			},
	  	submit(index,row){
	  		this.axios.post('rmAssTask/changstatus',qs.stringify({id:row.taskId,status:2})).then((res)=>{
						if(res.code == 200){
							this.$alert('操作成功', '提示', {
	              confirmButtonText: '确定',
	              callback: action => {
					          	this.getList(this.checkData)
					          }
									}
								)
						}else{
							this.$alert(res.message, '提示', {
	               confirmButtonText: '确定'})
						}
	  		})
	  	}
   	},
   	beforeRouteEnter(to,from,next){
   		next((that)=>{
   			if(from.fullPath.includes('/assessPoint')){
   				that.axios.post('rmUser/permissionIds',qs.stringify({roleId: sessionStorage.getItem('roleId'),moduleId: "1_afkpgrwcb"})).then((res)=>{
	    			that.setData({orgBtnData:res.data})
	    		})
   			}
   		})
   	},
   	computed:{
   		...mapState(['orgBtnData'])
   	},
   	components:{
   		assessResult
   	}
	}    
</script>
<style lang="scss">
    #taskReport1{
    	.saveBtn{
				min-width: 68px;
				height: 26px;
				line-height: 1px;
				font-size: 12px;
				padding:0 2px;
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
	    	margin-top: 25px;
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
	    .statusCss{
	    	display: block;
	    	background: #FF6363;
	    	color: #fff;
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
					/*height: 365px;*/
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
						padding-top: 0;
						margin-top: 24px;
						height:80px;
						overflow-y: scroll;
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
    }
</style>
