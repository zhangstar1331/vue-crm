<template>
	<div id="checkCss">
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div class="ids">
		        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item label="外规类别">
							    <el-select v-model="orgnize.region" @change="changeArea"  placeholder="请选外规类别">
							    	<el-option v-for="item in orgnize.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-if="companySource == '0'">
		                    <el-form-item label="维护部门">
							    <el-select v-model="mineStatus" placeholder="请选择" popper-class="insselect-tree" value-key="mineStatus">
									<el-option :value="mineStatus" style="height:auto;
									background:#FFF">
										<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id">
										</el-tree>
									</el-option>
								</el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-if="companySource == '1'">
		                    <el-form-item label="适用范围">
							    <el-select v-model="mineStatus" placeholder="请选择" popper-class="insselect-tree" value-key="mineStatus">
									<el-option :value="mineStatus" style="height:auto;
									background:#FFF">
										<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id">
										</el-tree>
									</el-option>
								</el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="外规状态">
							    <el-select v-model="statusDatas.region" @change="changeStatus"  placeholder="请选择活动区域">
							    	<el-option v-for="item in statusDatas.unitsData" :key="item.value" :label="item.name" :value="item.value"></el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="生效日期">
							     <el-date-picker type="date" @change="changeDate" placeholder="选择日期" v-model="form.date1"></el-date-picker>
							</el-form-item>
		                </el-col>
		                <el-col :span="8" v-if="companySource == '0'">
							<el-form-item label="适用范围">
							    <el-select v-model="searchJobType" multiple collapse-tags  @change="changeSelect" placeholder="请选择适用范围">
							    	<el-option v-for="item in placeDatas.unitsData" id="rangeArea" :key="item.label" :label="item.value" :value="item.label"> </el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="发文机关">
		                    	<el-select v-model="askData.publish" @change="changeOrg" placeholder="请选择适用范围 ">
							    	<el-option v-for="item in dengmiQueryForm.unitsData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
							    </el-select>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="外规名称">
		                        <el-input v-model="dengmiQueryForm.wgName" @change = 'changeName' placeholder="请输入外规名称"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item class="zdNo" prop="zhiduNo" label="外规文号">
							    <el-select v-model="wgsName" style="width: 42%;" filterable  @change="selectZdType" placeholder="请选择前缀" v-if="companySource == '0'">
							    	<el-option v-for="item in zhiduNo.unitsData" :key="item.value" :label="item.name" :value="item.name"></el-option>
							    </el-select>
							    <el-input v-model="wgsName" style="width: 42%;" @change="selectZdType" placeholder="请输入前缀" v-if="companySource == '1'"></el-input>
							    <el-input v-model="zdIpt.txt" @blur="inptZdYear" style="float:right;width:28%; " placeholder="文号"></el-input>
							    <el-input v-model="zdIpt1.txt"  @blur="inptZdNo" style="float:right;width:28%;margin-left:1%;margin-right: 1%;" placeholder="年份"></el-input>
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
	import {mapState, mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		props:['flag'],
	    data () {
	      return {
	      	wgsName:'',
	        formData: {},
	        form: {},
	        handleData:[],
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
	          	name:'地方性规章',
	          	value:'03'
	          },{
	          	name:'部门规章',
	          	value:'04'
	          },{
	          	name:'规范性文件',
	          	value:'05'
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
	          	code:''
	          }]
	        },
	        statusDatas: {
	          user: '',
	          region: '有效',
	          unitsData:[{ name:'全部', value:0 },{ name:'有效', value:2 },{ name:'废止', value:3 }]
	        },
	        zdIpt:{
	        	txt:''
	        },
	        zdIpt1:{
	        	txt:''
	        },
	        searchJobType: [ ],
	        oldSearchJobType: [],
	        placeDatas:{
	        	user: '',
		        region: '',
		        unitsData:[
                {label: '', value: '全部'},
	            {label: '00', value: '全系统'},
	            {label: '01', value: '集团本级'},
	            {label: '02', value: '保险子公司'},
	            {label: '03', value: '非保险子公司'},
	            {label: '04', value: '产险公司'},
	            {label: '05', value: '人身险公司'},
	            {label: '06', value: '资管公司'}
	        	]
	        },
	        dengmiQueryForm: {
	            wgOrgnize:'',
	            wgName:'',
	            wgFile:'',
	            unitsData:[
	            	{
            		name:'全部',
            		id:''
	            	}
	            ]
	        },
	        askData:{
	        	type:'2',
	      		category:'00',
	      		department:'00',
	      		state:0,
	      		startDate:'',
	      		range:'',
	      		publish:'',
	      		name:'',
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
	    	if(this.flag == 0){
	    		this.askData.state = 2;
	    	}else{
	    		this.askData.state = 1;
	    		this.statusDatas.unitsData = [{ name:'维护中', value:1 }];
	    		this.$set(this.statusDatas,'region','维护中')
	    	}
	    	sessionStorage.reverEdit = '' //初始化此参数的目的是为了新建的时候不请求detail接口
	    	if(!this.$route.query.searchId){
	    		this.askData.publish = ''
	    	} else{
	    		this.askData.publish = this.$route.query.searchId
	    	}
	      //获取部门数据
	      this.getDepartment(2)
	      //获取列表数据
	      this.$nextTick(()=>{
	      	this.searchData(this.$route.query.searchId);
	      })
	      Bus.$on('page', (data) => {
	      	this.askData.pageNo = data;
          })
	      	Bus.$on('isroleId',(data) => {
	      		this.mineStatus = ''
				this.askData.department = ''
	      		this.treeKey = +new Date();
	    	})
	    },
	    watch:{
	  		'formData': {
	        handler: function (newVal, oldVal) {
	        },
	        deep: true
	      },
	      wgsName: function (newName,oldName) {
	      }
	  	},
	  	computed:{
			...mapState(['companySource']),
		},
	    methods: {
	      remoteMethod(query){
	    		console.log(query)
	    	},
	      getDepartment(type){
	      	this.axios.post('instweb/comm',JSON.stringify({type:type}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	      			// this.department.unitsData = this.department.unitsData.concat(res.data.department);
	      			this.zhiduNo.unitsData = res.data.fno;
	      			this.dengmiQueryForm.unitsData = this.dengmiQueryForm.unitsData.concat(res.data.office)
				})
	      },
	      searchData(officId) {
	      	sessionStorage.askData = JSON.stringify(this.askData)
	      	Bus.$emit('askData',this.askData)
      		this.axios.post('instweb/query',JSON.stringify(this.askData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
      			if(res.code === 200){
      				if(res.data.data != null){
      					Bus.$emit('formDatas',res.data)
      					Bus.$emit('totalResults',res.data.totalResults)
      				}else{
      					Bus.$emit('formDatas',res.data);
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
	      changeDate(val){
	      		if(val != null){
	      			this.askData.startDate = formatDate(val,'yyyy-MM-dd');
	      		}else{
	      			this.askData.startDate = '';
	      		}
	      },
	      changeOrg(val){
	      		this.askData.publish = val
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
			  	if(!node.data||(node.data&&node.data.name !== '全部')){
		  			var params = qs.stringify({
				        groupId: val,
				        operator:4,
				        instType:2
				    })
			        this.axios.post('/rmUser/insGroup', params).then((res)=>{
			        	var arr = [];
			        	if(node.level == 0 && this.companySource == '1'){
			        		arr = [{ name: '全部',groupId:''}];
			        	}
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
			    } else{
			  		resolve([])
			  	}
	  		},
	  		getNodeInfo(node,resolve) {

			},
			handleNodeClick(node) {
				let res = this.$refs.tree.getCurrentNode(true,true)
				this.mineStatus = res.name
				this.askData.department = res.id
			}
	    }
	  }
</script>

<style lang="scss">
#checkCss{
  .ids .zdNo .el-form-item__content .el-select{
    width: 37%;
  }
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
	.el-col:nth-child(3n+1){
		text-align: left;
	}
	.el-col:nth-child(3n+3){
		text-align: right;
	}
	.el-col:nth-child(3n+1) .el-form-item__label{
		padding-left: 0;
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-right: 5px;
	    padding:0;
    font-size: 12px;

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
