<template>
    <div id="jzFormList">
  	    <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
            <el-table-column label="投资集中度报表" align="center">
                <el-table-column prop="" label="单位：万元  (注：数值小数点后保留两位，采取四舍五入。)" align="left">
        	          <el-table-column prop="no" width="80" label="排序" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.no == null||scope.row.no == ""?'--':scope.row.no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="客户名称" align="center" width="200">
                        <template slot-scope="scope">
                          <span :title="scope.row.name" class="textOverFlow">{{scope.row.name == null||scope.row.name == ""?'--':scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cusCode" label="客户代码" align="center" width="150">
                        <template slot-scope="scope">
                          <span :title="scope.row.cusCode" class="textOverFlow">{{scope.row.cusCode == null||scope.row.cusCode == ""?'--':scope.row.cusCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="endBalance" label="期末余额（E+F+G+H+I+J+K）" align="center" width="110">
                        <template slot-scope="scope">
                          <span :title="scope.row.endBalance" class="textOverFlow">{{scope.row.endBalance == null||scope.row.endBalance == ""?'--':scope.row.endBalance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="loanBalance" label="贷款余额" align="center" width="100">
                        <template slot-scope="scope">
                          <span :title="scope.row.loanBalance" class="textOverFlow">{{scope.row.loanBalance == null||scope.row.loanBalance == ""?'--':scope.row.loanBalance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bondBalance" label="持有债券余额" align="center" width="100">
                        <template slot-scope="scope">
                          <span>{{scope.row.bondBalance == null||scope.row.bondBalance == ""?'--':scope.row.bondBalance}}</span>
                        </template>
                    </el-table-column>>
                    <el-table-column prop="assetsBalance" label="买入返售资产余额" align="center" width="120">
                        <template slot-scope="scope">
                          <span>{{scope.row.assetsBalance == null||scope.row.assetsBalance == ""?'--':scope.row.assetsBalance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="leaseAssets" label="融资/经营性租赁资产余额" align="center" width="120">
                        <template slot-scope="scope">
                          <span>{{scope.row.leaseAssets == null||scope.row.leaseAssets == ""?'--':scope.row.leaseAssets}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="investmentBalance" label="不良债权投资余额（含应收款）" align="center" width="120">
                        <template slot-scope="scope">
                          <span>{{scope.row.investmentBalance == null||scope.row.investmentBalance == ""?'--':scope.row.investmentBalance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="equityBalance" label="股权投资余额（含抵债股权和债转股）" align="center" width="120">
                        <template slot-scope="scope">
                          <span>{{scope.row.equityBalance == null||scope.row.equityBalance == ""?'--':scope.row.equityBalance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="otherBalance" label="其他融出资金余额" align="center" width="120">
                        <template slot-scope="scope">
                          <span>{{scope.row.otherBalance == null||scope.row.otherBalance == ""?'--':scope.row.otherBalance}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="proName" label="项目名称" align="center" width="300">
                        <template slot-scope="scope">
                          <span :title="scope.row.proName" class="textOverFlow">{{scope.row.proName == null||scope.row.proName == ""?'--':scope.row.proName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="industryInvolved" label="项目标的所属行业" align="center" width="120">
                        <template slot-scope="scope">
                          <span :title="scope.row.industryInvolved" class="textOverFlow">{{scope.row.industryInvolved == null||scope.row.industryInvolved == ""?'--':scope.row.industryInvolved}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rate" label="评级" align="center">
                        <template slot-scope="scope">
                          <span :title="scope.row.rate" class="textOverFlow">{{scope.row.rate == null||scope.row.rate == ""?'--':scope.row.rate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="grossAssets" label="期末投资总额" align="center" width="120">
                        <template slot-scope="scope">
                          <span :title="scope.row.grossAssets" class="textOverFlow">{{scope.row.grossAssets == null||scope.row.grossAssets == ""?'--':scope.row.grossAssets}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table-column>
  	    </el-table>
    </div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import qs from 'qs'
  export default {
  	data() {
      return {
        tableData:[],
      }
    },
    created(){
        Bus.$off('formFouseDatas')
      	Bus.$on('formFouseDatas', (data) => {
            if(data!==undefined){
                this.tableData = [];
                this.tableData = data.concentrateZG == undefined?[]:data.concentrateZG
            } else{
                this.tableData = []
                this.orgName = []
            }
        })
    },
    methods: {
        // 合并最后一行
        arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
          if(this.tableData.length>0){
              if(rowIndex === this.tableData.length-1 && columnIndex == 1){
                  return [1,2]
              }
          }
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
  #jzFormList{
    .el-table__header{
      border-collapse:collapse
    }
    .el-table th{
      border-bottom:1px solid #EBEEF5;
    }
    .el-table--border th,.el-table--border td{
      border-left:none;
      border-right:none
    }
    .is-left .cell{
      text-align:left!important
    }
    table tr:last-child td{
      border-bottom: none
    }
    .el-table::before{
      background-color: transparent!important
    }
    .el-table td .cell,.el-table__empty-text{
      font-weight:normal;
      cursor:pointer
    }
    .textOverFlow{
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
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
    .dealBtn{
        float: right;
        margin-right: 5px;
        width: 68px;
        height: 26px;
        padding: 0;
        font-size: 12px;
    }
    .tip{
      padding:20px 0
    }
  } 
</style>
