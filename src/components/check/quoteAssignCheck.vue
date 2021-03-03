<template>
	<div id="quoteAssignCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="quoteAssignForm" label-position="left" ref="quoteAssignForm" size="mini">
			            <el-row>
							<el-col :span="8">
			                    <el-form-item label="适用对象">
								    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
								    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="报送部门">
								    <el-select v-model="testDepartment.region" @change="changeDepart" placeholder="请选择检测部门">
								    	<el-option v-for="item in testDepartment.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="报送批次">
								    <el-date-picker v-model="batch" @change="changeBatch" type="month" placeholder="报送批次" :picker-options="endDatePicker"> </el-date-picker>
								</el-form-item>
			                </el-col>
			            </el-row>
			        </el-form>
			    </div>
			    <el-button type="primary" class="search" @click="searchData">查询</el-button>
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
	      	quoteAssignForm:{},
	      	// 适用对象
	        application:{
	          	region: '全部',
	          	unitsData:[{
		          	name:'全部',
		          	id:''
		        }]
	        },
	        // 报送部门
	        testDepartment:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部',
		          	id:''
		        }]
	        },
	        // 报送批次
	        batch:'',
	        taskName:{},
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
	      	//适用对象
	      	changeApply(val){
	      		this.checkData.applayObject = val
	      		// 获取报送部门
	      		if(val!==''){
	      			this.getDepartMent(val)
	      		}
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
	      		if(this.isFlag == '1'){
	      			this.checkData.submission=1
	      		} else if(this.isFlag == '2'){
	      			this.checkData.submission=2
	      		} else if(this.isFlag == '3'){
	      			this.checkData.submission=0
	      		}
	      		sessionStorage.askData = JSON.stringify(this.checkData)
	      		this.axios.post('indjob/joblist',qs.stringify(this.checkData)).then((res)=>{
		            if(res.code == 200){
		            	if(res.data != null){
	      					Bus.$emit('formDatas',res.data)
	      				}else{
	      					Bus.$emit('formDatas',res.data);
	      				}
		            }else{
		              	this.$alert(res.message, '提示', {
		                  confirmButtonText: '确定'
		                })
		            }
		        })
	      	},
	    }
	}
</script>

<style lang="scss">
#quoteAssignCheck{
  .ids .zdNo .el-form-item__content .el-select{
    width: 37%;
  }
  .el-input-group__append{
  	background: #4285F4;
    width: 20%;
    text-align: center;
    font-size: 16px;
    color: #fff;
  }
  	.iptFoor input{
		margin-left: 10%;
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
		font-weight: normal;
		padding:0 4% 0 5%;
	}
	.el-col:first-child{
		text-align: left;
	}
	.el-col:last-child{
		text-align: right;
	}
	.el-col:first-child .el-form-item__label{
		padding-left: 0;
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
	.zdNo .el-form-item__label{
		padding-left: 5%;
		padding-right: 4%;
	}
	.zdNo .el-form-item__content .el-select{
		width: 50%;
	}
	.inOdd .el-form-item__content .el-select{
		width: 50%;
		float: left;
	}
}	
</style>
