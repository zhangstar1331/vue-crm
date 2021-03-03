<template>
  	<div id="quoteChosen">
		<div class="quoteSys" style="position: relative;overflow-y:hidden;min-height:350px;max-height: 600px;padding-top: 7%;">
    		<div class="quoteTitle"><span>指标选择</span> <i class="el-icon-close" @click="closeList"></i></div>
    		<el-form :model="quoteAssignForm" label-position="left" ref="quoteAssignForm" size="mini">
	            <el-row>
	            	<el-col :span="8" class="newwidth">
	                    <el-form-item label="风险分类">
						    <el-select v-model="riskType.region" @change="changeRiskType" placeholder="请选择适用对象">
						    	<el-option v-for="item in riskType.unitsData" :key="item.catId" :label="item.catName" :value="item.catId"></el-option>
						    </el-select>
						</el-form-item>
	                </el-col>
	                <el-col :span="8" class="newwidth">
	                    <el-form-item label="指标等级">
	                    	<el-select v-model="quoteLevel.region" :disabled="isGroup"  @change="changeLevel" placeholder="请选择指标等级">
						    	<el-option v-for="item in quoteLevel.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
						    </el-select>
						</el-form-item>
	                </el-col>
	                <el-col :span="8" class="newwidth">
	                    <el-form-item label="预警状态">
						    <el-select v-model="warnStatus.region" @change="changeWarnState" placeholder="请选择预警状态">
						    	<el-option v-for="item in warnStatus.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
						    </el-select>
						</el-form-item>
	                </el-col>
	            </el-row>
	            <el-row>
	            	<el-col :span="8" class="newwidth">
	                    <el-form-item label="报送频率">
						    <el-select v-model="bsTimes.region" @change="changeFrequency" placeholder="请选择报送频率">
						    	<el-option v-for="item in bsTimes.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
						    </el-select>
						</el-form-item>
	                </el-col>
	                <el-col :span="8">
	                    <el-form-item label="指标名称">
						    <el-input v-model="quoteAssignForm.quoteName" @change='getQuoteName' placeholder="搜索" prefix-icon="el-icon-search"></el-input>
						</el-form-item>
	                </el-col>
	                <el-col :span="8">
						<el-button type="primary" class="search" @click="goSearch" style="margin-left:4.5%">查询</el-button>
					    <!--<el-button type="primary" class="search" @click="goExport">导出</el-button>-->
	                </el-col>
	            </el-row>
	        </el-form>
    		<div class="cagy-run" style="min-height: 100px;max-height:300px;overflow-y: scroll;">
		    	<el-table :data="tableData" :row-key="handleReserve" ref="multipleTable" @selection-change="handleSelectionChange" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	                <el-table-column type="selection" reserve-selection width="55"></el-table-column>
	                <el-table-column prop="code" reserve-selection label="指标编号" align="center" width="100">
	                    <template slot-scope="scope">{{scope.row.code.toUpperCase()}}</template>
	                </el-table-column>
	                <el-table-column prop="name" reserve-selection label="指标名称" align="center" width="200">
	                    <template slot-scope="scope">
	                        <span :title="scope.row.name" class="textOverFlow" style="color: #4285F4;">{{scope.row.name == null?'--':scope.row.name}}</span>
	                    </template>
	                </el-table-column>
	                <el-table-column prop="catName" reserve-selection label="风险分类" align="center" width="120">
	                    <template slot-scope="scope">
	                        <span :title="scope.row.catName" class="textOverFlow">{{scope.row.catName == null?'--':scope.row.catName}}</span>
	                    </template>
	                </el-table-column>
	                <el-table-column prop="level" reserve-selection label="指标等级" width="140" align="center">
	                    <template slot-scope="scope">
	                    	<span>{{ scope.row.level == '1'?'一类':scope.row.level == '2'?'二类':'--' }}</span>
	                    </template>
	                </el-table-column>
	                <el-table-column prop="rate"  reserve-selection label="报送频率" align="center">
	                  <template slot-scope="scope">
	                    <span>{{frequency[scope.row.rate]}}</span>
	                  </template>
	                </el-table-column>
	                <el-table-column  prop="value" reserve-selection label="指标值" align="center">
	                	<template slot-scope="scope">
			          		<div :class="{'redBg':scope.row.rybStatus == 1,'yellowBg':scope.row.rybStatus == 2,'blueBg':scope.row.rybStatus == 3}">
			            		<p :title="item" v-for="item in scope.row.value">{{item}}</p>
			            	</div>
			            </template>
	                </el-table-column>
	                <el-table-column reserve-selection prop="compv" label="同比" align="center">
	                	<template slot-scope="scope">
			              <span v-for="(item,index) in (scope.row.compv)" class="comCss">{{item.value}} <em v-if="item.scope == 1" style="font-style: normal;">↑</em> <em v-if="item.scope == 0" style="font-style: normal;">↓</em> </span>
			            </template>
	                </el-table-column>
	                <el-table-column reserve-selection prop="momv" label="环比" align="center">
	                	<template slot-scope="scope">
			              <span v-for="(item,index) in (scope.row.momv)" class="comCss">{{item.value}} <em v-if="item.scope == 1" style="font-style: normal;">↑</em> <em v-if="item.scope == 0" style="font-style: normal;">↓</em> </span>
			            </template>
	                </el-table-column>
	                <el-table-column reserve-selection prop="objName" label="适用对象" align="center"> </el-table-column>
	                <el-table-column reserve-selection prop="depName" label="报送部门" align="center"></el-table-column>
	        </el-table>
	      </div>
	      <el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
		  <div class="confirmBtn">
		  	<el-button type="primary" class="search" @click="confirmSub" style="float: initial;">确 定</el-button>
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
  	props:['listCheck'],
  	data() {
        return {
        	titMsg:"风险指标预警情况统计",
        	quoteAssignForm:{
	      		quoteName:'',//指标名称
	      		subDateBegin:'',
	      		subDateEnd:''
	      	},
	      	isGroup:true,
	      	multipleSelection: [],
	      	quoteListShow:false,
	      	// 适用对象
	        application:{
	          	region: '全部',
	          	unitsData:[{
		          	name:'全部',
		          	id:'0'
		        }]
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
		          	name:'全部',
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
		          	name:'全部',
		        },{
		          	name:'红',
		          	id:'1'
		        },{
		          	name:'黄',
		          	id:'2'
		        }]
	        },
	        // 频率
	        bsTimes: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
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
	        frequency:{
	        	'1':'月度',
	        	'2':'季度',
	        	'3':'年度',
	        	'4':'半年度'
	        },
	        checkData:{
	        	submissionDate:null,
	        	objectId:null,
	        	departmentId:null,
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
  			monthLen:0,
  			totalResults:0,
    		tableData:[],
          	currentPage:1,
		}
   	},
    created(){
    	this.checkData.submissionDate = this.listCheck.batch;
    	this.checkData.objectId = this.listCheck.objectId;
    	this.checkData.departmentId = this.listCheck.departmentId;
    	if(this.checkData.objectId == '101'){
    		this.isGroup = true
    	}else{
    		this.isGroup = false
    	}
    	//获取筛选条件
    	this.getCommon()
    	// 获取列表数据
    	this.searchData(this.checkData)
    },
    methods:{
    	//确定提交
    	confirmSub(){
    		this.$emit('getQuoteListId',this.multipleSelection)
    	},
    	//关闭蒙版
    	closeList(){
    		this.$emit('getQuoteListId',[])
    	},
    	//开始时间
      	changeBegin(val){
      		if(val != null){
	  			this.checkData.subDateBegin = formatDate(val,'yyyy-MM');
	  			this.checkData.subDateBegin = this.checkData.subDateBegin.split('-').join('')
	  		}else{
	  			this.checkData.subDateBegin = '';
	  		}
      	},
      	//结束时间
      	changeEnd(val){
      		if(val != null){
	  			this.checkData.subDateEnd = formatDate(val,'yyyy-MM');
	  			this.checkData.subDateEnd = this.checkData.subDateEnd.split('-').join('')
	  		}else{
	  			this.checkData.subDateEnd = '';
	  		}
      	},
      	//适用对象
      	changeApply(val){
      		if(val == 0){
      			delete this.checkData.objectId
      		} else{
      			this.checkData.objectId = val
      		}
      		if(this.checkData.objectId=='101'){
      			this.application.region = '全部'
      			delete this.checkData.indLevel
      		}
      	},
      	//风险分类
      	changeRiskType(val){
      		this.checkData.catId = val	
      	},
      	//指标等级
	  	changeLevel(val){
	  		this.checkData.indLevel = val
	  	},
	  	//预警状态
      	changeWarnState(val){
      		this.checkData.rybStatus = val
      	},
      	changeFrequency(val){
      		this.checkData.frequency = val
      	},
      	handleSelectionChange(val) {
      		this.multipleSelection = val
      		console.log(this.multipleSelection)
	    },
	    handleReserve (row) {
		  return row.id
		},
	    toggleSelection(rows) {
	        rows.forEach(row => {
	          this.$refs.multipleTable.toggleRowSelection(row);
	        });
	    },
    	// 获取指标名称
      	getQuoteName(val){
      		this.checkData.indName = val
      	},
      	// 获取适用对象、监测部门、报送批次数据
      	getCommon(){
			this.axios.post('rmIndStass/repOptInfo',qs.stringify({}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	   			if(res.code == 200){
	   				// 适用对象
		   			this.$set(this.riskType,'unitsData',this.riskType.unitsData.concat(res.data.catList))
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
      		this.axios.post('rmIndStass/indReportExcnInfo',qs.stringify(data)).then((res)=>{
    			if(res.code == '200'){
    				this.isShow = true
    				this.tableData = []
    				if(res.data.instats){
						for (var i = 0; i < res.data.instats.length; i++) {
							res.data.instats[i].value = eval("("+res.data.instats[i].value+")")
							res.data.instats[i].momv = eval("("+res.data.instats[i].momv+")")
							res.data.instats[i].compv = eval("("+res.data.instats[i].compv+")")
						}
					}
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
			this.checkData.pageNum = 1
			this.currentPage = 1
			this.searchData(this.checkData)
		},
		// 导出按钮
		goExport(){
			var params = qs.stringify({
	        	indName:this.checkData.indName
	        })
			this.axios.post('/rmIndStass/prefIndMonrExport',params,{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "风险偏好指标监测表.xlsx";
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
					jobId:row.id    
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
#quoteChosen{
	.quoteTitle{
		text-align: center;
		background: #F9F9F9;
		font-size: 16px;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 60px;
		line-height: 60px;
		letter-spacing: 2px;
		.el-icon-close{
			float: right;
			font-size: 20px;
			margin-top: 20px;
			margin-right: 20px;
			cursor: pointer;
		}
		.el-icon-close:hover{
			color: #4285F4;
		}
	}
	.comCss{
    	display: block;
    	height: 40px;
    	line-height: 40px;
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
    	margin-top: 20px;
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
	.yellowBg p{
		display: inline-block;
		background: #FFD824;
		color: #fff;
		padding: 2px 10px;
		border-radius: 2px;
	}
	.blueBg p{
		display: inline-block;
		background: #4285F4;
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
	.confirmBtn{
		overflow: hidden;
		text-align: center;
		padding-top: 1%;
	}
}
    
</style>
