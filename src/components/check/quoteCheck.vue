<template>
	<div id="quoteCheck">
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div class="ids">
		        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item label="风险大类">
							    <el-select v-model="orgnize.region" @change="changeArea"  placeholder="请选择风险大类">
							    	<el-option v-for="item in orgnize.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="启用时间">
							     <el-date-picker type="date" @change="changeDate" placeholder="选择日期" v-model="startTime"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="适用对象">
							    <el-select v-model="SuitObj.region" @change="changeSuit" placeholder="请选择适用对象">
							    	<el-option v-for="item in SuitObj.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item label="报送部门">
							    <el-select v-model="bsDep.region"  @change="changeDepart" placeholder="请选择报送部门 ">
							    	<el-option v-for="item in placeDatas.unitsData" id="rangeArea" :key="item.id" :label="item.name" :value="item.id"> </el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="报送频率">
							    <el-select v-model="bsTimes.region"  @change="changeSelect" placeholder="请选择报送频率 ">
							    	<el-option v-for="item in bsTimes.unitsData" id="rangeArea" :key="item.id" :label="item.name" :value="item.id"> </el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <!-- <el-col :span="8">
		                    <el-form-item label="指标等级">
							    <el-select v-model="statusDatas.region" @change="changeStatus"  placeholder="请选择指标等级">
							    	<el-option v-for="item in statusDatas.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col> -->
		                <el-col :span="8" v-if="this.isFlag == 2">
		                    <el-form-item label="停用时间" >
							     <el-date-picker type="date" @change="changeEndDate" placeholder="选择日期" v-model="stopTime"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-else>
		                    <el-form-item label="指标名称">
		                        <el-input v-model="dengmiQueryForm.wgName" @change = 'changeName' placeholder="请输入指标名称"></el-input>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		                <el-col :span="8" v-if="this.isFlag == 2">
		                    <el-form-item label="指标名称">
		                        <el-input v-model="dengmiQueryForm.wgName" @change = 'changeName' placeholder="请输入指标名称"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8">
		                </el-col>
		            </el-row>
		        </el-form>
		    </div>
		    <el-button type="primary" class="search" @click.native="searchData" style="margin:-5px 5px 0 0">查询</el-button>
		</template>
	    </el-form-item>
	   </el-form>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
	import {mapState,mapActions} from 'vuex'
	export default {
		props:['isFlag'],
	    data () {
	      return {
	      	wgsName:'',
	        formData: {},
	        form: {},
	        handleData:[],
	        orgnize: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:''
	          }]
	        },
	        zhiduNo:{
	           user: '',
		        region: '',
		        unitsData:[]
	        },
	        SuitObj:{
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	code:''
	          }]
	        },
	        bsDep:{
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	code:''
	          }]
	        },
	        bsTimes:{
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	id:''
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
	        statusDatas:{
	          user: '',
	          region: '全部',
	          unitsData:[{ name:'全部', id:'' },{ name:'一级指标', id:'1' },{ name:'二级指标', id:'2'}]
	        },
	        stopTime:'',
	        startTime:'',
	        placeDatas:{
	        	user: '',
		        region: '  ',
		        unitsData:[
		            {id: '',name: '全部'},
	        	],
	        },
	        dengmiQueryForm:{
	            wgName:'',
	        },
	        askData:{
	      		riskId:'',
	      		department:'',
	      		startDate:'',
	      		name:'',
	      		// level:'',
	      		company:'',
	      		frequency:'',
	      		stopDate:'',
	      		pageNo:'1',
	      		pageSize:'10'
	        }
	      }
	    },
	    created () {
	    	this.getBaseInfo()
	    },
	    methods: {
	      	//获取基本信息
			getBaseInfo(){
			this.axios.post('indicator/queryComm',JSON.stringify({}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	   			if(res.code == 200){
	   				this.orgnize.unitsData = this.orgnize.unitsData.concat(res.data.kind)
	   				this.SuitObj.unitsData = this.SuitObj.unitsData.concat(res.data.company)
	   			}else{
	   				
	   			}
		   	})
		  },
		  getDepartMent(str){
		  	this.axios.post('indicator/department',qs.stringify({company:str})).then((res)=>{
	   			if(res.code == 200){
	   				this.placeDatas.unitsData = [{ name:'全部', id:'' }];
	   				this.placeDatas.unitsData = this.placeDatas.unitsData.concat(res.data)
	   			}else{
	   				
	   			}
		   	})
		  },
	      //风险大类
	      changeArea(val){
	      		this.askData.riskId = val+'';
	      },
	      //启用时间
	      changeDate(val){
	      	if(val != null){
	      		this.askData.startDate = formatDate(val,'yyyy-MM-dd');
	      	}else{
	      		this.askData.startDate = '';
	      	}
	      },
	      //报送频率
	      changeSelect(val){
	      	this.askData.frequency = val;
	      },
	      //适用对象
	      changeSuit(val){
	      		this.askData.company = val;
	      		//获取报送部门
	      		this.getDepartMent(val)
	      },
	      //报送部门
	      changeDepart(val){
	      		this.askData.department = val;
	      },
	      //指标等级
	      changeStatus(val){
	      		this.askData.level = val;
	      },
	      //停用时间
	      changeEndDate(val){
	      	if(val != null){
	      		this.askData.stopDate = formatDate(val,'yyyy-MM-dd');
	      	}else{
	      		this.askData.stopDate = '';
	      	}
	      },
	      //指标名称
	      changeName(){
	      		this.askData.name = this.dengmiQueryForm.wgName
	      },
	      searchData(){
	      	this.askData.pageNo = '1';
	      	if(this.isFlag == '1'){
	      			this.askData.stopDate = '';
	      			this.askData.status = '1';
		      		//status:1现行 历史status:0
		      		this.axios.post('indicator/query',JSON.stringify(this.askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
			   			if(res.code == 200){
			   				this.$emit('nowQuote',res.data)
			   				Bus.$emit('askData',this.askData)
			   			}else{
			   				
			   			}
				   	})
		      	}else{
		      		this.askData.status = '0';
		      		this.axios.post('indicator/query',JSON.stringify(this.askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
			   			if(res.code == 200){
			   				this.$emit('historyQuote',res.data)
			   				Bus.$emit('askData',this.askData)
			   			}else{
			   				
			   			}
				   	})
		      	}
		    }
	    },
	    watch:{
	    	'SuitObj.region'(newVal,oldVal){
    			if(!newVal){
    				this.bsDep.region = '全部'	
    				this.placeDatas.unitsData = [{ name:'全部', id:'' }]
    				this.askData.company = ''
    				this.askData.department = ''
    			}
    		}
	    }
	  }
</script>

<style lang="scss">
#quoteCheck{
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
