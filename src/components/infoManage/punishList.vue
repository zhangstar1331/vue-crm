<template>
    <div id="lossSendList">
        <el-button type="primary" @click.native="goSpecialReport" class="dealBtn" v-if="this.isFlag == 2&&btnData.specialbtn">专报</el-button>
        <el-button type="primary" @click.native="goSeasonReport" class="dealBtn" v-if="this.isFlag == 2&&btnData.seasonbtn">季报</el-button>
        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
            <el-table-column type="index" label="序号" align="center" width="80" v-if="this.isFlag == 2"></el-table-column>
            <el-table-column prop="sn" label="监管处罚信息编号" align="center" width="150" v-if="this.isFlag == 1 || this.isFlag == 3 || this.isSend == 1">
                <template slot-scope="scope">
                    <span :title="scope.row.sn" class="textOverFlow">{{scope.row.sn == null||scope.row.sn == ''?'--':scope.row.sn}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pt" label="处罚类型" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.pt == null||scope.row.pt == ''?'--':puninshType[scope.row.pt]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ov" label="处罚概述" align="center" width="200" v-if="this.isFlag == 2">
                <template slot-scope="scope">
                    <span :title="scope.row.ov" class="textOverFlow">{{scope.row.ov == null||scope.row.ov == ''?'--':scope.row.ov}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ov" label="处罚概述" align="center" width="200" v-if="this.isFlag == 1&&!this.isStore&&!this.isSend">
                <template slot-scope="scope">
                    <span :title="scope.row.ov" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn">{{scope.row.ov == null||scope.row.ov == ''?'--':scope.row.ov}}</span>
                    <span :title="scope.row.ov" class="textOverFlow" v-else>{{scope.row.ov == null||scope.row.ov == ''?'--':scope.row.ov}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ov" label="处罚概述" align="center" width="200" v-if="this.isFlag == 3&&!this.isStore&&!this.isSend">
                <template slot-scope="scope">
                    <span :title="scope.row.ov" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)">{{scope.row.ov == null||scope.row.ov == ''?'--':scope.row.ov}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ov" label="处罚概述" align="center" width="200" v-if="this.isStore == 1">
                <template slot-scope="scope">
                    <span :title="scope.row.ov" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn1">{{scope.row.ov == null||scope.row.ov == ''?'--':scope.row.ov}}</span>
                    <span :title="scope.row.ov" class="textOverFlow" v-else>{{scope.row.ov == null||scope.row.ov == ''?'--':scope.row.ov}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="处罚事由" align="center" width="200" v-if="this.isSend == 1">
                <template slot-scope="scope">
                    <span :title="scope.row.name" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="zt" label="实施主体类型" align="center" v-if="this.isSend == 1">
                <template slot-scope="scope">
                    <span>{{scope.row.zt == null||scope.row.zt == ''?'--':subject[scope.row.zt]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="org" label="被处罚机构" align="center" v-if="this.isSend == 1">
                <template slot-scope="scope">
                  <div v-if="scope.row.org">
                    <p v-for="(item,index) in scope.row.org" v-if="index == 0">
                      <span :title="scope.row.org" class="textOverFlow">
                      {{item}}
                      <!-- {{scope.row.org == null||scope.row.org == ''?'--':scope.row.org}}--> 
                      </span>
                      <span v-if="scope.row.org.length>1">...</span>
                    </p>
                  </div>
                  <div v-else>--</div>
                </template>
            </el-table-column>
            <el-table-column prop="lkDate" label="处罚决定书落款时间" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.lkDate == null||scope.row.lkDate == ''?'--':scope.row.lkDate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sd" label="报送时间" align="center" v-if="this.isFlag == 1||this.isFlag == 3||this.isSend == 1">
                <template slot-scope="scope">
                    <span>{{scope.row.sd == null||scope.row.sd == ''?'--':scope.row.sd}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="bs,rs,ds,as" label="操作" align="center" width="200" v-if="this.isFlag == 2">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
                <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.editbtn">编辑</span>
                <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.submitbtn">提交</span>
                <span class="handleBtn detailBtn" @click="goDelete(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.deletebtn">删除</span>
              </template>
            </el-table-column>
            <el-table-column prop="bs,rs,ds,as" label="操作" align="center" width="200" v-if="this.isFlag == 1&&!this.isStore&&!this.isSend">
              <template slot-scope="scope">
                <span :class="{'handleBtn detailBtn redFont':scope.row.bs == 0,'handleBtn detailBtn':scope.row.bs == 1}" @click="goDfend(scope.$index, scope.row,0)" style="color: #4285F4;" v-if="btnData.editbtn">基本信息</span>
                <span :class="{'handleBtn detailBtn redFont':scope.row.as == 0,'handleBtn detailBtn':scope.row.as == 1}"@click="goDfend(scope.$index, scope.row,1)" style="color: #4285F4;" v-if="btnData.editbtn">整改情况</span>
                <span :class="{'handleBtn detailBtn redFont':scope.row.ds == 0,'handleBtn detailBtn':scope.row.ds == 1}" @click="goDfend(scope.$index, scope.row,2)" style="color: #4285F4;" v-if="btnData.editbtn">问责情况</span>
              </template>
            </el-table-column>
            <el-table-column prop="bs,rs,ds,as" label="操作" align="center" width="200" v-if="this.isStore == 1">
              <template slot-scope="scope">
                <span :class="{'handleBtn detailBtn redFont':scope.row.bs == 0,'handleBtn detailBtn':scope.row.bs == 1}" @click="goDetail(scope.$index, scope.row,0)" style="color: #4285F4;" v-if="btnData.detailbtn1">基本信息</span>
                <span :class="{'handleBtn detailBtn redFont':scope.row.as == 0,'handleBtn detailBtn':scope.row.as == 1}"@click="goDetail(scope.$index, scope.row,1)" style="color: #4285F4;" v-if="btnData.detailbtn1">整改情况</span>
                <span :class="{'handleBtn detailBtn redFont':scope.row.ds == 0,'handleBtn detailBtn':scope.row.ds == 1}" @click="goDetail(scope.$index, scope.row,2)" style="color: #4285F4;" v-if="btnData.detailbtn1">问责情况</span>
              </template>
            </el-table-column>
            <el-table-column prop="bs,rs,ds,as" label="操作" align="center" width="240" v-if="this.isFlag == 3">
              <template slot-scope="scope">
                <span :class="{'handleBtn detailBtn redFont':scope.row.bs == 0,'handleBtn detailBtn':scope.row.bs == 1}" @click="goDetail(scope.$index, scope.row,0)" style="color: #4285F4;">基本信息</span>
                <span :class="{'handleBtn detailBtn redFont':scope.row.as == 0,'handleBtn detailBtn':scope.row.as == 1}"@click="goDetail(scope.$index, scope.row,1)" style="color: #4285F4;">整改情况</span>
                <span :class="{'handleBtn detailBtn redFont':scope.row.ds == 0,'handleBtn detailBtn':scope.row.ds == 1}" @click="goDetail(scope.$index, scope.row,2)" style="color: #4285F4;">问责情况</span>
              </template>
            </el-table-column>
            <el-table-column prop="bs,rs,ds,as" label="操作" align="center" width="100" v-if="this.isSend == 1">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goRollback(scope.$index, scope.row)" style="color: #4285F4;">退回</span>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
    </div>
</template>

<script>
  import Bus from 'src/bus/bus.js'
  import {mapState} from 'vuex'
  import {getUrlKey} from 'src/utils/utils.js'
  import qs from 'qs'
  export default {
    props:['isFlag','isStore','isSend'],
    data() {
      return {
        currentPage:1,
        tableData4:[],
        totalResults:0,
        subject:{
          '1':'银保监系统',
          '2':'人民银行',
          '3':'财政部',
          '4':'审计署',
          '5':'其他'
        },
        discoverWay:{
          '1':'外部检查',
          '2':'上级检查',
          '3':'公司自查',
          '4':'客户投诉',
          '5':'举报',
          '6':'其他'
        },
        btnData:{   //按钮显示隐藏
          specialbtn: false,
          seasonbtn: false,
          detailbtn: false,
          detailbtn1: false,
          editbtn: false,
          submitbtn: false,
          deletebtn: false,
        },
        puninshType:{
          '1':'行政处罚',
          '2':'监管函',
          '3':'行政监管措施',
          '4':'监管意见书',
          '5':'其他'
        },
      }
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
      //获取数据判断是否显示更多操作
      Bus.$off('formDatas')
      Bus.$on('formDatas', (data) => {
        this.totalResults = data.totalResults == undefined?1:data.totalResults;
        this.tableData4 = [];
        this.tableData4 = data.data == undefined?[]:data.data;
        this.currentPage = data.currentPage == undefined?1:data.currentPage;
      })
      this.getData(this.$store.state.orgBtnData)
    },
    methods: {
       // 权限
      getData(handleData){
        if(handleData !== undefined){
              if(handleData.indexOf('1_hjgcfxxbsj')>=0){//季报
                this.btnData.seasonbtn = true
              }else{
                this.btnData.seasonbtn = false
              }
              if(handleData.indexOf('1_hjgcfxxbsz')>=0){//专报
                this.btnData.specialbtn = true
              }else{
                this.btnData.specialbtn = false
              }
              if(handleData.indexOf('1_hjgcfxxbsd')>=0){//详情
                this.btnData.detailbtn = true
              }else{
                this.btnData.detailbtn = false
              }
              if(handleData.indexOf('1_hjgcfxxbse')>=0){//编辑
                this.btnData.editbtn = true
              }else{
                this.btnData.editbtn = false
              }
              if(handleData.indexOf('1_hjgcfxxbss')>=0){//提交
                this.btnData.submitbtn = true
              }else{
                this.btnData.submitbtn = false
              }
              if(handleData.indexOf('1_hjgcfxxbsw')>=0){//删除
                this.btnData.deletebtn = true
              }else{
                this.btnData.deletebtn = false
              }
              if(handleData.indexOf('1_hjgjccfxxkcd')>=0){//信息库详情
                this.btnData.detailbtn1 = true
              }else{
                this.btnData.detailbtn1 = false
              }
            }
      }, 
      // 季报
      goSeasonReport(){
          this.$router.push({
            path:'/punishSeasonReport',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              id: this.$route.query.id
            }
          })
      },
      // 专报
      goSpecialReport(){
          this.$router.push({
            path:'/punishSpecialReport',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              id: this.$route.query.id
            }
          })
      },
      refresh(){
         var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
         this.axios.post('penalize/query',JSON.stringify(askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
            if(res.code == 200){
              if(res.data != null){
                this.totalResults = res.data.totalResults
                this.tableData4 = []
                this.tableData4 = res.data.data == undefined?[]:res.data.data
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
      },
      handleSizeChange (value) {
          var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
          askData.pageNo = value;
          sessionStorage.setItem('askData'+this.isFlag,JSON.stringify(askData))
          this.refresh()
      },
      handleCurrentChange (value) {
          var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
          askData.pageNo = value;
          sessionStorage.setItem('askData'+this.isFlag,JSON.stringify(askData))
          //下一页请求数据
          this.refresh()
      },
      // 详情
      goDetail(index,row,val){
          var flag = 0
          if(this.isFlag == 1){//生效库
            flag = 1
          } else{//草稿
            flag = 0
          }
          var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
          this.$router.push({
            path:'/punishDetail',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              infoId:row.id,
              flag:flag,
              step:val,
              belongCompany:this.$route.query.belongCompany,
              company:this.$route.query.company,
              id: this.$route.query.id
            }
          })
      },
      // 退回
      goRollback(index,row){
        this.$prompt('请输入退回原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '返回',
            inputPattern:/\S/,
            inputErrorMessage:'退回原因不能为空'
        }).then(({ value }) => {
            this.axios.post('penalize/rollback',qs.stringify({id:row.id,msg:value})).then((res)=>{
            if(res.code == 200){
                this.$alert('退回成功', '提示', {
                    confirmButtonText: '确定',
                    callback:action=>{
                      if(this.tableData4.length == 1){
                          var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
                          askData.pageNo = askData.pageNo -1;
                          sessionStorage.setItem('askData'+this.isFlag,JSON.stringify(askData))
                      }
                      this.refresh();
                    }
                });
            } else {
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
          })
        })
      },
      // 编辑或维护
      goEdit(index,row,val){
          var flag = 0
          if(this.isFlag == 1){//生效库
            flag = 1
          } else{//草稿
            flag = 0
          }
          var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
          this.$router.push({
            path:'/punishSpecialReport',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              infoId:row.id,
              flag:flag,
              step:val,
              id: this.$route.query.id
            }
          })
      },
      // 提交
      goSubmit(index,row){
          this.axios.post('penalize/submit',JSON.stringify({id:row.id,flag:0}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
            if(res.code == 200){
              if(res.data == 0){
                this.$alert('请完善信息后再次提交', '提示', {
                    confirmButtonText: '确定'
                });
              } else{
                this.$alert('提交成功', '提示', {
                    confirmButtonText: '确定',
                    callback:action=>{
                      this.refresh()
                    }
                });
              }
            } else {
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
          })
      },
      goDelete(index,row){
          this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(_ => {
              this.axios.post('penalize/del',qs.stringify({id:row.id})).then((res)=>{
                if(res.code == 200){
                  this.$alert('删除成功', '提示', {
                      confirmButtonText: '确定',
                      callback:action=>{
                        if(this.tableData4.length == 1){
                          var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
                          askData.pageNo = askData.pageNo -1;
                          sessionStorage.setItem('askData'+this.isFlag,JSON.stringify(askData))
                        }
                        this.refresh();
                      }
                  });
                } else {
                    this.$alert(res.message, '提示', {
                      confirmButtonText: '确定'
                    })
                }
              })
          })
          .catch(_ => {});
      },
      goDfend(index,row,val){
          var flag = 0
          if(this.isFlag == 1){//生效库
            flag = 1
          } else{//草稿
            flag = 0
          }
          var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
          this.$router.push({
            path:'/punishSpecialReport',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              infoId:row.id,
              flag:flag,
              step:val,
              id: this.$route.query.id
            }
          })
      },
    }
  }
</script>
<style lang="css">
  .el-tooltip__popper{
    max-width:50%
  }
</style>
<style lang="scss">
  #lossSendList{
    table tr:last-child td{
      border-bottom: none
    }
    .el-table::before{
      background-color: transparent!important
    }
    .el-table td .cell,.el-table__empty-text{
      font-weight:normal;
      cursor:pointer
    }
    .textOverFlow{
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
     .el-table__body-wrapper{
      background: #fff;
    }
    .el-pagination{
      text-align: center;
      padding-bottom: 50px;
      border: 0;
      margin-top: 20px;
    }
    .el-table::before{
        height:0;
      }
    .el-table th{
        background: #f9f9f9;
        text-align: center;
      }
    .el-table .cell{
        text-align: center;
      }
    .el-dropdown {
          vertical-align: top;
        }
    .el-dropdown + .el-dropdown {
          margin-left: 15px;
        }
    .el-icon-arrow-down {
          font-size: 12px;
       }
    .el-pagination button, .el-pagination span:not([class*=suffix]){
      padding:0 5px;
      font-size: 12px;
    }
    .moreBtn,.detailBtn{
        color: #4285F4;
        padding: 0 2px;
      }
    .detailBtn:hover,.moreBtn:hover{
        cursor: pointer;
      }
    .el-dropdown-menu--mini{
        width: 80px;
        text-align: center;
      }
    .jumpA{
        color: #fff;
        text-decoration: none
      }
    .dealBtn{
        float: right;
        margin-right: 5px;
        width: 68px;
        height: 26px;
        padding: 0;
        font-size: 12px;
    }
    .redFont{
        color: #FF6363!important
    }
  } 
</style>
