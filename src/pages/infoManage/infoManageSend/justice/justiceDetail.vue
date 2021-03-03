<template>
  	<el-container id="justiceDetail">
  		<div id="top"></div>
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
			  	</el-col>
		  	</el-row>
	  	</el-header>		
		<div class="contList firstBox">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">基本信息</span></div>
			<el-steps :active="active" finish-status="success" align-center>
			  	<el-step title="基础信息"></el-step>
			  	<el-step title="问责情况"></el-step>
			</el-steps>
			<!-- 第一步 -->
			<div class="punishDetail" v-if="active == 0">
				<div class="infoItem" v-if="this.$route.query.flag == 1">
					<span class="infoItemT">案件信息编号：</span>
					<span class="infoItemC">{{baseinfo.sn == null?'--':baseinfo.sn}}</span>
				</div>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">案件名称：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.name == null||baseinfo.base.name == ''?'--':baseinfo.base.name}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">案件类型：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.justiceType == null||baseinfo.base.justiceType == ''?'--':justiceType[baseinfo.base.justiceType]}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">案发时间：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.occurDateStr == null||baseinfo.base.occurDateStr == ''?'--':baseinfo.base.occurDateStr}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">案件专报时间：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.reportDateStr == null||baseinfo.base.reportDateStr == ''?'--':baseinfo.base.reportDateStr}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">涉案金额（万元）：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.amount == null||baseinfo.base.amount == ''?'--':baseinfo.base.amount}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">损失金额（万元）：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.lossAmount == null||baseinfo.base.lossAmount == ''?'--':baseinfo.base.lossAmount}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">案件发生机构：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.organizationName ==null||baseinfo.base.organizationName == ''?'--':baseinfo.base.organizationName}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">四级机构：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.fourthOrganization == null||baseinfo.base.fourthOrganization == ''?'--':baseinfo.base.fourthOrganization}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<div class="infoItem">
					<span class="infoItemT">立案机关全称：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.office == null||baseinfo.base.office == ''?'--':baseinfo.base.office}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">基本案情及危害程度：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.extent == null||baseinfo.base.extent == ''?'--':baseinfo.base.extent}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">已采取的措施：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.measures == null||baseinfo.base.measures == ''?'--':baseinfo.base.measures}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">涉案机构的应对措施：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.orgMeasures == null||baseinfo.base.orgMeasures == ''?'--':baseinfo.base.orgMeasures}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">备注：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.mark == null||baseinfo.base.mark == ''?'--':baseinfo.base.mark}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem" v-if="baseinfo.base">
					<span class="infoItemT">涉案人员/机构：</span>
					<div class="infoItemC1" style="width:100%">
						<el-table :data="baseinfo.base.users" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
							<el-table-column prop="n" label="姓名/机构名称" align="center" width="150">
				                <template slot-scope="scope">
				                	<span :title="scope.row.n" class="textOverFlow">{{scope.row.n == null||scope.row.n == ''?'--':scope.row.n}}</span>
				                </template>
				            </el-table-column>
				            <el-table-column prop="o" label="证件号/机构代码" align="center" width="150">
				                <template slot-scope="scope">
				                	<span :title="scope.row.o" class="textOverFlow">{{scope.row.o == null||scope.row.o == ''?'--':scope.row.o}}</span>
				                </template>
				            </el-table-column>
				            <el-table-column prop="s" label="人员性质" align="center" width="100">
				                <template slot-scope="scope">
				                	<span :title="scope.row.s" class="textOverFlow">{{scope.row.s == null||scope.row.s == ''?'--':scope.row.s == '1'?'业内':'业外'}}</span>
				                </template>
				            </el-table-column>
							<el-table-column prop="x" label="性别" align="center" width="100">
				                <template slot-scope="scope">
				                	<span :title="scope.row.x" class="textOverFlow">{{scope.row.x == null||scope.row.x == ''?'--':scope.row.x}}</span>
				                </template>
				            </el-table-column>
			            	<el-table-column prop="a" label="年龄" align="center" width="100">
				                <template slot-scope="scope">
				                	<span :title="scope.row.a" class="textOverFlow">{{scope.row.a == null||scope.row.a == ''?'--':scope.row.a}}</span>
				                </template>
				            </el-table-column>
				            <el-table-column prop="t" label="职务" align="center">
				                <template slot-scope="scope">
				                	<span :title="scope.row.t" class="textOverFlow">{{scope.row.t == null||scope.row.t == ''?'--':scope.row.t}}</span>
				                </template>
				            </el-table-column>
				            <el-table-column prop="p" label="政治面貌" align="center" width="200">
				                <template slot-scope="scope">
				                	<span :title="scope.row.p" class="textOverFlow">{{scope.row.p == null||scope.row.p == ''?'--':scope.row.p}}</span>
				                </template>
				            </el-table-column>
						</el-table>
					</div>
				</div>
				<div class="infoItem">
					<span class="infoItemT">附件：</span>
					<span class="infoItemC1">
						<div class="fujian">
							<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.base.attachment)" :disabled="!baseinfo.base||!baseinfo.base.attachment">批量下载</el-button>
							<i class="el-icon-paperclip"></i>共{{baseinfo.base&&baseinfo.base.attachment?baseinfo.base.attachment.length:'0'}}个附件
						</div>
						<div v-if="baseinfo.base&&baseinfo.base.attachment">
							<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.base.attachment" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
								<div style="text-align:center;margin:0">
									<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
									<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
								</div>
								<em @click="goDownload(item.url,item.name)" slot="reference">
								{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.base.attachment.length-1">、</i><i style="color:#000" v-else>。</i>
								</em>
							</el-popover>
						</div>
						<div v-else>--</div>
					</span>
				</div>
			</div>
	      	<!-- 第四步 -->
	      	<div class="infoDetail" v-if="active == 1">
				<div class="infoItem">
					<span class="infoItemT">是否问责：</span>
					<span class="infoItemC">
						<div v-if="baseinfo.duty">
							<div v-if="baseinfo.duty.type == null">--</div>
							<div v-else>
								{{baseinfo.duty.type == 1?'是':'否'}}
							</div>
						</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">问责情况：</span>
					<span class="infoItemC">
						<div v-if="baseinfo.duty">{{baseinfo.duty.description == null?'--':baseinfo.duty.description}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT" style="vertical-align:middle">附件：</span>
					<span class="infoItemC" style="vertical-align:middle">
						<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.duty.attachment)" :disabled="!baseinfo.duty||!baseinfo.duty.attachment">批量下载</el-button>
						<i class="el-icon-paperclip"></i>共{{baseinfo.duty&&baseinfo.duty.attachment?baseinfo.duty.attachment.length:'0'}}个附件
					</span>
				</div>
				<div class="infoItem">
					<span v-if="baseinfo.duty&&baseinfo.duty.attachment" class="file">
						<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.duty.attachment" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
							<div style="text-align:center;margin:0">
								<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
								<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
							</div>
							<em @click="goDownload(item.url,item.name)" slot="reference">
							{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.duty.attachment.length-1">、</i><i style="color:#000" v-else>。</i>
							</em>
						</el-popover>
					</span>
					<span v-else>--</span>
				</div>
			</div>
	      	<el-row>
		  		<el-col :span="24" align="center">
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goPrevious" v-if="active!==0">上一步</el-button>
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goNext" v-if="active!==1">下一步</el-button>
		  		</el-col>
		  	</el-row>
		</div>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">维护记录</span></div>
			<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column prop="version" label="涉刑案件信息版本号" align="center" width="180">
	                <template slot-scope="scope">
	                    <span :title="scope.row.version" class="textOverFlow">{{scope.row.version == null?'--':scope.row.version}}</span>
	                </template>
	            </el-table-column>
				<el-table-column prop="name" label="案件名称" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.name" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)">{{scope.row.name == null?'--':scope.row.name}}</span>
	                </template>
	            </el-table-column>
            	<el-table-column prop="submitDate" label="报送时间" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.submitDate" class="textOverFlow">{{scope.row.submitDate == null?'--':scope.row.submitDate}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="upgradeDate" label="维护时间" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.upgradeDate" class="textOverFlow">{{scope.row.upgradeDate == null?'--':scope.row.upgradeDate}}</span>
	                </template>
	            </el-table-column>
			</el-table>
		</div>
		<div class="maskFile" v-show="isOpen">
     		<div class="readTxt">
     			<el-tag @close="closeMask" closable></el-tag>
				<iframe id="fileRead" src="" width="100%" height="100%"></iframe>
			</div>
     	</div>
  	</el-container>
</template>
<script>
	import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
	  	data() {
	        return {
	        	active: 0,
	          	titMsg:"涉刑案件信息详情",
	          	baseinfo:{},
	          	//查询数据
	          	checkData:{
	          		id:this.$route.query.infoId,
	          		flag:this.$route.query.flag
	          	},
		        // 实施主体
		        justiceType:{
		          '1':'业内案件',
		          '2':'业外案件'
		        },
		       	// 附件
		       	evidenceFiles:[],
		       	companyList:{},
		       	tableData:[],
		       	path:false,
		       	statisPath:false,
		       	sendBack:false,
		       	isOpen:false,
		       	casePath:false,
			}
	   	},
	    created(){
	    	if(this.$route.query.step){
	    		this.active = this.$route.query.step
	    	}
	    	// 获取基本信息
	    	this.searchData(this.checkData)
	    	this.getHistory(this.checkData)
	    },
	    methods:{
	    	// 步骤
	    	goNext(){
	    		if (this.active++ > 1) this.active = 1;
	    	},
	    	goPrevious(){
	    		this.active--
	    	},	
		    // 返回
	    	goback(){
	    		if(this.$route.query.flag == 3){
	    			if(this.baseinfo.base.justiceType == 1){
	    				sessionStorage.setItem('justicePath','third')
	    			} else if(this.baseinfo.base.justiceType == 2){
	    				sessionStorage.setItem('justicePath','fifth')
	    			}
	    			this.$router.push({
			    		path:'/justiceSeasonReport',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id,
              				isJusticeType:this.$route.query.isJusticeType
			            }
			    	})
	    		} else if(this.path == true){
	    			this.$router.push({
			    		name: 'judicialInfo',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			            	belongCompany:this.$route.query.belongCompany,
              				company:this.$route.query.company,
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.statisPath == true){
	    			sessionStorage.setItem('statisPath',2)
	    			this.$router.push({
			    		path: 'infoManage/infoStatistics/detialList',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.casePath == true){
	    			this.$router.push({
			    		path: 'caseDetail',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			              	infoId:this.$route.query.caseId,
				            flag:this.$route.query.status,
				            step:1,
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.sendBack == true){
	    			sessionStorage.setItem('sendBackPath','third')
	    			this.$router.push({
			    		name: 'sendBack',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.$route.query.flag == 0){//草稿
	    			// 业内,业外
	    			if(this.baseinfo.base.justiceType == 1){
	    				sessionStorage.setItem('justicePath','third')
	    			} else if(this.baseinfo.base.justiceType == 2){
	    				sessionStorage.setItem('justicePath','fifth')
	    			}
	    			this.$router.push({
			    		path:'/infoManage/infoManageSend/justice/justiceSend',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	          				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.$route.query.flag == 1){//生效
    				// 业内,业外
	    			if(this.baseinfo.base.justiceType == 1){
	    				sessionStorage.setItem('justicePath','fourth')
	    			} else if(this.baseinfo.base.justiceType == 2){
	    				sessionStorage.setItem('justicePath','sixth')
	    			}
	    			this.$router.push({
			    		path:'/infoManage/infoManageSend/justice/justiceSend',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
    			}
	    	},
	    	searchData(data){
	    		if(this.$route.query.flag == 3){
	    			data.flag = 0
	    		}
	    		this.axios.post('justice/detail',qs.stringify(data)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					this.baseinfo = res.data
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	    	},
	    	getHistory(data){
	    		delete data.flag
	    		this.axios.post('justice/history',qs.stringify(data)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					this.tableData = []
	    					this.tableData = res.data
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	    	},
	    	// 详情
		    goDetail(index,row){
		    	var element = document.getElementById("top");
          		element.scrollIntoView({block: 'start', behavior: "smooth"});
		    	var check1 = {
		    		id:row.id,
		    		flag:2
		    	}
		        this.$router.push({
		            path:'/justiceDetail',   //跳转的路径
		            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		            	infoId:row.id,
		              	flag:this.$route.query.flag,
		              	sn:row.sn,
		              	belongCompany:this.$route.query.belongCompany,
              			company:this.$route.query.company,
              			id: this.$route.query.id,
              			status:this.$route.query.status,
              			caseId:this.$route.query.caseId
		            }
		        })
		        this.searchData(check1)
		    	this.getHistory(check1)
		    },
		    goDownload(url,name,type){
		    	var fileType = url.substring(url.lastIndexOf('.')+1)
		    	if(fileType == 'rar' || fileType == 'zip' || type == '1'){
		    		var obj = new Object()
					obj.filePath = url;
					obj.fileName = encodeURIComponent(name);
					this.axios.post('comm/download/703',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
						fileDownload(res, fileNameCombine(name,url));
					})
		    	}
		    },
		    closeMask(){
				this.isOpen = false;
				$('#fileRead').attr('src','')
			},
			// 批量下载
			loadFile(fileList){
				this.axios.post('comm/download/batch',JSON.stringify(fileList),{headers:{'Content-Type':'application/json'},responseType:'arraybuffer'}).then((res)=>{
	    			fileDownload(res, '批量下载.zip');
	    		})
			},
			//预览
			preView(url,name){
	    		this.isOpen = true
			    $('#fileRead').attr('src','http://10.196.23.34:8237/v1/view/preview?filePath='+encodeURIComponent(url))
			}
	    },
	    beforeRouteEnter (to, from, next) {
			next((that) => {
			    if(from.fullPath.includes('/judicialInfo')){
			    	that.path = true
			    }
			    if(from.fullPath.includes('/detialList')){
			    	that.statisPath = true
			    }
			    if(from.fullPath.includes('/caseDetail')){
			    	that.casePath = true
			    }
			    if(from.fullPath.includes('/sendBack')){
			    	that.sendBack = true
			    }
			})
	    }
  	};
</script>
<style lang="scss">
#justiceDetail{
	cursor:pointer;
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
	}
	.el-form-item .el-form-item__content .el-select--mini{
		width:100%
	}
	.el-form-item__label{
		width:100px;
		text-align:right;
		height:32px;
		line-height:32px;
	}
	.commonBtn{
		width: 68px;
	    height: 26px;
	    margin-top:3px;
	    margin-right: 5px;
	    padding:0;
    	font-size: 12px;
	}
	textarea{
		height:125px;
		resize:none
	}
	.el-upload{
		float:left
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
			margin-top:24px;
			border-top:8px solid #4285F4;
			border-left:4px solid transparent;
			border-right:4px solid transparent;
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
	.punishDetail{
		min-height:400px;
		.infoItem{
			width:100%;
    		min-height: 24px;
    		line-height: 24px;
    		font-size: 0;
    		p{
				font-size: 14px;
				padding-left:160px;
				em{
					color:#4285F4 ;
					font-style:normal
				}
			}
    		span{
    			display:inline-block;
    			vertical-align:top;
    			font-size: 14px;
    		}
			.infoItemT{
				width:160px;
				text-align:justify
			}
			.infoItemC,.infoItemC1{
				width:60%;
				text-align:left;
				margin-bottom:10px;
				em{
					color:#4285F4 ;
					font-style:normal
				}
			}
			.infoItemC1{
				width:calc(100% - 160px)
			}
			.infoItemT:after,p:after{
				content:'';
			    width: 100%;
			    display: inline-block;
			    overflow: hidden;
			    height: 0;
			}
    	}
	}
	.infoDetail{
		text-align:center;
		min-height:400px;
		.infoItem{
			width:100%;
    		min-height: 24px;
    		line-height: 24px;
    		margin: 15px 0;
    		font-size: 14px;
    		span{
    			display:inline-block;
    			vertical-align:top
    		}
    		.infoItemT{
    			width:20%;
    			text-align:right
    		}
    		.infoItemC{
    			width:20%;
    			text-align:left
    		}
    	}
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
    }
    .el-table .cell{
        text-align: center;
    }
    .el-icon-paperclip{
		margin-right:5px
	}
    .file{
		em{
			color:#4285F4;
			font-style:normal
		}
	}
	#fileRead{
		border: none;
	}
	.maskFile{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,.4);
		z-index: 100000;
		padding-top: 10%;
		padding-left: 15%;
		text-align: center;
		.readTxt{
		  	position: relative;
			width: 80%;
		  	height: 494px;
		  	border: 1px solid #E9E9E9;
		  	margin:0 auto;
		  	background: #fff;
		}
		.el-tag{
			float: right;
		    background: transparent;
		    border: none;
		    padding: 4px 15px 4px 4px;
			.el-icon-close{
				font-size: 18px;
				padding: 1px;
			}
			.el-icon-close:hover{
				background: transparent;
				color: #409eff;
			}
		}
	}
	.fujian{
		width:100%;
		margin-bottom:10px;
		.el-icon-document{
			margin-right:4px
		}
	}
}	

</style>
