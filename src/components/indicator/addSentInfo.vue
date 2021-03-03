<template>
	<div id="mask">
		<div class="maskBox">
		<p class="maks-title" v-if="!label.itemId">添加报送信息</p>
		<p class="maks-title" v-else>编辑报送信息</p>
		<el-form :model="sentInfoItem" label-position="left" class="demo-ruleForm" size="mini">
	      <el-row>
	        <el-col :span="24">
	        	<el-form-item label="适用对象">
			      <el-select v-model="sentInfoItem.company" placeholder="">
				   	<el-option v-for="(item,index) in indicatorArr.sentInfo.company" :key="index" :label="item.name" :value="item.name + '~' +item.id"></el-option>
				  </el-select>
				</el-form-item>
			</el-col> 
	      </el-row>
	      <el-row>
	        <el-col :span="24">
	        	<el-form-item label="监测部门">
				    <el-select v-model="sentInfoItem.department" placeholder="">
					   	<el-option v-for="(item,index) in indicatorArr.sentInfo.department" :key="index" :label="item.name" :value="item.name + '~' +item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-col> 
	      </el-row>
	      <el-row>
	        <el-col :span="24">
	        	<el-form-item label="报送频率">
				    <el-select v-model="sentInfoItem.frequency" placeholder="">
					   	<el-option v-for="(item,index) in indicatorArr.sentInfo.frequency" :key="index" :label="item.name" :value="item.name + '~' +item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-col> 
	      </el-row>
	      <el-row>
	        <el-col :span="24">
	        	<el-form-item label="有效期限">
	        		<div class="month" v-if="sentInfoItem.frequency=='月度~1'||sentInfoItem.frequency=='月度'">
	        			<el-select v-model="sentInfoItem.reportDate[0].day" placeholder="请选择"> 
					   		<el-option v-for="item in indicatorArr.sentInfo.day" :key="item.id" :label="item.name" :value="item.id"> 
					   	</el-option> 
					   	</el-select>
					   	<el-select v-model="sentInfoItem.reportDate[0].hour" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.hour" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
	        		</div>
	        		<div class="quarter" v-for="(quarter,index) in sentInfoItem.reportDate" v-if="sentInfoItem.frequency=='季度~2'||sentInfoItem.frequency=='季度'">
				  		<span class="titleCss" v-if="index==0">一季度：</span>
				  		<span class="titleCss" v-if="index==1">二季度：</span>
				  		<span class="titleCss" v-if="index==2">三季度：</span>
				  		<span class="titleCss" v-if="index==3">四季度：</span>
				  		<el-select v-model="quarter.month" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.month" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select v-model="quarter.day" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.day" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select v-model="quarter.hour" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.hour" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  	</div>
				  	<div class="year" v-if="sentInfoItem.frequency=='年度~3'||sentInfoItem.frequency=='年度'">
				  		<el-select v-model="sentInfoItem.reportDate[0].month" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.month" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select v-model="sentInfoItem.reportDate[0].day" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.day" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select v-model="sentInfoItem.reportDate[0].hour" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.hour" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  	</div>
				</el-form-item>
		    </el-col> 
	      </el-row>
	      <el-row>
	        <el-col :span="24">
	        	<el-form-item label="获取类型">
				    <el-select v-model="sentInfoItem.act" placeholder="">
					   	<el-option v-for="(item,index) in indicatorArr.sentInfo.act" :key="index" :label="item.name" :value="item.name + '~' +item.id"></el-option>
					</el-select>
				</el-form-item>
		    </el-col> 
	      </el-row>
	      <div class="btnBox">
	    	<el-button @click="backFunc">取消</el-button>
	  		<el-button type="primary" @click="submitData()">保存</el-button>
	  	  </div>
	    </el-form>
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import Bus from 'src/bus/bus.js'
	import qs from 'qs'
	export default{
		data(){
			return {
				sentInfoItem:{
					company:'',
					department:'',
					frequency:'',
					reportDate:[],
					act:''
				}
			}
		},
		props:['label'],
		methods:{
			...mapActions(['setData']),
			submitData(){
				for(var key in this.sentInfoItem){
				  if(!this.sentInfoItem[key]&&key!='companyName'&&key!='departmentName'){
				  	this.$alert('请将所有字段填写完整')
				  	return;
				  } 
				}
				for(var i = 0; i < this.sentInfoItem.reportDate.length; i++){
					if(this.sentInfoItem.reportDate[i]['hour'].indexOf('00')!=-1){
						this.sentInfoItem.reportDate[i]['hour'] = this.sentInfoItem.reportDate[i]['hour'].substr(0,2)
					}
				}
				var data = {
					sentInfoItem:this.sentInfoItem,
					way:this.label.itemId,
					row:this.label.row
				}
				Bus.$emit('addSentInfo',data)
				this.$emit('closeMask',{status:false})
			},
			backFunc(){
				this.$emit('closeMask',{status:false})
			}
		},
		mounted(){
			//编辑回值
			if(this.label.data){	
				this.sentInfoItem = this.label.data;
			}
		},
		computed:{
			...mapState(['indicatorArr'])
		},
		watch:{
			'sentInfoItem.company':{
				handler(newVal){
					var str = newVal.split('~')[1]
					this.axios.post('/indicator/department',qs.stringify({company:str})).then((res)=>{
	   					if(res.code == 200){
	   						this.setData({'indicatorArr.sentInfo.department':res.data})
	   					}else{
	   						this.$alert('监测部门查询失败！')
	   					}
					})
				}
			},
			'sentInfoItem.frequency':{
				handler(newVal,oldVal){
					if(this.label.data&&!oldVal){
						return
					}else{
						this.sentInfoItem.reportDate = []
					}
					if(newVal == '月度~1'||newVal == '月度'){
						this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.monthArr
					}
					if(newVal == '季度~2'||newVal == '季度'){
						for(var i = 0; i < 4; i++){
							this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.quarterArr
						}
					}
					if(newVal == '年度~3'||newVal == '年度'){
						this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.yearArr
					}
					if(newVal == '半年度~4'||newVal == '半年度'){
						for(var i = 0; i < 2; i++){
							this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.halfyearArr
						}
					}
				}
			}
		}
	}
