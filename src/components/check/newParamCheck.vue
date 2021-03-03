<template>
	<div id="newPramsCheck">
		<el-form ref="form" size="mini" :inline="true">
	      <template>
		    <div>
		        <el-form :model="dengmiQueryForm" label-position="left" ref="dengmiQueryForm" class="demo-ruleForm" size="mini">
		            <el-row>
		            	<el-col :span="8">
		                    <el-form-item label="参数名称" >
		                        <el-input v-model="paramDatas.name" @change="getInputName" placeholder="请输入参数名称"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8">
		                    <el-form-item label="参数单位" >
							    <el-select v-model="placeDatas.region" @change="changeSelect" placeholder="请选择参数单位">
							    	<el-option v-for="item in placeDatas.unitsData" :key="item.label" :label="item.value" :value="item.label"> </el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		                <el-col :span="8">
		                	 <el-form-item label="参数来源" >
							    <el-select v-model="orgnize.region" @change="changeFrom" placeholder="请选择参数来源">
							    	<el-option v-for="item in orgnize.unitsData" :key="item.value" :label="item.name" :value="item.value"> </el-option>
							    </el-select>
							</el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		                <el-col :span="8">
		                    <el-form-item id="person" label="创建部门" class="iptPerson">
		                        <el-input v-model="dengmiQueryForm.orgName" disabled placeholder="请输入录入人员"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8" id="creadMan">
		                    <el-form-item label="创建人" class="iptPerson">
		                        <el-input v-model="dengmiQueryForm.userName" disabled placeholder="请输入录入人员"></el-input>
		                    </el-form-item>
		                </el-col>
		                <el-col :span="8"></el-col>
		            </el-row>
		        </el-form>
		    </div>
		</template>
	    </el-form-item>
	   </el-form>
	</div>
</template>

<script>
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
	  	created() {
			var id = this.$route.query.editId;
	  		if(id != undefined){
	  			var singleObj = JSON.parse(sessionStorage.getItem('singleObj'))
	  			if(singleObj.source == '手工填写'){
	  				this.paramDatas.source = '1';
	  			}else{
	  				this.paramDatas.source = '2';
	  			}
	  			if(singleObj.unit == '%'){
	  				this.paramDatas.unit = '1';
	  			}else if(singleObj.unit == '无单位'){
	  				this.paramDatas.unit = '3';
	  			}
	  			this.paramDatas.id = id;
	  			this.paramDatas.name = singleObj.name;
	  			this.orgnize.region = singleObj.source;
	  			this.placeDatas.region = singleObj.unit;
	  			//更新提交时候的数据
	  			sessionStorage.setItem('paramDatas',JSON.stringify(this.paramDatas))
	  		}
		  	this.axios.post('riskparam/userMsg',JSON.stringify({}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
		  			if(res.code == '200'){
			  			this.dengmiQueryForm.orgName = res.data.ornName;
			  			this.dengmiQueryForm.userName = res.data.userName;
		  			}
				})
	    },
	    data () {
	      return {
	        formData: {},
	        form: {},
	        orgnize: {
	          user: '',
	          region: '',
	          unitsData:[{
	          	name:'手工填写',
	          	value:'1'
	          },{
	          	name:'系统对接',
	          	value:'2'
	          }]
	        },
	        zhiduNo :{
	           user: '',
		       region: '',
		       unitsData:[]
	        },
	        searchJobType: [],
	        oldSearchJobType: [],
	        placeDatas:{
	        	user: '',
		        region: '',
		        unitsData:[
		            {label: '1', value: '%'},
		            {label: '2', value: '次 / 季度'},
		            {label: '4', value: '年'},
		            {label: '5', value: '元'},
		            {label: '6', value: '次 / 月'},
		            {label: '7', value: '件 / 月'},
		            {label: '8', value: '件 / 季'},
		            {label: '10', value: '次 / 年'},
		            {label: '11', value: '件 / 年'},
		            {label: '12', value: 'PT'},
		            {label: '3', value: '无单位'},
	        	],
	        },
	        dengmiQueryForm: {
	            orgName:'',
	            userName:''
	        },
	        //缓存所有保存数据
	        paramDatas:{
	        	id:'',
	        	name:'', //参数名称
	        	unit:'', //参数单位
	        	source:'', // 参数来源
	        	pageNo:'1',
	      		pageSize:'10'
	        }
	      }
	    },
	    methods: {
	      changeFrom(val){
	      	this.paramDatas.source = val;
	      	sessionStorage.setItem('paramDatas',JSON.stringify(this.paramDatas))
	      },
	      getInputName(val){
	      	this.paramDatas.name = val;
	      	sessionStorage.setItem('paramDatas',JSON.stringify(this.paramDatas))
	      },
	     changeSelect(val) {
	     	this.paramDatas.unit = val;
	     	sessionStorage.setItem('paramDatas',JSON.stringify(this.paramDatas))
	     }
	  },
	    watch: {
	      'formData': {
	        handler: function (newVal, oldVal) {
	        },
	        deep: true
	      }
	    }
	}
</script>

<style lang="scss">
#person .el-form-item__label::before{
	content:''
}
#newPramsCheck{
	.el-form-item__label{
		padding:0 3% 0 2%;
	}
	#creadMan .el-form-item__label{
		padding-left: 4.6%;
	}
	.el-form-item__label::before{
	    content: '*';
	    color: #F56C6C;
	    margin-right: 4px;
	}
	.zdNo .el-form-item__content .el-select{
	    width: 42%;
	  }
	.insselect-tree .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
	    height: auto;
	    max-height: 274px;
	    overflow:visible !important;
	    background:#FFF
    }
    .insselect-tree .el-tree-node__label{
		font-weight: normal
    }
    .el-col{
		text-align: center;
	}
	.el-col:first-child{
		text-align: left;
	}
	.el-col:last-child{
		text-align: right;
	}
	.el-col:first-child .el-form-item__label{
		padding-left: 0;
	}
	.search{
		float: right;
	    width: 68px;
	    height: 26px;
	    margin-right: 5px;
	    padding:0;
	}
	.zdNo .el-form-item__label{
		padding-left: 5%;
		padding-right: 4%;
	}
	.zdNo .el-form-item__content .el-select{
		width: 50%;
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
	.iptPerson label::before,.wgAddress label::before{
		color: #fff;
	}
}    
</style>
