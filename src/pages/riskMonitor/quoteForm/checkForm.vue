<template>
  	<el-container id="checkForm">
	  	<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span class="textColor1">风险监测指标管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor1 bread" @click="back">风险指标报表</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor">{{titMsg}}</span></el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="9">
					<el-button type="primary" size="mini" @click="back">返回</el-button>
			  	</el-col>
		  	</el-row>
	  	</el-header>
  		<div class="box" v-if="!this.$route.query.isWarn">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">基础信息</span></div>
			<div class="taskInfo">
				<el-row>
					<el-col :span="4">
						<div class="itemDiv quoteName">
							<span>指标名称：</span><span>{{baseInfo.name == null?'--':baseInfo.name}}</span>
						</div>
	                </el-col>
	                <el-col :span="5" :offset="1">
	                	<div class="itemDiv">
							<span>指标分类：</span>
							<span v-if="baseInfo.indCat == undefined || baseInfo.indCat == null">--</span>
							<span v-else>{{indCat[baseInfo.indCat]}}</span>
						</div>
	                </el-col>
	                <el-col :span="5">
	                	<div class="itemDiv">
							<span>报送频率：</span><span>{{baseInfo.rate == null?'--':frequency[baseInfo.rate]}}</span>
						</div>
	                </el-col>
	                <el-col :span="5">
						<div class="itemDiv">
							<span>生效日期：</span><span>{{baseInfo.validDate == null?'--':baseInfo.validDate}}</span>
						</div>
	                </el-col>
				</el-row>
				<el-row v-if="baseInfo.rybStatus&&baseInfo.rybStatus !== 0">
					<el-col :span="3">
	                	<div class="itemDiv">
							<span>本期预警级别：</span>
							<span v-if="baseInfo.rybStatus !== 0" :class="{'redBg ':baseInfo.rybStatus == 1,'yellowBg ':baseInfo.rybStatus == 2,'blueBg ':baseInfo.rybStatus == 3}">
								{{['无','红','黄','蓝'][baseInfo.rybStatus]}}
							</span>
						</div>
	                </el-col>
	                <el-col :span="5" :offset="2">
						<div class="itemDiv">
							<span class="redBg newwidth" :title="baseInfo.redv">{{baseInfo.redv}}</span>
						</div>
	                </el-col>
	                <el-col :span="5">
						<div class="itemDiv">
							<span class="yellowBg newwidth" :title="baseInfo.yellowv">{{baseInfo.yellowv}}</span>
						</div>
	                </el-col>
	                <el-col :span="5">
						<div class="itemDiv">
							<span class="blueBg newwidth" :title="baseInfo.bluev">{{baseInfo.bluev}}</span>
						</div>
	                </el-col>
				</el-row>
				<el-row v-if="baseInfo.ispref == 1">
					<el-col :span="3" v-if="baseInfo.prefBtn !== undefined">
	                	<div class="itemDiv">
							<span>突破容忍度情况：</span>
							<span :class="{'redBg ':baseInfo.prefBtn == 1,'':baseInfo.prefBtn == 0}">{{baseInfo.prefBtn == '1'?'突破':'未突破'}}</span>
						</div>
	                </el-col>
	                <el-col :span="5" v-if="baseInfo.prefBtn == undefined">
						<div class="itemDiv">
							<span>容忍度：</span>
							<span :class="{'redBg newwidth':baseInfo.prefBtn == 1,'newwidth':baseInfo.prefBtn == 0}" :title="baseInfo.prefv">{{baseInfo.prefv}}</span>
						</div>
	                </el-col>
	                <el-col :span="5" :offset="2" v-if="baseInfo.prefBtn !== undefined">
						<div class="itemDiv">
							<span>容忍度：</span>
							<span :class="{'redBg newwidth':baseInfo.prefBtn == 1,'newwidth':baseInfo.prefBtn == 0}" :title="baseInfo.prefv">{{baseInfo.prefv}}</span>
						</div>
	                </el-col>
				</el-row>
				<el-row v-if="baseInfo.islimit == 1">
					<el-col :span="3" v-if="baseInfo.limitBtn !== undefined">
	                	<div class="itemDiv">
							<span>突破限额情况：</span>
							<span :class="{'redBg ':baseInfo.limitBtn == 1,'':baseInfo.limitBtn == 0}">{{baseInfo.limitBtn == '1'?'突破':'未突破'}}</span>
						</div>
	                </el-col>
	                <el-col :span="5" v-if="baseInfo.limitBtn == undefined">
						<div class="itemDiv">
							<span>限额：</span>
							<span :class="{'redBg newwidth':baseInfo.limitBtn == 1,'newwidth':baseInfo.limitBtn == 0}" :title="baseInfo.limitv">{{baseInfo.limitv}}</span>
						</div>
	                </el-col>
	                <el-col :span="5" :offset="2" v-if="baseInfo.limitBtn !== undefined">
						<div class="itemDiv">
							<span>限额：</span>
							<span :class="{'redBg newwidth':baseInfo.limitBtn == 1,'newwidth':baseInfo.limitBtn == 0}" :title="baseInfo.limitv">{{baseInfo.limitv}}</span>
						</div>
	                </el-col>
				</el-row>
				<el-row v-if="baseInfo.indChild">
					<el-col>
						<div class="itemDiv" v-for="(item,index) in baseInfo.indChild" style="display:inline-block;margin-right:50px">
							<span>子类指标-{{index+1}}：</span><span>{{item.name}}</span>
						</div>
	                </el-col>
				</el-row>
				<el-row>
					<el-col>
						<div class="itemDiv">
							<span>参照标准：</span><span>{{baseInfo.paramValue == null?'--':baseInfo.paramValue}}</span>
						</div>
	                </el-col>
				</el-row>
			</div>
		</div>
		<el-collapse v-model="activeNames" v-if="this.$route.query.isWarn">
			<el-collapse-item title="" name="1">
				<template slot="title">
			    	<em></em><span>基础信息</span>
			    </template>
				<div class="taskInfo">
					<el-row>
						<el-col :span="4">
							<div class="itemDiv quoteName">
								<span>指标名称：</span><span>{{baseInfo.name == null?'--':baseInfo.name}}</span>
							</div>
		                </el-col>
		                <el-col :span="5" :offset="1">
		                	<div class="itemDiv">
								<span>指标等级：</span>
								<span v-if="baseInfo.level == undefined || baseInfo.level == null|| baseInfo.level == '0'">--</span>
								<span v-else>{{baseInfo.level == '1'?'一类':'二类'}}</span>
							</div>
		                </el-col>
		                <el-col :span="5">
		                	<div class="itemDiv">
								<span>报送频率：</span><span>{{baseInfo.rate == null?'--':frequency[baseInfo.rate]}}</span>
							</div>
		                </el-col>
		                <el-col :span="5">
							<div class="itemDiv">
								<span>生效日期：</span><span>{{baseInfo.validDate == null?'--':baseInfo.validDate}}</span>
							</div>
		                </el-col>
					</el-row>
					<el-row v-if="baseInfo.rybStatus&&baseInfo.rybStatus !== 0">
						<el-col :span="3">
		                	<div class="itemDiv">
								<span>本期预警级别：</span>
								<span v-if="baseInfo.rybStatus !== 0" :class="{'redBg ':baseInfo.rybStatus == 1,'yellowBg ':baseInfo.rybStatus == 2,'blueBg ':baseInfo.rybStatus == 3}">
									{{['无','红','黄','蓝'][baseInfo.rybStatus]}}
								</span>
							</div>
		                </el-col>
		                <el-col :span="5" :offset="2">
							<div class="itemDiv">
								<span class="redBg newwidth" :title="baseInfo.redv">{{baseInfo.redv}}</span>
							</div>
		                </el-col>
		                <el-col :span="5">
							<div class="itemDiv">
								<span class="yellowBg newwidth" :title="baseInfo.yellowv">{{baseInfo.yellowv}}</span>
							</div>
		                </el-col>
		                <el-col :span="5">
							<div class="itemDiv">
								<span class="blueBg newwidth" :title="baseInfo.bluev">{{baseInfo.bluev}}</span>
							</div>
		                </el-col>
					</el-row>
					<el-row v-if="baseInfo.ispref == 1">
						<el-col :span="3" v-if="baseInfo.prefBtn !== undefined">
		                	<div class="itemDiv">
								<span>突破容忍度情况：</span>
								<span :class="{'redBg ':baseInfo.prefBtn == 1,'':baseInfo.prefBtn == 0}">{{baseInfo.prefBtn == '1'?'突破':'未突破'}}</span>
							</div>
		                </el-col>
		                <el-col :span="5" v-if="baseInfo.prefBtn == undefined">
							<div class="itemDiv">
								<span>容忍度：</span>
								<span :class="{'redBg newwidth':baseInfo.prefBtn == 1,'newwidth':baseInfo.prefBtn == 0}" :title="baseInfo.prefv">{{baseInfo.prefv}}</span>
							</div>
		                </el-col>
		                <el-col :span="5" :offset="2" v-if="baseInfo.prefBtn !== undefined">
							<div class="itemDiv">
								<span>容忍度：</span>
								<span :class="{'redBg newwidth':baseInfo.prefBtn == 1,'newwidth':baseInfo.prefBtn == 0}" :title="baseInfo.prefv">{{baseInfo.prefv}}</span>
							</div>
		                </el-col>
					</el-row>
					<el-row v-if="baseInfo.islimit == 1">
						<el-col :span="3" v-if="baseInfo.limitBtn !== undefined">
		                	<div class="itemDiv">
								<span>突破限额情况：</span>
								<span :class="{'redBg ':baseInfo.limitBtn == 1,'':baseInfo.limitBtn == 0}">{{baseInfo.limitBtn == '1'?'突破':'未突破'}}</span>
							</div>
		                </el-col>
		                <el-col :span="5" v-if="baseInfo.limitBtn == undefined">
							<div class="itemDiv">
								<span>限额：</span>
								<span :class="{'redBg newwidth':baseInfo.limitBtn == 1,'newwidth':baseInfo.limitBtn == 0}" :title="baseInfo.limitv">{{baseInfo.limitv}}</span>
							</div>
		                </el-col>
		                <el-col :span="5" :offset="2" v-if="baseInfo.limitBtn !== undefined">
							<div class="itemDiv">
								<span>限额：</span>
								<span :class="{'redBg newwidth':baseInfo.limitBtn == 1,'newwidth':baseInfo.limitBtn == 0}" :title="baseInfo.limitv">{{baseInfo.limitv}}</span>
							</div>
		                </el-col>
					</el-row>
					<el-row v-if="baseInfo.indChild">
						<el-col>
							<div class="itemDiv" v-for="(item,index) in baseInfo.indChild" style="display:inline-block;margin-right:50px">
								<span>子类指标-{{index+1}}：</span><span>{{item.name}}</span>
							</div>
		                </el-col>
					</el-row>
					<el-row>
						<el-col>
							<div class="itemDiv">
								<span>参照标准：</span><span>{{baseInfo.paramValue == null?'--':baseInfo.paramValue}}</span>
							</div>
		                </el-col>
					</el-row>
				</div>	
		  	</el-collapse-item>
		</el-collapse>
		<!-- 指标预警详情 -->
		<div class="contList" v-if="this.$route.query.isWarn">
        	<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">指标预警详情</span></div>
        	<v-check :isFlag = '7' v-if="isWarn"></v-check>
        </div>
		<el-tabs v-model="activeName" @tab-click="handleClick" v-if="baseInfo.valueType==1">
	      	<el-tab-pane label="趋势数据" name="first" :key="'first'">
		        <div class="contList">
		        	<v-check :isFlag = '1' v-if="isChildUpdate1"></v-check>
		        </div>
	     	</el-tab-pane>
	       	<el-tab-pane label="同比分析" name="second" :key="'second'" v-if="baseInfo.isSrr==1">
		        <div class="contList">
		        	<v-check :isFlag = '2' v-if="isChildUpdate2"></v-check>
		        </div>
		    </el-tab-pane>
	      	<el-tab-pane label="环比分析" name="three" :key="'three'" v-if="baseInfo.isSrr==1">
		        <div class="contList">
		          	<v-check :isFlag = '3' v-if="isChildUpdate3"></v-check>
		        </div>
		    </el-tab-pane>
	    </el-tabs>
		<el-tabs v-model="activeName1" @tab-click="handleClick1" v-if="baseInfo.valueType==1">
	      	<el-tab-pane label="容忍度差异分析" name="first" :key="'first'" v-if="baseInfo.valueType==1&&baseInfo.ispref==1&&!this.$route.query.isWarn">
		        <div class="contList">
		        	<v-check :isFlag = '4' v-if="isChildUpdate4"></v-check>
		        </div>
	     	</el-tab-pane>
	       	<el-tab-pane label="限额差异分析" name="second" :key="'second'" v-if="baseInfo.valueType==1&&baseInfo.islimit==1&&!this.$route.query.isWarn">
		        <div class="contList">
		        	<v-check :isFlag = '5' v-if="isChildUpdate5"></v-check>
		        </div>
		    </el-tab-pane>
	    </el-tabs>	
		<!-- 本期预警级别为0时不显示异常原因 -->	    
	    <div class="contList" v-if="baseInfo.rybStatus&&baseInfo.rybStatus !== 0 && !this.$route.query.isWarn">
        	<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">异常原因记录</span></div>
        	<v-check :isFlag = '6' v-if="flag"></v-check>
        </div>
		<div class="contList" v-if="!this.$route.query.isWarn">
        	<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">报送记录</span></div>
			<div class="taskInfo">
				<el-row>
	                <el-col :span="8">
	                	<div class="itemDiv">
							<span>任务名称：</span><span>{{submitRecord.name==null?'--':submitRecord.name}}</span>
						</div>
	                </el-col>
	                <el-col :span="8">
						<div class="itemDiv">
							<span>责任部门：</span><span>{{submitRecord.depName==null?'--':submitRecord.depName}}</span>
						</div>
	                </el-col>
					<el-col :span="8">
						<div class="itemDiv">
							<span>责任人：</span><span>{{submitRecord.user==null?'--':submitRecord.user}}</span>
						</div>
	                </el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
	                	<div class="itemDiv">
							<span>报送次数：</span><span>{{submitRecord.num==null?'--':submitRecord.num}}次</span>
						</div>
	                </el-col>
					<el-col :span="8">
	                	<div class="itemDiv">
							<span>报送时间：</span><span>{{submitRecord.date==null?'--':submitRecord.date}}</span>
						</div>
	                </el-col>
	                <el-col :span="8">
						<div class="itemDiv">
							<span>逾期情况：</span>
							<span v-if="submitRecord.desc == '0'">未逾期</span>
							<span v-else>
								逾期{{submitRecord.desc == null?'--':submitRecord.desc}}天
							</span>
						</div>
	                </el-col>
				</el-row>
			</div>
        </div>
  	</el-container>
