<template>
  <div id="quoteWarnList">
  	<el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	          <el-table-column prop="code" label="编号" align="center" width="100" fixed>
                <template slot-scope="scope">{{scope.row.code.toUpperCase()}}</template>
            </el-table-column>
            <el-table-column prop="name" label="指标名称" width="200" fixed>
                <template slot-scope="scope">
                    <span :title="scope.row.name" class="textOverFlow" style="color: #4285F4;" @click="goDetail(scope.$index, scope.row)" v-if="btnData.detailbtn">{{scope.row.name == null?'--':scope.row.name}}</span>
                    <span :title="scope.row.name" class="textOverFlow" v-else>{{scope.row.name == null?'--':scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="value" label="当期指标值" width="200" align="center"> 
              <template slot-scope="scope">
                <div :class="{'redBg':scope.row.rybStatus == 1,'yellowBg':scope.row.rybStatus == 2,'blueBg':scope.row.rybStatus == 3}">
                  <p :title="item" v-for="item in scope.row.value">{{item}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="compv" label="同比" align="center" width="120">
              <template slot-scope="scope">
                <span v-for="(item,index) in (scope.row.compv)" class="comCss">
                  {{item.value}} 
                  <em v-if="item.scope == 1" style="font-style: normal;">↑</em>
                  <em v-if="item.scope == 0" style="font-style: normal;">↓</em>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="momv" label="环比" align="center" width="120"> 
              <template slot-scope="scope">
                <span v-for="(item,index) in (scope.row.momv)" class="comCss">
                  {{item.value}} 
                  <em v-if="item.scope == 1" style="font-style: normal;">↑</em>
                  <em v-if="item.scope == 0" style="font-style: normal;">↓</em>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="indCat" label="指标分类" align="center" width="120">
                <template slot-scope="scope">
                    <span :title="scope.row.indCat" class="textOverFlow">{{scope.row.indCat == null?'--':indCat[scope.row.indCat]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="catName" label="风险分类" width="120" align="center">
            		<template slot-scope="scope">
                  <span>{{scope.row.catName == null?'--':scope.row.catName}}</span>
                </template>
            </el-table-column>
	          <el-table-column prop="defins" label="指标定义及口径" width="250">
	          	<template slot-scope="scope">
	              <span :title="scope.row.defins" class="textOverFlow">{{scope.row.defins == null?'--':scope.row.defins}}</span>
	            </template>
	          </el-table-column>
            <el-table-column prop="level" label="指标等级" align="center" v-if="this.objectId&&this.objectId !== '101'&&limitYear&&limitYear<2020">
              <template slot-scope="scope">
                <span>{{ scope.row.level == '1'?'一类':scope.row.level == '2'?'二类':'--' }}</span>
              </template>
            </el-table-column>
	          <el-table-column prop="isryb" label="是否评价类" align="center" width="120" v-if="limitYear&&limitYear<2020">
	            <template slot-scope="scope">
	              <span>{{scope.row.isryb == '1'?'是':'否'}}</span>
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
	          <el-table-column prop="cause" label="原因分析" align="left" width="200"> 
	          		<template slot-scope="scope">
	          			<span style="white-space:pre-line">{{scope.row.cause == null?'--':scope.row.cause}}</span>
		            </template>
	          </el-table-column>
	          <el-table-column prop="corra" label="改善措施" align="left" width="200"> 
	          		<template slot-scope="scope">
	          			<span style="white-space:pre-line">{{scope.row.corra == null?'--':scope.row.corra}}</span>
		            </template>
	          </el-table-column>
	          <el-table-column prop="objName" label="适用对象" width="150" align="center"> </el-table-column>
	          <el-table-column prop="depName" label="报送部门" width="120" align="center"> </el-table-column>
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
  			checkData:{},
      	currentPage:1,
        tableData4:[],
        totalResults:0,
        objectId:'',
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
    	Bus.$off('dataList')
    	Bus.$on('dataList', (dataList) => {
    		this.totalResults = dataList.data.total;
    		this.tableData4 = [];
    		this.tableData4 = dataList.data.instats;
      })
    	Bus.$off('checkData')
    	Bus.$on('checkData',(checkData) => {
    		this.currentPage = 1;
    		this.checkData = checkData;
        this.objectId = checkData.objectId
        this.limitYear = parseInt(this.checkData.submissionDate.substring(0,4))
    	})
    },
    methods: {
      // 权限
      getData(handleData){
        if(handleData !== undefined){
          if(handleData.indexOf('1_ihhlyczblbd')>=0){//导出
            this.btnData.detailbtn = true
          }else{
            this.btnData.detailbtn = false
          }
        }
      },
    	refresh(){
         this.axios.post('rmIndStass/indReportExcnInfo',qs.stringify(this.checkData)).then((res)=>{
            if(res.code == 200){
              if(res.data != null || res.data != undefined){
                this.totalResults = res.data.total;
								this.tableData4 = [];
								if(res.data.instats){
									for (var i = 0; i < res.data.instats.length; i++) {
										res.data.instats[i].value = eval("("+res.data.instats[i].value+")")
										res.data.instats[i].momv = eval("("+res.data.instats[i].momv+")")
										res.data.instats[i].compv = eval("("+res.data.instats[i].compv+")")
									}
								}
	        			this.tableData4 = res.data.instats == undefined?[]:res.data.instats;
              }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                })
            }
        })
    	},
      handleSizeChange (value) {
					this.checkData.pageNum = value;
					this.refresh()
      },
      handleCurrentChange (value) {
					this.checkData.pageNum = value;
	        //下一页请求数据
	        this.refresh()
      },
      // 详情
      goDetail(index,row){
          this.$router.push({
            path:'/checkForm',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                indId:row.id,
                subDateEnd:this.checkData.submissionDate,
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
  #quoteWarnList{
    table tr:last-child td{
      border-bottom: none
    }
    .comCss{
    	display: block;
    	height: 40px;
    	line-height: 40px;
    }
    .redBg p,.yellowBg p,.blueBg p{
	    	display: inline-block;
			color: #fff;
			padding: 2px 10px;
			border-radius: 2px;
			background: #FF6363;
			word-break:normal
		}
		.yellowBg p{
			background: #FFD824;
		}
		.blueBg p{
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
    .quoteCss:first-of-type{
    	border-bottom: 2px solid #fff;
    }
    .quoteCss:last-of-type{
    	padding-left: 2%;
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
