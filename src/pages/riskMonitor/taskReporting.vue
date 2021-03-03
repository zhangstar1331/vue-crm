<template>
  <el-container id="taskReport">
  <el-header class="header" style="padding-left:218px">
  	<el-row>
	  	<el-col :span="12">
		  	<el-breadcrumb separator-class="el-icon-arrow-right">
				  <el-breadcrumb-item><span class="textColor1">风险监测指标管理</span></el-breadcrumb-item>
				  <el-breadcrumb-item :to="{path:'/riskMonitor/indexReporting?id=1_izbcb'}"><span class="textColor1">指标呈报</span></el-breadcrumb-item>
				  <el-breadcrumb-item><span class="textColor">{{msg}}</span></el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
			<el-col :span="9">
				<el-button type="primary" class="btnCss" size="mini" @click="back">返回</el-button>
				<el-button type="primary" class="btnCss" @click="saveAll" size="mini">保存</el-button>
		  	<el-button type="primary" class="btnCss" @click="submitAll" size="mini">提交</el-button>
		  </el-col>
	  </el-row>
  </el-header>
  <div class="box" v-if="oneTask">
			<div class="titIcon fontWeight"><em></em><span>任务基础信息</span></div>
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
				  		<span>任务时效：</span><span>{{baseInfo.aging}}</span>
				  	</div>
				  	<div class="itemDiv"> 
				  		<span>报送部门：</span><span>{{baseInfo.monitorDepartment}}</span>
				  	</div>
				  </el-col>
				  <el-col :span="8">
				  	<div class="itemDiv alingLeft">
				  		<span>报送批次：</span><span>{{baseInfo.batch}}</span>
				  	</div>
				  	<div class="itemDiv alingLeft">
				  		<span>呈报人：</span><span>{{baseInfo.reportMan}}</span>
				  	</div>
				  </el-col>
				</el-row>
			</div>
	</div>
	<div class="contList">
		<div class="titIcon fontWeight"><em></em><span>{{taskName}}</span></div>
		<div class="btn" style="text-align: right;" v-if="moreTask">
    	<el-upload class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload" action="" :http-request="uploadFile">
			  <el-button type="primary" class="btns" size="mini">导入数据</el-button>
			</el-upload>
			<el-button type="primary" class="btns" size="mini" @click="downTemplate" style="margin-right: 10px;">下载模板</el-button>
		</div>
		<el-table :data="tableData" border height="380" style="width: 100%;background: #F9F9F9!important;margin-top:2%;border: 1px solid #E9E9E9;">
	    <el-table-column fixed align="center" prop="serialNumber" label="指标编号" width="150"></el-table-column>
	    <el-table-column fixed align="center" prop="name" label="指标名称" width="150"> </el-table-column>
	    <el-table-column align="left" prop="indicatorParam,paramId" label="指标参数" width="220">
	    		<template slot-scope="scope">
	    			<el-tooltip class="item" placement="top" :content="scope.row.paramName" :disabled="scope.row.paramId == null || scope.row.status == 1">
	    				<div>
	    					<el-input :type="inputType" v-model = 'scope.row.indicatorParam' :disabled="scope.row.paramId == null || scope.row.status == 1" @change="getInput(scope.row.indicatorParam,scope.$index)" @input="getInputType(scope.row.paramDataUnit)" class="paramIpt" :placeholder="scope.row.paramName == null? '请输入参数' : scope.row.paramName"></el-input><span v-if="scope.row.paramDataUnit == 1"> %</span><span v-if="scope.row.paramDataUnit == 2"> 次/季</span><span v-if="scope.row.paramDataUnit == null" style="color: transparent;"> &</span><span v-if="scope.row.paramDataUnit == 4"> 年</span><span v-if="scope.row.paramDataUnit == 5"> 元</span><span v-if="scope.row.paramDataUnit == 6"> 次/月</span><span v-if="scope.row.paramDataUnit == 7"> 件/月</span><span v-if="scope.row.paramDataUnit == 8"> 件/季</span><span v-if="scope.row.paramDataUnit == 10"> 次/年</span><span v-if="scope.row.paramDataUnit == 11"> 件/年</span><span v-if="scope.row.paramDataUnit == 12"> PT</span>
	    				</div>
	    			</el-tooltip>
			    </template>
	    </el-table-column>
	    <el-table-column align="left" prop="subIndicator" label="指标值" width="220">
	    		<template slot-scope="scope">
	    			<div v-if="scope.row.subIndicator != null" v-for="item,index in scope.row.subIndicator" :class="{'marginCss':scope.row.subIndicator.length>1}">
	    				<el-input v-if="scope.row.dataType == 1" type="number" v-model="scope.row.subIndicator[index].value" :disabled="scope.row.status == 1" @change="getInput1(scope.$index,scope.row,index)" class="paramIpt1" :placeholder="scope.row.subIndicator[index].name"></el-input><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 3" style="color:transparent;">&</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 1"> %</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 2"> 次/季</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 4"> 年</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 5"> 元</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 6"> 次/月</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 7"> 件/月</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 8"> 件/季</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 10"> 次/年</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 11"> 件/年</span><span v-if="scope.row.dataType == 1 && scope.row.dataUnit == 12"> PT</span>
	    			</div>
	    			<div v-for="item,index in scope.row.subIndicator" style="width: 75%;">
	    				<el-select v-if="scope.row.dataType == 2" v-model="scope.row.subIndicator[0].value" :disabled="scope.row.status == 1" placeholder="请选择"> <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
	    			</div>
			    </template>
	    </el-table-column>
	    <el-table-column align="center" prop="cause" label="原因分析" width="300">
	    		<template slot-scope="scope">
			      <textarea class="reason" v-model="scope.row.cause" :disabled="scope.row.status == 1" :class="{'disabledCss':scope.row.status == 1}" placeholder="请输入原因分析" style="width: 100%;border:1px solid #E9E9E9;color:#515151;height:50px;line-height:18px;resize: none;"></textarea>
			    </template>
	    </el-table-column>
	    <el-table-column align="center" prop="measure" label="改善措施" width="300">
	    		<template slot-scope="scope">
			      <textarea v-model="scope.row.measure" class="reason" :disabled="scope.row.status == 1" :class="{'disabledCss':scope.row.status == 1}" placeholder="请输入改善措施" style="width: 100%;height:50px;color:#515151;border:1px solid #E9E9E9;line-height:18px;resize: none;"></textarea>
			    </template>
	    </el-table-column>
	    <el-table-column align="center" prop="blue" label="蓝" width="250"> 
	    		<template slot-scope="scope">
	    				<span :class="{'blueBg':scope.row.ryb == 3}">{{scope.row.blue == null? '--' : scope.row.blue}}</span>
			    </template>
	    </el-table-column>
	    <el-table-column align="center" prop="yellow" label="黄" width="250"> 
	    		<template slot-scope="scope">
	    				<span :class="{'yellowBg':scope.row.ryb==2}">{{scope.row.yellow == null? '--' : scope.row.yellow}}</span>
			    </template>
	    </el-table-column>
	    <el-table-column align="center" prop="red" label="红" width="250"> 
	    		<template slot-scope="scope">
	    				<span :class="{'redBg':scope.row.ryb == 1}">{{scope.row.red == null? '--' : scope.row.red}}</span>
			    </template>
	    </el-table-column>
	    <el-table-column align="center" prop="date" label="报送频率" width="100"> 
	    		<template slot-scope="scope" v-if="taskName">
	          <span>{{frequency[scope.row.frequency]}}</span>
	        </template>
	    </el-table-column>
	    <el-table-column align="center" prop="batch" label="报送批次" width="150">
	    </el-table-column>
	    <el-table-column align="center" prop="aging" label="报送时效" width="150"> </el-table-column>
  </el-table>
	</div>
  </el-container>
