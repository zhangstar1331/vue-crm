<template>
  <div id="createIndicator">
	  <el-header class="header" style="padding-left:218px">
	  	<el-row>
		  	<el-col :span="12">
			  	<el-breadcrumb separator-class="el-icon-arrow-right">
					  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
					  <el-breadcrumb-item>指标管理</el-breadcrumb-item>
					  <el-breadcrumb-item :to="{path:'/riskMonitor/quoteManage?id=1_izbk'}"><span style="color: #606266;font-weight: normal;">指标库</span></el-breadcrumb-item>
					  <el-breadcrumb-item class="txtColor" v-if="this.$route.params.editid">编辑指标</el-breadcrumb-item>
					  <el-breadcrumb-item class="txtColor" v-else>新建指标</el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="12">
					<el-button type="primary" class="standardBtn" @click="submitInfo" size="mini">提交</el-button>
					<el-button type="primary" class="standardBtn" size="mini" @click="goback">返回</el-button>
			  </el-col>
		  </el-row>
	  </el-header>
	  <basic-indicator></basic-indicator>
	  <div class="contentBox">	
	  	<div class="titIcon"><em></em><span style="font-weight: 600;">指标定义</span></div>
			<div class="frame-content">
				<el-form label-position="left" class="demo-ruleForm" size="mini">
			      <el-row>
			        <el-col :span="12">
			        	<el-form-item label="报送口径">
							    <el-select class="inpframe" @change="vmodel('indicator.upCalibre')" v-model="indicatorObj.upCalibre" placeholder="请选择报送口径">
								   	<el-option v-for="item in indicatorArr.upCalibre" :key="item.id" :label="item.name" :value="item.id"></el-option>
								  </el-select>
								</el-form-item>
					    </el-col> 
			      </el-row>
			      <el-row>
			        <el-col :span="24">
			        	<el-form-item label="指标定义" class="fxType">
							    <el-input type="textarea" class="txtframe" :autosize="{minRows:2, maxRows:8}" placeholder="请输入内容" @change="vmodel('indicator.definition')" v-model="indicatorObj.definition"></el-input>
								</el-form-item>
					    </el-col> 
			      </el-row>
			    </el-form>
			</div>
		</div>
		<div class="contentBox">	
			<div class="titIcon"><em></em><span style="font-weight: 600;">计算规则</span></div>
			<div class="frame-content">
				<el-form label-position="left" class="demo-ruleForm" size="mini">
			      <el-row>
			        <el-col :span="24">
			        	<el-form-item label="计算方式">
							     <el-input class="allframe" placeholder="请输入计算方式"></el-input>
								</el-form-item>
					    </el-col> 
			      </el-row>
			      <el-row>
			        <el-col :span="24">
			        	<el-form-item label="计算说明">
							    <el-input type="textarea" class="txtframe" :autosize="{minRows:2, maxRows:8}" placeholder="请输入内容" v-model="textarea1"></el-input>
								</el-form-item>
					    </el-col> 
			      </el-row>
			    </el-form>
			</div>
		</div>
		<sent-info></sent-info>
		<sub-indicator></sub-indicator>
		<set-threshold v-if="indicatorObj.category=='1'"></set-threshold>
		<tolerance v-if="indicatorObj.isPref=='1'" :label="{'title':'设置风险容忍度','name':'容忍度值','item':'prefTolerance'}"/>
		<tolerance v-if="indicatorObj.isDf=='1'" :label="{'title':'设置东方风险容忍度','name':'容忍度值','item':'dfTolerance'}"/>
		<tolerance v-if="indicatorObj.isLimit=='1'" :label="{'title':'设置风险限额','name':'风险限额值','item':'limitTolerance'}"/>
  </div>
