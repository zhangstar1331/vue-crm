<template>
	<div id="quoteAssignCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="quoteAssignForm" label-position="left" ref="quoteAssignForm" size="mini">
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="时间">
								    <el-date-picker v-model="batch" @change="changeBatch" type="month" placeholder="时间" :picker-options="endDatePicker"></el-date-picker>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="适用对象" lable-width="100px">
								    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
								    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="风险分类">
								    <el-select v-model="riskType.region" @change="changeDepart" placeholder="请选择风险分类">
								    	<el-option v-for="item in riskType.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="指标等级">
			                    	<el-select v-model="quoteLevel.region" @change="changeDepart" placeholder="请选择指标等级">
								    	<el-option v-for="item in quoteLevel.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="预警状态">
								    <el-select v-model="warnStatus.region" @change="changeDepart" placeholder="请选择预警状态">
								    	<el-option v-for="item in warnStatus.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="报送频率">
								    <el-select v-model="bsTimes.region" @change="changeApply" placeholder="请选择报送频率">
								    	<el-option v-for="item in bsTimes.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row> 
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="采集方式">
			                    	<el-select v-model="gatherMethod.region" @change="changeDepart" placeholder="请选择采集方式">
								    	<el-option v-for="item in gatherMethod.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="报送部门">
								    <el-select v-model="testDepartment.region" @change="changeDepart" placeholder="请选择报送部门">
								    	<el-option v-for="item in testDepartment.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="是否风险偏好">
								    <el-select v-model="isPerfer.region" @change="changeDepart" placeholder="请选择是否风险偏好">
								    	<el-option v-for="item in isPerfer.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="是否风险限额">
								    <el-select v-model="isLimit.region" @change="changeApply" placeholder="请选择是否风险限额">
								    	<el-option v-for="item in isLimit.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="是否红黄蓝">
								    <el-select v-model="isRyb.region" @change="changeDepart" placeholder="请选择是否红黄蓝">
								    	<el-option v-for="item in isRyb.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
							<el-col :span="8" class="newwidth">
			                    <el-form-item label="是否东方风险偏好">
			                    	<el-select v-model="isDfperfer.region" @change="changeDepart" placeholder="请选择是否红黄蓝">
								    	<el-option v-for="item in isDfperfer.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="是否可资本化">
								    <el-select v-model="isCapital.region" @change="changeDepart" placeholder="请选择是否可资本化">
								    	<el-option v-for="item in isCapital.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="指标名称">
								    <el-input v-model="quoteAssignForm.quoteName" @change='getQuoteName' placeholder="搜索" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
		                		<el-button type="primary" class="search" @click="searchData" style="margin-left:1%">查询</el-button>
		                		<el-button type="primary" class="search" @click="searchData">导出</el-button>
			                </el-col>
			            </el-row>
			        </el-form>
			    </div>
			</template>
	   </el-form>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
		props:['isFlag'],
	    data () {
	      return {
	      	quoteAssignForm:{
	      		quoteName:''//指标名称
	      	},
	      	batch:'',//时间
	      	// 适用对象
	        application:{
	          	region: '全部',
	          	unitsData:[{
		          	name:'全部',
		          	id:'0'
		        }]
	        },
	        //风险分类
	        riskType:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部',
		          	id:'0'
		        },{
		          	name:'可资本化',
		          	id:'1'
		        }]
	        },
	        // 指标等级
	        quoteLevel:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部',
		          	id:'0'
		        },{
		          	name:'一类',
		          	id:'1'
		        },{
		          	name:'二类',
		          	id:'2'
		        }]
	        },
	        // 预警状态
	        warnStatus:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部',
		          	id:'0'
		        },{
		          	name:'红',
		          	id:'1'
		        },{
		          	name:'黄',
		          	id:'2'
		        },{
		          	name:'蓝',
		          	id:'3'
		        }]
	        },
	        // 报送频率
	        bsTimes: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:'0'
	          },{
	          	name:'月度',
	          	id:'1'
	          },{
	          	name:'季度',
	          	id:'2'
	          },{
	          	name:'半年度',
	          	id:'4'
	          },{
	          	name:'年度',
	          	id:'3'
	          }]
	        },
	        // 采集方式
	        gatherMethod: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:'0'
	          },{
	          	name:'人工呈报',
	          	id:'1'
	          },{
	          	name:'系统对接',
	          	id:'2'
	          }]
	        },
	        // 报送部门
	        testDepartment:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部',
		          	id:'0'
		        }]
	        },
	        // 是否风险偏好
	        isPerfer: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:'0'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'2'
	          }]
	        },
	        // 是否风险限额
	        isLimit: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:'0'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'2'
	          }]
	        },
	        // 是否红黄蓝
	        isRyb: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:'0'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'2'
	          }]
	        },
	        // 是否东方风险偏好
	        isDfperfer: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:'0'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'2'
	          }]
	        },
	        // 是否可资本化
	        isCapital: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:'0'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'2'
	          }]
	        },
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度'
	        },
	        endDatePicker:this.processDate(),
	        checkData:{
	            distribute:1,//任务状态
	            submission:'',//派发状态
	            applayObject:'',//适用对象 
	            monitorDepartment:'',//监测部门
	            batch:'',//报送批次
	            pageNo:'1',
	            pageSize:'10'
	        }
	      }
	    },
	    created () {
	    	// 获取适用对象、监测部门、报送批次数据
	    	this.getCommon()
	    	this.searchData()
	    },
	    methods: {
	    	// 获取指标名称
	      	getQuoteName(val){
				this.checkData.name = val
	      	},
	      	//适用对象
	      	changeApply(val){
	      		this.checkData.applayObject = val
	      		// 获取报送部门
	      		this.getDepartMent(val)
	      		sessionStorage.askData = JSON.stringify(this.checkData)
	      	},
	      	//监测部门
	      	changeDepart(val){
	      		this.checkData.monitorDepartment = val
	      		sessionStorage.askData = JSON.stringify(this.checkData)
	      	},
	      	//报送批次
	      	changeBatch(val){
	      		if(val != null){
		  			this.checkData.batch = formatDate(val,'yyyy-MM');
		  			this.checkData.batch = this.checkData.batch.split('-').join('')
		  		}else{
		  			this.checkData.batch = '';
		  		}
		  		sessionStorage.askData = JSON.stringify(this.checkData)
	      	},
	      	// 获取适用对象、监测部门、报送批次数据
	      	getCommon(){
				this.axios.post('indjob/comm',qs.stringify({}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
		   			if(res.code == 200){
		   				// 适用对象
			   			this.application.unitsData = this.application.unitsData.concat(res.data.company)
						this.taskName = res.data.codpNames
						sessionStorage.setItem('taskName',JSON.stringify(this.taskName)) 
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
			},
			// 报送批次
	      	processDate(){
		        return {
		          disabledDate(time){
		            return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
		          }
		        }
		    },
		    // 报送部门根据适用对象变化
	      	getDepartMent(str){
			  	this.axios.post('indicator/department',qs.stringify({company:str})).then((res)=>{
		   			if(res.code == 200){
		   				if(res.data!=null){
		   					this.testDepartment.region = '全部'
							this.checkData.monitorDepartment =''
		   					this.testDepartment.unitsData = [{ name:'全部', id:'' }]
		   					this.testDepartment.unitsData = this.testDepartment.unitsData.concat(res.data)
		   				} else{
		   					this.testDepartment.region = '全部'
							this.checkData.monitorDepartment =''
		   					this.testDepartment.unitsData = [{ name:'全部', id:'' }]
		   				}
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
			},
			searchData () {
	      		// 获取表格数据
	      		// if(this.isFlag == '1'){
	      		// 	this.checkData.submission=1
	      		// } else if(this.isFlag == '2'){
	      		// 	this.checkData.submission=2
	      		// } else if(this.isFlag == '3'){
	      		// 	this.checkData.submission=0
	      		// }
	      		// sessionStorage.askData = JSON.stringify(this.checkData)
	      		// this.axios.post('indjob/joblist',qs.stringify(this.checkData)).then((res)=>{
		       //      if(res.code == 200){
		       //      	if(res.data != null){
	      		// 			Bus.$emit('formDatas',res.data)
	      		// 		}else{
	      		// 			Bus.$emit('formDatas',res.data);
	      		// 		}
		       //      }else{
		       //        	this.$alert(res.message, '提示', {
		       //            confirmButtonText: '确定'
		       //          })
		       //      }
		       //  })
	      	},
	    }
	}
</script>

<style lang="scss">
#quoteAssignCheck{
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
		text-align:right;
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-top:3px;
	    margin-right: 5px;
	    margin-bottom: 40px;
	    padding:0;
    	font-size: 12px;
	}
}	
</style>
