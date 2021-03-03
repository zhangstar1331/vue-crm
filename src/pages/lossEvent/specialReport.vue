<template>
  	<el-container id="specialReport">
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
					<el-button type="primary" size="mini" class="commonBtn" @click="goSubmit('lossEvent',2)">保存</el-button>
					<el-button type="primary" size="mini" class="commonBtn" @click="goSubmit('lossEvent',1)">提交</el-button>
			  	</el-col>
		  	</el-row>
	  	</el-header>
		<el-form label-position="left" size="mini" ref="lossEvent" :model="lossEvent">
	  		<div class="contList firstBox">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件名称</span></div>
		      	<el-row>
			        <el-col :span="11">
			        	<el-form-item label="事件名称" prop="name">
						    <el-input placeholder="请输入事件名称" v-model="lossEvent.name" @change="getEventName" :disabled="isDisabled" maxlength="30"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" class="infoLabel">
			        	<el-form-item label="是否关联合规信息">
						    <el-select v-model="relevance.region" @change="changeRelevance" placeholder="是否关联合规信息" disabled>
								<el-option v-for="item in relevance.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>						
						</el-form-item>
					</el-col> 
		      	</el-row>
			</div>
			<div class="contList">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件时间</span></div>
		      	<el-row>
			        <el-col :span="11">
			        	<el-form-item label="事件发生时间" prop="happenDate">
						    <el-date-picker type="date" @change="getHappenDate" placeholder="选择日期" v-model="lossEvent.happenDate" :picker-options="pickerOptions1" :disabled="isDisabled"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="11" class="infoLabel">
			        	<el-form-item label="事件报告时间">
						    <el-date-picker type="date" placeholder="选择日期" v-model="lossEvent.reportDate" :picker-options="pickerOptions2" disabled></el-date-picker>			
						</el-form-item>
					</el-col> 
		      	</el-row>
			</div>
			<div class="contList">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">事件所属机构</span></div>
				<el-row v-for="(item,index) in lossEvent.belongOrganization" :key="item.id">
			        <el-col :span="7" style="margin-right:5px">
			        	<el-form-item label="事件所属机构">
						    <el-select v-model="item.orgName" placeholder="请选择事件所属机构" :disabled="item.isDisabled">
								<el-option :value="item.orgName" style="height:auto;background:#FFF">
									<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,node,index)})" :load="loadNode" lazy node-key="id"></el-tree>
								</el-option>
							</el-select>		
						</el-form-item>
					</el-col>
					<el-col :span="7" style="margin-right:5px" class="noStar">
			        	<el-form-item label="四级机构">
			        		<el-input v-model="item.fourthOrganization" placeholder="请输入四级机构" @change="((val)=>{getFourthOrganization(val, index)})" :disabled="item.isDisabled"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
			        	<el-form-item label="事件涉及部门">
			        		<el-input v-model="item.involveName" placeholder="请输入事件涉及部门" @change="((val)=>{getInvolveName(val, index)})" :disabled="item.isDisabled" maxlength="30"></el-input>
						</el-form-item>
					</el-col>
					<el-button type="primary" size="mini" class="commonBtn" @click="goAdd" v-if="index == 0">增加</el-button>
					<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(index)" v-if="index !== 0" :disabled="item.isDisabled">删除</el-button>
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
				</el-tooltip>
				</div>
		      	<el-row>
			        <el-col :span="14" class="event">
			        	<el-form-item label="事件类型">
						    <el-select v-model="incidentType.region" @change="changeIncidentType" placeholder="请选择事件类型">
								<el-option v-for="item in incidentType.unitsData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
							</el-select>		
						</el-form-item>
					</el-col>
					<el-col :span="10" class="find">
			        	<el-form-item label="发现方式">
						    <el-select v-model="discoverWay.region" @change="changeDiscoverWay" placeholder="请选择发现方式">
								<el-option v-for="item in discoverWay.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
		      	</el-row>
		      	<el-row class="filedetail">
					<el-col :span="24" class="noStar">
						<el-form-item label="文件依据">
							<el-select v-model="evidence.region" @change="changeEvidence" placeholder="是否有文件依据">
								<el-option v-for="item in evidence.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select><el-input placeholder="请填写损失事件正式的内外部文件依据，如监管行政处罚文号、公司OA系统文号" v-model="lossEvent.evidenceNum" @change="getEvidenceNum"></el-input><el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile1" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles,1)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles" :disabled="this.checkData.isEvidence !== 1">
								<el-button type="primary" size="mini" class="commonBtn" :disabled="this.checkData.isEvidence !== 1">上传附件</el-button>
								<div slot="tip" class="el-upload__tip">
									<span>附件：</span>
									<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>
									2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>
									3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
								</div>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="filedetail risk">
					<el-col :span="24">
						<el-form-item label="是否属于重大风险事件">
							<el-select v-model="seriousRisk.region" @change="changeSeriousRisk" placeholder="是否属于重大风险事件">
								<el-option v-for="item in seriousRisk.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select><el-upload class="upload-demo" action="" ref="upload1" :http-request="uploadFile2" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,seriousRiskFiles,2)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="seriousRiskFiles" :disabled="this.checkData.isSeriousRisk !== 1">
								<el-button type="primary" size="mini" class="commonBtn" :disabled="this.checkData.isSeriousRisk !== 1">上传附件</el-button>
								<div slot="tip" class="el-upload__tip">
									<span>附件：</span>
									<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>
									2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>
									3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
								</div>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="srdetail">
					<el-col :span="24">
						<el-form-item label="事件描述">
						    <el-input type="textarea" :rows="2" placeholder="请输入事件描述（对事件进行具体描述，包括事件发生的原因，涉及的相关人员、事件经过、损失情况等，描述信息应简明扼要）" v-model="lossEvent.describe" @change="getDescribe" maxlength="500"></el-input>
						</el-form-item>
						<el-form-item label="已采取措施">
						    <el-input type="textarea" :rows="2" placeholder="以简要文字描述采取的具体措施" v-model="lossEvent.adoptMeasures" @change="getAdoptMeasures" maxlength="500"></el-input>
						</el-form-item>
						<el-form-item label="未来损失预测">
						    <el-input type="textarea" :rows="2" placeholder="以简要文字描述未来该事件可能引发进一步损失的可能性及损失的大小" v-model="lossEvent.lossForecast" @change="getLossForecast" maxlength="500"></el-input>
						</el-form-item>
						<el-form-item label="下一步拟采取措施">
						    <el-input type="textarea" :rows="2" placeholder="以简要文字描述采取的具体措施" v-model="lossEvent.nextAdoptMeasures" @change="getNextAdoptMeasures" maxlength="500"></el-input>
						</el-form-item>
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
							<p>损失总额（A）（万元）{{totalSum}}（A=a1+a2+a3+a4+a5+a6+a7）</p>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<span class="LEtitle">A1</span>
							<span class="LEname">法律成本（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.a1}}<b v-if="lossEvent.a1 == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('a1')"></i></span>
							<!-- <el-input v-model="lossEvent.a1" @change="getA1" placeholder="请点击右侧明细输入金额" suffix-icon="el-icon-tickets"></el-input> -->
						</el-col>
						<el-col :span="8">
							<span class="LEtitle">A2</span>
							<span class="LEname">监管罚没（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.a2}}<b v-if="lossEvent.a2 == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('a2')"></i></span>
