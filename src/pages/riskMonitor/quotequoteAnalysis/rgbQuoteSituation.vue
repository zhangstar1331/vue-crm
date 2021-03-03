<template>
  	<div id="rgbFbSituation">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<!--<el-breadcrumb-item class="txtColor">风险指标报表</el-breadcrumb-item>-->
		  	<el-breadcrumb-item class="txtColor">评价类指标分布情况</el-breadcrumb-item>
		</el-breadcrumb>
	  	<el-form :model="perForm" label-position="left" ref="perForm" size="mini" :inline="true">
				<div class="box">
					 <el-row>
	            <el-form-item label="评价期间">
					<el-date-picker v-model="batchFb" @change="getBatch" type="month" placeholder="请输入年月" :picker-options="endDatePicker"> </el-date-picker>
				</el-form-item>
				<el-form-item label="适用对象" lable-width="100px">
				    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
				    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="是否按指标等级分类" lable-width="100px">
				    <el-select v-model="quoteType.region" :disabled="isSelect || parseInt(this.checkData.subDate.substring(0,4))>=2020" @change="changeType" placeholder="请选择适用对象">
				    	<el-option v-for="item in quoteType.unitsData" :key="item.id" :label="item.level" :value="item.id"></el-option>
				    </el-select>
				</el-form-item>
				<el-button type="primary" @click="searchData" class="saveBtn">查询</el-button>
	        </el-row>
	        <div class="resultTitle">
			  		<el-row>
			  			<el-col :span='24'>
			  				<el-button type="primary" class="search" v-if="!shwoForm&&btnData.exportbtn" @click="goExport" :disabled="isBtn"><i class="iconfont iconxiazai"></i>下载</el-button>
			  				<el-button type="primary" class="search" v-if="shwoForm&&btnData.exportbtn" @click="exportData(1)" :disabled="isBtn">导出</el-button>
			  				<el-button type="primary" class="search" :disabled="isBtn" @click="changeForm"><i class="iconfont iconqiehuan"></i>切换</el-button>
			  				<p>评价类指标分布情况</p>
			  			</el-col>
			  			<el-col :span="0">
			  			</el-col>
			  		</el-row>
			  	</div>
			  	<!--评价类分布饼图-->
			  	<div id="main" v-show="!shwoForm" style="width: 600px;height:450px;margin:0 auto;"></div>
			  	<el-table :data="tableData1" v-if="shwoForm" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				  	<!--是否按指标等级分类为否的时候表格展示-->
			        <el-table-column prop="color" label="状态" align="center">
			        	<template slot-scope="scope">
			                <span style="background: #4285F4;padding:2px 30px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 3">蓝</span>
			    			<span style="background: #FFD824;padding:2px 30px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 2">黄</span>
			    			<span style="background: #FF6363;padding:2px 30px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 1">红</span>
			    			<span style="background: #fff;padding:2px 30px;color: #000;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 0">合计</span>
		                </template>
			        </el-table-column>
			        <el-table-column prop="number" v-if="noLevelForm" label="数量" align="center">
			        	<template slot-scope="scope">
			        		<p @click="showResultForm(scope.$index,scope.row)" v-if="btnData.detailbtn">{{scope.row.number}}</p>
			        		<p v-else>{{scope.row.number}}</p>
			        	</template>
			        </el-table-column>
		            <el-table-column prop="percen" v-if="noLevelForm" label="占比" align="center"> 
		            	<template slot-scope="scope">
		            		<span>{{scope.row.percen}}%</span>
		            	</template>
		            </el-table-column>
				  	<!--是否按指标等级分类为是的时候表格展示-->
			        <el-table-column prop="lv1" v-if="!noLevelForm" label="一类" align="center">
			        	<template slot-scope="scope">
			        		<p @click="showForm('1',scope.$index,scope.row)" v-if="btnData.detailbtn">{{scope.row.lv1}}%</p>
			        		<p v-else>{{scope.row.lv1}}%</p>
			        	</template>
			        </el-table-column>
			        <el-table-column prop="lv2" v-if="!noLevelForm" label="二类" align="center">
			        	<template slot-scope="scope">
			        		<p @click="showForm('2',scope.$index,scope.row)" v-if="btnData.detailbtn">{{scope.row.lv2}}%</p>
			        		<p v-else>{{scope.row.lv2}}%</p>
			        	</template>
			        </el-table-column>
		            <el-table-column prop="percen" v-if="!noLevelForm" label="合计" align="center"> 
		            	<template slot-scope="scope">
		            		<span>{{scope.row.percen}}%</span>
		            	</template>
		            </el-table-column>
			  	</el-table>
			  	
			  	<!--分布详情表格-->
			  	<div class="resultTitle" style="margin-top: 30px;" v-show="isShow">
			  		<el-row>
			  			<el-col :span='24'>
			  					<p style="font-size: 14px;">评价类指标分布情况详情表<el-button type="primary" class="search" @click="exportData(2)" v-if="btnData.detailexportbtn">导出</el-button></p>
			  			</el-col>
			  		</el-row>
			  	</div>
			  	<el-table :data="tableData" v-show="isShow" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
		        <el-table-column prop="code" label="编号" align="center" width="100" fixed>
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
		              <p v-for="(item,index) in (scope.row.compv)" class="comCss">{{item.value}} <em v-if="item.scope == 1" style="font-style: normal;">↑</em> <em v-if="item.scope == 0" style="font-style: normal;">↓</em> </p>
		            </template>
		          </el-table-column>
		          <el-table-column prop="momv" label="环比" align="center" width="120"> 
		          	<template slot-scope="scope">
		              <p v-for="(item,index) in (scope.row.momv)" class="comCss">{{item.value}} <em v-if="item.scope == 1" style="font-style: normal;">↑</em> <em v-if="item.scope == 0" style="font-style: normal;">↓</em> </p>
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
	                    <span :title="scope.row.caleName == null?scope.row.defins:scope.row.caleName+'/'+scope.row.defins" class='textOverFlow'>
	                    {{scope.row.caleName == null?scope.row.defins:scope.row.caleName+'&nbsp;/&nbsp;'+scope.row.defins}}
	                    </span>
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
		          <!--<el-table-column prop="prefv" label="容忍度" align="center"> </el-table-column>-->
		          <!--<el-table-column prop="limitv" label="限额" align="center"> </el-table-column>-->
		          <!--<el-table-column prop="objName" label="适用对象" width="120" align="center"> </el-table-column>
		          <el-table-column prop="depName" label="报送部门" width="120" align="center"> </el-table-column>-->
	            <el-table-column prop="hanndle" label="操作" align="center" width="100">
	              <template slot-scope="scope">
	                <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;">详情</span>
	              </template>
	            </el-table-column>
	  	</el-table>
		<el-pagination background v-show="isShow" layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
			</div>
    </el-form>
  	</div>
