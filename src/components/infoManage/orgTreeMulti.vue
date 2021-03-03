<template>
    <div id="orgTreeCXMulti">
        <el-form-item :label="label" class="searchBtn">
			<el-select v-model="mineStatus" multiple collapse-tags :placeholder="'请选择'+label" ref="searchSelect" value-key="mineStatus" @remove-tag="deleteOrg" filterable :filter-method="keyFilter" @focus="selectFoucus" @visible-change="visibleChange">
				<el-option :value="mineStatus" style="height:auto;background-color:#fff;">
					<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="groupId" show-checkbox @check="getNodeChange" :check-strictly="true" accordion :filter-node-method="filterNode"></el-tree>
				</el-option>
			</el-select>
			<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg"></el-button>
		</el-form-item>
		<org-search :searchResult="searchResult" v-if="isShow" @closeMask="closeMaskTable"></org-search>
    </div>
</template>

<script>
    import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
    import orgSearch from 'src/components/infoManage/orgSearch'
    import qs from 'qs'
    export default {
        props: ['label','isFlag'],
        data() {
            return {
                searchResult:'',
                isShow:false,
				visible:false,
				mineStatus:[],
				arrLabel:[],
				copy:[],
				viewList:[],
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
                checkData:{},
	          	lossSendForm:{
					company:'全部',//机构
				},
            }
        },
        components:{
            orgSearch,
		},
		mounted(){
			if(this.$route.query.belongCompany!==undefined){
    			this.checkData.org = this.$route.query.belongCompany
				this.$refs.tree.setCheckedKeys([this.checkData.org])
    		}
			if(this.$route.query.company!==undefined){
    			switch (this.$route.query.company){
    				case '合计':
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
	    		if(this.checkData.org){
					this.viewList = this.checkData.org.split(',')
					this.mineStatus = this.checkData.mineStatus
    				this.copy = this.mineStatus
    				this.arrLabel = this.mineStatus
				   	this.$refs.tree.setCheckedKeys(this.checkData.org.split(','))
	    		}
	    	}
		},
		computed:{
			...mapState(['companySource']),
		},
		updated(){
    		const org = $('.el-select__tags-text').eq(0)
    		if(this.mineStatus.length>0){
    			const name = this.mineStatus[0]
    			org.text(name.split('*')[0])
    		}
		},
        methods:{
			handleNodeClick(node,data) {
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
				this.$emit("orgTreeChange", { orgChecked: this.checkData.org})
				this.$emit("orgTreeChange", { mineStatus: this.mineStatus})
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
					this.$emit("orgTreeChange", { orgChecked: this.checkData.org})
				}
				this.copy = this.mineStatus
				this.checkData.mineStatus = this.mineStatus
				this.$emit("orgTreeChange", { mineStatus: this.mineStatus})
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
					var path = this.companySource == "1"?'/rmUser/cxGroupName':"/rmUser/groupName"
			        this.axios.post(path, params).then((res)=>{
			        	if(node.level == 0){
			        		var arr = [{ name: '全部',groupId:'1_01'}];
			        	} else{
			        		var arr = [];
						}
						if(this.companySource == "1"){
							if(res.data != null){
								for (var i = 0; i < res.data.length; i++) {
									var obj = new Object;
									obj.name = res.data[i].name;
									obj.groupId = res.data[i].groupId;
									if(res.notCheck != null){
										for (var j = 0; j < res.notCheck.length; j++){
											if(res.notCheck[j] == res.data[i].groupId){
												obj.disabled = true
											}
										}
									}
									arr.push(obj);
								} 
							}
						} else{
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
			closeMaskTable(data){
		    	this.isShow = data.status;
		    	if(data.orgChecked){
		    		this.mineStatus = []
		  			this.arrLabel = []
		  			this.viewList = []
					this.$set(this.checkData,'org',data.orgChecked)
					this.$emit("orgTreeChange", { orgChecked: data.orgChecked})
					this.$emit("orgTreeChange", { mineStatus: this.mineStatus})
		    	}
		    	if(data.orgNamelist){
		    		this.mineStatus = data.orgNamelist
		    		this.copy = this.mineStatus
		    		this.treeKey = +new Date();
		    		this.$nextTick(function() {
					   	this.$refs.tree.setCheckedKeys([])
					})
					this.$emit("orgTreeChange", { orgName: data.orgNamelist})
					this.$emit("orgTreeChange", { mineStatus: this.mineStatus})
		    	}
			},
			keyFilter(val){
				this.$set(this.lossSendForm,'company',val)
				this.$emit("orgTreeChange", { orgName: val})
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
				this.$emit("orgTreeChange", { mineStatus: this.mineStatus})
			},
			searchOrg(){
				let input = this.$refs.searchSelect.$children[0].$refs.input;
				// 请输入被处罚机构名称
				if(!input.value){
					this.$alert('请输入'+this.label, '提示', {
	                	confirmButtonText: '确定'
	                })
	                return
				}
				var params = qs.stringify({
					name:this.lossSendForm.company,
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
			        			this.$set(this.searchResult,'orgName',this.lossSendForm.company)
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

<style lang="scss" scoped>
</style>
