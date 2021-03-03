<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">压力测试</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item class="txtColor">压力测试报告</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main">
            <div class="main-title"><i></i>压力测试报告</div>
            <div class="main-header">
              <div class="main-search">
                <el-form :inline="true" size="small">
                  <el-form-item label="适用对象：" style="margin-left:20px;margin-bottom:0">
                      <el-select v-model="value" placeholder="请选择">
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
                <el-table :data="tableData" class="main-table" :header-cell-style="{ background: '#f5f7fa'}" row-class-name="rowClass"> 
                    <el-table-column type="index" label="序号" align='center'></el-table-column>
                    <el-table-column label="压力测试报告名称" align='center' :show-overflow-tooltip="true">
                         <template slot-scope="scope">
                             <div @click="goDetail(scope.row)" class="row-title">{{scope.row.reportName}}</div>
                         </template>
                    </el-table-column>
                    <el-table-column prop="reportYear" label="年份" align='center'></el-table-column>
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
                    :total="totalCount">
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
            value:'中华财险',
            totalCount:0
        }
    },
    computed:{
        yearList(){
            let now=new Date().getFullYear();
            let ary=[];
            for(let i=now-1;i>=2015;i--){
                ary.push (i);
            }
            return ary;
        }
    },
    beforeMount(){
        this.year = new Date().getFullYear() - 1;
        this.getTableList()
    },
    methods:{
        getTableList(year){
            const params={
                pageNo:this.currentPage,
                pageSize:10,
                applyObject:'中华财险'
            }
            this.axios.get('pressureTest/pressureTestList',{params}).then((res)=>{
                if(res.code === 200){
                    this.tableData = res.data.pressureList?res.data.pressureList:[];
                    this.totalCount=res.data.totalCount;
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
            let query={type:'3',id:row.id,year:row.reportYear}
            if(row.historyRecordId){query.historyRecordId=row.historyRecordId}
             this.$router.push({name:'addPressureTest',query})
        },
        goEdit(row){
            let query={type:'2',id:row.id,year:row.reportYear}
            if(row.historyRecordId){query.historyRecordId=row.historyRecordId}
            this.$router.push({name:'addPressureTest',query})  
        },
        handleCurrentChange(val) {
            this.currentPage=val;
            this.getTableList()
        },
        handleAdd(){
            this.$router.push({name:'addPressureTest',query:{type:'1'}})    
        },
        handleSearch(){
            this.currentPage = 1;
            this.getTableList()
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