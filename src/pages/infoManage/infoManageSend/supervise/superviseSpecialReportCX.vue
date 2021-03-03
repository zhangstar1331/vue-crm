<template>
  	<el-container id="infoSpecialReport">
	  	<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span class="textColor1">合规信息管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor1" @click="goback">合规信息报送</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor">{{titMsg}}</span></el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="9">
					<el-button type="primary" size="mini" class="commonBtn" @click="goback">返回</el-button>
					<el-button type="primary" size="mini" class="commonBtn" @click="goSave">保存</el-button>
					<el-button type="primary" size="mini" class="commonBtn" @click="goSubmit">提交</el-button>
			  	</el-col>
		  	</el-row>
	  	</el-header>
	  	<!-- :rules="rules" -->  		
		<div class="contList firstBox">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">基本信息</span></div>
			<el-steps :active="active" finish-status="success" align-center>
			  	<el-step title="基础信息"></el-step>
			  	<el-step title="结果跟进"></el-step>
			  	<el-step title="整改情况"></el-step>
			  	<el-step title="问责情况"></el-step>
			</el-steps>
			<!-- 第一步 -->
			<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" style="text-align:center;" v-show="active == 0" class="addStar">
				<el-form-item label="检查事项">
	        		<el-input v-model="infoSpecial.base.thingName" placeholder="请输入检查事项名称" @change="((val)=>{getInputData(val,'thingName','base')})" :disabled="isDisabled[0]" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="实施主体类型">
				    <el-select v-model="subject.region" @change="((val)=>{getInputData(val,'subjectType','base')})" placeholder="请选择实施主体类型" :disabled="isDisabled[0]">
						<el-option v-for="item in subject.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>		
				</el-form-item>
				<el-form-item label="实施主体名称">
	        		<el-input v-model="infoSpecial.base.name" placeholder="请输入实施主体名称" @change="((val)=>{getInputData(val,'name','base')})" :disabled="isDisabled[0]" maxlength="50"></el-input>
				</el-form-item>
	        	<el-form-item label="检查开始时间">
				    <el-date-picker type="date" @change="getstartDate" placeholder="选择日期" v-model="infoSpecial.base.startDate" :picker-options="starDatePicker" :disabled="isDisabled[0]"></el-date-picker>
				</el-form-item>
	        	<el-form-item label="检查结束时间" class="noStar">
				    <el-date-picker type="date" @change="getendDate" placeholder="选择日期" v-model="infoSpecial.base.endDate" :picker-options="endDatePicker" :disabled="isDisabled[0]"></el-date-picker>			
				</el-form-item>
				<org-treeCX label="被检查机构" ref="orgTreeCX" :disabled="isDisabled[0]" @orgTreeChange="orgTreeChange"></org-treeCX>
				<el-form-item label="险种">
	        		<el-select v-model="infoSpecial.base.insuranceType" placeholder="请选择险种" :disabled="isDisabled[0]" @change="((val)=>{getInputData(val,'insuranceType','base')})">
						<el-option v-for="item in insureList" :label="item.name" :value="item.id" :key="item.id"></el-option>
					</el-select>
					<el-input v-model="infoSpecial.base.otherInsurance" placeholder="请输入其他险种" @change="((val)=>{getInputData(val,'otherInsurance','base')})" :disabled="isDisabled[0]" maxlength="50" v-if="infoSpecial.base.insuranceType == '9'" style="margin-top:15px"></el-input>
				</el-form-item>
				<el-form-item label="文号" class="noStar">
	        		<el-input v-model="infoSpecial.base.fileNo" placeholder="请输入文号" @change="((val)=>{getInputData(val,'fileNo','base')})" :disabled="isDisabled[0]" maxlength="50"></el-input>
				</el-form-item>
	        	<el-form-item label="文号时间" class="noStar">
				    <el-date-picker type="date" @change="getfileDate" placeholder="选择日期" v-model="infoSpecial.base.fileDate" :disabled="isDisabled[0]"></el-date-picker>
				</el-form-item>
				<el-form-item label="附件" class="noStar">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],0)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[0]">
						<el-button type="primary" size="mini" class="commonBtn" @click="curRowIndex=active" :disabled="isDisabled[0]">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>
							2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>
							3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
	      	</el-form>
	      	<!-- 第二步 -->
	      	<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" style="text-align:center;" v-if="active == 1">
				<el-form-item label="检查结果跟进">
				    <el-select v-model="infoSpecial.result.type" @change="((val)=>{getInputData(val,'type','result')})" placeholder="请选择检查结果" :disabled="isDisabled[1]">
						<el-option v-for="item in rTypeList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
					</el-select>
					<el-input v-model="infoSpecial.result.otherDescription" placeholder="请输入其他监管措施或文件" @change="((val)=>{getInputData(val,'otherDescription','result')})" maxlength="500" :disabled="isDisabled[1]" v-if="infoSpecial.result.type == '7'" style="margin-top:15px"></el-input>		
				</el-form-item>
				<el-form-item label="监管意见">
	        		<el-input type="textarea" v-model="infoSpecial.result.description" placeholder="请输入监管意见" @change="((val)=>{getInputData(val,'description','result')})" maxlength="500" :disabled="isDisabled[1]"></el-input>
				</el-form-item>
				<el-form-item label="备注">
	        		<el-input type="textarea" v-model="infoSpecial.result.mark" placeholder="请输入备注" @change="((val)=>{getInputData(val,'mark','result')})" maxlength="500" :disabled="isDisabled[1]"></el-input>
				</el-form-item>
				<el-form-item label="进展情况说明">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],1)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[1]">
						<el-button slot="trigger" type="primary" size="mini" class="commonBtn" @click="curRowIndex=active" :disabled="isDisabled[1]">上传附件</el-button>
						<div class="enter">
							<em>录入行政告知书</em><el-button type="primary" size="mini" class="commonBtn" @click="goEnter(1)" :disabled="this.checkData.result == undefined || this.checkData.result.type == undefined || this.checkData.result.type != '2' || isDisabled[1]" v-if="!this.infoSpecial.relation">录入告知书</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goEnter(1)" :disabled="!this.infoSpecial.relationId||this.checkData.result.type != '2'" v-if="this.infoSpecial.relation&&this.infoSpecial.relation!== null">录入告知书</el-button>
						</div>
						<div class="enter">
							<em>录入处罚信息</em><el-button type="primary" size="mini" class="commonBtn" @click="goEnter(0)" :disabled="this.checkData.result == undefined || this.checkData.result.type == undefined || this.checkData.result.type == '1' || this.checkData.result.type == '2' || isDisabled[1]" v-if="!this.infoSpecial.relation">录入处罚1</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goEnter(0)" :disabled="!this.infoSpecial.relationId||this.checkData.result.type == '1' || this.checkData.result.type == '2'" v-if="this.infoSpecial.relation&&this.infoSpecial.relation!== null">录入处罚2</el-button>
						</div>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
	      	</el-form>
	      	<!-- 第三步 -->
	      	<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" style="text-align:center;" v-if="active == 2">
				<el-form-item label="是否整改">
					<el-radio-group v-model="infoSpecial.abarbeitung.type" @change="((val)=>{getInputData(val,'type','abarbeitung')})" :disabled="isDisabled[2]">
					    <el-radio label="1">是</el-radio>
					    <el-radio label="0">否</el-radio>
					</el-radio-group>		
				</el-form-item>
				<el-form-item label="整改情况">
	        		<el-input type="textarea" v-model="infoSpecial.abarbeitung.description" placeholder="请输入整改情况" @change="((val)=>{getInputData(val,'description','abarbeitung')})" maxlength="500" :disabled="isDisabled[2]"></el-input>
				</el-form-item>
				<el-form-item label="附件">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],2)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[2]">
						<el-button type="primary" size="mini" @click="curRowIndex=active" class="commonBtn" :disabled="isDisabled[2]">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
	      	</el-form>
	      	<!-- 第四步 -->
	      	<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" style="text-align:center;" v-if="active == 3">
	      		<el-form-item label="是否问责">
				    <el-radio-group v-model="infoSpecial.duty.type" @change="((val)=>{getInputData(val,'type','duty')})" :disabled="isDisabled[3]">
					    <el-radio label="1">是</el-radio>
					    <el-radio label="0">否</el-radio>
					</el-radio-group>	
				</el-form-item>
				<el-form-item label="问责情况">
	        		<el-input type="textarea" v-model="infoSpecial.duty.description" placeholder="请输入问责情况" @change="((val)=>{getInputData(val,'description','duty')})" maxlength="500" :disabled="isDisabled[3]"></el-input>
				</el-form-item>
				<el-form-item label="附件">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],3)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[3]">
						<el-button type="primary" size="mini" @click="curRowIndex=active" class="commonBtn" :disabled="isDisabled[3]">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
	      	</el-form>
	      	<el-row>
		  		<el-col :span="24" align="center">
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goPrevious" v-if="active!==0">返回修改</el-button>
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goNext" v-if="active!==3">下一步</el-button>
		  		</el-col>
		  	</el-row>
		</div>
  	</el-container>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate,fileTypeDiffer} from 'src/utils/utils.js'
	import OrgTreeCX from '../../../../components/infoManage/orgTreeCX.vue'
	import qs from 'qs'
  	export default {
	  	data() {
	  		// 验证
	  		var checkName = (rule, value, callback) => {
	  			if (value === '') {
		          	callback(new Error('事件名称不能为空'));
		        } else {
		        	const reg = /^[\u4e00-\u9faf\s•·.]+$/
		          	if (reg.test(value)) {
		            	callback();
		          	} else {
		            	return callback(new Error('姓名包含特殊字符'));
		          	}
		        }
	  		};
	  		var checkstartDate = (rule, value, callback) => {
	  			if (value === '') {
		          	callback(new Error('事件发生时间不能为空'));
		        }
	  		};
	        return {
	        	active: 0,
	          	titMsg:"新建监管检查事项信息",
	          	isDisabled:[false,false,false,false],
	          	curRowIndex:'',
	          	isEnter:[false,false],
	          	//查询数据
	          	checkData:{
	          		base:{},
	          		result:{},
	          		duty:{},
	          		abarbeitung:{},
	          	},
	          	infoSpecial:{
	          		base:{
	          			thingName:"",//检查事项
				        name:"",//实施主体
				        startDate:"",//开始时间
				        endDate:"",//结束时间
						organization:"",//被检查机构
						fileNo:"",//文号
						fileDate:"",//文号时间
						insuranceType:"",//险种
						otherInsurance:"",//其他险种
	          		},
	          		result:{
						type:"",
						description:"",
						otherDescription:"",
						mask:""
	          		},
	          		abarbeitung:{
	          			type:"",
	          			description:''
	          		},
	          		duty:{
	          			type:"",
	          			description:''
	          		},
		        },
		        // 实施主体
		        subject:{
			       	region: '',
			       	unitsData:[{
			          	name:'银保监系统',
			          	id:'1'
			        },{
			          	name:'人民银行',
			          	id:'2'
			        },{
			          	name:'财政部',
			          	id:'3'
			        },{
			          	name:'审计署',
			          	id: '4'
			        },{
			          	name:'其他',
			          	id:'5'
			        }]
		        },
		        starDatePicker:{
	  				disabledDate: (time) => {
		            	if (this.infoSpecial.base.endDate) {
	                        return time.getTime() > this.infoSpecial.base.endDate;
	                    }
		          	},
	  			},
	  			endDatePicker:{
	  				disabledDate: (time) => {
		            	return time.getTime() < this.infoSpecial.base.startDate
		            	// return time.getTime() < this.infoSpecial.base.startDate || time.getTime() > Date.now()
		          	},
	  			},
		       	// 附件
		       	evidenceFiles:[],
		       	fileList0:[],
		       	fileList1:[],
		       	fileList2:[],
		       	fileList3:[],
		       	companyList:{},
		       	rules:{
		       		name: [
	  					{validator: checkName, trigger: 'blur' }
	  				],
	  				startDate: [
	  					{validator: checkstartDate, trigger: 'blur' }
	  				],
		       	},
				requireList:{
					thingName:"检查事项",
					subjectType:"实施主体类型",
					name:"实施主体名称",
					startDate:"检查开始时间",
					organization:"被检查机构",
					insuranceType:"险种"
				},
			}
	   	},
	    created(){
	    	// 编辑页面
	    	if(this.$route.query.flag == 0|| this.$route.query.flag == 2|| this.$route.query.flag == 3){
	    		this.titMsg = "编辑监管检查事项信息"
	    		this.getInfo()
	    	} else if(this.$route.query.flag == 1){
	    		this.active = parseInt(this.$route.query.step)
	    		this.titMsg = "维护监管检查事项信息"
	    		this.isDisabled[0] = true
	    		this.getInfo()
			}
	    },
	    components:{
			OrgTreeCX
		},
		computed:{
			...mapState(['insureList','rTypeList'])
		},
	    methods:{
	    	// 步骤
	    	goNext(){
	    		if (this.active++ > 3) this.active = 3;
	    	},
	    	goPrevious(){
	    		this.active--
	    	},
	  		getInputData(val,name,type){
	    		if(val == ''){
	    			delete this.checkData[type][name]
	    		} else{
					// this.checkData[type][name] = val
					this.$set(this.checkData[type],name,val)
	    		}
	    	},
	    	//检查开始时间
	    	getstartDate(val){
	    		if(val != null){
	    			this.checkData.base.startDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.base.startDate = this.checkData.base.startDate.split('-').join('')
	    		} else{
	    			delete this.checkData.base.startDate
	    		}
	    	},
	    	//检查结束时间
	    	getendDate(val){
	    		if(val != null){
	    			this.checkData.base.endDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.base.endDate = this.checkData.base.endDate.split('-').join('')
	    		} else{
	    			delete this.checkData.base.endDate
	    		}
			},
			getfileDate(val){
	    		if(val != null){
	    			this.checkData.base.fileDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.base.fileDate = this.checkData.base.fileDate.split('-').join('')
	    		} else{
	    			delete this.checkData.base.fileDate
	    		}
	    	},	    	
		    // 返回
	    	goback(){
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'superviseSeasonReportCX',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                			id: this.$route.query.id
			            }
			    	})
	    		} else{
	    			sessionStorage.setItem('supervisePath',this.$route.query.flag)
		    		this.$router.push({
			    		path:'/infoManage/infoManageSend/supervise/superviseSend',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                			id: this.$route.query.id
			            }
			    	})
		    	}
	    	},
		    // 上传附件
		    uploadFile(param){
				var fileObj = param.file;
				var form = new FormData();
				form.append("file", fileObj);
				form.append('type',701)
				this.axios.post('/comm/upload/v2',form).then((res)=>{
					if(res.code == 200){
						let obj = new Object()
						obj.url = res.data.path
						obj.name = res.data.name
						obj.id = res.data.id
						obj.uid = param.file.uid
						let arr = []
						if(this.evidenceFiles[this.curRowIndex]){
							arr = this.evidenceFiles[this.curRowIndex]
						}
						arr.push(obj)
						if(this.curRowIndex == 0){
							this.$set(this.evidenceFiles,this.curRowIndex,arr)
							this.checkData.base.attachment = this.evidenceFiles[this.curRowIndex]
						} else if(this.curRowIndex == 1){
							this.$set(this.evidenceFiles,this.curRowIndex,arr)
							this.checkData.result.attachment = this.evidenceFiles[this.curRowIndex]
						} else if(this.curRowIndex == 2){
							this.$set(this.evidenceFiles,this.curRowIndex,arr)
							this.checkData.abarbeitung.attachment = this.evidenceFiles[this.curRowIndex]
						} else if(this.curRowIndex == 3){
							this.$set(this.evidenceFiles,this.curRowIndex,arr)
							this.checkData.duty.attachment = this.evidenceFiles[this.curRowIndex]
						}
						
					}else if(res.code == 640){
						this.evidenceFiles = []
						this.$alert(res.data.message, '提示', {
				          confirmButtonText: '确定'
				        });
					}
				})
			},
			beforeRemove(file, evidenceFiles) {
				if(file.size / 1024 / 1024 > 49.5){
		    		return;
		    	}
			    return this.$confirm(`确定移除 ${ file.name }附件吗？`);
			},
			handleRemove(file,evidenceFiles,type){
				if(type == 0){
					if(this.evidenceFiles[type]){
						for (var i = 0; i < this.evidenceFiles[type].length; i++) {
							if(this.evidenceFiles[type][i].uid == file.uid){
								this.evidenceFiles[type].splice(i,1)
							}
						}
						this.checkData.base.attachment = this.evidenceFiles[type]
					} else{
						delete this.checkData.base.attachment
					}
				} else if(type == 1){
					if(this.evidenceFiles[type]){
						for (var i = 0; i < this.evidenceFiles[type].length; i++) {
							if(this.evidenceFiles[type][i].uid == file.uid){
								this.evidenceFiles[type].splice(i,1)
							}
						}
						this.checkData.result.attachment = this.evidenceFiles[type]
					} else{
						delete this.checkData.result.attachment
					}
				} else if(type == 2){
					if(this.evidenceFiles[type]){
						for (var i = 0; i < this.evidenceFiles[type].length; i++) {
							if(this.evidenceFiles[type][i].uid == file.uid){
								this.evidenceFiles[type].splice(i,1)
							}
						}
						this.checkData.abarbeitung.attachment = this.evidenceFiles[type]
					} else{
						delete this.checkData.abarbeitung.attachment
					}
				} else if(type == 3){
					if(this.evidenceFiles[type]){
						for (var i = 0; i < this.evidenceFiles[type].length; i++) {
							if(this.evidenceFiles[type][i].uid == file.uid){
								this.evidenceFiles[type].splice(i,1)
							}
						}
						this.checkData.duty.attachment = this.evidenceFiles[type]
					} else{
						delete this.checkData.duty.attachment
					}
				}
			},
			beforeAvatarUpload(file) {
				return fileTypeDiffer(file)
		    },
		    // 提交
	    	goSubmit(){
				var requireArr = ["thingName","subjectType","name","startDate","organization","insuranceType"]
				for(var i = 0;i<requireArr.length;i++){
					if(this.checkData.base[requireArr[i]]==undefined){
						this.$alert(this.requireList[requireArr[i]]+'不能为空', '提示', {
							confirmButtonText: '确定'
						});
						return;
					}
				}
	    		// if(!this.$route.query.flag&&this.checkData.result!==undefined){
				// 	var arr = ['3','4','5','6','7','8']
				// 	if(this.isEnter[0] == false&&arr.indexOf(this.checkData.result.type)>=0){
				// 		this.$alert('请完善处罚信息', '提示', {
				// 			confirmButtonText: '确定'
				// 		});
				// 		return
				// 	} else if(this.isEnter[1] == false&&this.checkData.result.type == '2'){
				// 		this.$alert('请完善告知书信息', '提示', {
				// 			confirmButtonText: '确定'
				// 		});
				// 		return
				// 	}
				// }
	    		if(JSON.stringify(this.checkData.base) == "{}" || this.checkData.base==null){
	    			delete this.checkData.base
	    		}
	    		if(JSON.stringify(this.checkData.result) == "{}" || this.checkData.result==null){
	    			delete this.checkData.result
	    		}
	    		if(JSON.stringify(this.checkData.abarbeitung) == "{}" || this.checkData.abarbeitung==null){
	    			delete this.checkData.abarbeitung
	    		}
	    		if(JSON.stringify(this.checkData.duty) == "{}" || this.checkData.duty==null){
	    			delete this.checkData.duty
	    		}
	    		if(this.$route.query.infoId!==undefined){
	    			this.checkData.id = this.$route.query.infoId
	    		}
	    		// if(this.isEnter[0] == true){
	    		// 	this.$confirm('本条监管检查事项信息将提交，并将进入到监管处罚信息专报页面。', '提示', {
			    //         confirmButtonText: '确定',
			    //         cancelButtonText: '取消',
			    //         type: 'warning'
			    //     }).then(_ => {
	            //   			this.axios.post('cx_supervise/submit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
				// 			if(res.code == 200){
				// 				if(res.data !== null){
				// 		      		// 录入信息
				// 	      			if(this.infoSpecial.relationId){
				// 	    				this.$router.push({
				// 				    		path:'/punishSpecialReport',
				// 				    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				// 				              	infoId:this.infoSpecial.relationId,
				// 					            flag:1,
				// 					            step:0,
				// 					            superviseId:this.infoSpecial.id,
            	// 								id: this.$route.query.id
				// 				            }
				// 				    	})
				// 	    			} else{
				// 	    				this.$router.push({
				// 				    		path:'/punishSpecialReport',
				// 				    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				// 					            superviseId:res.data,
            	// 								id: this.$route.query.id
				// 				            }
				// 				    	})
				// 	    			}
				// 				}
				// 			}else{
				// 				this.$alert(res.message, '提示', {
				// 		        	confirmButtonText: '确定'
				// 		        });
				// 			}
				// 		})	
			    //     })
			    //     .catch(_ => {});
		    	// } else{

		    		this.axios.post('cx_supervise/submit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
						if(res.code == 200){
							this.$alert('提交成功', '提示', {
								confirmButtonText: '确定',
								callback: action => {
									// 录入信息
									if(this.$route.query.flag == 3){//季报
										this.$router.push({
											path:'/superviseSeasonReportCX',
											query:{
												id: this.$route.query.id
											}
										})
									} else{
										sessionStorage.setItem('supervisePath',1)
										this.$router.push({
											path:'/infoManage/infoManageSend/supervise/superviseSend',
											query:{
												id: this.$route.query.id
											}
										})
									}
								}
							});
						}else{
							this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定'
					        });
						}
					})
		    	// }
	    	},
	    	// 保存
	    	goSave(){
	    		if(this.checkData.base.organization == undefined){
    				this.$alert('被检查机构不正确', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
	    		if(JSON.stringify(this.checkData.base) == "{}" || this.checkData.base==null){
	    			delete this.checkData.base
	    		}
	    		if(JSON.stringify(this.checkData.result) == "{}" || this.checkData.result==null){
	    			delete this.checkData.result
	    		}
	    		if(JSON.stringify(this.checkData.abarbeitung) == "{}" || this.checkData.abarbeitung==null){
	    			delete this.checkData.abarbeitung
	    		}
	    		if(JSON.stringify(this.checkData.duty) == "{}" || this.checkData.duty==null){
	    			delete this.checkData.duty
	    		}
	    		if(this.$route.query.infoId!==undefined){
	    			this.checkData.id = this.$route.query.infoId
	    		}
				this.checkData.relationId = this.infoSpecial.relationId
				if(this.isEnter[0] == true){//处罚
	    			this.$confirm('本条监管检查事项信息将保存，并将进入到监管处罚信息专报页面。', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(_ => {
	              			this.axios.post('cx_supervise/save',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
							if(res.code == 200){
								if(res.data !== null){
						      		// 录入信息
					      			if(this.infoSpecial.relationId){
					    				this.$router.push({
								    		path:'/punishSpecialReport',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
								              	infoId:this.infoSpecial.relationId,
									            flag:1,
									            step:0,
									            superviseId:this.infoSpecial.id,
            									id: this.$route.query.id
								            }
								    	})
					    			} else{
					    				this.$router.push({
								    		path:'/punishSpecialReport',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
									            superviseId:res.data,
            									id: this.$route.query.id
								            }
								    	})
					    			}
								}
							}else{
								this.$alert(res.message, '提示', {
						        	confirmButtonText: '确定'
						        });
							}
						})	
			        })
			        .catch(_ => {});
		    	} else if(this.isEnter[1] == true){//告知书
		    		this.$confirm('本条监管检查事项信息将保存，并将进入到行政处罚事先告知书信息专报页面。', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(_ => {
	              			this.axios.post('cx_supervise/save',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
							if(res.code == 200){
								if(res.data !== null){
						      		// 录入信息
					      			if(this.infoSpecial.relationId){
					    				this.$router.push({
								    		path:'/punishNoticeSpecialReport',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
								              	infoId:this.infoSpecial.relationId,
									            flag:1,
									            superviseId:this.infoSpecial.id,
            									id: this.$route.query.id
								            }
								    	})
					    			} else{
					    				this.$router.push({
								    		path:'/punishNoticeSpecialReport',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
									            superviseId:res.data,
            									id: this.$route.query.id
								            }
								    	})
					    			}
								}
							}else{
								this.$alert(res.message, '提示', {
						        	confirmButtonText: '确定'
						        });
							}
						})	
			        })
			        .catch(_ => {});
				} else{
					this.axios.post('cx_supervise/save',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
						if(res.code == 200){
							if(res.data !== null){
								this.$alert('保存成功', '提示', {
									confirmButtonText: '确定',
									callback: action => {
										if(this.$route.query.flag == 3){
											this.$router.push({
												path:'/superviseSeasonReportCX',
												query:{           //路由传参时push和query搭配使用 ，作用时传递参数
													id: this.$route.query.id
												}
											})
										} else{
											this.$router.push({
												path:'/infoManage/infoManageSend/supervise/superviseSend',
												query:{           //路由传参时push和query搭配使用 ，作用时传递参数
													id: this.$route.query.id
												}
											})	
										}			      	
									}
								});
							}
						}else{
							this.$alert(res.message, '提示', {
							confirmButtonText: '确定'
							});
						}
					})
				}
	    	},
	    	// 编辑页面获取数据
	    	getInfo(){
				var flag = ""
				if(this.$route.query.flag == 3){
					flag = 2
				} else{
					flag = this.$route.query.flag
				}
	    		var params = qs.stringify({
			        id: this.$route.query.infoId,
			        status: flag
			    })
	    		this.axios.post('cx_supervise/detail',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
							// 基本信息
							this.infoSpecial = res.data.detail == null?new Object:res.data.detail
							var arr = ['base','result','abarbeitung','duty']
							arr.forEach(item=>{
								if(res.data.detail[item]){
									this.$set(this.infoSpecial,item,res.data.detail[item])
								} else{
									this.$set(this.infoSpecial,item,new Object())
								}
							})
	    					// 接口数据
	    					this.checkData.base = JSON.parse(JSON.stringify(this.infoSpecial.base))
	    					this.checkData.result = JSON.parse(JSON.stringify(this.infoSpecial.result))
	    					this.checkData.abarbeitung = JSON.parse(JSON.stringify(this.infoSpecial.abarbeitung))
	    					this.checkData.duty =JSON.parse(JSON.stringify(this.infoSpecial.duty))
	    					
							this.subject.region = this.infoSpecial.base.subjectType;
    						if(this.infoSpecial.base.startDate){
    							this.infoSpecial.base.startDate = this.timeFormat(this.infoSpecial.base.startDate)
    						}
    						if(this.infoSpecial.base.endDate){
    							this.infoSpecial.base.endDate = this.timeFormat(this.infoSpecial.base.endDate)
							}
							if(this.infoSpecial.base.fileDate){
    							this.infoSpecial.base.fileDate = this.timeFormat(this.infoSpecial.base.fileDate)
    						}
    						if(this.infoSpecial.base.orgName){
								this.infoSpecial.base.organization = this.infoSpecial.base.orgName
								this.$refs.orgTreeCX.infoSpecial.base.organization = this.infoSpecial.base.orgName
    						} else{
								this.$set(this.infoSpecial.base,'organization',this.infoSpecial.base.organization)
								this.$refs.orgTreeCX.infoSpecial.base.organization = this.infoSpecial.base.organization
							}
	    					this.evidenceFiles[0] = this.infoSpecial.base.attachment
	    					this.evidenceFiles[1] = this.infoSpecial.result.attachment
	    					this.evidenceFiles[2] = this.infoSpecial.abarbeitung.attachment
	    					this.evidenceFiles[3] = this.infoSpecial.duty.attachment
	    					// 生效库置灰
	    					if(this.$route.query.flag == 1){
	    						if(res.data.detail.resultStatus == 1){
	    							this.isDisabled[1] = true
	    						}
		    					if(res.data.detail.abarStatus == 1){
	    							this.isDisabled[2] = true
	    						}
	    						if(res.data.detail.dutyStatus == 1){
	    							this.isDisabled[3] = true
	    						}
							}
	    				}
	        		} else {
	        			this.$alert(res.message, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	    	},
	    	goEnter(type){
				this.isEnter[type] = true
	    		if(this.$route.query.flag){
					if(type != 1){//处罚
						if(this.infoSpecial.relationId){
							this.$router.push({
								path:'/punishSpecialReport',
								query:{           //路由传参时push和query搭配使用 ，作用时传递参数
									infoId:this.infoSpecial.relationId,
									flag:this.$route.query.flag,
									step:0,
									superviseId:this.infoSpecial.id,
									id: this.$route.query.id
								}
							})
						} else{
							this.goSave()
						}
					} else{//告知书
						console.log(type)
					}
	    		} else{
					this.goSave()
	    			// this.goSubmit()
	    		}
	    	},
		    orgTreeChange(data){
				if(data.orgChecked){
		    		this.$set(this.checkData.base,'organization',data.orgChecked)
		    	}
		    	if(data.orgName){
		    		this.$set(this.infoSpecial.base,'organization',data.orgName)
		    	}
			},
			timeFormat(str){
				return str.substring(0,4)+'-'+str.substring(4,6)+'-'+str.substring(6,8)
			}
	    },
	    beforeRouteLeave(to,from,next){
		    if(to.name == 'punishSpecialReport'){
		      sessionStorage.removeItem("askData1");
		      sessionStorage.removeItem("askData2");
		    }
		    next()
		},
  	};
