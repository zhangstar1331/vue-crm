<template>
	<div id="formSingleCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="quoteAssignForm" label-position="left" ref="quoteAssignForm" size="mini">
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="时间">
								    <el-date-picker v-model="submissionDate" @change="changeBatch" type="month" placeholder="时间" :picker-options="endDatePicker"></el-date-picker>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="适用对象">
								    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
								    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="指标分类">
								    <el-select v-model="indCat.region" @change="changeIndCat" placeholder="请选择风险分类">
								    	<el-option v-for="item in indCat.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="风险分类">
								    <el-select v-model="riskType.region" @change="changeType" placeholder="请选择风险分类">
								    	<el-option v-for="item in riskType.unitsData" :key="item.catId" :label="item.catName" :value="item.catId"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="预警状态">
								    <el-select v-model="warnStatus.region" @change="changeStatus" placeholder="请选择预警状态">
								    	<el-option v-for="item in warnStatus.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="报送频率">
								    <el-select v-model="bsTimes.region" @change="changeTimes" placeholder="请选择报送频率">
								    	<el-option v-for="item in bsTimes.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			                <el-col :span="8">
			                    <el-form-item label="采集方式">
			                    	<el-select v-model="gatherMethod.region" @change="changeMethod" placeholder="请选择采集方式">
								    	<el-option v-for="item in gatherMethod.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="报送部门">
								    <el-select v-model="testDepartment.region" @change="changeDepart" placeholder="请选择报送部门">
								    	<el-option v-for="item in testDepartment.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="是否风险偏好">
								    <el-select v-model="isPerfer.region" @change="changePerfer" placeholder="请选择是否风险偏好">
								    	<el-option v-for="item in isPerfer.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
							<el-col :span="8">
			                    <el-form-item label="是否风险限额">
								    <el-select v-model="isLimit.region" @change="changeLimit" placeholder="请选择是否风险限额">
								    	<el-option v-for="item in isLimit.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="是否东方风险偏好">
			                    	<el-select v-model="isDfperfer.region" @change="changeDfperfer" placeholder="请选择是否红黄蓝">
								    	<el-option v-for="item in isDfperfer.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="是否可资本化">
								    <el-select v-model="isCapital.region" @change="changeCapital" placeholder="请选择是否可资本化">
								    	<el-option v-for="item in isCapital.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			                <el-col :span="8">
			                    <el-form-item label="是否评价类">
								    <el-select v-model="isRyb.region" @change="changeRyb" placeholder="请选择是否评价类" :disabled="parseInt(this.checkData.submissionDate.substring(0,4))>=2020">
								    	<el-option v-for="item in isRyb.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="指标等级">
			                    	<el-select v-model="quoteLevel.region" @change="changeLevel" placeholder="请选择指标等级" :disabled="this.checkData.objectId=='101' || parseInt(this.checkData.submissionDate.substring(0,4))>=2020">
								    	<el-option v-for="item in quoteLevel.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="指标名称">
								    <el-input v-model="quoteAssignForm.quoteName" @change='getQuoteName' placeholder="搜索" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			            	<el-col :span="8" :offset="16">
		    					<el-button type="primary" class="search" @click="goExport" :disabled="isBtn" v-if="btnData.exportbtn">导出</el-button>
		    					<el-button type="primary" class="search" @click="goSearch">查询</el-button>
			                </el-col>
			            </el-row>
			        </el-form>
			    </div>
			</template>
	   </el-form>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {mapState,mapActions} from 'vuex'
	import {formatDate,getData} from 'src/utils/utils.js'
	import {formatDateM} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
		props:['isFlag'],
	    data () {
	      return {
	      	quoteAssignForm:{
	      		quoteName:''//指标名称
	      	},
	      	submissionDate:'',//时间
	      	applyUnit:{},
	      	// 适用对象
	        application:{
	          	region: '',
	          	unitsData:[]
	        },
	        //风险分类
	        riskType:{
		       	region: '全部',
		       	unitsData:[{
		          	catName:'全部'
		        }]
	        },
	        // 指标等级
	        quoteLevel:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
		          	name:'一类',
		          	id:'1'
		        },{
		          	name:'二类',
		          	id:'2'
		        }]
	        },
	        // 预警状态
	        warnStatus:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
		          	name:'红',
		          	id:'1'
		        },{
		          	name:'黄',
		          	id:'2'
		        },{
		          	name:'蓝',
		          	id:'3'
		        }]
	        },
	        // 报送频率
	        bsTimes: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部'
	          },{
	          	name:'月度',
	          	id:'1'
	          },{
	          	name:'季度',
	          	id:'2'
	          },{
	          	name:'半年度',
	          	id:'4'
	          },{
	          	name:'年度',
	          	id:'3'
	          }]
	        },
	        // 采集方式
	        gatherMethod: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部'
	          },{
	          	name:'人工呈报',
	          	id:'1'
	          },{
	          	name:'系统对接',
	          	id:'2'
	          }]
	        },
	        // 报送部门
	        testDepartment:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        }]
	        },
	        // 是否风险偏好
	        isPerfer: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'0'
	          }]
	        },
	        // 是否风险限额
	        isLimit: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'0'
	          }]
	        },
	        // 是否红黄蓝
	        isRyb: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'0'
	          }]
	        },
	        // 是否东方风险偏好
	        isDfperfer: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'0'
	          }]
	        },
	        // 是否可资本化
	        isCapital: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部'
	          },{
	          	name:'是',
	          	id:'1'
	          },{
	          	name:'否',
	          	id:'0'
	          }]
	        },
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度'
	        },
	        endDatePicker:this.processDate(),
	        checkData:{
	            submissionDate: null,//开始时间
	            // objectId:null,
	            pageNum:1,
	            pageSize:10
	        },
	        isClick:false,
	        isBtn:false,
	        btnData:{   //按钮显示隐藏
  				exportbtn: false
  			},
  			indCat:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
			      name: '评价类',
			      id: '1'
			    },
			    {
			      name: '观测类',
			      id: '2'	
			    },
			    {
			      name: '仪表盘类',
			      id: '3'	
			    },
			    {
			      name: '其他类',
			      id: '9'	
			    }]
	        },
	      }
	    },
	    computed:{
	  		f1(){
	  			return this.$store.state.orgBtnData
	  		}
	  	},
	  	watch:{
	  		f1(newdata,olddata){
	  			this.getData(newdata)
	  		}
	  	},
	    created () {
	    	this.getData(this.$store.state.orgBtnData)
	    	var date = new Date()
	    	var year = date.getFullYear();
	    	var month = date.getMonth();
	    	if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if(month == 0){
	        	year = year -1
	        	month = 12
	        }
	    	this.submissionDate = year + '-' + month
	    	this.checkData.submissionDate = year + '' + month
	    	// 获取适用对象、监测部门、报送批次数据
	        this.getCommon()
	    },
	    methods: {
	    	// 返回页面时加载数据
		    getData(handleData){
		    	if(handleData !== undefined){
	            	if(handleData.indexOf('1_ifxzbcxe')>=0){//导出
	            		this.btnData.exportbtn = true
	            	}else{
	            		this.btnData.exportbtn = false
	            	}
	            }
		    },
	    	//时间
	      	changeBatch(val){
	      		this.isBtn = true
	      		if(val != null){
		  			this.checkData.submissionDate = formatDate(val,'yyyyMM');
		  			this.checkData.submissionDate = this.checkData.submissionDate.split('-').join('')
		  			if(parseInt(this.checkData.submissionDate.substring(0,4))>=2020){
		      			//如果是选的集团 指标等级不允许选择
						delete this.checkData.indLevel 
						delete this.checkData.isryb 
		      			this.quoteLevel.region = '全部'
		      			this.isRyb.region = '全部'
		      		}
		  		}else{
		  			this.checkData.submissionDate = ''
		  		}
	      	},
	      	//适用对象
	      	changeApply(val){
	      		this.isBtn = true
	      		// 获取报送部门
	      		if(val == '101'){
	      			//如果是选的集团 指标等级不允许选择
					delete this.checkData.indLevel 
	      			this.quoteLevel.region = '全部'
	      		}
	      		delete this.checkData.departmentId
	      		this.testDepartment.region = '全部';
	      		this.testDepartment.unitsData = [{
			        name:'全部'
			    }];
	      		for (var i = 0; i < this.applyUnit.length; i++) {
	      			if(val == this.applyUnit[i].id&&this.applyUnit[i].deps!==undefined){
	      				this.$set(this.testDepartment,'unitsData',this.testDepartment.unitsData.concat(this.applyUnit[i].deps))
	      			}
	      		}
	      		this.checkData.objectId = val	
	      	},
	      	// 风险分类
	      	changeType(val){
	      		this.isBtn = true
	      		this.checkData.catId = val
	      	},
	      	changeIndCat(val){
	      		this.isBtn = true
	      		this.checkData.indCat = val
	      	},
	      	// 指标等级
	      	changeLevel(val){
	      		this.isBtn = true
	      		this.checkData.indLevel = val
	      	},
	      	// 预警状态
	      	changeStatus(val){
	      		this.isBtn = true
	      		this.checkData.rybStatus = val
	      	},
	      	// 报送频率
	      	changeTimes(val){
	      		this.isBtn = true
	      		this.checkData.frequency = val
	      	},
	      	// 采集方式
	      	changeMethod(val){
	      		this.isBtn = true
	      		this.checkData.actType = val
	      	},
	      	//报送部门
	      	changeDepart(val){
	      		this.isBtn = true
	      		this.checkData.departmentId = val
	      	},
	      	//是否风险偏好
	      	changePerfer(val){
	      		this.isBtn = true
	      		this.checkData.ispref  = val
	      	},
	      	//是否风险限额
	      	changeLimit(val){
	      		this.isBtn = true
	      		this.checkData.islimit = val
	      	},
	      	//是否红黄蓝
	      	changeRyb(val){
	      		this.isBtn = true
	      		this.checkData.isryb = val
	      	},
	      	//是否东方风险偏好指标
	      	changeDfperfer(val){
	      		this.isBtn = true
	      		this.checkData.isdf = val
	      	},
	      	//是否可资本化指标
	      	changeCapital(val){
	      		this.isBtn = true
	      		this.checkData.iscap = val
	      	},
	    	// 获取指标名称
	      	getQuoteName(val){
	      		this.isBtn = true
	      		if(val == ''){
	      			delete this.checkData.indName
	      		} else{
	      			this.checkData.indName = val
	      		}
	      	},
	      	// 时间
	      	processDate(){
		        return {
		          disabledDate(time){
		            return time.getTime() > Date.now()
		          }
		        }
		    },
	      	// 获取适用对象、风险分类、报送部门
	      	async getCommon(){
	      		let respond = await getData('rmIndStass/repOptInfo')
	      		if(respond){
		      		this.applyUnit = respond.objects;
	   				//处理适用对象数据
	   				var company = [];
	   				respond.objects.forEach((item)=>{
	   					var obj = new Object();
	   					obj.name = item.name;
	   					obj.id = item.id;
	   					company.push(obj)
	   				})
	   				// 适用对象
		   			this.$set(this.application,'unitsData',this.application.unitsData.concat(company))
		      		//风险分类
		      		this.$set(this.riskType,'unitsData',this.riskType.unitsData.concat(respond.catList))
		      		if(company.length>0){
	   					this.$set(this.application,'region',company[0].name)
	   					//默认报送部门
		      			this.$set(this.testDepartment,'unitsData',this.testDepartment.unitsData.concat(this.applyUnit[0].deps))
		      			this.$set(this.checkData,'objectId',company[0].id)
	   				}
			  		this.searchData(this.checkData)
		  		}
			},
			async searchData (data) {
				if(this.checkData.submissionDate == ''){
					this.$alert('查询时间不能为空', '提示', {
	                  confirmButtonText: '确定'
	                })
	                return
				}
	      		// 获取表格数据
	      		sessionStorage.askData = JSON.stringify(this.checkData)
	      		let respond = await getData('rmIndStass/indReportInfo',qs.stringify(data))
	      		if(respond != null){
  					Bus.$emit('objectId',this.checkData.objectId)
  					Bus.$emit('limitYear',this.checkData.submissionDate)
  					Bus.$emit('formDatas',respond)
  					if(this.isClick == true&&respond.total == 0){
						this.$alert('查询条件组合无对应查询结果，请重新选择查询条件', '提示', {
		                  confirmButtonText: '确定'
		                })
  					}
  				}
	      	},
	      	// 查询按钮
		    goSearch(){
				this.checkData.pageNum = 1
				this.checkData.pageSize = 10
				this.currentPage = 1
				this.isBtn = false
				this.searchData(this.checkData)
				this.isClick = true
			},
			// 导出按钮
			goExport(){
				delete this.checkData.pageNum
				delete this.checkData.pageSize
				this.axios.post('/rmIndStass/indReportExport',qs.stringify(this.checkData),{responseType:'arraybuffer'}).then((res)=>{
	    			let filename = "风险指标报表-单期" + '（' + this.checkData.submissionDate + '）' + '.xlsx';
	              	this.fileDownload(res, filename);
	    		})
			},
			fileDownload(data, fileName) {
		      	let blob = new Blob([data], {
		        	type: "application/octet-stream"
		      	})
		      	let filename = fileName || "filename.xls";
		      	if (typeof window.navigator.msSaveBlob !== "undefined") {
		        	window.navigator.msSaveBlob(blob, filename);
		      	} else {
			        var blobURL = window.URL.createObjectURL(blob);
			        var tempLink = document.createElement("a");
			        tempLink.style.display = "none";
			        tempLink.href = blobURL;
			        tempLink.setAttribute("download", filename);
			        if (typeof tempLink.download === "undefined") {
			          tempLink.setAttribute("target", "_blank");
			        }
			        document.body.appendChild(tempLink);
			        tempLink.click();
			        document.body.removeChild(tempLink);
			        window.URL.revokeObjectURL(blobURL);
		      	}
		    },
	    }
	}
</script>

<style lang="scss">
#formSingleCheck{
  	.el-input-group__append{
	  	background: #4285F4;
	    width: 20%;
	    text-align: center;
	    font-size: 16px;
	    color: #fff;
	}
	.el-col .el-input input{
		height: 32px;
		line-height: 32px;
	}
	.el-form-item{
		margin-right:18px;
		margin-bottom: 20px;
		width: 100%;
		.el-form-item__content{
			width: 70%;
			.el-select--mini{
				width: 100%;
			}
			.el-date-editor{
				width: 100%;
			}
		}
	}
	.el-form-item__label{
		width:28%;
		line-height:32px;
		font-weight: normal;
		padding:0 4% 0 0;
		text-align:right
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-top:3px;
	    margin-right: 15px;
	    margin-bottom: 20px;
	    padding:0;
    	font-size: 12px;
	}
}	
</style>