</template>
<script>
	import vCheck from 'src/components/check/formdetailCheck'
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
	  	data() {
	        return {
	        	flag:false,
	        	//基础信息
	        	baseInfo:{},
	        	// 频率
		        frequency:{
		          '1':'月度',
		          '2':'季度',
		          '3':'年度',
		          '4':'半年度',
		        },
	        	checkForm:{
	        		subDateBegin:'',
	            	subDateEnd:'',
	        	},
	        	activeName: "first",
	        	activeName1: "first",
	          	titMsg:"风险指标报表详情",
	          	isChildUpdate1:true,
		        isChildUpdate2:false,
		        isChildUpdate3:false,
		        isChildUpdate4:true,
		        isChildUpdate5:false,
	          	checkData:{//查询数据
	          		indId:this.$route.query.indId
	          	},
	  			// 报送记录
				submitRecord:{
					id:''
				},
				// 指标预警详情
				isWarn: false,
				activeNames: [],
				indCat:{
					'1':'评价类',
					'2':'观测类',
					'3':'仪表盘类',
					'9':'其他类',
				}	
			}
	   	},
	    components:{
	    	vCheck
	    },
	    created(){
	    	if(this.$route.query.subDateBegin !== undefined){
	    		this.checkData.subDateBegin = this.$route.query.subDateBegin
	    	}
	    	if(this.$route.query.subDateEnd !== undefined){
	    		this.checkData.subDateEnd = this.$route.query.subDateEnd
	    	}
	    	// 风险指标预警详情
	    	if(this.$route.query.isWarn !== undefined){
	    		this.searchWarnData(this.checkData)
	    	} else {
	    		this.searchData(this.checkData)
	    	}
	    	//趋势
	    	if(this.$route.query.isTrend !== undefined){
	    		sessionStorage.setItem('trendPath',1)
	    	}
	    },
	    methods:{
	    	handleClick(tab) {
		       if(tab.name == "first") {
		            this.isChildUpdate1 = true;
		            this.isChildUpdate2 = false;
		            this.isChildUpdate3 = false;
		        } else if(tab.name == "second") {
		        	// 同比分析
		        	this.goSearch(2)
		            this.isChildUpdate1 = false;
		            this.isChildUpdate2 = true;
		            this.isChildUpdate3 = false;
		        } else if(tab.name == "three") {
		        	this.goSearch(3)
		            this.isChildUpdate1 = false;
		            this.isChildUpdate2 = false;
		            this.isChildUpdate3 = true;
		        }
		    },
		    handleClick1(tab) {
		       if(tab.name == "first") {
		            this.isChildUpdate4 = true;
		            this.isChildUpdate5 = false;
		        } else if(tab.name == "second") {
		            this.isChildUpdate4 = false;
		            this.isChildUpdate5 = true;
		        }
		    },
		    // 返回
	    	back(){
	    		this.$router.push({
		    		path:sessionStorage.getItem('prevPath'),
		    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
						id: this.$route.query.id
				    }
		    	})
	    	},
	      	// 报送批次
	      	processDate(){
		        return {
		          disabledDate(time){
		            return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
		          }
		        }
		    },
	    	// 获取详情数据
	    	searchData(data){
	    		this.axios.post('rmIndStass/indDetail',qs.stringify(data)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					if(res.data.detail!== undefined){
	    						// 基础信息
	    						this.baseInfo = res.data.detail	    					}
	    					if(res.data.sendInfo!== undefined){
	    						// 报送记录
	    						this.submitRecord = res.data.sendInfo
	    					}
	    					//没有容忍度差异分析
	    					if(this.baseInfo !== undefined){
								if(this.baseInfo.valueType == 1 && this.baseInfo.ispref == 0 && this.baseInfo.islimit == 1){
		    						this.activeName1 = 'second'
									this.handleClick1({name:'second'})
		    					}
	    					}
	    					// 开始、结束时间
	    					if(res.data.scopeTime!==undefined){
	    						this.checkForm.subDateBegin = (res.data.scopeTime[0]+'').substr(0,4)+'-'+(res.data.scopeTime[0]+'').substr(4,2)
	    						this.checkForm.subDateEnd = (res.data.scopeTime[1]+'').substr(0,4)+'-'+(res.data.scopeTime[1]+'').substr(4,2)
	    					}
	    					sessionStorage.setItem('allData',JSON.stringify(res.data))
	    					this.flag =true
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
		    },
		    // 获取指标预警详情数据
	    	searchWarnData(data){
	    		this.axios.post('rmIndStass/indWarnDetail',qs.stringify(data)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					// 基础信息
	    					this.baseInfo = res.data.detail
	    					// 开始、结束时间
	    					if(res.data.scopeTime!==undefined){
	    						this.checkForm.subDateBegin = (res.data.scopeTime[0]+'').substr(0,4)+'-'+(res.data.scopeTime[0]+'').substr(4,2)
	    						this.checkForm.subDateEnd = (res.data.scopeTime[1]+'').substr(0,4)+'-'+(res.data.scopeTime[1]+'').substr(4,2)
	    					}
	    					sessionStorage.setItem('allData',JSON.stringify(res.data))
	    					this.isWarn = true
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
		    },
		    // 搜索按钮
		    goSearch(type){
		    	this.checkData.indId = this.baseInfo.id
	    		this.checkData.subDateBegin = this.checkForm.subDateBegin.split('-').join('')
    			this.checkData.subDateEnd = this.checkForm.subDateEnd.split('-').join('')
		    	this.checkData.freqy = this.baseInfo.rate
		    	this.checkData.type = type
		    	console.log(this.checkForm.subDateBegin)
				this.axios.post('rmIndStass/indDetailValues',qs.stringify(this.checkData)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					Bus.$emit('compareData',res.data)
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
			}
	    },
	    beforeRouteEnter (to, from, next) {
	        next((that) => {
	        	if(from.name !== 'detailIndicator'){
	        		sessionStorage.setItem('prevPath',from.path)
	        	}
	        })
      	},
      	watch:{
      		activeName1(newVal,oldVal){
      			if(newVal == 'second'){
      				this.goSearch(5)
      			}
      		}
      	}
  	};
</script>
<style lang="scss">
#checkForm{
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
		.textColor1{
			color: #909191 !important;
    		font-weight: 700!important;
		}
		.textColor{
			color: #4285F4 !important;
    		font-weight: 700!important;
		}
		.el-col-9{
			float: right;
			text-align: right;
		}
	}
	.bread:hover{
		cursor: pointer;
	}
	.box{
    	background: #fff;
    	padding: 16px 16px 10px 16px;
    	-webkit-box-shadow: 4px 2px 6px #888;
    	margin-top: 75px;
    	margin-bottom: 20px;
    	border-radius: 8px;
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
	}
	.el-table__body, .el-table__footer, .el-table__header{
		border-collapse: collapse
	}
	th{
		background: #F9F9F9;
	    color: #909399;
	    font-weight: bold;
	}
	.el-tabs__content{
		-webkit-box-shadow: 1px 0px 6px #888;
		border-radius: 8px;
	}
	.el-table__empty-block{
		background: #fff;
	}
	.el-table td .cell,.el-table__empty-text{
      font-weight:normal;
      cursor:pointer
    }
    .el-pagination{
    	margin-top: 30px;
    }
    .el-tabs__active-bar{
    	display: none;
    }
    .handleBtn{
    	display: inline-block;
    	padding: 0 5px
    }
    .handleBtn:hover{
    	cursor: pointer;
    }
    .textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.el-tabs__content .contList{
		margin-bottom:0;
		-webkit-box-shadow:none
	}
	.contList{
		background: #fff;
		padding: 16px 16px 10px 16px;
		margin-top: 2px;
		margin-bottom:20px;
		-webkit-box-shadow: 4px 2px 6px #888;
		border-radius: 8px;
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
	}
	table tr:last-child td{
		border-bottom: none
	}
	.el-table::before{
		background-color: transparent!important
	}
	.el-form-item{
		margin-bottom:25px
	}
	.el-form-item .el-form-item__content{
		display:inline-block;
		vertical-align:top
	}
	.el-form-item .el-form-item__content .el-select--mini{
		width:100%
	}
	.el-form--label-left .el-form-item__label{
		float:none;
		height:32px;
		line-height:32px;
	}
	.taskInfo{
    	.taskTit{
    		display: block;
    		margin-bottom: 10px;
    		font-size: 14px;
    		font-weight: 600;
    	}
    	.itemDiv{
    		height: 24px;
    		line-height: 24px;
    		margin: 8px 0 28px 0;
    		margin-bottom: 20px;
    		font-size: 14px;
    	}
    }
    .alignCenter .el-col{
    	text-align: center
    }
    .alignCenter .el-col:first-child{
    	text-align: left
    }
    .moreBtn,.detailBtn{
        color: #4285F4;
        padding: 0 2px;
    }
    .detailBtn:hover,.moreBtn:hover{
        cursor: pointer;
    }
    .blueBg,.yellowBg,.redBg{
    	display: inline-block;
    	min-width:50px;
    	height:24px;
    	line-height:24px;
    	padding: 0 2px;
		color: #fff;
		text-align:center;
		border-radius: 2px;
		background: #4285F4;
	}
	.yellowBg{
		background: #FFD824;
	}
	.redBg{
		background: #FF6363;
	}
	.f_r{
		float:right
	}
	#tab-first{
      background: #fff;
      width: 110px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-right: 1px solid #E9E9E9;
    }
    #tab-second{
      background: #fff;
      width: 110px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-right: 1px solid #E9E9E9;
    }
    #tab-three{
      background: #fff;
      width: 110px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .el-tabs__header{
      margin:0;
    }
    .el-tabs{
    	margin-bottom:20px
    }
    .el-tabs__item{
      padding:0;
      width: 100px;
      text-align: center;
    }
    .el-tabs__active-bar{
      display: none;
    }
    .is-active{
      background: #4285F4!important;
      color: #fff!important;
      text-align: center;
    }
	.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width:150px
	}
	.el-input .el-input__inner{
		height:32px;
		line-height:32px;
	}
	.el-tabs__nav-wrap::after{
		background:none
	}
	.newwidth{
		width:176px;
		text-align:center;
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow:hidden;
		vertical-align:middle
	}
	.alignleft{
		text-align:left
	}
	.d_n{
		display:none
	}
	.quoteName span:first-child{
		float: left;
		width:72px;
	}
	.quoteName span:last-child{
		float: left;
		width:calc(100% - 72px)
	}
	.el-collapse{
		padding: 0 16px;
		background: #fff;
		border-radius: 8px;
    	-webkit-box-shadow: 4px 2px 6px #888;
    	margin-top: 75px;
    	margin-bottom: 20px;
    	.el-collapse-item__header{
    		font-weight: 600;
    		font-size: 15px;
    		font-family: 'Microsoft YaHei';
    		border: none;
    	}
    	em{
			display: inline-block;
			width: 2px;
			height: 14px;
			background: #4285F4;
			vertical-align: middle;
			margin-right: 6px;
		}
		.el-collapse-item__wrap{
			border: none;
		}
		.el-icon-arrow-right{
			font-size: 16px;
		}
		.is-active{
	      background: none!important;
	      color: #000!important;
	      text-align: left;
	    }
	}
}	

</style>
