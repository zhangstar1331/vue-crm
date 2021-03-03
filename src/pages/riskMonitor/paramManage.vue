<template>
  <div id="quote">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor">指标管理</el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor"  v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
			<!--制度列表组件-->
		<div class="quoteSys">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">参数列表</span></div>
    			<v-check @searchData = 'getListData'></v-check>
    			<div class="cagy-run">
		        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
		          <el-table-column  type="index" width="180"  label="序号" align="center" > </el-table-column>
		          <el-table-column  prop="name"  label="参数名称" align="center">
			            <template slot-scope="scope">
			              <span :title="scope.row.name" class="textOverFlow">{{ scope.row.name == ''?'-':scope.row.name}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column  prop="createDate"  label="创建时间" align="center"></el-table-column>
		          <el-table-column prop="source"  label="参数来源" align="center"></el-table-column>
		          <el-table-column prop="relevance"  label="关联指标"  align="center"> 
		          		<template slot-scope="scope">
			              <span :title="scope.row.relevance" class="textOverFlow">{{ scope.row.relevance == null?'暂无关联':scope.row.relevance}}</span>
			            </template>
		          </el-table-column>
		          <el-table-column prop="unit"  label="参数单位"  align="center"> </el-table-column>
		          <el-table-column prop="createDepart"  label="创建部门"  align="center"> </el-table-column>
		          <el-table-column prop="createMan"  label="创建人"  align="center"> </el-table-column>
		          <el-table-column prop="hanndle" label="操作" align="center" v-if="true">
		            <template slot-scope="scope">
		              <span class="handleBtn moreBtn" @click="editRisk(scope.$index, scope.row)" style="color: #4285F4 ;padding:0 5px" v-if="btnData.editbtn">编辑 </span>
		              <span class="handleBtn moreBtne" @click="deleteRisk(scope.$index, scope.row)" style="color: red;padding:0 5px" v-if="btnData.deletebtn">删除 </span>
		            </template>
		          </el-table-column>
		        </el-table>
	      </div>
	      <el-pagination background layout="prev, pager, next" align="center" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
		</div>
  </div>
</template>
<script>
	import vCheck from 'src/components/check/paramCheck'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	data() {
        return {
          panelShow:true,
        	flag:0,
        	totalResults:0,
        	tableData4:[],
          titMsg:"参数管理",
          currentPage:1,
          checkData:{
          	source:'',
          	createDate:'',
          	name:'',
          	pageNo:1,
          	pageSize:10
          },
          btnData:{   //按钮显示隐藏
			editbtn: false,
			deletebtn: false,
		  },
		}
   },
    components:{
    		vCheck
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
    	this.searchData(this.checkData)
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_icsgle')>=0){//编辑
            		this.btnData.editbtn = true
            	}else{
            		this.btnData.editbtn = false
            	}
            	if(handleData.indexOf('1_icsgld')>=0){//删除
            		this.btnData.deletebtn = true
            	}else{
            		this.btnData.deletebtn = false
            	}
            }
	    },
    	deleteRisk(index,row){
    		if(row.relevance){
    			this.$alert('已关联指标无法删除！')
    			return
    		}
    		this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
            	this.axios.post('riskparam/delParam',qs.stringify({id:row.id})).then((res)=>{
		    					if(res.code == '200'){
		    						this.$alert("操作成功", '提示', {
			               confirmButtonText: '确定',
			               callback:action=>{
			               		this.searchData(this.checkData)
			                }
			              });
		    					}
			    		})
          }).catch(_ => {});
    	},
    	editRisk(index,row){
    		var singleObj = new Object()
    		singleObj.source = row.source;
    		singleObj.name = row.name;
    		singleObj.unit = row.unit;
    		sessionStorage.setItem('singleObj',JSON.stringify(singleObj))
    		this.$router.push({
	        path:'/paramRegulations',   //跳转的路径
	        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				    	editId:row.id    
		        }
				  })
    		
    	},
    	searchData(data){
    		this.axios.post('riskparam/findParamList',qs.stringify(data)).then((res)=>{
    			this.tableData4 = res.data==null?[]:res.data.data;
        		this.totalResults = res.data == null?0:res.data.totalResults;
        		if(res.data != null){
        			this.tableData4 = res.data==''?[]:res.data.data;
        			this.totalResults = res.data == ''?0:res.data.totalResults;
        			for (var i = 0; i < res.data.data.length; i++) {
	        			if(res.data.data[i].source == '1'){
	        				res.data.data[i].source = '手工填写'
	        			}else if(res.data.data[i].source == '2'){
	        				res.data.data[i].source = '系统对接'
	        			}
	        			if(res.data.data[i].unit == '1'){
	        				res.data.data[i].unit = '%'
	        			}else if(res.data.data[i].unit == '2'){
	        				res.data.data[i].unit = '次/季度'
	        			}else if(res.data.data[i].unit == '4'){
	        				res.data.data[i].unit = '年'
	        			}else if(res.data.data[i].unit == '5'){
	        				res.data.data[i].unit = '元'
	        			}else if(res.data.data[i].unit == '6'){
	        				res.data.data[i].unit = '次/月'
	        			}else if(res.data.data[i].unit == '7'){
	        				res.data.data[i].unit = '件/月'
	        			}else if(res.data.data[i].unit == '8'){
	        				res.data.data[i].unit = '件/季'
	        			}else if(res.data.data[i].unit == '10'){
	        				res.data.data[i].unit = '次/年'
	        			}else if(res.data.data[i].unit == '11'){
	        				res.data.data[i].unit = '件/年'
	        			}else if(res.data.data[i].unit == '12'){
	        				res.data.data[i].unit = 'PT'
	        			}else{
	        				res.data.data[i].unit = '无单位'
	        			}
	        		}
        		}
    	})
    },
    handleSizeChange (value) {
        this.checkData.pageNo = value;
        this.searchData(this.checkData)
      },
	  handleCurrentChange (value) {
	    this.checkData.pageNo = value;
	    this.searchData(this.checkData)
	  },
	  getListData(data){
	  	this.currentPage = 1;
	  	this.checkData = data;
	  	this.checkData.pageNo = 1;
	  	this.searchData(this.checkData)
	  }
  }
}    
</script>
<style lang="scss">
    #quote{
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
	    	.quoteBox{
	    		margin-top: 2px;
		    	min-height: 250px;
		    	background: #fff;
		    	padding: 16px 16px 50px 16px;
		    	border-radius: 8px;
		    	.titIcon{
		    		font-size:14px;
		    		margin-bottom:30px;
		    		width:100%;
		    		em{
		    			display: inline-block;
		    			width: 2px;
		    			height: 14px;
		    			background: #4285F4;
		    			vertical-align: middle;
		    			margin-right: 6px;
		    		}
		    	}
	    }
	    .tbox{
	    	padding-bottom:50px;
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
	    #tab-first{
	    	background: #fff;
	    	width: 100px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
	    }
	    #tab-second{
	    	background: #fff;
	    	width: 100px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
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
	    .exportBtn,.newBuildBtn{
	    	  float: right;
	    	  margin-right: 5px;
			    width: 68px;
			    height: 26px;
			    padding: 0;
			    font-size: 12px;
	    }
	    .exportBtn{
	    	margin-right: 20px;
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
    }
</style>
