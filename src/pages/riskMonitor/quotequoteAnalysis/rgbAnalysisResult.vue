<template>
  	<div id="analysisResult">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">风险指标分析</span></el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">风险监测评价结果</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="风险监测评价结果" name="first" :key="'first'" v-if="btnData.resultBtn"> 
		        <v-sysList :batch="batch" v-if="isChildUpdate1"></v-syslist>
			</el-tab-pane>
			<el-tab-pane label="红黄蓝风险监测结果分布" name="second" :key="'second'" v-if="false"> 
		        <t-sysList v-if="isChildUpdate2"></t-syslist>
			</el-tab-pane>
		</el-tabs>
  	</div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import Bus from 'src/bus/bus.js'
	import vSysList from 'src/components/sysList/rgbResultList'
	import tSysList from 'src/components/sysList/rgbResultListFb'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	activeName:'first',
        	tab1:true,
        	tab2:true,
        	isChildUpdate1:true,
	        isChildUpdate2:false,
    		totalResults:0,
    		tableData4:[],
          	batch:'',
          	endDatePicker:this.processDate(),
		    defaultData:[],
	        checkData:{
          		batch:null
          	},
          	btnData:{
	        	resultBtn:false,
	        	spreadBtn:false
	        }
		}
   	},
   	computed:{
  		f1(){
  			return this.$store.state.orgBtnData
  		}
  	},
  	watch:{
  		f1(newdata,olddata){
  			this.getData(newdata)
  		}
  	},
    created(){
    	this.getData(this.$store.state.orgBtnData)
    },
    components:{
		vSysList,
		tSysList
    },
    methods:{
    	// 权限
    	getData(handleData){
	    	if(handleData !== undefined){
	    		if(handleData.indexOf('1_ihhlzbjcpjjgl')>=0){//评价结果
            		this.btnData.resultBtn = true
            	}else{
            		this.btnData.resultBtn = false
            	}
		  		if(handleData.indexOf('1_ihhlzbjcpjjgdl')>=0){//结果分布
  					if(!this.btnData.resultBtn){
  						this.activeName = 'second'
  						this.handleClick({name:'second'})
  					}
					this.btnData.spreadBtn = true
            	}else{
            		this.btnData.spreadBtn = false
            	}
	        }
		},
    	handleClick(tab) {
	       if(tab.name == "first") {
	            this.isChildUpdate1 = true
	            this.isChildUpdate2 = false
	            this.titMsg = "红黄蓝风险监测评价结果"
	        } else if(tab.name == "second") {
	            this.isChildUpdate1 = false
	            this.isChildUpdate2 = true
	            this.titMsg = "红黄蓝风险监测结果分布"
	        }
	    },
	    getBatch(val){
	    	if(val != null){
	  			this.checkData.batch = formatDate(val,'yyyy-MM');
	  			this.checkData.batch = this.checkData.batch.split('-').join('')
	  		}else{
	  			this.checkData.batch = '';
	  		}
		},
	    processDate(){
	        return {
	          disabledDate(time){
	            return time.getTime() > new Date(new Date().getFullYear()+'-'+new Date().getMonth()+'-01').getTime()
	          }
	        }
	      }
  	}
}    
</script>
<style lang="scss">
    #analysisResult{
    	#tab-first,#tab-second{
	      	background: #fff;
	      	width: 172px;
	      	border-top-left-radius: 8px;
	      	border-top-right-radius: 8px;
	      	border-right: 1px solid #E9E9E9;
	    }
	    .box{
	      	min-height: 180px;
	      	background: #fff;
	      	padding: 16px 16px 16px 16px;
	      	-webkit-box-shadow: 4px 2px 6px #888;
	      	margin-top: 2px;
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
    	.saveBtn{
			width: 68px;
			height: 26px;
			line-height: 1px;
			padding: 0;
			font-size: 12px;
		}
    	table tr:last-child td{
			border-bottom: none
		}
		.el-table::before{
			background-color: transparent!important
		}
		.el-table .cell{
	  		cursor:pointer
	  	}
    	th{
    		background: #F9F9F9;
		    color: #909399;
		    font-weight: bold;
    	}
    	.el-breadcrumb{
    		margin-bottom: 30px;
    		margin-top: 20px;
    	}
    	.el-tabs__content{
    		-webkit-box-shadow: 1px 0px 6px #888;
    		border-radius: 8px;
    	}
    	.el-table__empty-block{
    		background: #fff;
    		width: 100%!important;
    	}
	    .el-pagination{
	    	margin-top: 30px;
	    }
	    .el-tabs__header{
		  	margin:0;
		  }
	    .el-tabs__item{
	    	padding:0;
	    	width: 100px;
	    	text-align: center;
	    }
	    .el-tabs__active-bar{
	    	display: none;
	    }
    	.is-active{
	    	background: #4285F4!important;
	    	color: #fff!important;
	    	text-align: center;
	    }
	    .handleBtn{
	    	display: inline-block;
	    	padding: 0 5px
	    }
	    .handleBtn:hover{
	    	cursor: pointer;
	    }
	    .el-breadcrumb__inner{
	    	color: #4285F4!important;
	    	font-weight: 700!important;
	    }
	    .is-link{
	    	color: #909191!important;
	    }
	    .wgTxtColor span{
	    	color: #909191 !important;
	    	font-weight: 700;
	    }
	    .textOverFlow{
			width: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.el-input__inner{
			width: 220px;
			height: 28px;
			line-height: 28px;
		}
		.el-input__icon{
			line-height: 28px;
		}
    }
</style>
