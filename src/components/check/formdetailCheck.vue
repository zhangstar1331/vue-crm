<template>
	<div id="checkForm">
        <el-form :model="checkForm" label-position="left" ref="checkForm" size="mini" :inline="true">
        	<el-row>
                <el-col :span="16">
                    <el-form-item label="开始时间">
					   <el-date-picker v-model="checkForm.subDateBegin" @change="changeBegin" type="month" placeholder="开始时间" :picker-options="starDatePicker"></el-date-picker>
					</el-form-item>
                    <el-form-item label="结束时间">
					    <el-date-picker v-model="checkForm.subDateEnd" @change="changeEnd" type="month" placeholder="结束时间" :picker-options="endDatePicker"></el-date-picker>
					</el-form-item>
                    <el-form-item label="适用对象：">
					   <span class="objHeight">{{objName}}</span>
					</el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: right;">
                    <el-button type="primary" @click.native="goSearch(isFlag)" class="saveBtn">查询</el-button>
                    <el-button type="primary" @click.native="goExport(isFlag)" class="saveBtn" :disabled="isBtn">导出</el-button>
                </el-col>
            </el-row>
          	<el-row style="margin-bottom: 16px;" v-if="this.isFlag !== 6&&this.isFlag !== 7">
		        <el-col :span="24" style="padding-bottom: 8px;" v-show="isShow">
		          	<el-card>
			          	<div class="myChart" id="myChart1" v-if="this.isFlag == 1"></div>
			          	<div class="myChart" id="myChart2" v-if="this.isFlag == 2"></div>
			          	<div class="myChart" id="myChart3" v-if="this.isFlag == 3"></div>
			          	<div class="myChart" id="myChart4" v-if="this.isFlag == 4"></div>
			          	<div class="myChart" id="myChart5" v-if="this.isFlag == 5"></div>
		        	</el-card>
		        </el-col>
		        <el-col :span="24" style="padding-bottom: 8px;" v-if="!isShow">
					<el-table :data="tableData[1]" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" v-if="this.isFlag == 1">
						<el-table-column prop="name" label="项目" align="center" width="150">
							<template slot-scope="scope">
								<span :title="scope.row.name">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="" v-for="(item,index) in quoteMonth.map(String)" :key="index" :label="item" align="center">
							<template slot-scope="scope">
								<span>{{scope.row['v'+item] == null?'--':numFormat(scope.row['v'+item]) + unit}}</span>
							</template>
						</el-table-column>
		          	</el-table>
		          	<el-table :data="tableData[2]" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" v-if="this.isFlag == 2">
						<el-table-column prop="name" label="项目" align="center" width="150">
							<template slot-scope="scope">
								<span :title="scope.row.name">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="" v-for="(item,index) in rrquoteMonth.map(String)" :key="index" :label="index%2==0?item:'同比'" align="center">
 							<template slot-scope="scope">
 								<span v-if="index%2==0">
 									{{scope.row['v'+item] == undefined || scope.row['v'+item] == null?'--':numFormat(scope.row['v'+item])+unit}}
 								</span>
 								<span v-else>
 									{{scope.row['c'+item] == undefined || scope.row['c'+item] == null?'--':numFormat(scope.row['c'+item])+srrUnit}}
 								</span>
							</template>
						</el-table-column>
		          	</el-table>
		          	<el-table :data="tableData[3]" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" v-if="this.isFlag == 3">
						<el-table-column prop="name" label="项目" align="center" width="150">
							<template slot-scope="scope">
								<span :title="scope.row.name">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="" v-for="(item,index) in rrquoteMonth.map(String)" :key="index" :label="index%2==0?item:'环比'" align="center">
 							<template slot-scope="scope">
 								<span v-if="index%2==0">
 									{{scope.row['v'+item] == undefined || scope.row['v'+item] == null?'--':numFormat(scope.row['v'+item])+unit}}
 								</span>
 								<span v-else>
 									{{scope.row['m'+item] == undefined || scope.row['m'+item] == null?'--':numFormat(scope.row['m'+item])+srrUnit}}
 								</span>
							</template>
						</el-table-column>
		          	</el-table>
		          	<el-table :data="tableData[4]" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" v-if="this.isFlag == 4">
						<el-table-column prop="name" label="项目" align="center" width="150">
							<template slot-scope="scope">
								<span :title="scope.row.name">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="" v-for="(item,index) in rrquoteMonth.map(String)" :key="index" :label="index%2==0?item:'容忍度'" align="center">
 							<template slot-scope="scope">
 								<span v-if="index%2==0" :class="{'redBg':scope.row['pn'+item] == 1}">
 									{{scope.row['v'+item] == undefined || scope.row['v'+item] == null?'--':numFormat(scope.row['v'+item])+unit}}
 								</span>
 								<span v-else>
 									{{scope.row['pv'+item] == undefined || scope.row['pv'+item] == null?'--':numFormat(scope.row['pv'+item])+prefUnit}}
 								</span>
							</template>
						</el-table-column>
		          	</el-table>
		          	<el-table :data="tableData[5]" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" v-if="this.isFlag == 5">
						<el-table-column prop="name" label="项目" align="center" width="150">
							<template slot-scope="scope">
								<span :title="scope.row.name">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="" v-for="(item,index) in rrquoteMonth.map(String)" :key="index" :label="index%2==0?item:'限额'" align="center">
 							<template slot-scope="scope">
 								<span v-if="index%2==0" :class="{'redBg':scope.row['ln'+item] == 1}">
 									{{scope.row['v'+item] == undefined || scope.row['v'+item] == null?'--':numFormat(scope.row['v'+item])+unit}}
 								</span>
 								<span v-else>
 									{{scope.row['lv'+item] == undefined || scope.row['lv'+item] == null?'--':numFormat(scope.row['lv'+item])+limitUnit}}
 								</span>
							</template>
						</el-table-column>
		          	</el-table>
		        </el-col>
		    </el-row>
		    <el-row style="margin-bottom: 16px;" v-if="this.isFlag == 6">
				<el-table :data="tableData6" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-bottom:25px">
					<el-table-column prop="time" label="时间" align="center" width="150"></el-table-column>
					<el-table-column prop="status" label="预警级别" align="center">
						<template slot-scope="scope">
							<span class="redBg" v-if="scope.row.status == 1">红</span>
							<span class="yellowBg" v-if="scope.row.status == 2">黄</span>
							<span class="blueBg" v-if="scope.row.status == 3">蓝</span>
						</template>
					</el-table-column>
					<el-table-column prop="cause" label="原因分析" align="center">
						<template slot-scope="scope">
							<p style="white-space:pre-line;text-align: left;">{{scope.row.cause == null?'--':scope.row.cause}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="corra" label="改善措施" align="center">
						<template slot-scope="scope">
							<p style="white-space:pre-line;text-align: left;">{{scope.row.corra == null?'--':scope.row.corra}}</p>
						</template>
					</el-table-column>
	          	</el-table>
		    </el-row>
			<!-- 指标预警详情 -->		    
			<el-row style="margin-bottom: 16px;" v-if="this.isFlag == 7">
				<el-table :data="tableData6" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-bottom:25px" class="warnTable">
					<el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
					<el-table-column prop="name" label="指标名称" align="center" width="150">
						<template slot-scope="scope">
		                    <span :title="scope.row.name">{{scope.row.name == null?'--':scope.row.name}}</span>
		                </template>
					</el-table-column>
					<el-table-column prop="rate" label="报送频率" align="center" width="100">
						<template slot-scope="scope">
							<span>{{frequency[scope.row.rate]}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="time" label="报送批次" align="center" width="100"></el-table-column>
					<el-table-column prop="value" label="指标值" align="center" width="200">
						<template slot-scope="scope">
							<p v-for="item in JSON.parse(scope.row.value)" :title="item" :class="{'redBg1':scope.row.status == 1,'yellowBg1':scope.row.status == 2,'blueBg1':scope.row.status == 3}">
								{{item}}
							</p>
						</template>
					</el-table-column>
					<el-table-column prop="cause" label="原因分析" align="center">
						<template slot-scope="scope">
							<p style="white-space:pre-line;text-align: left;">{{scope.row.cause == null?'--':scope.row.cause}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="corra" label="改善措施" align="center">
						<template slot-scope="scope">
							<p style="white-space:pre-line;text-align: left;">{{scope.row.corra == null?'--':scope.row.corra}}</p>
						</template>
					</el-table-column>
	          	</el-table>
		    </el-row>
      	</el-form>
      	<div class="ratelist" v-if="this.isFlag !== 6&&this.isFlag !== 7">
      		<span>{{quoteName}}：</span>
      		<ul>
      			<li v-for="item in rateList" @click="goDetail(item.id)">
      				{{item.desc}}
      			</li>
      		</ul>
            <el-button @click="turnTable(isFlag)" :class="{'saveBtn':isShow == true,'saveBtn1':isShow == false}"><i class="iconfont iconbiaoge"></i>表格</el-button>
            <el-button @click="turnChart(isFlag)" :class="{'saveBtn1':isShow == true,'saveBtn':isShow == false}"><i class="iconfont icontuxing"></i>图形</el-button>
      	</div>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import {numFormat} from 'src/utils/utils.js'
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		props:['isFlag'],
	    data () {
	      	return {
	      		isSecond:1,
	      		max:'',
	      		rrquoteMonth:[],
	      		objName:'',//适用对象
	      		quoteName:'',//指标名称
		      	tableData:[],
		      	tableData6:[],
		      	isShow:true,
		      	allData:[],
		      	isBtn:false,
		      	checkForm:{
	        		subDateBegin:'',
	            	subDateEnd:'',
	        	},
		        checkData:{},
		        // 开始时间
		        starDatePicker:{
	  				disabledDate: (time) => {
		            	if (this.checkForm.subDateEnd) {
	                        return time.getTime() > Date.now() || time.getTime() > this.checkForm.subDateEnd;
	                    } else {
	                        return time.getTime() > Date.now();
	                    }
		          	},
	  			},
	  			// 结束时间
	  			endDatePicker:{
	  				disabledDate: (time) => {
		            	return time.getTime() < this.checkForm.subDateBegin || time.getTime() > Date.now();
		          	},
	  			},
		        // 综合流动比率
		        rateList:[],
		        quoteMonth:[],
		        unit:'',//单位
		        srrUnit:'',//同比、环比单位
		        prefUnit:'',//容忍度单位
		        limitUnit:'',//限额单位
		        // 频率
		        frequency:{
		          '1':'月度',
		          '2':'季度',
		          '3':'年度',
		          '4':'半年度'
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
		        	color:['#4285F4','#1FD58E','#8D5DF8'],
		          	tooltip: {
			            trigger: 'axis',
			            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			              type: ''        // 默认为直线，可选为：'line' | 'shadow'
			            }
			        },
		          	legend: {
		          		y:'bottom',
		          		textStyle: {color: []},
			            data: [],
			            formatter:function (name) {
			            	return name.length>10?name.substr(0,10)+"...":name
			            },
			            tooltip: {
					        show: true
					    }
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
			            	name:'',
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
							axisLabel: {//y轴文字
				              	show:true,
				              	interval:'auto',
				              	// formatter:'{value}.00%'
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
		          	series: []
		        },
		        options2: {
		        	title:{
	    				show:false,
	    				textStyle:{
	    					color:'#909399'
	    				},
	    				text:'暂无数据',
	    				left:'center',
	    				top:'center'
	    			},
		        	color:['#4285F4','#D32FFA','#1fd58e','#99bdf6','#8d5df8','#7DDF38'],
		          	tooltip: {
		            	trigger: 'axis',
		            	axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		              		type: ''        // 默认为直线，可选为：'line' | 'shadow'
		            	}
		          	},
		          	legend: {
		            	y:'bottom',
		          		textStyle: {color: []},
			            data: [],
			            formatter:function (name) {
			            	if(name.substr(name.length-2,2) == '同比'){
			            		return name.length>10?name.substr(0,10)+"..."+name.substr(name.length-2,2):name
			            	} else{
			            		return name.length>10?name.substr(0,10)+"...":name
			            	}
			            },
			            tooltip: {
					        show: true
					    }
		          	},
		          	toolbox: {
		            	show: false,
		            	feature: {
			              	mark: {show: true},
			              	dataView: {show: true, readOnly: false},
			              	magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
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
			        		data: [],
			            }
		          	],
		          	yAxis: [
			            {
			            	name:'',
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
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
			            },
			            {
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
			              	},
			              	axisTick: { //y轴刻度线
					          "show":false
					        },
					        splitLine: {//虚线
				                show: false,
				                lineStyle:{
				                    type:'dashed'
				                }
				            }
			            }
			        ],
		          	series: []
		        },
		        options3: {
		        	title:{
	    				show:false,
	    				textStyle:{
	    					color:'#909399'
	    				},
	    				text:'暂无数据',
	    				left:'center',
	    				top:'center'
	    			},
		        	color:['#4285F4','#D32FFA','#1fd58e','#99bdf6','#8d5df8','#7DDF38'],
		          	tooltip: {
		            	trigger: 'axis',
		            	axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		              		type: ''        // 默认为直线，可选为：'line' | 'shadow'
		            	}
		          	},
		          	legend: {
		            	y:'bottom',
		          		textStyle: {color: []},
			            data: [],
			            formatter:function (name) {
			            	if(name.substr(name.length-2,2) == '环比'){
			            		return name.length>10?name.substr(0,10)+"..."+name.substr(name.length-2,2):name
			            	} else{
			            		return name.length>10?name.substr(0,10)+"...":name
			            	}
			            },
			            tooltip: {
					        show: true
					    }
		          	},
		          	toolbox: {
		            	show: false,
		            	feature: {
			              	mark: {show: true},
			              	dataView: {show: true, readOnly: false},
			              	magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
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
			        		data: [],
			            }
		          	],
		          	yAxis: [
			            {
			            	name:'',
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
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
			            },
			            {
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
			              	},
			              	axisTick: { //y轴刻度线
					          "show":false
					        },
					        splitLine: {//虚线
				                show: false,
				                lineStyle:{
				                    type:'dashed'
				                }
				            }
			            }
			        ],
		          	series: []
		        },
		        options4: {
		        	title:{
	    				show:false,
	    				textStyle:{
	    					color:'#909399'
	    				},
	    				text:'暂无数据',
	    				left:'center',
	    				top:'center'
	    			},
		        	color:['#92D9FF'],
		          	tooltip: {
		            	trigger: 'axis',
		            	axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		              		type: ''        // 默认为直线，可选为：'line' | 'shadow'
		            	}
		          	},
		          	legend: {
		            	y:'bottom',
		          		textStyle: {color:[]},
			            data: [],
			            formatter:function (name) {
			            	if(name.substr(name.length-3,3) == '容忍度'){
			            		return name.length>10?name.substr(0,10)+"..."+name.substr(name.length-3,3):name
			            	} else{
			            		return name.length>10?name.substr(0,10)+"...":name
			            	}
			            },
			            tooltip: {
					        show: true
					    }
		          	},
		          	toolbox: {
		            	show: false,
		            	feature: {
			              	mark: {show: true},
			              	dataView: {show: true, readOnly: false},
			              	magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
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
			        		data: [],
			            }
		          	],
		          	yAxis: [
			            {
			            	name:'',
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
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
			            },
			            {
			            	name:'',
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
			              	},
			              	axisTick: { //y轴刻度线
					          "show":false
					        },
					        splitLine: {//虚线
				                show: false,
				                lineStyle:{
				                    type:'dashed'
				                }
				            }
			            }
			        ],
		          	series: []
		        },
		        options5: {
		        	title:{
	    				show:false,
	    				textStyle:{
	    					color:'#909399'
	    				},
	    				text:'暂无数据',
	    				left:'center',
	    				top:'center'
	    			},
		        	color:['#92D9FF'],
		          	tooltip: {
		            	trigger: 'axis',
		            	axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		              		type: ''        // 默认为直线，可选为：'line' | 'shadow'
		            	}
		          	},
		          	legend: {
		            	y:'bottom',
		          		textStyle: {color:[]},
			            data: [],
			            formatter:function (name) {
			            	if(name.substr(name.length-2,2) == '限额'){
			            		return name.length>10?name.substr(0,10)+"..."+name.substr(name.length-2,2):name
			            	} else{
			            		return name.length>10?name.substr(0,10)+"...":name
			            	}
			            },
			            tooltip: {
					        show: true
					    }
		          	},
		          	toolbox: {
		            	show: false,
		            	feature: {
			              	mark: {show: true},
			              	dataView: {show: true, readOnly: false},
			              	magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
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
			        		data: [],
			            }
		          	],
		          	yAxis: [
			            {	
			            	name:'',
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
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
			            },
			            {
			            	name:'',
			              	type: 'value',
			              	axisLine: {//y轴坐标线
							    show: false,
							},
			              	axisLabel:{
			              		show:true,
			              		interval:'auto'
			              	},
			              	axisTick: { //y轴刻度线
					          "show":false
					        },
					        splitLine: {//虚线
				                show: false,
				                lineStyle:{
				                    type:'dashed'
				                }
				            }
			            }
			        ],
		          	series: []
		        },
	      }
	    },
	    mounted(){
	    	Bus.$off('compareData')
	    	// 加载echarts
	    	this.drawLine()
	    },
	    created () {
	    	// 获取详情数据
	    	this.getInfo()
	    },
	    methods: {
	    	...mapActions(['setData']),
	    	getEchart(flag,options,chartData){
	    		// 处理表格
	    		this.tableData[flag] = []
	    		this.quoteMonth = chartData.dates
	    		this.tableData[flag] = chartData.vList
	    		var chartWidth = document.getElementById('myChart'+this.isFlag)
	    		chartWidth.style.width = window.innerWidth - 300 + 'px'
	    		// 处理图形
	    		var myChart = this.$echarts.init(document.getElementById('myChart'+this.isFlag))
	    		if(chartData.unit){
	    			this.unit = chartData.unit
	    			options.yAxis[0].name = chartData.unit + '　　'
	    		}
	    		options.xAxis[0].data = chartData.dates
	    		var arr = []
	    		if(flag !== 1){
	    			this.rrquoteMonth = []
	    			for(var i = 0;i<this.quoteMonth.length;i++){
	    				this.rrquoteMonth.push(this.quoteMonth[i])
	    				this.rrquoteMonth.push(this.quoteMonth[i])
	    			}
	    			if(flag == 4){
	    				if(chartData.prefUnit){
	    					this.prefUnit = chartData.prefUnit
	    					options.yAxis[1].name = '　　' + chartData.prefUnit
	    				}
	    			} else if(flag == 5){
	    				if(chartData.limitUnit){
	    					this.limitUnit = chartData.limitUnit
	    					options.yAxis[1].name = '　　' + chartData.limitUnit
	    				}
	    			} else{
	    				if(chartData.srrUnit){
	    					this.srrUnit = chartData.srrUnit
	    					options.yAxis[1].name = '　　' + chartData.srrUnit
	    				}
	    			}
	    		}
	    		if(flag == 1){
	    			if(chartData.vList){
		    			for(var i=0;i<chartData.vList.length;i++){
			    			arr.push({
			    				name: chartData.vList[i].name,
				              	type: 'line',
				              	symbol:'square',
				              	symbolSize: 14, 
				              	lineStyle: {
									show: true,
									normal:{
										width: 3,
									}
								},
				              	data: []
			    			})
			    			for(var j=0;j<chartData.dates.length;j++){
			    				if(chartData.vList[i]['v'+chartData.dates[j]]!==undefined){
			    					arr[i].data.push(chartData.vList[i]['v'+chartData.dates[j]])
			    				} else{
			    					arr[i].data.push('')
			    				}
			    			}
			    			options.legend.data.push(chartData.vList[i].name)
			    		}
		    		}
		    		options.series = arr
		    		options.tooltip.formatter = function (params) {
					    let html=params[0].name+"<br>";
					    for(let i=0;i<params.length;i++){
				    		html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
				    		if(params[i].value){
				    			html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.unit+"<br>";
				    		} else{
				    			html+=params[i].seriesName+"："+'--'+chartData.unit+"<br>";
				    		}
					    }
					    return html;
					}
	    		}
	    		if(flag == 2){
	    			var ItemBar = function () {
		    			return {
		    				name:'',
			              	type: 'bar',
			              	barWidth:'24%',
			              	smooth:true,
			              	yAxisIndex:'0',
			              	data: [],
		    			}
		    		}
		    		var ItemLine = function () {
		    			return {
			            	name: '',
			              	type: 'line',
			              	symbol:'square',
			              	symbolSize: 14,
			              	yAxisIndex:'1',
			              	lineStyle: {
								show: true,
								normal:{
									width: 3,
								}
								
							},
			              	data: [],
			            }
		    		}
		    		if(chartData.vList){
		    			for(var i=0;i<chartData.vList.length;i++){
			    			var itemBar = new ItemBar()
			    			var itemLine = new ItemLine()
			    			for(var j=0;j<chartData.dates.length;j++){
			    				if(chartData.vList[i]['v'+chartData.dates[j]]!==undefined){
			    					itemBar.name = chartData.vList[i].name
			    					itemBar.data.push(chartData.vList[i]['v'+chartData.dates[j]])
			    				} else{
			    					itemBar.data.push('')
			    				}
			    				if(chartData.vList[i]['c'+chartData.dates[j]]!==undefined){
			    					itemLine.name = chartData.vList[i].name+'同比'
			    					itemLine.data.push(chartData.vList[i]['c'+chartData.dates[j]])
			    				} else{
			    					itemLine.data.push('')
			    				}
			    			}
			    			if(chartData.dates.length<7){
			    				itemBar.barWidth = '36'
			    			}
			    			arr.push(itemBar)
			    			arr.push(itemLine)
			    			options.legend.data.push(chartData.vList[i].name)
			    			options.legend.data.push(chartData.vList[i].name+'同比')
			    		}
		    		}
		    		options.series = arr
	    			options.tooltip.formatter = function (params) {
					    let html=params[0].name+"<br>";
					    for(let i=0;i<params.length;i++){
					    	if(params[i].seriesType == 'bar'){
					    		html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					    		if(params[i].value){
					    			html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.unit+"<br>";
					    		} else{
					    			html+=params[i].seriesName+"："+'--'+chartData.unit+"<br>";
					    		}
					    	} else{
					    		if(params[i].seriesName!==''){
									html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
									if(params[i].value){
										html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.srrUnit+"<br>";
									} else{
										html+=params[i].seriesName+"："+'--'+chartData.srrUnit+"<br>";
									}
					    		}
					    	}
					    }
					    return html;
					}
	    		}
	    		if(flag == 3){
	    			var ItemBar = function () {
		    			return {
		    				name:'',
			              	type: 'bar',
			              	barWidth:'24%',
			              	smooth:true,
			              	yAxisIndex:'0',
			              	data: [],
		    			}
		    		}
		    		var ItemLine = function () {
		    			return {
			            	name: '',
			              	type: 'line',
			              	symbol:'square',
			              	symbolSize: 14,
			              	yAxisIndex:'1',
			              	lineStyle: {
								show: true,
								normal:{
									width: 3,
								}
								
							},
			              	data: [],
			            }
		    		}
		    		if(chartData.vList){
		    			for(var i=0;i<chartData.vList.length;i++){
			    			var itemBar = new ItemBar()
			    			var itemLine = new ItemLine()
			    			for(var j=0;j<chartData.dates.length;j++){
			    				if(chartData.vList[i]['v'+chartData.dates[j]]!==undefined){
			    					itemBar.name = chartData.vList[i].name
			    					itemBar.data.push(chartData.vList[i]['v'+chartData.dates[j]])
			    				} else{
			    					itemBar.data.push('')
			    				}
			    				if(chartData.vList[i]['m'+chartData.dates[j]]!==undefined){
			    					itemLine.name = chartData.vList[i].name+'环比'
			    					itemLine.data.push(chartData.vList[i]['m'+chartData.dates[j]])
			    				} else{
			    					itemLine.data.push('')
			    				}
			    			}
			    			if(chartData.dates.length<7){
			    				itemBar.barWidth = '36'
			    			}
			    			arr.push(itemBar)
			    			arr.push(itemLine)
			    			options.legend.data.push(chartData.vList[i].name)
			    			options.legend.data.push(chartData.vList[i].name+'环比')
			    		}
		    		}
	    			options.series = arr
	    			options.tooltip.formatter = function (params) {
					    let html=params[0].name+"<br>";
					    for(let i=0;i<params.length;i++){
					    	if(params[i].seriesType == 'bar'){
					    		html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					    		if(params[i].value){
					    			html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.unit+"<br>";
					    		} else{
					    			html+=params[i].seriesName+"："+'--'+chartData.unit+"<br>";
					    		}
					    	} else{
					    		if(params[i].seriesName!==''){
					    			html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					    			if(params[i].value){
										html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.srrUnit+"<br>";
									} else{
										html+=params[i].seriesName+"："+'--'+chartData.srrUnit+"<br>";
									}
					    		}
					    	}
					    }
					    return html;
					}
	    		}
	    		if(flag == 4){
	    			var ItemBar = function () {
		    			return {
		    				name:'',
			              	type: 'bar',
			              	barWidth:'24%',
			              	smooth:true,
			              	yAxisIndex:'0',
			              	itemStyle: {normal: {
			              		color: function(params){
			              			for(var i=0;i<chartData.vList.length;i++){
				              			// 突破
			              				if(chartData.vList[i]['pn'+params.name] == 1){
					              			return "#FF6363"
					    				} else{
				              				return "#4285F4"
				              			}
			              			}
			              		}
			              	}},
			              	data: [],
		    			}
		    		}
		    		var ItemLine = function () {
		    			return {
			            	name: '',
			              	type: 'line',
			              	step:'middle',
			              	symbol:'square',
			              	symbolSize: 5,
			              	yAxisIndex:'1',
			              	lineStyle: {
								show: true,
								normal:{
									type: 'dashed',
									width: 5,
								}
								
							},
			              	data: [],
			            }
		    		}
		    		for(var k=0;k<chartData.dates.length;k++){
		    			if(chartData.vList){
		    				if(chartData.vList[0]['v'+chartData.dates[k]]!==undefined){
			    				var max = chartData.vList[0]['v'+chartData.dates[k]]
			    				this.max = max
			    			}
		    			}
		    		}
		    		if(chartData.vList){
		    			for(var i=0;i<chartData.vList.length;i++){
			    			var itemBar = new ItemBar()
			    			var itemLine = new ItemLine()
			    			for(var j=0;j<chartData.dates.length;j++){
			    				if(chartData.vList[i]['v'+chartData.dates[j]]!==undefined){
			    					itemBar.name = chartData.vList[i].name
			    					itemBar.data.push(chartData.vList[i]['v'+chartData.dates[j]])
			    					if(parseInt(chartData.vList[i]['v'+chartData.dates[j]])>parseInt(this.max)){
			    						this.max = chartData.vList[i]['v'+chartData.dates[j]]
			    					}
			    				} else{
			    					itemBar.data.push('')
			    				}
			    				if(chartData.vList[i]['pv'+chartData.dates[j]]!==undefined){
			    					itemLine.name = chartData.vList[i].name+'容忍度'
			    					itemLine.data.push(chartData.vList[i]['pv'+chartData.dates[j]])
			    					if(parseInt(chartData.vList[i]['pv'+chartData.dates[j]])>parseInt(this.max)){
			    						this.max = chartData.vList[i]['pv'+chartData.dates[j]]
			    					}
			    				} else{
			    					itemLine.data.push('')
			    				}
			    			}
			    			if(chartData.dates.length<7){
			    				itemBar.barWidth = '36'
			    			}
			    			arr.push(itemBar)
			    			arr.push(itemLine)
			    			options.legend.data.push(chartData.vList[i].name)
			    			options.legend.data.push(chartData.vList[i].name+'容忍度')
			    		}
		    		}
		    		if(this.max>10&&this.max%6!==0){
		    			this.count(this.max)
		    		}
		    		options.series = arr
		    		options.yAxis[0].max = this.max
		    		options.yAxis[1].max = this.max
		    		options.tooltip.formatter = function (params) {
					    let html=params[0].name+"<br>";
					    for(let i=0;i<params.length;i++){
					    	if(params[i].seriesType == 'bar'){
					    		html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					    		if(params[i].value){
					    			html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.unit+"<br>";
					    		} else{
					    			html+=params[i].seriesName+"："+'--'+chartData.unit+"<br>";
					    		}
					    	} else{
					    		if(params[i].seriesName!==''){
					    			html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					    			if(params[i].value){
										html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.prefUnit+"<br>";
									} else{
										html+=params[i].seriesName+"："+'--'+chartData.prefUnit+"<br>";
									}
					    		}
					    	}
					    }
					    return html;
					}
	    		}
	    		if(flag == 5){
	    			var ItemBar = function () {
		    			return {
		    				name:'',
			              	type: 'bar',
			              	barWidth:'24%',
			              	smooth:true,
			              	yAxisIndex:'0',
			              	itemStyle: {normal: {
			              		color: function(params){
			              			for(var i=0;i<chartData.vList.length;i++){
				              			// 突破
			              				if(chartData.vList[i]['ln'+params.name] == 1){
					              			return "#FF6363"
					    				} else{
				              				return "#4285F4"
				              			}
			              			}
			              		}
			              	}},
			              	data: [],
		    			}
		    		}
		    		var ItemLine = function () {
		    			return {
			            	name: '',
			              	type: 'line',
			              	step:'middle',
			              	symbol:'square',
			              	symbolSize: 5,
			              	yAxisIndex:'1',
			              	lineStyle: {
								show: true,
								normal:{
									type: 'dashed',
									width: 5,
								}
							},
			              	data: [],
			            }
		    		}
		    		for(var k=0;k<chartData.dates.length;k++){
		    			if(chartData.vList){
		    				if(chartData.vList[0]['v'+chartData.dates[k]]!==undefined){
			    				var max = chartData.vList[0]['v'+chartData.dates[k]]
			    				this.max = max
			    			}
		    			}
		    		}
		    		if(chartData.vList){
		    			for(var i=0;i<chartData.vList.length;i++){
			    			var itemBar = new ItemBar()
			    			var itemLine = new ItemLine()
			    			for(var j=0;j<chartData.dates.length;j++){
			    				if(chartData.vList[i]['v'+chartData.dates[j]]!==undefined){
			    					itemBar.name = chartData.vList[i].name
			    					itemBar.data.push(chartData.vList[i]['v'+chartData.dates[j]])
			    					if(parseInt(chartData.vList[i]['v'+chartData.dates[j]])>parseInt(this.max)){
			    						this.max = chartData.vList[i]['v'+chartData.dates[j]]
			    					}
			    				} else{
			    					itemBar.data.push('')
			    				}
			    				if(chartData.vList[i]['lv'+chartData.dates[j]]!==undefined){
			    					itemLine.name = chartData.vList[i].name+'限额'
			    					itemLine.data.push(chartData.vList[i]['lv'+chartData.dates[j]])
			    					if(parseInt(chartData.vList[i]['lv'+chartData.dates[j]])>parseInt(this.max)){
			    						this.max = chartData.vList[i]['lv'+chartData.dates[j]]
			    					}
			    				} else{
			    					itemLine.data.push('')
			    				}
			    			}
			    			if(chartData.dates.length<7){
			    				itemBar.barWidth = '36'
			    			}
			    			arr.push(itemBar)
			    			arr.push(itemLine)
			    			options.legend.data.push(chartData.vList[i].name)
			    			options.legend.data.push(chartData.vList[i].name+'限额')
			    		}
		    		}
		    		if(this.max>10&&this.max%6!==0){
		    			this.count(this.max)
		    		}
		    		options.series = arr
		    		options.yAxis[0].max = this.max
		    		options.yAxis[1].max = this.max
	    			options.tooltip.formatter = function (params) {
					    let html=params[0].name+"<br>";
					    for(let i=0;i<params.length;i++){
					    	if(params[i].seriesType == 'bar'){
					    		html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					    		if(params[i].value){
					    			html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.unit+"<br>";
					    		} else{
					    			html+=params[i].seriesName+"："+'--'+chartData.unit+"<br>";
					    		}
					    	} else{
					    		if(params[i].seriesName!==''){
					    			html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
					    			if(params[i].value){
										html+=params[i].seriesName+"："+numFormat(params[i].value)+chartData.limitUnit+"<br>";
									} else{
										html+=params[i].seriesName+"："+'--'+chartData.limitUnit+"<br>";
									}
					    		}
					    	}
					    }
					    return html;
					}
	    		}
	    		// 暂无数据
	    		if(arr.length == 0){
	    			options.title.show = true
	    			options.xAxis[0].data = []
	    			options.yAxis[0].name = ''
	    			if(options.yAxis[1]){
	    				options.yAxis[1].name = ''
	    			}
	    		} else{
	    			options.title.show = false
	    		}
	    		myChart.setOption(options, true)
	    		window.addEventListener("resize", () => { myChart.resize();});
	    	},
	    	count(max){
	    	    max = (Math.floor(max / 10) + 1)*10
    			if(max%6==0){
    				this.max = max
    			} else{
    				this.count(max)
    			}
	    	},
	    	drawLine(){
	    		this.isSecond = this.isFlag
		    	var chartData = JSON.parse(sessionStorage.getItem('allData')).values
			    if(this.isFlag == 1){
			    	this.getEchart(1,this.options1,chartData)
		    	}
		    	if(this.isFlag == 2){
		    		Bus.$on('compareData', (data) => {
		    			this.getEchart(2,this.options2,data.values)
				    })
		    	}
		    	if(this.isFlag == 3){
		    		Bus.$on('compareData', (data) => {
		    			this.getEchart(3,this.options3,data.values)
				    })
		    	}
		    	if(this.isFlag == 4){
		    		this.getEchart(4,this.options4,chartData)
		    	}
		    	if(this.isFlag == 5){
		    		Bus.$on('compareData', (data) => {
		    			this.getEchart(5,this.options5,data.values)
				    })
		    	}
	    	},
	    	getInfo(){
				// 获取详情数据
		    	var allData = JSON.parse(sessionStorage.getItem('allData'))
		    	this.allData = allData
		    	// 开始、结束时间
		    	if(allData.scopeTime!==undefined){
		    		this.checkForm.subDateBegin = (allData.scopeTime[0]+'').substr(0,4)+'-'+(allData.scopeTime[0]+'').substr(4,2)
		    		this.checkData.subDateBegin = this.checkForm.subDateBegin.split('-').join('')
		    		this.checkForm.subDateEnd = (allData.scopeTime[1]+'').substr(0,4)+'-'+(allData.scopeTime[1]+'').substr(4,2)
		    		this.checkData.subDateEnd = this.checkForm.subDateEnd.split('-').join('')
		    	}
		    	if(allData.updInfo!==undefined){
		    		// 指标更新信息列表
		    		this.rateList = allData.updInfo
		    	}
		    	if(allData.detail!==undefined){
		    		// 指标名称
		    		this.objName = allData.detail.objName
		    		// 适用对象
		    		this.quoteName = allData.detail.name
		    	}
		    	// 异常原因记录
	    		this.tableData6 = allData.exceInfo==''?[]:allData.exceInfo
	    	},
	    	// 图形
	    	turnChart(val){
	    		this.isShow = true
	    	},
	    	// 表格
	    	turnTable(val){
	    		this.isShow = false
	    	},
	      	// 开始时间
	      	changeBegin(val){
	      		this.isBtn = true
	      		if(val != null){
		  			this.checkData.subDateBegin = formatDate(val,'yyyy-MM');
		  			this.checkData.subDateBegin = this.checkData.subDateBegin.split('-').join('')
		  		}else{
		  			this.checkData.subDateBegin = '';
		  		}
	      	},
	      	// 结束时间
	      	changeEnd(val){
	      		this.isBtn = true
	     		if(val != null){
      				this.checkData.subDateEnd = formatDate(val,'yyyy-MM');
		  			this.checkData.subDateEnd = this.checkData.subDateEnd.split('-').join('')
      			}else{
      				this.checkData.subDateEnd = '';
      			}
	     	},
	      	// 查询
	      	goSearch(type){
	      		this.isBtn = false
	      		this.checkData.indId = this.allData.detail.id
		    	this.checkData.freqy = this.allData.detail.rate
		    	this.checkData.type = type
				this.axios.post('rmIndStass/indDetailValues',qs.stringify(this.checkData)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					if(this.isFlag == 1){
	    						this.getEchart(1,this.options1,res.data.values)
	    					} else if(this.isFlag == 2){
	    						this.getEchart(2,this.options2,res.data.values)
	    					} else if(this.isFlag == 3){
	    						this.getEchart(3,this.options3,res.data.values)
	    					} else if(this.isFlag == 4){
	    						this.getEchart(4,this.options4,res.data.values)
	    					} else if(this.isFlag == 5){
	    						this.getEchart(5,this.options5,res.data.values)
	    					} else if(this.isFlag == 6 || this.isFlag == 7){
	    						this.tableData6 = res.data.exceInfo==''?[]:res.data.exceInfo
	    					}
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	      	},
	      	// 指标更新详情
	    	goDetail(id){
	    		var url = '/riskMonitor/quoteManage/detailIndicator?status='+1
    			this.getDetailIndicator(id,url)
	    	},
	    	//获取详情页面数据
	    	getDetailIndicator(id,url){
	    		this.axios.post('indicator/detail',qs.stringify({id:id})).then((res)=>{
					if(res.code == '200'){
						var obj = res.data.base;
						var indiObj = JSON.parse(JSON.stringify(this.indicator))
						Object.keys(indiObj).forEach(function(key){
							Object.keys(obj).forEach(function(key1){
								if(key1 == key){
									indiObj[key] = obj[key1]
								}
							})
						})
						indiObj.paramName = obj.paramName
						indiObj.serial = obj.serial
						indiObj.expire = res.data.expire
						if(indiObj.expire){
							for(var i = 0; i < indiObj.expire.length; i++){
								var str = indiObj.expire[i].date.substr(0,7)
								indiObj.expire[i].date = str
							}
						}
						indiObj.history = res.data.history.reverse()
						if(indiObj.dataType=='2' && indiObj.threshold){
							var dataUnit = [{
						      	name:'等级',
						      	id:'4'
						    }]
							this.setData({'indicatorArr.dataUnit':dataUnit})
							var arr = ['blue','red','yellow']
				  		for(var i = 0; i < indiObj.threshold.length; i++){
				  			for(var j = 0; j < arr.length; j++){
				  				for(var k = 0; k < indiObj.threshold[i][arr[j]].length; k++){
				  					var str = indiObj.threshold[i][arr[j]][k].value
				  					indiObj.threshold[i][arr[j]][k].value = str.split(',')
				  				}
				  			}
				  		}
						}
						if(indiObj.dataType == '2'){
				  		var toleranceArr = ['prefTolerance','dfTolerance','limitTolerance']
					  	for(var k = 0; k < toleranceArr.length; k++){
					  		if(indiObj[toleranceArr[k]]){
						  		for(var i = 0; i < indiObj[toleranceArr[k]].length; i++){
				  					var str = indiObj[toleranceArr[k]][i].value
				  					indiObj[toleranceArr[k]][i].value = str.split(',');
						  		}
						  	}
					  	}
				  	}
						this.setData({'indicator':indiObj})
						var indType = JSON.parse(JSON.stringify(this.indicatorArr.threshold.indType))
						if(indiObj.paramId != ''){
							indType.push({name:'参数值',id:'p'})
						}
						if(obj.subIndicator){
							for(var i = 0; i < obj.subIndicator.length; i++){
								indType.push(obj.subIndicator[i])
							}
						}
						this.setData({'indicatorArr.threshold.indType':indType})
						this.getCommData(url)
					}
				})
	    	},
	    	getCommData(url,paramItem){
	    		this.axios.post('/indicator/comm',{headers:{'Content-Type':'application/json'}}).then((res)=>{
		  			if(res.code==200){
		  				var param = [];
		  				if(res.data.param){
		  					param = res.data.param
		  				}
		  				if(paramItem){
		  					param.push(paramItem)
		  				}
		  				this.setData({'indicatorArr.risk':res.data.kind})
		  				this.setData({'indicatorArr.upCalibre':res.data.upCalibre})
		  				this.setData({'indicatorArr.param':param})
		  				this.setData({'indicatorArr.sentInfo.company':res.data.company})
		  				this.setData({'indicatorArr.sentInfo.codpNames':res.data.codpNames})
		  				this.setData({'indicatorArr.sentInfo.monthArr':res.data.month})
		  				this.setData({'indicatorArr.sentInfo.quarterArr':res.data.quarter})
		  				this.setData({'indicatorArr.sentInfo.yearArr':res.data.year})
		  				this.setData({'indicatorArr.sentInfo.halfyearArr':res.data.halfyear})
		  				this.$router.push({  //核心语句
					        path:url,//跳转的路径
					        query:{
					        	indId: this.$route.query.indId
					        }
					    })
		  			}
				})
	    	},
	    	// 导出
	      	goExport(type){
	      		if(type == 6 || !this.isShow || type == 7){
	      			// 表格
			    	var params = qs.stringify({
			        	indId:this.allData.detail.id,
			        	subDateBegin:this.checkData.subDateBegin,
			        	subDateEnd:this.checkData.subDateEnd,
			        	freqy:this.allData.detail.rate,
			        	type:type
			        })
					this.axios.post('/rmIndStass/indDetailValuesExport',params,{responseType:'arraybuffer'}).then((res)=>{
		    			let filename = "风险指标报表详情.xlsx";
		              	this.fileDownload(res, filename);
		    		})
	      		} else {
	      			// 图片
		      		var myChart = this.$echarts.init(document.getElementById('myChart'+this.isFlag))
				    var image = myChart.getDataURL({
				        type: 'png',
				        pixelRatio: 1,  //放大两倍下载，之后压缩到同等大小展示。解决生成图片在移动端模糊问题
				        backgroundColor: '#fff'
				    })
				    var $a = document.createElement('a');
				    $a.setAttribute("href", image);
				    $a.setAttribute("download", "echarts图片下载");
				    $a.click();
	      		}
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
		    // 千位分隔符
		    numFormat(num){
			  	var res=((num*100)/100).toFixed(2).toString().replace(/\d+/, function(n){ // 先提取整数部分
			       return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			          return $1+",";
			        });
			  	})
			  	return res;
			}
	    },
	    computed:{
	    	...mapState(['indicator','indicatorArr'])
	    },
	    watch:{
	    	isSecond(newVal,oldVal){
      			if(newVal == 5){
      				Bus.$on('compareData', (data) => {
		    			this.getEchart(5,this.options5,data.values)
				    })
      			}
      		}
	    }
	}
