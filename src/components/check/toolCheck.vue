<template>
	<div id="tool">
        <div :class="[flag == '3' ?'box newHeight':'box']">
			<div class="titIcon"><em></em><span style="font-weight: 600;">{{title}}</span></div>
			<el-form :inline="true" :model="logForm" label-position="left" ref="logForm" size="mini">
				<el-row v-if="flag != '4'">
			        <el-col :span="12">
						<el-form-item label="开始批次">
						    <el-date-picker type="month" @change="getStarDate" placeholder="选择批次" v-model="logForm.start" :picker-options="pickerOptions1"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="结束批次">
						    <el-date-picker type="month" @change="getEndDate" placeholder="选择批次" v-model="logForm.end" :picker-options="pickerOptions2"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="flag == '3'">
					<el-col :span="12">
			            <el-form-item label="标记">
			                <el-input placeholder="请输入标记" v-model="logForm.mark" @change="getMark"></el-input>
			            </el-form-item>
		            </el-col>
	            </el-row>
				<el-row v-if="flag != '4'">
					<el-col :span="24">
			            <el-form-item label="指标（组ID）" class="zbid">
			                <el-input type="textarea" :rows="2" placeholder="请输入指标（组ID）" v-model="logForm.indgs" @change="getIndgs"></el-input>
			            </el-form-item>
		            </el-col>
	            </el-row>
	            <el-row v-if="flag == '4'">
			        <el-col :span="12">
						<el-form-item label="批次">
						    <el-date-picker type="month" @change="getStarDate" placeholder="选择批次" v-model="logForm.start" :picker-options="pickerOptions1"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-button type="primary" @click.native="searchData(flag)" class="searchBtn">提交</el-button>
	        </el-form>
	        <div class="toolList" v-if="toolList.length>0">
	        	<ul>
	        		<li v-for="item in toolList">{{item}}</li>
	        	</ul>
	        </div>
		</div>
	</div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {ajax} from 'src/utils/utils.js'
  	import qs from 'qs'
  	import {getUrlKey} from 'src/utils/utils.js'
  	import {mapState} from 'vuex'
	import {formatDate} from 'src/utils/utils.js'
	import {arrRemove} from 'src/utils/utils.js'
	export default {
		props:['flag','title'],
	    data () {
	      	return {
		        logForm: {
		            start:'',
		            end:'',
		            indgs: '',
		            mark:''
		        },
		        logaskData:{
		        	start:'',
		            end:'',
		            indgs: '',
		        },
		        mark:'',
	  			pickerOptions1:{
	  				disabledDate: (time) => {
		            	if (this.logForm.end) {
	                        return time.getTime() > Date.now() || time.getTime() > this.logForm.end;
	                    } else {
	                        return time.getTime() > Date.now();
	                    }
		          	},
	  			},
	  			pickerOptions2:{
	  				disabledDate: (time) => {
		            	return time.getTime() < this.logForm.start || time.getTime() > Date.now();
		          	},
	  			},
	  			toolList:[]
	      	}
	    },
	    created () {
	    	
	    },
	    methods: {
	    	 // 开始时间
	      	getStarDate(val){
      			if(val != null){
      				this.logaskData.start = formatDate(val,'yyyy-MM');
      				this.logaskData.start = this.logaskData.start.split('-').join('')
      			}else{
      				this.logaskData.start = '';
      			}
	      	},
	      	// 结束时间
	      	getEndDate(val){
	     		if(val != null){
      				this.logaskData.end = formatDate(val,'yyyy-MM');
      				this.logaskData.end = this.logaskData.end.split('-').join('')
      			}else{
      				this.logaskData.end = '';
      			}
	     	},
	     	// 员工工号
	      	getIndgs(val){
	      		this.logaskData.indgs = val
	      	},
	      	getMark(val){
	      		this.mark = val
	      	},
	      	searchData (flag) {
	      		if(flag == '4'){
	      			if(this.logaskData.start == ''){
		      			this.$alert('批次不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
		      		}
	      		} else {
	      			if(this.logaskData.start == ''){
		      			this.$alert('开始批次不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
		      		}
		      		if(this.logaskData.end == ''){
		      			this.$alert('结束批次不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
		      		}  
		      		if(this.logaskData.indgs == ''){
		      			this.$alert('指标（组ID）不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
		      		}  
	      		}
	      		var postUrl = ''
	      		switch(flag){
	      			case 1:
	      				postUrl = 'indm/add'
	      			    break;
	      			case 2:
	      				postUrl = 'indm/del'
	      			    break;
	      			case 3:
	      				postUrl = 'indm/edit'
	      			    break;
	      			case 4:
	      				postUrl = 'indjob/create?batch='+this.logaskData.start
	      			    break;
	      		}
	      		var params = qs.stringify()
	      		if(flag == '3'){
	      			params = qs.stringify({
			        	start: this.logaskData.start,
			        	end:this.logaskData.end,
			        	indgs: this.logaskData.indgs,
			        	f:this.mark,
		        	})
	        	} else if(flag == '4') {
	      			params = qs.stringify()
	        	} else {
	      			params = qs.stringify({
			        	start: this.logaskData.start,
			        	end:this.logaskData.end,
			        	indgs: this.logaskData.indgs,
		        	})
	        	}
	      		this.axios.post(postUrl,params).then((res)=>{
	      			if(res.code == 200){
	      				this.$alert('提交成功', '提示', {
					      	confirmButtonText: '确定',
					      	callback: action => {
					      		this.toolList = res.data
					      	}
					    })
	      			} else{
	      				this.$alert(res.message, '提示', {
				          confirmButtonText: '确定'
				        })
	      			}
				})
	      	},
	    }
	  }
</script>
<style lang="scss">
	#tool{
    	.box{
	    	min-height: 220px;
	    	background: #fff;
	    	padding: 16px 16px 30px 16px;
	    	-webkit-box-shadow: 4px 2px 6px #888;
	    	margin-top: 2px;
	    	margin-bottom:20px;
	    	border-radius: 8px;
	    	.titIcon{
	    		font-size:14px;
	    		margin-bottom:30px;
	    		em{
	    			display: inline-block;
	    			width: 2px;
	    			height: 14px;
	    			background: #4285F4;
	    			vertical-align: middle;
	    			margin-right: 6px;
	    		}
	    	}
	    }
	    .newHeight{
	    	min-height: 270px!important;
	    }
	    .tbox{
	    	padding-bottom:50px;
	    }
	    .searchBtn,.saveBtn{
			width: 68px;
			height: 28px;
			line-height: 1px;
			margin-left:120px;
		}
		.el-form-item__label{
			width:120px;
			height:32px;
			line-height:32px;
			padding:0 20px 0 0;
			text-align:justify
		}
		.el-form-item label:after {
	        content: " ";
	        display: inline-block;
	        width: 100%;
	    }
		.el-form-item .el-form-item__content{
			width:70%;
			display:inline-block;
			vertical-align:top;
		}
		.el-form--inline .el-form-item{
			width:100%
		}
		.el-date-editor.el-input, .el-date-editor.el-input__inner{
			width:100%
		}
		.zbid{
	    	.el-form-item__content{
				width:calc(calc(50% - 120px) + 120px + 35%)!important;
			}
	    }
		textarea{
			height:auto;
			resize:none
		}
		.toolList{
			cursor:pointer;
			padding-left:120px;
			margin-top:30px;
			width:calc(calc(50% - 120px) + 120px + 35%);
			height:200px;
			overflow:scroll;
			ul{
				display:inline-block;
				vertical-align:top;
				width:100%;
				li{
					margin-bottom:5px
				}
			}
		}
    }
</style>
