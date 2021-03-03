<template>
  	<el-container id="caseDetail">
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
			  	<el-step title="结果跟进"></el-step>
			</el-steps>
			<!-- 第一步 -->
			<div class="punishDetail" v-if="active == 0">
				<div class="infoItem" v-if="this.$route.query.flag == 1">
					<span class="infoItemT">案件风险事件编号：</span>
					<span class="infoItemC">{{baseinfo.sn == null?'--':baseinfo.sn}}</span>
				</div>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">案件风险事件发生机构：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.organizationName == null||baseinfo.base.organizationName == ''?'--':baseinfo.base.organizationName}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">报告机构：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.reportOrgStr == null||baseinfo.base.reportOrgStr == ''?'--':baseinfo.base.reportOrgStr}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">事件开始时间：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.startDateStr == null||baseinfo.base.startDateStr == ''?'--':baseinfo.base.startDateStr}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">报告日期：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.reportDateStr == null||baseinfo.base.reportDateStr == ''?'--':baseinfo.base.reportDateStr}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">涉及金额（万元）：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.amount == null||baseinfo.base.amount == ''?'--':baseinfo.base.amount}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<div v-if="baseinfo.base">
					<el-row v-for="(item,index) in baseinfo.base.orgMap" :key="item.id">
				        <el-col :span="12">
				        	<div class="infoItem">
				        		<span class="infoItemT">涉及内部机构：</span>
				        		<span class="infoItemC">{{item.orgName == null||item.orgName == ''?'--':item.orgName}}</span>
				        	</div>
						</el-col>
			      	</el-row>
		      	</div>
		      	<div class="infoItem">
					<span class="infoItemT">涉及内部人员：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.innerPerson == null||baseinfo.base.innerPerson == ''?'--':baseinfo.base.innerPerson}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">涉及外部人员（机构）：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.outPerson == null||baseinfo.base.outPerson == ''?'--':baseinfo.base.outPerson}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">案件风险事件概述：</span>
					<span class="infoItemC1">
						<div v-if="baseinfo.base">{{baseinfo.base.caseDes == null||baseinfo.base.caseDes == ''?'--':baseinfo.base.caseDes}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT" style="vertical-align:middle">附件：</span><span class="file file1">
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
					<span class="infoItemT">案件风险事件结果跟进：</span>
					<span class="infoItemC">
						<div v-if="baseinfo.result">
							<div v-if="baseinfo.result.type == null">--</div>
							<div v-else>
								{{baseinfo.result.type == 1?'未引起涉刑案件':'引起涉刑案件'}}
							</div>
						</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem" v-if="baseinfo.result&&baseinfo.result.type == 1">
					<span class="infoItemT">撤销时间：</span>
					<span class="infoItemC">{{baseinfo.base.reportDateStr == null||baseinfo.base.reportDateStr == ''?'--':baseinfo.base.reportDateStr}}
					</span>
				</div>
				<div class="infoItem" v-if="baseinfo.result&&baseinfo.result.type == 1">
					<span class="infoItemT">撤销原因：</span>
					<span class="infoItemC">{{baseinfo.result.revokeCase == null||baseinfo.result.revokeCase == ''?'--':baseinfo.result.revokeCase}}
					</span>
				</div>
				<div class="infoItem" v-if="baseinfo.result&&baseinfo.result.type == 1">
					<span class="infoItemT">撤销结果：</span>
					<span class="infoItemC">{{baseinfo.result.revokeResult == null||baseinfo.result.revokeResult == ''?'--':baseinfo.result.revokeResult}}
					</span>
				</div>
				<div class="infoItem" v-if="baseinfo.result&&baseinfo.result.type == 2">
					<span class="infoItemT" style="vertical-align:middle">录入涉刑案件：</span>
					<span class="infoItemC" style="vertical-align:middle">
						<el-button type="primary" size="mini" class="commonBtn" style="width:auto;padding:0 10px" @click="goEnter" :disabled="!baseinfo.judicialId">录入涉刑案件</el-button>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT" style="vertical-align:middle">附件：</span>
					<span class="infoItemC" style="vertical-align:middle">
						<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.result.attachment)" :disabled="!baseinfo.result||!baseinfo.result.attachment">批量下载</el-button>
						<i class="el-icon-paperclip"></i>共{{baseinfo.result&&baseinfo.result.attachment?baseinfo.result.attachment.length:'0'}}个附件
					</span>
				</div>
				<div class="infoItem">
					<span v-if="baseinfo.result&&baseinfo.result.attachment" class="file">
						<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.result.attachment" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
							<div style="text-align:center;margin:0">
								<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
								<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
							</div>
							<em @click="goDownload(item.url,item.name)" slot="reference">
							{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.result.attachment.length-1">、</i><i style="color:#000" v-else>。</i>
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
				<el-table-column prop="version" label="案件风险事件版本号" align="center" width="180">
	                <template slot-scope="scope">
	                    <span :title="scope.row.version" class="textOverFlow">{{scope.row.version == null?'--':scope.row.version}}</span>
	                </template>
	            </el-table-column>
				<el-table-column prop="caseDes" label="案件风险事件概述" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.caseDes" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)">{{scope.row.caseDes == null?'--':scope.row.caseDes}}</span>
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
	          	titMsg:"案件风险事件详情",
	          	baseinfo:{},
	          	//查询数据
	          	checkData:{
	          		id:this.$route.query.infoId,
	          		flag:this.$route.query.flag
	          	},
		       	// 附件
		       	evidenceFiles:[],
		       	companyList:{},
		       	tableData:[],
		       	path:false,
		       	statisPath:false,
		       	sendBack:false,
		       	isOpen:false,
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
	    			this.$router.push({
			    		path:'/caseSeasonReport',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
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
	    		} else if(this.sendBack == true){
	    			sessionStorage.setItem('sendBackPath','sixth')
	    			this.$router.push({
			    		name: 'sendBack',
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
	    	searchData(data){
	    		if(this.$route.query.flag == 3){
	    			data.flag = 0
	    		}
	    		this.axios.post('case/detail',qs.stringify(data)).then((res)=>{
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
	    		this.axios.post('case/history',qs.stringify(data)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					this.tableData = []
	    					this.tableData = res.data
	    				}
	        		} else {
	        			this.$alert(res.message, '提示', {
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
		            path:'/caseDetail',   //跳转的路径
		            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		            	infoId:row.id,
		              	flag:this.$route.query.flag,
		              	sn:row.sn,
		              	belongCompany:this.$route.query.belongCompany,
              			company:this.$route.query.company,
              			id: this.$route.query.id
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
					this.axios.post('comm/download/706',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
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
			},
			goEnter(){
	    		this.$router.push({
		    		path:'/justiceDetail',
		    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		              	infoId:this.baseinfo.judicialId,
			            flag:1,
			            caseId:this.baseinfo.id,
			            status:this.$route.query.flag,
                		id: this.$route.query.id
		            }
		    	})
	    	}
	    },
	    beforeRouteEnter (to, from, next) {
			next((that) => {
			    // if(from.fullPath.includes('/judicialInfo')){
			    // 	that.path = true
			    // }
			    if(from.fullPath.includes('/detialList')){
			    	that.statisPath = true
			    }
			    if(from.fullPath.includes('/sendBack')){
			    	that.sendBack = true
			    }
			})
	    }
  	};
</script>
<style lang="scss">
#caseDetail{
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
				padding-left:180px;
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
				width:180px;
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
				width:calc(100% - 180px)
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
