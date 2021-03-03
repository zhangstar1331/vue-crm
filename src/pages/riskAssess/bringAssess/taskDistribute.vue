<template>
  <div id="taskDistribute">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风控评估</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor">实施风控评估</el-breadcrumb-item>
		  <el-breadcrumb-item :class="{'wgTxtColor':showDetail}"><span class="bread" @click="goBack">风控评估任务分配</span></el-breadcrumb-item>
		  <el-breadcrumb-item v-if="showDetail" class="textColor1">详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="quoteSys">
    	<div class="titIcon"><em></em><span style="font-weight: 600;">风控评估任务分配</span></div>
	    <el-form label-position="left" class="demo-ruleForm" size="mini" v-if="!showDetail">
	        <el-row>
	            <el-col :span="5">
	               <el-form-item label="评估年份">
							    <el-select class="inputWidth" v-model="year" placeholder="请选择评估年份">
							    	<el-option v-for="item in riskAssess.year" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item label="评估类型">
									<el-select v-model="assTypeName" placeholder="请选择">
									   	<el-option :value="assTypeName" style="height: auto;background: #fff;"> 
									   		<el-tree :data="riskAssess.assessType" :props="defaultProps" @node-click="handleNodeClick" style="font-weight: normal;"></el-tree>
									   	</el-option>
									</el-select>
			        	</el-form-item>
	        		</el-col>
	            <el-col :span="9" style="text-align: right;">
	            	<el-button type="primary" class="saveBtn" @click="query">查询</el-button>
	            	<el-button type="primary" class="saveBtn" @click="fileExport" v-if="orgBtnData.indexOf('1_afkpgrwfpe')>=0">导出</el-button>
	              <el-button type="primary" class="saveBtn" @click="isShow=true" v-if="orgBtnData.indexOf('1_afkpgrwfpa')>=0">新建</el-button>
	              <el-button type="primary" class="saveBtn" @click="pushRisk(1)" v-if="orgBtnData.indexOf('1_afkpgrwfpc')>=0">一键催办</el-button>
	            </el-col>
	        </el-row>
	    </el-form>
	    <el-form v-if="showDetail">
	    	<el-row>
	    		<el-col style="text-align: right;">
	        	<el-button type="primary" class="saveBtn" @click="showDetail=!showDetail">返回</el-button>
	        </el-col>
	    	</el-row>
	    </el-form>
			<div class="cagy-run" v-if="!showDetail">
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
	          <el-table-column  type="index"  label="编号" align="center" > </el-table-column>
	          <el-table-column  prop="name"  label="评估任务名称" align="center"></el-table-column>
	          <el-table-column  prop="" width="160" label="评估期间" align="center">
	          	<template slot-scope="scope">
	          		<span>{{fomatDate(scope.row.assBeginDate,false)}}至{{fomatDate(scope.row.assEndDate,false)}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="depName"  label="部门名称" align="center"></el-table-column>
	          <el-table-column prop="status"  label="评估进度"  align="center"> 
	          	<template slot-scope="scope">
	          		<span v-if="scope.row.status==0">未评估</span>
	          		<span v-if="scope.row.status==2">已提交评估表</span>
	          		<span v-if="scope.row.status==3">已完成</span>
	          		<span></span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="endDate" width="160" label="评估表、评估报告截止日期"  align="center"> 
	          	<template slot-scope="scope">
	          		<span>{{fomatDate(scope.row.endDate,19)}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="submitDate" width="160" label="评估完成日期"  align="center"> 
	          	<template slot-scope="scope">
	          		<span v-if="scope.row.submitDate">{{fomatDate(scope.row.submitDate,true)}}</span>
	          	</template>
	          </el-table-column>
	          <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
	            <template slot-scope="scope">
	              <span class="handleBtn moreBtn" v-if="orgBtnData.indexOf('1_afkpgrwfpd')>=0" @click="detailRisk(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px">详情 </span>
	              <span class="handleBtn moreBtne" v-if="scope.row.status==3&&orgBtnData.indexOf('1_afkpgrwfpb')>=0" @click="sendBackRisk(scope.$index, scope.row)" style="color: red;padding:0 5px">退回</span>
	              <span class="handleBtn moreBtn" v-if="scope.row.status==1&&orgBtnData.indexOf('1_afkpgrwfpp')>=0" @click="defendRisk(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px">维护 </span>
	              <span class="handleBtn moreBtne" v-if="scope.row.status==1&&orgBtnData.indexOf('1_afkpgrwfps')>=0" @click="deleteRisk(scope.$index, scope.row)" style="color: red;padding:0 5px">删除</span>
	              <span class="handleBtn moreBtn" v-if="(scope.row.status==0||scope.row.status==2)&&orgBtnData.indexOf('1_afkpgrwfpc')>=0" @click="pushRisk(2, scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px">催办 </span>
	              <span class="handleBtn moreBtne" v-if="scope.row.status==0&&orgBtnData.indexOf('1_afkpgrwfpr')>=0" @click="withdrawRisk(scope.$index, scope.row)" style="color: red;padding:0 5px">撤回</span>
	            </template>
	          </el-table-column>
	        </el-table>
      </div>
      <assess-detail v-if="showDetail" :tableData="detailData" @closeBack="getMsgDetail"></assess-detail>
			<file-detail v-if="showDetail" :fileList="fileList"></file-detail>
		</div>
		<add-task v-if="isShow" :defendData="defendData" @closeMask="getMsgFormSon"></add-task>
  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getData,fileDownload,fomatTime} from 'src/utils/utils.js'
	import addTask from 'src/components/riskAssess/addTask'
	import assessDetail from 'src/components/riskAssess/assessDetail'
	import fileDetail from 'src/components/riskAssess/fileDetail'
	import qs from 'qs'
  export default {
  	data() {
      return {
      	isShow:false,
      	showDetail:false,
      	SuitObj:{
      		department:'',
      		processName:''
      	},
      	itemId:'',
      	year:new Date().toJSON().substr(0, 4).replace('T', ' '),
      	assType:'1',
      	assTypeName:'年度评估',
        tableData:[],
        detailData:[],
        defendData:'', //新建、维护共用页面，用于识别
        defaultProps: {
	  			children: 'children',
	  			value: 'value',
	  			label: 'label'
    		},
    		fileList:[]
			}
   	},
   	methods:{
   		getMsgFormSon(data){
   			this.defendData = ''
				this.isShow = false;
   			if(data.status==1){//做了保存或维护操作,调用查询接口
   				this.query()
   			}
			},
			getMsgDetail(){
				this.showDetail = false;
			},
			//树形结构选择
			handleNodeClick(data) {
				if(data.value!=-1){
					this.assTypeName = data.label
    			this.assType = data.value
				}
  		},
			//查询
			async query(){
				this.tableData = await getData('/rmAssTask/getAssTask',qs.stringify({year:this.year,assType:this.assType[this.assType.length-1]}))
			},
			//导出
			fileExport(){
				this.axios.post('/rmAssTask/getAssTaskExport',qs.stringify({year:this.year,assType:this.assType[this.assType.length-1]}),{responseType:'arraybuffer'}).then((res)=>{
          let filename = "风控评估任务.xlsx";
					fileDownload(res,filename)
        })
			},
			//一键催办
			pushRisk(type,index,row){
				// 把写的提示信心需要换行的地方分成数组 confirmText
				const confirmText = ['催办成功！',  '未完成风控评估的部门将在待办任务中收到催办提示。'] 
        const newDatas = []
        const h = this.$createElement
        for (const i in confirmText) {
          newDatas.push(h('p', null, confirmText[i]))
        }
        this.$confirm(
          '提示',
          {
            message: h('div', null, newDatas),
            showCancelButton: false,
            confirmButtonText: '确定',
            type: 'warning'
          }
        ).then(() => {
        	if(type==1){
        		getData('/rmAssTask/assTaskRemind',qs.stringify({taskId:null,taskName:null,deptId:null,endDate:null,sign:2})).then((res)=>{
        			this.$alert('操作成功');
        		})
        	}else{
        		getData('/rmAssTask/assTaskRemind',qs.stringify({taskId:row.taskId,taskName:row.name,deptId:row.depId,endDate:row.endDate,sign:1})).then((res)=>{
        			this.$alert('操作成功');
        		})
        	}
        })
			},
			//详情
			async detailRisk(index,row){
				let data = await getData('/subrep/getdetail',qs.stringify({id:row.taskId}))
				if(data){
					this.showDetail = true;
					this.detailData = data.data;
					this.fileList = data.files;
				}
			},
			//退回
			sendBackRisk(index,data){
				this.$prompt('请输入退回原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '返回',
        }).then(({ value }) => {
          let param = {
          	taskId:data.taskId,//任务单id
						operStatus:'2',  //操作状态
						cause:value,       //原因(退回有原因)
          	taskName:data.name,
          	deptId:data.depId
          }
         	getData('/rmAssTask/recallAssTask',qs.stringify(param)).then((data)=>{
         		if(data==null){
	         		this.query()
	         	}
         	})	
        })
     },
     //撤回
     withdrawRisk(index,data){
     	// 把写的提示信心需要换行的地方分成数组 confirmText
			const confirmText = ['确认撤回该风控评估任务吗？',  '呈报部门将收到任务撤回提示，呈报任务列表中将删除该任务。'] 
	    const newDatas = []
	    const h = this.$createElement
	    for (const i in confirmText) {
	      newDatas.push(h('p', null, confirmText[i]))
	    }
	    this.$confirm(
	      '提示',
	      {
	        message: h('div', null, newDatas),
	        showCancelButton: true,
	        confirmButtonText: '确定',
	        cancelButtonText: '返回',
	        type: 'warning'
	      }
	    ).then(() => {
	      let param = {
	      	taskId:data.taskId,//任务单id
						operStatus:'1',  //操作状态
						cause:''       
	      }
	     	getData('/rmAssTask/recallAssTask',qs.stringify(param)).then((data)=>{
	     		if(data==null){
	         		this.query()
	         	}
	     	})
	    })
     },
     goBack(){
     		this.showDetail = false
     },
     //删除
     deleteRisk(index,data){
     		this.$confirm('确认删除该风控评估任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
         	getData('/rmAssTask/deleteAssTask',qs.stringify({taskId:data.taskId})).then((data)=>{
         		if(data==null){
	         		this.query()
	         	}
         	})	
        })	
     },
     //获取维护信息
     defendRisk(index,data){
    	getData('/rmAssTask/getAssTaskInfo',qs.stringify({taskId:data.taskId})).then((data)=>{
    		this.defendData = data
    		this.isShow = true
    	})
     },
     addZero(m) {
    	return m < 10 ? '0' + m : m;
		 }
   	},
   	computed:{
   		...mapState(['riskAssess','orgBtnData']),
   		fomatDate() {
   			return (timestamp,flag)=>{
   				timestamp = parseInt(timestamp) * 1000
			    if (timestamp) {
		        var time = new Date(timestamp);
		        var y = time.getFullYear();
		        var M = time.getMonth() + 1;
		        var d = time.getDate();
		        var h = time.getHours();
		        var m = time.getMinutes();
		        var s = time.getSeconds();
		        if(flag){
		        	return y + '-' + this.addZero(M) + '-' + this.addZero(d) + ' ' + this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s);
		        }else{
		        	return y + '-' + this.addZero(M) + '-' + this.addZero(d);
		        }
		      } else {	
		          return '';	
		      }
				}		
    	} 
   	},
   	mounted(){
   		this.query()
   	},
   	components:{
   		addTask,
   		assessDetail,
   		fileDetail
   	}
	}    
</script>
<style lang="scss">
    #taskDistribute{
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
			.inputWidth{
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
	    .handleBtn{
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
    }
</style>
