<template>
  	<div id="detailIndicator">
		<el-header class="header" style="padding-left:218px">
	  		<el-row>
			  	<el-col :span="12">
				  	<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">指标管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span style="color: #909191;font-weight: 700"><span class="bread" @click="goBack">{{titleMsg}}</span></span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span style="color: #4285F4;font-weight: 700;">指标详情</span></el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="12">
					<el-button type="primary" @click="goBack" class="standardBtn">返回</el-button>
				</el-col>
		  	</el-row>
	  </el-header>
	  <div class="contentBox firstContent">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">基础信息</span></div>
			<el-row>
	      <el-col :span="8">
	      	<span class="fxType" style="float:left">指标名称：</span><span style="float:left;width:60%;">{{indicatorObj.name}}</span>
	      </el-col> 
	      <el-col :span="8">
	      	<span class="space">指标编号：</span><span>{{indicatorObj.serial}}</span>
	      </el-col>
	      <el-col :span="8">
	      	<span class="fxType" style="float:left;">风险大类：</span><span style="float:left;width:60%;">{{indicatorObj.riskId}}</span>
	      </el-col>  
	      <!-- <el-col :span="8">
	      	<span class="fxType">指标等级：</span><span>{{indicatorObj.level}}</span>
	      </el-col> -->  
	    </el-row>
	    <el-row>
	      <el-col :span="8">
	      	<span class="fxType">数据类型：</span><span>{{indicatorObj.dataType}}</span>
	      </el-col>  
	      <el-col :span="8">
	      	<span class="space">关联参数：</span><span>{{indicatorObj.paramName}}</span>
	      </el-col>
	      <el-col :span="8">
	      	<span class="fxType" style="float:left;">同环比计算方式：</span><span style="float:left;width:60%;">{{indicatorObj.thb}}</span>
	      </el-col>  
	    </el-row>
	    <el-row>
	      <el-col :span="8">
	      	<span class="fxType" style="float:left;">指标分类：</span><span style="float:left;width:60%;">{{indicatorObj.category}}</span>
	      </el-col>   
	    </el-row>
	    <el-row>
	      <el-col :span="8">
	      	<span class="fxType">是否为风险偏好指标：</span><span v-if="indicatorObj.isPref == 1">是</span><span v-else>否</span>
	      </el-col> 
	      <el-col :span="8">
	      	<span class="fxType">是否立即启用指标：</span><span v-if="indicatorObj.status == 1">是</span><span v-else>否</span>
	      </el-col>
	      <el-col :span="8">
	      	<span class="fxType">是否为风险限额指标：</span><span v-if="indicatorObj.isLimit == 1">是</span><span v-else>否</span>
	      </el-col>
	      <!-- <el-col :span="8">
	      	<span class="fxType">是否为红黄蓝风险指标：</span><span v-if="indicatorObj.isRyb == 1">是</span><span v-else>否</span>
	      </el-col> -->  
	    </el-row>
	    <el-row>
	      <el-col :span="8">
	      	<span class="fxType">是否为东方风险偏好指标：</span><span v-if="indicatorObj.isDf == 1">是</span><span v-else>否</span>
	      </el-col>  
	      <el-col :span="8">
	      	<span class="fxType">是否为可资本化风险指标：</span><span v-if="indicatorObj.isCapital == 1">是</span><span v-else>否</span>
	      </el-col>  
	    </el-row>
	  </div>
		<div class="contentBox" v-if="indicatorObj.upCalibre">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">指标定义</span></div>
			<el-row>
	      <el-col>
	      	<span>报送口径：</span><span>{{indicatorObj.upCalibre}}</span>
	      </el-col>  
	    </el-row>
	    <el-row>
	      <el-col>
	      	<span style="display:block;float:left;">指标定义：</span><span  style="display:block;float:left;" v-html="indicatorObj.definition"></span>
	      </el-col>  
	    </el-row>
		</div>
		<div class="contentBox" v-if="false">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">计算规则</span></div>
			<el-row>
	      <el-col>
	      	<span>计算方式：</span><span></span>
	      </el-col>  
	    </el-row>
	    <el-row>
	      <el-col>
	      	<span>计算说明：</span><span></span>
	      </el-col>  
	    </el-row>
		</div>
		<div class="contentBox" v-if="indicatorObj.reportInfo">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">报送信息</span></div>
			<el-table :data="indicatorObj.reportInfo" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column align="center" prop="company" label="适用对象"></el-table-column>
				<el-table-column align="center" prop="department" label="报送部门"></el-table-column>
				<el-table-column align="center" prop="frequency" label="报送频率"></el-table-column>
				<el-table-column align="center" prop="reportDate" label="有效期限">
					<template slot-scope="scope">
							<div style="width:100%" v-for="(item,index) in scope.row.reportDate">
								<span v-if="item.month">{{item.month}}月{{item.day}}号 {{item.hour}}：00</span>
								<span v-else>每月{{item.day}}号 {{item.hour}}：00</span>
							</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="act" label="获取类型"></el-table-column>
			</el-table>
			<div class="title" v-if="indicatorObj.subIndicator && indicatorObj.hasSub == 1 && indicatorObj.subIndicator.length"><span style="font-weight: 600;">子类指标</span></div>
			<div class="subIndicator" v-if="indicatorObj.subIndicator && indicatorObj.hasSub == 1 && indicatorObj.subIndicator.length">
				<el-row v-for="(item,index) in indicatorObj.subIndicator" :key="index">
		      <el-col>
		      	<span>N-{{index + 1}}:</span><span>{{item.name}}</span>
		      </el-col>  
		    </el-row>
			</div>
			<div style="margin-top:20px"  v-if="indicatorObj.category == '评价类'&&indicatorObj.reportInfo&&indicatorObj.reportInfo[0].frequency == '月度'">
				<el-row>
				    <el-col :span="8">
				      	<span class="space">是否为月度报送，按照季度合计数判断红黄蓝状态：</span><span v-if="indicatorObj.flag == 1">是</span><span v-else>否</span>
				    </el-col> 
				    <el-col :span="16">
			      		<span class="space">提交月度指标时校验规则：</span><span>{{indicatorObj.desRule}}</span>
			      	</el-col>  
			     </el-row>
		     </div>
		</div>
		<div class="contentBox" v-if="indicatorObj.threshold && indicatorObj.category == '评价类'">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">指标阈值</span></div>
			<div class="thresholdList" v-for="(threshold,index) in indicatorObj.threshold" :key="index">
				<div class="title"><span style="font-weight: 600;">{{threshold.company}}</span></div>
				<div class="threshold">
					<el-row v-for="(item,index) in bryArr" :key="index">
			      <div v-for="(thresholdItem,index) in threshold[item]" :key="index" style="display:inline-block">
			      	<div v-if="index == 0">
			      		<span class="thres" style="background: #4285F4;" v-if="item=='blue'">蓝</span>
			      		<span class="thres" style="background: yellow;" v-if="item=='yellow'">黄</span>
			      		<span class="thres" style="background: red;" v-if="item=='red'">红</span>
								<span v-if="item=='blue'">{{threshold.blueDes}}</span>
								<span v-if="item=='red'">{{threshold.redDes}}</span>
								<span v-if="item=='yellow'">{{threshold.yellowDes}}</span>
			      		<!--<span v-for="(value,key,index) in thresholdItem" :key="index" v-if="value" style="margin-right: 0;">
			      			<span v-if="value instanceof Array" v-for="(val,index) in value">{{val}}</span>
			      			<span v-if="value != '' && !(value instanceof Array)">{{value}}</span>
			      		</span>-->
			      		<!--<span v-if="threshold[item+'Relation'] == 1">且</span>
			      		<span v-if="threshold[item+'Relation'] == 2">或</span>-->
			      	</div>
			      	<div v-else>
			      		<!--<span v-for="(value,key,index) in thresholdItem" v-if="value" :key="index">
			      			{{value}}
			      		</span>-->
			      	</div>
			      </div>  
			    </el-row>
				</div>
			</div>
		</div>
		<div class="contentBox" v-if="indicatorObj.prefTolerance && indicatorObj.isPref == 1">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">设置风险容忍度</span></div>
			<el-row>
	      <el-col>
	      	<span class="toleTitle">容忍度值：</span>
	      	<div class="toleVal">
	      		<div v-for="(tolrance,index) in indicatorObj.prefTolerance" :key="index">
	      			<span>{{tolrance.des}}</span>
		      		<!--<span v-for="(value,key,index) in tolrance" v-if="value && key != 'companyName'">
		      			<span v-if="value instanceof Array" v-for="(val,index) in value">{{val}}</span>
			      		<span v-if="value != '' && !(value instanceof Array)">{{value}}</span>
		      		</span>-->
		      	</div>
	      	</div>
	      </el-col>   
	    </el-row>
		</div>
		<div class="contentBox" v-if="indicatorObj.dfTolerance && indicatorObj.isDf == 1">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">设置东方风险容忍度</span></div>
			<el-row>
	      <el-col>
	      	<span class="toleTitle">容忍度值：</span>
	      	<div class="toleVal">
		      	<div v-for="(tolrance,index) in indicatorObj.dfTolerance" :key="index">
		      		<span>{{tolrance.des}}</span>
		      		<!--<span v-for="(value,key,index) in tolrance" v-if="value && key != 'companyName'">
		      			<span v-if="value instanceof Array" v-for="(val,index) in value">{{val}}</span>
			      		<span v-if="value != '' && !(value instanceof Array)">{{value}}</span>
		      		</span>-->
		      	</div>
		      </div>
	      </el-col>   
	    </el-row>
		</div>
		<div class="contentBox" v-if="indicatorObj.limitTolerance && indicatorObj.isLimit == 1">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">设置风险限额</span></div>
			<el-row>
	      <el-col>
	      	<span class="toleTitle">风险限额值：</span>
	      	<div class="toleVal">
		      	<div v-for="(tolrance,index) in indicatorObj.limitTolerance" :key="index">
		      		<span>{{tolrance.des}}</span>
		      		<!--<span v-for="(value,key,index) in tolrance" v-if="value && key != 'companyName'">
		      			<span v-if="value instanceof Array" v-for="(val,index) in value">{{val}}</span>
			      		<span v-if="value != '' && !(value instanceof Array)">{{value}}</span>
		      		</span>-->
		      	</div>
		      </div>
	      </el-col>   
	    </el-row>
		</div>
		<div class="contentBox" v-if="indicatorObj.history">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">版本记录</span></div>
			<el-table :data="indicatorObj.history" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column align="center" prop="sn" label="版本号"></el-table-column>
				<el-table-column align="center" prop="name" label="指标名称"></el-table-column>
				<el-table-column align="center" prop="startDate" label="启用时间"></el-table-column>
				<el-table-column align="center" prop="stopDate" label="停用时间"></el-table-column>
			</el-table>
		</div>
		<div class="contentBox" v-if="indicatorObj.expire">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">超时限记录</span></div>
			<el-table :data="indicatorObj.expire" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column align="center" label="序号">
					<template slot-scope="scope">
						{{scope.$index + 1}}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="companyName" label="适用对象"></el-table-column>
				<el-table-column align="center" prop="departmentName" label="监测部门"></el-table-column>
				<el-table-column align="center" prop="date" label="超时批次"></el-table-column>
			</el-table>
		</div>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		data(){
			return {
				indicatorObj:{},
				bryArr:['blue','red','yellow'],
				reportFlag:'',
				titleMsg:'现行指标库'
			}
		},
		components:{
    	
   	},
   	created(){

   	},
   	mounted(){
			this.indicatorObj = JSON.parse(JSON.stringify(this.indicator));
			this.getCommData()
			if(this.$route.query.status == 0){
				this.titleMsg = '历史指标库'
			}
   	},
   	methods:{
   		...mapActions(['setData']),
   		/**
    	 * 初始化获取风险大类和关联参数信息
    	 */
    	getCommData(){
    		this.axios.post('/indicator/comm',{headers:{'Content-Type':'application/json'}}).then((res)=>{
	  			if(res.code==200){
	  				this.setData({'indicatorArr.riskId':res.data.kind})
	  				this.setData({'indicatorArr.paramId':res.data.param})
	  				this.setData({'indicatorArr.sentInfo.company':res.data.company})
	  				this.setData({'indicatorArr.reportInfo':this.indicatorArr.sentInfo})
	  				//指标详情页面数据由id转为name
	  				this.getShowData(this.indicatorObj,this.indicatorArr)
	  				if(this.indicatorObj.threshold){
	  					var arr = ['red','yellow','blue']
	  					for(var i = 0; i < this.indicatorObj.threshold.length; i++){
	  						for(var k = 0; k < arr.length; k++){
	  							for(var j = 0; j < this.indicatorObj.threshold[i][arr[k]].length; j++){
	  								if(this.indicatorObj.threshold[i][arr[k]][j].value instanceof Array){
  										for(var m = 0;m < this.indicatorObj.threshold[i][arr[k]][j].value.length; m++){
  											for(var l = 0;l < this.indicatorArr.threshold.value.length; l++){
					    						if(this.indicatorObj.threshold[i][arr[k]][j].value[m]==this.indicatorArr.threshold.value[l].id){
					    							this.indicatorObj.threshold[i][arr[k]][j].value[m]=this.indicatorArr.threshold.value[l].name
					    						}
					    					}
  										}
										}
	  								this.getShowData(this.indicatorObj.threshold[i][arr[k]][j],this.indicatorArr.threshold)
			  					}
	  						}
		  				}
	  				}
	  				var toleranceArr = ['prefTolerance','dfTolerance','limitTolerance']
	  				for(var j = 0; j < toleranceArr.length; j++){
	  					if(this.indicatorObj[toleranceArr[j]]){
		  					for(var i = 0; i < this.indicatorObj[toleranceArr[j]].length; i++){
		  						if(this.indicatorObj[toleranceArr[j]][i].value instanceof Array){
										for(var m = 0;m < this.indicatorObj[toleranceArr[j]][i].value.length; m++){
											for(var l = 0;l < this.indicatorArr.threshold.value.length; l++){
					    						if(this.indicatorObj[toleranceArr[j]][i].value[m]==this.indicatorArr.threshold.value[l].id){
					    							this.indicatorObj[toleranceArr[j]][i].value[m]=this.indicatorArr.threshold.value[l].name
					    						}
					    					}
										}
									}
			  					this.getShowData(this.indicatorObj[toleranceArr[j]][i],this.indicatorArr.threshold,'tolerance')
			  				}
		  				}
	  				}
	  			}
				})
    	},
    	getShowData(obj1,obj2,spec){
    		var sentInfo = JSON.parse(JSON.stringify(this.indicatorArr.sentInfo)); 
    		Object.keys(obj1).forEach(function(key){
    			if(key == 'value'){
    				if(obj1.operator != '7'){
    					return
    				}
    			}
    			if(!(obj1[key] instanceof Array)){
    				if(spec && key == 'indType'){
							obj1[key] = sentInfo.codpNames[obj1[key]]
						}
    				Object.keys(obj2).forEach(function(key1){
				    	if(key == key1){
				    		if(obj2[key1]){
				    			for(var j = 0;j < obj2[key1].length; j++){
					    			if(obj2[key1][j].id == obj1[key]){
					    				if(key == 'operator' || key == 'rightOperator'){
					    					obj1[key] = obj2[key1][j].label
					    				}else{
					    					obj1[key] = obj2[key1][j].name
					    				}
					    			}
					    		}
				    		}	
				    	}
						});
    			}else{
    				for(var i = 0; i < obj1[key].length; i++){
							Object.keys(obj1[key][i]).forEach(function(key3){
								if(key3 == 'department' || key3 == 'company'){
									obj1[key][i][key3] = sentInfo.codpNames[obj1[key][i][key3]]
								}
								if(obj2[key]){
									Object.keys(obj2[key]).forEach(function(key4){
							    	if(key3 == key4){
							    		if(obj2[key][key4]){
							    			for(var j = 0;j < obj2[key][key4].length; j++){
								    			if( obj2[key][key4][j].id == obj1[key][i][key3]){ 
								    				obj1[key][i][key3] = obj2[key][key4][j].name
								    			}
								    		}
							    		}
							    	}
									});
								}
							});
						}
    			}
				});
    	},
    	// 返回
    	goBack(){
   			if(this.$route.query.indId){
   				this.$router.push({  //核心语句
			        path:'/checkForm',//跳转的路径
			        query:{
			        	indId: this.$route.query.indId
			        }
			    })
   			}else{
   				this.$router.replace('/riskMonitor/quoteManage?id=1_izbk')
   			}
    	}
   	},
   	computed:{
   		...mapState(['indicator','indicatorArr'])
   	},
   	watch:{
   		
   	}
	}
