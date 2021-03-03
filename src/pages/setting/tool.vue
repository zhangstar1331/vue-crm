<template>
  <div class="render">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
  		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
	  	<el-breadcrumb-item class="txtColor">管理工具</el-breadcrumb-item>
	</el-breadcrumb>
	<v-check :flag="1" title="指标新增追溯"></v-check>
	<v-check :flag="2" title="指标删除追溯"></v-check>
	<v-check :flag="3" title="指标修改追溯"></v-check>
	<v-check :flag="4" title="指标任务派发"></v-check>
  </div>
</template>
<script>
	import vCheck from 'src/components/check/toolCheck'
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
	  	data() {
	        return {
			}
	    },
	    components:{
    		vCheck
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
