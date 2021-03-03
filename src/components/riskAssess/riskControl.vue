<template>
  <div id="riskControl">
	  <el-table :data="tableData" :height="tableHeight" v-if="isShow" @cell-click="getDetail" :cell-class-name="addClass" :span-method="spanMethod" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:10px;">
      <el-table-column type="index" label="编号" align="center" width="40"></el-table-column>
      <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.name" align="center"></el-table-column>    
	  </el-table>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	import assessResult from 'src/components/riskAssess/assessResult'
	import {getData} from 'src/utils/utils.js'
  export default {
  	props:['isShow'],
  	data() {
      return {
        tableData:[],
        tableHeight:"640px",
        tableList:[{
        	name:'部门',
        	prop:'department'
        },{
        	name:'类别',
        	prop:'type'
        },{
        	name:'低风险',
        	prop:'general'
        },{
        	name:'中风险',
        	prop:'important'
        },{
        	name:'高风险',
        	prop:'major'
        },{
        	name:'合计',
        	prop:'total'
        }],
        color:['#4285F4', '#FFEB5B', '#FF6363'],
        pieTip:[{
        	name:'低风险',
        	color:'#4285F4'
        },{
        	name:'中风险',
        	color:'#FFEB5B'
        },{
        	name:'高风险',
        	color:'#FF6363'
        }]
			}
   	},
   	methods:{
   		...mapActions(['setData']),
   		async initPage(){
   			let data = await getData('/rmAssTask/riskAssCompLevelNumber',qs.stringify(this.riskAssess.riskDistribute))
   			this.tableData = []
   			//图表渲染
   			for(var i = 0; i < data.length * 2; i++){
   				var obj = {}
   				obj.code = data[parseInt(i/2)].code
   				obj.department = data[parseInt(i/2)].name
   				if(i % 2 == 0){
   					obj.type="风险点数量（个）"
	   				obj.general = data[parseInt(i/2)].risk.num1
	   				obj.important = data[parseInt(i/2)].risk.num2
	   				obj.major = data[parseInt(i/2)].risk.num3
	   				obj.total = data[parseInt(i/2)].risk.allNum
   				}else{
   					obj.type="控制点数量（个）"
   					obj.general = data[parseInt(i/2)].cont.num1
	   				obj.important = data[parseInt(i/2)].cont.num2
	   				obj.major = data[parseInt(i/2)].cont.num3
	   				obj.total = data[parseInt(i/2)].cont.allNum
   				}
	   			this.tableData.push(obj)
   			}
   		},
   		spanMethod({row, column, rowIndex, columnIndex}){
				if(columnIndex === 1){
  				if (rowIndex % 2 === 0) {
	  				return {
		  				rowspan: 2,
		        	colspan: 1
		  			}
  				}else{
  					return {
  						rowspan: 0,
		        	colspan: 0
  					}
  				}
  			}
  		},
  		getDetail(row,column,cell,event){
   			if(column.index>2){
   				if(column.index!=6){
   					this.setData({"riskAssess.reqDetail.riskLevel":(column.index - 2)})
   				}else{
   					this.setData({"riskAssess.reqDetail.riskLevel":null})
   				}
   				this.setData({"riskAssess.reqDetail.depId":row.code})
   				getData('subrep/getrstdetail',qs.stringify(this.riskAssess.reqDetail)).then((data)=>{
   					if(data){
   						this.tableHeight = "300px";
   						this.$emit('func',{resultFlag:true,data:data.data,totalResults:data.totalResults})
   					}	
   				})
   			}
   		},
   		addClass({row, column, rowIndex, columnIndex}){
  			//给行列索引赋值,用于单元格点击
	      row.index=rowIndex;
	      column.index=columnIndex;
	      if(columnIndex>2){
	      	if(rowIndex>=0){
  					return 'hove';
  				}
  			}
	    }
   	},
   	mounted(){
   		this.initPage()
   		var that = this
	    this.$on('riskControl',() => {
	        that.initPage()
	    })//设置接收父组件的方法
   	},
   	computed:{
   		...mapState(['riskAssess'])
   	}
	}    
</script>
<style lang="scss">
	#riskControl{
		.hove{
	    cursor:pointer;
		}	
	}
</style>
