<!--  -->
<template>
  <div id="rybSecond">
      <div class="rybSecondTable">
      		<el-table :data="message.secondContent" 
      			:span-method="spanMethod" :cell-class-name="addClass"
      			:header-cell-style="{background:'#1D3270',color:'#FFFFFF'}" 
      			:cell-style="{background:'#172758',color:'#FFFFFF',border:'none',borderBottom:'1px solid #546DBB'}" 
      			style="width: 100%;margin:0 auto;cursor:pointer;">
              <el-table-column
                  align='center'
                  label="评价标准"
                  width="180">
                  <template slot-scope="scope"> 
				            <div style="text-align: left;font-size: 12px;">
								    	<p style="line-height:14px;">一、正常类<br>
								    	一类、二类指标中红、黄区指标占比＜40%，经营管理存在较低风险<br>
								    	二、关注类<br>
								    	一类、二类指标中红、黄区指标占比≥40%<br>
								    	三、高度关注类<br>
								    	一类指标中红区指标占比≥60%<span v-for="(item,index) in message.secondOther" :key="index">或{{item}}</span></p>
							    	</div>
				          </template>
              </el-table-column>
              <el-table-column
                  align='center'
                  prop="name"
                  label="评价对象">
              </el-table-column>
              <el-table-column
                  align='center'
                  label="评价结果">
                  <template slot-scope="scope">
							      <div v-if="message.secondContent[scope.$index].result == 1">正常类</div>
							      <div v-if="message.secondContent[scope.$index].result == 2" class="active">关注类</div>
							      <div v-if="message.secondContent[scope.$index].result == 3" class="active">高度关注类</div>
							      <div v-if="!message.secondContent[scope.$index].result">--</div>
									</template>
              </el-table-column>
              <el-table-column
                  prop=""
                  align='center'
                  label="判断依据">
                    <el-table-column
                        align='center'
                        label="一、二类指标中红、黄区指标占比">
                        <template slot-scope="scope">
										      <div v-if="message.secondContent[scope.$index].ryaValue">
										      	{{message.secondContent[scope.$index].ryaValue}}
										      </div>
										      <div v-else>--</div>
												</template>
                    </el-table-column>
                    <el-table-column
                        align='center'
                        label="一类指标中红区指标占比">
                        <template slot-scope="scope">
										      <div v-if="message.secondContent[scope.$index].roValue">
										      	{{message.secondContent[scope.$index].roValue}}
										      </div>
										      <div v-else>--</div>
												</template>
                    </el-table-column>
                    <el-table-column
		                  align='center'
		                  label="其他">
		                  <template slot-scope="scope">
									      <div v-if="message.secondContent[scope.$index].cause" style="line-height:14px;">
									      	<p v-for="(item,index) in message.secondContent[scope.$index].cause" :key="index">{{item}}</p>
									      </div>
									      <div v-else>--</div>
											</template>
		              	</el-table-column>
              </el-table-column>
          </el-table>
      </div>
      <div class="pieChart">
          <div class='col' v-for='(item,index) in message.secondContent' :key='index'>
              <p class='title'>{{item.name}}</p>
              <div :id="'pieBox'+index" class='pieBox'></div> 
          </div>
      </div>
      <ul class="pieTip">
	      <li v-for="(item,index) in pieTip" :key="index" :style="{color:pieTip[index].color}">
	      	<span :style="{backgroundColor:pieTip[index].color}"></span>
	      	{{item.name}}
	      </li>
	  	</ul>
  </div>
</template>

<script>
import {pie} from 'src/utils/utils.js'
import qs from 'qs'
export default {
  props:['message'],
  data(){
  	return {
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
  	this.$nextTick(()=>{
  		this.initCircle();
  	})
  },
  methods: {
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
  			if(columnIndex==0){
  				return 'firstCol'
  			}
  			if(columnIndex==5){
  				return 'lastCol'
  			}
  		},
      initCircle(){
        for (let i = 0; i < 4; i++) {
        		var data = []
        		var color = []
        		var flag = false
        		for(let j = 0; j < this.message.secondContent[i].pics.length-1; j++){
        			if(this.message.secondContent[i].pics[j].color == 1){//红
        				color.push("#FF6363","#FF60AC")
        			}
        			if(this.message.secondContent[i].pics[j].color == 2){//黄
        				color.push("#FFD824","#FF954D")
        			}
        			if(this.message.secondContent[i].pics[j].color == 3){//蓝
        				color.push("#3E82F7","#31AAFA")
        			}
        			if(this.message.secondContent[i].pics[j].lv1||this.message.secondContent[i].pics[j].lv2){
        				flag = true
        			}
        			data.push(this.message.secondContent[i].pics[j].lv1,this.message.secondContent[i].pics[j].lv2)
        		}
        		if(flag){
        			pie('pieBox'+i,color,data,this.pieTip,this.$echarts) 
        			/*
						   * Echarts节点添加点击事件
						   * */
						  let volume = this.$echarts.init(document.getElementById('pieBox'+i))
						  var that = this;
							volume.on('click', function (handler){
								var obj = {
									objId:that.message.secondContent[i].objId,
									level:handler.dataIndex % 2 + 1,
									rybStatus:handler.dataIndex/2<1?3:handler.dataIndex/2<2?2:1,
									pageNum:1,
									pageSize:5
								}
								that.axios.post('/rmIndStass/indDashBoardRybList',qs.stringify(obj)).then((res)=>{
									if(res.code == 200){
										//跳转到三级页面
						    		that.gotoPage(res.data,i,obj.level,obj.rybStatus)
									}else{
										this.$alert(res.message)
									}
								})
							})
        		}else{
        			$("#pieBox"+i).text('暂无数据')
        		}
        }   
      },
      gotoPage(msg,index,level,rybStatus){
	      let parent = this.type?this.$parent.$parent:this.$parent;
	      parent.routerInfo.stepList.push({
	        title:'第三层',
	        path:'rybThird',
	      });
	      parent.message.thirdContent = msg;
	      parent.message.thirdIndex = index;
	      parent.message.level = level;
	      parent.message.rybStatus = rybStatus;
	      parent.routerInfo.showStepList = true;
	      parent.currentView = 'rybThird';
	    }
  }
}

</script>
<style lang='scss'>
#rybSecond{
	.el-table th.gutter:last-of-type{
		  display: table-cell!important;
	}
	.active{
		color:#FF6363;
	}
	.firstCol{
		border-left:1px solid #546DBB!important;
		border-right:1px solid #546DBB!important;
	}
	.lastCol{
		border-right:1px solid #546DBB!important;
	}
	.pieChart{
    width:100%;
    display:flex;
    .col{
        display: flex;
        flex-direction:column;
        box-sizing: border-box;
        padding:20px 22px 10px;
        justify-content: center;
        width:25%;
        height:180px;
        .title{
            text-align: center;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 14px;
        }
        .pieBox{
            width:100%;
            height:180px;
            text-align:center;
            line-height: 120px;
            color:#fff;
        }
    }
	}
	.pieTip{
		width:60%;
    margin:0 auto;
    span{
        display: inline-block;
        width:12px;
        height:12px;
        border-radius: 3px;
        background-color:#FF6363;
        margin-right: 15px;
    }
    display: flex;
    flex-direction:row;
    li{
        width:50%;
        text-align: center;
        font-size:12px;
    }
	}
}	 
</style>