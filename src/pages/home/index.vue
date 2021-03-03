<template>
	<div id="indexPage">
	  <div class="titleTip">
		  	<el-breadcrumb separator-class="el-icon-arrow-right">
				  <el-breadcrumb-item><span style="color: #4285F4;font-size:14px;font-weight: 700;">首页</span></el-breadcrumb-item>
				  <el-breadcrumb-item></el-breadcrumb-item>
				</el-breadcrumb>
	  		<div class="messageBox">
	  			<span class="txt1">待办事项</span>
	  			<span class="txt2">{{things.todoCount}}</span>
	  			<span class="iconfont iconrenwu"></span>
	  		</div>
	  		<div class="messageBox myMessage">
	  			<span class="txt1">我的消息</span>
	  			<span class="txt2">{{things.mailCount}}</span>
	  			<span class="iconfont iconxiaoxi"></span>
	  		</div>
	  </div>
		<div class="dbBox">
	  	<div class="title">
	  		<span class="iconfont iconrenwu"></span><span style="display: inline-block;margin-left: 12px;font-size: 14px;">待办事项</span><span style="color: #4285F4;font-size: 14px;">（{{things.todoCount}}）</span>
	  	</div>
	  	<div class="listBox">
	  		<el-table :data="tableData" style="width: 100%">
	   		 	<el-table-column label="" align="left">
			      <template slot-scope="scope">
			        <span style="margin-left: 10px">{{ scope.row.tODOPO.todoTitle }}</span>
			      </template>
			    </el-table-column>
			    <el-table-column label="" align="center">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.createtime }}</p>
			      </template>
			    </el-table-column>
			    <el-table-column label="" align="right" style="padding-right: 20px;">
			      <template slot-scope="scope">
			      	<div class="jiantouBox">
			      		<span style="font-size: 12px;color: #4285F4;" @click="jumpPage(scope.row)">处理</span>
			      		<span class="iconfont iconjiantou" @click="jumpPage(scope.row)"></span>
			      	</div>
			      </template>
			    </el-table-column>
	  		</el-table>
	  		<el-pagination v-if="pageShow" background layout="prev, pager, next" :page-size=5 :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
	  	</div>
	  </div>
	  <div class="dbBox" style="margin-bottom: 20px;">
	  	<div class="title">
	  		<span class="iconfont iconxiaoxi"></span><span style="display: inline-block;font-size: 14px;margin-left: 12px;">我的消息</span><span style="color: #4285F4;font-size: 14px;">（{{things.mailCount}}）</span>
	  	</div>
	  	<div class="listBox">
	  		<el-table :data="tableData1" style="width: 100%">
	   		 	<el-table-column label="" align="left">
			      <template slot-scope="scope">
			      	<p :title="scope.row.mailPO.content" class="textOverFlow">
			      		<span style="margin-left: 10px">{{ scope.row.mailPO.subject }}：{{ scope.row.mailPO.content }}</span>
			      	</p>
			      </template>
			    </el-table-column>
			    <el-table-column label="" align="center">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.createtime }}</p>
			      </template>
			    </el-table-column>
			    <el-table-column label="" align="right" style="padding-right: 20px;">
			      <template slot-scope="scope">
			      	<div class="jiantouBox">
			      		<span style="font-size: 12px;color: #4285F4;font-weight: 400;" @click="goDetail(scope.row)" v-if="scope.row.channel == '60'">详情</span>
			      		<i class="el-icon-document" style="font-size: 14px;color: #4285F4;margin-right:4px" @click="goDetail(scope.row)" v-if="scope.row.channel == '60'"></i>
			      		<span style="font-size: 12px;color: #4285F4;font-weight: 400;" @click="deleteMail(scope.row)">删除</span>
			      		<i class="el-icon-delete" style="font-size: 14px;color: #4285F4;" @click="deleteMail(scope.row)"></i>
			      	</div>
			      </template>
			    </el-table-column>
	  		</el-table>
	  		<el-pagination v-if="pageShow1" background layout="prev, pager, next" :page-size=5 :current-page.sync="currentPage1" prev-text="上一页" next-text="下一页" :total="totalResults1" @size-change="handleSizeChange1" @current-change="handleCurrentChange1"> </el-pagination>
	  	</div>
	  </div>
	</div>
