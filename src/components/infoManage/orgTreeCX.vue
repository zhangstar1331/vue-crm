<template>
    <div id="orgTreeCX">
        <el-form-item :label="label" class="searchBtn">
            <el-select v-model="infoSpecial.base.organization" placeholder="请选择被检查机构" :disabled="disabled" ref="searchSelect" filterable :filter-method="keyFilter" @focus="selectFoucus" @visible-change="visibleChange">
                <el-option :value="infoSpecial.base.organization" style="height:auto;background:#FFF">
                    <el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
                </el-option>
            </el-select>
            <el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg" :disabled="disabled"></el-button>
        </el-form-item>
        <org-search :searchResult="searchResult" :chooseType="1" v-if="isShow" @closeMask="closeMaskTable"></org-search>
    </div>
</template>

<script>
    import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
    import orgSearch from 'src/components/infoManage/orgSearch'
    import qs from 'qs'
    export default {
        props: ['label','disabled'],
        data() {
            return {
                searchResult:'',
                isShow:false,
                visible:false,
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
                checkData:{
	          		base:{}
	          	},
	          	infoSpecial:{
	          		base:{
						organization:"",//被检查机构
	          		},
		        },
            }
        },
        components:{
            orgSearch,
		},
		created(){
		},
        methods:{
            handleNodeClick(node,data) {
                if(node.disabled!=true){
                    let res = this.$refs.tree.getCurrentNode(true,true)
                    this.infoSpecial.base.organization = res.name
                    this.$emit("orgTreeChange", { orgName: res.name})
                    if(node.groupId!==''){
                        this.checkData.base.organization = node.groupId
                        this.$emit("orgTreeChange", { orgChecked: node.groupId})
                    } else{
                        delete this.checkData.base.organization
                        this.$emit("orgTreeChange", { orgChecked: undefined})
                    }
                }
			},
			getNodeInfo(node,resolve) {

			},
			connectAxios(val,node,resolve){
	  			this.node = node
			  	this.resolve = resolve
	  			var params = qs.stringify({
			        parentId: val,
			        type:7
			    })
		        this.axios.post('/rmUser/cxGroupName', params).then((res)=>{
		        	var arr = []
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
					resolve(arr)
		        })
	  		},
	    	loadNode(node,resolve){
	    		if(this.$route.query.flag !== 1){
		  			if (node.level == 0) {
		  				this.connectAxios('',node,resolve)
			        }else{
			        	var mid = node.data.groupId === undefined?'':node.data.groupId
			  			this.connectAxios(mid,node,resolve)
					}
				}
	  		},
            closeMaskTable(data){
		    	this.isShow = data.status;
		    	if(data.orgChecked){
                    this.$set(this.checkData.base,'organization',data.orgChecked)
                    this.$emit("orgTreeChange", { orgChecked: data.orgChecked})
		    	}
		    	if(data.orgName){
                    this.$set(this.infoSpecial.base,'organization',data.orgName)
                    this.$emit("orgTreeChange", { orgName: data.orgName})
		    	}
		    },
		    keyFilter(val){
                this.$set(this.infoSpecial.base,'organization',val)
		    	delete this.checkData.base.organization
                this.$emit("orgTreeChange", { orgName: val})
                this.$emit("orgTreeChange", { orgChecked: undefined})
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
		    },
	      	searchOrg(){
				if(!this.infoSpecial.base.organization){
					this.$alert('请输入被检查机构名称', '提示', {
	                	confirmButtonText: '确定'
	                })
	                return
				}
				var params = qs.stringify({
					name:this.infoSpecial.base.organization,
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
			        			this.$set(this.searchResult,'orgName',this.infoSpecial.base.organization)
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
			}
        }
    }
</script>

<style lang="scss" scoped>
</style>
