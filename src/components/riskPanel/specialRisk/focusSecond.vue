<template>
    <div id="focusSecond">
      <div id="focusDw" v-if="flag">单位：亿元</div>
      <div id="focusBar" v-if="flag"></div>
      <div class="riskTable flexTable">
        <div style="margin-top:10px" class="focusTable">
          	<el-table :data="message.secondContent"
          		:height="tableHeight"
          		:header-cell-style="{background:'#1D3270',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" 
          		:cell-style="{background:'#172758',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" 
          		style="width: 100%;overflow-y:auto;margin:0 auto;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;" 
          		:style="{maxHeight:flag?'170px':'500px'}">
				<el-table-column align="center" label="序号" type="index">
				</el-table-column>
				<el-table-column align="center" label="指标名称" prop="name">
				</el-table-column>
				<el-table-column align="center" :label="message.subDate">
					<template slot-scope="scope">
						<span v-if="message.secondContent[scope.$index].value">{{message.secondContent[scope.$index].value}}</span>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="项目标的所属行业" prop="induy">
				</el-table-column>
				<el-table-column align="center" label="评级" prop="level">
				</el-table-column>
			</el-table>
        </div>
      </div>
    </div>
</template>

<script>
	import {bar1} from 'src/utils/utils.js'
    export default {
    	props:['message'],
    	data(){
    		return {
    			flag:false,//柱状图数据是否有值，是否展示
    			tableHeight:'100%'
    		}
    	},
    	methods:{
    		initPage(){
    			var xData = []
		      	var data = []
		      	for(var i = 0; i < this.message.secondContent.length; i++){
		      		xData.push(this.message.secondContent[i].name)
		      		if(this.message.secondContent[i].value){
		      			data.push(this.message.secondContent[i].value)
		      		}else{
		      			data.push('')
		      		}
		      	}
		      	for(var i = 0; i < data.length; i++){
		      		if(data[i]){//有值
		      			this.flag = true
		      			break;
		      		}
		      	}
		      	this.$nextTick(()=>{	
			      	if(this.flag){
			      		bar1('focusBar',xData,data,this.$echarts)
			      	}
		      	})
    		}
    	},
        mounted(){
	      	this.initPage()
        }
    }
</script>

<style lang="scss" scoped>
	#focusSecond{
		.el-table__body{
		    height: 100%;
		    .tbody{
		    	height: 100%;     
		    }
		}
		#focusDw{
			width:96.8%;
			text-align:right;
			color:#fff;
		}
		#focusBar{
		    width:100%;
		    height:270px;
		    position: relative;
		}
	}
</style>