</template>
<script>
	import basicIndicator from 'src/components/check/indicatorCheck'
	import sentInfo from 'src/components/indicator/sentInfo'
	import subIndicator from 'src/components/indicator/subIndicator'
	import setThreshold from 'src/components/indicator/setThreshold'
	import tolerance from 'src/components/indicator/tolerance'
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		data(){
			return {
				aaa:'',
				textarea1:'',
				indicatorObj:{}
			}
		},
		components:{
    		basicIndicator,
    		sentInfo,
    		subIndicator,
    		setThreshold,
    		tolerance
   	},
   	created(){

   	},
   	mounted(){
   		if(this.$route.params.editid){
   			//存在editid即为编辑
   			this.setData({'indicator.id':this.$route.params.editid})
   		}else{
   			//新建，原数据清空
   			this.setData({'indicatorArr':JSON.parse(JSON.stringify(this.indicatorArrRes))})
   			this.setData({'indicator':JSON.parse(JSON.stringify(this.indicatorRes))})
   		}
   		this.indicatorObj = JSON.parse(JSON.stringify(this.indicator));
   	},
   	methods:{
   		...mapActions(['setData']),
   		/** 
   		 * 返回列表页
   		 */
   		goback(){
   			//清空数据
   			this.setData({'indicatorArr':JSON.parse(JSON.stringify(this.indicatorArrRes))})
		    this.setData({'indicator':JSON.parse(JSON.stringify(this.indicatorRes))})
   			if(this.$route.query.jobId){
   				this.$router.push({  //核心语句
		        path:'/editAssign',//跳转的路径
		        query:{
		        	jobId: this.$route.query.jobId
		        }
			    })
   			}else{
   				this.$router.replace('/riskMonitor/quoteManage?id=1_izbk')
   			}
   		},
   		/**
			 * 数据提交
			 */
		  submitInfo(){
		  		//数据非空校验
			  	for(var id in this.indicatorObj){
			  		//当前不进行校验的
			  		var arr = ['id','level','paramId','upCalibre','reportInfo','subIndicator','threshold','prefTolerance','dfTolerance','limitTolerance','flag','desRule']
			  		if(arr.indexOf(id)==-1){
			  			if(this.indicatorObj[id]==''){
								this.$alert(this.indicatorName[id]+'不能为空', '提示', {
						      confirmButtonText: '确定',
						      callback:action=>{
						      }
						    });
						    return;
							}
			  		}
			  	}
			  	//报送信息校验
			  	var reportFlag = false
			  	if(this.indicatorObj['reportInfo'].length){
			  		for(var i = 0;i < this.indicatorObj['reportInfo'].length; i++){
				  		for(var id in this.indicatorObj['reportInfo'][i]){
				  			if(this.indicatorObj['reportInfo'][i][id]==''){
				  				reportFlag = true
				  				break
				  			}
				  		}
				  	}
			  	}else{
			  		reportFlag = true
			  	}
			  	if(reportFlag){
			  		this.$alert('请将报送信息填写完整', '提示', {
				      confirmButtonText: '确定',
				      callback:action=>{
				      }
				    });
				    return;
			  	}
		  		//如果指标为否，则相关字段不传给后台,如果为是，则需要将相关内容填写完整
		  		if(this.indicatorObj.hasSub=='0'){
			  		delete(this.indicatorObj['subIndicator'])
			  	}
			  	if(this.indicatorObj.isPref=='0'){
			  		delete(this.indicatorObj['prefTolerance'])
			  	}else{	
			  		for(var i = 0; i < this.indicatorObj['prefTolerance'].length; i++){
			  			for(var id in this.indicatorObj['prefTolerance'][i]){
			  				if(this.indicatorObj.dataType == '2'){
			  					if(id == 'dataUnit'){
			  						continue
			  					}
			  				}
			  				if(id == 'expression'){
			  					continue
			  				}
			  				if(!this.indicatorObj['prefTolerance'][i][id]){
			  					this.$alert('请将风险容忍度填写完整', '提示', {
							      confirmButtonText: '确定',
							      callback:action=>{
							      }
							    });
							    return;
			  				}
			  			}
			  		}
			  	}
			  	if(this.indicatorObj.category!=='1'){
			  		delete(this.indicatorObj['threshold'])
			  	}else{
			  		var flag = false
			  		for(var i = 0; i < this.indicatorObj['threshold'].length; i++){
			  			if(this.indicatorObj['threshold'][i].company == ''){
			  				flag = true
			  			}
			  			var arr = []
			  			if(this.indicatorObj['threshold'][i]['blue'][0].indType){
			  				arr.push('blue')
			  			}
			  			if(this.indicatorObj['threshold'][i]['yellow'][0].indType){
			  				arr.push('yellow')
			  			}
			  			if(this.indicatorObj['threshold'][i]['red'][0].indType){
			  				arr.push('red')
			  			}
			  			if(this.indicatorObj['threshold'][i].defaultRyb == '1'){//默认红
			  				arr = ['blue','yellow']
			  			}
			  			if(this.indicatorObj['threshold'][i].defaultRyb == '2'){//默认黄
			  				arr = ['red','blue']
			  			}
			  			if(this.indicatorObj['threshold'][i].defaultRyb == '3'){//默认蓝
			  				arr = ['red','yellow']
			  			}
			  			if(arr.length<2){//必须得填两个
			  				flag = true
			  			}
			  			for(var j = 0; j < arr.length; j++){
			  				for(var k = 0; k < this.indicatorObj['threshold'][i][arr[j]].length; k++){
			  					for(var id in this.indicatorObj['threshold'][i][arr[j]][k]){
			  						if(this.indicatorObj.dataType == '2'){
						  				if(id == 'dataUnit'||id == 'param'||id == 'sign'){
					  						continue      
					  					}
						  			}
			  						if(!this.indicatorObj.paramId){
			  							if(id == 'param'){
					  						continue      
					  					}
			  						}
			  						if(this.indicatorObj['threshold'][i][arr[j]][k].indType == 'p'){
			  							if(id == 'sign'){
					  						continue      
					  					}
			  						}
			  						if(id == 'param'){
				  						continue      
				  					}
			  						if(id == 'sign'){
				  						continue      
				  					}
			  						if(this.indicatorObj['threshold'][i][arr[j]][k].indType == 't'){
			  							if(id == 'dataUnit'){
					  						continue      
					  					}
			  						}
			  						if(this.indicatorObj['threshold'][i][arr[j]][k].indType == 'e'){
			  							if(id == 'operator'||id == 'param'||id == 'sign'||id == 'value'||id == 'dataUnit'){
					  						continue      
					  					}
			  						}else{
			  							if(id == 'expression'){
					  						continue      
					  					}
			  						}
			  						if(this.indicatorObj['threshold'][i][arr[j]][k][id] == ''){
			  							flag = true
			  							break
			  						}
			  					}
			  					if(flag){
			  						break
			  					}
			  				}
			  				if(flag){
		  						break
		  					}
			  			}
			  		}
			  		if(flag){
			  			this.$alert('请将指标阈值填写完整', '提示', {
					      confirmButtonText: '确定',
					      callback:action=>{
					      }
					    });
					    return;
			  		}
			  	}
			  	if(this.indicatorObj.isLimit=='0'){
			  		delete(this.indicatorObj['limitTolerance'])
			  	}else{	
			  		for(var i = 0; i < this.indicatorObj['limitTolerance'].length; i++){
			  			for(var id in this.indicatorObj['limitTolerance'][i]){
			  				if(this.indicatorObj.dataType == '2'){
			  					if(id == 'dataUnit'){
			  						continue
			  					}
			  				}
			  				if(id == 'expression'){
			  					continue
			  				}
			  				if(!this.indicatorObj['limitTolerance'][i][id]){
			  					this.$alert('请将风险限额指标填写完整', '提示', {
							      confirmButtonText: '确定',
							      callback:action=>{
							      }
							    });
							    return;
			  				}
			  			}
			  		}
			  	}
			  	if(this.indicatorObj.isDf=='0'){
			  		delete(this.indicatorObj['dfTolerance'])
			  	}else{	
			  		/*
			  		for(var i = 0; i < this.indicatorObj['dfTolerance'].length; i++){
			  			for(var id in this.indicatorObj['dfTolerance'][i]){
			  				if(this.indicatorObj.dataType == '2'){
			  					if(id == 'dataUnit'){
			  						continue
			  					}
			  				}
			  				if(!this.indicatorObj['dfTolerance'][i][id]){
			  					this.$alert('请将东方风险偏好指标填写完整', '提示', {
							      confirmButtonText: '确定',
							      callback:action=>{
							      }
							    });
							    return;
			  				}
			  			}
			  		}
			  		*/
			  	}
			  	//如果存在红黄蓝指标，判断数据类型为枚举时，对应下面的value值为数组，将其转为字符串，中间用逗号隔开
			  	if(this.indicatorObj.dataType == '2' && this.indicatorObj['threshold']){
			  		var arr = ['blue','red','yellow']
			  		for(var i = 0; i < this.indicatorObj['threshold'].length; i++){
			  			for(var j = 0; j < arr.length; j++){
			  				for(var k = 0; k < this.indicatorObj['threshold'][i][arr[j]].length; k++){
			  					if(this.indicatorObj['threshold'][i][arr[j]][k].value instanceof Array){
			  						var str = ''
				  					for(var l = 0; l < this.indicatorObj['threshold'][i][arr[j]][k].value.length; l++){
				  						str += this.indicatorObj['threshold'][i][arr[j]][k].value[l] + ','
				  					}
				  					str = str.slice(0,str.length-1)
				  					this.indicatorObj['threshold'][i][arr[j]][k].value = str;
			  					}
			  				}
			  			}
			  		}
			  	}
			  	//如果存在容忍度，判断数据类型为枚举时，对应下面的value值为数组，将其转为字符串，中间用逗号隔开
			  	if(this.indicatorObj.dataType == '2'){
			  		var toleranceArr = ['prefTolerance','dfTolerance','limitTolerance']
				  	for(var k = 0; k < toleranceArr.length; k++){
				  		if(this.indicatorObj[toleranceArr[k]]){
					  		for(var i = 0; i < this.indicatorObj[toleranceArr[k]].length; i++){
					  			if(this.indicatorObj[toleranceArr[k]][i].value instanceof Array){
					  				var str = ''
				  					for(var l = 0; l < this.indicatorObj[toleranceArr[k]][i].value.length; l++){
				  						str += this.indicatorObj[toleranceArr[k]][i].value[l] + ','
				  					}
				  					str = str.slice(0,str.length-1)
				  					this.indicatorObj[toleranceArr[k]][i].value = str;
					  			}	
					  		}
					  	}
				  	}
			  	}
			  	var indicatorData = JSON.parse(JSON.stringify(this.indicatorObj));
			  	//指标定义换行处理
			  	if(indicatorData.definition && indicatorData.definition!=''){
			  		var str = indicatorData.definition;
			  		var reg=new RegExp("\n","g");
						str= str.replace(reg,"<br>");
						indicatorData.definition = str;
			  	}
			  	//数据提交或更新
			  	if(this.$route.params.editid){
			  		this.axios.post('/indicator/update',JSON.stringify(indicatorData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
		      		if(res.code == 200){
		      			this.$alert("提交成功", '提示', {
		              confirmButtonText: '确定',
		              callback:action=>{
		              		this.setData({'indicatorArr':JSON.parse(JSON.stringify(this.indicatorArrRes))})
		              	  this.setData({'indicator':JSON.parse(JSON.stringify(this.indicatorRes))})
							   			if(this.$route.query.jobId){
							   				this.$router.push({  //核心语句
									        path:'/editAssign',//跳转的路径
									        query:{
									        	jobId: this.$route.query.jobId
									        }
										    })
							   			}else{
							   				this.$router.replace('/riskMonitor/quoteManage?id=1_izbk')
							   			}	
		              }
		            });
		      		}else{
		      			if(res.message){
		      				this.$alert(res.message)
		      			}else{
		      				this.$alert('提交失败')
		      			}
		      		}
						})
			  	}else{
			  		this.axios.post('/indicator/add',JSON.stringify(indicatorData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
		      		if(res.code == 200){
		      			this.$alert("提交成功", '提示', {
		              confirmButtonText: '确定',
		              callback:action=>{
		              	  this.setData({'indicator':JSON.parse(JSON.stringify(this.indicatorRes))})
		              	  this.$router.replace('/riskMonitor/quoteManage?id=1_izbk')
		              }
		            });
		      		}else{
		      			if(res.message){
		      				this.$alert(res.message)
		      			}else{
		      				this.$alert('提交失败')
		      			}
		      		}
						})
			  	}
	    },
    	vmodel(key){
    		var obj = {}
    		const arr = key.split(".");
    		obj[key] = this.indicatorObj[arr[1]]
    		this.setData(obj)
    	}
   	},
   	computed:{
   		...mapState(['mmm','indicator','indicatorArr','indicatorRes','indicatorArrRes','indicatorName'])
   	},
   	watch:{
   		'indicator':{
   			handler(newVal){
   				this.indicatorObj = JSON.parse(JSON.stringify(this.indicator));
   			},
   			deep:true
   		}
   	}
	}
