<template>
  <div>
    <el-form ref="form" size="mini" :inline="true">
      <template>
        <div>
          <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
            <el-row>
              <el-col :span="10" style="margin-left: 14px;">
                <el-form-item label="维护部门" required>
                  <el-select v-model="department.region" @change="changeDepart" placeholder="请选择活动区域">
                    <el-option v-for="item in department.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" style="margin-left: -35px;">
                <el-form-item label="制度状态" required>
                  <el-select v-model="statusDatas.region" @change="changeStatus"  placeholder="请选择活动区域">
                    <el-option v-for="item in statusDatas.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="10" style="margin-left: -55px;">
                <el-form-item label="适用类型" required>
                  <el-select v-model="statusDatasE.region" @change="changeCategory"  placeholder="请选择活动区域">
                    <el-option v-for="item in statusDatasE.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" style="margin-left: 14px;">
                <el-form-item prop="zhiduNo" label="制度文号" required >
                  <el-select v-model="zhiduNo.region" filterable @change="selectZdType" placeholder="请选择制度文号"  style="width: 147px; ">
                    <el-option v-for="item in zhiduNo.unitsData" :key="item.value" :label="item.name" :value="item.name" ></el-option>
                  </el-select>
                </el-form-item>
                <el-input v-model="zdIpt.txt" @blur="inptZdYear" style="float:right;width:20%;left: -69px;top: -47px;" placeholder="请输入制度文号"></el-input>
                <el-input v-model="zdIpt1.txt" @blur="inptZdNo" style="float:right;width:20%;left:-75px;top: -47px;" placeholder="请输入制度文号"></el-input>
              </el-col>
              <el-col :span="10" style="margin-left: -34px;margin-top: -41px;">
                <el-form-item label="生效日期" required>
                  <el-date-picker type="date" @change="changeSDate" placeholder="选择日期" v-model="form.startDate"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="10" style="margin-left: -55px;">
                <el-form-item label="制度名称">
                  <el-input v-model="dengmiQueryForm.wgOrgnize" @change = 'changeOrg' placeholder="请输入制度名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-button type="primary" @click.native="searchData" class="search">查询</el-button>
      </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Bus from 'src/bus/bus.js'
  import {formatDate} from 'src/utils/utils.js'
  import {arrRemove} from 'src/utils/utils.js'
  export default {
    data () {
      return {
        formData: {},
        form: {
          startDate:'',
          loadDate:'',
        },
        orgnize: {
          user: '',
          region: '全部',
          unitsData:[{
            name:'全部',
            value:'00'
          },{
            name:'法律',
            value:'01'
          },{
            name:'行政法规',
            value:'02'
          },{
            name:'规章',
            value:'03'
          },{
            name:'规范性文件',
            value:'04'
          }]
        },
        zhiduNo :{
          user: '',
          region: '',
          unitsData:[]
        },
        department: {
          user: '',
          region: '全部',
          unitsData:[{
            name:'全部',
            code:'00'
          }]
        },
        statusDatas: {
          user: '',
          region: '全部',
          unitsData:[{
            name:'全部',
            value:'00'
          },{
            name:'维护中',
            value:'01'
          },{
            name:'有效',
            value:'02'
          },{
            name:'废止',
            value:'03'
          },{
            name:'规范性文件',
            value:'04'
          }]
        },
        statusDatasE: {
          user: '',
          region: '全部',
          unitsData:[{
            name:'全部',
            value:'00'
          },{
            name:'参照类',
            value:'01'
          },{
            name:'执行类',
            value:'02'
          },]
        },
        zdIpt:{
          txt:''
        },
        zdIpt1:{
          txt:''
        },
        searchJobType: ['全系统'],
        oldSearchJobType: [],
        placeDatas:{
          user: '',
          region: '全系统',
          unitsData:[
            {label: '00', value: '全系统'},
            {label: '01', value: '集团本级'},
            {label: '02', value: '保险子公司'},
            {label: '03', value: '非保险子公司'},
            {label: '04', value: '产险公司'},
            {label: '05', value: '人身险公司'},
            {label: '06', value: '资管公司'}
          ],
        },
        dengmiQueryForm: {
          wgOrgnize:'',
          wgName:'',
          wgFile:''
        },
        askData:{
          type:'3',
          category:'00',
          department:'00',
          state:'',
          dfCategory:'',
          range:'00',
          name:'',
          fileNoHead:'',//制度文号头
          fileNoBody:'',//制度文号年
          fileNoFoot:'',//制度文号号码
          pageNo:'1',
          pageSize:'10'
        }
      }
    },
    created () {
      sessionStorage.reverEdit = '' //初始化此参数的目的是为了新建的时候不请求detail接口
      //获取部门数据
      this.getDepartment(2)
//	      this.axios.get('getFormData')
//	      .then(data => {
//	        if (data.errno === 0) {
//	          this.formData = data.data;
//	        } else {
//	        }
//	      })
//	      .catch(error => {
//	      })
      this.searchData();
      Bus.$on('page', (data) => {
        this.askData.pageNo = data;
      })
    },
    methods: {
      getDepartment(type){
        this.$axios.post('instweb/comm',{type:type}).then((res)=>{
          this.department.unitsData = res.data.data.department;
          this.zhiduNo.unitsData = res.data.data.fno;
        })
      },
      searchData () {
        sessionStorage.askData = JSON.stringify(this.askData)
        Bus.$emit('askData',this.askData)
        this.$axios.post('instweb/query',this.askData).then((res)=>{
          if(res.data.code === 200){
            if(res.data.data.data != null){
              Bus.$emit('formDatas',res.data.data)
              Bus.$emit('totalResults',res.data.data.totalResults)
            }else{
              return;
            }
          }
        })
      },
      selectZdType(val){
        this.askData.fileNoHead = val;
      },
      inptZdYear(){
        this.askData.fileNoBody = this.zdIpt.txt
        console.log(this.askData)
      },
      inptZdNo(){
        this.askData.fileNoFoot = this.zdIpt1.txt
        console.log(this.askData)
      },
      changeSelect(val) {
        const allValues = [];
        // 用来储存上一次的值，可以进行对比
        const oldVal = this.oldSearchJobType.length === 1 ? this.oldSearchJobType[0] : [];
        // 若是全部选择
        if (val.includes('00')){
          allValues.push('00')
          this.searchJobType = allValues;
          this.askData.range = allValues.toString()
        }else{
          if(val.includes('全系统')){
            this.searchJobType.splice(this.searchJobType.findIndex(item => item === '全系统'), 1)
          }
          this.askData.range = val.toString();
        }
        // 取消全部选中 上次有 当前没有 表示取消全选
        if (oldVal.includes('00') && !val.includes('00')) this.searchJobType = [];
        // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if (oldVal.includes('00') && val.includes('00')) {
          const index = val.indexOf('00');
          val.splice(index, 1); // 排除全选选项
          this.searchJobType = val
        }
        // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if (!oldVal.includes('00') && !val.includes('00')) {
          if (val.length === allValues.length - 1) this.searchJobType = ['00'].concat(val)
        }
        // 储存当前最后的结果 作为下次的老数据
        this.oldSearchJobType[0] = this.searchJobType;
      },
      changeArea(val){
        this.askData.category = val;
      },
      changeDepart(val){
        this.askData.department = val;
      },
      changeStatus(val){
        this.askData.state = val;
      },
      changeCategory(val){
        this.askData.dfCategory = val;
      },
      changeDate(val){
        this.askData.startDate = formatDate(val,'yyyy-MM-dd');
      },
      changeSDate(val){
        this.askData.startDate = formatDate(val,'yyyy-MM-dd');
      },
      changeDeate(val){
        this.askData.loadDate = formatDate(val,'yyyy-MM-dd');
      },
      changeOrg(){
        this.askData.name = this.dengmiQueryForm.wgOrgnize
      },
      // changeName(){
      //   this.askData.name = this.dengmiQueryForm.wgName
      // },
      changeFie(){
        //制度文号头
        this.askData.fileNoHead = this.dengmiQueryForm.wgFile
      }
    },
    watch: {
      'formData': {
        handler: function (newVal, oldVal) {
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss">
  .el-form-item{
    margin-right:18px;
    margin-bottom: 20px;
    width: 100%;
    .el-form-item__content{
      width: 70%;
      .el-select--mini{
        width: 100%;
      }
      .el-date-editor{
        width: 100%;
      }
    }
  }
  .el-form-item__label{
    padding:0 4% 0 5%;
  }
  .el-col{
    text-align: center;
  }
  .el-col:first-child{
    text-align: left;
  }
  .el-col:last-child{
    text-align: right;
  }
  .el-col:first-child .el-form-item__label{
    padding-left: 0;
  }
  .search{
    float: right;
    width: 68px;
    height: 26px;
    margin-right: 5px;
    padding:0;
  }
</style>
