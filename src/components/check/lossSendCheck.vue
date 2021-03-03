<template>
	<div id="lossSendCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="lossSendForm" label-position="left" ref="lossSendForm" size="mini">
			            <el-row>
			            	<el-col :span="8" v-if="isFlag !== 2">
			                    <el-form-item label="损失事件编号">
								    <el-input v-model="lossSendForm.number" @change='getNumber' placeholder="请输入编号" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="事件名称">
								    <el-input v-model="lossSendForm.name" @change='getName' placeholder="请输入关键词" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="事件所属机构">
								    <el-select v-model="lossSendForm.company" placeholder="请选择事件所属机构">
								    	<el-option :value="lossSendForm.company" style="height:auto;background-color:#fff;">
								    		<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id"></el-tree>
								    	</el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            	<el-col :span="8">
			                    <el-form-item label="报送类型">
			                    	<el-select v-model="sendType.region" @change="changeSendType" placeholder="请选择报送类型">
								    	<el-option v-for="item in sendType.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="事件类型">
								    <el-select v-model="incidentType.region" @change="changeIncidentType" placeholder="请选择事件类型">
								    	<el-option v-for="item in incidentType.unitsData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="发现方式">
								    <el-select v-model="discoverWay.region" @change="changeDiscoverWay" placeholder="请选择发现方式">
										<el-option v-for="item in discoverWay.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="损失总额区间">
			                    	<el-input v-model="lossSendForm.priceStart" @change='getPriceStart' placeholder="请输入损失总额" style="float:left;width:45%"></el-input>
			                    	<span style="float:left;width:10%;text-align:center">至</span>
			                    	<el-input v-model="lossSendForm.priceEnd" @change='getPriceEnd' placeholder="请输入损失总额" style="float:right;width:45%"></el-input>
								</el-form-item>
			                </el-col>
			                <el-col :span="8" v-if="isStore == 1">
			                    <el-form-item label="是否更新">
								    <el-select v-model="isUpdate.region" @change="changeisUpdate" placeholder="请选择是否更新">
										<el-option v-for="item in isUpdate.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="事件发生期间">
								    <el-date-picker v-model="lossSendForm.subDateBegin" @change="changeHappenBegin" placeholder="开始时间" :picker-options="starDatePicker" style="float:left;width:45%"></el-date-picker>
								    <span style="float:left;width:10%;text-align:center">至</span>
								    <el-date-picker v-model="lossSendForm.subDateEnd" @change="changeHappenEnd" placeholder="结束时间" :picker-options="endDatePicker" style="float:right;width:45%"></el-date-picker>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="事件报告期间">
								    <el-date-picker v-model="lossSendForm.subDateBegin1" @change="changeReportBegin" placeholder="开始时间" :picker-options="starDatePicker1" style="float:left;width:45%"></el-date-picker>
								    <span style="float:left;width:10%;text-align:center">至</span>
								    <el-date-picker v-model="lossSendForm.subDateEnd1" @change="changeReportEnd" placeholder="结束时间" :picker-options="endDatePicker1" style="float:right;width:45%"></el-date-picker>
								</el-form-item>
			                </el-col>
			            </el-row>
			        </el-form>
			    </div>
			    <el-button type="primary" class="search" @click="goSearch">查询</el-button>
			</template>
	   </el-form>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import {formatDateM} from 'src/utils/utils.js'
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		props:['isFlag','isStore'],
	    data () {
	      return {
	      	lossSendForm:{
	      		number:'',//损失事件编号
	      		name:'',//损失事件名称
	      		company:'全部',
	      		priceStart:'',//损失总额区间开始
	      		priceEnd:'',//损失总额区间结束
	      		subDateBegin:'',
	      		subDateEnd:'',
	      		subDateBegin1:'',
	      		subDateEnd1:''
	      	},
	        // 报送类型
	        sendType:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
		          	name:'季报',
		          	id:1
		        },{
		          	name:'专报',
		          	id:2
		        }]
	        },
	        // 事件类型
	        incidentType:{
				region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
		          	name:'外部事件',
		          	id:1
		        },{
		          	name:'业务活动',
		          	id:2
		        },{
		          	name:'业外案件',
		          	id:3
		        },{
		          	name:'业内案件',
		          	id:4
		        },{
		          	name:'行政处罚',
		          	id:5
		        },{
		          	name:'人员风险',
		          	id:6
		        },{
		          	name:'信息系统风险',
		          	id:7
		        },{
		          	name:'流程风险',
		          	id:8
		        }]
			},
	        // 发现方式
	        discoverWay:{
				region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
		          	name:'外部检查',
		          	id:1
		        },{
		          	name:'内部审计',
		          	id:2
		        },{
		          	name:'上级检查',
		          	id:3
		        },{
		          	name:'公司自查',
		          	id:4
		        },{
		          	name:'客户投诉',
		          	id:5
		        },{
		          	name:'举报',
		          	id:6
		        },{
		          	name:'其他',
		          	id:7
		        }]
			},
			isUpdate:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
		          	name:'是',
		          	id:1
		        },{
		          	name:'否',
		          	id:2
		        }]
	        },
	      	subDateBegin:'',
      		subDateEnd:'',
      		subDateBegin1:'',
      		subDateEnd1:'',
	        starDatePicker:{
  				disabledDate: (time) => {
	            	if (this.lossSendForm.subDateEnd) {
                        return time.getTime() > this.lossSendForm.subDateEnd;
                    }
	          	},
  			},
  			endDatePicker:{
  				disabledDate: (time) => {
	            	return time.getTime() < this.lossSendForm.subDateBegin
	          	},
  			},
  			starDatePicker1:{
  				disabledDate: (time) => {
	            	if (this.lossSendForm.subDateEnd1) {
                        return time.getTime() > Date.now() || time.getTime() > this.lossSendForm.subDateEnd1;
                    } else {
                        return time.getTime() > Date.now()
                    }
	          	},
  			},
  			endDatePicker1:{
  				disabledDate: (time) => {
	            	return time.getTime() < this.lossSendForm.subDateBegin1 || time.getTime() > Date.now()
	          	},
  			},
	        checkData:{
	        	status:this.isFlag,
	            pageNo:1,
	            pageSize:10
	        },
	        treeKey:'',
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
	      }
	    },
	    created () {
	    	if(this.$route.query.belongCompany!==undefined){
    			this.checkData.belongCompany = this.$route.query.belongCompany
    			var date = new Date()
          		var year = date.getFullYear() 
          		this.lossSendForm.subDateBegin = year + '-01-01'
          		this.lossSendForm.subDateEnd = year + '-12-31'
          		this.subDateBegin = this.lossSendForm.subDateBegin.split('-').join('')
          		this.subDateEnd = this.lossSendForm.subDateEnd.split('-').join('')
    			this.checkData.happenPeriod = this.subDateBegin + '-' + this.subDateEnd
    		}
    		if(this.$route.query.company!==undefined){
    			if(this.$route.query.company == '合计'){
    				this.lossSendForm.company = '全部'
    				this.checkData.company = '全部'
    			} else{
    				this.lossSendForm.company = this.$route.query.company
    				this.checkData.company = this.$route.query.company
    			}
    		}
    		if(JSON.parse(sessionStorage.getItem('askData'+this.isFlag))){
    			this.checkData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
	    		this.currentPage = this.checkData.pageNo
    			this.checkData.status = this.isFlag
    			this.lossSendForm.number = this.checkData.number === undefined?'':this.checkData.number
    			this.lossSendForm.name = this.checkData.name === undefined?'':this.checkData.name
    			this.sendType.region = this.checkData.submissionType === undefined?'全部':this.checkData.submissionType
    			this.incidentType.region = this.checkData.incidentType === undefined?'全部':this.checkData.incidentType
    			this.discoverWay.region = this.checkData.discoverWay === undefined?'全部':this.checkData.discoverWay
    			this.lossSendForm.company = this.checkData.company === undefined?'全部':this.checkData.company
    			if(this.checkData.lossMoney){
    				this.lossSendForm.priceStart = this.checkData.lossMoney.split('-')[0]
    				this.lossSendForm.priceEnd = this.checkData.lossMoney.split('-')[1]
    			}
    			if(this.checkData.happenPeriod){
    				var date = this.checkData.happenPeriod.split('-')[0]
    				var date1 = this.checkData.happenPeriod.split('-')[1]
    				this.lossSendForm.subDateBegin = date.substring(0,4) + '-' + date.substring(4,6) + '-' + date.substring(6,8)
	          		this.lossSendForm.subDateEnd = date1.substring(0,4) + '-' + date1.substring(4,6) + '-' + date1.substring(6,8)
	          		this.subDateBegin = this.checkData.happenPeriod.split('-')[0]
	          		this.subDateEnd = this.checkData.happenPeriod.split('-')[1]
    			}
    			if(this.checkData.reportPeriod){
    				var date = this.checkData.reportPeriod.split('-')[0]
    				var date1 = this.checkData.reportPeriod.split('-')[1]
    				this.lossSendForm.subDateBegin1 = date.substring(0,4) + '-' + date.substring(4,6) + '-' + date.substring(6,8)
	          		this.lossSendForm.subDateEnd1 = date1.substring(0,4) + '-' + date1.substring(4,6) + '-' + date1.substring(6,8)
	          		this.subDateBegin1 = this.checkData.reportPeriod.split('-')[0]
	          		this.subDateEnd1 = this.checkData.reportPeriod.split('-')[1]
    			}
    		}
	    	// 获取表格数据
	    	this.searchData(this.checkData)
	    },
	    methods: {
	    	// 损失事件编号
	    	getNumber(val){
	      		if(val == ''){
	      			delete this.checkData.number
	      		} else{
	      			this.checkData.number = val
	      		}
	      	},
	      	// 事件名称
	    	getName(val){
	      		if(val == ''){
	      			delete this.checkData.name
	      		} else{
	      			this.checkData.name = val
	      		}
	      	},
	      	// 报送类型
	      	changeSendType(val){
	      		this.checkData.submissionType = val
	      	},
	      	// 事件类型
	      	changeIncidentType(val){
	    		this.checkData.incidentType = val
	    	},
	      	// 发现方式
	      	changeDiscoverWay(val){
	      		this.checkData.discoverWay = val
	      	},
	      	// 损失总额区间开始
	      	getPriceStart(val){
	      		this.checkData.lossMoney = val + '-' + this.lossSendForm.priceEnd
	      	},
	      	// 损失总额区间结束
	      	getPriceEnd(val){
	      		this.checkData.lossMoney = this.lossSendForm.priceStart + '-'  + val
	      	},
	    	//事件发生期间开始
	      	changeHappenBegin(val){
	      		if(val != null){
	      			this.subDateBegin = formatDate(val,'yyyy-MM-dd')
		  			this.subDateBegin = this.subDateBegin.split('-').join('') 
		  		} else{
		  			this.subDateBegin = ''
		  		}
	      	},
	      	//事件发生期间结束
	      	changeHappenEnd(val){
	      		if(val != null){
		  			this.subDateEnd = formatDate(val,'yyyy-MM-dd')
		  			this.subDateEnd = this.subDateEnd.split('-').join('') 
		  		} else{
		  			this.subDateEnd = ''
		  		}
	      	},
	      	//事件报告期间开始
	      	changeReportBegin(val){
	      		if(val != null){
		  			this.subDateBegin1 = formatDate(val,'yyyy-MM-dd')
		  			this.subDateBegin1 = this.subDateBegin1.split('-').join('') 
		  		} else{
		  			this.subDateBegin1 = ''
		  		}
	      	},
	      	//事件报告期间结束
	      	changeReportEnd(val){
	      		if(val != null){
		  			this.subDateEnd1 = formatDate(val,'yyyy-MM-dd')
		  			this.subDateEnd1 = this.subDateEnd1.split('-').join('') 
		  		} else{
		  			this.subDateEnd1 = ''
		  		}
	      	},
	      	changeisUpdate(val){
	      		this.checkData.isUpdate = val
	      	},
	      	handleNodeClick(node,data) {
	      		if(node.disabled!=true){
		      		let res = this.$refs.tree.getCurrentNode(true,true)
					this.lossSendForm.company = res.name
		      		if(node.groupId!==''){
						this.checkData.belongCompany = node.groupId
						this.checkData.company = res.name
		      		} else{
		      			delete this.checkData.belongCompany
		      			delete this.checkData.company
		      		}
	      		}
			},
			getNodeInfo(node,resolve) {

			},
			connectAxios(val,node,resolve){
	  			this.node = node
			  	this.resolve = resolve
	  			var params = qs.stringify({
			        parentId: val,
			        type:8
			    })
		        this.axios.post('/rmUser/groupName', params).then((res)=>{
		        	if(node.level == 0){
		        		var arr = [{ name: '全部',groupId:''}];
		        	} else{
		        		var arr = [];
		        	}
	                if(res.data.data != null){
			          	for (var i = 0; i < res.data.data.length; i++) {
			           	var obj = new Object;
			           	obj.name = res.data.data[i].name;
			           	obj.groupId = res.data.data[i].groupId;
			           	if(res.data.notCheck != null){
			           		for (var j = 0; j < res.data.notCheck.length; j++){
			           			if(res.data.notCheck[j] == res.data.data[i].groupId){
			           				obj.disabled = true
			           			}
			           		}
			           	}
			           	arr.push(obj);
			          } 
	                }
					resolve(arr)
		        })
	  		},
	    	loadNode(node,resolve){
	    		if (node.level == 0) {
	  				this.connectAxios('1_01',node,resolve)
		        }else{
		        	var mid = node.data.groupId === undefined?'1_01':node.data.groupId
		  			this.connectAxios(mid,node,resolve)
				}
	  		},
			searchData (data) {
	      		// 获取表格数据
	      		sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(this.checkData))
	      		this.axios.post('lossincident/queryList',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
		            if(res.code == 200){
		            	if(res.data != null){
	      					Bus.$emit('lossformDatas',res.data)
	      				}
		            }else{
		              	this.$alert(res.message, '提示', {
		                	confirmButtonText: '确定'
		                })
		            }
		        })
	      	},
	      	// 查询按钮
		    goSearch(){
				this.checkData.pageNo = 1
				this.checkData.pageSize = 10
				this.currentPage = 1
				if(this.lossSendForm.priceStart == '' && this.lossSendForm.priceEnd !== ''){
					this.$alert('损失总额区间不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
				}
				if(this.lossSendForm.priceStart !== '' && this.lossSendForm.priceEnd == ''){
					this.$alert('损失总额区间不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
				}
				if(this.lossSendForm.priceStart == '' && this.lossSendForm.priceEnd == ''){
					delete this.checkData.lossMoney
				}
				if(this.lossSendForm.subDateBegin == null && this.lossSendForm.subDateEnd !== null){
      				this.$alert('开始时间不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		} else if(this.lossSendForm.subDateBegin !== null && this.lossSendForm.subDateEnd == null){
      				this.$alert('结束时间不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		}
	      		if(this.lossSendForm.subDateBegin1 == null && this.lossSendForm.subDateEnd1 !== null){
      				this.$alert('开始时间不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		} else if(this.lossSendForm.subDateBegin1 !== null && this.lossSendForm.subDateEnd1 == null){
      				this.$alert('结束时间不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		}
	      		if(this.subDateBegin!==''&&this.subDateEnd!==''){
	    			this.checkData.happenPeriod = this.subDateBegin+'-'+this.subDateEnd
	    		} else if(this.subDateBegin==''&&this.subDateEnd==''){
	    			delete this.checkData.happenPeriod
	    		}
	    		if(this.subDateBegin1!==''&&this.subDateEnd1!==''){
	    			this.checkData.reportPeriod = this.subDateBegin1+'-'+this.subDateEnd1
	    		} else if(this.subDateBegin1==''&&this.subDateEnd1==''){
	    			delete this.checkData.reportPeriod
	    		}
				this.searchData(this.checkData)
			},
	    }
	}
</script>

<style lang="scss">
#lossSendCheck{
  	.el-input-group__append{
	  	background: #4285F4;
	    width: 20%;
	    text-align: center;
	    font-size: 16px;
	    color: #fff;
	}
	.el-col .el-input input{
		height: 32px;
		line-height: 32px;
	}
	.el-form-item{
		margin-right:18px;
		margin-bottom: 20px;
		width: 100%;
		.el-form-item__content{
			width: 70%;
			.el-select--mini{
				width: 100%;
			}
			.el-date-editor{
				width: 100%;
			}
		}
	}
	.el-form-item__label{
		width:28%;
		line-height:32px;
		font-weight: normal;
		padding:0 4% 0 0;
		text-align:right
	}
	.newwidth .el-form-item__label{
		padding:0
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-top:20px;
	    margin-right: 5px;
	    padding:0;
    	font-size: 12px;
	}
}	
</style>
