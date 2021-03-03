<template>
  	<div id="focusForm">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="wgTxtColor"><span class="bread" @click="goBack">风险指标报表</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="再保人集中度报表" name="first" :key="'first'" v-if="btnData.reinsureBtn">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">集中度报表</span></div>
					<v-check :isFlag = '1' v-if="isChildUpdate1"></v-check>
					<v-sysList :isFlag = '1' v-if="isChildUpdate1"></v-sysList>
				</div>
			</el-tab-pane>
			<el-tab-pane label="投资集中度报表" name="second" :key="'second'" v-if="btnData.investBtn">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">集中度报表</span></div>
					<v-check :isFlag = '2' v-if="isChildUpdate2"></v-check>
					<t-sysList :isFlag = '2' v-if="isChildUpdate2"></t-sysList>
				</div>
			</el-tab-pane>
		</el-tabs>
  	</div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/check/formFocusCheck'
	import vSysList from 'src/components/sysList/formReinsureList'
	import tSysList from 'src/components/sysList/formInvestList'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	titMsg:"再保人集中度报表",
        	activeName:'first',
        	isChildUpdate1:true,
	        isChildUpdate2:false,
	        btnData:{
	        	reinsureBtn:false,
	        	investBtn:false
	        }
		}
   	},
   	components:{
		vCheck,
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
    	this.getData(this.$store.state.orgBtnData)
    },
    methods:{
    	handleClick(tab) {
	       if(tab.name == "first") {
              sessionStorage.setItem('tabname', 1)
	            this.isChildUpdate1 = true
	            this.isChildUpdate2 = false
	            this.activeName = 'first'
	            this.titMsg = "再保人集中度报表"
	        } else if(tab.name == "second") {
              sessionStorage.setItem('tabname', 2)
              this.activeName = 'second'
	          this.isChildUpdate1 = false
	          this.isChildUpdate2 = true
	          this.titMsg = "投资集中度报表"
	        }
	    },
	    getData(handleData){
	    	if(handleData !== undefined){
	    		if(handleData.indexOf('1_ijzdbbl')>=0){
            		this.btnData.reinsureBtn = true
            		if(this.$route.query.activeName == 'first'){
            			this.handleClick({name:'first'})
            		}
            	}else{
            		this.btnData.reinsureBtn = false
            	}
		  		if(handleData.indexOf('1_ijzdbbtl')>=0){
  					if(!this.btnData.reinsureBtn){
  						this.activeName = 'second'
  						this.handleClick({name:'second'})
  					}
  					if(this.$route.query.activeName == 'second'){
            			this.handleClick({name:'second'})
            		}
  					this.btnData.investBtn = true
            	}else{
            		this.btnData.investBtn = false
            	}
        	}
	    },
	    goBack(){
	    	if(this.$route.query.id=='1_ijzdbb' && this.$route.query.activeName == 'second'){
	    		this.$router.push({
	    			path:'/riskMonitor/focusAssignment',
	    			query:{
	    				id:'1_ijzdfp'
	    			}
	    		})
	    	}else{
	    		this.$router.push({
	    			path:'/riskMonitor/quoteForm/focusForm',
	    			query:{
	    				id:'1_ijzdbb'
	    			}
	    		})
	    	}
	    },
	    getHandleData(){
	    	if(sessionStorage.getItem('jzdhandleData')!==undefined){
      			var handleData = sessionStorage.getItem('jzdhandleData')
      			if(handleData.indexOf('1_ijzdbbl')>=0){
            		this.btnData.reinsureBtn = true
            		if(this.$route.query.activeName == 'first'){
            			this.handleClick({name:'first'})
            		}
            	}else{
            		this.btnData.reinsureBtn = false
            	}
		  		if(handleData.indexOf('1_ijzdbbtl')>=0){
  					if(!this.btnData.reinsureBtn){
  						this.activeName = 'second'
  						this.handleClick({name:'second'})
  					}
  					if(this.$route.query.activeName == 'second'){
            			this.handleClick({name:'second'})
            		}
  					this.btnData.investBtn = true
            	}else{
            		this.btnData.investBtn = false
            	}
  			}
	    },
  	},
  	beforeRouteEnter (to, from, next) {
		next((that) => {
		    if(from.fullPath.includes('/focusAssignment')){
          		that.getHandleData()
		    }
		})
    }
}    
</script>
<style lang="scss">
    #focusForm{
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
		.bread:hover{
			cursor: pointer;
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
    }
</style>
