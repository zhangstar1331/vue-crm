<template>
	<div id="lossSendCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="lossSendForm" label-position="left" ref="lossSendForm" size="mini">
			        	<el-row>
			                <el-col :span="8">
			                    <el-form-item label="事发机构" class="searchBtn org1">
								    <el-select v-model="mineStatus1" multiple collapse-tags placeholder="请选择事发机构" ref="searchSelect1" value-key="mineStatus1" @remove-tag="((val)=>{deleteOrg(val,1)})" filterable :filter-method="((val)=>{keyFilter(val,1)})" @focus="((val)=>{selectFoucus(val,1)})" @visible-change="((val)=>{visibleChange(val,1)})">
								    	<el-option :value="mineStatus1" style="height:auto;background-color:#fff;">
								    		<el-tree :props="insprops" :key="treeKey" ref="tree1" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,1)})" :load="loadNode" lazy node-key="groupId" show-checkbox @check="((val)=>{getNodeChange(val,1)})" :check-strictly="true" accordion :filter-node-method="filterNode"></el-tree>
								    	</el-option>
								    </el-select>
								    <el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(1)"></el-button>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="报告日期">
								    <el-date-picker v-model="lossSendForm.reportDate" @change="changeReportDate" placeholder="选择日期"></el-date-picker>
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
	import {mapState, mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		props:['isFlag','isStore','checkList'],
	    data () {
	      return {
	      	lossSendForm:{
	      		company:'全部',//机构
	      		reportDate:''
	      	},
	        checkData:{
	        	status:this.isFlag,
	            pageNo:1,
	            pageSize:10,
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
  			mineStatus1:[],
  			viewList1:[],
  			viewList2:[],
  			arrLabel1:[],
  			arrLabel2:[],
  			copy1:[],
  			copy2:[],
  			visible:false,
	      }
	    },
	    mounted () {
	    	if(this.checkList){
	    		sessionStorage.setItem('askData'+this.isFlag,JSON.stringify(this.checkList))
	    	}
	    	// if(this.$route.query.belongCompany!==undefined){
    		// 	this.checkData.org = this.$route.query.belongCompany
    		// }
    		if(this.isStore!==undefined){
    			this.checkData.ref = 1
    		}
    // 		if(this.$route.query.company!==undefined){
    // 			switch (this.$route.query.company){
    // 				case '合计':
    // 					this.mineStatus = []
    // 					break;
    // 				case '集团':
    // 					this.mineStatus.push('集团本级*'+this.checkData.org)
    // 					break;
    // 				case '中华财险':
    // 					this.mineStatus.push('财险总公司*'+this.checkData.org)
    // 					break;
    // 				default:
    // 					this.mineStatus.push(this.$route.query.company+'*'+this.checkData.org)
    // 			}
    // 			if(JSON.parse(sessionStorage.getItem('askData'+this.isFlag))){
    // 				this.checkData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
    // 				this.mineStatus = this.checkData.mineStatus == undefined?[]:this.checkData.mineStatus
    // 			}
    // 			this.copy = this.mineStatus
    // 			this.arrLabel = this.mineStatus
				// this.$refs.tree.setCheckedKeys([this.checkData.org])
    // 		}
    		
	    	if(JSON.parse(sessionStorage.getItem('askData'+this.isFlag))){
	    		this.checkData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
	    		this.checkData.status = this.isFlag
	    		this.currentPage = this.checkData.pageNo
	    		if(this.checkData.reportDate){
	    			this.lossSendForm.reportDate = this.checkData.reportDate.substring(0,4)+'-'+this.checkData.reportDate.substring(4,6)+'-'+this.checkData.reportDate.substring(6,8)
	    		}
	    		if(this.checkData.org){
    				this.mineStatus1 = this.checkData.mineStatus1
    				this.copy1 = this.mineStatus1
    				this.arrLabel1 = this.mineStatus1
    				this.$refs.tree1.setCheckedKeys(this.checkData.org.split(','))
	    		}
	    	}
	    	// 获取表格数据
	    	this.searchData(this.checkData)
	    },
	    components:{
	    	orgSearch
	    },
	    updated(){
    		const org = $('.org1 .el-select__tags-text').eq(0)
    		if(this.mineStatus1.length>0){
    			const name = this.mineStatus1[0]
    			org.text(name.split('*')[0])
    		}
	  	},
	    methods: {
	      	handleNodeClick(node,type) {
	      		if(node.disabled!=true){
	      			this.$set(this.lossSendForm,'company'+type,node.name)
	      			if(node.groupId!==''){
	      				if(type == 1){
	      					this.$set(this.checkData,'org',node.groupId)
	      				} else {
	      					this.$set(this.checkData,'reportOrg',node.groupId)
	      				}
		      		} else{
		      			if(type == 1){
	      					delete this.checkData['org']
	      				} else {
	      					delete this.checkData['reportOrg']
	      				}
		      		}
	      		}
			},
			getNodeInfo(node,resolve) {

			},
			getNodeChange(node,type){
				this.getCheckedNodes(node,type)
			},
			getCheckedNodes(node,type) {
				var flag = true;
				if(this['arrLabel'+type].length){
					for(var i = 0; i < this['arrLabel'+type].length;i++){
						if((node.name+'*'+node.groupId)==this['arrLabel'+type][i]||(node.name)==this['arrLabel'+type][i]){
							flag = false;
							this['arrLabel'+type] = this.delOne(this['arrLabel'+type][i],this['arrLabel'+type]);
							break;
						}
					}
					if(flag){
						this['arrLabel'+type].push(node.name+'*'+node.groupId)
					}	
				}else{
					this['arrLabel'+type].push(node.name+'*'+node.groupId)
				}
				this['mineStatus'+type] = this['arrLabel'+type]
				var arr = []
				for(var i=0;i<this['mineStatus'+type].length;i++){
					arr.push(this['mineStatus'+type][i].split('*')[1])
				}
		        this['viewList'+type] = arr
		        switch (type){
		        	case 1:
		        		this.checkData.org = this['viewList'+type].toString()
		        		break;
		        	case 2:
		        		this.checkData.reportOrg = this['viewList'+type].toString()
		        		break;
		        }
		        this.checkData['mineStatus'+type] = this['mineStatus'+type]
		        this['copy'+type] = this['mineStatus'+type]
			},
			deleteOrg(tag,type){
				this['viewList'+type] = this.delOne(tag.split('*')[1],this['viewList'+type])
				this['arrLabel'+type] = this.delOne(tag,this['arrLabel'+type])
	  			if(this['viewList'+type].length > 0){
	  				this.$nextTick(function() {
					   	this.$refs['tree'+type].setCheckedKeys(this['viewList'+type])
					})
				} else {
					this.$nextTick(function() {
					   	this.$refs['tree'+type].setCheckedKeys([])
					})
				}
				switch (type){
					case 1:
						if(this.checkData.org){
							var arr = this.checkData.org.split(',')
							arr.splice(0,1)
							this.checkData.org = arr.toString()
						}
						break;
					case 2:
						if(this.checkData.reportOrg){
							var arr = this.checkData.reportOrg.split(',')
							arr.splice(0,1)
							this.checkData.reportOrg = arr.toString()
						}
						break;
				}
				this['copy'+type] = this['mineStatus'+type]
				this.checkData['mineStatus'+type] = this['mineStatus'+type]
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
				this.$set(this.checkData,'mineStatus1',this.mineStatus1)
				sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(this.checkData))
				if(this.$route.query.id == '1_hsfajxxbs'){
					if(this.isFlag == 1){
						this.$emit('changeSessionStorage',{no:1,data:this.checkData})
					} else{
						this.$emit('changeSessionStorage',{no:0,data:this.checkData})
					}
				} else{
					this.$emit('changeSessionStorage',{no:5,data:this.checkData})
				}
	      		// 获取表格数据
	      		this.axios.post('case/query',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
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
		    		this['mineStatus'+data.type] = []
		  			this['arrLabel'+data.type] = []
		  			this['viewList'+data.type] = []
		  			switch(data.type){
		  				case 1:
		  					this.$set(this.checkData,'org',data.orgChecked)
		  					break;
		  				case 2:
		  					this.$set(this.checkData,'reportOrg',data.orgChecked)
		  					break;
		  			}
		    	}
		    	if(data.orgNamelist){
		    		this['mineStatus'+data.type] = data.orgNamelist
		    		this['copy'+data.type] = this['mineStatus'+data.type]
		    		this.treeKey = +new Date();
		    		this.$nextTick(function() {
					   	this.$refs['tree'+data.type].setCheckedKeys([])
					})
		    	}
		    },
		    keyFilter(val,type){
		    	this.$set(this.lossSendForm,'company'+type,val)
		    	setTimeout(() => {
		    		let input = this.$refs['searchSelect'+ type].$children[0].$refs.input;
                	input.value = val
		    	})
			},
			filterNode(value, data) {
		        return true
		    },
		    selectFoucus(e,type){
		    	if(this.visible){
		    		let input = this.$refs['searchSelect'+ type]
		    		input.blur()
		    	}
		    },
		    visibleChange(val,type){
		    	this.visible = val
		    	if(!val){
		         	this['mineStatus'+type] = this['copy'+type]
		       	} else{
			    	this['mineStatus'+type] = []
			    	setTimeout(() => {
			    		let input = this.$refs['searchSelect'+ type].$children[0].$refs.input;
	                	input.value = ''
			    	})
		       	}
		    },
			searchOrg(type){
				let input = this.$refs['searchSelect'+ type].$children[0].$refs.input;
				if(!input.value){
					this.$alert('请输入事发机构名称', '提示', {
	                	confirmButtonText: '确定'
	                })
	                return
				}
				var params = qs.stringify({
					name:this.lossSendForm['company' + type],
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
			        			this.$set(this.searchResult,'orgName',this.lossSendForm['company' + type])
			        			this.$set(this.searchResult,'type',type)
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
			changeReportDate(val){
	      		if(val != null){
	      			this.checkData.reportDate = formatDate(val,'yyyy-MM-dd')
		  			this.checkData.reportDate = this.checkData.reportDate.split('-').join('') 
		  		} else{
		  			delete this.checkData.reportDate
		  		}
	      	},
	    },
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
