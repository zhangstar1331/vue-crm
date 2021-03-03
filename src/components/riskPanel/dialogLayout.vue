<!--  -->
<template>
  <div>
      <div class='bg' v-if='isSHow'>
        <div class='dialog'>
          <div class='head'>
            <!-- 标题 -->
            <p class='title' v-if='!routerInfo.noTitle'><i></i>{{routerInfo.title}}</p>
            <!-- 按钮 -->
            <div class='buttonList' v-if='routerInfo.buttonList'>
              <p class='button' :class="{active:index===tabIndex}" v-for='(button,index) in routerInfo.buttonList' :key='index' @click="toggleTab(index,button)">{{button.titName}}</p>
            </div>
            <i class="iconfont iconfd" @click ="setDialogLayout"></i>
          </div>
          <!-- 步骤条 -->
          <div class="step" v-if='routerInfo.showStepList'>
            <span
              v-for='(step,index) in routerInfo.stepList'
              :class='{right:index!==stepLength-1}'
              @click = gotoPage(index,step)
              :key='index'>
              {{step.title}}
            </span>
          </div>
          <!-- 组件内容 -->
          <div class="component">
          	<!--key值更改，则组件重新渲染-->
            <component :is='currentView' :message='message' :key="tabIndex"></component>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import qs from 'qs'