</template>
<script>
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import echarts from 'echarts'
	import qs from 'qs'
  export default {
  	props:[''],
  	data() {
      return {
      	currentPage:1,
      	isShow:false,
      	isSelect:true,
      	shwoForm:false,
      	noLevelForm:true,
      	isBtn:false,
      	isPic:1,
      	limitYear:false,
      	perForm:{
        		quoteName:''
        	},
        batchFb:'',	
        application:{
	          	region: '',
	          	unitsData:[]
	        },
	    quoteType:{
	          	region: '否',
	          	unitsData:[
	          	{
	          		level:'是',
	          		id:'1'
	          	},{
	          		level:'否',
	          		id:'0'
	          	}]
	        },    
        endDatePicker:this.processDate(),	
        checkData:{
        	subDate:null,
        	// objId:'',
        	isLevel:'0'
        },
        rgbCheck:{},//点击红花蓝饼图区域时候入参对象
        tableData4:[],
        tableData1:[],
        tableData:[],
        totalResults:0,
        btnData:{   //按钮显示隐藏
			exportbtn: false,
			detailbtn: false,
			detailexportbtn: false,
		},
        optionData:{
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b} : {d}%"
		    },
		    legend: {
		        orient: 'horizontal',
		        x:'center',
		        y:'bottom',
		        itemGap:10,
		        data: [
		        	{
		        		name:'蓝',
		        		textStyle: {fontWeight: 'bold', color: '#4285F4',background:'#4285F4'}
		        	},{
		        		name:'黄',
		        		textStyle: {fontWeight: 'bold', color: '#FFEB5B',background:'#FFEB5B'}
		        	},{
		        		name:'红',
		        		textStyle: {fontWeight: 'bold', color: '#FF6363',background:'#FF6363'}
		        	}
		        ]
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '60%',
		            center: ['50%', '50%'],
		            labelLine:{  
		                normal:{  
		                    length:30  
		                }  
		            },
		            data:[
//		                {value:30, name:'蓝',itemStyle:{color:"4285F4"}},
//		                {value:10, name:'黄',itemStyle:{color:"FFEB5B"}},
//		                {value:60, name:'红',itemStyle:{color:"FF6363"}},
		            ],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ],
		    label:{
                normal:{
                    // \n\n可让文字居于牵引线上方，很关键
                    //  {b}  代表显示的内容标题
                    // {c}代表数据
                    formatter: '{b}：{c}% \n\n'
	                }
	       },
		    color:[ //自定义的颜色
                '#4285F4',
                '#FFEB5B',
                '#FF6363',
            ]
		}
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
    created(){
    	this.initData()
    	this.isShow = false;
    	this.getData(this.$store.state.orgBtnData)
    },
    methods: {
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ihhlzbfbqke')>=0){//导出
            		this.btnData.exportbtn = true
            	}else{
            		this.btnData.exportbtn = false
            	}
            	if(handleData.indexOf('1_ihhlzbfbqkd')>=0){//导出
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            	if(handleData.indexOf('1_ihhlzbfbqde')>=0){//导出
            		this.btnData.detailexportbtn = true
            	}else{
            		this.btnData.detailexportbtn = false
            	}
            }
	    },
    	getListDataDetail(data){
    		this.axios.post('rmIndStass/indReportRybInfo',qs.stringify(data)).then((res)=>{
	            if(res.code == 200){
	              if(res.data != null){
	              	if(res.data.instats){
						for (var i = 0; i < res.data.instats.length; i++) {
							res.data.instats[i].value = eval("("+res.data.instats[i].value+")")
							res.data.instats[i].momv = eval("("+res.data.instats[i].momv+")")
							res.data.instats[i].compv = eval("("+res.data.instats[i].compv+")")
						}
					}
	              	this.tableData = res.data.instats
	              	this.totalResults = res.data.total
	              }
	            }else{
	                this.$alert(res.message, '提示', {
	                  confirmButtonText: '确定'
	                })
	            }
	        })
    	},
    	getListData(data){
    		this.axios.post('rmIndStass/rybMonrPercen',qs.stringify(data)).then((res)=>{
            if(res.code == 200){
              if(res.data != null){
              	this.optionData.series[0].data = [];
              	if(this.checkData.isLevel == '0'){
              		//是否按等级分类为否的情况
              		this.optionData.color = ['#4285F4', '#FFEB5B', '#FF6363']
              		for (var i = 0; i < res.data.length-1; i++) {
              			var obj = new Object()
              			obj.value = (res.data[i].percen*100).toFixed(2);
              			if(res.data[i].color == '3'){
              				obj.name = '蓝'
              				obj.itemStyle = {'color':'4285F4'}
              			}else if(res.data[i].color == '2'){
              				obj.name = '黄'
              				obj.itemStyle = {'color':'FFEB5B'}
              			}else{
              				obj.name = '红'
              				obj.itemStyle = {'color':'FF6363'}
              			}
              			this.optionData.series[0].data.push(obj)
              			res.data[i].percen = (res.data[i].percen*100).toFixed(2)
              		}
              		res.data[res.data.length-1].percen = (res.data[res.data.length-1].percen*100).toFixed(2)
              		//表格赋值
              		this.noLevelForm = true
              		this.tableData1 = []
              		this.tableData1 = res.data
              	}else{
              		//是否按等级分类为是的情况
              		this.optionData.legend.data = [];
              		this.optionData.color = ['#4285F4','#55CBFF','#FFD824','#FF954D','#FF6363','#FF60AC']
              		for (var i = 0; i < res.data.length-1; i++) {
              			if(res.data[i].color == '3'){
              				for (var j = 1; j < 3; j++) {
              					var obj = new Object()
              					var objLen = new Object()
              					if(j == '1'){
              						obj.value = (res.data[i].lv1*100).toFixed(2);
              						obj.name = '蓝一类'
              						obj.itemStyle = {'color':'4285F4'}
              						objLen.name="蓝一类"
              						objLen.textStyle = {fontWeight: 'bold', color: '#4285F4',background:'#4285F4'}
              					}else{
              						obj.value = (res.data[i].lv2*100).toFixed(2);
              						obj.name = '蓝二类'	
									obj.itemStyle = {'color':'55CBFF'}
									objLen.name="蓝二类"
									objLen.textStyle = {fontWeight: 'bold', color: '#55CBFF',background:'#55CBFF'}
              					}
              					this.optionData.legend.data.push(objLen)
              					this.optionData.series[0].data.push(obj)
              				}
              			}else if(res.data[i].color == '2'){
              				for (var k = 1; k < 3; k++) {
              					var obj = new Object()
              					var objLen = new Object()
              					if(k == '1'){
              						obj.value = (res.data[i].lv1*100).toFixed(2);
              						obj.name = '黄一类'
              						obj.itemStyle = {'color':'FFD824'}
              						objLen.name = '黄一类'
              						objLen.textStyle = {fontWeight: 'bold', color: '#FFD824',background:'#FFD824'}
              					}else{
              						obj.value = (res.data[i].lv2*100).toFixed(2);
              						obj.name = '黄二类'
              						obj.itemStyle = {'color':'FF954D'}
              						objLen.name = '黄二类'
              						objLen.textStyle = {fontWeight: 'bold', color: '#FF954D',background:'#FF954D'}
              					}
              					this.optionData.series[0].data.push(obj)
              					this.optionData.legend.data.push(objLen)
              				}
              			}else{
              				for (var m = 1; m < 3; m++) {
              					var obj = new Object()
              					var objLen = new Object()
              					if(m == '1'){
              						obj.value = (res.data[i].lv1*100).toFixed(2);
              						obj.name = '红一类'
              						obj.itemStyle = {'color':'FF6363'}
              						objLen.name = '红一类'
              						objLen.textStyle = {fontWeight: 'bold', color: '#FF6363',background:'#FF6363'}
              					}else{
              						obj.value = (res.data[i].lv2*100).toFixed(2);
              						obj.name = '红二类'	
									obj.itemStyle = {'color':'FF60AC'}
									objLen.name = '红二类'
									objLen.textStyle = {fontWeight: 'bold', color: '#FF60AC',background:'#FF60AC'}
              					}
              					this.optionData.series[0].data.push(obj)
              					this.optionData.legend.data.push(objLen)
              				}
              			}
              		}
              		//表格赋值
              		this.tableData1 = []
              		this.noLevelForm = false
              		for (var i = 0; i < res.data.length; i++) {
              			res.data[i].lv1 = (res.data[i].lv1*100).toFixed(2) 
              			res.data[i].lv2 = (res.data[i].lv2*100).toFixed(2)
              			res.data[i].percen = (res.data[i].percen*100).toFixed(2)
              		}
              		this.tableData1 = res.data
              	}
              	//处理饼图初始化数据
		    	this.$nextTick(()=>{
		    		var myChart = echarts.init(document.getElementById('main'));
		    		myChart.setOption(this.optionData);
		    		myChart.off('click');
		    		myChart.on('click', (params) =>{
		    			if(this.btnData.detailbtn){
			    			this.isShow = true;
			    			if(this.checkData.isLevel == 0){
			    				if(this.rgbCheck.indLevel){
			    					delete this.rgbCheck.indLevel
			    				}
			    				if(params.name == '蓝'){
			    					this.rgbCheck.rybStatus = 3
				    			}else if(params.name == '黄'){
				    				this.rgbCheck.rybStatus = 2
				    			}else{
				    				this.rgbCheck.rybStatus = 1
				    			}
			    			}else{
				    			if(params.name == '蓝一类'){
			    					this.rgbCheck.rybStatus = 3
			    					this.rgbCheck.indLevel = 1
				    			}else if(params.name == '蓝二类'){
				    				this.rgbCheck.rybStatus = 3
			    					this.rgbCheck.indLevel = 2
				    			}else if(params.name == '黄一类'){
				    				this.rgbCheck.rybStatus = 2
				    				this.rgbCheck.indLevel = 1
				    			}else if(params.name == '黄二类'){
				    				this.rgbCheck.rybStatus = 2
				    				this.rgbCheck.indLevel = 2
				    			}else if(params.name == '红一类'){
				    				this.rgbCheck.rybStatus = 1
				    				this.rgbCheck.indLevel = 1
				    			}else{
				    				this.rgbCheck.rybStatus = 1
				    				this.rgbCheck.indLevel = 2
				    			}
			    			}
			    			this.rgbCheck.submissionDate = this.checkData.subDate;
			    			this.rgbCheck.objectId = this.checkData.objId;
			    			this.rgbCheck.pageNum = 1;
			    			this.rgbCheck.pageSize = 10;
			    			this.getListDataDetail(this.rgbCheck)
		    			}
					});
		    	})
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
    	},
	  initData(){
	  		if(this.checkData.subDate == null){
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
		    	this.batchFb = year + '-' + month
		    	this.checkData.subDate = year + '' + month
	  		}
	    	//获取适用对象
	    	this.axios.post('rmIndStass/repOptInfo',).then((res)=>{
		   			if(res.code == 200){
		   				// 适用对象
			   			this.$set(this.application,'unitsData',res.data.objects)
			   			if(res.data.objects.length>0){
			   				this.$set(this.application,'region',res.data.objects[0].name)
			   				this.$set(this.checkData,'objId',res.data.objects[0].id)
			   			}
			   			this.getListData(this.checkData)
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
	    	//评价类结果分布入参处理
	    	sessionStorage.setItem('checkData',JSON.stringify(this.checkData))
		},
	  handleSizeChange (value) {
	  	let checkData = JSON.parse(sessionStorage.getItem('checkData'))
	  			this.rgbCheck.pageNum = value;
				this.getListDataDetail(this.rgbCheck)
	  },
	  handleCurrentChange (value) {
	  			this.rgbCheck.pageNum = value;
				this.getListDataDetail(this.rgbCheck)
	    //下一页请求数据
	  },
	  	getBatch(val){
	  			this.isBtn = true
		    	if(val != null){
		  			this.checkData.subDate = formatDate(val,'yyyy-MM');
		  			this.checkData.subDate = this.checkData.subDate.split('-').join('')
		  			sessionStorage.setItem('checkData',JSON.stringify(this.checkData))
		  			if(parseInt(this.checkData.subDate.substring(0,4))>=2020){
						this.quoteType.region = '否'
						this.checkData.isLevel = '0'
		      		}
		  		}else{
		  			this.checkData.subDate = '';
		  		}
			},
	  	showForm(level,index,row){
	  		this.isShow = true
	  		let checkData = JSON.parse(sessionStorage.getItem('checkData'))
	  		checkData.rybStatus = row.color
	  		checkData.indLevel = level
	  		checkData.submissionDate = checkData.subDate
	  		delete checkData.subDate
	  		delete checkData.objId
	  		checkData.objectId = this.checkData.objId
	  		checkData.pageNum = '1'
	  		checkData.pageSize = '10'
	  		if(row.rybStatus != 0){
	  			sessionStorage.setItem('checkData',JSON.stringify(checkData))
	  			this.getListDataDetail(checkData)
	  		}
	  	},
	  	//评价类指标分布情况表格
	  	showResultForm(index,row){
	  		this.rgbCheck = {}
	  		if(row.color == '3'){
				this.rgbCheck.rybStatus = 3
			}else if(row.color == '2'){
				this.rgbCheck.rybStatus = 2
			}else if(row.color == '1'){
				this.rgbCheck.rybStatus = 1
			}else{
				return;
			}
			this.rgbCheck.submissionDate = this.checkData.subDate;
			this.rgbCheck.objectId = this.checkData.objId;
			if(this.checkData.isLevel == '1'){
				this.rgbCheck.indLevel = this.checkData.isLevel;
			}
			this.rgbCheck.pageNum = 1;
			this.rgbCheck.pageSize = 10;
			this.isShow = true;
			this.getListDataDetail(this.rgbCheck)
	  	},
	  	changeApply(val){
			this.checkData.objId = val
			if(val != '101'){
				this.isBtn = true
				this.isSelect = false
			}else{
				this.isBtn = false
				this.isSelect = true
				this.quoteType.region = '否'
				this.checkData.isLevel = '0'
			}
			sessionStorage.setItem('checkData',JSON.stringify(this.checkData))
		},
		changeType(val){
				this.isBtn = true
		  		this.checkData.isLevel = val
		},
	  	processDate(){
	        return {
	          disabledDate(time){
	            return time.getTime() > new Date(new Date().getFullYear()+'-'+new Date().getMonth()+'-01').getTime()//开始时间不选时，结束时间最大值小于等于当天
	          }
	        }
	     },
	    searchData(){
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
			
	    	this.isShow = false
	    	this.shwoForm = false
	    	this.isBtn = false
	    	this.getListData(this.checkData)
	    },
	    changeForm(){
	    	this.isShow = false;
	    	this.shwoForm = !this.shwoForm;
	    	// this.initData();
	    	this.getListData(this.checkData)
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
	    },
	    goExport(){
			// 图片
			var myChart = echarts.init(document.getElementById('main'));
		    var image = myChart.getDataURL({
		        type: 'png',
		        pixelRatio: 1,  //放大两倍下载，之后压缩到同等大小展示。解决生成图片在移动端模糊问题
		        backgroundColor: '#fff'
		    })
		    var $a = document.createElement('a');
		    $a.setAttribute("href", image);
		    $a.setAttribute("download", "echarts图片下载");
		    $a.click();
		},
		exportData(type){
			if(type == '1'){
	      		this.axios.post('rmIndStass/rybMonrPercenExport',qs.stringify(this.checkData),{responseType:'arraybuffer'}).then((res)=>{
		            let filename = "评价类指标分布情况.xlsx";
	              	this.fileDownload(res, filename);
		        })
			}else{
				var page = this.rgbCheck.pageNum;
				delete this.rgbCheck.pageNum;
				delete this.rgbCheck.pageSize;
				this.axios.post('rmIndStass/indRybDetailExport',qs.stringify(this.rgbCheck),{responseType:'arraybuffer'}).then((res)=>{
					this.rgbCheck.pageNum = page;
					this.rgbCheck.pageSize = '10';
		            let filename = "评价类指标分布情况详情表.xlsx";
	              	this.fileDownload(res, filename);
		        })
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
	    }
    }
  }
</script>
<style lang="scss">
#rgbFbSituation .cell:hover{
	cursor: pointer;
}	
#rgbFbSituation .textOverFlow{
	width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
#rgbFbSituation .el-table__body-wrapper{
		background: #fff;
	}
#rgbFbSituation 	.el-pagination{
		text-align: center;
		padding-bottom: 50px;
		border: 0;
		margin-top: 20px;
	}
#rgbFbSituation 	.el-table::before{
		height:0;
	}
#rgbFbSituation 	.el-table th{
		background: #f9f9f9;
		text-align: center;
	}
#rgbFbSituation .el-dropdown {
	    vertical-align: top;
	  }