</script>

<style lang="scss">
#mask{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.4);
	z-index: 100000;
	padding-top: 5%;
	padding-left: 15%;
	padding-right: 100px;
	text-align: center;
	.maskBox{
		position: relative;
		width: 590px;
		padding: 40px 0;
		background: #fff;
		margin:0 auto;
		.el-form{
			padding: 20px 70px 0px 60px;
		}
		.el-form-item__content{
			width: 100%;
		}
		.el-table th{
			background: #F9F9F9;
			color:#777;
		}
		.el-input__inner{
			height: 32px;
			font-size: 12px;
		}
		.el-form-item__content{
			text-indent: 0;
		}
		.el-form-item{
			text-align: left;
		}
		.btnBox{
			button{
				width: 68px;
				height: 26px;
				line-height: 0;
				font-size: 12px;
			}
		}
		.el-form-item__label{
			padding: 0;
			text-align: right;
			font-size: 12px;
			text-indent: 0;
			padding-right: 10px;
		}
		.el-form--inline .el-form-item{
			display: block;
		}
		.el-select,.el-date-editor{
			width: 80%;
		}
		.month .el-select,.month .el-date-editor{
			width: 39.5%;
		}
		.quarter .el-select,.quarter .el-date-editor{
			width: 25.25%;
		}
		.quarter{
			padding-top:4px;
			padding-left:15%;
		}
		.year .el-select,.year .el-date-editor{
			width: 26%;
		}
		.el-textarea__inner{
			height: 150px!important;
			font-size: 12px;
		}
		.fxType .el-form-item__label::before{
	    content: '*';
	    color: #F56C6C;
	    margin-right: 4px;
		}
		.detailBorder{
			.el-input__inner{
				border: none;
			}
		}
	}
}
</style>
