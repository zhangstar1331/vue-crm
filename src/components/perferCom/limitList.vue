<template>
  <div id="riskLimit">
    <!--主题内容风险偏好陈述书-->
	    <el-button type="primary" class="newBuildBtnee" @click="goAdd" v-if="btnData.newBuild">新增</el-button>
	    <div class="box tbox3" style="padding-bottom: 100px;">
	      <div class="titIcon"><em></em><span style="font-weight: 600">风险限额管理</span></div>
	      <!--适用对象-->
	      <div style="margin-left: 3px;">
	        <span class="activeObject">适用对象</span>
	        <el-select v-model="value" @change="selectObj">
	          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
	        </el-select>
	        <el-button type="primary" class="newBuildBtnees" @click="getlistData"> 查询</el-button>
	      </div>
	      <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	          <el-table-column prop="date" label="序号" type="index" :index="indexMethod" width="180"  > </el-table-column>
	          <el-table-column prop="name"  label="风险限额文件名称" > 
	          		<template slot-scope="scope">
              			<span class="textOverFlow" @click="jumpDetail(scope.$index, scope.row)" :title="scope.row.name">{{scope.row.name}}</span>
              	</template>
	          </el-table-column>
	          <el-table-column prop="year" :show-overflow-tooltip="true" :row-class-name="tableRowClassNames" label="风险限额版本" ></el-table-column>
	        <el-table-column width="200" label="操作" v-if="btnData.handleBtn">
	          <template slot-scope="scope">
	            <span class="detailBtn" v-if="btnData.detailBtn" style="color: #4285F4;" @click="jumpDetail(scope.$index, scope.row)"> 详情 </span>
	            <span class="detailBtn" v-if="btnData.repaireBtn" style="color: #4285F4;" @click="editFile(scope.$index, scope.row)"> 维护 </span>
	            <span class="detailBtn" v-if="btnData.downLoadBtn" style="color: #4285F4;" @click="loadFile(scope.$index, scope.row)"> 批量下载 </span>
	          </template>
	        </el-table-column>
	      </el-table>
	    </div>
  </div>
