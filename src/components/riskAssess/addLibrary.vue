<template>
	<div id="addLibraryMask">
		<div class="maskBox">
			<el-tag @close="backFunc" closable></el-tag>
			<p>新增评估点</p>
			<el-form :model="assessData" label-position="left" class="demo-ruleForm" size="mini">
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="评估类型">
					      <el-select v-model="assessData.assType" placeholder="">
						   	<el-option v-for="(item,index) in assessType" :key="index" :label="item.name" :value="item.code"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="部门">
					      <el-input v-model="assessData.department" disabled></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			    	<el-col :span="12">
				    	<el-form-item label="一级流程">
						  	<el-radio-group v-model="assessData.isFirstConnect" @change="(val)=>{getLcList(val,1,1)}">
								<el-radio :label="a">关联已有一级流程</el-radio>
								<el-radio :label="b">新建一级流程</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col> 
					<el-col :span="12" v-if="assessData.isFirstConnect=='1'">
			        	<el-form-item label="">
					      <el-select class="ban" style="margin-left: 26.8%;" v-model="assessData.firstLevelId" @change="(val)=>{getFirstName(val,1)}" placeholder="">
						   	<el-option v-for="(item,index) in assessTypeOne" :key="index" :label="item.itemName" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12" style="" v-if="assessData.isFirstConnect=='0'">
			        	<el-form-item label="">
					      <el-input class="ban" style="margin-left: 26.8%;" v-model="assessData.firstLevel"></el-input>
						</el-form-item>
					</el-col> 
				</el-row>
				<el-row>
			    	<el-col :span="12">
				    	<el-form-item label="是否二级流程">
						  	<el-radio-group v-model="assessData.isSecond">
								<el-radio :label="a">是</el-radio>
								<el-radio :label="b">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col> 
					<el-col :span="12" v-if="assessData.isSecond=='1'">
			        	<el-form-item label="">
						  	<el-radio-group class="ban" v-model="assessData.isSecondConnect" @change="(val)=>{getLcList(val,2,2)}">
								<el-radio :label="a">关联已有二级流程</el-radio>
								<el-radio :label="b">新建二级流程</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" v-if="assessData.isSecondConnect=='1' && assessData.isSecond=='1'">
			        	<el-form-item label="">
					      <el-select class="quan" v-model="assessData.secondLevel" @change="(val)=>{getFirstName(val,2)}" placeholder="">
						   	<el-option v-for="(item,index) in assessTypeTwo" :key="index" :label="item.itemName" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="24" v-if="assessData.isSecondConnect=='0' && assessData.isSecond=='1'">
			        	<el-form-item label="">
					      <el-input class="quan" v-model="assessData.secondLevel"></el-input>
						</el-form-item>
					</el-col> 
				</el-row>
				<el-row>
					<el-col :span="12">
			        	<el-form-item label="节点编号">
					      <el-input v-model="assessData.nodeId" placeholder="1,2,3"></el-input>
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
				    	<el-form-item label="风险点">
						  	<el-radio-group v-model="assessData.isRiskPoint" @change="(val)=>{getLcList(val,3,3)}">
								<el-radio :label="a">关联已有风险点</el-radio>
								<el-radio :label="b">新建风险点</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col> 
					<el-col :span="12" v-if="assessData.isRiskPoint=='1'">
			        	<el-form-item label="">
					      <el-select class="ban" style="margin-left: 26.8%;" v-model="assessData.riskPointNo" @change="(val)=>{getFirstName(val,3)}" placeholder="">
						   	<el-option v-for="(item,index) in assessTypeThree" :key="index" :label="item.itemNo" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12" v-if="assessData.isRiskPoint=='0'">
			        	<el-form-item label="风险点编号">
					      <el-input class="ban" placeholder="R-01" v-model="assessData.riskPointNo"></el-input>
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
			    	<el-col :span="12">
				    	<el-form-item label="控制点">
						  	<el-radio-group v-model="assessData.isControlPoint" @change="(val)=>{getLcList(val,4,4)}">
								<el-radio :label="a">关联已有控制点</el-radio>
								<el-radio :label="b">新建控制点</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col> 
					<el-col :span="12" v-if="assessData.isControlPoint=='1'">
			        	<el-form-item label="">
					      <el-select class="ban" style="margin-left: 26.8%;" v-model="assessData.ctrlPointId" @change="(val)=>{getFirstName(val,4)}" placeholder="">
						   	<el-option v-for="(item,index) in assessTypeFour" :key="index" :label="item.itemNo" :value="item.id"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12" v-if="assessData.isControlPoint=='0'">
			        	<el-form-item label="控制点编号">
					      <el-input class="ban" placeholder="C-01" v-model="assessData.ctrlPointNo"></el-input>
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
						   	<el-option v-for="(item,index) in controlFrequency" :key="index" :label="item.name" :value="item.code"></el-option>
						  </el-select>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="控制方式">
					      <el-select v-model="assessData.ctrlType" placeholder="">
						   	<el-option v-for="(item,index) in controlWay" :key="index" :label="item.name" :value="item.code"></el-option>
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
		props:['addDepartment'],
		data(){
			return {
				a:'1',
				b:'0',
				assessData:{
					assType:1,
					department:null,
					departmentNo:'',
					isFirstConnect:'0',
					isSecondConnect:null,
					firstLevelId:null,
					firstLevelNo:null,
					firstLevel:null,
					isSecond:'0',
					secondLevel:null,
					secondLevelId:null,
					secondLevelId:null,
					nodeId:null,
					nodeName:null,
					isRiskPoint:'0',
					riskPointNo:null,
					riskPointId:null,
					riskPointDesc:null,
					isControlPoint:'0',
					ctrlPointNo:null,
					ctrlPointId:null,
					ctrlPointDesc:null,
					ctrlRate:1,
					ctrlType:1
				},
				assessType:[{
					code:1,
					name:'定期评估'
				},{
					code:2,
					name:'专项评估'
				}],
				assessTypeOne:[],
				assessTypeTwo:[],
				assessTypeThree:[],
				assessTypeFour:[],
				controlFrequency:[{
					code:1,
					name:'每周一次或更高频率'
				},{
					code:2,
					name:'每月一次'
				},{
					code:3,
					name:'每季度一次'
				},{
					code:4,
					name:'每半年一次'
				},{
					code:5,
					name:'每年一次或更低频率'
				},{
					code:6,
					name:'不定期'
				}],
				controlWay:[{
					code:1,
					name:'人工控制'
				},{
					code:2,
					name:'人工依赖系统控制'
				},{
					code:3,
					name:'系统控制'
				}]
			}
		},
		created(){
			this.assessData.departmentNo = this.addDepartment.addDepartmentNo
			this.assessData.department = this.addDepartment.department
		},
		methods:{
			getLcList(val,index,type){
				this.axios.post('riskctrl/getsonobj',qs.stringify({
					itemType:index,
					departmentNo:this.assessData.departmentNo
				})).then((res)=>{
					if(res.code == 200){
						if(type == '1'){
							this.assessTypeOne = res.data.data		
						}else if(type == '2'){
							this.assessTypeTwo = res.data.data
						}else if(type == '3'){
							this.assessTypeThree = res.data.data
						}else{
							this.assessTypeFour = res.data.data
						}
					}else{
						this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        })
					}
				})
			},
			getFirstName(val,index){
				let obj = {};
				if(index == '1'){
					obj = this.assessTypeOne.find((item)=>{
					     return item.id === val;
					});
					this.assessData.firstLevel = obj.itemName;
					this.assessData.firstLevelNo = obj.itemNo;
					this.assessData.firstLevelId = obj.id;
				}else if(index =='2'){
					obj = this.assessTypeTwo.find((item)=>{
					     return item.id === val;
					});
					this.assessData.secondLevel = obj.itemName;
					this.assessData.secondLevelNo = obj.itemNo;
					this.assessData.secondLevelId = obj.id;
				}else if(index == '3'){
					obj = this.assessTypeThree.find((item)=>{
					     return item.id === val;
					});
					this.assessData.riskPointId = obj.id;
					this.assessData.riskPointNo = obj.itemNo;
					this.assessData.riskPointDesc = obj.itemName;
				}else{
					obj = this.assessTypeFour.find((item)=>{
					     return item.id === val;
					});
					this.assessData.ctrlPointNo = obj.itemNo;
					this.assessData.ctrlPointId = obj.id;
					this.assessData.ctrlPointDesc = obj.itemName;
				}
			},
			backFunc(fromId){
				this.$emit('closeMask',{status:false,fromId:fromId})
			},
			submitData(){
				if(this.assessData.isFirstConnect == '0'){
					if(this.assessData.firstLevel == null){
						this.$alert('一级流程名称不能为空', '提示', {
				        	confirmButtonText: '确定'
				        })
						return;
					}	
				}else{
					if(this.assessData.firstLevelId == null){
						this.$alert('关联已有一级流程不能为空', '提示', {
				        	confirmButtonText: '确定'
				        })
						return;
					}
				}
				if(this.assessData.isRiskPoint == '0'){
					if(this.assessData.riskPointNo == null){
						this.$alert('风险点编号不能为空', '提示', {
				        	confirmButtonText: '确定'
				        })
						return;
					}
				}else{
					if(this.assessData.riskPointId == null){
						this.$alert('关联已有风险点不能为空', '提示', {
				        	confirmButtonText: '确定'
				        })
						return;
					}
				}
				if(this.assessData.riskPointDesc == null){
					this.$alert('风险点描述不能为空', '提示', {
			        	confirmButtonText: '确定'
			        })
					return;
				}
				if(this.assessData.isControlPoint == '0'){
					if(this.assessData.ctrlPointNo == null){
						this.$alert('控制点编号不能为空', '提示', {
				        	confirmButtonText: '确定'
				        })
						return;
					}
				}else{
					if(this.assessData.ctrlPointId == null){
						this.$alert('关联已有控制点不能为空', '提示', {
				        	confirmButtonText: '确定'
				        })
						return;
					}
				}
				if(this.assessData.ctrlPointDesc == null){
					this.$alert('控制点描述不能为空', '提示', {
			        	confirmButtonText: '确定'
			        })
					return;
				}
				this.axios.post('riskctrl/addriskctrl',qs.stringify(this.assessData)).then((res)=>{
					if(res.code == 200){
						this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定',
				        	callback: action => {
				            	//执行刷新
				            	this.backFunc(1)
					          }
				        })
					}else{
						this.$alert(res.message, '提示', {confirmButtonText: '确定'})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
#addLibraryMask{
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
			position:fixed;
			margin:-40px 460px;
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
