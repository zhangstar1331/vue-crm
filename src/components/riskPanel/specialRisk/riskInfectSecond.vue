<template>
	<div id="riskTable">
	    <el-table :data="message.secondContent.inds" :header-cell-style="{background:'#1D3270',color:'#FFF',borderBottom:'1px solid #546DBB'}" :cell-style="{background:'#172758',color:'#FFF',borderBottom:'1px solid #546DBB'}" style="width: 100%;margin:0 auto;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;">
			<el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
			<el-table-column align="center" min-width="140%" label="指标名称" prop="indName">
			</el-table-column>
			<el-table-column align="center" v-for="(item,index) in message.secondContent.times" :key="index" :label="''+item">
				<template slot-scope="scope">
		      <div class="bgColor" :class="{
		      	'red':message.secondContent.inds[scope.$index]['rs'+item]==1,
		      	'yellow':message.secondContent.inds[scope.$index]['rs'+item]==2,
		      	'blue':message.secondContent.inds[scope.$index]['rs'+item]==3
		      }" v-if="message.secondContent.inds[scope.$index]['v'+item]">
		      {{fomatTwo(message.secondContent.inds[scope.$index]['v'+item])}}%
		      </div>
		      <div v-else>--</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	import {fomatFloat} from 'src/utils/utils.js'
    export default {
        props:['message'],
        computed:{
        	fomatTwo(){
        		return (data)=>{
        			var data = parseFloat(data.substring(0,data.length - 1))
        			return fomatFloat(data,2)
        		}
        	}
        }
    }
</script>

<style scoped>
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
</style>
