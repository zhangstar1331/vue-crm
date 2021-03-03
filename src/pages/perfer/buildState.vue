<template>
  <div>
		<v-base :detailData = 'detailData'></v-base> 	
  	<prefer-state :detailData = 'detailData' @fatherMethod="getDetail"></prefer-state>
  </div>
</template>
<script>
	import preferState from 'src/components/perferCom/preferState'
	import vBase from 'src/components/perferCom/fxBase'
	import qs from 'qs'
	export default{
		created(){
			this.clearSession()
			//获取对应详情
			let id = this.$route.query.id;
			if(id != undefined){
				this.getDetail(id)
			}
		},
		data() {
      return {
      	fxName:'新增风险偏好陈述',
      	detailData:'',
			}
	  },
  	components:{
  		preferState,
  		vBase
  	},
  	methods:{
  		clearSession(){
  			sessionStorage.removeItem('askData')
  			sessionStorage.removeItem('limitType')
  		},
  		getDetail(id){
  			if(this.$route.query.deFlag){
  					this.fxName = '风险偏好陈述详情'
	  				var params = qs.stringify({
						id:id,
						type:1 //1 详情 2维护
					})
  			}else{
	  			var params = qs.stringify({
						id:id,
						type:2 //1 详情 2维护
					})
  			}
  			this.axios.post('riskmana/detailspref',params).then((res)=>{
  					if(res.code == 200){
  						this.detailData = res.data;
  					}else{
  						this.$alert(res.message, '提示', {
			          confirmButtonText: '确定'
			        });
  					}
  			}).catch((response) => {
					this.$alert('操作失败', '提示', {
				          confirmButtonText: '确定'
				        });
				 })
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
