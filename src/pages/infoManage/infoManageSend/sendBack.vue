<template>
    <div id="sendBack">
      	<el-breadcrumb separator-class="el-icon-arrow-right">
	      	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">合规信息管理</span></el-breadcrumb-item>
	      	<el-breadcrumb-item class="wgTxtColor">合规信息报送</el-breadcrumb-item>
	      	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
	    </el-breadcrumb>
    	<el-tabs v-model="activeName" @tab-click="handleClick">
    		<el-tab-pane v-for="(item,index) in tabList" :label="item.name" :name="item.limit" :key="item.limit">
    			<div class="box">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">{{sendName}}报送查询</span></div>
		          	<component :key="index" :is='item.name1' :isFlag = '1' :isSend = '1' v-if="activeName == item.limit" @changeSessionStorage="changeSessionStorage" :checkList="checkList[index]"></component>
		        </div>
		        <div class="sysBox">
		          	<div class="titIcon"><em></em><span style="font-weight: 600;">{{sendName}}报送列表</span></div>
		          	<component :key="index" :is='item.name2' :isFlag = '1' :isSend = '1' v-if="activeName == item.limit"></component>
		        </div>
    		</el-tab-pane>
    	</el-tabs>
    </div>
</template>
<script>
  import Bus from 'src/bus/bus.js'
  import vCheck1 from 'src/components/infoManage/superviseCheck'
  import vCheck2 from 'src/components/infoManage/punishCheck'
  import vCheck3 from 'src/components/infoManage/justiceCheck'
  import vCheck4 from 'src/components/infoManage/violationCheck'
  import vCheck5 from 'src/components/infoManage/accountCheck'
  import vCheck6 from 'src/components/infoManage/caseCheck'
  import vSysList1 from 'src/components/infoManage/superviseList'
  import vSysList2 from 'src/components/infoManage/punishList'
  import vSysList3 from 'src/components/infoManage/justiceList'
  import vSysList4 from 'src/components/infoManage/violationList'
  import vSysList5 from 'src/components/infoManage/accountList'
  import vSysList6 from 'src/components/infoManage/caseList'
  import {mapState} from 'vuex'
  import {getUrlKey} from 'src/utils/utils.js'
  import {formatDate} from 'src/utils/utils.js'
  import qs from 'qs'
    export default {
    data() {
        return {
          	titMsg:"合规报送信息管理",
          	activeName:'first',
          	sendName:'监管检查事项信息',
            checkList:[],
          	tabList:[{
	        	name:'监管检查事项信息',
	        	name1:'vCheck1',
	        	name2:'vSysList1',
	          	limit:'first'
	        },{
	          	name:'监管处罚信息',
	          	name1:'vCheck2',
	        	name2:'vSysList2',
	          	limit:'second'
	        },{
	          	name:'涉刑案件信息',
	          	name1:'vCheck3',
	        	name2:'vSysList3',
	          	limit:'third'
	        },{
	          	name:'内部违规信息',
	          	name1:'vCheck4',
	        	name2:'vSysList4',
	          	limit:'fourth'
	        },{
	          	name:'问责信息',
	          	name1:'vCheck5',
	        	name2:'vSysList5',
	          	limit:'firth'
	        },{
              name:'案件风险事件',
              name1:'vCheck6',
            name2:'vSysList6',
              limit:'sixth'
          }]
    	}
    },
    components:{
      vCheck1,
      vCheck2,
      vCheck3,
      vCheck4,
      vCheck5,
      vCheck6,
      vSysList1,
      vSysList2,
      vSysList3,
      vSysList4,
      vSysList5,
      vSysList6
    },
    created(){
    	var path = sessionStorage.getItem('sendBackPath')
    	this.activeName = path?path:'first'
      sessionStorage.removeItem('sendBackPath')
      this.getCheckList()
    },
    methods:{
      	handleClick(tab) {
      		this.activeName = tab.name
      		this.sendName = tab.label
          this.getCheckList()
          sessionStorage.removeItem("askData1");
        },
        changeSessionStorage(data){
          this.checkList[data.no] = data.data
          sessionStorage.setItem('checkList',JSON.stringify(this.checkList))
        },
        getCheckList(){
          if(JSON.parse(sessionStorage.getItem('checkList'))){
            var checkList = JSON.parse(sessionStorage.getItem('checkList'))
            for(var i =0;i<checkList.length;i++){
               this.checkList[i] = checkList[i]
            }
           
          }
        }
    },
    beforeRouteLeave(to,from,next){
        let arr = ['superviseDetail','punishDetail','justiceDetail','violationDetail','accountDetail','caseDetail','sendBack']
        if(arr.indexOf(to.name)<0){
          sessionStorage.removeItem("askData1");
          sessionStorage.removeItem("checkList");
        } else{
          sessionStorage.setItem('checkList',JSON.stringify(this.checkList))
        }
        next()
    }
}    
</script>
<style lang="scss">
    #sendBack{
    	.el-tabs__item{
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
    .box,.box1{
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
      .box1{
          min-height: 180px!important;
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
