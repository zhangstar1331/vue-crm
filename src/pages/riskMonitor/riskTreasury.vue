<template>
  <div id="cagy-name">
  <!--新建时候弹出的蒙层-->
  <maskble :faShow="faShow" @closeMask = "closeMaskTable"></maskble>	
    <!--基础信息-->
  <div class="render">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>风险监测指标管理</el-breadcrumb-item>
      <el-breadcrumb-item class="txtColor">风险大类库</el-breadcrumb-item>
    </el-breadcrumb>
    <!--风险级别-->
    <div class="box" style="min-height: 250px;">
      <div class="titIcon"><em></em><span style="font-weight: 600;">风险大类库</span></div>
      <div class="cagy-lay">
      	<el-form :inline="true" ref="roleForm">
					<el-form-item label="风险级别">
		        <el-select v-model="value" placeholder="请选择" @change="getRisk">
		          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
		        </el-select>
					</el-form-item>
				</el-form>	
         <el-button type="primary" @click="openMask" class="newBuildBtnee" v-if="btnData.addbtn">新增</el-button>
      </div>
      <!--风险制度列表-->
      <div class="cagy-run">
        <el-table :data="tableData4" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
          <el-table-column  type="index" width="180"  label="风险大类编号" align="center" > </el-table-column>
          <el-table-column  prop="name"  label="风险大类名称" align="center">
	            <template slot-scope="scope">
	              <span :title="scope.row.name" class="textOverFlow">{{ scope.row.name == ''?'-':scope.row.name}}</span>
	            </template>
          </el-table-column>
          <el-table-column  prop="fatherName"  label="风险上级类别" align="center"  >
            <template slot-scope="scope">
              <span :title="scope.row.fatherName" class="textOverFlow">{{ scope.row.fatherName == ''?'--':scope.row.fatherName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="levle" width="150"  label="风险大类级别" align="center"> </el-table-column>
          <el-table-column prop="updateDate"  label="创建时间"  align="center"> </el-table-column>
          <el-table-column prop="hanndle" width="250" label="操作" align="center" v-if="true">
            <template slot-scope="scope">
              <span class="handleBtn detailBtn" @click="jumpDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="btnData.detailbtn">详情 </span>
              <span class="handleBtn moreBtn" @click="editRisk(scope.$index, scope.row)" style="color: #4285F4 ;" v-if="btnData.editbtn">编辑 </span>
              <span class="handleBtn moreBtne" @click="deleteRisk(scope.$index, scope.row)" style="color: red;" v-if="btnData.deletebtn">删除 </span>
              <span class="handleBtn moreBtns" v-if="scope.row.levle != 3&&btnData.plusbtn" @click="addRisk(scope.$index, scope.row)" style="color: #4285F4">添加 </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="prev, pager, next"  prev-text="上一页" next-text="下一页" :current-page.sync="currentPage"  :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
    </div>
  </div>
    <!--风险类别制度表-->
  </div>
</template>

<script>
	import maskble from 'src/components/maskTable/riskMaskTable'
	import qs from 'qs'
  export default {
    name: 'newDetails',
    data () {
      return {
      	noAdd:true,
        totalResults:0,
        faShow:false,
        dialogAddgsVisible:false,
        title:'',
        pageNo:1,
        currentPage:1,
        riskLevel:'',
        options: [{
          value: '',
          label: '全部'
        },{
          value: '1',
          label: '一级风险'
        }, {
          value: '2',
          label: '二级风险'
        }, {
          value: '3',
          label: '三级风险'
        }],
        value: '全部',
        tableData4:[],
        btnData:{   //按钮显示隐藏
			addbtn: false,
			detailbtn: false,
			editbtn: false,
			deletebtn: false,
			plusbtn: false,
		},
      }
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
    components:{
    	maskble
    },
    created(){
    	this.refresh()
    	this.getData(this.$store.state.orgBtnData)
    },
    methods: {
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_ifxdlka')>=0){//新增
            		this.btnData.addbtn = true
            	}else{
            		this.btnData.addbtn = false
            	}
            	if(handleData.indexOf('1_ifxdlkd')>=0){//详情
            		this.btnData.detailbtn = true
            	}else{
            		this.btnData.detailbtn = false
            	}
            	if(handleData.indexOf('1_ifxdlke')>=0){//编辑
            		this.btnData.editbtn = true
            	}else{
            		this.btnData.editbtn = false
            	}
            	if(handleData.indexOf('1_ifxdlkx')>=0){//删除
            		this.btnData.deletebtn = true
            	}else{
            		this.btnData.deletebtn = false
            	}
            	if(handleData.indexOf('1_ifxdlks')>=0){//添加
            		this.btnData.plusbtn = true
            	}else{
            		this.btnData.plusbtn = false
            	}
            }
	    },
      //请求下一页
      handleSizeChange (value) {
        this.pageNo = value;
        this.getLIstInfo(this.riskLevel,value)
      },
      handleCurrentChange (value) {
        this.pageNo = value;
        this.refresh()
      },
      refresh(){
      	this.getLIstInfo(this.riskLevel,this.pageNo)
      },
      closeMaskTable(){
					this.faShow = false;
					this.refresh()
			},
			openMask(){
				sessionStorage.riskStatus = 0;
				this.faShow = true;
			},
			getRisk(val){
				this.pageNo = 1;
				this.currentPage = 1;
				this.riskLevel = val;
				this.getLIstInfo(val,this.pageNo);
			},
			deleteRisk(index,row){
				this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(_ => {
            	this.axios.post('riskkind/bigkindelete',qs.stringify({id:row.id})).then((res)=>{
			      		 	if(res.code == 200){
			      		 		this.$alert("操作成功", '提示', {
						        	confirmButtonText: '确定',
						        	callback:action=>{
						        	this.getLIstInfo(this.riskLevel,this.pageNo)
				          		}
						        });
			      		 	}else{
			      		 		this.$alert(res.data, '提示', {
					        	confirmButtonText: '确定'
					        });
			      		}
						})
          }).catch(_ => {});
			},
			editRisk(index,row){
				sessionStorage.riskStatus = 1;
				sessionStorage.riskId = row.id
				this.faShow = true;
			},
			addRisk(index,row){
				sessionStorage.riskStatus = 2;
				sessionStorage.riskId = row.id
				this.faShow = true;
			},
			jumpDetail(index,row){
				sessionStorage.riskStatus = 3;
				sessionStorage.riskId = row.id
				this.faShow = true;
			},
			getLIstInfo(val,pageNo,pageSize){
				this.axios.post('riskkind/findBigKindList',qs.stringify({'level':val,pageNo:pageNo,pageSize:'10'})).then((res)=>{
						this.tableData4 = res.data.data;
						if(res.data != ""){
							this.totalResults = res.data.totalResults;
						}else{
							this.totalResults = 0
						}
	  		})
			}
    }
  }
