<template>
  <div class="newuser">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor"><span @click="submitReturn" style="cursor: pointer;">用户管理</span></el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">用户新增</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span style="font-weight: 600;">用户新增</span></div>
  		<div class="newuser-form">
	  		<el-form :inline="true" ref="userForm" :model="userForm" :rules="rules">
				<el-form-item label="员工工号" prop="id">
					<el-input v-model="userForm.id" @change="getCode" placeholder="请输入员工工号"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="username">
					<el-input v-model="userForm.username" @change="getName" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="userForm.email" @change="getEmail" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="userForm.mobile" @change="getMobile" placeholder="请输入电话"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="userForm.status" @change="getStatus" placeholder="请选择">
				    	<el-option v-for="item in stateArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="userForm.password" @change="getPassword" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item label="机构及角色" prop="organization">
					<el-row class="addRole">
						<el-col :span="11">机构</el-col>
						<el-col :span="10">角色</el-col>
						<el-col :span="3"><span @click="AddForm"><i class="el-icon-circle-plus-outline" style="color:#409EFF"></i></span></el-col>
					</el-row>
					<el-table :data="orglists" class="list">
						<el-table-column min-width="45.8%">
							<template slot-scope="scope">
								<el-select v-model="mineStatus[scope.$index]" placeholder="请选择" multiple collapse-tags @remove-tag="deleteOrg(scope.$index)" popper-class="select-tree">
									<el-option :value="mineStatus[scope.$index]">
										<el-tree :props="props" :ref="ref+scope.$index" accordion @node-expand="getNodeInfo" @node-click="handleNodeClick(scope.$index)" node-key="id" :load="loadNode" lazy>
										</el-tree>
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column min-width="41.7%">
							<template slot-scope="scope">
								<el-select v-model="scope.row.value" placeholder="请选择" @change="getRole(scope.$index, scope.row)">
									<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column min-width="12.5%">
							<template slot-scope="scope">
								<span @click="Delete(scope.$index, scope.row)"><i class="el-icon-delete" style="color:#409EFF"></i></span>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item>
					<!-- <el-col :span="24">
						<el-form-item> -->
							<el-button type="primary" @click="submitAll('userForm')">保存</el-button>
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
	import {ajax} from 'src/utils/utils.js'
  	import {statusCode} from 'src/utils/utils.js'
  	import qs from 'qs'
  	export default {
  	data () {
  		var checkId = (rule, value, callback) => {
  			if (value === '') {
	          callback(new Error('员工工号不能为空'));
	        } else {
	        	const reg = /^[-_a-zA-Z0-9]+$/
	          	if (reg.test(value)) {
	            	callback();
	          	} else {
	            	return callback(new Error('请输入正确的员工工号'));
	          	}
	        }
  		};
  		var checkUsername = (rule, value, callback) => {
  			if (value === '') {
	          callback(new Error('姓名不能为空'));
	        } else {
	        	const reg = /^[\u4e00-\u9faf\s•·.]+$/
	          	if (reg.test(value)) {
	            	callback();
	          	} else {
	            	return callback(new Error('姓名包含特殊字符'));
	          	}
	        }
  		};
  		var checkEmail = (rule, value, callback) => {
  			if (value === '') {
	          callback(new Error('邮箱不能为空'));
	        } else {
	        	const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
	          	if (reg.test(value)) {
	            	callback();
	          	} else {
	            	return callback(new Error('邮箱填写错误'));
	          	}
	        }
  		};
  		var checkPhone = (rule, value, callback) => {
  			if (value === '') {
	          callback(new Error('电话不能为空'));
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
  		var checkPsaaword = (rule, value, callback) => {
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
  		return{
  			ref:'tree',
  			valueId: '',
  			mineStatus: [],
  			valueTitle:'',
  			userForm:{
  				id: '',
  				username: '',
  				email: '',
  				mobile: '',
  				status: '',
  				password: '',
  				organization:''
  			},
		    orglists:[],
  			props: {
  				label: 'name',
  				children: 'children'
  			},
  			stateArr:[{
	        	value: '1',
	            label: '正常'
	        }, {
	            value: '0',
	            label: '停用'
	        }],
	        requestData: {
	        	jobNo: '',
	        	name: '',
	        	password: '',
	        	email: '',
	        	phone: '',
	        	status: '',
	        	groupIds: [],
	        	roleIds: [],
	        	operatorId: ''
	        },
	        options:[],
	        rules:{//验证
	        	id: [
	        		{validator: checkId, trigger: 'blur' }
	        	],
  				username: [
  					{validator: checkUsername, trigger: 'blur' }
  				],
  				email: [
  					{validator: checkEmail, trigger: 'blur' }
  				],
  				mobile: [
  					{validator: checkPhone, trigger: 'blur' }
  				],
  				password: [
  					{validator: checkPsaaword, trigger: 'blur' }
  				]
	        }
  		}
  	},
  	mouted(){
  		
  	},
  	created () {
  		this.getrolelist()
  	},
  	
  	methods:{
  		getrolelist(){ //获取角色数据
  			this.axios.post('rmUser/roles').then((res)=>{
	  			this.options = res.data
	  			// for(var i = 0; i < this.options.length; i++){
	  			// 	this.options[i].id = res.data.data[i].id
	  			// }
	    	})	  
  		},
	    getNodeInfo(node,resolve) {
		},
		deleteOrg(tag){
			this.requestData.groupIds[tag] = ''
		},
		handleNodeClick(a){
	        let res = this.$refs['tree'+a].getCurrentNode(true,true)
	        let arrLabel = []
	        arrLabel.push(res.name)
	        this.requestData.groupIds[a] = res.id
	    	this.$set(this.mineStatus,a,arrLabel)
	    	var array = []
	    	for(var i=0;i<this.requestData.groupIds.length;i++){
	    		array.push(this.requestData.groupIds[i])
	    	}
	    	var nary = array.sort()
	    	for (var i=0;i<array.length;i++){
	        	if(nary[i] !== undefined){
	        		if(nary[i] == nary[i+1]){
		        		this.$alert('已选择该机构', '提示', {
				          confirmButtonText: '确定'
				        });
				        this.mineStatus[a] = ''
				        this.requestData.groupIds[a] = ''
					    return;
		        	}
	        	}
			}
	    },
  		AddForm () {
  			let cope = {
  				name:'',
  				id:'',
  				label:''
  			}
  			this.mineStatus.push([])
  			this.orglists.push(cope)
	    },
	    Delete (index,row) {
	    	this.orglists.splice(index,1)
	    	this.mineStatus.splice(index,1)
	    	this.requestData.groupIds.splice(index,1)
	    	this.requestData.roleIds.splice(index,1)
	    },
	    getRole(index,row){
	    	this.requestData.roleIds[index] = row.value	
	    },
     	//返回
	    submitReturn(){
	    	this.$router.push({
	    		path:'/setting/user',
	    		query:{
  					'id': this.$route.query.id
  				}
	    	})
	    	sessionStorage.setItem('usernode2',sessionStorage.getItem('usernode1'))
	    },
	    // 获取数据
	    getCode (val) { //员工工号
	    	this.requestData.jobNo = val
	    },
	    getName (val) { //姓名
	    	this.requestData.name = val
	    },
	    getEmail (val) { //邮箱
	    	this.requestData.email = val
	    },
	    getMobile (val) { //电话
	    	this.requestData.phone = val
	    },
	    getStatus (val) { //状态
	    	this.requestData.status = val
	    },
	    getPassword (val) { //密码
	    	this.requestData.password = val
	    },
	    //保存
	    submitAll(formName){
	    	this.$refs[formName].validate(valid => {
	          if (valid) {
	          	if(this.requestData.status == ''){
	          		this.$alert('请选择状态', '提示', {
				          confirmButtonText: '确定'
				        });
				    return;    
	          	}
	          	if(this.requestData.groupIds == ''){
	          		this.$alert('请添加机构', '提示', {
				          confirmButtonText: '确定'
				        });
				    return;    
	          	} else {
	          		if(this.requestData.groupIds.length !== this.requestData.roleIds.length){
	          			this.$alert('机构、角色不能有空', '提示', {
					          confirmButtonText: '确定'
					        });
					    return;    
	          		}else{
	          			for(var i=0;i<this.requestData.groupIds.length;i++){
		          			if(this.requestData.groupIds[i] == '' || this.requestData.groupIds[i] == undefined){
		          				this.$alert('机构不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							    return;  
		          			}
		          		}
	          		}
	          	}
	          	if(this.requestData.roleIds == ''){
	          		this.$alert('请添加角色', '提示', {
				          confirmButtonText: '确定'
				        });
				    return;    
	          	} else {
	          		if(this.requestData.groupIds.length !== this.requestData.roleIds.length){
	          			this.$alert('机构、角色不能有空', '提示', {
					          confirmButtonText: '确定'
					        });
					    return;    
	          		}else{
	          			for(var i=0;i<this.requestData.roleIds.length;i++){
		          			if(this.requestData.roleIds[i] == '' || this.requestData.roleIds[i] == undefined){
		          				this.$alert('角色不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							    return;  
		          			}
		          		}
	          		}	
	          	}
	            this.savedata();
	          }
	        });
	    },
	    savedata(){
	    	var params = qs.stringify({
	        	jobNo: this.requestData.jobNo,
	        	name: this.requestData.name,
	        	email: this.requestData.email,
	        	phone: this.requestData.phone,
	        	status: this.requestData.status,
	        	password: this.requestData.password,
	        	groupIds: this.requestData.groupIds,
	        	roleIds: this.requestData.roleIds
	        })
	    	this.axios.post('rmUser/addUser',params).then((res)=>{
      			if(res.code === 200){
      				if(res.data == '0'){
						this.$alert('保存失败', '提示', {
					      confirmButtonText: '确定',
					      callback: action => {

					      }
					    });
      				} else if(res.data == '1'){
      					this.$alert('保存成功', '提示', {
					      confirmButtonText: '确定',
					      callback: action => {
					      	this.$router.push({
					    		path:'/setting/user',
					    		query:{
				  					'id': this.$route.query.id
				  				}
					    	})
					      	sessionStorage.setItem('usernode2',sessionStorage.getItem('usernode1'))
					      }
					    });
      				} else if(res.data == '2'){
      					this.$alert('用户已经存在', '提示', {
					      confirmButtonText: '确定',
					      callback: action => {

					      }
					    });
      				}
      			} else{
      				this.$alert(res.message, '提示', {
				      confirmButtonText: '确定',
				      callback: action => {

				      }
				    });
      			}
			})
	    },
	    loadNode(node,resolve){
	    	if (node.level === 0) {
  				return resolve([{ name: '中华保险集团',id:'1_01'}]);
		    }else{
	    		this.node = node
	  			this.resolve = resolve
	  			var mid = node.data.id === undefined?'1_01':node.data.id;
	  			var params = qs.stringify({
		        	parentId: mid
		        })
		        this.axios.post('/rmUser/groupNameByPid', params).then((res)=>{
		       		var arr = [];
	                if(res.data != null){
			          	for (var i = 0; i < res.data.length; i++) {
			           	var obj = new Object;
			           	obj.name = res.data[i].name;
			           	obj.id = res.data[i].groupId;
			           	arr.push(obj);
			          } 
	                }
					resolve(arr)
		        })
	    	}
	    }
  	},
  	watch: {
	    
	},
  };
</script>
<style>
	.newuser-form .el-input__inner{
		width: 300px;
		height: 32px
	}
	.newuser-form .list .el-input__inner{
		width: 100%!important;
		height: 32px;
		padding: 0 25px 0 15px;
		border: none;
		text-overflow:ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.newuser-form .el-form-item{
		margin-bottom: 18px
	}
	.newuser-form .el-form-item__label,.newuser-form .el-form-item__content,.newuser-form .el-input__icon{
		line-height: 32px
	}
	.newuser-form .el-form-item .el-form-item__content{
		width:300px;
	}
	.newuser-form .el-form-item__label{
		width: 80px;
		height: 32px;
		padding: 0 12px 0 0;
		text-align: justify
	}
	.newuser-form .el-form-item label:after {
        content: " ";
        display: inline-block;
        width: 100%;
    }
    .newuser-form .el-form-item:nth-child(7) .el-form-item__label{
		width: 110px!important;
		text-align: right;
		margin-left: -30px
    }
    .newuser-form thead{
		display: none;
    }
    .newuser-form .el-table td{
    	padding: 0;
    	text-align: center;
    }
    .newuser-form .el-table .cell{
    	padding: 0
    }
    .newuser-form .el-table__empty-block{
    	display: none;
    }
    .newuser-form .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .newuser-form .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
   		content: none
    }
    .newuser .el-breadcrumb__inner{
    	color: #4285F4!important;
    	font-weight: 700!important;
    }
    .newuser .is-link{
    	color: #909191!important;
    }
    .newuser .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
    .select-tree{
    	height: 274px!important;
    }
    .select-tree .el-scrollbar .el-scrollbar__view{
		padding:6px 20px;
	}
    .select-tree .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
	    height: auto;
	    max-height: 274px;
	    overflow:visible !important;
	    background:#FFF;
	    padding:0!important;
    }
</style>
<style lang="scss" scoped>
	.newuser{
		height: 100%;
		.el-breadcrumb{
			padding: 20px 0 16px 0
		}
		.setBox{
			min-height: calc(100% - 70px);
			padding: 16px 16px 0 16px;
			margin-bottom: 16px;
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
		.newuser-form{
			text-align:center;
			input{
				height:30px
			}
		}
		.list{
			width: 100%;
			background: #F9F9F9!important;
			border-left: 1px solid #E9E9E9;
			border-right: 1px solid #E9E9E9;
			span{
				display:inline-block
			}
			li{
				border: 1px solid #ebeef5;
				border-top: none
			}
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
    .addRole{
    	width:300px;
    	color:#909399;
    	border:1px solid #ebeef5;
    	background:#f9f9f9;
    	.el-col:first-child,.el-col:last-child{
    		text-align:center
    	}
    }
    .addForm {
    	width:300px
    }
  	.el-select-dropdown__item.selected{
    	font-weight: normal;
  	}
  	ul li >>>.el-tree .el-tree-node__content{
    	height:auto;
    	padding: 0 20px;
  	}
  	.el-tree-node__label{
    	font-weight: normal;
  	}
  	.el-tree >>>.is-current .el-tree-node__label{
    	color: #409EFF;
    	font-weight: 700;
  	}
  	.el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    	color:#606266;
    	font-weight: normal;
  	}

</style>
