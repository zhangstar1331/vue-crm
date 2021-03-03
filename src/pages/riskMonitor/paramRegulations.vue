<template>
  <el-container id="newParams">
  <el-header class="header" style="padding-left:218px">
  	<el-row>
	  	<el-col :span="12">
		  	<el-breadcrumb separator-class="el-icon-arrow-right">
				  <el-breadcrumb-item><span class="textColor1">风险监测指标管理</span></el-breadcrumb-item>
				  <el-breadcrumb-item><span class="textColor1">指标管理</span></el-breadcrumb-item>
				  <el-breadcrumb-item :to="{path:'/riskMonitor/paramManage?id=1_icsgl'}"><span class="textColor1">参数管理</span></el-breadcrumb-item>
				  <el-breadcrumb-item><span class="textColor">{{msg}}</span></el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
			<el-col :span="9">
				<el-button type="primary" size="mini" @click="back">返回</el-button>
		  	<el-button type="primary" @click="submitAll" size="mini">提交</el-button>
		  </el-col>
	  </el-row>
  </el-header>
  <div class="box">
			<div class="titIcon fontWeight"><em></em><span>基础信息</span></div>
			<vCheck></vCheck>
	</div>
  </el-container>
</template>
<script>
	import vCheck from 'src/components/check/newParamCheck'
  export default {
  	data() {
        return {
        	saveAllData:{},
        	msg:'新建参数'
				}
   },
    components:{
    	vCheck
    },
    created(){
    	if(this.$route.query.editId){
    		this.msg = '编辑参数'
    	}
    },
    methods:{
        submitAll(){
        	const paramDatas = JSON.parse(sessionStorage.getItem('paramDatas'))
        	if(paramDatas.name == ''){
        			this.$alert('参数名称不能为空', '提示', {
					          confirmButtonText: '确定'
					        });
					        return;
        		}else if(paramDatas.unit == ''){
        			this.$alert('参数单位为空', '提示', {
					          confirmButtonText: '确定'
					        });
					        return;
        		}else if(paramDatas.source == ''){
        			this.$alert('参数来源不能为空', '提示', {
					          confirmButtonText: '确定'
					        });
					        return;
        		}
	        	this.axios.post('riskparam/addParamOrEdit',JSON.stringify(paramDatas),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	        		if(res.code == 200){
	        			this.$alert('提交成功', '提示', {
				          confirmButtonText: '确定',
				          callback: action => {
				            this.$router.push({
						        path:'/riskMonitor/paramManage',   //跳转的路径
						        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
									    	id:'111'    
							        }
									  })
				            if(sessionStorage.singleObj != undefined){
				            	sessionStorage.removeItem('singleObj')
				            }
				          }
				        });
	        		}else{
	        			this.$alert(res.message, '提示', {
					          confirmButtonText: '确定'
					        });
	        		}
        	})
        },
        back(){
        	this.$router.push({  //核心语句
			        path:'riskMonitor/paramManage',//跳转的路径
			        query:{
			        	id:'1_icsgl'
			        }
			      })
        }
    }
  };
</script>
<style lang="scss">
#newParams{
	.header{
		padding-left: 0;
    padding-right: 2.6%;
    padding-top: 15px;
    position: fixed;
    width: 100%;
    -webkit-box-shadow: 4px 2px 6px #888;
    height: 52px;
    top: 60px;
    left: 0;
    background: #fff;
    z-index: 99999;
		.el-breadcrumb{
			line-height: 30px;
		}
		.textColor1{
			color: #909191 !important;
    	font-weight: 700!important;
		}
		.textColor{
			color: #4285F4 !important;
    	font-weight: 700!important;
		}
		.el-col-9{
			float: right;
			text-align: right;
		}
	}
	.box{
    	background: #fff;
    	padding: 16px 16px 30px 16px;
    	-webkit-box-shadow: 4px 2px 6px #888;
    	margin-top: 70px;
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
}	

</style>
