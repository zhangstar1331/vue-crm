<template>
  <div id="riskLevel">
	  <el-table :data="riskPossible" @cell-click="getDetail" :cell-class-name="addClass" :span-method="spanMethod" style="width: 100%;border: 1px solid #E9E9E9;margin-top:10px;">
      <el-table-column prop="frequency" width="30" label="" align="center">
      	<template slot-scope="scope"> 
        	<div style="text-align:center;font-size: 12px;">
			    	风险发生的可能性
		    	</div>
      	</template>
      </el-table-column>
      <el-table-column prop="" label="固有风险分布" align="center">
      	<template slot-scope="scope"> 
        	<div style="text-align: left;font-size: 12px;">
			    	{{frequency[scope.$index]}}
		    	</div>
      	</template>
      </el-table-column>
      <el-table-column prop="" label="风险发生的影响程度" align="center">
      	<el-table-column prop="mini" label="1-极小" align="center" :render-header="renderTip"></el-table-column>
      	<el-table-column prop="min" label="2-较小" align="center" :render-header="renderTip"></el-table-column>
      	<el-table-column prop="middle" label="3-中等" align="center" :render-header="renderTip"></el-table-column>
      	<el-table-column prop="max" label="4-严重" align="center" :render-header="renderTip"></el-table-column>
      </el-table-column>   
	  </el-table>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	import assessResult from 'src/components/riskAssess/assessResult'
	import {pie,getData} from 'src/utils/utils.js'
  export default {
  	props:['isShow'],
  	data() {
      return {
      	frequency:['4-每月或更高频率','3-每季度','2-每年','1-每5年或更低频率'],
        riskPossible:[]
			}
   	},
   	methods:{
   		...mapActions(['setData']),
   		async initPage(){
   			let data = await getData('/rmAssTask/riskAssRateEffNumber',qs.stringify(this.riskAssess.riskDistribute))
   			this.riskPossible = []
   			for(var i = 4; i >= 1; i--){
   				var obj = {
	        	frequency:'',
	        	mini:data['r'+i].e1,
	        	min:data['r'+i].e2,
	        	middle:data['r'+i].e3,
	        	max:data['r'+i].e4
	        }
   				this.riskPossible.push(obj)
   			}
   		},
   		getDetail(row,column,cell,event){
   			if(column.index>1){
   				this.setData({"riskAssess.reqDetail.riskRate":(4 - row.index)})
					this.setData({"riskAssess.reqDetail.riskEffect":(column.index - 1)})
   				getData('subrep/getrstdetail',qs.stringify(this.riskAssess.reqDetail)).then((data)=>{
   					if(data){
   						this.$emit('func',{resultFlag:true,data:data.data,totalResults:data.totalResults})
   					}	
   				})
   			}
   		},
   		spanMethod({row, column, rowIndex, columnIndex}){
				if(columnIndex === 0){
  				if (rowIndex === 0) {
	  				var arr = [4,0,0,0]
	  				const _row_1 = arr[rowIndex];
	          const _col_1 = _row_1 > 0 ? 1 : 0;
	  				return {
		  				rowspan: _row_1,
		        	colspan: _col_1
		  			}
  				}else{
  					return {
  						rowspan: 0,
		        	colspan: 0
  					}
  				}
  			}
  		},
  		addClass({row, column, rowIndex, columnIndex}){
  			//给行列索引赋值,用于单元格点击
	      row.index=rowIndex;
	      column.index=columnIndex;
	      
  			if(columnIndex===2){
  					return 'blue';
  			}
  			if(columnIndex===3){
  				if(rowIndex<2){
  					return 'yellow';
  				}
  			}
  			if(columnIndex===3){
  				if(rowIndex>1){
  					return 'blue';
  				}
  			}
  			if(columnIndex===4){
  				if(rowIndex===0){
  					return 'red';
  				}
  			}
  			if(columnIndex===4){
  				if(rowIndex>0&&rowIndex<3){
  					return 'yellow';
  				}
  			}
  			if(columnIndex===4){
  				if(rowIndex===3){
  					return 'blue';
  				}
  			}
  			if(columnIndex===5){
  				if(rowIndex<2){
  					return 'red';
  				}
  			}
  			if(columnIndex===5){
  				if(rowIndex===2){
  					return 'yellow';
  				}
  			}
  			if(columnIndex===5){
  				if(rowIndex===3){
  					return 'blue';
  				}
  			}
  		},
  		renderTip (h,{column}) {
   			let propMessage = ''
   			if(column.label=="1-极小"){
   				propMessage = "极小：指无财产和声誉损失，仅对日常工作开展有轻微影响"
   			}
   			if(column.label=="2-较小"){
   				propMessage = "较小：指有轻微财产损失，但是在公司可接受范围内；或者，在公司内外部传播开，造成内部员工的负面情绪或外部的负面宣传报道；或者，影响日常工作，导致部分工作不能正常开展"
   			}
   			if(column.label=="3-中等"){
   				propMessage = "中等：指有较大财产损失，达到公司责任追究金额标准；或者，被监管机构处罚，或被主流媒体进行负面报道；或者，导致较大范围的日常工作不能正常开展"
   			}
   			if(column.label=="4-严重"){
   				propMessage = "严重：指财产损失严重影响公司利润；或者，被监管机构多次处罚，或已经丧失部分社会公信力；或者，公司日常工作较短时间内处于停滞状态"
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
   	mounted(){
   		this.initPage()
   		var that = this
	    this.$on('riskLevel',() => {
	        that.initPage()
	    })//设置接收父组件的方法
   	},
   	computed:{
   		...mapState(['riskAssess'])
   	}
	}    
</script>
<style lang="scss">
  	#riskLevel{
  		.blue{
	    	background:#4285F4;
	    	cursor:pointer;
	    }
	    .yellow{
	    	background:#FFEB5B;
	    	cursor:pointer;
	    }
	    .red{
	    	background:#FF6363;
	    	cursor:pointer;
	    }
    }
</style>
