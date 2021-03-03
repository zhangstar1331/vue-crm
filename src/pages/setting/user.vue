<template>
  <div class="user">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
  		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor">用户管理</el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">用户列表</el-breadcrumb-item>
  	</el-breadcrumb>
	<el-row>
		<el-col :span="4">
      		<v-userTree></v-userTree>
		</el-col>
		<el-col :span="20">
			<div class="space">
				<div class="setBox">
					<div class="titIcon"><em></em><span style="font-weight: 600;">用户列表</span></div>
          				<v-userList></v-userList>
				</div>
			</div>
		</el-col>
	</el-row>
  </div>
</template>
<script>
  import vUserTree from 'src/components/settingList/userTree' 
  import vUserList from 'src/components/settingList/userList' 
  export default {
  	data () {
  		return {
  			totalResults: 0, //总页数
  			defaultProps: {
  				children: 'children',
  				label: 'label'
  			},
  		}
  	},
    components: {
      vUserTree,
      vUserList
    },
  	methods:{
      
  	}
  };
</script>
<style>
	.user .el-table th{
		background: #f9f9f9;
		text-align: center;
	}
	.user .el-table .cell{
		text-align: center;
	}
	.user .el-pagination{
		text-align: center;
		padding-bottom: 50px;
		border: 0;
		margin-top: 20px;
	}
	.user .el-breadcrumb__inner{
	    color: #4285F4!important;
	    font-weight: 700!important;
	}
	.user .is-link{
	    color: #909191!important;
	}
    .user .el-table__empty-block{
		background: #FFF
    }
    .user .el-table .cell{
  		cursor:pointer
  	}
  	.user .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss" scoped>
	.el-table__body, .el-table__footer, .el-table__header{
		width:100%
	}
	.el-table__empty-block{
		background: #fff;
	}
	.user{
		height: 100%;
		.el-breadcrumb{
			padding: 20px 0 16px 0;
			overflow:hidden
		}
		.space{
			padding-left: 20px;
			height: 100%;
		}
		.setBox{
			min-height: 100%;
			padding: 16px 16px 0 16px;
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
    padding-top: 50px;
    box-sizing: border-box
  }
</style>
