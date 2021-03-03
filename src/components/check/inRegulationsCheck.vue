<template>
	<div id="inNews">
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div id="inCheck">
		        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
		        	<el-row>
		        		<el-col :span="8">
		                    <el-form-item prop="zhiduNo" label="制度文号" class="zdNo" >
							    <el-select v-model="zhiduNo.region" filterable allow-create @change="selectZdType" placeholder="请选择前缀" v-if="companySource == '0'">
							    	<el-option v-for="item in zhiduNo.unitsData" :key="item.value" :label="item.name" :value="item.name"></el-option>
							    </el-select>
							    <el-input v-model="zhiduNo.region" @change="selectZdType" style="width:42%" placeholder="请输入前缀" v-if="companySource == '1'"></el-input>
							    <el-input v-model="saveDatas.fileNoFoot" @change="inptZdNo" style="float:right;width:28%" placeholder="文号"></el-input>
								<el-input v-model="saveDatas.fileNoBody" @change="inptZdYear" style="float:right;width:28%;margin-left:1%;margin-right: 1%;" placeholder="年份"></el-input>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-if="companySource == '0'">
		                    <el-form-item id="inOdd" prop="fxSort" label="风险类别" >
							    <el-select style="width:50%;float: left;" v-model="fxSort.region" filterable @change="selectSortType" placeholder="请选择制度层级">
							    	<el-option v-for="item in fxSort.unitsData" :key="item.value" :label="item.name" :value="item.code"></el-option>
							    </el-select>
							    <el-select style="width:50%;float:left" v-model="fxSortParent.region" filterable @change="selectParentType" placeholder="请选择父级制度">
							    	<el-option v-for="item in fxSortParent.unitsData" :key="item.value" :label="item.name" :value="item.id"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" style="text-align:right">
		                    <el-form-item id="inOdd1" prop="companySort" label="公司管理类别" >
							    <el-select :style="{width:companySource == '0'?'50%':'100%',float:'left'}" v-model="companySort.region" @change="chooseComSort" placeholder="请选择制度层级">
							    	<el-option v-for="item in companySort.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
							    </el-select>
							    <el-select style="width: 50%;float:left" v-model="companySortParent.region" filterable @change="choosecomSortParent" placeholder="请选择制度层级" v-if="companySource == '0'">
							    	<el-option v-for="item in companySortParent.unitsData" :key="item.value" :label="item.name" :value="item.code"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		            	<el-col :span="8">
		                    <el-form-item label="发布日期" >
							     <el-date-picker type="date" @change="changeDate" placeholder="选择日期" v-model="form.date1"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="生效日期" >
							     <el-date-picker type="date" @change="changeStart" placeholder="选择日期" v-model="form.date2"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" style="text-align:right">
		                    <el-form-item label="使用期限" >
							     <el-date-picker type="date" @change="changeEnd" placeholder="长期有效" v-model="form.date3"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-if="companySource == '0'">
		                    <el-form-item label="适用范围" >
							    <el-select v-model="searchJobType" multiple collapse-tags  @change="changeSelect" placeholder="请选择适用范围">
							    	<el-option v-for="item in placeDatas.unitsData" id="rangeArea" :key="item.label" :label="item.value" :value="item.label"> </el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-if="companySource == '0'">
		                    <el-form-item label="维护部门" >
							    <el-select v-model="department.region" @change="changeDepart" placeholder="请选择维护部门">
							    	<el-option v-for="item in department.unitsData" :key="item.groupId" :label="item.name" :value="item.groupId"></el-option>
							    </el-select> 
							    <!--<el-select v-model="mineStatus" placeholder="请选择" popper-class="insselect-tree" value-key="mineStatus">
									<el-option :value="mineStatus" style="height:auto">
										<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id">
										</el-tree>
									</el-option>
								</el-select>-->
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-if="companySource == '1'">
		                    <el-form-item label="适用范围" >
							    <el-select v-model="department.region" @change="changeDepart" placeholder="请选择适用范围">
							    	<el-option v-for="item in department.unitsData" :key="item.groupId" :label="item.name" :value="item.groupId"></el-option>
							    </el-select> 
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="制度名称" >
		                        <el-input v-model="saveDatas.name" @change="getInputName" placeholder="请输入内部制度名称"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8" :style="{textAlign:companySource == '0'?'left':'right',paddingLeft:companySource == '0'?'6px':'0'}">
		                    <el-form-item id="person" label="录入人员" class="iptPerson">
		                        <el-input v-model="dengmiQueryForm.midiLength" disabled placeholder="请输入录入人员"></el-input>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		        </el-form>
		    </div>
		</template>
	    </el-form-item>
	   </el-form>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import {mapState, mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		props:['echoData'],
		beforeCreate(){
			localStorage.removeItem('singleData');
//      	localStorage.removeItem('infoData');
        	localStorage.removeItem('fileId');
        	sessionStorage.removeItem('askData');
        	sessionStorage.removeItem('detailData');
        	sessionStorage.removeItem('saveDatas');
        	sessionStorage.instId = ''; //instId 修订id
		},
	  	created() {
	  		Bus.$on('isroleId',(data) => {
	      		this.mineStatus = ''
	      		this.treeKey = +new Date();
	    	})
		  	this.getZdNo(1)
		  	this.getDepartInfo()
	  	  	sessionStorage.setItem('saveDatas',JSON.stringify({'type':'1'}))
	    },
	    data () {
	      return {
	      	instId:'',
	        formData: {},
	        form: {},
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
	          	name:'地方性法规',
	          	value:'03'
	          },{
	          	name:'部门规章',
	          	value:'04'
	          },{
	          	name:'规范性文件',
	          	value:'05'
	          }]
	        },
	        department: {
	          user: '',
	          region: '',
	          unitsData:[]
	        },
	        zhiduNo :{
	           user: '',
		       region: '',
		       unitsData:[]
	        },
	        fxSort:{
	        	user: '',
		        region: '',
		        unitsData:[
		        	{name: "一级制度", code: 1},
		        	{name: "二级制度", code: 2},
		        	{name: "三级制度", code: 3},
		        	{name: "四级制度", code: 4}
		        ]
	        },
	        fxSortParent:{
	        	user: '',
		        region: '',
		        unitsData:[]
	        },
	        companySort:{
	        	user: '',
		        region: '',
		        unitsData:[
//		        	{name: "公司治理类", code: "01"},
//		        	{name: "行政管理类", code: "02"},
//		        	{name: "人力资源管理类", code: "03"},
//		        	{name: "财务管理类", code: "04"},
//		        	{name: "战略管理类", code: "05"},
//		        	{name: "资金运用类", code: "06"},
//		        	{name: "风险管理类", code: "07"},
//		        	{name: "合规法务类", code: "08"},
//		        	{name: "稽核审计类", code: "09"},
//		        	{name: "监察类", code: "10"},
//		        	{name: "其他类", code: "11"}
		        ]
	        },
	        companySortParent:{
	        	user: '',
		        region: '',
		        unitsData:[
		        	{name: "基本制度（一级制度）", code: 1},
		        	{name: "工作制度（二级制度）", code: 2},
		        	{name: "实施细则（三级制度）", code: 3},
		        ]
	        },
	        statusDatas: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	value:'00'
	          },{
	          	name:'有效',
	          	value:'02'
	          },{
	          	name:'废止',
	          	value:'03'
	          }]
	        },
	        searchJobType: [],
	        oldSearchJobType: [],
	        placeDatas:{
	        	user: '',
		        region: '全国',
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
	        	],
	        },
	        dengmiQueryForm: {
	            mimian:'',
	            mimu:'',
	            mige:'',
	            midi:'',
	            zuozhe:'',
	            midiLength:''
	        },
	        zdIpt:{
	        	txt:''
	        },
	        zdIpt1:{
	        	txt:''
	        },
	        institution: {
	            instituName:'',
	            instituNo:'',
	            instituOrg:'',
	            instituRange:''
	        },
	        //缓存所有保存数据
	        saveDatas:{
	        	id:'', //制度id
	        	type:'1', //内外规类型 1.内规 2.外规
	        	issuedDate:'', // 发布日期
	        	startDate:'',
	        	endDate:'3019-12-12',
	        	fileNoHead:'',
	        	fileNoBody:'',
	        	fileNoFoot:'',
	        	riskLevel:'',//风险类别
	        	fatherId:'',//风险类别父id
	        	manageCategory:'',//公司管理类别
	        	manageLevel:'',//公司管理 细则
	        	name:'', //外规名称
	        	department:'00', //维护部门
	        	range:'00' //适用范围
	        },
	        rules:{
	        	region: [
	            { required: true, message: '请选择活动区域', trigger: 'change' }
	          ]
	        },
	         ruleForm: {
	          region: ''
	        },
	        // 部门视图
	        insprops:{
  				label: 'name',
  				children: 'zones',
  				isLeaf: 'leaf',
  				id:'',
  				name:'',
  				node:{},
  				resolve:{},
  				value:"id"
  			},
	        mineStatus:'',//部门NAME
	        treeKey:''
	      }
	    },
	    methods: {
	      searchData () {
	      	this.axios.post('instweb/query',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	      		 Bus.$emit('formDatas',res.data)
			})
	      },
         initData(echoData){
         	var reverEdit = sessionStorage.reverEdit;
         	var saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
			//回填维护部门
				saveDatas.department = echoData.department;
				this.department.region = echoData.department;
//				this.mineStatus = echoData.departmentName;
//				for (var i = 0; i < this.department.unitsData.length; i++) {
//					if(this.department.unitsData[i].code === echoData.department){
//						 this.department.region = this.department.unitsData[i].name
//					}
//				}
			//回填风险类别
				saveDatas.riskLevel = echoData.riskLevel;
				for (var i = 0; i < this.fxSort.unitsData.length; i++){
					if(this.fxSort.unitsData[i].code === echoData.riskLevel){
						 this.fxSort.region = this.fxSort.unitsData[i].name
					}
				}
				saveDatas.fatherId = echoData.fatherId;
				this.reWriteFxSort(echoData.riskLevel,echoData.fatherId)
			//回填公司管理类别
				saveDatas.manageCategory = echoData.manageCategory;
				for (var i = 0; i < this.companySort.unitsData.length; i++){
					if(this.companySort.unitsData[i].value === echoData.manageCategory){
						 this.companySort.region = this.companySort.unitsData[i].name
					}
				}
			//回填公司管理父级制度
				saveDatas.manageLevel = echoData.manageLevel;
				for (var i = 0; i < this.companySortParent.unitsData.length; i++){
					if(this.companySortParent.unitsData[i].code === echoData.manageLevel){
						 this.companySortParent.region = this.companySortParent.unitsData[i].name
					}
				}
			//回填颁布日期
				saveDatas.issuedDate = echoData.issuedDate;
				this.$set(this.form,'date1',echoData.issuedDate)
			//回填生效日期
				saveDatas.startDate = echoData.startDate;
				this.$set(this.form,'date2',echoData.startDate)
			//回填使用期限
				saveDatas.endDate = echoData.endDate;
				if(echoData.endDate == '3019-12-12'){
					echoData.endDate = ''
				}
				this.$set(this.form,'date3',echoData.endDate)
			//回填制度名称
				saveDatas.name = echoData.name;
				this.saveDatas.name = echoData.name;
			//回填制度文号
				saveDatas.fileNoHead = echoData.fileNoHead;
				saveDatas.fileNoBody = echoData.fileNoBody;
				this.saveDatas.fileNoFoot = echoData.fileNoFoot;
				this.zhiduNo.region = echoData.fileNoHead;
				this.saveDatas.fileNoBody = echoData.fileNoBody;
				saveDatas.fileNoFoot = echoData.fileNoFoot;
			//回填适用范围
				if(echoData.range){
					saveDatas.range = echoData.range.toString();
					for (var i = 0; i < saveDatas.range.length; i++) {
						for (var j = 0; j < this.placeDatas.unitsData.length; j++) {
							if(this.placeDatas.unitsData[j].label == echoData.range[i]){
								 this.searchJobType.push(this.placeDatas.unitsData[j].label)
							}
						}
					}
				}
				var reviseId = JSON.parse(localStorage.getItem('infoData')).reviseId
				if(reviseId != ''){
					sessionStorage.setItem('saveDatas',JSON.stringify(saveDatas))
				}else{
					var id = JSON.parse(localStorage.getItem('infoData')).institutionId;
					this.saveDatas.id = id;
					sessionStorage.setItem('saveDatas',JSON.stringify(saveDatas))
				}
        },
          getZdNo(type){
	      	this.axios.post('instweb/comm',JSON.stringify({'type':type}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	      			// this.department.unitsData = res.data.department;
	      			this.companySort.unitsData = res.data.mtree
	      			this.zhiduNo.unitsData = res.data.fno;
	      			this.dengmiQueryForm.midiLength = res.data.operatorName
				})
	      },
          getDepartment(type,val){
	      	this.axios.post('instweb/comm',JSON.stringify({'type':type}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	      			// this.department.unitsData = res.data.department;
	      			this.zhiduNo.unitsData = res.data.fno;
	      			this.dengmiQueryForm.midiLength = res.data.operatorName
	      			this.initData(val)
				})
	      },
	      getInputName(){
//	      	if (!this.saveDatas.name.match(/^[\u4e00-\u9faf|\w\s•·.]+$/)) {
//	             this.$alert('制度名称中不能包含特殊字符','提示', {
//				          confirmButtonText: '确定'
//				        });
//				 this.saveDatas.name = ''
//	             return false;
//	         }
	      	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	      	saveDatas.name = this.saveDatas.name;
	      	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	      getInputNo(){
	      	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	      	saveDatas.outFileNo = this.saveDatas.outFileNo;
	      	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	      getInputPub(){
	      	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	      	saveDatas.publish = this.saveDatas.publish;
	      	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	       selectZdType(val){
	       	var startStr = val.slice(0, 4)
	       	var endStr = val.slice(val.length-1)
//	       	var a=1;
//	       	if(startStr != '中华集团' || endStr != '发'){
//	       		this.zhiduNo.unitsData.forEach((item)=>{
//					if(item.name.indexOf(val) != -1){
//						a=2;
//			       		return true;
//					}
//				})
//	       		if(a==1){
//		       		this.zhiduNo.region = ''
//		       		this.$alert('请以正确的格式添加', '提示', {
//				          confirmButtonText: '确定'
//				        });
//	       		}
//	       	}

	       	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	       	saveDatas.fileNoHead = val;
	       	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	      inptZdYear(){
	      	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	       	saveDatas.fileNoBody = this.saveDatas.fileNoBody;
	       	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	      inptZdNo(){
	      	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	       	saveDatas.fileNoFoot = this.saveDatas.fileNoFoot;
	       	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	      changeDepart(val){
      		const saveDatas = JSON.parse(sessionStorage.saveDatas);
	      	saveDatas.department = val;
	      	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
		 changeDate(val){
	     	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	     	if(val != null){
	     		saveDatas.issuedDate = formatDate(val,'yyyy-MM-dd');
	     		this.$set(this.form,'date2',val)
		     	saveDatas.startDate = formatDate(val,'yyyy-MM-dd');
	     	}else{
	     		saveDatas.issuedDate = '';
	     		sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     	}
	     	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     	var startTime = new Date(saveDatas.startDate).getTime();
	     	var endTime = new Date(saveDatas.endDate).getTime()
	     	var issuedDate = new Date(saveDatas.issuedDate).getTime();
		     	if(issuedDate > startTime){
		     		this.$alert('生效日期应该不小于颁布日期', '提示', {
					          confirmButtonText: '确定'
					        });
					        this.form.date1 = ''
						    saveDatas.issuedDate = '';
	     					sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     					return;
		     		}
		     	if(issuedDate > endTime){
		     		this.$alert('使用日期应该不小于颁布日期', '提示', {
					          confirmButtonText: '确定'
					        });
					        this.form.date1 = ''
						    saveDatas.issuedDate = '';
						    this.form.date2 = ''
						    saveDatas.startDate = '';
	     					sessionStorage.saveDatas = JSON.stringify(saveDatas);
		     		}
	     },
	     changeStart(val){
	     	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	     	if(val != null){
	     		saveDatas.startDate = formatDate(val,'yyyy-MM-dd');
	     	}else{
	     		saveDatas.startDate = '';
	     		sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     	}
	     	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     	var startTime = new Date(saveDatas.startDate).getTime();
	     	var endTime = new Date(saveDatas.endDate).getTime()
	     	var issuedDate = new Date(saveDatas.issuedDate).getTime();
			if(startTime > endTime){
	     		this.$alert('生效日期应该不小于使用日期', '提示', {
				          confirmButtonText: '确定'
				        });
				    this.form.date2 = '';
				    saveDatas.startDate = '';
	     			sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     			return;
	     		}
			if(startTime < issuedDate){
	     		this.$alert('生效日期应该不小于颁布日期', '提示', {
				          confirmButtonText: '确定'
				        });
				    // this.form.date2 = '';
				    // saveDatas.startDate = '';
	     			sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     		}
	     },
	     changeEnd(val){
	     	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	     	if(val != null){
	     		saveDatas.endDate = formatDate(val,'yyyy-MM-dd');
	     	}else{
	     		 saveDatas.endDate = '3019-12-12';
     			 sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     	}
	     	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     	//获取生效日期
	     	var startTime = new Date(saveDatas.startDate).getTime();
	     	var endTime = new Date(saveDatas.endDate).getTime()
	     	var issuedDate = new Date(saveDatas.issuedDate).getTime();
	     	if(endTime < startTime){
	     		this.$alert('使用期限应该不小于生效日期', '提示', {
				          confirmButtonText: '确定'
				        });
					    this.form.date3 = '';
					    saveDatas.endDate = '3019-12-12';
     					sessionStorage.saveDatas = JSON.stringify(saveDatas);
     					return;
	     		}
	     	if(endTime < issuedDate){
	     		this.$alert('有限期限应该不小于颁布日期', '提示', {
				          confirmButtonText: '确定'
				        });
					    this.form.date3 = '';
					    saveDatas.endDate = '3019-12-12';
     					sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     		}
	     },
	     reWriteFxSort(val,fatherId){
	     	this.axios.post('/instweb/query/super',JSON.stringify({'riskLevel':val}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	     		this.fxSortParent.unitsData = res.data;
	     		if(res.data != null){
	     			for (var i = 0; i < this.fxSortParent.unitsData.length; i++){
	     				if(this.fxSortParent.unitsData[i].id === fatherId){
	     					 this.fxSortParent.region = this.fxSortParent.unitsData[i].name
	     				}
	     			}
	     		}
	     	})
	     },
	     selectSortType(val){
	     	this.axios.post('/instweb/query/super',JSON.stringify({'riskLevel':val}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
      			this.fxSortParent.unitsData = res.data;
      			this.fxSortParent.region = ''
			})
	     	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	     	saveDatas.riskLevel = val;
	     	if(val === '1'){
	     		saveDatas.fatherId = '';
	     	}
	     	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     },
	     selectParentType(val){
	     	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	     	saveDatas.fatherId = val;
	     	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     },
	     chooseComSort(val){
	     	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	     	saveDatas.manageCategory = val;
	     	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     },
	     choosecomSortParent(val){
	     	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	     	saveDatas.manageLevel = val;
	     	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	     	console.log(val)
	     },
	     changeSelect(val) {
	        const allValues = [];
	        // 用来储存上一次的值，可以进行对比
	        const oldVal = this.oldSearchJobType.length === 1 ? this.oldSearchJobType[0] : [];
	        // 若是全部选择
	        if (val.includes('00')){
	        	allValues.push('00')
	        	this.searchJobType = allValues;
	        	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	        	saveDatas.range = allValues.toString()
	        	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	        }else{
	        	if(val.includes('全系统')){
	        		this.searchJobType.splice(this.searchJobType.findIndex(item => item === '全系统'), 1)
	        	}
	        	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	        	saveDatas.range = val.toString();
	        	sessionStorage.saveDatas = JSON.stringify(saveDatas);
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
	      // 获取部门数据
		    loadNode(node,resolve){
	  			if (node.level === 0) {
			  		this.connectAxios('',node,resolve)
		        }else{
		  			var mid = node.data.id === undefined?'':node.data.id;
		  			this.connectAxios(mid,node,resolve)
				}
	  		},
	  		getDepartInfo(){
	  			var params = qs.stringify({
			        operator:2,
			        instType:1
			    })
	  			this.axios.post('/rmUser/insGroup', params).then((res)=>{
	  				this.department.unitsData = res.data;
		        })
	  		},
	  		connectAxios(val,node,resolve){
	  			this.node = node
			  	this.resolve = resolve
	  			var params = qs.stringify({
			        groupId: val,
			        operator:2,
			        instType:1
			    })
		        this.axios.post('/rmUser/insGroup', params).then((res)=>{
		       		var arr = [];
	                if(res.data != null){
			          	for (var i = 0; i < res.data.length; i++) {
			           	var obj = new Object;
			           	obj.name = res.data[i].name;
			           	obj.id = res.data[i].groupId;
			           	arr.push(obj);
			          } 
	                }
	                if(node.level != 0){
	                	arr = []
	                }
					resolve(arr)
		        })
	  		},
	  		getNodeInfo(node,resolve) {

			},
			handleNodeClick(node) {
				let res = this.$refs.tree.getCurrentNode(true,true)
				this.mineStatus = res.name
				const saveDatas = JSON.parse(sessionStorage.saveDatas)
				saveDatas.department = res.id
				sessionStorage.saveDatas = JSON.stringify(saveDatas);
			}
	  },
	    watch: {
	      'formData': {
	        handler: function (newVal, oldVal) {
	        },
	        deep: true
	      },
	      echoData(val){
	      		this.getDepartment(1,val)
	      	}
	    },
	    computed:{
	    	 ...mapState(['companySource']),
	    }
	}
</script>

<style lang="scss">
  #inCheck .zdNo .el-form-item__content .el-select{
    width: 42%;
  }
	.colorRed{
		color: red;
	}
	#inCheck{
		.el-form-item{
			margin-right:18px;
			margin-bottom: 20px;
			width: 100%;
		}
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
	.iptPerson label::before,.wgAddress label::before{
		color: #fff;
	}
	#inNews .el-form-item__label{
		padding:0 3% 0 2%;
	}
	#inCheck .el-col{
		text-align: center;
	}
	#inCheck .el-col:nth-child(3n+1){
		text-align: left;
	}
	#inCheck .el-col:nth-child(3n+3){
		text-align: right;
	}
	#inCheck .el-col:nth-child(3n+1) .el-form-item__label{
		padding-left: 0;
	}
	#inCheck .search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-right: 5px;
	    padding:0;
	}
	.zdNo .el-form-item__label{
		padding-left: 5%;
		padding-right: 4%;
	}
	.zdNo .el-form-item__content .el-select{
		width: 50%;
	}
	#inOdd .el-form-item__content .el-select,#inOdd1 .el-form-item__content .el-select{
		width: 50%;
		float: left;
	}
	#inCheck .el-form-item__label::before{
	    content: '*';
	    color: #F56C6C;
	    margin-right: 4px;
	}
	#person .el-form-item__label::before{
		content:''
	}
	#person .el-input__inner{
		width:101%;
	}
	.insselect-tree .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
	    height: auto;
	    max-height: 274px;
	    overflow:visible !important;
	    background:#FFF
    }
    .insselect-tree .el-tree-node__label{
		font-weight: normal
    }
</style>
