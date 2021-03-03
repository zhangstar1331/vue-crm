<template>
  <div id="itemDistribute">
	  <div id="main" v-if="isShow" style="width: 800px;height:200px;margin:0 auto;"></div>
	  <ul class="pieTip" v-if="isShow">
  	<li v-for="(item,index) in pieTip" :key="index" :style="{color:pieTip[index].color}">
      	<span :style="{backgroundColor:pieTip[index].color}"></span>
      	{{item.name}}
      </li>
  	</ul>
	  <el-table :data="tableData" v-if="!isShow" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:10px;">
      <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.name" align="center"></el-table-column>    
	  </el-table>
	  <p :class="{tip1:isShow,tip2:!isShow}" v-if="$route.name == 'surplusAssess'">注：依据“剩余风险-缺陷等级”形成该图。</p>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import qs from 'qs'
	import assessResult from 'src/components/riskAssess/assessResult'
	import {stackBar,getData} from 'src/utils/utils.js'
  export default {
  	props:['isShow'],
  	data() {
      return {
        tableData:[],
        departmentId:[],
        tableList:[{
        	name:'部门',
        	prop:'department'
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
   		...mapActions(["setData"]),
   		async initPage(){
   			if(this.$route.name == 'surplusAssess'){//剩余
   				var data = await getData('/rmAssTask/riskAssDepBugLevelNumber',qs.stringify(this.riskAssess.riskDistribute))
   			}else{//固有
   				var data = await getData('/rmAssTask/riskAssDepLevelNumber',qs.stringify(this.riskAssess.riskDistribute))
   			}		
   			this.tableData = []
   			var xData = []
   			var blueData = []
   			var yellowData = []
   			var redData = []
   			this.departmentId = []
   			for(var i = 0; i < data.length; i++){
   				xData.push(data[i].name)
   				this.departmentId.push(data[i].code)
   				blueData.push(data[i].num1)
   				yellowData.push(data[i].num2)
   				redData.push(data[i].num3)
   			}
   			//图表渲染
   			for(var i = 0; i < xData.length; i++){
   				var obj = {}
   				obj.department = xData[i]
   				obj.general = blueData[i]
   				obj.important = yellowData[i]
   				obj.major = redData[i]
   				obj.total = blueData[i] + yellowData[i] + redData[i]
   				this.tableData.push(obj)
   			}
   			this.$nextTick(()=>{
   				stackBar('main',xData,blueData,yellowData,redData,this.$echarts)
   			})
   			//添加点击事件
   			let volume = this.$echarts.init(document.getElementById('main'))
			  var that = this;
				volume.on('click', function (handler){
					that.setData({"riskAssess.reqDetail.depId":that.departmentId[handler.dataIndex]})
					if(that.$route.name == 'surplusAssess'){//剩余
						that.setData({'riskAssess.reqDetail.bugLevel':handler.seriesIndex + 1})
					}else{
						that.setData({'riskAssess.reqDetail.riskLevel':handler.seriesIndex + 1})
					}
   				getData('subrep/getrstdetail',qs.stringify(that.riskAssess.reqDetail)).then((data)=>{
   					if(data){
   						that.$emit('func',{resultFlag:true,data:data.data,totalResults:data.totalResults})
   					}	
   				})
				})
   		}
   	},
   	mounted(){
   		this.initPage()
   		var that = this
	    this.$on('itemDistribute',() => {
	        that.initPage()
	    })//设置接收父组件的方法
   	},
   	computed:{
   		...mapState(['riskAssess'])
   	},
   	watch:{
   		isShow(newVal,oldVal){
   			if(newVal){
   				this.initPage()
   			}
   		}
   	}
	}    
</script>
<style lang="scss">
  	#itemDistribute{
	    .pieTip{
				width:20%;
		    margin:0 auto;
		    span{
		        display: inline-block;
		        width:12px;
		        height:12px;
		        border-radius: 6px;
		        background-color:#FF6363;
		        margin-right: 4px;
		    }
		    display: flex;
		    flex-direction:row;
		    li{
		        width:50%;
		        text-align: center;
		        font-size:12px;
		    }
			}
			.tip1{
				width:70%;
				margin:10px auto 0;
			}
			.tip2{
				width:98%;
				margin:10px auto 0;
			}
    }
</style>
