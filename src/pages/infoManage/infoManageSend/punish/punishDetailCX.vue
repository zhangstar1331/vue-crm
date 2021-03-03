<template>
  	<el-container id="punishDetail">
  		<div id="top"></div>
	  	<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span class="textColor1">合规信息管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item><span @click="goback" class="textColor1 bread">合规信息报送</span></el-breadcrumb-item>
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
			  	<el-step title="整改情况"></el-step>
			  	<el-step title="问责情况"></el-step>
			</el-steps>
			<!-- 第一步 -->
			<div class="punishDetail newHeight" v-if="active == 0">
				<div class="infoItem" v-if="this.$route.query.flag == 1">
					<span class="infoItemT">监管处罚信息编号：</span>
					<span class="infoItemC">{{baseinfo.sn == null?'--':baseinfo.sn}}</span>
				</div>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">处罚类型：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.punishType == null||baseinfo.base.punishType == ''?'--':punishList.find(item=>{return item.id == baseinfo.base.punishType})?punishList.find(item=>{return item.id == baseinfo.base.punishType}).name:'--'}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT1">监管处罚决定书落款时间：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.lkDate == null||baseinfo.base.lkDate == ''?'--':timeFormat(baseinfo.base.lkDate)}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row v-if="baseinfo.base && (baseinfo.base.punishType == '' || baseinfo.base.punishType == '1')">
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">处罚来源：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.punishSource == null||baseinfo.base.punishSource == ''?'--':punishData.punishSource.find(item=>{return item.id == baseinfo.base.punishSource})?punishData.punishSource.find(item=>{return item.id == baseinfo.base.punishSource}).name:'--'}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12" v-if="baseinfo.base.punishSource !== '3'">
						<div class="infoItem">
							<span class="infoItemT1" style="width:auto">已关联的行政处罚事先告知书名称：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">
									<span v-if="baseinfo.base.sourceName == null||baseinfo.base.sourceName == ''">--
									</span>
									<span v-else @click="jumpDetail" style="color:#4285F4">{{baseinfo.base.sourceName}}</span>
								</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row v-if="baseinfo.base&&baseinfo.base.punishType&&baseinfo.base.punishType !== '1'">
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">检查类型：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.punishSource == null||baseinfo.base.punishSource == ''?'--':punishData.superviseList.find(item=>{return item.id == baseinfo.base.punishSource})?punishData.superviseList.find(item=>{return item.id == baseinfo.base.punishSource}).name:'--'}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT1" style="width:auto">已关联的监管检查事项名称：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">
									<span v-if="baseinfo.base.sourceName == null||baseinfo.base.sourceName == ''">--
									</span>
									<span v-else @click="jumpDetail" style="color:#4285F4">{{baseinfo.base.sourceName}}</span>
								</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">处罚概述：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.overView == null||baseinfo.base.overView == ''?'--':baseinfo.base.overView}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<div class="infoItem">
					<span class="infoItemT">处罚事由：</span>
					<span class="infoItemC">
						<div v-if="baseinfo.base">{{baseinfo.base.cause == null||baseinfo.base.cause == ''?'--':baseinfo.base.cause}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">实施主体类型：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.subjectType == null||baseinfo.base.subjectType == ''?'--':subjectList.find(item=>{return item.id == baseinfo.base.subjectType})?subjectList.find(item=>{return item.id == baseinfo.base.subjectType}).name:'--'}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT1">实施主体名称：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.name == null||baseinfo.base.name == ''?'--':baseinfo.base.name}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
			        <el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">险种：</span>
							<span class="infoItemC">
								<div v-if="baseinfo.base">{{baseinfo.base.insuranceTypeName == null||baseinfo.base.insuranceTypeName == ''?'--':baseinfo.base.insuranceTypeName}}</div>
								<div v-else>--</div>
							</span>
						</div>
					</el-col>
					<el-col :span="12" v-if="baseinfo.base&&baseinfo.base.insuranceType&&baseinfo.base.insuranceType.indexOf('9')>=0">
						<div class="infoItem">
							<span class="infoItemT1">其他险种：</span>
							<span class="infoItemC">
								<div>{{baseinfo.base.otherInsurance == null||baseinfo.base.otherInsurance == ''?'--':baseinfo.base.otherInsurance}}</div>
							</span>
						</div>
					</el-col>
				</el-row>
			</div>
	      	<!-- 第三步 -->
	      	<div class="infoDetail" v-if="active == 1">
				<div class="infoItem">
					<span class="infoItemT">是否整改：</span>
					<span class="infoItemC">
						<div v-if="baseinfo.abarbeitung">
							<div v-if="baseinfo.abarbeitung.type == null">--</div>
							<div v-else>
								{{baseinfo.abarbeitung.type == 1?'是':'否'}}
							</div>
						</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT">整改情况：</span>
					<span class="infoItemC">
						<div v-if="baseinfo.abarbeitung">{{baseinfo.abarbeitung.description == null?'--':baseinfo.abarbeitung.description}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem">
					<span class="infoItemT" style="vertical-align:middle">附件：</span>
					<span class="infoItemC" style="vertical-align:middle">
						<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.abarbeitung.attachment)" :disabled="!baseinfo.abarbeitung||!baseinfo.abarbeitung.attachment">批量下载</el-button>
						<i class="el-icon-paperclip"></i>共{{baseinfo.abarbeitung&&baseinfo.abarbeitung.attachment?baseinfo.abarbeitung.attachment.length:'0'}}个附件
					</span>
				</div>
				<div class="infoItem">
					<span v-if="baseinfo.abarbeitung&&baseinfo.abarbeitung.attachment" class="file">
						<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.abarbeitung.attachment" :key="item.id" :disabled="item.url && (item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip')?true:false" v-model="item.visible">
							<div style="text-align:center;margin:0">
								<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
								<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
							</div>
							<em @click="goDownload(item.url,item.name)" slot="reference">
							{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.abarbeitung.attachment.length-1">、</i><i style="color:#000" v-else>。</i>
							</em>
						</el-popover>
					</span>
					<span v-else>--</span>
				</div>
			</div>
	      	<!-- 第四步 -->
	      	<div class="punishDetail" v-if="active == 2">
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
					<span class="infoItemT">问责对象：</span>
					<span class="infoItemC">
						<div v-if="baseinfo.duty">{{baseinfo.duty.wzType == null?'--':punishData.wzType.find(item=>{return item.id == baseinfo.base.wzType})?wzType.find(item=>{return item.id == baseinfo.base.wzType}).name:'--'}}</div>
						<div v-else>--</div>
					</span>
				</div>
				<div class="infoItem" v-if="baseinfo.duty&&baseinfo.duty.wzType!=='2'">
					<span class="infoItemT">直接责任人：</span>
				</div>
				<el-table :data="(baseinfo.duty&&baseinfo.duty.wzPersonMaster)?baseinfo.duty.wzPersonMaster:[]" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" max-height="200" v-if="baseinfo.duty&&baseinfo.duty.wzType!=='2'">
					<el-table-column prop="n" label="姓名" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.n" class="textOverFlow">{{scope.row.n == null||scope.row.n == ''?'--':scope.row.n}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="x" label="性别" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.x" class="textOverFlow">{{scope.row.x == null||scope.row.x == ''?'--':scope.row.x==1?'男':'女'}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="orgName" label="所在机构" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null||scope.row.orgName == ''?'--':scope.row.orgName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="job" label="职务" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.job" class="textOverFlow">{{scope.row.job == null||scope.row.job == ''?'--':scope.row.job}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="pts" label="政治面貌" align="center" width="200">
						<template slot-scope="scope">
							<span :title="scope.row.pts == null||scope.row.pts == ''?'--':punishData.policyList.find(item=>{return item.id == scope.row.pts}).name" class="textOverFlow">{{scope.row.pts == null?'--':punishData.policyList.find(item=>{return item.id == scope.row.pts}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="jl" label="纪律处分" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.jl == null||scope.row.jl == ''?'--':punishData.jlType.find(item=>{return item.id == scope.row.jl}).name" class="textOverFlow">{{scope.row.jl == null?'--':punishData.jlType.find(item=>{return item.id == scope.row.jl}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="zz" label="组织处理" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.zz == null||scope.row.zz == ''?'--':punishData.zzType.find(item=>{return item.id == scope.row.zz}).name" class="textOverFlow">{{scope.row.zz == null?'--':punishData.zzType.find(item=>{return item.id == scope.row.zz}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="jj" label="经济处分" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.jj == null||scope.row.jj == ''?'--':punishData.jjType.find(item=>{return item.id == scope.row.jj}).name" class="textOverFlow">{{scope.row.jj == null?'--':punishData.jjType.find(item=>{return item.id == scope.row.jj}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="amt" label="经济处分金额（元）" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.amt" class="textOverFlow">{{scope.row.amt == null||scope.row.amt == ''?'--':scope.row.amt}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="infoItem" v-if="baseinfo.duty&&baseinfo.duty.wzType!=='1'">
					<span class="infoItemT">间接责任人：</span>
				</div>
				<el-table :data="(baseinfo.duty&&baseinfo.duty.wzPersonIndirect)?baseinfo.duty.wzPersonIndirect:[]" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" max-height="200" v-if="baseinfo.duty&&baseinfo.duty.wzType!=='1'">
					<el-table-column prop="n" label="姓名" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.n" class="textOverFlow">{{scope.row.n == null||scope.row.n == ''?'--':scope.row.n}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="x" label="性别" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.x" class="textOverFlow">{{scope.row.x == null||scope.row.x == ''?'--':scope.row.x==1?'男':'女'}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="orgName" label="所在机构" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null||scope.row.orgName == ''?'--':scope.row.orgName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="job" label="职务" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.job" class="textOverFlow">{{scope.row.job == null||scope.row.job == ''?'--':scope.row.job}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="pts" label="政治面貌" align="center" width="200">
						<template slot-scope="scope">
							<span :title="scope.row.pts == null||scope.row.pts == ''?'--':punishData.policyList.find(item=>{return item.id == scope.row.pts}).name" class="textOverFlow">{{scope.row.pts == null?'--':punishData.policyList.find(item=>{return item.id == scope.row.pts}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="jl" label="纪律处分" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.jl == null||scope.row.jl == ''?'--':punishData.jlType.find(item=>{return item.id == scope.row.jl}).name" class="textOverFlow">{{scope.row.jl == null?'--':punishData.jlType.find(item=>{return item.id == scope.row.jl}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="zz" label="组织处理" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.zz == null||scope.row.zz == ''?'--':punishData.zzType.find(item=>{return item.id == scope.row.zz}).name" class="textOverFlow">{{scope.row.zz == null?'--':punishData.zzType.find(item=>{return item.id == scope.row.zz}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="jj" label="经济处分" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.jj == null||scope.row.jj == ''?'--':punishData.jjType.find(item=>{return item.id == scope.row.jj}).name" class="textOverFlow">{{scope.row.jj == null?'--':punishData.jjType.find(item=>{return item.id == scope.row.jj}).name}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="amt" label="经济处分金额（元）" align="center" width="150">
						<template slot-scope="scope">
							<span :title="scope.row.amt" class="textOverFlow">{{scope.row.amt == null||scope.row.amt == ''?'--':scope.row.amt}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="infoItem">
					<span class="infoItemT" style="vertical-align:middle">附件：</span><span class="file file1">
						<div class="fujian">
							<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.duty.attachment)" :disabled="!baseinfo.duty||!baseinfo.duty.attachment">批量下载</el-button>
							<i class="el-icon-paperclip"></i>共{{baseinfo.duty&&baseinfo.duty.attachment?baseinfo.duty.attachment.length:'0'}}个附件
						</div>
						<div v-if="baseinfo.duty&&baseinfo.duty.attachment">
							<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.duty.attachment" :key="item.id" :disabled="item.url && (item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip')?true:false" v-model="item.visible">
								<div style="text-align:center;margin:0">
									<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
									<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
								</div>
								<em @click="goDownload(item.url,item.name)" slot="reference">
								{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.duty.attachment.length-1">、</i><i style="color:#000" v-else>。</i>
								</em>
							</el-popover>
						</div>
						<div v-else>--</div>
					</span>
				</div>
			</div>
	      	<el-row v-if="active !== 0">
		  		<el-col :span="24" align="center">
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goPrevious" v-if="active!==0">上一步</el-button>
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goNext" v-if="active!==2">下一步</el-button>
		  		</el-col>
		  	</el-row>
		</div>
		<div v-if="baseinfo.base">
			<div class="contList newHeight1" v-for="(penalize,index) in baseinfo.base.penalizeFile" :key="index" v-if="active == 0">
				<div class="punishDetail">
					<el-row>
				        <el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT">监管处罚文件编号：</span>
								<span class="infoItemC">
									<div v-if="penalize">{{penalize.fileNo == null||penalize.fileNo == ''?'--':penalize.fileNo}}</div>
									<div v-else>--</div>
								</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT1">处罚对象：</span>
								<span class="infoItemC">
									<div v-if="penalize">{{penalize.cfType == null||penalize.cfType == ''?'--':cfType[penalize.cfType]}}</div>
									<div v-else>--</div>
								</span>
							</div>
						</el-col>
					</el-row>
					<el-row v-for="(item,oindex) in penalize.orgMap" :key="item.oindex">
				        <el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT">被处罚机构：</span>
								<span class="infoItemC">{{item.orgName == null||item.orgName == ''?'--':item.orgName}}</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT1">处罚金额（万元）：</span>
								<span class="infoItemC">{{item.amt == null||item.amt == ''?'--':item.amt}}</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT">其他机构处罚措施：</span>
								<span class="infoItemC">
									{{item.orgcs == null||item.orgcs == ''?'--':orgCs[item.orgcs]}}
								</span>
							</div>
						</el-col>
						<el-col :span="24">
							<div class="infoItem">
								<span class="infoItemT">&nbsp;</span>
								<span class="infoItemC1">
									{{item.orgdes == null||item.orgdes == ''?'--':item.orgdes}}
								</span>
							</div>
						</el-col>
					</el-row>
					<el-row v-for="(item,pindex) in penalize.personMap" :key="item.pindex">
				        <el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT">被处罚个人：</span>
								<span class="infoItemC">{{item.name == null||item.name == ''?'--':item.name}}</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT1">所属机构：</span>
								<span class="infoItemC">{{item.orgName == null||item.orgName == ''?'--':item.orgName}}</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT">处罚金额（万元）：</span>
								<span class="infoItemC">{{item.amt == null||item.amt == ''?'--':item.amt}}</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="infoItem">
								<span class="infoItemT1">其他个人处罚措施：</span>
								<span class="infoItemC">
									{{item.pcs == null||item.pcs == ''?'--':personCs[item.pcs]}}
								</span>
							</div>
						</el-col>
						<el-col :span="24">
							<div class="infoItem">
								<span class="infoItemT">&nbsp;</span>
								<span class="infoItemC1">
									{{item.pdes == null||item.pdes == ''?'--':item.pdes}}
								</span>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="contList" v-if="active == 0" style="padding-top:30px">
			<div class="punishDetail newHeight" v-if="active == 0">
				<div class="infoItem">
					<span class="infoItemT" style="vertical-align:middle">附件：</span><span class="file file1">
						<div class="fujian">
							<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.base.attachment)" :disabled="!baseinfo.base||!baseinfo.base.attachment">批量下载</el-button>
							<i class="el-icon-paperclip"></i>共{{baseinfo.base&&baseinfo.base.attachment?baseinfo.base.attachment.length:'0'}}个附件
						</div>
						<div v-if="baseinfo.base&&baseinfo.base.attachment">
							<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.base.attachment" :key="item.id" :disabled="item.url && (item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip')?true:false" v-model="item.visible">
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
			<el-row>
		  		<el-col :span="24" align="center">
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goPrevious" v-if="active!==0">上一步</el-button>
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goNext" v-if="active!==2">下一步</el-button>
		  		</el-col>
		  	</el-row>
		</div>
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">维护记录</span></div>
			<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column prop="version" label="监管处罚信息版本号" align="center" width="180">
	                <template slot-scope="scope">
	                    <span :title="scope.row.version" class="textOverFlow">{{scope.row.version == null?'--':scope.row.version}}</span>
	                </template>
	            </el-table-column>
				<el-table-column prop="name" label="处罚事由" align="center">
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
		<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">审批记录</span></div>
			<el-table :data="tableData1" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column prop="ornName" label="审批机构" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.ornName" class="textOverFlow">{{scope.row.ornName == null||scope.row.ornName == ''?'--':scope.row.ornName}}</span>
	                </template>
	            </el-table-column>
				<el-table-column prop="userName" label="审批人" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.userName" class="textOverFlow" >{{scope.row.userName == null||scope.row.userName == ''?'--':scope.row.userName}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="createDate" label="报送/审批时间" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.createDate" class="textOverFlow">{{scope.row.createDate == null||scope.row.createDate == ''?'--':scope.row.createDate}}</span>
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
	          	titMsg:"监管处罚信息报送详情",
	          	baseinfo:{},
	          	//查询数据
	          	checkData:{
	          		id:this.$route.query.infoId,
	          		status:""
	          	},
		        orgCs:{
		        	'1':'没收违法所得',
		        	'2':'责令停业整顿',
		        	'3':'吊销金融（业务）许可证',
		        	'4':'限制保险业机构业务范围',
		        	'5':'责令保险业机构停止接收新业务',
		        	'6':'监管函',
		        	'7':'其他'
		        },
		        //其他个人处罚措施
		        personCs:{
			       	'1':'警告',
			       	'2':'没收违法所得',
			       	'3':'取消（撤销）任职资格',
			       	'4':'禁止从事银行业工作或者禁止进入保险业',
			       	'5':'其他'
		        },
		        cfType:{
			       	'1':'处罚机构',
			       	'2':'处罚个人',
			       	'3':'处罚机构和个人'
		        },
		       	// 附件
		       	evidenceFiles:[],
		       	seriousRiskFiles:[],
		       	tableData:[],
				tableData1:[],
  				path:false,
  				statisPath:false,
  				isOpen:false,
  				supervisePath:false,
  				sendBack:false
			}
	   	},
	    created(){
			if(this.$route.query.flag == 4){
				this.checkData.status = 2
			} else{
				this.checkData.status = this.$route.query.flag
			}
	    	if(this.$route.query.step){
	    		this.active = this.$route.query.step
	    	}
	    	// 获取基本信息
	    	this.searchData(this.checkData)
	    },
		computed:{
			...mapState(['punishData','punishList','subjectList'])
		},
	    methods:{
	    	// 步骤
	    	goNext(){
	    		if (this.active++ > 2) this.active = 2;
	    	},
	    	goPrevious(){
	    		this.active--
	    	},	
		    // 返回
	    	goback(){
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'/punishSeasonReportCX',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.path == true){
	    			sessionStorage.setItem('inspectInfoPath',1)
	    			this.$router.push({
			    		name: 'inspectInfo',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			            	belongCompany:this.$route.query.belongCompany,
              				company:this.$route.query.company,
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.statisPath == true){
	    			sessionStorage.setItem('statisPath',1)
	    			this.$router.push({
			    		path: 'infoManage/infoStatistics/detialList',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.supervisePath == true){
	    			this.$router.push({
			    		path: 'superviseDetailCX',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			              	infoId:this.$route.query.superviseId,
				            flag:this.$route.query.status,
				            step:1,
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.sendBack == true){
	    			sessionStorage.setItem('sendBackPath','second')
	    			this.$router.push({
			    		name: 'sendBack',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else{
	    			sessionStorage.setItem('punishPath',this.$route.query.flag)
		    		this.$router.push({
			    		path:'infoManage/infoManageSend/punish/punishSend',
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
	    		this.axios.post('cx_penalize/detail',qs.stringify(data)).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					if(res.data.detail!==null){
								this.baseinfo = res.data.detail
							}
							if(res.data.record!==null){
								this.tableData1 = []
								this.tableData1 = res.data.record
							}
							if(res.data.history!==null){
								this.tableData = []
								this.tableData = res.data.history
							}
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
		    		status:1
		    	}
				var flag = ""
				if(this.$route.query.flag == 4){
					flag = 2
				} else{
					flag = this.$route.query.flag
				}
		        this.$router.push({
		            path:'/punishDetailCX',   //跳转的路径
		            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		            	infoId:row.id,
		              	flag:flag,
		              	belongCompany:this.$route.query.belongCompany,
              			company:this.$route.query.company,
              			id: this.$route.query.id,
              			superviseId:this.$route.query.superviseId,
              			status:this.$route.query.status
		              	// sn:row.sn
		            }
		        })
		        this.searchData(check1)
		    },
		    goDownload(url,name,type){
		    	var fileType = url.substring(url.lastIndexOf('.')+1)
		    	if(fileType == 'rar' || fileType == 'zip' || type == '1'){
		    		var obj = new Object()
					obj.filePath = url;
					obj.fileName = encodeURIComponent(name);
					this.axios.post('comm/download/702',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
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
			// 跳转关联页面
			jumpDetail(){
				this.$router.push({
		            path:'/punishDetailCX',   //跳转的路径
		            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		            	// infoId:row.id,
		              	flag:1,
		              	belongCompany:this.$route.query.belongCompany,
              			company:this.$route.query.company,
              			id: this.$route.query.id,
              			superviseId:this.$route.query.superviseId,
              			status:this.$route.query.status
		            }
		        })
			},
			timeFormat(str){
				return str.substring(0,4)+'-'+str.substring(4,6)+'-'+str.substring(6,8)
			}
	    },
	    beforeRouteEnter (to, from, next) {
			next((that) => {
			    if(from.fullPath.includes('/inspectInfo')){
			    	that.path = true
			    }
			    if(from.fullPath.includes('/detialList')){
			    	that.statisPath = true
			    }
			    if(from.fullPath.includes('/superviseDetailCX')){
			    	that.supervisePath = true
			    }
			    if(from.fullPath.includes('/sendBack')){
			    	that.sendBack = true
			    }
			})
	    }
  	};
</script>
<style lang="scss">
#punishDetail{
	cursor:pointer;
	.header{
		cursor:pointer;
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
	.newHeight{
		min-height:250px!important
	}
	.newHeight1{
		height:400px;
		overflow-y:auto;
		padding-top:30px
	}
	.punishDetail{
		min-height:400px;
		.infoItem{
			width:100%;
    		min-height: 24px;
    		line-height: 24px;
    		font-size: 14px;
    		span{
    			display:inline-block;
    			vertical-align:top
    		}
			.infoItemT{
				width:150px;
				text-align:justify
			}
			.infoItemT1{
				width:190px;
				text-align:justify
			}
			.infoItemC{
    			width:60%;
    			text-align:left;
    			margin-bottom:10px;
    			word-break:break-all
    		}
    		.infoItemC1{
    			width:calc(calc(50% - 150px) + 190px + 30%)!important;
    			text-align:left;
    			margin-bottom:10px;
    			word-break:break-all
    		}
			.infoItemT:after,.infoItemT1:after,p:after{
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
	.el-table{
		margin-bottom:20px;
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
	.file1{
		width:calc(100% - 160px)!important;
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
