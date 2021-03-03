<template>
	<div id="muBox">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="txtColor">{{catalog}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="box">
			<el-tree :data="data" :props="defaultProps" node-key="id" :default-expanded-keys="defaultShowNodes" @node-click="handleNodeClick">
				<span slot-scope="{node,data}">
					{{node.label}} （{{data.count}}）
				</span>
			</el-tree>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
	      return {
	        data: [{
	          name: '全部外规',
	          count:'0',
	          id:'',
	          children: []
	        }],
	        defaultShowNodes:[],
	        catalog:'外规管理',
	        defaultProps: {
	          children: 'children',
	          label: 'name',
	          id:'id'
	        }
	      };
	    },
	    created(){
	    	this.getInfo(this.$route.query.id)
	    },
	    watch:{
		  $route(to,from){
		  	this.getInfo(this.$route.query.id)
		  },
		  data:{
				handler () {
					// 我这里默认展开一级, 指定几级就往里遍历几层取到 id 就可以了
					this.data.forEach(item => {
						this.defaultShowNodes.push(item.id)
					})
				},
				deep: true
			}
		},
	    methods: {
	      handleNodeClick(data) {
	      	let jumpUrl = this.$route.query.id;
	      	let insiId = '';
	      	if(jumpUrl == '1_couter'){
	      		jumpUrl = '/out-manage';
	      		insiId = '1_couter';
	      	}else{
	      		jumpUrl = '/df-manage';
	      		insiId = '1_cdf';
	      	}
	        this.$router.push({
				path: '/repository'+jumpUrl,
				query:{
					id:insiId,
					searchId: data.id
				}
			})
	      },
	      getInfo(type){
	      	var path = '';
	      	if(type == '1_couter'){
	      		path = 'instweb/outCount'
	      		this.data[0].name = '全部外规'
	      		this.catalog = '外规管理'
	      	}else{
	      		path = 'instweb/dfCount'
	      		this.data[0].name = '全部东方制度'
	      		this.catalog = '东方制度管理'
	      	}
	      	this.axios.post(path,JSON.stringify({}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
            	if(res.code == 200){
            		this.data[0].count = res.data == null?0:res.data.total
            		this.data[0].children = res.data == null?0:res.data.list
            	}
            })
	      },
	    }
	}
</script>

<style lang="scss">
#muBox{
	.el-breadcrumb{
		margin-bottom: 30px;
		margin-top: 20px;
	}
	.box{
		-webkit-box-shadow: 1px 0px 6px #888;
	   	border-radius: 8px;
	   	background: #fff;
	   	height: 500px;
	   	padding: 20px;
	   	.el-tree{
	   		background: transparent;
	   	}
	}
    .el-tree-node {
      position: relative;
      font-size: 14px;
    }
    .el-tree-node__expand-icon.is-leaf{
      display: block;
    }
    .el-tree-node__expand-icon.is-leaf:before{
    	border: 2px solid #4285F4!important;
	    border-radius: 50%;
	    font-size: 0;
	    margin: 0 4px;
	    line-height: 16px;
    }
    .el-tree-node__children {
      padding-left: 16px;
    }
    .el-tree-node :last-child:before {
      height: 38px;
    }
 
 	.el-tree-node{
 		margin-bottom: 10px;
 	}
    .el-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(0);
		transform: rotate(0deg);
	}
	.el-tree-node__content{
		margin-bottom: 10px;
		color: #4285F4!important;
		padding-left: 0!important;
	}
	.el-icon-caret-right:before {
	    content: "\E6D9";
	    font-size: 10px;
	    border: 1px solid #4285F4;
	    border-radius: 2px;
	}
	.el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
		content: "\E6D8";
	}
	.el-tree-node__expand-icon{
		color: #4285F4;
		padding-right: 10px;
	}
	.txtColor span{
		color: #4285F4;
	}
}
</style>