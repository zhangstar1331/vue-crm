<template>
    <div id="meter">
    	<div id="meterTitle">
    		<el-breadcrumb separator-class="el-icon-arrow-right">
			  	<el-breadcrumb-item><span style="color: #B4C5FA;cursor: pointer;" @click="backIndex">首页</span></el-breadcrumb-item>
			  	<el-breadcrumb-item><span style="color:#fff;">风险管理仪表盘</span></el-breadcrumb-item>
			</el-breadcrumb>
    	</div>
    	<div id= "meterContent">
    		<div id="meterLeft">
	          	<div id="insuranceMeter" class="bgLinear" @click ="setDialogLayout(1,1,20)">
	          		<div class="borderTop"></div>
	          		<div class="title">
	          			<i class="circle"></i><span>保险风险</span>
	          			<i class="iconfont iconfd" @click ="setDialogLayout(1,1,20)"></i>
	          		</div>
	          		<div class="barContent">
	          			<div class="barContentItem" v-for="(item,index) in meterData['20']" :key="index">
	          				<span class="barDw">({{item.unit}})</span>
				          	<div class="barTitle"><span>{{item.name}}</span></div>
				            <div :id="'insurance'+item.recId" class="caiXian"></div>
	          			</div>
		        	</div>
		        	<div class="borderBottom"></div>
	          	</div>
	            <div id="marketMeter" class="bgLinear" @click ="setDialogLayout(1,2,30)">
	            	<div class="borderTop"></div>
	            	<div class="title">
	          			<i class="circle"></i><span>市场风险</span>
	          			<i class="iconfont iconfd" @click ="setDialogLayout(1,2,30)"></i>
	          		</div>
	          		<div class="barContent">
	          			<div class="barContentItem" v-for="(item,index) in meterData['30']" :key="index">
	          				<span class="barDw">({{item.unit}})</span>
				          	<div class="barTitle"><span>{{item.name}}</span></div>
				            <div :id="'market'+item.recId" class="caiXian"></div>
	          			</div>
		        	</div>
	            	<div class="borderBottom"></div>
	            </div>
	            <div id="creditMeter" class="bgLinear" @click ="setDialogLayout(1,3,40)">
	            	<div class="borderTop"></div>
	            	<div class="title">
	          			<i class="circle"></i><span>信用风险</span>
	          			<i class="iconfont iconfd" @click ="setDialogLayout(1,3,40)"></i>
	          		</div>
	          		<div class="barContent">
	          			<div class="barContentItem" v-for="(item,index) in meterData['40']" :key="index">
	          				<span class="barDw">({{item.unit}})</span>
				          	<div class="barTitle"><span>{{item.name}}</span></div>
				            <div :id="'credit'+item.recId" class="caiXian"></div>
	          			</div>
		        	</div>
	            	<div class="borderBottom"></div>
	            </div>
	        </div>
	        <div id="meterCenter">
		        <div id="strategyMeter" class="bgLinear">
		        	<div class="borderTop"></div>
		        	<div class="title">
	          			<i class="circle"></i><span>战略风险</span>
	          		</div>
	          		<div class="strategyMsg">
	          			<p>集团</p>
	          			<p v-for="(item,index) in meterData['51']" :key="index">
	          				<span>{{item.name}}:</span>
	          				<span v-if="item.value" @click="setDialogLayout(3,index+1,{id:51,recId:item.recId})" style="cursor:pointer;color:#FFF500;">{{item.value}}</span>
	          				<i v-else @click="setDialogLayout(3,index+1,{id:51,recId:item.recId})"></i>
	          			</p>
	          		</div>
	          		<div id="gaugeContent">
	          			<ul>
	          				<li v-for="(item,index) in meterData['52']" :key="index" @click="setDialogLayout(4,index+1,{id:52,recId:item.recId})">
	          					<div class="gaugeTitle"><span>{{item.name}}</span></div>
								<i class="el-icon-caret-bottom" style="text-align:center;width:100%;"></i>
			            		<div :id="'strategy'+ (index + 1)" class="strategy1"></div>
	          				</li>
	          			</ul>
	          			<ul>
	          				<li v-for="(item,index) in meterData['53']" :key="index" @click="setDialogLayout(4,index+4,{id:53,recId:item.recId})">
	          					<div class="gaugeTitle"><span>{{item.name}}</span></div>
	          					<i class="el-icon-caret-bottom" style="text-align:center;width:100%;"></i>
			            		<div :id="'strategy'+ (index + 4)" class="strategy1"></div>
	          				</li>
	          			</ul>
	          		</div>
	            	<div class="borderBottom"></div>
		        </div>
		        <div id="mobilityMeter" class="bgLinear">
		        	<div class="borderTop"></div>
		        	<div class="title">
	          			<i class="circle"></i><span>流动性风险</span>
	          			<i class="iconfont iconfd" @click="setDialogLayout(4,10,60)"></i>
	          		</div>
	          		<div id="gaugeContent">
	          			<ul>
	          				<li v-for="(item,index) in meterData['60']" :key="index" @click="setDialogLayout(4,index+4,{id:60,recId:item.recId})">
	          					<div class="gaugeTitle"><span>{{item.name}}</span></div>
			            		<div :id="'strategy'+ (index + 7)" class="strategy2"></div>
			            		<!--<p v-if="item.isChild" style="text-align:center;">
			            			<span v-for="(child,index) in item.child" :key="index">{{child.name}}</span>
			            		</p>-->
	          				</li>
	          			</ul>
	          		</div>
	            	<div class="borderBottom"></div>
		        </div>
	        </div>
	        <div id="meterRight">
	            <div id="rybMeter" class="bgLinear">
	            	<div class="borderTop"></div>
	            	<div class="title">
	          			<i class="circle"></i><span>风险监测评价结果</span>
	          			<!--<i class="iconfont iconfd" @click ="setDialogLayout(6,1,{id:10})"></i>-->
	          		</div>
	          		<ul>
	          			<!--@click ="setDialogLayout(6,2,{id:10,recId:item.recId})"-->
	          			<li v-for="(item,index) in meterData['10']" :key="index" >
	          				<div class="title">
			          			<i class="circle"></i><span>{{item.name}}</span>
			          		</div>
			          		<div v-if="item.result==1" class="type">--&nbsp;&nbsp;&nbsp;&nbsp;</div>
			          		<div v-if="item.result==2" class="type">--&nbsp;&nbsp;&nbsp;&nbsp;</div>
			          		<div v-if="item.result==3" class="type">--&nbsp;&nbsp;&nbsp;&nbsp;</div>
			          		<div v-if="!item.result" class="type">--&nbsp;&nbsp;&nbsp;&nbsp;</div>
	          			</li>
	          		</ul>
	            	<div class="borderBottom"></div>
	            </div>
	            <div id="actionMeter" class="bgLinear">
	            	<div class="borderTop"></div>
	            	<div class="title">
	          			<i class="circle"></i><span>操作风险</span>
	          			<i class="iconfont iconfd" @click ="setDialogLayout(7,1,{id:70})"></i>
	          		</div>
	          		<ul>
	          			<li v-for="(item,index) in meterData['70']" :key="index" @click ="setDialogLayout(7,2,{id:70,recId:item.recId,tabIndex:index})">
	          				<div class="title">
			          			<i class="circle"></i><span>{{item.name}}</span>
			          		</div>
			          		<div class="type" :class="{active:item.value > 0}">{{item.value}}{{item.unit}}</div>
	          			</li>
	          		</ul>
	            	<div class="borderBottom"></div>
	            </div>
	            <div id="fameMeter" class="bgLinear">
	            	<div class="borderTop"></div>
	            	<div class="title">
	          			<i class="circle"></i><span>声誉风险</span>
	          			<i class="iconfont iconfd" @click ="setDialogLayout(8,1,{id:80})"></i>
	          		</div>
	          		<ul>
	          			<li v-for="(item,index) in meterData['80']" :key="index" @click ="setDialogLayout(8,2,{id:80,recId:item.recId,tabIndex:index})">
	          				<div class="title">
			          			<i class="circle"></i><span>{{item.name}}</span>
			          		</div>
			          		<div class="type" :class="{active:item.value > 0}">{{item.value}}{{item.unit}}</div>
	          			</li>
	          		</ul>
	            	<div class="borderBottom"></div>
	            </div>
	            <div id="specialMeter" class="bgLinear">
	            	<div class="borderTop"></div>
	            	<div class="title">
	          			<i class="circle"></i><span>集团特有风险</span>
	          			<i class="iconfont iconfd" @click ="setDialogLayout(9,1,{})"></i>
	          		</div>
	          		<div class="specialMsg">
	          			<div @click="specialFlag=false" :class="{'active':!specialFlag}">集中度风险</div>
	          			<div @click="specialFlag=true" :class="{'active':specialFlag}">风险传染</div>
	          		</div>
	          		<div class="lineContent" v-if="!specialFlag" @click ="setDialogLayout(9,1,{})">
	          			<span class="lineDw">%</span>
	          			<div id="line"></div>
	          		</div>
	          		<div class="riskContent" v-if="specialFlag">
	          			<ul>
		          			<li v-for="(item,index) in meterData['92']" :key="index" @click ="setDialogLayout(9,2,{id:92,recId:item.recId})">
		          				<div class="title">
				          			<i class="circle"></i><span>{{item.name}}</span>
				          		</div>
				          		<div class="type" :class="{'red':item.rybStatus==1,'yellow':item.rybStatus==2,'blue':item.rybStatus==3}">{{item.value}}{{item.unit}}</div>
		          			</li>
		          		</ul>
	          		</div>
	            	<div class="borderBottom"></div>
	            </div>
	        </div>
    	</div>
    	<dialogLayout
		ref = 'dialogLayout'
		:isSHow = 'dialogLayoutShow'
		:dadRouteInfo = 'routeInfo'
		:close = 'closeDialog'
		>
		</dialogLayout>
    </div>
