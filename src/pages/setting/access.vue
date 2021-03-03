<template>
  <div class="access">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor">权限管理</el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">角色列表</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span style="font-weight: 600;">角色列表</span></div>
  		<v-roleList></v-roleList>
  	</div>
  </div>
</template>
<script>
	import vRoleList from 'src/components/settingList/roleList'
  export default {
  	data () {
  		return{
  			roletableData:[{
  				roleName: '系统管理员',
  				roleDec: '具有系统所有权限',
  			},{
  				roleName: '部门合规管理员',
  				roleDec: '',
  			}]
  		}
  	},
  	components: {
  		vRoleList
  	},
  	methods:{
  		viewDefend(index,row){
  			this.$router.push({
  				path: '/viewDefend',
  				query:{
  					'id': row.id
  					// 'ic': '01'
  				}
  			})
  		},
  		accessDefend(index,row){
  			this.$router.push({
  				path: '/accessDefend',
  				query:{
  					'id': row.id
  				}
  			})
  		},
  		editRole(index,row){
  			this.$router.push({
  				path: '/editRole',
  				query:{
  					'id': row.id
  				}
  			})
  		}
  	}
  };
</script>
<style>
	.el-table th{
		background: #f9f9f9;
		text-align: center;
	}
	.el-table .cell{
		text-align: center;
	}
	.el-pagination{
		text-align: center;
		padding-bottom: 50px;
		border: 0;
		margin-top: 20px;
	}
	.access .el-breadcrumb__inner{
    	color: #4285F4!important;
    	font-weight: 700!important;
    }
    .access .is-link{
    	color: #909191!important;
    }
    .access .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss" scoped>
	.access{
		height: 100%;
		.el-breadcrumb{
			padding: 20px 0 16px 0
		}
		.setBox{
			min-height: calc(100% - 70px);
			padding: 16px;
			-webkit-box-shadow: 2px 2px 10px #888;
			border-radius: 8px;
			background: #FFF;
			.titIcon{
				float:left;
				font-size:0;
				margin-bottom:30px;
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
			color:#FFF;
			text-decoration: none
		}
		.user-form{
			text-align:center;
			input{
				height:30px
			}
		}

	}
    .el-form--inline .el-form-item{
    	width:100%
    }
</style>
