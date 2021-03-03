<template>
	<div id="orgSearch">
		<div class="maskBox">
			<el-tag @close="backFunc" closable></el-tag>
			<div class="orglist">
				<div class="orgTitle">
					<span>共计{{searchResult.totalResults}}条结果</span>
					<el-button type="primary" class="search" @click="goSave">保存</el-button>
					<el-button type="primary" class="search" @click="backFunc">返回</el-button>
				</div>
				<ul>
					<li v-for="item in resData">
						<el-checkbox-group v-model="checked" @change="getId(item.name)">
							<el-checkbox :label="item.groupId" :key="item.groupId" :title="item.fullName">{{item.fullName}}</el-checkbox>
						</el-checkbox-group>
					</li>
				</ul>
			</div>
			<el-pagination background layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
		</div>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import {formatDateM} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
		props:['searchResult','chooseType'],
	    data () {
	    	return {
	    		currentPage:1,
		        resData:[],
		        totalResults:0,
		        pageNumber: 1,
		        pageSize: 10,
		        checked:[],
		        orgName:'',
		        orgNamelist:[]
	      	}
	    },
	    created () {
	    	this.resData = this.searchResult.data
	    	this.totalResults = this.searchResult.totalResults
	    	this.currentPage = 1;
	    },
	    methods: {
	    	backFunc(){
				this.$emit('closeMask',{status:false})
			},
			handleSizeChange (value) {
		        this.pageNumber = value;
	        	this.searchData()
		    },
		    handleCurrentChange (value) {
		        this.pageNumber = value;
	        	this.searchData()
		    },
		    getId(name){
		    	if(this.chooseType == 1){
		    		this.orgName = name
		    		this.checked = this.checked.splice(this.checked.length-1,1)
		    	} else{
		    		this.orgNamelist.push(name)
		    	}
		    	this.checked.join(',')
		    },
		    searchData(val){
				var params = qs.stringify({
					name: this.searchResult.orgName,
		        	type: 7,
		        	pageNumber: this.pageNumber,
		        	pageSize: 10,
		        	status:1
		        })
				this.axios.post('/rmUser/searchGroup',params).then((res)=>{
		            if(res.code == 200){
		            	this.resData = res.data == undefined?[]:res.data.data
		            	this.totalResults = res.data == undefined?0:res.data.totalResults
		            }else{
		              	this.$alert(res.message, '提示', {
		                  confirmButtonText: '确定'
		                })
		            }
		        })
			},
			goSave(){
				if(this.checked.length>0){
					this.$emit('closeMask',{status:false,orgChecked:this.checked.toString(),orgName:this.orgName,oindex:this.searchResult.oindex,index:this.searchResult.index,type:this.searchResult.type,orgNamelist:this.orgNamelist})
				} else{
					this.$emit('closeMask',{status:false})
				}
			}
	    }
	}
</script>

<style lang="scss">
#orgSearch{
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
			text-align:left;
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
		}
		.el-checkbox__label{
			color:#606266!important;
		}
		.search{
			float: right;
		    width: 68px;
		    height: 26px;
		    margin-right: 5px;
		    margin-top:0;
		    padding:0;
	    	font-size: 12px;
		}
	}
}	
</style>
