<template>
	<div id="fxBase">
		<div id="top"></div>
		<div class="titIcon"><em></em><span style="font-weight: 600;">基本信息</span></div>
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div>
		        <el-form label-position="left"  class="demo-ruleForm" size="mini">
		            <el-row>
		                <el-col :span="10">
		                    <el-form-item>
		                    		<span>名<em class="fontWidth"></em>称</span>
		                        	<el-input v-model="fxName.comName" :readonly = 'true' class="fxIpt">
		                        	<el-select v-model="fxTime.region" slot="append" :disabled = 'toggleDisabled' class="fxTime" @change="changeTime" placeholder="请选择活动区域">
							    		<el-option v-for="item in fxTime.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    	</el-select>
		                        </el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="14">
		                	<el-form-item>
		                        <span>审批发布记录</span><el-input v-model="recordName.reName" :readonly = 'isRecond'  class="fxRecond" @change = 'getRecord' placeholder="填入提示：经董事会**次会议审议通过，**年**月印发，发文号**"></el-input>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		        </el-form>
		    </div>
		</template>
	   </el-form>
	</div>
</template>

<script>
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
		props:['detailData'],
	    data () {
	      return {
	      	toggleDisabled:false,
	      	isRecond:false,
	        formData: {},
	        form: {},
	        fxName: {
	            comName:''
	        },
	        recordName:{
	        	reName:''
	        },
	        fxTime: {
	          time: '',
	          region:new Date().getFullYear(),
	          unitsData:[]
	        },
	        fxSaveData:{
	      		name:'',
	      		year:new Date().getFullYear(),
	      		describe:''
	      	}
	      }
	    },
	    created () {
		  this.removeSession();
		  this.getYear();
		  this.setName();
		  this.$nextTick(()=>{
		  	sessionStorage.setItem('submitData',JSON.stringify(this.fxSaveData))
		  })
		},
	    methods: {
	      getYear(){
	      	var date = new Date();
 			var year= date.getFullYear()
 			var yearSize =  year - 2016;
 			for (var i = 0; i <= yearSize; i++) {
 				var obj = new Object();
 				obj.name = year - i;
 				obj.code = year - i;
 				this.fxTime.unitsData.push(obj)
 			}
	      },
	      changeTime(val){
	      	this.fxTime.time = val
	      	this.fxSaveData.year = val;
	      	var fxSaveData = JSON.parse(sessionStorage.getItem('submitData'));
	      		fxSaveData.year = val;
	      	sessionStorage.setItem('submitData',JSON.stringify(fxSaveData))
	      },
	      changeName(){
	      		this.fxSaveData.name = this.fxName.comName
	      		var fxSaveData = JSON.parse(sessionStorage.getItem('submitData'));
		      		fxSaveData.name = this.fxName.comName;
		      	sessionStorage.setItem('submitData',JSON.stringify(fxSaveData))
	      },
	      getRecord(){
	      		this.fxSaveData.describe = this.recordName.reName
	      		var fxSaveData = JSON.parse(sessionStorage.getItem('submitData'));
		      		fxSaveData.describe = this.recordName.reName;
		      	sessionStorage.setItem('submitData',JSON.stringify(fxSaveData))
	      },
	      removeSession(){
	      	sessionStorage.removeItem('detailData')
	      	sessionStorage.removeItem('saveDatas')
	      },
	      setName(){
	      	if(sessionStorage.stateType){
	      		this.fxSaveData.type = sessionStorage.stateType
	      	}else{
	      		this.fxSaveData.type = sessionStorage.limitType
	      	}
			if(sessionStorage.stateType == 1){
				this.fxName.comName = '中华联合保险集团股份有限公司风险偏好陈述书'
				this.fxSaveData.name = this.fxName.comName;
			}else if(sessionStorage.stateType == 2){
				this.fxName.comName = '中华联合财产保险股份有限公司风险偏好陈述书'
				this.fxSaveData.name = this.fxName.comName;
			}else if(sessionStorage.stateType == 3){
				this.fxName.comName = '中华联合人寿保险股份有限公司风险偏好陈述书'
				this.fxSaveData.name = this.fxName.comName;
			}else if(sessionStorage.limitType == 1){
				this.fxName.comName = '中华联合保险集团股份有限公司风险限额'
				this.fxSaveData.name = this.fxName.comName;
			}else if(sessionStorage.limitType == 2){
				this.fxName.comName = '中华联合财产保险股份有限公司风险限额'
				this.fxSaveData.name = this.fxName.comName;
			}else{
				this.fxName.comName = '中华联合人寿保险股份有限公司风险限额'
				this.fxSaveData.name = this.fxName.comName;
			}
		  }
	    },
	    watch: {
	      'detailData': {
	        handler: function (newVal, oldVal) {
	        	var fxSaveData = JSON.parse(sessionStorage.getItem('submitData'));
	        	if(newVal.length != ''){
	        		this.toggleDisabled = true
	        		if(newVal.isDetails){
	        			this.isRecond = true;
	        		}
	        	}
	        	if(sessionStorage.stateType){
	        		if(sessionStorage.reWriteInfo == 1){
	        			return;
	        		}
		        	//回填名称
		        	this.fxName.comName = newVal.pref.name;
					fxSaveData.name = newVal.pref.name;
					//回填时间
					this.fxTime.region = newVal.pref.year;
			      	fxSaveData.year = newVal.pref.year;
			      	//回填审批发布记录
			      	this.recordName.reName = newVal.pref.describe;
			      	fxSaveData.describe = newVal.pref.describe;
			      	sessionStorage.setItem('submitData',JSON.stringify(fxSaveData))
	        	}else{
	        		if(sessionStorage.reWriteInfo == 1){
	        			return;
	        		}
	        		//回填名称
		        	this.fxName.comName = newVal.quota.name;
					fxSaveData.name = newVal.quota.name;
					//回填时间
					this.fxTime.region = newVal.quota.year;
			      	fxSaveData.year = newVal.quota.year;
			      	//回填审批发布记录
			      	this.recordName.reName = newVal.quota.describe;
			      	fxSaveData.describe = newVal.quota.describe;
			      	sessionStorage.setItem('submitData',JSON.stringify(fxSaveData))
	        	}
	        },
	        deep: true
	      }
	    }
	  }
