<template>
  <div id="orgTable">
  	<div class="addOrg">
		<el-button type="primary" v-if="btnData.addbtn">
			<span class="jump" @click="goAdd">新增机构</span>
		</el-button>
	</div>
  	<el-table :data="orgtableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
  		<template slot="empty">
			<p>{{nodata}}</p>
  		</template>
		<el-table-column type="index" label="序号" width="100"></el-table-column>
		<el-table-column prop="orgNo" label="机构编号">
			<template slot-scope="scope">
				<span>{{scope.row.orgNo == null?'--':scope.row.orgNo}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="orgName" label="机构名称">
			<template slot-scope="scope">
				<span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="orgStatus" label="状态"></el-table-column>
		<el-table-column prop="orgHandle" label="操作" width="100">
			<template slot-scope="scope">
				<span class="handleBtn" @click="goEdit(scope.$index, scope.row)" v-if="btnData.editbtn">编辑</span>
				<span class="handleBtn" style="color:#f56c6c" @click="goDelet(scope.$index, scope.row)" v-if="btnData.delbtn">删除</span>
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
	  			orgtableData:[],
	  			requestData:{},
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
	  		// ...mapState(['orgBtnData'])
	  	},
	  	watch:{
	  		f1(newdata,olddata){
	  			this.getData(newdata)
	  		}
	  	},
	  	methods:{
	  		refresh () { //获取数据
	  			var newnode = sessionStorage.getItem('node2')
	  			if(newnode !== null){
	  				this.connectAxios(newnode,1)
	  			}else{
		  			this.requestData = JSON.parse(sessionStorage.orgaskData);
		  			this.connectAxios(this.requestData.groupId)
		    	}
	  		},
	  		connectAxios(mid,tip){
	  			var params = qs.stringify({
		        	parentId: mid
		        })
	  			this.axios.post('rmUser/groupName', params).then((res)=>{
	  				if(res.data !== null){
		  				this.orgtableData = res.data
			            for (var i = 0; i < this.orgtableData.length; i++) {
			        		this.orgtableData[i].orgNo = this.orgtableData[i].groupCode;
			        		this.orgtableData[i].orgName = this.orgtableData[i].name;
			        		if(this.orgtableData[i].status == '0'){
			        			this.orgtableData[i].orgStatus = "停用"
			        		}else{
			        			this.orgtableData[i].orgStatus = "正常"
			        		}
			        	}
		        	} else {
		        		this.orgtableData = []
		        	}
		        	if(tip == 1){
		        		sessionStorage.removeItem('node2')
		        	}
		    	})
	  			Bus.$emit('newgroupId',mid)   
	  		},
	  		goAdd(){//新增机构
				this.$router.push({
	  				path: '/newOrganization',
	  				query:{
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  		goEdit(index,row){ //编辑
	  			this.$router.push({
	  				path: '/editOrganization',
	  				query:{
	  					rowid: row.groupId,
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
			        	groupId: row.groupId
			        })
		          	this.axios.post('rmUser/delGroup',params).then((res)=>{
			        	if(res.code == '200'){
			        		if (res.data == '0') {
			        			this.$alert('删除失败', '提示', {
						          confirmButtonText: '确定'
						        });
			        		} else if(res.data == '1') {
			        			this.$alert('删除成功', '提示', {
						          confirmButtonText: '确定'
						        });
			        		} else if(res.data == '2') {
			        			this.$alert('父级分组，无法删除', '提示', {
						          confirmButtonText: '确定'
						        });
			        		} else if(res.data == '3') {
			        			this.$alert('该分组下有用户', '提示', {
						          confirmButtonText: '确定'
						        });
			        		}
			        		sessionStorage.setItem('node2',sessionStorage.getItem('node1'))
			        		// 执行刷新
			        		this.refresh();
			        	}else{
			        		 this.$alert(res.message, '提示', {
					          confirmButtonText: '确定'
					        });
			        	}
					})
	            })
		        .catch(_ => {});

	  		},
	  		fmtData(val){
		      	val.forEach(item =>{
					if(item.status === 1){
						item.orgStatus = '正常'
					}
					if(item.status === 0){
						item.orgStatus = '停用'
					}
				})
		    },
		    // 返回页面时加载数据
		    getData(aaa){
		    	//this.handleData = sessionStorage.getItem('newhandleData')
		    	this.handleData = aaa
		    	if(this.handleData !== undefined){
			  		if(this.handleData.indexOf('1_sgroupl')>=0){
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sgroupa')>=0){
	            		Bus.$on('orgisShow', (data) => {
					    	if(data == 0){
								this.btnData.addbtn = false
							} else{
								this.btnData.addbtn = true
							}
					    })
	            		// this.btnData.addbtn = true
	            	}else{
	            		this.btnData.addbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sgroupu')>=0){
	            		this.btnData.editbtn = true
	            	}else{
	            		this.btnData.editbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sgroupd')>=0){
	            		this.btnData.delbtn = true
	            	}else{
	            		this.btnData.delbtn = false
	            	}
	            }
		    }
	  	},
	  	created(){
	  		Bus.$off("isSgroup");
	  		Bus.$on('isSgroup', (data) => {
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
  			Bus.$on('orgManages', (data) => {
				this.orgtableData = [];
	            this.orgtableData = data == undefined?[]:data;
	            if(this.orgtableData.length != 0){
		            for (var i = 0; i < this.orgtableData.length; i++) {
		        		this.orgtableData[i].orgNo = this.orgtableData[i].groupCode;
		        		this.orgtableData[i].orgName = this.orgtableData[i].name;
		        		if(this.orgtableData[i].status == '0'){
		        			this.orgtableData[i].orgStatus = "停用"
		        		}else{
		        			this.orgtableData[i].orgStatus = "正常"
		        		}
		        	}
	            }
	        })
	    	Bus.$on('orgaskData',(data) => {
	    		this.requestData = data;
	    	})
	    	Bus.$on('orgisShow', (data) => {
		    	if(data == 0){
					this.nodata = '用户没有权限访问该资源'
				} else {
					this.nodata = '没有数据'
				}
		    })
	    	// 获取操作数据
	    	Bus.$off("handleData");
	    	Bus.$on('handleData', (data) => {
				this.handleData = []
	            this.handleData = data == undefined?[]:data
	            if(this.handleData.length != 0){
	            	if(this.handleData.indexOf('1_sgroupl')>=0){
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sgroupa')>=0){
	            		this.btnData.addbtn = true
	            	}else{
	            		this.btnData.addbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sgroupu')>=0){
	            		this.btnData.editbtn = true
	            	}else{
	            		this.btnData.editbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sgroupd')>=0){
	            		this.btnData.delbtn = true
	            	}else{
	            		this.btnData.delbtn = false
	            	}
	            }
	        })
  		}
    };
</script>
<style>
	#orgTable table tr:last-child td{
		border-bottom: none
	}
	#orgTable .el-table::before{
		background-color: transparent!important
	}
	#orgTable .textOverFlow{
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
