<!--仪表盘左边一列组件-->
<template>
  <div class="rate_score_index">
		<div class="rScontent">
			<span>{{message.content.indName}}</span>
			<span class="rScore" v-if="message.content.value" @click="gotoPage()">{{message.content.value}}</span>
			<i @click="gotoPage()" v-else></i>
		</div>
  </div>
</template>
<script>
	import echarts from 'echarts'
	import {chart,chart1} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
	  props:['message'],
	  components: {},
	  data () {
	    return {
				
	    };
	  },
	  methods:{
	  	gotoPage(){
	  		if(this.message.content.indId){
	  			this.axios.post('/rmIndStass/indDashBoardByIndId',qs.stringify({recId:this.message.recId,indId:this.message.content.indId})).then((res)=>{
	   				if(res.code == 200){
	   					/**
	   					 *产品特殊化要求 
	   					 *如果2019年数据没有，就用2018的值展示在2019上，如果2018也没有，就用2017的值，分别展示在2018和2019上。
	   					 */
	   					if(this.message.content.indName.indexOf('得分')!=-1){
	   						for(var i = res.data.times.length - 1; i >= 0; i--){
		   						for(var k = 0; k < res.data.inds.length; k++){
		   							if(!res.data.inds[k]['v'+res.data.times[i]]&&res.data.inds[k]['v'+ (res.data.times[i-1])]){
		   								res.data.inds[k]['v'+res.data.times[i]] = res.data.inds[k]['v'+ (res.data.times[i-1])]
		   								res.data.inds[k]['rs'+res.data.times[i]] = res.data.inds[k]['rs'+ (res.data.times[i-1])]
		   							}
		   							if(!res.data.inds[k]['v'+res.data.times[i]]&&res.data.inds[k]['v'+ (res.data.times[i-1])]&&res.data.inds[k]['v'+ (res.data.times[i-2])]){
		   								res.data.inds[k]['v'+res.data.times[i]] = res.data.inds[k]['v'+ (res.data.times[i-2])]
		   								res.data.inds[k]['rs'+res.data.times[i]] = res.data.inds[k]['rs'+ (res.data.times[i-2])]
		   							}
		   						}
		   					}
	   					}
	   					this.message.secondContent = res.data;
	   					let parent = this.$parent;
			        parent.routerInfo.stepList.push({
				        title:'第二层',
				        path:'rateScoreSecond',
			        });
			        parent.routerInfo.showStepList = true;
			        parent.message = this.message;
			        parent.currentView = 'rateScoreSecond';
	   				}else{
	   					this.$alert(res.message)	
	   				}
	   			})
	  		}
    	}
	  },
	  mounted(){
	  	
	  }
	}
</script>
<style lang='scss' scoped>
  .rate_score_index{
  	color:#fff;
  	.rScontent{
  		margin:40px;
  		span{
  			line-height:32px;
  			vertical-align:top;
  		}
  		.rScore{
	  		cursor:pointer;
	  		margin-left:120px;
	  		font-size:32px;
	  		display: inline-block;
	  	}
	  	i{
				display:inline-block;
				width:30px;
				height:4px;
				background:#FFF500;
				position:relative;
				top:-6px;
				cursor:pointer;
			}
  	}
  }
</style>