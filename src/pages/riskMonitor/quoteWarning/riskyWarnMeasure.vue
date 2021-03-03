<template>
  <div id="quoteMeasure">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor"  v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">风险提示单列表</span></div>
    			<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
		          <el-table-column  type="index" width="180"  label="序号" align="center" > </el-table-column>
		          <el-table-column  prop="warnName"  label="风险提示单名称" align="center">
			            <template slot-scope="scope">
			              <span :title="scope.row.warnName" class="textOverFlow">{{scope.row.warnName}}</span>
			            </template>
		          </el-table-column>
		          <!-- <el-table-column prop="level"  label="预警级别"  align="center"> 
		          		<template slot-scope="scope">
			              <span>{{scope.row.level == '1'?'风险提示':'风险警示'}}</span>
			            </template>
		          </el-table-column> -->
		          <el-table-column  prop="createDate"  label="提出日期" align="center"></el-table-column>
		          <el-table-column prop="isReport"  label="是否需要反馈报告" align="center">
		          		<template slot-scope="scope">
			              <span>{{scope.row.isReport == '1'?'是':'否'}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="dealEndDate" label="处理截止日期"  align="center"> </el-table-column>
		          <el-table-column prop="dealDepartName" label="处理部门"  align="center"> 
		          		<template slot-scope="scope">
		          			<span>{{scope.row.dealDepartName == ''?'--':scope.row.dealDepartName}}</span>
		          		</template>
		          </el-table-column>
		          <el-table-column prop="dealUsetName"  label="处理人"  align="center">
		          	  <template slot-scope="scope">
		          			<span>{{scope.row.dealUsetName == undefined?'--':scope.row.dealUsetName}}</span>
		          		</template>
		          </el-table-column>
		          <el-table-column prop="dealStatus"  label="处理状态"  align="center"> 
		          		<template slot-scope="scope">
			              <div v-if = 'scope.row.isReport == 1'>
			              	<span v-if='scope.row.dealStatus == 1' class="redBg">未处理</span>
			              	<span v-if= 'scope.row.dealStatus == 2'>{{scope.row.expireStatus == '0'?'未逾期':'逾期'}}</span>
			              </div>
			              <span v-if = 'scope.row.isReport == 0'> -- </span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
		            <template slot-scope="scope">
		              <span class="handleBtn moreBtn" v-if="scope.row.dealStatus == 1 && scope.row.isReport == 1&&btnData.fillbtn" @click="goRewriteDetail(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px">填报</span>
		              <span class="handleBtn moreBtn" v-if="btnData.detailbtn" @click="jumpDetail(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px">详情</span>
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
          titMsg:"风险提示单列表",
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
	        	'3':'年度'
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
          	pageNo:'1',
          	pageSize:'10'
          },
          btnData:{
        	fillbtn:false,
        	detailbtn:false
          }
		}
   },
    components:{
    		vCheck
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
    	this.getCommon()
    	this.$nextTick(()=>{
    		this.searchList(this.checkData)
    		this.getData(this.$store.state.orgBtnData)
    	})
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ifxyjzgcsa')>=0){//填报
            		this.btnData.fillbtn = true
            	}else{
            		this.btnData.fillbtn = false
            	}
            	if(handleData.indexOf('1_ifxyjzgcsd')>=0){//详情
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
            	this.axios.post('rmIndStass/indWarnMeaList',qs.stringify({id:row.id})).then((res)=>{
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
    	//填报
    	goRewriteDetail(index,row){
    		this.$router.push({
		        path:'/quoteWarnDetail',   //跳转的路径
		        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
						writeId:row.id    
			    }
				})
    	},
    	jumpDetail(index,row){
    		this.$router.push({
		        path:'/quoteWarnDetail',   //跳转的路径
		        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
							measureId:row.id    
			    	}
				})
    	},
    searchList(data){
    	this.axios.post('rmIndWarn/indWarnMeaList',qs.stringify(data)).then((res)=>{
    					if(res.code == '200'){
    						this.tableData4 = [];
    						if(res.data != null){
    							this.tableData4 = res.data.data;
    							for (var i = 0; i < res.data.data.length; i++) {
    								if(res.data.data[i].createDate != undefined){
    									res.data.data[i].createDate = formatDate(new Date(parseInt(res.data.data[i].createDate)*1000),'yyyy-MM-dd')
    								}else{
    									res.data.data[i].createDate = '--'
    								}
    								if(res.data.data[i].dealEndDate != undefined){
    									res.data.data[i].dealEndDate = formatDate(new Date(parseInt(res.data.data[i].dealEndDate)*1000),'yyyy-MM-dd')
    								}else{
    									res.data.data[i].dealEndDate = '--'
    								}
    							}
    							this.totalResults = res.data.totalResults
    						}
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
    		this.axios.post('indjob/comm',qs.stringify({})).then((res)=>{
    					if(res.code == '200'){
    							this.SuitObj.unitsData = this.SuitObj.unitsData.concat(res.data.company)
    							this.taskName = res.data.codpNames
    					}
	    		})
    	},
    getBatch(val){
    	if(val != null){
	  			this.checkData.batch = formatDate(val,'yyyy-MM');
	  			this.checkData.batch = this.checkData.batch.split('-').join('')
	  		}else{
	  			this.checkData.batch = '';
	  		}
    },
    getSuitObj(val){
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
    #quoteMeasure{
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
	    .redBg{
	    	display: inline-block;
				background: #FF6363;
				color: #fff;
				padding: 2px 0;
				border-radius: 2px;
				width: 100%;
	    }
	    .textOverFlow{
				width: 100%;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
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
