<template>
  <div class="editRole">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor" @click.native="submitReturn"><span style="cursor:pointer">权限管理</span></el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">编辑角色</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span style="font-weight: 600;">编辑角色</span></div>
  		<div class="editRole-form">
	  		<el-form :inline="true" ref="roleForm" :model="roleForm" label-width="100px" :rules="rules">
				<el-form-item label="角色名称" prop="rolename">
					<el-input v-model="roleForm.rolename" @change="((val)=>{getValue(val,'rolename')})" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="角色类型" prop="roletype">
					<el-select v-model="roleList.region" @change="((val)=>{getValue(val,'roletype')})" placeholder="请选择角色类型">
						<el-option v-for="item in roleList.list" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色描述" prop="roledescribe">
					<el-input type="textarea" autosize="" @change="((val)=>{getValue(val,'roledescribe')})" v-model="roleForm.roledescribe" placeholder="请输入角色描述信息"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="saveData('roleForm')">保存</el-button>
					<el-button plain @click="submitReturn">返回</el-button>
				</el-form-item>
	  		</el-form>
  		</div>
  	</div>
  </div>
</template>
<script>
	import {ajax} from 'src/utils/utils.js'
	import {statusCode} from 'src/utils/utils.js'
	import qs from 'qs'
    export default {
  	data () {
  		var checkRolename = (rule, value, callback) => {
  			if (value === '') {
	          callback(new Error('角色名称不能为空'));
	        } else {
	        	const reg = /^[\u4e00-\u9faf|\w\s•·.]+$/
	          	if (reg.test(value)) {
	            	callback();
	          	} else {
	            	return callback(new Error('角色名称不能包含特殊字符'));
	          	}
	        }
  		};
  		var checkRoledescribe = (rule, value, callback) => {
  			if (value === '') {
	          callback(new Error('角色描述不能为空'));
	        } else {
	        	const reg = /^[\u4e00-\u9faf|\w\s•·.]+$/
	          	if (reg.test(value)) {
	            	callback();
	          	} else {
	            	return callback(new Error('角色描述不能包含特殊字符'));
	          	}
	        }
  		};
  		return{
  			roleForm:{
  				rolename: '',
  				roletype: '',
  				roledescribe: '',
  			},
  			rules:{//验证
	        	rolename: [
	        		{validator: checkRolename, trigger: 'blur' }
	        	],
  				roledescribe: [
  					{validator: checkRoledescribe, trigger: 'blur' }
  				]
	        },
	        roleList:{
	        	region:'',
		        list:[{
		        	id:'0',
		        	name:'集团'
		        },{
		        	id:'1',
		        	name:'财险'
		        }]
	    	}
  		}
  	},
  	created(){
  		//获取角色id
  		var id = this.$route.query.rowid
  		this.getUserInfo(id)
  	},
  	methods:{
  		saveData(formName){
  			this.$refs[formName].validate(valid => {
		        if (valid) {
		        	if(this.roleForm.roletype == ''){
		          		this.$alert('请选择角色类型', '提示', {
					          confirmButtonText: '确定'
					        });
					    return;    
		          	}
		  			var params = qs.stringify({
			          name: this.roleForm.rolename,
			          source: this.roleForm.roletype,
			          desc: this.roleForm.roledescribe,
			          roleId: this.$route.query.rowid
			        })
		  			this.axios.post('rmUser/updateRole',params).then((res)=>{
			          	if(res.code == 200){
			          		if(res.data == true){
								this.$alert(res.message, '提示', {
						          	confirmButtonText: '确定',
							      	callback: action => {
								      	this.$router.push({
								    		path:'/setting/access',
								    		query:{
							  					'id': this.$route.query.id
							  				}
								    	})
							      	}
						        });
			      			}
			          	}else{
							this.$alert(res.message, '提示', {
					          confirmButtonText: '确定'
					        });
			          	}
		        	})
		  		}
		    })
  		},
  		submitReturn(){
	    	this.$router.push({
	    		path:'/setting/access',
	    		query:{
  					id: this.$route.query.id
  				}
	    	})
	    },
  		getUserInfo(id){
  			var params = qs.stringify({
	        	roleId: id
	        })
  			this.axios.post('rmUser/role',params).then((res)=>{
	          	if(res.code == 200){
	          		this.roleForm.roledescribe = res.data.desc;
	          		this.roleForm.rolename = res.data.name;
	          		this.roleForm.roletype = res.data.source == undefined?'':res.data.source;
	          		this.roleList.region = res.data.source == undefined?'':res.data.source;
	            }else{
					this.$alert(res.message, '提示', {
			          confirmButtonText: '确定'
			        });
	          	}
        	})
  		},
  		getValue(val,name){
  			this.$set(this.roleForm,name,val)
  		}
  	}
  };
</script>
<style>
	.editRole-form .el-input__inner{
		width: 300px;
		height: 32px
	}
	.editRole-form .el-form-item{
		margin-bottom: 18px
	}
	.editRole-form .el-form-item__label,.editRole-form .el-form-item__content{
		line-height: 32px
	}
	.editRole-form .el-form-item__label{
		padding: 0 12px 0 0
	}
	.editRole-form .el-textarea,.editRole-form .el-form-item .el-form-item__content{
		width: 300px;
	}
	.editRole-form .el-textarea .el-textarea__inner{
		min-height: 165px!important;
		height: 165px!important;
	}
	.editRole .el-breadcrumb__inner{		
    	color: #4285F4!important;
    	font-weight: 700!important;
    }		
    .editRole .is-link{		
    	color: #909191!important;		
    }
    .editRole .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss" scoped>
	.editRole{
		height: 100%;
		.el-breadcrumb{
			padding: 20px 0 16px 0
		}
		.setBox{
			height: calc(100% - 70px);
			padding: 16px 16px 0 16px;
			-webkit-box-shadow: 2px 2px 10px #888;
			border-radius: 8px;
			background: #FFF;
			.titIcon{
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
			button{
				width: 68px;
				height: 26px;
				padding: 0;
				font-size: 12px;
			}
		}
		.editRole-form{
			text-align:center;
			input{
				height:30px
			}
		}

	}

	
	.el-breadcrumb__inner{
    	color: #4285F4!important;
    }
    .is-link{
    	color: #909191!important;
    }
    .el-form--inline .el-form-item{
    	width:100%
    }
</style>
