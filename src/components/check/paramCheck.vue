<template>
	<div id="paramCheck">
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div>
		        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
		            <el-row>
		                <el-col :span="20">
		                   <el-form-item label="参数来源">
							    <el-select v-model="SuitObj.region" @change="changeSuit" placeholder="请选择参数来源">
							    	<el-option v-for="item in SuitObj.unitsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
							    </el-select>
							</el-form-item>
		                    <el-form-item label="创建时间">
							     <el-date-picker type="date" @change="changeDate" placeholder="选择日期" v-model="form.date1"></el-date-picker>
							</el-form-item>
							<el-form-item label="参数名称">
		                        <el-input v-model="paramName" @change = 'changeName' placeholder="请输入参数名称">
		                        </el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="4" style="text-align: right;">
		                	<el-button type="primary" @click.native="searchData" class="saveBtn">查询</el-button>
		                    <el-button type="primary" @click.native="goNewBuild" class="saveBtn" v-if="btnData.addbtn">新建参数</el-button>
		                </el-col>
		            </el-row>
		        </el-form>
		    </div>
		</template>
	   </el-form>
	</div>
</template>

<script>
	import {ajax} from 'src/utils/utils.js'
  	import {statusCode} from 'src/utils/utils.js'
  	import qs from 'qs'
  	import {getUrlKey} from 'src/utils/utils.js'
  	import {mapState} from 'vuex'
	import {formatDate} from 'src/utils/utils.js'
	import {arrRemove} from 'src/utils/utils.js'
	export default {
		props:['flag'],
	    data () {
	      return {
	      	paramName:'',
	        formData: {},
	        form: {},
	        dengmiQueryForm: {
	            wgOrgnize:'',
	            wgName:'',
	            wgFile:''
	        },
	        SuitObj: {
	          user: '',
	          region: '全部',
	          unitsData:[{
	          	name:'全部',
	          	code:''
	          },{
	          	name:'手工填写',
	          	code:'1'
	          },{
	          	name:'系统对接',
	          	code:'2'
	          }]
	        },
	        askData:{
	      		name:'', //参数名称
	        	createDate:'', //参数单位
	        	source:'', // 参数来源
	      		pageNo:'1',
	      		pageSize:'10'
	        },
	        handleData:[], //操作数据
  			btnData:{   //按钮显示隐藏
  				addbtn: false
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
	  		},
	  		'formData': {
		        handler: function (newVal, oldVal) {
		        },
		        deep: true
		    }
	  	},
	    created () {
	    	this.getData(this.$store.state.orgBtnData)
	    },
	    methods: {
	      searchData () {
	      	this.$emit('searchData',this.askData)
	      },
	      goNewBuild(){
	      	this.$router.push({
  				path: '/paramRegulations',
  				query:{
  					id: getUrlKey('id')
  				}
  			})
	      },
	      changeSuit(val){
	      		this.askData.source = val;
	      },
	      changeDate(val){
	      		if(val != null){
	      			this.askData.createDate = formatDate(val,'yyyy-MM-dd');
	      		}else{
	      			this.askData.createDate = '';
	      		}
	      },
	      changeName(val){
	      		this.askData.name = val;
	      },
	      // 返回页面时加载数据
		  getData(handleData){
	    	if(handleData !== undefined){
            	if(handleData.indexOf('1_icsgla')>=0){//新建
            		this.btnData.addbtn = true
            	}else{
            		this.btnData.addbtn = false
            	}
            }
	    },
	    }
	  }
</script>
<style lang="scss">
#paramCheck .el-form-item__content{
	width:220px;
}	
#paramCheck .el-input{
	width: 220px;
}
#paramCheck .el-form-item--mini.el-form-item{
	width: auto!important
}
#paramCheck .el-input-group__append{
	background: #4285F4;
    width: 20%;
    text-align: center;
    font-size: 16px;
    color: #fff;
}
#paramCheck .saveBtn{
	width: 68px;
	height: 26px;
	line-height: 1px;
	font-size: 12px;
	padding:0;
}
</style>
