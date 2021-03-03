<template>
  <div id="processManage">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">内控评估</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="textColor1">流程管理</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys">
    	<div class="titIcon"><em></em><span style="font-weight: 600;">流程管理</span></div>
	    <el-form :model="SuitObj" label-position="left" ref="SuitObj" class="demo-ruleForm" size="mini">
	        <el-row>
	            <el-col :span="5">
	               <el-form-item label="部门">
							    <el-select v-model="SuitObj.departmentNo" placeholder="请选择部门">
							    	<el-option v-for="item in department" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
								</el-form-item>
							</el-col>
							<el-col :span="15">
	              <el-form-item label="流程名称">
								  <el-input v-model="SuitObj.name" placeholder="搜索" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
	        		</el-col>
	            <el-col :span="4" style="text-align: right;">
	            	<el-button type="primary" class="saveBtn" @click="query(1,0)">查询</el-button>
	            	<el-button type="primary" class="saveBtn" v-if="false">导出</el-button>
	              <el-button type="primary" class="saveBtn">新增</el-button>
	            </el-col>
	        </el-row>
	    </el-form>
			<div class="cagy-run">
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
	          <el-table-column  type="index"  label="序号" align="center" > </el-table-column>
	          <el-table-column prop="department" label="填写部门" align="center"></el-table-column>
	          <el-table-column label="流程名称" align="center">
	          	<template slot-scope="scope">
	          		<div>{{scope.row.firstLevel}}-{{scope.row.secondLevel}}</div>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="firstLevel" label="一级流程" align="center"></el-table-column>
	          <el-table-column prop="secondLevel" label="二级流程"  align="center"> 
	          	<template slot-scope="scope">
	          		<span>{{scope.row.secondLevel == null?'--':scope.row.secondLevel}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column label="子流程编号"  align="center"> 
	          	<template slot-scope="scope">
	          		<span>{{scope.row.secondLevel == null?'--':scope.row.secondLevel}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column label="子流程"  align="center"> 
	          	<template slot-scope="scope">
	          		<div></div>
	          	</template>
	          </el-table-column>
	          <el-table-column label="操作" align="center" v-if="true">
	            <template slot-scope="scope">
	              <!--<span class="handleBtn moreBtn" style="color: #4285F4 ;padding:0 5px">编辑流程图 </span>-->
	              <span class="handleBtn moreBtne" @click="flowDetail" style="color: #4285F4;padding:0 5px">详情</span>
	            </template>
	          </el-table-column>
	        </el-table>
	        <el-pagination v-if="totalResults>0" background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
      </div>
		</div>
		<div class="maskFile" v-if="isOpen">
	 		<div class="readTxt">
	     		<el-tag @close="isOpen=false" closable></el-tag>
					<iframe id="fileRead" src="/data/risk/static/a.pdf" width="100%" height="100%"></iframe>
				</div>
	 	</div>
  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getData} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	data() {
      return {
      	SuitObj:{
      		departmentNo:null,
      		name:null
      	},
      	isShow:false,
      	isOpen:false,
      	currentPage:1,
      	totalResults:0,
        department:[],
        tableData:[]
			}
   	},
   	methods:{
   		//初始化页面数据
   		async initPage(){
   			//获取参与部门信息
   			this.axios.post('rmAssTask/getGroupDept',qs.stringify({})).then((res)=>{
							if(res.code == 200){
								if(res.data.length>1){
									var obj =	{code: null, name: "全部"}
									res.data.unshift(obj)
								}else{
									this.SuitObj.departmentNo = res.data[0].code
								}
								this.department = res.data;
								//查询结果
								this.query(1,0)
							}else{
								this.$alert(res.message, '提示', {confirmButtonText: '确定'})
							}
					})
// 			this.department.unshift({code:"",name:"全部"})
   		},
   		//查询
   		async query(val,type){
   			var obj = JSON.parse(JSON.stringify(this.SuitObj))
   			obj.pageNo=val
   			obj.pageSize=10
	   		this.axios.post('riskctrl/getsonobjlist',qs.stringify(obj)).then((res)=>{
							this.tableData = []
							if(res.data != null){
								this.tableData = res.data.data
								this.totalResults = res.data.totalResults;
								if(type==0){
									this.currentPage = 1;
								}
							}else{
								this.totalResults = 0;
							}
					})
   		},
   		//流程图详情
   		flowDetail(){
   			this.isOpen = true;
   		},
   		handleSizeChange(val){
				this.query(val,1)
			},
			handleCurrentChange(val){
				this.query(val,1)
			}
   	},
   	mounted(){
   		this.initPage()
   	}
	}    
</script>
<style lang="scss">
    #processManage{
    	.saveBtn{
				width: 68px;
				height: 26px;
				line-height: 1px;
				font-size: 12px;
				padding:0;
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
	    .maskFile{
				position: fixed;
				top: 6%;
				left: 15%;
				right: 0;
				bottom: 0;
				background: rgba(0,0,0,.4);
				z-index: 100000;
				text-align: center;
				.readTxt{
				  position: relative;
			  	height:100vh;
			  	border: 1px solid #E9E9E9;
			  	margin:0 auto;
			  	background: #fff;
				}
				.el-tag{
					float: right;
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
