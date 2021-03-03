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
    		<div class="titIcon"><em></em><span style="font-weight: 600;">监管处罚事项季报</span></div>
			<el-upload class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload" action="" :http-request="uploadFile">
			  <el-button type="primary" class="saveBtn" size="mini">导入数据</el-button>
			</el-upload>
        	<el-button type="primary" @click.native="goDownload" class="saveBtn">下载模板</el-button>
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
	            <el-table-column prop="pt" label="处罚类型" align="center" width="120">
	                <template slot-scope="scope">
	                    <span>{{scope.row.pt == null||scope.row.pt == ''?'--':puninshType[scope.row.pt]}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="name" label="处罚事由" align="center" width="200">
	                <template slot-scope="scope">
	                    <span :title="scope.row.name" class="textOverFlow">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="zt" label="实施主体类型" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.zt == null||scope.row.zt == ''?'--':subject[scope.row.zt]}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="org" label="被处罚机构" align="center">
	                <template slot-scope="scope">
	                    <!-- <span :title="scope.row.org" class="textOverFlow">{{scope.row.org == null||scope.row.org == ''?'--':scope.row.org}}</span> -->
	                    <div v-if="scope.row.org">
		                    <p v-for="(item,index) in scope.row.org" v-if="index == 0">
		                      <span :title="scope.row.org" class="textOverFlow">{{item}}</span>
		                      <span v-if="scope.row.org.length>1">...</span>
		                    </p>
		                </div>
		                <div v-else>--</div>
	                </template>
	            </el-table-column>
	            <el-table-column prop="lkDate" label="处罚决定书落款时间" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.lkDate == null||scope.row.lkDate == ''?'--':scope.row.lkDate}}</span>
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
          	titMsg:"监管处罚事项季报",
          	checkData:{
          		isZb:1,
	        	pageNo: 1,
				pageSize: 1000
	        },
	        subject:{
	          	'1':'银保监系统',
	         	'2':'人民银行',
	          	'3':'财政部',
	          	'4':'审计署',
	          	'5':'其他'
	        },
	        discoverWay:{
	          	'1':'外部检查',
	          	'2':'上级检查',
	          	'3':'公司自查',
	          	'4':'客户投诉',
	          	'5':'举报',
	          	'6':'其他'
	        },
	        puninshType:{
	          	'1':'行政处罚',
	          	'2':'监管函',
	          	'3':'行政监管措施',
	          	'4':'监管意见书',
	          	'5':'其他'
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
	        this.axios.post('penalize/query',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
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
	    	this.axios.post('/tpl/download/702',qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "监管处罚事项季报.xlsx";
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
	    	this.axios.post('/penalize/import',form).then((res)=>{
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
	    		path:'/infoManage/infoManageSend/punish/punishSend',
	    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
      				id: this.$route.query.id
	            }
	    	})	
	    },
	    goDetail(index,row){
	        this.$router.push({
	            path:'/punishDetail',   //跳转的路径
	            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            	infoId:row.id,
	              	flag:3,
	              	id: this.$route.query.id
	            }
	        })
	    },
	    goEdit(index,row){
	        this.$router.push({
	          path:'/punishSpecialReport',   //跳转的路径
	          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            infoId:row.id,
	            flag:3,
	            id: this.$route.query.id
	          }
	        })
	    },
	    goSubmit(index,row){
          	this.axios.post('penalize/submit',JSON.stringify({id:row.id,flag:0}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	            if(res.code == 200){
	                this.$alert('提交成功', '提示', {
	                    confirmButtonText: '确定',
	                    callback:action=>{
                        	this.searchData(this.checkData);
                      	}
	                });
	            }else {
	                this.$alert(res.message, '提示', {
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
	            this.axios.post('penalize/del',qs.stringify({id:row.id})).then((res)=>{
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
	    	this.axios.post('penalize/submit',JSON.stringify({flag:9}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
                if(res.code == 200){
                	if(res.data !== null){
                		var tip = ""
                		if(res.data.s!==null){
                			tip = "成功提交"+res.data.s+"条数据"
                		} else{
                			tip = "成功提交0条数据"
                		}
                		this.$alert(tip, '提示', {
	                      	confirmButtonText: '确定',
	                      	callback:action=>{
	                        	this.searchData(this.checkData);
	                      	}
	                	});
                	}
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
