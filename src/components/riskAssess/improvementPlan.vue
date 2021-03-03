<template>
	<div id="addTaskMask">
		<div class="maskBox">
			<el-tag class="close" @close="backFunc(0)" closable></el-tag>
			<p>整改措施</p>
			<el-form :model="improvementPlan" label-position="left" class="demo-ruleForm" size="mini">
			    <el-row>
			        <el-col :span="24">
					      <el-form-item label="整改措施">
							    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="improvementPlan.dealBugPlan"></el-input>
							</el-form-item>
					</el-col> 
				</el-row>
				<el-row>
					<el-col :span="24">
			        	<el-form-item label="完成时间">
							<!--<el-date-picker
					      	v-model="improvementPlan.overDate"
					      	type="date"
						  	value-format="yyyy-MM-dd"
					      	placeholder="选择完成时间">
					    	</el-date-picker>-->
					    	<el-input v-model="improvementPlan.overDate" placeholder='**年**月，如为长期持续措施，可填"长期"'></el-input>
			        	</el-form-item>
					</el-col> 
			    </el-row>
			    <el-row>
					<el-col :span="24">
			        	<el-form-item label="责任人">
							<el-input v-model="improvementPlan.dutyer"></el-input>
			        	</el-form-item>
					</el-col> 
			    </el-row>
			    <div class="btnBox">
			    	<el-button @click="backFunc()">返回</el-button>
			  		<el-button type="primary" @click="submitData">保存</el-button>
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
		props:['itemInfo'],
		data(){
			return {
				improvementPlan:{
					dealBugPlan:this.itemInfo.dealBugPlan,
					overDate:this.itemInfo.overDate,
					dutyer:this.itemInfo.dutyer
				}
			}
		},
		methods:{
			backFunc(){
				this.$emit('closeMask',{status:false})
			},
			submitData(){
				this.$emit('closeMask',{status:false,msg:this.improvementPlan})
			}
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
		height:360px;
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
		.el-textarea{
			width:80%;
		}
		.el-input{
			width:80%;
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
	}
}
</style>