</script>

<style lang="scss">
#checkForm{
	-moz-user-select:none;/*火狐*/
  	-webkit-user-select:none;/*webkit浏览器*/
   	-ms-user-select:none;/*IE10*/
   	user-select:none;
	.myChart{
		width:100%;
		height:400px
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
	table tr:last-child td{
		border-bottom: none
	}
	.el-table::before{
		background-color: transparent!important
	}
	.el-form-item .el-form-item__content{
		display:inline-block;
		vertical-align:top
	}
	.el-form-item .el-form-item__content .el-select--mini{
		width:100%
	}
	.el-form--label-left .el-form-item__label{
		float:none
	}
	.el-form-item__label{
		padding:0 12px 0 0
	}
    .moreBtn,.detailBtn{
        color: #4285F4;
        padding: 0 2px;
    }
    .detailBtn:hover,.moreBtn:hover{
        cursor: pointer;
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
	.el-tabs__nav-wrap::after{
		background:none
	}
	.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover{
		box-shadow:none
	}
	.el-card{
		border-radius:none;
		border:1px solid #E9E9E9
	}
	.saveBtn,.saveBtn1{
		width: 68px;
		height: 26px;
		line-height: 1px;
		padding: 0;
		margin-top:3px;
		font-size: 12px;
	}
	.ratelist{
		cursor:pointer;
		color:#515151;
		margin-bottom:20px;
		ul{
			display:inline-block;
			vertical-align:top;
			width:auto;
			color:#4285F4;
			margin-left:10px;
			li{
				margin-bottom:5px
			}
		}
		.saveBtn{
			float:right;
			margin-right:10px;
			color:#4285F4;
			border:1px solid #4285F4;
			.iconfont{
				font-size:12px;
				-webkit-text-fill-color:#4285F4;
				-webkit-text-stroke: 0 #4285F4;
				margin-right:5px
			}
		}
		.saveBtn1{
			float:right;
			margin-right:10px;
			color:#FFF;
			background:#4285F4;
			.iconfont{
				font-size:12px;
				-webkit-text-fill-color:#fff;
				-webkit-text-stroke: 0 #fff;
				margin-right:5px
			}
		}
	}
	.redBg1,.yellowBg1,.blueBg1{
        display: inline-block;
        color: #fff;
        padding: 2px 10px;
        border-radius: 2px;
        background: #FF6363;
        word-break:normal;
    }
    .yellowBg1{
      background: #FFD824;
    }
    .blueBg1{
      background: #4285F4;
    }
	.warnTable .cell .redBg1,.warnTable .cell .yellowBg1,.warnTable .cell .blueBg1{
		word-break:break-all;
		margin-bottom:15px;
		overflow:hidden;
		-webkit-line-clamp: 2;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    /*! autoprefixer: off */
	    -webkit-box-orient: vertical;
	    /* autoprefixer: on */
    }
    .warnTable .cell p:last-child{
        margin-bottom:0
    }
    .objHeight{
    	height:32px;
		line-height:32px;
    }
}
</style>
