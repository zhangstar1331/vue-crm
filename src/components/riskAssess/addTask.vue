<template>
	<div id="addTaskMask">
		<div class="maskBox">
			<el-tag class="close" @close="backFunc(0)" closable></el-tag>
			<p>下发风控评估任务</p>
			<el-form :model="taskInfo" label-position="left" class="demo-ruleForm" size="mini">
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="评估年份">
					      <el-select class="ban1" :disabled="isDefend" v-model="taskInfo.assYear" placeholder="">
						   	<el-option v-for="(item,index) in riskAssess.year" :key="index" :label="item.name" :value="item.code"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="评估类型">
							<el-select class="ban1" :disabled="isDefend" v-model="assType" placeholder="">
							   	<el-option :label="assType" :value="assTypeId" style="height: auto;background: #fff;"> 
							   		<el-tree :data="riskAssess.assessType" :props="defaultProps" @node-click="handleNodeClick" style="font-weight: normal;"></el-tree>
							   	</el-option>
							</el-select>
			        	</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="24">
			        	<el-form-item label="评估任务名称">
			        		<el-input class="quan" :disabled="isDefend" v-model="taskInfo.name"></el-input>
			        	</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="24">
			        	<el-form-item label="评估期间">
			        		<el-date-picker
			        		  class="ban"
			        		  :disabled="isDefend"
						      v-model="taskInfo.assBeginDate"
						      :picker-options="startDatePicker"
						      type="date"
						      @change="getDateTime"
							  value-format="yyyy-MM-dd"
						      placeholder="选择开始日期">
						    </el-date-picker>
						    -
						    <el-date-picker
						      class="ban"
						      :disabled="isDefend"
						      v-model="taskInfo.assEndDate"
						      :picker-options="endDatePicker"
						      type="date"
						      @change="getDateTime"
							  value-format="yyyy-MM-dd"
						      placeholder="选择结束日期">
						    </el-date-picker>
			        	</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			    	<el-col :span="24">
			        	<el-form-item label="参与部门">
					      <el-select class="quan" :disabled="isDefend" v-model="depInfo" multiple @change='selectAll' placeholder="请选择">
						   	<el-option v-for="(item,index) in assessDepartment" :key="index" :label="item.name" :value="item.code"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			    	<el-col :span="24">
			        	<el-form-item label="评估截止日期">
					      	<el-date-picker
					      	  class="quan"
						      v-model="taskInfo.endDate"
						      type="date"
						      :picker-options="lastEndDatePicker"
						      @change="getDateTime"
						      value-format="yyyy-MM-dd"
						      placeholder="选择截止时间">
						    </el-date-picker>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <div class="btnBox">
			    	<el-button @click="backFunc(0)">返回</el-button>
			  		<el-button v-if="!isDefend" type="primary" @click="submitData">保存</el-button>
			  		<el-button v-if="isDefend" type="primary" @click="submitDefendData">提交</el-button>
			  	</div>
			</el-form>
		</div>
	</div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getData,fileDownload,fomatTime} from 'src/utils/utils.js'
	import qs from 'qs'
	export default{
		props:['defendData'],
		data(){
			return {
				taskInfo:{
					assYear:"", // 评估年份
					assType:"", // 评估类型
					name:"", // 评估名称
					assBeginDate:"", // 评估期间始 2019-09-21
					assEndDate:"", // 评估期间止 2019-09-21
					depInfo:[],
					endDate:""// 评估截止日期
				},
				assType:'',
				assTypeId:'',
				depInfo:[],
				startDatePicker:this.beginDate(),
				endDatePicker:this.processDate(1),
				lastEndDatePicker:this.processDate(2),
				assessDepartment:[],
				isDefend:false,
				defaultProps: {
          			children: 'children',
          			value: 'value',
          			label: 'label'
        		}
			}
		},
		methods:{
			initPage(){
				//维护信息，覆盖taskInfo
				if(this.defendData){	
					let that = this
					this.isDefend = true
					this.assessDepartment.push({name:this.defendData.depName,code:this.defendData.depId})
					this.depInfo.push(this.defendData.depId);
					for(var i = 0; i < this.riskAssess.assessType.length; i++){
						if(this.defendData.assType == this.riskAssess.assessType[i].value){
							this.defendData.assType = this.riskAssess.assessType[i].label;
							break;
						}
						if(this.riskAssess.assessType[i].children){
							for(var j = 0; j < this.riskAssess.assessType[i].children.length; j++){
								if(this.defendData.assType == this.riskAssess.assessType[i].children[j].value){
									this.defendData.assType = this.riskAssess.assessType[i].children[j].label;
									break;
								}
							}
						}
					}
					this.assType = this.defendData.assType
					this.defendData.assBeginDate = fomatTime(this.defendData.assBeginDate,10)
					this.defendData.assEndDate = fomatTime(this.defendData.assEndDate,10)
					this.defendData.endDate = fomatTime(this.defendData.endDate,10)
					this.taskInfo = this.defendData
				}else{
					//获取部门信息
					getData('/rmAssTask/getGroupDept').then((data)=>{
						data.unshift({name:'全部',code:'all'})
						this.assessDepartment = data
					})
				}
			},
			backFunc(code){
				this.$emit('closeMask',{status:code})
			},
			submitData(){
				let that = this;
				//新建评估任务
				this.taskInfo.assType = this.assTypeId
				var arr = []
				for(var i = 0; i < this.depInfo.length; i++){
					var obj = {}
					let depName = this.assessDepartment.find(function (obj) {
							return obj.code === that.depInfo[i]
						}).name
					if(depName!='全部'){
						obj.depId = that.depInfo[i],
						obj.depName = depName
						arr.push(obj)
					}
				}
				this.taskInfo.depInfo = JSON.stringify(arr)
				//开启loading
				var load = this.$loading({
					lock: true,
					text: '加载中',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.7)'
				}); 
				this.axios.post('/rmAssTask/addAssTask',qs.stringify(this.taskInfo)).then((data)=>{
					if(data.code == 200){
						//关闭loading
						load.close(); 
						this.$alert('保存成功', '提示', {
				        	confirmButtonText: '确定',
				        	callback: action => {
				            	//执行刷新
				            	this.backFunc(1)
					          }
				        })
					}else{
						//关闭loading
						load.close(); 
						this.$alert(data.message)
					}
				})
			},
			//维护修改
			submitDefendData(){
				getData('/rmAssTask/updateAssTask',qs.stringify({taskId:this.taskInfo.taskId,endDate:this.taskInfo.endDate,depId:this.depInfo[0],taskName:this.taskInfo.name})).then((data)=>{
					if(data == null){
						this.$alert('修改成功', '提示', {
				        	confirmButtonText: '确定',
				        	callback: action => {
				            	//执行刷新
				            	this.backFunc(1)
					          }
				        })
					}
				})
			},
			getDateTime(val){},
			beginDate(type){
			  const self = this
			  return {
			    disabledDate(time){
			      if (self.taskInfo.assEndDate) {  //如果结束时间不为空，则小于结束时间
			        return new Date(self.taskInfo.assEndDate).getTime() < time.getTime()
			      } 
			    }
			  }
			},
			processDate(type) {
			  const  self = this
			  return {
			    disabledDate(time) {
			      let beginDate;
				  if(type == 1){
				  	beginDate = self.taskInfo.assBeginDate
				  }else{
				  	beginDate = self.taskInfo.assEndDate
				  }
			      if (beginDate) {  //如果开始时间不为空，则结束时间大于开始时间
			        return new Date(beginDate).getTime() > time.getTime()
			      }
			    }
			  }
			},
			//树形结构选择
			handleNodeClick(data) {
				if(data.value!=-1){
        			this.assType = data.label
        			this.assTypeId = data.value
        		}
      		},
			//全选
			selectAll(val) {
		      	const allValues = this.assessDepartment.map(item => {
			        return item.code;
			    });
			    // 若选择全部
			    if (val.includes('all')&&this.depInfo.length<allValues.length) {
			        this.depInfo = allValues;
			    }
			    // 取消全部选中， 上次有， 当前没有， 表示取消全选
			    if (this.depInfo.includes('all') && this.depInfo.length<allValues.length) {
			    	const index = val.indexOf('all');
			        val.splice(index, 1); // 排除全选选项
			        this.depInfo = val;
			    }
		    }
		},
		mounted(){
			this.initPage()
		},
		computed:{
			...mapState(['riskAssess'])
		}
	}