</template>
<script>
	import qs from 'qs'
	import {mapState,mapActions} from 'vuex'
  export default {
  	data() {
        return {
        	saveAllData:{},
        	msg:'填报指标',
        	moreTask:false,
        	oneTask:true,
        	taskName:'任务指标',
        	baseInfo:{},
        	frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度',
	        	'4':'半年度',
	        },
        	options: [{
	  			name: 'AAA',
	  			id: '1'
	  		}, {
	  			name: 'AA',
	  			id: '2'
	  		}, {
	  			name: 'A',
	  			id: '3'
	  		}, {
	  			name: 'BBB',
	  			id: '4'
	  		}, {
	  			name: 'BB',
	  			id: '5'
	  		}, {
	  			name: 'B',
	  			id: '6'
	  		}, {
	  			name: 'CCC',
	  			id: '7'
	  		}, {
	  			name: 'CC',
	  			id: '8'
	  		}, {
	  			name: 'C',
	  			id: '9'
	  		}, {
	  			name: 'D',
	  			id: '10'
	  		},{
	  			name: '空',
	  			id: '0'
	  		}],
			askArr:[],
        	tableData:[],
        	inputType:'text'
		}
   },
    computed:{
    	...mapState(['indicatorArr'])
    },
    created(){
    	if(this.$route.query.pl){
    			this.oneTask = false;
    			this.moreTask = true;
    			this.taskName = '批量呈报'
    			this.getInfo('batchsubmitlist','')
    	}else{
    		this.getInfo('submitdetail',qs.stringify({submitId:this.$route.query.taskId}))
    	}
    	// this.options = this.indicatorArr.threshold.value
    },
    methods:{
    		getInput(index,row){
//					console.log(this.tableData)
    		},
    		getInputType(unit){
    			if(unit!==null){
    				this.inputType = 'number'
    			} else{
    				this.inputType = 'text'
    			}
    		},
    		getInput1(index,row,num){
    			if(row.flag == '1'&&row.subIndicator[num].value>0){
    				this.$message('指标值>0，应填写原因分析和改善措施');
    			}
    		},
    		getInfo(param,taskId){
    			this.axios.post('indjob/'+param,taskId).then((res)=>{
    					if(res.code == '200'){
    						//单个任务指标数据
    							if(param == 'submitdetail'){
    								var taskData = JSON.parse(sessionStorage.getItem('taskName'));
	    							this.$set(this.baseInfo,'aging',res.data.aging)
	    							this.$set(this.baseInfo,'applayObject',taskData[res.data.applayObject])
	    							this.$set(this.baseInfo,'batch',res.data.batch)
	    							this.$set(this.baseInfo,'monitorDepartment',taskData[res.data.monitorDepartment])
	    							this.$set(this.baseInfo,'reportMan',res.data.reportMan)
	    							for (var i = 0; i < res.data.indicator.length; i++) {
	    								if(res.data.indicator[i].subIndicator == null){
		    								res.data.indicator[i].subIndicator = [{
		    									id:'null',
		    									name:res.data.indicator[i].indicatorParam,
		    									value:res.data.indicator[i].value
		    								}]
		    							}
	    							}
	    							this.tableData = res.data.indicator
    							}else{
    								//批量指标数据
    								for (var i = 0; i < res.data.data.length; i++) {
	    								if(res.data.data[i].subIndicator == null){
		    								res.data.data[i].subIndicator = [{
		    									id:'null',
		    									name:res.data.data[i].indicatorParam,
		    									value:res.data.data[i].value == undefined?'':res.data.data[i].value
		    								}]
		    							}
	    							}
	    							this.tableData = res.data.data
    							}
    					}else{
    						this.$alert(res.data, '提示', {
                  	confirmButtonText: '确定'
                });
    					}
	    		})
    			//批量指标呈报
    		},
    		saveAll(){
    			if(!this.$route.query.pl){
	    			this.handleData()
    			}else{
    				this.plHandleData()
    			}
    			this.axios.post('indjob/submitsave',JSON.stringify(this.askArr),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	    					if(res.code == '200'){
										this.$alert("保存成功", '提示', {
		                  confirmButtonText: '确定',
		                  callback:action=>{
		                  	if(!this.$route.query.pl){
		                  		this.getInfo('submitdetail',qs.stringify({submitId:this.$route.query.taskId}))
		                  		return;
		                  	}
		                  		this.getInfo('batchsubmitlist','')
		                   }
		                });	    							
	    					}
		    		})
    		},
        submitAll(){
        	if(!this.$route.query.pl){
	    			this.handleData()
    			}else{
    				this.plHandleData()
    			}
        	this.axios.post('indjob/submit',JSON.stringify(this.askArr),{headers:{'Content-Type':'application/json'}}).then((res)=>{
    					if(res.code == '200'){
									this.$alert("提交成功", '提示', {
		                  confirmButtonText: '确定',
		                  callback:action=>{
		                  	if(res.data == false){
		                  		this.$alert('请完善任务指标的信息填写。','提示',{confirmButtonText: '确定',callback:action=>{
		                  			if(!this.$route.query.pl){
				                  		this.getInfo('submitdetail',qs.stringify({submitId:this.$route.query.taskId}))
				                  		return;
				                  	}
				                  		this.getInfo('batchsubmitlist','')
		                  		}})
		                  		return;
		                  	}
		                  	this.$router.push({
									        path:'/riskMonitor/indexReporting',   //跳转的路径
									        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
												    	 id:'1_izbcb'  
										        }
												  })
		                   }
		                });					
    					}
	    		})
        },
       	handleData(){
       		var taskData = JSON.parse(sessionStorage.getItem('taskName'));
       		this.askArr = [];
       		var obj = new Object();
        	var obj2 = new Object();
        	obj.id = this.$route.query.taskId*1;
        	obj.applayObject = this.findKey(taskData,this.baseInfo.applayObject);
        	obj.batch = this.baseInfo.batch;
        	for (var i = 0; i < this.tableData.length; i++) {
        		var oId = this.tableData[i].id;
        		for (var j = 0; j < this.tableData[i].subIndicator.length; j++) {
        				var obj1 = new Object()
        				obj1.cause = this.tableData[i].cause == undefined?'':this.tableData[i].cause;
        				obj1.measure = this.tableData[i].measure == undefined?'':this.tableData[i].measure;;
        				obj1.indicatorParam = this.tableData[i].indicatorParam;
        				if(this.tableData[i].subIndicator[j].id == 'null'){
        					if(this.tableData[i].dataType == 2){
        						obj1['value'] = this.tableData[i].subIndicator[j].value=='0'?'':this.tableData[i].subIndicator[j].value; 
        					} else{
        						obj1['value'] = this.tableData[i].subIndicator[j].value
        					}
        				}else{
        					if(this.tableData[i].dataType == 2){
        						obj2[this.tableData[i].subIndicator[j].id] = this.tableData[i].subIndicator[j].value=='0'?'':this.tableData[i].subIndicator[j].value;
        					} else{
        						obj2[this.tableData[i].subIndicator[j].id] = this.tableData[i].subIndicator[j].value
        					}
        					obj1 = Object.assign(obj1,obj2)
        				}
        				obj[oId] = obj1
        		}
        	}
        	this.askArr.push(obj)
       	},
       	findKey(obj,value, compare = (a, b) => a === b) {
				  return Object.keys(obj).find(k => compare(obj[k], value))
				},
       	plHandleData(){
       		var taskData = JSON.parse(sessionStorage.getItem('taskName'));
       		this.askArr = [];
        	var obj2 = new Object();
        	for (var i = 0; i < this.tableData.length; i++) {
        		var obj = new Object();
        		var oId = this.tableData[i].id;
        		obj.id = this.tableData[i].idJob;
        		obj.batch = this.tableData[i].batch;
        		obj.applayObject = this.tableData[i].applayObject;
        		for (var j = 0; j < this.tableData[i].subIndicator.length; j++) {
        				var obj1 = new Object()
        				obj1.cause = this.tableData[i].cause == undefined?'':this.tableData[i].cause;
        				obj1.measure = this.tableData[i].measure == undefined?'':this.tableData[i].measure;;
        				obj1.indicatorParam = this.tableData[i].indicatorParam;
        				if(this.tableData[i].subIndicator[j].id == 'null'){
        					if(this.tableData[i].dataType == 2){
        						obj1['value'] = this.tableData[i].subIndicator[j].value=='0'?'':this.tableData[i].subIndicator[j].value; 
        					} else{
        						obj1['value'] = this.tableData[i].subIndicator[j].value
        					}
        				}else{
        					if(this.tableData[i].dataType == 2){
        						obj2[this.tableData[i].subIndicator[j].id] = this.tableData[i].subIndicator[j].value=='0'?'':this.tableData[i].subIndicator[j].value;
        					} else{
        						obj2[this.tableData[i].subIndicator[j].id] = this.tableData[i].subIndicator[j].value
        					}
        					obj1 = Object.assign(obj1,obj2)
        				}
        				obj[oId] = obj1
        		}
        		this.askArr.push(obj)
        	}
       	},
        back(){
        	sessionStorage.removeItem('taskName')
        	this.$router.push({  //核心语句
			        path:'riskMonitor/indexReporting',//跳转的路径
			        query:{
			        	id:'1_izbcb'
			        }
			      })
        },
        downTemplate(){
        	window.open(this.$axios.defaults.baseURL+'/indjob/batch/downloadtemplate')
        },
        uploadFile(param){
	    		var fileObj = param.file;
		    	var form = new FormData();
		    	form.append("file", fileObj);
		    	this.axios.post('indjob/batch/uploading',form).then((res)=>{
	    					if(res.code == '200'){
									//数据导入数据回填
									for (var i = 0; i < res.data.length; i++) {
											this.$set(this.tableData[i],'measure',res.data[i].measure);
											this.$set(this.tableData[i],'cause',res.data[i].cause);
											this.$set(this.tableData[i],'param',res.data[i].param);
											this.$set(this.tableData[i],'indicatorParam',res.data[i].indicatorParam)
											if(res.data[i].subIndicator!=null){
												for (var j = 0;j < res.data[i].subIndicator.length; j++) {
													this.$set(this.tableData[i].subIndicator[j],'value',res.data[i].subIndicator[j]);
												}
											}else{
												if(this.tableData[i].subIndicator != null){
													this.$set(this.tableData[i].subIndicator[0],'value',res.data[i].value);
												}else{
													this.$set(this.tableData[i],'value',res.data[i].value);
												}
											}
									}
	    					}else{
	    						this.$alert(res.data, '提示', {
		               confirmButtonText: '确定',
		               callback:action=>{
		               		this.searchData(this.checkData)
		                }
		              });
	    					}
		    		})
        }
    }
  };
