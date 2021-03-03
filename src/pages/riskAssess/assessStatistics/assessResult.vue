<template>
  <div id="assessResult">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风控评估</span></el-breadcrumb-item>
		  <el-breadcrumb-item :class="{wgTxtColor:isShow}"><span class="bread" @click="isShow = false">风控评估结果</span></el-breadcrumb-item>
		  <el-breadcrumb-item v-if="isShow">详情</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys">
    	<div class="titIcon"><em></em><span style="font-weight: 600;">风控评估结果</span></div>
	    <el-form :model="SuitObj" label-position="left" ref="SuitObj" class="demo-ruleForm" size="mini">
	        <el-row>
	            <el-col :span="5" v-if="!isShow">
	               <el-form-item label="评估年份">
							    <el-select v-model="SuitObj.year" collapse-tags multiple placeholder="请选择评估年份">
							    	<el-option v-for="item in yearList" :key="item.index" :label="item" :value="item"></el-option>
							    </el-select>
								</el-form-item>
							</el-col>
							<el-col :span="5" v-if="isShow">
	               <el-form-item label="评估年份">
							    <el-select v-model="SuitObj.year" placeholder="请选择评估年份">
							    	<el-option v-for="item in yearList" :key="item.index" :label="item" :value="item"></el-option>
							    </el-select>
								</el-form-item>
							</el-col>
	        		<el-col :span="5">
								<el-form-item label="评估类型">
									<el-select v-model="assTypeName" placeholder="请选择评估类型">
									   	<el-option :value="assTypeName" style="height: auto;background: #fff;"> 
									   		<el-tree :data="riskAssess.assessType" :props="defaultProps" @node-click="handleNodeClick" style="font-weight: normal;"></el-tree>
									   	</el-option>
									</el-select>
			        	</el-form-item>
	        		</el-col>
	        		<el-col :span="5">
	              <el-form-item label="参与部门">
							    <el-select v-model="SuitObj.depId" placeholder="请选择参与部门">
							    	<el-option v-for="item in department" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
								</el-form-item>
	        		</el-col>
	            <el-col :span="9" style="text-align: right;">
	            	<el-button type="primary" class="saveBtn" @click="query">查询</el-button>
	            	<el-button type="primary" class="saveBtn" @click="exportData" v-if="(isShow&&orgBtnData.indexOf('1_afkpgjge')>=0)||(!isShow&&orgBtnData.indexOf('1_afkpgjgde')>=0)">导出</el-button>
	              <el-button type="primary" class="saveBtn" style="padding:0 6px;" @click="batchExport" v-if="!isShow&&orgBtnData.indexOf('1_afkpgjgp')>=0">批量导出评估表</el-button>
	              <el-button type="primary" class="saveBtn" @click="back" v-if="backShow">返回</el-button>
	            </el-col>
	        </el-row>
	    </el-form>
			<div class="cagy-run" v-if="!isShow">
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
	          <el-table-column  type="index"  label="编号" align="center" > </el-table-column>
	          <el-table-column  prop="name"  label="评估任务名称" align="center"></el-table-column>
	          <el-table-column  prop="createDate" width="160" label="评估期间" align="center">
	          	<template slot-scope="scope">
	          		<span>{{fomatDate(scope.row.assBeginDate,false)}}至{{fomatDate(scope.row.assEndDate,false)}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="depName"  label="部门名称" align="center"></el-table-column>
	          <el-table-column prop="unit" width="160" label="评估表、评估报告截止日期"  align="center"> 
	          	<template slot-scope="scope">
	          		<span>{{fomatDate(scope.row.endDate,true)}}</span>
	          	</template>
	          </el-table-column>
	         	<el-table-column prop="status"  label="评估进度"  align="center">
	         		<template slot-scope="scope">
	         			<span v-if="scope.row.status==0">未评估</span>
	          		<span v-if="scope.row.status==2">已提交评估表</span>
	          		<span v-if="scope.row.status==3">已完成</span>
	          		<span></span>
	         		</template>
	         	</el-table-column>
	         	<el-table-column prop="subPointCount"  label="评估点数量"  align="center"> </el-table-column>
	          <el-table-column prop="hanndle" label="操作" align="center" v-if="orgBtnData.indexOf('1_afkpgjgd')>=0">
	            <template slot-scope="scope">
	              <span class="handleBtn moreBtne" @click="detailResult(scope.$index, scope.row)" style="color: #4285F4;padding:0 5px">详情</span>
	            </template>
	          </el-table-column>
	        </el-table>
      </div>
			<assess-detail v-if="isShow" :tableData="detailData"></assess-detail>
			<el-pagination v-if="isShow" background layout="prev, pager, next" :page-size.sync="pageSize" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
			<file-detail v-if="isShow&&pdfShow" :fileList="fileList"></file-detail>
		</div>
  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getData,fileDownload,fileNameCombine} from 'src/utils/utils.js'
	import assessDetail from 'src/components/riskAssess/assessDetail'
	import fileDetail from 'src/components/riskAssess/fileDetail'
	import qs from 'qs'
  export default {
  	data() {
      return {
      	SuitObj:{
      		year:[new Date().getFullYear()],
      		assType:'1',
      		depId:null
      	},
      	assTypeName:'年度评估',
        department:[],
        tableData:[],
        detailData:[],
        fileList:[],
        isShow:false,
        pdfShow:false,
        backShow:false,
        isOpen:false,
        pageSize:10,
        currentPage:1,
        totalResults:0,
        taskId:'',//当前点击查询详情的id
        isClick:false,//是否在详情页面点击
        listYear:[new Date().getFullYear()],
        defaultProps: {
	  			children: 'children',
	  			value: 'value',
	  			label: 'label'
    		}
			}
   	},
   	methods:{
   		//初始化页面数据
   		async initPage(){
   			this.isClick = false
   			//获取参与部门信息
   			this.department = await getData('/rmAssTask/getGroupDept')
   			if(this.department.length>1){
   				this.department.unshift({code: null, name: "全部"})
   				this.SuitObj.depId='全部'
   			}else{
   				this.SuitObj.depId = this.department[0].code;
   			}
   			this.query();
   		},
   		async query(){
   				var obj = JSON.parse(JSON.stringify(this.SuitObj))
	   			if(this.SuitObj.depId == '全部'){
	   				obj.depId = ''
	   			}
	   			if(this.isShow){
	   				if(obj.year instanceof Array){
	   					obj.year = JSON.stringify(obj.year[0]) 
	   				}
	   				obj.pageNo = this.currentPage
	   				obj.pageSize = 10
	   				let data = await getData('subrep/getrstdetail',qs.stringify(obj))
						if(data){
							this.isClick = true;
							this.fileList = data.files;
							this.detailData = data.data;
							this.totalResults = data.totalResults;
						}
	   			}else{
		   			if(obj.year instanceof Array){
	   					var a = ''
	   					for(var i = 0; i < obj.year.length; i++){
	   						a = a + obj.year[i] + ','
	   					}
	   					a = a.substr(0, a.length - 1);  
	   					obj.year = a;
	   				}
	   				this.tableData = await getData('/rmAssTask/assResult',qs.stringify(obj))
	   			}
   		},
   		//查询详情
   		async detailResult(index,row){
   			this.taskId = row.taskId
				let data = await getData('subrep/getdetail',qs.stringify({id:this.taskId}))
				if(data){
					this.isShow = true;
   				this.backShow = true;
					this.detailData = data.data;
					this.fileList = data.files
					this.listYear = this.SuitObj.year;
					this.SuitObj.year = new Date(parseInt(row.assBeginDate) * 1000).getFullYear()
				}
				
				if(row.status==2||row.status==3){
					this.pdfShow = true
				}else{
					this.pdfShow = false
				}
   		},
   		//分页跳转
   		handleSizeChange (value) {
   			this.currentPage = value
				this.query()
		  },
			handleCurrentChange (value) {
				this.currentPage = value
			 	this.query()
			},
   		//详情返回
   		back(){
   			this.isShow = false;
   			this.backShow = false;
   			this.SuitObj.year = this.listYear;
   		},
   		//导出
   		exportData(){
   			let obj = this.getReqObj()
   			if(this.backShow){//详情导出
   				if(this.isClick){
   					this.axios.post("/subrep/exportriskctrl",qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
							let filename = "风险评估结果详情.xlsx";
							fileDownload(res,filename)
		        })
   				}else{
   					this.axios.post("/subrep/exportriskctrlbyID",qs.stringify({id:this.taskId}),{responseType:'arraybuffer'}).then((res)=>{
							let filename = "风险评估结果详情.xlsx";
							fileDownload(res,filename)
		        })
   				}
   			}else{
   				this.axios.post("/rmAssTask/assRetExport",qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
						let filename = "风险评估结果.xlsx";
						fileDownload(res,filename)
	        })
   			}
   		},
   		//批量导出
   		async batchExport(){
   			let obj = this.getReqObj()
   			let path = "/subrep/downzip?year="+obj.year+"&assType="+obj.assType+"&depId="+obj.depId
   			this.axios.post(path,qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
					let filename = "批量评估表.zip";
					fileDownload(res,filename)
	      })
   		},
   		getReqObj(){
   			var obj = JSON.parse(JSON.stringify(this.SuitObj))
   			if(this.SuitObj.depId == '全部'){
   				obj.depId = ''
   			}
   			if(obj.year instanceof Array){
					var a = ''
					for(var i = 0; i < obj.year.length; i++){
						a = a + obj.year[i] + ','
					}
					a = a.substr(0, a.length - 1);  
					obj.year = a;
				}
   			return obj;
   		},
   		//树形结构选择
			handleNodeClick(data) {
				if(data.value!=-1){
					this.assTypeName = data.label
    			this.SuitObj.assType = data.value
				}
  		}
   	},
   	mounted(){
   		this.initPage();
   	},
   	computed:{
   		...mapState(['riskAssess','orgBtnData']),
   		fomatDate() {
   			return (timestamp,flag)=>{
			    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			    var Y = date.getFullYear() + '-';
			    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
			    var h = date.getHours() + ':';
			    var m = date.getMinutes() + ':';
			    var s = date.getSeconds();
			    if(flag){
			    	return Y + M + D + h + m + s;
			    }else{
			    	return Y + M + D;
			    }
				}	
		},
		yearList(){
            let year = new Date().getFullYear();
            let arr = [];
            for(var i = year;i>=2017;i--){
                arr.push (i);
			}
			return arr;
        }
   	},
   	components:{
   		assessDetail,
   		fileDetail
   	}
	}    
</script>
<style lang="scss">
    #assessResult{
    	.saveBtn{
				min-width: 68px;
				height: 26px;
				line-height: 1px;
				font-size: 12px;
				padding:0 2px;
			}
			.bread:hover{
				cursor: pointer;
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
			.el-pagination{
				text-align: center;
				border: 0;
			}
    }
</style>