</script>
<style lang="scss">
#infoSpecialReport{
	cursor: pointer;
	.header{
		padding-left: 0;
	    padding-right: 2.6%;
	    padding-top: 15px;
	    position: fixed;
	    width: 100%;
	    -webkit-box-shadow: 4px 2px 6px #888;
	    height: 52px;
	    top: 60px;
	    left: 0;
	    background: #fff;
	    z-index: 99999;
		.el-breadcrumb{
			line-height: 30px;
		}
		.textColor1{
			color: #909191 !important;
    		font-weight: 700!important;
		}
		.textColor{
			color: #4285F4 !important;
    		font-weight: 700!important;
		}
		.el-col-9{
			float: right;
			text-align: right;
		}
	}
    .handleBtn{
    	display: inline-block;
    	padding: 0 5px
    }
    .handleBtn:hover{
    	cursor: pointer;
    }
	.contList{
		background: #fff;
		padding: 16px 16px 50px 16px;
		margin-top: 2px;
		margin-bottom:20px;
		-webkit-box-shadow: 4px 2px 6px #888;
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
	.firstBox{
    	margin-top: 75px;
	}
	.el-form{
		min-height:550px
	}
	.el-form-item{
		width:100%
	}
	.el-form-item .el-form-item__content{
		display:inline-block;
		vertical-align:top;
		width:300px;
		min-height:32px;
		line-height:32px;
		text-align:left
	}
	.el-form-item .el-form-item__content .el-select--mini{
		width:100%
	}
	.searchBtn .el-form-item__content{
		height:32px;
		font-size:0;
		.commonBtn{
			display:inline-block;
			margin-right:0;
			margin-top:0;
			width:50px;
			height:32px;
			line-height:32px;
			background:#ecf5ff
		}
	}
	.searchBtn .el-select,.searchBtn .el-input .el-input__inner{
		width:250px;
	}
	.searchBtn .el-icon-search:before{
		color:#606266
	} 
	.el-form-item__label{
		width:120px;
		text-align:right;
		height:32px;
		line-height:32px;
	}
    .moreBtn,.detailBtn{
        color: #4285F4;
        padding: 0 2px;
    }
    .detailBtn:hover,.moreBtn:hover{
        cursor: pointer;
    }
	.el-input .el-input__inner{
		width: 300px;
		height:32px;
		line-height:32px;
	}
	.el-tabs__nav-wrap::after{
		background:none
	}
	.el-date-editor.el-input, .el-date-editor.el-input__inner{
		width:100%
	}
	.commonBtn{
		width: 68px;
	    height: 26px;
	    margin-top:3px;
	    margin-right: 5px;
	    padding:0;
    	font-size: 12px;
	}
	.insselect-tree .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
	    height: auto;
	    max-height: 274px;
	    overflow:visible !important;
	    background:#000
    }
    .insselect-tree .el-tree-node__label{
		font-weight: normal
    }
	textarea{
		height:125px;
		resize:none
	}
	.el-upload--text{
		float: none;
	}
	.upload-demo{
		.el-upload-list__item-name{
			padding-left:0;
			color:#909191
		}
	}
	.el-upload__tip,.el-upload-list,.enter{
		margin-left:-120px;
		color:#909191
	}
	.el-upload__tip{
		font-size:0px;
		span,p{
			display:inline-block;
			vertical-align:top;
			line-height:24px;
			font-size:12px;
		}
	}
	.el-icon-document:before{
		content:"\E77D";
 		-webkit-text-fill-color:#000;
 		-webkit-text-stroke: 0 #000;
	}
	.enter{
		color:#606266;
		margin-top:10px;
		em{
			display:inline-block;
			width:120px;
			font-style:normal;
			text-align:right;
			padding-right:12px;
			box-sizing:border-box
		}
		.commonBtn{
			width:auto;
			padding:0 10px
		}
	}
	.el-steps{
		width:70%;
		height:60px;
		margin:20px auto 40px auto
	}
	.el-step__line{
		height:8px;
		background:#9CC1FF
	}
	.el-step__title.is-process{
		font-weght:normal;
		color:#4285F4
	}
	.el-step__title.is-wait{
		color:#303030
	}
	.el-step__icon-inner{
		display:none
	}
	.el-step__icon{
		width:7px;
		height:7px;
		top:5px;
	}
	.el-step__line-inner{
		color:#909191;
		height:8px;
		border:none;
		background:#D7E6FF
	}
	.el-step__title.is-success{
		color:#909191
	}
	.el-step__head.is-success .el-step__icon.is-text{
		border-color:#F1F6FF
	}
	.el-step__head.is-wait .el-step__icon.is-text{
		border-color:#F1F6FF
	}
	.el-step__head.is-process .el-step__icon{
		width:18px!important;
		height:18px!important;
	}
	.el-step__head.is-process{
		.el-step__icon.is-text{
			border:4px solid;
			border-color:#F8FBFF!important;
			background:#4285F4 
		}
		.el-step__icon.is-text:after{
			content:'';
			width:0;
			height:0;
			margin-top:20px;
			border-top:6px solid #4285F4;
			border-left:3px solid transparent;
			border-right:3px solid transparent;
		}
	}
	.el-steps .el-step:first-child .el-step__icon,.el-steps .el-step:last-child .el-step__icon{
		width:10px;
		height:10px;
		top:6px;
		border-color:#4285F4
	}
	.el-step__main{
		position: absolute;
		bottom:0;
		left:50%;
		width:100px;
		margin-left:-50px
	}
	.addStar{
		.el-form-item__label::before{
			content:'*';
			color:#F56C6C;
			margin-right:4px
		}
	}
	.noStar .el-form-item__label::before{
		content:''!important
	}
	.el-input__icon{
		line-height: 32px;
	}
}	

</style>
