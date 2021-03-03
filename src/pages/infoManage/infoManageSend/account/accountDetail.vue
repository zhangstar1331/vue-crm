<template>
  	<el-container id="accountDetail">
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
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">基本信息</span><span class="lossNo" v-if="this.$route.query.flag == 1">问责事件编号：{{baseinfo.no}}</span></div>
	      	<el-row>
	      		<el-col :span="12">
		        	<div class="infoItem">
		        		<span class="infoItemT">问责事由：</span>
		        		<span class="infoItemC">{{baseinfo.reason == null||baseinfo.reason == ''?'--':baseinfo.reason}}</span>
		        	</div>
				</el-col>
				<el-col :span="12">
					<div class="infoItem">
						<span class="infoItemT">问责事项类型：</span>
			        	<span class="infoItemC">{{baseinfo.itemType == null||baseinfo.itemType == ''?'--':itemType[baseinfo.itemType]}}</span>
		        	</div>
				</el-col> 
	      	</el-row>
	      	<el-row>
				<el-col :span="12">
					<div class="infoItem">
						<span class="infoItemT">问责决定书下达时间：</span>
			        	<span class="infoItemC">
							{{baseinfo.time == null||baseinfo.time == ''?'--':baseinfo.time.substring(0,4)+'-'+baseinfo.time.substring(4,6)+'-'+baseinfo.time.substring(6,8)}}</span>
			        	</span>
		        	</div>
				</el-col>
				<el-col :span="12">
		        	<div class="infoItem">
		        		<span class="infoItemT">问责对象类型：</span>
		        		<span class="infoItemC">{{baseinfo.objType == null||baseinfo.objType == ''?'--':objType[baseinfo.objType]}}</span>
		        	</div>
				</el-col>
	      	</el-row>
	      	<div v-if="this.baseinfo.objType!=='2'">
		      	<el-row v-for="(item,index) in baseinfo.orgMap" :key="item.id">
			        <el-col :span="12">
			        	<div class="infoItem">
			        		<span class="infoItemT">被问责机构：</span>
			        		<span class="infoItemC">{{item.orgName == null||item.orgName == ''?'--':item.orgName}}</span>
			        	</div>
					</el-col>
		      	</el-row>
			</div>
			<div v-if="this.baseinfo.objType!=='1'">
		      	<el-row v-for="(item,index) in baseinfo.personageAccountabilityList" :key="item.id">
			        <el-col :span="12">
			        	<div class="infoItem">
				        	<span class="infoItemT">被问责个人：</span>
				        	<span class="infoItemC1">{{item.personageAccountability == null?'--':item.personageAccountability}}</span>
				        	</div>
					</el-col>
					<el-col :span="12">
						<div class="infoItem">
							<span class="infoItemT">所属机构：</span>
				        	<span class="infoItemC">{{item.orgName == null||item.orgName == ''?'--':item.orgName}}</span>
			        	</div>
					</el-col>
		      	</el-row>
			</div>
	      	<el-row>
	      		<el-col :span="24">
	      			<div class="infoItem">
	      				<span class="infoItemT" style="vertical-align:middle">附件：</span>
				      	<span class="infoItemC1">
							<div class="fujian">
								<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.basicFile)" :disabled="!baseinfo.basicFile">批量下载</el-button>
								<i class="el-icon-paperclip"></i>共{{baseinfo.basicFile?baseinfo.basicFile.length:'0'}}个附件
							</div>
							<div v-if="baseinfo.basicFile">
								<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.basicFile" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
									<div style="text-align:center;margin:0">
										<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
										<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
									</div>
									<em @click="goDownload(item.url,item.name)" slot="reference">
									{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.basicFile.length-1">、</i><i style="color:#000" v-else>。</i>
									</em>
								</el-popover>
							</div>
							<div class="infoItemC1" v-else>--</div>
			        	</span>
		        	</div>
	        	</el-col>
        	</el-row>
		</div>
		<div class="contList" v-if="this.baseinfo.objType!=='2'">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">集体问责结果</span></div>
	      	<el-row>
		        <el-col :span="12">
		        	<div class="infoItem">
		        		<span class="infoItemT">经济处罚涉及机构数量：</span>
		        		<span class="infoItemC">{{baseinfo.involveCount == null?'--':baseinfo.involveCount}}</span>
		        	</div>
				</el-col>
				<el-col :span="12">
					<div class="infoItem">
						<span class="infoItemT">被问责机构数量：</span>
			        	<span class="infoItemC">{{baseinfo.accountabilityCount == null?'--':baseinfo.accountabilityCount}}</span>
		        	</div>
				</el-col> 
	      	</el-row>
	      	<el-row>
	      		<el-col :span="24">
	      			<div class="infoItem">
		        		<span class="infoItemT">&nbsp;</span>
		        		<span class="infoItemC1">{{baseinfo.economicPunishment == null?'--':baseinfo.economicPunishment}}</span>
		        	</div>
		        	<div class="infoItem">
		        		<span class="infoItemT">其他问责：</span>
		        		<span class="infoItemC1">{{baseinfo.otherAccountability == null?'--':baseinfo.otherAccountability}}</span>
		        	</div>
				</el-col>
        	</el-row>
        	<el-row>
				<el-col :span="24">
					<div class="infoItem">
		        		<span class="infoItemT">集体问责情况统计表：</span>
		        	</div>
		        	<el-table :data="baseinfo.complianceSubOrg" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" height="200">
						<el-table-column type="index" label="序号" align="center"></el-table-column>
						<el-table-column prop="orgName" label="机构名称" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null?'--':scope.row.orgName}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="des" label="问题描述" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.des" class="textOverFlow">{{scope.row.des == null?'--':scope.row.des}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="amount" label="问题涉及金额（单位：元）" align="center" width="180">
							<template slot-scope="scope">
			                    <span :title="scope.row.amount" class="textOverFlow">{{scope.row.amount == null?'--':scope.row.amount}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="happendDate" label="问题发生时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.happendDate" class="textOverFlow">{{scope.row.happendDate == null?'--':scope.row.happendDate.indexOf('/')>=0?scope.row.happendDate:scope.row.happendDate.substring(0,4)+'/'+scope.row.happendDate.substring(4,6)+'/'+scope.row.happendDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="findDate" label="发现问题的时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.findDate" class="textOverFlow">{{scope.row.findDate == null?'--':scope.row.findDate.indexOf('/')>=0?scope.row.findDate:scope.row.findDate.substring(0,4)+'/'+scope.row.findDate.substring(4,6)+'/'+scope.row.findDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="jcType" label="发现问题的检查类别" align="center" width="200">
							<template slot-scope="scope">
			                    <span :title="scope.row.jcType == null?'--':accountData.jcType[scope.row.jcType-1] == undefined?'--':accountData.jcType[scope.row.jcType-1].name" class="textOverFlow">{{scope.row.jcType == null?'--':accountData.jcType[scope.row.jcType-1] == undefined?'--':accountData.jcType[scope.row.jcType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="cfType" label="处分类型" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.cfType == null?'--':accountData.cfType[scope.row.cfType-1] == undefined?'--':accountData.cfType[scope.row.cfType-1].name" class="textOverFlow">{{scope.row.cfType == null?'--':accountData.cfType[scope.row.cfType-1] == undefined?'--':accountData.cfType[scope.row.cfType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="fileNo" label="处分文件文号" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.fileNo" class="textOverFlow">{{scope.row.fileNo == null?'--':scope.row.fileNo}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="xdDate" label="文件下达时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.xdDate" class="textOverFlow">{{scope.row.xdDate == null?'--':scope.row.xdDate.indexOf('/')>=0?scope.row.xdDate:scope.row.xdDate.substring(0,4)+'/'+scope.row.xdDate.substring(4,6)+'/'+scope.row.xdDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="xdOffice" label="处分下达机关" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.xdOffice" class="textOverFlow">{{scope.row.xdOffice == null?'--':scope.row.xdOffice}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="zxDate" label="处分执行时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.zxDate" class="textOverFlow">{{scope.row.zxDate == null?'--':scope.row.zxDate.indexOf('/')>=0?scope.row.zxDate:scope.row.zxDate.substring(0,4)+'/'+scope.row.zxDate.substring(4,6)+'/'+scope.row.zxDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="mark" label="备注" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.mark" class="textOverFlow">{{scope.row.mark == null?'--':scope.row.mark}}</span>
			                </template>
						</el-table-column>
		        	</el-table>
				</el-col>
        	</el-row>
        	<el-row>
	      		<el-col :span="24">
					<div class="infoItem">
						<span class="infoItemT" style="vertical-align:middle">附件：</span>
				      	<span class="infoItemC1">
							<div class="fujian">
								<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.collectiveFile)" :disabled="!baseinfo.collectiveFile">批量下载</el-button>
								<i class="el-icon-paperclip"></i>共{{baseinfo.collectiveFile?baseinfo.collectiveFile.length:'0'}}个附件
							</div>
							<div v-if="baseinfo.collectiveFile">
								<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.collectiveFile" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
									<div style="text-align:center;margin:0">
										<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
										<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
									</div>
									<em @click="goDownload(item.url,item.name)" slot="reference">
									{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.collectiveFile.length-1">、</i><i style="color:#000" v-else>。</i>
									</em>
								</el-popover>
							</div>
							<div class="infoItemC1" v-else>--</div>
			        	</span>
			    	</div>
				</el-col>
        	</el-row>
		</div>
		<div class="contList" v-if="this.baseinfo.objType!=='1'">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">个人问责结果</span></div>
	      	<el-row>
				<el-col :span="24">
					<div class="infoItem">
						<span class="infoItemT">组织处理涉及人次数量：</span>
			        	<span class="infoItemC">{{baseinfo.organDisposeCount == null?'--':baseinfo.organDisposeCount}}</span>
			        	<p>{{baseinfo.organDispose == null?'--':baseinfo.organDispose}}</p>
		        	</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<div class="infoItem">
						<span class="infoItemT">政纪处分涉及人次数量：</span>
						<span class="infoItemC">{{baseinfo.politicsDisposeCount == null?'--':baseinfo.politicsDisposeCount}}</span>
						<p>{{baseinfo.politicsDispose == null?'--':baseinfo.politicsDispose}}</p>
					</div>
					<div class="infoItem">
						<span class="infoItemT">党纪处分涉及人次数量：</span>
						<span class="infoItemC">{{baseinfo.partyDisposeCount == null?'--':baseinfo.partyDisposeCount}}</span>
						<p>{{baseinfo.partyDispose == null?'--':baseinfo.partyDispose}}</p>
					</div>
					<div class="infoItem">
						<span class="infoItemT">经济处罚涉及人次数量：</span>
						<span class="infoItemC">{{baseinfo.economicsDisposeCount == null?'--':baseinfo.economicsDisposeCount}}</span>
						<p>{{baseinfo.economicsDispose == null?'--':baseinfo.economicsDispose}}</p>
					</div>
			    </el-col> 
			</el-row>
			<el-row>
				<el-col :span="24">
					<div class="infoItem">
		        		<span class="infoItemT">个人问责情况统计表：</span>
		        	</div>
		        	<el-table :data="baseinfo.complianceSubPersonal" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" height="200">
						<el-table-column type="index" label="序号" align="center"></el-table-column>
						<el-table-column prop="orgName" label="单位名称" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null?'--':scope.row.orgName}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="name" label="人员姓名" align="center" width="100">
							<template slot-scope="scope">
			                    <span :title="scope.row.name" class="textOverFlow">{{scope.row.name == null?'--':scope.row.name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="jobLevel" label="职级" align="center" width="100">
							<template slot-scope="scope">
			                    <span :title="scope.row.jobLevel" class="textOverFlow">{{scope.row.jobLevel == null?'--':scope.row.jobLevel}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="politicsStatus" label="政治面貌" align="center" width="100">
							<template slot-scope="scope">
			                    <span :title="scope.row.politicsStatus" class="textOverFlow">{{scope.row.politicsStatus == null?'--':scope.row.politicsStatus}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="des" label="问题描述" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.des" class="textOverFlow">{{scope.row.des == null?'--':scope.row.des}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="amount" label="问题涉及金额（单位：元）" align="center" width="180">
							<template slot-scope="scope">
			                    <span :title="scope.row.amount" class="textOverFlow">{{scope.row.amount == null?'--':scope.row.amount}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="happendDate" label="问题发生时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.happendDate" class="textOverFlow">{{scope.row.happendDate == null?'--':scope.row.happendDate.indexOf('/')>=0?scope.row.happendDate:scope.row.happendDate.substring(0,4)+'/'+scope.row.happendDate.substring(4,6)+'/'+scope.row.happendDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="findDate" label="发现问题的时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.findDate" class="textOverFlow">{{scope.row.findDate == null?'--':scope.row.findDate.indexOf('/')>=0?scope.row.findDate:scope.row.findDate.substring(0,4)+'/'+scope.row.findDate.substring(4,6)+'/'+scope.row.findDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="jcType" label="发现问题的检查类别" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.jcType == null?'--':accountData.jcType[scope.row.jcType-1] == undefined?'--':accountData.jcType[scope.row.jcType-1].name" class="textOverFlow">{{scope.row.jcType == null?'--':accountData.jcType[scope.row.jcType-1] == undefined?'--':accountData.jcType[scope.row.jcType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="zrType" label="责任类型" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.zrType == null?'--':accountData.zrType[scope.row.zrType-1] == undefined?'--':accountData.zrType[scope.row.zrType-1].name" class="textOverFlow">{{scope.row.zrType == null?'--':accountData.zrType[scope.row.zrType-1] == undefined?'--':accountData.zrType[scope.row.zrType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="zzType" label="组织处理" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.zzType == null?'--':accountData.zzType[scope.row.zzType-1] == undefined?'--':accountData.zzType[scope.row.zzType-1].name" class="textOverFlow">{{scope.row.zzType == null?'--':accountData.zzType[scope.row.zzType-1] == undefined?'--':accountData.zzType[scope.row.zzType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="zjType" label="政纪处分" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.zjType == null?'--':accountData.zjType[scope.row.zjType-1] == undefined?'--':accountData.zjType[scope.row.zjType-1].name" class="textOverFlow">{{scope.row.zjType == null?'--':accountData.zjType[scope.row.zjType-1] == undefined?'--':accountData.zjType[scope.row.zjType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="djType" label="党纪处分" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.djType == null?'--':accountData.djType[scope.row.djType-1] == undefined?'--':accountData.djType[scope.row.djType-1].name" class="textOverFlow">{{scope.row.djType == null?'--':accountData.djType[scope.row.djType-1] == undefined?'--':accountData.djType[scope.row.djType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="jjType" label="经济处罚类型" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.jjType == null?'--':accountData.jjType[scope.row.jjType-1] == undefined?'--':accountData.jjType[scope.row.jjType-1].name" class="textOverFlow">{{scope.row.jjType == null?'--':accountData.jjType[scope.row.jjType-1] == undefined?'--':accountData.jjType[scope.row.jjType-1].name}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="jjAmount" label="经济处罚金额（单位：元）" align="center" width="200">
							<template slot-scope="scope">
			                    <span :title="scope.row.jjAmount" class="textOverFlow">{{scope.row.jjAmount == null?'--':scope.row.jjAmount}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="other" label="其他处分" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.other" class="textOverFlow">{{scope.row.other == null?'--':scope.row.other}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="fileNo" label="处分文件文号" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.fileNo" class="textOverFlow">{{scope.row.fileNo == null?'--':scope.row.fileNo}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="xdDate" label="文件下达时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.xdDate" class="textOverFlow">{{scope.row.xdDate == null?'--':scope.row.xdDate.indexOf('/')>=0?scope.row.xdDate:scope.row.xdDate.substring(0,4)+'/'+scope.row.xdDate.substring(4,6)+'/'+scope.row.xdDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="xdOffice" label="处分下达机关" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.xdOffice" class="textOverFlow">{{scope.row.xdOffice == null?'--':scope.row.xdOffice}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="zxDate" label="处分执行时间" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.zxDate" class="textOverFlow">{{scope.row.zxDate == null?'--':scope.row.zxDate.indexOf('/')>=0?scope.row.zxDate:scope.row.zxDate.substring(0,4)+'/'+scope.row.zxDate.substring(4,6)+'/'+scope.row.zxDate.substring(6,8)}}</span>
			                </template>
						</el-table-column>
						<el-table-column prop="mark" label="备注" align="center" width="150">
							<template slot-scope="scope">
			                    <span :title="scope.row.mark" class="textOverFlow">{{scope.row.mark == null?'--':scope.row.mark}}</span>
			                </template>
						</el-table-column>
		        	</el-table>
				</el-col>
        	</el-row>
			<el-row>
	      		<el-col :span="24">
					<div class="infoItem">
						<span class="infoItemT" style="vertical-align:middle">附件：</span>
				      	<span class="infoItemC1">
				      		<div class="fujian">
								<el-button type="primary" size="mini" class="commonBtn" @click="loadFile(baseinfo.resultFile)" :disabled="!baseinfo.resultFile">批量下载</el-button>
								<i class="el-icon-paperclip"></i>共{{baseinfo.resultFile?baseinfo.resultFile.length:'0'}}个附件
							</div>
							<div v-if="baseinfo.resultFile">
								<el-popover placement="top" trigger="click" v-for="(item,index) in baseinfo.resultFile" :key="item.id" :disabled="item.url.substring(item.url.lastIndexOf('.')+1) == 'rar'||item.url.substring(item.url.lastIndexOf('.')+1) == 'zip'?true:false" v-model="item.visible">
									<div style="text-align:center;margin:0">
										<el-button type="primary" size="mini" class="commonBtn" @click="preView(item.url,item.name,(item.visible = !item.visible))">预览</el-button>
										<el-button type="primary" size="mini" class="commonBtn" @click="goDownload(item.url,item.name,1)">下载</el-button>
									</div>
									<em @click="goDownload(item.url,item.name)" slot="reference">
									{{item.name == null?'--':item.name+item.url.substring(item.url.lastIndexOf('.'))}}<i style="color:#000" v-if="index !== baseinfo.resultFile.length-1">、</i><i style="color:#000" v-else>。</i>
									</em>
								</el-popover>
							</div>
							<div class="infoItemC1" v-else>--</div>
			        	</span>
			    	</div>
				</el-col>
        	</el-row>
		</div>
     	<div class="contList">
			<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">维护记录</span></div>
			<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
				<el-table-column prop="version" label="问责信息版本号" align="center" width="180">
	                <template slot-scope="scope">
	                    <span :title="scope.row.version" class="textOverFlow">{{scope.row.version == null?'--':scope.row.version}}</span>
	                </template>
	            </el-table-column>
				<el-table-column prop="reason" label="问责事由" align="center">
	                <template slot-scope="scope">
	                    <span :title="scope.row.reason" class="textOverFlow" style="color:#4285F4" @click="goDetail(scope.$index, scope.row)">{{scope.row.reason == null?'--':scope.row.reason}}</span>
	                </template>
	            </el-table-column>
            	<el-table-column prop="submissionDate" label="报送时间" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.submissionDate == null||scope.row.submissionDate == ''?'--':scope.row.submissionDate.substring(0,4)+'/'+scope.row.submissionDate.substring(4,6)+'/'+scope.row.submissionDate.substring(6,8)}}</span>
	                </template>
	            </el-table-column>
	            <el-table-column prop="maintainDate" label="维护时间" align="center">
	                <template slot-scope="scope">
	                    <span>{{scope.row.maintainDate == null||scope.row.maintainDate == ''?'--':scope.row.maintainDate.substring(0,4)+'/'+scope.row.maintainDate.substring(4,6)+'/'+scope.row.maintainDate.substring(6,8)}}</span>
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
	          	titMsg:"问责信息详情",
	          	baseinfo:{},
	          	//查询数据
	          	checkData:{},
  				tableData:[],
  				basicFile:[],
		       	collectiveFile:[],
		       	resultFile:[],
		       	objType:{
		          	'1':'集体问责',
		          	'2':'个人问责',
		          	'3':'集体问责+个人问责',
		        },
		        itemType:{
		          	'1':'业务经营问责',
		          	'2':'案件责任追究'
		        },
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
	    	this.searchData()
	    },
	    computed:{
	    	...mapState(['accountData'])
	    },
	    methods:{
	    	searchData(){
	    		var params = qs.stringify({
		    		id: this.$route.query.infoId,
		        	type:1
	        	})
	    		this.axios.post('compliance/findComplianceSubById',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					this.baseinfo = res.data.des
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
			    		path:'/accountSeasonReport',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.path == true){
	    			this.$router.push({
			    		name: 'accountInfo',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			            	belongCompany:this.$route.query.belongCompany,
              				company:this.$route.query.company,
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.statisPath == true){
	    			sessionStorage.setItem('statisPath',4)
	    			this.$router.push({
			    		path: 'infoManage/infoStatistics/detialList',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else if(this.sendBack == true){
	    			sessionStorage.setItem('sendBackPath','firth')
	    			this.$router.push({
			    		name: 'sendBack',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              				id: this.$route.query.id
			            }
			    	})
	    		} else{
	    			sessionStorage.setItem('accountPath',this.$route.query.flag)
	    			this.$router.push({
			    		path:'/infoManage/infoManageSend/account/accountSend',
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
		            path:'/accountDetail',   //跳转的路径
		            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
		            	infoId:row.id,
		              	flag:this.$route.query.flag,
		              	belongCompany:this.$route.query.belongCompany,
              			company:this.$route.query.company,
              			id: this.$route.query.id
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
					this.axios.post('comm/download/705',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
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
			    if(from.fullPath.includes('/accountInfo')){
			    	that.path = true
			    }
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
#accountDetail{
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
	textarea{
		height:75px;
		resize:none
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
	.el-table{
		margin-bottom:20px;
	}
	.el-table::before{
		height:0;
		background-color: transparent!important
	}
	.el-table__body-wrapper{
      background: #fff;
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
			padding-left:170px;
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
			width:170px;
			text-align:justify
		}
		.infoItemT:after,p:after{
			content:'';
		    width: 100%;
		    display: inline-block;
		    overflow: hidden;
		    height: 0;
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
			width:calc(100% - 170px)
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
	.fujian{
		width:100%;
		margin-bottom:10px;
		.el-icon-document{
			margin-right:4px
		}
	}
	.el-table th.gutter{
  		display: table-cell!important;
   	}
}	

</style>
