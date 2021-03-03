<template>
	<div id="formTrendCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="quoteAssignForm" label-position="left" ref="quoteAssignForm" size="mini">
			            <el-row>
							<el-col :span="8">
			                    <el-form-item label="开始时间">
								    <el-date-picker v-model="quoteAssignForm.subDateBegin" @change="changeBegin" type="month" placeholder="开始时间" :picker-options="starDatePicker"></el-date-picker>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="结束时间">
								    <el-date-picker v-model="quoteAssignForm.subDateEnd" @change="changeEnd" type="month" placeholder="结束时间" :picker-options="endDatePicker"></el-date-picker>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="适用对象">
								    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
								    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			            	<el-col :span="8">
			                    <el-form-item label="指标分类">
								    <el-select v-model="indCat.region" @change="changeIndCat" placeholder="请选择风险分类">
								    	<el-option v-for="item in indCat.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
							<el-col :span="8">
			                    <el-form-item label="风险分类">
								    <el-select v-model="riskType.region" @change="changeType" placeholder="请选择风险分类">
								    	<el-option v-for="item in riskType.unitsData" :key="item.catId" :label="item.catName" :value="item.catId"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8" class="newwidth1">
			                    <el-form-item label="本期预警状态">
								    <el-select v-model="warnStatus.region" @change="changeStatus" placeholder="请选择预警状态">
								    	<el-option v-for="item in warnStatus.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			            <el-row>
			                <el-col :span="8">
			                    <el-form-item label="报送频率">
								    <el-select v-model="bsTimes.region" @change="changeTimes" placeholder="请选择报送频率">
								    	<el-option v-for="item in bsTimes.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="指标等级">
								    <el-select v-model="quoteLevel.region" @change="changeLevel" placeholder="请选择指标等级" :disabled="this.checkData.objectId=='101' || parseInt(this.checkData.subDateBegin.substring(0,4))>=2020">
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
							<el-col :span="8" :offset="16" style="padding-right:0">
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
	import qs from 'qs'
	export default {
		props:['isFlag'],
	    data () {
	      return {
	      	quoteAssignForm:{
	      		quoteName:'',//指标名称
	      		subDateBegin:'',
	      		subDateEnd:''
	      	},
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
	        // 报送部门
	        testDepartment:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        }]
	        },
	        taskName:{},
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度'
	        },
	        checkData:{
	        	subDateBegin:'',
	        	subDateEnd:'',
	        	// objectId:'',
	            pageNum:1,
	            pageSize:10
	        },
	        starDatePicker:{
  				disabledDate: (time) => {
	            	if (this.quoteAssignForm.subDateEnd) {
                        return time.getTime() > Date.now() || time.getTime() > this.quoteAssignForm.subDateEnd;
                    } else {
                        return time.getTime() > Date.now();
                    }
	          	},
  			},
  			endDatePicker:{
  				disabledDate: (time) => {
	            	return time.getTime() < this.quoteAssignForm.subDateBegin || time.getTime() > Date.now();
	          	},
  			},
  			isClick:false,
  			monthLen:0,
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
	    	//获取当前月份
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
	    	//起始时间
	    	this.quoteAssignForm.subDateBegin = year + '-01'
	    	this.checkData.subDateBegin = year + '01'
	    	//结束时间
	    	this.quoteAssignForm.subDateEnd = year + '-' + month
	    	this.checkData.subDateEnd = (year +''+ month)/1
	    	var startime = (this.checkData.subDateBegin+'').substring(0,4)*12 + (this.checkData.subDateBegin+'').substring(4)*1
    		var endTime = (this.checkData.subDateEnd+'').substring(0,4)*12 + (this.checkData.subDateEnd+'').substring(4)*1
	      	this.monthLen =  Math.abs(endTime - startime)+1;
	    	// 获取适用对象、监测部门、报送批次数据
	    	this.getCommon()
	    },
	    methods: {
	    	// 返回页面时加载数据
		    getData(handleData){
		    	if(handleData !== undefined){
	            	if(handleData.indexOf('1_ifxzbcxqe')>=0){//导出
	            		this.btnData.exportbtn = true
	            	}else{
	            		this.btnData.exportbtn = false
	            	}
	            }
		    },
	    	//开始时间
	      	changeBegin(val){
	      		this.isBtn = true
	      		if(val != null){
		  			this.checkData.subDateBegin = formatDate(val,'yyyy-MM');
		  			this.checkData.subDateBegin = this.checkData.subDateBegin.split('-').join('')
		  			if(parseInt(this.checkData.subDateBegin.substring(0,4))>=2020){
		      			//如果是选的集团 指标等级不允许选择
						delete this.checkData.indLevel 
		      			this.quoteLevel.region = '全部'
		      		}
		  		}else{
		  			this.checkData.subDateBegin = '';
		  		}
	      	},
	      	//结束时间
	      	changeEnd(val){
	      		this.isBtn = true
	      		if(val != null){
		  			this.checkData.subDateEnd = formatDate(val,'yyyy-MM');
		  			this.checkData.subDateEnd = this.checkData.subDateEnd.split('-').join('')
		  		}else{
		  			this.checkData.subDateEnd = '';
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
	      	// 获取指标名称
	      	getQuoteName(val){
	      		this.isBtn = true
				if(val == ''){
	      			delete this.checkData.indName
	      		} else{
	      			this.checkData.indName = val
	      		}
	      	},
	      	// 获取适用对象、监测部门、报送批次数据
	      	async getCommon(){
	      		let respond = await getData('rmIndStass/repOptInfo')
	      		if(respond){
		      		var company = [];
	   				respond.objects.forEach((item)=>{
	   					var obj = new Object();
	   					obj.name = item.name;
	   					obj.id = item.id;
	   					company.push(obj)
	   				})
	   				// 适用对象
		   			this.$set(this.application,'unitsData',this.application.unitsData.concat(company))
		   			this.$set(this.riskType,'unitsData',this.riskType.unitsData.concat(respond.catList))
		      		if(company.length>0){
		      			this.$set(this.application,'region',company[0].name)
		      			this.$set(this.checkData,'objectId',company[0].id)
		      		}
		   			this.searchData(this.checkData)
	   			}
			},
			searchData (data) {
				if(this.checkData.subDateBegin == '' || this.checkData.subDateEnd == '' ){
					this.$alert('查询时间不能为空', '提示', {
	                  confirmButtonText: '确定'
	                })
	                return
				}
	      		// 获取表格数据
	      		sessionStorage.askData = JSON.stringify(this.checkData)
	      		this.axios.post('rmIndStass/indDriftReportInfo',qs.stringify(data)).then((res)=>{
		            if(res.code == 200){
	            		// if(res.data.instats){
	            		// 	for (var i = 0; i < res.data.instats.length; i++) {
			            //   		for (var j = 0; j < this.monthLen; j++) {
			            //   			if(res.data.instats[i]['t'+(this.checkData.subDateBegin*1+j)] !== undefined){
			            //   				res.data.instats[i]['t'+(this.checkData.subDateBegin*1+j)].value = eval("("+res.data.instats[i]['t'+(this.checkData.subDateBegin*1+j)].value+")")
			            //   			}
			              			
			            //   		}
			            //   	}
	            		// }
		              	Bus.$emit('checkData',this.checkData)
      					Bus.$emit('dataList',res)
      					if(this.isClick == true&&res.data.total == 0){
							this.$alert('查询条件组合无对应查询结果，请重新选择查询条件', '提示', {
			                  confirmButtonText: '确定'
			                })
      					}
		            }else{
		              	this.$alert(res.message, '提示', {
		                  confirmButtonText: '确定'
		                })
		            }
		        })
	      	},
	      	// 查询按钮
		    goSearch(){
				this.checkData.pageNum = 1
				this.checkData.pageSize = 10
				this.currentPage = 1
				this.monthLen = this.checkData.subDateEnd - this.checkData.subDateBegin
				this.isBtn = false
				this.searchData(this.checkData)
				this.isClick = true
			},
			// 导出按钮
			goExport(){
				delete this.checkData.pageNum
				delete this.checkData.pageSize
				this.axios.post('/rmIndStass/indDriftReportExport',qs.stringify(this.checkData),{responseType:'arraybuffer'}).then((res)=>{
	    			let filename = "风险指标趋势" + '（' + this.checkData.subDateBegin + '-' + this.checkData.subDateEnd + '）' + '.xlsx';
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
#formTrendCheck{
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
	.el-col:last-child{
		text-align:right;
		padding-right: 15px;
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
		line-height:32px;
		font-weight: normal;
		padding:0 4% 0 5%;
		text-align:right
	}
	.el-col:first-child .el-form-item__label{
		padding-left: 0;
	}
	.newwidth .el-form-item__label{
		padding:0 4% 0 7%
	}
	.newwidth1 .el-form-item__label{
		padding:0 4% 0 0
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