</template>
<script>
  import Bus from 'src/bus/bus.js'
	import qs from 'qs'
	import {statusCode,getUrlKey,fileDownload,fileNameCombine} from 'src/utils/utils.js'
  export default {
    data() {
      return {
      	limitType:'',
        options: [{
          name: '全部'
        }],
        value: '全部',
        tableData4:[],
        tableRowClassNames:[],
        handleData:[], //操作数据
	  			btnData:{   //按钮显示隐藏
	  				newBuild: false,
	  				detailBtn: false,
	  				downLoadBtn: false,
	  				repaireBtn: false,
	  				handleBtn:false
	  			}
      }
    },
    created(){
      Bus.$off("isPlimit");
      Bus.$on('isPlimit', (data) => {
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
    	this.getlistData()
      sessionStorage.setItem('limitType','')
      sessionStorage.reWriteInfo = 0;
      this.getCompany()
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
    methods:{
    	getData(aaa){
	    	this.handleData = aaa
	    	if(this.handleData !== undefined){
		  		if(this.handleData.indexOf('1_plimita')>=0){
            		this.btnData.newBuild = true
            	}else{
            		this.btnData.newBuild = false
            	}
            	if(this.handleData.indexOf('1_plimitds')>=0){
            		this.btnData.detailBtn = true
            	}else{
            		this.btnData.detailBtn = false
            	}
            	if(this.handleData.indexOf('1_plimitdl')>=0){
            		this.btnData.downLoadBtn = true
            	}else{
            		this.btnData.downLoadBtn = false
            	}
            	if(this.handleData.indexOf('1_plimitr')>=0){
            		this.btnData.repaireBtn = true
            	}else{
            		this.btnData.repaireBtn = false
            	}
            if(!this.btnData.detailBtn && !this.btnData.downLoadBtn && !this.btnData.repaireBtn){
            		this.btnData.handleBtn = false;
            }else{
            		this.btnData.handleBtn = true;
            }
        }
	    },
      /*索引值*/
      indexMethod(index) {
        return index + 1;
      },
      jumpDetail(index,row){
      	if(!this.btnData.detailBtn){
      		this.$alert('抱歉，您没有此操作权限', '提示', {
		          confirmButtonText: '确定'
		        });
		        return;
      	}
      	sessionStorage.limitType = row.type;
      	this.$router.push({
      		path:'/buildLimit',
      		query:{
      			id:row.id,
      			deFlag:1
      		}
      	})
      },
      goAdd(){
      	if(this.value == '全部' || this.value == undefined){
      		this.$alert('请选择一种适用对象', '提示', {
		          confirmButtonText: '确定'
		        });
		        return;
      	}
      	this.$router.push({
	  				path: '/buildLimit',
	  				query:{limitType:this.limitType}
	  			})
      },
       editFile(index,row){
       	sessionStorage.limitType = row.type;
      	this.$router.push({
      		path:'/buildLimit',
      		query:{
      			id:row.id
      		}
      	})
      },
      selectObj(val){
      	this.limitType = val
      	sessionStorage.setItem('limitType',val)
      },
      getlistData(){
      	var limitType = this.limitType
      	var params = qs.stringify({
					type:limitType,
				})
				this.axios.post('riskmana/queryquo',params).then((res)=>{
		          if(res.code == 200){
		          	this.tableData4 = res.data.data;
		        }else{
						statusCode(res.code,res.message)
		     		 }
		    	}).catch((response) => {
						this.$alert('操作失败', '提示', {
			          confirmButtonText: '确定'
			        });
				 })
      },
      loadFile(index,row){
      	if(row.isDown){
      			var obj = new Object()
						obj.filePath = row.url;
						obj.fileName = encodeURIComponent(row.name);
						this.axios.post('comm/download/202',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
							fileDownload(res, fileNameCombine(row.name,row.url));
						})
//	      		window.open(this.serveUrl+"/riskmana/downloadquo?id="+row.id+"&name="+encodeURIComponent(row.name));
      	}else{
	      		this.$alert('该风险限额未上传附件', '提示', {
				          confirmButtonText: '确定'
				      });
      	}
      },
      getCompany(){
          this.axios.post('/riskmana/comm').then((res)=>{
            if(res.code == 200){
                if(res.data!==null){
                    for (var i = 0; i < res.data.length; i++) {
                        var obj = new Object()
                        obj.name = res.data[i].name
                        obj.id = res.data[i].id
                        this.options.push(obj)
                    }
                }
            }else{
                this.$alert(res.message, '提示', {
                  confirmButtonText: '确定'
                });
             }
          }).catch((response) => {
            this.$alert('操作失败', '提示', {
                confirmButtonText: '确定'
              });
         })
      },
  }
}
</script>
<style lang="scss">
  #riskLimit{
  	margin-top: 15px;
    .el-breadcrumb{
      margin-bottom: 16px;
      margin-top: 20px;
    }
    .cell{
    	text-align: center;
    	span:hover{
    		cursor: pointer;
    	}
    }
    .el-table__body-wrapper{
    	background: #fff;
    }
    th{
    	background: #F9F9F9;
    	color: #909399;
    	font-weight: bold;
    }
    .box{
      min-height: 300px;
      background: #fff;
      padding: 16px 16px 0 16px;
      -webkit-box-shadow: 4px 2px 6px #888;
      margin-top: 2px;
      border-radius: 8px;
      .titIcon{
        font-size:14px;
        margin-bottom:30px;
        em{
          display: inline-block;
          width: 2px;
          height: 14px;
          background: #4285F4;
          vertical-align: middle;
          margin-right: 6px;
        }
      }
      .activeObject{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #303030;
        letter-spacing: 0;
      }
      .el-select{
      	width: 300px;
        margin-bottom: 30px;
        margin-left: 10px;
      }
      .el-select .el-input--suffix input{
        border: 1px solid #E9E9E9;
        border-radius: 3px;
        width: 100%;
        height: 32px;
      }
      .el-select .el-input--suffix .el-select__caret{
      	line-height: 27px;
      }
    }
  .newBuildBtnee{
    margin-top: 27px;
    margin-right: 27px;
    float: right;
    width: 68px;
    height: 26px;
    background: #4285F4;
    padding: 0;
    font-size: 12px;
    margin-top: 80px;
    a{
      color: white;
    }
  }
  .newBuildBtnees{
    background: #4285F4;
    margin-left: 9px;
    border-radius: 3px;
    width: 68px;
    height: 26px;
    padding: 0;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 12px;
  	}
  .textOverFlow{
  	color:#4285F4;
		display: inline-block;
	 	width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
  }	
}
</style>