</script>

<style  lang="scss">
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  #cagy-name{
  		th{
			    background: #F9F9F9;
			    color: #909399;
			    font-weight: bold;
			}
			.el-table__empty-block{
				background: #fff;
			}
			.txtColor span{
    	  color: #4285F4 !important;
    		font-weight: 700 !important;
		    }
		  .is-link,.el-breadcrumb__inner {
		    color: #909191 !important;
		    font-weight: 700 !important;
			}  
			.handleBtn{
					display: inline-block;
					padding: 0 5px;
			}
			.handleBtn:hover{
					cursor: pointer;
			}
			.el-form-item{
				width: initial;
			}
			.el-form-item__content{
				width: 66%;
			}
			.el-form-item__label{
				padding: 0;
				padding-right: 10px;
			}
			.el-pagination{
					text-align: center;
					margin-top:30px;
			}
			.el-breadcrumb{
				margin-top:0;
				margin-bottom: 10px;
				line-height: 53px;
			}
			.cagy-lay{
				.titText{
					display: inline-block;
					margin-right: 10px;
					font-size: 14px;
				}
				.el-input__inner{
					height: 32px;
				}
				.newBuildBtnee{
					margin-top: -53px;
			    float: right;
			    width: 68px;
			    height: 26px;
			    background: #4285F4;
			    padding: 0;
			    font-size: 12px;
			    a{
			      color: white;
			    }
				}
			}
      .box {
        	min-height: 250px;
        	background: #fff;
        	padding: 16px 16px 30px 16px;
        	-webkit-box-shadow: 4px 2px 6px #888;
        	border-radius: 8px;
	        .titIcon {
	          font-size: 14px;
	          margin-bottom: 30px;
	          em {
	            display: inline-block;
	            width: 2px;
	            height: 14px;
	            background: #4285F4;
	            vertical-align: middle;
	            margin-right: 6px;
	          }
	        }
      }
      .textOverFlow{
				width: 100%;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
  }

</style>
