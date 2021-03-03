<template>
	<div id="lossMoney">
		<div class="maskBox">
			<el-tag @close="backFunc" closable></el-tag>
			<div class="orglist">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">机构明细</span></div>
				<el-table :data="orgList" show-summary :summary-method="getSummaries" border style="width: 100%;background: #F9F9F9!important;border-bottom: 1px solid #E9E9E9;">
					<el-table-column label="机构名称" align="center" prop="orgName">
						<template slot-scope="scope">
							<span>{{scope.row.orgName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="金额（万元）" align="center" prop="money">
						<template slot-scope="scope">
							<el-input v-model="scope.row.money" placeholder="请输入金额" @change="((val)=>{getMoney(val,scope.$index,scope.row)})" :disabled="isDisabled" @input="((val)=>{getInput(val,scope.$index,scope.row)})"></el-input>
						</template>
					</el-table-column>
				</el-table>
				<el-button type="primary" class="search" @click="goSave" v-if="!isDisabled" :disabled="isSumbit">提交</el-button>
				<el-button type="primary" class="search" @click="backFunc">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import {formatDateM} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
		props:['isDisabled'],
	    data () {
	    	return {
	    		total:'',
	    		moneyList:{},
	    		orgList:[],
	    		isSumbit:false
	      	}
	    },
	    created () {
	    	if(sessionStorage.getItem('orgList') !== 'undefined'){
	    		this.orgList = JSON.parse(sessionStorage.getItem('orgList'))
	    	} else{
	    		this.isSumbit = true
	    	}
	    },
	    methods: {
	    	getInput(value,index,row){
	    		if (value != '') {
			        if (value.indexOf('.') > -1) {
			        	this.$set(this.orgList[index],'money',value.slice(0, value.indexOf('.') + 7))
			        } else { 
			        	this.$set(this.orgList[index],'money',value)
			        }
			    }
	    	},
	    	backFunc(){
	    		this.$emit('closeMask',{status:false,})
			},
			getMoney(val,index,row){
				if(val == ''||!this.testMoney(val)){
	    			return
	    		} else{
	    			if(this.orgList){
	    				for(var i =0;i<this.orgList.length;i++){
		    				if(this.orgList[i].money){
		    					this.$set(this.moneyList,this.orgList[i].organization,this.orgList[i].money)
		    				}
		    			}
	    			}
	    		}
			},
			goSave(){
				if(JSON.stringify(this.moneyList) == '{}'){
	    			for(var i =0;i<this.orgList.length;i++){
	    				if(this.orgList[i].money){
	    					this.$set(this.moneyList,this.orgList[i].organization,this.orgList[i].money)
	    				}
	    			}
	    		}
	    		if(this.total!=null && this.total!=undefined && this.total.length != 0){
	    			this.$emit('closeMask',{status:false,total:this.total,moneyList:this.moneyList})
	    		} else{
	    			this.$emit('closeMask',{status:false,moneyList:this.moneyList})
	    		}
				
			},
			// 合计
		    getSummaries(param){
		    	const {columns,data} = param
		    	const sums = []
		    	columns.forEach((column,index) => {
		    		if(index === 0){
		    			sums[index] = '合计'
		    			return
		    		} else {
		    			const values = data.map(item=>Number(item[column.property]))
		    			if(!values.every(value=>isNaN(value))){
		    				sums[index] = values.reduce((prev,curr)=>{
		    					const value = Number(curr)
		    					if(!isNaN(value)){
		    						return prev + curr
		    					} else{
		    						return prev
		    					}
		    				},0)
		    				if(sums[index].toString().indexOf(".")>0){
		    					var s = sums[index].toString().split('.')[1]
		    					if(s.length>=6){
		    						sums[index] = parseFloat(sums[index].toFixed(6))
		    					}
		    				}
							this.total = parseFloat(sums[index])
		    			} else{
		    				sums[index] = '--'
		    			}
		    		}
		    	})
		    	return sums
		    },
		    testMoney(val){
	    		const reg = /^\d+$|^\d+\.\d+$/g
	    		if(!reg.test(val)){
    				this.$alert('输入金额包含特殊字符', '提示', {
			        	confirmButtonText: '确定'
			        })
			        return false
    			} else{
    				return true
    			}
	    	},
	    },
	}
</script>

<style lang="scss">
#lossMoney{
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
		cursor:pointer;
		position: relative;
		width: 1000px;
		height:540px;
		overflow-y: auto;
		padding: 40px 0;
		background: #fff;
		margin:0 auto;
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
		.orglist{
			text-align:center;
			font-size:16px;
			padding: 0 50px;
			ul{
				height:400px;
				margin-bottom:50px
			}
			li{
				height:36px;
				line-height:36px
			}
			.orgTitle{
				height: 26px;
				line-height:26px;
				margin-bottom:30px
			}
			.search{
			    width: 68px;
			    height: 26px;
			    margin-right: 5px;
			    margin-top:30px;
			    padding:0;
		    	font-size: 12px;
			}
			.el-input .el-input__inner{
				border:none;
				background:none;
				text-align:center
			}
		}
		.titIcon{
			text-align:left;
			font-size:16px;
			margin-bottom:30px;
			em{
				display: inline-block;
				width: 2px;
				height: 14px;
				background: #4285F4;
				vertical-align: middle;
				margin-right: 6px;
			}
			span{
				display:inline-block;
				vertical-align:middle;
			}
			.el-icon-question{
				display:inline-block;
				vertical-align:middle;
				font-size:18px;
				color:#4285F4;
				margin-left:5px
			}
		}
	}
}	
</style>
