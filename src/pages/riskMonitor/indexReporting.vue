<template>
  <div id="indexReport">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor"  v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">指标呈报</span></div>
    			<!--<v-check @searchData = 'getListData'></v-check>-->
    			<el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
	    			<el-row>
		            <el-col :span="18">
		               	<el-form-item label="报送状态">
										    <el-select v-model="checkData.submission" placeholder="请选择呈报状态">
										    	<el-option v-for="item in SuitObj.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
										    </el-select>
										</el-form-item>
										<el-form-item label="报送批次">
											<el-date-picker v-model="batch" @change="getBatch" type="month" placeholder="报送批次" :picker-options="endDatePicker"> </el-date-picker>
										</el-form-item>
		            </el-col>
		            <el-col :span="6" style="text-align: right;">
		            	<el-button type="primary" class="saveBtn" @click="searchData(checkData,1)" v-if="btnData.searchbtn">查询</el-button>
		                <el-button type="primary" class="saveBtn" @click="jumpTaskReport" v-if="btnData.reportbtn">批量呈报</el-button>
		            </el-col>
		        </el-row>
    			</el-form>
    			<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
		          <el-table-column  type="index" width="180"  label="序号" align="center" > </el-table-column>
		          <el-table-column  prop="batch,applayObject"  label="任务名称" align="center">
			            <template slot-scope="scope" v-if="taskName">
			              <span>{{taskName[scope.row.applayObject] +'-'+ scope.row.batch}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column  prop="batch"  label="报送批次" align="center"></el-table-column>
		          <el-table-column prop="aging" width='220' label="报送时效" align="center"></el-table-column>
		          <el-table-column prop="frequency"  label="报送频率"  align="center"> 
		          		<template slot-scope="scope">
			              <span>{{frequency[scope.row.frequency]}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="applayObject"  label="报送部门"  align="center"> 
		          		<template slot-scope="scope" v-if="taskName">
			              <span>{{taskName[scope.row.monitorDepartment]}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="reportMan"  label="呈报人"  align="center"> 
		          		<template slot-scope="scope">
			              <span>{{ scope.row.reportMan == null?'--':scope.row.reportMan}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="submissionStatus"  label="呈报状态"  align="center"> 
		          		<template slot-scope="scope">
			              <span>{{ scope.row.submissionStatus == null?'--':bsStatus[scope.row.submissionStatus]}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
		            <template slot-scope="scope">
		              <span class="handleBtn moreBtn" @click="editRisk(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px" v-if="btnData.detailbtn">查看 </span>
		            </template>
		          </el-table-column>
		        </el-table>
	      </div>
	      <el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
		</div>
  </div>
</template>
<script>
	import vCheck from 'src/components/check/paramCheck'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	data() {
        return {
          panelShow:true,
        	flag:0,
        	totalResults:0,
        	tableData4:[],
        	endDatePicker:this.processDate(),
        	dengmiQueryForm: {
	            wgOrgnize:'',
	            wgName:'',
	            wgFile:''
	        },
	        taskName:{},
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
          titMsg:"指标呈报",
          currentPage:1,
          paramName:'',
          batch:'',
          SuitObj: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	code:''
	          },{
	          	name:'未报送',
	          	code:'0'
	          },{
	          	name:'报送中',
	          	code:'2'
	          },{
	          	name:'已报送',
	          	code:'1'
	          }]
	        },
	        sendTimes: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	code:''
	          }]
	        },
          checkData:{
          	submission:'',
          	batch:'',
          	pageNo:'1',
          	pageSize:'10'
          },
          btnData:{   //按钮显示隐藏
			searchbtn: false,
			reportbtn: false,
			detailbtn: false,
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
    components:{
    		vCheck
    },
    created(){
    	this.searchData(this.checkData)
    	this.getCommon()
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_izbcbq')>=0){//查询
            		this.btnData.searchbtn = true
            	}else{
            		this.btnData.searchbtn = false
            	}
            	if(handleData.indexOf('1_izbcbe')>=0){//呈报
            		this.btnData.reportbtn = true
            	}else{
            		this.btnData.reportbtn = false
            	}
            	if(handleData.indexOf('1_izbcbd')>=0){//详情
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            }
	    },
    	deleteRisk(index,row){
    		this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
            	this.axios.post('riskparam/delParam',qs.stringify({id:row.id})).then((res)=>{
		    					if(res.code == '200'){
		    						this.$alert("操作成功", '提示', {
			               confirmButtonText: '确定',
			               callback:action=>{
			               		this.searchData(this.checkData)
			                }
			              });
		    					}
			    		})
          }).catch(_ => {});
    	},
    	editRisk(index,row){
    		sessionStorage.setItem('taskName',JSON.stringify(this.taskName)) 
    		this.$router.push({
	        path:'/taskReport',   //跳转的路径
	        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				    	taskId:row.id    
		        }
				  })
			},
    	jumpTaskReport(id){
    		sessionStorage.setItem('taskName',JSON.stringify(this.taskName))
    		this.$router.push({
    			path:'/taskReport',
    			query:{
    				taskId:'111',
    				pl :'1'
    			}
    		})
    	},
    	searchData(data,isCX){
    		if(isCX == '1'){
    			this.currentPage = 1;
				this.checkData.pageNo = 1
    		}
    		this.axios.post('indjob/submitlist',qs.stringify(data)).then((res)=>{
    					if(res.code == '200'){
    						this.tableData4 = [];
    						this.tableData4 = res.data.data;
    						this.totalResults = res.data == ''?1:res.data.totalResults;
    					}
	    		})
    	},
    	getCommon(){
    		this.axios.post('indjob/comm',qs.stringify({})).then((res)=>{
    					if(res.code == '200'){
    							this.taskName = res.data.codpNames
    					}
	    		})
    	},
	    handleSizeChange (value) {
	        this.checkData.pageNo = value;
	        this.searchData(this.checkData)
	      },
		  handleCurrentChange (value) {
		    this.checkData.pageNo = value;
		    this.searchData(this.checkData)
		  },
		  getListData(data){
		  	this.currentPage = 1;
		  	this.checkData = data;
		  	this.searchData(this.checkData)
		  },
		  getBatch(val){
		  	if(val != null){
	  			this.checkData.batch = formatDate(val,'yyyy-MM');
	  			this.checkData.batch = this.checkData.batch.split('-').join('')
	  		}else{
	  			this.checkData.batch = '';
	  		}
		  },
		  processDate(){
	        return {
	          disabledDate(time){
	            return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
	          }
	        }
	      }
  }
}    
</script>
<style lang="scss">
    #indexReport{
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
	    	.quoteBox{
	    		margin-top: 2px;
		    	min-height: 250px;
		    	background: #fff;
		    	padding: 16px 16px 50px 16px;
		    	border-radius: 8px;
		    	.titIcon{
		    		font-size:14px;
		    		margin-bottom:30px;
		    		width:100%;
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
	    .tbox{
	    	padding-bottom:50px;
	    }
	    .el-pagination{
	    	margin-top: 30px;
	    }
	    .el-form-item__content{
	    	float: left;
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
	    #tab-first{
	    	background: #fff;
	    	width: 100px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
	    }
	    #tab-second{
	    	background: #fff;
	    	width: 100px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
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
	    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
	    	margin-bottom: 18px;
		    float: left;
		    width: 300px;
	    }
	    .saveBtn{
				width: 68px;
				height: 26px;
				padding: 0;
				line-height: 1px;
				font-size: 12px;
			}
    }
</style>
