<!--仪表盘左边一列组件-->
<template>
  <div class="strategy_meter_second">
  	<p>{{message.secondContent.unit}}</p>
		<div id="strategyLine"></div>
		<div class="table-content">
	  	<el-table :data="message.secondContent.inds" :header-cell-style="{background:'#1D3270',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" :cell-style="{background:'#172758',color:'#AFC3FF',borderBottom:'1px solid #546DBB'}" style="width: 100%;margin:20px auto 0;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;">
				<el-table-column align="center" min-width="140%" label="指标名称" prop="">
					<template slot-scope="scope">
						<span v-if="message.secondContent.inds.length>1">{{parentName}}（{{message.secondContent.inds[scope.$index].indName}}）</span>
						<span v-else>{{message.secondContent.inds[scope.$index].indName}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" v-for="(item,index) in message.secondContent.times" :key="index" :label="''+item">
					<template slot-scope="scope">
			      <div class="bgColor" :class="{
			      	'red':message.secondContent.inds[scope.$index]['rs'+item]==1,
			      	'yellow':message.secondContent.inds[scope.$index]['rs'+item]==2,
			      	'blue':message.secondContent.inds[scope.$index]['rs'+item]==3
			      }" v-if="message.secondContent.inds[scope.$index]['v'+item]">
			      {{message.secondContent.inds[scope.$index]['v'+item]}}{{message.unit}}
			      </div>
			      <div v-else>--</div>
					</template>
				</el-table-column>
			</el-table>
  	</div>
  </div>
</template>
<script>
	import echarts from 'echarts'
	import {line,fomatFloat} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
	  props:['message'],
	  data(){
	  	return {
	  		parentName:''
	  	}
	  },
	  methods:{
	  	initPage(){
	  		let parent = this.$parent;
	  		this.parentName = parent.routerInfo.buttonList[0].indName
	  		var xData = this.message.secondContent.times
	  		var indsData = this.message.secondContent.inds
	  		var lineData = []
	  		for(var j = 0; j < indsData.length; j++){
	  			var data = []
	  			for(var i = 0; i < xData.length; i++){
	  				if(indsData[j]['v'+xData[i]]){
	  					data.push(indsData[j]['v'+xData[i]])
	  				}else{
	  					data.push('')
	  				}
	  			}
	  			lineData.push(data)
	  		}
	  		if(this.message.secondContent.isChild){
	  			line('strategyLine',xData,lineData[0],this.$echarts,'',lineData[1])
	  		}else{
	  			line('strategyLine',xData,lineData[0],this.$echarts)
	  		}
	  		/*
			   * Echarts节点添加点击事件
			   * */
			  let volume = this.$echarts.init(document.getElementById('strategyLine'));
		  	var that = this;
				volume.on('click', function (handler){
						let parent = that.$parent;
						that.axios.post('/rmIndStass/indDashBoardMessByIndId',qs.stringify({recId:that.message.recId,indId:parent.routerInfo.buttonList[parent.tabIndex].indId,subDate:handler.name})).then((res)=>{
							if(res.code == 200){
								if(res.data.name1){
									for(var i = 1; i <= 3; i++){
										if(res.data['value'+i]){
											res.data['value'+i] = fomatFloat(res.data['value'+i],2)
										}
									}
									//跳转到三级页面
				    			that.gotoPage(res.data)
								}
							}else{
								this.$alert(res.message)
							}
						})
				})
	  	},
	  	gotoPage(message){
        let parent = this.$parent;
        parent.routerInfo.stepList.push({
	        title:'第三层',
	        path:'strategyThird',
        });
        parent.routerInfo.showStepList = true;
        parent.message.thirdContent = message;
        parent.currentView = 'strategyThird';
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
  .strategy_meter_second{
  	p{
  		width:79%;
  		color:#AFC3FF;
  		margin:0 auto;
  		font-size:12px;
  	}
  	#strategyLine{
  		width:80%;
  		height:220px;
  		margin:10px auto;
  	}
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