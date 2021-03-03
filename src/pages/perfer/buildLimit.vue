<template>
  <div>
		<v-base :detailData = 'detailData'></v-base> 	
  		<org-tree :detailData = 'detailData' @fatherMethod = 'getDetail'></org-tree>
  </div>
</template>
<script>
	import orgTree from 'src/components/perferCom/orgTree'
	import vBase from 'src/components/perferCom/fxBase'
	import qs from 'qs'
	export default{
		created(){
			this.clearSession()
			//获取对应详情
			let id = this.$route.query.id;
			if(id != undefined){
				this.fxName = '维护风险限额'
				this.getDetail(id)
			}
		},
		data() {
     	 return {
      		fxName:'新增风险限额',
      		detailData:'',
     	  }
	  },
  	components:{
  		orgTree,
  		vBase
  	},
  	methods:{
  		clearSession(){
  			sessionStorage.removeItem('askData')
  			sessionStorage.removeItem('stateType')
  		},
  		getDetail(id){
  			if(this.$route.query.deFlag){
  					this.fxName = '风险限额详情'
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
  			this.axios.post('riskmana/detailsquo',params).then((res)=>{
  					if(res.code == 200){
  						this.detailData = res.data;
  					}else{
  						this.$alert(res.data, '提示', {
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
