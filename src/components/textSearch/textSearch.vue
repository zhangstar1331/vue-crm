<template>
  <div id="searchTxt">
    <div class="demo-input-suffix">
      <el-input placeholder="请输入关键字进行检索查询" v-model="searchName" prefix-icon="el-icon-search">
        <el-button slot="append" class="searchBtn"  icon="el-icon-search" @click="searchRouter()"></el-button>
      </el-input>
    </div>
    <ul class="txtBox">
      <h4 v-show="isshow">共计{{total}}条制度</h4>
      <li v-for="item in resdata" @click="reserveBtn(item.id,item.s)">
        <div class="sea-title">
          <el-tag type="success" v-model="item.s" v-if="item.s == 2">{{"有效"}}</el-tag>
          <el-tag type="danger" v-if="item.s == 3">{{"废止"}}</el-tag>
          <span class="zdName" v-html="item.title"></span>
          <span class="fileTit" v-html="item.fileName"></span>
        </div>
        <p v-html="item.content"></p>
      </li>
    </ul>
    <div class="noNsectch"  style="font-weight: 100;" v-show="noNsectchshow"> 暂无数据</div>
    <el-pagination v-show="isshow" :show.sync="isShowDialog"  layout="prev, pager, next" background prev-text="上一页" next-text="下一页" :total="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        select:'',
        total:'',
        search:'',
        totalPage:0,
        //接口回调数据
        isShowDialog: true,
        resdata:[],
        //关键字搜索
        searchName:'',
        isshow:false,
        currentpage:1,
        noNsectchshow:false,
        fz:''
      }
    },
    watch: {

    },

    mounted(){

    },
    methods:{
      //点击搜索按钮初始化数据
      initData(){
          this.totalPage=0;
          this.currentpage=1;
          this.resdata=[];
          this.total=''
          this.isshow=false
      },
      open() {
        this.$alert('请输入关键字', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
            this.noNsectchshow=false;
            console.log("成功")
          }
        });
      },
//点击搜索详情页面
      searchRouter(){
        this.initData();
        if(this.$data.searchName ==''){
          this.open()
          return
        }else{
          this.showAjax()
        }
      },

//封装ajax
      showAjax(){
        this.axios.post('instweb/search',
          JSON.stringify({ "pageNo":this.currentpage, "pageSize":10, "search":this.searchName, "type":sessionStorage.getItem('type') }),{headers:{'Content-Type':'application/json'}}
        ).then((res)=>{
          if(res.code == 200){
            this.total=res.data.total;
            var rese = res.data.data;
            this.totalPage=parseInt(res.data.total);
            console.log(res.data);
            if(rese.length!==0){
              this.isshow = true
              this.noNsectchshow=false;
            }else if(rese.length==0){
              this.isshow = false
              this.noNsectchshow=true;
            }
            this.resdata = rese;
            rese.map((item,index)=>{
              // console.log(item.id);
            })
          }else {
          }
        })
      },
  //跳转详情页面

  reserveBtn(a,b){
    if(sessionStorage.getItem('type') == '1'){
      this.$router.push({
        path:'/innewDetail',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          'id':a,
          'fz':b
        }
      })
    }else if(sessionStorage.getItem('type') == '2'){
      this.$router.push({

        path:'/newDetail',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          'id':a,
          'fz':b
        }

      })
    }else{
      this.$router.push({
        path:'/dfnewDetail',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          'id':a,
          'fz':b
        }
      })
    }
  },
//筛选变色
      showDate(val) {
        val = val + '';
        if (val.indexOf(this.search) !== -1 && this.search !== '') {
          return val.replace(this.search, '<font color="#409EFF">' + this.search + '</font>')
        } else {
          return val
        }
      },
      handleSizeChange (value) {
        this.pagesize = value;
      },
      handleCurrentChange (value) {
        this.currentpage = value;
        console.log(this.currentpage)
        //这个this.currentpage是我点击到第几页了
        this.showAjax(this.currentpage)
        //  把这个传过去不就行了吗
      }
    }
  }
</script>
<style lang="scss">
  .noNsectch{
    text-align: center;
  }
  .el-input-group__append{
    width: 80px;
    text-align: center;
    background: #4285F4;
  }
  .searchBtn .el-icon-search:before{
    color: #fff;
    font-size:16px;
  }
  .txtBox{
    width: 100%;
    border: 1px solid #E9E9E9;
    margin-top: 26px;
    margin-bottom: 50px;
    h4{
      margin:0;
      font-weight: normal;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      padding-left: 16px;
    }
    li{
      padding-left:16px;
      font-size: 12px;
      height: 92px;
      border-top: 1px solid #E9E9E9;
      padding-top: 10px;
      padding-right: 41px;
      p{
        color: #9B9B9B;
        margin-top: 8.5px;
        line-height: 18px;
      }
    }
    li:hover{
      background: #fafafa;
      cursor:pointer;
    }
  }
  .el-tag.el-tag--danger,.el-tag.el-tag--success{
    background: #FF6363;
    color: #fff;
    width: 38px;
    height: 18px;
    font-size: 12px;
    padding:0;
    line-height: 14px;
    text-align: center;
    margin-right: 15px;
  }
  .el-tag.el-tag--success{
    background: #36D954;
  }
  #searchTxt .el-pagination{
  	text-align: center;
  }
  .el-pagination button, .el-pagination span:not([class*=suffix]){
    padding:0 5px;
  }
  .fileTit,.zdName{
    color: #4285F4;
  }
  .zdName{
    margin-right: 10px;
  }
</style>
