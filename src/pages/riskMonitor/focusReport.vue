<template>
  <div id="indexReport">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor"  v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">集中度呈报</span></div>
    			<!--<v-check @searchData = 'getListData'></v-check>-->
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
		            	<el-button type="primary" @click="searchList(checkData)" class="saveBtn" v-if="btnData.searchbtn">查询</el-button>
		            </el-col>
		        </el-row>
    			</el-form>
    			<div class="oneKey">
    				<el-button type="primary" class="saveBtn" @click="loadTemplate" v-if="btnData.downmodelbtn">下载模板</el-button>
    			</div>
    			<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
		          <el-table-column  type="index" width="180"  label="序号" align="center" > </el-table-column>
		          <el-table-column  prop="name"  label="任务名称" align="center">
			            <template slot-scope="scope">
			              <span :title="scope.row.name" class="textOverFlow">{{ scope.row.name == ''?'-':scope.row.name}}</span>
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
			              <span>{{taskName[scope.row.applayObject]}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
		            <template slot-scope="scope">
		            	<el-upload class="upload-demo" v-if="scope.row.submissionStatus == 0" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload" action="" :http-request="uploadFile">
									  <span class="handleBtn moreBtn" @click="curRowIndex=scope.row.id" style="color: #4285F4 ;padding:0 5px" v-if="btnData.uploadbtn">上传</span>
									</el-upload>
		              <span class="handleBtn moreBtn" v-if="scope.row.submissionStatus == 1&&btnData.downbtn" @click="downFile(scope.$index, scope.row)" style="color: #4285F4 ;text-align: right;">下载</span>
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
	import {getUrlKey,fileDownload,fileNameCombine,formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	data() {
        return {
          panelShow:true,
        	flag:0,
        	totalResults:0,
        	curRowIndex:'',
        	upLoadTrue:false,
        	batch:'',
        	taskName:{},
        	endDatePicker:this.processDate(),
        	tableData4:[],
        	groupName:'',
        	uploadData:{
        		id_0:'1',
        		id_1:'2'
        	},
        	dengmiQueryForm: {
	            wgOrgnize:'',
	            wgName:'',
	            wgFile:''
	        },
          titMsg:"集中度呈报",
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
	        adjustObj:{},
          checkData:{
          	apply:'',
          	batch:'',
          	pageNo:'1',
          	pageSize:'10'
          },
          btnData:{   //按钮显示隐藏
			searchbtn: false,
			uploadbtn: false,
			downbtn: false,
			downmodelbtn: false,
		  },
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
    	})
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ijzdcbq')>=0){//查询
            		this.btnData.searchbtn = true
            	}else{
            		this.btnData.searchbtn = false
            	}
            	if(handleData.indexOf('1_ijzdcbu')>=0){//上传
            		this.btnData.uploadbtn = true
            	}else{
            		this.btnData.uploadbtn = false
            	}
            	if(handleData.indexOf('1_ijzdcbe')>=0){//下载
            		this.btnData.downbtn = true
            	}else{
            		this.btnData.downbtn = false
            	}
            	if(handleData.indexOf('1_ijzdcbd')>=0){//下载模板
            		this.btnData.downmodelbtn = true
            	}else{
            		this.btnData.downmodelbtn = false
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
    		var singleObj = new Object()
    		singleObj.source = row.source;
    		singleObj.name = row.name;
    		singleObj.unit = row.unit;
    		sessionStorage.setItem('singleObj',JSON.stringify(singleObj))
    		this.$router.push({
	        path:'/paramRegulations',   //跳转的路径
	        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				    	editId:row.id    
		        }
				  })
    		
    	},
    	uploadFile(param){
    		var id = this.curRowIndex;
    		var fileObj = param.file;
	    	var form = new FormData();
	    	form.append("file", fileObj);
	    	form.append('id',id);
	    	this.axios.post('concentrate/uploadFile',form).then((res)=>{
    					if(res.code == '200'){
    						this.$alert('上传成功', '提示', {
	               confirmButtonText: '确定',
	               callback:action=>{
	               		this.searchList(this.checkData)
	                }
	              });
    					}else{
    						this.$alert(res.data, '提示', {
	               confirmButtonText: '确定',
	               callback:action=>{
	               		this.searchList(this.checkData)
	                }
	              });
    					}
	    		})
    	},
    	loadTemplate(index,row){
				this.axios.post('tpl/download/300',qs.stringify({}),{responseType:'arraybuffer'}).then((res)=>{
					fileDownload(res, '集中度模板.xlsx');
				})
    	},
    	searchList(data){
    		this.axios.post('concentrate/findConcentrateList',qs.stringify(data)).then((res)=>{
    					if(res.code == '200'){
    						this.tableData4 = [];
    						this.tableData4 = res.data.data;
    						this.totalResults = res.data.totalResults == undefined?0:res.data.totalResults;
    						if(this.checkData.pageNo == "1"){
				    			this.currentPage = 1;
				    		}
    						if(res.data.groupId == '1_009'){
    							this.groupName = '投资集中度模板.xlsx'
    						}else{
    							this.groupName = '再保人集中度模板.xlsx'
    						}
    					}
	    		})
    	},
	    getCommon(){
	    		this.axios.post('indjob/comm',qs.stringify({type:2})).then((res)=>{
	    					if(res.code == '200'){
	    							this.SuitObj.unitsData = this.SuitObj.unitsData.concat(res.data.company)
	    							this.taskName = res.data.codpNames
	    					}
		    		})
	    	},	
	    getSuitObj(val){
	    	this.checkData.pageNo = '1'
	    	this.checkData.apply = val;
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
		  getBatch(val){
		  	this.checkData.pageNo = '1'
	    	if(val != null){
		  			this.checkData.batch = formatDate(val,'yyyy-MM');
		  			this.checkData.batch = this.checkData.batch.split('-').join('')
		  		}else{
		  			this.checkData.batch = '';
		  		}
	    },
	    downFile(index,row){
					var obj = new Object()
					obj.filePath = row.url;
					obj.fileName = row.name;
					this.axios.post('comm/download/300',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
						fileDownload(res, fileNameCombine(row.name,row.url));
					})
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