</script>
<style lang="scss">
	#createIndicator{
		.headBox {
			padding: 16px;
	    .txtColor span{
			  color: #4285F4 !important;
				font-weight: 700 !important;
		  }
		  .search{
		  	margin-left:10px;
		  	float:right;
		  	padding:10px 20px;
		  }
		  .el-breadcrumb{
		  	float:left;
		  	width:80%;
		  }
		  .el-button{
				width:68px;
				height:26px;
				padding:0px;
				font-size: 12px;
			}
	  }
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
		.txtColor span{
		  color: #4285F4 !important;
			font-weight: 700 !important;
	  }
		.standardBtn{
			width: 68px;
	    height: 26px;
	    float:right;
	    margin-left:10px;
	    padding: 0;
	    font-size: 12px;
		}
	  .contentBox{
	  	background: #fff;
			padding: 16px;
			-webkit-box-shadow: 4px 2px 6px #888;
			border-radius: 8px;
			margin-top:10px;
			.titIcon {
			  font-size: 14px;
			  margin-bottom: 30px;
			  width:80%;
			  float:left;
			  em {
			    display: inline-block;
			    width: 2px;
			    height: 14px;
			    background: #4285F4;
			    vertical-align: middle;
			    margin-right: 6px;
			  }
			}
			.frame-content{
		  	margin:0 auto;
		  } 
	  }
		.el-form-item::before{
			content: ' ';
			width:8px;
			height:2px;
			float: left;
		}
		.fxType:before {
	  	float: left;
	    content: '*';
	    color: #F56C6C;
	    margin-top: 7px;
		}
	  .inpframe{
	  	width:70%;
	  }
	  .allframe,.txtframe{
	  	width:92%;
	  }
	  .halfframe{
	  	width:34.4%;
	  }
	  .radioframe{
	  	float:right;
	  	margin-top:6px;
	  	margin-right:20%;
	  }
	}
</style>
