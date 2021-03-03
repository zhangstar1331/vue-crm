<template>
	<div class="mytree">
		<el-tree  :props="props" ref="tree" :indent="0" node-key="id" :default-expanded-keys="rootNode" @node-expand="getNodeInfo" @node-click="handleNodeClick" :expand-on-click-node="false" :load="loadNode"  lazy>
			<span slot-scope="{node,data}">
				<span :class="{'infxTip':data.status}">{{data.status}}</span>
				<span v-if="data.level == 1">【一级制度】</span>
				<span v-if="data.level == 2">【二级制度】</span>
				<span v-if="data.level == 3">【三级制度】</span>
				<span v-if="data.level == 4">【四级制度】</span>
				{{node.label}}
			</span>
		</el-tree>
	</div>
</template>

<script>
	export default{
		props:['treeData'],
		data() {
	      return {
	      	tip:'',
	      	props:  {
	          label: 'name',
	          children: 'zones',
	          id:'',
	          isLeaf:'isLeaf',
	          node:{},
	          resolve:{}
	        },
	        rootNode:[],
	        isFirst:true,
	        count: 1
	      };
	    },
	    methods: {
			  handleNodeClick(data){
			  	if(data.status == '废止'){
				  	this.$router.push({  
				        path:'/innewDetail',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          'id':data.id ,  
				          'fz':1
				        }
					})
			  	}else{
			  		this.$router.push({  
				        path:'/innewDetail',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          'id':data.id
				        }
					})
			  	}
			  },
		      getNodeInfo(data,node) {
		      },
		      loadNode(node, resolve) {
		        this.node = node
		        this.resolve = resolve
		      	var mid = node.data === undefined?'':node.data.id;
		      	this.axios.post('instweb/query/tree',JSON.stringify({id:mid}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	            	var arr = [];
	            	if(res.data != null){
					  	for (var i = 0; i < res.data.length; i++) {
					  		var obj = new Object;
					  		obj.name = res.data[i].name;
					  		obj.id = res.data[i].id;
					  		obj.level = res.data[i].riskLevel;
					  		obj.isLeaf = false;
					  		if(res.data[i].status == '3'){
					  			obj.status = '废止'
					  		}
					  		arr.push(obj)
					  		if(node.level == 0){
				          		this.rootNode.push(res.data[i].id)
				          	}
					 	 }	
	            	}
		          	resolve(arr);
	            })
		    }    
	    },
	    watch:{
	    }
	}
</script>

<style lang="scss" scoped>
.mytree /deep/{
     .el-tree > .el-tree-node:after {
      border-top: 0;
    }
    .el-tree-node {
      position: relative;
      padding-left: 16px;
      font-size: 14px;
    }
    .el-tree-node__expand-icon.is-leaf{
      display: block;
    }
    .el-tree-node__expand-icon.is-leaf:before{
    	border: 2px solid #9B9B9B!important;
	    border-radius: 50%;
	    font-size: 0;
	    margin: 0 4px;
	    line-height: 16px;
    }
    .el-tree-node__children {
      padding-left: 16px;
    }
 	.el-tree-node__expand-icon{
 		color: #909191;
 	}
    .el-tree-node :last-child:before {
      height: 38px;
    }
 
    .el-tree > .el-tree-node:before {
      border-left: none;
    }
    .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .el-tree-node:before {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }
 	.el-tree-node{
 		margin-bottom: 10px;
 	}
    .el-tree-node:after {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }
 
    .el-tree-node:before {
      border-left: 1px solid #E9E9E9;
      bottom: 0px;
      height: 140%;
      top: -26px;
      width: 1px;
    }
 
    .el-tree-node:after {
      border-top: 1px solid #E9E9E9;
      height: 20px;
      top: 12px;
      width: 24px;
    }
    .el-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(0);
		transform: rotate(0deg);
	}
	.el-tree-node__content{
		margin-bottom: 10px;
	}
	.el-tree-node__content:hover{
    	color: #4285F4;
    }
	.el-icon-caret-right:before {
	    content: "\E6D9";
	    font-size: 10px;
	    border: 1px solid #909191;
	    border-radius: 2px;
	}
	.el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
		content: "\E6D8";
	}
    .infxTip{
		font-size: 12px;
		color: #FFF;
		padding:1px 8px;
		border-radius: 2px;
		margin-left: 10px;
		background: #FF6363;
		float: right;
		display: inline-block;
	}
  }
</style>