<template>
  <el-container id="buildWarnSheet">
  <el-header class="header">
  	<el-row>
	  	<el-col :span="12">
		  	<el-breadcrumb separator-class="el-icon-arrow-right">
				  <el-breadcrumb-item><span class="textColor1">风险监测指标管理</span></el-breadcrumb-item>
				  <el-breadcrumb-item :to="{path:'/riskMonitor/quoteWarning/riskyQuoteWarn?id=1_ifxzbyjd'}"><span class="textColor1">风险提示</span></el-breadcrumb-item>
				  <el-breadcrumb-item><span class="textColor">{{msg}}</span></el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
			<el-col :span="9">
				<el-button type="primary" class="fxWarnBtn" size="mini" @click="back">返回</el-button>
		  	<el-button type="primary" class="fxWarnBtn" @click="submitAll(subType)" size="mini">提交</el-button>
		  </el-col>
	  </el-row>
  </el-header>
  <div class="box" id="basicInfo">
			<div class="titIcon fontWeight"><em></em><span>风险提示基本信息</span></div>
			<el-form ref="form" size="mini" :inline="true">
	      <template>
				    <div>
				        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
				            <el-row style="margin-bottom: 16px;">
				            		<el-col :span="8">
				                		<el-form-item label="提示单名称">
						                    <el-input v-model="subData.warnName" @change = 'changeName' placeholder="请输入提示单名称"> </el-input>
							              </el-form-item>
				                </el-col>	
				                <el-col :span="8" align="center">
					                  <el-form-item label="提示级别">
														    <el-select v-model="warnLevel.region" @change="changeLevel" placeholder="请选择提示级别">
																    	<el-option v-for="item in warnLevel.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option> 
														    </el-select>
														</el-form-item>
				                </el-col>
				                 <el-col :span="8" align="right">
				                			<div style="font-size: 14px;padding-right: 50px;">
				                				<span>是否需要反馈报告：</span>
															  <el-radio-group @change="getRadio" class="radioframe"  v-model="subData.isReport">
																	<el-radio :label="a">是</el-radio>
																	<el-radio :label="b">否</el-radio>
																</el-radio-group>
				                			</div>
				                </el-col>
				            </el-row>
				            <el-row>
				                <el-col :span="8">
				                		<el-form-item label="处理截止日期"> 
										        	<el-date-picker type="date" :disabled="isDate" @change="changeDate" placeholder="选择日期" v-model="form.date1"></el-date-picker>
														</el-form-item>
				                </el-col>
				                <el-col :span="8" align="left">
				                		<div style="font-size: 14px;padding-left: 17%;">
												    	<span>创建部门：</span>
												    	<span>{{cDepName}}</span>
												    </div>
				                </el-col>
				                <el-col :span="8" align="left">
					                		<div style="padding-left: 48%;font-size: 14px;">
													    	<span>创建人：</span>
													    	<span>{{cUserName}}</span>
													    </div>
				                </el-col>
				            </el-row>
				        </el-form>
				    </div>
				</template>
	   </el-form>
	</div>
	<div class="box chooseQuote">
			<div class="titIcon fontWeight"><em></em><span>选择指标</span></div>
			<p style="font-size: 14px;margin-bottom: 20px;">风险提示要求：</p>
			<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="subData.riskWarnRequire"> </el-input>
			<!--指标列表查询条件-->
			<el-form ref="form" size="mini" :inline="true">
				<el-row style="margin-top: 16px;">
					<el-col :span="2">
						<div class="batch" style="float: left;font-size: 14px;height: 40px;line-height: 30px;width: 160px;">
							<span>报送批次：</span>
							<span>{{batchQuency}}</span>
						</div>
					</el-col>
					<el-col :span="22" style="padding-left: 5%;">
						<el-form-item label="适用对象">
						    <el-select v-model="subData.dealObjName" style="margin-right: 16px;" @change="getObject" placeholder="请选择适用对象">
								    	<el-option v-for="item in warnObject.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option> 
						    </el-select>
						</el-form-item>
						<el-form-item label="报送部门" style="padding-left: 4%;">
						    <el-select v-model="subData.dealDepartName" @change="getDeps" placeholder="请选择报送部门">
								    	<el-option v-for="item in subDepartment.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option> 
						    </el-select>
						</el-form-item>
						<div class="btn">
							<i class="el-icon-circle-plus" @click="openQuoteList"></i>
							<i class="el-icon-remove" @click="minusQuoteList"></i>
						</div>
					</el-col>
				</el-row>
			</el-form>
			<!--指标列表-->
			<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:10px">
		           	<el-table-column prop="indId" label="编号" align="center" width="120">
		           		<template slot-scope="scope">
			              <span>{{scope.row.indId}}</span>
			            </template>
		           	</el-table-column>
		            <el-table-column prop="indName" label="指标名称" align="center" width="120">
		            	<template slot-scope="scope">
		                    <span :title="scope.row.indName" class="textOverFlow">{{scope.row.indName == null?'--':scope.row.indName}}</span>
		              </template>
		            </el-table-column>
		            <el-table-column prop="catName" label="风险分类" align="center" width="120"> </el-table-column>
		            <!-- <el-table-column prop="indLevel" label="指标等级" align="center" width="120">
		            	<template slot-scope="scope">
			              <span>{{scope.row.indLevel == '1'?'一级指标':'二级指标'}}</span>
			            </template>
		            </el-table-column> -->
		            <el-table-column prop="frequency" label="报送频率" align="center" width="80">
		            	<template slot-scope="scope">
		            		<span>{{frequency[scope.row.frequency]}}</span>
		            	</template>
		            </el-table-column>
		            <el-table-column prop="indValue" label="异常数据" width="150" align="center">
	                	<template slot-scope="scope">
				          		<div :class="{'redBg':scope.row.rybStatus == 1,'yellowBg':scope.row.rybStatus == 2,'blueBg':scope.row.rybStatus == 3}">
				            		<p :title="item" v-for="item in scope.row.indValue">{{item}}</p>
				            	</div>
			            </template>
	             	</el-table-column>
		            <el-table-column prop="causeAnalysis" label="原因分析" align="center" width="150">
		            		<template slot-scope="scope">
			            		<span>{{scope.row.causeAnalysis == null?'--':scope.row.causeAnalysis}}</span>
			            	</template>
		            </el-table-column>
		            <el-table-column prop="correctiveAction" label="整改措施" align="center" width="150">
		            		<template slot-scope="scope">
			            		<span>{{scope.row.correctiveAction == null?'--':scope.row.correctiveAction}}</span>
			            	</template>
		            </el-table-column>
		            <el-table-column prop="objName" label="报送对象" align="center" width="">
		            </el-table-column>
		            <el-table-column prop="taskName" label="报送任务名称" align="center" width="180"> 
		            	<template slot-scope="scope">
		                    <span :title="scope.row.taskName" class="textOverFlow">{{scope.row.taskName == null?'--':scope.row.taskName}}</span>
		              </template>
		            </el-table-column>
		            <el-table-column prop="taskDate" label="报送时间" align="center" width=""> </el-table-column>
		        </el-table>
	      </div>
	</div>
	<!--选择整改单位-->
	<div class="box" id="recoverUnit">
			<div class="titIcon fontWeight">
				<em></em><span>选择整改单位</span>
				<div class="btn">
					<i class="el-icon-circle-plus" @click="addUnit"></i>
					<i class="el-icon-remove" @click="minusUnit"></i>
				</div>
			</div>
			<el-form ref="form" size="mini" :inline="true">
	      <template>
				    <div>
				        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
			            <el-row style="margin-bottom: 16px;">
			            		<el-col :span="8">
				                  <el-form-item label="整改单位">
													    <el-select v-model="subData.reformObjName" @change="((val)=>{getZgdep(val,0)})" placeholder="请选择整改单位">
															    	<el-option v-for="item in warnObject.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option> 
													    </el-select>
													</el-form-item>
			                </el-col>
			                <el-col :span="8" align="center">
				                  <el-form-item label="牵头部门">
													    <el-select v-model="subData.leadDepartName" placeholder="请选择" popper-class="insselect-tree" value-key="subData.leadDepartName">
																<el-option :value="subData.leadDepartName" style="height:auto;background: #fff;">
																	<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" :expand-on-click-node="false" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id">
																	</el-tree>
																</el-option>
															</el-select>
													</el-form-item>
			                </el-col>
			                <el-col :span="8" align="right" style="padding-right: 30px;">
				                  <el-form-item label="经办人">
													    <el-select v-model="subData.agentUserName" @change="getJbr" placeholder="请选择经办人">
															    	<el-option v-for="item in jbrObject.unitsData" :key="item.userId" :label="item.name" :value="item.userId"></el-option> 
													    </el-select>
													</el-form-item>
			                </el-col>
			            </el-row>
				        	<div>
					            <el-row v-for="(list,index) in subData.copyInfo" :key = "list.id" style="margin-bottom: 16px;">
					                <el-col :span="8">
						                  <el-form-item label="抄送单位">
															    <el-select v-model="list.copyObjName" @change="((val)=>{getCsobj(val, index,'0')})" placeholder="请选择抄送单位">
																	    	<el-option v-for="item in warnObject.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option> 
															    </el-select>
															</el-form-item>
					                </el-col>
					                <el-col :span="8" align="center">
						                  <el-form-item label="抄送部门">
															    <el-select v-model="list.copyDepartName" placeholder="请选择" popper-class="insselect-tree" value-key="list.copyDepartName">
																		<el-option :value="list.copyDepartName" style="height:auto;background: #fff;">
																			<el-tree :props="insprops" :data="list.copyDataList" :key="treeKey" ref="trees" @node-expand="getNodeInfo" :expand-on-click-node="false" @node-click="((val)=>{handleNodeClick1(val,index)})" :load="loadNode" lazy node-key="id"> </el-tree>
																		</el-option>
																	</el-select>
															</el-form-item>
					                </el-col>
					                <el-col :span="8" align="right" style="padding-right: 30px;">
						                  <el-form-item label="抄送人">
															    <el-select v-model="list.copyUserName" @change="((val)=>{getCsPerson(val, index)})" placeholder="请选择抄送人">
																	    	<el-option v-for="item in list.copyUserList" :key="item.userId" :label="item.name" :value="item.userId"></el-option> 
															    </el-select>
															</el-form-item>
					                </el-col>
					            </el-row>
				        	</div>
				        </el-form>
				    </div>
				</template>
	   </el-form>
	</div>
	<div class="mask" v-if="quoteListShow">
		<quote-chosen @getQuoteListId = 'getQuoteList' :listCheck="listCheck"></quote-chosen>
	</div>
  </el-container>
