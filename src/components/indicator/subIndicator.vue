<template>
  <div id="subIndicator" class="contentBox">
		<div class="titIcon"><em></em><span style="font-weight: 600;">子类指标</span></div>
  	<div class="subIndicator">
  		<div style="position:relative;">
	  		<el-form label-position="left" class="demo-ruleForm" size="mini" style="width:80%">
		  		<el-form-item label="是否包含子类指标">
					  <el-radio-group @change="(value)=>vmodel('indicator.hasSub',value)" v-model="indicatorObj.hasSub">
							<el-radio :label="a">是</el-radio>
							<el-radio :label="b">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<el-button type="primary" v-if="indicator.hasSub=='1'" class="search" @click="addSubIndi" style="position: absolute;top:0;
  	right:0;">添加</el-button>
			</div>
			<div class="subIndiShow" v-if="indicator.hasSub=='1' && subIndicator.length">
				<el-form label-position="left" class="demo-ruleForm" size="mini">
					<el-form-item v-for="(item,index) in subIndicator" :key="index" :label="'N-' + (index + 1)">
					  <el-input class="inpframe" v-model="item.name"></el-input>
						<i class="el-icon-close" style="font-size: 18px;" @click="delSubIndi(index)"></i>
					</el-form-item>
				</el-form>
			</div>
  	</div>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import Bus from 'src/bus/bus.js'
	export default {
		data(){
			return {
				a:'1',
				b:'0',
				indicatorObj:{},
				subIndicator:[{
					"id": "n1",
  				"name": ""
				}],
				count:0
			}
		},
		methods:{
			...mapActions(['setData']),
			addSubIndi(){
				this.count += 1
				var subIndi = {
					"id": "n" + (this.count + 1),
  				"name": ""
				}
				this.subIndicator.push(subIndi)
			},
			delSubIndi(index){
				this.subIndicator.splice(index, 1); 
			},
			goDelet(index){
				this.sentInfoData.splice(index,1)
				this.sentInfoDataId.splice(index,1)
				this.setData({'indicator.reportInfo':JSON.parse(JSON.stringify(this.sentInfoDataId))})
			},
			goEdit(index){
				this.label.itemId = 1
				this.label.data = this.sentInfoData[index]
				this.label.row = index
				this.isShow = true;
			},
			vmodel(key,value){
    		var obj = {}
    		const arr = key.split(".");
    		if(arr[1] == 'hasSub'){
    			if(value == '0'){
    				this.subIndicator = []
    			}else{
    				this.subIndicator = [{"id": "n1","name": ""}]
    			}	
    		}
    		obj[key] = this.indicatorObj[arr[1]]
    		this.setData(obj)
    	}
		},
		created(){
			if(this.indicator.subIndicator){
				this.subIndicator = JSON.parse(JSON.stringify(this.indicator.subIndicator)); 
			}
			this.indicatorObj = JSON.parse(JSON.stringify(this.indicator)); 
		},
		computed:{
			...mapState(['indicator','indicatorArr'])
		},
		watch:{
			'indicator':{
				handler(newVal){
					this.indicatorObj = JSON.parse(JSON.stringify(newVal)); 
				},
				deep:true
			},
			'subIndicator':{
				handler(newVal,oldVal){
					this.setData({'indicator.subIndicator':JSON.parse(JSON.stringify(newVal))})
					var indType = [{
		  			name:'指标值',
		  			id:'n'
		  		},{
		  			name:'同比值',
		  			id:'t'
		  		},{
		  			name:'参数值',
		  			id:'p'
		  		},{
		  			name:'自定义',
		  			id:'e'
		  		}]
					for(var i = 0 ; i < newVal.length; i ++){
						indType.push(newVal[i])
					}
					//子类指标减少，删除红黄蓝无用指标
					var indTypeObj = JSON.parse(JSON.stringify(this.indicatorArr.threshold.indType))
					if(indType.length < indTypeObj.length){
						var thresholdObj = JSON.parse(JSON.stringify(this.indicator.threshold))
						var arr = ['blue','red','yellow']
						for(var i = 0; i < thresholdObj.length; i++){
							for(var j = 0; j < arr.length; j++){
								for(var k = 0; k < thresholdObj[i][arr[j]].length; k++){
									var flag = true
									for(var m = 0; m < indType.length; m++){
										if(indType[m].id == thresholdObj[i][arr[j]][k].indType){
											flag = false
											continue
										}
									}
									if(flag){
										thresholdObj[i][arr[j]][k].indType = ''
										this.setData({'indicator.threshold':JSON.parse(JSON.stringify(thresholdObj))})
									}
								}
							}
						}
					}
					this.setData({'indicatorArr.threshold.indType':JSON.parse(JSON.stringify(indType))})
				},
				deep:true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-button{
		width:68px;
		height:26px;
		padding:0px;
		font-size: 12px;
	}
  .subIndicator{
  	margin-top:20px;
  	.el-radio-group{
  		margin-left:30px;
  	}
  	.subIndiShow{
  		border:1px solid #E9E9E9;
  		margin-top:20px;
  		padding:20px;
  		.inpframe{
  			width:30%
  		}
  	}
  }
</style>
