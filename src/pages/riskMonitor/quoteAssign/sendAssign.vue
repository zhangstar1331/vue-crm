<template>
  	<div id="sendAssign">
	    <el-breadcrumb separator-class="el-icon-arrow-right">
	      	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
    			<el-breadcrumb-item class="wgTxtColor">指标分配</el-breadcrumb-item>
    			<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
	    </el-breadcrumb>
	    <el-tabs v-model="activeName" @tab-click="handleClick">
	      	<el-tab-pane label="已报送" name="first" :key="'first'" v-if="tab1">
		        <div class="box">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">指标分配</span></div>
		          	<v-check :isFlag = '1' v-if="isChildUpdate1"></v-check>
		        </div>
		        <div class="sysBox">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">已报送列表</span></div>
		          	<v-sysList :isFlag = '1' v-if="isChildUpdate1" :showRecord="showRecord"></v-sysList>
		        </div>
	     	</el-tab-pane>
	       	<el-tab-pane label="报送中" style="font-weight: 600" name="second" :key="'second'" v-if="tab2">
		        <div class="box tbox" style="padding-bottom: 0;">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">指标分配</span></div>
		        	  <v-check :isFlag = '2' v-if="isChildUpdate2"></v-check>
		        </div>
		        <div class="sysBox">
		          	<div class="titIcon"><em></em><span style="font-weight: 600">报送中列表</span></div>
		          	<v-sysList :isFlag = '2' v-if="isChildUpdate2" :showRecord="showRecord"></v-sysList>
		        </div>
		    </el-tab-pane>
	      	<el-tab-pane label="未报送" style="font-weight: 600" name="three" :key="'three'" v-if="tab3">
		        <div class="box tbox" style="padding-bottom: 0;">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">指标分配</span></div>
		          	<v-check :isFlag = '3' v-if="isChildUpdate3" ></v-check>
		        </div>
		        <div class="sysBox">
		          	<div class="titIcon"><em></em><span style="font-weight: 600">未报送列表</span></div>
		        	<v-sysList :isFlag = '3' v-if="isChildUpdate3" :showRecord="showRecord"></v-sysList>
		        </div>
		    </el-tab-pane>
	    </el-tabs>
  	</div>
</template>
<script>
  	import Bus from 'src/bus/bus.js'
  	import vCheck from 'src/components/check/quoteAssignCheck'
  	import vSysList from 'src/components/sysList/zbList'
  	import qs from 'qs'
  	import {mapActions} from 'vuex'
  	import {getUrlKey} from 'src/utils/utils.js'
  	export default {
	    data() {
	      return {
	      	showRecord:'1',
	      	flag:1,
	        activeName: "first",
          tab1:true,
          tab2:true,
          tab3:true,
	        isChildUpdate1:true,
	        isChildUpdate2:false,
	        isChildUpdate3:false,
	        titMsg:"已报送",
	        tabname:''
	      }
	    },
	    components:{
  			vCheck,
  			vSysList
	    },
	    created(){
	    	var path = sessionStorage.getItem('path')
        if(path == '0'){
          path = 'three'
        } else if(path == '1'){
          path = 'first'
        } else if(path == '2'){
          path = 'second'
        }
        this.activeName = path || 'first'
        this.handleClick({name:this.activeName})
        sessionStorage.removeItem('path')
	    },
	    methods:{
	      handleClick(tab) {
	       if(tab.name == "first") {
              sessionStorage.setItem('tabname', 1)
	            this.isChildUpdate1 = true;
	            this.isChildUpdate2 = false;
	            this.isChildUpdate3 = false;
	            this.titMsg = "已报送"
	        } else if(tab.name == "second") {
              sessionStorage.setItem('tabname', 2)
	            this.isChildUpdate1 = false;
	            this.isChildUpdate2 = true;
	            this.isChildUpdate3 = false;
	            this.titMsg = "报送中"
	        } else if(tab.name == "three") {
            sessionStorage.setItem('tabname', 3)
	            this.isChildUpdate1 = false;
	            this.isChildUpdate2 = false;
	            this.isChildUpdate3 = true;
	            this.titMsg = "未报送"
	        }
	      },
	    }
  	};

</script>
<style lang="scss">
  #sendAssign{
    .el-breadcrumb{
      margin-bottom: 16px;
      margin-top: 20px;
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
      border-right: 1px solid #E9E9E9;
    }
    #tab-second{
      background: #fff;
      width: 100px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-right: 1px solid #E9E9E9;
    }
    #tab-three{
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
</style>
