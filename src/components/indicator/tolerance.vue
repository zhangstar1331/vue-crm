<template>
  <div id="tolerance" class="contentBox">
  	<div class="titIcon"><em></em><span style="font-weight: 600;">{{label.title}}</span></div>
  	<el-button type="primary" class="search" @click="addTolerance()" v-if="false">添加</el-button>
  	<div class="table-content">
  		<el-form label-position="left" class="demo-ruleForm" size="mini" style="width:80%">
  			<tolerance-item v-for="(tolerance,index) in toleranceList" :key="index" :label="label" :parentId="index"/>
  		</el-form>
  	</div>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import toleranceItem from 'src/components/indicator/toleranceItem'
	import Bus from 'src/bus/bus.js'
	export default {
		data(){
			return {
				toleranceList:[]
			}
		},
		props:['label'],
		methods:{
			...mapActions(['setData']),
			addTolerance(){
				var toleranceItem = {
					"indType": "",
					"operator": "",
					"value": "",
					"dataUnit": ""
				}
				this.toleranceList.push(toleranceItem)
				var obj = {}
				obj['indicator.'+this.label.item] = JSON.parse(JSON.stringify(this.toleranceList))
				this.setData(obj)
			}
		},
		mounted(){
			this.toleranceList = JSON.parse(JSON.stringify(this.indicator[this.label.item]))
			Bus.$on('deltole', (data) => {
				this.toleranceList.splice(data,1)
			})
		},
		components:{
			toleranceItem
		},
		computed:{
			...mapState(['indicator','indicatorArr'])
		},
		watch:{
			'indicator.prefTolerance':{
				handler(newVal,oldVal){
					if(this.label.item == 'prefTolerance'){
						this.toleranceList = JSON.parse(JSON.stringify(newVal)); 
					}
				},
				deep:true
			},
			'indicator.dfTolerance':{
				handler(newVal,oldVal){
					if(this.label.item == 'dfTolerance'){
						this.toleranceList = JSON.parse(JSON.stringify(newVal)); 
					} 
				},
				deep:true
			},
			'indicator.limitTolerance':{
				handler(newVal,oldVal){
					if(this.label.item == 'limitTolerance'){
						this.toleranceList = JSON.parse(JSON.stringify(newVal)); 
					}
				},
				deep:true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.table-content{
  	margin:0 auto;
  }
  .search{
		margin-left:10px;
  	float:right;
		margin-bottom:10px;
	}
	.el-button{
		width:68px;
		height:26px;
		padding:0px;
		font-size: 12px;
	}
</style>
