<template>
  <div id="assessDetail">
  	<div class="btnBox" style="text-align:right;" v-if="backShow">
    	<el-button v-if="" type="primary" class="saveBtn" @click="back">返回</el-button>
  	</div>
		<el-table :data="tableData" max-height="tableHeight" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
      <el-table-column  type="index"  label="序号" align="center" > </el-table-column>
      <el-table-column  prop="department" width="150" label="责任部门" align="center"></el-table-column>
      <el-table-column  prop=""  label="流程名称" align="center">
      	<el-table-column  prop="firstLevel" width="120" label="一级流程名称" align="center"></el-table-column>
      	<el-table-column  prop="secondLevel" width="120" label="二级流程名称" align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop=""  label="固有风险评估" align="center">
      	<el-table-column prop="riskPointNo" width="120" label="风险点编号" align="center"></el-table-column>
      	<el-table-column prop="riskPointDesc" width="150" label="风险点描述" :render-header="renderTip" align="center" show-overflow-tooltip></el-table-column>
      	<el-table-column prop="riskRate" width="200" label="风险发生的可能性" :render-header="renderTip" align="center">
      		<template slot-scope="scope">
      			<div>
      				<span v-if="scope.row.riskRate == 1">1-每5年或更低频率</span>
      				<span v-if="scope.row.riskRate == 2">2-每年</span>
      				<span v-if="scope.row.riskRate == 3">3-每季度</span>
      				<span v-if="scope.row.riskRate == 4">4-每月或更高频率</span>
      			</div>
      		</template>
      	</el-table-column>
      	<el-table-column prop="riskEffect" width="220" label="风险发生的影响程度" :render-header="renderTip" align="center">
      		<template slot-scope="scope">
      			<div>
      				<span v-if="scope.row.riskEffect == 1">1-极小</span>
      				<span v-if="scope.row.riskEffect == 2">2-较小</span>
      				<span v-if="scope.row.riskEffect == 3">3-中等</span>
      				<span v-if="scope.row.riskEffect == 4">4-严重</span>
      			</div>
      		</template>
      	</el-table-column>
      	<el-table-column prop="theRiskLevel" width="120" label="固有风险等级（自动计算）" align="center">
      		<template slot-scope="scope">
      			<div :class="{'red':scope.row.theRiskLevel==1,'yellow':scope.row.theRiskLevel==2,'blue':scope.row.theRiskLevel==3}" style="width:100%;height:100%;">
      				<span v-if="scope.row.theRiskLevel == 1">低风险</span>
      				<span v-if="scope.row.theRiskLevel == 2">中风险</span>
      				<span v-if="scope.row.theRiskLevel == 3">高风险</span>
      			</div>
      		</template>
      	</el-table-column>
      </el-table-column>
      <el-table-column prop="" label="现有控制活动"  align="center"> 
      	<el-table-column prop="ctrlPointNo" width="120" label="控制点编号"  align="center"> </el-table-column>
      	<el-table-column prop="ctrlPointDesc" width="120" label="控制点描述"  align="center" show-overflow-tooltip> </el-table-column>
      	<el-table-column prop="ctrlRate" width="180" label="控制频率"  align="center"> 
      		<template slot-scope="scope">
      			<div>
      				<span v-if="scope.row.ctrlRate == 1">每周一次或更高频率</span>
          		<span v-if="scope.row.ctrlRate == 2">每月一次</span>
          		<span v-if="scope.row.ctrlRate == 3">每季度一次</span>
          		<span v-if="scope.row.ctrlRate == 4">每半年一次</span>
          		<span v-if="scope.row.ctrlRate == 5">每年一次或更低频率</span>
          		<span v-if="scope.row.ctrlRate == 6">不定期</span>
      			</div>
      		</template>
      	</el-table-column>
      	<el-table-column prop="ctrlType" width="180" label="控制方式（人工/人工依赖系统/系统控制）"  align="center"> 
      		<template slot-scope="scope">
      			<div>
      				<span v-if="scope.row.ctrlType == 1">人工控制</span>
      				<span v-if="scope.row.ctrlType == 2">人工依赖系统控制</span>
      				<span v-if="scope.row.ctrlType == 3">系统控制</span>
      			</div>
      		</template>
      	</el-table-column>
      </el-table-column>
      <el-table-column prop=""  label="剩余风险"  align="center"> 
      	<el-table-column prop="hasBug" width="110"  label="是否存在缺陷"  align="center">
      		<template slot-scope="scope">
      			<div>
      				<span v-if="scope.row.hasBug == 1">是</span>
      				<span v-if="scope.row.hasBug == 0">否</span>
      			</div>
      		</template>
      	</el-table-column>
      	<el-table-column prop="bugLevel" width="130" label="缺陷等级"  align="center">
      		<template slot-scope="scope">
      			<div :class="{'red':scope.row.bugLevel==1,'yellow':scope.row.bugLevel==2,'blue':scope.row.bugLevel==3}" style="width:100%;height:100%;">
      				<span v-if="scope.row.bugLevel == 1">低风险</span>
      				<span v-if="scope.row.bugLevel == 2">中风险</span>
      				<span v-if="scope.row.bugLevel == 3">高风险</span>
      			</div>
      		</template>
      	</el-table-column>
      	<el-table-column prop="bugType" width="130" label="缺陷类型"  align="center">
      		<template slot-scope="scope">
      			<div>
      				<span v-if="scope.row.bugType == 1">设计缺陷</span>
      				<span v-if="scope.row.bugType == 2">运行缺陷</span>
      			</div>
      		</template>
      	</el-table-column>
      </el-table-column>
      <el-table-column prop="improvementPlan" width="250" label="整改计划（缺陷等级为中、高的应制定整改计划）"  align="center">
      	<template slot-scope="scope">
      		<div v-if="scope.row.bugLevel>1">
      			<div v-if="scope.row.dealBugPlan">
      				<p class="improvementPlan">整改措施：{{scope.row.dealBugPlan}}</p>
	      			<p class="improvementPlan">完成时间：{{scope.row.overDate}}</p>
	      			<p class="improvementPlan">责任人：{{scope.row.dutyer}}</p>
      			</div>
      		</div>
      	</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getData} from 'src/utils/utils.js'
  export default {
  	props:['tableData'],
  	data() {
      return {
      	tableHeight: 0,
      	backShow:false
			}
   	},
   	mounted(){
   		this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 220;
      })
   	},
   	methods:{
   		initPage(){
   			if(this.$route.name == 'taskDistribute'){
   				this.backShow = true;
   			}
   		},
			back(){
				this.$emit('closeBack')
			},
   		renderTip (h,{column}) {
   			let propMessage = ''
   			if(column.label=="风险点描述"){
   				propMessage = "名词解释：<br>请评估人员结合被评估对象的主要职责及内控手册所列示的风险点描述，对风险点进行更新；<br>说明：每次评估前更新此风险点，更新方式：<br>（1）通过表单新增风险点或修改已有风险点<br>（2）通过流程图新增风险点或修改已有风险点"
   			}
   			if(column.label=="风险发生的可能性"){
   				propMessage = "名词解释：<br>* 风险发生的可能性：是指风险事件多久发生一次或一定期间内的发生概率。<br>在下拉菜单中选择，包括：每10年或更低频率、每5年、每年、每季度、每月或更高；"
   			}
   			if(column.label=="风险发生的影响程度"){
   				propMessage = "名词解释<br>*在下拉菜单中选择，包括：极小、较小、中等、严重；<br>影响程度定义：<br>极小：指无财产和声誉损失，仅对日常工作开展有轻微影响<br>较小：指有轻微财产损失，但是在公司可接受范围内；或者，在公司内外部传播开，造成内部员工的负面情绪或外部的负面宣传报道；或者，影响日常工作，导致部分工作不能正常开展<br>中等：指有较大财产损失，达到公司责任追究金额标准；或者，被监管机构处罚，或被主流媒体进行负面报道；或者，导致较大范围的日常工作不能正常开展<br>严重：指财产损失严重影响公司利润；或者，被监管机构多次处罚，或已经丧失部分社会公信力；或者，公司日常工作较短时间内处于停滞状态<br>巨灾：指公司严重亏损，或被监管机构责令停业整顿，或完全丧失社会公信力，或公司面临破产"
   			}
			  return h(
			    'div',{
			      style:'display:flex;margin:auto;'
			    },
			    [
			    	h('gl-prompt-message', {
			        props: {messages: propMessage}
			      }),
			      h('span', column.label)
			    ]
			  );
			}
   	},
   	computed:{
			checkBr(){
				return (data)=>{
					var data = data.replace(/\<br\>/g,'\n')
					return data
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
  #assessDetail{
  	padding-bottom: 50px;
		.btnBox{
			margin-top: 50px;
			text-align: center;
			button{
				width: 68px;
				height: 26px;
				line-height: 0;
				font-size: 12px;
			}
		}	
		th{
			background: #F9F9F9;
		    color: #909399;
		    font-weight: bold;
		}
		::-webkit-scrollbar  
		{   width: 11px;
		    height: 14px;  /*滚动条高度*/
		} 
		td{
			border: none;
		}
		.el-breadcrumb{
			margin-bottom: 30px;
			margin-top: 20px;
		}
		.el-tabs__content{
			-webkit-box-shadow: 1px 0px 6px #888;
			border-radius: 8px;
		}
		.el-table__empty-block{
			background: #fff;
		}
    .el-pagination{
    	margin-top: 30px;
    }
    .red{
    	background:#4285F4;
    	color: #fff;
    }
    .yellow{
    	background:#FFEB5B;
    	color: #fff;
    }
    .blue{
    	background:#FF6363;
    	color: #fff;
    }
    .wgTxtColor span{
	    	color: rgb(144, 145, 145) !important;
	    	font-weight: 700;
	    }
    .improvementPlan{
    	text-align:left!important
    }
    .improvementPlan:nth-child(1){
    	word-break:keep-all;   
	    white-space:nowrap;  
	    overflow:hidden;      
	    text-overflow:ellipsis;
    }
  }
</style>
