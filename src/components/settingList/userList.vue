<template>
  <div id="userTable">
  	<div class="addOrg" v-if="btnData.addbtn">
		<el-button type="primary">
			<span @click="goAdd">新增用户</span>
<!-- 			<router-link class="jump" :to="{path:'/newUser'}">新增用户</router-link> -->
		</el-button>
	</div>
	<el-table :data="usertableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
		<template slot="empty">
			<p>{{nodata}}</p>
  		</template>
		<el-table-column type="index" label="序号" width="50"></el-table-column>
		<el-table-column prop="userNo" label="员工工号" width="80">
			<template slot-scope="scope">
				<span :title="scope.row.userNo" class="textOverFlow">{{scope.row.userNo == null||scope.row.userNo == ''?'--':scope.row.userNo}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="userName" label="姓名" width="80">
			<template slot-scope="scope">
				<span :title="scope.row.userName" class="textOverFlow">{{scope.row.userName == null||scope.row.userName == ''?'--':scope.row.userName}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="userEmail" label="邮箱">
			<template slot-scope="scope">
				<span :title="scope.row.userEmail" class="textOverFlow">{{scope.row.userEmail == null||scope.row.userEmail == ''?'--':scope.row.userEmail}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="userMobile" label="电话">
			<template slot-scope="scope">
				<span :title="scope.row.userMobile" class="textOverFlow">{{scope.row.userMobile == null||scope.row.userMobile == ''?'--':scope.row.userMobile}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="userOrg" label="机构">
			<template slot-scope="scope">
				<span :title="scope.row.userOrg" class="textOverFlow">{{scope.row.userOrg == null||scope.row.userOrg == ''?'--':scope.row.userOrg}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="userRole" label="角色">
			<template slot-scope="scope">
				<span :title="scope.row.userRole" class="textOverFlow">{{scope.row.userRole == null||scope.row.userRole == ''?'--':scope.row.userRole}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="userStatus" label="状态" width="80">
			<template slot-scope="scope">
				<span :title="scope.row.userStatus" class="textOverFlow">{{scope.row.userStatus == null||scope.row.userStatus == ''?'--':scope.row.userStatus}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="userHandle" label="操作" width="110">
			<template slot-scope="scope">
				<span class="handleBtn" @click="goEdit(scope.$index, scope.row)" v-if="btnData.editbtn">编辑</span>
				<span class="handleBtn" style="color:#f56c6c" @click="goDelet(scope.$index, scope.row)" v-if="btnData.delbtn">删除</span>
			</template>
		</el-table-column>
	</el-table>
	<el-pagination background layout="prev,pager,next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {ajax} from 'src/utils/utils.js'
  	import {statusCode} from 'src/utils/utils.js'
  	import qs from 'qs'
  	import {getUrlKey} from 'src/utils/utils.js'
  	import {mapState} from 'vuex'
	export default {
	  	data () {
	  		return {
	  			currentPage:1,
	  			totalResults: 0, //总页数
	  			usertableData:[], //表格
	  			requestData: [],
	  			defaultaskData : {
	  				groupId: '1_01',
	  				pageNumber: '1',
	      			pageSize: '10'
	  			},
	  			deId:'',
	  			handleData:[], //操作数据
	  			btnData:{   //按钮显示隐藏
	  				openbtn: false,
	  				addbtn: false,
	  				editbtn: false,
	  				delbtn: false,
	  			},
	  			nodata:'没有数据'
	  		}
	  	},
	  	computed:{
	  		f1(){
	  			return this.$store.state.orgBtnData
	  		}
	  	},
	  	watch:{
	    	deId() {
		    },
		    f1(newdata,olddata){
		    	this.totalResults = 1
	  			this.getData(newdata)
	  		}
	    },
	  	methods:{
	  		first () {
	  			var newnode = sessionStorage.getItem('usernode2')
	  			if(newnode !== null){
	  				var params = qs.stringify({
			        	groupId: newnode,
			        	pageNumber: '1',
			        	pageSize: '10'
			        })
			        this.connectAxios(params,2)
	  			}else{
		  			var params = qs.stringify({
			        	groupId: '1_01',
			        	pageNumber: '1',
			        	pageSize: '10'
			        })
			        this.connectAxios(params,2)
		  		}
	  		},
	  		refresh () {
	  			var newnode = sessionStorage.getItem('usernode2')
	  			if(newnode !== null){
	  				var params = qs.stringify({
			        	groupId: newnode,
			        	pageNumber: '1',
			        	pageSize: '10'
			        })
			        // 获取表格数据
			  		this.axios.post('rmUser/userList',params).then((res)=>{
			  			if(res.data !== null){
				  			this.totalResults =  res.data.count
				  			this.usertableData = res.data.data
				  			for (var i = 0; i < this.usertableData.length; i++){
				  				this.usertableData[i].userNo = this.usertableData[i].jobNo
				  				this.usertableData[i].userName = this.usertableData[i].name
				  				this.usertableData[i].userEmail = this.usertableData[i].email
				  				this.usertableData[i].userMobile = this.usertableData[i].phone
				  				var str = ''
				  				for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
				  					str+=this.usertableData[i].daRoleList[n].gropName+'/'
				  				}
				  				this.usertableData[i].userOrg = str + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].gropName
				  				var str1 = ''
				  				for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
				  					if(this.usertableData[i].daRoleList[n].roleName!==null){
				  						str1+=this.usertableData[i].daRoleList[n].roleName+'/'
				  					}
				  				}
				  				if(this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName!==null){
				  					this.usertableData[i].userRole = str1 + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName
				  				}
				  				if(this.usertableData[i].status == '0'){
				  					this.usertableData[i].userStatus = "停用"
				  				}else if(this.usertableData[i].status == '1'){
				  					this.usertableData[i].userStatus = "正常"
				  				}
				  			}
				  		} else{
				  			this.usertableData = []
				  		}
				  		sessionStorage.removeItem('usernode2')
					})
	  			}else{
	  				this.requestData = JSON.parse(sessionStorage.useraskData);
		  			var params = qs.stringify({
			        	groupId: this.requestData.groupId,
			        	pageNumber: this.requestData.pageNumber,
			        	pageSize: this.requestData.pageSize
			        })
			  		// 获取表格数据
			  		this.axios.post('rmUser/userList',params).then((res)=>{
			  			if(res.data !== null){
				  			this.totalResults =  res.data.count
				  			this.usertableData = res.data.data
				  			for (var i = 0; i < this.usertableData.length; i++){
				  				this.usertableData[i].userNo = this.usertableData[i].jobNo
				  				this.usertableData[i].userName = this.usertableData[i].name
				  				this.usertableData[i].userEmail = this.usertableData[i].email
				  				this.usertableData[i].userMobile = this.usertableData[i].phone
				  				var str = ''
				  				for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
				  					str+=this.usertableData[i].daRoleList[n].gropName+'/'
				  				}
				  				this.usertableData[i].userOrg = str + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].gropName
				  				var str1 = ''
				  				for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
				  					if(this.usertableData[i].daRoleList[n].roleName!==null){
				  						str1+=this.usertableData[i].daRoleList[n].roleName+'/'
				  					}
				  				}
				  				if(this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName!==null){
				  					this.usertableData[i].userRole = str1 + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName
				  				}
				  				if(this.usertableData[i].status == '0'){
				  					this.usertableData[i].userStatus = "停用"
				  				}else if(this.usertableData[i].status == '1'){
				  					this.usertableData[i].userStatus = "正常"
				  				}
				  			}
				  		} else{
				  			this.usertableData = []
				  		}
					})
	  			}
	  			
	  		},
	  		connectAxios(params,tip){
	  			Bus.$off("isShow");
	  			Bus.$on('isShow',(data) => {
	    			if(data == 1){
	    				this.nodata = '没有数据'
	    				this.btnData.addbtn = true
		  				// 获取表格数据
				  		this.axios.post('rmUser/userList',params).then((res)=>{
				  			if(res.data !== null){
					  			this.totalResults =  res.data.count
					  			this.usertableData = res.data.data
					  			for (var i = 0; i < this.usertableData.length; i++){
					  				this.usertableData[i].userNo = this.usertableData[i].jobNo
					  				this.usertableData[i].userName = this.usertableData[i].name
					  				this.usertableData[i].userEmail = this.usertableData[i].email
					  				this.usertableData[i].userMobile = this.usertableData[i].phone
					  				var str = ''
					  				for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
					  					str+=this.usertableData[i].daRoleList[n].gropName+'/'
					  				}
					  				this.usertableData[i].userOrg = str + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].gropName
					  				var str1 = ''
					  				for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
					  					if(this.usertableData[i].daRoleList[n].roleName!==null){
					  						str1+=this.usertableData[i].daRoleList[n].roleName+'/'
					  					}
					  				}
					  				if(this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName!==null){
					  					this.usertableData[i].userRole = str1 + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName
					  				}
					  				if(this.usertableData[i].status == '0'){
					  					this.usertableData[i].userStatus = "停用"
					  				}else if(this.usertableData[i].status == '1'){
					  					this.usertableData[i].userStatus = "正常"
					  				}
					  			}
					  			if(tip == 2){
					  				sessionStorage.useraskData = JSON.stringify(this.defaultaskData)
					  			}
					  		} else{
					  			this.usertableData = []
					  		}
					  		if(tip == 1){
					  			sessionStorage.removeItem('usernode2')
					  		}
						})
		  			}else{
		  					this.nodata = '用户没有权限访问该资源'
		  					this.btnData.addbtn = false
				        	this.usertableData = []
				        	this.totalResults = 1
				        }
			    	})
	  		},
	  		handleSizeChange(value){
	  			var useraskData = JSON.parse(sessionStorage.getItem('useraskData'))
				useraskData.pageNumber = value;
				sessionStorage.setItem('useraskData',JSON.stringify(useraskData))
				this.refresh() 
	  		},
	  		handleCurrentChange(value){
				var useraskData = JSON.parse(sessionStorage.getItem('useraskData'))
				useraskData.pageNumber = value;
				sessionStorage.setItem('useraskData',JSON.stringify(useraskData))
				this.refresh() 
	  		},
	  		goAdd(){//新增用户
				this.$router.push({
	  				path: '/newUser',
	  				query:{
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  		goEdit(index,row){ //编辑
	  			this.$router.push({
	  				path: '/editUser',
	  				query:{
	  					rowid: row.userId,
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  		goDelet(index,row){ //删除
				this.$confirm('确认删除？', '提示', {
	              confirmButtonText: '确定',
	              cancelButtonText: '取消',
	              type: 'warning'
	            }).then(_ => {
	            	var params = qs.stringify({
			        	userId: row.userId
			        })
		          	this.axios.post('rmUser/delUser',params).then((res)=>{
		          		if(res.code == '200'){
			          		if (res.data == true) {
			        			this.$alert('更新成功', '提示', {
						          confirmButtonText: '确定'
						        });
						        if(this.usertableData.length == 1){
				        			var useraskData = JSON.parse(sessionStorage.getItem('useraskData'))
				        			useraskData.pageNumber = useraskData.pageNumber -1;
				        			sessionStorage.setItem('useraskData',JSON.stringify(useraskData))
		        				}
			        		} else if(res.data == false) {
			        			this.$alert('更新失败', '提示', {
						          confirmButtonText: '确定'
						        });
			        		}
			        		sessionStorage.setItem('usernode2',sessionStorage.getItem('usernode1'))
			          		this.refresh();
			          	}
					})
	            })
		        .catch(_ => {});
	  		},
	  		setExportData(){ //获取请求数据
	  			Bus.$off("useraskData");
		      	Bus.$on('useraskData',(data) => {
		    		this.requestData = data;
		    		this.deId = this.requestData.groupId;
		    		this.currentPage = 1;
		    		var params = qs.stringify({
			        	groupId: this.requestData.groupId,
			        	pageNumber: this.requestData.pageNumber,
			        	pageSize: this.requestData.pageSize
			        })
			        Bus.$off("isShow");
			        Bus.$on('isShow',(data) => {
				        if(data == 1){
				        	this.nodata = '没有数据'
							this.btnData.addbtn = true
				        	// 获取表格数据
					  		this.axios.post('rmUser/userList',params).then((res)=>{
					  			if(res.data != null){
					  				this.totalResults =  res.data.count
						  			this.usertableData = res.data.data
						  			for (var i = 0; i < this.usertableData.length; i++){
						  				this.usertableData[i].userNo = this.usertableData[i].jobNo
						  				this.usertableData[i].userName = this.usertableData[i].name
						  				this.usertableData[i].userEmail = this.usertableData[i].email
						  				this.usertableData[i].userMobile = this.usertableData[i].phone
						  				var str = ''
						  				for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
						  					str+=this.usertableData[i].daRoleList[n].gropName+'/'
						  				}
						  				this.usertableData[i].userOrg = str + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].gropName
						  				var str1 = ''
										for(var n = 0; n < this.usertableData[i].daRoleList.length-1; n++){
						  					if(this.usertableData[i].daRoleList[n].roleName!==null){
						  						str1+=this.usertableData[i].daRoleList[n].roleName+'/'
						  					}
						  				}
						  				if(this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName!==null){
						  					this.usertableData[i].userRole = str1 + this.usertableData[i].daRoleList[this.usertableData[i].daRoleList.length-1].roleName
						  				}
						  				if(this.usertableData[i].status == '0'){
						  					this.usertableData[i].userStatus = "停用"
						  				}else if(this.usertableData[i].status == '1'){
						  					this.usertableData[i].userStatus = "正常"
						  				}
						  				
						  			}
					  			} else {
					  				this.usertableData = []
					  				this.totalResults = 1
					  			}
							})
				        }else{
				        	this.nodata = '用户没有权限访问该资源'
				        	this.btnData.addbtn = false
				        	this.usertableData = []
				        	this.totalResults = 1
				        }
		    		})
			    })
		    },
		    // 返回页面时加载数据
		    getData(aaa){
		    	this.handleData = aaa
		    	// this.handleData = sessionStorage.getItem('newhandleData')
		    	if(this.handleData !== undefined){
			  		if(this.handleData.indexOf('1_suserl')>=0){//查看列表
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_susera')>=0){//新增用户
					 	var isShow = sessionStorage.getItem('isShow')
					  	if(isShow == 0){
							this.btnData.addbtn = false
						} else{
							this.btnData.addbtn = true
						}
	            		// this.btnData.addbtn = true
	            	}else{
	            		this.btnData.addbtn = false
	            	}
	            	if(this.handleData.indexOf('1_suseru')>=0){//编辑用户
	            		this.btnData.editbtn = true
	            	}else{
	            		this.btnData.editbtn = false
	            	}
	            	if(this.handleData.indexOf('1_suserd')>=0){//删除用户
	            		this.btnData.delbtn = true
	            	}else{
	            		this.btnData.delbtn = false
	            	}
	            }
		    }
	  	},
	  	mounted () {
	  		Bus.$off("isSuser");
	  		Bus.$on('isSuser', (data) => {
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
	  		this.first()
	  		this.setExportData()
	  		this.getData(this.$store.state.orgBtnData)
	  		// 获取操作数据
	    	Bus.$off("handleData");
	    	Bus.$on('handleData', (data) => {
				this.handleData = []
	            this.handleData = data == undefined?[]:data
	            if(this.handleData.length != 0){
	            	if(this.handleData.indexOf('1_suserl')>=0){//查看列表
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_susera')>=0){//新增用户
	            		this.btnData.addbtn = true
	            	}else{
	            		this.btnData.addbtn = false
	            	}
	            	if(this.handleData.indexOf('1_suseru')>=0){//编辑用户
	            		this.btnData.editbtn = true
	            	}else{
	            		this.btnData.editbtn = false
	            	}
	            	if(this.handleData.indexOf('1_suserd')>=0){//删除用户
	            		this.btnData.delbtn = true
	            	}else{
	            		this.btnData.delbtn = false
	            	}
	            }
	        })
	  	},

    };
</script>
<style>
	#userTable table tr:last-child td{
		border-bottom: none
	}
	#userTable .el-table::before{
		background-color: transparent!important
	}
	#userTable .textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
<style lang="scss" scoped>
	.addOrg{
		float:right;
		button{
			width: 68px;
			height: 26px;
			padding: 0;
			font-size: 12px;
		}
	}
	.jump{
		color:#FFF;
		text-decoration: none
	}
	.handleBtn{
		color: #4285F4;
	}
</style>
