<template>
  <div id="wsysList">
    <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
      <el-table-column type="index" width="50" label="序号" > </el-table-column>
      <el-table-column prop="outFileNo" width="240" label="待维护文号" > </el-table-column>
      <el-table-column prop="name" width="260" label="待维护名称" >
      			<template slot-scope="scope">
					    	<span :title="scope.row.name" class="textOverFlow">{{ scope.row.name }}</span>
						</template>
      </el-table-column>
      <el-table-column prop="category" label="待维护类别" > </el-table-column>
      <el-table-column prop="startDate" label="生效日期" > </el-table-column>
      <el-table-column prop="publish" label="发文机关" > </el-table-column>
      <el-table-column prop="status" label="待维护状态" ></el-table-column>
      <el-table-column prop="hanndle" width="100" label="操作" v-if="true">
        <template slot-scope="scope">
          <span class="detailBtn" @click="jumpDetail(scope.$index, scope.row)"> 详情 </span>
          <el-dropdown trigger="click" slot="header" size="mini">
            <span class="moreBtn" @click="moreHandle(scope.$index, scope.row)"> 更多 </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  @click.native="handleEdit(scope.$index, scope.row , item.value)" :key="item.id" v-for="(item,index) in jobs"> {{item.label}} </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
  </div>
</template>

<script>
  import Bus from 'src/bus/bus.js'
  export default {
    data() {
      return {
        nums:[],
        tableData4:[],
        totalResults:0,
        loading:false,
        fmtDatas:{},
        jobs: [],
        requestData:{},
      }
    },
    methods: {
      refresh(){
        this.requestData = JSON.parse(sessionStorage.askData);
        this.$axios.post('instweb/query',JSON.parse(sessionStorage.askData)
        ).then((res)=>{
          this.totalResults =  res.data.data.totalResults
          this.tableData4 = res.data.data.data;
          for (var i = 0; i < this.tableData4.length; i++) {
			        			var str = this.tableData4[i].fileNoHead + ' [ ' + this.tableData4[i].fileNoBody + ' [ ' + this.tableData4[i].fileNoFoot+'号'
			        			this.tableData4[i].outFileNo = str;
			        	}
          this.fmtData(res.data.data.data)
        })
      },
      moreHandle(index,row){
    		if(row.status == '维护中'){
    			this.jobs = [
			      {
			        label: '提交',
			        value: 'tj',
			      },
			      {
			        label: '编辑',
			        value: 'bj',
			      },
			      {
			        label: '删除',
			        value: 'de',
			      }
					]}
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
        this.$axios.post('/instweb/submit',{id:id,flag:"1"}).then((res)=>{
        	if(res.data.data == '1'){
	        			this.$alert('资料不完整，无法提交', '提示', {
				          confirmButtonText: '确定'
				        });
				        return;
	        		}
        	if(res.data.code == '200'){
      				this.$alert('提交成功', '提示', {
				          confirmButtonText: '确定',callback: action => {
				            	//执行刷新
	        						this.refresh();
				          }	
				        });
      			}
        })
      },
      editFt(id,type){
        if(type == '1'){
        	this.$router.push({
	          path:'/inReverseEdit',   //跳转的路径
	          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            id:id ,
	          }
	        })
        }else if(type == '2'){
        	this.$router.push({
	          path:'/reverseEdit',   //跳转的路径
	          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            id:id ,
	          }
	        })
        }else{
        	this.$router.push({
	          path:'/dfReverseEdit',   //跳转的路径
	          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            id:id ,
	          }
	        })
        }
      },
      jumpDetail(index,row){
        this.$router.push({
          path:'/newDetail',   //跳转的路径
          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
            'id':row.id ,
            'white':'02'
          }
        })
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
          this.refresh()
        }else if(data == 'bj'){
          sessionStorage.reverEdit = '1' //1 代表编辑
          this.editFt(row.id,row.type)
        }else if(data == 'de'){
          this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
          	this.$axios.post('instweb/del',{
			  			"id":row.id
			  		}).then((res)=>{
			        	if(res.data.code == '200'){
			        		//执行刷新
			        		this.refresh();
			        	}else{
			        		 this.$alert(res.data.message, '提示', {
					          confirmButtonText: '确定'
					        });
			        	}
							})
          })
          .catch(_ => {});
        }else if(data == 'th'){
          this.$axios.post('instweb/rollback',{
            "id":row.id
          }).then((res)=>{
            if(res.data.code == '200'){
              this.refresh()
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
          window.open(this.serveUrl+"/instweb/download/institution?id="+row.id+"&name="+encodeURIComponent(row.name))
        }else if(data == 'fz'){//废止
          this.$confirm('确认废止？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
		  			this.$axios.post('instweb/abrogate',{
		      			"id":row.id
		      		}).then((res)=>{
			        	if(res.data.code == '200'){
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
        window.location.href=this.serveUrl+"/instweb/export?key="+encodeURIComponent(JSON.stringify(this.requestData));
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
            item.category = '规章'
          }
          if(item.category == '04'){
            item.category = '规范性文件'
          }
        })
      }
    },
    created(){
      this.setExportData()
      Bus.$on('formDatas', (data) => {
        this.totalResults = data.totalResults
				this.tableData4 = [];
				this.fmtDatas = data.data
        this.tableData4 = data.data == null?[]:data.data;
        if(this.tableData4.length != 0){
        	this.fmtData(data.data)
            for (var i = 0; i < this.tableData4.length; i++) {
	        			var str = this.tableData4[i].fileNoHead + ' [ ' + this.tableData4[i].fileNoBody + ' [ ' + this.tableData4[i].fileNoFoot+'号'
	        			this.tableData4[i].outFileNo = str;
	        	}
        }
      })
      Bus.$on('askData',(data) => {
        this.requestData = data;
      })
    },
    watch:{
      fmtData(val){
        this.fmtData(data.data)
      }
    }
  }
</script>

<style lang='scss'>
#wsysList{
	.cell{
		white-space:pre-line !important;
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
  }
	}
</style>
