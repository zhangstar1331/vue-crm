<template>
  	<div id="colorForm">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor">风险指标报表</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">评价类指标监测表</span></div>
    		<el-form :model="perForm" label-position="left" ref="perForm" size="mini" :inline="true">
	            <el-row>
	            	<el-form-item label="适用对象">
					    <el-select v-model="perForm.region" @change="changeApply" placeholder="请选择适用对象">
					    	<el-option v-for="item in perForm.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
					    </el-select>
					</el-form-item>
                    <el-form-item label="指标名称">
					    <el-input v-model="perForm.quoteName" @change='getQuoteName' placeholder="搜索" prefix-icon="el-icon-search"></el-input>
					</el-form-item>
                    <el-button type="primary" @click="goSearch" class="saveBtn">查询</el-button>
                    <el-button type="primary" @click="goExport" class="saveBtn" :disabled="isBtn" v-if="btnData.exportbtn">导出</el-button>
	            </el-row>
	        </el-form>
	        <div v-if="isShow">
	    		<div class="cagy-run">
			        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:10px">
			           	<el-table-column prop="id" label="编号" align="center" width="100">
			           		<template slot-scope="scope">{{scope.row.code.toUpperCase()}}</template>
			           	</el-table-column>
			            <el-table-column prop="catName" label="风险分类" align="center" minWidth="120">
			            	<template slot-scope="scope">
				              <span>{{scope.row.catName == null?'--':scope.row.catName}}</span>
				            </template>
			            </el-table-column>
			            <el-table-column prop="name" label="指标名称" align="center" width="200">
			            	<template slot-scope="scope">
			                    <span :title="scope.row.name" class="textOverFlow" style="color: #4285F4;" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn">{{scope.row.name == null?'--':scope.row.name}}</span>
			                    <span :title="scope.row.name" class="textOverFlow" v-else>{{scope.row.name == null?'--':scope.row.name}}</span>
			                </template>
			            </el-table-column>
			            <el-table-column prop="rate" label="报送频率" align="center" minWidth="120">
			            	<template slot-scope="scope">
				              <span>{{frequency[scope.row.rate]}}</span>
				            </template>
			            </el-table-column>
			            <el-table-column prop="" v-for="(item,index) in quoteMonth" :key="index" :label="item" align="center" width="200">
				            <template slot-scope="scope">
				            	<div :class="{'redBg':scope.row['t'+item].rybStatus == 1,'yellowBg':scope.row['t'+item].rybStatus == 2,'blueBg':scope.row['t'+item].rybStatus == 3}">
				            		<p v-for="item in scope.row['t'+item].value">{{item}}</p>
				            	</div>
				            </template>
			            </el-table-column>
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
        	titMsg:"评价类指标监测表",
        	perForm:{
        		quoteName:'',
        		region: '全部',
	          	unitsData:[{
		          	name:'全部',
		          	id:''
		        }]
        	},
    		totalResults:0,
    		tableData:[],
          	currentPage:1,
          	checkData:{//查询数据
	            pageNum:1,
	            pageSize:10
          	},
	        // 频率
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度',
	        	'4':'半年度',
	        },
	        quoteMonth:[],
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
    	// 获取适用对象
    	this.getCommon()
    	// 获取列表数据
    	this.searchData(this.checkData)
    },
    methods:{
    	// 返回页面时加载数据
	    getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ihhlzbjcbe')>=0){//导出
            		this.btnData.exportbtn = true
            	}else{
            		this.btnData.exportbtn = false
            	}
            	if(handleData.indexOf('1_ihhlzbjcbd')>=0){//导出
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            }
	    },
      	// 获取指标名称
      	getQuoteName(val){
      		this.isBtn = true
			this.checkData.indName = val
      	},
      	changeApply(val){
      		this.isBtn = true
      		this.checkData.objId = val
      	},
      	// 适用对象
      	getCommon(){
      		this.axios.post('rmIndStass/objectInfo',qs.stringify({})).then((res)=>{
				if(res.code == '200'){
					// 适用对象
		   			this.perForm.unitsData = this.perForm.unitsData.concat(res.data)
				} else {
        			this.$alert(res.message, '提示', {
			        	confirmButtonText: '确定'
			        })
        		}
    		})
      	},
    	// 查询列表数据
    	searchData(data){
    		this.axios.post('rmIndStass/rybIndMonitorInfo',qs.stringify(data)).then((res)=>{
    			if(res.code == '200'){
    				if(res.data != null){
		        		this.isShow = true
		        		this.tableData = res.data==''?[]:res.data.instats
		        		this.totalResults = res.data == ''?0:res.data.total
		        		this.quoteMonth = res.data == ''?[]:res.data.time
		        		if(res.data.instats){
			        		for(var i = 0;i<this.tableData.length;i++){
			        			for(var j = 0;j<this.quoteMonth.length;j++){
			        				if(this.tableData[i]['t'+this.quoteMonth[j]]!==undefined){
			        					this.tableData[i]['t'+this.quoteMonth[j]].value = JSON.parse(this.tableData[i]['t'+res.data.time[j]].value)
			        				} else{
			        					this.tableData[i]['t'+this.quoteMonth[j]] = {}
			        					this.tableData[i]['t'+this.quoteMonth[j]].value = ['--']
			        				}
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
			this.checkData.pageNum = 1
			this.currentPage = 1
			this.isBtn = false
			this.searchData(this.checkData)
		},
		// 导出按钮
		goExport(){
			var params = qs.stringify({
	        	indName:this.checkData.indName,
	        	objId:this.checkData.objId
	        })
			this.axios.post('/rmIndStass/rybIndMonitorExport',params,{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "评价类指标监测表.xlsx";
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
		    this.searchData(this.checkData)
		}
  	}
}    
</script>
<style lang="scss">
    #colorForm{
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
		.el-form-item__content{
			width:auto
		}
		.el-input{
			width:156px;
		}
		.el-select .el-input{
			width:180px;
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
    }
</style>
