<template>
  	<div id="rybThird">
	    <!--红黄蓝分布饼图-->
		<div id="main" style="width:150px;height:150px;margin:0 auto;"></div>
		<el-table v-if="tableData.length" :height="tableHeight" :data="tableData" :header-cell-style="{background:'#1D3270',color:'#FFF',borderBottom:'1px solid #546DBB'}" :cell-style="{background:'#172758',color:'#FFF',borderBottom:'1px solid #546DBB'}" style="width:100%;overflow-y:auto;margin:0 auto 10px;border: 1px solid #546DBB;border-bottom: none;cursor:pointer;">
	        <el-table-column prop="code" width="100" label="编号" align="center"></el-table-column>
	        <el-table-column prop="name" label="指标名称" align="center" width="200"></el-table-column>
	        <el-table-column prop="catName" label="风险分类" align="center">
	    		<template slot-scope="scope">
	              <span>{{scope.row.catName == null?'--':scope.row.catName}}</span>
	            </template>
	        </el-table-column>
	        <el-table-column prop="level" label="指标等级" align="center" width="120"> 
	        	<template slot-scope="scope">
	              <span>{{scope.row.level == '1'?'一类':'二类'}}</span>
	            </template>
	        </el-table-column>
	          <el-table-column prop="defins" label="指标定义及口径" align="center" width="250">
	          	<template slot-scope="scope">
	              <span :title="checkBr(scope.row.defins)">{{scope.row.defins == null?'--':checkBr(scope.row.defins)}}</span>
	            </template>
	        </el-table-column>
	        <el-table-column prop="bluev" label="指标阈值（蓝）" align="center" width="120"> </el-table-column>
	        <el-table-column prop="yellowv" label="指标阈值（黄）" align="center" width="120"> </el-table-column>
	        <el-table-column prop="redv" label="指标阈值（红）" align="center" width="120"> </el-table-column>
	        <el-table-column prop="value" label="当期指标值" width="200" align="center"> 
	          	<template slot-scope="scope">
	          		<div :class="{'red':scope.row.rybStatus == 1,'yellow':scope.row.rybStatus == 2,'blue':scope.row.rybStatus == 3}">
	            		<p v-for="(item,index) in JSON.parse(scope.row.value)" :key="index">{{item}}</p>
	            	</div>
	            </template>
	        </el-table-column>
	        <el-table-column prop="compv" label="同比" align="center">
	          	<template slot-scope="scope">
	              <p v-for="(item,index) in JSON.parse(scope.row.compv)" :key="index">{{item.value}} <em v-if="item.scope == 1" style="font-style: normal;">↑</em> <em v-if="item.scope == 0" style="font-style: normal;">↓</em> </p>
	            </template>
	        </el-table-column>
	        <el-table-column prop="momv" label="环比" align="center"> 
	          	<template slot-scope="scope">
	              <p v-for="(item,index) in JSON.parse(scope.row.momv)" :key="index">{{item.value}} <em v-if="item.scope == 1" style="font-style: normal;">↑</em> <em v-if="item.scope == 0" style="font-style: normal;">↓</em> </p>
	            </template>
	        </el-table-column>
	        <!--<el-table-column prop="hanndle" label="操作" align="center" width="100">
	            <template slot-scope="scope">
	              <span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;">详情</span>
	            </template>
	        </el-table-column>-->
	  	</el-table>
	  	<el-pagination background v-if="tableData.length" layout="prev, pager, next" :page-size.sync="pageSize" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>  
  	</div>
</template>
<script>
	import {pie} from 'src/utils/utils.js'
	import echarts from 'echarts'
	import qs from 'qs'
  	export default {
  		props:['message'],
  		data(){
  			return {
  				tableHeight:"100%",
  				tableData:[],
  				currentPage:1,
  				totalResults:0,
  				checkData:{},
  				level:0,
  				rybStatus:0,
  				pageSize:5,
  				pieTip:[{
		  			name:'蓝-一类',
		  			color:'#3E82F7'
		  		},{
		  			name:'蓝-二类',
		  			color:'#31AAFA'
		  		},{
		  			name:'黄-一类',
		  			color:'#FFD824'
		  		},{
		  			name:'黄-二类',
		  			color:'#FF954D'
		  		},{
		  			name:'红-一类',
		  			color:'#FF6363'
		  		},{
		  			name:'红-二类',
		  			color:'#FF60AC'
		  		}]
  			}
  		},
  		mounted(){
  			this.tableData = this.message.thirdContent.instats
  			this.totalResults = this.message.thirdContent.total
  			this.level = this.message.level
  			this.rybStatus = this.message.rybStatus
  			this.checkData = {
				objId:this.message.secondContent[this.message.thirdIndex].objId,
				level:this.level,
				rybStatus:this.rybStatus,
				pageNum:this.currentPage,
				pageSize:5
			}
			this.initPage()
  		},
  		computed:{
  			checkBr(){
  				return (data)=>{
  					var data = data.replace(/\<br\>/g,'\n')
  					return data
  				}
  			}
  		},
  		methods:{
  			initPage(){
  				var data = []
        		var color = []
        		for(let j = 0; j < this.message.secondContent[this.message.thirdIndex].pics.length-1; j++){
        			if(this.message.secondContent[this.message.thirdIndex].pics[j].color == 1){//红
        				color.push("#FF6363","#FF60AC")
        			}
        			if(this.message.secondContent[this.message.thirdIndex].pics[j].color == 2){//黄
        				color.push("#FFD824","#FF954D")
        			}
        			if(this.message.secondContent[this.message.thirdIndex].pics[j].color == 3){//蓝
        				color.push("#3E82F7","#31AAFA")
        			}
        			data.push(this.message.secondContent[this.message.thirdIndex].pics[j].lv1,this.message.secondContent[this.message.thirdIndex].pics[j].lv2)
        		}
	            pie('main',color,data,this.pieTip,this.$echarts) 
            	/*
			    * Echarts节点添加点击事件
			    * */
			  	let volume = this.$echarts.init(document.getElementById('main'))
			  	var that = this;
				volume.on('click', function (handler){
					that.checkData.level = handler.dataIndex % 2 + 1
					that.checkData.rybStatus = handler.dataIndex/2<1?3:handler.dataIndex/2<2?2:1
					that.checkData.pageNum = 1;
					that.updateTable(that.checkData)
				})
  			},
  			updateTable(obj){
  				this.axios.post('/rmIndStass/indDashBoardRybList',qs.stringify(obj)).then((res)=>{
					if(res.code == 200){
						this.message.thirdContent = res.data
		    			this.tableData = res.data.instats
		    			this.totalResults = res.data.total
					}else{
						this.$alert(res.message)
					}
				})
  			},
  			handleSizeChange (value) {
		        this.checkData.pageNum = value;
		        this.updateTable(this.checkData)
		    },
			handleCurrentChange (value) {
			    this.checkData.pageNum = value;
			    this.updateTable(this.checkData)
			}
  		}
    }
</script>
<style lang="scss"> 
#rybThird{
	width:100%;
	.el-table{
		max-height:280px;
		.el-table__body{
		    height: 100%;
		    .tbody{
		    	height: 100%;     
		    }
		}
	}	 
	.yellow{
  		background: #FFD824;
  	}
  	.blue{
  		background: #4285F4;
  	}
  	.red{
  		background: #FF6363;
  	}
	.el-pagination{
		text-align: center;
		border: 0;
	}
} 
</style>
