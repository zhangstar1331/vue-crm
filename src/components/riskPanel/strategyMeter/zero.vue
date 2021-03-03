<!--仪表盘左边一列组件-->
<template>
  <div class="strategy_meter_zero">
  	<ul>
  		<li v-for="(item,index) in meterData['60']" :key="index">
  			<div class="chartTitle">
					<span>{{item.prefix}}{{item.name}}</span>
				</div>
				<div :id="'strategyChart'+index" class="strategyChart" @click="gotoPage(index,{id:60,recId:item.recId})"></div>
				<div class="table-content">
			  	<el-table :data="chartData[index]" :header-cell-style="{background:'#1D3270',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" :cell-style="{background:'#172758',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" style="width: 90%;margin:0 auto;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;">
						<el-table-column align="center" min-width="120%" prop="indexName" label="指标名称"></el-table-column>
						<el-table-column align="center" :prop="''+item.subDate" :label="''+item.subDate"></el-table-column>
					</el-table>
		  	</div>
  		</li>
  	</ul>
  </div>
</template>
<script>
	import echarts from 'echarts'
	import {mapState} from 'vuex'
	import {chart,chart1,fomatFloat,compare} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
	  props:['message'],
	  components: {},
	  data () {
	    return {
	    	chartData:[]
	    };
	  },
	  methods:{
	  	initPage(){
	  			var meter = this.meterData[this.$parent.routerInfo.message]
					for(var i = 0; i < meter.length; i++){
						//用于表格数据
						var tableData = []
						//仪表盘红黄蓝颜色占比
						var redRate = meter[i].red[1] / meter[i].blue[1]
						var yellowRate = meter[i].yellow[1] / meter[i].blue[1]
						var msg = {
				 			max:meter[i].blue[1],//最大值
				 			rybRate:[redRate,yellowRate],//颜色占比
				 			unit:meter[i].unit,
				 		}
						if(meter[i].isChild){
							msg.data = {}
							for(var k = 0; k < meter[i].child.length; k++){
								var tableObj = {}
								tableObj.indexName = meter[i].child[k].name?meter[i].name + '(' +meter[i].child[k].name+ ')' :'--'
								tableObj[meter[i].subDate] = meter[i].child[k].value ? fomatFloat(meter[i].child[k].value,2)+'%' : "--"
								tableData.push(tableObj)
								var arr = []
								var obj = {}
								obj.name = ''
								obj.value = meter[i].child[k].value
								arr.push(obj)
								msg.data['child'+k] = arr
							}
							chart1('strategyChart'+i,msg,12,10,-26,-22,this.$echarts)
						}else{
							var tableObj = {}
							tableObj.indexName = meter[i].name
							tableObj[meter[i].subDate] = meter[i].value ? fomatFloat(meter[i].value,2)+'%' : "--"
							tableData.push(tableObj)
					 		msg.data = {//数据
				                name: "",
				                value: meter[i].value ? meter[i].value : "--"
			              	}
					 		chart('strategyChart'+i,msg,14,10,-32,this.$echarts)
						}	
						this.chartData.push(tableData)
				 	}
	  	},
	  	gotoPage(index,msg){
	  		var message = msg
	  		this.axios.post('/rmIndStass/indDashBoardByRecId',qs.stringify({id:msg.id,recId:msg.recId})).then((res)=>{
	   			if(res.code == 200){
	   				let buttonList = res.data.inds
	   				message.subDate = res.data.subDate
	   				message.unit = res.data.unit
	   				this.axios.post('/rmIndStass/indDashBoardByIndId',qs.stringify({recId:msg.recId,indId:buttonList[0].indId})).then((res)=>{
	   					if(res.code == 200){
	   						for(var i = 0; i < res.data.times.length; i++){
									for(var j = 0; j < res.data.inds.length; j++){
										if(res.data.inds[j]['v'+res.data.times[i]]){
											res.data.inds[j]['v'+res.data.times[i]] = fomatFloat(res.data.inds[j]['v'+res.data.times[i]],2)
										}
									}
								}
								message.secondContent = res.data
								let parent = this.$parent;
				        parent.routerInfo.stepList.push({
									title:buttonList[0].titName+'首页',
									path:'strategyIndex',
								},{
									title:'第二层',
									path:'strategySecond',
								});
								parent.routerInfo.buttonList = buttonList;
				        parent.routerInfo.showStepList = true;
				        parent.message = message;
				        parent.currentView = 'strategySecond';
		   				}else{
		   					this.$alert(res.message)
		   				}
	   				})
	   			}else{
	   				this.$alert(res.message)
	   			}
	   		})
    	}
	  },
	  mounted(){
	  	setTimeout(() => {
	  		this.initPage()
	  	})
	  },
	  computed:{
	  	...mapState(['meterData'])
	  }
	}
</script>
<style lang='scss' scoped>
  .strategy_meter_zero{
  	ul{
  		height:100%;
  		li{
  			width:33.33333%;
  			height:100%;
  			float:left;
  			.strategyChart{
					width:90%;
					height:260px;
					margin:10px auto;
				}
				.chartTitle{
					text-align:center;
					font-size:14px;
					color:#fff;
				}
  		}
  	}
  }
</style>