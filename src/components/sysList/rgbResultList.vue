<template>
  <div id="analysisList">
  	<el-form :model="perForm" label-position="left" ref="perForm" size="mini" :inline="true">
		  	<div class="box">
					 <el-row>
		          <el-form-item label="评价期间">
							    <el-select v-model="fxTime.region" @change="changeTime" placeholder="请选择年份">
							    	<el-option v-for="item in fxTime.unitsData" :key="item.code" :label="item.name" :value="item.code"> </el-option>
							    </el-select>
							    <el-select v-model="fxSeason.season" @change="changeSeason" placeholder="请选择月份">
							    	<el-option v-for="item in fxSeason.unitsData" :key="item.code" :label="item.name" :value="item.code"> </el-option>
							    </el-select>
							</el-form-item>
							<el-button type="primary" @click="searchData" class="saveBtn">查询</el-button>
							<el-button type="primary" @click="exportData" class="saveBtn" :disabled="isBtn" v-if="btnData.exportbtn">导出</el-button>
			    </el-row>
			  	<el-table :data="tableData4" :span-method="objectSpanMethod" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				    <el-table-column prop="outFileNo" align="center" width="240" label="评价标准" > 
				    	<div style="text-align: left;font-size: 14px;" v-if="limitYear&&limitYear<2020">
					    	<p>一、正常类</p>
					    	<p style="margin-bottom: 10px;">一类、二类指标中红、黄区指标占比＜40%，经营管理存在较低风险</p>
					    	<p>二、关注类</p>
					    	<p style="margin-bottom: 10px;">一类、二类指标中红、黄区指标占比≥40%</p>
					    	<p>三、高度关注类</p>
					    	<p>一类指标中红区指标占比≥60% 或偿付能力充足率≤120% 或分类监管评级为D级 或综合成本率≥103%</p>
				    	</div>
				    	<div style="text-align: left;font-size: 14px;" v-else>
					    	<p>一、正常类</p>
					    	<p style="margin-bottom: 10px;">评价类指标中红区和黄区指标合计占比＜40%</p>
					    	<p>二、关注类</p>
					    	<p style="margin-bottom: 10px;">评价类指标中红区和黄区指标合计占比≥40%，且未达到高度关注类</p>
					    	<p>三、高度关注类</p>
					    	<p>
								评价类指标中红区指标占比≥60%<br>
								或偿付能力充足率≤120%<br>
								或分类监管评级为D级<br>
								或综合成本率≥103%
							</p>
				    	</div>
				    </el-table-column>
				    <el-table-column  prop="objName" align="center" label="评价对象" > </el-table-column>
				    <el-table-column prop="" align="center" label="判断依据" > 
				    	<el-table-column prop="ryaValue" align="center" label="一、二类指标中红、黄区指标占比" v-if="limitYear&&limitYear<2020" width="230"> </el-table-column>
				    	<el-table-column prop="ryaValue" align="center" label="评价类指标中红区和黄区指标合计占比" v-else width="230"> </el-table-column>
				    	<el-table-column prop="roValue" align="center" label="一类指标中红区指标占比" v-if="limitYear&&limitYear<2020"> </el-table-column>
				    	<el-table-column prop="roValue" align="center" label="评价类指标中红区指标占比" v-else> </el-table-column>
				    	<el-table-column prop="cause,result" align="center" label="其他" > 
				    	<template slot-scope="scope">
				    		<p v-if="scope.row.result == 1"> -- </p>
				    		<p v-for="item in scope.row.cause">
				    				{{item}}
				    		</p>
				    	</template>
				    </el-table-column>
				    </el-table-column>
				    <el-table-column prop="result" align="center" label="评价结果" >
				    	<template slot-scope="scope">
				    			<span style="background: #4285F4;padding:2px 20px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.result == 1">正常类</span>
				    			<span style="background: #FF6363;padding:2px 20px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.result == 2">关注类</span>
				    			<span style="background: #FF6363;padding:2px 20px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.result == 3">高度关注类</span>
				    	</template>
				    </el-table-column>
			  	</el-table>
				</div>
		</el-form>
  </div>
