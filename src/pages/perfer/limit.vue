<template>
  <div>
  	<el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
		  <el-breadcrumb-item><span style="color: #909191 !important;font-weight: 700 !important">风险偏好管理</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor">风险限额管理</el-breadcrumb-item>
		</el-breadcrumb>
		<limit-list></limit-list>
  </div>
</template>
<script>
	import limitList from 'src/components/perferCom/limitList'
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
  		limitList
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
