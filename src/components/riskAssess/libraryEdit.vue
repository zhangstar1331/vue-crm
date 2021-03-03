<template>
	<div id="editLibraryMask">
		<div class="maskBox">
			<el-tag @close="backFunc" closable></el-tag>
			<p>编辑评估点</p>
			<el-form :model="assessData" label-position="left" class="demo-ruleForm" size="mini">
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="评估类型">
					      <el-select v-model="assessData.assType" disabled placeholder="">
						   	<el-option v-for="(item,index) in assessType" :key="index" :label="item.name" :value="item.assType"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="部门">
					      <el-input disabled v-model="assessData.department"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
				      	<el-form-item label="一级流程编号">
					      <el-input disabled v-model="assessData.firstLevelNo"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="一级流程名称">
					      	<el-input v-model="assessData.firstLevel"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
				      	<el-form-item label="二级流程编号">
					      <el-input disabled v-model="assessData.secondLevelNo"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="二级流程名称">
					      	<el-input :disabled="!assessData.secondLevelNo" v-model="assessData.secondLevel"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
				      	<el-form-item label="节点编号">
					      <el-input disabled v-model="assessData.nodeId"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="节点名称">
					      	<el-input v-model="assessData.nodeName"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
				      	<el-form-item label="风险点编号">
					      <el-input disabled v-model="assessData.riskPointNo"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="控制点编号">
					      	<el-input disabled v-model="assessData.ctrlPointNo"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
				<el-row>
					<el-col :span="24">
		        		<el-form-item label="风险点描述">
						    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="assessData.riskPointDesc"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row>
					<el-col :span="24">
		        		<el-form-item label="控制点描述">
						    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="assessData.ctrlPointDesc"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row>
			        <el-col :span="12">
			        	<el-form-item label="控制频率">
					      <el-select v-model="assessData.ctrlRate" placeholder="">
						   	<el-option v-for="(item,index) in controlFrequency" :key="index" :label="item.name" :value="item.ctrlRate"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="控制方式">
					      <el-select v-model="assessData.ctrlType" placeholder="">
						   	<el-option v-for="(item,index) in controlWay" :key="index" :label="item.name" :value="item.ctrlType"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <div class="btnBox">
			    	<el-button @click="backFunc">返回</el-button>
			  		<el-button type="primary" @click="submitData()">提交</el-button>
			  	</div>
			</el-form>
		</div>
	</div>
</template>
<script>
	import qs from 'qs'
	export default{
		props:['itemId'],
		data(){
			return {
				a:'1',
				b:'0',
				assessData:{
					assType:null,
					departmentNo:null,
					isFirstConnect:null,
					firstLevelId:null,
					firstLevelNo:null,
					firstLevel:null,
					isSecond:null,
					secondLevel:null,
					secondLevelId:null,
					secondLevelId:null,
					nodeId:null,
					nodeName:null,
					isRiskPoint:null,
					riskPointNo:null,
					riskPointId:null,
					riskPointDesc:null,
					isControlPoint:null,
					ctrlPointId:null,
					ctrlPointDesc:null,
					ctrlRate:null,
					ctrlType:null
				},
				assessType:[{
					assType:1,
					name:'定期评估'
				},{
					assType:2,
					name:'专项评估'
				}],
				controlFrequency:[{
					ctrlRate:1,
					name:'每周一次或更高频率'
				},{
					ctrlRate:2,
					name:'每月一次'
				},{
					ctrlRate:3,
					name:'每季度一次'
				},{
					ctrlRate:4,
					name:'每半年一次'
				},{
					ctrlRate:5,
					name:'每年一次或更低频率'
				},{
					ctrlRate:6,
					name:'不定期'
				}],
				controlWay:[{
					ctrlType:1,
					name:'人工控制'
				},{
					ctrlType:2,
					name:'人工依赖系统控制'
				},{
					ctrlType:3,
					name:'系统控制'
				}]
			}
		},
		created(){
			this.getDetail(this.itemId)
		},
		methods:{
			getDetail(id){
				this.axios.post('riskctrl/getedetail',qs.stringify({
					pointid:id
				})).then((res)=>{
					this.assessData = res.data.deatil
				})
			},
			backFunc(num){
				this.$emit('closeMask',{status:false,fromFlag:num})
			},
			submitData(){
				if(this.assessData.firstLevel == ""){
					this.$alert('一级流程名称不能为空', '提示', {
			        	confirmButtonText: '确定'
			        })
					return;
				}
				if(this.assessData.secondLevelNo&&this.assessData.secondLevel == ""){
					this.$alert('二级流程名称不能为空', '提示', {
			        	confirmButtonText: '确定'
			        })
					return;
				}
				if(this.assessData.riskPointDesc == ""){
					this.$alert('风险点描述不能为空', '提示', {
			        	confirmButtonText: '确定'
			        })
					return;
				}
				if(this.assessData.ctrlPointDesc == ""){
					this.$alert('控制点描述不能为空', '提示', {
			        	confirmButtonText: '确定'
			        })
					return;
				}
				this.axios.post('riskctrl/updateriskctrl',qs.stringify(this.assessData)).then((res)=>{
					if(res.code == 200){
						this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定',
				        	callback: action => {
				            	//执行刷新
				            	this.backFunc(1)
					          }
				        })
					}
				})
			}
		}
	}
</script>

<style lang="scss">
#editLibraryMask{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.4);
	z-index: 100000;
	padding-top: 8%;
	padding-left: 15%;
	padding-right: 100px;
	text-align: center;
	.maskBox{
		position: relative;
		width: 1000px;
		height:540px;
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
		.el-tag{
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
			margin-top: 10px;
			button{
				width: 68px;
				height: 26px;
				line-height: 0;
				font-size: 12px;
			}
		}
		.el-form--inline .el-form-item{
			display: block;
		}
		.el-radio-group{
			width:72%;
			.el-radio{
				width:44%;
				padding-left: 1%;
				text-align:left;
			}
		}
		.el-input{
			width:72%;
		}
		.el-select{
			width:72%;
			.el-input{
				width:100%;
			}
		}
		.el-textarea{
			width:85%;
		}
		.quan{
			width:86.2%;
			margin-left:13.8%;
		}
		.ban{
			width:71.2%;
			/*margin-left:26.8%;*/
		}
	}
}
</style>
