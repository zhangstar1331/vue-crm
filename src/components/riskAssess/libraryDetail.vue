<template>
	<div id="detailLibraryMask">
		<div class="maskBox">
			<b id="top" style="float: left;margin-top: -.2rem;"></b>
			<el-tag @close="backFunc" closable></el-tag>
			<p>评估点详情</p>
			<el-form :model="assessData" label-position="left" class="demo-ruleForm" size="mini">
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="评估类型">
						  <el-input readonly v-model="assessData.assType"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="部门">
					      <el-input readonly v-model="assessData.department"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="维护人">
						  <el-input readonly v-model="assessData.auther"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="维护时间">
					      <el-input readonly v-model="assessData.createDate"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="一级流程名称">
						  <el-input readonly v-model="assessData.firstLevel"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="二级流程名称">
					      <el-input readonly v-model="assessData.secondLevel"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="节点名称">
						  <el-input readonly v-model="assessData.nodeName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
			        	<el-form-item label="风险点编号">
						  <el-input readonly v-model="assessData.riskPointNo"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="控制点编号">
						  <el-input readonly v-model="assessData.ctrlPointNo"></el-input>
						</el-form-item>
					</el-col>
			    </el-row>
				<el-row>
					<el-col :span="24">
		        		<el-form-item label="风险点描述">
						    <el-input readonly type="textarea" :rows="2" placeholder="请输入内容" v-model="assessData.riskPointDesc"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row>
					<el-col :span="24">
		        		<el-form-item label="控制点描述">
						    <el-input readonly type="textarea" :rows="2" placeholder="请输入内容" v-model="assessData.ctrlPointDesc"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
			    <el-row>
			        <el-col :span="12">
			        	<el-form-item label="控制频率">
						  <el-input readonly v-model="assessData.ctrlRate"></el-input>
						</el-form-item>
					</el-col> 
					<el-col :span="12">
			        	<el-form-item label="控制方式">
					      <el-input readonly v-model="assessData.ctrlType"></el-input>
						</el-form-item>
					</el-col> 
			    </el-row>
			    <div>
			      	<div class="record">评估点版本记录</div>
				    <el-table :data="tableData1" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
				    	<el-table-column prop="versionId" align="center" label="版本号"> 
				    		<template slot-scope="scope">
				    			<span class="versonName" @click="getOneDetail(scope.$index,scope.row)">{{scope.row.versionId == null?'--':scope.row.versionId}}</span>
				    		</template>
				    	</el-table-column>
				        <el-table-column prop="firstLevel" align="center" label="一级流程"> 
				        	<template slot-scope="scope">
				    			{{scope.row.firstLevel == null?'--':scope.row.firstLevel}}
				    		</template>
				        </el-table-column>
				        <el-table-column prop="secondLevel" align="center" label="二级流程"> 
				        	<template slot-scope="scope">
				    			{{scope.row.secondLevel == null?'--':scope.row.secondLevel}}
				    		</template>
				        </el-table-column>
				        <el-table-column prop="onDate" align="center" label="启用时间"> 
				        	<template slot-scope="scope">
				    			{{scope.row.onDate == null?'--':scope.row.onDate}}
				    		</template>
				        </el-table-column>
				        <el-table-column prop="offDate" align="center" label="停用时间" > 
				        	<template slot-scope="scope">
				    			{{scope.row.offDate == null?'--':scope.row.offDate}}
				    		</template>
				        </el-table-column>
					</el-table>
			    </div>
			    <div class="btnBox">
			    	<el-button type="primary" @click="backFunc">返回</el-button>
			  	</div>
			</el-form>
		</div>
	</div>
</template>
<script>
	import qs from 'qs'
	import {formatDate} from 'src/utils/utils.js'
	export default{
		props:['itemId'],
		data(){
			return {
				assessData:{
					assType:null,
					auther:null,
					createDate:null,
					departmentNo:'00134562',
					firstLevel:null,
					secondLevel:null,
					nodeName:null,
					riskPointNo:null,
					riskPointDesc:null,
					ctrlPointDesc:null,
					ctrlRate:null,
					ctrlType:null
				},
				tableData1:[],
				department:''
			}
		},
		created(){
			this.getDetail(this.itemId)
		},
		methods:{
			backFunc(){
				this.$emit('closeMask',{status:false})
			},
			getDetail(id){
				this.axios.post('riskctrl/getdetail',qs.stringify({
					pointid:id,
				})).then((res)=>{
					//格式化维护时间
					res.data.deatil.createDate = formatDate(new Date(parseInt(res.data.deatil.createDate)*1000),'yyyy-MM-dd')
					this.conversionData(res.data.deatil)
					this.assessData = res.data.deatil
					this.department = res.data.deatil.department
					this.tableData1 = res.data.data 
					if(this.tableData1 != null){
						for (var i = 0; i < this.tableData1.length; i++) {
							this.conversionData(this.tableData1[i])
							if(this.tableData1[i].onDate != null){
								this.tableData1[i].onDate = formatDate(new Date(parseInt(this.tableData1[i].onDate)*1000),'yyyy-MM-dd hh:mm:ss')
							}
							if(this.tableData1[i].offDate != null){
								this.tableData1[i].offDate = formatDate(new Date(parseInt(this.tableData1[i].offDate)*1000),'yyyy-MM-dd hh:mm:ss')
							}
						}
					}
				})
			},
			conversionData(obj){
				//转换评估类型
				if(obj.assType == '1'){
					obj.assType = '定期评估'
				}else{
					obj.assType = '专项评估'
				}
				//转换控制频率
				if(obj.ctrlRate == '1'){
					obj.ctrlRate = '每日一次'
				}else if(obj.ctrlRate == '2'){
					obj.ctrlRate = '每周一次'
				}else if(obj.ctrlRate == '3'){
					obj.ctrlRate = '每月一次'
				}else if(obj.ctrlRate == '4'){
					obj.ctrlRate = '每年一次'
				}else if(obj.ctrlRate == '5'){
					obj.ctrlRate = '突发不定期'
				}
				//转换控制方式
				if(obj.ctrlType == '1'){
					obj.ctrlType = '人工控制'
				}else if(obj.ctrlType == '2'){
					obj.ctrlType = '人工依赖系统控制'
				}else{
					obj.ctrlType = '系统控制'
				}
			},
			getOneDetail(index,scope){
				var element = document.getElementById("top");
	         	element.scrollIntoView({block:'start', behavior: "smooth"});
				this.assessData = this.tableData1[index];
				if(typeof this.assessData.createDate == "number"){
					this.assessData.createDate = formatDate(new Date(parseInt(this.assessData.createDate)*1000),'yyyy-MM-dd')
				}
				this.assessData.department = this.department;
			}
		}
	}
</script>

<style lang="scss">
#detailLibraryMask{
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
		.versonName{
			display: block;
			color: #4285F4;
		}
		.versonName:hover{
			cursor: pointer;
		}
		.record{
			text-align: left;
			border-left: 2px solid #409EFF;
			font-size: 14px;
			text-indent: 8px;
			margin-bottom: 15px;
   	 		margin-top: 20px;
		}
	}
	.textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
}
</style>
