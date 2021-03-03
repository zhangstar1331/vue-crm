<template>
  <div class="setpwd">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">修改密码</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span>修改密码</span></div>
  		<div class="setpwd-form">
	  		<el-form :inline="true" ref="pwdForm" :model="pwdForm" :rules="rules" label-width="100px">
				<el-form-item label="原始密码" prop="oldpwd">
					<el-input type="password" v-model="pwdForm.oldpwd" @change="getPwd" placeholder="请输入原始密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newpwd">
					<el-input type="password" v-model="pwdForm.newpwd" @change="getNewPwd" placeholder="新密码"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码" prop="renewpwd">
					<el-input type="password" v-model="pwdForm.renewpwd" @change="getRenewPwd" placeholder="确认新密码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitAll('pwdForm')" v-if="btnData.savebtn">保存</el-button>
				</el-form-item>
	  		</el-form>
  		</div>
  	</div>
  </div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {ajax} from 'src/utils/utils.js'
  	import {statusCode} from 'src/utils/utils.js'
  	import qs from 'qs'
  	import {mapState} from 'vuex'
    export default {
	  	data () {
	  		var checkPassWord = (rule, value, callback) => {
	  			if (value === '') {
		          callback(new Error('密码不能为空'));
		        } else {
		        	const reg = /^[0-9A-Za-z_]{6,12}$/
		          	if (reg.test(value)) {
		            	callback();
		          	} else {
		            	return callback(new Error('密码格式错误'));
		          	}
		        }
	  		};
	  		return {
	  			pwdForm:{
	  				oldpwd:'',
	  				newpwd:'',
	  				renewpwd:''
	  			},
	  			handleData:[], //操作数据
	  			btnData:{   //按钮显示隐藏
	  				openbtn: false,
	  				savebtn: false
	  			},
	  			rules:{//验证
	  				oldpwd: [
	  					{validator: checkPassWord, trigger: 'blur' }
	  				],
	  				newpwd: [
	  					{validator: checkPassWord, trigger: 'blur' }
	  				],
	  				renewpwd: [
	  					{validator: checkPassWord, trigger: 'blur' }
	  				]
		        }
	  		}
	  	},
	  	computed:{
	  		f1(){
	  			return this.$store.state.orgBtnData
	  		}
	  	},
	  	watch:{
	  		f1(newdata,olddata){
	  			this.getData(newdata)
	  		}
	  	},
		created(){
			Bus.$off("isSpwd");
	  		Bus.$on('isSpwd', (data) => {
				this.$alert('权限发生变化，请重新登录', '提示', {
			      confirmButtonText: '确定',
			      callback: action => {
			      	this.axios.post('rmUser/authLogout').then((res)=>{
			            if (res.code == 200) {
			              this.$store.commit('SET_TOKEN', '');
			              this.$store.commit('SET_USER', null);
			              this.$router.replace({path: '/login'});
			            } else {
			              this.$alert(res.message, '提示', {
			                confirmButtonText: '确定'
			              });
			            }
			        })
			      }
			    })
	        }) 	
			this.getData(this.$store.state.orgBtnData)
		},
		methods:{
			// 返回页面时加载数据
		    getData(aaa){
		    	this.handleData = aaa
		    	if(this.handleData !== undefined){
			  		if(this.handleData.indexOf('1_spwdl')>=0){//查看列表
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_spwds')>=0){//新增角色
	            		this.btnData.savebtn = true
	            	}else{
	            		this.btnData.savebtn = false
	            	}
	            }
		    },
		    getPwd(val){
		    	this.pwdForm.oldpwd = val
		    },
		    getNewPwd(val){
		    	this.pwdForm.newpwd = val
		    },
		    getRenewPwd(val){
		    	this.pwdForm.renewpwd = val
		    },
		    submitAll(formName){
		    	this.$refs[formName].validate(valid => {
		    		if (valid) {
		    			if(this.pwdForm.newpwd!==this.pwdForm.renewpwd){
		    				this.$alert('两次输入的密码不一致', '提示', {
						      confirmButtonText: '确定',
						    });
						    return;
		    			}
				    	var params = qs.stringify({
				    		orgPwd: this.pwdForm.oldpwd,
				        	password: this.pwdForm.newpwd,
				        	confirmPassword: this.pwdForm.renewpwd
				        })
				        this.axios.post('rmUser/edPwd', params).then((res)=>{
			  				if(res.code === 200){
			  					if(res.data == 0){
									this.$alert('用户不存在', '提示', {
								      confirmButtonText: '确定',
								      callback: action => {
								      	this.$router.push({
								    		path:'/login'
								    	})
								      }
								    });
			      				} else if(res.data == 1){
									this.$alert('修改成功', '提示', {
								      confirmButtonText: '确定',
								      callback: action => {
								      	this.$store.commit('SET_TOKEN', '');
          								this.$store.commit('SET_USER', null);
								      	this.$router.replace({path: '/login'});
								      }
								    });
			      				} else if(res.data == 2){
			      					this.$alert('输入的原密码错误', '提示', {
								      confirmButtonText: '确定',
								      callback: action => {

								      }
								    });
			      				} else if(res.data == 3){
			      					this.$alert('修改失败', '提示', {
								      confirmButtonText: '确定',
								      callback: action => {

								      }
								    });
			      				}
			      			} else {
			      				this.$alert(res.message, '提示', {
							      confirmButtonText: '确定',
							      callback: action => {

							      }
							    });
			      			}
				    	})
			        }
		    	});
		    }
		}
    };
</script>
<style>
	.setpwd-form .el-input__inner{
		width: 300px;
		height: 32px
	}
	.setpwd-form .el-form-item{
		margin-bottom: 18px
	}
	.setpwd-form .el-form-item__label,.setpwd-form .el-form-item__content{
		height: 32px;
		line-height: 32px
	}
	.setpwd-form .el-form-item .el-form-item__content{
		width:300px;
	}
	.setpwd-form .el-form-item__label{
		padding: 0 12px 0 0;
		text-align: right;
	}
	.setpwd-form .el-form-item label:after {
        content: " ";
        display: inline-block;
        width: 100%;
    }
    .setpwd .el-breadcrumb__inner{		
    	color: #4285F4!important;
    	font-weight: 700!important;
    }		
    .setpwd .is-link{		
    	color: #909191!important;		
    }
    .setpwd .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss" scoped>
	.setpwd{
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
		}
		.setpwd-form{
			text-align:center
		}
		button{
			width: 68px;
			height: 26px;
			padding: 0;
			font-size: 12px;
			margin-top: 30px
		}
	}
    .el-form--inline .el-form-item{
    	width:100%
    }
</style>
