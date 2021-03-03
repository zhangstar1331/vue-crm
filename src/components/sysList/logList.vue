<template>
  <div id="loglist">
  	<el-table :data="logtable" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	    <el-table-column prop="logtime" width="200" label="时间"></el-table-column>
	    <el-table-column prop="logid" width="200" label="员工工号"></el-table-column>
	    <el-table-column prop="loguser" width="210" label="用户名称">
	    	<template slot-scope="scope">
				<span :title="scope.row.loguser" class="textOverFlow">{{scope.row.loguser == null?'--':scope.row.loguser}}</span>
			</template>
	    </el-table-column>
	    <el-table-column prop="logip" width="210" label="IP"></el-table-column>
	    <el-table-column prop="log" label="日志">
	    	<template slot-scope="scope">
				<span :title="scope.row.log" class="textOverFlow">{{scope.row.log}}</span>
			</template>
	    </el-table-column>
  	</el-table>
	<div class="el-pagination is-background">
		<button type="button" :class="[pageNumber==1?'btn-next col-gray':'btn-next']" @click="getBeforPage"><span>上一页</span></button>
		<button type="button" :class="[isClick?'btn-next':'btn-next col-gray']" @click="getNextPage"><span>下一页</span></button>
	</div>
  </div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {ajax} from 'src/utils/utils.js'
  	import {statusCode} from 'src/utils/utils.js'
  	import qs from 'qs'
  	export default {
	  	data() {
	      return {
	        logtable:[],
	        logaskData:{},
	        pageNumber: 1,
	        isClick:true,
	        ischange:[]
	      }
	    },
	    methods: {
	    	// 下一页
	    	getNextPage(){
	    		if(this.isClick){
	    			this.pageNumber++
		      		this.connectAxios()
	    		}
	      	},
	      	// 上一页
	      	getBeforPage(){
	      		if(this.pageNumber > 1){
	    			this.pageNumber--
					this.connectAxios()
	      		}
	      	},
	      	connectAxios(){
	      		this.logaskData = JSON.parse(sessionStorage.logaskData);
	      		var params = qs.stringify({
		    		jobNo: this.logaskData.jobNo,
		        	ip: this.logaskData.ip,
		        	startDate: this.logaskData.startDate,
		        	endDate:this.logaskData.endDate,
		        	status:this.logaskData.status,//1成功，2失败
		        	pageNumber:this.pageNumber,
		        	pageSize:'10'
	        	})
	        	this.axios.post('rmUser/getLog',params).then((res)=>{
	      			if(res.code == 200){
	      				if(res.data != null){
	      					this.logtable = res.data
	      					for (var i = 0; i < this.logtable.length; i++) {
			            		this.logtable[i].logtime = this.logtable[i].operDate;
			            		this.logtable[i].logid = this.logtable[i].jobNo;
			            		this.logtable[i].loguser = this.logtable[i].name;
			            		this.logtable[i].logip = this.logtable[i].ip;
			            		this.logtable[i].log = this.logtable[i].des;
			    			}
			    			if(this.logtable.length < 10){
			    				this.isClick = false
			    			} else{
			    				this.isClick = true
			    			}
	      				} else{
	      					this.pageNumber = this.pageNumber - 1
	      					this.isClick = false
	      				}
	      			}
				})
	      	}
	    },
	    created(){
	    	Bus.$on('logtableData', (data) => {
	    		this.ischange = data
				this.logtable = [];
	            this.logtable = data == undefined?[]:data;
	            if(this.logtable.length != 0){
	            	for (var i = 0; i < this.logtable.length; i++) {
	            		this.logtable[i].logtime = this.logtable[i].operDate;
	            		this.logtable[i].logid = this.logtable[i].jobNo;
	            		this.logtable[i].loguser = this.logtable[i].name;
	            		this.logtable[i].logip = this.logtable[i].ip;
	            		this.logtable[i].log = this.logtable[i].des;
	    			}
	    			if(this.logtable.length < 10){
	    				this.isClick = false
	    			} else{
	    				this.isClick = true
	    			}
	         	}
	        })
	    },
	    watch:{
	    	ischange(){
	    		this.pageNumber = 1
	    	}
	    }
  	}
</script>

<style>
	#loglist .cell{
		white-space:pre-line!important;
	}
	.el-table__body-wrapper{
		background: #fff;
	}
	.el-pagination{
		text-align: center;
		padding-bottom: 50px;
		border: 0;
		margin-top: 20px;
	}
	.el-table::before{
		height:0;
	}
	.el-table th{
		background: #f9f9f9;
		text-align: center;
	}
	.el-table .cell{
		text-align: center;
	}
	.el-dropdown {
	    vertical-align: top;
	}
	.el-dropdown + .el-dropdown {
	    margin-left: 15px;
	}
	.el-icon-arrow-down {
	    font-size: 12px;
	}
	.el-pagination button, .el-pagination span:not([class*=suffix]){
		padding:0 5px;
		font-size: 12px;
	}
	.moreBtn,.detailBtn{
		color: #4285F4;
		padding: 0 2px;
	}
	.detailBtn:hover,.moreBtn:hover{
		cursor: pointer;
	}
	.el-dropdown-menu--mini{
		width: 80px;
		text-align: center;
	}
	.jumpA{
		color: #fff;
	}
	.col-gray{
		color: #C0C4CC!important
	}
	#loglist table tr:last-child td{
		border-bottom: none
	}
	#loglist .el-table::before{
		background-color: transparent!important
	}
	#loglist .textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
