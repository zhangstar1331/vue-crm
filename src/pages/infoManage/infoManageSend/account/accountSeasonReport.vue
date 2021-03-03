<template>
  	<div id="seasonReport">
		<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">合规信息管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item class="wgTxtColor" @click.native="goBack">合规信息报送</el-breadcrumb-item>
					  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="9">
					<el-button type="primary" @click.native="goBatch" class="saveBtn">批量提交</el-button>
        			<el-button type="primary" @click.native="goBack" class="saveBtn">返回</el-button>
			  	</el-col>
		  	</el-row>
	  	</el-header>
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">问责信息季报</span></div>
			<el-upload class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload" action="" :http-request="uploadFile">
			  <el-button type="primary" class="saveBtn" size="mini">导入数据</el-button>
			</el-upload>
        	<el-button type="primary" @click.native="goDownload" class="saveBtn">下载模板</el-button>
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	            <el-table-column type="index" label="问责事件编号" align="center" width="150"></el-table-column>
	            <el-table-column prop="reason" label="问责事由" align="center" width="200">
	                <template slot-scope="scope">
	                    <span :title="scope.row.reason" class="textOverFlow">{{scope.row.reason == null||scope.row.reason == ''?'--':scope.row.reason}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="time" label="问责决定书下达时间" align="center" width="150">
	                <template slot-scope="scope">
	                    <span>{{scope.row.time == null||scope.row.time == ''?'--':scope.row.time}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="itemType" label="问责事项类型" align="center" width="200">
	                <template slot-scope="scope">
	                    <span>{{scope.row.itemType == null?'--':scope.row.itemType == 1?'业务经营问责':'案件责任追究'}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="objType" label="问责对象类型" align="center" width="200">
	                <template slot-scope="scope">
	                    <span>{{scope.row.objType == null||scope.row.objType == ''?'--':objType[scope.row.objType]}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="orgName" label="被问责/人员所属机构" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null||scope.row.orgName == ''?'--':scope.row.orgName.substr(scope.row.orgName.length-1,1) == '|'?scope.row.orgName.substr(0,scope.row.orgName.length-1):scope.row.orgName}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="bs,rs,ds,as" label="操作" align="center" width="200">
	              <template slot-scope="scope">
	                <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;">详情</span>
	                <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;">编辑</span>
	                <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row)" style="color: #4285F4;">提交</span>
	                <span class="handleBtn detailBtn" @click="goDelete(scope.$index, scope.row)" style="color: #4285F4;">删除</span>
	              </template>
	            </el-table-column>
	        </el-table>
	        <el-pagination background layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults"></el-pagination>
		</div>
  	</div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	quoteAssignForm:{},
    		tableData:[],
    		currentPage:1,
    		totalResults:0,
          	titMsg:"问责信息季报",
          	checkData:{
	        	status:2,
	        	submissionType:1,
	        	pageNo: 1,
				pageSize: 1000
	        },
	        objType:{
	          	'1':'集体问责',
	          	'2':'个人问责',
	          	'3':'集体问责+个人问责'
	        },
		}
   	},
    created(){
    	// 获取列表数据
    	this.searchData(this.checkData)
    },
    methods:{
    	// 查询列表数据
    	searchData(data){
	        this.axios.post('compliance/findComplianceSubList',qs.stringify(data)).then((res)=>{
	            if(res.code == 200){
	            	if(res.data != null){
      					this.tableData = res.data.data==''?[]:res.data.data
      					this.totalResults = res.data.totalResults == undefined?1:res.data.totalResults
      				} else{
      					this.tableData = []
      					this.totalResults = 1
      				}
	            }else{
	              	this.$alert(res.message, '提示', {
	                	confirmButtonText: '确定'
	                })
	            }
	        })
	    },
	    // 下载模板
		goDownload(){
	    	this.axios.post('/tpl/download/705',qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "问责信息季报.xlsx";
              	this.fileDownload(res, filename);
    		})
		},
		fileDownload(data, fileName) {
	      	let blob = new Blob([data], {
	        	type: "application/octet-stream"
	      	})
	      	let filename = fileName || "filename.xls";
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
	    // 导入数据
	    uploadFile(param){
    		var fileObj = param.file;
	    	var form = new FormData();
	    	form.append("file", fileObj);
	    	this.axios.post('compliance/uploadForDraft',form).then((res)=>{
				if(res.code == '200'){
					this.searchData(this.checkData)
				}else{
					this.$alert(res.message, '提示', {
		                confirmButtonText: '确定'
		            });
				}
    		})
        },
	    // 返回
	    goBack(){
	    	this.$router.push({
	    		path:'/infoManage/infoManageSend/account/accountSend',
	    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
      				id: this.$route.query.id
	            }
	    	})	
	    },
	    goDetail(index,row){
	        this.$router.push({
	            path:'/accountDetail',   //跳转的路径
	            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            	infoId:row.id,
	              	flag:3,
	              	id: this.$route.query.id
	            }
	        })
	    },
	    goEdit(index,row){
	        this.$router.push({
	          path:'/accountSpecialReport',   //跳转的路径
	          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            infoId:row.id,
	            flag:3,
	            id: this.$route.query.id
	          }
	        })
	    },
	    goSubmit(index,row){
          	this.axios.post('compliance/draftSubmit',qs.stringify({id:row.id})).then((res)=>{
	            if(res.code == 200){
	                this.$alert('提交成功', '提示', {
	                    confirmButtonText: '确定',
	                    callback:action=>{
                        	this.searchData(this.checkData);
                      	}
	                });
	            }else{
	                this.$alert(res.data, '提示', {
	                  confirmButtonText: '确定'
	                })
	            }
          	})
      	},
      	goDelete(index,row){
	        this.$confirm('确认删除？', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        }).then(_ => {
	            this.axios.post('compliance/deleteComplianceSubById',qs.stringify({id:row.id})).then((res)=>{
	                if(res.code == 200){
	                  	this.$alert('删除成功', '提示', {
	                      	confirmButtonText: '确定',
	                      	callback:action=>{
	                        	this.searchData(this.checkData);
	                      	}
	                	});
		            } else if(res.code == 500){
		                this.$alert('删除失败', '提示', {
		                    confirmButtonText: '确定'
		                })
		            }
	            })
	        })
	        .catch(_ => {});
	    },
	    goBatch(){
	    	this.axios.post('compliance/submitBatch',qs.stringify()).then((res)=>{
                if(res.code == 200){
                  	this.$alert(res.data, '提示', {
                      	confirmButtonText: '确定',
                      	callback:action=>{
                        	this.searchData(this.checkData);
                      	}
                	});
	            } else{
	                this.$alert(res.data, '提示', {
		                confirmButtonText: '确定'
		            });
	            }
            })
	    }
  	}
}    
</script>
<style lang="scss">
    #seasonReport{
    	.header{
			padding-left: 0;
		    padding-right: 2.6%;
		    padding-top: 20px;
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
    	.el-form-item--mini.el-form-item{
			width: auto!important
		}
		.el-input-group__append{
			background: #4285F4;
		    width: 20%;
		    text-align: center;
		    font-size: 16px;
		    color: #fff;
		}
		.saveBtn{
			float:right;
			width: 68px;
			height: 26px;
			line-height: 1px;
			padding: 0;
			margin-left:10px;
			font-size: 12px;
		}
    	.el-table__body, .el-table__footer, .el-table__header{
			border-collapse: collapse
		}
    	table tr:last-child td{
			border-bottom: none
		}
		.el-table::before{
			background-color: transparent!important
		}
		.el-table .cell{
	  		cursor:pointer
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
	    .el-pagination{
	    	display:none;
	    	text-align: center;
		    padding-bottom: 50px;
		    border: 0;
	    	margin-top: 30px;
	    }
	    .quoteSys{
	    	margin-top: 75px;
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
	    .el-tabs__header{
		  	margin:0;
		}
	    .el-tabs__item{
	    	padding:0;
	    	width: 100px;
	    	text-align: center;
	    }
	    .el-tabs__active-bar{
	    	display: none;
	    }
    	.is-active{
	    	background: #4285F4!important;
	    	color: #fff!important;
	    	text-align: center;
	    }
	    .handleBtn{
	    	display: inline-block;
	    	padding: 0 5px
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
		.el-col{
			text-align:left
		}
		.upload-demo{
			float: right;
		}
    }
</style>
