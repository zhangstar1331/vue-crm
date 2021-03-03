<template>
  <div class="login" id="login">
		<div class="bg">
			<img src="../../../static/login_bg.jpg"/>
		</div>
    <div class="middle-wrapper">
    	<div class="loginBox">
	    	<div class="loginPic">
	      		<img src="../../../static/longin_ipt.png"/>
	      </div>
	      <div class="login-form">
	      <div class="title-wrapper">
	      	<div class="logoImg">
	      		<img src="../../../static/login_lg.png"/>
	      	</div>
	        <div class="title">中华保险集团风险管理系统</div>
	      </div>
	        <el-form
	          ref="loginForm"
	          :model="form"
	          :rules="rules">
	          <el-form-item prop="username">
	            <el-input v-model="form.username" placeholder="请输入账号">
	              <i slot="prefix" class="iconfont iconzhanghao" style="font-size: 14px;margin-left: 4px"></i>
	            </el-input>
	          </el-form-item>
	          <el-form-item prop="password">
	            <el-input :type="passwordType" v-model="form.password" placeholder="请输入密码">
	              <i slot="prefix" class="iconfont iconmima" style="font-size: 14px;margin-left: 4px;"></i>
	              <!--<i slot="suffix" class="el-input__icon el-icon-view" style="cursor: pointer;" @click="_togglePasswordType"></i>-->
	            </el-input>
	          </el-form-item>
	          <!--<el-form-item prop="yanzhengma">
	            <div class="check-code-wrapper">
	              <div class="yanzhengma-wrapper">
	                <el-input v-model="form.yanzhengma" @keyup.enter.native="login('loginForm')" placeholder="请输入验证码">
	                  <i slot="prefix" class="el-input__icon el-icon-adm-vertification" style="font-size: 18px;"></i>
	                </el-input>
	              </div>
	              <div class="validate-code-wrapper">
	                <validate-code ref="validate-code" @change="_setCheckCode"></validate-code>
	              </div>
	            </div>
	          </el-form-item>-->
	          <el-form-item style="margin-bottom: 0;">
	            <el-col :span="10" :offset="14">
	              <el-form-item>
	                <el-button
	                  type="primary"
	                  class="login-btn"
	                  style="width: 100%;"
	                  @click="loginHandle('loginForm')">
	                 		 登 &nbsp;&nbsp;录
	                </el-button>
	              </el-form-item>
	            </el-col>
	          </el-form-item>
	        </el-form>
	      </div>
    	</div>
      
    </div>
  </div>
</template>
<script>
  import validateCode from 'src/components/ValidateCode/index';
	import {ajax} from 'src/utils/utils.js'
	import {statusCode} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
    created () {
    },
    data () {
      var checkYanzhengma = (rule, value, callback) => {
        value = value.toUpperCase();
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (value !== this.checkCode) {
          callback(new Error('验证码错误'));
          this.$refs['validate-code'].draw();
        } else {
          callback();
        }
      };
      return {
        passwordType: 'password',
        checkCode: '',
        form: {
          username: '',
          password: '',
          yanzhengma: ''
        },
        store:'111',
        rules: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          yanzhengma: [
            { validator: checkYanzhengma, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      _setCheckCode (value) {
        this.checkCode = value;
      },
      _togglePasswordType () {
        if (this.passwordType === 'password') {
          this.passwordType = 'text';
        } else {
          this.passwordType = 'password';
        }
      },
      loginHandle (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.login();
          }
        });
      },
      login () {
        /*
         *  在这边可以进行登陆请求
         *  将请求返回的Token对象存到store中
         *  @Token  token对象
        */
//     	var params = new URLSearchParams();
//			params.append('jobNo', this.form.username);
//				params.append('password', this.form.password);
				var params = qs.stringify({
					jobNo:this.form.username,
					password:this.form.password
				})
				this.axios.post('rmUser/userLogin',params).then((res)=>{
          if(res.code == 200){
          		let token = res.data.tn;
          		this.$store.commit('SET_TOKEN', token);
          		this.$router.replace('home/index');
          }else{
						statusCode(res.code,res.message)
          }
        }).catch((response) => {
							this.$alert('操作失败', '提示', {
						          confirmButtonText: '确定'
						        });
					 })
      }
    },
    components: {
      validateCode
    }
  };
</script>
<style lang="scss">
	.bg{
		img{
			display: block;
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}
	.loginBox{
		display: flex;
		width: 946px;
		height: 473px;
		margin: 0 auto;
		.loginPic{
			width: 485px;
			height:473px;
			img{
				width: 100%;
				height: 100%;
			}
		}
		i:before{
			  border-right: 1px solid #E9E9E9;
    		padding-right: 7px;
		}
		.iconfont{
			-webkit-text-stroke:0;
			-webkit-text-fill-color: #909191;
		}
	}
	#login{
		.el-form-item .el-form-item__content{
			width: 100%;
		}
		.el-input__inner{
			height: 35px;
			line-height: 35px;
			text-indent: 7px;
		}
		.el-col-offset-14{
			margin:0;
			width:100%;
			height: 35px;
			line-height: 35px;
		}
		.el-button--primary{
			background: linear-gradient(to bottom right, #4EF4FF,#1F67FD);
			border: none;
		}
	}
  .login {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: ('../../../static/login_bg.png');
    .middle-wrapper {
      position: fixed;
      width: 100%;
      margin: 0 auto;
      top: 50%;
      transform: translateY(-60%);

      .title-wrapper {
      	display: flex;
        margin-top: 50px;
        margin-bottom: 30px;
        text-align: center;
        font-size: 20px;
        color: #303030;
        .title{
        	flex: 1;
        	font-weight: 600;
        	font-family:黑体;
        }
        .logoImg{
        	flex: 0 0 155px;
        	height: 24px;
        	text-align: left;
        	img{
        		display: block;
        		width: 120px;
        		padding-left: 35px;
        	}
        }
      }
      .login-form {
        /*position: relative;*/
        /*margin: 0 auto;*/
        width: 485px;
        /*padding: 30px 100px;*/
        box-sizing: border-box;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: #ffffff;
				.el-form{
					margin-top: 30px;
					width: 60%;
					margin: 80px auto 0;
				}
        .el-row {
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          .login-btn {
            width: 100%;
          }
        }
				
        .check-code-wrapper {
          display: flex;
          justify-content: space-between;
          height: 40px;

          .yanzhengma-wrapper {
            flex: 0 1 auto;
          }

          .validate-code-wrapper {
            flex: 0 0 160px;
          }
        }
      }
    }
  }
</style>
