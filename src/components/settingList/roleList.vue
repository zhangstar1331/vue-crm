<template>
  <div id="userList">
  	<div class="addOrg">
			<el-button type="primary" v-if="btnData.addbtn">
				<span class="jump" @click="goAdd">新增角色</span>
<!-- 				<router-link class="jump" :to="{path:'/newRole'}">新增角色</router-link>
 -->			</el-button>
		</div>
	<el-table :data="roletableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
		<el-table-column type="index" label="角色编号" width="100"></el-table-column>
		<el-table-column prop="name" label="角色名称" width="150">
			<template slot-scope="scope">
				<span :title="scope.row.name" class="textOverFlow">{{scope.row.name}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="desc" label="角色描述">
			<template slot-scope="scope">
				<span :title="scope.row.desc" class="textOverFlow">{{scope.row.desc}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="roleHandle" label="操作">
			<template slot-scope="scope">
				<span class="handleBtn" @click="viewDefend(scope.$index,scope.row)" v-if="btnData.viewbtn">视图维护</span>
				<span class="handleBtn" @click="accessDefend(scope.$index,scope.row)" v-if="btnData.accessbtn">权限维护</span>
				<span class="handleBtn" @click="editRole(scope.$index,scope.row)" v-if="btnData.editbtn">编辑角色</span>
				<span class="handleBtn" @click="goDelet(scope.$index,scope.row)" v-if="btnData.delbtn">删除角色</span>
			</template>
		</el-table-column>
	</el-table>
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
	  			roletableData:[],
	  			handleData:[], //操作数据
	  			btnData:{   //按钮显示隐藏
	  				openbtn: false,
	  				addbtn: false,
	  				viewbtn: false,
	  				accessbtn: false,
	  				editbtn: false,
	  				delbtn: false,
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
	  		Bus.$off("isSrole");
	  		Bus.$on('isSrole', (data) => {
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
	  		this.getUserList()
	  		// 获取操作数据
	    	Bus.$off("handleData");
	    	Bus.$on('handleData', (data) => {
				this.handleData = []
	            this.handleData = data == undefined?[]:data
	            if(this.handleData.length != 0){
	            	if(this.handleData.indexOf('1_srolel')>=0){//查看列表
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_srolea')>=0){//新增角色
	            		this.btnData.addbtn = true
	            	}else{
	            		this.btnData.addbtn = false
	            	}
	            	if(this.handleData.indexOf('1_srolev')>=0){//视图维护
	            		this.btnData.viewbtn = true
	            	}else{
	            		this.btnData.viewbtn = false
	            	}
	            	if(this.handleData.indexOf('1_srolep')>=0){//权限维护
	            		this.btnData.accessbtn = true
	            	}else{
	            		this.btnData.accessbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sroleu')>=0){//编辑角色
	            		this.btnData.editbtn = true
	            	}else{
	            		this.btnData.editbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sroled')>=0){//删除角色
	            		this.btnData.delbtn = true
	            	}else{
	            		this.btnData.delbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sroled')>=0){//删除角色
	            		this.btnData.delbtn = true
	            	}else{
	            		this.btnData.delbtn = false
	            	}
	            }
	        })
	  	},
	  	methods:{
	  		viewDefend(index,row){
	  			this.$router.push({
	  				path: '/viewDefend',
	  				query:{
	  					rowid: row.id,
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  		accessDefend(index,row){
	  			this.$router.push({
	  				path: '/accessDefend',
	  				query:{
	  					rowid: row.id,
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  		goAdd(){//新增机构
				this.$router.push({
	  				path: '/newRole',
	  				query:{
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  		editRole(index,row){
	  			this.$router.push({
	  				path: '/editRole',
	  				query:{
	  					rowid: row.id,
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  		getUserList(){
	  			this.axios.post('rmUser/roles',{}).then((res)=>{
		          if(res.code == 200){
		          	this.roletableData = res.data;
		          }else{
					this.$alert(res.message, '提示', {
			          confirmButtonText: '确定'
			        });
		          }
		        })
	  		},
	  		deleteUser(index,id){
	  			var params = qs.stringify({
		        	roleId: id
		        })
	  			this.axios.post('rmUser/delRole',params).then((res)=>{
			        if(res.code == 200){
			        	if (res.data == '0') {
		        			this.$alert('该角色不存在', '提示', {
					          confirmButtonText: '确定'
					        });
		        		} else if(res.data == '1') {
		        			this.$alert('该角色已经绑定用户', '提示', {
					          confirmButtonText: '确定'
					        });
		        		} else if(res.data == '2') {
		        			this.roletableData.splice(index,1)
		        			this.$alert('成功删除', '提示', {
					          confirmButtonText: '确定'
					        });
		        		}
			        }else{
						this.$alert(res.message, '提示', {
				          confirmButtonText: '确定'
				        });
			        }
		        })
	  		},
	  		goDelet(index,row){ //删除
				this.$confirm('确认删除？', '提示', {
	              confirmButtonText: '确定',
	              cancelButtonText: '取消',
	              type: 'warning'
	            }).then(_ => {
	            	// debugger;
	            	this.deleteUser(index,row.id)
	            })
		        .catch(_ => {});
	  		},
	  		// 返回页面时加载数据
		    getData(aaa){
		    	this.handleData = aaa
		    	// this.handleData = sessionStorage.getItem('newhandleData')
		    	if(this.handleData !== undefined){
			  		if(this.handleData.indexOf('1_srolel')>=0){//查看列表
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_srolea')>=0){//新增角色
	            		this.btnData.addbtn = true
	            	}else{
	            		this.btnData.addbtn = false
	            	}
	            	if(this.handleData.indexOf('1_srolev')>=0){//视图维护
	            		this.btnData.viewbtn = true
	            	}else{
	            		this.btnData.viewbtn = false
	            	}
	            	if(this.handleData.indexOf('1_srolep')>=0){//权限维护
	            		this.btnData.accessbtn = true
	            	}else{
	            		this.btnData.accessbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sroleu')>=0){//编辑角色
	            		this.btnData.editbtn = true
	            	}else{
	            		this.btnData.editbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sroled')>=0){//删除角色
	            		this.btnData.delbtn = true
	            	}else{
	            		this.btnData.delbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sroleuv')>=0){//用户机构视图
	            		sessionStorage.setItem('yhbtn',1)
	            	} else{
	            		sessionStorage.setItem('yhbtn',0)
	            	}
	            	if(this.handleData.indexOf('1_sroleiv')>=0){//制度机构视图
	            		sessionStorage.setItem('zdbtn',1)
	            	} else{
	            		sessionStorage.setItem('zdbtn',0)
	            	}
	            	if(this.handleData.indexOf('1_srolezv')>=0){//指标报送视图
	            		sessionStorage.setItem('zbbtn',1)
	            	} else{
	            		sessionStorage.setItem('zbbtn',0)
	            	}
	            	if(this.handleData.indexOf('1_srolecv')>=0){//合规报送机构
	            		sessionStorage.setItem('hgbtn',1)
	            	} else{
	            		sessionStorage.setItem('hgbtn',0)
	            	}
	            	if(this.handleData.indexOf('1_sroleev')>=0){//损失事件报送机构
	            		sessionStorage.setItem('ssbtn',1)
	            	} else{
	            		sessionStorage.setItem('ssbtn',0)
	            	}
	            	if(this.handleData.indexOf('1_sroleov')>=0){//集中度报送机构
	            		sessionStorage.setItem('jzdbtn',1)
	            	} else{
	            		sessionStorage.setItem('jzdbtn',0)
	            	}
	            	if(this.handleData.indexOf('1_srolerv')>=0){//指标报表适用对象
	            		sessionStorage.setItem('zbFormbtn',1)
	            	} else{
	            		sessionStorage.setItem('zbFormbtn',0)
	            	}
	            	if(this.handleData.indexOf('1_srolecxolv')>=0){//财险机构
	            		sessionStorage.setItem('cxbtn',1)
	            	} else{
	            		sessionStorage.setItem('cxbtn',0)
	            	}
	            }
		    }
	  	}
    };
</script>
<style>
	#userList .textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	#userList table tr:last-child td{
		border-bottom: none
	}
	#userList .el-table::before{
		background-color: transparent!important
	}
</style>
<style lang="scss" scoped>
	#userList span{
		cursor: pointer;
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
	.jump{
		color:#FFF;
		text-decoration: none
	}
	.handleBtn{
		color: #4285F4;
	}
</style>

