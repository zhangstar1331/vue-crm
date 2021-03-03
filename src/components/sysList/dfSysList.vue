<template>
  <div id="dfSysList">
	  <el-button type="primary" v-if="btnData.newBuildBtn" @click="goAdd" class="newBuildBtn">新建制度</el-button>
	  <el-button type="primary" v-if="btnData.exportBtn && tableData4.length>0"  class="exportBtn" @click="exportForm">导出</el-button>
  	<el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	    <el-table-column type="index" width="50" label="序号" > </el-table-column>
	    <el-table-column prop="outFileNo" width="240" label="制度文号" > </el-table-column>
	    <el-table-column prop="name" label="制度名称" >
	    			<template slot-scope="scope">
					    	<span :title="scope.row.name" class="textOverFlow">{{ scope.row.name }}</span>
						</template>
	    </el-table-column>
	    <el-table-column prop="category" label="适用类型" > </el-table-column>
	    <el-table-column prop="startDate" label="生效日期" > </el-table-column>
	    <el-table-column prop="status" label="制度状态" ></el-table-column>
	    <el-table-column prop="statusMark" v-if="bzShow" label="备注" > </el-table-column>
	    <el-table-column prop="hanndle" width="180" label="操作">
	    	<template slot-scope="scope">
		    		<span class="detailBtn" v-if="btnData.checkDetail" @click="jumpDetail(scope.$index, scope.row)"> 详情 </span>
		    		<span class="detailBtn" v-if="scope.row.status == '有效' && btnData.downLoadBtn && scope.row.flag != 1" @click="handleEdit(scope.$index, scope.row,'xz')"> 下载 </span>
		    		<span class="detailBtn" v-if="scope.row.status == '有效' && btnData.backBtn && scope.row.flag != 1" @click="handleEdit(scope.$index, scope.row,'th')"> 回退 </span>
		        <el-dropdown trigger="click" slot="header" size="mini" v-if="scope.row.status != '废止'">
		          	<span class="moreBtn" v-show="scope.row.flag != 1 && btnData.handleBtn" @click="moreHandle(scope.$index, scope.row)"> 维护 </span>
			          <el-dropdown-menu slot="dropdown">
			            <el-dropdown-item  @click.native="handleEdit(scope.$index, scope.row , item.value)" :key="item.id" v-for="(item,index) in jobs"> {{item.label}} </el-dropdown-item>
			          </el-dropdown-menu>
		        </el-dropdown>
	      </template>
	    </el-table-column>
  	</el-table>
		<el-pagination background layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
  </div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey,fileDownload} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	props:["showRecord"],
  	data() {
      return {
      	showNewBuild:true,
      	showExport:true,
				nums:[],
        tableData4:[],
        totalResults:0,
        loading:false,
        fmtDatas:{},
        jobs: [],
        jobsTemp:[],
        currentPage:1,
        requestData:{},
        bzShow:true,
        handleData:[],
        btnData:{   //按钮显示隐藏
  				checkDetail: false,//查看详情
  				exportBtn: false, //导出外规
  				newBuildBtn:false,//新建按钮
  				handleBtn:false,//操作列按钮
  				moreBtn:true,
  				downLoadBtn:false,//下载按钮
  				backBtn:false//回退按钮
  			}
      }
    },
    methods: {
    	refresh(){
    		this.requestData = JSON.parse(sessionStorage.askData);
    		this.axios.post('instweb/query',sessionStorage.askData,{headers:{'Content-Type':'application/json'}}
	        ).then((res)=>{
	        			this.totalResults =  res.data.totalResults
	            	this.tableData4 = res.data.data;
	            	if(this.tableData4 != null){
		            	for (var i = 0; i < this.tableData4.length; i++) {
				        			var str = this.tableData4[i].fileNoHead + ' [ ' + this.tableData4[i].fileNoBody + ' ] ' + this.tableData4[i].fileNoFoot+'号'
				        			this.tableData4[i].outFileNo = str;
				        	}
	            	}
	            	if(res.data.data != null){
	            		this.fmtData(res.data.data)
	            	}
					})
    	},
    	moreHandle(index,row){
    		if(row.status == '有效'){
    			this.jobs = [];
    			
    			if(this.$store.state.orgBtnData.indexOf(' 1_cdfrb') > -1){
    					this.jobs.push({
			            label: '回退',
			            value: 'th'
			          })
    				}
    			if(this.$store.state.orgBtnData.indexOf('1_cdfab') > -1){
    					this.jobs.push({
			            label: '废止',
			            value: 'fz'
			          })
    				}
    			if(this.$store.state.orgBtnData.indexOf('1_cdfr') > -1){
    					this.jobs.push({
			            label: '修订',
			            value: 'xd'
			          })
    				}
    			if(this.$store.state.orgBtnData.indexOf('1_cdfdl') > -1){
    					this.jobs.push({
			            label: '下载',
			            value: 'xz'
			          })
    				}
    		}else if(row.status == '维护中'){
    			var handleDataArr = JSON.parse(sessionStorage.getItem('handleData'))
    			this.jobs = [];
    			if(handleDataArr.indexOf('1_cdfsb') > -1){
    					this.jobs.push({
			            label: '提交',
			            value: 'tj'
			          })
    				}
    			if(handleDataArr.indexOf('1_cdfed') > -1){
    					this.jobs.push({
			            label: '编辑',
			            value: 'bj'
			          })
    				}
    			if(handleDataArr.indexOf('1_cdfd') > -1){
    					this.jobs.push({
			            label: '删除',
			            value: 'de'
			          })
    				}
    		}else{
    			var handleDataArr = JSON.parse(sessionStorage.getItem('handleData'))
    			this.jobs = [];
    			if(handleDataArr.indexOf('1_cdfd') > -1){
    					this.jobs.push({
			            label: '删除',
			            value: 'de'
			          })
    				}
    		}
    	},
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleSizeChange (value) {
      	var askData = JSON.parse(sessionStorage.getItem('askData'))
						askData.pageNo = value;
						sessionStorage.setItem('askData',JSON.stringify(askData))
						this.refresh()
      },
      handleCurrentChange (value) {
			var askData = JSON.parse(sessionStorage.getItem('askData'))
					askData.pageNo = value;
					sessionStorage.setItem('askData',JSON.stringify(askData))
        //下一页请求数据
        this.refresh()
      },
      submitOuter(id){
      	this.axios.post('/instweb/submit',JSON.stringify({"id":id,flag:"1",type:'3'}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
      		if(res.data == '1'){
	        			this.$alert('资料不完整，无法提交', '提示', {
				          confirmButtonText: '确定'
				        });
				        return;
	        		}
      		if(res.code == '200'){
      				this.$alert('提交成功', '提示', {
				          confirmButtonText: '确定',callback: action => {
				            	//执行刷新
	        						this.refresh();
				          }	
				        });
      			}
      	})
      },
      editFt(id){
      	this.$router.push({
        path:'/dfReverseEdit',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		          id:id ,
		        }
		      })
      },
      jumpDetail(index,row){
      	if(row.status == '废止'){
		      	this.$router.push({
			        path:'/dfnewDetail',   //跳转的路径
			        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					          'id':row.id ,
		                'fz':'1'
					        }
					  })
      		}else{
		      	this.$router.push({
			        path:'/dfnewDetail',   //跳转的路径
			        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					          'id':row.id ,
		               	'ic':this.showRecord,
		               	'whFlag':row.flag
					        }
					  })
      		}
      },
      reverseFt(id){
      	this.$router.push({
        path:'/dfReverse',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		          id:id ,
		        }
		      })
      },
      //下拉框点击事件
      handleEdit(index,row,data){
      	if(data == 'tj'){
      		this.submitOuter(row.id)
      		this.refresh()
      	}else if(data == 'bj'){
      		sessionStorage.reverEdit = '1' //1 代表编辑
      		this.editFt(row.id,'1')
      	}else if(data == 'de'){
      		this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
          	this.axios.post('instweb/del',JSON.stringify({"id":row.id,type:'3'}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
			        	if(res.code == '200'){
			        		if(this.tableData4.length == 1){
			        			var askData = JSON.parse(sessionStorage.getItem('askData'))
			        			askData.pageNo = askData.pageNo -1;
			        			sessionStorage.setItem('askData',JSON.stringify(askData))
	        				}
			        		//执行刷新
			        		this.refresh();
			        	}else{
			        		 this.$alert(res.message, '提示', {
					          confirmButtonText: '确定'
					        });
			        	}
							})
          })
          .catch(_ => {});
      	}else if(data == 'th'){
      		this.axios.post('instweb/rollback',JSON.stringify({"id":row.id,type:'3'}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	        	if(res.code == '200'){
	        		this.$alert('操作成功', '提示', {
				          confirmButtonText: '确定',callback: action => {
				            	//执行刷新
	        						this.refresh();
				          }	
				        });
	        	}else{
	        		this.$alert(res.message, '提示', {
			          confirmButtonText: '确定'
			        });
	        	}
					})

      	}else if(data == 'xd'){
      		sessionStorage.reverEdit = '2' //2 代表修订
      		this.reverseFt(row.id,'2')
      	}else if(data == 'xz'){
			let path = "/instweb/download/institution?id="+row.id+"&name="+encodeURIComponent(row.name)
		  	this.axios.post(path,qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
				fileDownload(res, row.name+".zip");
			})
      	}else if(data == 'fz'){//废止
      		this.$confirm('确认废止？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
		  			this.axios.post('instweb/abrogate',JSON.stringify({"id":row.id,type:3}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
			        	if(res.code == '200'){
			        		this.refresh()
			        	}else{
			        		this.$alert(res.message, '提示', {
					          confirmButtonText: '确定'
					        });
			        	}
							})
          })
          .catch(_ => {});
      	}
      },
      setExportData(){
      	const askData = JSON.parse(sessionStorage.getItem('askData'));
      	this.requestData = askData;
      },
      exportForm(){
		let path = "/instweb/export?key="+encodeURIComponent(JSON.stringify(this.requestData))
		this.axios.post(path,qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
			fileDownload(res, "东方制度导出列表.xlsx");
		})
      },
      fmtData(parmas){
      	parmas.forEach(item =>{
    					if(item.status === 1){
    							item.status = '维护中'
    					}
    					if(item.status === 2){
    							item.status = '有效'
    					}
    					if(item.status === 3){
    							item.status = '废止'
    					}
    					if(item.statusMark == null){
    						this.bzShow = false;
    					}
    					if(item.statusMark === 1){
    							item.statusMark = '新增'
    					}
    					if(item.statusMark === 2){
    							item.statusMark = '修订'
    					}
    					if(item.dfCategory == '1'){
    							item.category = '执行类'
    					}
    					if(item.dfCategory == '2'){
    							item.category = '参照类'
    					}
    				})
      },
      //获取操作集合
    	getHandleData(roleId,moduleId){
        if(roleId !== null && moduleId !== null){
          var params = qs.stringify({
              roleId: roleId,
              moduleId: moduleId
          })
          this.axios.post('rmUser/permissionIds',params).then((res)=>{
              if(res.code == 200){
              	this.handleData = res.data;
              	sessionStorage.setItem('handleData',JSON.stringify(res.data))
								if(this.handleData !== undefined){
		            	if(this.handleData.indexOf('1_cdfds')>=0){
		            		this.btnData.checkDetail = true
		            	}else{
		            		this.btnData.checkDetail = false
		            	}
		            	this.setMoreHandle(res.data)	
									if(this.btnData.checkDetail == false){
										this.btnData.handleBtn = false;
									}else{
										this.btnData.handleBtn = true;
									}
				        }
              }
          })
        }
      },
     // 返回页面时加载数据
	   getData(aaa){
	    	if(getUrlKey('id') == '1_cdw'){
	   			//id="1_cdw" 代表是待维护模块 
	   			var roleId = sessionStorage.getItem('roleId')
          this.getHandleData(roleId,'1_cdf')
	   		}else{
	   			this.handleData = aaa
	   		}
	    	if(this.handleData !== undefined){
		  		if(this.handleData.indexOf('1_cdfep')>=0){
            		this.btnData.exportBtn = true
            	}else{
            		this.btnData.exportBtn = false
            	}
            	if(this.handleData.indexOf('1_cdfds')>=0){
            		this.btnData.checkDetail = true
            	}else{
            		this.btnData.checkDetail = false
            	}
            	if(this.handleData.indexOf('1_cdfa')>=0){
            		this.btnData.newBuildBtn = true
            	}else{
            		this.btnData.newBuildBtn = false
            	}
            }
	    },
	    goAdd(){//新增机构
				this.$router.push({
	  				path: '/dfNewRegulations',
	  				query:{
	  					name:1,
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  	setMoreHandle(newData){
				this.jobsTemp = newData;
				if(this.jobsTemp.length != 0){
					this.btnData.moreBtn = true
				}else{
					this.btnData.moreBtn = false
				}
	  	},
    	moreHandle(index,row){
    		if(row.status == '有效'){
    			this.jobs = [];
    			if(this.$store.state.orgBtnData.indexOf('1_cdfab') > -1){
    					this.jobs.push({
			            label: '废止',
			            value: 'fz'
			          })
    				}
    			if(this.$store.state.orgBtnData.indexOf('1_cdfr') > -1){
    					this.jobs.push({
			            label: '修订',
			            value: 'xd'
			          })
    				}
    		}else if(row.status == '维护中'){
    			this.jobs = [];
    			if(this.jobsTemp.indexOf('1_cdfsb') > -1){
    					this.jobs.push({
			            label: '提交',
			            value: 'tj'
			          })
    				}
    			if(this.jobsTemp.indexOf('1_cdfed') > -1){
    					this.jobs.push({
			            label: '编辑',
			            value: 'bj'
			          })
    				}
    			if(this.jobsTemp.indexOf('1_cdfd') > -1){
    					this.jobs.push({
			            label: '删除',
			            value: 'de'
			          })
    				}
    		}else{
    			var handleDataArr = JSON.parse(sessionStorage.getItem('handleData'))
    			this.jobs = [];
    			if(this.$store.state.orgBtnData.indexOf('1_cdfd') > -1){
    					this.jobs.push({
			            label: '删除',
			            value: 'de'
			          })
    				}else{
    					this.$alert('抱歉，您没有该操作权限', '提示', {
				          confirmButtonText: '确定'
				        });
    				}
    		}
    	},
    },
    created(){
    	this.getData(this.$store.state.orgBtnData)
    	if(this.showRecord == '1'){
    			this.showNewBuild = false;
    			this.showExport = false;
    	}
			this.setExportData()
    	Bus.$on('formDatas', (data) => {
    				this.totalResults = data.totalResults == undefined?0:data.totalResults
    				this.tableData4 = [];
    				this.fmtDatas = data.data
            this.tableData4 = data.data == undefined?[]:data.data;
            this.currentPage = 1;
            if(this.tableData4.length != 0){
            	this.fmtData(data.data)
	            for (var i = 0; i < this.tableData4.length; i++) {
		        			var str = this.tableData4[i].fileNoHead + ' [ ' + this.tableData4[i].fileNoBody + ' ] ' + this.tableData4[i].fileNoFoot+'号'
		        			this.tableData4[i].outFileNo = str;
		        	}
	            if(this.$store.state.orgBtnData.indexOf('1_cdfrb') > -1){
	            	this.btnData.backBtn = true;
	            }
            	if(this.$store.state.orgBtnData.indexOf('1_cdfdl') > -1){
	            	this.btnData.downLoadBtn = true;
	            }
            	if(this.$store.state.orgBtnData.indexOf('1_cdfab') > -1){
	            	this.btnData.handleBtn = true;
	            }
            	if(this.$store.state.orgBtnData.indexOf('1_cdfr') > -1){
	            	this.btnData.handleBtn = true;
	            }
            }
          })
    	Bus.$on('askData',(data) => {
    			this.requestData = data;
    	})
    },
    computed:{
    	f1(){
	  			return this.$store.state.orgBtnData
	  		}
    },
    watch:{
    	f1(newdata,olddata){
	  			this.getData(newdata)
	  		},
    	fmtData(val){
    		this.fmtData(data.data)
    	}
    }
  }
</script>
<style lang="scss" >
#dfSysList{
	.el-tooltip__popper{ 
		max-width:50%;
	}
	.textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.cell{
		cursor: pointer;
	}
	.el-table__body-wrapper{
		background: #fff;
	}
	.el-pagination{
		text-align: center;
		padding-bottom: 50px;
		border: 0;
		margin-top: 20px;
	}
	.el-table::before{
		height:0;
	}
	.el-table th{
		background: #f9f9f9;
		text-align: center;
	}
	.el-table .cell{
		text-align: center;
	}
	.el-dropdown {
	    vertical-align: top;
	  }
	  .el-dropdown + .el-dropdown {
	    margin-left: 15px;
	  }
	  .el-icon-arrow-down {
	    font-size: 12px;
	 }
	.el-pagination button, .el-pagination span:not([class*=suffix]){
	padding:0 5px;
	font-size: 12px;
}
	.moreBtn,.detailBtn{
		color: #4285F4;
		padding: 0 2px;
	}
	.detailBtn:hover,.moreBtn:hover{
		cursor: pointer;
	}
	.el-dropdown-menu--mini{
		width: 80px;
		text-align: center;
	}
	.jumpA{
		color: #fff;
		text-decoration: none
	}
} 
</style>