</template>
<script>
	import {formatDate} from 'src/utils/utils.js'
	import quoteChosen from 'src/components/quoteChosen/quoteChosen'
	import qs from 'qs'
  export default {
  	data() {
        return {
        	treeKey:'',
        	saveAllData:{},
        	isDate:false,
        	msg:'下发风险预警单',
        	a:'1',
					b:'0',
					cUserName:'',
					cDepName:'',
					subType:'1',//提交类型 1.新建提交，2.维护提交
					batchQuency:null,
					listCheck:{},
					quoteListShow:false,
					totalResults:0,
    			tableData4:[],
          currentPage:1,
          objInfo:'',
					dengmiQueryForm: {
	            wgOrgnize:'',
	            wgName:'',
	            wgFile:''
	        },
	        insprops:{
	  				label: 'name',
	  				children: 'zones',
	  				isLeaf: 'leaf',
	  				id:'',
	  				name:'',
	  				node:{},
	  				resolve:{},
	  				value:"id"
	  			},
	        form:{
	        	data1:null
	        },
	        warnLevel: {
	          user: null,
	          region: '风险提示',
	          unitsData:[{ name:'风险提示', value:1 },{ name:'风险警示', value:2 }]
	        },
	       	subDepartment: {
	          unitsData:[]
	        },
	        warnObject: {
	          region: '集团',
	          unitsData:[]
	        },
	        qtObject: {
	          region:null,
	          unitsData:[]
	        },
	        jbrObject: {
	          region:null,
	          unitsData:[]
	        },
	        csrObject: {
	          region:null,
	          unitsData:[]
	        },
	        sendObj: {
	          region: '全部',
	          unitsData:[]
	        },
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度',
	        	'4':'半年度',
	        },
	        copyInfoTemp:[
	        	{
	        		copyObjId:null,
	        		copyObjName:null,
	        		copyDepartId:null,
	        		copyDepartName:null,
	        		copyUserNo:null,
	        		copyUserName:null,
	        		copyDataList:[],
	        		copyUserList:[]
	        	}
	        ],
	        subData:{
	        	warnName:null,
	        	level:'1',
	        	isReport:'1',
	        	riskWarnRequire:null,
	        	indIdList:[],
        		reformObjId:null,
        		reformObjName:null,
        		leadDepartId:null,
        		leadDepartName:null,
        		agentUserNo:null,
        		agentUserName:null,
        		dealObjName:'集团',
        		dealObjId:'101',
        		dealDepartId:null,
        		dealDepartName:null,
	        	copyInfo:[
		        	{
		        		copyObjId:null,
		        		copyObjName:null,
		        		copyDepartId:null,
		        		copyDepartName:null,
		        		copyUserNo:null,
		        		copyUserName:null,
		        		copyDataList:[],
		        		copyUserList:[]
		        	}
	        	],
	        	subBatch:this.$route.query.batch
	        }
        }
   },
    created(){
    	this.treeKey = +new Date();
    	this.batchQuency = this.$route.query.batch
    	//id存在与否代表是新建还是维护
    	let id = this.$route.query.id
    	if(id != undefined){
    		this.subData.warnId = id;
    		this.subType = '2';
    		this.msg = '维护指标预警单'
    		this.getSheetInfo(id)
    	}else{
    		this.subType = '1';
    	}
    	//获取适用对象
    	this.getObj()
    },
    components:{
    	quoteChosen
    },
    methods:{
    		//获取适用对象
    		getObj(){
    			this.axios.post('rmIndWarn/indWarnOptInfo',qs.stringify({})).then((res)=>{
		   			if(res.code == 200){
		   				// 适用对象
		   				let tempArr = [];
		   				this.objInfo = res.data.objects;
		   				for (var i = 0; i < res.data.objects.length; i++) {
		   					var obj = new Object();
		   					if(res.data.objects[i].id == '101'){
		   						this.subDepartment.unitsData = this.subDepartment.unitsData.concat(res.data.objects[i].deps)
		   					}
		   					obj.id = res.data.objects[i].id;
		   					obj.name = res.data.objects[i].name
		   					tempArr.push(obj)
		   				}
		   				this.warnObject.unitsData = tempArr
		   				this.cUserName = res.data.cUserName == null?'--':res.data.cUserName;
		   				this.cDepName = res.data.cDepName == null?'--':res.data.cDepName;
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
    		},
    		getRadio(val){
    			if(val == 0){
    				this.isDate = true
    			}else{
    				this.isDate = false
    			}
    		},
    		//获取报送部门
    		getDepart(data){
    			this.axios.post('rmIndWarn/getOrgInfo',qs.stringify({orgCode:data})).then((res)=>{
		   			if(res.code == 200){
		   				// 适用对象
			   			this.sendObj.unitsData = res.data
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
    		},
    		getNodeInfo(node,resolve) {
				},
				handleNodeClick(node) {
					let res = this.$refs.tree.getCurrentNode(true,true)
					this.subData.leadDepartName = res.name
					this.subData.leadDepartId = res.groupId == undefined?res.id:res.groupId
					this.getQtdep(this.subData.leadDepartId,'1')
				},
				handleNodeClick1(node,index){
					this.subData.copyInfo[index].copyDepartName = node.name
					this.subData.copyInfo[index].copyDepartId = node.groupId
					this.getCsdep(node.groupId,index,'1')
				},
				// 获取部门数据
		    loadNode(node,resolve){
	  			if (node.level == 0) {
	  					return resolve(this.qtObject.unitsData)
		        }else{
		  				var mid = node.data.groupId === undefined?'':node.data.groupId;
		  				this.connectAxios(mid,node,resolve)
					}
	  		},
	  		connectAxios(val,node,resolve){
	  			this.node = node
			  	this.resolve = resolve
	  			var params = qs.stringify({
			        groupId: val
			    })
	        this.axios.post('rmIndWarn/getOrgByPid', params).then((res)=>{
	       		var arr = [];
                if(res.data != null){
		          	for (var i = 0; i < res.data.length; i++) {
		           	var obj = new Object;
		           	obj.name = res.data[i].name;
		           	obj.id = res.data[i].groupId;
		           	arr.push(obj);
		          } 
                }
							resolve(arr)
		      })
	  		},
    		//选择适用对象
    		getObject(val){
    			for (var i = 0; i < this.objInfo.length; i++) {
    				if(val == this.objInfo[i].id){
							this.subDepartment.region = '';
							this.subDepartment.unitsData = []
							let obj = {};
				      obj = this.warnObject.unitsData.find((item)=>{
				          return item.id === val;//筛选出匹配数据
				      });
					    this.subData.dealObjName = obj.name  == ''?null:obj.name;
    					this.subDepartment.unitsData = this.subDepartment.unitsData.concat(this.objInfo[i].deps)
    					this.subData.dealObjId = val;
    					this.subData.dealDepartId = null;
    					this.subData.dealDepartName = null;
    				}
    			}
    		},
    		getDeps(val){
    			let obj = {};
		      obj = this.subDepartment.unitsData.find((item)=>{
		          return item.id === val;//筛选出匹配数据
		      });
		      this.subData.dealDepartName = obj.name == ''?null:obj.name;
    			this.subData.dealDepartId = val;
    			this.listCheck.departmentId = this.subData.dealDepartId
    		},
    		//整改单位选择事件
    		getZgdep(val,index){
    			debugger;
    			if(index != '1'){
	    			//重置牵头部门数据
	    			this.subData.leadDepartId = null;
	    			this.subData.leadDepartName = null;
	    			//重置经办人数据
	    			this.subData.agentUserNo = null;
	    			this.subData.agentUserName = null;
	    			this.jbrObject.unitsData = [];
	    			//整改单位数据赋值
	    			let obj = {};
			      obj = this.warnObject.unitsData.find((item)=>{
			          return item.id === val;//筛选出匹配数据
			      });
			      this.subData.reformObjName = obj.name == ''?null:obj.name;
	    			this.subData.reformObjId = val;
    			}
    			this.axios.post('rmIndWarn/getOrgInfo',qs.stringify({objId:val})).then((res)=>{
		   			if(res.code == 200){
		   				// 适用对象
			   			if(res.data !== null){
			   				this.qtObject.unitsData = res.data
			   			} else{
			   				this.qtObject.unitsData = []
			   			}
			   			this.treeKey = +new Date();
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
    		},
    		//牵头部门选择事件
    		getQtdep(val,index){
    			if(index != '1'){
    				//代表是维护回显
	    			//重置经办人数据
	    			this.subData.agentUserNo = null;
	    			this.subData.agentUserName = null;
	    			//牵头部门赋值
	    			let obj = {};
			      obj = this.qtObject.unitsData.find((item)=>{
			          return item.groupId === val;//筛选出匹配数据
			      });
			      this.subData.leadDepartName = obj.name == ''?null:obj.name;
	    			this.subData.leadDepartId = val;
    			}
    			if(val != ''){
	    			this.axios.post('rmIndWarn/getGroupUser',qs.stringify({groupId:val})).then((res)=>{
			   			if(res.code == 200){
			   				// 适用对象
				   			this.jbrObject.unitsData = res.data
			   			}else{
			   				this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定'
					        })
			   			}
				   	})
    			}
    		},
    		//经办人选择事件
    		getJbr(val){
    			let obj = {};
		      obj = this.jbrObject.unitsData.find((item)=>{
		          return item.userId === val;//筛选出匹配数据
		      });
		      this.subData.agentUserName = obj.name == ''?null:obj.name;
    			this.subData.agentUserNo = val;
    		},
    		//抄送单位选择事件
    		getCsobj(val,index,type){
    			//重置抄送部门数据
    			//用type判断是否是维护还是新增
    			if(type != '1'){
	    			this.subData.copyInfo[index].copyDepartName = null;
	    			this.subData.copyInfo[index].copyDepartId = null;
	    			//重置抄送人数据
	    			this.subData.copyInfo[index].copyUserNo = null;
	    			this.subData.copyInfo[index].copyUserName = null;
	    			this.csrObject.unitsData = [];
	    			//抄送单位赋值
	    			let obj = {};
			      obj = this.warnObject.unitsData.find((item)=>{
			          return item.id === val;//筛选出匹配数据
			      });
			      this.subData.copyInfo[index].copyObjName = obj.name == ''?null:obj.name;
	    			this.subData.copyInfo[index].copyObjId = val;
    			}
    			if(val != '' || val != undefined){
	    			this.axios.post('rmIndWarn/getOrgInfo',qs.stringify({objId:val})).then((res)=>{
			   			if(res.code == 200){
			   				// 适用对象
			   				this.$set(this.subData.copyInfo[index],'copyDataList',res.data)
			   				//备份抄送数据
			   				this.copyInfoTemp.copyDataList = res.data
			   			}else{
			   				this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定'
					        })
			   			}
				   	})
    			}
    		},
    		//抄送部门选择事件
    		getCsdep(val,index,type){
    			if(type != '1'){
	    			//重置抄送人数据
	    			this.subData.copyInfo[index].copyUserNo =null;
	    			this.subData.copyInfo[index].copyUserName = null;
	    			//抄送部门赋值
	    			let obj = {};
			      obj = this.subData.copyInfo[index].copyDataList.find((item)=>{
			          return item.groupId === val;//筛选出匹配数据
			      });
			      this.subData.copyInfo[index].copyDepartName = obj.name == ''?null:obj.name;
	    			this.subData.copyInfo[index].copyDepartId = val;
    			}
    			if(val != null){
	    			this.axios.post('rmIndWarn/getGroupUser',qs.stringify({groupId:val})).then((res)=>{
			   			if(res.code == 200){
			   				// 适用对象
			   				this.$set(this.subData.copyInfo[index],'copyUserList',res.data)
			   				this.copyInfoTemp.copyUserList = res.data
			   			}else{
			   				this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定'
					        })
			   			}
				   	})
    			}
    		},
    		//抄送人选择事件
    		getCsPerson(val,index){
    			let obj = {};
		      obj = this.subData.copyInfo[index].copyUserList.find((item)=>{
		          return item.userId === val;//筛选出匹配数据
		      });
		      this.subData.copyInfo[index].copyUserName = obj.name == ''?null:obj.name;
    			this.subData.copyInfo[index].copyUserNo = val;
    		},
    		//增加指标列表出现
    		openQuoteList(){
    			this.listCheck.batch = this.$route.query.batch;
    			this.listCheck.objectId = this.subData.dealObjId;
    			this.quoteListShow = true
    		},
    		//删除指标列表项
    		minusQuoteList(){
    			
    		},
    		//预警单级别
    		changeLevel(val){
    			this.subData.level = val
    		},
    		//预警指标列表
    		getQuoteList(val){
    			this.quoteListShow = false;
    			this.subData.indIdList = [];
    			if(val.length != 0){
    				for (var i = 0; i < val.length; i++) {
    					this.subData.indIdList.push(val[i].id)
    				}
    			}
    			let obj = new Object;
    			obj.ids = this.subData.indIdList+''
    			obj.subBatch = this.$route.query.batch
    			if(this.subData.indIdList.length > 0){
    				this.getListInfo(obj)
    			}
    		},
    		//获取预警指标列表信息
    		getListInfo(data){
    			this.axios.post('rmIndWarn/getIndStat',qs.stringify(data)).then((res)=>{
		   			if(res.code == 200){
	   					if(res.data !=null){
			   				for (var i = 0; i < res.data.length; i++) {
									res.data[i].indValue = eval("("+res.data[i].indValue+")")
									res.data[i].taskDate = formatDate(new Date(res.data[i].taskDate),'yyyy-MM-dd hh:mm:ss')
								}
		   				}
		   				// 适用对象
		   				this.tableData4 = res.data;
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
    		},
    		//增加抄送部门
    		addUnit(){
    			this.subData.copyInfo.push({
	        		copyObjId:null,
	        		copyObjName:null,
	        		copyDepartId:null,
	        		copyDepartName:null,
	        		copyUserNo:null,
	        		copyUserName:null,
	        		copyDataList:[],
	        		copyUserList:[]
	        })
    		},
    		//删除抄送部门
    		minusUnit(){
    			if(this.subData.copyInfo == '1'){
    				return;
    			}
    			this.subData.copyInfo.splice(-1,1)
    		},
    		changeDate(val){
	      		if(val != null){
	      			this.subData.endDate = formatDate(val,'yyyy-MM-dd');
	      		}else{
	      			this.subData.endDate = null;
	      		}
	      },
	      changeName(val){
	      	this.subData.warnName = val;
	      },
	      //预警单维护调用接口方法
	      getSheetInfo(id){
	      	this.axios.post('rmIndWarn/getIndWarn',qs.stringify({warnId:id})).then((res)=>{
		   			if(res.code == 200){
		   				if(res.data != null){
			   				//维护信息回填
			   				//预警单名称
			   				this.subData.warnName = res.data.warnName
			   				//预警级别
			   				this.subData.level = res.data.level
			   				this.warnLevel.region = res.data.level == '1'?'风险提示':'风险警示'
			   				//是否需要反馈报告
			   				this.subData.isReport = res.data.isReport+''
			   				//处理截止日期
			   				this.subData.endDate = formatDate(new Date(parseInt(res.data.dealEndDate)*1000),'yyyy-MM-dd')
			   				this.form.date1 = formatDate(new Date(parseInt(res.data.dealEndDate)*1000),'yyyy-MM-dd')
			   				//风险提示要求
			   				this.subData.riskWarnRequire = res.data.riskWarnRequire;
			   				//报送批次
			   				this.subData.subBatch = res.data.subBatch;
			   				this.batchQuency = res.data.subBatch;
			   				//适用对象
			   				this.subData.dealObjName = res.data.dealObjName
			   				this.subData.dealObjId = res.data.dealObjId;
			   				this.getObject(res.data.dealObjId)
			   				//报送部门
			   				this.subData.dealDepartName = res.data.dealDepartName
			   				this.subData.dealDepartId = res.data.dealDepartId
			   				//列表Id
			   				this.subData.indIdList = res.data.indIdList
			   				//指标列表
			   				if(res.data.indList !=null){
				   				for (var i = 0; i < res.data.indList.length; i++) {
										res.data.indList[i].indValue = eval("("+res.data.indList[i].indValue+")")
										res.data.indList[i].taskDate = formatDate(new Date(res.data.indList[i].taskDate),'yyyy-MM-dd hh:mm:ss')
									}
			   				}
			   				this.tableData4 = res.data.indList
			   				//整改单位
			   				this.subData.reformObjName = res.data.reformObjName
			   				this.subData.reformObjId = res.data.reformObjId
			   				this.getZgdep(res.data.reformObjId,'1')
			   				//牵头部门
			   				this.subData.leadDepartName = res.data.leadDepartName
			   				this.subData.leadDepartId = res.data.leadDepartId
			   				this.getQtdep(res.data.leadDepartId,'1')
			   				//经办人
			   				this.subData.agentUserName = res.data.agentUserName;
			   				this.subData.agentUserNo = res.data.agentUserNo;
			   				//抄送单位
			   				this.subData.copyInfo = res.data.copyToList;
			   				if(res.data.copyToList != undefined){
			   					for (var i = 0; i < res.data.copyToList.length; i++) {
			   						this.getCsobj(res.data.copyToList[i].copyObjId,i,'1')
			   						this.getCsdep(res.data.copyToList[i].copyDepartId,i,'1')
			   					}
			   				}else{
			   					this.subData.copyInfo = [
						        	{
						        		copyObjId:null,
						        		copyObjName:null,
						        		copyDepartId:null,
						        		copyDepartName:null,
						        		copyUserNo:null,
						        		copyUserName:null,
						        		copyDataList:[],
						        		copyUserList:[]
						        	}
					        	]
			   				}
		   				}
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
	      },
        submitAll(type){
        	//提交校验
        	if(this.subData.warnName ==null){
        		this.$alert('提示单名称不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return;
        	}else if(this.subData.isReport == 1 && this.subData.endDate == null){
        		this.$alert('处理截止日期不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return;
        	}else if(this.subData.dealDepartId == null){
        		this.$alert('报送部门不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return;
        	}else if(this.subData.reformObjName == null){
        		this.$alert('整改单位不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return;
        	}
//      	for (var i = 0; i < this.subData.copyInfo.length; i++) {
//      		if(this.subData.copyInfo[i].copyObjName == null){
//      			this.$alert('抄送单位不能为空', '提示', {
//			          confirmButtonText: '确定'
//			        });
//			        return;
//      		}
//      	}
        	this.subData.copyInfo.forEach((item)=>{
        			delete item.copyDataList
        			delete item.copyUserList
        	})
        	let tempData = JSON.parse(JSON.stringify(this.subData)) //浅拷贝
        	tempData.copyInfo = JSON.stringify(tempData.copyInfo)
        	if(type == '1'){
        		//新建提交
		        this.axios.post('rmIndWarn/addIndWarn',qs.stringify(tempData)).then((res)=>{
		        		if(res.code == 200){
		        			this.$alert('提交成功', '提示', {
					          confirmButtonText: '确定',
					          callback: action => {
					          	this.$router.push({  //核心语句
								        path:'riskMonitor/quoteWarning/riskyQuoteWarn',//跳转的路径
								        query:{
								        	id:''
								        }
								      })
					          }
					        });
		        		}else{
		        			this.subData.copyInfo = this.copyInfoTemp;
		        			this.$alert(res.message, '提示', {
						          confirmButtonText: '确定'
						        });
		        		}
	        	})
        	}else{
        		//维护更新
        		this.axios.post('rmIndWarn/updateIndWarn',qs.stringify(tempData)).then((res)=>{
		        		if(res.code == 200){
		        			this.$alert('提交成功', '提示', {
					          confirmButtonText: '确定',
					          callback: action => {
					          	this.$router.push({  //核心语句
								        path:'riskMonitor/quoteWarning/riskyQuoteWarn',//跳转的路径
								        query:{
								        	id:''
								        }
								      })
					          }
					        });
		        		}else{
		        			this.subData.copyInfo = JSON.parse(this.subData.copyInfo)
		        			this.subData.copyInfo = this.copyInfoTemp;
		        			this.$alert(res.message, '提示', {
						          confirmButtonText: '确定'
						        });
		        		}
	        	})
        	}
        },
        back(){
        	this.$router.push({  //核心语句
			        path:'riskMonitor/quoteWarning/riskyQuoteWarn',//跳转的路径
			        query:{
			        	id:'1_ifxzbyjd'
			        }
			      })
        }
    }
  };
</script>
<style lang="scss">
#buildWarnSheet{
	.mask{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0,0,0,.5);
		padding:4% 5%;
		padding-left: 18%;
		z-index: 99999;
	}
	.header{
		padding-left: 218px;
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
	.fxWarnBtn{
		width: 68px;
		height: 26px;
		padding:0;
		font-size: 12px;
	}
	.box{
    	background: #fff;
    	padding: 16px 16px 30px 16px;
    	-webkit-box-shadow: 4px 2px 6px #888;
    	margin-top: 70px;
    	border-radius: 8px;
    	.titIcon{
    		font-size:14px;
    		margin-bottom:30px;
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
	.chooseQuote{
		margin-top: 16px;
		textarea{
			height: 300px;
		}
		.titIcon{
			margin-bottom:20px;
		}
		.el-table__empty-block{
			background: #fff;
		}
		th{
			background: #F9F9F9;
		}
		.btn{
			float: right;
	    line-height: 40px;
	    font-size: 20px;
	    color: #4285F4;
	    margin-right: 2.4%;
	   	.el-icon-circle-plus{
	   		margin-right: 35px;
	   	}
	   	i:hover{
	   		cursor: pointer;
	   	}
		}
	}
	.redBg p{
		display: inline-block;
		background: #FF6363;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
	.yellowBg p{
		display: inline-block;
		background: #FFD824;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
	.blueBg p{
		display: inline-block;
		background: #4285F4;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
    .cell p{
		overflow:hidden;
		-webkit-line-clamp: 2;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    /*! autoprefixer: off */
	    -webkit-box-orient: vertical;
	    /* autoprefixer: on */
    }
}	
#basicInfo,#recoverUnit{
	.el-form-item{
		width: 100%;
		.el-form-item__content{
			width: 64%;
		}
	}
	.el-select{
		width: 100%;
	}
	.el-date-editor.el-input{
		width: 100%;
	}
	.el-form-item__label{
			width:130px;
			text-align: right;
	}
}
#recoverUnit{
		margin-top: 16px!important;
		.el-form-item__label{
			width: 100px;
		}
		.btn{
			float: right;
	    font-size: 20px;
	    color: #4285F4;
	   	padding-right: 35px;
	   	.el-icon-circle-plus{
	   		margin-right: 35px;
	   	}
	   	i:hover{
	   		cursor: pointer;
	   	}
		}
}
</style>