</template>

<script>
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import Bus from 'src/bus/bus.js'
	import qs from 'qs'
  export default {
  	data() {
      return {
      	currentPage:1,
        tableData4:[],
        totalResults:0,
        batch:'',
        colLenth:0,
        flag:0,
        isBtn:false,
        perForm:{
        		quoteName:''
        	},
        fxTime: {
	        time: '',
	        region:null,
	        unitsData:[]
	      },
	      fxSeason:{
	      	season:null,
	      	unitsData:[
		      	{
		      		name:'03',
		      		code:'03'
		      	},{
		      		name:'06',
		      		code:'06'
		      	},{
		      		name:'09',
		      		code:'09'
		      	},{
		      		name:'12',
		      		code:'12'
		      	}
	      	]
	      },
        endDatePicker:this.processDate(),
        checkData:{
        	subDate:null
        },
        btnData:{   //按钮显示隐藏
			exportbtn: false
		},
		limitYear:null
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
    	this.getData(this.$store.state.orgBtnData)
    },
    methods: {
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ihhlzbjcpjjge')>=0){//导出
            		this.btnData.exportbtn = true
            	}else{
            		this.btnData.exportbtn = false
            	}
            }
	    },
    	getListData(data){
	    	if(this.checkData.subDate == ''){
					this.$alert('查询时间不能为空', '提示', {
	                  confirmButtonText: '确定'
	                })
	                return
					}
    		this.axios.post('rmIndStass/rybMonrAssess',qs.stringify(data)).then((res)=>{
            if(res.code == 200){
              if(res.data != null){
              	this.tableData4 = res.data
              	this.colLenth = res.data.length
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
    	},
    	getYear(){
	      	var date = new Date();
		 			var year= date.getFullYear()
		 			var yearSize =  year - 2016;
		 			var timeYear2 = year + '-04-25'
		 			//获取当前时间
		    	var month = date.getMonth()+1;
		    	var day = date.getDate()
		    	if(day < 9){
		    		day = '0'+day
		    	}
		    	var nowTime = new Date(year+ '-' + month + '-' + day);
		 			for (var i = 0; i <= yearSize; i++) {
		 				var obj = new Object();
		 				obj.name = year - i;
		 				obj.code = year - i;
		 				this.fxTime.unitsData.push(obj)
		 			}
		 			if(nowTime < new Date(timeYear2)){
		 				this.fxTime.unitsData.pop()
		 			}
	      },
	    calculateMonth(nowVal){
	    	var date = new Date();
	    	var year = date.getFullYear()
	    	var timeYear4 = year +'-10-25'
	    	var timeYear3 = year + '-07-25'
	    	var timeYear2 = year + '-04-25'
	    	var timeYear1 = year +'-01-25'
	    	var timeNode4 = new Date(timeYear3)
	    	var timeNode3 = new Date(timeYear3)
	    	var timeNode2 = new Date(timeYear2)
	    	var timeNode1 = new Date(timeYear1)
	    	//获取当前时间
	    	var month = date.getMonth()+1;
	    	var day = date.getDate()
	    	if(day < 9){
	    		day = '0'+day
	    	}
	    	var nowTime = new Date(year+ '-' + month + '-' + day);
	    	//时间对比
	    	//1-25
	    	if(nowTime <= timeNode1){
	    		this.checkData.subDate = (year-1) + '09'
	    		this.fxTime.region = (year-1)
	    		this.fxSeason.season = '09'
	    		this.fxSeason.unitsData = []
	    		this.fxSeason.unitsData.push(
	    			{
	    				name:'03',
		      		code:'03'
	    			},{
	    				name:'06',
		      		code:'06'
	    			},{
	    				name:'09',
		      		code:'09'
	    			}
	    		)
	    	}else if(timeNode1 < nowTime && nowTime <= timeNode2 || nowVal < year){
	    		this.checkData.subDate = (year-1) + '12'
	    		this.fxTime.region = (year-1)
	    		this.fxSeason.season = '12'
	    		this.fxSeason.unitsData = []
	    		this.fxSeason.unitsData.push(
	    			{
	    				name:'03',
		      		code:'03'
	    			},{
	    				name:'06',
		      		code:'06'
	    			},{
	    				name:'09',
		      		code:'09'
	    			},{
	    				name:'12',
		      		code:'12'
	    			}
	    		)
	    		return;
	    	}
	    	//4-25
	    	if(timeNode2< nowTime && nowTime <= timeNode3){
	    		this.fxSeason.unitsData = []
	    		this.fxSeason.unitsData.push({
	    				name:'03',
		      		code:'03'
	    		})
	    		this.fxTime.region = year
	    		this.fxSeason.season = '03'
	    		this.checkData.subDate = year + '03'
	    	}
	    	//7-25
	    	if(timeNode3< nowTime && nowTime <= timeNode4){
	    		this.fxSeason.unitsData = []
	    		this.fxSeason.unitsData.push(
	    			{
	    				name:'03',
		      		code:'03'
	    			},{
	    				name:'06',
		      		code:'06'
	    			})
	    		this.fxTime.region = year
	    		this.fxSeason.season = '06'
	    		this.checkData.subDate = year + '06'
	    	}
	    	//10-25
	    	if(timeNode4< nowTime){
	    		this.fxSeason.unitsData = []
	    		this.fxSeason.unitsData.push(
	    			{
	    				name:'03',
		      		code:'03'
	    			},{
	    				name:'06',
		      		code:'06'
	    			},{
	    				name:'09',
		      		code:'09'
	    			}
	    		)
	    		this.fxTime.region = year
	    		this.fxSeason.season = '09'
	    		this.checkData.subDate = year + '09'
	    	}
	    },
    	searchData(){
    		this.checkData.subDate = this.fxTime.region + '' + this.fxSeason.season
    		this.limitYear = this.fxTime.region
    		this.isBtn = false
    		this.getListData(this.checkData)
    	},
    	exportData(){
	      		this.axios.post('rmIndStass/rybMonrAssessExport',qs.stringify(this.checkData),{responseType:'arraybuffer'}).then((res)=>{
		            let filename = "风险监测评价结果.xlsx";
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
    	initData(){
	    	this.calculateMonth();
	    	this.getYear();
	    	this.getListData(this.checkData)
    	},
			changeTime(val){
				this.isBtn = true
				var date = new Date();
	    	var year = date.getFullYear()
				if(val >= (year-1)){
					this.calculateMonth(val)
				}else{
					this.fxSeason.unitsData = []
					this.fxSeason.unitsData.push(
	    			{
	    				name:'03',
		      		code:'03'
	    			},{
	    				name:'06',
		      		code:'06'
	    			},{
	    				name:'09',
		      		code:'09'
	    			},{
	    				name:'12',
		      		code:'12'
	    			}
	    		)
				}
				this.fxTime.region = val
	    },
	    changeSeason(val){
	    	this.isBtn = true
	    	this.fxSeason.season = val
	    },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: this.colLenth,
              colspan: 1
            };
          }else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      processDate(){
	        return {
	          disabledDate(time){
	            return time.getTime() > new Date(new Date().getFullYear()+'-'+new Date().getMonth()+'-01').getTime()//开始时间不选时，结束时间最大值小于等于当天
	          }
	        }
	      }
    }
  }
</script>
<style lang="css">
</style>
<style lang="scss">
	#sysL .el-pagination button, .el-pagination span:not([class*=suffix]){
		padding:0 5px;
		font-size: 12px;
	}	
	#analysisList .el-table::before{
		height:0;
	}
	#analysisList .el-table th.gutter{
	    display: table-cell!important;
	}
</style>
