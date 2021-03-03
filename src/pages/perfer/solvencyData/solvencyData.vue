<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好管理</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好传导体系</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item class="txtColor">动态偿付能力数据</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main">
            <div class="main-title"><i></i>动态偿付能力数据</div>
            <div class="main-btn">
                <el-button type="primary" class="btn" @click="handleAdd">新增</el-button>
            </div>
            <div class="main-body">
                <el-table :data="tableData" class="main-table" :header-cell-style="{ background: '#f5f7fa'}"> 
                    <el-table-column type="index" label="序号" align='center'></el-table-column>
                    <el-table-column label="动态偿付能力数据" align='center' :show-overflow-tooltip="true">
                         <template slot-scope="scope">
                             <div @click="goDetail(scope.row)" class="row-title">{{scope.row.payAbilityDataName}}</div>
                         </template>
                    </el-table-column>
                    <el-table-column prop="payYear" label="报告年度"  align='center'></el-table-column>
                    <el-table-column prop="creator" label="创建人"  align='center'></el-table-column>
                    <el-table-column label="操作" width="220" align='center'>
                        <template slot-scope="scope">
                            <el-button @click="goDetail(scope.row)" type="text" size="small" class="btn">详情</el-button>
                            <el-button @click="goEdit(scope.row)"  type="text" size="small" class="btn">维护</el-button>
                            <el-button @click="loadFile(scope.row)" type="text" size="small" class="btn">批量导出</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    prev-text="上一页"
                    next-text="下一页"
                    :prev-click="handleCurrentChange"
                    :next-click="handleCurrentChange"
                    :current-page="currentPage"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
    
</template>

<script>
import qs from 'qs'
import { fileDownload } from 'src/utils/utils.js'
export default {
    data() {
        return {
            tableData:[],
            isDetail:0,
            isEdit:false,
            currentPage:1,
            totalCount:0
        }
    },
    beforeMount(){
        this.getTableList();
    },
    methods:{
        getTableList(){
            const params={
                pageNo:this.currentPage,
                pageSize:10
            }
            this.axios.get('riskPayability/queryList',{params}).then((res)=>{
                if(res.code == 200){
                    this.tableData = res.data.data;
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
            this.isDetail = 1;
            this.payYear = row.payYear;
            this.$router.push({
                name:'addSolvencyData',
                query:{
                    isDetail:this.isDetail,
                    year:row.payYear
                }
            });
        },
        goEdit(row){
            this.payYear = row.payYear;
            this.$router.push({
                name:'addSolvencyData',
                query:{
                    year:row.payYear
                }
            });
        },
        handleCurrentChange(val) {
            this.currentPage=val;
            this.getTableList()
        },
        handleBack(){
        },
        loadFile(row){
            let path = "/riskPayability/download?year="+row.payYear+"&name="+encodeURIComponent(row.payAbilityDataName)
		  	this.axios.post(path,qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
				fileDownload(res, row.payAbilityDataName+".xlsx");
			})
        },
        handleAdd(){
            this.$router.push({
                name:'addSolvencyData'
            });
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
        margin-bottom:20px;
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
    &-btn{
        display:flex;
        justify-content:flex-end;
        margin-bottom: 20px;
        .btn{
            width: 68px;
            height: 26px;
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