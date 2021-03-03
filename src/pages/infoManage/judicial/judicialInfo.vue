<template>
    <div id="judicialInfo">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><span style="color: #909191;font-weight: 700">合规信息管理</span></el-breadcrumb-item>
      <el-breadcrumb-item class="wgTxtColor">合规信息库</el-breadcrumb-item>
      <el-breadcrumb-item class="wgTxtColor" :to="{path:'/infoManage/judicial/index?id=1_hsfajxxk'}">{{titMsg}}</el-breadcrumb-item>
      <el-breadcrumb-item class="txtColor">涉刑案件信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box">
      <div class="titIcon"><em></em><span style="font-weight: 600;">涉刑案件信息库</span></div>
      <v-check :isFlag = '1' :isStore = '1'></v-check>
    </div>
    <div class="sysBox">
      <div class="titIcon"><em></em><span style="font-weight: 600;">涉刑案件信息库列表</span></div>
      <v-sysList :isFlag = '1' :isStore = '1'></v-sysList>
    </div>
    </div>
</template>
<script>
  import Bus from 'src/bus/bus.js'
  import vCheck from 'src/components/infoManage/justiceCheck'
  import vSysList from 'src/components/infoManage/justiceList'
  import {mapState} from 'vuex'
  import {getUrlKey} from 'src/utils/utils.js'
  import {formatDate} from 'src/utils/utils.js'
  import qs from 'qs'
    export default {
    data() {
        return {
          titMsg:"涉刑案件信息库",
    }
    },
    components:{
    vCheck,
    vSysList
    },
    created(){
      
    },
    methods:{
     
    },
    beforeRouteLeave(to,from,next){
        let arr = ['justiceSpecialReport','justiceDetail','judicialInfo']
        if(arr.indexOf(to.name)<0){
          sessionStorage.removeItem("askData1");
        }
        next()
    }
}    
</script>
<style lang="scss">
    #judicialInfo{
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
