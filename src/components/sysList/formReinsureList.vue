<template>
    <div id="jzFormList">
        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
            <el-table-column label="再保人集中度报表" align="center">
                <el-table-column prop="" :label="'机构名称：'+orgName+'　　　　　　　单位：万元  (注：数值小数点后保留两位，采取四舍五入。)'" align="left">
                    <el-table-column prop="no" width="80" label="序号" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.no == ""?'--':scope.row.no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reinsurer" label="再保人" align="center">
                        <template slot-scope="scope">
                          <span :title="scope.row.reinsurer" class="textOverFlow">{{scope.row.reinsurer == ""?'--':scope.row.reinsurer}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rate" label="评级" align="center" width="150">
                        <template slot-scope="scope">
                          <span :title="scope.row.rate" class="textOverFlow">{{scope.row.rate == ""?'--':scope.row.rate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rateAgency" label="评级机构" align="center" width="150">
                        <template slot-scope="scope">
                          <span :title="scope.row.rateAgency" class="textOverFlow">{{scope.row.rateAgency == ""?'--':scope.row.rateAgency}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="country" label="国家" align="center" width="120">
                        <template slot-scope="scope">
                          <span :title="scope.row.country" class="textOverFlow">{{scope.row.country == ""?'--':scope.row.country}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="premium" label="期末当年累计再报人项下分出保费" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.premium == ""?'--':scope.row.premium}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sumInsured" label="期末当年累计再报人项下分出保额" align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.sumInsured == ""?'--':scope.row.sumInsured}}</span>
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
        orgName:"",
        tableData:[],
        application:{
          '102':'中华财险',
          '103':'中华人寿',
          '104':'资管中心'
        },
      }
    },
    created(){
        Bus.$off('formFouseDatas')
        Bus.$on('formFouseDatas', (data) => {
          if(data!==undefined){
            this.tableData = []
            this.tableData = data.concentrate == undefined?[]:data.concentrate
            this.orgName = data.applayObject == undefined?[]:this.application[data.applayObject]
          } else{
            this.tableData = []
            this.orgName = []
          }
        })
    },
    methods: {
        
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
    padding-bottom:20px;
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
  } 
</style>
