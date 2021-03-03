<template>
	<div id="dfCheckCss">
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div id="dfCheck">
		        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item prop="zhiduNo" class="zdNo" label="制度文号" >
							    <el-select v-model="zhiduNo.region" filterable allow-create @change="selectZdType" placeholder="请输入前缀">
							    	<el-option v-for="item in zhiduNo.unitsData" :key="item.value" :label="item.name" :value="item.name"></el-option>
							    </el-select>
							    <el-input id="zdIpt" v-model="saveDatas.fileNoFoot" @change="inptZdNo" style="float:right;width:28%" placeholder="文号"></el-input>
								<el-input class="zdIpt" v-model="saveDatas.fileNoBody" @change="inptZdYear" style="float:right;width:28%;margin-left:1%;margin-right: 1%;" placeholder="年份"></el-input>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="制度名称" >
		                        <el-input v-model="saveDatas.name" @change="getInputName" placeholder="请输入制度名称"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8">
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
		            </el-row>
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item label="适用类型" >
							    <el-select v-model="suitRange.region" @change="changeSuitRange" placeholder="请选择适用类型">
							    	<el-option v-for="item in suitRange.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="发布日期" >
							     <el-date-picker type="date" @change="changeDate" placeholder="选择日期" v-model="form.date1"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="生效日期" required>
							     <el-date-picker type="date" @change="changeStart" placeholder="选择日期" v-model="form.date2"></el-date-picker>
							</el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		            	<el-col :span="8">
		                    <el-form-item label="使用期限" >
							     <el-date-picker type="date" @change="changeEnd" placeholder="长期有效" v-model="form.date3"></el-date-picker>
							</el-form-item>
		                </el-col>
		                 <el-col :span="8" style="padding-left: 4px;">
		                    <el-form-item id="person" label="录入人员" class="iptPerson">
		                        <el-input v-model="dengmiQueryForm.midiLength" disabled placeholder="请输入录入人员"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8">
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
	  	  this.getDepartInfo()
	  	  if(this.$route.query.name == '1'){
	  	  	this.getSuitData(3)
	  	  }
	  	  Bus.$on('isroleId',(data) => {
      		this.mineStatus = ''
      		this.treeKey = +new Date();
    	  })
	  	  sessionStorage.setItem('saveDatas',JSON.stringify({'type':'3','dfCategory':'00'}))
	    },
	    data () {
	      return {
	      	instId:'',
	        formData: {},
	        form: {},
	        orgnize: {
	          user: '',
	          region: '',
	          unitsData:[{
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
	        suitRange:{
	          user: '',
	          region: '',
	          unitsData:[{
	          	name:'执行类',
	          	code:'1'
	          },{
	          	name:'参照类',
	          	code:'2'
	          }]
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
		            {label: '04', value: '产险公司'},
		            {label: '05', value: '人身险公司'},
		            {label: '06', value: '资管公司'}
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
	        institution: {
	            instituName:'',
	            instituNo:'',
	            instituOrg:'',
	            instituRange:''
	        },
	        //缓存所有保存数据
	        saveDatas:{
	        	id:'', //制度id
	        	type:'2', //内外规类型 1.内规 2.外规
	        	issuedDate:'', // 发布日期
	        	startDate:'',
	        	endDate:'3019-12-12',
	        	name:'', //制度名称
	        	fileNoHead:'',
	        	fileNoBody:'',
	        	fileNoFoot:'',
	        	department:'00', //维护部门
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
	      	this.$axios.post('instweb/query',data).then((res)=>{
	      		 Bus.$emit('formDatas',res.data)
			})
	      },
         initData(echoData){
         	var reverEdit = sessionStorage.reverEdit;
         	var saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
			//回填维护部门
				saveDatas.department = echoData.department;
				this.mineStatus = echoData.departmentName;
				this.department.region = echoData.department;
				if(this.department.unitsData.length != 0){
					for (var i = 0; i < this.department.unitsData.length; i++) {
						if(this.department.unitsData[i].code === echoData.department){
							 this.department.region = this.department.unitsData[i].name
						}
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
				saveDatas.fileNoFoot = echoData.fileNoFoot;
				this.zhiduNo.region = echoData.fileNoHead;
				this.saveDatas.fileNoBody = echoData.fileNoBody;
				this.saveDatas.fileNoFoot = echoData.fileNoFoot;
			//回填适用类型
				saveDatas.dfCategory = echoData.dfCategory;
				if(this.suitRange.unitsData.length != 0){
					for (var i = 0; i < this.suitRange.unitsData.length; i++) {
						if(this.suitRange.unitsData[i].code == echoData.dfCategory){
							 this.suitRange.region = this.suitRange.unitsData[i].name
						}
					}
				}
				var reviseId = JSON.parse(localStorage.getItem('infoData')).reviseId
				if(reviseId != ''){
					sessionStorage.setItem('saveDatas',JSON.stringify(saveDatas))
				}else{
					var id = JSON.parse(localStorage.getItem('infoData')).institutionId;
					saveDatas.id = id;
					sessionStorage.setItem('saveDatas',JSON.stringify(saveDatas))
				}
        },
          getSuitData(type){
	      	this.axios.post('instweb/comm',JSON.stringify({type:type}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	      			this.zhiduNo.unitsData = res.data.fno;
	      			this.dengmiQueryForm.midiLength = res.data.operatorName
				})
	      },
          getDepartment(type,val){
	      	this.axios.post('instweb/comm',JSON.stringify({type:type}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	      			this.zhiduNo.unitsData = res.data.fno;
	      			this.dengmiQueryForm.midiLength = res.data.operatorName
	      			this.initData(val)
				})
	      },
	      changeSuitRange(val){
	      		const saveDatas = JSON.parse(sessionStorage.saveDatas);
		      	saveDatas.dfCategory = val.toString();
		      	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	      getInputName(){
	      	const saveDatas = JSON.parse(sessionStorage.saveDatas);
	      	saveDatas.name = this.saveDatas.name;
	      	sessionStorage.saveDatas = JSON.stringify(saveDatas);
	      },
	       selectZdType(val){
	       	var startStr = val.slice(0, 2)
	       	var endStr = val.slice(val.length-1)
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
			        instType:3
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
			        instType:3
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
	      	this.getDepartment(3,val)
	      }
	    }
	}
</script>

<style lang="scss">
#dfCheckCss{
  #dfCheck .zdNo .el-form-item__content .el-select{
    width: 42%;
  }
	.colorRed{
		color: red;
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
	.iptPerson label::before,.wgAddress label::before{
		color: #fff;
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
	.zdNo .el-form-item__content .el-select{
		width: 50%;
	}
	#dfCheck .el-form-item__label::before{
	    content: '*';
	    color: #F56C6C;
	    margin-right: 4px;
	}
	#person .el-form-item__label::before{
		content:''
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
}	
</style>
