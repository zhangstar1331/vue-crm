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
			<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" style="text-align:center;" v-if="active == 0" class="addStar">
				<el-form-item label="检查事项">
	        		<el-input v-model="infoSpecial.base.thingName" placeholder="请输入检查事项名称" @change="getthingName" :disabled="isDisabled[0]" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="实施主体类型">
				    <el-select v-model="subject.region" @change="changebType" placeholder="请选择实施主体类型" :disabled="isDisabled[0]">
						<el-option v-for="item in subject.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>		
				</el-form-item>
				<el-form-item label="实施主体名称">
	        		<el-input v-model="infoSpecial.base.name" placeholder="请输入实施主体名称" @change="getname" :disabled="isDisabled[0]" maxlength="50"></el-input>
				</el-form-item>
	        	<el-form-item label="检查开始时间">
				    <el-date-picker type="date" @change="getstartDate" placeholder="选择日期" v-model="infoSpecial.base.startDate" :picker-options="starDatePicker" :disabled="isDisabled[0]"></el-date-picker>
				</el-form-item>
	        	<el-form-item label="检查结束时间" class="noStar">
				    <el-date-picker type="date" @change="getendDate" placeholder="选择日期" v-model="infoSpecial.base.endDate" :picker-options="endDatePicker" :disabled="isDisabled[0]"></el-date-picker>			
				</el-form-item>
				<el-form-item label="被检查机构" class="searchBtn">
					<el-select v-model="infoSpecial.base.organization" placeholder="请选择被检查机构" :disabled="isDisabled[0]" ref="searchSelect" filterable :filter-method="keyFilter" @focus="selectFoucus" @visible-change="visibleChange">
						<el-option :value="infoSpecial.base.organization" style="height:auto;background:#FFF">
							<el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
						</el-option>
					</el-select>
					<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg" :disabled="isDisabled[0]"></el-button>
				</el-form-item>
				<el-form-item label="四级机构" class="noStar">
	        		<el-input v-model="infoSpecial.base.fourthOrganization" placeholder="请输入四级机构" @change="getfourthOrganization" :disabled="isDisabled[0]" maxlength="50"></el-input>
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
				    <el-select v-model="rType.region" @change="changeRtype" placeholder="请选择检查结果" :disabled="isDisabled[1]">
						<el-option v-for="item in rType.unitsData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
					</el-select>		
				</el-form-item>
				<el-form-item label="监管意见">
	        		<el-input type="textarea" v-model="infoSpecial.result.description" placeholder="请输入监管意见" @change="getRdescription" maxlength="500" :disabled="isDisabled[1]"></el-input>
				</el-form-item>
				<el-form-item label="附件">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],1)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[1]">
						<el-button slot="trigger" type="primary" size="mini" class="commonBtn" @click="curRowIndex=active" :disabled="isDisabled[1]">上传附件</el-button>
						<div class="enter">
							<em>录入处罚信息</em><el-button type="primary" size="mini" class="commonBtn" @click="goEnter" :disabled="this.checkData.result == undefined || this.checkData.result.type == undefined || this.checkData.result.type == 2 || this.checkData.result.type == 3 || isDisabled[1]" v-if="!this.infoSpecial.relation">录入信息</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goEnter" :disabled="!this.infoSpecial.penalizeId||this.checkData.result.type == 2 || this.checkData.result.type == 3" v-if="this.infoSpecial.relation&&this.infoSpecial.relation!== null">录入信息</el-button>
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
					<el-radio-group v-model="infoSpecial.abarbeitung.type" @change="changeAtype" :disabled="isDisabled[2]">
					    <el-radio label="1">是</el-radio>
					    <el-radio label="0">否</el-radio>
					</el-radio-group>		
				</el-form-item>
				<el-form-item label="整改情况">
	        		<el-input type="textarea" v-model="infoSpecial.abarbeitung.description" placeholder="请输入整改情况" @change="getAdescription" maxlength="500" :disabled="isDisabled[2]"></el-input>
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
				    <el-radio-group v-model="infoSpecial.duty.type" @change="changeDtype" :disabled="isDisabled[3]">
					    <el-radio label="1">是</el-radio>
					    <el-radio label="0">否</el-radio>
					</el-radio-group>	
				</el-form-item>
				<el-form-item label="问责情况">
	        		<el-input type="textarea" v-model="infoSpecial.duty.description" placeholder="请输入问责情况" @change="getDdescription" maxlength="500" :disabled="isDisabled[3]"></el-input>
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
		<org-search :searchResult="searchResult" :chooseType="1" v-if="isShow" @closeMask="closeMaskTable"></org-search>
  	</el-container>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate,fileTypeDiffer} from 'src/utils/utils.js'
	import orgSearch from 'src/components/infoManage/orgSearch'
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
	          	isEnter:false,
	          	//查询数据
	          	checkData:{
	          		base:{},
	          		result:{},
	          		duty:{},
	          		abarbeitung:{},
	          	},
	          	infoSpecial:{
	          		base:{
	          			thingName:'',//检查事项
				        name:'',//实施主体
				        startDate:'',//开始时间
				        endDate:'',//结束时间
				        organization:'',//被检查机构
				        fourthOrganization:'',//四级机构
	          		},
	          		result:{
	          			description:''
	          		},
	          		abarbeitung:{
	          			type:'',
	          			description:''
	          		},
	          		duty:{
	          			type:'',
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
	          	// 检查结果跟进
		        rType:{
			       	region: '',
			       	unitsData:[{
			          	name:'受到行政处罚或其他监管措施',
			          	id:'1'
			        },{
			          	name:'未受到处罚',
			          	id:'2'
			        },{
			          	name:'暂未收到检查反馈',
			          	id:'3'
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
		       	isShow:false,
  				searchResult:'',
  				visible:false
			}
	   	},
	    created(){
	    	// 编辑页面
	    	if(this.$route.query.flag == 0|| this.$route.query.flag == 3){
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
	    	orgSearch
	    },
	    methods:{
	    	// 步骤
	    	goNext(){
	    		if (this.active++ > 3) this.active = 3;
	    	},
	    	goPrevious(){
	    		this.active--
	    	},
	    	handleNodeClick(node,data) {
//				let res = this.$refs.tree.getCurrentNode(true,true)
//				this.infoSpecial.base.organization = res.name
//				this.checkData.base.organization = node.groupId
					if(node.disabled!=true){
	      			let res = this.$refs.tree.getCurrentNode(true,true)
							this.infoSpecial.base.organization = res.name
							if(node.groupId!==''){
										this.checkData.base.organization = node.groupId
				      		} else{
				      			delete this.checkData.base.organization
				      		}
	      		}
			},
			getNodeInfo(node,resolve) {

			},
			connectAxios(val,node,resolve){
	  			this.node = node
			  	this.resolve = resolve
	  			var params = qs.stringify({
			        parentId: val,
			        type:7
			    })
		        this.axios.post('/rmUser/groupName', params).then((res)=>{
		        	var arr = []
	                if(res.data.data != null){
			          	for (var i = 0; i < res.data.data.length; i++) {
			           	var obj = new Object;
			           	obj.name = res.data.data[i].name;
			           	obj.groupId = res.data.data[i].groupId;
			           	if(res.data.notCheck != null){
			           		for (var j = 0; j < res.data.notCheck.length; j++){
			           			if(res.data.notCheck[j] == res.data.data[i].groupId){
			           				obj.disabled = true
			           			}
			           		}
			           	}
			           	arr.push(obj);
			          } 
	                }
					resolve(arr)
		        })
	  		},
	    	loadNode(node,resolve){
	    		if(this.$route.query.flag !== 1){
		  			if (node.level == 0) {
		  				this.connectAxios('1_01',node,resolve)
			        }else{
			        	var mid = node.data.groupId === undefined?'1_01':node.data.groupId
			  			this.connectAxios(mid,node,resolve)
					}
				}
	  		},
//	    	loadNode(node,resolve){
//	  			if (node.level == 0) {
//	  				this.node = node
//				  	this.resolve = resolve
//		        	this.axios.post('/rmUser/groupName').then((res)=>{
//			       		var arr = [];
//		                if(res.data != null){
//				          	for (var i = 0; i < res.data.length; i++) {
//					           	var obj = new Object;
//					           	obj.name = res.data[i].name;
//					           	obj.groupId = res.data[i].groupId;
//					           	arr.push(obj);
//				          	} 
//		                }
//						resolve(arr)
//			      	})
//		        }else{
//	  				var mid = node.data.groupId === undefined?'':node.data.groupId
//	  				this.node = node
//				  	this.resolve = resolve
//		  			var params = qs.stringify({
//				        groupId: mid,
//				        status:1
//				    })
//		        	this.axios.post('lossincident/namesByPids', params).then((res)=>{
//			       		var arr = [];
//		                if(res.data != null){
//				          	for (var i = 0; i < res.data.length; i++) {
//					           	var obj = new Object;
//					           	obj.name = res.data[i].name;
//					           	obj.groupId = res.data[i].groupId;
//					           	arr.push(obj);
//				          	} 
//		                }
//						resolve(arr)
//			      	})
//				}
//	  		},
	  		getthingName(val){
	  			if(val == ''){
	    			delete this.checkData.base.thingName
	    		} else{
	    			this.checkData.base.thingName = val
	    		}
	  		},
	  		// 事件类型
	    	changebType(val){
	    		this.checkData.base.bType = val
	    	},
	  		getname(val){
	  			if(val == ''){
	    			delete this.checkData.base.name
	    		} else{
	    			this.checkData.base.name = val
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
	    	getfourthOrganization(val){
	    		if(val == ''){
	    			delete this.checkData.base.fourthOrganization
	    		} else{
	    			this.checkData.base.fourthOrganization = val
	    		}
	    	},
	    	// 检查结果跟进
	    	changeRtype(val){
	    		this.checkData.result.type = val
	    	},
	    	// 监管意见
	    	getRdescription(val){
	  			if(val == ''){
	    			delete this.checkData.result.description
	    		} else{
	    			this.checkData.result.description = val
	    		}
	  		},
	  		// 是否整改
	    	changeAtype(val){
	    		this.checkData.abarbeitung.type = val
	    	},
	  		// 整改情况
	    	getAdescription(val){
	  			if(val == ''){
	    			delete this.checkData.abarbeitung.description
	    		} else{
	    			this.checkData.abarbeitung.description = val
	    		}
	  		},
	  		// 是否问责
	    	changeDtype(val){
	    		this.checkData.duty.type = val
	    	},
	  		// 问责情况
	    	getDdescription(val){
	  			if(val == ''){
	    			delete this.checkData.duty.description
	    		} else{
	    			this.checkData.duty.description = val
	    		}
	  		},
				    	
		    // 返回
	    	goback(){
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'superviseSeasonReport',
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
				this.axios.post('/comm/upload/701',form).then((res)=>{
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
	    		// 判断为空
	    		if(this.checkData.base.thingName == undefined){
    				this.$alert('检查事项不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.bType == undefined){
    				this.$alert('实施主体类型不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.name == undefined){
    				this.$alert('实施主体名称不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.startDate == undefined){
    				this.$alert('检查开始时间不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.organization == undefined){
    				this.$alert('被检查机构不正确', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
	    		if(!this.$route.query.flag&&this.checkData.result!==undefined&&this.checkData.result.type == 1&&this.isEnter == false){
	    			this.$alert('请完善处罚信息', '提示', {
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
	    		if(this.isEnter == true){
	    			this.$confirm('本条监管检查事项信息将提交，并将进入到监管处罚信息专报页面。', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(_ => {
	              			this.axios.post('supervise/submit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
							if(res.code == 200){
								if(res.data !== null){
						      		// 录入信息
					      			if(this.infoSpecial.penalizeId){
					    				this.$router.push({
								    		path:'/punishSpecialReport',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
								              	infoId:this.infoSpecial.penalizeId,
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
		    	} else{
		    		this.axios.post('supervise/submit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
						if(res.code == 200){
							if(res.data !== null){
								this.$alert('提交成功', '提示', {
							    	confirmButtonText: '确定',
							      	callback: action => {
							      		// 录入信息
							      		if(this.$route.query.flag == 3){//季报
							    			this.$router.push({
									    		path:'/superviseSeasonReport',
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
							}
						}else{
							this.$alert(res.message, '提示', {
					        	confirmButtonText: '确定'
					        });
						}
					})
		    	}
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
	    		
	    		this.checkData.penalizeId = this.infoSpecial.penalizeId
	    		this.axios.post('supervise/save',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
					if(res.code == 200){
						if(res.data !== null){
							this.$alert('保存成功', '提示', {
						    	confirmButtonText: '确定',
						      	callback: action => {
						      		if(this.$route.query.flag == 3){
						    			this.$router.push({
								    		path:'/superviseSeasonReport',
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
	    	},
	    	// 编辑页面获取数据
	    	getInfo(){
	    		var params = qs.stringify({
			        id: this.$route.query.infoId,
			        flag: this.$route.query.flag
			    })
	    		this.axios.post('supervise/detail',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					// 基本信息
	    					this.infoSpecial = res.data == null?new Object:res.data
	    					this.infoSpecial.base = res.data.base == null?new Object:res.data.base
	    					this.infoSpecial.result = res.data.result == null?new Object:res.data.result
	    					this.infoSpecial.abarbeitung = res.data.abarbeitung == null?new Object:res.data.abarbeitung
	    					this.infoSpecial.duty = res.data.duty == null?new Object:res.data.duty
	    					// 接口数据
	    					this.checkData.base = JSON.parse(JSON.stringify(this.infoSpecial.base))
	    					this.checkData.result = JSON.parse(JSON.stringify(this.infoSpecial.result))
	    					this.checkData.abarbeitung = JSON.parse(JSON.stringify(this.infoSpecial.abarbeitung))
	    					this.checkData.duty =JSON.parse(JSON.stringify(this.infoSpecial.duty))
	    					
    						this.subject.region = this.infoSpecial.base.bType;
    						if(this.infoSpecial.base.startDate){
    							this.infoSpecial.base.startDate = this.infoSpecial.base.startDate.substring(0,4)+'-'+this.infoSpecial.base.startDate.substring(4,6)+'-'+this.infoSpecial.base.startDate.substring(6,8)
    						}
    						if(this.infoSpecial.base.endDate){
    							this.infoSpecial.base.endDate = this.infoSpecial.base.endDate.substring(0,4)+'-'+this.infoSpecial.base.endDate.substring(4,6)+'-'+this.infoSpecial.base.endDate.substring(6,8)
    						}
    						if(this.infoSpecial.base.organizationStr){
    							this.infoSpecial.base.organization = this.infoSpecial.base.organizationStr
    						} else{
    							this.$set(this.infoSpecial.base,'organization',this.infoSpecial.base.organization)
    						}

	    					if(res.data.result){
	    						this.rType.region = this.infoSpecial.result.type
	    					}
	    					this.evidenceFiles[0] = this.infoSpecial.base.attachment
	    					this.evidenceFiles[1] = this.infoSpecial.result.attachment
	    					this.evidenceFiles[2] = this.infoSpecial.abarbeitung.attachment
	    					this.evidenceFiles[3] = this.infoSpecial.duty.attachment
	    					// 生效库置灰
	    					if(this.$route.query.flag == 1){
	    						if(res.data.rs == '1'){
	    							this.isDisabled[1] = true
	    						}
		    					if(res.data.as == '1'){
	    							this.isDisabled[2] = true
	    						}
	    						if(res.data.ds == '1'){
	    							this.isDisabled[3] = true
	    						}
	    					}
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	    	},
	    	goEnter(){
	    		this.isEnter = true
	    		if(this.$route.query.flag){
	    			if(this.infoSpecial.penalizeId){
	    				this.$router.push({
				    		path:'/punishSpecialReport',
				    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				              	infoId:this.infoSpecial.penalizeId,
					            flag:this.$route.query.flag,
					            step:0,
					            superviseId:this.infoSpecial.id,
                				id: this.$route.query.id
				            }
				    	})
	    			} else{
	    				this.goSubmit()
	    			}
	    		} else{
	    			this.goSubmit()
	    		}
	    	},
		    closeMaskTable(data){
		    	this.isShow = data.status;
		    	if(data.orgChecked){
		    		this.$set(this.checkData.base,'organization',data.orgChecked)
		    	}
		    	if(data.orgName){
		    		this.$set(this.infoSpecial.base,'organization',data.orgName)
		    	}
		    },
		    keyFilter(val){
		    	this.$set(this.infoSpecial.base,'organization',val)
		    	delete this.checkData.base.organization
			},
			filterNode(value, data) {
				return true
		    },
		    selectFoucus(e){
		    	if(this.visible){
		    		let input = this.$refs.searchSelect;
		    		input.blur()
		    	}
		    },
		    visibleChange(val){
		    	this.visible = val
		    },
	      	searchOrg(){
				if(!this.infoSpecial.base.organization){
					this.$alert('请输入被检查机构名称', '提示', {
	                	confirmButtonText: '确定'
	                })
	                return
				}
				var params = qs.stringify({
					name:this.infoSpecial.base.organization,
		        	type: 7,
		        	pageNumber: 1,
		        	pageSize: 10,
		        	status:1
		        })
				this.axios.post('/rmUser/searchGroup',params).then((res)=>{
		            if(res.code == 200){
		            	if(res.data!==null){
			        		if(res.data.data!==null){
			        			this.searchResult = res.data
			        			this.$set(this.searchResult,'orgName',this.infoSpecial.base.organization)
			        			this.isShow = true
			        		} else{
			        			this.$alert('无对应查询结果，请重新选择查询条件', '提示', {
				                	confirmButtonText: '确定'
				                })
				                return
			        		}
		            	}
		            }else{
		              	this.$alert(res.message, '提示', {
		                  confirmButtonText: '确定'
		                })
		            }
		        })
			},
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
		font-size:0;
		.commonBtn{
			display:inline-block;
			margin-right:0;
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
}	

</style>
