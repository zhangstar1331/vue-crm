<template>
	<div id="formFocusCheck">
		<el-form ref="form" size="mini" :inline="true">
	      	<template>
			    <div class="ids">
			        <el-form :model="focusForm" label-position="left" ref="focusForm" size="mini">
			            <el-row>
		                    <el-form-item label="适用对象">
							    <el-select v-model="application.region" @change="changeApply" placeholder="请选择适用对象">
							    	<el-option v-for="item in application.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							    </el-select>
							</el-form-item>
		                    <el-form-item label="货币单位">
							    <el-select v-model="money.region" @change="changeMoney" placeholder="请选择检测部门">
							    	<el-option v-for="item in money.unitsData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="报送批次">
							    <el-date-picker v-model="batch" @change="changeBatch" type="month" placeholder="报送批次" :picker-options="endDatePicker"> </el-date-picker>
							</el-form-item>
							<el-button type="primary" class="saveBtn" @click="searchData">查询</el-button>
						    <el-button type="primary" class="saveBtn" @click="goExport" :disabled="isBtn" v-if="btnData.exportbtn">导出</el-button>
			            </el-row>
			        </el-form>
			    </div>
			</template>
	   </el-form>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
		props:['isFlag'],
	    data () {
	      return {
	      	focusForm:{},
	      	// 适用对象
	        application:{
	          	region: '中华财险',
	          	unitsData:[{
		          	name:'中华财险',
		          	id:'102'
		        },{
		          	name:'中华人寿',
		          	id:'103'
		        }]
	        },
	        // 报送部门
	        money:{
		       	region: '万元',
		       	unitsData:[{
		          	name:'元',
		          	id:'1',
		          	disabled: true
		        },{
		          	name:'万元',
		          	id:'2'
		        },{
		          	name:'亿元',
		          	id:'3',
		          	disabled: true
		        }]
	        },
	        // 报送批次
	        batch:'',
	        endDatePicker:this.processDate(),
	        checkData:{
	            type:2,//类型
	            applayObject:'102',//适用对象 
	            batch:null,//报送批次
	            money:'2',//货币单位
	        },
	        isBtn:false,
	        handleData:[],
	        btnData:{   //按钮显示隐藏
  				exportbtn: false
  			},
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
	    created () {
	    	// 初始日期
	   		var date = new Date
	   		var year = date.getFullYear()
	   		var month = date.getMonth()
	   		if (month >= 1 && month <= 9) {
	            month = "0" + month
	        }
	        if(month == 0){
	        	year = year -1
	        	month = 12
	        }
	        this.batch = year + '-' + month
	    	this.checkData.batch = (year + '' + month)
	    	if(this.isFlag == '1'){
      			this.checkData.type = 2
      			this.checkData.applayObject = '102'
      			this.application = {
      				region: '中华财险',
      				unitsData: [{
			          	name:'中华财险',
			          	id:'102'
			        },{
			          	name:'中华人寿',
			          	id:'103'
			        }]
			    }
			    if(this.$route.query.reinsureBatch){
	      			this.batch = this.$route.query.reinsureBatch.substring(0,4)+ '-' + this.$route.query.reinsureBatch.substring(4,6)
	      			this.checkData.batch = this.$route.query.reinsureBatch
	      		}
	      		if(sessionStorage.getItem('jzdhandleData')){
	      			var handleData = sessionStorage.getItem('jzdhandleData')
	      			if(handleData.indexOf('1_ijzdbbte')>=0){//导出
	            		this.btnData.exportbtn = true
	            	}else{
	            		this.btnData.exportbtn = false
	            	}
      			} else{
      				this.getData(this.$store.state.orgBtnData)
      			}
      		} else if(this.isFlag == '2'){
      			this.checkData.type = 1
      			this.checkData.applayObject = '104'
      			this.application = {
		          	region: '资管中心',
		          	unitsData: [{
			          	name:'资管中心',
			          	id:'104'
			        }]
		        }
		        if(this.$route.query.investBatch){
	      			this.batch = this.$route.query.investBatch.substring(0,4)+ '-' + this.$route.query.investBatch.substring(4,6)
	      			this.checkData.batch = this.$route.query.investBatch
	      		}
	      		if(sessionStorage.getItem('jzdhandleData')){
	      			var handleData = sessionStorage.getItem('jzdhandleData')
	      			if(handleData.indexOf('1_ijzdbbe')>=0){//导出
	            		this.btnData.exportbtn = true
	            	}else{
	            		this.btnData.exportbtn = false
	            	}
      			} else{
      				this.getData(this.$store.state.orgBtnData)
      			}
      		}
	        this.searchData()
	    },
	    methods: {
	    	// 返回页面时加载数据
		    getData(handleData){
		    	if(handleData !== undefined){
		    		if(this.isFlag == '1'){
		      			if(handleData.indexOf('1_ijzdbbe')>=0){//导出
		            		this.btnData.exportbtn = true
		            	}else{
		            		this.btnData.exportbtn = false
		            	}
		      		} else if(this.isFlag == '2'){
		      			if(handleData.indexOf('1_ijzdbbte')>=0){//导出
		            		this.btnData.exportbtn = true
		            	}else{
		            		this.btnData.exportbtn = false
		            	}
		      		}
	            }
		    },
	      	//适用对象
	      	changeApply(val){
	      		this.isBtn = true
	      		this.checkData.applayObject = val
	      	},
	      	// 货币单位
	      	changeMoney(val){
	      		this.isBtn = true
	      		this.checkData.money = val
	      	},
	      	//报送批次
	      	changeBatch(val){
	      		this.isBtn = true
	      		if(val != null){
		  			this.checkData.batch = formatDate(val,'yyyy-MM')
		  			this.checkData.batch = this.checkData.batch.split('-').join('')
		  		} else{
		  			this.checkData.batch = ''
		  		}
	      	},
			// 报送批次
	      	processDate(){
		        return {
		          disabledDate(time){
		            return time.getTime() > new Date(new Date().getFullYear()+'-'+new Date().getMonth()+'-01').getTime()////开始时间不选时，结束时间最大值小于等于当天
		          }
		        }
		    },
			searchData () {
				if(this.checkData.batch == ''){
					this.$alert('报送批次不能为空', '提示', {
	                  confirmButtonText: '确定'
	                })
	                return
				}
				this.isBtn = false
	      		// 获取表格数据
	      		this.axios.post('/concentrate/getConcentrateForm',qs.stringify(this.checkData)).then((res)=>{
		            if(res.code == 200){
		            	Bus.$emit('formFouseDatas',res.data)
		            }else{
		              	this.$alert(res.message, '提示', {
		                  confirmButtonText: '确定'
		                })
		            }
		        })
	      	},
	      	// 导出
			goExport(){
				var params = qs.stringify({
		        	type: this.checkData.type,
		        	applayObject: this.checkData.applayObject,
		        	batch: this.checkData.batch
		        })
				this.axios.post('/concentrate/exporConcentrate',params,{responseType:'arraybuffer'}).then((res)=>{
					if(this.isFlag == '1'){
						var filename = "再保人集中度报表.xlsx"
					} else if(this.isFlag == '2'){
						var filename = "投资集中度报表.xlsx"
					}
	              	this.fileDownload(res, filename);
	    		})
			},
			fileDownload(data, fileName) {
		      	let blob = new Blob([data], {
		        	type: "application/octet-stream"
		      	})
		      	let filename = fileName || "filename.xls";
		      	if (typeof window.navigator.msSaveBlob !== "undefined") {
		        	window.navigator.msSaveBlob(blob, filename);
		      	} else {
			        var blobURL = window.URL.createObjectURL(blob);
			        var tempLink = document.createElement("a");
			        tempLink.style.display = "none";
			        tempLink.href = blobURL;
			        tempLink.setAttribute("download", filename);
			        if (typeof tempLink.download === "undefined") {
			          tempLink.setAttribute("target", "_blank");
			        }
			        document.body.appendChild(tempLink);
			        tempLink.click();
			        document.body.removeChild(tempLink);
			        window.URL.revokeObjectURL(blobURL);
		      	}
		    },
	    }
	}
</script>

<style lang="scss">
#formFocusCheck{
	.el-form-item--mini.el-form-item{
		width: auto!important;
		margin-right:18px;
		margin-bottom: 28px;
	}
  	.el-input-group__append{
	  	background: #4285F4;
	    width: 20%;
	    text-align: center;
	    font-size: 16px;
	    color: #fff;
	}
	.el-table__body, .el-table__footer, .el-table__header{
		border-collapse: collapse
	}
	.el-col .el-input input{
		height: 32px;
		line-height: 32px;
	}
	.el-form-item__content{
		width:auto
	}
	.el-input .el-input__inner{
		height:32px;
		line-height:32px;
	}
	.el-form-item__label{
		font-weight: normal;
		padding:0 12px 0 0
	}
	.saveBtn{
	    width: 68px;
	    height: 26px;
	    margin-top:3px;
	    margin-left:15px;
	    padding:0;
    	font-size: 12px;
	}
	.el-form-item__content{
		width:auto
	}
	.el-select .el-input{
		width:180px;
	}
}	
</style>
