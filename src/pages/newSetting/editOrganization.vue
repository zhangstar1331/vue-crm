<template>
  <div class="neworg">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor bread"><span @click="submitReturn">机构管理</span></el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">机构编辑</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span style="font-weight: 600;">机构编辑</span></div>
  		<div class="neworg-form">
	  		<el-form :inline="true" ref="orgForm" :model="orgForm" :rules="rules" label-width="100px">
				<el-form-item label="机构编号" prop="id">
					<el-input v-model="orgForm.id" placeholder="" disabled></el-input>
				</el-form-item>
				<el-form-item label="机构名称" prop="orgname">
					<el-input v-model="orgForm.orgname" @change="getOrgName" placeholder="请输入机构名称"></el-input>
				</el-form-item>
				<el-form-item label="上级机构" prop="highername" class="newcascader">
					<el-input v-model="orgForm.highername" placeholder="" disabled></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="mobile">
					<el-input v-model="orgForm.mobile" @change="getPhone" placeholder="请输入联系电话"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="highername" class="newcascader">
					<el-select v-model="orgForm.status" @change="getState"  placeholder="请选择">
				    <el-option v-for="item in stateArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				  </el-select>
				</el-form-item>  
				<el-form-item>
					<!-- <el-col :span="24">
						<el-form-item> -->
							<el-button type="primary" @click="submitAll('orgForm')">保存</el-button>
							<el-button plain @click="submitReturn">返回</el-button>
						<!-- </el-form-item>
					</el-col> -->
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
    export default {
	  	data () {
	  		var checkOrgname = (rule, value, callback) => {
	  			if (value === '') {
		          callback(new Error('机构名称不能为空'));
		        } else {
		        	const reg = /^[\u4e00-\u9faf\s•·.]+$/
		          	if (reg.test(value)) {
		            	callback();
		          	} else {
		            	return callback(new Error('机构名称包含特殊字符'));
		          	}
		        }
	  		};
	  		var checkPhone = (rule, value, callback) => {
	  			if (value === '') {
		          callback(new Error('联系电话不能为空'));
		        } else {
		        	const preg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9]|166)[0-9]{8}$/
	        		const mreg = /0\d{2,3}-\d{7,8}/
	          		if (preg.test(value)||mreg.test(value)) {
		            	callback();
		          	} else {
		            	return callback(new Error('请输入正确的手机号'));
		          	}
		        }
	  		};
	  		return {
			    stateArr:[{
			        value: '1',
			        label: '正常'
			        }, {
		            value: '0',
		            label: '停用'
		        }],
		        value: '',
			      // 选项列表（必选）
		  		orgForm:{
	  				id: '',
	  				orgname: '',
	  				highername: '',
	  				mobile: '',
	  				status: ''
	  			},
	  			askData:{
		        	groupCode: '',
	  				name: '',
	  				parentId: '',
	  				phone: '',
	  				status: '',
	  				operatorId: ''
		        },
		        requestData:{},
		        rules:{//验证
	  				orgname: [
	  					{validator: checkOrgname, trigger: 'blur' }
	  				],
	  				mobile: [
	  					{validator: checkPhone, trigger: 'blur' }
	  				]
		        }
	  		}
	  	},
		created(){
			this.getEditInfo() //获取数据
		},
		methods:{
			//获取数据
			getEditInfo(){
				var params = qs.stringify({
		          groupId: this.$route.query.rowid
		        })
	  			this.axios.post('rmUser/groupDetail', params).then((res)=>{
					this.orgForm.id = res.data.groupCode
					this.orgForm.orgname = res.data.name
					this.orgForm.highername = res.data.pName
					this.orgForm.mobile = res.data.phone
					this.orgForm.groupId = res.data.groupId
					if (res.data.status == '0') {
						this.orgForm.status = '停用'
					} else if(res.data.status == '1'){
						this.orgForm.status = '正常'
					}
		    	})
			},
		    getOrgName(val){//机构名称
		    	this.orgForm.name = val;
		    },
		    getPhone(val){//联系电话
		    	this.orgForm.phone = val;
		    },
		    getState(val){//状态
		    	this.orgForm.status = val;
		    },
		    //返回
		    submitReturn(){
		    	this.$router.push({
		    		path:'/setting/organization',
		    		query:{
	  					'id': this.$route.query.id
	  				}
		    	})
		    	sessionStorage.setItem('node2',sessionStorage.getItem('node1'))
		    },
		    //保存
		    submitAll(formName){
		    	this.$refs[formName].validate(valid => {
		          if (valid) {
		          	if(this.orgForm.status == ''){
		          		this.$alert('请选择状态', '提示', {
					          confirmButtonText: '确定'
					        });
					    return;    
		          	}
		        	if(this.orgForm.status == '正常'){
			    		this.orgForm.status = '1'
			    	} else if(this.orgForm.status == '停用'){
			    		this.orgForm.status = '0'
			    	}
			    	var params = qs.stringify({
			        	groupId: this.orgForm.groupId,
			        	name: this.orgForm.orgname,
			        	phone: this.orgForm.mobile,
			        	status: this.orgForm.status,
			        	description: ''
			        }) 	
			    	this.axios.post('rmUser/edGroup',params).then((res)=>{
		      			if(res.code === 200){
		      				if(res.data == true){
								this.$alert('更新成功', '提示', {
							      confirmButtonText: '确定',
							      callback: action => {
							      	this.$router.push({
							    		path:'/setting/organization',
							    		query:{
						  					'id': this.$route.query.id
						  				}
							    	})
							    	sessionStorage.setItem('node2',sessionStorage.getItem('node1'))
							      }
							    });
		      				} else if(res.data == false){
		      					this.$alert('更新失败', '提示', {
							      confirmButtonText: '确定',
							      callback: action => {

							      }
							    });
		      				}
		      			}
					})
		          }
		        }); 			    	
		    }
		}
    };
</script>
<style>
	.bread{
		cursor: pointer;
	}
	.newcascader .el-input--suffix .el-input__inner{
		padding-right: 15px
	}
	.neworg-form .el-input__inner{
		width: 300px;
		height: 32px
	}
	.neworg-form .el-form-item{
		margin-bottom: 18px
	}
	.neworg-form .el-form-item__label,.el-form-item__content{
		line-height: 32px
	}
	.neworg-form .el-form-item .el-form-item__content{
		width:300px;
	}
	.neworg-form .el-form-item__label{
		padding: 0 12px 0 0;
	}
	.neworg .el-breadcrumb__inner{
    	color: #4285F4!important;
    	font-weight: 700!important;
    }
    .neworg .is-link{
    	color: #909191!important;
    }
	.neworg .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss" scoped>
	.neworg{
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
		.neworg-form{
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
