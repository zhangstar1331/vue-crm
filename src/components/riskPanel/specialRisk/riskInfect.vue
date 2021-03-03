<template>
    <div>
      <div class='listBox'>
        <div
          class='list'
          v-for="(item,index) in meterData['92']"
          @click='gotoPage(index)'
          :key='index'>
          <span class='left'>{{item.name}}</span><span v-if="item.rybStatus==1" class="type" style="color:#FF6363;">{{item.value}}{{item.unit}}</span><span v-if="item.rybStatus==2" class="type" style="color:#FFE600;">{{item.value}}{{item.unit}}</span><span v-if="item.rybStatus==3" class="type" style="color:#18BFFF;">{{item.value}}{{item.unit}}</span>
        </div>
      </div>
    </div>
</template>

<script>
	import {mapState} from 'vuex'
	import qs from 'qs'
    export default {
      computed:{
      	...mapState(['meterData'])
      },
      methods:{ 	
        gotoPage(index){
        	this.axios.post('/rmIndStass/indDashBoardByNodeId',qs.stringify({nodeId:92})).then((res)=>{
		      	if(res.code == 200){
		      		let parent = this.$parent;
			        parent.routerInfo.stepList = [{
			            title:'风险传染首页',
			            path:'riskInfect',
			            buttonList:true,
			            noTitle:true,
			        },{
			            title:'第二层',
			            path:'riskInfectSecond',
			        }];
			        parent.routerInfo.showStepList = true;
			        parent.currentView = 'riskInfectSecond';
			        parent.message.secondContent = res.data;
		      	}else{
		      		this.$alert(res.message)
		      	}
		    })
        }
      }
    }
</script>

<style lang='scss' scoped>
  .listBox{
    margin:30px 20px;
  }
  .list{
    width:100%;
    box-sizing: border-box;
    background-color:rgba(97,153,255,0.24);
    border-radius: 4px;
    height:30px;
    margin-bottom:20px;
    span{
      display: inline-block;
      width:20%;
      text-align: right;
      line-height: 30px;
      color:#fff;
      font-size:12px;
      cursor: pointer;
      letter-spacing: 0;
      padding:0 20px;
      box-sizing: border-box;
    }
    .left{
      text-align: left;
      width:80%;
    }
    .left:before{
      display: inline-block;
      content: '';
      background-color:#fff;
      width:5px;
      height:5px;
      border-radius: 50%;
      margin-right:7px;
    }
  }
</style>
