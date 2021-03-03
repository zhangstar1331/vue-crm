<template>
  	<el-container id="leSendDetail">
  		<div id="top"></div>
	  	<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span class="textColor1">损失事件管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor1" @click="goback">损失事件报送</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span class="textColor">{{titMsg}}</span></el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="9">
					<el-button type="primary" size="mini" class="commonBtn" @click="goback">返回</el-button>
			  	</el-col>
		  	</el-row>
	  	</el-header>
  		<div class="contList firstBox">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件名称</span><span class="lossNo" v-if="this.$route.query.flag == 1">损失事件编号：{{lossEvent.number}}</span></div>
	      	<el-row>
		        <el-col :span="11">
		        	<div class="infoItem">
		        		<span class="infoItemT1">事件名称：</span>
		        		<span class="infoItemC1">{{lossEvent.name == null?'--':lossEvent.name}}</span>
		        	</div>
				</el-col>
				<el-col :span="11">
					<div class="infoItem">
						<span class="infoItemT2">是否关联合规信息：</span>
			        	<span class="infoItemC2">{{lossEvent.isRelevance == 1?'是':'否'}}</span>
		        	</div>
				</el-col> 
	      	</el-row>
		</div>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件时间</span></div>
	      	<el-row>
		        <el-col :span="11">
		        	<div class="infoItem">
		        		<span class="infoItemT1">事件发生时间：</span>
		        		<span class="infoItemC1">
		        		{{lossEvent.happenDate == null?'--':lossEvent.happenDate.substring(0,4)+'/'+lossEvent.happenDate.substring(4,6)+'/'+lossEvent.happenDate.substring(6,8)}}</span>
		        	</div>
				</el-col>
				<el-col :span="11">
					<div class="infoItem">
						<span class="infoItemT2">事件报告时间：</span>
			        	<span class="infoItemC2">{{lossEvent.reportDate == null?'--':lossEvent.reportDate.substring(0,4)+'/'+lossEvent.reportDate.substring(4,6)+'/'+lossEvent.reportDate.substring(6,8)}}</span>
		        	</div>
				</el-col> 
	      	</el-row>
		</div>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件所属机构</span></div>
			<el-row v-for="(item,index) in lossEvent.belongOrganization" :key="item.id">
		        <el-col :span="7">
		        	<div class="infoItem">
			        	<span class="infoItemT1">事件所属机构：</span>
			        	<span class="infoItemC1">
			        		<em style="font-style:normal">
			        			{{item.orgName == null||item.orgName == ''?'--':item.orgName}}
			        		</em>
			        	</span>
		        	</div>
				</el-col>
				<el-col :span="7">
					<div class="infoItem">
						<span class="infoItemT2">四级机构：</span>
						<span class="infoItemC2">
			        		{{item.fourthOrganization == null||item.fourthOrganization == ''?'--':item.fourthOrganization}}
			        	</span>
		        	</div>
				</el-col>
				<el-col :span="7">
					<div class="infoItem">
						<span class="infoItemT2">事件涉及部门：</span>
						<span class="infoItemC2">
			        		{{item.involveName == null||item.involveName == ''?'--':item.involveName}}
			        	</span>
		        	</div>
				</el-col>
	      	</el-row>
		</div>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件详述</span><el-tooltip class="item" effect="dark" placement="top">
				<div slot="content" style="line-height:18px">
					1. 外部事件：因自然灾害或其他事件（如恐怖袭击）、政策变化导致的损失事件。<br/>
					2. 业务活动：指因未按有关规定造成未对特定客户履行份内义务或产品性质或设计缺陷导致的损失事件。<br/>
					3. 业外案件：指业外人员实施的，给公司造成损失的司法案件。<br/>
					4. 业内案件：公司内部人员参与实施的司法案件。<br/>
					5. 行政处罚：监管部门及其他行政部门实施的处罚决定。<br/>
					6. 人员风险：指因人员失职、知识/技能匮乏、操作失误等导致的损失事件。<br/>
					7. 信息系统风险：因系统无法正常运行导致的损失事件。<br/>
					8. 流程风险：因流程设计缺陷或流程执行不到位导致的损失事件。
				</div>
				<i class="el-icon-question"></i>
			</el-tooltip></div>
	      	<el-row>
		        <el-col :span="14">
		        	<div class="infoItem">
			        	<span class="infoItemT">事件类型：</span>
			        	<span class="infoItemC">{{lossEvent.incidentType == null?'--':incidentType[lossEvent.incidentType]}}</span>
			        	</div>
				</el-col>
				<el-col :span="10">
					<div class="infoItem">
						<span class="infoItemT1">发现方式：</span>
			        	<span class="infoItemC1">{{lossEvent.discoverWay == null?'--':discoverWay[lossEvent.discoverWay]}}</span>
		        	</div>
				</el-col>
	      	</el-row>
	      	<el-row class="filedetail">
				<el-col :span="24">
					<div class="infoItem">
						<span class="infoItemT">文件依据：</span>
			        	<span class="infoItemC">{{lossEvent.isEvidence == 1?'是':'否'}}&nbsp;&nbsp;&nbsp;&nbsp;{{lossEvent.evidenceNum == null?'--':lossEvent.evidenceNum}}</span>
			        	<p>
			        		<span style="width:100%;margin-bottom:10px">
			        			附件：
			        			<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(lossEvent.evidenceFiles)" :disabled="!lossEvent.evidenceFiles">批量下载</el-button>
								<i class="el-icon-paperclip"></i>共{{lossEvent.evidenceFiles?lossEvent.evidenceFiles.length:'0'}}个附件
			        		</span>
			        		<span v-if="lossEvent.evidenceFiles" style="width:100%">
			        			<el-popover placement="top" trigger="click" v-for="(item,index) in lossEvent.evidenceFiles" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
									<div style="text-align:center;margin:0">
										<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
										<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
									</div>
									<em @click="goDownload(item.url,item.name)" slot="reference">
									{{item.name == null||item.name == ''?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== lossEvent.evidenceFiles.length-1">、</i><i style="color:#000" v-else>。</i>
									</em>
								</el-popover>
			        		</span>
			        		<span v-else>--</span>
			        	</p>
		        	</div>
				</el-col>
			</el-row>
			<el-row class="filedetail risk">
				<el-col :span="24">
					<div class="infoItem">
						<span class="infoItemT">是否属于重大风险事件：</span>
						<span class="infoItemC">{{lossEvent.isSeriousRisk == 1?'是':'否'}}</span>
			        	<p>
			        		<span style="width:100%;margin-bottom:10px">
			        			附件：
			        			<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(lossEvent.seriousRiskFiles)" :disabled="!lossEvent.seriousRiskFiles">批量下载</el-button>
								<i class="el-icon-paperclip"></i>共{{lossEvent.seriousRiskFiles?lossEvent.seriousRiskFiles.length:'0'}}个附件
			        		</span>
			        		<span v-if="lossEvent.seriousRiskFiles" style="width:100%">
			        			<el-popover placement="top" trigger="click" v-for="(item,index) in lossEvent.seriousRiskFiles" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
									<div style="text-align:center;margin:0">
										<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
										<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
									</div>
									<em @click="goDownload(item.url,item.name)" slot="reference">
									{{item.name == null||item.name == ''?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== lossEvent.seriousRiskFiles.length-1">、</i><i style="color:#000" v-else>。</i>
									</em>
								</el-popover>
			        		</span>
			        		<span v-else>--</span>
			        	</p>
		        	</div>
				</el-col>
			</el-row>
			<el-row class="ledetail">
				<el-col :span="24">
					<div class="infoItem">
						<span class="infoItemT">事件描述：</span>
						<span class="infoItemC">{{lossEvent.describe == null?'--':lossEvent.describe}}</span>
					</div>
					<div class="infoItem">
						<span class="infoItemT">已采取措施：</span>
						<span class="infoItemC">{{lossEvent.adoptMeasures == null?'--':lossEvent.adoptMeasures}}</span>
					</div>
					<div class="infoItem">
						<span class="infoItemT">未来损失预测：</span>
						<span class="infoItemC">{{lossEvent.lossForecast == null?'--':lossEvent.lossForecast}}</span>
					</div>
					<div class="infoItem">
						<span class="infoItemT">下一步拟采取措施：</span>
						<span class="infoItemC">{{lossEvent.nextAdoptMeasures == null?'--':lossEvent.nextAdoptMeasures}}</span>
					</div>
			    </el-col> 
			</el-row>
		</div>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件损失金额明细</span><el-tooltip class="item" effect="dark" placement="top">
					<div slot="content" style="line-height:18px;width:500px">
						1. 法律成本：因保险公司发生操作风险事件引发法律诉讼或仲裁，在诉讼或仲裁过程中依法支出的诉讼费用、仲裁费用及其他法律成本。如违反知识产权保护规定等导致的诉讼费、外聘律师代理费、评估费、鉴定费等。<br/>
						2. 监管罚没：因操作风险事件所遭受的监管部门或有权机关罚款及其他处罚。如违反政策、监管法规等所遭受的罚款、吊销执照等。<br/>
						3. 资产损失：由于疏忽、事故或自然灾害等事件造成实物资产的直接毁坏和价值的减少。如火灾、洪水、地震等自然灾害所导致的账面价值减少等。<br/>
						4. 对外赔偿：由于内部操作风险事件，导致保险公司未能履行应承担的责任造成对外的赔偿。如因公司自身业务中断、交割延误、内部案件造成客户资金或资产等损失的赔偿金额。<br/>
						5. 追索失败：由于工作失误、失职或内部事件，使原本能够追偿但最终无法追偿所导致的损失，或因有关方不履行相应义务导致追索失败所造成的损失。如资金划转错误、相关文件要素缺失、跟踪监测不及时所带来的损失等。<br/>
						6. 账面减值：由于偷盗、欺诈、未经授权活动等操作风险事件所导致的资产账面价值直接减少。如内部欺诈导致的销账、外部欺诈和偷盗导致的账面资产/收入损失，以及未经授权或超授权交易导致的账面损失等。<br/>
						7. 其他损失：由于操作风险事件引起的其他损失。<br/>
					</div>
					<i class="el-icon-question"></i>
				</el-tooltip></div>
			<div class="lossMoney">
				<el-row class="bgColor">
					<el-col :span="24">
						<p>损失总额（A）{{lossEvent.a == null?'--':lossEvent.a}}（万元）（A=a1+a2+a3+a4+a5+a6+a7）</p>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<span class="LEtitle">A1</span>
						<span class="LEname"><em>法律成本（万元）：{{lossEvent.a1 == null?'--':lossEvent.a1}}</em><i class="el-icon-tickets" @click="getOrgMoney('a1')"></i></span>
					</el-col>
					<el-col :span="8">
						<span class="LEtitle">A2</span>
						<span class="LEname"><em>监管罚没（万元）：{{lossEvent.a2 == null?'--':lossEvent.a2}}</em><i class="el-icon-tickets" @click="getOrgMoney('a2')"></i></span>
					</el-col>
					<el-col :span="8">
						<span class="LEtitle">A3</span>
						<span class="LEname"><em>资产损失（万元）：{{lossEvent.a3 == null?'--':lossEvent.a3}}</em><i class="el-icon-tickets" @click="getOrgMoney('a3')"></i></span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<span class="LEtitle">A4</span>
						<span class="LEname"><em>对外赔偿（万元）：{{lossEvent.a4 == null?'--':lossEvent.a4}}</em><i class="el-icon-tickets" @click="getOrgMoney('a4')"></i></span>
					</el-col>
					<el-col :span="8">
						<span class="LEtitle">A5</span>
						<span class="LEname"><em>追索失败（万元）：{{lossEvent.a5 == null?'--':lossEvent.a5}}</em><i class="el-icon-tickets" @click="getOrgMoney('a5')"></i></span>
					</el-col>
					<el-col :span="8">
						<span class="LEtitle">A6</span>
						<span class="LEname"><em>账面减值（万元）：{{lossEvent.a6 == null?'--':lossEvent.a6}}</em><i class="el-icon-tickets" @click="getOrgMoney('a6')"></i></span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<span class="LEtitle">A7</span>
						<span class="LEname"><em>其他损失（万元）：{{lossEvent.a7 == null?'--':lossEvent.a7}}</em><i class="el-icon-tickets" @click="getOrgMoney('a7')"></i></span>
					</el-col>
					<el-col :span="8">
						<span class="LEtitle">C</span>
						<span class="LEname"><em>预计还会发生的损失（万元）：{{lossEvent.c == null?'--':lossEvent.c}}</em><i class="el-icon-tickets" @click="getOrgMoney('c')"></i></span>
					</el-col>
					<el-col :span="8"></el-col>
				</el-row>
			</div>
			<div class="lossMoney">
				<el-row class="bgColor">
					<el-col :span="24">
						<p>追回金额</p>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<span class="LEtitle">B</span>
						<span class="LEname"><em>追回总额（万元）：{{lossEvent.b == null?'--':lossEvent.b}}</em><i class="el-icon-tickets" @click="getOrgMoney('b')"></i></span>
					</el-col>
					<el-col :span="8">
						<span class="LEtitle">E</span>
						<span class="LEname"><em>预计追回金额（万元）：{{lossEvent.e == null?'--':lossEvent.e}}</em><i class="el-icon-tickets" @click="getOrgMoney('e')"></i></span>
					</el-col>
					<el-col :span="8"></el-col>
				</el-row>
			</div>
			<div class="lossMoney">
				<el-row class="bgColor">
					<el-col :span="24">
						<p>净损失金额信息（D）（万元）（D=A+C-B-E）</p>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<span class="LEtitle">D</span>
						<span class="LEname">净损失总额（万元）：{{lossEvent.d == null?'--':lossEvent.d}}</span>
					</el-col>
					<el-col :span="8"></el-col>
					<el-col :span="8"></el-col>
				</el-row>
			</div>
			<p class="remark">备注：{{lossEvent.remark == null?'--':lossEvent.remark}}</p>
		</div>	
     	<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">维护记录</span></div>
			<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column prop="number" label="损失事件版本号" align="center" width="160">
	                <template slot-scope="scope">
	                    <span>{{scope.row.number == null?'--':scope.row.number}}</span>
	                </template>
	            </el-table-column>
				<el-table-column prop="name" label="事件名称" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.name" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)">{{scope.row.name == null?'--':scope.row.name}}</span>
	                </template>
	            </el-table-column>
            	<el-table-column prop="reportDate" label="报送时间" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.reportDate == null?'--':scope.row.reportDate}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="updateDate" label="维护时间" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.updateDate == null?'--':scope.row.updateDate}}</span>
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
     	<loss-money v-if="isShow" :isDisabled="true" @closeMask="closeMaskTable"></loss-money>
  	</el-container>
</template>
<script>
	import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import lossMoney from 'src/components/infoManage/lossMoney'
	import qs from 'qs'
  	export default {
	  	data() {
	        return {
	          	titMsg:"损失事件详情",
	          	//查询数据
	          	checkData:{},
	          	lossEvent:{},
	          	incidentType:{
	          		'1':'外部事件',
	          		'2':'业务活动',
	          		'3':'业外案件',
	          		'4':'业内案件',
	          		'5':'行政处罚',
	          		'6':'人员风险',
	          		'7':'信息系统风险',
	          		'8':'流程风险'
  				},
  				discoverWay:{
		          	'1':'外部检查',
		          	'2':'内部审计',
		          	'3':'上级检查',
		          	'4':'公司自查',
		          	'5':'客户投诉',
		          	'6':'举报',
		          	'7':'其他'
		        },
  				tableData:[],
  				path:false,
  				isOpen:false,
  				isShow:false,
  				orgList:[]
			}
	   	},
	   	components:{
	    	lossMoney
	    },
	    created(){
	    	this.searchData()
	    },
	    methods:{
	    	searchData(){
	    		var params = qs.stringify({
		    		id: this.$route.query.lossId,
		        	type:1
	        	})
	    		this.axios.post('lossincident/details',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					this.lossEvent = res.data.data
	    					if(res.data.log){
	    						this.tableData = res.data.log
	    					}
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	    	},
		    // 返回
	    	goback(){
	    		// 季报
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'/seasonReport',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			              	id: this.$route.query.id
			            }
			    	})
	    		} else if(this.path == true){
	    			this.$router.push({
			    		name: 'leStoreAall',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			            	belongCompany:this.$route.query.belongCompany,
              				company:this.$route.query.company,
              				id: this.$route.query.id
			            }
			    	})
	    		} else{
	    			sessionStorage.setItem('path',this.$route.query.flag)
	    			this.$router.push({
			    		path:'/lossEvent/lossEventSend',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			              	id: this.$route.query.id
			            }
			    	})
	    		}
	    	},
	    	// 详情
		    goDetail(index,row){
		    	var element = document.getElementById("top");
          		element.scrollIntoView({block: 'start', behavior: "smooth"});
		        this.$router.push({
		            path:'/leSendDetail',   //跳转的路径
		            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		            	lossId:row.id,
		              	flag:this.$route.query.flag,
		              	belongCompany:this.$route.query.belongCompany,
              			company:this.$route.query.company
		            }
		        })
		        this.searchData()
		    },
		    goDownload(url,name,type){
		    	var fileType = url.substring(url.lastIndexOf('.')+1)
		    	if(fileType == 'rar' || fileType == 'zip' || type == '1'){
		    		var obj = new Object()
					obj.filePath = url;
					obj.fileName = encodeURIComponent(name);
					this.axios.post('comm/download/601',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
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
			getOrgMoney(type){
				if(this.lossEvent[type+'m']&&JSON.stringify(this.lossEvent[type+'m']) !== '{}'){
					var aaa = Object.keys(this.lossEvent[type+'m'])
					for(var i = 0;i<this.lossEvent.belongOrganization.length;i++){
						if(aaa.indexOf(this.lossEvent.belongOrganization[i].organization)>=0){
							for(let key in this.lossEvent[type+'m']){
								if(this.lossEvent.belongOrganization[i].organization == key){
									this.lossEvent.belongOrganization[i].money = this.lossEvent[type+'m'][key]
								}
							}
						} else{
	    					delete this.lossEvent.belongOrganization[i].money
	    				}
					}
				} else{
					for(var i = 0;i<this.lossEvent.belongOrganization.length;i++){
						delete this.lossEvent.belongOrganization[i].money
					}
				}
				this.orgList = this.lossEvent.belongOrganization
				sessionStorage.setItem('orgList',JSON.stringify(this.orgList))
				this.isShow = true
			},
			closeMaskTable(data){
		    	this.isShow = data.status;
		    },
	    },
	    beforeRouteEnter (to, from, next) {
			next((that) => {
			    if(from.fullPath.includes('/leStoreAall')){
			    	that.path = true
			    }
			})
	    }
  	};
</script>
<style lang="scss">
#leSendDetail{
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
	.el-table__body, .el-table__footer, .el-table__header{
		border-collapse: collapse
	}
	th{
		background: #F9F9F9;
	    color: #909399;
	    font-weight: bold;
	}
	.el-table__empty-block{
		background: #fff;
	}
	.el-table td .cell,.el-table__empty-text{
      font-weight:normal;
      cursor:pointer
    }
    .el-pagination{
    	margin-top: 30px;
    }
    .el-tabs__active-bar{
    	display: none;
    }
    .handleBtn{
    	display: inline-block;
    	padding: 0 5px
    }
    .handleBtn:hover{
    	cursor: pointer;
    }
    .textOverFlow{
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.contList{
		background: #fff;
		padding: 16px 16px 10px 16px;
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
			.lossNo{
				float:right;
				color:#909191
			}
		}
	}
	.ledetail{
		textarea{
			height:75px;
			resize:none
		}
	}
	.filedetail{
		.el-form-item__label{
			float:left;
			width:10%;
			height:32px;
			line-height:32px;
			padding:0 20px 0 0;
			text-align:justify
		}
		.el-form-item label:after {
	        content: " ";
	        display: inline-block;
	        width: 100%;
	    }
		.el-form-item .el-form-item__content{
			float:left;
			width:90%;
		}
		.el-input{
			width:84%!important;
		}
		.el-select{
			width:10%!important;
			.el-input{
				width:100%!important
			}
			.el-input__inner{
				border-right:none;
				border-top-left-radius:4px;
				border-bottom-left-radius:4px;
			}
		}
		.el-input__inner{
			border-right:none;
			border-radius:0;
		}
		.el-upload{
			float:right;
			width:6%;
			margin-top:-40px;
		}
		.el-upload__tip{
			color:#909191
		}
		.el-upload-list{
			width:50%;
			cursor:pointer;
			.el-upload-list__item{
				a:hover{
					color:#4285F4;
				}
			}
		}
		
	}
	.risk .el-upload{
		float:left;
		margin-left:10%
	}
	.firstBox{
    	margin-top: 75px;
	}
	table tr:last-child td{
		border-bottom: none
	}
	.el-table::before{
		background-color: transparent!important
	}
	.el-form-item{
		margin-bottom:25px
	}
	.el-form-item .el-form-item__content{
		width:70%;
		display:inline-block;
		vertical-align:top;
	}
	.el-form-item .el-form-item__content .el-select--mini{
		width:100%
	}
	.el-form--label-left .el-form-item__label{
		height:32px;
		line-height:32px;
	}
    .alignCenter .el-col{
    	text-align: center
    }
    .alignCenter .el-col:first-child{
    	text-align: left
    }
    .moreBtn,.detailBtn{
        color: #4285F4;
        padding: 0 2px;
    }
    .detailBtn:hover,.moreBtn:hover{
        cursor: pointer;
    }
    .el-tabs__header{
      margin:0;
    }
    .el-tabs{
    	margin-bottom:20px
    }
    .el-tabs__item{
      padding:0;
      width: 100px;
      text-align: center;
    }
    .el-tabs__active-bar{
      display: none;
    }
    .is-active{
      background: #4285F4!important;
      color: #fff!important;
      text-align: center;
    }
	
	.el-input .el-input__inner{
		height:32px;
		line-height:32px;
	}
	.el-tabs__nav-wrap::after{
		background:none
	}
	.note .el-form-item__content{
		background: #fff;
		-webkit-box-shadow: 4px 2px 6px #888;
		border-radius: 8px;
		width:100%;
		textarea{
			height:250px;
			border:none;
			border-radius: 8px;
			resize:none
		}
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
	.lossMoney{
		text-align:center;
		border-top:1px solid #E9E9E9;
		border-left:1px solid #E9E9E9;
		margin-bottom:20px;
		.bgColor{
			background:#F9F9F9
		}
		.el-col{
			height:64px;
			line-height:64px;
			border-bottom:1px solid #E9E9E9;
			border-right:1px solid #E9E9E9;
			span{
				float:left;
				border-right:1px solid #E9E9E9;
				box-sizing:border-box;
			}
			.LEtitle{
				width:15%;
				font-size:16px;
				background:#F9F9F9
			}
			.LEname{
				display:flex;
				width:85%;
				text-align:left;
				padding-left:20px;
				border-right:none;
				font-size:14px;
				align-items:center;
				justify-content:space-between;
				em,b{
					font-style:normal;
					font-weight:normal
				}
				.el-icon-tickets{
					font-size:28px;
					padding:0 15px;
					color:#999;
				}
			}
		}
	}
	.remark{
		width:100%;
		line-height:32px;
		padding-bottom:10px
	}
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
		.infoItemT,.infoItemT1,.infoItemT2{
			width:170px;
			text-align:justify
		}
		.infoItemT1{
			width:110px!important
		}
		.infoItemT2{
			width:140px!important
		}
		.infoItemT:after,.infoItemT1:after,.infoItemT2:after,p:after{
			content:'';
		    width: 100%;
		    display: inline-block;
		    overflow: hidden;
		    height: 0;
		}
		.infoItemC,.infoItemC1,.infoItemC2{
			width:calc(100% - 170px);
			text-align:left;
			margin-bottom:10px
		}
		.infoItemC1{
			width:calc(100% - 110px)!important
		}
		.infoItemC2{
			width:calc(100% - 140px)!important;

		}
	}
	.el-icon-paperclip{
		margin-right:5px
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
}	

</style>
