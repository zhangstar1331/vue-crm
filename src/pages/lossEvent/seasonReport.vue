<template>
  	<div id="seasonReport">
		<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">损失事件管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item class="wgTxtColor bread" @click.native="goBack">损失事件报送</el-breadcrumb-item>
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
    		<div class="titIcon"><em></em><span style="font-weight: 600;">损失事件季报</span></div>
			<el-upload class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload" action="" :http-request="uploadFile">
			  <el-button type="primary" class="saveBtn" size="mini">导入数据</el-button>
			</el-upload>
        	<el-button type="primary" @click.native="goDownload" class="saveBtn">下载模板</el-button>
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	            <el-table-column type="index" label="序号" align="center" width="80" fixed></el-table-column>
	            <el-table-column prop="name" label="事件名称" align="center" width="200" fixed>
	                <template slot-scope="scope">
	                    <span :title="scope.row.name" class="textOverFlow" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="incidentType" label="事件类型" align="center" width="100">
	                <template slot-scope="scope">
	                    <span>{{scope.row.incidentType == null||scope.row.incidentType ==''?'--':incidentType[scope.row.incidentType]}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="discoverWay" label="发现方式" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.discoverWay == null||scope.row.discoverWay == ''?'--':discoverWay[scope.row.discoverWay]}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="isSeriousRisk" label="是否属于重大风险事件" align="center" width="150">
	                <template slot-scope="scope">
	                    <span>{{scope.row.isSeriousRisk == 1?'是':'否'}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="happenDate" label="事件发生时间" align="center" width="120">
	                <template slot-scope="scope">
	                    <span>{{scope.row.happenDate == null||scope.row.happenDate == ''?'--':scope.row.happenDate.substring(0,4)+'/'+scope.row.happenDate.substring(4,6)+'/'+scope.row.happenDate.substring(6,8)}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="reportDate" label="事件报告时间" align="center" width="120">
	                <template slot-scope="scope">
	                    <span>{{scope.row.reportDate == null||scope.row.reportDate == ''?'--':scope.row.reportDate.substring(0,4)+'/'+scope.row.reportDate.substring(4,6)+'/'+scope.row.reportDate.substring(6,8)}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="belongOrganization" label="事件所属机构" align="center" width="200">
	                <template slot-scope="scope">
	                    <div v-if="scope.row.belongOrganizationStr">
	                      	<p v-for="(item,index) in scope.row.belongOrganizationStr" v-if="index == 0">
	                          	<span :title="scope.row.belongOrganizationStr" class="textOverFlow">
	                          	{{item}}
	                          	<!-- {{scope.row.org == null||scope.row.org == ''?'--':scope.row.org}}--> 
	                          	</span>
	                          	<span v-if="scope.row.belongOrganizationStr.length>1">...</span>
	                     	 </p>
	                    </div>
	                    <div v-else>--</div>
	                </template>
	            </el-table-column>
	            <el-table-column prop="a" label="损失总额" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.a == null||scope.row.a ==''?'--':scope.row.a" class="textOverFlow">{{scope.row.a == null||scope.row.a ==''?'--':scope.row.a}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="b" label="追回总额" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.b == null||scope.row.b == ''?'--':scope.row.b" class="textOverFlow">{{scope.row.b == null||scope.row.b == ''?'--':scope.row.b}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="d" label="净损失总额" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.d == null||scope.row.d ==''?'--':scope.row.d" class="textOverFlow">{{scope.row.d == null||scope.row.d ==''?'--':scope.row.d}}</span>
	                </template>  
	            </el-table-column>
	            <el-table-column prop="submissionType" label="报送类型" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.submissionType == 1?'季报':'专报'}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="hanndle" label="操作" align="center" width="200">
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
          	titMsg:"损失事件季报",
          	checkData:{
	        	status:2,
	        	submissionType:1,
	        	pageNo: 1,
				pageSize: 1000
	        },
	        incidentType:{
	          	'1':'外部事件',
	          	'2':'业务活动',
	          	'3':'业外案件',
	          	'4':'业内案件',
	          	'5':'行政处罚',
	          	'6':'人员风险',
	          	'7':'信息系统风险',
	          	'8':'流程风险',
	        },
	        discoverWay:{
	          '1':'外部检查',
	          '2':'内部审计',
	          '3':'上级检查',
	          '4':'公司自查',
	          '5':'客户投诉',
	          '6':'举报',
	          '7':'其他'
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
	        this.axios.post('lossincident/queryList',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	            if(res.code == 200){
	            	if(res.data != null){
      					this.tableData = res.data.data==''?[]:res.data.data
      					this.totalResults = res.data.totalResults == undefined?1:res.data.totalResults
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
			this.axios.post('lossincident/downloadtemplate',qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "损失事件季报.xlsx";
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
	    	this.axios.post('lossincident/uploading',form).then((res)=>{
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
	    		path:'/lossEvent/lossEventSend',
	    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	              	id: this.$route.query.id
	            }
	    	})	
	    },
	    goDetail(index,row){
	        this.$router.push({
	            path:'/leSendDetail',   //跳转的路径
	            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            	lossId:row.id,
	              	flag:3,
	              	id: this.$route.query.id
	            }
	        })
	    },
	    goEdit(index,row){
	        this.$router.push({
	          path:'/specialReport',   //跳转的路径
	          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            lossId:row.id,
	            flag:3,
	            id: this.$route.query.id
	          }
	        })
	    },
	    goSubmit(index,row){
          	this.axios.post('lossincident/draftSubmit',qs.stringify({id:row.id})).then((res)=>{
	            if(res.code == 200){
	                this.$alert('提交成功', '提示', {
	                    confirmButtonText: '确定'
	                });
	                this.searchData(this.checkData);
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
	            this.axios.post('lossincident/draftDelete',qs.stringify({id:row.id})).then((res)=>{
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
	    	this.axios.post('lossincident/batchSubmit',qs.stringify()).then((res)=>{
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
    	.bread{
    		cursor: pointer;
    	}
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
