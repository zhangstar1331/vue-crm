<template>
  	<div id="rgbWarning">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor">风险指标报表</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">风险指标预警情况统计</span></div>
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
	                <el-col :span="8" class="newwidth">
	                    <el-form-item label="适用对象">
						    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
						    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
						    </el-select>
						</el-form-item>
	                </el-col>
	            </el-row>
	            <el-row>
	                <el-col :span="8">
	                    <el-form-item label="指标名称">
						    <el-input v-model="quoteAssignForm.quoteName" @change='getQuoteName' placeholder="搜索" prefix-icon="el-icon-search"></el-input>
						</el-form-item>
	                </el-col>
	                <el-col :span="8">
						<el-button type="primary" class="search" @click="goSearch" style="margin-left:4.5%">查询</el-button>
					    <el-button type="primary" class="search" @click="goExport" :disabled="isBtn" v-if="btnData.exportbtn">导出</el-button>
	                </el-col>
	            </el-row>
	        </el-form>
    		<div class="cagy-run">
		    	<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	                <el-table-column prop="code" label="编号" align="center" width="100">
	                    <template slot-scope="scope">{{scope.row.code.toUpperCase()}}</template>
	                </el-table-column>
	                <el-table-column prop="name" label="指标名称" width="200">
	                    <template slot-scope="scope">
	                        <span :title="scope.row.name" class="textOverFlow" style="color: #4285F4;" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn">{{scope.row.name == null?'--':scope.row.name}}</span>
                    		<span :title="scope.row.name" class="textOverFlow" v-else>{{scope.row.name == null?'--':scope.row.name}}</span>
	                    </template>
	                </el-table-column>
	                <el-table-column prop="objName" label="适用对象" width="200" align="center"></el-table-column>
	                <el-table-column prop="catName" label="风险分类" align="center" width="120">
	                    <template slot-scope="scope">
	                        <span :title="scope.row.catName" class="textOverFlow">{{scope.row.catName == null?'--':scope.row.catName}}</span>
	                    </template>
	                </el-table-column>
	                <!-- <el-table-column prop="level" label="指标等级" align="center" width="120">
	                    <template slot-scope="scope">
	                    	<span>{{ scope.row.level == '1'?'一类':scope.row.level == '2'?'二类':'--' }}</span>
	                    </template>
	                </el-table-column> -->
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
	                <el-table-column prop="rate" label="指标频率" align="center">
	                  <template slot-scope="scope">
	                    <span>{{frequency[scope.row.rate]}}</span>
	                  </template>
	                </el-table-column>
	                <el-table-column prop="warnNum" label="指标预警次数" align="center" width="100"></el-table-column>
	                <el-table-column prop="hanndle" label="操作" align="center" width="100">
	                    <template slot-scope="scope">
	                      <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
	                    </template>
	                </el-table-column>
	        </el-table>
	      </div>
	      <el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
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
        	titMsg:"风险指标预警情况统计",
        	quoteAssignForm:{
	      		quoteName:'',//指标名称
	      		subDateBegin:'',
	      		subDateEnd:''
	      	},
	      	// 适用对象
	        application:{
	          	region: '全部',
	          	unitsData:[{
		          	name:'全部',
		          	id:'0'
		        }]
	        },
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度',
	        	'4':'半年度'
	        },
	        checkData:{
	        	subDateBegin:'',
	        	subDateEnd:'',
	            pageNum:1,
	            pageSize:10
	        },
	        starDatePicker:{
  				disabledDate: (time) => {
	            	if (this.quoteAssignForm.subDateEnd != "") {
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
  			monthLen:0,totalResults:0,
    		tableData:[],
          	currentPage:1,
          	isBtn:false,
          	btnData:{   //按钮显示隐藏
  				exportbtn: false,
  				detailbtn: false,
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
    created(){
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
    	this.checkData.subDateBegin = (year + '01')/1
    	//结束时间
    	this.quoteAssignForm.subDateEnd = year + '-' + month
    	this.checkData.subDateEnd = (year+'' + month)/1
    	// 获取适用对象、监测部门、报送批次数据
	    this.getCommon()
    	// 获取列表数据
    	this.searchData(this.checkData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ifxzbyjqktje')>=0){//导出
            		this.btnData.exportbtn = true
            	}else{
            		this.btnData.exportbtn = false
            	}
            	if(handleData.indexOf('1_ifxzbyjqktjd')>=0){//导出
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            }
	    },
    	//开始时间
      	changeBegin(val){
      		this.isBtn = true
      		if(val != null){
	  			this.checkData.subDateBegin = formatDate(val,'yyyy-MM');
	  			this.checkData.subDateBegin = this.checkData.subDateBegin.split('-').join('')
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
      		if(val == 0){
      			delete this.checkData.objectId
      		} else{
      			this.checkData.objectId = val
      		}
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
      	getCommon(){
			this.axios.post('rmIndStass/repOptInfo',qs.stringify({}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	   			if(res.code == 200){
	   				// 适用对象
		   			this.application.unitsData = this.application.unitsData.concat(res.data.objects)
	   			}else{
	   				this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
	   			}
		   	})
		},
    	// 查询列表数据
    	searchData (data) {
      		// 获取表格数据
      		this.axios.post('rmIndStass/rybIndWarnStatis',qs.stringify(data)).then((res)=>{
    			if(res.code == '200'){
    				this.isShow = true
	        		this.tableData = res.data==''?[]:res.data.instats
	        		this.totalResults = res.data == ''?0:res.data.total
        		} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        });
        		}
    		})
      	},
	    // 搜索按钮
	    goSearch(){
	    	if(this.checkData.subDateBegin == '' || this.checkData.subDateEnd == '' ){
				this.$alert('查询时间不能为空', '提示', {
                  confirmButtonText: '确定'
                })
                return
			}
			this.checkData.pageNum = 1
			this.currentPage = 1
			this.isBtn = false
			this.searchData(this.checkData)
		},
		// 导出按钮
		goExport(){
			let page = this.checkData.pageNum;
			delete this.checkData.pageNum;
			delete this.checkData.pageSize;
			this.axios.post('/rmIndStass/rybIndWarnStatisExport',qs.stringify(this.checkData),{responseType:'arraybuffer'}).then((res)=>{
				this.checkData.pageNum = page;
				this.checkData.pageSize = '10';
    			let filename = "风险指标预警情况统计.xlsx";
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
		// 详情
    	goDetail(index,row){
    		this.$router.push({
		        path:'/checkForm',   //跳转的路径
		        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					indId:row.id,
					subDateBegin:this.checkData.subDateBegin,    
					subDateEnd:this.checkData.subDateEnd,
					isWarn: 1,
					id: this.$route.query.id
			    }
			})
    	},
	    handleSizeChange (value) {
	        this.checkData.pageNum = value;
	        this.searchData(this.checkData)
	    },
	    handleCurrentChange (value) {
	        this.checkData.pageNum = value;
	        //下一页请求数据
	        this.searchData(this.checkData)
	    },
		
  	}
}    
</script>
<style lang="scss">
#rgbWarning{
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
	}
    .el-pagination{
    	margin-top: 30px;
    }
    .el-col .el-input input,.el-input .el-input__inner{
		height: 32px;
		line-height: 32px;
	}
	.el-form-item{
		margin-right:18px;
		margin-bottom: 20px;
		width: 100%;
		.el-form-item__content{
			display:inline-block;
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
	.redBg p{
		display: inline-block;
		background: #FF6363;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
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
    .search{
		float: left;
	    width: 68px;
	    height: 26px;
	    margin-top:3px;
	    margin-right: 15px;
	    padding:0;
    	font-size: 12px;
	}
}
    
</style>
