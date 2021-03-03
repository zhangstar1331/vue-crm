<template>
  	<div class="orgTree">
  		<span @click="getFirstData" class="toptitle">中华保险集团</span>
  		<el-tree :props="props" node-key="id" ref="tree" :key="treeKey" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy>
	    </el-tree>
  	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {ajax} from 'src/utils/utils.js'
  	import {statusCode} from 'src/utils/utils.js'
  	import qs from 'qs'
  	import {mapState} from 'vuex'
	export default {
		props:['treeData'],
	  	data () {
	  		return {
	  			parentId:'1_01',
	  			props: {
	  				label: 'name',
	  				children: 'zones',
	  				isLeaf: 'leaf',
	  				id:'',
	  				node:{},
	  				resolve:{}
	  			},
	  			isFirst: true,
	  			count: 1,
	  			useraskData : {
	  				groupId: '1_01',
	  				pageNumber: '1',
	      			pageSize: '10'
	  			},
	  			deId:'',
	  			treeKey:''
	  		}
	  	},
	  	created () {
	  		Bus.$on('page', (data) => {
		      	this.useraskData.pageNumber = data;
	        })
	  	},
	  	methods:{
	  		 // 更新树
			renderTree(){
				this.treeKey = +new Date();
			},
	  		handleSizeChange (value) {

	  		},
	  		handleCurrentChange(value) {

	  		},
	  		connectAxios(mid,tip,resolve){
	  			var params = qs.stringify({
		        	parentId: mid,
		        	status:'0'
		        })
		        this.axios.post('/rmUser/groupName', params).then((res)=>{
		        	Bus.$emit('isShow',res.data.isShow)
		        	sessionStorage.setItem('isShow',res.data.isShow)
		       		var arr = [];
	                if(res.data.data != null){
			          	for (var i = 0; i < res.data.data.length; i++) {
			           	var obj = new Object;
			           	obj.name = res.data.data[i].name;
			           	obj.id = res.data.data[i].groupId;
			           	arr.push(obj);
			          } 
	                }
	                if( tip == 1){
						resolve(arr)
	                }
	                if(tip == 2){
	                	resolve(JSON.parse(sessionStorage.getItem('userarr1')));
			          	sessionStorage.removeItem('usernode2')
	                }
	                if(tip == 3){
	                	resolve(arr);
				        sessionStorage.setItem('userarr1',JSON.stringify(arr))
	                }

		        })
	  		},
	  		getFirstData(){
		     	this.useraskData.groupId = '1_01';
	        	sessionStorage.useraskData = JSON.stringify(this.useraskData)
	        	Bus.$emit('useraskData',this.useraskData)
			    sessionStorage.setItem('mid','1_01')
			    sessionStorage.setItem('usernode1','1_01')
			    this.connectAxios('1_01')
	  		},
	  		handleNodeClick(node){
		    	if(this.node.isClick){
		    		if (node.id == undefined) {
		    			node.id = '1_01'
		    		} 
		        	this.clickId = node.id
		        	this.useraskData.groupId = node.id;
		        	sessionStorage.useraskData = JSON.stringify(this.useraskData)
		        	Bus.$emit('useraskData',this.useraskData)
		        	sessionStorage.setItem('usernode1',node.id)
		        	this.connectAxios(node.id)
		      	}else{
		       		this.node.isClick=true
		      	} 
			},
	  		getNodeInfo(node,resolve) {

		    },
	  		loadNode(node,resolve){
	  			var newnode = sessionStorage.getItem('usernode2')
	  			if(newnode !== null){
	  				sessionStorage.setItem('mid',newnode)
					this.useraskData.groupId = newnode
					sessionStorage.useraskData = JSON.stringify(this.useraskData)
					this.connectAxios(newnode,2,resolve)
	  			} else{
		  			if (node.level === 0) {
						sessionStorage.setItem('mid','1_01')
						this.useraskData.groupId = '1_01'
						sessionStorage.useraskData = JSON.stringify(this.useraskData)
		  				// Bus.$emit('useraskData',this.useraskData)
		  				sessionStorage.setItem('usernode1','1_01')
		  				this.connectAxios('1_01',3,resolve)	
			        }else{
			  			this.node = node
			  			this.resolve = resolve
			  			var mid = node.data.id === undefined?'1_01':node.data.id;
			  			sessionStorage.setItem('mid',mid)
						this.useraskData.groupId = mid
						sessionStorage.setItem('useraskData',JSON.stringify(this.useraskData))
						Bus.$emit('useraskData',this.useraskData)
						sessionStorage.setItem('usernode1',node.data.id)
			  			this.connectAxios(mid,1,resolve)
	 				}
 				}
	  		}
	  	},
	    computed:{
	  		f2(){
	  			return this.$store.state.orgBtnData
	  		}
	  	},
	  	watch:{
	  		deId() {
		    },
	  		f2(newdata,olddata){
	  			this.renderTree()
	  		}
	  	}
    };
