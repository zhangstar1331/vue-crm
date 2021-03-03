<template>
  <div id="assessSpread">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风控评估</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor">风控评估统计</el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor">{{title}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
      	<el-tab-pane v-for="(item,index) in tabList" :label="item.name" :name="item.limit" v-if="orgBtnData.indexOf(item.limit)>=0" :key="index"></el-tab-pane>
    </el-tabs>
		<div class="quoteSys">
	    <el-form :model="SuitObj" label-position="left" ref="SuitObj" class="demo-ruleForm" size="mini">
	        <el-row>
	            <el-col :span="5">
	               <el-form-item label="评估年份">
							    <el-select v-model="SuitObj.year" placeholder="请选择评估年份" @change="changeSuitObj">
							    	<el-option v-for="item in yearList" :key="item.index" :label="item" :value="item"></el-option>
							    </el-select>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="评估类型">
									<el-select v-model="assTypeName" placeholder="请选择评估类型">
									   	<el-option :value="assTypeName" style="height: auto;background: #fff;"> 
									   		<el-tree :data="riskAssess.assessType" :props="defaultProps" @node-click="handleNodeClick" style="font-weight: normal;"></el-tree>
									   	</el-option>
									</el-select>
			        	</el-form-item>
	        		</el-col>
	        		<el-col :span="5" v-if="activeName=='1_agyfxfbgl'">
	              <el-form-item label="部门">
							    <el-select v-model="SuitObj.depId" placeholder="请选择部门" @change="changeSuitObj">
							    	<el-option v-for="item in department" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
								</el-form-item>
	        		</el-col>
	            <el-col :span="9">
	            	<el-button type="primary" class="saveBtn" @click="query">查询</el-button>
	            </el-col>
	        </el-row>
	    </el-form>
	    <div id="pic">
	    	<div class="resultTitle">
		  		<el-row>
		  			<el-col :span='24'>
		  				<el-button type="primary" class="search" @click="goExport" v-if="isShow&&activeName!='1_agyfxfbgl'&&activeName!='1_agyfxfbfl'" :disabled="isBtn"><i class="iconfont iconxiazai"></i>下载</el-button>
		  				<el-button type="primary" class="search" @click="exportData" v-if="(activeName=='1_agyfxfbgl'||activeName=='1_agyfxfbfl'||!isShow)&&(orgBtnData.indexOf('1_agyfxfbe')>=0||orgBtnData.indexOf('1_asyfxfbe')>=0)" :disabled="isBtn">导出</el-button>
		  				<el-button type="primary" class="search" v-if="activeName!='1_agyfxfbgl'&&activeName!='1_agyfxfbfl'" @click="changeForm" :disabled="isBtn"><i class="iconfont iconqiehuan"></i>切换</el-button>
		  				<p>{{titleName}}</p>
		  			</el-col>
		  			<el-col :span="0">
		  			</el-col>
		  		</el-row>
		  	</div>
		  	<!--图表切换展示-->
		  	<!--风险整体分布-->
			  <all-distribute :isShow="isShow" :SuitObj="SuitObj" ref="allDistribute" v-if="activeName=='1_asyfxfbl'||activeName=='1_agyfxfbl'" @func="getMsgFormSon"></all-distribute>
			  <!--各部门风险分布-->
			 	<item-distribute :isShow="isShow" :SuitObj="SuitObj" ref="itemDistribute" v-if="activeName=='1_asyfxfbdl'||activeName=='1_agyfxfbdl'" @func="getMsgFormSon"></item-distribute>
			  <!--风险等级图谱-->
			 	<risk-level :isShow="isShow" :SuitObj="SuitObj" v-if="activeName=='1_agyfxfbgl'" ref="riskLevel" @func="getMsgFormSon"></risk-level>
			 	<!--风险点和控制点对比-->
			 	<risk-control :isShow="isShow" :SuitObj="SuitObj" v-if="activeName=='1_agyfxfbfl'" ref="riskControl" @func="getMsgFormSon"></risk-control>
			 	<div class="resultTitle" style="margin-top: 20px;" v-if="resultFlag">
		  		<el-row>
		  			<el-col :span='24'>
		  				<el-button type="primary" v-if="orgBtnData.indexOf('1_agyfxfbde')>=0||orgBtnData.indexOf('1_asyfxfbde')>=0" class="search" @click="loadDetail" :disabled="isBtn"><i class="iconfont iconxiazai"></i>下载</el-button>
		  				<p>{{titleName}}</p>
		  			</el-col>
		  			<el-col :span="0">
		  			</el-col>
		  		</el-row>
		  	</div>
		  	<assess-detail v-if="resultFlag" :tableData="detailData"></assess-detail>
		  	<el-pagination v-if="resultFlag&&totalResults>0" background layout="prev, pager, next" :page-size.sync="pageSize" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
	    </div>
		</div>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	import echarts from 'echarts'
	import assessDetail from 'src/components/riskAssess/assessDetail'
	import allDistribute from 'src/components/riskAssess/allDistribute'
	import itemDistribute from 'src/components/riskAssess/itemDistribute'
	import riskLevel from 'src/components/riskAssess/riskLevel'
	import riskControl from 'src/components/riskAssess/riskControl'
	import {pie,getData,fileDownload} from 'src/utils/utils.js'
  export default {
  	data() {
      return {
      	title:'固有风险分布',
      	titleName:'',
      	activeName:null,
      	department:[],
		tabList:[],
		isBtn:false,
      	SuitObj:{
      		year:'',
      		assType:'',
      		depId:''
      	},
      	assTypeName:'',
        tableData:[],
        isShow:true,
        resultFlag:false,
        detailData:[],
        currentPage:1,
  			totalResults:0,
  			pageSize:10,
        defaultProps: {
	  			children: 'children',
	  			value: 'value',
	  			label: 'label'
    		}
			}
   	},
   	components:{
   		assessDetail,
   		allDistribute,
   		riskLevel,
   		itemDistribute,
   		riskControl
   	},
   	methods:{
   		...mapActions(['setData']),
   		initPage(){
   			//初始化查询数据
   			this.assTypeName = '年度评估';
   			this.SuitObj.year = new Date().getFullYear();
			this.SuitObj.assType = '1';
			this.setData({'riskAssess.reqDetail.year':this.SuitObj.year})
			this.setData({'riskAssess.reqDetail.assType':this.SuitObj.assType})
			this.setData({'riskAssess.reqDetail.depId':this.SuitObj.depId})
			this.setData({'riskAssess.riskDistribute.year':this.SuitObj.year})
			this.setData({'riskAssess.riskDistribute.assType':this.SuitObj.assType})
			this.setData({'riskAssess.riskDistribute.depId':this.SuitObj.depId})
   			if(this.$route.name == 'surplusAssess'){
   				this.title = '剩余风险分布'
   				this.tabList = [{
   					name:'整体剩余风险分布',
   					limit:'1_asyfxfbl'
   				},{
   					name:'各部门剩余风险分布',
   					limit:'1_asyfxfbdl'
   				}]
   			}else{
   				this.title = '固有风险分布'
   				this.tabList = [{
   					name:'固有风险整体分布',
   					limit:'1_agyfxfbl'
   				},{
   					name:'各部门固有风险分布',
   					limit:'1_agyfxfbdl'
   				},{
   					name:'固有风险等级图谱',
   					limit:'1_agyfxfbgl'
   				},{
   					name:'风险点和控制点对比',
   					limit:'1_agyfxfbfl'
   				}]
   			}
   			this.getName(this.tabList);
   		},
   		getName(arr){
   			for(var i = 0; i < arr.length; i++){
   				if(this.orgBtnData.indexOf(arr[i].limit)>=0){
   					this.titleName = arr[i].name;
   					this.activeName = arr[i].limit;
   					break;
   				}
   			}
   		},
   		handleSizeChange (value) {
				this.tabPage(value)
		  },
			handleCurrentChange (value) {
			 	this.tabPage(value)
			},
			//切换tab
			handleClick(tab){
				this.activeName = tab.name;
				this.titleName = tab.label;
				this.isBtn = false
			},
			//切换页码
			tabPage(value){
				this.setData({"riskAssess.reqDetail.pageNo":value})
				getData('subrep/getrstdetail',qs.stringify(this.riskAssess.reqDetail)).then((data)=>{
					if(data){
						this.currentPage = value
						this.detailData = data.data
	      		this.totalResults = data.totalResults
					}	
				})
			},
   		changeForm(){
   			this.resultFlag = false;
   			this.isShow = !this.isShow;
   		},
   		//查询
   		query(){
			this.isBtn = false
			this.setData({'riskAssess.reqDetail.year':this.SuitObj.year})
			this.setData({'riskAssess.reqDetail.assType':this.SuitObj.assType})
			this.setData({'riskAssess.reqDetail.depId':this.SuitObj.depId})
			this.setData({'riskAssess.riskDistribute.year':this.SuitObj.year})
			this.setData({'riskAssess.riskDistribute.assType':this.SuitObj.assType})
			this.setData({'riskAssess.riskDistribute.depId':this.SuitObj.depId})
   			if(this.activeName=='1_asyfxfbl'||this.activeName=='1_agyfxfbl'){
   				this.$refs.allDistribute.$emit('allDistribute')
   			}
   			if(this.activeName=='1_asyfxfbdl'||this.activeName=='1_agyfxfbdl'){
   				this.$refs.itemDistribute.$emit('itemDistribute')
   			}
   			if(this.activeName=='1_agyfxfbgl'){
   				this.$refs.riskLevel.$emit('riskLevel')
   			}
   			if(this.activeName=='1_agyfxfbfl'){
   				this.$refs.riskControl.$emit('riskControl')
   			}
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
			//导出数据
			exportData(){
				if(this.$route.name == 'surplusAssess'){//剩余
					if(this.activeName=='1_asyfxfbl'){
						var url = '/rmAssTask/riskAssBugLevelNumberExport';
						var filename = "整体剩余风险分布情况.xlsx";
					}
					if(this.activeName=='1_asyfxfbdl'){
						var url = '/rmAssTask/riskAssDepBugLevelNumberExport';
						var filename = "各部门剩余风险分布情况.xlsx";
					}
				}else{
					if(this.activeName=='1_agyfxfbl'){
						var url = '/rmAssTask/riskAssLevelNumberExport';
						var filename = "固有风险整体分布情况.xlsx";
					}
					if(this.activeName=='1_agyfxfbdl'){
						var url = '/rmAssTask/riskAssDepLevelNumberExport';
						var filename = "各部门固有风险分布情况.xlsx";
					}
					if(this.activeName=='1_agyfxfbgl'){
						var url = '/rmAssTask/riskAssRateEffNumberExport';
						var filename = "固有风险等级图谱.xlsx";
					}
					if(this.activeName=='1_agyfxfbfl'){
						var url = '/rmAssTask/riskAssCompLevelNumberExport';
						var filename = "风险点和控制点对比.xlsx";
					}
				}
				//导出	
				this.axios.post(url,qs.stringify(this.riskAssess.riskDistribute),{responseType:'arraybuffer'}).then((res)=>{
					fileDownload(res,filename)
        })
			},
			//树形结构选择
			handleNodeClick(data) {
				if(data.value!=-1){
					this.assTypeName = data.label
					this.SuitObj.assType = data.value
					this.isBtn = true
				}
  		},
  		//获取子组件详情传值
  		getMsgFormSon(data){
	      this.resultFlag = data.resultFlag
	      this.detailData = data.data
	      this.totalResults = data.totalResults
	   },
	   //下载详情表
	   loadDetail(){
	   	this.axios.post("/subrep/exportriskctrl",qs.stringify(this.riskAssess.reqDetail),{responseType:'arraybuffer'}).then((res)=>{
					let filename = "风险评估结果详情.xlsx";
					fileDownload(res,filename)
	    })
	   },
	   changeSuitObj(val){
		   	this.isBtn = true
	   }
   	},
   	mounted(){
   		this.initPage()
   	},
   	computed:{
		...mapState(['riskAssess','orgBtnData']),
		yearList(){
            let year = new Date().getFullYear();
            let arr = [];
            for(var i = year;i>=2017;i--){
                arr.push (i);
			}
			return arr;
        }
   	},
   	watch: {
		  $route: {
		    handler: function(newVal, oldVal){
		    	this.activeName = null;
		    	this.resultFlag = false
		    	this.isShow = true
		      this.initPage()
		      this.query()
		    },
		    deep: true
		  },
		  'orgBtnData'(newVal,oldVal){
		  	if(newVal.length>0){
		  		this.initPage();
		  	}
		  },
		  'activeName'(newVal,oldVal){
		  	if(newVal){
		  		this.isShow = true
		  		this.resultFlag = false
		  		this.setData({'riskAssess.reqDetail':{//切换标签，清空请求数据
		  			year:this.SuitObj.year,//评估年份
						assType:this.SuitObj.assType,//评估类型， 0半年度评估  1年度评估  2专项评估
						depId:this.SuitObj.depId,//部门id
						riskLevel:null,//固有风险等级0空,1一般风险，2重要风险，3重大风险
						riskEffect:null,//风险发生的影响程度1极小，2较小，3中等，4严重
						riskRate:null,//风险发生的可能性1每五年或更低频率，2每年，3每季度，4每月或更高频率
						hasBug:null,//是否存在缺陷1是，0否
						bugLevel:null,//缺陷等级1一般风险，2重要风险，3重大风险
						pageNo:1,//当前页数
						pageSize:10//每页条数
				  }})
					this.setData({'riskAssess.riskDistribute.year':this.SuitObj.year})
					this.setData({'riskAssess.riskDistribute.assType':this.SuitObj.assType})
					this.setData({'riskAssess.riskDistribute.depId':this.SuitObj.depId})
		  	}
		  	if(newVal == '1_agyfxfbgl'){
		  		//获取参与部门信息
	   			getData('/rmAssTask/getGroupDept').then((data)=>{
	   				this.department = data;
	   				this.department.unshift({code: null, name: "全部"})	
	   			})
		  	}
		  },
		//   'SuitObj': {
		//     handler: function(newVal, oldVal){
	   	// 		this.setData({'riskAssess.reqDetail.year':this.SuitObj.year})
		//     	this.setData({'riskAssess.reqDetail.assType':this.SuitObj.assType})
		//     	this.setData({'riskAssess.reqDetail.depId':this.SuitObj.depId})
		//       this.setData({'riskAssess.riskDistribute':newVal})
		//     },
		//     deep: true
		//   }
		}
	}    
</script>
<style lang="scss">
    #assessSpread{
    	.saveBtn{
				min-width: 68px;
				height: 26px;
				line-height: 1px;
				font-size: 12px;
				padding:0 2px;
			}
			.el-input{
				width: 220px;
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
	    .quoteSys{
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
	    	#pic{
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
						cursor:pointer;
					}
					.iconfont{
		    		font-size:12px;
						-webkit-text-fill-color:#FFF;
						-webkit-text-stroke: 0 #FFF;
						margin-right:5px
			    }
	    	}
	    }
	    .el-tabs__item{
	    	padding:0 4px;
    		background: #fff;
	      min-width: 120px;
	      border-top-left-radius: 8px;
	      border-top-right-radius: 8px;
	      border-right: 1px solid #E9E9E9;
	      text-align: center;
    	}
	    .el-tabs__active-bar{
	    	display: none;
	    }
	    .el-tabs__header{
	    	margin:0;
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
	    .el-pagination{
				text-align: center;
				border: 0;
			}
    }
</style>
