<template>
  	<el-container id="caseSpecialReport">
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
		<div class="contList firstBox">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">基本信息</span></div>
			<el-steps :active="active" finish-status="success" align-center>
			  	<el-step title="基础信息"></el-step>
			  	<el-step title="结果跟进"></el-step>
			</el-steps>
			<!-- 第一步 -->
			<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" v-if="active == 0" class="firstForm addStar">
				<el-row>
			        <el-col :span="12">
						<el-form-item label="案件风险事件发生机构" class="searchBtn">
						    <el-select v-model="infoSpecial.base.organization" placeholder="请选择发生机构" :disabled="isDisabled[0]" ref="searchSelect1" filterable :filter-method="((val)=>{keyFilter(val,1)})" @focus="((val)=>{selectFoucus(val,1)})" @visible-change="visibleChange">
								<el-option :value="infoSpecial.base.organization" style="height:auto;background:#FFF">
									<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree1" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,1,'','organization','organization','base')})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
								</el-option>
							</el-select>
							<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(1)" :disabled="isDisabled[0]"></el-button>	
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="报告机构" class="searchBtn">
			        		<el-select v-model="infoSpecial.base.reportOrg" placeholder="请选择报告机构" :disabled="isDisabled[0]" ref="searchSelect2" filterable :filter-method="((val)=>{keyFilter(val,2)})" @focus="((val)=>{selectFoucus(val,2)})" @visible-change="visibleChange">
								<el-option :value="infoSpecial.base.reportOrg" style="height:auto;background:#FFF">
									<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree2" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,2,'','reportOrg','reportOrg','base')})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
								</el-option>
							</el-select>
							<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(2)" :disabled="isDisabled[0]"></el-button>	
						</el-form-item>
					</el-col>
			    </el-row>
				<el-row>
			        <el-col :span="12">
						<el-form-item label="事件开始时间">
						    <el-date-picker type="date" @change="getStartDate" placeholder="选择日期" v-model="infoSpecial.base.startDate" :disabled="isDisabled[0]"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">	
			        	<el-form-item label="报告日期">
						    <el-date-picker type="date" @change="getReportDate" placeholder="选择日期" v-model="infoSpecial.base.reportDate" :disabled="isDisabled[0]"></el-date-picker>			
						</el-form-item>
					</el-col>
					<el-col :span="12">
			        	<el-form-item label="涉及金额（万元）">
			        		<el-input @keydown.native="checkInput($event)" type="number" v-model="infoSpecial.base.amount" placeholder="请输入涉及金额" @change="((val)=>{getInputData(val,'amount','base')})" :disabled="isDisabled[0]"></el-input>
						</el-form-item>
					</el-col>
			    </el-row>
				<el-row v-for="(item,index) in infoSpecial.base.orgMap" :key="item.id">
			        <el-col :span="24" class="caseLabel">
						<el-form-item label="涉及内部机构" class="searchBtn">
							<el-select v-model="item.orgName" placeholder="请选择涉及内部机构" :disabled="item.isDisabled" :ref="searchSelect+3+index" filterable :filter-method="((val)=>{keyFilter(val,3,index)})" @focus="((val)=>{selectFoucus(val,3,index)})" @visible-change="visibleChange">
								<el-option :value="item.orgName" style="height:auto;background:#FFF">
									<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree3" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,3,index,'orgName','org','orgMap')})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
								</el-option>
							</el-select>
							<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(3,index)" :disabled="isDisabled[0]"></el-button>	
						</el-form-item>
						<el-button type="primary" size="mini" class="commonBtn1" @click="goAdd" v-if="index == 0" :disabled="isDisabled[0]">添加</el-button>
						<el-button type="primary" size="mini" class="commonBtn1" @click="goMinus(index)" v-if="index !== 0" :disabled="item.isDisabled">删除</el-button>
					</el-col>
			    </el-row>
			    <el-row>
			    	<el-col :span="24" class="punishText">
						<el-form-item label="涉及内部人员" class="noStar">
							<el-input v-model="infoSpecial.base.innerPerson" placeholder="请输入涉及内部人员" @change="((val)=>{getInputData(val,'innerPerson','base')})" :disabled="isDisabled[0]"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="punishText">
						<el-form-item label="涉及外部人员（机构）" class="noStar">
							<el-input v-model="infoSpecial.base.outPerson" placeholder="请输入涉及外部人员（机构）" @change="((val)=>{getInputData(val,'outPerson','base')})" :disabled="isDisabled[0]"></el-input>
						</el-form-item>
					</el-col>
			    </el-row>
				<el-row>
			        <el-col :span="24">
						<el-form-item label="案件风险事件概述" class="punishText">
			        		<el-input type="textarea" v-model="infoSpecial.base.caseDes" placeholder="请输入风险情况预判，已经/可能造成的影响及采取措施" @change="getCaseDes" maxlength="500" :disabled="isDisabled[0]"></el-input>
						</el-form-item>
			        </el-col>
			    </el-row>
				<el-form-item label="附件">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],0)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[0]">
						<el-button type="primary" size="mini" class="commonBtn" @click="curRowIndex=active" :disabled="isDisabled[0]">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
	      	</el-form>
	      	<!-- 第四步 -->
	      	<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" style="text-align:center;" v-if="active == 1" class="addStar">
				<el-form-item label="案件风险事件结果跟进" class="noStar">
				    <el-select v-model="rType.region" @change="changeDtype" placeholder="请选择检查结果" :disabled="isDisabled[1]">
						<el-option v-for="item in rType.unitsData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
					</el-select>		
				</el-form-item>
				<el-form-item label="撤销时间" v-if="rType.region&&rType.region== 1">
					<el-date-picker type="date" @change="getRevokeDate" placeholder="撤销时间" v-model="infoSpecial.result.revokeDate" :disabled="isDisabled[1]"></el-date-picker>
				</el-form-item>
				<el-form-item label="撤销原因" v-if="rType.region&&rType.region== 1">
					<el-input type="textarea" v-model="infoSpecial.result.revokeCase" placeholder="请输入撤销原因" @change="((val)=>{getInputData(val,'revokeCase','result')})" maxlength="500" :disabled="isDisabled[1]"></el-input>
				</el-form-item>
				<el-form-item label="撤销结果" v-if="rType.region&&rType.region== 1">
					<el-input type="textarea" v-model="infoSpecial.result.revokeResult" placeholder="请输入撤销结果" @change="((val)=>{getInputData(val,'revokeResult','result')})" maxlength="500" :disabled="isDisabled[1]"></el-input>
				</el-form-item>
				<el-form-item label="附件" class="noStar">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],1)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[1]">
						<el-button slot="trigger" type="primary" size="mini" class="commonBtn" @click="curRowIndex=active" :disabled="isDisabled[1]">上传附件</el-button>
						<div class="enter" v-if="rType.region&&rType.region== 2">
							<em>录入涉刑案件</em><el-button type="primary" size="mini" class="commonBtn" @click="goEnter" :disabled="this.checkData.result == undefined || this.checkData.result.type == undefined || isDisabled[1]" v-if="!this.infoSpecial.relation">录入涉刑案件</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goEnter" :disabled="!this.infoSpecial.judicialId" v-if="this.infoSpecial.relation&&this.infoSpecial.relation!== null">录入涉刑案件</el-button>
						</div>
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
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goNext" v-if="active!==1">下一步</el-button>
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
	        return {
	        	active: 0,
	          	titMsg:"新建案件风险事件",
	          	isDisabled:[false,false],
	          	curRowIndex:'',
	          	isEnter:false,
	          	//查询数据
	          	checkData:{
	          		base:{},
	          		result:{}
	          	},
	          	infoSpecial:{
	          		base:{
	          			startDate:'',
	          			reportDate:'',
	          			organization:'',
	          			reportOrg:'',
	          			caseDes:'',
	          			amount:'',
				        orgMap:[{
				        	org:null,
				        	orgName:''
				        }],
				        innerPerson:'',
				        outPerson:''
	          		},
	          		result:{
	          			revokeDate:'',
	          			revokeCase:'',
	          			revokeResult:''
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
		       	isShow:false,
  				searchResult:'',
  				visible:false,
  				rType:{
			       	region: '',
			       	unitsData:[{
			          	name:'未引起涉刑案件',
			          	id:'1'
			        },{
			          	name:'引起涉刑案件',
			          	id:'2'
			        }]
		        },
		        searchSelect:'searchSelect',
		        treeData:[]
			}
	   	},
	    created(){
	    	// 编辑页面
	    	if(this.$route.query.flag == 0|| this.$route.query.flag == 3){
	    		this.titMsg = "编辑案件风险事件"
	    		this.getInfo()
	    	} else if(this.$route.query.flag == 1){
	    		this.active = parseInt(this.$route.query.step)
	    		this.titMsg = "维护案件风险事件"
	    		this.isDisabled[0] = true
	    		this.getInfo()
	    	}
	    	if(this.$route.query.flag !== 1){
	    		this.connectAxios('1_01','','','1')
	    	}
	    },
	    components:{
	    	orgSearch
	    },
	    watch:{
	    	'infoSpecial.base.organization'(newVal,oldVal){
	    		if(newVal){
	    			this.$set(this.infoSpecial.base,'reportOrg',this.infoSpecial.base.organization)
	    			this.$set(this.checkData.base,'reportOrg',this.checkData.base.organization)
	    		}
	    	}
	    },
	    methods:{
	    	// 步骤
	    	goNext(){
	    		if (this.active++ > 1) this.active = 1;
	    	},
	    	goPrevious(){
	    		this.active--
	    	},
	    	handleNodeClick(node,type,index,name1,name2,kind) {
				if(node.disabled!=true){
					if(type == 1 || type == 2){
						this.$set(this.infoSpecial[kind],name1,node.name)
						if(node.groupId!==''){
							this.$set(this.checkData[kind],name2,node.groupId)
			      		} else{
			      			delete this.checkData[kind][name2]
			      		}
					} else{
						this.$set(this.infoSpecial.base[kind][index],name1,node.name)
						this.checkData.base[kind] = this.infoSpecial.base[kind]
						if(node.groupId!==''){
							this.$set(this.checkData.base[kind][index],name2,node.groupId)
			      		} else{
			      			delete this.checkData.base[kind][index][name2]
			      		}
					}
	      		}
			},
			getNodeInfo(node,resolve) {

			},
			connectAxios(val,node,resolve,type){
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
					if(type == '1'){
						this.treeData = arr
					} else{
						resolve(arr)
					}
		        })
	  		},
	    	loadNode(node,resolve){
	  			if (node.level == 0) {
	  				return resolve(this.treeData)
		        }else{
		        	var mid = node.data.groupId === undefined?'1_01':node.data.groupId
		  			this.connectAxios(mid,node,resolve)
				}
	  		},
	    	//检查开始时间
	    	getStartDate(val){
	    		if(val !== null){
	    			this.checkData.base.startDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.base.startDate = this.checkData.base.startDate.split('-').join('')
	    		} else{
	    			delete this.checkData.base.startDate
	    		}
	    	},
	    	//检查结束时间
	    	getEndDate(val){
	    		if(val !== null){
	    			this.checkData.base.endDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.base.endDate = this.checkData.base.endDate.split('-').join('')
	    		} else{
	    			delete this.checkData.base.endDate
	    		}
	    	},
	    	getReportDate(val){
	    		if(val !== null){
	    			this.checkData.base.reportDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.base.reportDate = this.checkData.base.reportDate.split('-').join('')
	    		} else{
	    			delete this.checkData.base.reportDate
	    		}
	    	},
	    	getCaseDes(val){
	    		if(val == ''){
	    			delete this.checkData.base.caseDes
	    		} else{
	    			this.checkData.base.caseDes = val
	    		}
	    	},
	    	changeDtype(val){
	    		this.checkData.result.type = val
	    	},
	    	getInputData(val,name,type){
	    		if(val == ''){
	    			delete this.checkData[type][name]
	    		} else{
	    			this.checkData[type][name] = val
	    		}
	    	},
	    	getRevokeDate(val){
	    		if(val !== null){
	    			this.checkData.result.revokeDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.result.revokeDate = this.checkData.result.revokeDate.split('-').join('')
	    		} else{
	    			delete this.checkData.result.revokeDate
	    		}
	    	},
		    // 返回
	    	goback(){
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'caseSeasonReport',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else{
	    			if(this.$route.query.flag == 0){
	    				sessionStorage.setItem('justicePath','first')
	    			} else if(this.$route.query.flag == 1){
	    				sessionStorage.setItem('justicePath','second')
	    			}
		    		this.$router.push({
			    		path:'/infoManage/infoManageSend/justice/justiceSend',
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
				this.axios.post('/comm/upload/706',form).then((res)=>{
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
				} 
			},
			beforeAvatarUpload(file) {
		        return fileTypeDiffer(file)
		    },
		    // 提交
	    	goSubmit(){
	    		// // 判断为空
	    		if(this.checkData.base.organization == undefined){
    				this.$alert('案件风险事件发生机构不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.reportOrg == undefined){
    				this.$alert('报告机构不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.startDate == undefined){
    				this.$alert('事件开始时间不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.reportDate == undefined){
    				this.$alert('报告日期不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.amount == undefined){
    				this.$alert('涉及金额不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.orgMap != undefined){
					for(var i = 0;i<this.checkData.base.orgMap.length;i++){
						if(this.checkData.base.orgMap[i].org == null){
							this.$alert('涉及内部机构不能为空', '提示', {
					          confirmButtonText: '确定'
					        });
					        return
						}
					}
				} else{
					this.$alert('涉及内部机构不能为空', '提示', {
			          	confirmButtonText: '确定'
			        });
			        return
				}
				if(this.checkData.base.caseDes == undefined){
    				this.$alert('案件风险事件概述不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.attachment == undefined){
    				this.$alert('基本信息附件不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.result&&this.checkData.result.type == 1){
    				if(this.checkData.result.revokeDate == undefined){
	    				this.$alert('撤销时间不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.result.revokeCase == undefined){
	    				this.$alert('撤销原因不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.result.revokeResult == undefined){
	    				this.$alert('撤销结果不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
    			}
	    		if(JSON.stringify(this.checkData.base) == "{}" || this.checkData.base==null){
	    			delete this.checkData.base
	    		}
	    		if(JSON.stringify(this.checkData.result) == "{}" || this.checkData.result==null){
	    			delete this.checkData.result
	    		}
	    		if(this.$route.query.infoId!==undefined){
	    			this.checkData.id = this.$route.query.infoId
	    		}
	    		if(this.isEnter == true){
	    			this.$confirm('本条案件风险事件将提交，并将进入到涉刑案件信息专报页面。', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(_ => {
	              			this.axios.post('case/submit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
							if(res.code == 200){
								if(res.data !== null){
						      		// 录入信息
					      			if(this.infoSpecial.judicialId){
						    			this.$router.push({
									    		path:'/justiceSpecialReport',
									    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
									              	infoId:this.infoSpecial.judicialId,
										            flag:1,
										            step:0,
										            caseId:this.infoSpecial.id,
                									id: this.$route.query.id
									            }
									    	})
						    			} else{
						    				this.$router.push({
									    		path:'/justiceSpecialReport',
									    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
										            caseId:res.data,
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
	    			this.axios.post('case/submit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
						if(res.code == 200){
							if(res.data !== null){
								this.$alert('提交成功', '提示', {
							    	confirmButtonText: '确定',
							      	callback: action => {
							      		if (this.$route.query.flag == 3){
							    			this.$router.push({
									    		path:'/caseSeasonReport',
									    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
						              				id: this.$route.query.id
									            }
									    	})
							    		} else{
							    			sessionStorage.setItem('justicePath','second')
									      	this.$router.push({
									    		path:'/infoManage/infoManageSend/justice/justiceSend',
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
	    	// 保存
	    	goSave(){
	    		if(this.checkData.base.organization == undefined){
    				this.$alert('案件风险事件发生机构不正确', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return
    			}
    			if(this.checkData.base.reportOrg == undefined){
    				this.$alert('报告机构不正确', '提示', {
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
	    		if(this.$route.query.infoId!==undefined){
	    			this.checkData.id = this.$route.query.infoId
	    		}
	    		this.checkData.judicialId = this.infoSpecial.judicialId
	    		this.axios.post('case/save',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
					if(res.code == 200){
						if(res.data !== null){
							this.$alert('保存成功', '提示', {
						    	confirmButtonText: '确定',
						      	callback: action => {
							      	if(this.$route.query.flag == 3){
						    			this.$router.push({
								    		path:'/caseSeasonReport',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					              				id: this.$route.query.id
								            }
								    	})
						    		} else{
						    			sessionStorage.setItem('justicePath','first')
								      	this.$router.push({
								    		path:'/infoManage/infoManageSend/justice/justiceSend',
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
	    		this.axios.post('case/detail',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					// 基本信息
	    					this.infoSpecial = res.data == null?new Object:res.data
	    					this.infoSpecial.base = res.data.base == null?new Object:res.data.base
	    					this.infoSpecial.result = res.data.result == null?new Object:res.data.result
	    					// 接口数据
	    					this.checkData = JSON.parse(JSON.stringify(this.infoSpecial))
	    					this.checkData.base = JSON.parse(JSON.stringify(this.infoSpecial.base))
	    					this.checkData.result =JSON.parse(JSON.stringify(this.infoSpecial.result))
    						if(this.infoSpecial.base.startDate){
    							this.infoSpecial.base.startDate = this.infoSpecial.base.startDate.substring(0,4)+'-'+this.infoSpecial.base.startDate.substring(4,6)+'-'+this.infoSpecial.base.startDate.substring(6,8)
    						}
    						if(this.infoSpecial.base.reportDate){
    							this.infoSpecial.base.reportDate = this.infoSpecial.base.reportDate.substring(0,4)+'-'+this.infoSpecial.base.reportDate.substring(4,6)+'-'+this.infoSpecial.base.reportDate.substring(6,8)
    						}
    						if(this.infoSpecial.base.organizationName){
    							this.infoSpecial.base.organization = this.infoSpecial.base.organizationName
    						} else{
    							this.$set(this.infoSpecial.base,'organization',this.infoSpecial.base.organization)
    						}
    						if(this.infoSpecial.base.reportOrgStr){
    							this.infoSpecial.base.reportOrg = this.infoSpecial.base.reportOrgStr
    						} else{
    							this.$set(this.infoSpecial.base,'reportOrg',this.infoSpecial.base.reportOrg)
    						}
    						if(res.data.result){
	    						this.rType.region = this.infoSpecial.result.type
	    						if(this.infoSpecial.result.revokeDate){
	    							this.infoSpecial.result.revokeDate = this.infoSpecial.result.revokeDate.substring(0,4)+'-'+this.infoSpecial.result.revokeDate.substring(4,6)+'-'+this.infoSpecial.result.revokeDate.substring(6,8)
	    						}
	    					}
    						this.evidenceFiles[0] = this.infoSpecial.base.attachment
	    					this.evidenceFiles[1] = this.infoSpecial.result.attachment
	    					if(this.infoSpecial.base.orgMap){
		    					for(var i = 0;i<this.infoSpecial.base.orgMap.length;i++){
		    						this.infoSpecial.base.orgMap[i].orgName = this.infoSpecial.base.orgMap[i].orgName
		    						this.infoSpecial.base.orgMap[i].isDisabled = false
		    						if(this.$route.query.flag == 1){
		    							this.infoSpecial.base.orgMap[i].isDisabled = true
		    						}
		    					}
	    					} else{
	    						var arr = [{
				  					org:null,
				  					orgName:'',
				  				}]
				  				this.$set(this.infoSpecial.base,'orgMap',arr)
	    					}
	    					// 生效库置灰
	    					if(this.$route.query.flag == 1 && res.data.rs == '1'){
	    						this.isDisabled[1] = true
	    					}
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	    	},
	    	checkInput(e){
			  	let prohibitInput= ["-", "e", "+", "E"];
			  	if(prohibitInput.includes(e.key)){
			    	e.preventDefault();
			  	}
			},
			// 涉案人员增加
	    	goAdd(){
	    		this.infoSpecial.base.orgMap.push({
	    			org:null,
	    			orgName:'',
	    		})
	    	},
	    	// 被处罚个人删除
	    	goMinus(index){
	    		this.infoSpecial.base.orgMap.splice(index,1)
	    		this.checkData.base.orgMap = this.infoSpecial.base.orgMap
	    	},
	    	goEnter(){
	    		this.isEnter = true
	    		if(this.$route.query.flag){
	    			if(this.infoSpecial.judicialId){
	    				this.$router.push({
				    		path:'/justiceSpecialReport',
				    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				              	infoId:this.infoSpecial.judicialId,
					            flag:this.$route.query.flag,
					            step:0,
					            caseId:this.infoSpecial.id,
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
		    		switch (data.type){
			    		case 1:
			    			this.$set(this.checkData.base,'organization',data.orgChecked)
			    			break;
			    		case 2:
			    			this.$set(this.checkData.base,'reportOrg',data.orgChecked)
			    			break;
			    		case 3:
			    			this.$set(this.checkData.base.orgMap[data.index],'org',data.orgChecked)
			    			break;
			    	}
		    	}
		    	if(data.orgName){
		    		switch (data.type){
			    		case 1:
			    			this.$set(this.infoSpecial.base,'organization',data.orgName)
			    			break;
			    		case 2:
			    			this.$set(this.infoSpecial.base,'reportOrg',data.orgName)
			    			break;
			    		case 3:
			    			this.$set(this.infoSpecial.base.orgMap[data.index],'orgName',data.orgName)
			    			break;
			    	}
		    	}
		    },
		    keyFilter(val,type,index){
		    	if(type ==1){
		    		this.infoSpecial.base.organization = val
					delete this.checkData.base.organization
		    	} else if(type == 2){
		    		this.infoSpecial.base.reportOrg = val
					delete this.checkData.base.reportOrg
		    	} else{
		    		this.infoSpecial.base.orgMap[index].orgName = val
					this.checkData.base.orgMap = this.infoSpecial.base.orgMap
					delete this.infoSpecial.base.orgMap[index].org
		    	}
			},
			filterNode(value, data) {
				return true
		    },
		    selectFoucus(e,type,index){
		    	if(this.visible){
		    		if(type == 1 || type == 2){
		    			let input = this.$refs['searchSelect'+ type]
		    			input.blur()
		    		} else{
		    			let input = this.$refs['searchSelect'+ type + index]
		    			input[0].blur()
		    		}
		    	}
		    },
		    visibleChange(val){
		    	this.visible = val
		    },
	      	searchOrg(type,index){
	      		var reOrgName = ''
	      		if(type == 1){
	      			reOrgName = this.infoSpecial.base.organization
	      		} else if(type == 2){
	      			reOrgName = this.infoSpecial.base.reportOrg
	      		} else{
	      			reOrgName = this.infoSpecial.base.orgMap[index].orgName
	      		}
				if(!reOrgName){
					this.$alert('请输入机构名称', '提示', {
	                	confirmButtonText: '确定'
	                })
	                return
				}
				var params = qs.stringify({
					name:reOrgName,
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
			        			this.$set(this.searchResult,'orgName',reOrgName)
			        			this.$set(this.searchResult,'index',index)
			        			this.$set(this.searchResult,'type',type)
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
		    if(to.name == 'justiceSpecialReport'){
		      sessionStorage.removeItem("askData1");
		      sessionStorage.removeItem("askData2");
		    }
		    next()
		},
  	};
</script>
<style lang="scss">
#caseSpecialReport{
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
	.firstForm{
		.el-form-item__label{
			float:left;
			width:200px;
			text-align:justify;
			height:32px;
			line-height:32px;
			padding:0 30px 0 0
		}
		.el-form-item label:after {
	        content: " ";
	        display: inline-block;
	        width: 100%;
	    }
	    .punishText{
	    	.el-form-item__content{
				width:calc(calc(50% - 200px) + 200px + 30%)!important;
				position:static
			}
			.el-table,.el-table td, .el-table th,.el-table__body-wrapper{
				position:static
			}
			.commonBtn{
				position: absolute;
				right:10px;
			}
	    }
		.el-form-item .el-form-item__content{
			display:inline-block;
			vertical-align:top;
			width:60%;
			min-height:32px;
			line-height:32px;
		}
		.el-upload__tip,.el-upload-list{
			margin-left:0
		}
	}
	.el-upload--text{
		float: none;
	}
	.el-form-item .el-form-item__content{
		display:inline-block;
		vertical-align:top;
		width:300px;
		min-height:32px;
		line-height:32px;
		text-align:left
	}
	.el-form-item .el-form-item__content .el-select{
		width:100%
	}
	.el-form-item__label{
		width:180px;
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
	.upload-demo{
		.el-upload-list__item-name{
			padding-left:0;
			color:#909191
		}
	}
	.el-upload__tip,.el-upload-list,.enter{
		margin-left:-180px;
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
	.enter{
		color:#606266;
		margin-top:10px;
		em{
			display:inline-block;
			width:180px;
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
	.el-icon-document:before{
		content:"\E77D";
 		-webkit-text-fill-color:#000;
 		-webkit-text-stroke: 0 #000;
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
	.newStar .el-table__header-wrapper tr th:first-child .cell::before{
		content:'*';
		color:#F56C6C;
		margin-right:4px
	}
	.noStar .el-form-item__label::before{
		content:''!important
	}
	input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
	    -webkit-appearance: none;
	}
	input[type="number"] {
	    -moz-appearance: textfield;
	}
	table tr:last-child td{
      border-bottom: none
    }
    .el-table::before{
      background-color: transparent!important
    }
    .el-table td .cell,.el-table__empty-text{
      font-weight:normal;
      cursor:pointer
    }
	.textOverFlow{
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
     .el-table__body-wrapper{
      background: #fff;
    }
	.el-table::before{
        height:0;
    }
    .el-table th{
        background: #f9f9f9;
        text-align: center;
        line-height:normal!important
    }
    .el-table .cell{
        text-align: center;
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
	.searchBtn .el-select{
		width:calc(100% - 50px)!important;
	}
	.searchBtn .el-icon-search:before{
		color:#606266
	}
	.caseLabel{
		position: relative;
		.commonBtn1{
			position: absolute;
			right:0;
			top:0
		}
		.el-form-item__content{
			width:calc(calc(50% - 200px) + 200px + 30%)!important;
		}
	}
}	

</style>
