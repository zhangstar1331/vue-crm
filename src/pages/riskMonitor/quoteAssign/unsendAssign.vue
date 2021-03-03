<template>
  	<div id="unsend">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor">指标分配</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor" v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<!--未派发列表-->
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">未派发任务</span></div>
    		<el-form :model="quoteAssignForm" label-position="left" ref="quoteAssignForm" size="mini" :inline="true">
	            <el-row>
	                <el-col :span="20">
	                    <el-form-item label="适用对象">
						    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
						    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
						    </el-select>
						</el-form-item>
	                    <el-form-item label="报送部门">
						    <el-select v-model="testDepartment.region" @change="changeDepart" placeholder="请选择报送部门">
						    	<el-option v-for="item in testDepartment.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
						    </el-select>
						</el-form-item>
	                    <el-form-item label="报送批次">
						    <el-date-picker v-model="batch" @change="changeBatch" type="month" placeholder="报送批次" :picker-options="endDatePicker"> </el-date-picker>
						</el-form-item>
	                </el-col>
	                <el-col :span="4" style="text-align: right;">
	                    <el-button type="primary" @click.native="goSearch" class="saveBtn">查询</el-button>
	                </el-col>
	            </el-row>
	        </el-form>
    		<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:10px">
		           	<el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
            		<el-table-column prop="batch,applayObject" label="任务名称" align="center">
		                <template slot-scope="scope" v-if="taskName">
		                  <span :title="taskName[scope.row.applayObject] +'-'+ scope.row.batch" class="textOverFlow">{{taskName[scope.row.applayObject] +'-'+ scope.row.batch}}</span>
		                </template>
		            </el-table-column>
		            <el-table-column prop="batch" label="报送批次" align="center" width="120"></el-table-column>
		            <el-table-column prop="aging" label="报送时效" align="center" width="140"></el-table-column>
		            <el-table-column prop="frequency" label="报送频率" align="center" width="120">
		            	<template slot-scope="scope">
			              <span>{{frequency[scope.row.frequency]}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="applayObject" label="适用对象" align="center" width="120">
		            	<template slot-scope="scope" v-if="taskName">
			              <span>{{taskName[scope.row.applayObject]}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="monitorDepartment" label="报送部门" align="center">
		            	<template slot-scope="scope" v-if="taskName">
			              <span :title="taskName[scope.row.monitorDepartment]" class="textOverFlow">{{taskName[scope.row.monitorDepartment]}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="reportMan" label="呈报人" align="center" width="120">
		            	<template slot-scope="scope">
		                  <span :title="scope.row.reportMan" class="textOverFlow">{{scope.row.reportMan == null?'--':scope.row.reportMan}}</span>
		                </template>
		            </el-table-column>
		            <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
		              <template slot-scope="scope">
		                <span class="handleBtn detailBtn" @click="editAssign(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
		                <span class="handleBtn moreBtne" @click="sendAssign(scope.$index, scope.row)" style="color: red;" v-if="btnData.sendbtn">派发</span>
		              </template>
		            </el-table-column>
		        </el-table>
	      </div>
	      <el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
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
          	panelShow:true,
    		flag:0,
    		totalResults:0,
    		tableData4:[],
          	titMsg:"未派发任务",
          	currentPage:1,
          	checkData:{//查询数据
          		distribute:0,//任务状态
	            submission:'',//派发状态
	            applayObject:'',//适用对象 
	            monitorDepartment:'',//监测部门
	            batch:'',//报送批次
	            pageNo:'1',
	            pageSize:'10'
          	},
          	// 适用对象
	        application:{
	          	region: '全部',
	          	unitsData:[{
		          	name:'全部',
		          	id:''
		        }]
	        },
	        // 报送部门
	        testDepartment:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部',
		          	id:''
		        }]
	        },
	        // 报送批次
	        batch:'',
	        taskName:{},
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度',
		        '4':'半年度',
	        },
	        endDatePicker:this.processDate(),
	        btnData:{   //按钮显示隐藏
  				detailbtn: false,
  				sendbtn: false,
  				changebtn: false,
  			},
		}
   	},
   	computed:{
  		f1(){
  			return this.$store.state.orgBtnData
  		}
  	},
  	watch:{
  		f1(newdata,olddata){
  			this.getData(newdata)
  		}
  	},
    created(){
    	// 获取适用对象
    	this.getCommon()
    	// 获取列表数据
    	this.searchData(this.checkData)
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_iwpfrwd')>=0){//详情
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            	if(handleData.indexOf('1_iwpfrwp')>=0){//派发
            		this.btnData.sendbtn = true
            	}else{
            		this.btnData.sendbtn = false
            	}
            	if(handleData.indexOf('1_iwpfrwe')>=0){//调整
            		sessionStorage.setItem('changebtn',1)
            	}else{
            		sessionStorage.setItem('changebtn',0)
            	}
            }
	    },
    	//适用对象
      	changeApply(val){
      		this.checkData.applayObject = val
      		// 获取报送部门
      		if(val!==''){
      			this.getDepartMent(val)
      		}
      	},
      	//报送部门
      	changeDepart(val){
      		this.checkData.monitorDepartment = val;
      	},
      	//报送批次
      	changeBatch(val){
      		if(val != null){
	  			this.checkData.batch = formatDate(val,'yyyy-MM');
	  			this.checkData.batch = this.checkData.batch.split('-').join('')
	  		}else{
	  			this.checkData.batch = '';
	  		}
      	},
      	// 适用对象
      	getCommon(){
      		this.axios.post('indjob/comm',qs.stringify({})).then((res)=>{
				if(res.code == '200'){
					// 适用对象
		   			this.application.unitsData = this.application.unitsData.concat(res.data.company)
					this.taskName = res.data.codpNames
					sessionStorage.setItem('taskName',JSON.stringify(this.taskName)) 
				} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
        		}
    		})
      	},
      	// 报送批次
      	processDate(){
	        return {
	          disabledDate(time){
	            return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
	          }
	        }
	    },
      	// 报送部门根据适用对象变化
      	getDepartMent(str){
		  	this.axios.post('indicator/department',qs.stringify({company:str})).then((res)=>{
	   			if(res.code == '200'){
	   				if(res.data!=null){
						this.testDepartment.region = '全部'
						this.checkData.monitorDepartment =''
						this.testDepartment.unitsData = [{ name:'全部', id:''}]
	   					this.testDepartment.unitsData = this.testDepartment.unitsData.concat(res.data)
	   				} else{
	   					this.testDepartment.region = '全部'
						this.checkData.monitorDepartment =''
	   					this.testDepartment.unitsData = [{ name:'全部', id:'' }]
	   				}
	   			}else{
	   				this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
	   			}
		   	})
		},
      	// 详情
    	editAssign(index,row){
    		this.$router.push({
		        path:'/editAssign',   //跳转的路径
		        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					jobId:row.id
			    }
			})
    	},
    	// 派发
    	sendAssign(index,row){
    		this.axios.post('indjob/distribute',qs.stringify({jobId:row.id})).then((res)=>{
              	if(res.code == '200'){
                	this.$alert('操作成功', '提示', {
			        	confirmButtonText: '确定',
			        	callback: action => {
		                    this.searchData(this.checkData)
		                }
			        });
              	}else{
                	this.$alert(res.message, '提示', {
	                    confirmButtonText: '确定'
	                })
              	}
          	})
    	},
    	// 查询列表数据
    	searchData(data){
    		this.axios.post('indjob/joblist',qs.stringify(data)).then((res)=>{
    			if(res.code == '200'){
	        		this.tableData4 = res.data==''?[]:res.data.data;
	        		this.totalResults = res.data == ''?0:res.data.totalResults;
        		} else {
        			this.$alert(res.data, '提示', {
			        	confirmButtonText: '确定'
			        });
        		}
    		})
	    },
	    // 搜索按钮
	    goSearch(){
			this.checkData.pageNo = 1
			this.currentPage = 1;
			this.searchData(this.checkData)
		},
	    handleSizeChange (value) {
	        this.checkData.pageNo = value;
	        this.searchData(this.checkData)
	    },
		handleCurrentChange (value) {
		    this.checkData.pageNo = value;
		    this.searchData(this.checkData)
		}
  	}
}    
</script>
<style lang="scss">
	#unsend .el-form-item--mini.el-form-item{
		width: auto!important
	}
	#unsend .el-input-group__append{
		background: #4285F4;
	    width: 20%;
	    text-align: center;
	    font-size: 16px;
	    color: #fff;
	}
	#unsend .saveBtn{
		width: 68px;
		height: 26px;
		line-height: 1px;
		padding: 0;
		font-size: 12px;
	}
    #unsend{
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
		
    }
</style>
