<template>
  <div class="render">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="dfTxtColor" :to="{path:'/cataloguePage?id=1_cdf'}">东方制度管理</el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor" v-if="panelShow">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    		<!--列表查询-->
	    	<el-tab-pane label="列表查询" name="first" :key="'first'" v-if="btnData.checkList">
	    			<!--查询组件-->
	    		<div class="box">
	    			<div class="titIcon"><em></em><span style="font-weight: 600;">筛选查询</span></div>
	    			<v-check v-if="isChildUpdate1" ></v-check>
	    		</div>

	    			<!--制度列表组件-->
	    		<div class="sysBox">
	    			<div class="titIcon"><em></em><span style="font-weight: 600;">制度列表</span></div>
	    			<v-sysList v-if="isChildUpdate1"></v-sysList>
	    		</div>

	    	</el-tab-pane>
				<!--全文检索-->
		    <el-tab-pane style="font-weight: 600;" v-if="btnData.textSearchBtn" label="全文检索" name="second" :key="'second'">
			    		<div class="box tbox">
			    			<div class="titIcon"><em></em><span>全文检索</span></div>
			    			<v-sysList v-if="isChildUpdate1"></v-sysList>
			    			<v-textSearch v-if="isChildUpdate2"></v-textSearch>
			    		</div>
		    </el-tab-pane>

		</el-tabs>
  </div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/check/dfCheck'
	import vSysList from 'src/components/sysList/dfSysList'
	import vTextSearch from 'src/components/textSearch/textSearch'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
  export default {
  	data() {
        return {
			    activeName: "first",
			    isChildUpdate1:true,
          isChildUpdate2:false,
          titMsg:"列表查询",
          panelShow:true,
          handleData:[],
          btnData:{
	        	textSearchBtn:false,
	        	checkList:false
	        }
			}
   },
    components:{
    		vCheck,
    		vSysList,
    		vTextSearch
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
    	Bus.$off("isCdf");
	    Bus.$on('isCdf', (data) => {
	        this.$alert('权限发生变化，请重新登录', '提示', {
	            confirmButtonText: '确定',
	            callback: action => {
	              this.axios.post('rmUser/authLogout').then((res)=>{
	                  if (res.code == 200) {
	                    this.$store.commit('SET_TOKEN', '');
	                    this.$store.commit('SET_USER', null);
	                    this.$router.replace({path: '/login'});
	                  } else {
	                    this.$alert(res.message, '提示', {
	                      confirmButtonText: '确定'
	                    });
	                  }
	              })
	            }
	          })
	    })
    	this.getData(this.$store.state.orgBtnData)
    	sessionStorage.setItem('type',3)
    	sessionStorage.setItem('flag',0)
    },
    methods:{
      returnTo(){
        this.activeName = 'first'
        this.handleClick({name:'first'})
        this.panelShow=false
      },
        handleClick(tab) {
            if(tab.name == "first") {
                this.isChildUpdate1 = true;
                this.isChildUpdate2 = false;
                this.titMsg = "列表查询"
            } else if(tab.name == "second") {
                this.isChildUpdate1 = false;
                this.isChildUpdate2 = true;
                this.titMsg = "全文检索"
            }
        },
       // 返回页面时加载数据
		   getData(aaa){
		    	this.handleData = aaa
		    	if(this.handleData !== undefined){
		    		if(this.handleData.indexOf('1_cdfl')>=0){
	            		this.btnData.checkList = true
	            	}else{
	            		this.btnData.checkList = false
	            	}
			  		if(this.handleData.indexOf('1_cdfs')>=0){
			  					if(!this.btnData.checkList){
			  						this.activeName = 'second'
			  						this.handleClick({name:'second'})
			  						this.panelShow=true
			  					}
	            		this.btnData.textSearchBtn = true
	            	}else{
	            		this.btnData.textSearchBtn = false
	            	}
	        }
		    }  
    }
  };
</script>
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
	    	border-top-right-radius: 8px;
	    }
	    #tab-second{
	    	background: #fff;
	    	width: 100px;
	    	border-top-left-radius: 8px;
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
    	font-weight: 700!important;
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
    .dfTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
