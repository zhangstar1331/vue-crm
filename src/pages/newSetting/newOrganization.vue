<template>
  <div class="neworg">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor"><span @click="submitReturn">机构管理</span></el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">机构新增</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span style="font-weight: 600;">机构新增</span></div>
  		<div class="neworg-form">
	  		<el-form :inline="true" ref="orgForm" :model="orgForm" :rules="rules" label-width="70px">
				<el-form-item label="机构编号" prop="id">
					<el-input v-model="orgForm.id" @change="getCodeVal" placeholder="请输入机构编号"></el-input>
				</el-form-item>
				<el-form-item label="机构名称" prop="orgname">
					<el-input v-model="orgForm.orgname" @change="getOrgName" placeholder="请输入机构名称"></el-input>
				</el-form-item>
				<el-form-item label="上级机构" prop="highername" class="newcascader">
					<el-input v-model="orgForm.highername" @change="getHigherName" placeholder="" disabled></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="mobile">
					<el-input v-model="orgForm.mobile" @change="getPhone" placeholder="请输入联系电话"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status" class="newcascader">
					<el-select v-model="value" @change="getState"  placeholder="请选择">
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
	  		var checkId = (rule, value, callback) => {
	  			if (value === '') {
		          callback(new Error('机构编号不能为空'));
		        } else {
		        	const reg = /^[-_a-zA-Z0-9]+$/
		          	if (reg.test(value)) {
		            	callback();
		          	} else {
		            	return callback(new Error('请输入正确的机构编号'));
		          	}
		        }
	  		};
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
		            	return callback(new Error('请输入正确的手机号或座机号'));
		          	}
		        }
	  		};
	  		return {
	  			isClearable:true,      // 可清空（可选）
			    isAccordion:true,      // 可收起（可选）
			    valueId:'',            // 初始ID（可选）
			    props:{                // 配置项（必选）
			        value: 'groupId',
			        label: 'name',
			        children: 'children',
			        // disabled:true
			    },
			    stateArr:[{
			        value: '1',
			        label: '正常'
			        }, {
		            value: '0',
		            label: '停用'
		        }],
		        value: '',
			      // 选项列表（必选）
			    list:[],
		  		orgForm:{
	  				id: '',
	  				orgname: '',
	  				highername: '',
	  				mobile: '',
	  				status: '',
	  				password: ''
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
		        	id: [
		        		{validator: checkId, trigger: 'blur' }
		        	],
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
			var initialVal = JSON.parse(sessionStorage.getItem('initialVal'))
			this.orgForm.highername = initialVal.highername //上级机构取值
			this.orgForm.parentId = initialVal.mid
		},
		methods:{
		    // 取值
		    getCodeVal(val){ //机构编号
		    	this.askData.groupCode = val;
		    },
		    getOrgName(val){//机构名称
		    	this.askData.name = val;
		    },
		    getHigherName(val){//上级机构
		    	this.askData.parentId = val;
		    },
		    getPhone(val){//联系电话
		    	this.askData.phone = val;
		    },
		    getState(val){//状态
		    	this.askData.status = val;
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
		          	if(this.askData.status == ''){
		          		this.$alert('请选择状态', '提示', {
					          confirmButtonText: '确定'
					        });
					    return;    
		          	}
		            sessionStorage.askData = JSON.stringify(this.askData)
		            var params = qs.stringify({
			        	groupCode: this.askData.groupCode,
			        	name: this.askData.name,
			        	parentId: this.orgForm.parentId,
			        	phone: this.askData.phone,
			        	status: this.askData.status
			        })
			    	this.axios.post('rmUser/addGroup',params).then((res)=>{
		      			if(res.code === 200){
		      				if(res.data == '0'){
								this.$alert('失败', '提示', {
							      confirmButtonText: '确定',
							      callback: action => {
							      }
							    });
		      				} else if(res.data == '1'){
		      					this.$alert('保存成功', '提示', {
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
		      				} else if(res.data == '2'){
		      					this.$alert('机构已存在', '提示', {
							      confirmButtonText: '确定',
							      callback: action => {
							      }
							    });
		      				} else if(res.data == '3'){
		      					this.$alert('父级机构不存在', '提示', {
							      confirmButtonText: '确定',
							      callback: action => {
							      }
							    });
		      				}
		      			} else {
		      				console.log('保存失败')
		      			}
					})
		          }
		        });
		    	
		    }
		}
    };
</script>
<style>
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
	.neworg-form .el-form-item__label,.neworg-form .el-form-item__content{
		height: 32px;
		line-height: 32px
	}
	.neworg-form .el-form-item .el-form-item__content{
		width:300px;
	}
	.neworg-form .el-form-item__label{
		padding: 0 12px 0 0;
		text-align: justify
	}
	.neworg-form .el-form-item label:after {
        content: " ";
        display: inline-block;
        width: 100%;
    }
    .neworg .el-breadcrumb__inner{
    	color: #4285F4!important;
    	font-weight: 700!important;
    }
    .neworg .is-link{
    	color: #909191!important;
    }
    .neworg .wgTxtColor span{
    	cursor: pointer;
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
    .el-form--inline .el-form-item{
    	width:100%
    }
</style>
