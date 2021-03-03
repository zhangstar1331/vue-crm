<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好管理</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好传导体系</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item class="txtColor">风险偏好传导体系展现详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main" v-if="!isShowDetail">
            <div class="main-title"><i></i>风险偏好传导体系展现</div>
            <div class="main-header">
              <div class="main-search">
                <el-form :inline="true" size="small">
                  <el-form-item label="年份：" style="margin-bottom:0">
                      <el-select v-model="year" placeholder="请选择" style="width:120px;" @change="handleChange">
                          <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="适用对象：" style="margin-left:20px;margin-bottom:0">
                      <el-select v-model="value" placeholder="请选择" style="width:120px;">
                          <el-option label="中华财险" value="中华财险"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="偿付能力充足率（风险偏好）：" style="margin-left:20px;margin-bottom:0">
                      <el-input v-model="abilityPayRate" :disabled="true" style="width:120px;">
                          <template slot="append">%</template>
                      </el-input>
                      <!-- <div style="width:120px;">{{abilityPayRate}}<template v-if="abilityPayRate!==''">%</template></div> -->
                  </el-form-item>
                  <el-form-item label="货币单位：" style="margin-left:20px;margin-bottom:0">
                      <el-select v-model="unit" placeholder="请选择" style="width:120px;">
                          <el-option label="元" value="元"></el-option>
                          <el-option label="万元" value="万元"></el-option>
                          <el-option label="亿元" value="亿元"></el-option>
                      </el-select>
                  </el-form-item>
                </el-form>
                <div class="main-btn" style="margin-left:20px"> 
                  <el-button type="primary" class="btn" @click="handleSearch">查询</el-button>
                </div>
              </div>
            </div>
            
            <div class="main-body">
               <el-tree
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                :expand-on-click-node="false"
                default-expand-all
                @node-click="handleNodeClick"
                ref="tree">
                <div slot-scope="{ node, data }" style="overflow:hidden;text-overflow:ellipsis">
                    {{node.label}}
                </div>
              </el-tree>
            </div>
        </div>
        <riskTypeDetail v-else :riskType="riskName" :year="year" :unit="unit" @handleBack="handleBack"></riskTypeDetail>
    </div>
    
</template>

<script>
import riskTypeDetail from './src/riskTypeDetail';
import {fomatFloat, numFormat} from 'src/utils/utils.js'
// function keepTwoDecimalFull(num) {
//    var result = parseFloat(num);
//    if (isNaN(result)) {
//      return num;
//    }
//    result = Math.round(num * 100) / 100;
//    var s_x = result.toString();
//    var pos_decimal = s_x.indexOf('.');
//    if (pos_decimal < 0) {
//      pos_decimal = s_x.length;
//      s_x += '.';
//    }
//    while (s_x.length <= pos_decimal + 2) {
//      s_x += '0';
//    }
//    return comma(s_x);
// }
// function comma(num) {
//     var source = String(num).split(".");//按小数点分成2部分
//         source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");//只将整数部分进行都好分割
//     return source.join(".");//再将小数部分合并进来
// }
export default {
    components:{riskTypeDetail},
    data() {
        return {
            year:'',
            value:'中华财险',
            abilityPayRate:'',
            unit:'元',
            treeData:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            isShowDetail:false,
            riskName:''
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
      this.getRiskSysShow();
    },
    methods:{       
        handleSearch(){
          this.treeData=[];
          this.getRiskSysShow();
        },
        getRiskSysShow(){
            let params={
                year:this.year,
                applyObject:'中华财险',
                unit:this.unit
            }
            this.axios.get('riskPrefModel/riskSysShow',{ params })
            .then(res=>{
                if(res.code===200){
                    this.abilityPayRate=numFormat(fomatFloat(res.data.abilityPayRate,2)?fomatFloat(res.data.abilityPayRate,2):0);
                    let riskTypeList=res.data.riskTypeList;
                    let treeData=[];
                    riskTypeList.forEach(item => {
                      item.label=item.riskName;
                      if(item.riskLimit){
                          if(item.riskName==='操作风险'||item.riskName==='声誉风险'||item.riskName==='战略风险'||item.riskName==='流动性风险'){
                              item.label=`${item.label}: ${item.riskLimit}`
                          }else{
                              item.label=`${item.label}: ${numFormat(fomatFloat(item.riskLimit,2)?fomatFloat(item.riskLimit,2):0)}`
                          }
                        
                      } 
                      if(item.parentId==='0'){
                          treeData.push(item)
                      }
                      let parent=riskTypeList.find(ele=>ele.id===item.parentId);
                      if(parent){
                          if(parent.children){
                              parent.children.push(item)
                          }else{
                                parent.children=[]
                              parent.children.push(item)
                          }
                      }
                    });
                    this.treeData=treeData;
                }else if(res.code===802){

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
        handleNodeClick(node){
          this.isShowDetail=true;
          this.riskName=node.riskName
        },
        handleBack(){
          this.isShowDetail=false;
        },
        handleChange(){
            this.abilityPayRate='';
            this.unit='元';
        }
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
        .line{
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
}
/deep/ .el-tree-node__label{
  font-size: 18px;
}
/deep/ .el-tree-node__content{
  height:30px;
}
/deep/ .el-input-group__append{
    padding:0 5px;
    background-color: #F5F7FA;
    color: #909399;
}

</style>