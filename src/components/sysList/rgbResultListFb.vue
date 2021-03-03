<template>
  <div id="analysisFb">
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
						<el-button type="primary" @click="searchData" class="saveBtn">查询</el-button>
						<el-button v-if="!isShow&&btnData.exportbtn" type="primary" @click="exportData(1)" class="saveBtn" :disabled="isBtn">导出</el-button>
        </el-row>
        <div class="resultTitle" v-show="isShow">
		  		<el-row>
		  			<el-col :span='24'>
		  					<p>红黄蓝风险监测结果分布<el-button type="primary" class="search" @click="exportData(1)" v-if="btnData.exportbtn">导出</el-button></p>
		  			</el-col>
		  			<el-col :span="0">
		  			</el-col>
		  		</el-row>
		  	</div>
		  	<!--监测结果分布表格-->
		  	<el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" id="analysisFbTop">
			    <el-table-column  prop="color" label="状态" > 
			    		<template slot-scope="scope">
						    	<span style="background: #4285F4;padding:2px 30px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 3">蓝</span>
				    			<span style="background: #FFD824;padding:2px 30px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 2">黄</span>
				    			<span style="background: #FF6363;padding:2px 30px;color: #fff;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 1">红</span>
				    			<span style="background: #fff;padding:2px 30px;color: #000;border-radius: 2px;font-size: 12px;" v-if="scope.row.color == 0">合计</span>
			    		</template>	
			    </el-table-column>
			    <el-table-column prop="v1" label="一类" > 
			    		<template slot-scope="scope">
			    				<p @click="showForm('1',scope.$index,scope.row)" v-if="btnData.detailbtn">{{scope.row.v1}}</p>
			    				<p v-else>{{scope.row.v1}}</p>
			    		</template>
			    </el-table-column>
			    <el-table-column prop="v2" label="二类" > 
			    		<template slot-scope="scope">
			    				<p @click="showForm('2',scope.$index,scope.row)" v-if="btnData.detailbtn">{{scope.row.v2}}</p>
			    				<p v-else>{{scope.row.v2}}</p>
			    		</template>
			    </el-table-column>
			    <el-table-column prop="all" label="合计" ></el-table-column>
		  	</el-table>
		  	<!--分布详情表格-->
		  	<div class="resultTitle" style="margin-top: 30px;" v-show="isShow">
		  		<el-row>
		  			<el-col :span='24'>
		  					<p>红黄蓝风险监测结果分布详情表<el-button type="primary" class="search" @click="exportData(2)" v-if="btnData.detailexportbtn">导出</el-button></p>
		  			</el-col>
		  		</el-row>
		  	</div>
		  	<el-table :data="tableData" v-show="isShow" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	          <el-table-column prop="code" width="100" label="编号" align="center" fixed>
	          	<template slot-scope="scope">{{scope.row.code.toUpperCase()}}</template>
	          </el-table-column>
            <el-table-column prop="name" label="指标名称" width="200" fixed> 
            	<template slot-scope="scope">
                <span :title="scope.row.name" class="textOverFlow" style="color: #4285F4;" @click="goDetail(scope.$index, scope.row)">{{scope.row.name == null?'--':scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="catName" label="风险分类" align="center" width="120">
            	<template slot-scope="scope">
                   <span :title="scope.row.catName" class="textOverFlow">{{scope.row.catName == null?'--':scope.row.catName}}</span>
                </template>
            </el-table-column>
	          <el-table-column prop="caleName" label="指标定义及口径" width="250">
                <template slot-scope="scope">
                    <span :title="scope.row.caleName == null?scope.row.defins:scope.row.caleName+'/'+scope.row.defins" class='textOverFlow'>
                    {{scope.row.caleName == null?scope.row.defins:scope.row.caleName+'&nbsp;/&nbsp;'+scope.row.defins}}
                    </span>
                </template>
            </el-table-column>
	          <el-table-column prop="isryb" label="是否红黄蓝" align="center" width="120">
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
	          <el-table-column prop="objName" label="适用对象" width="150" align="center"> </el-table-column>
	          <el-table-column prop="depName" label="报送部门" width="120" align="center"> </el-table-column>
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
	import qs from 'qs'
  export default {
  	props:[''],
  	data() {
      return {
      	currentPage:1,
      	isShow:false,
      	perForm:{
        		quoteName:''
        	},
        batchFb:'',	
        application:{
	          	region: '',
	          	unitsData:[]
	        },
        endDatePicker:this.processDate(),	
        checkData:{
        	subDate:null,
        	objId:''
        },
        tableData4:[],
        tableData:[],
        totalResults:0,
        isBtn:false,
        btnData:{   //按钮显示隐藏
			exportbtn: false,
			detailbtn: false,
			detailexportbtn: false,
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
    	this.initData()
    	this.isShow = false;
    	this.getData(this.$store.state.orgBtnData)
    },
    methods: {
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ihhlzbjcpjjgde')>=0){//导出
            		this.btnData.exportbtn = true
            	}else{
            		this.btnData.exportbtn = false
            	}
            	if(handleData.indexOf('1_ihhlzbjcpjjgd')>=0){//详情
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            	if(handleData.indexOf('1_ihhlzbjcpjjgdde')>=0){//导出
            		this.btnData.detailexportbtn = true
            	}else{
            		this.btnData.detailexportbtn = false
            	}
            }
	    },
    	getListData(data){
    		this.axios.post('rmIndStass/rybMonrNumber',qs.stringify(data)).then((res)=>{
            if(res.code == 200){
              if(res.data != null){
              	this.tableData4 = res.data
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
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
              	this.totalResults = res.data.total;
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
    	},
    	initData(){
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
	    	this.checkData.subDate = (year + '' + month)/1
	    	
	    	
	    	//获取适用对象
	    	this.axios.post('rmIndStass/repOptInfo',qs.stringify({flag:1})).then((res)=>{
		   			if(res.code == 200){
		   				this.applyUnit = res.data.objects;
		   				//处理适用对象数据
		   				var company = [];
		   				res.data.objects.forEach((item,index)=>{
		   					var obj = new Object();
		   					if(item.name!=="集团"){
		   						obj.name = item.name;
		   						obj.id = item.id;
		   						company.push(obj)
		   					}
		   					
		   				})
		   				// company.splice(0,1)
		   				// 适用对象
			   			this.$set(this.application,'region',company[0].name)
			   			this.$set(this.application,'unitsData',company)
			   			this.$set(this.checkData,'objId',company[0].id)
			   			this.getListData(this.checkData)
		   			}else{
		   				this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
		   			}
			   	})
	    	//红黄蓝结果分布入参处理
	    	sessionStorage.setItem('checkData',JSON.stringify(this.checkData))
    	},
      handleSizeChange (value) {
      	let checkData = JSON.parse(sessionStorage.getItem('checkData'))
      			checkData.pageNum = value;
				this.getListDataDetail(checkData)
      },
      handleCurrentChange (value) {
      	let checkData = JSON.parse(sessionStorage.getItem('checkData'))
      			checkData.pageNum = value;
				this.getListDataDetail(checkData)
        //下一页请求数据
      },
      getBatch(val){
      	this.isBtn = true
		    	if(val != null){
		  			this.checkData.subDate = formatDate(val,'yyyy-MM');
		  			this.checkData.subDate = this.checkData.subDate.split('-').join('')
		  			sessionStorage.setItem('checkData',JSON.stringify(this.checkData))
		  		}else{
		  			this.checkData.subDate = '';
		  		}
			},
      showForm(level,index,row){
      		if(row.color == 0){
      			return
      		}
      		this.isShow = true
      		let checkData = JSON.parse(sessionStorage.getItem('checkData'))
      		checkData.rybStatus = row.color
      		checkData.indLevel = level
      		if(checkData.subDate != undefined){
      			checkData.submissionDate = checkData.subDate
      		}
      		delete checkData.subDate
      		delete checkData.objId
      		checkData.objectId = this.checkData.objId
      		checkData.pageNum = '1'
      		checkData.pageSize = '10'
      		if(row.color != 0){
      			sessionStorage.setItem('checkData',JSON.stringify(checkData))
      			this.getListDataDetail(checkData)
      		}
      },
      changeApply(val){
      	this.isBtn = true
					this.checkData.objId = val
					sessionStorage.setItem('checkData',JSON.stringify(this.checkData))
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
	    	this.isShow = false
	    	this.isBtn = false
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
	    exportData(type){
	    	if(type == '1'){
	      		this.axios.post('rmIndStass/rybMonrNumberExport',qs.stringify(this.checkData),{responseType:'arraybuffer'}).then((res)=>{
		            let filename = "红黄蓝风险监测结果分布.xlsx";
	              	this.fileDownload(res, filename);
		        })
	    		}else{
	    			let checkData = JSON.parse(sessionStorage.getItem('checkData'))
	    			let page = checkData.pageNum;
	    			delete checkData.pageNum;
	    			delete checkData.pageSize;
	    			this.axios.post('rmIndStass/indRybDetailExport',qs.stringify(checkData),{responseType:'arraybuffer'}).then((res)=>{
	    					checkData.pageNum = page;
	    					checkData.pageSize = '10';
	    					sessionStorage.setItem('checkData',JSON.stringify(checkData))
		            let filename = "红黄蓝风险监测结果分布详情表.xlsx";
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
#analysisFb .cell:hover{
	cursor: pointer;
}	
#analysisFb .textOverFlow{
	width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
#analysisFb .el-table__body-wrapper{
		background: #fff;
	}
	#analysisFbTop .cell{
		text-align: center;
	}
#analysisFb 	.el-pagination{
		text-align: center;
		padding-bottom: 50px;
		border: 0;
		margin-top: 20px;
	}
#analysisFb 	.el-table::before{
		height:0;
	}
#analysisFb 	.el-table th{
		background: #f9f9f9;
		text-align: center;
	}
#analysisFb .el-dropdown {
	    vertical-align: top;
	  }
#analysisFb .el-dropdown + .el-dropdown {
	    margin-left: 15px;
	  }
#analysisFb .el-icon-arrow-down {
	    font-size: 12px;
	 }
#analysisFb .box{
		min-height: 180px;
    background: #fff;
    padding: 16px 16px 16px 16px;
    -webkit-box-shadow: 4px 2px 6px #888;
    margin-top: 2px;
    border-radius: 8px;
}	 
#analysisFb{
	.resultTitle{
		height: 40px;
		line-height:40px;
		background:#E9E9E9;
		p{
			line-height: 40px;
			text-align: center;
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
} 
</style>
