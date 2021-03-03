<template>
  <div class="organization">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor">机构管理</el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">机构列表</el-breadcrumb-item>
  	</el-breadcrumb>
	<el-row>
		<el-col :span="4">
			<v-orgTree :treeData="treeData" ></v-orgTree>
			<!-- <el-tree :data="organization" show-checkbox node-key="id" :default-expanded-keys="[1,4]" :props="defaultProps" @node-click="handleNodeClick">
	    	</el-tree> -->
		</el-col>
		<el-col :span="20">
			<div class="space">
				<div class="setBox">
					<div class="titIcon"><em></em><span style="font-weight: 600;">机构列表</span></div>
					<v-orgList></v-orgList>
				</div>
			</div>
		</el-col>
	</el-row>
  </div>
</template>
<script>
	import vOrgList from 'src/components/settingList/orgList'
	import vOrgTree from 'src/components/settingList/orgTree' 
	export default {
	  	data () {
	  		return {
	  			parentId: '1_01',//机构名称
	  			totalResults: 0, //总页数
	  			treeData:[],
	  			orgtableData:[]
	  		}
	  	},
	  	components: {
	  		vOrgList,
	  		vOrgTree
	  	},
	  	methods:{
	  		handleSizeChange (value) {

	  		},
	  		handleCurrentChange(value) {

	  		},
	  		handleNodeClick(data){
	  	// 		this.$axios.post('instweb/query',this.askData).then((res)=>{
	   //    			if(res.data.code === 200){
	   //    				alert(1)
	   //    			}
	   //    			else{
	   //    				alert(2)
	   //    			}
				// })
	  		},
	  	}
    };
</script>
<style>
	.organization .el-table th{
		background: #f9f9f9;
		text-align: center;
	}
	.organization .el-table .cell{
		text-align: center;
	}
	.organization .el-pagination{
		text-align: center;
		padding-bottom: 50px;
		border: 0;
		margin-top: 20px;
	}
	.organization .el-breadcrumb__inner{
    	color: #4285F4!important;
    	font-weight: 700!important;
    }
    .organization .is-link{
    	color: #909191!important;
    }
    .organization  .el-table__empty-block{
		background: #FFF
    }
    .organization .el-table .cell{
  		cursor:pointer
  	}
  	.organization .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss" scoped>
	.el-table__body, .el-table__footer, .el-table__header{
		width:100%
	}
	.organization{
		height: 100%;
		.el-breadcrumb{
			padding: 20px 0 16px 0;
		}
		.space{
			padding-left: 20px;
			height: 100%;
		}
		.setBox{
			min-height: 100%;
			padding: 16px;
			-webkit-box-shadow: 2px 2px 10px #888;
			border-radius: 8px;
			background: #FFF;
			box-sizing: border-box;
			.titIcon{
				float:left;
				font-size:0;
				margin-bottom:30px;
				cursor:pointer;
				em{
					display: inline-block;
					vertical-align: middle;
					width: 2px;
					height: 14px;
					margin-right:5px;
					background: #4285F4;
				}
				span{
					display: inline-block;
					vertical-align: middle;
					font-size:14px;
				}
			}
			.addOrg{
				float:right;
				button{
					width: 68px;
					height: 26px;
					padding: 0;
					font-size: 12px;
				}
			}
		}
		.jump{
			color:#FFF
		}
	}
    .el-row{
    	height: calc(100% - 54px);
    }
    .el-col,.el-tree{
    	height:100%
    }
    .el-tree{
    	-webkit-box-shadow: 2px 2px 10px #888;
		border-radius: 8px;
    }
</style>
