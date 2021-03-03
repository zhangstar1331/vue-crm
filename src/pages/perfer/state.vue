<template>
  <div>
  	<el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
		  <el-breadcrumb-item><span style="color: #909191 !important;font-weight: 700 !important;">风险偏好管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor">风险偏好陈述管理</el-breadcrumb-item>
		</el-breadcrumb>
  	<state-list></state-list>
  </div>
</template>
<script>
	import stateList from 'src/components/perferCom/stateList'
	export default{
		created(){
			this.clearSession()
		},
		data() {
      return {
      	fxSaveData:{}  	
			}
	  },
  	components:{
  		stateList
  	},
  	methods:{
  		clearSession(){
  			sessionStorage.removeItem('askData')
  		}
  	}
	}
</script>
<style lang='scss'>
	.txtColor span{
    	  color: #4285F4 !important;
    		font-weight: 700 !important;
    }
  .is-link,.el-breadcrumb__inner {
    color: #909191 !important;
    font-weight: 700 !important;
	}  
</style>
