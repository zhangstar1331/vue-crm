<template>
  <div id="threshold">
		<el-form label-position="left" class="demo-ruleForm" size="mini">
			<el-row>
		  	<el-col :span="6">
		    	<el-form-item label="适用对象">
				    <el-select v-model="company" @change="(value)=>getBlurData(value,'company')">
					   	<el-option v-for="item in indicatorArr.threshold.company" :key="item.id" :label="item.name" :value="item.id"></el-option>
					  </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="默认值">
				    <el-select v-model="defaultRyb" @change="(value)=>getBlurData(value,'defaultRyb')">
					   	<el-option v-for="item in indicatorArr.threshold.defaultRyb" :key="item.id" :label="item.name" :value="item.id"></el-option>
					  </el-select>
					</el-form-item>
				</el-col>
			</el-row>
				<div class="thresholdList">
					<div class="threshold" v-for="(thres,index) in thresholdList" :key="index" style="border:1px solid #E9E9E9;">
							<threshold v-for="(thresholdItem,index) in thres" :key="index" :label="thresholdItem" :relation="thresholdItem.relation" :parentId="thresholdItem.parentId + index"/>
					</div>
	      </div>
	    </el-form-item>
	  </el-form>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import threshold from 'src/components/indicator/threshold'
	import Bus from 'src/bus/bus.js'
	export default {
		data(){
			return {
				company:'',
				defaultRyb:'',
				thresholdList:[],
				threshold:{}
			}
		},
		methods:{
			...mapActions(['setData']),
			getBlurData(value,key){
				this.threshold[this.parentThres.parentParentId][key] = value;
				this.setData({'indicator.threshold':JSON.parse(JSON.stringify(this.threshold))})
			},
		},
		props:['parentThres'],
		mounted(){
			if(this.indicator.threshold){
				this.threshold = JSON.parse(JSON.stringify(this.indicator.threshold)); 
				this.defaultRyb = this.threshold[this.parentThres.parentParentId].defaultRyb
				this.company = this.threshold[this.parentThres.parentParentId].company
			}
			this.thresholdList = this.parentThres.thresholdList
		},
		components:{
			threshold
		},
		computed:{
			...mapState(['indicator','indicatorArr'])
		},
		watch:{
			'indicator.threshold':{
				handler(newVal,oldVal){
					this.threshold = JSON.parse(JSON.stringify(newVal)); 
					this.company = this.threshold[this.parentThres.parentParentId].company;
					this.defaultRyb = this.threshold[this.parentThres.parentParentId].defaultRyb;
				},
				deep:true
			}
		}
	}
</script>
<style lang="scss" scoped>
.thresholdList{
	margin-bottom: 20px;
	.threshold{
		padding:20px 4px;
		.thresholdLable{
			display: block;
			width:40px;
			height:28px;
			line-height: 28px;
			color: white;
			text-align: center;
		}
	}
	.threshold:nth-child(2){
		border-top:0 !important;
		border-bottom:0 !important;
	}
}
</style>
