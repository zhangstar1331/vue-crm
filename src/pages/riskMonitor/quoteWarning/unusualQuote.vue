<template>
  	<div id="sendAssign">
	    <el-breadcrumb separator-class="el-icon-arrow-right">
	      	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险监测指标管理</span></el-breadcrumb-item>
    			<el-breadcrumb-item class="wgTxtColor">风险提示</el-breadcrumb-item>
    			<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
	    </el-breadcrumb>
	    <el-tabs v-model="activeName" @tab-click="handleClick">
	      	<el-tab-pane label="本期异常指标报表" name="first" :key="'first'" v-if="btnData.unusualbtn">
		        <div class="box">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">风险提示查询</span></div>
		          	<v-check :isFlag = '1' v-if="isChildUpdate1"></v-check>
		        </div>
		        <div class="sysBox">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">风险提示列表</span></div>
		          	<v-sysList :isFlag = '1' v-if="isChildUpdate1" :showRecord="showRecord"></v-sysList>
		        </div>
	     	</el-tab-pane>
	      	<el-tab-pane label="异常指标趋势" style="font-weight: 600" name="second" :key="'second'" v-if="btnData.trendbtn">
		        <div class="box tbox" style="padding-bottom: 0;">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">风险提示查询</span></div>
		          	<v-check1 :isFlag = '2' v-if="isChildUpdate2" ></v-check1>
		        </div>
		        <div class="sysBox">
		          	<div class="titIcon"><em></em><span style="font-weight: 600">风险提示列表</span></div>
		        	<t-sysList :isFlag = '2' v-if="isChildUpdate2" :showRecord="showRecord"></t-sysList>
		        </div>
		    </el-tab-pane>
	    </el-tabs>
  	</div>
</template>
<script>
  	import Bus from 'src/bus/bus.js'
  	import vCheck from 'src/components/check/unusualCheck'
  	import vCheck1 from 'src/components/check/trendCheck'
  	import vCheck2 from 'src/components/check/historyCheck'
  	import vSysList from 'src/components/sysList/quoteWarnList'
  	import tSysList from 'src/components/sysList/quoteTrendList'
  	import qs from 'qs'
  	import {mapActions} from 'vuex'
  	import {getUrlKey} from 'src/utils/utils.js'
  	export default {
	    data() {
	      return {
	      	showRecord:'1',
	      	flag:1,
	        activeName: "first",
	        isChildUpdate1:true,
	        isChildUpdate2:false,
	        titMsg:"异常指标列表",
	        tabname:'',
          btnData:{
            unusualbtn:false,
            trendbtn:false
          }
	      }
	    },
	    components:{
  			vCheck,
  			vCheck1,
  			vCheck2,
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
	            this.isChildUpdate1 = true;
	            this.isChildUpdate2 = false;
	            this.isChildUpdate3 = false;
	        } else{
              sessionStorage.setItem('tabname', 2)
	            this.isChildUpdate1 = false;
	            this.isChildUpdate2 = true;
	            this.isChildUpdate3 = false;
	        }
	      },
        getData(handleData){
          if(handleData !== undefined){
            if(handleData.indexOf('1_ihhlyczblbl')>=0){
              this.btnData.unusualbtn = true
            }else{
              this.btnData.unusualbtn = false
            }
            if(handleData.indexOf('1_ihhlyczblql')>=0){
              if(!this.btnData.unusualbtn){
                this.activeName = 'second'
                this.handleClick({name:'second'})
              }
              this.btnData.trendbtn = true
            }else{
              this.btnData.trendbtn = false
            }
          }
        }
	    },
      beforeRouteEnter (to, from, next) {
        next((that) => {
          if(from.path == '/checkAssign'){
            var path = sessionStorage.getItem('path')
            var active = ''
            if(path == '0'){
              path = 'three'
            } else if(path == '1'){
              path = 'first'
            } else if(path == '2'){
              path = 'second'
            }
            that.activeName = path || 'first'
            that.handleClick({name:that.activeName})
          }
          }
        )
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
      width: 140px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-right: 1px solid #E9E9E9;
    }
    #tab-second{
      background: #fff;
      width: 140px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-right: 1px solid #E9E9E9;
    }
    #tab-three{
      background: #fff;
      width: 140px;
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
