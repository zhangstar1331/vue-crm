<template>
  	<el-container id="checkAssign">
	  	<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span class="textColor1">风险监测指标管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item :to="{path:'/riskMonitor/quoteAssign/sendAssign?id=1_iypfrw'}"><span class="textColor1">指标分配</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor">已派发任务详情</span></el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="9">
					<el-button type="primary" class="search" size="mini" @click="back">返回</el-button>
			  		<!-- <el-button type="primary" @click="submitAll" size="mini">提交</el-button> -->
			  	</el-col>
		  	</el-row>
	  	</el-header>
  		<div class="box">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">基础信息</span></div>
			<div class="taskInfo">
				<el-row>
					<el-col :span="8">
						<div class="itemDiv">
							<span>任务名称：</span><span>{{baseInfo.applayObject}} - {{baseInfo.batch}}</span>
						</div>
						<div class="itemDiv">
							<span>适用对象：</span><span>{{baseInfo.applayObject}}</span>
						</div>
	                </el-col>
	                <el-col :span="8">
						<div class="itemDiv">
							<span>报送频率：</span><span>{{baseInfo.frequency}}</span>
						</div>
						<div class="itemDiv">
							<span>监测部门：</span><span>{{baseInfo.monitorDepartment}}</span>
						</div>
	                </el-col>
	                <el-col :span="8">
						<div class="itemDiv">
							<span>报送批次：</span><span>{{baseInfo.batch}}</span>
						</div>
						<div class="itemDiv">
							<span>呈报人：</span><span>{{baseInfo.reportMan}}</span>
						</div>
	                </el-col>
				</el-row>
			</div>
		</div>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">任务指标</span></div>
			<el-table :data="tableDatas" style="width: 100%;margin:20px 10px; background: #FFFFFF; border: 1px solid #E9E9E9;">
		        <el-table-column prop="serialNumber" label="指标编号" width="100" align="center"></el-table-column>
		        <el-table-column prop="name" label="指标名称" align="center" width="150">
		        	<template slot-scope="scope">
	                    <span :title="scope.row.name" class="textOverFlow">{{scope.row.name == null?'--':scope.row.name}}</span>
	                </template>
		        </el-table-column>
		        <el-table-column prop="blue" label="蓝" align="center">
		        	<template slot-scope="scope">
						<span>{{scope.row.blue == null? '--' : scope.row.blue}}</span>
		        	</template>
		        </el-table-column>
		        <el-table-column prop="yellow" label="黄" align="center">
		        	<template slot-scope="scope">
	    				<span>{{scope.row.yellow == null? '--' : scope.row.yellow}}</span>
			    	</template>
		        </el-table-column>
		        <el-table-column prop="red" label="红" align="center">
		        	<template slot-scope="scope">
	    				<span>{{scope.row.red == null? '--' : scope.row.red}}</span>
			    	</template>
		        </el-table-column>
		        <el-table-column prop="status" label="报送状态" align="center" width="100">
		        	<template slot-scope="scope">
		        		<span v-if="scope.row.status == undefined||scope.row.status == '0'">未报送</span>
		        		<span v-if="scope.row.status == '1'">已报送</span>
		        	</template>
		        </el-table-column>
		        <el-table-column prop="aging" label="报送时效" align="center" width="140"></el-table-column>
		        <el-table-column prop="status" label="操作" align="center" width="100">
		        	<template slot-scope="scope">
		                <span class="handleBtn detailBtn" @click="goUrge(scope.$index, scope.row)" v-if="scope.row.status == undefined||scope.row.status == '0'">催办</span>
		                <span class="handleBtn detailBtn" @click="sendBack(scope.$index, scope.row)" v-if="scope.row.status == '1'">退回</span>
		          	</template>
		        </el-table-column>
	      	</el-table>
		</div>
  	</el-container>
</template>
<script>
	import vCheck from 'src/components/check/quoteAssignCheck'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
	  	data() {
	        return {
	        	saveAllData:{},
		        tableDatas:[],
		        editInfo:{},
		        baseInfo:{},
		        frequency:{
		        	'1':'月度',
		        	'2':'季度',
		        	'3':'年度',
		        	'4':'半年度',
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
    			this.axios.post('indjob/jobdetails',qs.stringify({jobId:this.$route.query.jobId})).then((res)=>{
					if(res.code == '200'){
							var taskData = JSON.parse(sessionStorage.getItem('taskName'));
							this.$set(this.baseInfo,'applayObject',taskData[res.data.applayObject])
							this.$set(this.baseInfo,'batch',res.data.batch)
							this.$set(this.baseInfo,'frequency',this.frequency[res.data.frequency])
							this.$set(this.baseInfo,'monitorDepartment',taskData[res.data.monitorDepartment])
							this.$set(this.baseInfo,'reportMan',res.data.reportMan)
							this.$set(this.baseInfo,'submissionStatus',res.data.submissionStatus)
							this.tableDatas = res.data.indicator
							sessionStorage.setItem('path',this.baseInfo.submissionStatus)
					} else {
	        			this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
	        		}
	    		})
    		},
	        back(){
	        	this.$router.push({  //核心语句
			        path:'/riskMonitor/quoteAssign/sendAssign',//跳转的路径
			        query:{
			        	id:'1_iypfrw'
			        }
			    })
	        },
	        goUrge(index,row){
	        	var params = qs.stringify({
		            jobId: this.$route.query.jobId
		        })
		        this.axios.post('indjob/urge',params).then((res)=>{
		            if(res.code == '200'){
		                this.$alert('操作成功', '提示', {
		                  confirmButtonText: '确定'
		                });
		            }else{
		                this.$alert(res.message, '提示', {
		                  confirmButtonText: '确定'
		                })
		            }
		        })
		    },
		    // 退回
		    sendBack(index,row){
	    		var params = qs.stringify({
		            jobId: this.$route.query.jobId,
		            indicaId:row.id
		        })
	          	this.axios.post('indjob/sendback',params).then((res)=>{
	              if(res.code == '200'){
	                  this.$alert('操作成功', '提示', {
	                    confirmButtonText: '确定',
	                    callback: action => {
	                      this.getInfo()
	                    }
	                  });
	                  
	              }else{
	                  this.$alert(res.data, '提示', {
	                    confirmButtonText: '确定'
	                  })
	              }
	          })
	    },
	    }
  	};
</script>
<style lang="scss">
#checkAssign{
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
	.search{
	  float: right;
	  width: 68px;
	  height: 26px;
	  margin-right: 5px;
	  padding:0;
      font-size: 12px;
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
    .blueBg{
		display: inline-block;
		background: #4285F4;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
	.yellowBg{
		display: inline-block;
		background: #FFD824;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
	.redBg{
		display: inline-block;
		background: #FF6363;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
}	

</style>
