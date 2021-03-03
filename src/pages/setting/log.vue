<template>
  <div class="render">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
  		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor">日志管理</el-breadcrumb-item>
	  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
	</el-breadcrumb>
	<!--查询组件-->
	<div class="box">
		<div class="titIcon"><em></em><span style="font-weight: 600;">日志管理</span></div>
		<v-check :flag="flag" v-if="isChildUpdate1"></v-check>
		<!--制度列表组件-->
		<v-sysList v-if="isChildUpdate1"></v-sysList>
	</div>
  </div>
</template>
<script>
	import vCheck from 'src/components/check/logCheck'
	import vSysList from 'src/components/sysList/logList'
  	export default {
	  	data() {
	        return {
	        	flag:0,
			    activeName: "first",
			    isChildUpdate1:true,
	          	isChildUpdate2:false,
	          	titMsg:"日志列表"
			}
	    },
	    components:{
    		vCheck,
    		vSysList
	    },
	    created(){
	    	
	    },
	    methods:{
	        
	    }
  	};
</script>
<style>
	.render .el-breadcrumb__inner{		
    	color: #4285F4!important;
    	font-weight: 700!important;
    }		
    .render .is-link{		
    	color: #909191!important;		
    }
    .render .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss">
    .render{
    	.el-breadcrumb{
	    		margin-bottom: 16px;
	    		margin-top: 20px;
	    	}
	    	.box{
		    	min-height: 250px;
		    	background: #fff;
		    	padding: 16px 16px 0 16px;
		    	-webkit-box-shadow: 4px 2px 6px #888;
		    	margin-top: 2px;
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
	    .sysBox{
	    	background: #fff;
	    	min-height: 250px;
	    	padding: 16px 16px 0 16px;
	    	-webkit-box-shadow: 2px 2px 10px #888;
	    	border-radius: 8px;
	    	margin-top: 23px;
	    	.titIcon{
	    		font-size:14px;
	    		margin-bottom:30px;
	    		float: left;
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
	    }
	    #tab-second{
	    	background: #fff;
	    	width: 100px;
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
    }
    .el-breadcrumb__inner{
    	color: #4285F4!important;
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
</style>
