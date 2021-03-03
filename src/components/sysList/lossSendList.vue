<template>
    <div id="lossSendList">
        <el-button type="primary" @click.native="goExport" class="dealBtn" v-if="this.isStore ==  1&&btnData.exportbtn">导出</el-button>
        <el-button type="primary" @click.native="goSpecialReport" class="dealBtn" v-if="this.isFlag == 2&&btnData.specialbtn">专报</el-button>
        <el-button type="primary" @click.native="goSeasonReport" class="dealBtn" v-if="this.isFlag == 2&&btnData.seasonbtn">季报</el-button>
        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
            <el-table-column type="index" label="序号" align="center" width="80" fixed v-if="this.isFlag == 2"></el-table-column>
            <el-table-column prop="number" label="损失事件编号" align="center" width="150" fixed v-if="this.isFlag == 1">
                <template slot-scope="scope">{{scope.row.number == null||scope.row.number == ''?'--':scope.row.number}}</template>
            </el-table-column>
            <el-table-column prop="name" label="事件名称" align="center" width="200" fixed>
                <template slot-scope="scope">
                    <span :title="scope.row.name" class="textOverFlow" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="isFlag == 2&&btnData.detailbtn1">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
                    <span :title="scope.row.name" class="textOverFlow" v-if="isFlag == 2&&!btnData.detailbtn1">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
                    <span :title="scope.row.name" class="textOverFlow" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="isFlag == 1&&!isStore&&btnData.detailbtn2">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
                    <span :title="scope.row.name" class="textOverFlow" v-if="isFlag == 1&&!isStore&&!btnData.detailbtn2">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
                    <span :title="scope.row.name" class="textOverFlow" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="isStore == 1&&btnData.detailbtn">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
                    <span :title="scope.row.name" class="textOverFlow" v-if="isStore == 1&&!btnData.detailbtn">{{scope.row.name == null||scope.row.name == ''?'--':scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="incidentType" label="事件类型" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.incidentType == null||scope.row.incidentType ==''?'--':incidentType[scope.row.incidentType]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="discoverWay" label="发现方式" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.discoverWay == null||scope.row.discoverWay == ''?'--':discoverWay[scope.row.discoverWay]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isSeriousRisk" label="是否属于重大风险事件" align="center" v-if="!this.isStore" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.isSeriousRisk == 1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="happenDate" label="事件发生时间" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.happenDate == null||scope.row.happenDate == ''?'--':scope.row.happenDate.substring(0,4)+'/'+scope.row.happenDate.substring(4,6)+'/'+scope.row.happenDate.substring(6,8)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="reportDate" label="事件报告时间" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.reportDate == null||scope.row.reportDate == ''?'--':scope.row.reportDate.substring(0,4)+'/'+scope.row.reportDate.substring(4,6)+'/'+scope.row.reportDate.substring(6,8)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="belongOrganizationStr" label="事件所属机构" align="center" width="200">
                <template slot-scope="scope">
                    <div v-if="scope.row.belongOrganizationStr">
                      <p v-for="(item,index) in scope.row.belongOrganizationStr" v-if="index == 0">
                          <span :title="scope.row.belongOrganizationStr" class="textOverFlow">
                          {{item}}
                          <!-- {{scope.row.org == null||scope.row.org == ''?'--':scope.row.org}}--> 
                          </span>
                          <span v-if="scope.row.belongOrganizationStr.length>1">...</span>
                      </p>
                    </div>
                    <div v-else>--</div>
                </template>
            </el-table-column>
            <el-table-column prop="a" label="损失总额" align="center">
                <template slot-scope="scope">
                    <span :title="scope.row.a == null||scope.row.a ==''?'--':scope.row.a" class="textOverFlow">{{scope.row.a == null||scope.row.a ==''?'--':scope.row.a}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="b" label="追回总额" align="center">
                <template slot-scope="scope">
                    <span :title="scope.row.b == null||scope.row.b == ''?'--':scope.row.b" class="textOverFlow">{{scope.row.b == null||scope.row.b == ''?'--':scope.row.b}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="d" label="净损失总额" align="center">
                <template slot-scope="scope">
                    <span :title="scope.row.d == null||scope.row.d ==''?'--':scope.row.d" class="textOverFlow">{{scope.row.d == null||scope.row.d ==''?'--':scope.row.d}}</span>
                </template>  
            </el-table-column>
            <el-table-column prop="submissionType" label="报送类型" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.submissionType == 1?'季报':'专报'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isUpdate" label="是否更新" align="center" v-if="this.isStore == 1">
                <template slot-scope="scope">
                    <span>{{scope.row.isUpdate == 1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="hanndle" label="操作" align="center" width="200" v-if="this.isFlag == 2">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn1">详情</span>
                <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.editbtn">编辑</span>
                <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.submitbtn">提交</span>
                <span class="handleBtn detailBtn" @click="goDelete(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.deletebtn">删除</span>
              </template>
            </el-table-column>
            <el-table-column prop="hanndle" label="操作" align="center" v-if="this.isFlag == 1&&!this.isStore">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn2">详情</span>
                <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.editbtn2">维护</span>
              </template>
            </el-table-column>
            <el-table-column prop="hanndle" label="操作" align="center" v-if="this.isStore == 1">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
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
    props:['isFlag','isStore'],
    data() {
      return {
        currentPage:1,
        tableData4:[],
        totalResults:0,
        incidentType:{
          '1':'外部事件',
          '2':'业务活动',
          '3':'业外案件',
          '4':'业内案件',
          '5':'行政处罚',
          '6':'人员风险',
          '7':'信息系统风险',
          '8':'流程风险',
        },
        discoverWay:{
          '1':'外部检查',
          '2':'内部审计',
          '3':'上级检查',
          '4':'公司自查',
          '5':'客户投诉',
          '6':'举报',
          '7':'其他'
        },
        aaa:{
          submissionType:1,
          status:1
        },
        btnData:{   //按钮显示隐藏
          exportbtn: false,
          detailbtn: false,
          specialbtn:false,
          seasonbtn:false,
          detailbtn1: false,
          editbtn: false,
          submitbtn: false,
          deletebtn: false,
          detailbtn2: false,
          editbtn2: false,
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
      Bus.$off('lossformDatas')
      Bus.$on('lossformDatas', (data) => {
        var askData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
        this.totalResults = data.totalResults == undefined?1:data.totalResults;
        this.tableData4 = [];
        this.tableData4 = data.data == undefined?[]:data.data;
        this.currentPage = askData.pageNo == undefined?1:askData.pageNo;
      })
      this.getData(this.$store.state.orgBtnData)
    },
    methods: {
      getData(handleData){
        if(handleData !== undefined){
              if(handleData.indexOf('1_lsjke')>=0){//导出
                this.btnData.exportbtn = true
              }else{
                this.btnData.exportbtn = false
              }
              if(handleData.indexOf('1_lsjkd')>=0){//详情
                this.btnData.detailbtn = true
              }else{
                this.btnData.detailbtn = false
              }
              if(handleData.indexOf('1_lsjbsjb')>=0){//季报
                this.btnData.seasonbtn = true
              }else{
                this.btnData.seasonbtn = false
              }
              if(handleData.indexOf('1_lsjbzb')>=0){//专报
                this.btnData.specialbtn = true
              }else{
                this.btnData.specialbtn = false
              }
              if(handleData.indexOf('1_lsjbcgxq')>=0){//草稿详情
                this.btnData.detailbtn1 = true
              }else{
                this.btnData.detailbtn1 = false
              }
              if(handleData.indexOf('1_lsjbcgbj')>=0){//草稿编辑
                this.btnData.editbtn = true
              }else{
                this.btnData.editbtn = false
              }
              if(handleData.indexOf('1_lsjbcgtj')>=0){//草稿提交
                this.btnData.submitbtn = true
              }else{
                this.btnData.submitbtn = false
              }
              if(handleData.indexOf('1_lsjbcgsc')>=0){//草稿删除
                this.btnData.deletebtn = true
              }else{
                this.btnData.deletebtn = false
              }
              if(handleData.indexOf('1_lsjbsxxq')>=0){//生效详情
                this.btnData.detailbtn2 = true
              }else{
                this.btnData.detailbtn2 = false
              }
              if(handleData.indexOf('1_lsjbsxwh')>=0){//生效编辑
                this.btnData.editbtn2 = true
              }else{
                this.btnData.editbtn2 = false
              }
            }
      },
      // 季报
      goSeasonReport(){
          this.$router.push({
            path:'/seasonReport',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              id: this.$route.query.id
            }
          })
      },
      // 专报
      goSpecialReport(){
          this.$router.push({
            path:'/specialReport',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              id: this.$route.query.id
            }
          })
      },
      refresh(){
         var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
         this.axios.post('lossincident/queryList',JSON.stringify(askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
            if(res.code == 200){
              if(res.data != null){
                this.totalResults = res.data.totalResults
                this.tableData4 = []
                this.tableData4 = res.data.data
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
      },
      handleSizeChange (value) {
          var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
          askData.pageNo = value;
          sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(askData))
          this.refresh()
      },
      handleCurrentChange (value) {
          var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
          askData.pageNo = value;
          sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(askData))
          //下一页请求数据
          this.refresh()
      },
      // 详情
      goDetail(index,row){
          var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
          this.$router.push({
            path:'/leSendDetail',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              lossId:row.id,
              flag:this.isFlag,
              belongCompany:this.$route.query.belongCompany,
              company:this.$route.query.company,
              id: this.$route.query.id
            }
          })
      },
      goSubmit(index,row){
          this.axios.post('lossincident/draftSubmit',qs.stringify({id:row.id})).then((res)=>{
            if(res.code == 200){
                this.$alert('提交成功', '提示', {
                    confirmButtonText: '确定',
                    callback:action=>{
                      this.refresh()
                    }
                });
                this.refresh();
            }else {
                this.$alert(res.data, '提示', {
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
              this.axios.post('lossincident/draftDelete',qs.stringify({id:row.id})).then((res)=>{
                if(res.code == 200){
                  this.$alert('删除成功', '提示', {
                      confirmButtonText: '确定',
                      callback:action=>{
                        if(this.tableData4.length == 1){
                          var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
                          askData.pageNo = askData.pageNo -1;
                          sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(askData))
                        }
                        this.refresh();
                      }
                  });
                } else if(res.code == 500){
                    this.$alert('删除失败', '提示', {
                      confirmButtonText: '确定'
                    })
                }
              })
          })
          .catch(_ => {});
      },
      goEdit(index,row){
        this.$router.push({
          path:'/specialReport',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            lossId:row.id,
            flag:this.isFlag
          }
        })
      },
      // 导出按钮
      goExport(){
        var askData = JSON.parse(sessionStorage.getItem('askData' + this.isFlag))
        let page = askData.pageNo
        delete askData.pageNo;
        delete askData.pageSize;
        this.axios.post('/lossincident/exportList',JSON.stringify(askData),{responseType:'arraybuffer',headers:{'Content-Type':'application/json'}}).then((res)=>{
          askData.pageNo = page
          askData.pageSize = 10
          sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(askData))
          let filename = "损失事件报送列表.xlsx";
          this.fileDownload(res, filename);
        })
      },
      fileDownload(data, fileName) {
            let blob = new Blob([data], {
              type: "application/octet-stream"
            })
            let filename = fileName || "filename.xls";
            if (typeof window.navigator.msSaveBlob !== "undefined") {
              window.navigator.msSaveBlob(blob, filename);
            } else {
              var blobURL = window.URL.createObjectURL(blob);
              var tempLink = document.createElement("a");
              tempLink.style.display = "none";
              tempLink.href = blobURL;
              tempLink.setAttribute("download", filename);
              if (typeof tempLink.download === "undefined") {
                tempLink.setAttribute("target", "_blank");
              }
              document.body.appendChild(tempLink);
              tempLink.click();
              document.body.removeChild(tempLink);
              window.URL.revokeObjectURL(blobURL);
            }
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
    .redBg,.yellowBg,.blueBg{
        display: inline-block;
        color: #fff;
        padding: 2px 10px;
        border-radius: 2px;
        background: #FF6363;
        word-break:normal;
    }
    .yellowBg{
      background: #FFD824;
    }
    .blueBg{
      background: #4285F4;
    }
    .cell p{
      margin-bottom:15px;
      overflow:hidden;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
    }
    .cell p:last-child{
        margin-bottom:0
    }
  } 
</style>
