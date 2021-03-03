<template>
    <div id="formSingleList">
        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" height="75%" ref="tableRef">
            <el-table-column prop="code" label="编号" align="center" width="100" fixed>
                <template slot-scope="scope">{{scope.row.code == null?'--':scope.row.code.toUpperCase()}}</template>
            </el-table-column>
            <el-table-column prop="name" label="指标名称" width="200" fixed>
                <template slot-scope="scope">
                    <span :title="scope.row.name" class="textOverFlow" style="color: #4285F4;" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn">{{scope.row.name == null?'--':scope.row.name}}</span>
                    <span :title="scope.row.name" class="textOverFlow" v-else>{{scope.row.name == null?'--':scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="value" label="指标值" align="center" width="200">
                <template slot-scope="scope">
                    <p v-for="item in JSON.parse(scope.row.value)" :class="{'redBg':scope.row.rybStatus == 1,'yellowBg':scope.row.rybStatus == 2,'blueBg':scope.row.rybStatus == 3}" :title="item">
                      {{item == null?'--':item}}
                    </p>
                </template>  
            </el-table-column>
            <el-table-column prop="compv" label="同比" align="center" width="120">
                <template slot-scope="scope">
                    <p v-for="item in JSON.parse(scope.row.compv)">
                        {{item.value}}
                        <em v-if="item.scope == 1" style="font-style: normal;">↑</em>
                        <em v-if="item.scope == 0" style="font-style: normal;">↓</em>
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="momv" label="环比" align="center" width="120">
                <template slot-scope="scope">
                    <p v-for="item in JSON.parse(scope.row.momv)">
                        {{item.value}}
                        <em v-if="item.scope == 1" style="font-style: normal;">↑</em>
                        <em v-if="item.scope == 0" style="font-style: normal;">↓</em>
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="indCat" label="指标分类" align="center" width="120">
                <template slot-scope="scope">
                    <span :title="scope.row.indCat" class="textOverFlow">{{scope.row.indCat == null?'--':indCat[scope.row.indCat]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="catName" label="风险分类" align="center" width="120">
                <template slot-scope="scope">
                    <span :title="scope.row.catName" class="textOverFlow">{{scope.row.catName == null?'--':scope.row.catName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="caleName" label="指标定义及口径" width="250">
                <template slot-scope="scope">
                    <span :title="scope.row.caleName == null?scope.row.defins:scope.row.caleName+'/'+scope.row.defins" :class="{'textOverFlow':JSON.parse(scope.row.value)&&JSON.parse(scope.row.value).length==1}">
                    {{scope.row.caleName == null?scope.row.defins:scope.row.caleName+'&nbsp;/&nbsp;'+scope.row.defins}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="指标等级" align="center" v-if="this.objectId !== '101'&&limitYear&&limitYear<2020">
                <template slot-scope="scope">
                    <span>{{ scope.row.level == '1'?'一类':scope.row.level == '2'?'二类':'--' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isryb" label="是否评价类" align="center" width="120" v-if="limitYear&&limitYear<2020">
                <template slot-scope="scope">
                    <span v-if="scope.row.isryb == undefined||scope.row.isryb == '0'">否</span>
                    <span v-if="scope.row.isryb == '1'">是</span>
              </template>
            </el-table-column>
            <el-table-column prop="bluev" label="指标阈值（蓝）" width="150">
                <template slot-scope="scope">
                    <span :title="scope.row.bluev" class="textOverFlow">{{scope.row.bluev == null?'--':scope.row.bluev}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="yellowv" label="指标阈值（黄）" width="150">
                <template slot-scope="scope">
                    <span :title="scope.row.yellowv" class="textOverFlow">{{scope.row.yellowv == null?'--':scope.row.yellowv}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="redv" label="指标阈值（红）" width="150">
                <template slot-scope="scope">
                    <span :title="scope.row.redv" class="textOverFlow">{{scope.row.redv == null?'--':scope.row.redv}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="prefv" label="容忍度" width="150">
                <template slot-scope="scope">
                    <span :title="scope.row.prefv" class="textOverFlow">{{scope.row.prefv == null?'--':scope.row.prefv}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="limitv" label="限额" width="150">
                <template slot-scope="scope">
                    <span :title="scope.row.limitv" class="textOverFlow">{{scope.row.limitv == null?'--':scope.row.limitv}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="objName" label="适用对象" align="center" width="150"></el-table-column>
            <el-table-column prop="depName" label="报送部门" align="center" width="120"></el-table-column>
            <el-table-column prop="hanndle" label="操作" align="center" width="100">
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
    props:['isFlag'],
    data() {
      return {
        currentPage:1,
        tableData4:[],
        totalResults:0,
        objectId:'',
        tableRef:'tableRef',
        btnData:{   //按钮显示隐藏
          detailbtn: false,
        },
        indCat:{
          '1':'评价类',
          '2':'观测类',
          '3':'仪表盘类',
          '9':'其他类',
        },
        limitYear:null
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
      this.getData(this.$store.state.orgBtnData)
      Bus.$off('objectId')
      Bus.$on('objectId', (data) => {
        this.objectId = data
      })
      Bus.$off('limitYear')
      Bus.$on('limitYear', (data) => {
        this.limitYear = parseInt(data.substring(0,4))
      })
      //获取数据判断是否显示更多操作
      Bus.$off('formDatas')
      Bus.$on('formDatas', (data) => {
        this.totalResults = data.total == undefined?1:data.total;
        this.tableData4 = [];
        this.tableData4 = data.instats == undefined?[]:data.instats;
        this.$nextTick(()=>{
          this.$refs.tableRef.doLayout()
        })
        this.currentPage = 1;
      })
    },
    methods: {
      // 返回页面时加载数据
      getData(handleData){
        if(handleData !== undefined){
          if(handleData.indexOf('1_ifxzbcxd')>=0){//导出
            this.btnData.detailbtn = true
          }else{
            this.btnData.detailbtn = false
          }
        }
      },
      refresh(){
         var askData = JSON.parse(sessionStorage.getItem('askData'))
         this.axios.post('rmIndStass/indReportInfo',qs.stringify(askData)).then((res)=>{
            if(res.code == 200){
              if(res.data != null){
                this.totalResults = res.data.total
                this.tableData4 = []
                this.tableData4 = res.data.instats == undefined?[]:res.data.instats
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
      },
      handleSizeChange (value) {
          var askData = JSON.parse(sessionStorage.getItem('askData'))
          askData.pageNum = value;
          sessionStorage.setItem('askData',JSON.stringify(askData))
          this.refresh()
      },
      handleCurrentChange (value) {
          var askData = JSON.parse(sessionStorage.getItem('askData'))
          askData.pageNum = value;
          sessionStorage.setItem('askData',JSON.stringify(askData))
          //下一页请求数据
          this.refresh()
      },
      // 详情
      goDetail(index,row){
          var askData = JSON.parse(sessionStorage.getItem('askData'))
          this.$router.push({
            path:'/checkForm',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              indId:row.id,
              subDateEnd:askData.submissionDate,
              id: this.$route.query.id
            }
          })
      },
    },
  }
</script>
<style lang="css">
  .el-tooltip__popper{
    max-width:50%
  }
</style>
<style lang="scss">
  #formSingleList{
    height:calc(100% - 30px);
    table tr:last-child td{
      border-bottom: none
    }
    .el-table::before{
      background-color: transparent!important
    }
    .el-table__fixed {
      height:auto!important; 
      bottom:8px;
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
