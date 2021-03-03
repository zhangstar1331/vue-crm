<template>
	<div id="lossSendCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="lossSendForm" label-position="left" ref="lossSendForm" size="mini">
			        	<el-row>
			                <el-col :span="8">
			                    <el-form-item label="检查开始时间">
								    <el-date-picker v-model="lossSendForm.startDate" @change="changeStartDate" placeholder="开始时间"></el-date-picker>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
			                    <el-form-item label="检查事项名称">
								    <el-input v-model="lossSendForm.name" @change='getName' placeholder="请输入检查事项名称" prefix-icon="el-icon-search"></el-input>
								</el-form-item>
			                </el-col>
			                <el-col :span="8">
								<orgTreeMulti label="被检查机构" ref="orgTreeCX" @orgTreeChange="orgTreeChange" :isFlag="isFlag"></orgTreeMulti>
			                </el-col>
			            </el-row>
			            <el-row>
			                <el-col :span="8">
			                    <el-form-item label="实施主体类型">
			                    	<el-select v-model="subject.region" @change="changeSubject" placeholder="请选择实施主体">
								    	<el-option v-for="item in subject.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
	import {mapState, mapActions} from 'vuex'
	import orgTreeMulti from 'src/components/infoManage/orgTreeMulti'
	import qs from 'qs'
	export default {
		props:['isFlag','isStore','checkList'],
	    data () {
	      return {
	      	lossSendForm:{
	      		name:'',//检查事项名称
	      		company:'全部',//机构
	      		startDate:''
	      	},
	        // 实施主体
	        subject:{
		       	region: '全部',
		       	unitsData:[{
		          	name:'全部'
		        },{
		          	name:'银保监系统',
		          	id:1
		        },{
		          	name:'人民银行',
		          	id:2
		        },{
		          	name:'财政部',
		          	id:3
		        },{
		          	name:'审计署',
		          	id:4
		        },{
		          	name:'其他',
		          	id:5
		        }]
	        },
	        starDatePicker:{
  				disabledDate: (time) => {
	            	return time.getTime() > Date.now()
	          	},
  			},
	        checkData:{
	        	status:"",
	            pageNo:1,
	            pageSize:10
			},
	      }
		},
		components:{
            orgTreeMulti,
		},
		computed:{
			...mapState(['companySource']),
		},
	    mounted () {
			this.checkData.status = this.companySource == "1"?1:this.isFlag
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
	    		this.checkData.status = this.companySource == "1"?1:this.isFlag
	    		this.currentPage = this.checkData.pageNo
	    		if(this.checkData.name){
	    			this.lossSendForm.name = this.checkData.name
	    		}
	    		if(this.checkData.zt){
	    			this.subject.region = this.checkData.zt
	    		}
	    		if(this.checkData.startDate){
	    			this.lossSendForm.startDate = this.checkData.startDate.substring(0,4)+'-'+this.checkData.startDate.substring(4,6)+'-'+this.checkData.startDate.substring(6,8)
	    		}
	    	}
	    	// 获取表格数据
	    	this.searchData(this.checkData)
	    },
	    methods: {
	    	//检查开始时间
	      	changeStartDate(val){
	      		if(val != null){
	      			this.checkData.startDate = formatDate(val,'yyyy-MM-dd')
		  			this.checkData.startDate = this.checkData.startDate.split('-').join('') 
		  		} else{
		  			delete this.checkData.startDate
		  		}
	      	},
	    	// 检查事项名称
	    	getName(val){
	      		if(val == ''){
	      			delete this.checkData.name
	      		} else{
	      			this.checkData.name = val
	      		}
	      	},
	      	// 实施主体
	      	changeSubject(val){
	      		this.checkData.zt = val
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
				// 生效库
				if(this.isFlag == 1||this.companySource == "1"){
					this.checkData.flag = 0
				}
	      		// 获取表格数据
	      		sessionStorage.setItem('askData' + this.isFlag,JSON.stringify(this.checkData))
				this.$emit('changeSessionStorage',{no:0,data:this.checkData})
				data = JSON.parse(JSON.stringify(this.checkData))
				if(data.org&&data.org.indexOf("1_01")>=0){
					this.$set(data,'org','')
				}
	      		this.axios.post('supervise/query',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
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
	    }
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
		margin-left:0
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
	    	background:#ecf5ff
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