#rgbFbSituation .el-dropdown + .el-dropdown {
	    margin-left: 15px;
	  }
#rgbFbSituation .el-icon-arrow-down {
	    font-size: 12px;
	 }
#rgbFbSituation .box{
		min-height: 180px;
    background: #fff;
    padding: 16px 16px 100px 16px;
    -webkit-box-shadow: 4px 2px 6px #888;
    margin-top: 2px;
    border-radius: 8px;
}	 
#rgbFbSituation{
	.resultTitle{
		height: 40px;
		line-height:40px;
		background:#e9e9e9;
		p{
			line-height: 40px;
			text-indent: 44%;
		}
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-right: 5px;
	    padding:0;
		font-size: 12px;
		margin-top: 8.5px;
	}
	.redBg p,.yellowBg p,.blueBg p{
	    	display: inline-block;
			color: #fff;
			padding: 2px 10px;
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
		.el-breadcrumb__inner{
	    	color: #4285F4!important;
	    	font-weight: 700!important;
	    }
	    .saveBtn{
			width: 68px;
			height: 26px;
			line-height: 1px;
			padding: 0;
			font-size: 12px;
		}
		.iconfont{
	    	font-size:12px;
			-webkit-text-fill-color:#FFF;
			-webkit-text-stroke: 0 #FFF;
			margin-right:5px
	    }
	} 
</style>