</script>
<style>
	.orgTree .el-tree > .el-tree-node:after {
      border-top: 0;
    }
    .orgTree .el-tree > .el-tree-node:before {
      border-left: none;
    }
    .orgTree .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .orgTree .el-tree-node {
      position: relative;
      padding-left: 11px;
      font-size: 12px;
      margin-bottom: 5px;
      white-space: normal!important
    }
    .orgTree .el-tree-node:before {
      content: "";
      left: 0;
      position: absolute;
      right: auto;
      border-width: 1px;
      border-left: 1px solid #E9E9E9;
      bottom: 0px;
      height: 140%;
      top: -26px;
      width: 1px;
    }
    .orgTree .el-tree-node:after {
      content: "";
      left: 0;
      position: absolute;
      right: auto;
      border-width: 1px;
      border-top: 1px solid #E9E9E9;
      height: 20px;
      top: 12px;
      width: 11px;
    }
    .orgTree .el-tree-node__expand-icon.is-leaf{
      display: block;
    }
	.orgTree .el-tree-node__content{
		padding-left: 0!important;
		height:auto;
		-webkit-box-align:flex-start!important;
		-ms-flex-align:flex-start!important;
		align-items:flex-start!important;
	}
	.orgTree .el-tree-node__content>.el-tree-node__expand-icon{
		padding-right: 10px;
		line-height:normal;
		padding-top:3px;
	}
	.orgTree .el-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(0deg);
	    transform: rotate(0deg);
	}
	.orgTree .el-icon-caret-right:before,.orgTree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
		content: "\e6d9";
		font-size: 10px;
	    border: 1px solid #9eadb1;
	    border-radius: 2px
	}
	.orgTree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
	    content: "\e6d8";
	}
	.orgTree .el-tree-node__expand-icon.is-leaf:before,.orgTree .is-current .el-tree-node__expand-icon.is-leaf:before{
		border: 2px solid #9eadb1!important;
		border-radius: 50%;
		font-size: 0;
		margin: 0 4px;
		line-height: 16px;
		vertical-align:top
	}
	.orgTree .is-current .el-tree-node__content,.orgTree .is-current .el-tree-node__content .el-icon-caret-right:before{
		color: #4285F4;
	}
	.orgTree .is-current .el-tree-node__content .el-icon-caret-right:before{
		border: 1px solid #4285F4;
	}
	.orgTree .el-tree-node__children {
      padding-left: 11px;
    }
	.orgTree .is-current .el-tree-node__children .el-tree-node__content{
		color: #606266;
	}
	.orgTree .is-current .el-tree-node__expand-icon.is-leaf:before {
		border: 2px solid #4285F4!important;
		vertical-align:top;
	}
	.orgTree .el-tree-node :last-child:before {
      height: 38px;
    }
</style>
<style lang="scss" scoped>
	.orgTree{
    	min-height:100%;
    	-webkit-box-shadow: 2px 2px 10px #888;
		border-radius: 8px;
		padding-top: 50px;
		padding-left:20px;
		background:#FFF;
		box-sizing: border-box
    }
    .toptitle{
    	position:absolute;
    	top:26px;
    	left: 36px;
    	z-index:9999;
    	color:#606266;
    	font-size:14px;
    	cursor: pointer
    }
</style>
