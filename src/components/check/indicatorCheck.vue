<template>
  <div id="basicIndicator" class="contentBox">
  	<div class="titIcon"><em></em><span style="font-weight: 600;">基础信息</span></div>
  	<div class="frame-content">
  		<el-form :model="indicator" label-position="left" class="demo-ruleForm" size="mini">
	      <el-row>
	        <el-col :span="8">
	        	<el-form-item label="指标名称" class="fxType">
						    <el-input class="inpframe" placeholder="请输入指标名称" @change="vmodel('indicator.name')" v-model="indicatorCheckObj.name"></el-input>
						</el-form-item>
			    </el-col> 
			    <!-- <el-col :span="8">
	        	<el-form-item label="指标等级" class="fxType">
						  <el-select class="inpframe" @change="vmodel('indicator.level')" v-model="indicatorCheckObj.level" placeholder="请选择指标等级">
						   	<el-option v-for="item in indicatorArr.level" :key="item.id" :label="item.name" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
			    </el-col> -->
			    <el-col :span="8">
	        	<el-form-item label="风险大类" class="fxType">
						  <el-select class="inpframe" @change="vmodel('indicator.riskId')" v-model="indicatorCheckObj.riskId" placeholder="请选择指标所属风险大类">
						   	<el-option v-for="item in indicatorArr.risk" :key="item.id" :label="item.name" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
			    </el-col>
			    <el-col :span="8">
	        	<el-form-item label="数据类型" class="fxType">
						  <el-select class="halfframe" @change="vmodel('indicator.dataType')" v-model="indicatorCheckObj.dataType" placeholder="请选择指标值类型">
						   	<el-option v-for="item in indicatorArr.dataType" :key="item.id" :label="item.name" :value="item.id"></el-option>
						  </el-select>
						  <el-select class="halfframe" @change="vmodel('indicator.dataUnit')" v-model="indicatorCheckObj.dataUnit" placeholder="请选择指标单位">
						   	<el-option v-for="item in indicatorArr.dataUnit" :key="item.id" :label="item.name" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
			    </el-col>
	      </el-row>
	      <el-row>
			    <el-col :span="8">
	        	<el-form-item label="同环比计算方式" class="fxType">
						  <el-select class="inpframe" @change="vmodel('indicator.thb')" v-model="indicatorCheckObj.thb" placeholder="请选择同环比计算方式" style="width:58.5%;">
						   	<el-option v-for="item in indicatorArr.thb" :key="item.id" :label="item.name" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
			    </el-col> 
			    <el-col :span="8">
	        	<el-form-item label="关联参数">
						  <el-select class="inpframe" :disabled="isShow" @change="vmodel('indicator.paramId')" v-model="indicatorCheckObj.paramId" placeholder="请选择关联参数">
						   	<el-option v-for="item in indicatorArr.param" :key="item.id" :label="item.name" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
			    </el-col>
			    <el-col :span="8">
				<el-form-item label="指标分类" class="fxType">
				  <el-select class="inpframe" @change="vmodel('indicator.category')" v-model="indicatorCheckObj.category" placeholder="请选择指标分类">
				   	<el-option v-for="item in indicatorArr.category" :key="item.id" :label="item.name" :value="item.id"></el-option>
				  </el-select>
				</el-form-item>
	      	</el-col>
	      </el-row>
	      <el-row>
	        <el-col :span="8">
	        	<el-form-item label="是否为风险偏好指标" class="fxType">
						  <el-radio-group :disabled="disabled" class="radioframe" @change="vmodel('indicator.isPref')" v-model="indicatorCheckObj.isPref">
								<el-radio :label="a">是</el-radio>
								<el-radio :label="b">否</el-radio>
							</el-radio-group>
						</el-form-item>
			    </el-col> 
			    <el-col :span="8">
	        	<el-form-item label="是否立即启用指标" class="fxType">
						  <el-radio-group :disabled="disabled" class="radioframe" @change="vmodel('indicator.status')" v-model="indicatorCheckObj.status">
								<el-radio :label="a">是</el-radio>
								<el-radio :label="b">否</el-radio>
							</el-radio-group>
						</el-form-item>
			    </el-col>
			    <el-col :span="8">
	        	<el-form-item label="是否为风险限额指标" class="fxType">
						  <el-radio-group :disabled="disabled" class="radioframe" @change="vmodel('indicator.isLimit')" v-model="indicatorCheckObj.isLimit">
								<el-radio :label="a">是</el-radio>
								<el-radio :label="b">否</el-radio>
							</el-radio-group>
						</el-form-item>
			    </el-col> 
	        <!-- <el-col :span="8">
	        	<el-form-item label="是否为红黄蓝风险指标" class="fxType">
						  <el-radio-group :disabled="disabled" class="radioframe" @change="vmodel('indicator.isRyb')" v-model="indicatorCheckObj.isRyb">
								<el-radio :label="a">是</el-radio>
								<el-radio :label="b">否</el-radio>
							</el-radio-group>
						</el-form-item>
			    </el-col>  -->
			  </el-row>
	      <el-row> 
	        <el-col :span="8">
	        	<el-form-item label="是否为东方风险偏好指标" class="fxType">
						  <el-radio-group :disabled="disabled" class="radioframe" @change="vmodel('indicator.isDf')" v-model="indicatorCheckObj.isDf">
								<el-radio :label="a">是</el-radio>
								<el-radio :label="b">否</el-radio>
							</el-radio-group>
						</el-form-item>
			    </el-col> 
			    <el-col :span="8">
	        	<el-form-item label="是否为可资本化风险指标" class="fxType">
						  <el-radio-group :disabled="disabled" class="radioframe" @change="vmodel('indicator.isCapital')" v-model="indicatorCheckObj.isCapital">
								<el-radio :label="a">是</el-radio>
								<el-radio :label="b">否</el-radio>
							</el-radio-group>
						</el-form-item>
			    </el-col> 
	      </el-row>
			</el-form> 
  	</div>
  	
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	export default {
		data(){
			return {
				a:'1',
				b:'0',
				disabled:true,
				isShow:false,
				indicatorCheckObj:{}
			}
		},
		methods:{
			...mapActions(['setData']),
			/**
    	 * 初始化获取风险大类和关联参数信息
    	 */
    	getCommData(){
    		//新建拿值
    		if(!this.$route.params.editid){
    			this.axios.post('/indicator/comm',{headers:{'Content-Type':'application/json'}}).then((res)=>{
		  			if(res.code==200){
							this.setData({'indicatorArr.risk':res.data.kind})
							this.setData({'indicatorArr.upCalibre':res.data.upCalibre})
		  				this.setData({'indicatorArr.param':res.data.param})
		  				this.setData({'indicatorArr.sentInfo.company':res.data.company})
		  				this.setData({'indicatorArr.sentInfo.codpNames':res.data.codpNames})
		  				this.setData({'indicatorArr.sentInfo.monthArr':res.data.month})
		  				this.setData({'indicatorArr.sentInfo.quarterArr':res.data.quarter})
		  				this.setData({'indicatorArr.sentInfo.yearArr':res.data.year})
		  				this.setData({'indicatorArr.sentInfo.halfyearArr':res.data.halfyear})
		  			}
					})
    		}
    		
    	},
    	vmodel(key){
    		var obj = {}
    		const arr = key.split(".");
    		obj[key] = this.indicatorCheckObj[arr[1]]
    		this.setData(obj)
    	}
		},
		created(){
			this.getCommData()
			this.indicatorCheckObj = JSON.parse(JSON.stringify(this.indicator))
		},
		computed:{
   		...mapState(['indicator','indicatorRes','indicatorArr','indicatorArrRes']),
   	},
		watch:{
			'indicator':{
				handler(newVal,oldVal){
					this.indicatorCheckObj = JSON.parse(JSON.stringify(newVal)); 
				},
				deep:true
			},
			'indicator.dataType':{
				handler(newVal){
					var dataUnit;
					var	operator;
					if(newVal==1){
								this.isShow = false
								dataUnit = [{
											      	name:'%',
											      	id:'1'
											      },{
											      	name:'次/季度',
											      	id:'2'
											      },{
											      	name:'年',
											      	id:'4'
											      },{
													  	name: '元',
													  	id: '5'
													  },{
													  	name: '次/月',
													  	id: '6'
													  },{
													  	name: '件/月',
													  	id: '7'
													  },{
													  	name: '件/季',
													  	id: '8'
													  },{
													  	name: '次/年',
													  	id: '10'
													  },{
													  	name: '件/年',
													  	id: '11'
													  },{
													  	name: 'PT',
													  	id: '12'
													  },{
											      	name:'无单位',
											      	id:'3'
											      }]
								operator = [{
										  			name:'大于',
										  			id:'1'
										  		},{
										  			name:'大于等于',
										  			id:'2'
										  		},{
										  			name:'小于',
										  			id:'3'
										  		},{
										  			name:'小于等于',
										  			id:'4'
										  		},{
										  			name:'等于',
										  			id:'5'
										  		},{
										  			name:'不等于',
										  			id:'6'
										  		}]
					}
					if(newVal==2){
								this.indicatorCheckObj.paramId = ''
								this.setData({'indicator.paramId':this.indicatorCheckObj.paramId})
								this.isShow = true
								dataUnit = [{
											      	name:'等级',
											      	id:'9'
											      }]
								operator = [{
											  			name:'包含',
											  			id:'7'
											  		}]
					}
					this.setData({'indicatorArr.threshold.operator':operator})
					this.setData({'indicatorArr.dataUnit':dataUnit})
					this.setData({'indicatorArr.threshold.dataUnit':dataUnit})
				},
				immediate:true,
				deep:true
			},
			'indicatorCheckObj.dataType':{
				handler(newVal,oldVal){
					if(oldVal){
						this.indicatorCheckObj.dataUnit = ''
						this.setData({'indicator.dataUnit':this.indicatorCheckObj.dataUnit})
					}
					if(newVal){
						this.disabled = false
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
  #basicIndicator{
  	margin-top:70px;
  }
</style>
