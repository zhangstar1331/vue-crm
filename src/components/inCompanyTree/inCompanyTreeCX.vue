<template>
	<div class="fxcomCont">
		<template>
			<el-row class="container">
			  <el-col :span="6" align="center" style="padding-left:5%;padding-bottom: 10%;">
			  	<el-tabs :tab-position="tabPosition" @tab-click = 'getData' style="height: 200px;">
				    <el-tab-pane :name="item.value" :label="item.name" :key="item.value" v-for="item in tabList.unitsData"></el-tab-pane>
				 </el-tabs>
			  </el-col>
			  <el-col :span="18">
			  	<el-tree :data="datas" ref='tree2' :props="defaultProps" node-key="id" @node-expand="getNodeInfo" :default-expanded-keys="arrId" :expand-on-click-node="false"  @node-click="handleNodeClick">
			  		<span slot-scope="{node,data}">
						{{node.label}}<span v-if="data.id== 1">（{{data.count}}）</span>
					</span>
			  	</el-tree>
			  </el-col>
			</el-row>
		</template>
		<template>

		</template>
	</div>
</template>

<script>
	export default {
		props:['companyData'],
	    data() {
	      return {
	        tabPosition: 'left',
	        arrId:['1'],
	        askData:{
	        	manageCategory:'',
	        	manageLevel:1
	        },
	        datas:[
	          {
	          label: '【制度列表】',
	          mid:'',
	          count:0,
	          id:'1',
	          children: [{
	            label: '',
	            mid:''
	          }]
	        }],
	        defaultProps: {
	          children: 'children',
	          label: 'label'
	        },
	        tabList:{
	        	unitsData:[{
		        	name:'全部',
		        	value:''
	        	}]
	    	}
	      };
	    },
	    watch:{
	    	companyData(newVal,oldVal){
	    		if(newVal){
	    			this.init()
	    		}
	    	}
	    },
	    created(){
	    	this.init()
	    	//公司管理类制度树
	    	this.axios.post('instweb/comm',JSON.stringify({type:1}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	    		if(res.code == 200){
	    			if(res.data.mtree){
	    				this.$set(this.tabList,'unitsData',this.tabList.unitsData.concat(res.data.mtree))
	    			}
	    		}
			})
	    },
	    methods:{
	    	getData(tab, event){
	    		this.arrId = []
	    		var tabName = tab.name == ''?'all':tab.name
	    		var cont1
	    		if(this.companyData != null){
	    			cont1 = this.companyData[tabName+'_0'] == undefined || null || ''? '0' : this.companyData[tabName+'_0']
	    		}else{
	    			cont1 = 0;
	    		}
	    		this.askData.manageCategory = tabName == "all"?'':tabName;
	    		this.askData.manageLevel = 1;
	    		this.arrId = ['1']
	    		this.getTreeData(this.askData)
	    		this.datas = [
		            {
		              label: '【制度列表】',
		              mid:'',
		              id:'1',
		              count:cont1,
		              children: [{
		                label: '',
		                mid:''
		              }]
		            }
		        ]
	    	},
	    	getNodeInfo(data){
	    		this.askData.manageLevel = data.id
	    		this.askData.manageCategory = this.askData.manageCategory == 'all'?'':this.askData.manageCategory
	    		this.getTreeData(this.askData)
	    	},
	    	handleNodeClick(data){
	    		 if(data.mid != '' && data.mid != undefined){
		    		 this.$router.push({
				        path:'/innewDetail',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          'id':data.mid ,
				        }
					})
	    		 }
	    	},
	    	getTreeData(paramsId){
	    		let arr = [];
	    		this.axios.post('instweb/query/mtree',JSON.stringify(paramsId),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	    			var index = this.askData.manageLevel;
    				this.datas[0].children = [];
    				let arr = new Array();
    				if(res.data != null && res.data.length != 0){
    					res.data.forEach((item,index)=>{
    						arr.push({
    							label:item.name,
    							mid:item.id,
    						})
    					})
    				}
    				this.datas[0].children = arr
	    		})
	    	},
	    	init(){
	    		if(this.companyData != null){
			    	let cont1 = this.companyData['all_0'] == undefined || null || ''? '0' : this.companyData['all_0']
		    		this.datas[0].count = cont1
		    		this.getTreeData(this.askData)
		    	}
	    	}
	    }
  };
</script>

<style lang="scss" scoped="scoped">
.fxcomCont /deep/{
	.el-tabs__item{
		padding:0;
		border-bottom: 1px solid #dedede;
	}
	.el-tabs__item:last-child{
		padding:0!important;
		border-bottom:none!important;
	}
	#tab-12{
		padding:0;
	}
	.el-tabs__header .is-left::after{
		width:0!important;
	}
	.el-tabs__header{
		border: 1px solid #dedede;
	}
	.el-tabs__nav-wrap .is-left{
		width: 200px;
		text-align: center;
	}
	.el-tabs__nav-wrap .is-left:after{
		width: 0!important;
	}
	.el-tabs{
		height: initial!important;
	}
	.el-tabs__item:hover{
		background:#4285F4 ;
		color: #fff;
	}
	
	/*树标的加减号样式*/
	.el-tree > .el-tree-node:after {
      border-top: 0;
    }
    .el-tree-node {
      position: relative;
      padding-left: 16px;
      font-size: 12px;
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
		/*padding-left: 8px!important;*/
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
}
.content{
}
</style>
