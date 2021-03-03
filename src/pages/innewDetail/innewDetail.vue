<template>
  <div id="inCont">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:13px">
      <el-breadcrumb-item id="top" class='separator-id'><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
      <el-breadcrumb-item class='separator-ic'><span class="bread" @click="turnDown()">{{detailName}}</span></el-breadcrumb-item>
      <el-breadcrumb-item class='separator-ie'>内部制度详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--基础信息-->
    <div class="sister-title">
      <el-row>
        <div class="sister-base">
          基础信息
        </div>
      </el-row>
      <el-row>
        <el-col :span="8" style="padding-left:10px">
          <div class="grid-content bg-purple">
            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic">
              <el-form-item label="公司管理类别：" prop="manageCategory" required style="text-align: left;">
                <span v-if="companySource == '0'">{{riskType[riskLevel]}}</span>
                <span v-else>{{riskTypeCX[riskLevel]}}</span>
              </el-form-item>
              <el-form-item label="发布日期：" prop="startDate" required>
                <span>{{issuedDates}}</span>
              </el-form-item>
              <el-form-item class="nameCss" label="父级制度：" prop="faName" required v-if="companySource == '0'">
                <span>{{faName == null||faName == ''?'--':faName}}</span>
              </el-form-item>
              <el-form-item label="录入人员："prop="operatorName" >
                <span>{{operatorName}}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form  :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
              <el-form-item label="制度文号：" prop="name" required style="text-align: left;">
                <span>{{dfwindow}}</span>
              </el-form-item>
              <el-form-item label="生效日期：" required style="text-align: left;">
                <span>{{startDate}}</span>
              </el-form-item>
              <el-form-item label="适用范围：" class="nameCss" required style="text-align: left;" v-if="companySource == '0'">
                <span>{{placeName}}</span>
              </el-form-item>
              <el-form-item label="制度名称：" class="nameCss" required style="text-align: left;" v-if="companySource == '1'">
                <span>{{name}}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form  :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
              <el-form-item label="所属部门：" required  prop="name" style="text-align: left;" v-if="companySource == '0'">
                <span>{{departmentName}}</span>
              </el-form-item>
              <el-form-item label="适用范围：" required  prop="name" style="text-align: left;" v-if="companySource == '1'">
                <span>{{departmentName}}</span>
              </el-form-item>
              <el-form-item label="有效期限："  required style="text-align: left;">
                <span>{{endDate == '3019-12-12'?'长期有效':endDate}}</span>
              </el-form-item>
              <el-form-item label="制度名称：" class="nameCss" required style="text-align: left;" v-if="companySource == '0'">
                <span>{{name}}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--相关文件-->
    <div class="section-rowdcc">
      <div class="section-dealis" style="font-weight: 600;" >相关文件</div>
      <el-table :header-cell-style="getRowClass" :data="tableData"  :row-class-name="tableRowClassName" style="background: rgb(249, 249, 249);border: 1px solid rgb(233, 233, 233);">
        <el-table-column prop="date" label="序号" align="center" type="index" :index="indexMethod" @click.native.prevent="deleteRow(scope.$index, tableData)" width="100" style="background: #F9F9F9; text-align: center;" >
        </el-table-column>
        <el-table-column prop="name" @click.native="editSubmit(scope)" align="center" label="文件名" width="500" style=" background: #F9F9F9;" >
          <template slot-scope="scope">
            <el-button @click.native.prevent="loadFile(scope.$index, scope.row)" type="text" size="small">
              {{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="文件类型" align="center" @click.native.prevent="deleteRow(scope.$index,tableData)" style="background: #F9F9F9;" >
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
              {{scope.row.type==1?"制度":"附件"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="addresse" label="操作" align="center" style="background: #F9F9F9;" >
          <template slot-scope="scope">
            <el-button  @click="change(scope.row)" type="text" size="small">
              查看拆分详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--拆分导入-->
    <div class="inSection-rowdccs" id="inSection-rowdccs" v-if="isShow">
      <div class="tit">
        <span class="section-dealise" style="font-weight: 700;">拆分导入</span>
        <span class="chrome-cli">{{name}} -- {{fileName}}</span>
      </div>
      <el-table :data="tableDatas" id="inDet" row-key="id" border :header-cell-style="getRowClass" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="background: rgb(249, 249, 249);border: 1px solid rgb(233, 233, 233);">
        <el-table-column prop="chapter" label="章节"   width="180"></el-table-column>
        <el-table-column prop="clause" label="法条" width="180"></el-table-column>
        <el-table-column prop="content" label="制度内容"></el-table-column>
      </el-table>
      <el-pagination style="text-align: center;margin-top: 16px;padding-bottom: 0;" :current-page.sync="currentPage" background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="totalPage" @size-change="" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!--修订记录-->
    <div class="section-rowdccEnd" v-if="panelShow">
      <span class="section-dealisEnd" style="font-weight: 600;">维护记录</span>
      <el-table :data="tableDatass" :header-cell-style="getRowClass" style="width: 100%;margin: 12px 	0px 20px; background: #FFFFFF;border: 1px solid #E9E9E9;" :row-class-name="tableRowClassName">
        <el-table-column prop="date" label="序号" align="center" type="index" :index="indexMethod" width="100" style=" text-indent: 0px;background: #F9F9F9; border: 1px solid #E9E9E9;" > </el-table-column>
        <el-table-column prop="fileName" align="center" label="制度文号" width="300" style="text-indent: 125px;" > </el-table-column>
        <el-table-column prop="name,fileName" align="center" label="制度名称" style="text-indent: 271px;" >
          <template slot-scope="scope">
            <span class="wgSpan textOverFlow" style="color: #4285F4;"  :title="scope.row.name" :class="[scope.row.status == 9?'disabled':'']" @click="jumpLog(scope.$index,scope.row)"><span v-show="scope.row.status == 3" class="wgSpan fzCss">废止</span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
        	align="center"
          prop="startDate"
          label="生效日期"
          width="200"
          style="text-indent: 125px;"
        >

        </el-table-column>

        <el-table-column
        	align="center"
          prop="issueDate"
          label="发布日期"
          width="200"
          style="text-indent: 125px;"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="section-scry">
      <span class="section-return" @click="turnDown()">返回</span>
      <span class="section-beauted" v-if="reserveBtn"  @click="reverseFt()">维护</span>
      <span class="section-edit" v-if="editBtn" @click="edit()">编辑</span>
    </div>
  </div>
</template>

<script>
	import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
  import {mapState, mapActions} from 'vuex'
  import qs from 'qs'
  export default {
    name: 'newDetails',
    data () {
      return {
        //基础信息
        operatorName:'',
        detailName:'',
        placeName:'',
        totalPage:0,
        editBtn:false,
        issuedDates:'',
        id:[],
        chapter:'',
        panelShow : true,
        reserveBtn: true,
        isShow:false,
        publish:'',
        department:'',
        startDates:'',
        endtimes:'',
        baseForm:[],
        categor:'',
        name:'',
        faName:'',
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        },
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        placeDatas:{
          user: '',
          region: '  ',
          unitsData:[
            {label: '00', value: '全系统'},
            {label: '01', value: '集团本级'},
            {label: '02', value: '保险子公司'},
            {label: '03', value: '非保险子公司'},
            {label: '07', value: '中华财险'},
            {label: '08', value: '中华人寿'},
            {label: '09', value: '共享中心'},
            {label: '10', value: '万联电商'},
            {label: '11', value: '农联中鑫'}
          ]
        },
        currentPage:1, //初始页
        pagesize:10,    //每页的数据
        userList: [],
        fileId:"",
        tableDatass:[],
        tableData: [],
        tableDatas: [],
        outName:'',
        outFileNo:'',
        startDate:'',
        issuedDateAAA:'',
        institutionId:[],
        categors:'',
        riskLevel:'',
        departmentName:'',
        fileName:'',//上传的文件名字
        endDate:'',
        dfwindow:'',
      }
    },
    created(){
      let ic = this.getUrlParam('ic');
      let fz = this.getUrlParam('fz');
      let whFlag = this.getUrlParam('whFlag')
      var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
      if(ic == '1' && handleIds.indexOf('1_cinnered') > -1){
        this.panelShow = false;
        this.reserveBtn = false;
        if(whFlag != 1){
	    			this.editBtn = true;
	    		}
      }
      if(handleIds.indexOf('1_cinnerr') == -1 || ic=='1' || fz == '3' || fz == '1'){
        this.reserveBtn = false;
      }
    },
    watch:{
      $route(to,from){
        if(to.fullPath.includes('fz') || to.fullPath.includes('whFlag')){
          this.editBtn = false;
          this.reserveBtn = false;
          return;
        }
        var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
	      if(handleIds.indexOf('1_cinnerr') > -1){
	        	this.reserveBtn = true;
	        }
        this.editBtn = false;

      }
    },
    mounted(){
      let id = this.$route.query.id
      this.init(id)
    },
    computed:{
      ...mapState(['companySource','riskType','riskTypeCX']),
    },
    methods: {
      init(id){
        this.axios.post('/instweb/detail',
          JSON.stringify({
            "id":id,
            "key":"1",
            "type":"1"
          }),{headers:{'Content-Type':'application/json'}}
        ).then((res)=>{
          if(res.code == 200){
            this.tableData = res.file;
            this. operatorName=res.data.operatorName
            //制度文号显示
            if(res.data.fileNoFoot==undefined||res.data.fileNoHead==undefined||res.data.fileNoBody==undefined){
              res.data.fileNoFoot=='8.5.2';
              res.data.fileNoHead=='中东发';
              res.data.fileNoBody=='2019'
            }
            this.dfwindow = res.data.fileNoHead+' [ '+res.data.fileNoBody+' ] '+res.data.fileNoFoot+'号'
            if(res.data.file != undefined){
              this.fileName = res.data.file[0].name;
              this.tableData = res.data.file;
              this.tableDatass = res.data.log;
              /*存id*/
              this.id = res.data.file;
            }
            //判断是从内规进来的还是待维护制度内规进来的
            if(this.$route.query.ic==1){
              if(this.companySource == '1'){
                this.detailName = '制度库（编辑中）';
              } else{
                this.detailName = '待维护制度库';
              }
              this.detailLang='内规详情'
            }else{
              this.detailName = '内部制度管理';
              this.detailLang='外规详情'
            }
            //维护部门
            this.department=res.data.department;
            //回填适用范围
            this.placeName = [];
            if(res.data.range){
              for (var i = 0; i < res.data.range.length; i++) {
                for (var j = 0; j < this.placeDatas.unitsData.length; j++) {
                  if(res.data.range[i] == this.placeDatas.unitsData[j].label){
                    this.placeName += this.placeDatas.unitsData[j].value+'  '
                  }
                }
              }
            }
            if(res.data.log != undefined){
              res.data.log.forEach((item,index)=>{
                let fileName = item.fileNoHead + ' [ '+item.fileNoBody + ' ] ' + item.fileNoFoot+'号'
                this.tableDatass[index].fileName = fileName
              })
            }
            this.name=res.data.name;
            //发文机关
            this.publish=res.data.publish;
            //拿生效日期
            this.startDate=res.data.startDate;
            this.startDates=res.data.startDate;
            //issuedDate颁布日期
            this.issuedDates=res.data.issuedDate;
            this.departmentName=res.data.departmentName;
            //拿有效期限
            this.endDate=res.data.endDate;
            //管理类别
            this.riskLevel=res.data.manageCategory
            //风险类别
            this.faName=res.data.faName
            if(res.data.manageLevel==1){
              this.categors='一级'
            }else if(res.data.riskLevel==2){
              this.categors='二级'
            }else if(res.data.riskLevel==3){
              this.categors='三级'
            }else if(res.data.riskLevel==4){
              this.categors='四级'
            }

            //拿制度类别
            if(res.data.category=='04'){
              this.categor='部门规章'
            } else if(res.data.category=='01'){
              this.categor='法律'
            }else if(res.data.category=='02'){
              this.categor='行政法规'
            }else if(res.data.category=='03'){
              this.categor='地方性法规'
            }else if(res.data.category=='00'){
              this.categor='全部'
            }else if(res.data.category=='05'){
              this.categor='规范性文件'
            }
          }else{
            this.$alert(res.message, '提示', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      reverseFt(){
        let id = this.$route.query.id;
        this.$router.push({
          path:'/inReverse',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            id:id
          }
        })
      },
      //返回
      turnDown(){
        if(this.getUrlParam('ic') == 1){
          this.$router.push({path:'/repository/white-manage',query:{'id':'1_cdw'}});
        }else{
          this.$router.push({path:'/repository/in-manage',query:{'id':'1_cinner'}});
        }
      },
      //修订外规
      turnDowns(){
        function getUrlParam(name){
          var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
          var r = window.location.search.substr(1).match(reg);
          if (r!=null) return unescape(r[2]); return null;
        }
        this.$router.push({path:'/inReverse/inReverse'});

      },
      loadFile(index,row){
      	var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
  			if(!(handleIds.indexOf('1_cinnerdl') > -1)){
  				return;
  			}
  			var obj = new Object()
				obj.filePath = row.url;
				obj.fileName = encodeURIComponent(row.name);
				this.axios.post('comm/download/101',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
						fileDownload(res, fileNameCombine(row.name,row.url));
				})
//      window.open(this.serveUrl+"/instweb/download/institutionfile?url="+row.url+"&fileName="+encodeURIComponent(row.name));
      },
      jumpLog(index,row){
        this.isShow = false;
        if(row.status==2){
          //有效
          var element = document.getElementById("top");
          element.scrollIntoView({block: 'start', behavior: "smooth"});
          this.init(row.id);
          var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
          if(handleIds.indexOf('1_cinnerr') > -1){
            	this.reserveBtn = true;
            }
        }else if(row.status==3){
          var element = document.getElementById("top");
          element.scrollIntoView({block:  'start', behavior: "smooth"});
          // 废止
          this.init(row.id)
          this.reserveBtn = false;
        }else if(row.status==9){
          this.reserveBtn = false;
        }
        this.init(row.id)
        if(row.status == 3){
          this.$router.push({
            path:'/innewDetail',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              'id':row.id,
              'fz':1
            }
          })
        }else{
          this.$router.push({
            path:'/innewDetail',   //跳转的路径
            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              'id':row.id
            }
          })
        }

      },
      edit(){
        let id = this.$route.query.id;
        this.$router.push({
          path:'/inReverseEdit',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            id:id
          }
        })
      },
      //获取参数
      getParams() {
        // 取到路由带过来的参数
        const routerParams = this.$route.params.state
      },
      /*索引值*/
      indexMethod(index) {
        return index + 1;
      },
      deleteRow(){
        this.isShow = true;
      },
      getUrlParam(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
      },
      change(row){
        this.currentPage = 1;
        let institutionId = this.$route.query.id
        let id = row.id
        this.fileId = row.id
        this.axios.post('instweb/item/query',
          JSON.stringify({
            "fileId":id,
            "institutionId":institutionId,
            "key":"1",
            "resolve":0
          }),{headers:{'Content-Type':'application/json'}}
        ).then((res)=>{
          if(res.code == 200){
            this.fileName = row.name;
            this.isShow = true
            if(res.data.data==null){
              this.tableDatas = [];
              this.totalPage = res.data.data === null?0:res.data.totalPage / 1 *10;
              return
            }else{
              this.tableDatas = [];
              this.tableDatas =res.data.data;
              this.totalPage = res.data.data === null?0:res.data.totalPage / 1 *10;
            }
          }else{
            this.$alert(res.message, '提示', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      editSubmit(scope){
      },
      handleSizeChange (value) {
        alert(value)
        this.pagesize = value;
      },
      handleCurrentChange (value) {
        this.currentpage = value;
        this.getfatiao()
      },
      getfatiao(){
        const { currentpage } = this;
        this.axios.post(
          'instweb/item/query', JSON.stringify({
            "institutionId":this.$route.query.id,
            "pageNo":currentpage,
            "pageSize":10,
            "fileId":this.fileId,
            "key":"1",
            "resolve":0
          }),{headers:{'Content-Type':'application/json'}}).then((res)=>{
          if(res.code == 200){
	          	var daste=res.data.data;
	          	this.tableDatas = daste;
          }else {
	          	this.$alert(res.message, '提示', {
			          confirmButtonText: '确定'
			        });
          }
        })
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      },
//设置表格第一行的颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F9F9F9'
        } else {
          return ''
        }
      }
    },


  }
</script>

<style lang="scss">
  *{
    box-sizing: border-box;
    margin:0;
    padding:0;
  }
  .sister-title .el-col-8 span{
    display: inline-block;
    width: 60%;
  }
  .section-scry span{
    cursor: pointer;
  }
  #inCont .nameCss span{
    /*display: inline-block;*/
    /*width: 80%;*/
  }
  #inCont .el-form-item .el-form-item__content{
    width: 100%;
  }
  #inCont .bread:hover{
  	cursor: pointer;
  }
  #inSection-rowdccs .el-table__body-wrapper /deep/ tr td:last-of-type>.cell{
    white-space:pre-line!important;
    text-indent:0!important;
    text-align: left!important;
    padding-left: 5%;
  }
  #inSection-rowdccs .el-table__body-wrapper /deep/ tr td{
    text-align: center;
    text-indent: 0;
    border-right: none!important;
  }
  #inSection-rowdccs .el-table__header /deep/ th{
    border-right: none!important;
  }
  #inSection-rowdccs .el-table__header /deep/ th>.cell{
    text-align: center;
    float: left;
    text-indent: 0;
  }
  .disabled{
    pointer-events: none;
    cursor:default;
    color:#9B9B9B!important
  }
  #inCont .wgSpan{
    cursor: pointer;
  }
  #inCont .fzCss{
    display: inline-block;
    width: 38px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: #FFFFFF;
    background: #FF6363;
    font-size: 12px;
    margin-right: 10px;
  }
  /*#inCont .sister-title .el-col:last-child{*/
  /*text-align: left!important;*/
  /*}*/
  /*#inCont .sister-title .el-col{*/
  /*text-align: left!important;*/
  /*}*/
  #inCont .el-form-item{
    margin-bottom: 20px;
  }
  #inCont .el-breadcrumb{
    margin-bottom: 16px;
    margin-top: 20px;
  }
  #inCont .sister-title{
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.15);
    border-radius: 8px;
    margin-top:19px;
    padding-top: 41px;
    min-height: 354px;
    .sister-base{
      font-size: 14px;
      padding-left: 10px;
      margin-bottom: 10px;
    }
  }
  #inCont .el-table__empty-block{
  	background: #fff;
  }
  #inCont .section-rowdcc{
    border-radius: 8px;
    background: #fff;
    margin-top: 20px;
    padding:20px;
    .section-dealis{
      font-size: 14px;
      margin-bottom: 28px;
      border-left: solid 2px rgba(0, 121, 254, 1);
      text-indent: 10px;
    }
  }
  #inCont .inSection-rowdccs{
    background: #fff;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 8px;
    .tit{
      margin-bottom: 20px;
    }
    .section-dealise{
      font-size: 14px;
      margin-bottom: 20px;
    }
    .chrome-cli{
      font-size: 14px;
      margin-left: 20px;
    }
  }
  #inCont  .section-rowdccEnd{
    background: #fff;
    padding:20px;
    border-radius: 8px;
    margin-top: 20px;
    .section-dealisEnd{
      font-size: 14px;
      border-left: solid 2px rgba(0, 121, 254, 1);
      padding-left: 10px;
    }
  }
  #inCont .section-scry{
    text-align: center;
    margin:30px 0;
  }
  #inCont .section-scry span{
    cursor: pointer;
    display: inline-block;
    width: 68px;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    background: #4285F4;
    color: #fff;
    margin-right: 20px;
    border-radius: 3px;
  }
  #inCont .innerCont{
    .el-table th>.cell{
      text-align: center!important;
    }
  }
  #inCont .sister-base{
    font-family: PingFangSC-Medium;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 21px;
    border-width: 0px;
    width: 1336px;
    height: 21px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-style: normal;
    font-weight: 600;
    text-align: left;
    border-left: solid 2px rgba(0, 121, 254, 1);
    margin-left: 12px;
    padding-right: 10px;
  }
  #inCont .grid-content .el-form-item__label{
    padding-right: 1px!important
  }
  #inCont .el-form-item__content{
    line-height: 40px;
    /*height: 40px;*/
  }
  #inCont .el-breadcrumb__inner{
    color: #909191 !important;
    font-weight: 700;

  }
  #inCont .separator-ie span{
    color: #4285F4 !important;
    font-weight: 500;
  }
  .textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