<!-- 							<el-input v-model="lossEvent.a2" @change="getA2" placeholder="请输入金额"></el-input>
 -->						</el-col>
						<el-col :span="8">
							<span class="LEtitle">A3</span>
							<span class="LEname">资产损失（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.a3}}<b v-if="lossEvent.a3 == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('a3')"></i></span>
<!-- 							<el-input v-model="lossEvent.a3" @change="getA3" placeholder="请输入金额"></el-input>
 -->						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<span class="LEtitle">A4</span>
							<span class="LEname">对外赔偿（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.a4}}<b v-if="lossEvent.a4 == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('a4')"></i></span>
<!-- 							<el-input v-model="lossEvent.a4" @change="getA4" placeholder="请输入金额"></el-input>
 -->						</el-col>
						<el-col :span="8">
							<span class="LEtitle">A5</span>
							<span class="LEname">追索失败（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.a5}}<b v-if="lossEvent.a5 == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('a5')"></i></span>
<!-- 							<el-input v-model="lossEvent.a5" @change="getA5" placeholder="请输入金额"></el-input>
 -->						</el-col>
						<el-col :span="8">
							<span class="LEtitle">A6</span>
							<span class="LEname">账面减值（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.a6}}<b v-if="lossEvent.a6 == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('a6')"></i></span>
<!-- 							<el-input v-model="lossEvent.a6" @change="getA6" placeholder="请输入金额"></el-input>
 -->						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<span class="LEtitle">A7</span>
							<span class="LEname">其他损失（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.a7}}<b v-if="lossEvent.a7 == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('a7')"></i></span>
<!-- 							<el-input v-model="lossEvent.a7" @change="getA7" placeholder="请输入金额"></el-input>
 -->						</el-col>
						<el-col :span="8">
							<span class="LEtitle">C</span>
							<span class="LEname LEheight">预计还会发<br>生的损失（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.c}}<b v-if="lossEvent.c == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('c')"></i></span>
<!-- 							<el-input v-model="lossEvent.c" @change="getC" placeholder="请输入金额"></el-input>
 -->						</el-col>
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
							<span class="LEname">追回总额（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.b}}<b v-if="lossEvent.b == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('b')"></i></span>
<!-- 							<el-input v-model="lossEvent.b" @change="getB" placeholder="请输入金额"></el-input>
 -->						</el-col>
						<el-col :span="8">
							<span class="LEtitle">E</span>
							<span class="LEname">预计追回金额（万元）</span>
							<span class="LEmoney"><em>{{lossEvent.e}}<b v-if="lossEvent.e == null">请点击右侧明细输入金额</b></em><i class="el-icon-tickets" @click="getOrgMoney('e')"></i></span>
