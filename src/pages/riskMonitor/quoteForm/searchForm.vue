<template>
  	<div id="searchForm">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor">风险指标报表</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="风险指标报表-单期" name="first" :key="'first'" v-if="btnData.singleBtn">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">风险指标报表查询</span></div>
					<v-check :isFlag = '1' v-if="isChildUpdate1"></v-check>
				</div>
				<div class="sysBox">
					<div class="titIcon"><em></em><span style="font-weight: 600;">风险指标报表</span></div>
					<v-sysList :isFlag = '1' v-if="isChildUpdate1"></v-sysList>
				</div>
			</el-tab-pane>
			<el-tab-pane label="风险指标趋势" name="second" :key="'second'" v-if="btnData.trendBtn">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">风险指标报表查询</span></div>
					<t-check :isFlag = '2' v-if="isChildUpdate2"></t-check>
				</div>
				<div class="sysBox sysBox1">
					<div class="titIcon"><em></em><span style="font-weight: 600;">风险指标报表</span></div>
					<t-sysList :isFlag = '2' v-if="isChildUpdate2"></t-sysList>
				</div>
			</el-tab-pane>
		</el-tabs>
  	</div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/check/formSingleCheck'
	import tCheck from 'src/components/check/formTrendCheck'
	import vSysList from 'src/components/sysList/formSingleList'
	import tSysList from 'src/components/sysList/formTrendList'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	titMsg:"风险指标报表查询",
        	activeName:'first',
        	isChildUpdate1:true,
	        isChildUpdate2:false,
	        btnData:{
	        	singleBtn:false,
	        	trendBtn:false
	        }
		}
   	},
   	components:{
		vCheck,
		tCheck,
		vSysList,
		tSysList
    },
    computed:{
  		f1(){
  			return this.$store.state.orgBtnData
  		}
  	},
  	watch:{
  		f1(newdata,olddata){
  			this.getData(newdata)
  		}
  	},
    created(){
    	var path = sessionStorage.getItem('trendPath')
    	if(path == 1){
    		this.activeName = 'second'
    	} else {
    		this.activeName = 'first'
    	}
    	this.handleClick({name:this.activeName})
    	sessionStorage.removeItem('trendPath')
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	handleClick(tab) {
	       if(tab.name == "first") {
              sessionStorage.setItem('tabname', 1)
	            this.isChildUpdate1 = true
	            this.isChildUpdate2 = false
	            this.titMsg = "风险指标报表-单期"
	        } else if(tab.name == "second") {
              sessionStorage.setItem('tabname', 2)
	            this.isChildUpdate1 = false
	            this.isChildUpdate2 = true
	            this.titMsg = "风险指标趋势"
	        }
	    },
	    getData(handleData){
	    	if(handleData !== undefined){
	    		if(handleData.indexOf('1_ifxzbcxl')>=0){
            		this.btnData.singleBtn = true
            	}else{
            		this.btnData.singleBtn = false
            	}
		  		if(handleData.indexOf('1_ifxzbcxql')>=0){
  					if(!this.btnData.singleBtn){
  						this.activeName = 'second'
  						this.handleClick({name:'second'})
  					}
					this.btnData.trendBtn = true
            	}else{
            		this.btnData.trendBtn = false
            	}
	        }
		}
  	}
}    
</script>
<style lang="scss">
    #searchForm{
    	height:100%;
		#tab-first,#tab-second{
	      	background: #fff;
	      	width: 130px;
	      	border-top-left-radius: 8px;
	      	border-top-right-radius: 8px;
	      	border-right: 1px solid #E9E9E9;
	    }
    	.el-breadcrumb{
    		padding:20px 0 16px 0;
    	}
    	.el-tabs{
    		height:calc(100% - 56px)
    	}
    	.el-tabs__content{
    		height:calc(100% - 40px)
    	}
    	.el-tab-pane{
    		height:100%
    	}
    	.el-tabs__header{
	      	margin:0;
	    }
    	.el-table__empty-block{
    		background: #fff;
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
	    .el-breadcrumb__inner{
	    	color: #4285F4!important;
	    	font-weight: 700!important;
	    }
	    .is-link{
	    	color: #909191!important;
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
		.el-col{
			text-align:left
		}
		.box{
	      	min-height: 220px;
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
	    .sysBox,.sysBox1{
	      	background: #fff;
	      	height: calc(100% - 410px);
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
	    .sysBox1{
	      	height: calc(100% - 310px)!important;
	    }
    }
</style>
