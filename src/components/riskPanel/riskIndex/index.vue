<!-- 红黄蓝一级页面 -->
<template>
  <div class='listBox'>
    <div
    class='list'
    v-for="(item,index) in meterData[message.id]"
    @click='gotoPage({id:message.id,recId:item.recId,tabIndex:index})'
    :key='index'>
        <span class='left'>{{item.name}}</span><span v-if="item.result==1">正常类</span><span v-if="item.result==2" class="active">关注类</span><span v-if="item.result==3" class="active">高度关注类</span><span class="active" v-else>{{item.value}}{{item.unit}}</span>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import qs from 'qs'
export default {
  props:['message'],
  components: {},
  computed: {
  	...mapState(['meterData'])
  },
  methods: {
    gotoPage(message){
    	let parent = this.$parent;
    	parent.routerInfo.stepList.push({
        title:'第二层',
        path:message.id === 10 ? null : 'rybSecond',
      });
      parent.routerInfo.showStepList = true;
      parent.message = message;
      parent.tabIndex = message.tabIndex;
      //红黄蓝风险
      if(message.id===10){
      	this.axios.post('/rmIndStass/indDashBoardRybMonr',qs.stringify({nodeId:message.id,sign:1})).then((res)=>{
					if(res.code == 200){
						parent.currentView = 'rybSecond';
						parent.message.secondContent = res.data;
						parent.message.secondOther = res.other;
						parent.routerInfo.stepList = [{
							title:"红黄蓝风险监测评价结果首页",
							path:'riskIndex',
						},{
							title:'第二层',
							path:'rybSecond',
						}]
					}else{
						this.$alert(res.message)
					}
				})
      }
    	//操作风险、声誉风险
      if(message.id===70||message.id===80){
    		this.axios.post('/rmIndStass/indDashBoardByNodeRecId',qs.stringify({nodeId:message.id,recId:message.recId})).then((res)=>{
					if(res.code == 200){
						parent.currentView = 'operateSecond';
						parent.message.secondContent = res.data.inds;
						parent.routerInfo.buttonList = res.data.titles
						parent.routerInfo.stepList = [{
							title:'集团'+res.data.titles[message.tabIndex].titName+'首页',
							path:'riskIndex',
						},{
							title:'第二层',
							path:'operateSecond',
						}]
						parent.routerInfo.noTitle = true;
					}else{
						this.$alert(res.message)
					}
				})
    	}
    }
  }
}

</script>
<style lang='scss' scoped>
    .listBox{
      margin:37px 20px;
    }
    .list{
        width:100%;
        box-sizing: border-box;
        background-color:rgba(97,153,255,0.24);
        border-radius: 4px;
        height:30px;
        margin-bottom:23px;
        span{
            display: inline-block;
            width:50%;
            text-align: right;
            line-height: 30px;
            color:#fff;
            font-size:12px;
            cursor: pointer;
            letter-spacing: 0;
            padding:0 20px;
            box-sizing: border-box;
        }
        .active{
        	color:#FF6363;
        }
        .left{
          text-align: left;
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
