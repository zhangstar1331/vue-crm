<template>
  <div id="quote">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor">指标管理</el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor"  v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		
    <el-tabs v-model="activeName" @tab-click="handleClick">
    		<!--现行指标库-->
	    	<el-tab-pane label="现行指标库" name="first" :key="'first'">
	    			<!--查询组件-->
	    		<div class="quoteBox1" style="min-height: 240px;">
	    			<div class="titIcon"><em></em><span style="font-weight: 600;">指标库</span></div>
	    			<v-check @nowQuote='checkData' v-if="isChildUpdate1" :isFlag = '1'></v-check>
	    		</div>
	    	</el-tab-pane>
				<!--历史指标库-->
		    <el-tab-pane label="历史指标库" style="font-weight: 600" name="second" :key="'second'">
		    	<div class="quoteBox1" style="min-height: 240px;">
	    			<div class="titIcon"><em></em><span style="font-weight: 600;">指标库</span></div>
	    			<v-check :isFlag = '2' v-if="isChildUpdate2" @historyQuote = 'checkData'></v-check>
	    		</div>
		    </el-tab-pane>
		</el-tabs>
			<!--制度列表组件-->
		<div class="quoteSys1">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">指标列表</span></div>
    			<el-button type="primary" @click.native="gotoCrIn" class="search" v-if="btnData.addbtn">新建</el-button>
    			<div class="cagy-run">
	        <el-table :data="tableData4" style="margin-top: 50px ;width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	          <el-table-column  prop="sn" width="180"  label="指标编号" align="center" > </el-table-column>
	          <el-table-column  prop="name"  label="指标名称" align="center">
		            <template slot-scope="scope">
		              <span :title="scope.row.name" class="textOverFlow">{{ scope.row.name == ''?'-':scope.row.name}}</span>
		            </template>
	          </el-table-column>
	          <el-table-column  prop="riskName"  label="风险大类" align="center"  >
	            <template slot-scope="scope">
	              <span :title="scope.row.riskName" class="textOverFlow">{{ scope.row.riskName == ''?'--':scope.row.riskName }}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="startDate"  label="启用时间" align="center"> 
	          	<template slot-scope="scope">
	              <span :title="scope.row.startDate" class="textOverFlow">{{ scope.row.startDate == null?'--':scope.row.startDate }}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="stopDate" v-if="isChildUpdate2" label="停用时间" align="center">
	          	<template slot-scope="scope">
	              <span :title="scope.row.stopDate" class="textOverFlow">{{ scope.row.stopDate == null?'--':scope.row.stopDate }}</span>
	            </template>
	          </el-table-column>
	          <el-table-column prop="company"  label="适用对象"  align="center"> 
	          		<template slot-scope="scope">
							    	<span :title="scope.row.company" class="textOverFlow">{{ scope.row.company }}</span>
								</template>	
	          </el-table-column>
	          <el-table-column prop="department"  label="报送部门"  align="center">
								<template slot-scope="scope">
							    	<span :title="scope.row.department" class="textOverFlow">{{ scope.row.department }}</span>
								</template>	          	
	          </el-table-column>
	          <el-table-column prop="frq"  label="报送频率"  align="center"> 
	          		<template slot-scope="scope">
							    	<span :title="scope.row.frq" class="textOverFlow">{{ scope.row.frq }}</span>
								</template>	
	          </el-table-column>
	          <!-- <el-table-column prop="level"  label="指标等级"  align="center">
	          	<template slot-scope="scope">
	              <span>{{ scope.row.level == '1'?'一级指标':scope.row.level == '2'?'二级指标':'--' }}</span>
	            </template>
	          </el-table-column> -->
	          <el-table-column prop="mark"  label="备注"  align="center" width="80"> </el-table-column>
	          <el-table-column prop="hanndle" label="操作" align="center" v-if="true" width="114">
	            <template slot-scope="scope">
	              <span class="handleBtn detailBtn" @click="deleteRisk(scope.$index, scope.row.id, 1)" style="color: #4285F4;" v-if="btnData.detailbtn">详情 </span>
	              <span class="handleBtn moreBtn" @click="deleteRisk(scope.$index, scope.row.id, 2)" style="color: #4285F4 ;" v-if="btnData.editbtn">编辑 </span>
	              <span class="handleBtn moreBtne" v-if="titMsg == '历史指标库'&&btnData.deletebtn" @click="deleteRisk(scope.$index, scope.row.id, 3, tableData4)" style="color: red;">删除 </span>
	            </template>
	          </el-table-column>
	        </el-table>
	         <el-pagination style="text-align: center;margin-top: 16px;" :current-page.sync="currentPage" background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="totalPage" @size-change="" @current-change="handleCurrentChange">
      		 </el-pagination>
	      </div>
		</div>
  </div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/check/quoteCheck'
	import vSysList from 'src/components/sysList/sysList'
	import vTextSearch from 'src/components/textSearch/textSearch'
	import {mapState,mapActions} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	data() {
        return {
          panelShow:true,
        	flag:0,
        	totalPage:0,
        	totalPage:0,
        	tableData4:[],
        	currentPage:1,
			    activeName: "first",
			    isChildUpdate1:true,
          isChildUpdate2:false,
          titMsg:"现行指标库",
          askData:'',
          btnData:{   //按钮显示隐藏
			addbtn: false,
			detailbtn: false,
			editbtn: false,
			deletebtn: false,
		  },
		}
   },
    components:{
    		vCheck,
    		vSysList,
    		vTextSearch
    },
    returnTo(){
      this.activeName = 'second'
      this.handleClick({name:'second'})
      this.panelShow=false
    },
    mounted(){
    	this.getListData('1')
    	Bus.$on('askData',(data)=>{
    		this.askData = data
    		this.currentPage = 1
    	})
    	this.getData(this.$store.state.orgBtnData)
    },
    computed:{
    	...mapState(['indicator','indicatorArr','indicatorRes','indicatorArrRes']),
    	f1(){
  			return this.$store.state.orgBtnData
  		}
    },
  	watch:{
  		f1(newdata,olddata){
  			this.getData(newdata)
  		}
  	},
    methods:{
    	...mapActions(['setData']),
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_izbka')>=0){//新建
            		this.btnData.addbtn = true
            	}else{
            		this.btnData.addbtn = false
            	}
            	if(handleData.indexOf('1_izbkd')>=0){//详情
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            	if(handleData.indexOf('1_izbke')>=0){//编辑
            		this.btnData.editbtn = true
            	}else{
            		this.btnData.editbtn = false
            	}
            	if(handleData.indexOf('1_izbkde')>=0){//删除
            		this.btnData.deletebtn = true
            	}else{
            		this.btnData.deletebtn = false
            	}
            }
	    },
    	//跳转到新建指标
      gotoCrIn(){
      	//初始化数据
      	this.setData({'indicator':this.indicatorRes})
      	this.$router.replace('/riskMonitor/quoteManage/createIndicator')
      },
    	//初始化获取列表数据，默认为现行
    	getListData(type){
    		var askData = {
    			company: "",
					department: "",
					frequency: "",
					level: "",
					name: "",
					pageNo: "1",
					pageSize: "10",
					riskId: "",
					startDate: "",
					status: type,
					stopDate: ""
    		}
    		this.axios.post('indicator/query',JSON.stringify(askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	   			if(res.code == 200){
	   				this.tableData4 = res.data.data
    				this.totalPage=parseInt(res.data.totalResults)
	   			}else{
	   				
	   			}
		   	})
    	},
    	//从子组件获取现行指标库查询数据
    	checkData(data){
    		this.tableData4 = [];
    		this.tableData4 = data.data
    		this.totalPage=parseInt(data.totalResults)
    	},
    	/**
    	 * 初始化获取风险大类和关联参数信息
    	 */
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
	  				this.$router.replace(url)
	  			}
				})
    	},
    	//获取编辑页面数据
    	getIndicator(id,url){
    		this.axios.post('indicator/get',qs.stringify({id:id})).then((res)=>{
						if(res.code == '200'){
							var obj = res.data;
							var indiObj = JSON.parse(JSON.stringify(this.indicator))
							var paramItem = {}
							Object.keys(indiObj).forEach(function(key){
								Object.keys(obj).forEach(function(key1){
									if(key1 == key && obj[key1]){
										indiObj[key] = obj[key1]
										if(key1 == 'reportInfo'){
											for(var i = 0; i < indiObj[key1].length; i++){
												delete indiObj[key1][i].companyName
												delete indiObj[key1][i].departmentName
											}
										}
										if(key1 == 'threshold'){
											for(var i = 0; i < indiObj[key1].length; i++){
												delete indiObj[key1][i].yellowDes
												delete indiObj[key1][i].redDes
												delete indiObj[key1][i].blueDes
												delete indiObj[key1][i].companyName
												for(var j = 0; j < indiObj[key1][i].blue.length; j++){
													delete indiObj[key1][i].blue[j].companyName
													delete indiObj[key1][i].blue[j].des
												}
												for(var j = 0; j < indiObj[key1][i].red.length; j++){
													delete indiObj[key1][i].red[j].companyName
													delete indiObj[key1][i].red[j].des
												}
												for(var j = 0; j < indiObj[key1][i].yellow.length; j++){
													delete indiObj[key1][i].yellow[j].companyName
													delete indiObj[key1][i].yellow[j].des
												}
											}
										}
										if(key1 == 'prefTolerance' || key1 == 'dfTolerance' || key1 == 'limitTolerance'){
											for(var i = 0; i < indiObj[key1].length; i++){
												delete indiObj[key1][i].companyName
												delete indiObj[key1][i].des
												delete indiObj[key1][i].param
												delete indiObj[key1][i].sign
											}
										}
									}
								})
							})
							if(obj.paramName){
								paramItem.name = obj.paramName;
								paramItem.id = obj.paramId;
							}
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
							if(indiObj.definition!=''){
								var str = indiObj.definition;
					  		var reg=new RegExp("<br>","g");
								str= str.replace(reg,"\n");
								indiObj.definition = str;
							}
							this.setData({'indicator':indiObj})
							var indType = JSON.parse(JSON.stringify(this.indicatorArr.threshold.indType))
							if(obj.subIndicator){
								for(var i = 0; i < obj.subIndicator.length; i++){
									indType.push(obj.subIndicator[i])
								}
							}
							this.setData({'indicatorArr.threshold.indType':indType})
							this.getCommData(url,paramItem)
						}
					})
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
    	//删除历史指标
    	delIndicator(index,id,rows){
    		this.axios.post('indicator/del',qs.stringify({id:id})).then((res)=>{
    			if(res.code == '200'){
    				 rows.splice(index, 1);
    			}else{
    				this.$alert('删除失败！')
    			}
    		})
    	},
    	deleteRisk(index,id,type,rows){
    		if(type == 1){//详情
    			var status = 1;
    			if(this.titMsg == "历史指标库"){
    				status = 0
    			}
    			var url = '/riskMonitor/quoteManage/detailIndicator?status='+status
    			this.getDetailIndicator(id,url)
    		}
    		if(type == 2){//编辑
    			this.setData({'indicatorArr':JSON.parse(JSON.stringify(this.indicatorArrRes))})
   				this.setData({'indicator':JSON.parse(JSON.stringify(this.indicatorRes))})
    			var url = '/riskMonitor/quoteManage/createIndicator/'+id
    			this.getIndicator(id,url)
    		}
    		if(type == 3){//删除	
    			this.$confirm('您确认删除吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          this.delIndicator(index,id,rows)
	        }).catch(() => {
	        });
    		}
    	},
    	handleCurrentChange (value) {
    		if(!this.askData){
    			if(this.isChildUpdate1){
		    			this.askData = {
		    			company: "",
							department: "",
							frequency: "",
							level: "",
							name: "",
							pageNo: "1",
							pageSize: "10",
							riskId: "",
							startDate: "",
							status: '1',
							stopDate: ""
		    		}
	    		}else{
	    			this.askData = {
		    			company: "",
							department: "",
							frequency: "",
							level: "",
							name: "",
							pageNo: "1",
							pageSize: "10",
							riskId: "",
							startDate: "",
							status: '0',
							stopDate: ""
		    		}
	    		}
    		}
        this.askData.pageNo = value+'';
        this.axios.post('indicator/query',JSON.stringify(this.askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	   			if(res.code == 200){
	   				this.tableData4 = res.data.data
    				this.totalPage=parseInt(res.data.totalResults)
	   			}else{
	   				
	   			}
		   	})
      },
	    handleClick(tab) {
	    		this.currentPage = 1
	        if(tab.name == "first") {
	        		this.askData = {
			    			company: "",
								department: "",
								frequency: "",
								level: "",
								name: "",
								pageNo: "1",
								pageSize: "10",
								riskId: "",
								startDate: "",
								status: '1',
								stopDate: ""
			    		}
	            this.isChildUpdate1 = true;
	            this.isChildUpdate2 = false;
	            this.titMsg = "现行指标库"
	            this.getListData('1')
	        } else if(tab.name == "second") {
	            this.isChildUpdate1 = false;
	            this.isChildUpdate2 = true;
	            this.titMsg = "历史指标库"
	            this.getListData('0')
	            this.askData = {
			    			company: "",
								department: "",
								frequency: "",
								level: "",
								name: "",
								pageNo: "1",
								pageSize: "10",
								riskId: "",
								startDate: "",
								status: '0',
								stopDate: ""
			    		}
	        }
	    },
    }
  };
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
	    	.quoteBox1{
	    		margin-top: 2px;
		    	min-height: 240px;
		    	background: #fff;
		    	padding: 16px 16px 0 16px;
		    	border-radius: 8px;
		    	.titIcon{
		    		font-size:14px;
		    		margin-bottom:30px;
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
	    .quoteSys1{
	    	margin-top: 25px;
	    	th{
	    		background: #F9F9F9 ;
	    	}
	    	background: #fff;
	    	min-height: 250px;
	    	padding: 16px 16px 16px 16px;
	    	border-radius: 8px;
	    	-webkit-box-shadow: 2px 0px 6px #888;
	    	.titIcon{
	    		font-size:14px;
	    		margin-bottom:30px;
	    		float: left;
	    		width:80%;
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
			.search{
				float: right;
			  width: 68px;
			  height: 26px;
			  margin-right: 5px;
			  padding:0;
		    font-size: 12px;
			}
    }
</style>