<!-- 							<el-input v-model="lossEvent.e" @change="getE" placeholder="请输入金额"></el-input>
 -->						</el-col>
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
							<span class="LEname">净损失总额（万元）</span>
							<span class="LEmoney"><em>{{lossSum}}</em>&nbsp;</span>
<!-- 							<el-input v-model="lossSum" placeholder="请输入金额" disabled></el-input>
 -->						</el-col>
						<el-col :span="8"></el-col>
						<el-col :span="8"></el-col>
					</el-row>
				</div>
			</div>	
	      	<el-row>
	        	<el-col :span="24">
	        		<el-form-item label="" class="note">
					    <el-input type="textarea" :rows="2" placeholder="填写本次事件相关的备注信息，例如针对该事件进行的相关风险提示或认为需要建立相应的行动方案而提出的行动建议等" v-model="lossEvent.remark" @change="getRemark" maxlength="500"></el-input>
					</el-form-item>
			    </el-col> 
	     	</el-row>
     	</el-form>
     	<loss-money v-if="isShow" :orgType="orgType" @closeMask="closeMaskTable"></loss-money>
  	</el-container>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate,fileTypeDiffer} from 'src/utils/utils.js'
	import lossMoney from 'src/components/infoManage/lossMoney'
	import qs from 'qs'
  	export default {
	  	data() {
	        return {
	          	titMsg:"新建损失事件",
	          	baseInfo:'',
	          	isDisabled:false,
	          	//查询数据
	          	checkData:{
	          		submissionType:2,//专报
	          		isRelevance:0,//是否关联合规信息
	          		isEvidence:0,//文件依据默认否
	          		isSeriousRisk:0,//重大风险默认否
	          	},
	          	lossEvent:{
		        	name:'',// 事件名称
		        	happenDate:'',
		        	reportDate:new Date(),
		        	belongOrganization:[{
		        		orgName:null,
		        		organization:null,
		        		involveName:null,
		        		fourthOrganization:null
		        	}],
		        	evidenceNum:'',
		        	describe:'',
		        	adoptMeasures:'',
		        	lossForecast:'',
		        	nextAdoptMeasures:'',
		        	remark:'',// 备注
		        	a1:null,
		       		a2:null,
		       		a3:null,
		       		a4:null,
		       		a5:null,
		       		a6:null,
		       		a7:null,
		       		b:null,
		       		c:null,
		       		d:null,
		       		e:null,
		        },
	          	// 是否关联合规信息
		        relevance:{
			       	region: '否',
			       	unitsData:[{
			          	name:'是',
			          	id:1
			        },{
			          	name:'否',
			          	id:0
			        }]
		        },
		        pickerOptions1:{
	  				// disabledDate: (time) => {
	      //               return time.getTime() > Date.now();
		     //      	},
	  			},
	  			pickerOptions2:{
	  				disabledDate: (time) => {
		            	return time.getTime() > Date.now();
		          	},
  				},
  				incidentType:{
  					region: '',
			       	unitsData:[{
			          	name:'外部事件',
			          	id:1
			        },{
			          	name:'业务活动',
			          	id:2
			        },{
			          	name:'业外案件',
			          	id:3,
			          	disabled:true
			        },{
			          	name:'业内案件',
			          	id:4,
			          	disabled:true
			        },{
			          	name:'行政处罚',
			          	id:5,
			          	disabled:true
			        },{
			          	name:'人员风险',
			          	id:6
			        },{
			          	name:'信息系统风险',
			          	id:7
			        },{
			          	name:'流程风险',
			          	id:8
			        }]
  				},
  				discoverWay:{
  					region: '',
			       	unitsData:[{
			          	name:'外部检查',
			          	id:1
			        },{
			          	name:'内部审计',
			          	id:2
			        },{
			          	name:'上级检查',
			          	id:3
			        },{
			          	name:'公司自查',
			          	id:4
			        },{
			          	name:'客户投诉',
			          	id:5
			        },{
			          	name:'举报',
			          	id:6
			        },{
			          	name:'其他',
			          	id:7
			        }]
  				},
  				// 文件依据
  				evidence:{
			       	region: '否',
			       	unitsData:[{
			          	name:'是',
			          	id:1
			        },{
			          	name:'否',
			          	id:0
			        }]
		        },
		        // 是否属于重大风险事件
  				seriousRisk:{
			       	region: '否',
			       	unitsData:[{
			          	name:'是',
			          	id:1
			        },{
			          	name:'否',
			          	id:0
			        }]
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
		       	seriousRiskFiles:[],
		       	isShow:false,
		       	orgList:[],
		       	orgType:'',
		       	treeData:[]
			}
	   	},
	   	components:{
	    	lossMoney
	    },
	    created(){
	    	// 事件报告时间
	    	this.checkData.reportDate = formatDate(new Date(),'yyyyMMdd');
		  	this.checkData.reportDate = this.checkData.reportDate.split('-').join('')
	    	if(this.$route.query.flag == 2 || this.$route.query.flag == 3){
	    		this.titMsg = "编辑损失事件"
	    		this.getInfo()
	    	} else if(this.$route.query.flag == 1){
	    		this.titMsg = "维护损失事件"
	    		this.isDisabled = true
	    		this.getInfo()
	    	}
	    	this.connectAxios('1_01','','','1')
	    },
	    computed:{
	    	totalSum: function () {
	    		let sum1 = parseFloat(this.lossEvent.a1)+parseFloat(this.lossEvent.a2)+parseFloat(this.lossEvent.a3)+parseFloat(this.lossEvent.a4)+parseFloat(this.lossEvent.a5)+parseFloat(this.lossEvent.a6)+parseFloat(this.lossEvent.a7)
	    		return Number.isNaN(sum1)?'':sum1.toString().indexOf(".")>0?parseFloat(sum1.toFixed(6)):parseFloat(sum1)
	    	},
	    	lossSum: function () {
	    		let sum2 = parseFloat(this.lossEvent.a1)+parseFloat(this.lossEvent.a2)+parseFloat(this.lossEvent.a3)+parseFloat(this.lossEvent.a4)+parseFloat(this.lossEvent.a5)+parseFloat(this.lossEvent.a6)+parseFloat(this.lossEvent.a7)+parseFloat(this.lossEvent.c)-parseFloat(this.lossEvent.b)-parseFloat(this.lossEvent.e)
	    		return Number.isNaN(sum2)?'':sum2.toString().indexOf(".")>0?parseFloat(sum2.toFixed(6)):parseFloat(sum2)
	    	}
	    },
	    methods:{
	    	handleNodeClick(val,node,index) {
	    		if(node.disabled!=true){
					this.lossEvent.belongOrganization[index].orgName = val.name
					this.checkData.belongOrganization = this.lossEvent.belongOrganization
					if(val.groupId!==''){
						this.lossEvent.belongOrganization[index].organization = val.groupId
		      		} else{
		      			delete this.lossEvent.belongOrganization[index].organization
		      		}
		      		if(index>0){
			    		let arr = ['a1m','a2m','a3m','a4m','a5m','a6m','a7m','bm','cm','em']
						for(var j=0;j<arr.length;j++){
							if(this.checkData[arr[j]]){
								for(let key in this.checkData[arr[j]]){
					    			if(val.groupId==key){
					    				delete this.checkData[arr[j]][key]
					    			}
				    			}
				    			this.$set(this.lossEvent,arr[j].split('m')[0],null)
				    			this.$set(this.checkData,arr[j].split('m')[0],null)
			    			}
						}
	  				} else{
	  					let arr = ['a1','a2','a3','a4','a5','a6','a7','b','c','e']
	  					for(var j=0;j<arr.length;j++){
							if(this.checkData[arr[j]]){
								this.$set(this.lossEvent,arr[j],null)
								delete this.checkData[arr[j]]
			    			}
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
			        type:8
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
//	    	loadNode(node,resolve){
//	  			if (node.level == 0) {
//	  				this.node = node
//				  	this.resolve = resolve
//		        	this.axios.post('lossincident/companyInfo').then((res)=>{
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
	  		getInvolveName(val,index){
	  			this.lossEvent.belongOrganization[index].involveName = val
	    		this.checkData.belongOrganization = this.lossEvent.belongOrganization
	  		},
	  		getFourthOrganization(val,index){
	  			this.lossEvent.belongOrganization[index].fourthOrganization = val
	    		this.checkData.belongOrganization = this.lossEvent.belongOrganization
	  		},
	    	// 事件名称
	    	getEventName(val){
	    		if(val == ''){
	    			delete this.checkData.name
	    		} else{
	    			this.checkData.name = val
	    		}
	    	},
	    	//关联合规信息
	    	changeRelevance(val){
	    		this.checkData.isRelevance = val
	    	},
	    	//事件发生时间
	    	getHappenDate(val){
	    		if(val == ''){
	    			delete this.checkData.happenDate
	    		} else{
	    			this.checkData.happenDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.happenDate = this.checkData.happenDate.split('-').join('')
	    		}
	    	},
	    	// 事件类型
	    	changeIncidentType(val){
	    		this.checkData.incidentType = val
	    	},
	    	// 发现方式
	    	changeDiscoverWay(val){
	    		this.checkData.discoverWay = val
	    	},
	    	// 文件依据
	    	changeEvidence(val){
	    		this.checkData.isEvidence = val
	    	},
	    	// 是否属于重大风险事件
	    	changeSeriousRisk(val){
	    		this.checkData.isSeriousRisk = val
	    	},
	    	// 文件依据文号
	    	getEvidenceNum(val){
	    		if(val == ''){
	    			delete this.checkData.evidenceNum
	    		} else{
	    			this.checkData.evidenceNum = val
	    		}
	    	},
			// 事件描述
	    	getDescribe(val){
	    		if(val == ''){
	    			delete this.checkData.describe
	    		} else{
	    			this.checkData.describe = val
	    		}
	    	},
	    	// 已采取措施
	    	getAdoptMeasures(val){
	    		if(val == ''){
	    			delete this.checkData.adoptMeasures
	    		} else{
	    			this.checkData.adoptMeasures = val
	    		}
	    	},
	    	// 未来损失预测
	    	getLossForecast(val){
	    		if(val == ''){
	    			delete this.checkData.lossForecast
	    		} else{
	    			this.checkData.lossForecast = val
	    		}
	    	},
	    	// 下一步拟采取措施
	    	getNextAdoptMeasures(val){
	    		if(val == ''){
	    			delete this.checkData.nextAdoptMeasures
	    		} else{
	    			this.checkData.nextAdoptMeasures = val
	    		}
	    	},
	    	getA1(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.a1
	    		} else{
	    			this.checkData.a1 = Number(val)
	    		}
	    	},
	    	getA2(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.a2
	    		} else{
	    			this.checkData.a2 = parseInt(val)
	    		}
	    	},
	    	getA3(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.a3
	    		} else{
	    			this.checkData.a3 = parseInt(val)
	    		}
	    	},
	    	getA4(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.a4
	    		} else{
	    			this.checkData.a4 = parseInt(val)
	    		}
	    	},
	    	getA5(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.a5
	    		} else{
	    			this.checkData.a5 = parseInt(val)
	    		}
	    	},
	    	getA6(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.a6
	    		} else{
	    			this.checkData.a6 = parseInt(val)
	    		}
	    	},
	    	getA7(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.a7
	    		} else{
	    			this.checkData.a7 = parseInt(val)
	    		}
	    	},
	    	getB(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.b
	    		} else{
	    			this.checkData.b = parseInt(val)
	    		}
	    	},
	    	getC(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.c
	    		} else{
	    			this.checkData.c = parseInt(val)
	    		}
	    	},
	    	getE(val){
	    		if(val == ''||!this.testMoney(val)){
	    			delete this.checkData.e
	    		} else{
	    			this.checkData.e = parseInt(val)
	    		}
	    	},
	    	// 备注
	    	getRemark(val){
	    		if(val == ''){
	    			delete this.checkData.remark
	    		} else{
	    			this.checkData.remark = val
	    		}
	    	},
	    	// 增加
	    	goAdd(){
	  			this.lossEvent.belongOrganization.push({
  					orgName:null,
  					organization:null,
	        		involveName:null,
	        		fourthOrganization:null
  				})
	    	},
	    	//删除
	    	goMinus(index){
	    		if(this.orgList&&this.orgList.length>0){
  					this.lossEvent.belongOrganization.splice(index,1)
	    			this.checkData.belongOrganization = this.lossEvent.belongOrganization
	    			let arr = ['a1m','a2m','a3m','a4m','a5m','a6m','a7m','bm','cm','em']
					for(var j=0;j<arr.length;j++){
						if(this.checkData[arr[j]]){
							for(let key in this.checkData[arr[j]]){
			    				if(this.orgList[index]&&this.orgList[index].organization==key){
				    				delete this.checkData[arr[j]][key]
				    			}
				    			
			    			}
		    			}
					}
  				} else {
  					if(this.checkData.belongOrganization){
	  					this.orgList = this.checkData.belongOrganization
	  					let arr = ['a1m','a2m','a3m','a4m','a5m','a6m','a7m','bm','cm','em']
						for(var j=0;j<arr.length;j++){
							if(this.checkData[arr[j]]){
								for(let key in this.checkData[arr[j]]){
				    			if(this.orgList[index].organization==key){
					    				delete this.checkData[arr[j]][key]
					    			}
					    			
				    			}
			    			}
						}
					}
					this.lossEvent.belongOrganization.splice(index,1)
	    			this.checkData.belongOrganization = this.lossEvent.belongOrganization	
  				}
  				let arr = ['a1m','a2m','a3m','a4m','a5m','a6m','a7m','bm','cm','em']
				for(var j=0;j<arr.length;j++){
					var arr1 = []
					if(this.checkData[arr[j]]){
						var total = 0
						for(var i = 0;i<this.orgList.length;i++){
		    				arr1.push(this.orgList[i].organization)
			    		}
						for(let key in this.checkData[arr[j]]){
			    			if(arr1.indexOf(key)>=0){
			    				total += Number(this.checkData[arr[j]][key])
			    			}
			    		}
			    		this.$set(this.lossEvent,arr[j].split('m')[0],total)
	    				this.$set(this.checkData,arr[j].split('m')[0],total)
			    	}
				}
				sessionStorage.setItem('orgList',JSON.stringify(this.orgList))
	    	},
		    // 返回
	    	goback(){
	    		// 季报编辑
	    		// 季报编辑
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'/seasonReport',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
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
		    // 上传附件
		    uploadFile1(param){
				var fileObj = param.file;
				var form = new FormData();
				form.append("file", fileObj);
				this.axios.post('/comm/upload/601',form).then((res)=>{
					if(res.code == 200){
						let obj = new Object()
						obj.url = res.data.path
						obj.name = res.data.name
						obj.id = res.data.id
						// obj.fileUrl = res.data.fileUrl
						obj.uid = param.file.uid
						this.evidenceFiles.push(obj)
						this.checkData.evidenceFiles = this.evidenceFiles
					}else if(res.code == 640){
						this.evidenceFiles = []
						this.$alert(res.data.message, '提示', {
				          confirmButtonText: '确定'
				        });
					}
				})
			},
			uploadFile2(param){
				var fileObj = param.file;
				var form = new FormData();
				form.append("file", fileObj);
				this.axios.post('/comm/upload/601',form).then((res)=>{
					if(res.code == 200){
						let obj = new Object()
						obj.url = res.data.path
						obj.name = res.data.name
						obj.id = res.data.id
						// obj.fileUrl = res.data.fileUrl
						obj.uid = param.file.uid
						this.seriousRiskFiles.push(obj)
						this.checkData.seriousRiskFiles = this.seriousRiskFiles
					}else if(res.code == 640){
						this.seriousRiskFiles = []
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
			handleRemove(file,fileList,type){
				if(type ==1){
					for (var i = 0; i < this.evidenceFiles.length; i++) {
						if(this.evidenceFiles[i].uid == file.uid){
							this.evidenceFiles.splice(i,1)
						}
					}
					if(this.evidenceFiles.length>0){
						this.checkData.evidenceFiles = this.evidenceFiles
					} else{
						delete this.checkData.evidenceFiles
					}
				} else if(type == 2){
					for (var i = 0; i < this.seriousRiskFiles.length; i++) {
						if(this.seriousRiskFiles[i].uid == file.uid){
							this.seriousRiskFiles.splice(i,1)
						}
					}
					if(this.seriousRiskFiles.length>0){
						this.checkData.seriousRiskFiles = this.seriousRiskFiles
					} else{
						delete this.checkData.seriousRiskFiles
					}
				}
			},
			beforeAvatarUpload(file) {
		        return fileTypeDiffer(file)
		    },
		    // 提交
	    	goSubmit(formName,val){
	    		// 保存判断为空
	    		if(val == 2){
	    			if(this.checkData.belongOrganization != undefined){
    					for(var i = 0;i<this.checkData.belongOrganization.length;i++){
    						if(this.checkData.belongOrganization[i].organization == null){
    							this.$alert('事件所属机构不能为空', '提示', {
						          confirmButtonText: '确定'
						        });
						        return
    						}
    					}
					} else{
						this.$alert('事件所属机构不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
					}
	    		}
	    		// 提交判断为空
	    		if(val == 1){
	    			if(this.checkData.name == undefined){
	    				this.$alert('事件名称不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.happenDate == undefined){
	    				this.$alert('事件发生时间不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.belongOrganization != undefined){
    					for(var i = 0;i<this.checkData.belongOrganization.length;i++){
    						if(this.checkData.belongOrganization[i].organization == null){
    							this.$alert('事件所属机构不能为空', '提示', {
						          confirmButtonText: '确定'
						        });
						        return
    						}
    						// if(this.checkData.belongOrganization[i].fourthOrganization == null){
    						// 	this.$alert('四级机构不能为空', '提示', {
						    //       confirmButtonText: '确定'
						    //     });
						    //     return
    						// }
    						if(this.checkData.belongOrganization[i].involveName == null){
    							this.$alert('事件涉及部门不能为空', '提示', {
						          confirmButtonText: '确定'
						        });
						        return
    						}
    					}
					} else{
						this.$alert('事件所属机构不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
					}
					if(this.checkData.incidentType == undefined){
	    				this.$alert('事件类型不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.discoverWay == undefined){
	    				this.$alert('发现方式不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.describe == undefined){
	    				this.$alert('事件描述不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.adoptMeasures == undefined){
	    				this.$alert('已采取措施不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.lossForecast == undefined){
	    				this.$alert('未来损失预测不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.nextAdoptMeasures == undefined){
	    				this.$alert('下一步拟采取措施不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    		}
				// 提交、保存
	    		this.checkData.action = val
	    		// 损失总额
	    		let sum1 = parseFloat(this.lossEvent.a1)+parseFloat(this.lossEvent.a2)+parseFloat(this.lossEvent.a3)+parseFloat(this.lossEvent.a4)+parseFloat(this.lossEvent.a5)+parseFloat(this.lossEvent.a6)+parseFloat(this.lossEvent.a7)
	    		if(Number.isNaN(sum1)){
	    			delete this.checkData.a
	    		} else{
	    			if(sum1.toString().indexOf(".")>0&&sum1.toString().split('.')[1].length>=6){
						sum1 = sum1.toFixed(6)
					}
	    			this.checkData.a = parseFloat(sum1)
	    		}
	    		// 净损失总额
	    		let sum2 = parseFloat(this.lossEvent.a1)+parseFloat(this.lossEvent.a2)+parseFloat(this.lossEvent.a3)+parseFloat(this.lossEvent.a4)+parseFloat(this.lossEvent.a5)+parseFloat(this.lossEvent.a6)+parseFloat(this.lossEvent.a7)+parseFloat(this.lossEvent.c)-parseFloat(this.lossEvent.b)-parseFloat(this.lossEvent.e)
	    		if(Number.isNaN(sum2)){
	    			delete this.checkData.d
	    		} else{
	    			if(sum2.toString().indexOf(".")>0&&sum2.toString().split('.')[1].length>=6){
						sum2 = sum2.toFixed(6)
					}
	    			this.checkData.d = parseFloat(sum2)
	    		}
	    		this.axios.post('lossincident/saveOrSubmit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
					if(res.code == 200){
						var tip =''
						if(val == 1){
							tip = '提交成功'
						} else if(val == 2){
							tip = '保存成功'
						}
						this.$alert(tip, '提示', {
					      confirmButtonText: '确定',
					      callback: action => {
					      	if(this.$route.query.flag == 3){
				    			this.$router.push({
						    		path:'/seasonReport',
						    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
						              	id: this.$route.query.id
						            }
						    	})
				    		} else{
						      	sessionStorage.setItem('path',this.checkData.action)
						      	this.$router.push({
						    		path:'/lossEvent/lossEventSend',
						    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
						              	id: this.$route.query.id
						            }
						    	})
					    	}			      	
					      }
					    });
					}else{
						this.$alert(res.data, '提示', {
				          confirmButtonText: '确定'
				        });
					}
				})
	    	},
		    testMoney(val){
	    		const reg = /^\d+$|^\d+\.\d+$/g
	    		if(!reg.test(val)){
    				this.$alert('输入金额包含特殊字符', '提示', {
			        	confirmButtonText: '确定'
			        })
			        return false
    			} else{
    				return true
    			}
	    	},
	    	// 编辑
	    	getInfo(){
	    		var params = qs.stringify({
		    		id: this.$route.query.lossId,
		        	type:2
	        	})
	    		this.axios.post('lossincident/details',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					this.lossEvent = res.data.data == null?new Object:res.data.data
	    					this.checkData = JSON.parse(JSON.stringify(this.lossEvent))
	    					// 发生时间
	    					if(this.lossEvent.happenDate){
	    						this.lossEvent.happenDate = this.lossEvent.happenDate.substring(0,4)+'-'+this.lossEvent.happenDate.substring(4,6)+'-'+this.lossEvent.happenDate.substring(6,8)
	    					}
	    					// 报告时间
	    					if(this.lossEvent.reportDate){
	    						this.lossEvent.reportDate = this.lossEvent.reportDate.substring(0,4)+'-'+this.lossEvent.reportDate.substring(4,6)+'-'+this.lossEvent.reportDate.substring(6,8)
	    					}
	    					this.relevance.region = this.lossEvent.isRelevance == null?0:this.lossEvent.isRelevance
	    					// 事件类型
	    					this.incidentType.region = this.lossEvent.incidentType
	    					if(this.lossEvent.isRelevance==1){
	    						for(var i=0;i<this.incidentType.unitsData.length;i++){
	    							this.incidentType.unitsData[i].disabled = false
	    						}
	    					}
	    					// 发现方式
	    					this.discoverWay.region = this.lossEvent.discoverWay
	    					// 文件依据
	    					this.evidence.region = this.lossEvent.isEvidence == null?0:this.lossEvent.isEvidence
	    					// 是否属于重大风险事件
	    					this.seriousRisk.region = this.lossEvent.isSeriousRisk == null?0:this.lossEvent.isSeriousRisk
	    					// 附件
	    					this.evidenceFiles = this.lossEvent.evidenceFiles == null?[]:this.lossEvent.evidenceFiles
	    					this.seriousRiskFiles = this.lossEvent.seriousRiskFiles == null?[]:this.lossEvent.seriousRiskFiles
	    					// 公司
	    					if(this.lossEvent.belongOrganization){
		    					for(var i = 0;i<this.lossEvent.belongOrganization.length;i++){
		    						this.lossEvent.belongOrganization[i].orgName = this.lossEvent.belongOrganization[i].orgName
		    						if(this.$route.query.flag == 1){
		    							this.lossEvent.belongOrganization[i].isDisabled = true
		    						}
		    					}
	    					} else{
	    						this.lossEvent.belongOrganization=[{
				  					orgName:null,
				  					organization:null,
					        		involveName:null,
					        		fourthOrganization:null
				  				}]
	    					}
	    				}
	        		} else {
	        			this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	        		}
	    		})
	    	},
	    	getOrgMoney(type){
	    		this.orgType = type + 'm'
	    		this.orgList = this.checkData.belongOrganization
	    		if(this.orgList){
	    			const res = new Map()
	    			this.orgList = this.orgList.filter((item) =>!res.has(item.organization) && res.set(item.organization, 1))
	    			for(var i = 0;i<this.orgList.length;i++){
		    			if(this.orgList[i].organization == null){
		    				this.orgList.splice(i,1)
		    			}
		    		}
	    			if(JSON.stringify(this.checkData[this.orgType]) !== '{}' && this.checkData[this.orgType] != null){
	    				var arr = []
	    				var aaa = Object.keys(this.checkData[this.orgType])
		    			for(var i = 0;i<this.orgList.length;i++){
		    				arr.push(this.orgList[i].organization)
		    				if(aaa.indexOf(this.orgList[i].organization)>=0){
		    					for(let key in this.checkData[this.orgType]){
		    						if(this.orgList[i].organization == key){
		    							this.orgList[i].money = this.checkData[this.orgType][this.orgList[i].organization]		
		    						}
		    					}
		    				} else{
		    					delete this.orgList[i].money
		    				}
			    		}
			    		for(let key in this.checkData[this.orgType]){
			    			if(arr.indexOf(key)<0){
			    				delete this.checkData[this.orgType][key]
			    			}

			    		}
		    		} else{
	    				for(var i = 0;i<this.orgList.length;i++){
			    			delete this.orgList[i].money
			    		}
		    		}
	    		}
	    		this.isShow = true
	    		sessionStorage.setItem('orgList',JSON.stringify(this.orgList))
	    	},
	    	closeMaskTable(data){
		    	this.isShow = data.status;
		    	if(data.total!=null && data.total!=undefined && data.total.length != 0){
		    		this.$set(this.lossEvent,this.orgType.split('m')[0],data.total)
		    		this.$set(this.checkData,this.orgType.split('m')[0],data.total)
		    	} else{
		    		let arr = ['a1','a2','a3','a4','a5','a6','a7','b','c','e']
		    		for(var i=0;i<arr.length;i++){
		    			if(this.checkData[arr[i]]){
		    				this.$set(this.lossEvent,arr[i],this.checkData[arr[i]])
		    			}
		    		}
		    	}
		    	if(data.moneyList){
		    		this.$set(this.checkData,this.orgType,data.moneyList)
		    	}		    	
		    },
	    },
  	};
</script>
<style lang="scss">
#specialReport{
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
		}
	}
	.srdetail{
		.el-form-item__label{
			float:left;
			width:180px;
			height:32px;
			line-height:32px;
			padding:0 20px 0 0;
			text-align:justify
		}
		.el-form-item .el-form-item__content{
			float:left;
			width:calc(100% - 180px)
		}
		textarea{
			height:75px;
			resize:none
		}

	}
	.event{
		.el-form-item__label{
			float:left;
			width:180px;
			height:32px;
			line-height:32px;
			padding:0 20px 0 0;
			text-align:justify
		}
	}
	.infoLabel{
		.el-form-item__label{
			float:left;
			width:150px;
			height:32px;
			line-height:32px;
			padding:0 20px 0 0;
			text-align:justify
		}
	}
	.find{
		.el-form-item__label{
			width:15%;
			text-align:right
		}
		.el-form-item .el-form-item__content{
			width:85%;
			display:inline-block;
			vertical-align:top;
		}
	}
	.filedetail{
		.el-form-item__label{
			float:left;
			width:180px;
			height:32px;
			line-height:32px;
			padding:0 20px 0 0;
			text-align:justify
		}
		.el-form-item .el-form-item__content{
			float:left;
			width:calc(100% - 180px)
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
		.commonBtn{
			width:100%;
			height:32px;
			line-height:32px;
			margin-top:0
		}
		.el-upload__tip{
			color:#909191;
			font-size:0px;
			span,p{
				display:inline-block;
				vertical-align:top;
				line-height:24px;
				font-size:12px;
			}
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
	.risk{
		.el-upload{
			float:left;
			margin-left:10%;
		}
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
	.el-form-item__label::before{
		content:'*';
		color:#F56C6C;
	}
	.el-form-item__label{
		width:120px;
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
			resize:none;
			padding:20px 10px;
			font-size: 14px
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
				width:27%;
				font-size:14px
			}
			.LEmoney{
				float:left;
				width:58%;
				font-size:14px;
				color:#999;
				text-align:left;
				padding-left:15px;
				background:#F9F9F9;
				display:flex;
				align-items:center;
				justify-content:space-between;
				em,b{
					font-style:normal;
					font-weight:normal
				}
				.el-icon-tickets{
					font-size:28px;
					padding:0 15px
				}
			}
			.el-input{
				float:left;
				width:58%;
			}
			.el-input .el-input__inner{
				border:none;
				background:none
			}
			.LEheight{
				line-height:24px!important;
				padding:8px 0
			}
		}
		.el-input.is-disabled .el-input__inner{
			color:#000;
			background-color:none;
		}
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
	.el-icon-document:before{
		content:"\E77D";
 		-webkit-text-fill-color:#000;
 		-webkit-text-stroke: 0 #000;
	}
	.noStar .el-form-item__label::before{
		content:''!important
	}
}	

</style>