</template>
<script>
import echarts from 'echarts'
import {mapState,mapActions} from 'vuex'
import {bar,chart,chart1,line,fomatFloat,compare} from 'src/utils/utils.js'
import dialogLayout from 'src/components/riskPanel/dialogLayout'
import qs from 'qs'
export default {
  data(){
    return {
      specialFlag:false,
      //控制弹框显示与否
	  dialogLayoutShow: false,
	  routeInfo:{
		//是否直接进去显示步骤条
		showStepList:null,
		//弹框显示组件
		componentName:null,
		//步骤条列表
		stepList:[],
	  },
      //折线图对象
      lineObj:null,
    }
  },
  beforeDestroy () {

  },
  methods:{
  	...mapActions(['setData']),
  	hideMenu(){
  		this.setData({'isCollapsed':true})
  	},
  	backIndex(){
  		this.$router.replace('/home/index')
  		this.setData({'isCollapsed':false})
  	},
  	//弹框显示，数据渲染
  	showDialogLayout(){
  		this.dialogLayoutShow = true;
		setTimeout(() => {
			this.$refs.dialogLayout.init();
		});
  	},
	//设置弹框参数  id:图形区域 1代表保险风险   stepLev:要展现的层级
	setDialogLayout(id,stepLev,message){
		switch (id) {
			case 1:
				this.leftRiskOption(stepLev,message)
				break;
			case 3:
				this.rateScoreOption(stepLev,message)
				break;
			case 4:
				this.strategyRiskOption(stepLev,message)
				break;
			case 6:
				this.rybRiskOption(stepLev,message)
				break;
			case 7:
				this.opeRiskOption(stepLev,message)
				break;
      		case 8:
		        this.opeRiskOption(stepLev,message)
		        break;
      		case 9:
		        this.specialRiskOption(stepLev,message)
		        break;
			default:
				break;
		}
	},
	//第一列三大风险参数配置
	leftRiskOption(stepLev,message){
		var path = 'meterLeft'
		var title = ''
		switch (stepLev) {
			case 1:
				title = '保险风险'
				break;
			case 2:
				title = '市场风险'
				break;
			case 3:
				title = '信用风险'
				break;
			default:
				break;
		}
		this.routeInfo = {
			showStepList:false,
			title,
			message,
			componentName:path,
			stepList:[{
				title,
				path
			}]
		}
		this.showDialogLayout()
	},
	//评级得分参数配置
	rateScoreOption(stepLev,message){
		this.axios.post('/rmIndStass/indDashBoardByRecId',qs.stringify({id:message.id,recId:message.recId})).then((res)=>{
   			if(res.code == 200){
				var title = res.data.inds[0].indName
				var buttonList = res.data.inds
				//初始化的时候，将返回数组第一部分的信息传过去展示
				message.content = res.data.inds[0]
				this.routeInfo = {
					noTitle:true,
					message,
					showStepList:false,
					componentName:'rateScoreIndex',
					buttonList,
					stepList:[{
						title:title+'首页',
						path:'rateScoreIndex',
						showStepList:false,
						buttonList:true,
						noTitle:true
					}]
				}
				this.showDialogLayout()
   			}else{
   				this.$alert(res.message)
   			}
	   	})
	},
	//中间仪表盘参数配置
	strategyRiskOption(stepLev,message){
		if(message && typeof(message) === 'object'){
			//跳转到二级页面
			this.axios.post('/rmIndStass/indDashBoardByRecId',qs.stringify({id:message.id,recId:message.recId})).then((res)=>{
	   			if(res.code == 200){
	   				let buttonList = res.data.inds
	   				message.subDate = res.data.subDate
	   				message.unit = res.data.unit
	   				this.axios.post('/rmIndStass/indDashBoardByIndId',qs.stringify({recId:message.recId,indId:buttonList[0].indId})).then((res)=>{
	   					if(res.code == 200){
	   						let path = 'strategySecond'
							let noTitle = true
							for(var i = 0; i < res.data.times.length; i++){
								for(var j = 0; j < res.data.inds.length; j++){
									if(res.data.inds[j]['v'+res.data.times[i]]){
										res.data.inds[j]['v'+res.data.times[i]] = fomatFloat(res.data.inds[j]['v'+res.data.times[i]],2)
									}
								}
							}
							message.secondContent = res.data
							this.routeInfo = {
								message,
								showStepList:true,
								noTitle,
								componentName:path,
								buttonList,
								stepList:[{
									title:buttonList[0].titName+'首页',
									path:'strategyIndex',
									showStepList:false,
									buttonList:true,
									noTitle:true
								},{
									title:'第二层',
									path:'strategySecond',
								}]
							}
							if(stepLev == 10){
								this.routeInfo.title = title
								this.routeInfo.stepList = [{
									title:title+'首页',
									path:'strategyZero',
									buttonList:false
								}]
								this.routeInfo.showStepList = false
							}
							this.showDialogLayout()
	   					}else{
	   						this.$alert(res.message)
	   					}
	   				})
	   			}else{
	   				this.$alert(res.message)
	   			}
	   		})
		}else{
			//放大使用
			this.routeInfo = {
				showStepList:false,
				title:'流动性风险',
				message,
				componentName:'strategyZero',
				stepList:[{
					title:'流动性风险首页',
					path:'strategyZero'
				}]
			}
			this.showDialogLayout()
		}
	},
	//红黄蓝模块参数设置
	rybRiskOption(stepLev,message){
		var title = '风险监测评价结果'
		//一级菜单
		if(stepLev===1){
			this.routeInfo = {
				title,
				message,
				showStepList:false,
				componentName:'riskIndex',
				stepList:[{
					title:'风险监测评价结果首页',
					path:'riskIndex',
				}]
			}
			this.showDialogLayout()
		}else{
			//二级菜单
			this.axios.post('/rmIndStass/indDashBoardRybMonr',qs.stringify({nodeId:message.id,sign:1})).then((res)=>{
				if(res.code == 200){
					message.secondContent = res.data
					message.secondOther = res.other;
					this.routeInfo = {
						title,
						message,
						showStepList:true,
						componentName:'rybSecond',
						stepList:[{
							title:'风险监测评价结果首页',
							path:'riskIndex',
						},{
							title:'第二层',
							path:'rybSecond',
						}]
					}
					this.showDialogLayout()
				}else{
					this.$alert(res.message)
				}
			})
		}
	},
	//操作/声誉风险模块参数设置
	opeRiskOption(stepLev,message){
		//一级菜单
		if(stepLev===1){
			this.routeInfo = {
				message,
				showStepList:false,
				componentName:'riskIndex',
				title: message.id===80?'声誉风险':'操作风险',
				stepList:[]
			}
			this.showDialogLayout()			
		}else{
			//二级菜单
			this.axios.post('/rmIndStass/indDashBoardByNodeRecId',qs.stringify({nodeId:message.id,recId:message.recId})).then((res)=>{
				if(res.code == 200){
					message.secondContent = res.data.inds
					this.routeInfo = {
						message,
						showStepList:true,
						componentName:'operateSecond',
						title: message.id===80?'声誉风险':'操作风险',
						stepList:[{
							title:'集团'+res.data.titles[message.tabIndex].titName+'首页',
							path:'riskIndex',
						},{
							title:'第二层',
							path:'operateSecond',
						}],
						buttonList:res.data.titles,
						noTitle:true,
						tabIndex:message.tabIndex
					}
					this.showDialogLayout()			
				}else{
					this.$alert(res.message)
				}
			})
		}
	},
  //集团特有风险
  specialRiskOption(stepLev,message){
    if(stepLev===1){
      this.routeInfo = {
      	message,
        showStepList:false,
        componentName:'specialIndex',
        noTitle:true,
        stepList:[],
        buttonList:[{
          titName:'集中度风险',
          path:'specialIndex',
          noStepList:true,
        },{
          titName:'风险传染',
          path:'riskInfect',
          noStepList:true,
        }]
      }
      this.showDialogLayout()
    }else{
      if(message.id===92){
      	this.axios.post('/rmIndStass/indDashBoardByNodeId',qs.stringify({nodeId:message.id})).then((res)=>{
	      	if(res.code == 200){
	      		message.secondContent = res.data
	      		this.routeInfo = {
			        message,
			        noTitle:true,
			        componentName:'riskInfectSecond',
			        showStepList:true,
			        stepList:[{
			          title:'风险传染首页',
			          path:'riskInfect',
			          buttonList:true,
			          noTitle:true,
			        },{
			          title:'第二层',
			          buttonList:true,
			        }],
			        buttonList:[{
			          titName:'风险传染',
			          noStepList:true,
			        }]
			    }
	      		this.showDialogLayout()
	      	}else{
	      		this.$alert(res.message)
	      	}
	    }) 
      }else{
      	this.axios.post('/rmIndStass/conDashBoardByRecId',qs.stringify({recId:message.recId,subDate:message.subDate})).then((res)=>{
	      	if(res.code == 200){
	      		message.secondContent = res.data.conList
	      		message.unit = res.data.unit
	      		this.routeInfo = {
			        message,
			        noTitle:true,
			        componentName:'focusSecond',
			        showStepList:true,
			        stepList:[{
			          title:'十五大客户集中度风险首页',
			          path:'specialIndex',
			          buttonList:true,
			          noTitle:true,
			        },{
			          title:'第二层',
			          buttonList:true,
			        }],
			        buttonList:[{
			          titName:res.data.titName,
			          noStepList:true,
			        }]
			    }
	      		this.showDialogLayout()
	      	}else{
	      		this.$alert(res.message)
	      	}
	    })
      }
    }
  },
  closeDialog(){
	this.dialogLayoutShow = false;
  },
  lineClick(params){
  	//后台有返回才允许点击
  	if(this.meterData['91'][0]['r'+params.name]){
  		this.setDialogLayout(9,2,{id:91,recId:this.meterData['91'][0].recId,subDate:params.name});
  	}
  },
  showLine(){
  	//右侧第四行集中度风险渲染
	var data = []
    var xData = this.meterData['91'][0].times
    for(var i = 0; i < xData.length; i++){
    	if(this.meterData['91'][0]['r'+xData[i]]){
    		var s = this.meterData['91'][0]['r'+xData[i]]
    		data.push(s.substring(0,s.length-1))
    	}else{
    		data.push(0)
    	}
    }
    this.lineObj = line('line',xData,data,this.$echarts,'15大投资客户占比');
    this.lineObj.on('click',this.lineClick)
  },
  },
  components:{
  	dialogLayout
  },
  computed:{
  	...mapState(['meterData'])
  },
  mounted(){
  	this.axios.post('/rmIndStass/indDashBoard').then((res)=>{
  		if(res.code == 200){
  			var meterArr = ['52','53','60']
  			for(var i = 0; i < meterArr.length; i++){
  				var middleData = res.data[meterArr[i]]
  				for(var j = 0; j < middleData.length; j++){
  					var middleItem = middleData[j]
  					if(middleItem.isChild){//存在子元素
  						var num1 = 0;
  						for(var k = 0; k < middleItem.child.length; k++){
  							var middleNum = middleItem.child[k].value
  							if(middleNum > num1){
  								num1 = middleNum
  							}
  						}
  						middleItem.blue[1] = compare(num1,parseFloat(middleItem.blue[1],2))
  					}else{
  						if(middleItem.value){
  							middleItem.blue[1] = compare(parseFloat(middleItem.value,2),parseFloat(middleItem.blue[1],2))
  						}
  					}
  				}
  			}
  			this.setData({'meterData':res.data})
  			this.$nextTick(() => {
  				//左边一列数据渲染
				var meterLeft = [this.meterData[20],this.meterData[30],this.meterData[40]]
				for(var j = 0; j < meterLeft.length; j++){
					var meter = meterLeft[j]
					var idName = ''
					if(j==0){
						idName = 'insurance'
			 		}
			 		if(j==1){
			 			idName = 'market'
			 		}
			 		if(j==2){
			 			idName = 'credit'
			 		}
					for(var i = 0; i < meter.length; i++){
				 		var data = [meter[i].value1,meter[i].value2]
				 		var xAxisData = [meter[i].name1.substr(0,4),meter[i].name2.substr(0,4)]
				 		bar(idName+meter[i].recId,data,xAxisData,this.$echarts)
				 	}
				}
				//中间仪表盘数据渲染
				var meterCenter = [this.meterData[52],this.meterData[53],this.meterData[60]]
				var count = 0;
				for(var j = 0; j < meterCenter.length; j++){
					var meter = meterCenter[j]
					for(var i = 0; i < meter.length; i++){
						count += 1
						//仪表盘红黄蓝颜色占比
						var redRate = meter[i].red[1] / meter[i].blue[1]
						var yellowRate = meter[i].yellow[1] / meter[i].blue[1]
						var msg = {
				 			max:meter[i].blue[1],//最大值
				 			rybRate:[redRate,yellowRate],//颜色占比
				 			unit:meter[i].unit,
				 		}
						if(meter[i].isChild){
							msg.data = {}
							for(var k = 0; k < meter[i].child.length; k++){
								var arr = []
								var obj = {}
								obj.id = meter[i].child[k].id
								obj.value = meter[i].child[k].value
								arr.push(obj)
								msg.data['child'+k] = arr
								msg['name'+k] = meter[i].child[k].name
							}
							chart1('strategy'+count,msg,10,8,-25,-26,this.$echarts)
						}else{
					 		msg.data = {//数据
				                name: "",
				                value: meter[i].value
			              	}
					 		chart('strategy'+count,msg,12,8,-30,this.$echarts)
						}	
				 	}
				}  
				this.showLine()
			})
        }
	})
	this.hideMenu()
  },
  watch:{
    specialFlag(newVal){
    	if(!newVal){
    		//折线图
		    this.$nextTick(() => {
		       this.showLine()
		    })
    	}
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/variable';
#meter{
    background:#0f0f2e;
    position:relative;
    #meterTitle{
    	.el-breadcrumb{
    		height:40px;
    		line-height:40px;
    		padding-left:16px;
    		font-size:$size;
    	}
    }
    div{
    	box-sizing: border-box;
    }
    .borderTop{
    	position:absolute;
    	top:-11px;
    	left:-3px;
    	width: 16px;
        height: 32px;
        background:#0f0f2e;
        border: 6px solid #0f0f2e;
        border-right-color:#56A9FF;
        z-index:10;
        transform:rotate(45deg);
		-ms-transform:rotate(45deg);
		-moz-transform:rotate(45deg);
		-webkit-transform:rotate(45deg);
		-o-transform:rotate(45deg);
    }
    .borderBottom{
    	position:absolute;
    	bottom:-11px;
    	right:-3px;
    	width: 16px;
        height: 32px;
        background:#0f0f2e;
        border: 6px solid #0f0f2e;
        border-left-color:#56A9FF;
        transform:rotate(45deg);
		-ms-transform:rotate(45deg);
		-moz-transform:rotate(45deg);
		-webkit-transform:rotate(45deg);
		-o-transform:rotate(45deg);
    }
    #meterFrame{
    	position:fixed;
    	width:60%;
    	height:70%;
    	top:20%;
    	left:20%;
    	background:#172758;
    	padding:12px 16px;
    	z-index:100;
    }
    #meterContent{
    	width:100%;
    	padding:0 16px 16px;
	    height:calc(100% - 101px);
	    position:fixed;
	    top:101px;
	    bottom:0;
	    background:#0f0f2e;
	    .title{
	    	font-size:$size;
	    	color:#fff;
	    	padding-left:20px;
	    	position:relative;
	    	.circle{
	    		display: inline-block;
	    		width:4px;
	    		height:4px;
	    		border-radius:50%;
	    		background:#56A9FF;
	    		position:absolute;
	    		top:calc(50% - 2px);
	    		left:12px;
	    	}
	    	.iconfont{
	    		float:right;
	    		font-size:14px;
	    		margin-top:-2px;
	    		-webkit-text-fill-color:#fff;
    			-webkit-text-stroke: 1px #fff;
	    	}
	    }
	    .bgLinear{
	    	background: -moz-linear-gradient(top, #1b2a52 0%, #0f0f2e 30%);
		    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1b2a52), color-stop(30%,#0f0f2e));
		    background: -webkit-linear-gradient(top, #1b2a52 0%,#0f0f2e 30%);
		    background: -o-linear-gradient(top, #1b2a52 0%,#0f0f2e 30%);
		    background: -ms-linear-gradient(top, #1b2a52 0%,#0f0f2e 30%);
		    background: linear-gradient(to bottom, #1b2a52 0%,#0f0f2e 30%);
	    }
	    #meterLeft{
	      width:28%;
	      height:100%;
	      float:left;
	      #insuranceMeter,#marketMeter,#creditMeter{
	        width:100%;
	        height:calc(33.3333333% - 8px);
	        padding:10px;
	        border:1px solid #56A9FF;
	        position:relative;
	        .barContent{
	        	text-align: center;
	        	height:90%;
	        	width:100%;
	        	margin:10px auto 0;
	        	color:#AFC3FF;
	        	font-size:12px;
	        	.barContentItem{
	        		width:50%;
	        		height:100%;
	        		float:left;
	        		position: relative;
	        		.barDw{
	        			position:absolute;
	       				top:10px;
	       				left:0;
	        		}
		        	.barTitle{
		        		margin: 10px 0;
		        	}
	        	}
	        }
	      }
	      #marketMeter{
	      	margin:12px 0;
	      }
	      	.caiXian,.renShou{
		      width:100%;
		      height:70%;
		      margin:0 auto;
		    }
	    }
	    #meterCenter{
	      width:44%;
	      height:100%;
	      float:left;
	      padding:0 20px;
	      #strategyMeter{
	      	position:relative;
	        width:100%;
	        padding:10px;
			height:calc(66.6666666% - 4px);
	        border:1px solid #56A9FF;
	        .strategyMsg{
	        	height:30px;
	        	background: #2a4176;
	        	border-radius:4px;
	        	margin-top:8px;
	        	p{
	        		float:left;
	        		color:#fff;
	        		width:30%;
	        		font-size:12px;
	        		line-height:30px;
	        		position:relative;
	        		span{
	        			margin-right:6px ;
	        		}
	        		i{
	        			display:inline-block;
	        			width:20px;
	        			height:2px;
	        			background:#FFF500;
	        			position:absolute;
	        			top:14px;
	        			cursor:pointer;
	        		}
	        	}
	        	p:nth-child(1){
	        		width:20%;
	        		text-align:center;
	        		padding-right:10%;
	        	}
	        }
	        #gaugeContent{
	        	height:calc(100% - 48px);
	        	ul{
	        		height:50%;
	        		li{
	        			width:33.3333333%;
	        			float:left;
	        			font-size:$size;
	        			color:#AFC3FF;
	        			height:100%;
	        			.gaugeTitle{
	        				text-align: center;
	        				margin:4px 0;
	        			}
	        			p{
	        				font-size:$size;
	        			}
	        		}
	        	}
	        	ul:nth-child(1){
	        		border-bottom:1px dashed rgba(80,55,221,0.6);
	        	}
	        }
	      }
	      #mobilityMeter{
	      	position:relative;
	        width:100%;
	        padding:10px;
	        margin-top:12px;
	        height:calc(33.3333333% - 8px);
	        border:1px solid #56A9FF;
	        #gaugeContent{
	        	height:calc(100% - 20px);
	        	ul{
	        		height:100%;
	        		li{
	        			width:33.3333333%;
	        			float:left;
	        			font-size:12px;
	        			color:#AFC3FF;
	        			height:100%;
	        			.gaugeTitle{
	        				text-align: center;
	        				margin:4px 0;
	        			}
	        		}
	        	}
	        }
	      }
	      .strategy1{
	      	height:calc(100% - 40px)
	      }
	      .strategy2{
	      	margin-top:14px;
	      	height:calc(100% - 40px)
	      }
	    }
	    #meterRight{
	      width:28%;
	      height:100%;
	      float:right;
	      .active{
	      	color:#FF6363;
	      }
	      #rybMeter,#specialMeter,#actionMeter,#fameMeter{
	      	position:relative;
	        width:100%;
	        padding:10px;
	        border:1px solid #56A9FF;
	      }
	      #rybMeter,#actionMeter{
	      	height:calc(26.3333333% - 8px);
	      }
	      #fameMeter{
	        height:12%;
	      }
	      #actionMeter,#fameMeter{
	      	margin:12px 0;
	      }
	      #specialMeter{
	      	height:calc(33.3333333% - 8px);
	      }
	      #rybMeter,#actionMeter,#fameMeter{
	      	ul{
		        width:calc(100% - 40px);
		        margin:4px auto;
		        color:#fff;
		        font-size:$size;
		      	li{
		      		cursor: pointer;
		      		width:100%;
		      		height:30px;
		      		border-radius:4px;
		      		background:#222f5f;
		      		line-height:30px;
		      		padding-right:10px;
		      		margin-top:$size/1.5;
		      		.title{
		      			width:80%;
		      			float:left;
		      			i{
		      				background: #fff;
		      			}
		      		}
		      		.type{
		      			width:20%;
		      			float:right;
		      			text-align:right;
		      		}
		      	}
	      	}
	      }
	      #specialMeter{
	      	.specialMsg{
	      		width:60%;
	      		margin: $size/2 auto;
	      		overflow:hidden;
	      		div{
	      			width:40%;
	      			float:left;
	      			height:24px;
	      			line-height:24px;
	      			border-radius:4px;
	      			text-align:center;
	      			background:#253567;
	      			color:#fff;
	      			font-size:$size;
	      			cursor:pointer;
	      		}
	      		div:nth-child(2){
	      			float:right;
	      		}
	      		.active{
	      			background:#5788e5;
	      		}
	      	}
	      	.lineContent{
	      		clear:both;
	        	height:90%;
	        	width:80%;
	        	margin:0 auto;
	        	color:#AFC3FF;
	        	font-size:$size;
	        	position: relative;
	        	#line{
		      		width:100%;
		      		height:calc(100% - 46px);
		      		margin:0 auto;
		      	}
	        }
	        .riskContent{
	        	clear:both;
	        	height:75%;
	        	width:calc(100% - 40px);
	        	padding-top:4px;
	        	margin:0 auto;
	        	overflow: scroll;
			    -ms-overflow-style: none;   //IE 10+
			    overflow: -moz-scrollbars-none;    //Firefox
	        	ul{
			        width:100%;
			        color:#fff;
			        font-size:$size;
			      	li{
			      		cursor: pointer;
			      		width:100%;
			      		border-radius:4px;
			      		background:#222f5f;
			      		line-height:30px;
			      		height:auto;
			      		padding-right:10px;
			      		margin:4px 0;
			      		overflow:hidden;
			      		position:relative;
			      		.title{
			      			width:80%;
			      			float:left;
			      			i{
			      				background: #fff;
			      			}
			      		}
			      		.type{
			      			position: absolute;
						    top: calc(50% - 15px);
						    width:20%;
						    right: 0;
			      			text-align:right;
			      			padding-right:16px;
			      		}
			      		.yellow{
					  		color: #FFD824;
					  	}
					  	.blue{
					  		color: #4285F4;
					  	}
					  	.red{
					  		color: #FF6363;
					  	}
			      	}
		      	}
	        }
	        .riskContent::-webkit-scrollbar {
			   	display:none;
			}
	      }
	    }
    }
}
</style>
