<template>
  	<div id="rgbCompare">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor">风险指标分析</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">评价类指标同比、环比分析</span></div>
    		<el-form :model="hotForm" label-position="left" ref="hotForm" size="mini" :inline="true">
	            <el-row>
	            	<el-form-item label="评价年份">
					    <el-date-picker v-model="subDate" @change="changeBatch" type="month" placeholder="时间" :picker-options="endDatePicker"></el-date-picker>
					</el-form-item>
                    <el-form-item label="适用对象">
					    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
					    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
					    </el-select>
					</el-form-item>
					<!-- <el-form-item label="指标频率">
					    <el-select v-model="bsTimes.region" @change="changeTimes" placeholder="请选择指标评率">
					    	<el-option v-for="item in bsTimes.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
					    </el-select>
					</el-form-item> -->
                    <el-button type="primary" @click="goSearch" class="saveBtn">查询</el-button>
	            </el-row>
	        </el-form>
    		<div class="cagy-run">
		    	<el-row style="margin-bottom: 16px;">
		    		<el-col :span="24" class="resultTitle">
						<p>
							评价类指标同比、环比分析
							<el-button type="primary" class="saveBtn" @click="goExport1" :disabled="isBtn" v-if="btnData.downbtn"><i class="iconfont iconxiazai"></i>下载</el-button> 
							<el-button type="primary" class="saveBtn" @click="goChange" :disabled="isBtn"><i class="iconfont iconqiehuan"></i>切换</el-button> 
						</p>
		    		</el-col>
			        <el-col :span="24" style="padding-bottom: 8px;" v-show="isShow">
			          	<el-card>
				          	<div class="myChart" id="myChart"></div>
			        	</el-card>
			        </el-col>
			        <el-col :span="24" style="padding-bottom: 8px;" v-show="!isShow">
						<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" show-summary :summary-method="getSummaries">
							<el-table-column prop="color" label="状态" align="center" width="150">
								<template slot-scope="scope">
									<span class="blueBg" v-if="scope.row.color == 3">蓝</span>
									<span class="yellowBg" v-if="scope.row.color == 2">黄</span>
									<span class="redBg" v-if="scope.row.color == 1">红</span>
								</template>
							</el-table-column>
							<el-table-column prop="" v-for="(item,index) in quoteMonth" :key="index" :label="item" align="center">
								<template slot-scope="scope">
									<span @click="goForm(item,scope.$index,scope.row)" v-if="btnData.detailbtn">{{scope.row['t'+item]==null?'--':((scope.row['t'+item]*100).toFixed(2) + '%')}}</span>
									<span v-else>{{scope.row['t'+item]==null?'--':((scope.row['t'+item]*100).toFixed(2) + '%')}}</span>
								</template>
							</el-table-column>
			          	</el-table>
			        </el-col>
			    </el-row>  
	      	</div>
	      	<div class="cagy-run" v-show="isDetail">
		    	<el-row style="margin-bottom: 16px;">
		    		<el-col :span="24" class="resultTitle">
						<p>
							评价类指标同比、环比分析详情表
							<el-button type="primary" class="saveBtn" @click="goExport2" v-if="btnData.detailDownbtn"><i class="iconfont iconxiazai"></i>下载</el-button> 
						</p>
		    		</el-col>
			        <el-col :span="24" style="padding-bottom: 8px;">
						<el-table :data="tableData1" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				          	<el-table-column prop="code" width="100" label="编号" align="center" fixed>
				          		<template slot-scope="scope">{{scope.row.code.toUpperCase()}}</template>
				          	</el-table-column>
			            	<el-table-column prop="name" label="指标名称" width="200" fixed>
				                <template slot-scope="scope">
				                    <span :title="scope.row.name" class="textOverFlow" style="color: #4285F4;" @click="goDetail(scope.$index, scope.row)">{{scope.row.name == null?'--':scope.row.name}}</span>
				                </template>
				            </el-table-column>
							<el-table-column prop="value" label="当期指标值" width="200" align="center"> 
				          		<template slot-scope="scope">
					          		<div :class="{'redBg':scope.row.rybStatus == 1,'yellowBg':scope.row.rybStatus == 2,'blueBg':scope.row.rybStatus == 3}">
					            		<p :title="item" v-for="item in scope.row.value">{{item}}</p>
					            	</div>
					            </template>
				          	</el-table-column>
				          	<el-table-column prop="compv" label="同比" align="center" width="120">
					          	<template slot-scope="scope">
					              	<p v-for="(item,index) in (scope.row.compv)" class="comCss">
						            	{{item.value}}
						              	<em v-if="item.scope == 1" style="font-style: normal;">↑</em>
						              	<em v-if="item.scope == 0" style="font-style: normal;">↓</em> 
					              	</p>
					            </template>
				          	</el-table-column>
				          	<el-table-column prop="momv" label="环比" align="center" width="120"> 
					          	<template slot-scope="scope">
					              	<p v-for="(item,index) in (scope.row.momv)" class="comCss">
						              	{{item.value}}
						              	<em v-if="item.scope == 1" style="font-style: normal;">↑</em>
						              	<em v-if="item.scope == 0" style="font-style: normal;">↓</em>
					              	</p>
					            </template>
				          	</el-table-column>
			            	<el-table-column prop="catName" label="风险分类" align="center" width="120">
				                <template slot-scope="scope">
				                    <span :title="scope.row.catName" class="textOverFlow">{{scope.row.catName == null?'--':scope.row.catName}}</span>
				                </template>
				            </el-table-column>
				            <el-table-column prop="level" v-if="limitYear" label="指标等级" align="center" width="120"> 
				            	<template slot-scope="scope">
				                  <span>{{ scope.row.level == '1'?'一类':scope.row.level == '2'?'二类':'--' }}</span>
				                </template>
				            </el-table-column>
				          	<el-table-column prop="caleName" label="指标定义及口径" width="250">
				                <template slot-scope="scope">
			                        <span :title="scope.row.caleName == null?scope.row.defins:scope.row.caleName+'&nbsp;/&nbsp;'+scope.row.defins" class="textOverFlow"><!-- :class="{'textOverFlow':JSON.parse(scope.row.value).length==1}" -->
			                        {{scope.row.caleName == null?scope.row.defins:scope.row.caleName+'&nbsp;/&nbsp;'+scope.row.defins}}
			                        </span>
			                    </template>
				            </el-table-column>
				          	<el-table-column prop="isryb" v-if="limitYear" label="是否评价类" align="center" width="120">
					            <template slot-scope="scope">
					            	<span>{{scope.row.isryb == '1'?'是':'否'}}</span>
					            </template>
				          	</el-table-column>
				          	<el-table-column prop="bluev" label="指标阈值（蓝）" width="150">
				          		<template slot-scope="scope">
			                      <span :title="scope.row.bluev" class="textOverFlow">{{scope.row.bluev == null?'--':scope.row.bluev}}</span>
			                    </template>
				          	</el-table-column>
				          	<el-table-column prop="yellowv" label="指标阈值（黄）" width="150">
				          		<template slot-scope="scope">
			                      <span :title="scope.row.yellowv" class="textOverFlow">{{scope.row.yellowv == null?'--':scope.row.yellowv}}</span>
			                    </template>
				          	</el-table-column>
				          	<el-table-column prop="redv" label="指标阈值（红）" width="150">
				          		<template slot-scope="scope">
			                      <span :title="scope.row.redv" class="textOverFlow">{{scope.row.redv == null?'--':scope.row.redv}}</span>
			                    </template>
				          	</el-table-column>
				          	<el-table-column prop="prefv" label="容忍度" width="150">
				          		<template slot-scope="scope">
			                      <span :title="scope.row.prefv" class="textOverFlow">{{scope.row.prefv == null?'--':scope.row.prefv}}</span>
			                    </template>
				          	</el-table-column>
				          	<el-table-column prop="limitv" label="限额" width="150">
				          		<template slot-scope="scope">
				          			<span :title="scope.row.limitv" class="textOverFlow">{{scope.row.limitv}}</span>
				          		</template>
				          	</el-table-column>
				          	<el-table-column prop="objName" label="适用对象" width="150" align="center"> </el-table-column>
				          	<el-table-column prop="depName" label="报送部门" width="120" align="center"> </el-table-column>
			            	<el-table-column prop="hanndle" label="操作" align="center" width="100">
			              		<template slot-scope="scope">
			                		<span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;">详情</span>
			              		</template>
			           		</el-table-column>
			  			</el-table>
						<el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
			        </el-col>
			    </el-row>  
	      	</div>
		</div>
  	</div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	isShow:true,
        	isDetail:false,
        	titMsg:"评价类指标同比、环比分析",
        	hotForm:{},
        	subDate:'',
        	isBtn:false,
        	limitYear:false,
        	// 评价年份
        	yearList:{
        		region:'全部',
        		unitsData:[{
		          	name:'全部',
		          	id:'0'
		        }]
        	},
        	// 适用对象
	        application:{
	          	region: '',
	          	unitsData:[]
	        },
	        // 指标频率
	        bsTimes: {
	          region: '月度',
	          unitsData:[{
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
    		tableData:[],
    		tableData1:[],
    		totalResults:0,
    		currentPage:1,
    		endDatePicker:this.processDate(),
          	checkData:{//查询数据
          		subDate:null,
          		// objId:null,
          		freqy:2,
	            isPic:1
          	},
          	listCheckData:{
          		submissionDate: null,
	            objectId: 101,
	            frequency: 1,
	            rybStatus: '',
	            pageNum: 1,
	            pageSize: 10
          	},
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度'
	        },
	        monthLen:0,
	        quoteMonth:[],
	        redList:[],
	        yellowList:[],
	        blueList:[],
	        choosedDate:'',
	        btnData:{   //按钮显示隐藏
  				downbtn: false,
  				detailbtn: false,
  				detailDownbtn: false,
  			},
	        // echarts数据
        	options1: {
        		title:{
    				show:false,
    				textStyle:{
    					color:'#909399'
    				},
    				text:'暂无数据',
    				left:'center',
    				top:'center'
    			},
	        	color:['#FF6363','#FFD824','#4285F4'],
	          	tooltip: {
		            trigger: 'axis',
		            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		              type: ''        // 默认为直线，可选为：'line' | 'shadow'
		            },
		            // formatter:'{b0}<br/>{a0}：{c0}%'
		            formatter: function (params) {
					    let html=params[0].name+"<br>";
					    for(let i=0;i<params.length;i++){
					    	html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					        html+=params[i].seriesName+"："+Number(params[i].value*100).toFixed(2)+"%<br>";
					    }
					    return html;
					}
		        },
	          	legend: {
	          		y:'bottom',
	          		textStyle: {color: ['#FF6363','#FFD824','#4285F4']},
		            data: ['蓝','黄','红']
		        },
	          	toolbox: {
		            show: false,
		            feature: {
		              mark: {show: true},
		              dataView: {show: true, readOnly: false},
		              magicType: {show: false, type: ['line', 'bar', 'stack', 'tiled']},
		              restore: {show: true},
		              saveAsImage: {show: true}
		            }
	          	},
	          	calculable: true,
	          	xAxis: [
		            {
		              	type: 'category',
				       	axisLine: {
						    show: false
						},
						axisTick:{       //y轴刻度线
				          "show":false
				        },
		        		data: []
		            }
	          	],
	          	yAxis: [
		            {
		              	type: 'value',
		              	axisLine: {//y轴坐标线
						    show: false,
						},
						axisLabel: {//y轴文字
			              	show:true,
			              	interval:'auto',
			              	formatter: function (value) {
							    return (value*100)+'%';
							}
			            },
			            axisTick: { //y轴刻度线
				          "show":false
				        },
				        splitLine: {//虚线
			                show: true,
			                lineStyle:{
			                    type:'dashed'
			                }
			            }
		            }
		        ],
	          	series: [
		            {
		              	name: '红',
		              	type: 'bar',
		              	stack: '总量',
		              	barWidth:56,
		              	smooth:true,
		              	symbol:'square',
		              	symbolSize: 14, 
		              	// hoverAnimation: false,
		              	itemStyle: {
		              		normal: {
		              			label: {
		              				show: true, 
		              				position: 'insideBottom',
		              				color:'#FFF',
		              				formatter: function (params) {
									    return (params.value*100).toFixed(2)+'%';
									}
		              			}
		              		}
		              	},
		              	data: [0.75,0.75,0.75,0.75],
		            },
		            {
		              	name: '黄',
		              	type: 'bar',
		              	stack: '总量',
		              	barWidth:56,
		              	smooth:true,
		              	symbol:'square',
		              	symbolSize: 14, 
		              	// hoverAnimation: false,
		              	itemStyle: {
		              		normal: {
		              			label: {
		              				show: true, 
		              				color:'#FFF',
		              				formatter: function (params) {
									    return (params.value*100).toFixed(2)+'%';
									}
		              			}
		              		}
		              	},
		              	data: [],
		            },
		            {
		              	name: '蓝',
		              	type: 'bar',
		              	stack: '总量',
		              	barWidth:56,
		              	smooth:true,
		              	symbol:'square',
		              	symbolSize: 14, 
		              	// hoverAnimation: false,
		              	itemStyle: {
		              		normal: {
		              			label: {
		              				show: true, 
		              				position: 'insideTop',
		              				color:'#FFF',
		              				formatter: function (params) {
									    return (params.value*100).toFixed(2)+'%';
									}
		              			}
		              		}
		              	},
		              	data: [],
		            }
	          	]
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
   	mounted(){
   		// 初始日期
   		var date = new Date
   		var year = date.getFullYear()
   		var month = date.getMonth()
   		if (month >= 1 && month <= 9) {
            month = "0" + month
        }
        if(month == 0){
        	year = year -1
        	month = 12
        }
        this.quoteMonth = []
        this.subDate = year + '-' + month
    	this.checkData.subDate = year + '' + month
    	this.getCommon()
	},
    created(){
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ihhlthbfxe')>=0){//导出
            		this.btnData.downbtn = true
            	}else{
            		this.btnData.downbtn = false
            	}
            	if(handleData.indexOf('1_ihhlthbfxd')>=0){//导出
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            	if(handleData.indexOf('1_ihhlthbfxde')>=0){//导出
            		this.btnData.detailDownbtn = true
            	}else{
            		this.btnData.detailDownbtn = false
            	}
            }
	    },
    	drawLine(){
	    	this.quoteMonth = []
	    	if(this.checkData.freqy==1){
	    		var date = new Date(this.subDate)
				var year = date.getFullYear()
				var month = date.getMonth()
		    	if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
	    		for(var i=-1;i<12;i++){
	    			if(i!==-1){
	    				date.setMonth(date.getMonth() - 1)
	    			}
		    		var m = date.getMonth() + 1
		    		m=m<10?"0"+m:m
		    		this.quoteMonth.push(date.getFullYear() + '' + m)
		    	}	
	    	} else if(this.checkData.freqy==2){
	    		var date = new Date(this.subDate)
				var year = date.getFullYear()
				var month = date.getMonth() + 1;
		    	if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
	    		var arr = ['03','06','09','12']
	    		var q = Math.floor(month/3)
	    		var y = month%3
	    		for(var i = 0;i < q;i++){
	    			this.quoteMonth.push(year+''+arr[i])
	    		}
	    		var arr1 = JSON.parse(JSON.stringify(arr.splice(q,arr.length)))
	    		if(!y){	
	    			arr1.unshift(arr[q-1])
	    		}
	    		arr1.reverse()
	    		for(var i = 0;i < arr1.length;i++){
	    			this.quoteMonth.unshift((year-1)+''+arr1[i])
	    		}
	    		this.quoteMonth.reverse()
	    	} else if(this.checkData.freqy==3){
	    		var date = new Date(this.subDate)
				var year = date.getFullYear()
				var month = date.getMonth() + 1;
		    	if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
	    		if(month!==12){
	    			this.quoteMonth = [date.getFullYear()-1 + '' + 12,date.getFullYear()-2 + '' + 12]
	    		} else{
	    			this.quoteMonth = [date.getFullYear() + '' + 12,date.getFullYear()-1 + '' + 12]
	    		}
	    	} else if(this.checkData.freqy==4){
	    		var date = new Date(this.subDate)
				var year = date.getFullYear()
				var month = date.getMonth() + 1;
		    	if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
	    		var arr = ['06','12']
	    		var q = Math.floor(month/6)
	    		var y = month%6
	    		for(var i = 0;i < q;i++){
	    			this.quoteMonth.push(year+''+arr[i])
	    		}
	    		var arr1 = JSON.parse(JSON.stringify(arr.splice(q,arr.length)))
	    		if(!y){	
	    			arr1.unshift(arr[q-1])
	    		}
	    		arr1.reverse()
	    		for(var i = 0;i < arr1.length;i++){
	    			this.quoteMonth.unshift((year-1)+''+arr1[i])
	    		}
	    		this.quoteMonth.reverse()
	    	}
	    	var chartWidth = document.getElementById('myChart')
	    	chartWidth.style.width = window.innerWidth - 300 + 'px'
	    	let myChart = this.$echarts.init(document.getElementById('myChart'))
	    	// 获取列表数据
	    	this.axios.post('rmIndStass/rybSameRingRatio',qs.stringify(this.checkData)).then((res)=>{
    			if(res.code == '200'){
	        		if(res.data !== null){
	        			this.redList=[]
	        			this.yellowList=[]
	        			this.blueList=[]
	        			this.quoteMonth = this.quoteMonth.reverse().map(String)
	        			if(JSON.stringify(res.data) !== "{}"){
	        				for(var i = 0;i<this.quoteMonth.length;i++){
		        				if(res.data['t'+this.quoteMonth[i]]!==undefined){
		        					if(res.data['t'+this.quoteMonth[i]].c1 !== 0){
		        						this.redList.push(res.data['t'+this.quoteMonth[i]].c1)
		        					} else{
		        						this.redList.push('')
		        					}
		        					if(res.data['t'+this.quoteMonth[i]].c2 !== 0){
		        						this.yellowList.push(res.data['t'+this.quoteMonth[i]].c2)
		        					} else{
		        						this.yellowList.push('')
		        					}
		        					if(res.data['t'+this.quoteMonth[i]].c3 !== 0){
		        						this.blueList.push(res.data['t'+this.quoteMonth[i]].c3)
		        					} else{
		        						this.blueList.push('')
		        					}
		        				} else{
		        					this.redList.push('')
		        					this.yellowList.push('')
		        					this.blueList.push('')
		        				}
		        			}
	        				this.options1.title.show = false
	        				this.options1.legend.show = true
	        				this.options1.xAxis[0].data = this.quoteMonth
	        			} else{
	        				// 没有数据
	        				this.options1.title.show = true
	        				this.options1.legend.show = false
	        				this.options1.xAxis[0].data = []
	        			}
				    	this.options1.series[0].data = this.redList
				    	this.options1.series[1].data = this.yellowList
				    	this.options1.series[2].data = this.blueList
				    	myChart.setOption(this.options1)
				    	window.addEventListener("resize", () => { myChart.resize();});
	        		}
        		} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
        		}
    		})
    		myChart.off('click');
	    	// 点击echarts
	    	myChart.on('click', (params) => {
	    		if(this.btnData.detailbtn){
		    		this.listCheckData.submissionDate = params.name,
		    		this.listCheckData.objectId = this.checkData.objId,
		    		this.listCheckData.frequency = this.checkData.freqy,
		    		this.listCheckData.rybStatus = params.seriesIndex + 1,
		    		this.listCheckData.pageNum = 1
			        this.listCheckData.pageSize = 10
			        this.currentPage = 1
		    		this.searchListData(this.listCheckData)
	    		}
	    	})
    	},
    	//时间
      	changeBatch(val){
      		this.isBtn = true
      		if(val != null){
  				this.checkData.subDate = formatDate(val,'yyyy-MM');
  				this.checkData.subDate = this.checkData.subDate.split('-').join('')
	  		} else{
	  			this.checkData.subDate = ''
	  		}
      	},
    	changeApply(val){
    		this.isBtn = true
      		this.checkData.objId = val
      	},
      	changeTimes(val){
      		this.isBtn = true
      		this.checkData.freqy = val
    	},
    	// 时间
      	processDate(){
	        return {
	          disabledDate(time){
	            return time.getTime() > Date.now()
	          }
	        }
	    },
    	// 适用对象
      	getCommon(){
      		this.axios.post('rmIndStass/repOptInfo',qs.stringify({})).then((res)=>{
				if(res.code == '200'){
			   		//处理适用对象数据
	   				var company = [];
	   				res.data.objects.forEach((item,index)=>{
	   					var obj = new Object();
	   					obj.name = item.name;
	   					obj.id = item.id;
	   					company.push(obj)
	   				})
	   				// 适用对象
		   			this.$set(this.application,'unitsData',company)
		   			if(company.length>0){
		   				this.$set(this.application,'region',company[0].name)
		   				this.$set(this.checkData,'objId',company[0].id)
		   			}
		   			this.drawLine()
		   			// console.log(this.application)
				} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
        		}
    		})
      	},
      	// 查询列表数据
    	searchData(data){
    		this.axios.post('rmIndStass/rybSameRingRatio',qs.stringify(data)).then((res)=>{
    			if(res.code == '200'){
	        		if(res.data !== null){
	        			this.tableData = res.data
	        		}
        		} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        });
        		}
    		})
	    },
	    searchListData(data){
	    	this.isDetail = true
	    	// console.log(this.checkData)
	    	this.axios.post('rmIndStass/indReportRybInfo',qs.stringify(data)).then((res)=>{
				if(res.code == '200'){
					if(res.data != null){
		              	if(res.data.instats){
							for (var i = 0; i < res.data.instats.length; i++) {
								res.data.instats[i].value = eval("("+res.data.instats[i].value+")")
								res.data.instats[i].momv = eval("("+res.data.instats[i].momv+")")
								res.data.instats[i].compv = eval("("+res.data.instats[i].compv+")")
							}
						}
		              	this.tableData1 = res.data.instats
		              	this.totalResults = res.data == ''?0:res.data.total
		            }
				} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
        		}
    		})
	    },
    	// 搜索按钮
	    goSearch(){
	    	if(this.checkData.subDate == ''){
				this.$alert('查询时间不能为空', '提示', {
                  confirmButtonText: '确定'
                })
                return
			}
			if((parseInt(this.checkData.subDate.substring(0,4))<2020)&&this.checkData.objId != '101'){
				this.limitYear = true
			} else{
				this.limitYear = false
			}
	    	this.isShow = true
    		this.isDetail = false
    		this.tableData = []
    		this.checkData.isPic = 1
    		this.isBtn = false
			this.drawLine()
		},
    	// 导出按钮
		goExport1(){
			// 图片
			if(this.checkData.isPic == 1){
				var myChart = this.$echarts.init(document.getElementById('myChart'))
			    var image = myChart.getDataURL({
			        type: 'png',
			        pixelRatio: 1,  //放大两倍下载，之后压缩到同等大小展示。解决生成图片在移动端模糊问题
			        backgroundColor: '#fff'
			    })
			    var $a = document.createElement('a');
			    $a.setAttribute("href", image);
			    $a.setAttribute("download", "echarts图片下载");
			    $a.click();
			} else{
				var params = qs.stringify({
					subDate:this.checkData.subDate,
	          		objId:this.checkData.objId,
	          		freqy:this.checkData.freqy
		        })
				this.axios.post('/rmIndStass/rybSameRingRatioExport',params,{responseType:'arraybuffer'}).then((res)=>{
	    			let filename = "评价类指标同比、环比分析.xlsx";
	              	this.fileDownload(res, filename);
	    		})
			}
		},
		goExport2(){
			var params = qs.stringify({
	        	submissionDate: this.listCheckData.submissionDate,
	            objectId: this.listCheckData.objectId,
	            frequency: this.listCheckData.frequency,
	            rybStatus: this.listCheckData.rybStatus
	        })
			this.axios.post('/rmIndStass/indRybDetailExport',params,{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "评价类指标同比、环比分析详情表.xlsx";
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
	    // 切换
	    goChange(){
	    	if(this.checkData.isPic == 1){
	    		this.isShow = false
	    		this.isDetail = false
	    		this.checkData.isPic = 0
	    		this.searchData(this.checkData)
	    	} else{
	    		this.tableData = []
	    		this.isShow = true
	    		this.isDetail = false
	    		this.checkData.isPic = 1
	    	}
	    },
	    // 合计
	    getSummaries(param){
	    	const {columns,data} = param
	    	const sums = []
	    	columns.forEach((column,index) => {
	    		if(index === 0){
	    			sums[index] = '合计'
	    			return
	    		} else {
	    			for(var i=0;i<data.length;i++){
	    				if(data[i]['t'+this.quoteMonth[index-1]] == undefined){
	    					sums[index] = '--'
	    				} else{
	    					sums[index] = '100%'
	    				}	
	    			}
	    		}
	    	})
	    	return sums
	    },
	    goForm(item,index,row){
	    	this.listCheckData.submissionDate = item
    		this.listCheckData.objectId = this.checkData.objId
    		this.listCheckData.frequency = this.checkData.freqy
    		this.listCheckData.rybStatus = row.color
    		this.listCheckData.pageNum = 1
	        this.listCheckData.pageSize = 10
	        this.currentPage = 1
    		this.searchListData(this.listCheckData)
	    },
	    handleSizeChange (value) {
	        this.listCheckData.pageNum = value;
	        this.searchListData(this.listCheckData)
	    },
		handleCurrentChange (value) {
		    this.listCheckData.pageNum = value;
		    this.searchListData(this.listCheckData)
		},
		goDetail(index,row){
			this.$router.push({
	            path:'/checkForm',   //跳转的路径
	            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	              	indId:row.id,
	              	subDateEnd:this.checkData.subDate,
					id: this.$route.query.id
	            }
	        })
		}
  	}
}    
</script>
<style lang="scss">
    #rgbCompare{
    	.myChart{
			width:100%;
			height:400px
		}
    	.el-form-item--mini.el-form-item{
			width: auto!important;
			margin-right:18px
		}
		.el-input--mini .el-input__icon{
			line-height:32px
		}
    	.el-input-group__append{
			background: #4285F4;
		    width: 20%;
		    text-align: center;
		    font-size: 16px;
		    color: #fff;
		}
		.el-table__body, .el-table__footer, .el-table__header{
			border-collapse: collapse
		}
		.el-table__footer-wrapper{
			margin-top:0
		}
		.el-table__footer-wrapper tbody td{
			background:#FFF
		}
    	.saveBtn{
			width: 68px;
			height: 26px;
			line-height: 1px;
			padding: 0;
			margin-left:15px;
			margin-top:3px;
			font-size: 12px;
		}
    	table tr:last-child td{
			border-bottom: none
		}
		.el-table::before{
			background-color: transparent!important
		}
		.el-table .cell{
	  		cursor:pointer
	  	}
    	th{
    		background: #F9F9F9;
		    color: #909399;
		    font-weight: bold;
    	}
    	.el-breadcrumb{
    		margin-bottom: 30px;
    		margin-top: 20px;
    	}
    	.el-tabs__content{
    		-webkit-box-shadow: 1px 0px 6px #888;
    		border-radius: 8px;
    	}
    	.el-table__empty-block{
    		background: #fff;
    		width: 100%!important;
    	}
	    .el-pagination{
	    	margin-top: 30px;
	    }
	    .el-select .el-input{
			width:180px;
		}
	    .quoteSys{
	    	margin-top: 25px;
	    	background: #fff;
	    	min-height: 250px;
	    	padding: 16px 16px 30px 16px;
	    	border-radius: 8px;
	    	th{
	    		background: #F9F9F9 ;
	    	}
	    	-webkit-box-shadow: 2px 0px 6px #888;
	    	.titIcon{
	    		font-size:14px;
	    		margin-bottom:30px;
	    		float: left;
	    		width: 100%;
	    		em{
	    			display: inline-block;
	    			width: 2px;
	    			height: 14px;
	    			background: #4285F4;
	    			vertical-align: middle;
	    			margin-right: 5px;
	    		}
	    	}
	    }
	    .el-tabs__header{
		  	margin:0;
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
	    .handleBtn{
	    	display: inline-block;
	    	padding: 0 5px
	    }
	    .handleBtn:hover{
	    	cursor: pointer;
	    }
	    .el-breadcrumb__inner{
	    	color: #4285F4!important;
	    	font-weight: 700!important;
	    }
	    .is-link{
	    	color: #909191!important;
	    }
	    .wgTxtColor span{
	    	color: #909191 !important;
	    	font-weight: 700;
	    }
	    .textOverFlow{
			width: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.el-col{
			text-align:left
		}
		.el-form-item__content{
			width:auto
		}
		.el-input .el-input__inner{
			height:32px;
			line-height:32px;
		}
		.el-form-item__label{
			line-height:32px;
			padding:0 12px 0 0
		}
		.redBg p,.yellowBg p,.blueBg p{
	        display: inline-block;
	        color: #fff;
	        padding: 0 20px;
	        border-radius: 2px;
	        background: #FF6363;
	        word-break:normal
	    }
	    .yellowBg p{
	        background: #FFD824;
	    }
	    .blueBg p{
	        background: #4285F4;
	    }
	    .tip{
	    	line-height:24px;
	    	padding:20px 0
	    }
	    .resultTitle{
	    	height:48px;
	    	line-height:48px;
	    	color:#777777;
	    	border:1px solid #E9E9E9;
	    	border-bottom:none;
	    	background:#F9F9F9;
	    	p{
	    		text-align:center
	    	}
	    	.saveBtn{
	    		position:absolute;
	    		right:0;
	    		margin:11px 15px 0 0
	    	}
	    	.saveBtn:nth-child(2){
	    		position:absolute;
	    		right:83px;
	    	}
	    }
	    .el-card{
	    	box-shadow:none
	    }
	    .cell p{
	      	margin-bottom:15px;
	      	overflow:hidden;
	      	-webkit-line-clamp: 2;
	      	text-overflow: ellipsis;
	      	display: -webkit-box;
	      	/*! autoprefixer: off */
	      	-webkit-box-orient: vertical;
	      	/* autoprefixer: on */
	    }
	    .cell p:last-child{
	        margin-bottom:0
	    }
	    .iconfont{
	    	font-size:12px;
			-webkit-text-fill-color:#FFF;
			-webkit-text-stroke: 0 #FFF;
			margin-right:5px
	    }
	    .el-table th.gutter{
		    display: table-cell!important;
		}
    }
</style>
