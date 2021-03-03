<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好管理</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好传导体系</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item class="txtColor">偏好模型管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main">
            <div class="main-title"><i></i>偏好模型管理</div>
            <div class="main-header">
              <div class="main-search">
                <el-form :inline="true" >
                  <el-form-item label="年份：" style="margin-bottom:0">
                      <el-select v-model="year" placeholder="请选择"  size="small">
                          <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="适用对象：" style="margin-left:20px;margin-bottom:0">
                      <el-select v-model="value" placeholder="请选择" size="small">
                          <el-option label="中华财险" value="中华财险"></el-option>
                      </el-select>
                  </el-form-item>
                </el-form>
                <div class="main-btn" style="margin-left:20px"> 
                  <el-button type="primary" class="btn" @click="handleSearch">查询</el-button>
                </div>
              </div>
              <div class="main-btn">
                <el-button type="primary" class="btn" @click="handleAdd">新增</el-button>
              </div>
            </div>
            
            <div class="main-body">
                <el-table :data="tableData" class="main-table" :header-cell-style="{ background: '#f5f7fa'}"> 
                    <el-table-column type="index" label="序号"  align='center'></el-table-column>
                    <el-table-column label="风险偏好模型版本" align='center' :show-overflow-tooltip="true"> 
                         <template slot-scope="scope">
                             <div @click="goDetail(scope.row)" class="row-title">{{scope.row.reportYear}}风险偏好模型</div>
                         </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="创建人"  align='center'></el-table-column>
                    <el-table-column label="操作" align='center'>
                        <template slot-scope="scope">
                            <el-button @click="goDetail(scope.row)" type="text" size="small" class="btn">详情</el-button>
                            <el-button @click="goEdit(scope.row)"  type="text" size="small" class="btn">维护</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    prev-text="上一页"
                    next-text="下一页"
                    :prev-click="handleCurrentChange"
                    :next-click="handleCurrentChange"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </div>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            tableData:[],
            isShowAdd:false,
            isDetail:false,
            year:'',
            currentPage:1,
            value:'中华财险'
        }
    },
    computed:{
        yearList(){
            let now=new Date().getFullYear();
            let ary=[];
            for(let i=now;i>=2015;i--){
                ary.push (i);
            }
            return ary;
        }
    },
    beforeMount(){
        this.year = new Date().getFullYear();
        this.getTableList()
    },
    methods:{
        getTableList(year){
            const params={
                pageNo:this.currentPage,
                pageSize:10,
                applyObject:'中华财险'
            }
            if(year){params.year=year}
            this.axios.get('riskPrefModel/queryPrefModelList',{params}).then((res)=>{
                if(res.code === 200){
                    this.tableData = res.data.prefModelList?res.data.prefModelList:[];
                    this.totalCount=res.data.pageTotalCount;
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
        goDetail(row){
             this.$router.push({name:'addModelManagement',query:{year:row.reportYear,type:'3'}})
        },
        goEdit(row){
            this.$router.push({name:'addModelManagement',query:{year:row.reportYear,type:'2'}})
        },
        handleCurrentChange(val) {
            this.currentPage=val;
            this.getTableList()
        },
        handleAdd(){
            let params={
                year:this.year
            }
            this.axios.get('riskPrefModel/validateRecord',{ params})
            .then(res=>{
                if(res.code === 200){
                    this.$alert('请确认已经导入本年度动态偿付能力测试数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText:'关闭',
                    showCancelButton: true,
                    callback:(action)=>{
                        if(action==='confirm'){
                            this.$router.push({name:'addModelManagement',query:{year:this.year,type:'1'}})
                        }
                    }
                });
                   
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            }).catch(() => {
                this.$alert('操作失败', '提示', {
                    confirmButtonText: '确定'
                });
            })
            
        },
        handleSearch(){
            this.currentPage = 1;
            this.getTableList(this.year);
        },
    }
}
</script>

<style lang="scss" scoped>
.txtColor{
    /deep/ .el-breadcrumb__inner{
        color: #4285F4 ;
        font-weight: 700 ;
    }  
}
/deep/ .el-input__icon{
    height:32px;
}
.main{
    min-height: 300px;
    background: #fff;
    padding: 16px 16px 0 16px;
    box-shadow: 4px 2px 6px #888;
    margin-top: 2px;
    border-radius: 8px;
    &-title{
        font-size:14px;
        margin-bottom:30px;
        font-weight:600;
        display: flex;
        align-items: center;
        i{
            display: inline-block;
            width: 2px;
            height: 14px;
            background: #4285F4;
            vertical-align: middle;
            margin-right: 6px;
        }
    }
    &-header{
      display: flex;
      justify-content: space-between;
      margin-bottom:30px;
    }
    &-search{
      display:flex;
      align-items: center;
    }
    &-btn{
        display:flex;
        justify-content:flex-end;
        align-items: center;
        .btn{
            width: 68px;
            line-height: 26px;
            padding:0;
            margin-right:27px;
        }
    }
    &-body{
        padding-bottom:20px;
        text-align: center;;
    }
    &-table{
        background:#f9f9f9;
        border: 1px solid #E9E9E9;
        margin-bottom:20px;
        .row-title{
            cursor: pointer;
            color:#4285F4;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }
        /deep/.el-table {
            td{
                padding:8px 0;
            }
        }
        .btn{           
            color:#4285f4                        
        }
    }
}
</style>