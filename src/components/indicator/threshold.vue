<template>
	<div id="thresholdChild">
		<el-row>
	    	<el-col style="width:100%;text-align: center;margin-bottom:20px;">
	    		<span v-if="relation==1">【且】</span>
	    		<span v-if="relation==2">【或】</span>
	    	</el-col>
    	</el-row>
		<el-row v-if="indicator.dataType == 1" class="threshold numType">
	    	<el-col class="thresholdLable">
	    	<span v-if="label.name" :style="{background:label.color,color:'white'}">{{label.name}}</span>
	    	<span v-else style="opacity:0;">1111 </span>
	    	</el-col>
		    <el-col>
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'indType')" v-model="thresholdObj.indType" placeholder="全部子类指标">
			   	<el-option v-for="item in indicatorArr.threshold.indType" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col v-if="!isCustome">
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'operator')" v-model="thresholdObj.operator" placeholder="">
			   	<el-option v-for="item in indicatorArr.threshold.operator" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col v-if="!isCustome">
	    	<el-form-item label="">
			  <el-select class="inpframe" :disabled="hasParam" @change="(value)=>getBlurData(value,'param')" v-model="thresholdObj.param" placeholder="">
			   	<el-option v-for="item in indicatorArr.threshold.param" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col class="asplice" v-if="!isCustome">
	    	<el-form-item label="">
			  <el-select class="inpframe" :disabled="isCan" @change="(value)=>getBlurData(value,'sign')" v-model="thresholdObj.sign" placeholder="">
			   	<el-option v-for="item in indicatorArr.threshold.sign" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col>
		    <el-col class="subInput" v-if="!isCustome">
	    	<el-form-item label="">
			  <el-input placeholder="" @change="(value)=>getBlurData(value,'value')" v-model="thresholdObj.value"></el-input>
			</el-form-item>
		    </el-col> 
		    <el-col>
	    	<el-form-item label="" v-if="!isCustome">
			  <el-select class="inpframe" :disabled="isDan" @change="(value)=>getBlurData(value,'dataUnit')" v-model="thresholdObj.dataUnit" placeholder="">
			   	<el-option v-for="item in dataUnit" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col>
		    <el-col class="custome" v-if="isCustome">
	    	<el-form-item label="">
			  <el-input placeholder="" @change="(value)=>getBlurData(value,'expression')" v-model="thresholdObj.expression"></el-input>
			</el-form-item>
		    </el-col>
		    <el-col class="subThres">
	    		<el-button type="primary" :disabled="andthres" v-if="label.name" @click="thresholdClick(1)">且(and)</el-button>
		    </el-col>
		    <el-col class="subThres">
	    		<el-button type="primary" :disabled="orthres" v-if="label.name" @click="thresholdClick(2)">或(or)</el-button>
		    </el-col>
		    <el-col class="subThres">
	    		<el-button type="primary" v-if="label.name" @click="reset()">重置</el-button>
		    </el-col>
		    <el-col class="subThres">
	    		<el-button type="primary" v-if="!label.name" @click="thresholdClick(3)">删除</el-button>
		    </el-col>
		</el-row>
	  	<el-row v-if="indicator.dataType == 2" class="threshold enumType">
	    	<el-col class="thresholdLable">
	    	<span v-if="label.name" :style="{background:label.color,color:'white'}">{{label.name}}</span>
	    	<span v-else style="opacity:0;">1111 </span>
	    	</el-col>
		    <el-col>
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'indType')" v-model="thresholdObj.indType" placeholder="全部子类指标">
			   	<el-option v-for="item in indicatorArr.threshold.indType" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col v-if="!isCustome">
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'operator')" v-model="thresholdObj.operator" placeholder="">
			   	<el-option v-for="item in indicatorArr.threshold.operator" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col v-if="!isCustome">
	    	<el-form-item label="">
			  <el-select multiple collapse-tags class="inpframe" @change="(value)=>getBlurData(value,'value')" v-model="thresholdObj.value" placeholder="">
			   	<el-option v-for="item in indicatorArr.threshold.value" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col class="custome" v-if="isCustome">
	    	<el-form-item label="">
			  <el-input placeholder="" @change="(value)=>getBlurData(value,'expression')" v-model="thresholdObj.expression"></el-input>
			</el-form-item>
		    </el-col>
		    <el-col class="subThres">
	    		<el-button type="primary" :disabled="andthres" v-if="label.name" @click="thresholdClick(1)">且(and)</el-button>
		    </el-col>
		    <el-col class="subThres">
	    		<el-button type="primary" :disabled="orthres" v-if="label.name" @click="thresholdClick(2)">或(or)</el-button>
		    </el-col>
		    <el-col class="subThres">
	    		<el-button type="primary" v-if="label.name" @click="reset()">重置</el-button>
		    </el-col>
		     <el-col class="subThres">
	    		<el-button type="primary" v-if="!label.name" @click="thresholdClick(3)">删除</el-button>
		    </el-col>
		</el-row>
	</div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import Bus from 'src/bus/bus.js'
	export default {
		data(){
			return {
				mm:'',
				threshold:[],
				arr:[],
				labelName:'',
				thresholdObj:{},
				hasParam:true, // 关联参数
				isCan:true, //不展示加减号
				isDan:false, //同比值不展示单位
				andthres:false,
				orthres:false,
				isClear:false,
				isCustome:false, //子类指标是否选自定义
				dataUnit:[] //单位
			}
		},
		props:['label','relation','parentId'],
		methods:{
			...mapActions(['setData']),
			getBlurData(value,item){
				if(item == 'indType'){
					this.isClear = true
				}
				this.thresholdObj[item] = value;
			},
			thresholdClick(num){
				if(num == 1){
					this.orthres = true
				}
				if(num == 2){
					this.andthres = true
				}
				//num 1为且 2为或 3为删除
				var data = {
					relation:num,
					parentId:this.parentId //0-blue-0当前点击的是哪个
				}
				Bus.$emit('andThreshold',data)
			},
			reset(){
				var that = this;
				Object.keys(that.thresholdObj).forEach(function(key){
				   that.thresholdObj[key] = ''
				});
			}
		},
		computed:{
			...mapState(['indicator','indicatorArr'])
		},
		created(){
			this.arr = this.parentId.split('-')
			if(this.arr[1] == '0'){
				this.labelName = 'blue'
			}
			if(this.arr[1] == '1'){
				this.labelName = 'yellow'
			}
			if(this.arr[1] == '2'){
				this.labelName = 'red'
			}
			this.threshold = JSON.parse(JSON.stringify(this.indicator.threshold)); 
			this.thresholdObj = this.threshold[this.arr[0]][this.labelName][this.arr[2]];
			if(this.arr[2] > 0){
				this.thresholdObj.indType = this.threshold[this.arr[0]][this.labelName][0].indType;
			}
			if(this.indicator.threshold[this.arr[0]][this.labelName + 'Relation'] != ''){
				if(this.indicator.threshold[this.arr[0]][this.labelName + 'Relation'] == '1'){
					this.orthres = true
				}else{
					this.andthres = true
				}
			}
			this.dataUnit = JSON.parse(JSON.stringify(this.indicatorArr.dataUnit));
			if(this.indicator.paramId!=''){
				var arr = [];
				var obj = {};
				for(var i = 0; i < this.indicatorArr.param.length; i++){
					if(this.indicator.paramId == this.indicatorArr.param[i].id){
						obj.id = this.indicator.paramId
						obj.name = this.indicatorArr.param[i].name
					}
				}
				arr.push(obj)
				this.setData({'indicatorArr.threshold.param':arr})
				this.hasParam = false;
			}
		},
		watch:{
			thresholdObj:{
				handler(newVal,oldVal){
					if(newVal.indType == 'p'){
						this.thresholdObj.sign = ''
						this.isCan = true
						this.hasParam = true
					}else{
						this.isCan = false
						if(this.indicator.paramId!=''){
							this.hasParam = false
						}
					}
					//同比值的时候不要单位
					if(newVal.indType == 't'){
						this.isDan = true
					}else{
						this.isDan = false
					}
					//自定义的时候后面规则自己填写
					if(newVal.indType == 'e'){
						this.isCustome = true
					}else{
						this.isCustome = false
					}
					//有参数的时候才有加减号
					if(newVal.param){
						this.isCan = false
					}else{
						this.isCan = true
					}
					
					if(newVal){
						this.threshold[this.arr[0]][this.labelName][this.arr[2]] = newVal
						this.setData({'indicator.threshold':JSON.parse(JSON.stringify(this.threshold))})
					}
				},
				deep:true
			},
			'thresholdObj.indType':{
				handler(newVal,oldVal){
					if(oldVal && this.isClear){
						this.thresholdObj.dataUnit = ''
						this.thresholdObj.operator = ''
						this.thresholdObj.param = ''
						this.thresholdObj.sign = ''
						this.thresholdObj.value = ''
						this.thresholdObj.expression = ''
					}
				}
			},
			'indicatorArr.dataUnit':{
				handler(newVal,oldVal){
					this.dataUnit = JSON.parse(JSON.stringify(this.indicatorArr.dataUnit))
				}
			},
			'indicator.threshold':{
				handler(newVal,oldVal){
					this.threshold = JSON.parse(JSON.stringify(newVal)); 
					if(newVal[this.arr[0]][this.labelName][this.arr[2]].indType != oldVal[this.arr[0]][this.labelName][this.arr[2]].indType){
						this.thresholdObj.indType = this.threshold[this.arr[0]][this.labelName][this.arr[2]].indType;
					}
					if(newVal[this.arr[0]][this.labelName].length == 1){
						this.andthres = false
						this.orthres = false
					}
				},
				deep:true
			},
			'indicator.paramId':{
				handler(newVal,oldVal){
					if(newVal){
						var arr = [];
						var obj = {};
						for(var i = 0; i < this.indicatorArr.param.length; i++){
							if(newVal == this.indicatorArr.param[i].id){
								obj.id = newVal
								obj.name = this.indicatorArr.param[i].name
							}
						}
						arr.push(obj)
						this.setData({'indicatorArr.threshold.param':arr})
						this.hasParam = false;
						var indTypeArr = JSON.parse(JSON.stringify(this.indicatorArr.threshold.indType)); 
						var canObj = {name:'参数值',id:'p'}
						if(JSON.stringify(indTypeArr).indexOf(JSON.stringify(canObj)) === -1){
							indTypeArr.push(canObj)
						}
						this.setData({'indicatorArr.threshold.indType':indTypeArr})
					}
				},
				immediate: true
			},
			'indicator.dataType':{
				handler(newVal,oldVal){
					this.thresholdObj.dataUnit = ''
					this.thresholdObj.indType = ''
					this.thresholdObj.operator = ''
					this.thresholdObj.param = ''
					this.thresholdObj.sign = ''
					this.thresholdObj.value = ''
					this.thresholdObj.expression = ''
				},
				deep:true
			}
		}
	}
</script>
<style lang="scss" scoped>
	#thresholdChild{
		.numType{
			.el-col{
				width:13%;
				.inpframe{
					width:80%;
				}
			}
		}
		.enumType{
			.el-col{
				width:20%;
				.inpframe{
					width:80%;
				}
			}
		}
		.el-row{
			padding:0 20px;
			.subThres{
				width:7%
			}
			.el-button{
				width:68px;
				height:26px;
				padding:0px;
				font-size: 12px;
			}
			.subInput{
				width:8%;
				margin:0 20px 0 18px;
			}
			.asplice{
				width:7%;
			}
			.custome{
				width:54%;
				margin:0 34px 0 5px;
			}
			.thresholdLable{
				width:8%;
				span{
					display: block;
					width: 60px;
					text-align: center;
					line-height: 28px;
				}
			}
		}
	} 	
</style>
