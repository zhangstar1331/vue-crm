<template>
	<div>
		<el-row v-if="indicator.dataType == 1">
	    	<el-col :span="4">
	    		<span style="line-height: 28px;" v-if="!parentId">{{label.name}}</span>
	    		<span style="line-height: 28px;opacity: 0;" v-else>111</span>
	    	</el-col>
		    <el-col :span="4">
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'indType')" v-model="toleranceObj.indType">
			   	<el-option v-for="item in indicatorArr.threshold.company" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col :span="4">
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'operator')" v-model="toleranceObj.operator">
			   	<el-option v-for="item in indicatorArr.threshold.operator" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col :span="4">
	    		<el-form-item label="">
				  <el-input class="inpframe" @change="(value)=>getBlurData(value,'value')" v-model="toleranceObj.value" placeholder=""></el-input>
				</el-form-item>
		    </el-col> 
		    <el-col :span="4">
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'dataUnit')" v-model="toleranceObj.dataUnit">
			   	<el-option v-for="item in indicatorArr.threshold.dataUnit" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col :span="4" v-if="parentId!='0'">
	    		<el-button type="primary" @click="deltole()">删除</el-button>
		    </el-col>
		</el-row>
		<el-row v-if="indicator.dataType == 2">
	    	<el-col style="width:12.6%;">
	    		<span style="line-height: 28px;" v-if="!parentId">{{label.name}}</span>
	    		<span style="line-height: 28px;opacity: 0;" v-else>111</span>
	    	</el-col>
		    <el-col class="tolerance2">
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'indType')" v-model="toleranceObj.indType">
			   	<el-option v-for="item in indicatorArr.threshold.company" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col class="tolerance2">
	    	<el-form-item label="">
			  <el-select class="inpframe" @change="(value)=>getBlurData(value,'operator')" v-model="toleranceObj.operator">
			   	<el-option v-for="item in indicatorArr.threshold.operator" :key="item.id" :label="item.name" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    </el-col> 
		    <el-col  class="tolerance2">
				<el-form-item label="">
				  <el-select multiple collapse-tags class="inpframe" @change="(value)=>getBlurData(value,'value')" v-model="toleranceObj.value" placeholder="">
				   	<el-option v-for="item in indicatorArr.threshold.value" :key="item.id" :label="item.name" :value="item.id"></el-option>
				  </el-select>
				</el-form-item>
		    </el-col> 
		    <el-col :span="3" v-if="parentId!='0'">
	    		<el-button type="primary" @click="deltole()">删除</el-button>
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
				tolerance:{},
				toleranceObj:{}
			}
		},
		props:['label','parentId'],
		methods:{
			...mapActions(['setData']),
			getBlurData(value,item){
				this.toleranceObj[item] = value;
			},
			//删除
			deltole(){
				Bus.$emit('deltole',this.parentId)
			}
		},
		mounted(){
			this.tolerance = JSON.parse(JSON.stringify(this.indicator[this.label.item]))
			this.toleranceObj = this.tolerance[this.parentId]
		},
		computed:{
			...mapState(['indicator','indicatorArr'])
		},
		watch:{
			toleranceObj:{
				handler(newVal,oldVal){
					if(newVal){
						this.tolerance[this.parentId] = JSON.parse(JSON.stringify(newVal))
						var obj = {}
						obj['indicator.'+this.label.item] = JSON.parse(JSON.stringify(this.tolerance))
						this.setData(obj)
					}
				},
				deep:true
			},
			'indicator.prefTolerance':{
				handler(newVal,oldVal){
					if(this.label.item == 'prefTolerance'){
						this.tolerance = JSON.parse(JSON.stringify(newVal)); 
						this.toleranceObj.indType = newVal[0].indType;
					}
				},
				deep:true
			},
			'indicator.dfTolerance':{
				handler(newVal,oldVal){
					if(this.label.item == 'dfTolerance'){
						this.tolerance = JSON.parse(JSON.stringify(newVal)); 
						this.toleranceObj.indType = newVal[0].indType;
					} 
				},
				deep:true
			},
			'indicator.limitTolerance':{
				handler(newVal,oldVal){
					if(this.label.item == 'limitTolerance'){
						this.tolerance = JSON.parse(JSON.stringify(newVal)); 
						this.toleranceObj.indType = newVal[0].indType;
					}
				},
				deep:true
			},
			'indicator.dataType':{
				handler(newVal,oldVal){
					this.toleranceObj.dataUnit = ''
					this.toleranceObj.operator = ''
					this.toleranceObj.value = ''
				},
				deep:true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-row{
		.el-button{
			width:68px;
			height:26px;
			padding:0px;
			font-size: 12px;
		}
		.tolerance2{
			width:24%;
		}
		.inpframe{
			width:80%;
		}
	}
</style>