</script>
<style lang="scss">
#taskReport{
	padding-top: 75px;
	
	.btnCss{
		width: 68px;
		height: 26px;
		line-height: 0;
		font-size: 12px;
		padding:0;
	}
	.btn{
		overflow: hidden;
	}
	.btns{
		width: 68px;
		height: 26px;
		line-height: 0;
		font-size: 12px;
		padding:0;
		float: right;
	}
	.upload-demo{
		float: right;
	}
	.paramIpt{
		width: 80%;
    padding-left: 20px;
		.el-input__inner{
			height: 26px;
			line-height: 26px;
		}
	}
	.marginCss{
		margin-bottom: 15px;
	}
	.cell .marginCss:nth-last-child(2) {
		margin-bottom: 0!important;
	}
	.paramIpt1{
		/*float: left;*/
		width: 75%;
		.el-input__inner{
			height: 26px;
			line-height: 26px;
		}
	}
	.el-input--suffix,.el-input__inner{
		height: 26px;
		line-height: 26px;
	}
	.el-select__caret{
		line-height: 26px;
	}
	.reason::-webkit-input-placeholder{
		color:#c2c2c2;
	}
	.el-table__body-wrapper{
		background: #fff;
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
	.disabledCss{
		background: #F5F7FA;
		cursor:not-allowed;
		color: #C0C4CC!important;
	}
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
	.fontWeight{
		font-weight: 600;
	}
	.alingLeft{
		text-align: left;
	}
	.box{
    	background: #fff;
    	padding: 16px 30px 30px 30px;
    	-webkit-box-shadow: 4px 2px 6px #888;
    	margin-bottom: 20px;
    	border-radius: 8px;
    	.titIcon{
    		font-size:14px;
    		margin-bottom:20px;
    		em{
    			display: inline-block;
    			width: 2px;
    			height: 14px;
    			background: #4285F4;
    			vertical-align: middle;
    			margin-right: 6px;
    		}
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
	}
	.contList{
		background: #fff;
		padding: 16px 16px 30px 30px;
		-webkit-box-shadow: 4px 2px 6px #888;
		overflow: scroll;
		border-radius: 8px;
		::-webkit-scrollbar  
		{   width: 11px;
		    height: 11px;  /*滚动条高度*/
		} 
		th{
			border: none;
			background: #F9F9F9;
			.cell{
				text-align: center!important;
			};
		}
		td{
			border: none;
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
}	

</style>
