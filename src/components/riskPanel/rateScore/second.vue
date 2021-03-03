<!--仪表盘左边一列组件-->
<template>
  <div class="rate_score_second">
  	<div v-if="message.content.indId" class="table-content">
	  	<el-table :data="message.secondContent.inds" :header-cell-style="{background:'#1D3270',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" :cell-style="{background:'#172758',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" style="width: 100%;margin:0 auto;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;">
				<el-table-column align="center" min-width="120%" label="指标名称" prop="indName">
				</el-table-column>
				<el-table-column align="center" v-for="(item,index) in message.secondContent.times" :key="index" :label="''+item">
					<template slot-scope="scope">
			      <div class="bgColor" :class="{
			      	'red':message.secondContent.inds[scope.$index]['rs'+item]==1,
			      	'yellow':message.secondContent.inds[scope.$index]['rs'+item]==2,
			      	'blue':message.secondContent.inds[scope.$index]['rs'+item]==3
			      }" v-if="message.secondContent.inds[scope.$index]['v'+item]">
			      {{message.secondContent.inds[scope.$index]['v'+item]}}
			      </div>
			      <div v-else>--</div>
					</template>
				</el-table-column>
			</el-table>
  	</div>
  	<div v-else>暂无数据</div>
  </div>
</template>
<script>
	import echarts from 'echarts'
	import {chart,chart1} from 'src/utils/utils.js'
	export default {
	  props:['message']
	}
</script>
<style lang='scss' scoped>
  .rate_score_second{
  	color:#fff;
  	.bgColor{
  		height:100%;
  		color:#fff;
  	}
  	.yellow{
  		background: #FFD824;
  	}
  	.blue{
  		background: #4285F4;
  	}
  	.red{
  		background: #FF6363;
  	}
  }
</style>