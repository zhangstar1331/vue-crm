<template>
  <div id="sysLi">
  	<el-button type="primary" v-if="btnData.newBuildBtn" @click="goAdd" class="newBuildBtn">新建制度</el-button>
	  <el-button type="primary" class="exportBtn" v-if="btnData.exportBtn && tableData4.length>0" @click="exportForm">导出</el-button>
  	<el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	    <el-table-column type="index" width="50" label="序号" > </el-table-column>
	    <el-table-column prop="outFileNo" width="240" label="外规文号" > </el-table-column>
	    <el-table-column  prop="name" label="外规名称" > 
	    		<template slot-scope="scope">
				    	<div class="newIcon"><span class="isnew" v-if="scope.row.isNew">NEW</span><span :title="scope.row.name" :class="scope.row.isNew?'textOverFlowNew':'textOverFlow'">{{ scope.row.name }}</span></div>
					</template>	
	    </el-table-column>
	    <el-table-column prop="category" label="外规类别" > </el-table-column>
	    <el-table-column prop="startDate" label="生效日期" > </el-table-column>
	    <el-table-column prop="publish" label="发文机关" >
          <template slot-scope="scope">
              <span>{{ publishType[scope.row.publish]}}</span>
          </template> 
      </el-table-column>
	    <el-table-column prop="status" label="外规状态" ></el-table-column>
	    <el-table-column prop="statusMark" v-if="bzShow" label="备注" > </el-table-column>
	    <el-table-column prop="hanndle" width="180" label="操作" v-if="true">
	    	<template slot-scope="scope">
		    		<span class="detailBtn" v-if="btnData.checkDetail" @click="jumpDetail(scope.$index, scope.row)"> 详情 </span>
		    		<span class="detailBtn" v-if="scope.row.status == '有效' && btnData.downLoadBtn && scope.row.flag != 1" @click="handleEdit(scope.$index, scope.row,'xz')"> 下载 </span>
		    		<span class="detailBtn" v-if="scope.row.status == '有效' && btnData.backBtn && scope.row.flag != 1" @click="handleEdit(scope.$index, scope.row,'th')"> 回退 </span>
		        <el-dropdown trigger="click" slot="header" size="mini" v-if="scope.row.status != '废止' ">
		          	<span v-show="scope.row.flag != 1 && btnData.handleBtn" class="moreBtn" @click="moreHandle(scope.$index, scope.row)">维护</span>
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
	import {getUrlKey,formatDate,datedifference,fileDownload} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	props:['showRecord'],
  	data() {
      return {
      	showNewBuild:true,
      	handleData:[],
      	btnData:{   //按钮显示隐藏
  				checkDetail: false,//查看详情
  				exportBtn: false, //导出外规
  				newBuildBtn:false,//新建按钮
  				handleBtn:false,//操作列按钮
  				downLoadBtn:false,//下载按钮
  				backBtn:false,//回退按钮
  			},
      	currentPage:1,
				nums:[],
				state:'',
        tableData4:[],
        totalResults:0,
        loading:false,
        fmtDatas:{},
        jobs: [],
        jobsTemp:[],
        requestData:{},
        bzShow:true,
        publishType:{
          '01':'全国人大',
          '02':'国务院',
          '03':'地方人大',
          '04':'银保监会',
          '05':'保监会',
          '06':'人民银行',
          '07':'财政部',
          '08':'税务总局',
          '99':'其他',
        }
      }
    },
    created(){
    	this.getData(this.$store.state.orgBtnData)
    	//获取数据判断是否显示更多操作
			this.setExportData();
    	Bus.$on('formDatas', (data) => {
    				this.totalResults = data.totalResults
    				this.tableData4 = [];
    				this.fmtDatas = data.data
            this.tableData4 = data.data == undefined?[]:data.data;
            this.currentPage = 1;
            var today = formatDate(new Date(),'yyyy-MM-dd')
            if(this.tableData4.length != 0){
            	this.fmtData(data.data)
	            for (var i = 0; i < this.tableData4.length; i++) {
		        			var str = this.tableData4[i].fileNoHead + ' [ ' + this.tableData4[i].fileNoBody + ' ] ' + this.tableData4[i].fileNoFoot+'号'
		        			this.tableData4[i].outFileNo = str;
                  if(this.tableData4[i].issuedDate){
                    var issuedDate = this.tableData4[i].issuedDate.substring(0,4)+'-'+this.tableData4[i].issuedDate.substring(4,6)+'-'+this.tableData4[i].issuedDate.substring(6)
                    if(datedifference(issuedDate,today)<=30&&this.companySource=='1'){
                      this.$set(this.tableData4[i],'isNew',true)
                    } else{
                      this.$set(this.tableData4[i],'isNew',false)
                    }
                  }
		        	}
	            if(this.$store.state.orgBtnData.indexOf('1_couterrb') > -1){
	            	this.btnData.backBtn = true;
	            }
	            if(this.$store.state.orgBtnData.indexOf('1_couterdl') > -1){
		            	this.btnData.downLoadBtn = true;
	            }
	            if(this.$store.state.orgBtnData.indexOf('1_couterab') > -1){
		            	this.btnData.handleBtn = true;
	            }
	            if(this.$store.state.orgBtnData.indexOf('1_couterr') > -1){
		            	this.btnData.handleBtn = true;
	            }
            }
          })
    	Bus.$on('askData',(data) => {
    			this.requestData = data;
    	})
    },
    computed:{
      ...mapState(['companySource']),
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
	  	},
    methods: {
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
		            	if(this.handleData.indexOf('1_couterds')>=0){
		            		this.btnData.checkDetail = true
		            	}else{
		            		this.btnData.checkDetail = false
		            	}
//		            	if(this.handleData.indexOf('1_sgroupd')>=0){
//		            		this.btnData.moreBtn = true
//		            	}else{
//		            		this.btnData.moreBtn = false
//		            	}
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
          this.getHandleData(roleId,'1_couter')
	   		}else{
	   			this.handleData = aaa
	   		}
	    	if(this.handleData !== undefined){
		  		if(this.handleData.indexOf('1_couterep')>=0){
            		this.btnData.exportBtn = true
            	}else{
            		this.btnData.exportBtn = false
            	}
            	if(this.handleData.indexOf('1_couterds')>=0){
            		this.btnData.checkDetail = true
            	}else{
            		this.btnData.checkDetail = false
            	}
            	if(this.handleData.indexOf('1_coutera')>=0){
            		this.btnData.newBuildBtn = true
            	}else{
            		this.btnData.newBuildBtn = false
            	}
//          	if(this.handleData.indexOf('1_sgroupd')>=0){
//          		this.btnData.moreBtn = true
//          	}else{
//          		this.btnData.moreBtn = true
//          	}
//          	this.setMoreHandle(aaa)	
//							if(this.btnData.checkDetail == false){
//								this.btnData.handleBtn = false;
//							}else{
//								this.btnData.handleBtn = true;
//							}
            }
	    },
	    goAdd(){//新增机构
				this.$router.push({
	  				path: '/newRegulations',
	  				query:{
	  					name:1,
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
	  	setMoreHandle(newData){
	  		this.jobsTemp = newData;
	  		this.jobs = [];
				if(this.jobs.length != 0){
					this.btnData.moreBtn = true
				}else{
					this.btnData.moreBtn = false
				}
	  	},
    	moreHandle(index,row){
    		if(row.status == '有效'){
    			this.jobs = [];
    			if(this.$store.state.orgBtnData.indexOf('1_couterab') > -1){
    					this.jobs.push({
			            label: '废止',
			            value: 'fz'
			          })
    				}
    			if(this.$store.state.orgBtnData.indexOf('1_couterr') > -1){
    					this.jobs.push({
			            label: '修订',
			            value: 'xd'
			          })
    				}
    		}else if(row.status == '维护中'){
    			this.jobs = [];
    			if(this.jobsTemp.indexOf('1_coutersb') > -1){
    					this.jobs.push({
			            label: '提交',
			            value: 'tj'
			          })
    				}
    			if(this.jobsTemp.indexOf('1_coutered') > -1){
    					this.jobs.push({
			            label: '编辑',
			            value: 'bj'
			          })
    				}
    			if(this.jobsTemp.indexOf('1_couterd') > -1){
    					this.jobs.push({
			            label: '删除',
			            value: 'de'
			          })
    				}
    		}else{
    			this.jobs = [];
    			if(this.$store.state.orgBtnData.indexOf('1_couterd') > -1){
    					this.jobs.push({
			            label: '删除',
			            value: 'de'
			          })
    				}else{
    					this.$alert('抱歉，您没有删除权限', '提示', {
				          confirmButtonText: '确定'
				        });
    				}
    		}
    	},
    	refresh(){
    		this.requestData = JSON.parse(sessionStorage.askData);
    		this.axios.post('instweb/query',sessionStorage.askData,{headers:{'Content-Type':'application/json'}}
	        ).then((res)=>{
	        			this.totalResults = res.data.totalResults
	            	this.tableData4 = res.data.data;
                var today = formatDate(new Date(),'yyyy-MM-dd')
		            	if(res.data.data.length != 0){
		            	for (var i = 0; i < this.tableData4.length; i++) {
				        			var str = this.tableData4[i].fileNoHead + ' [ ' + this.tableData4[i].fileNoBody + ' ] ' + this.tableData4[i].fileNoFoot+'号'
				        			this.tableData4[i].outFileNo = str;
                      if(this.tableData4[i].issuedDate){
                        var issuedDate = this.tableData4[i].issuedDate.substring(0,4)+'-'+this.tableData4[i].issuedDate.substring(4,6)+'-'+this.tableData4[i].issuedDate.substring(6)
                        if(datedifference(issuedDate,today)<=30&&this.companySource=='1'){
                          this.$set(this.tableData4[i],'isNew',true)
                        } else{
                          this.$set(this.tableData4[i],'isNew',false)
                        }
                      }
				        	}
		            	this.fmtData(res.data.data)
	            	}
					})
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
      	this.axios.post('/instweb/submit',JSON.stringify({id:id,flag:"1",type:'2'}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
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
      			}else{
      				this.$alert(res.message, '提示', {
				          confirmButtonText: '确定'
				        });
				      return;  
      			}
      	})
      },
      editFt(id){
      	this.$router.push({
        path:'/reverseEdit',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		          id:id ,
		        }
		      })
      },
      jumpDetail(index,row){
      	if(row.status == '废止'){
		      	this.$router.push({
			        path:'/newDetail',   //跳转的路径
			        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					          'id':row.id ,
		                'fz':'1'
					        }
					  })
      		}else{
      			this.$router.push({
			        path:'/newDetail',   //跳转的路径
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
        path:'/reverse',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		          id:id ,
		        }
		      })
      },
      //下拉框点击事件
      handleEdit(index,row,data){
      	if(data == 'tj'){
      		this.submitOuter(row.id)
      	}else if(data == 'bj'){
      		sessionStorage.reverEdit = '1' //1 代表编辑
      		this.editFt(row.id,'1')
      	}else if(data == 'de'){
      		this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
          	this.axios.post('instweb/del',JSON.stringify({"id":row.id,type:'2'}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
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
      		this.axios.post('instweb/rollback',JSON.stringify({"id":row.id,type:'2'}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	        	if(res.code == '200'){
	        		this.$alert('操作成功', '提示', {
				          confirmButtonText: '确定',callback: action => {
				            	//执行刷新
	        						this.refresh();
				          }	
				        });
	        	}else{
	        		this.$alert(res.data.message, '提示', {
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
		  			this.axios.post('instweb/abrogate',JSON.stringify({"id":row.id,type:2}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
			        	if(res.code == '200'){
			        		this.refresh()
			        	}else{
			        		this.$alert(res.data.message, '提示', {
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
				fileDownload(res, "外规导出列表.xlsx");
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
    					if(item.category == '01'){
    							item.category = '法律'
    					}
    					if(item.category == '02'){
    							item.category = '行政法规'
    					}
    					if(item.category == '03'){
    							item.category = '地方性规章'
    					}
    					if(item.category == '04'){
    							item.category = '部门规章'
    					}
    					if(item.category == '05'){
    							item.category = '规范性文件'
    					}
    				})
      }
    }
  }
</script>
<style lang="css">
  .el-tooltip__popper{
    max-width:50%
  }
</style>
<style lang="scss">
  #sysLi .cell:hover{
   cursor: pointer;
 }
 #sysLi .textOverFlow,#sysLi .textOverFlowNew{
   width: 100%;
   text-overflow: ellipsis;
   overflow: hidden;
   white-space: nowrap;
 }
 #sysLi .textOverFlowNew{
   width: calc(100% - 70px)!important;
   text-align:left!important;
 }
 #sysLi .el-table__body-wrapper{
  background: #fff;
}
#sysLi 	.el-pagination{
  text-align: center;
  padding-bottom: 50px;
  border: 0;
  margin-top: 20px;
}
#sysLi 	.el-table::before{
  height:0;
}
#sysLi 	.el-table th{
  background: #f9f9f9;
  text-align: center;
}
#sysLi 	.el-table .cell{
  text-align: center;
}
#sysLi 	.el-dropdown {
 vertical-align: top;
}
#sysLi .el-dropdown + .el-dropdown {
 margin-left: 15px;
}
#sysLi .el-icon-arrow-down {
 font-size: 12px;
}
#sysL .el-pagination button, .el-pagination span:not([class*=suffix]){
	padding:0 5px;
	font-size: 12px;
}
#sysLi .moreBtn,#sysLi .detailBtn{
  color: #4285F4;
  padding: 0 2px;
}
#sysLi .detailBtn:hover,#sysLi .moreBtn:hover{
  cursor: pointer;
}
#sysLi .el-dropdown-menu--mini{
  width: 80px;
  text-align: center;
}
#sysLi .jumpA{
  color: #fff;
  text-decoration: none
}
#sysLi .newIcon{
  span{
    display:inline-block;
    vertical-align:middle;
   }
  .isnew{
    width:70px;
    height:30px;
    line-height:30px;
    color:#FFF;
    font-size:24px!important;
    border-radius:2px;
    transform:scale(0.5);
    margin-right:-10px;
    background:#FF6363;
  }
}
</style>
