<template>
  	<div id="risyHotPic">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor">风险指标分析</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">风险热力图</span></div>
    		<el-form :model="hotForm" label-position="left" ref="hotForm" size="mini" :inline="true">
	            <el-row>
	            	<el-form-item label="评价年份">
					   <el-date-picker v-model="subDate" @change="changeYear" type="year" placeholder="时间" :picker-options="endDatePicker"></el-date-picker>
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
    			<div class="resultTitle">
    				<p>
						风险热力图
						<el-button type="primary" class="saveBtn" @click="goExport" :disabled="isBtn" v-if="btnData.downbtn"><i class="iconfont iconxiazai"></i>下载</el-button> 
					</p>
    			</div>
		        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" :row-class-name="tableRowClassName">
		           	<el-table-column prop="catName" label="风险分类" align="center" width="150">
		            	<template slot-scope="scope">
			              <span>{{scope.row.catName == null?'--':scope.row.catName}}</span>
			            </template>
		            </el-table-column>
		            <el-table-column prop="catId" v-for="(item,index) in quoteMonth" :key="index" :label="item" align="center" style="padding:0">
			            <template slot-scope="scope">
		            		<div :class="{'redBg':scope.row['t'+item].color == 1,'yellowBg':scope.row['t'+item].color == 2,'blueBg':scope.row['t'+item].color == 3,'noBg':scope.row['t'+item].color == undefined}" @click="goForm(item,scope.$index,scope.row)" v-if="scope.row['t'+item]&&btnData.detailbtn">
		            			{{scope.row['t'+item].num}}
		            		</div>
		            		<div :class="{'redBg':scope.row['t'+item].color == 1,'yellowBg':scope.row['t'+item].color == 2,'blueBg':scope.row['t'+item].color == 3,'noBg':scope.row['t'+item].color == undefined}" v-if="scope.row['t'+item]&&!btnData.detailbtn">
		            			{{scope.row['t'+item].num}}
		            		</div>
			            </template>
		            </el-table-column>
		        </el-table>
				<p class="tip">
					注：<br>
					①数量统计口径：评价类指标中预警级别为红和黄的指标数量。<br>
					②热力图渲染规则：红黄指标数量为0时，渲染为蓝色；红黄指标数量占风险分类中指标总数小于或者等于50%时，黄色；红黄指标数量占风险分类中指标总数超过50%时，红色。
				</p>
	      </div>
	      <div v-if="isShow">
	      		<div class="resultTitle">
    				<p>
						风险热力图详情表
						<el-button type="primary" class="saveBtn" @click="goExport1" v-if="btnData.detailDownbtn"><i class="iconfont iconxiazai"></i>下载</el-button> 
					</p>
    			</div>
	      		<el-table :data="tableData1" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9">
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
			            	<p :title="item" v-for="item in JSON.parse(scope.row.value)" :class="{'redBg':scope.row.rybStatus == 1,'yellowBg':scope.row.rybStatus == 2,'blueBg':scope.row.rybStatus == 3}">{{item}}</p>
			            </template>
			        </el-table-column>
		            <el-table-column prop="compv" label="同比" align="center" width="120">
		                <template slot-scope="scope">
		                    <p v-for="item in JSON.parse(scope.row.compv)">
		                      	{{item.value}}
		                      	<em v-if="item.scope == 1" style="font-style: normal;">↑</em>
                        		<em v-if="item.scope == 0" style="font-style: normal;">↓</em>
		                    </p>
		                </template>
		            </el-table-column>
		            <el-table-column prop="momv" label="环比" align="center" width="120">
		                <template slot-scope="scope">
		                    <p v-for="item in JSON.parse(scope.row.momv)">
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
		            <el-table-column prop="level" v-if="limitYear&&limitYear<2020" label="指标等级" align="center" width="120"> 
		            	<template slot-scope="scope">
		                  <span>{{ scope.row.level == '1'?'一类':scope.row.level == '2'?'二类':'--' }}</span>
		                </template>
		            </el-table-column>
		            <el-table-column prop="caleName" label="指标定义及口径" width="250">
		                <template slot-scope="scope">
		                    <span :title="scope.row.caleName == null?scope.row.defins:scope.row.caleName+'&nbsp;/&nbsp;'+scope.row.defins" class="textOverFlow">
	                        	{{scope.row.caleName == null?scope.row.defins:scope.row.caleName+'&nbsp;/&nbsp;'+scope.row.defins}}
	                        </span>
		                </template>
		            </el-table-column>
		            <el-table-column prop="isryb" v-if="limitYear&&limitYear<2020" label="是否评价类" align="center" width="120">
		                <template slot-scope="scope">
		                    <span v-if="scope.row.isryb == undefined||scope.row.isryb == '0'">否</span>
		                    <span v-if="scope.row.isryb == '1'">是</span>
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
		            <el-table-column prop="objName" label="适用对象" align="center" width="150"></el-table-column>
            		<el-table-column prop="depName" label="报送部门" align="center" width="120"></el-table-column>
		            <el-table-column prop="hanndle" label="操作" align="center" width="100">
		            	<template slot-scope="scope">
		                	<span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;">详情</span>
		            	</template>
		            </el-table-column>
		        </el-table>
		        <el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
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
        	isShow:false,
        	titMsg:"风险热力图",
        	hotForm:{},
        	isBtn:false,
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
    		currentPage:1,
    		totalResults:0,
    		subDate:'',
    		endDatePicker:this.processDate(),
          	checkData:{//查询数据
	            subDate:null,
	            // objId:null,
	            freqy:2
          	},
          	listCheckData:{
          		submissionDate: null,
	            objectId: 102,
	            frequency: 1,
	            catId: '',
	            pageNum: 1,
	            pageSize: 10
          	},
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度'
	        },
	        quoteMonth:[],
	        btnData:{   //按钮显示隐藏
  				downbtn: false,
  				detailbtn: false,
  				detailDownbtn: false,
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
    	this.getData(this.$store.state.orgBtnData)
    	var date = new Date
    	var year = date.getFullYear()
    	this.subDate = year + ''
    	this.checkData.subDate = (year + '')/1
    	this.quoteMonth = []
    	// 获取适用对象
    	this.getCommon()
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ifxrlte')>=0){//下载
            		this.btnData.downbtn = true
            	}else{
            		this.btnData.downbtn = false
            	}
            	if(handleData.indexOf('1_ifxrltd')>=0){//查看详情
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            	if(handleData.indexOf('1_ifxrltde')>=0){//详情下载
            		this.btnData.detailDownbtn = true
            	}else{
            		this.btnData.detailDownbtn = false
            	}
            }
	    },
    	tableRowClassName({ row }) {
		  if (row.status !== 0) {
		    return 'colorBg';
		  }
		  return '';
		},
    	changeYear(val){
    		this.isBtn = true
    		if(val != null){
    			this.checkData.subDate = formatDate(val,'yyyy')
    		}else{
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
	            return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
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
	   				// company.splice(0,1)
	   				// 适用对象
		   			this.$set(this.application,'unitsData',company)
		   			if(company.length>0){
		   				this.$set(this.application,'region',company[0].name)
		   				this.$set(this.checkData,'objId',company[0].id)
		   			}
		   			// 获取列表数据
    				this.searchData(this.checkData)
				} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
        		}
    		})
      	},
      	// 查询列表数据
    	searchData(data){
    		this.quoteMonth = []
    		var date = new Date(this.subDate)
			var year = date.getFullYear()
			for(var i= 1;i<=12;i++){
	    		if (i >= 1 && i <= 9) {
		            i = "0" + i;
		        }
	    		this.quoteMonth.push(date.getFullYear() + '' + i)
	    	}
    		this.axios.post('rmIndStass/rybIndStatsHeatMap',qs.stringify(data)).then((res)=>{
    			if(res.code == '200'){
	        		this.tableData = res.data==''?[]:res.data
	        		if(res.data !== null){
		        		for(var i = 0;i<res.data.length;i++){
		        			for(var j = 0;j<this.quoteMonth.length;j++){
		        				if(this.tableData[i]['t'+this.quoteMonth[j]]!==undefined){
		        					this.tableData[i]['t'+this.quoteMonth[j]].num = JSON.parse(this.tableData[i]['t'+this.quoteMonth[j]].num)
		        				} else{
		        					this.tableData[i]['t'+this.quoteMonth[j]] = {}
		        					this.tableData[i]['t'+this.quoteMonth[j]].num = '--'
		        				}
		        			}	
		        		}
	        		}
        		} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        });
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
			this.limitYear = parseInt(this.checkData.subDate)
	    	this.isShow = false
	    	this.tableData1 = []
	    	this.checkData.pageNum = 1
			this.currentPage = 1
			this.isBtn = false
			this.searchData(this.checkData)
		},
		// 详情
    	goForm(item,index,row){
    		this.isShow = true
    		this.listCheckData.submissionDate = item
	        this.listCheckData.objectId = this.checkData.objId
	        this.listCheckData.frequency = this.checkData.freqy
	        this.listCheckData.catId = row.catId
	        this.listCheckData.pageNum = 1
	        this.listCheckData.pageSize = 10
	        this.currentPage = 1
    		this.searchListData(this.listCheckData)
    	},
    	searchListData(data){
	    	this.axios.post('rmIndStass/indReportRybInfo',qs.stringify(data)).then((res)=>{
				if(res.code == '200'){
					if(res.data != null){
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
	    // 详情
	    goDetail(index,row){
	        this.$router.push({
	            path:'/checkForm',   //跳转的路径
	            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	              	indId:row.id,
	              	subDateEnd:this.checkData.subDate+'01',
					id: this.$route.query.id
	            }
	         })
	    },
	    // 导出按钮
		goExport(){
			this.axios.post('/rmIndStass/rybIndStatsHeatMapExport',qs.stringify(this.checkData),{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "风险热力图.xlsx";
              	this.fileDownload(res, filename);
    		})
		},
		goExport1(){
			delete this.listCheckData.pageNum
			delete this.listCheckData.pageSize
			this.axios.post('/rmIndStass/indHeatMapDetailExport',qs.stringify(this.listCheckData),{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "风险热力图详情表.xlsx";
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
	    handleSizeChange (value) {
	        this.listCheckData.pageNum = value
	        this.listCheckData.pageSize = 10
	        this.searchListData(this.listCheckData)
	    },
		handleCurrentChange (value) {
		    this.listCheckData.pageNum = value
		    this.listCheckData.pageSize = 10
		    this.searchListData(this.listCheckData)
		}
  	}
}    
</script>
<style lang="scss">
    #risyHotPic{
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
		.el-select>.el-input{
			width:156px;
		}
		.el-input .el-input__inner{
			height:32px;
			line-height:32px;
		}
		.el-form-item__label{
			line-height:32px;
			padding:0 12px 0 0
		}
		.redBg,.yellowBg,.blueBg{
	        display: inline-block;
	        color: #fff;
	        padding: 0 20px;
	        border-radius: 2px;
	        background: #FF6363;
	        word-break:normal
	    }
	    .yellowBg{
	        background: #FFD824;
	    }
	    .blueBg{
	        background: #4285F4;
	    }
	    .tip{
	    	line-height:24px;
	    	padding:20px 0
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
	    .colorBg td{
	    	padding:2px 0;
	    	.cell{
	    		padding: 0 5px
	    	}
	    	.redBg,.yellowBg,.blueBg,.noBg{
	    		width:100%;
				padding:20px 0
	    	}
	    }
	    .iconfont{
	    	font-size:12px;
			-webkit-text-fill-color:#FFF;
			-webkit-text-stroke: 0 #FFF;
			margin-right:5px
	    }
    }
</style>
