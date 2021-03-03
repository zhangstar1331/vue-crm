<template>
  	<div id="risyQuoteShet">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor">风险提示</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">风险提示单</span></div>
    		<el-form :model="perForm" label-position="left" ref="perForm" size="mini" :inline="true">
	            <el-row>
                    <el-form-item label="报送批次">
						<el-date-picker v-model="batchTime" @change="getBatch" type="month" placeholder="报送批次" :picker-options="endDatePicker"> </el-date-picker>
					</el-form-item>
					<el-button type="primary" @click="goSearch" class="saveBtn">查询</el-button>
	            </el-row>
	        </el-form>
	        <div class="oneKey">
	        	<el-button type="primary" class="saveBtn" @click="goAdd" v-if="btnData.addbtn">新增</el-button>
				<el-button type="primary" class="saveBtn" @click="callDeals">一键催办</el-button>
			</div>
    		<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:10px">
		           	<el-table-column prop="id" label="编号" align="center" width="120">
		           		<template slot-scope="scope">
			              <span>{{scope.row.id}}</span>
			            </template>
		           	</el-table-column>
		            <el-table-column prop="warnName" label="风险提示单名称" align="center" width="240">
		            	<template slot-scope="scope">
		                    <span :title="scope.row.warnName" class="textOverFlow">{{scope.row.warnName == null?'--':scope.row.warnName}}</span>
		                </template>
		            </el-table-column>
		            <el-table-column prop="createDate" label="提出日期" align="center" width="120">
		            </el-table-column>
		            <el-table-column prop="cUserName" label="创建人" align="center" width="120">
		            	<template slot-scope="scope">
			              <span>{{scope.row.cUserName == null?'--':scope.row.cUserName}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="isReport" label="是否需要反馈报告" align="center" width="150">
		            	<template slot-scope="scope">
			              <span>{{scope.row.isReport == '1'?'需反馈':'不需反馈'}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="dealEndDateTime" label="处理截止日期" align="center" width="120"> </el-table-column>
		            <el-table-column prop="dealDepartName" label="处理部门" align="center" width="150">
		            	<template slot-scope="scope">
			              <span :title="scope.row.dealDepartName" class="textOverFlow">{{scope.row.dealDepartName == null?'--':scope.row.dealDepartName}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="dealUsetName" label="处理人" align="center" width="">
		            	<template slot-scope="scope">
			              <span>{{scope.row.dealUsetName == null?'--':scope.row.dealUsetName}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="dealStatus,isReport" label="处理状态" align="center" width="">
		            	<template slot-scope="scope">
			              <span v-if="scope.row.isReport == 1">{{scope.row.dealStatus == '1'?'未处理':'已处理'}}</span>
			              <span v-else>--</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="hanndle" label="操作" align="center" width="300">
		              	<template slot-scope="scope">
		                	<span class="handleBtn detailBtn" v-if="scope.row.dealStatus == 1 && scope.row.isReport == 1 && scope.row.recallStatus == 0 && btnData.dealbtn" @click="callDeal(scope.$index, scope.row)" style="color: #4285F4;">催办</span>
		                	<span class="handleBtn detailBtn" v-if="(scope.row.dealStatus == 1 || scope.row.dealStatus == 0) && scope.row.isReport == 1 && btnData.reBackbtn" @click="reBack(scope.$index, scope.row)" style="color: #4285F4;">撤回</span>
		                	<span class="handleBtn detailBtn" v-if="scope.row.dealStatus == 2 && scope.row.isReport == 1 && btnData.reBacksbtn" @click="reBacks(scope.$index, scope.row)" style="color: #4285F4;">退回</span>
		                	<span class="handleBtn detailBtn" v-if="(scope.row.dealStatus == 1 || scope.row.dealStatus == 0) && scope.row.isReport == 1 && btnData.editbtn" @click="editSheet(scope.$index, scope.row)" style="color: #4285F4;">维护</span>
		                	<span class="handleBtn detailBtn" v-if="(scope.row.dealStatus == 1 || scope.row.dealStatus == 0) && scope.row.isReport == 1 && btnData.deletebtn" @click="deleteSheet(scope.$index, scope.row)" style="color: #4285F4;">删除</span>
		                	<span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
		              	</template>
		            </el-table-column>
		        </el-table>
		        <el-dialog title="请输入退回原因" :visible.sync="centerDialogVisible" @close='closeDialog' :append-to-body="true" width="30%" left>
				  <el-form ref="addForm" style="margin-right: 20px;" label-position="right" label-width="110px">
		            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addForm" ></el-input>
		          </el-form>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="centerDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
				  </span>
				</el-dialog>
	      </div>
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
        	titMsg:"风险提示单",
        	perForm:{
        		quoteName:''
        	},
        	addForm:null,
        	centerDialogVisible: false,
    		totalResults:0,
    		tableData4:[],
          	batchTime:'',
          	batch:'',
          	rebackData:{},
          	endDatePicker:this.processDate(),
          	checkData:{//查询数据
          		subBatch:null,
	            pageNo:'1',
	            pageSize:'10'
          	},
          	btnData:{   //按钮显示隐藏
  				addbtn: false,
  				dealbtn: false,
  				reBackbtn: false,
  				reBacksbtn: false,
  				editbtn: false,
  				deletebtn: false,
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
    created(){
    	// 获取列表数据
    	this.searchData(this.checkData)
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ifxzbyjda')>=0){//新增
            		this.btnData.addbtn = true
            	}else{
            		this.btnData.addbtn = false
            	}
            	if(handleData.indexOf('1_ifxzbyjdc')>=0){//催办
            		this.btnData.dealbtn = true
            	}else{
            		this.btnData.dealbtn = false
            	}
            	if(handleData.indexOf('1_ifxzbyjdr')>=0){//撤回
            		this.btnData.reBackbtn = true
            	}else{
            		this.btnData.reBackbtn = false
            	}
            	if(handleData.indexOf('1_ifxzbyjdb')>=0){//退回
            		this.btnData.reBacksbtn = true
            	}else{
            		this.btnData.reBacksbtn = false
            	}
            	if(handleData.indexOf('1_ifxzbyjdp')>=0){//维护
            		this.btnData.editbtn = true
            	}else{
            		this.btnData.editbtn = false
            	}
            	if(handleData.indexOf('1_ifxzbyjdd')>=0){//删除
            		this.btnData.deletebtn = true
            	}else{
            		this.btnData.deletebtn = false
            	}
            	if(handleData.indexOf('1_ifxzbyjdq')>=0){//查看详情
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            }
	    },
    	// 获取指标名称
      	getQuoteName(val){
			this.checkData.name = val
      	},
    	// 查询列表数据
    	searchData(data){
      		 this.axios.post('rmIndWarn/indWarnList',qs.stringify(data)).then((res)=>{
      		 	if(res.code == '200'){
      		 		if(res.data.dataList != null){
      		 			for (var i = 0; i < res.data.dataList.length; i++) {
      		 				if(res.data.dataList[i].createDate != undefined){
      		 					res.data.dataList[i].createDate = formatDate(new Date(parseInt(res.data.dataList[i].createDate)*1000),'yyyy-MM-dd')
      		 				}else{
      		 					res.data.dataList[i].createDate = '--'
      		 				}
      		 				if(res.data.dataList[i].dealEndDate != undefined){
      		 					res.data.dataList[i].dealEndDateTime = formatDate(new Date(parseInt(res.data.dataList[i].dealEndDate)*1000),'yyyy-MM-dd')
      		 				}else{
      		 					res.data.dataList[i].dealEndDateTime = '--'
      		 				}
      		 			}
      		 		}
	         		this.tableData4 = res.data.dataList==null?[]:res.data.dataList;
	         		this.totalResults = res.data.dataList == null?0:res.data.totalResults;
	         		this.checkData.batch = res.data.subBatch;
	         		let strBatch = res.data.subBatch.toString().substring(0,4)+'-'+res.data.subBatch.toString().substring(4);
	         		this.batch = res.data.subBatch
	         		this.batchTime = strBatch;
           		} else {
           			this.$alert(res.message, '提示', {
			         	confirmButtonText: '确定'
			         });
           		}
      		 })
	    },
	    // 搜索按钮
	    goSearch(){
			this.checkData.pageNo = 1
			this.currentPage = 1
			this.searchData(this.checkData)
		},
		getBatch(val){
    	if(val != null){
	  			this.checkData.subBatch = formatDate(val,'yyyy-MM');
	  			this.checkData.subBatch = this.checkData.subBatch.split('-').join('')
	  			this.batch = this.checkData.subBatch.split('-').join('');
	  		}else{
	  			this.checkData.batchTime = null;
	  		}
    	},
		// 详情
    	goDetail(index,row){
    		this.$router.push({
		        path:'/quoteWarnDetail',   //跳转的路径
		        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					warnId:row.id,
					listType:'1' //listType:1 代表是从风险提示单过去的 2代表整改措施列表过去的
			    }
			})
    	},
    	callDeal(index,row){
    		this.axios.post('rmIndWarn/indWarnTaskRemind',qs.stringify({taskId:row.id,taskName:row.warnName,deptId:row.dealDepartId,endDate:row.dealEndDate,sign:1})).then((res)=>{
      		 	if(res.code == '200'){
      		 		this.$alert('操作成功', '提示', {
				          confirmButtonText: '确定'
				        });
           		}else {
           			this.$alert(res.message, '提示', {
			         	confirmButtonText: '确定'
			         });
           		}
      		 })
    	},
    	callDeals(){
    		this.axios.post('rmIndWarn/indWarnTaskRemind',qs.stringify({taskId:null,deptId:null,taskName:null,sign:2,endDate:this.batch})).then((res)=>{
      		 	if(res.code == '200'){
      		 		this.$alert('操作成功', '提示', {
				          confirmButtonText: '确定'
				        });
           		}else {
           			this.$alert(res.message, '提示', {
			         	confirmButtonText: '确定'
			         });
           		}
      		 })
    	},
    	closeDialog(){
    		this.rebackData.cause = this.addForm
    		if(this.rebackData.cause == null){
    			this.$alert('请输入退回原因', '提示', {
		         	confirmButtonText: '确定'
		         });
		        return;
    		}
    		this.axios.post('rmIndWarn/recallIndWarn',qs.stringify(this.rebackData)).then((res)=>{
      		 	if(res.code == '200'){
      		 		this.$alert('风险提示单退回成功，处理人将在OA系统待办中收到提示。', '退回成功', {
				          confirmButtonText: '确定',
				          callback: action => {
				          	this.searchData(this.checkData)
				          }
				        });
           		} else {
           			this.$alert(res.message, '提示', {
			         	confirmButtonText: '确定'
			         });
           		}
      		 })
    	},
    	reBack(index,row){
    		this.$confirm('', '您确定撤回风险提示单吗？', {
	              confirmButtonText: '确定',
	              cancelButtonText: '取消',
	              type: 'warning'
	            }).then(_ => {
	          	this.axios.post('rmIndWarn/recallIndWarn',qs.stringify({warnId:row.id,operStatus:'1'})).then((res)=>{
	      		 	if(res.code == '200'){
	      		 		this.$alert('撤回成功', {
					          confirmButtonText: '确定',
					          callback: action => {
					          	this.searchData(this.checkData)
					          }
					        });
	           		} else {
	           			this.$alert(res.message, '提示', {
				         	confirmButtonText: '确定'
				         });
	           		}
	      		 })
	          }).catch(_ => {});
    	},
    	reBacks(index,row){
    		this.centerDialogVisible = true
    		this.rebackData.warnId = row.id
    		this.rebackData.operStatus = '2'
    		this.rebackData.taskName = row.warnName
    		this.rebackData.deptId = row.dealDepartId
    	},
    	editSheet(index,row){
    		if(row.recallStatus == '0'){
    			this.$alert('风险提示单撤回前不允许维护。如需维护风险提示单，请先撤回风险提示单任务！', '警告！', {
		          confirmButtonText: '确定'
		        });
		        return;
    		}
			this.$router.push({
				path:'/buildWarnSheet',
				query:{
					'id':row.id,
					'batch':this.batch
				}
			})
    	},
    	deleteSheet(index,row){
    		if(row.recallStatus == '0'){
    			this.$alert('风险提示单撤回前不允许维护。如需维护风险提示单，请先撤回风险提示单任务！', '警告！', {
		          confirmButtonText: '确定'
		        });
		        return;
    		}
    		this.$confirm('', '您确定删除风险提示单吗？', {
	              confirmButtonText: '确定',
	              cancelButtonText: '取消',
	              type: 'warning'
	            }).then(_ => {
	          	this.axios.post('rmIndWarn/delteIndWarn',qs.stringify({warnId:row.id})).then((res)=>{
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
					        });
			        	}
					})
	          }).catch(_ => {});
    	},
	    handleSizeChange (value) {
	        this.checkData.pageNo = value;
	        this.searchData(this.checkData)
	    },
		handleCurrentChange (value) {
		    this.checkData.pageNo = value;
		    this.searchData(this.checkData)
		},
		goAdd(){
			this.$router.push({
				path:'/buildWarnSheet',
				query:{
					'batch':this.batch
				}
			})
		},
		processDate(){
	        return {
	          disabledDate(time){
	            return time.getTime() > Date.now()
	          }
	        }
	      }
  	}
}    
</script>
<style lang="scss">
    #risyQuoteShet{
    	.el-form-item--mini.el-form-item{
			width: auto!important;
			margin-right:18px
		}
		.el-input--mini .el-input__icon{
			line-height:32px
		}
    	.el-input-group__append{
			background: #4285F4;
		    width: 20%;
		    text-align: center;
		    font-size: 16px;
		    color: #fff;
		}
		.el-table__body, .el-table__footer, .el-table__header{
			border-collapse: collapse
		}
		.oneKey{
	    	text-align: right;
	    	height: 50px;
	    	line-height: 50px;
	    }
    	.saveBtn{
			width: 68px;
			height: 26px;
			line-height: 1px;
			padding: 0;
			margin-top:3px;
			font-size: 12px;
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
    		width: 100%!important;
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
		.el-input .el-input__inner{
			height:32px;
			line-height:32px;
		}
		.el-form-item__label{
			line-height:32px;
			padding:0 12px 0 0
		}
		.redBg{
			display: inline-block;
			background: #FF6363;
			color: #fff;
			padding: 0 10px;
			border-radius: 2px;
		}
    }
</style>