</script>

<style lang="scss">
#top{
	width: 100px;
	height: 20px;
	background: red;
	position: absolute;
	top: -100px;
}
#fxBase{
	height: 126px;
	background: #FFF;
	margin-bottom: 20px;
	border-radius: 8px;
	padding: 16px 20px 0 20px;
	-webkit-box-shadow: 4px 2px 6px #888;
	margin-top: 80px;
	.titIcon{
	    font-size:14px;
	    margin-bottom:20px;
	    em{
	      display: inline-block;
	      width: 2px;
	      height: 14px;
	      background: #4285F4;
	      vertical-align: middle;
	      margin-right: 6px;
	    }
	  }
	.el-form--inline .el-form-item{
		margin:0;	
	}  
	.fontWidth{
		display: inline-block;
		width: 24px;
	}
	.fxIpt{
		width:82%;
		margin-left:12px;
		input{
			color: #909191;
		}
	}
	.el-form-item{
		width: 100%;
	}
	.fxRecond{
		width: 80%;
		margin-left: 20px;
	}
	.fxTime{
		width: 80px;
	}
	.el-input--mini .el-input__inner{
		font-size: 12px;
		color: #909191;
		line-height: 32px;
		height: 32px;
	}
	.el-col:last-child{
		text-align: left;
	}
	.el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
		line-height: 32px;
		width: 100%;
	}  
	.el-input-group__append{
		background: transparent!important;
	}
}
.searchBtn,.saveBtn{
	width: 68px;
	height: 26px;
	line-height: 1px
}
</style>
