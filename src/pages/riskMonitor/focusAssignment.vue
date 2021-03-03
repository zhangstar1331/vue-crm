<template>
  <div id="indexReport">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor"  v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">集中度分配</span></div>
    			<el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
	    			<el-row>
		            <el-col :span="18">
		               	<el-form-item label="适用对象">
										    <el-select v-model="SuitObj.region" @change="getSuitObj" placeholder="请选择适用对象">
										    	<el-option v-for="item in SuitObj.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
										    </el-select>
										</el-form-item>
										<el-form-item label="报送批次">
											<el-date-picker v-model="batch" @change="getBatch" type="month" placeholder="报送批次" :picker-options="endDatePicker"> </el-date-picker>
										</el-form-item>
		            </el-col>
		            <el-col :span="6" style="text-align: right;">
		            	<el-button type="primary" class="saveBtn" @click="searchList(checkData)" v-if="btnData.searchbtn">查询</el-button>
		            </el-col>
		        </el-row>
    			</el-form>
    			<div class="oneKey">
    				<el-button type="primary" class="saveBtn" @click="jumpTaskReport" v-if="btnData.oneurgebtn">一键催办</el-button>
    			</div>
    			<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
		          <el-table-column  type="index" width="180"  label="序号" align="center" > </el-table-column>
		          <el-table-column  prop="name"  label="任务名称" align="center">
			            <template slot-scope="scope">
			              <span :title="scope.row.name" class="textOverFlow">{{scope.row.name}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column  prop="batch"  label="报送批次" align="center"></el-table-column>
		          <el-table-column prop="aging"  label="报送时效" align="center"></el-table-column>
		          <el-table-column prop="frequency"  label="报送频率"  align="center"> 
		          		<template slot-scope="scope">
			              <span>{{frequency[scope.row.frequency]}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="monitorDepartment"  label="报送部门"  align="center"> 
		          		<template slot-scope="scope" v-if="taskName">
			              <span>{{taskName[scope.row.monitorDepartment]}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="reportMan"  label="呈报人"  align="center">
		          		<template slot-scope="scope">
			              <span>{{scope.row.reportMan == null?'--':scope.row.reportMan}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="applayObject"  label="适用对象"  align="center"> 
		          		<template slot-scope="scope">
			              <span :title="scope.row.name" class="textOverFlow">{{taskName[scope.row.applayObject]}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
		            <template slot-scope="scope">
		              <span class="handleBtn moreBtn" v-if="scope.row.submissionStatus == 0&&btnData.urgebtn" @click="editRisk(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px">催办</span>
		              <span class="handleBtn moreBtn" v-if="scope.row.submissionStatus == 1&&btnData.detailbtn" @click="jumpDetail(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px">查看</span>
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
        	batch:'',
        	downFlag:false,
        	taskName:{},
        	endDatePicker:this.processDate(),
        	dengmiQueryForm: {
	            wgOrgnize:'',
	            wgName:'',
	            wgFile:''
	        },
          titMsg:"集中度分配",
          currentPage:1,
          paramName:'',
          SuitObj: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:''
	          }]
	        },
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度',
	        	'4':'半年度',
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
          	apply:null,
          	batch:null,
          	pageNo:'1',
          	pageSize:'10'
          },
          btnData:{   //按钮显示隐藏
			searchbtn: false,
			urgebtn: false,
			oneurgebtn: false,
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
    	this.getCommon()
    	this.$nextTick(()=>{
    		this.searchList(this.checkData)
    	})
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ijzdfpc')>=0){//查询
            		this.btnData.searchbtn = true
            	}else{
            		this.btnData.searchbtn = false
            	}
            	if(handleData.indexOf('1_ijzdfpu')>=0){//催办
            		this.btnData.urgebtn = true
            	}else{
            		this.btnData.urgebtn = false
            	}
            	if(handleData.indexOf('1_ijzdfpo')>=0){//一键催办
            		this.btnData.oneurgebtn = true
            	}else{
            		this.btnData.oneurgebtn = false
            	}
            	if(handleData.indexOf('1_ijzdfpzq')>=0){//详情
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
			               		this.searchList(this.checkData)
			                }
			              });
		    					}
			    		})
          }).catch(_ => {});
    	},
    	editRisk(index,row){
    		this.axios.post('concentrate/urge',qs.stringify(row.id)).then((res)=>{
    					if(res.code == '200'){
    						this.$alert("操作成功", '提示', {
				               confirmButtonText: '确定'
				            });
    					}
	    		})
    	},
    	jumpTaskReport(){
    		this.axios.post('concentrate/oneKeyUrge',qs.stringify({applayObject:this.checkData.apply,batch:this.checkData.batch,type:1})).then((res)=>{
    					if(res.code == '200'){
    						this.$alert("操作成功", '提示', {
			               		confirmButtonText: '确定'
			              	});
    					}
	    		})
    	},
    	jumpDetail(index,row){
    		var activeName = '';
    		var investBatch = '';
    		var reinsureBatch = '';
    		var roleId = sessionStorage.getItem('roleId')
          	if(roleId !== null){
	          	var params = qs.stringify({
	              	roleId: roleId,
	              	moduleId: '1_ijzdbb'
	          	})
	          	this.axios.post('rmUser/permissionIds',params).then((res)=>{
		            if(res.code == 200){
						if(res.data !== null){
							if(row.name == '投资集中度'){
				    			activeName = 'second'
				    			investBatch = row.batch
				    			if(res.data.indexOf('1_ijzdbbtl')<0){
				    				this.$alert("用户没有权限访问该资源", '提示', {
						               confirmButtonText: '确定'
						            });
						            return
				    			}
				    		}else{
				    			activeName = 'first'
				    			reinsureBatch = row.batch
				    			if(res.data.indexOf('1_ijzdbbl')<0){
				    				this.$alert("用户没有权限访问该资源", '提示', {
						               confirmButtonText: '确定'
						            });
						            return
				    			}
				    		}
				    		this.$router.push({
						        path:'/riskMonitor/quoteForm/focusForm',   //跳转的路径
						        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
								    activeName:activeName,
								    id:"1_ijzdbb",
								    investBatch:investBatch,
								    reinsureBatch:reinsureBatch,
						        }
							})
							sessionStorage.setItem('jzdhandleData',res.data)
			        	} else{
			        		this.$alert("用户没有权限访问该资源", '提示', {
				               confirmButtonText: '确定'
				            });
			        	}
		            }
	          	})
	        }
    	},
    searchList(data){
    	this.checkData.type = '1'
    	this.axios.post('concentrate/findConcentrateList',qs.stringify(data)).then((res)=>{
    					if(res.code == '200'){
    						this.tableData4 = [];
    						this.tableData4 = res.data.data;
    						if(this.checkData.pageNo == "1"){
				    			this.currentPage = 1;
				    		}
    						this.totalResults = res.data.totalResults == undefined?0:res.data.totalResults;
    					}
	    		})
    },
    handleSizeChange (value) {
        this.checkData.pageNo = value;
        this.searchList(this.checkData)
      },
	  handleCurrentChange (value) {
	    this.checkData.pageNo = value;
	    this.searchList(this.checkData)
	  },
	  getListData(data){
	  	this.currentPage = 1;
	  	this.checkData = data;
	  	this.searchList(this.checkData)
	  },
	  getCommon(){
    		this.axios.post('indjob/comm',qs.stringify({type:1})).then((res)=>{
    					if(res.code == '200'){
    							this.SuitObj.unitsData = this.SuitObj.unitsData.concat(res.data.company)
    							this.taskName = res.data.codpNames
    					}
	    		})
    	},
    getBatch(val){
    	this.checkData.pageNo = '1';
    	if(val != null){
	  			this.checkData.batch = formatDate(val,'yyyy-MM');
	  			this.checkData.batch = this.checkData.batch.split('-').join('')
	  		}else{
	  			this.checkData.batch = '';
	  		}
    },
    getSuitObj(val){
    	this.checkData.pageNo = '1';
    	this.checkData.apply = val;
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
	    .oneKey{
	    	text-align: right;
	    	height: 50px;
	    	line-height: 50px;
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
		    width: 25%;
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
