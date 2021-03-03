<template>
  	<div id="violationSend">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">合规信息管理</span></el-breadcrumb-item>
			<el-breadcrumb-item class="wgTxtColor">合规信息报送</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="草稿箱" name="first" :key="'first'" v-if="tab1">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">内部违规信息报送查询</span></div>
					<v-check :isFlag = '2' v-if="isChildUpdate1"></v-check>
				</div>
				<div class="sysBox">
					<div class="titIcon"><em></em><span style="font-weight: 600;">内部违规信息报送列表</span></div>
					<v-sysList :isFlag = '2' v-if="isChildUpdate1"></v-sysList>
				</div>
			</el-tab-pane>
			<el-tab-pane label="生效库" name="second" :key="'second'" v-if="tab2">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">内部违规信息报送查询</span></div>
					<v-check :isFlag = '1' v-if="isChildUpdate2"></v-check>
				</div>
				<div class="sysBox">
					<div class="titIcon"><em></em><span style="font-weight: 600;">内部违规信息报送列表</span></div>
					<v-sysList :isFlag = '1' v-if="isChildUpdate2"></v-sysList>
				</div>
			</el-tab-pane>
		</el-tabs>
  	</div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/infoManage/violationCheck'
	import vSysList from 'src/components/infoManage/violationList'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	titMsg:"内部违规信息报送",
        	activeName:'first',
        	tab1:true,
        	tab2:true,
        	isChildUpdate1:true,
	        isChildUpdate2:false
		}
   	},
   	components:{
		vCheck,
		vSysList
    },
    created(){
    	// 专报提交返回生效库
    	var path = sessionStorage.getItem('violationPath')
    	if(path == 1){
    		this.activeName = 'second'
    	} else {
    		this.activeName = 'first'
    	}
    	this.handleClick({name:this.activeName})
    	sessionStorage.removeItem('violationPath')
    },
    methods:{
    	handleClick(tab) {
	       if(tab.name == "first") {
	            this.isChildUpdate1 = true
	            this.isChildUpdate2 = false
	            // this.titMsg = "草稿箱"
	        } else if(tab.name == "second") {
	            this.isChildUpdate1 = false
	            this.isChildUpdate2 = true
	            // this.titMsg = "生效库"
	        }
	    }
  	},
  	beforeRouteLeave(to,from,next){
	    let arr = ['violationSpecialReport','violationDetail']
	    if(arr.indexOf(to.name)<0){
	      sessionStorage.removeItem("askData1");
	      sessionStorage.removeItem("askData2");
	    }
	    next()
	}
}    
</script>
<style lang="scss">
    #violationSend{
		#tab-first,#tab-second{
	      	background: #fff;
	      	width: 130px;
	      	border-top-left-radius: 8px;
	      	border-top-right-radius: 8px;
	      	border-right: 1px solid #E9E9E9;
	    }
    	.el-breadcrumb{
    		margin-bottom: 16px;
    		margin-top: 20px;
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
	      	min-height: 180px;
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
    }
</style>