</template>
<script>
	import qs from 'qs'
	import {mapActions} from 'vuex'
  export default {
    created () {
    	
    },
    data () {
    	return{
    		tableData: [],
    		tableData1:[],
    		pageShow:false,
    		pageShow1:false,
    		things:{
    			todoCount:0,
    			mailCount:0
    		},
        currentPage:1,
        currentPage1:1,
        totalResults:1,
        totalResults1:1,
        checkData:{
        	pageSize:5,
        	pageNo:1
        }
    	}
    },
    created(){
    	this.init()
    },
    methods: {
    	...mapActions(['setData']),
    	init(){
    		var injType = localStorage.getItem('inj_ty')
    		var cid = localStorage.getItem('inj_cid')
    		if(injType){
    			this.removeStorage()
    			this.goPage(injType,cid)
    		}
				this.getCount()
				this.getToDoList()
				this.getMailList()
    	},
    	removeStorage(){
    		localStorage.removeItem('inj_ty');
    		localStorage.removeItem('inj_cid');
    	},
    	handleSizeChange (value) {
    		this.checkData.pageNo = value
    		this.getToDoList()
      },
      handleSizeChange1 (value) {
      	this.checkData.pageNo = value
    		this.getMailList()
      },
      handleCurrentChange (value) {
      	this.checkData.pageNo = value
    		this.getToDoList()
      },
      handleCurrentChange1 (value) {
      	this.checkData.pageNo = value
    		this.getMailList()
      },
      getCount(){
      	this.axios.post('task/getCount',qs.stringify({})).then((res)=>{
      			this.things.mailCount = res.mailCount == undefined?'0':res.mailCount;;
      			this.things.todoCount = res.todoCount == undefined?'0':res.todoCount;
      	})
      },
      getToDoList(){
      	this.axios.post('task/getToDoList',qs.stringify(this.checkData)).then((res)=>{
      			if(res.data != null){
      				this.pageShow = true;
      				this.tableDat = [];
      				this.tableData = res.data;
      				this.totalResults = res.totalResults
      			}
      	})
      },
      getMailList(){
      	this.axios.post('task/getMailList',qs.stringify(this.checkData)).then((res)=>{
      			if(res.data != null){
      				this.pageShow1 = true;
      				this.tableData1 = res.data;
      				this.totalResults1 = res.totalResults
      			}
      	})
      },
      jumpPage(row){
      	let itemType = row.tODOPO.todoUrl.split('?')[1].split('&')[0].split('=')[1]
      	this.goPage(row.channel,row.cid,itemType)
      },
      deleteMail(row){
      	this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
          	this.axios.post('task/deleteMailById',qs.stringify({id:row.id})).then((res)=>{
		      			if(res == '1'){
		      				this.$alert('操作成功', '提示', {
						          confirmButtonText: '确定',
						          callback: action => {
						            	//执行刷新
			        						this.init();
						          }
						        });
						      return;  
		      			}else{
		      				this.$alert(res.message, '提示', {
						          confirmButtonText: '确定'
						        });
		      			}
		      	})
          })
      },
    	goPage(type,cid,itemType){
    		var handleId = null;
    		if(type == '1' || type == '10'){
    			handleId = '1_afkpgrwcb'
    			//风控评估填报
    			this.$router.push({
    				path:'/assessCB'
    			})
    		}else if(type == '2' || type == '20'){
    			handleId = '1_ifxyjzgcs'
    			//预警单填报
    			this.$router.push({
    				path:'/quoteWarnDetail',
    				query:{
    					writeId:cid
    				}
    			})
  			}else if(type == '3' || type == '30'){
  				handleId = '1_izbcb'
				this.axios.post('indjob/comm',qs.stringify({})).then((res1)=>{
					if(res1.code == '200'){
						sessionStorage.setItem('taskName',JSON.stringify(res1.data.codpNames)) 
		  				//指标呈报
		    			this.$router.push({
		    				path:'/taskReport',
		    				query:{
		    					taskId:cid
		    				}
		    			})
					}
	    		})
    	}else if(type == '4' || type == '40'){
    			handleId = '1_ijzdcb'
    			//集中度呈报
    			this.$router.push({
    				path:'/riskMonitor/focusReport',
    				query:{
    					id:'1_ijzdcb',
    					cid:cid
    				}
    			})
    	}else if(type == '5' || type == "50"){
    			handleId = '1_lsjbs'
    			//损失事件库
    			this.$router.push({
    				path:'/specialReport',
    				query:{
    					lossId:cid,
    					flag:2,
    					id:'1_lsjbs'
    				}
    			})
    		} else {
    			if(itemType == '5'){
	    			handleId = '1_lsjbs'
	    			//损失事件库
	    			this.$router.push({
	    				path:'/specialReport',
	    				query:{
	    					lossId:cid,
	    					flag:2,
	    					id:'1_lsjbs'
	    				}
	    			})
	    		} else if(itemType == '71'){
    				handleId = '1_hjgjcsxxxbs'
	    			//合规报送
	    			this.$router.push({
	    				path:'/superviseSpecialReport',
	    				query:{
	    					infoId:cid,
				            flag:0,
	    					id:'1_hjgjcsxxxbs',
	    				}
	    			})
	    		} else if(itemType == '72'){
	    			handleId = '1_hjgcfxxbs'
	    			this.$router.push({
	    				path:'/punishSpecialReport',
	    				query:{
	    					infoId:cid,
				            flag:0,
	    					id:'1_hjgcfxxbs',
	    				}
	    			})
	    		} else if(itemType == '73'){
	    			handleId = '1_hsfajxxbs'
	    			this.$router.push({
	    				path:'/justiceSpecialReport',
	    				query:{
	    					infoId:cid,
			              	flag:0,
	    					id:'1_hsfajxxbs',
	    				}
	    			})
	    		} else if(itemType == '74'){
	    			handleId = '1_hnbwgxxbs'
	    			this.$router.push({
	    				path:'/violationSpecialReport',
	    				query:{
	    					infoId:cid,
				            flag:0,
	    					id:'1_hnbwgxxbs',
	    				}
	    			})
	    		} else if(itemType == '75'){
	    			handleId = '1_hwzxxbs'
	    			this.$router.push({
	    				path:'/accountSpecialReport',
	    				query:{
	    					infoId:cid,
				            flag:0,
	    					id:'1_hwzxxbs',
	    				}
	    			})
	    		} else{
	    			handleId = '1_hajfxbs'
	    			this.$router.push({
	    				path:'/caseSpecialReport',
	    				query:{
	    					infoId:cid,
				            flag:0,
	    					id:'1_hajfxbs',
	    				}
	    			})
	    		}
    		}
		this.axios.post('rmUser/permissionIds',qs.stringify({roleId:sessionStorage.getItem('roleId'),moduleId:handleId})).then((res)=>{
				if(res.code == '200'){
					this.setData({orgBtnData:res.data})
				}
    		})
    	},
    	goDetail(row){
    		var itemType = row.mailPO.subject
    		var cid = row.cid
    		var handleId = null
			if(itemType.includes('监管检查')){
				handleId = '1_hjgjcsxxxbs'
    			//合规报送
    			this.$router.push({
    				path:'/superviseDetail',
    				query:{
    					infoId:cid,
			            flag:1,
    					id:'1_hjgjcsxxxbs',
    				}
    			})
    		} else if(itemType.includes('监管处罚')){
    			handleId = '1_hjgcfxxbs'
    			this.$router.push({
    				path:'/punishDetail',
    				query:{
    					infoId:cid,
			            flag:1,
    					id:'1_hjgcfxxbs',
    				}
    			})
    		} else if(itemType.includes('案件风险')){
    			handleId = '1_hajfxbs'
    			this.$router.push({
    				path:'/caseDetail',
    				query:{
    					infoId:cid,
			            flag:1,
    					id:'1_hajfxbs',
    				}
    			})
    		} else if(itemType.includes('涉刑案件')||itemType.includes('司法案件')){
    			handleId = '1_hsfajxxbs'
    			this.$router.push({
    				path:'/justiceDetail',
    				query:{
    					infoId:cid,
		              	flag:1,
    					id:'1_hsfajxxbs',
    				}
    			})
    		}else if(itemType.includes('内部违规')){
    			handleId = '1_hnbwgxxbs'
    			this.$router.push({
    				path:'/violationDetail',
    				query:{
    					infoId:cid,
			            flag:1,
    					id:'1_hnbwgxxbs',
    				}
    			})
    		}else if(itemType.includes('问责')){
    			handleId = '1_hwzxxbs'
    			this.$router.push({
    				path:'/accountDetail',
    				query:{
    					infoId:cid,
			            flag:1,
    					id:'1_hwzxxbs',
    				}
    			})
    		} else{
    			handleId = '1_lsjbs'
    			//损失事件库
    			this.$router.push({
    				path:'/leSendDetail',
    				query:{
    					lossId:cid,
    					flag:2,
    					id:'1_lsjbs'
    				}
    			})
    		}
    		this.axios.post('rmUser/permissionIds',qs.stringify({roleId:sessionStorage.getItem('roleId'),moduleId:handleId})).then((res)=>{
				if(res.code == '200'){
					this.setData({orgBtnData:res.data})
				}
    		})
		}
    }
  };
