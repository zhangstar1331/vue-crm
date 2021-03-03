<template>
  <div id="zbList">
    <el-button type="primary" @click.native="goNewBuild" class="dealBtn" v-if="this.isFlag !== 1&&btnData.oneurgebtn">一键催办</el-button>
  	<el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	         <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
            <el-table-column prop="batch,applayObject" label="任务名称" align="center">
                <template slot-scope="scope" v-if="taskName">
                  <span :title="taskName[scope.row.applayObject] +'-'+ scope.row.batch" class="textOverFlow">{{taskName[scope.row.applayObject] +'-'+ scope.row.batch}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="batch" label="报送批次" align="center" width="120"></el-table-column>
              <el-table-column prop="aging" label="报送时效" align="center" width="140"></el-table-column>
              <el-table-column prop="frequency" label="报送频率" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{frequency[scope.row.frequency]}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="applayObject" label="适用对象" align="center" width="120">
                <template slot-scope="scope" v-if="taskName">
                  <span>{{taskName[scope.row.applayObject]}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="monitorDepartment" label="报送部门" align="center">
                <template slot-scope="scope" v-if="taskName">
                  <span :title="taskName[scope.row.monitorDepartment]" class="textOverFlow">{{taskName[scope.row.monitorDepartment]}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="reportMan" label="呈报人" align="center" width="120">
                <template slot-scope="scope">
                    <span :title="scope.row.reportMan" class="textOverFlow">{{scope.row.reportMan == null?'--':scope.row.reportMan}}</span>
                  </template>
              </el-table-column>
            <el-table-column prop="hanndle" label="操作" align="center" v-if="this.isFlag == 1">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goDeatil(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
                <span class="handleBtn moreBtne" @click="sendBack(scope.$index, scope.row)" style="color: red;" v-if="btnData.rebackbtn">退回</span>
              </template>
            </el-table-column>
            <el-table-column prop="hanndle" label="操作" align="center" v-if="this.isFlag == 2">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goDeatil(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
                <span class="handleBtn detailBtn" @click="goUrge(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.urgebtn">催办</span>
                <span class="handleBtn detailBtn" @click="withDraw(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.takebackbtn">收回</span>
                <span class="handleBtn moreBtne" @click="sendBack(scope.$index, scope.row)" style="color: red;" v-if="btnData.rebackbtn">退回</span>
              </template>
            </el-table-column>
            <el-table-column prop="hanndle" label="操作" align="center" v-if="this.isFlag == 3">
              <template slot-scope="scope">
                <span class="handleBtn detailBtn" @click="goDeatil(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情</span>
                <span class="handleBtn detailBtn" @click="goUrge(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.urgebtn">催办</span>
                <span class="handleBtn detailBtn" @click="withDraw(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.takebackbtn">收回</span>
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
      	showNewBuild:true,
      	handleData:[],
      	btnData:{   //按钮显示隐藏
          detailbtn: false,
          rebackbtn: false,
          urgebtn: false,
          takebackbtn: false,
  				oneurgebtn: false,
  			},
      	currentPage:1,
				nums:[],
				state:'',
        tableData4:[],
        totalResults:0,
        loading:false,
        jobs: [],
        jobsTemp:[],
        requestData:{},
        bzShow:true,
        taskName:{},
        // 频率
        frequency:{
          '1':'月度',
          '2':'季度',
          '3':'年度',
          '4':'半年度',
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
        this.taskName = JSON.parse(sessionStorage.getItem('taskName'));
        this.totalResults = data.totalResults == undefined?1:data.totalResults;
				this.tableData4 = [];
        this.tableData4 = data.data == undefined?[]:data.data;
        this.currentPage = 1;
      })
      this.getData(this.$store.state.orgBtnData)
    },
    methods: {
      // 权限
      getData(handleData){
        if(handleData !== undefined){
          if(handleData.indexOf('1_iypfrwd')>=0){//详情
            this.btnData.detailbtn = true
          }else{
            this.btnData.detailbtn = false
          }
          if(handleData.indexOf('11_iypfrwb')>=0){//退回
            this.btnData.rebackbtn = true
          }else{
            this.btnData.rebackbtn = false
          }
          if(handleData.indexOf('1_iypfrwc')>=0){//催办
            this.btnData.urgebtn = true
          }else{
            this.btnData.urgebtn = false
          }
          if(handleData.indexOf('1_iypfrws')>=0){//收回
            this.btnData.takebackbtn = true
          }else{
            this.btnData.takebackbtn = false
          }
          if(handleData.indexOf('1_iypfrwy')>=0){//一键催办
            this.btnData.oneurgebtn = true
          }else{
            this.btnData.oneurgebtn = false
          }
        }
      },
    	refresh(){
    	   var askData = JSON.parse(sessionStorage.getItem('askData'))
         this.axios.post('indjob/joblist',qs.stringify(askData)).then((res)=>{
            if(res.code == 200){
              if(res.data != null){
                this.taskName=JSON.parse(sessionStorage.getItem('taskName'));
                this.totalResults = res.data.totalResults
                this.tableData4 = [];
                this.tableData4 = res.data.data == undefined?[]:res.data.data;
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
						askData.pageNo = value;
						sessionStorage.setItem('askData',JSON.stringify(askData))
						this.refresh()
      },
      handleCurrentChange (value) {
			var askData = JSON.parse(sessionStorage.getItem('askData'))
					askData.pageNo = value;
					sessionStorage.setItem('askData',JSON.stringify(askData))
        //下一页请求数据
        this.refresh()
      },
      // 详情
      goDeatil(index,row){
        this.$router.push({
          path:'/checkAssign',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            jobId:row.id
          }
        })
      },
      // 已报送退回
      sendBack(index,row){
          this.axios.post('indjob/sendback',qs.stringify({jobId:row.id})).then((res)=>{
              if(res.code == '200'){
                  this.$alert('操作成功', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.refresh()
                    }
                  });
                  
              }else{
                  this.$alert(res.message, '提示', {
                    confirmButtonText: '确定'
                  })
              }
          })
      },
      // 报送中催办
      goUrge(index,row){
          var params = qs.stringify({
              jobId:row.id
          })
          this.axios.post('indjob/urge',params).then((res)=>{
            if(res.code == '200'){
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定'
                });
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
          })
      },
      // 收回
      withDraw(index,row){
          this.axios.post('indjob/withdraw',qs.stringify({jobId:row.id})).then((res)=>{
            if(res.code == '200'){
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.refresh()
                  }
                });
            }else{
              this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
              })
            }
          })
      },
      // 一键催办
      goNewBuild(){
          const askData = JSON.parse(sessionStorage.getItem('askData'))
          var params = qs.stringify({
              submission: askData.submission
          })
          this.axios.post('indjob/allurge',params).then((res)=>{
            if(res.code == '200'){
                  this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定'
                });
            }else{
              this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
              })
            }
          })
      }
    }
  }
</script>
<style lang="css">
  .el-tooltip__popper{
    max-width:50%
  }
</style>
<style lang="scss">
  #zbList{
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
  } 
</style>