</script>
<style lang="scss" scoped>
	#detailIndicator{
		.header{
			padding-left: 0;
		    padding-right: 2.6%;
		    padding-top: 15px;
		    position: fixed;
		    width: 100%;
		    -webkit-box-shadow: 4px 2px 6px #888;
		    height: 52px;
		    top: 60px;
		    left: 0;
		    background: #fff;
		    z-index: 99999;
			.el-breadcrumb{
				line-height: 30px;
			}
		}
		.bread:hover{
			cursor: pointer;
		}
		.el-breadcrumb{
		  	float:left;
		  	width:80%;
		}
	  .contentBox{
	  	background: #fff;
			padding: 16px;
			-webkit-box-shadow: 4px 2px 6px #888;
			border-radius: 8px;
			margin-top:10px;
			.titIcon {
			  font-size: 14px;
			  margin-bottom: 20px;
			  width:100%;
			  em {
			    display: inline-block;
			    width: 2px;
			    height: 14px;
			    background: #4285F4;
			    vertical-align: middle;
			    margin-right: 6px;
			  }
			}
			.title{
				font-size: 14px;
				margin:20px 0;
			}
			.el-row{
				margin:10px 0 20px;
				span{
					font-size:14px;
					color:#606266;
					margin-right:1px;
				}
			}
			.subIndicator{
				border:1px solid #E9E9E9;
				padding:10px 20px;
			}
			.thresholdList{
				.threshold{
					.el-row{
						border:1px solid #E9E9E9;
						padding:20px 30px;
						margin:0;
						.thres{
							display:inline-block;
							width:50px;
							height:28px;
							color:#fff;
							text-align: center;
							line-height: 28px;
						}
					}
				}
			}
			.toleTitle{
				line-height:18px;
			}
			.toleTitle,.toleVal{
				float:left;
			}
	  }
	  	.firstContent{
	  		margin-top:75px
	  	}
		.space::before{
			content: ' ';
			width:6px;
			height:2px;
			float: left;
		}
		.fxType:before {
	  	float: left;
	    content: '*';
	    color: #F56C6C;
	    margin-top: 3px;
		}
		.standardBtn{
			width: 68px;
		    height: 26px;
		    float:right;
		    margin-left:10px;
		    padding: 0;
		    font-size: 12px;
		}
	}	 
</style>
