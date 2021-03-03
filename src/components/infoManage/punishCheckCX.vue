<template>
	<div id="lossSendCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="lossSendForm" label-position="left" ref="lossSendForm" size="mini">
			        	<el-row>
			                <el-col :span="isNotice == 1?12:8">
			                    <el-form-item label="处罚事由名称">
								    <el-input v-model="lossSendForm.cause" @change='getCause' placeholder="请输入处罚事由名称" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
			                </el-col>
			                <el-col :span="isNotice == 1?12:8">
			                    <el-form-item label="实施主体类型">
			                    	<el-select v-model="lossSendForm.subject" @change="changeSubject" placeholder="请选择实施主体">
								    	<el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			                <el-col :span="isNotice == 1?12:8">
								<orgTreeMulti label="被处罚机构" ref="orgTreeCX" @orgTreeChange="orgTreeChange" :isFlag="isFlag"></orgTreeMulti>
			                </el-col>
							<el-col :span="isNotice == 1?12:8">
			                    <el-form-item label="处罚类型">
			                    	<el-select v-model="lossSendForm.punishType" @change="changePunishType" placeholder="请选择处罚类型">
								    	<el-option v-for="item in punishList" :key="item.id" :label="item.name" :value="item.id"></el-option>
								    </el-select>
								</el-form-item>
			                </el-col>
			            </el-row>
			        </el-form>
			    </div>
			    <el-button type="primary" class="search" @click="goSearch">查询</el-button>
			</template>
	   </el-form>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import {formatDateM} from 'src/utils/utils.js'
	import orgTreeMulti from 'src/components/infoManage/orgTreeMulti'
	import {mapState, mapActions} from 'vuex'
	import qs from 'qs'
	export default {
		props:['isFlag','isStore','checkList','isNotice'],
	    data () {
	      return {
	      	lossSendForm:{
	      		cause:'',//检查事项名称
				company:'全部',//机构
				subject: '全部',
				punishType: '全部',
	      	},
	        checkData:{
	        	status:this.isNotice == 1?1:this.isFlag,
	        	flag:0,
	            pageNo:1,
	            pageSize:10,
	        },
	        treeKey:'',
			insprops:{
  				label: 'name',
  				children: 'zones',
  				isLeaf: 'leaf',
  				id:'',
  				name:'',
  				node:{},
  				resolve:{},
  				value:"id"
  			},
  			isShow:false,
  			searchResult:'',
  			mineStatus:[],
  			viewList:[],
  			arrLabel:[],
  			copy:[],
  			visible:false
	      }
	    },
	    mounted () {
	    	if(this.checkList){
	    		sessionStorage.setItem('askData'+this.isFlag,JSON.stringify(this.checkList))
	    	}
    		if(this.isStore!==undefined){
    			this.checkData.ref = 1
    		}
    		if(this.$route.query.company!==undefined){
    			if(JSON.parse(sessionStorage.getItem('askData'+this.isFlag))){
    				this.checkData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
    			}
    		}
	    	if(JSON.parse(sessionStorage.getItem('askData'+this.isFlag))){
	    		this.checkData = JSON.parse(sessionStorage.getItem('askData'+this.isFlag))
	    		this.checkData.status = this.isNotice == 1?1:this.isFlag
	    		this.currentPage = this.checkData.pageNo
	    		if(this.checkData.cause){
	    			this.lossSendForm.cause = this.checkData.cause
	    		}
	    		if(this.checkData.subjectType){
					this.$set(this.lossSendForm,"subject",this.checkData.subjectType)
	    		}
				if(this.checkData.punishType){
					this.$set(this.lossSendForm,"punishType",this.checkData.punishType)
	    		}
	    	}
	    	// 获取表格数据
	    	this.searchData(this.checkData)
	    },
	    components:{
	    	orgTreeMulti
		},
		computed:{
			...mapState(['subjectList','punishList'])
		},
	    methods: {
	    	// 处罚事由名称
	    	getCause(val){
	      		if(val == ''){
	      			delete this.checkData.cause
	      		} else{
	      			this.checkData.cause = val
	      		}
	      	},
	      	// 实施主体
	      	changeSubject(val){
	      		this.checkData.subjectType = val
			},
			changePunishType(val){
	      		this.checkData.punishType = val
			},
			orgTreeChange(data){
		    	if(data.orgName){
		    		this.$set(this.lossSendForm,'company',data.orgName)
				}
				if(data.orgChecked||data.orgChecked==''){
		    		this.$set(this.checkData,'org',data.orgChecked)
		    	}
				if(data.mineStatus){
		    		this.$set(this.checkData,'mineStatus',data.mineStatus)
		    	}
			},
			searchData (data) {
				sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(this.checkData))
				this.$emit('changeSessionStorage',{no:1,data:this.checkData})
	      		data = JSON.parse(JSON.stringify(this.checkData))
				if(data.org&&data.org.indexOf("1_01")>=0){
					this.$set(data,'org','')
				}
	      		this.axios.post('cx_penalize/query',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
		            if(res.code == 200){
		            	if(res.data != null){
	      					Bus.$emit('formDatas',res.data)
	      				}
		            }else{
		              	this.$alert(res.message, '提示', {
		                	confirmButtonText: '确定'
		                })
		            }
		        })
	      	},
	      	// 查询按钮
		    goSearch(){
				this.checkData.pageNo = 1
				this.checkData.pageSize = 10
				this.currentPage = 1
				delete this.checkData.ref
				this.searchData(this.checkData)
			},
	    },
	}
</script>

<style lang="scss">
#lossSendCheck{
  	.el-input-group__append{
	  	background: #4285F4;
	    width: 20%;
	    text-align: center;
	    font-size: 16px;
	    color: #fff;
	}
	.el-col .el-input input{
		height: 32px;
		line-height: 32px;
	}
	.el-form{
		min-height:auto!important
	}
	.el-form-item{
		margin-right:18px;
		margin-bottom: 20px;
		width: 100%;
		.el-form-item__content{
			width: 70%;
			.el-select--mini{
				width: 100%;
			}
			.el-date-editor{
				width: 100%;
			}
		}
	}
	.el-form-item__label{
		width:28%;
		line-height:32px;
		font-weight: normal;
		padding:0 4% 0 0;
		text-align:right
	}
	.newwidth .el-form-item__label{
		padding:0
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-top:20px;
	    margin-right: 5px;
	    padding:0;
    	font-size: 12px;
	}
	.el-select__tags .el-select__input.is-mini{
		border:none;
		background:none;
		margin-left:0;
		color: transparent!important;
		caret-color:#606266;
	}
	.searchBtn .el-form-item__content{
		font-size:0;
		.commonBtn{
			display:inline-block;
			margin-right:0;
			width:50px;
			height:32px;
			line-height:32px;
		    padding:0;
	    	font-size: 12px;
		}
	}
	.searchBtn .el-select{
		width:calc(100% - 50px)!important
	}
	.searchBtn .el-icon-search:before{
		color:#606266
	} 
}	
</style>
