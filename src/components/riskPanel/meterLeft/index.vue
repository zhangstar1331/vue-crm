<!--仪表盘左边一列组件-->
<template>
  <div class="meter_left">
  	<div class="meter_left_content">
	    <div class="riskItem" v-for="(riskItem,index) in meterData[message]" :key="index">
	    	<div class="bartitle">
	    		<span>{{riskItem.name}}</span>
	    	</div>
	    	<p class="barDw">单位：{{riskItem.unit}}</p>
	    	<div class="cnItem" :id="'riskLeft'+riskItem.recId"></div>
	    	<div class="table-content">
		  		<el-table :data="tableData(index)" :header-cell-style="{background:'#1D3270',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" :cell-style="{background:'#172758',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" style="width: 100%;margin:0 auto;border: 1px solid #546DBB;border-bottom:none;cursor:pointer;">
						<el-table-column align="center" prop="name" label="指标名称"></el-table-column>
						<el-table-column width="70" align="center" prop="value1" :label="'最低资本('+riskItem.qtime+')'"></el-table-column>
						<el-table-column width="70" align="center" prop="value2" :label="'风险限额('+riskItem.ytime+')'"></el-table-column>
						<el-table-column align="center" prop="rate" label="占比"></el-table-column>
					</el-table>
		  	</div>
	    </div>
    </div>
    <div class="meter_left_tip">
  		<p>风险限额：对风险容忍度的进一步量化和细化，指在风险容忍度范围内，不同风险类别、业务单位承受风险的上限。可以理解为允许占用的最低资本上限，超过此上限，公司的容忍度将很可能被突破。</p>
  		<p>最低资本：指基于审慎监管目的，为使保险公司具有适当的财务资源，以应对各类可量化为资本要求的风险对偿付能力的不利影响，保监会要求保险公司应当具有的资本数额。</p>
  	</div>
  </div>
</template>
<script>
	import {bar} from 'src/utils/utils.js'
	import {mapState} from 'vuex'
	export default {
	  props:['message'],
	  data () {
	    return {
	    };
	  },
	  computed:{
	  	...mapState(['meterData']),
	  	//计算表格数据
	  	tableData(){
	  		return (index)=>{
	  			var arr = []
		  		arr.push(this.meterData[this.message][index])
		  		return arr
	  		}	
	  	}
	  },
	  methods:{
	  	initPage(){
	  		for(var i = 0; i < this.meterData[this.message].length; i++){
	  				var meter = this.meterData[this.message][i]
	  				var data = [meter.value1,meter.value2]
				 		var xAxisData = [meter.name1.substr(0,4),meter.name2.substr(0,4)]
				 		bar('riskLeft'+meter.recId,data,xAxisData,this.$echarts)
		  	}
	  	}
	  },
	  mounted(){
	  	this.initPage()
	  }
	}
</script>
<style lang='scss' scoped>
  .meter_left{
  	.meter_left_content{
  		overflow:hidden;
  		.riskItem{
	  		width:48%;
	  		height:70%;
	  		float:left;
	  		.bartitle{
	  			text-align:center;
	  			color:#fff;
	  		}
	  		.barDw{
	  			width:90%;
					text-align:right;
					font-size:12px;
					color:#AFC3FF;
				}
	  		.cnItem{
	  			width:80%;
	  			height:280px;
	  			margin:20px auto;
	  		}
	  	}
	  	.riskItem:nth-child(2){
	  		float:right;
	  	}
	  	.el-table, .el-table__expanded-cell{
				background-color:#546DBB;
			}
			.el-table::before{
				height:0px;
			}
  	}
  	.meter_left_tip{
  		height:30%;
  		color:#AFC3FF;
  		font-size:12px;
  		padding-top:18px;
  		p{
  			margin-top:2px;
  			line-height:22px;
  		}
  	}
  }
</style>