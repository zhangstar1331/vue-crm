<template>
	<div id="dfChecks">
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div class="df">
		        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item label="维护部门">
							    <!-- <el-select v-model="department.region" @change="changeDepart" placeholder="请选择活动区域">
							    	<el-option v-for="item in department.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select> -->
							    <el-select v-model="mineStatus" placeholder="请选择" popper-class="insselect-tree" value-key="mineStatus">
									<el-option :value="mineStatus" style="height:auto">
										<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id">
										</el-tree>
									</el-option>
								</el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" align="center">
		                    <el-form-item label="制度状态">
							    <el-select v-model="statusDatas.region" @change="changeStatus"  placeholder="请选择活动区域">
							    	<el-option v-for="item in statusDatas.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" align="right">
		                    <el-form-item label="适用类型">
							    <el-select v-model="askData.dfCategory" @change="changeSuitRange" placeholder="请选择适用类型">
							    	<el-option v-for="item in suitRange.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item label="生效日期">
							     <el-date-picker type="date" @change="changeDate" placeholder="选择日期" v-model="form.date1"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" align="center">
		                    <el-form-item label="制度名称">
		                        <el-input v-model="dengmiQueryForm.wgName" @change = 'changeName' placeholder="请输入制度名称"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8" align="right">
	                    	<el-form-item class="zdNo" id="dfFileNo" prop="zhiduNo" label="制度文号" style="margin-right: 0;">
						    	<el-select v-model="zhiduNo.region" filterable allow-create @change="selectZdType" placeholder="请选择前缀">
						    		<el-option v-for="item in zhiduNo.unitsData" :key="item.value" :label="item.name" :value="item.name"></el-option>
							    </el-select>
							    <el-input v-model="zdIpt.txt" @blur="inptZdYear" style="float:right;width:28%;margin-left: -2px;" placeholder="文号"></el-input>
							    <el-input v-model="zdIpt1.txt" @blur="inptZdNo" style="float:right;width: 27%;margin-right:2%;" placeholder="年份"></el-input>
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
	import qs from 'qs'
	export default {
		props:['flag'],
	    data () {
	      return {
	        formData: {},
	        form: {},
	        orgnize: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	value:''
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
	        suitRange:{
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	code:''
	          },{
	          	name:'执行类',
	          	code:'1'
	          },{
	          	name:'参照类',
	          	code:'2'
	          }]
	        },
	        department: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	code:''
	          }]
	        },
	        statusDatas: {
	          user: '',
	          region: '有效',
	          unitsData:[{
	          	name:'全部',
	          	value:0
	          },{
	          	name:'有效',
	          	value:2
	          },{
	          	name:'废止',
	          	value:3
	          }]
	        },
	        zdIpt:{
	        	txt:''
	        },
	        zdIpt1:{
	        	txt:''
	        },
	        searchJobType: [],
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
	      		department:'',
	      		startDate:'',
	      		dfCategory:'',
	      		name:'',
	      		state:0,
	      		fileNoHead:'',//制度文号头
	      		fileNoBody:'',//制度文号年
	      		fileNoFoot:'',//制度文号号码
	      		pageNo:'1',
	      		pageSize:'10'
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
	    created () {
    		if(sessionStorage.flag == 0){
	    		this.askData.state = 2;
	    	}else{
	    		this.askData.state = 1;
	    		this.statusDatas.unitsData = [{ name:'维护中', value:1 }];
	    		this.$set(this.statusDatas,'region','维护中')
	    	}
	    	sessionStorage.reverEdit = '' //初始化此参数的目的是为了新建的时候不请求detail接口
	    	this.askData.dfCategory = this.$route.query.searchId
	      //获取部门数据
	      this.getDepartment(3)
		  this.searchData();
	      Bus.$on('page', (data) => {
	      	this.askData.pageNo = data;
          })
          	Bus.$on('isroleId',(data) => {
	      		this.mineStatus = ''
				this.askData.department = ''
	      		this.treeKey = +new Date();
	    	})
	    },
	    methods: {
	      getDepartment(type){
	      	this.axios.post('instweb/comm',JSON.stringify({type:type}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	      			// this.department.unitsData = this.department.unitsData.concat(res.data.department);
	      			this.zhiduNo.unitsData = res.data.fno;
				})
	      },
	      changeSuitRange(val){
	      		this.askData.dfCategory = val
	      },
	      searchData () {
	      	sessionStorage.askData = JSON.stringify(this.askData)
	      	Bus.$emit('askData',this.askData)
      		this.axios.post('instweb/query',JSON.stringify(this.askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
      			if(res.code === 200){
      				if(res.data.data != null){
      					Bus.$emit('formDatas',res.data)
      					Bus.$emit('totalResults',res.data.totalResults)
      				}else{
      					Bus.$emit('formDatas','')
      					Bus.$emit('totalResults','0')
      					return;
      				}
      			}
			})
	      },
	      selectZdType(val){
	      	this.askData.fileNoHead = val;
	      },
	      inptZdYear(){
	      	this.askData.fileNoFoot = this.zdIpt.txt
	      },
	      inptZdNo(){
	      	this.askData.fileNoBody = this.zdIpt1.txt
	      },
	      changeDepart(val){
	      		this.askData.department = val;
	      },
	      changeStatus(val){
	      		this.askData.state = val;
	      },
	      changeDate(val){
	      		if(val != null){
	      			this.askData.startDate = formatDate(val,'yyyy-MM-dd');
	      		}else{
	      			this.askData.startDate = '';
	      		}
	      },
	      changeOrg(){
	      		this.askData.publish = this.dengmiQueryForm.wgOrgnize
	      },
	      changeName(){
	      		this.askData.name = this.dengmiQueryForm.wgName
	      },
	      changeFie(){
	      		//制度文号头
	      		this.askData.fileNoHead = this.dengmiQueryForm.wgFile
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
	  		connectAxios(val,node,resolve){
	  			this.node = node
			  	this.resolve = resolve
	  			var params = qs.stringify({
			        groupId: val,
			        operator:4,
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
					resolve(arr)
		        })
	  		},
	  		getNodeInfo(node,resolve) {

			},
			handleNodeClick(node) {
				let res = this.$refs.tree.getCurrentNode(true,true)
				this.mineStatus = res.name
				this.askData.department = res.id
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
  #dfChecks .zdNo .el-form-item__content .el-select{
    width: 42%;
  }
	#dfChecks .search{
		float: right;
	    margin-right: 5px;
	    width: 68px;
	    height: 26px;
	    padding: 0;
	    font-size: 12px;
	    margin-top: 50px;
	}
	#dfChecks .zdNo .el-form-item__label{
		padding-right: 2.3%;
		padding-left: 0;
	}
	#dfChecks .iptFoor input{
		margin-left: 10%;
	}
	#dfChecks .el-col .el-input input{
		height: 28px;
		line-height: 28px;
	}
	#dfChecks .el-form-item{
		margin-right:18px;
		margin-bottom: 20px;
		width: 100%;
	}
	#dfChecks{
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
	.zdNo .el-form-item__label{
		padding-left: 5%;
		padding-right: 4%;
	}
	.zdNo .el-form-item__content .el-select{
		width: 50%;
	}
	.inOdd .el-form-item__content .el-select{
		width: 50%;
		float: left;
	}
	#dfFileNo{
		.el-form-item__content{
			text-align: left;
		}
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