</script>
<style lang="scss">
#addTaskMask{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.4);
	z-index: 100000;
	padding-top: 10%;
	padding-left: 15%;
	padding-right: 100px;
	text-align: center;
	.maskBox{
		position: relative;
		width: 800px;
		height:440px;
		overflow-y: auto;
		padding: 40px 0;
		background: #fff;
		margin:0 auto;
		p{
			font-size:20px;
			font-weight:1000;
		}
		.el-form{
			padding: 20px 70px 0px 60px;
		}
		.el-form-item__content{
			width: 100%;
		}
		.el-form-item__label{
			text-align:right;
			width:120px;
		}
		.el-row{
			margin-bottom:10px;
		}
		.close{
			position:absolute;
			top:0;
			right:8px;
		    background: transparent;
		    border: none;
		    padding: 4px;
			.el-icon-close{
				font-size: 18px;
				padding: 1px;
			}
			.el-icon-close:hover{
				background: transparent;
				color: #409eff;
			}
		}
		.btnBox{
			margin-top:30px;
			button{
				width: 68px;
				height: 26px;
				line-height: 0;
				font-size: 12px;
			}
		}
		.el-select,.el-date-editor{
			width: 64%;
		}
		.quan{
			width:78%;
		}
		.ban{
			width:38%;
		}
		.ban1{
			width:56%;
		}
	}
}
</style>
