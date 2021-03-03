<!--仪表盘左边一列组件-->
<template>
  <div class="strategy_meter_index">
		<div class="chartTitle">
			<span>{{message.content.indName}}</span>
		</div>
		<div id="strategyChart" @click="gotoPage()"></div>
		<div class="table-content">
	  	<el-table :data="tableData" :header-cell-style="{background:'#1D3270',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" :cell-style="{background:'#172758',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" style="width: 40%;margin:20px auto;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;">
				<el-table-column align="center" min-width="120%" prop="indName" label="指标名称"></el-table-column>
				<el-table-column align="center" :prop="''+message.subDate" :label="''+message.subDate"></el-table-column>
			</el-table>
  	</div>
  </div>
</template>
<script>
	import echarts from 'echarts'
	import {chart,chart1,fomatFloat,compare} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
	  props:['message'],
	  components: {},
	  data () {
	    return {
	    	tableData:[]
	    };
	  },
	  methods:{
	  	initPage(){
	  		var msg = {
	  			max:'',
	  			unit:this.message.unit,
	  			rybRate:'',
	  			data:{}
	  		}
	  		if(this.message.content.child){
	  			for(var i = 0; i < this.message.content.child.length; i++){
	  				//表数据渲染
	  				var tabObj = {}
			  		tabObj.indName = this.message.content.indName + '(' + this.message.content.child[i].name + ')'
			  		if(this.message.content.child[i].value){
			  			tabObj[this.message.subDate] = fomatFloat(this.message.content.child[i].value,2) + this.message.unit
			  		}else{
			  			tabObj[this.message.subDate] = '--'
			  		}
			  		this.tableData.push(tabObj)
	 					//双层仪表盘数据渲染
	  				var arr = []
						var obj = {}
						obj.name = '' 
						if(this.message.content.child[i].value){
							obj.value = this.message.content.child[i].value
						}else{
							obj.value = ''
						}
						arr.push(obj)
						//仪表盘红黄蓝颜色占比
			  		this.message.content.blue[1] = compare(this.message.content.child[i].value,parseFloat(this.message.content.blue[1]))
						var redRate = this.message.content.red[1] / this.message.content.blue[1]
						var yellowRate =this.message.content.yellow[1] / this.message.content.blue[1]
				 		msg.max = this.message.content.blue[1];//最大值
				 		msg.rybRate = [redRate,yellowRate];//颜色占比
						msg.data['child'+i] = arr
	  			}
	  			chart1('strategyChart',msg,15,12,-30,-20,this.$echarts)
	  		}else{
	  			//表数据渲染
	  			var obj = {}
		  		obj.indName = this.message.content.indName
		  		if(this.message.content.value){
		  			obj[this.message.subDate] = fomatFloat(this.message.content.value,2) + this.message.unit
		  		}else{
		  			obj[this.message.subDate] = '--'
		  		}
		  		
		  		this.tableData.push(obj)
	  			//仪表盘数据渲染
	  			var chartData = {
		    		name:'',
		    		value:''
		    	}
	  			if(this.message.content.value){
	  				chartData.value = this.message.content.value
	  			}else{
						obj.value = ''
					}
	  			//仪表盘红黄蓝颜色占比
		  		this.message.content.blue[1] = compare(this.message.content.value,parseFloat(this.message.content.blue[1]))
					var redRate = this.message.content.red[1] / this.message.content.blue[1]
					var yellowRate =this.message.content.yellow[1] / this.message.content.blue[1]
		 			msg.max = this.message.content.blue[1]//最大值
		 			msg.rybRate = [redRate,yellowRate]//颜色占比
		 			msg.data = chartData
	  			chart('strategyChart',msg,15,12,-40,this.$echarts)
	  		}
	  	},
	  	gotoPage(){
	  		this.axios.post('/rmIndStass/indDashBoardByIndId',qs.stringify({recId:this.message.recId,indId:this.message.content.indId})).then((res)=>{
					if(res.code == 200){
						let parent = this.$parent;
						for(var i = 0; i < res.data.times.length; i++){
							for(var j = 0; j < res.data.inds.length; j++){
								if(res.data.inds[j]['v'+res.data.times[i]]){
									res.data.inds[j]['v'+res.data.times[i]] = fomatFloat(res.data.inds[j]['v'+res.data.times[i]],2)
								}
							}
						}
						this.message.secondContent = res.data
		        parent.routerInfo.stepList.push({
			        title:'第二层',
			        path:'strategySecond',
		        });
		        parent.routerInfo.showStepList = true;
		        parent.message = this.message;
		        parent.currentView = 'strategySecond';
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
	  }
	}
</script>
<style lang='scss' scoped>
  .strategy_meter_index{
		#strategyChart{
			width:60%;
			height:280px;
			margin:10px auto;
		}
		.chartTitle{
			margin:0 auto;
			text-align:center;
			font-size:14px;
			color:#fff;
		}
  }
</style>