</script>
<style lang="scss">
#indexPage{
	.el-breadcrumb{
		margin-bottom: 16px;
		margin-top: 20px;
	}
	.titleTip{
			padding-top: 10px;
		  text-align: center;
	    font-weight: 600;
	    font-size: 36px;
	    letter-spacing: 8px;
	    overflow: hidden;
	    .messageBox{
	    	margin-top: 16px;
	    	width: 375px;
	    	height: 158px;
	    	line-height: 138px;
	    	background: url(../../../static/dbPic.png) center center no-repeat;
	    	background-size: 100%;
	    	text-align:left;
	    	float: left;
	    	.txt1{
	    		display: block;
			    float: left;
			    font-size: 18px;
			    color: #fff;
			    margin-left: 34px;
			    letter-spacing: 2px;
	   			font-weight: normal;
	   			margin-right: 4px;
	    	}
	    	.txt2{
	    		display: block;
			    float: left;
			    font-size: 38px;
			    color: #fff;
			    margin-right: 35px;
			    letter-spacing: 2px;
	    	}
	    	.iconrenwu,.iconxiaoxi{
	    		-webkit-text-fill-color:#fff;
	    		-webkit-text-stroke:0;
	    		font-size: 60px;
	    	}
	    }
	    .myMessage{
	    	background: url(../../../static/xiaoxi.png) center center no-repeat;
	    	background-size: 100%;
	    }
	    .txtColor span{
				color: #4285F4;
			}
	}
	.dbBox{
		-webkit-box-shadow: 1px 0px 6px #888;
	   	border-radius: 8px;
	   	background: #fff;
	   	height: 420px;
	   	margin-top: 28px;
		.title{
			height: 48px;
			line-height: 48px;
			padding-left: 20px;
			background: #F9F8F8;
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			.iconrenwu,.iconxiaoxi{
				vertical-align: middle;
				-webkit-text-fill-color:#4285F4;
	    	-webkit-text-stroke:0;
			}
		}
	}
	.listBox{
		position: relative;
		padding: 0 20px 20px;
		height: 345px;
		box-sizing:content-box;
		.iconjiantou{
			vertical-align: middle;
			-webkit-text-fill-color:#4285F4;
	    -webkit-text-stroke:0;
		}
		.el-pagination{
			width: 100%;
			position:absolute;
			bottom: 20px;
			text-align: center;
			margin-top: 60px;
			padding-bottom:0.010417rem
		}
		.btn-prev span{
			padding: 0 10px;
		}
		.btn-next span{
			padding: 0 10px;
		}
	}
	.jiantouBox:hover{
		cursor: pointer;
	}
	.is-right{
		padding-right: 6%;
	}
	.has-gutter{
		display: none;
	}
	.textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.is-left .cell{
      text-align:left!important
    }
    .is-right .cell{
      text-align:right!important
    }
}	
</style>
