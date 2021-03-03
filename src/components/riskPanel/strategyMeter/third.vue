<!--仪表盘左边一列组件-->
<template>
  <div class="strategy_meter_third">
  	<p>单位：（{{message.thirdContent.unit}}）</p>
		<div id="strategyBar"></div>
		<div class="table-content">
	  	<el-table :data="tableData" :header-cell-style="{background:'#1D3270',color:'#AFC3FF',borderBottom:'1px solid #546DBB',padding:'4px 0'}" :cell-style="{background:'#172758',color:'#AFC3FF',borderBottom:'1px solid #546DBB',padding:'4px 0'}" style="width: 40%;margin:0 auto;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;">
				<el-table-column align="center" min-width="120%" prop='name' label="指标名称"></el-table-column>
				<el-table-column align="center" prop="value" :label="''+message.thirdContent.time"></el-table-column>
			</el-table>
  	</div>
  </div>
</template>
<script>
	import echarts from 'echarts'
	import {calcBar} from 'src/utils/utils.js'
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
	  		//柱状图、表数据配置
	  		for(var i = 1; i < 4; i++){
	  			var obj = {}
	  			obj.name = this.message.thirdContent['name'+i]
	  			obj.value = this.message.thirdContent['value'+i]
	  			this.tableData.push(obj)
	  		}
	  		var xData = [this.message.thirdContent.name1,this.message.thirdContent.name3,this.message.thirdContent.name2]
	    	var data = [this.message.thirdContent.value1,this.message.thirdContent.value3,this.message.thirdContent.value2]
	    	var diffData = [0,this.message.thirdContent.value1 - this.message.thirdContent.value3,0]
	  		calcBar('strategyBar',xData,data,diffData,this.$echarts)
	  	}
	  },
	  mounted(){
	  	this.initPage()
	  }
	}
</script>
<style lang='scss' scoped>
  .strategy_meter_third{
  	p{
  		width:59%;
  		color:#AFC3FF;
  		margin:0 auto;
  		font-size:12px;
  		text-align:right;
  	}
  	#strategyBar{
  		width:60%;
  		height:220px;
  		margin:10px auto 30px;
  	}
  }
</style>