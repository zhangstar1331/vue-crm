<template>
  <div>
    <el-form ref="form" size="mini" :inline="true">
      <template>
        <div>
          <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
            <el-row>
              <el-col :span="12">
                <el-form-item class="odd" label="风险类别" >
                  <el-select v-model="orgnize.region" @change="changeArea"  placeholder="请选外规类别">
                    <el-option v-for="item in orgnize.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="orgnizea.region" @change="changeAreae" placeholder="请选外规类别">
                    <el-option v-for="item in orgnizea.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="odd" label="公司管理类别">
                  <el-select v-model="orgnizew.region" @change="changeAreaw"  placeholder="请选外规类别">
                    <el-option v-for="item in orgnizew.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="orgnizes.region" @change="changeAreas"  placeholder="请选外规类别">
                    <el-option v-for="item in orgnizes.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            	<el-col :span="8">
                <el-form-item label="制度名称" >
                  <el-input v-model="dengmiQueryForm.wgOrgnize" @change = 'changeOrg' placeholder="请输入发文机关"></el-input>
                </el-form-item>
              </el-col>
            	<el-col :span="8">
                <el-form-item label="所属部门" >
                  <el-select v-model="department.region" @change="changeDepart" placeholder="请选择活动区域" style="margin-left: -10px">
                    <el-option v-for="item in department.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="适用范围" >
                  <el-select v-model="searchJobType" multiple collapse-tags  @change="changeSelect" placeholder="请选择类型查询">
                    <el-option v-for="item in placeDatas.unitsData" id="rangeArea" :key="item.label" :label="item.value" :value="item.label"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
		                    <el-form-item class="zdNo" prop="zhiduNo" label="制度文号">
							    <el-select v-model="zhiduNo.region" filterable @change="selectZdType" placeholder="请选择制度文号">
							    	<el-option v-for="item in zhiduNo.unitsData" :key="item.value" :label="item.name" :value="item.name"></el-option>
							    </el-select>
							    <el-input v-model="zdIpt.txt" @blur="inptZdYear" style="float:right;width:24%;" placeholder="制度文号"></el-input>
							    <el-input v-model="zdIpt1.txt" @blur="inptZdNo" style="float:right;width:24%;margin-right:1%;" placeholder="制度文号"></el-input>
							</el-form-item>
		                </el-col>
              <el-col :span="8">
                <el-form-item label="生效日期" >
                  <el-date-picker type="date" style="margin-left:-10px" @change="changeDate" placeholder="选择日期" v-model="form.date1"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="制度状态" >
                    <el-select v-model="statusDatas.region" @change="changeStatus"  placeholder="请选择活动区域">
                      <el-option v-for="item in statusDatas.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
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
        form: {},
        orgnize: {
          user: '',
          region: '全部',
          unitsData:[{
            name:'全部',
            value:'00'
          },{
            name:'一级制度',
            value:'1'
          },{
            name:'二级制度',
            value:'2'
          },{
            name:'三级制度',
            value:'3'
          },{
            name:'四级制度',
            value:'4'
          },
    ]
        },
        orgnizes: {
          user: '',
          region: '基本制(一级制度)',
          unitsData:[{
            name:'基本制(一级制度)',
            value:'00'
          },{
            name:'工作制度(二级制度)',
            value:'01'
          },{
            name:'细则(三级制度)',
            value:'02'
          },]
        },
        orgnizea: {
          user: '',
          region: '全部',
          unitsData:[{
            name:'全部',
            value:'00'
          },{
            name:'面向风险管理指引(试行)',
            value:'01'
          },{
            name:'风险偏好体系管理办法(试行)',
            value:'02'
          },{
            name:'集中风险管理办法(试行)',
            value:'03'
          },{
            name:'风险防火墙管理办法(试行)',
            value:'04'
          },
            {
              name:'战略风险管理暂行办法(试行)',
              value:'05'
            },
            {
              name:'市场风险管理办法(试行)',
              value:'06'
            },
            {
              name:'信用风险管理办法(试行)',
              value:'07'
            },
            {
              name:'操作风险管理办法(试行)',
              value:'08'
            },
            {
              name:'声誉风险管理办法(试行)',
              value:'09'
            },
            {
              name:'流动性风险管理办法(试行)',
              value:'10'
            },
          ]
        },
        orgnizew: {
          user: '',
          region: '全部',
          unitsData:[{
            name:'全部',
            value:'00'
          },{
            name:'公司治理类',
            value:'01'
          },{
            name:'行政管理类',
            value:'02'
          },{
            name:'人力资源管理类',
            value:'03'
          },{
            name:'财务管理类',
            value:'04'
          },
            {
              name:'战略管理类',
              value:'05'
            },
            {
              name:'资金运用类',
              value:'06'
            },
            {
              name:'风险管理类',
              value:'07'
            },
            {
              name:'合规法务类',
              value:'08'
            },
            {
              name:'稽核审计类',
              value:'09'
            },
            {
              name:'监察类',
              value:'10'
            },
            {
              name:'其他类',
              value:'11'
            }
          ]
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
        departments: {
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
          },
            {
            name:'有效',
            value:'02'
          },{
            name:'废止',
            value:'03'
          }]
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
          type:'1',
          category:'00',
          department:'00',
          state:'',//共有-制度状态 全部=00，维护中=1，有效=2
          startDate:'',
          range:'00',
          name:'',
          fileNoHead:'',//制度文号头
          fileNoBody:'',//制度文号年
          fileNoFoot:'',//制度文号号码
          pageNo:'1',
          pageSize:'10',
          riskLevel:'',//风险类别等级
          fatherId:'',
          manageCategory:'',//管理类别
          manageLevel:''//内规细则
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
        this.askData.riskLevel = val;
      },
      changeAreaw(val){
        this.askData.manageCategory = val;
      },
      changeAreas(val){
        this.askData.manageLevel = val;
      },
      changeAreae(val){
        this.askData.fatherId = val;
      },
      changeDepart(val){
        this.askData.department = val;
      },
      changeStatus(val){
        this.askData.state = val;
      },
      changeDate(val){
        this.askData.startDate = formatDate(val,'yyyy-MM-dd');
      },
      changeOrg(){
        this.askData.name = this.dengmiQueryForm.wgOrgnize
      },
      changeName(){
        this.askData.name = this.dengmiQueryForm.wgName
      },
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

<style lang="scss" scoped="scoped">
	.iptFoor input{
		margin-left: 10%;
	}
	.el-col .el-input input{
		height: 28px;
		line-height: 28px;
	}
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
	.zdNo .el-form-item__label{
		padding-left: 5%;
		padding-right: 4%;
	}
	.zdNo .el-form-item__content .el-select{
		width: 50%;
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
	.odd .el-form-item__content .el-select{
			width: 35%;
			float: left;
	}
</style>
