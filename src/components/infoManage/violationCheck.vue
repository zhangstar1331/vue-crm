<template>
	<div id="lossSendCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="lossSendForm" label-position="left" ref="lossSendForm" size="mini">
			        	<el-row>
			                <el-col :span="8">
			                    <el-form-item label="事件发生时间">
								    <el-date-picker v-model="lossSendForm.occurDate" @change="changeOccurDate" placeholder="开始时间" :picker-options="starDatePicker"></el-date-picker>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="违规事由名称">
								    <el-input v-model="lossSendForm.name" @change='getName' placeholder="请输入违规事由名称" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                	<el-form-item label="违规主体" class="searchBtn">
				                    <el-select v-model="mineStatus" placeholder="请选择违规主体" multiple collapse-tags ref="searchSelect" value-key="mineStatus" @remove-tag="deleteOrg" filterable :filter-method="keyFilter" @focus="selectFoucus" @visible-change="visibleChange">
								    	<el-option :value="mineStatus" style="height:auto;background-color:#fff;">
								    		<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="groupId" show-checkbox @check="getNodeChange" :check-strictly="true" accordion :filter-node-method="filterNode"></el-tree>
								    	</el-option>
								    </el-select>
								    <el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg"></el-button>
							    </el-form-item>
			                </el-col>
			            </el-row>
			        </el-form>
			    </div>
			    <el-button type="primary" class="search" @click="goSearch">查询</el-button>
			</template>
	   </el-form>
	   <org-search :searchResult="searchResult" v-if="isShow" @closeMask="closeMaskTable"></org-search>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import {formatDateM} from 'src/utils/utils.js'
	import orgSearch from 'src/components/infoManage/orgSearch'
	import qs from 'qs'
	export default {
		props:['isFlag','isStore','checkList'],
	    data () {
	      return {
	      	lossSendForm:{
	      		name:'',//检查事项名称
	      		org:'全部',//机构
	      		occurDate:''
	      	},
	        starDatePicker:{
  				disabledDate: (time) => {
	            	return time.getTime() > Date.now()
	          	},
  			},
	        checkData:{
	        	status:this.isFlag,
	            pageNo:1,
	            pageSize:10
	        },
	        treeKey:'',
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
  			isShow:false,
  			searchResult:'',
  			mineStatus:[],
  			viewList:[],
  			arrLabel:[],
  			copy:[],
  			visible:false
	      }
	    },
	    mounted () {
	    	if(this.checkList){
	    		sessionStorage.setItem('askData'+this.isFlag,JSON.stringify(this.checkList))
	    	}
	    	if(this.$route.query.belongCompany!==undefined){
    			this.checkData.org = this.$route.query.belongCompany
    		}
    		if(this.isStore!==undefined){
    			this.checkData.ref = 1
    		}
    		if(this.$route.query.company!==undefined){
    			switch (this.$route.query.company){
    				case '合计':
    					this.mineStatus = []
    					break;
    				case '总计':
    					this.mineStatus = []
    					break;
    				case '集团':
    					this.mineStatus.push('集团本级*'+this.checkData.org)
    					break;
    				case '中华财险':
    					this.mineStatus.push('财险总公司*'+this.checkData.org)
    					break;
    				default:
    					this.mineStatus.push(this.$route.query.company+'*'+this.checkData.org)
    			}
    			if(JSON.parse(sessionStorage.getItem('askData'+this.isFlag))){
    				this.checkData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
    				this.mineStatus = this.checkData.mineStatus == undefined?[]:this.checkData.mineStatus
    			}
    			this.copy = this.mineStatus
    			this.arrLabel = this.mineStatus
    			this.$refs.tree.setCheckedKeys([this.checkData.org])
    		}
	    	if(JSON.parse(sessionStorage.getItem('askData'+this.isFlag))){
	    		this.checkData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
	    		this.checkData.status = this.isFlag
	    		this.currentPage = this.checkData.pageNo
	    		if(this.checkData.occurDate){
	    			this.lossSendForm.occurDate = this.checkData.occurDate.substring(0,4)+'-'+this.checkData.occurDate.substring(4,6)+'-'+this.checkData.occurDate.substring(6,8)
	    		}
	    		if(this.checkData.name){
	    			this.lossSendForm.name = this.checkData.name
	    		}
	    		if(this.checkData.org){
    				this.mineStatus = this.checkData.mineStatus
    				this.copy = this.mineStatus
    				this.arrLabel = this.mineStatus
				   	this.$refs.tree.setCheckedKeys(this.checkData.org.split(','))
	    		}		
	    	}
	    	// 获取表格数据
	    	this.searchData(this.checkData)
	    },
	    components:{
	    	orgSearch
	    },
	    updated(){
    		const org = $('.el-select__tags-text').eq(0)
    		if(this.mineStatus.length>0){
    			const name = this.mineStatus[0]
    			org.text(name.split('*')[0])
    		}
	  	},
	    methods: {
	    	//检查开始时间
	      	changeOccurDate(val){
	      		if(val != null){
	      			this.checkData.occurDate = formatDate(val,'yyyy-MM-dd')
		  			this.checkData.occurDate = this.checkData.occurDate.split('-').join('') 
		  		} else{
		  			delete this.checkData.occurDate
		  		}
	      	},
	    	// 检查事项名称
	    	getName(val){
	      		if(val == ''){
	      			delete this.checkData.name
	      		} else{
	      			this.checkData.name = val
	      		}
	      	},
	      	//被检查机构
	      	handleNodeClick(node,data) {
	      		if(node.disabled!=true){
					let res = this.$refs.tree.getCurrentNode(true,true)
					this.lossSendForm.org = res.name
					if(node.groupId!==''){
						this.checkData.org = node.groupId
		      		} else{
		      			delete this.checkData.org
		      		}
	      		}
			},
			getNodeInfo(node,resolve) {

			},
			getNodeChange(node,b){
				this.getCheckedNodes(node,b,this.$refs.tree)
			},
			getCheckedNodes(node,b,ref) {
				var flag = true;
				if(this.arrLabel.length){
					for(var i = 0; i < this.arrLabel.length;i++){
						if((node.name+'*'+node.groupId)==this.arrLabel[i]||(node.name)==this.arrLabel[i]){
							flag = false;
							this.arrLabel = this.delOne(this.arrLabel[i],this.arrLabel);
							break;
						}
					}
					if(flag){
						this.arrLabel.push(node.name+'*'+node.groupId)
					}	
				}else{
					this.arrLabel.push(node.name+'*'+node.groupId)
				}
				this.mineStatus = this.arrLabel
				var arr = []
				for(var i=0;i<this.mineStatus.length;i++){
					arr.push(this.mineStatus[i].split('*')[1])
				}
		        this.viewList = arr
		        this.checkData.org = this.viewList.toString()
		        this.checkData.mineStatus = this.mineStatus
		        this.copy = this.mineStatus
			},
	  		deleteOrg(tag){
				this.viewList = this.delOne(tag.split('*')[1],this.viewList)
				this.arrLabel = this.delOne(tag,this.arrLabel)
	  			if(this.viewList.length > 0){
	  				this.$nextTick(function() {
					   	this.$refs.tree.setCheckedKeys(this.viewList)
					})
				} else {
					this.$nextTick(function() {
					   	this.$refs.tree.setCheckedKeys([])
					})
				}
				if(this.checkData.org){
					var arr = this.checkData.org.split(',')
					arr.splice(0,1)
					this.checkData.org = arr.toString()
				}
				this.copy = this.mineStatus
				this.checkData.mineStatus = this.mineStatus
	  		},
	  		delOne(itemId,arr){
	  			var rmArr = arr;
	  			for(var i = 0;i<arr.length;i++){
	  				if(arr[i]==itemId){
	  					var index = arr.indexOf(itemId);
	  					rmArr.splice(index,1)
	  				}
	  			}
	  			return rmArr
	  		},
			connectAxios(val,node,resolve){
	  			this.node = node
			  	this.resolve = resolve
			  	if(!node.data || (node.data&&node.data.name!=='全部')){
		  			var params = qs.stringify({
				        parentId: val,
				        type:7
				    })
			        this.axios.post('/rmUser/groupName', params).then((res)=>{
			        	if(node.level == 0){
			        		var arr = [{ name: '全部',groupId:'1_01'}];
			        	} else{
			        		var arr = [];
			        	}
		                if(res.data.data != null){
				          	for (var i = 0; i < res.data.data.length; i++) {
				           	var obj = new Object;
				           	obj.name = res.data.data[i].name;
				           	obj.groupId = res.data.data[i].groupId;
				           	if(res.data.notCheck != null){
				           		for (var j = 0; j < res.data.notCheck.length; j++){
				           			if(res.data.notCheck[j] == res.data.data[i].groupId){
				           				obj.disabled = true
				           			}
				           		}
				           	}
				           	arr.push(obj);
				          } 
		                }
						resolve(arr)
			        })
		        } else{
			    	resolve([])
			    }
	  		},
	    	loadNode(node,resolve){
	  			if (node.level == 0) {
	  				this.connectAxios('1_01',node,resolve)
		        }else{
		        	var mid = node.data.groupId === undefined?'1_01':node.data.groupId
		  			this.connectAxios(mid,node,resolve)
				}
	  		},
			searchData (data) {
				// 生效库
				if(this.isFlag == 1){
					this.checkData.flag = 0
				}
				this.$set(this.checkData,'mineStatus',this.mineStatus)
	      		// 获取表格数据
	      		sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(this.checkData))
	      		this.$emit('changeSessionStorage',{no:3,data:this.checkData})
	      		this.axios.post('violate/query',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
		            if(res.code == 200){
		            	if(res.data != null){
	      					Bus.$emit('formDatas',res.data)
	      				}
		            }else{
		              	this.$alert(res.message, '提示', {
		                	confirmButtonText: '确定'
		                })
		            }
		        })
	      	},
	      	// 查询按钮
		    goSearch(){
				this.checkData.pageNo = 1
				this.checkData.pageSize = 10
				this.currentPage = 1
				delete this.checkData.ref
				this.searchData(this.checkData)
			},
			closeMaskTable(data){
		    	this.isShow = data.status;
		    	if(data.orgChecked){
		    		this.mineStatus = []
		  			this.arrLabel = []
		  			this.viewList = []
		    		this.$set(this.checkData,'org',data.orgChecked)
		    	}
		    	if(data.orgNamelist){
		    		this.mineStatus = data.orgNamelist
		    		this.copy = this.mineStatus
		    		this.treeKey = +new Date();
		    		this.$nextTick(function() {
					   	this.$refs.tree.setCheckedKeys([])
					})
		    	}
		    },
		    keyFilter(val){
		    	this.$set(this.lossSendForm,'org',val)
		    	setTimeout(() => {
		    		let input = this.$refs.searchSelect.$children[0].$refs.input;
                	input.value = val
		    	})
			},
			filterNode(value, data) {
		        return true
		    },
		    selectFoucus(e){
		    	if(this.visible){
		    		let input = this.$refs.searchSelect;
		    		input.blur()
		    	}
		    },
		    visibleChange(val){
		    	this.visible = val
		    	if(!val){
		         	this.mineStatus = this.copy
		       	} else{
			    	this.mineStatus = []
			    	setTimeout(() => {
			    		let input = this.$refs.searchSelect.$children[0].$refs.input;
	                	input.value = ''
			    	})
		       	}
		    },
			searchOrg(){
				let input = this.$refs.searchSelect.$children[0].$refs.input;
				if(!input.value){
					this.$alert('请输入违规主体名称', '提示', {
	                	confirmButtonText: '确定'
	                })
	                return
				}
				var params = qs.stringify({
					name:this.lossSendForm.org,
		        	type: 7,
		        	pageNumber: 1,
		        	pageSize: 10,
		        	status:1
		        })
				this.axios.post('/rmUser/searchGroup',params).then((res)=>{
		            if(res.code == 200){
		            	if(res.data!==null){
			        		if(res.data.data!==null){
			        			this.searchResult = res.data
			        			this.$set(this.searchResult,'orgName',this.lossSendForm.org)
			            		this.isShow = true
			        		} else{
			        			this.$alert('无对应查询结果，请重新选择查询条件', '提示', {
				                	confirmButtonText: '确定'
				                })
				                return
			        		}
		            	}
		            }else{
		              	this.$alert(res.message, '提示', {
		                  confirmButtonText: '确定'
		                })
		            }
		        })
			},
	    }
	}
</script>

<style lang="scss">
#lossSendCheck{
  	.el-input-group__append{
	  	background: #4285F4;
	    width: 20%;
	    text-align: center;
	    font-size: 16px;
	    color: #fff;
	}
	.el-col .el-input input{
		height: 32px;
		line-height: 32px;
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
		width:28%;
		line-height:32px;
		font-weight: normal;
		padding:0 4% 0 0;
		text-align:right
	}
	.newwidth .el-form-item__label{
		padding:0
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-top:20px;
	    margin-right: 5px;
	    padding:0;
    	font-size: 12px;
	}
	.el-select__tags .el-select__input.is-mini{
		border:none;
		background:none;
		margin-left:0
	}
	.searchBtn .el-form-item__content{
		font-size:0;
		.commonBtn{
			display:inline-block;
			margin-right:0;
			width:50px;
			height:32px;
			line-height:32px;
		    padding:0;
	    	font-size: 12px;
		}
	}
	.searchBtn .el-select{
		width:calc(100% - 50px)!important
	}
	.searchBtn .el-icon-search:before{
		color:#606266
	} 
}	
</style>
