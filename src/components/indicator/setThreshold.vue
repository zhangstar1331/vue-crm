<template>
  <div id="setThreshold" class="contentBox">
  	<div class="titIcon"><em></em><span style="font-weight: 600;">设置指标阈值</span></div>
  	<el-button type="primary" class="search" @click="addThreshold()" v-if="false">添加</el-button>
  	<div class="table-content">
  		<threshold-list v-for="(threshold,index) in allThresholdList" :key="index" :parentThres = "{thresholdList:threshold,parentParentId:index}"/>
  	</div>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import thresholdList from 'src/components/indicator/thresholdList'
	import Bus from 'src/bus/bus.js'
	export default {
		data(){
			return {
				aaa:'111',
				allThresholdList: [
					[
						[{
							'name':'蓝',
							'color':'#4285F4',
							'parentId':'0-0-'
						}],[{
							'name':'黄',
							'color':'yellow',
							'parentId':'0-1-'
						}],[{
							'name':'红',
							'color':'red',
							'parentId':'0-2-'
						}]
					]
				],
				thresholdObj:[]
			}
		},
		methods:{
			...mapActions(['setData']),
			addThreshold(){
				var index = this.allThresholdList.length
				var thresholdList = [
						[{
							'name':'蓝',
							'color':'#4285F4',
							'parentId':index + '-0-'
						}],[{
							'name':'黄',
							'color':'yellow',
							'parentId':index + '-1-'
						}],[{
							'name':'红',
							'color':'red',
							'parentId':index + '-2-'
						}]
					]
				var thresholdListData = {
			 		"company":"",  // 公司编码，下拉选（前期先写死，后期会变为活的
			  	"blue":[   //蓝色阀值，红色，黄色 处理方式相同
			    	{
			      	"indType":"",  //类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
			 				"operator":"",   //操作符 下拉选的值参考下方 OperatorEnum
			      	"param":"",       //参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
			      	"sign":"",    //加减符号 ， 1 加， 2 减
			      	"value":"",     //值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
			      	"dataUnit":""   //数据类型。  参考下方
			    	} 
			  	],
			  	"blueRelation":"",    //数组中的关系，  1 并且   2 或者
			  	"red":[   //蓝色阀值，红色，黄色 处理方式相同
			    	{
			      	"indType":"",  //类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
			 				"operator":"",   //操作符 下拉选的值参考下方 OperatorEnum
			      	"param":"",       //参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
			      	"sign":"",    //加减符号 ， 1 加， 2 减
			      	"value":"",     //值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
			      	"dataUnit":""  //数据类型。  参考下方
			    	} 
			  	],
			  	"redRelation":"",    //数组中的关系，  1 并且   2 或者
			  	"yellow":[   //蓝色阀值，红色，黄色 处理方式相同
			    	{
			      	"indType":"",  //类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
			 				"operator":"",   //操作符 下拉选的值参考下方 OperatorEnum
			      	"param":"",       //参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
			      	"sign":"",    //加减符号 ， 1 加， 2 减
			      	"value":"",     //值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
			      	"dataUnit":""   //数据类型。  参考下方
			    	} 
			  	],
			  	"yellowRelation":"",    //数组中的关系，  1 并且   2 或者
				}
				this.allThresholdList.push(thresholdList)
				this.thresholdObj.push(thresholdListData)
				this.setData({'indicator.threshold':JSON.parse(JSON.stringify(this.thresholdObj))})
			}
		},
		created(){
			//红黄蓝页面回值处理
			var arr = JSON.parse(JSON.stringify(this.indicator.threshold))
			var brr = []
			for(var i = 0; i < arr.length;i++){
				console.log(arr[i])
				var crr = []
				var drr1 = []
				for(var j = 0; j < arr[i]['blue'].length;j++){
					 if(j==0){
					 	drr1.push({
							'name':'蓝',
							'color':'#4285F4',
							'parentId':i + '-0-',
							'relation':''
						})
					 }else{
					 	if(arr[i]['blueRelation']){
					 		drr1.push({
								'parentId':i + '-0-',
								'relation':arr[i]['blueRelation']
							})
					 	}
					 }
				}
				crr.push(drr1)	
				var drr2 = []
				for(var j = 0; j < arr[i]['yellow'].length;j++){
					 if(j==0){
					 	drr2.push({
							'name':'黄',
							'color':'yellow',
							'parentId':i + '-1-',
							'relation':''
						})
					 }else{
					 	if(arr[i]['yellowRelation']){
					 		drr2.push({
								'parentId':i + '-1-',
								'relation':arr[i]['yellowRelation']
							})
					 	}
					 }
				}
				crr.push(drr2)	
				var drr3 = []
				for(var j = 0; j < arr[i]['red'].length;j++){
					 if(j==0){
					 	drr3.push({
							'name':'红',
							'color':'red',
							'parentId':i + '-2-',
							'relation':''
						})
					 }else{
					 	if(arr[i]['redRelation']){
					 		drr3.push({
								'parentId':i + '-2-',
								'relation':arr[i]['redRelation']
							})
					 	}
					 }
				}
				crr.push(drr3)	
				brr.push(crr)
			}
			this.allThresholdList = brr;
			this.thresholdObj = JSON.parse(JSON.stringify(this.indicator.threshold))
			Bus.$on('andThreshold', (data) => {
				var arr = data.parentId.split('-')
				var thresholdName;
				if(arr[1] == '0'){
					thresholdName = 'blue'
				}
				if(arr[1] == '1'){
					thresholdName = 'yellow'
				}
				if(arr[1] == '2'){
					thresholdName = 'red'
				}
				if(data.relation == '3'){//删除当前选项
					this.allThresholdList[arr[0]][arr[1]].splice(arr[2],1)
					this.thresholdObj[arr[0]][thresholdName].splice(arr[2],1)
					if(this.thresholdObj[arr[0]][thresholdName].length == 1){
						this.thresholdObj[arr[0]][thresholdName+'Relation'] = ''
					}
				}else{
					var threshold = {
						relation: data.relation,
						parentId: arr[0]+'-'+arr[1]+'-'
					}
					var thresholdData = {
		      	"indType":"",  //类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
		 				"operator":"",   //操作符 下拉选的值参考下方 OperatorEnum
		      	"param":"",       //参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
		      	"sign":"",    //加减符号 ， 1 加， 2 减
		      	"value":"",     //值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
		      	"dataUnit":""   //数据类型。  参考下方
		    	} 
					this.allThresholdList[arr[0]][arr[1]].push(threshold)
					this.thresholdObj[arr[0]][thresholdName+'Relation'] = threshold.relation
					this.thresholdObj[arr[0]][thresholdName].push(thresholdData)
				}
				this.setData({'indicator.threshold':JSON.parse(JSON.stringify(this.thresholdObj))})
      })
		},
		components:{
			thresholdList
		},
		computed:{
			...mapState(['indicator','indicatorRes'])
		},
		watch:{
			'indicator.threshold':{
				handler(newVal,oldVal){
					this.thresholdObj = JSON.parse(JSON.stringify(newVal)); 
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
	}
	.el-button{
		width:68px;
		height:26px;
		padding:0px;
		font-size: 12px;
	}
</style>