import {fomatFloat} from 'src/utils/utils.js'
//第一列三大风险
import meterLeft from './meterLeft/index'
//评级和得分
import rateScoreIndex from './rateScore/index'
import rateScoreSecond from './rateScore/second'
//第二列仪表盘风险
import strategyZero from './strategyMeter/zero'
import strategyIndex from './strategyMeter/index'
import strategySecond from './strategyMeter/second'
import strategyThird from './strategyMeter/third'
//右侧上三个风险首页
import riskIndex from './riskIndex/index'
// 红黄蓝风险监测评价结果第二层
import rybSecond from './rybRisk/rybSecond'
// 红黄蓝风险监测评价结果第三层
import rybThird from './rybRisk/rybThird'
// 操作风险第二页
import operateSecond from './operateRisk/operateSecond'
//集团特有风险首页
import specialIndex from './specialRisk/specialIndex'
//风险传染第一层
import riskInfect from './specialRisk/riskInfect'
//风险传染第二层
import riskInfectSecond from './specialRisk/riskInfectSecond'
//集中度风险第二层
import focusSecond from './specialRisk/focusSecond'
export default {
  name: 'rikDialog',
  props: [
    'isSHow',
    'close',
    'dadRouteInfo'
  ],
  components: {
    meterLeft,
    rateScoreIndex,
    rateScoreSecond,
    strategyZero,
    strategyIndex,
    strategySecond,
    riskIndex,
    rybSecond,
    rybThird,
    strategyThird,
    operateSecond,
    specialIndex,
    riskInfect,
    riskInfectSecond,
    focusSecond
  },
  data () {
    return {
      //组件名称
      currentView:'',
      //父子间参数
      routerInfo:{},
      //子组件参数
      message:null,
      tabIndex:0
    };
  },
  computed: {
    'stepLength'(){
      return this.routerInfo.stepList.length;
    },
  },
  methods: {
    //初始赋值操作
    init(){
      this.currentView = this.dadRouteInfo.componentName;
      this.message = this.dadRouteInfo.message;
      this.routerInfo = {...this.dadRouteInfo}
      this.tabIndex = this.dadRouteInfo.tabIndex || 0;
    },
    //切换标签
    toggleTab(index,tabMsg){
    	if(this.routerInfo.componentName.indexOf('strategy')!=-1 ){
    		this.message.content = tabMsg
    		this.tabIndex = index
    		var path = {
    			buttonList: true,
					noTitle: true,
					path: "strategyIndex",
					showStepList: false,
					title: tabMsg.titName,
    		}
    		this.gotoPage(0,path)
//  		if(!this.message.secondContent && !this.message.thirdContent){
//  			this.tabIndex = index
//  		}
//  		if(this.message.secondContent&&!this.message.thirdContent){
//  			this.routerInfo.stepList[0].title = tabMsg.titName
//		    	this.axios.post('/rmIndStass/indDashBoardByIndId',qs.stringify({recId:this.message.recId,indId:tabMsg.indId})).then((res)=>{
//						if(res.code == 200){
//							for(var i = 0; i < res.data.times.length; i++){
//								for(var j = 0; j < res.data.inds.length; j++){
//									if(res.data.inds[j]['v'+res.data.times[i]]){
//										res.data.inds[j]['v'+res.data.times[i]] = fomatFloat(res.data.inds[j]['v'+res.data.times[i]],2)
//									}
//								}
//							}
//							this.message.secondContent = res.data;
//							this.tabIndex = index
//						}else{
//							this.$alert(res.message)	
//						}
//					})
//  		}
//  		if(this.message.secondContent&&this.message.thirdContent){
//  			this.routerInfo.stepList[0].title = tabMsg.titName
//		    	this.axios.post('/rmIndStass/indDashBoardByIndId',qs.stringify({recId:this.message.recId,indId:tabMsg.indId})).then((res)=>{
//						if(res.code == 200){
//							this.message.secondContent = res.data;
//						}else{
//							this.$alert(res.message)	
//						}
//					})
//  			this.axios.post('/rmIndStass/indDashBoardMessByIndId',qs.stringify({recId:this.message.recId,indId:tabMsg.indId,subDate:this.message.thirdContent.time})).then((res)=>{
//						if(res.code == 200){
//							for(var i = 1; i <= 3; i++){
//								if(res.data['value'+i]){
//									res.data['value'+i] = fomatFloat(res.data['value'+i],2)
//								}
//							}
//							this.message.thirdContent = res.data;
//							this.tabIndex = index
//						}else{
//							this.$alert(res.message)	
//						}
//					})
//  		}
	    }else if(this.message.id == '70'||this.message.id == '80'){
	    	this.routerInfo.stepList[0].title = '集团' + tabMsg.titName +'首页'
	    	this.axios.post('/rmIndStass/indDashBoardByNodeRecId',qs.stringify({nodeId:this.message.id,recId:tabMsg.recId})).then((res)=>{
					if(res.code == 200){
						this.message.secondContent = res.data.inds;
						this.tabIndex = index
					}else{
						this.$alert(res.message)
					}
				})
	    }else{
	    	this.tabIndex = index
	      if(this.message && typeof(this.message) === 'object'){
	        if(this.routerInfo.componentName.indexOf('rateScore')!=-1){
	        	if(tabMsg.indName){//直接跳转到首页
		        	this.currentView = 'rateScoreIndex'
				      var arr = this.routerInfo.stepList.slice(0,1);
				      this.routerInfo.stepList = arr;
		        }
	        	this.message.content = tabMsg
	        	this.routerInfo.showStepList = false
	        }
	      }else{
	        this.message = index;
	      }
	    } 
	    if(tabMsg.path){
        this.currentView = tabMsg.path;
      }
      //控制步骤条
      if(tabMsg.noStepList!=undefined){
      	this.routerInfo.showStepList =!tabMsg.noStepList;
      }
      if(this.currentView == 'strategyIndex'){
      	this.routerInfo.showStepList = false
      }
    },
    //关闭弹框
    setDialogLayout(){
    	//组件名称
      this.currentView = ''
      //父子间参数
      this.routerInfo = {}
      //子组件参数
      this.message = null
      this.tabIndex = 0
      this.close()
    },
    //点击步骤条跳转页面
    gotoPage(index,path){
    	//将当前的内容传给首页
    	if(this.routerInfo.buttonList){
    		this.message.content = this.routerInfo.buttonList[this.tabIndex]
    	}
      let that = this;
      let i = that.stepLength-1;
      //关闭后面的步骤条
      while (i>index){
          this.routerInfo.stepList.splice(i,1);
          i--;
      }
      //字符串处理
      if(typeof(path)==='string'){
        
      }else{
        //对象处理
        //有链接时进行跳转
        if(path.path){
          this.currentView = path.path;
        }
        //点击第一个标签时处理标题
        if(index === 0){
          //是否显示按钮，是否显示标题，是否显示步骤条
          let {buttonList,noTitle,showStepList} = path;
          this.routerInfo.showStepList = showStepList;
          this.routerInfo.noTitle = noTitle;
          this.routerInfo.buttonList = buttonList?this.routerInfo.buttonList:[];
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.bg{
  position: fixed;
  top:61px;
  left:0;
  width:100%;
  height:calc(100vh - 61px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:rgba(6,6,6,.67);
  .dialog{
    width:1056px;
    height:630px;
    border-radius: 2px;
    background-color:#172758;
    padding:15px 20px;
    overflow-y: auto;
    .head,.step{
      position: relative;
      font-size:14px;
      display: flex;
      align-items: center;
      color:#fff;
      margin-bottom:15px;
      font-family: 'PingFangSC-Medium';
      .title{
        font-size: 16px;
        display: inline-block;
        position: relative;
        margin-bottom:15px;
        i{
          display: inline-block;
          width:5px;
          height:5px;
          border-radius: 50%;
          background-color:#56A9FF;
          margin-right:6px;
          position: relative;
          top:-3px;
        }
      }
      .iconfont{
        position: absolute;
        right:0;
        top:4px;
        font-size:14px;
        -webkit-text-fill-color:#fff;
        -webkit-text-stroke: 1px #fff;
      }
      .buttonList{
        margin-bottom:15px;
        .button{
          display: inline-block;
          padding:4px 10px;
          background-color: #365191;
          border-radius: 4px;
          margin-right:20px;
          cursor: pointer;
        }
        .active{
        	background-color: #6199FF;
        }
      }
    }
    .head{
      display: block;
    }
    .step{
      height:24px;
      span{
        cursor: pointer
      }
      .right::after{
        content: '>';
      }
    }
  }
  /deep/ .el-table, .el-table__expanded-cell{
		background-color:#546DBB;
	}
	/deep/ .el-table::before{
		height:0;
	}
}
</style>
