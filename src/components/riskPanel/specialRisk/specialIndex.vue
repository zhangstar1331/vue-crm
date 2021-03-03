<template>
    <div class="specialIndex">
      <div class="lineContent">
        <p class="lineDw">%</p>
        <div id="specialLine"></div>
      </div>
      <p class="tbDw">单位：亿元</p>
      <div class="riskTable" style="margin-top: 20px">
        <el-table
          :data='tableData'>
          <el-table-column
            v-for="(item,index) in tableHead"
            :key="index"
            align="center"
            :prop="item.prop"
            :label="item.label">
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
	import {mapState} from 'vuex'
  	import {line} from 'src/utils/utils.js'
  	import qs from 'qs'
    export default {
        name: "specialIndex",
        data(){
          return{
            tableHead:[{
              prop:'name',
              label:'指标名称'
            }],
            tableData:[],
            echarsObj:null,
          }
        },
        mounted(){
          this.$nextTick(()=>{
            this.addLine()
            this.echarsObj.on('click',this.lineClick)
            this.initData()
          })
        },
        computed:{
        	...mapState(['meterData'])
        },
      	methods:{
      		initData(){
      			//初始化表格数据
      			var listTitle = ['15大客户期末余额','期末余额合计','占比']
      			var startStr = ['v','t','r']
      			var meter = this.meterData['91'][0].times
      			for(var i = 0; i < meter.length; i++){
      				this.tableHead.push({
		              label:meter[i],
		              prop:meter[i]
		            })
      			}
      			for(var j = 0; j < 3; j++){
  					var obj = {}
  					obj['name'] = listTitle[j]
  					for(var i = 0; i < meter.length; i++){
	      				obj[meter[i]] = this.meterData['91'][0][startStr[j] + meter[i]]?this.meterData['91'][0][startStr[j] + meter[i]]:'--'
	      			}
      				this.tableData.push(obj)
  				}			
      		},
	        addLine(){
	        	var data = []
			    var xData = this.meterData['91'][0].times
			    for(var i = 0; i < xData.length; i++){
			    	if(this.meterData['91'][0]['r'+xData[i]]){
			    		var s = this.meterData['91'][0]['r'+xData[i]]
			    		data.push(s.substring(0,s.length-1))
			    	}else{
			    		data.push(0)
			    	}
			    }
	          	this.echarsObj = line('specialLine',xData,data,this.$echarts,'15大投资客户占比');
	        },
	        //点击小圆点
	        lineClick(params){
	        	debugger
	          	//后台有返回才允许点击
			  	if(this.meterData['91'][0]['r'+params.name]){
			  		this.axios.post('/rmIndStass/conDashBoardByRecId',qs.stringify({recId:this.meterData['91'][0].recId,subDate:params.name})).then((res)=>{
				      	if(res.code == 200){
				      		let parent = this.$parent;
				            parent.routerInfo.stepList =[{
				              title:'集中度风险首页',
				              path:'specialIndex',
				              buttonList:true,
				              noTitle:true,
				            },{
				              title:'第二层',
				              path:'focusSecond',
				            }]
				            parent.routerInfo.showStepList = true;
				            parent.currentView = 'focusSecond';
				            parent.message.secondContent = res.data.conList;
				            parent.message.subDate = params.name;
				      	}else{
				      		this.$alert(res.message)
				      	}
				    })
			  	}	
	        }
	    }
    }
</script>

<style lang="scss" scoped>
  	@import '../../../assets/styles/variable';
	.specialIndex{
		.tbDw{
			text-align: right;
			color:#AFC3FF;
			margin-top:20px;
		}
	  	.lineContent{
		    clear:both;
		    color:#AFC3FF;
		    font-size:$size;
		    position: relative;
		    .lineDw{
		      width:79%;
		      margin:0 auto;
		    }
		    #specialLine{
		      width:80%;
		      height:220px;
		      margin:10px auto 0;
		    }
		}
	}
  
</style>
