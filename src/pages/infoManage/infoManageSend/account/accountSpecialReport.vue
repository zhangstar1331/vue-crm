<template>
  	<el-container id="accountSpecialReport">
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
					<el-button type="primary" size="mini" class="commonBtn" @click="goSubmit('lossEvent',2)">保存</el-button>
					<el-button type="primary" size="mini" class="commonBtn" @click="goSubmit('lossEvent',1)">提交</el-button>
			  	</el-col>
		  	</el-row>
	  	</el-header>
	  	<el-form label-position="left" size="mini" ref="infoSpecial" :model="infoSpecial">
	  		<div class="contList firstBox">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">基本信息</span></div>
		      	<el-row>
		      		<el-col :span="12">
			        	<el-form-item label="问责事由" prop="reason">
						    <el-input placeholder="请输入问责事由" v-model="infoSpecial.reason" @change="getReason" :disabled="isDisabled" maxlength="50"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
			        	<el-form-item label="问责事项类型">
						    <el-select v-model="itemType.region" @change="changeitemType" placeholder="请选择问责事项类型" :disabled="isDisabled">
								<el-option v-for="item in itemType.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>						
						</el-form-item>
					</el-col> 
		      	</el-row>
		      	<el-row>
					<el-col :span="12">
			        	<el-form-item label="问责决定书下达时间" prop="happenDate">
						    <el-date-picker type="date" @change="getTime" placeholder="选择日期" v-model="infoSpecial.time" :picker-options="pickerOptions1" :disabled="isDisabled"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
			        	<el-form-item label="问责对象类型" prop="name">
						    <el-select v-model="objType.region" @change="changeobjType" placeholder="请选择问责对象类型" :disabled="isDisabled">
								<el-option v-for="item in objType.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
		      	</el-row>
		      	<div v-if="this.objType.region!==2">
			      	<el-row v-for="(item,index) in infoSpecial.orgMap" :key="item.id">
				        <el-col :span="12">
				        	<el-form-item label="被问责机构" prop="name" class="accountSearch">
							    <el-select v-model="item.subjectName" placeholder="请选择被问责机构" :disabled="item.isDisabled" filterable :filter-method="((val)=>{keyFilter(val,index,1)})" :ref="searchSelect+1+index" @focus="((val)=>{selectFoucus(val,index,1)})" @visible-change="visibleChange">
									<el-option :value="item.subjectName" style="height:auto;background:#FFF">
										<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,index,'subjectName','subject','orgMap')})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
									</el-option>
								</el-select>
								<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(index,1)" :disabled="isDisabled"></el-button>				
							</el-form-item>
						</el-col>
						<el-col :span="12" class="punishLabel add">
							<el-button type="primary" size="mini" class="commonBtn" @click="goAdd(1)" v-if="index == 0" :disabled="isDisabled">添加</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(index,'orgMap')" v-if="index !== 0" :disabled="item.isDisabled">删除</el-button>
						</el-col> 
			      	</el-row>
		      	</div>
		      	<div v-if="this.objType.region!==1">
			      	<el-row v-for="(item,index) in infoSpecial.personageAccountabilityList" :key="item.id">
				        <el-col :span="12">
				        	<el-form-item label="被问责个人">
							    <el-input placeholder="请输入被问责个人名称" v-model="item.personageAccountability" @change="((val)=>{getpersonageAccountability(val, index)})" :disabled="item.isDisabled"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="punishLabel">
				        	<el-form-item label="所属机构" class="accountSearch">
							    <el-select v-model="item.orgName" placeholder="请选择所属机构" :disabled="item.isDisabled" filterable :filter-method="((val)=>{keyFilter(val,index,2)})" :ref="searchSelect+2+index" @focus="((val)=>{selectFoucus(val,index,2)})" @visible-change="visibleChange">
									<el-option :value="item.orgName" style="height:auto;background:#FFF">
										<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,index,'orgName','org','personageAccountabilityList')})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
									</el-option>
								</el-select>
								<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(index,2)" :disabled="isDisabled"></el-button>				
							</el-form-item>
							<el-button type="primary" size="mini" class="commonBtn" @click="goAdd(2)" v-if="index == 0" :disabled="isDisabled">添加</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(index,'personageAccountabilityList')" v-if="index !== 0" :disabled="item.isDisabled">删除</el-button>
						</el-col>
			      	</el-row>
		      	</div>
				<el-form-item label="附件">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,basicFile,1)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.xls,.xlsx,.rar,.zip" :file-list="basicFile" :disabled="isDisabled">
						<el-button type="primary" size="mini" class="commonBtn" @click="type=1" :disabled="isDisabled">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>
							2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>
							3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
			</div>
			<div class="contList" v-if="this.objType.region!==2">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">集体问责结果</span></div>
		      	<el-row>
			         <el-col :span="12">
			        	<el-form-item label="经济处罚涉及机构数量" prop="involveCount">
						    <el-input @keydown.native="checkInput($event)" type="number" placeholder="请输入涉及机构数量" v-model="infoSpecial.involveCount" :disabled="isDisabled" @change="getinvolveCount"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="wenze">
			        	<el-form-item label="被问责机构数量">
						    <el-input @keydown.native="checkInput($event)" type="number" placeholder="请输入被问责机构数量" v-model="infoSpecial.accountabilityCount" @change="getaccountabilityCount" :disabled="isDisabled"></el-input>	
						</el-form-item>
					</el-col> 
		      	</el-row>
		      	<el-row class="asdetail">
		      		<el-col :span="24">
						<el-form-item label="  " class="noStar">
						    <el-input type="textarea" :rows="2" placeholder="示例：**分公司，罚款*万元" v-model="infoSpecial.economicPunishment" @change="geteconomicPunishment" style="margin-top:0" maxlength="500" :disabled="isDisabled"></el-input>
						</el-form-item>
						<el-form-item label="其他问责">
						    <el-input type="textarea" :rows="2" placeholder="请输入其他问责" v-model="infoSpecial.otherAccountability" @change="getotherAccountability" maxlength="500" :disabled="isDisabled"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row class="asdetail">
		      		<el-col :span="24">
						<el-form-item label="集体问责情况统计表" class="noStar">
						    <el-button type="primary" size="mini" class="commonBtn" @click="goDownload('/tpl/download/7051','集体问责情况统计表.xlsx')" style="float:left" :disabled="isDisabled">导出模板</el-button>
						    <el-upload class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload1" action="" :http-request="((param)=>{goUpload(param,1,'complianceSubOrg')})">
								<el-button type="primary" class="commonBtn" size="mini" :disabled="isDisabled">导入结果</el-button>
							</el-upload>
						</el-form-item>
				    </el-col>
				    <el-col :span="24" class="newTable">
						<el-table :data="infoSpecial.complianceSubOrg" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
							<el-table-column type="index" label="序号" align="center"></el-table-column>
							<el-table-column prop="org" label="机构名称" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.orgName" placeholder="请选择机构名称" :disabled="scope.row.isDisabled" :ref="searchSelect+3+scope.$index" @focus="((val)=>{selectFoucus(val,scope.$index,3)})" @visible-change="visibleChange">
										<el-option :value="scope.row.orgName" style="height:auto;background:#FFF">
											<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,scope.$index,'orgName','org','complianceSubOrg')})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="des" label="问题描述" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.des" placeholder="请输入问题描述" @change="((val)=>{getTableData(val,scope.$index,'des','complianceSubOrg')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="amount" label="问题涉及金额（单位：元）" align="center" width="180">
								<template slot-scope="scope">
 									<el-input @keydown.native="checkInput($event)" type="number" v-model="scope.row.amount" placeholder="请输入问题涉及金额" @change="((val)=>{getTableData(val,scope.$index,'amount','complianceSubOrg')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="happendDate" label="问题发生时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'happendDate','complianceSubOrg')})" placeholder="选择日期" v-model="scope.row.happendDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="findDate" label="发现问题的时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'findDate','complianceSubOrg')})" placeholder="选择日期" v-model="scope.row.findDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="jcType" label="发现问题的检查类别" align="center" width="200">
								<template slot-scope="scope">
									<el-select v-model="scope.row.jcType" placeholder="请输入发现问题的检查类别" @change="((val)=>{getTableData(val,scope.$index,'jcType','complianceSubOrg')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.jcType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="cfType" label="处分类型" align="center" width="150">
								<template slot-scope="scope">
 									<el-select v-model="scope.row.cfType" placeholder="请输入处分类型" @change="((val)=>{getTableData(val,scope.$index,'cfType','complianceSubOrg')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.cfType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="fileNo" label="处分文件文号" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.fileNo" placeholder="请输入处分文件文号" @change="((val)=>{getTableData(val,scope.$index,'fileNo','complianceSubOrg')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="xdDate" label="文件下达时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'xdDate','complianceSubOrg')})" placeholder="选择日期" v-model="scope.row.xdDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="xdOffice" label="处分下达机关" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.xdOffice" placeholder="请输入处分下达机关" @change="((val)=>{getTableData(val,scope.$index,'xdOffice','complianceSubOrg')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="zxDate" label="处分执行时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'zxDate','complianceSubOrg')})" placeholder="选择日期" v-model="scope.row.zxDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="mark" label="备注" align="center" width="150">
								<template slot-scope="scope">
									<el-input v-model="scope.row.mark" placeholder="请输入备注" @change="((val)=>{getTableData(val,scope.$index,'mark','complianceSubOrg')})" :disabled="scope.row.isDisabled"></el-input>
									<el-button type="primary" size="mini" class="commonBtn" @click="goAdd(3)" v-if="scope.$index == 0" :disabled="isDisabled">添加</el-button>
									<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(scope.$index,'complianceSubOrg')" v-if="scope.$index !== 0" :disabled="scope.row.isDisabled">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
				    </el-col>
				</el-row>
				<el-form-item label="附件" class="noStar">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,collectiveFile,2)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.xls,.xlsx,.rar,.zip" :file-list="collectiveFile" :disabled="isDisabled">
						<el-button type="primary" size="mini" class="commonBtn" @click="type=2" :disabled="isDisabled">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>
							2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>
							3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
			</div>
			<div class="contList" v-if="this.objType.region!==1">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;">个人问责结果</span></div>
				<el-row>
					<el-col :span="12">
						<el-form-item label="组织处理涉及人次">
							<el-input @keydown.native="checkInput($event)" type="number" placeholder="请输入涉及人次数量" v-model="infoSpecial.organDisposeCount" @change="getorganDisposeCount" class="detailnum" :disabled="isDisabled"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row class="asdetail">
		      		<el-col :span="24">
		      			<el-form-item label="  " class="noStar">
							<el-input type="textarea" :rows="2" placeholder="请输入涉及组织处理的人员及对应的处理结果" v-model="infoSpecial.organDispose" @change="getorganDispose" maxlength="500" :disabled="isDisabled"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="政纪处分涉及人次">
							<el-input @keydown.native="checkInput($event)" type="number" placeholder="请输入涉及人次数量" v-model="infoSpecial.politicsDisposeCount" @change="getpoliticsDisposeCount" class="detailnum" :disabled="isDisabled"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="asdetail">
		      		<el-col :span="24">
		      			<el-form-item label="  " class="noStar">
							<el-input type="textarea" :rows="2" placeholder="请输入涉及政纪处分的人员及对应的处理结果" v-model="infoSpecial.politicsDispose" @change="getpoliticsDispose" maxlength="500" :disabled="isDisabled"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="党纪处分涉及人次">
							<el-input @keydown.native="checkInput($event)" type="number" placeholder="请输入涉及人次数量" v-model="infoSpecial.partyDisposeCount" @change="getpartyDisposeCount" class="detailnum" :disabled="isDisabled"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="asdetail">
		      		<el-col :span="24">
		      			<el-form-item label="  " class="noStar">
							<el-input type="textarea" :rows="2" placeholder="请输入涉及党纪处分的人员及对应的处理结果" v-model="infoSpecial.partyDispose" @change="getpartyDispose" maxlength="500" :disabled="isDisabled"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="经济处罚涉及人次">
							<el-input @keydown.native="checkInput($event)" type="number" placeholder="请输入涉及人次数量" v-model="infoSpecial.economicsDisposeCount" @change="geteconomicsDisposeCount" class="detailnum" :disabled="isDisabled"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="asdetail">
		      		<el-col :span="24">
		      			<el-form-item label="  " class="noStar">
							<el-input type="textarea" :rows="2" placeholder="请输入涉及经济处罚的人员及对应的处理结果" v-model="infoSpecial.economicsDispose" @change="geteconomicsDispose" maxlength="500" :disabled="isDisabled"></el-input>
						</el-form-item>
				    </el-col> 
				</el-row>
				<el-row class="asdetail">
		      		<el-col :span="24">
						<el-form-item label="个人问责情况统计表" class="noStar">
						    <el-button type="primary" size="mini" class="commonBtn" @click="goDownload('/tpl/download/7052','个人问责情况统计表.xlsx')" style="float:left" :disabled="isDisabled">导出模板</el-button>
						    <el-upload class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload1" action="" :http-request="((param)=>{goUpload(param,2,'complianceSubPersonal')})">
								<el-button type="primary" class="commonBtn" size="mini" :disabled="isDisabled">导入结果</el-button>
							</el-upload>
						</el-form-item>
				    </el-col>
				    <el-col :span="24" class="newTable">
						<el-table :data="infoSpecial.complianceSubPersonal" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
							<el-table-column type="index" label="序号" align="center"></el-table-column>
							<el-table-column prop="org" label="单位名称" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.orgName" placeholder="请选择单位名称" :disabled="scope.row.isDisabled" :ref="searchSelect+4+scope.$index" @focus="((val)=>{selectFoucus(val,scope.$index,4)})" @visible-change="visibleChange">
										<el-option :value="scope.row.orgName" style="height:auto;background:#FFF">
											<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,scope.$index,'orgName','org','complianceSubPersonal')})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="人员姓名" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.name" placeholder="请输入人员姓名" @change="((val)=>{getTableData(val,scope.$index,'name','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="jobLevel" label="职级" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.jobLevel" placeholder="请输入职级" @change="((val)=>{getTableData(val,scope.$index,'jobLevel','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="politicsStatus" label="政治面貌" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.politicsStatus" placeholder="请输入政治面貌" @change="((val)=>{getTableData(val,scope.$index,'politicsStatus','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="des" label="问题描述" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.des" placeholder="请输入问题描述" @change="((val)=>{getTableData(val,scope.$index,'des','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="amount" label="问题涉及金额（单位：元）" align="center" width="180">
								<template slot-scope="scope">
 									<el-input @keydown.native="checkInput($event)" type="number" v-model="scope.row.amount" placeholder="请输入问题涉及金额" @change="((val)=>{getTableData(val,scope.$index,'amount','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="happendDate" label="问题发生时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'happendDate','complianceSubPersonal')})" placeholder="选择日期" v-model="scope.row.happendDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="findDate" label="发现问题的时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'findDate','complianceSubPersonal')})" placeholder="选择日期" v-model="scope.row.findDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="jcType" label="发现问题的检查类别" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.jcType" placeholder="请输入发现问题的检查类别" @change="((val)=>{getTableData(val,scope.$index,'jcType','complianceSubPersonal')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.jcType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="zrType" label="责任类型" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.zrType" placeholder="请输入责任类型" @change="((val)=>{getTableData(val,scope.$index,'rType','complianceSubPersonal')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.zrType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="zzType" label="组织处理" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.zzType" placeholder="请输入组织处理" @change="((val)=>{getTableData(val,scope.$index,'zzType','complianceSubPersonal')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.zzType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="zjType" label="政纪处分" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.zjType" placeholder="请输入政纪处分" @change="((val)=>{getTableData(val,scope.$index,'zjType','complianceSubPersonal')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.zjType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="djType" label="党纪处分" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.djType" placeholder="请输入党纪处分" @change="((val)=>{getTableData(val,scope.$index,'djType','complianceSubPersonal')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.djType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="jjType" label="经济处罚类型" align="center" width="150">
								<template slot-scope="scope">
									<el-select v-model="scope.row.jjType" placeholder="请输入经济处罚类型" @change="((val)=>{getTableData(val,scope.$index,'jjType','complianceSubPersonal')})" :disabled="scope.row.isDisabled">
										<el-option v-for="item in accountData.jjType" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="jjAmount" label="经济处罚金额（单位：元）" align="center" width="200">
								<template slot-scope="scope">
 									<el-input @keydown.native="checkInput($event)" type="number" v-model="scope.row.jjAmount" placeholder="请输入经济处罚金额" @change="((val)=>{getTableData(val,scope.$index,'jjAmount','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="other" label="其他处分" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.other" placeholder="请输入其他处分" @change="((val)=>{getTableData(val,scope.$index,'other','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="fileNo" label="处分文件文号" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.fileNo" placeholder="请输入处分文件文号" @change="((val)=>{getTableData(val,scope.$index,'fileNo','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="xdDate" label="文件下达时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'xdDate','complianceSubPersonal')})" placeholder="选择日期" v-model="scope.row.xdDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="xdOffice" label="处分下达机关" align="center" width="150">
								<template slot-scope="scope">
 									<el-input v-model="scope.row.xdOffice" placeholder="请输入处分下达机关" @change="((val)=>{getTableData(val,scope.$index,'xdOffice','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="zxDate" label="处分执行时间" align="center" width="150">
								<template slot-scope="scope">
									<el-date-picker type="date" @change="((val)=>{getTime1(val,scope.$index,'zxDate','complianceSubPersonal')})" placeholder="选择日期" v-model="scope.row.zxDateTime" :disabled="scope.row.isDisabled"></el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="mark" label="备注" align="center" width="150">
								<template slot-scope="scope">
									<el-input v-model="scope.row.mark" placeholder="请输入备注" @change="((val)=>{getTableData(val,scope.$index,'mark','complianceSubPersonal')})" :disabled="scope.row.isDisabled"></el-input>
									<el-button type="primary" size="mini" class="commonBtn" @click="goAdd(4)" v-if="scope.$index == 0" :disabled="isDisabled">添加</el-button>
									<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(scope.$index,'complianceSubPersonal')" v-if="scope.$index !== 0" :disabled="scope.row.isDisabled">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
				    </el-col>
				</el-row>
				<el-form-item label="附件" class="noStar">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,resultFile,3)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.xls,.xlsx,.rar,.zip" :file-list="resultFile" :disabled="isDisabled">
						<el-button type="primary" size="mini" class="commonBtn" @click="type=3" :disabled="isDisabled">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>
							2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>
							3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
			</div>
     	</el-form>
     	<org-search :searchResult="searchResult" :chooseType="1" v-if="isShow" @closeMask="closeMaskTable"></org-search>
  	</el-container>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate,fileTypeDiffer} from 'src/utils/utils.js'
	import orgSearch from 'src/components/infoManage/orgSearch'
	import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
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
	  		var checkHappenDate = (rule, value, callback) => {
	  			if (value === '') {
		          	callback(new Error('事件发生时间不能为空'));
		        }
	  		};
	        return {
	          	titMsg:"新建问责信息",
	          	baseInfo:'',
	          	isDisabled:false,
	          	type:1,
	          	//查询数据
	          	checkData:{
	          		submissionType:2,//专报
	          	},
	          	infoSpecial:{
		        	name:'',// 事件名称
		        	time:'',
		        	involveCount:'',
		        	accountabilityCount:'',
		        	economicPunishment:'',
		        	otherAccountability:'',
		        	organDisposeCount:'',
		        	organDispose:'',
		        	politicsDisposeCount:'',
		        	politicsDispose:'',
		        	partyDisposeCount:'',
		        	partyDispose:'',
		        	economicsDisposeCount:'',
		        	economicsDispose:'',
		        	orgMap:[{
		        		subject:null,
			        	subjectName:'',
		        	}],
		        	personageAccountabilityList:[{
		        		personageAccountability:null,
		        		org:null,
		        		orgName:'',
		        	}],
		        	complianceSubOrg:[{
		        		org:null,
		        		des:null,
		        		amount:null,
		        		happendDate:null,
		        		happendDateTime:null,
		        		findDate:null,
		        		findDateTime:null,
		        		jcType:null,
		        		cfType:null,
		        		fileNo:null,
		        		xdDate:null,
		        		xdDateTime:null,
		        		xdOffice:null,
		        		zxDate:null,
		        		zxDateTime:null,
		        		mark:null,
		        	}],
		        	complianceSubPersonal:[{
		        		org:null,
		        		name:null,
		        		jobLevel:null,
		        		politicsStatus:null,
		        		des:null,
		        		amount:null,
		        		happendDate:null,
		        		happendDateTime:null,
		        		findDate:null,
		        		findDateTime:null,
		        		zrType:null,
		        		zzType:null,
		        		zjType:null,
		        		djType:null,
		        		jjType:null,
		        		jjAmount:null,
		        		other:null,
		        		jcType:null,
		        		fileNo:null,
		        		xdDate:null,
		        		xdDateTime:null,
		        		xdOffice:null,
		        		zxDate:null,
		        		zxDateTime:null,
		        		mark:null
		        	}]
		        },
		        objType:{
			       	region: '',
			       	unitsData:[{
			          	name:'集体问责',
			          	id:1
			        },{
			          	name:'个人问责',
			          	id:2
			        },{
			          	name:'集体问责+个人问责',
			          	id:3
			        }]
		        },
		        itemType:{
			       	region: '',
			       	unitsData:[{
			          	name:'业务经营问责',
			          	id:1
			        },{
			          	name:'案件责任追究',
			          	id:2
			        }]
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
	  				disabledDate: (time) => {
	                    return time.getTime() > Date.now();
		          	},
	  			},
	  			pickerOptions2:{
	  				disabledDate: (time) => {
		            	return time.getTime() > Date.now();
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
		       	rules:{
		       		name: [
	  					{validator: checkName, trigger: 'blur' }
	  				],
	  				happenDate: [
	  					{validator: checkHappenDate, trigger: 'blur' }
	  				],
		       	},
		       	basicFile:[],
		       	collectiveFile:[],
		       	resultFile:[],
		       	isObjType:null,
		       	isShow:false,
  				searchResult:'',
  				visible:false,
  				searchSelect:'searchSelect',
  				treeData:[]
			}
	   	},
	    created(){
	    	if(this.$route.query.flag == 0 || this.$route.query.flag == 3){
	    		this.titMsg = "编辑问责信息"
	    		this.getInfo()
	    	} else if(this.$route.query.flag == 1){
	    		this.titMsg = "维护问责信息"
	    		this.isDisabled = true
	    		this.getInfo()
	    	}
	    	if(this.$route.query.flag !== 1){
	    		this.connectAxios('1_01','','','1')
	    	}
	    },
	    computed:{
	    	...mapState(['accountData'])
	    },
	    components:{
	    	orgSearch
	    },
	    methods:{
	    	handleNodeClick(node,index,name1,name2,kind) {
				if(node.disabled!=true){
					this.$set(this.infoSpecial[kind][index],name1,node.name)
					this.checkData[kind] = this.infoSpecial[kind]
					if(node.groupId!==''){
						this.$set(this.checkData[kind][index],name2,node.groupId)
		      		} else{
		      			delete this.checkData[kind][index][name2]
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
	  		//问责对象类型
	    	changeobjType(val){
	    		this.checkData.objType = val
	    	},
	    	//问责事项类型
	    	changeitemType(val){
	    		this.checkData.itemType = val
	    	},
	    	// 问责事由
	    	getReason(val){
	    		if(val == ''){
	    			delete this.checkData.reason
	    		} else{
	    			this.checkData.reason = val
	    		}
	    	},
	    	//事件发生时间
	    	getTime(val){
	    		if(val !== null){
	    			this.checkData.time = formatDate(val,'yyyyMMdd')
	    			this.checkData.time = this.checkData.time.split('-').join('')
	    		} else{
	    			delete this.checkData.time
	    		}
	    	},
	    	getTime1(val,index,name,type){
	    		if(val !== null){
	    			this.checkData[type] = this.infoSpecial[type]
	    			this.checkData[type][index][name] = formatDate(val,'yyyyMMdd')
	    			this.checkData[type][index][name] = this.checkData[type][index][name].split('-').join('')
	    		} else{
	    			delete this.checkData[type][index][name]
	    		}
	    	},
	    	getbelongCompany(val,index){
	    		this.infoSpecial.orgMap[index].belongCompany = val
	    		this.checkData.orgMap = this.infoSpecial.orgMap
	    	},
	    	getinvolveCount(val){
	    		if(val == ''){
	    			delete this.checkData.involveCount
	    		} else{
		  			this.checkData.involveCount = val
	    		}
	    	},
	    	getaccountabilityCount(val){
	    		if(val == ''){
	    			delete this.checkData.accountabilityCount
	    		} else{
		  			this.checkData.accountabilityCount = val
	    		}
	    	},
	    	geteconomicPunishment(val){
	    		if(val == ''){
	    			delete this.checkData.economicPunishment
	    		} else{
		  			this.checkData.economicPunishment = val
	    		}
	    	},
	    	getotherAccountability(val){
	    		if(val == ''){
	    			delete this.checkData.otherAccountability
	    		} else{
		  			this.checkData.otherAccountability = val
	    		}
	    	},
	    	getpersonageAccountability(val,index){
	    		this.infoSpecial.personageAccountabilityList[index].personageAccountability = val
	    		this.checkData.personageAccountabilityList = this.infoSpecial.personageAccountabilityList
	    	},
	    	getorganDisposeCount(val){
	    		if(val == ''){
	    			delete this.checkData.organDisposeCount
	    		} else{
	    			this.checkData.organDisposeCount = val
	    		}
	    	},
			// 事件描述
	    	getorganDispose(val){
	    		if(val == ''){
	    			delete this.checkData.organDispose
	    		} else{
	    			this.checkData.organDispose = val
	    		}
	    	},
	    	// 已采取措施
	    	getpoliticsDisposeCount(val){
	    		if(val == ''){
	    			delete this.checkData.politicsDisposeCount
	    		} else{
	    			this.checkData.politicsDisposeCount = val
	    		}
	    	},
	    	// 未来损失预测
	    	getpoliticsDispose(val){
	    		if(val == ''){
	    			delete this.checkData.politicsDispose
	    		} else{
	    			this.checkData.politicsDispose = val
	    		}
	    	},
	    	getpartyDisposeCount(val){
	    		if(val == ''){
	    			delete this.checkData.partyDisposeCount
	    		} else{
	    			this.checkData.partyDisposeCount = val
	    		}
	    	},
	    	// 未来损失预测
	    	getpartyDispose(val){
	    		if(val == ''){
	    			delete this.checkData.partyDispose
	    		} else{
	    			this.checkData.partyDispose = val
	    		}
	    	},
	    	geteconomicsDisposeCount(val){
	    		if(val == ''){
	    			delete this.checkData.economicsDisposeCount
	    		} else{
	    			this.checkData.economicsDisposeCount = val
	    		}
	    	},
	    	// 未来损失预测
	    	geteconomicsDispose(val){
	    		if(val == ''){
	    			delete this.checkData.economicsDispose
	    		} else{
	    			this.checkData.economicsDispose = val
	    		}
	    	},
	    	getTableData(val,index,name,type){
	    		this.$set(this.infoSpecial[type][index],name,val)
	    		this.checkData[type] = this.infoSpecial[type]
	    		this.checkData[type][index][name] = this.infoSpecial[type][index][name]
	    	},
		    // 返回
	    	goback(){
	    		// 季报编辑
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'/accountSeasonReport',
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
	    	goAdd(type){
	    		switch (type){
	    			case 1:
	    				this.infoSpecial.orgMap.push({
			    			subject:null,
				        	subjectName:'',
			    		})
	    				break;
	    			case 2:
	    				this.infoSpecial.personageAccountabilityList.push({
			    			personageAccountability:null,
			    			org:null,
			    			orgName:'',
			    		})
	    				break;
	    			case 3:
	    				this.infoSpecial.complianceSubOrg.push({
	    					org:null,
			        		des:null,
			        		amount:null,
			        		happendDate:null,
			        		findDate:null,
			        		jcType:null,
			        		cfType:null,
			        		fileNo:null,
			        		xdDate:null,
			        		xdOffice:null,
			        		zxDate:null,
			        		mark:null,
	    				})
	    				break;
	    			case 4:
	    				this.infoSpecial.complianceSubPersonal.push({
			        		org:null,
			        		name:null,
			        		jobLevel:null,
			        		politicsStatus:null,
			        		des:null,
			        		amount:null,
			        		happendDate:null,
			        		findDate:null,
			        		zrType:null,
			        		zzType:null,
			        		zjType:null,
			        		djType:null,
			        		jjType:null,
			        		jjAmount:null,
			        		other:null,
			        		jcType:null,
			        		fileNo:null,
			        		xdDate:null,
			        		xdOffice:null,
			        		zxDate:null,
			        		mark:null
			        	})
	    				break;
	    		}
	    	},
	    	// 被处罚机构删除
	    	goMinus(index,type){
	    		this.infoSpecial[type].splice(index,1)
	    		this.checkData[type] = this.infoSpecial[type]
	    	},
		    // 上传附件
		    uploadFile(param){
				var fileObj = param.file;
				var form = new FormData();
				form.append("file", fileObj);
				this.axios.post('/comm/upload/705',form).then((res)=>{
					if(res.code == 200){
						let obj = new Object()
						obj.url = res.data.path
						obj.name = res.data.name
						obj.id = res.data.id
						obj.uid = param.file.uid
						if(this.type == 1){
							let arr = []
							if(this.basicFile){
								arr = this.basicFile
							}
							arr.push(obj)
							this.basicFile = arr
							this.checkData.basicFile = this.basicFile
						} else if(this.type == 2){
							let arr = []
							if(this.collectiveFile){
								arr = this.collectiveFile
							}
							arr.push(obj)
							this.collectiveFile = arr
							this.checkData.collectiveFile = this.collectiveFile
						} else if(this.type == 3){
							let arr = []
							if(this.resultFile){
								arr = this.resultFile
							}
							arr.push(obj)
							this.resultFile = arr
							this.checkData.resultFile = this.resultFile
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
			handleRemove(file,fileList,type){
				if(type ==1){
					if(this.basicFile){
						for (var i = 0; i < this.basicFile.length; i++) {
							if(this.basicFile[i].uid == file.uid){
								this.basicFile.splice(i,1)
							}
						}
						this.checkData.basicFile = this.basicFile
					} else{
						delete this.checkData.basicFile
					}
				} else if(type == 2){
					if(this.collectiveFile){
						for (var i = 0; i < this.collectiveFile.length; i++) {
							if(this.collectiveFile[i].uid == file.uid){
								this.collectiveFile.splice(i,1)
							}
						}
						this.checkData.collectiveFile = this.collectiveFile
					} else{
						delete this.checkData.collectiveFile
					}
				} else if(type == 3){
					if(this.resultFile){
						for (var i = 0; i < this.resultFile.length; i++) {
							if(this.resultFile[i].uid == file.uid){
								this.resultFile.splice(i,1)
							}
						}
						this.checkData.resultFile = this.resultFile
					} else{
						delete this.checkData.resultFile
					}
				}
			},
			beforeAvatarUpload(file) {
		        return fileTypeDiffer(file)
		    },
		    // 提交
	    	goSubmit(formName,val){
	    		if(val == 2){
	    			if(this.checkData.objType == undefined || this.checkData.objType == 1 || this.checkData.objType == 3){
	    				if(this.checkData.orgMap == undefined){
							this.$alert('被问责机构不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
						}
	    			} else{
	    				if(this.checkData.personageAccountabilityList != undefined&&this.checkData.personageAccountabilityList.length>0){
							for(var i = 0;i<this.checkData.personageAccountabilityList.length;i++){
								if(this.checkData.personageAccountabilityList[i].personageAccountability == null){
									this.$alert('被问责个人不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
								if(this.checkData.personageAccountabilityList[i].org == null){
									this.$alert('所属机构不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
							}
						} else{
							this.$alert('被问责个人不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
						}
	    			}
	    		}
	    		// 提交判断为空
	    		if(val == 1){
	    			if(this.checkData.reason == undefined){
	    				this.$alert('问责事由不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.itemType == undefined){
	    				this.$alert('问责事项类型不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.time == undefined){
	    				this.$alert('问责决定书下达时间不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			if(this.checkData.objType == undefined){
	    				this.$alert('问责对象类型不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
					if(this.checkData.basicFile == undefined){
	    				this.$alert('基本信息附件不能为空', '提示', {
				        	confirmButtonText: '确定'
				        });
				        return
	    			}
	    			// 集体问责
	    			if(this.checkData.objType != undefined&&this.checkData.objType == 1){
	    				delete this.checkData.personageAccountabilityList
	    				delete this.checkData.organDisposeCount
	    				delete this.checkData.organDispose
	    				delete this.checkData.politicsDisposeCount
	    				delete this.checkData.politicsDispose
	    				delete this.checkData.partyDisposeCount
	    				delete this.checkData.partyDispose
	    				delete this.checkData.economicsDisposeCount
	    				delete this.checkData.economicsDispose
	    				delete this.checkData.complianceSubPersonal
	    				if(this.checkData.orgMap == undefined){
							this.$alert('被问责机构不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
						}
	    				if(this.checkData.involveCount == undefined){
		    				this.$alert('经济处罚涉及机构数量不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.accountabilityCount == undefined){
		    				this.$alert('被问责机构数量不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.economicPunishment == undefined){
		    				this.$alert('经济处罚不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.otherAccountability == undefined){
		    				this.$alert('其他问责不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
	    			} else if(this.checkData.objType != undefined&&this.checkData.objType == 2){//个人问责
	    				delete this.checkData.involveCount
	    				delete this.checkData.accountabilityCount
	    				delete this.checkData.economicPunishment
	    				delete this.checkData.otherAccountability
	    				delete this.checkData.complianceSubOrg
	    				if(this.checkData.personageAccountabilityList != undefined&&this.checkData.personageAccountabilityList.length>0){
							for(var i = 0;i<this.checkData.personageAccountabilityList.length;i++){
								if(this.checkData.personageAccountabilityList[i].personageAccountability == null){
									this.$alert('被问责个人不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
								if(this.checkData.personageAccountabilityList[i].org == null){
									this.$alert('所属机构不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
							}
						} else{
							this.$alert('被问责个人不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
						}
						if(this.checkData.organDisposeCount == undefined){
		    				this.$alert('组织处理涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.organDispose == undefined){
		    				this.$alert('组织处理不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.politicsDisposeCount == undefined){
		    				this.$alert('政纪处分涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.politicsDispose == undefined){
		    				this.$alert('政纪处分不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.partyDisposeCount == undefined){
		    				this.$alert('党纪处分涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.partyDispose == undefined){
		    				this.$alert('党纪处分不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.economicsDisposeCount == undefined){
		    				this.$alert('经济处罚涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.economicsDispose == undefined){
		    				this.$alert('经济处罚不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
	    			} else{
	    				if(this.checkData.orgMap == undefined){
							this.$alert('被问责机构不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
						}
						if(this.checkData.personageAccountabilityList != undefined&&this.checkData.personageAccountabilityList.length>0){
							for(var i = 0;i<this.checkData.personageAccountabilityList.length;i++){
								if(this.checkData.personageAccountabilityList[i].personageAccountability == null){
									this.$alert('被问责个人不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
								if(this.checkData.personageAccountabilityList[i].org == null){
									this.$alert('所属机构不能为空', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
							}
						} else{
							this.$alert('被问责个人不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
						}
						if(this.checkData.involveCount == undefined){
		    				this.$alert('经济处罚涉及机构数量不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.accountabilityCount == undefined){
		    				this.$alert('被问责机构数量不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.economicPunishment == undefined){
		    				this.$alert('经济处罚不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.otherAccountability == undefined){
		    				this.$alert('其他问责不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
						if(this.checkData.organDisposeCount == undefined){
		    				this.$alert('组织处理涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.organDispose == undefined){
		    				this.$alert('组织处理不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.politicsDisposeCount == undefined){
		    				this.$alert('政纪处分涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.politicsDispose == undefined){
		    				this.$alert('政纪处分不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.partyDisposeCount == undefined){
		    				this.$alert('党纪处分涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.partyDispose == undefined){
		    				this.$alert('党纪处分不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.economicsDisposeCount == undefined){
		    				this.$alert('经济处罚涉及人次不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.economicsDispose == undefined){
		    				this.$alert('经济处罚不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
	    			}
	    		}
				// 提交、保存
	    		this.checkData.action = val
	    		this.axios.post('compliance/addComplianceSub',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
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
						    		path:'/accountSeasonReport',
						    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
					      				id: this.$route.query.id
						            }
						    	})
				    		} else{
						      	sessionStorage.setItem('accountPath',this.checkData.action)
						      	this.$router.push({
						    		path:'/infoManage/infoManageSend/account/accountSend',
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
	    	// 编辑
	    	getInfo(){
	    		var params = qs.stringify({
		    		id: this.$route.query.infoId,
		        	type:2
	        	})
	    		this.axios.post('compliance/findComplianceSubById',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					this.infoSpecial = res.data == null?new Object:res.data.des
	    					this.checkData = JSON.parse(JSON.stringify(this.infoSpecial))
	    					this.objType.region = this.infoSpecial.objType == null?'':parseInt(this.infoSpecial.objType)
	    					this.itemType.region = this.infoSpecial.itemType == null?'':parseInt(this.infoSpecial.itemType)
	    					if(this.infoSpecial.time){
	    						this.infoSpecial.time = this.infoSpecial.time.substring(0,4)+'-'+this.infoSpecial.time.substring(4,6)+'-'+this.infoSpecial.time.substring(6,8)
	    					}
	    					this.basicFile = this.infoSpecial.basicFile == null?[]:this.infoSpecial.basicFile 
	    					this.collectiveFile = this.infoSpecial.collectiveFile == null?[]:this.infoSpecial.collectiveFile
	    					this.resultFile = this.infoSpecial.resultFile == null?[]: this.infoSpecial.resultFile
	    					if(this.infoSpecial.orgMap&&this.infoSpecial.orgMap.length>0){
		    					for(var i = 0;i<this.infoSpecial.orgMap.length;i++){
		    						this.$set(this.infoSpecial.orgMap[i],'subjectName',this.infoSpecial.orgMap[i].orgName)
		    						if(this.$route.query.flag == 1){
		    							this.infoSpecial.orgMap[i].isDisabled = true
		    						}
		    					}
	    					} else{
	    						this.infoSpecial.orgMap=[{
				  					subject:null,
						        	subjectName:'',
				  				}]
	    					}
	    					if(this.infoSpecial.personageAccountabilityList&&this.infoSpecial.personageAccountabilityList.length>0){
		    					for(var i = 0;i<this.infoSpecial.personageAccountabilityList.length;i++){
		    						this.infoSpecial.personageAccountabilityList[i].personageAccountability = this.infoSpecial.personageAccountabilityList[i].personageAccountability
		    						if(this.$route.query.flag == 1){
		    							this.infoSpecial.personageAccountabilityList[i].isDisabled = true
		    						}
		    					}
	    					} else{
	    						this.infoSpecial.personageAccountabilityList=[{
				  					personageAccountability:null,
				  					org:null,
				  					orgName:'',
				  				}]
	    					}
	    					this.isObjType = this.infoSpecial.objType
	    					var kind = ['complianceSubOrg','complianceSubPersonal']
	    					var arr = ['happendDate','findDate','xdDate','zxDate']
							for (var t=0;t<kind.length;t++){
								if(kind[t] == 'complianceSubOrg'&&!this.infoSpecial.complianceSubOrg){
									this.infoSpecial.complianceSubOrg=[{
						        		org:null,
						        		orgName:null,
						        		des:null,
						        		amount:null,
						        		happendDate:null,
						        		happendDateTime:null,
						        		findDate:null,
						        		findDateTime:null,
						        		jcType:null,
						        		cfType:null,
						        		fileNo:null,
						        		xdDate:null,
						        		xdDateTime:null,
						        		xdOffice:null,
						        		zxDate:null,
						        		zxDateTime:null,
						        		mark:null,
						        	}]
								}
								if(kind[t] == 'complianceSubPersonal'&&!this.infoSpecial.complianceSubPersonal){
		    						this.infoSpecial.complianceSubPersonal=[{
						        		org:null,
						        		orgName:null,
						        		name:null,
						        		jobLevel:null,
						        		politicsStatus:null,
						        		des:null,
						        		amount:null,
						        		happendDate:null,
						        		happendDateTime:null,
						        		findDate:null,
						        		findDateTime:null,
						        		zrType:null,
						        		zzType:null,
						        		zjType:null,
						        		djType:null,
						        		jjType:null,
						        		jjAmount:null,
						        		other:null,
						        		jcType:null,
						        		fileNo:null,
						        		xdDate:null,
						        		xdDateTime:null,
						        		xdOffice:null,
						        		zxDate:null,
						        		zxDateTime:null,
						        		mark:null
						        	}]
		    					}
		    					if(this.infoSpecial[kind[t]]&&this.infoSpecial[kind[t]].length>0){
									for(var i=0;i<this.infoSpecial[kind[t]].length;i++){
										this.infoSpecial[kind[t]][i].orgName = this.infoSpecial[kind[t]][i].orgName
										for(var j=0;j<arr.length;j++){
											if(this.infoSpecial[kind[t]][i][arr[j]]){
												if(this.infoSpecial[kind[t]][i][arr[j]].indexOf('/')>=0){
													this.$set(this.infoSpecial[kind[t]][i],arr[j]+'Time',this.infoSpecial[kind[t]][i][arr[j]].replace('/','-'))
												} else{
													this.$set(this.infoSpecial[kind[t]][i],arr[j]+'Time',this.infoSpecial[kind[t]][i][arr[j]].substring(0,4)+'-'+this.infoSpecial[kind[t]][i][arr[j]].substring(4,6)+'-'+this.infoSpecial[kind[t]][i][arr[j]].substring(6,8))
												}
											}
										}
										if(this.$route.query.flag == 1){
			    							this.infoSpecial[kind[t]][i].isDisabled = true
			    						}
									}
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
	    	checkInput(e){
			  	let prohibitInput= ["-", "e", "+", "E"];
			  	if(prohibitInput.includes(e.key)){
			    	e.preventDefault();
			  	}
			},
			closeMaskTable(data){
		    	this.isShow = data.status;
		    	if(data.orgChecked){
		    		switch (data.type){
		    			case 1:
		    				this.$set(this.checkData.orgMap[data.index],'subject',data.orgChecked)
		    				break;
		    			case 2:
		    				this.$set(this.checkData.personageAccountabilityList[data.index],'org',data.orgChecked)
		    				break;
		    		}
		    	}
		    	if(data.orgName){
		    		switch (data.type){
		    			case 1:
		    				this.$set(this.infoSpecial.orgMap[data.index],'subjectName',data.orgName)
		    				break;
		    			case 2:
		    				this.$set(this.infoSpecial.personageAccountabilityList[data.index],'orgName',data.orgName)
		    				break;
		    		}
		    	}
		    },
		    keyFilter(val,index,type){
		    	if(type == 1){
		    		this.infoSpecial.orgMap[index].subjectName = val
					this.checkData.orgMap = this.infoSpecial.orgMap
					delete this.infoSpecial.orgMap[index].subject
		    	} else{
		    		this.infoSpecial.personageAccountabilityList[index].orgName = val
					this.checkData.personageAccountabilityList = this.infoSpecial.personageAccountabilityList
					delete this.infoSpecial.personageAccountabilityList[index].org
		    	}
			},
			filterNode(value, data) {
				return true
		    },
		    selectFoucus(e,index,type){
		    	if(this.visible){
		    		let input = this.$refs['searchSelect' + type + index]
		    		input[0].blur()
		    	}
		    },
		    visibleChange(val){
		    	this.visible = val
		    },
	      	searchOrg(index,type){
	      		var reOrgName = ''
	      		if(type == 1){
	      			reOrgName = this.infoSpecial.orgMap[index].subjectName
	      		} else{
	      			reOrgName = this.infoSpecial.personageAccountabilityList[index].orgName
	      		}
				if(!reOrgName){
					this.$alert('请输入被问责机构名称', '提示', {
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
			goDownload(path,filename){
		    	this.axios.post(path,qs.stringify(),{responseType:'arraybuffer'}).then((res)=>{
	              	fileDownload(res, filename);
	    		})
		    },
			goUpload(param,type,kind){
				var fileObj = param.file;
		    	var form = new FormData();
		    	form.append("file", fileObj);
		    	form.append("type", type);
		    	this.axios.post('/compliance/import',form).then((res)=>{
					if(res.code == '200'){
						if(res.data!==null){
							this.infoSpecial[kind] = res.data
							this.checkData[kind] = JSON.parse(JSON.stringify(this.infoSpecial[kind]))
							var arr = ['happendDate','findDate','xdDate','zxDate']
							for(var i=0;i<this.infoSpecial[kind].length;i++){
								for(var j=0;j<arr.length;j++){
									if(this.infoSpecial[kind][i][arr[j]]){
										this.$set(this.infoSpecial[kind][i],arr[j]+'Time',this.infoSpecial[kind][i][arr[j]].replace('/','-'))
									}
								}
							}
						}
					}else{
						this.$alert(res.message, '提示', {
			                confirmButtonText: '确定'
			            });
					}
	    		})
			}
	    },
	    watch:{
	    	isObjType(newVal,oldVal){
	    		this.isObjType = newVal
	    	}
	    }
  	};
</script>
<style lang="scss">
#accountSpecialReport{
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
			color: #909191!important;
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
	.el-table{
		width:calc(100% - 90px)!important;;
		margin-bottom:25px;
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
	.el-form-item__label::before{
		content:'*';
		color:#F56C6C;
		margin-right:4px
	}
	.el-form-item__label{
		float:left;
		width:190px;
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
	.asdetail{
		textarea{
			height:75px;
			resize:none;
		}
		.el-form-item .el-form-item__content{
			width:calc(100% - 190px);
			display:inline-block;
			vertical-align:top;
		}
		.commonBtn{
			float: right;
		}
	}
	.newTable{
		.el-form-item__content{
			position:static
		}
		.el-table{
			width:calc(80% + 190px)!important
		}
		.el-table,.el-table td, .el-table th,.el-table__body-wrapper{
			position:static
		}
		.commonBtn{
			position: absolute;
			right:10px;
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
	.el-upload--text{
		float: none;
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
		width:60%;
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
	.insselect-tree .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
	    height: auto;
	    max-height: 274px;
	    overflow:visible !important;
	    background:#000
    }
    .insselect-tree .el-tree-node__label{
		font-weight: normal
    }
	.punishLabel{
		position: relative;
		.commonBtn{
			position: absolute;
			right:0;
			top:0;
			margin-right:0
		}
	}
	.add{
		.commonBtn{
			position: static!important
		}
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
	.el-icon-document:before{
		content:"\E77D";
 		-webkit-text-fill-color:#000;
 		-webkit-text-stroke: 0 #000;
	}
	.accountSearch .el-form-item__content{
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
	.accountSearch .el-select{
		width:calc(100% - 50px)!important;
	}
	.accountSearch .el-icon-search:before{
		color:#606266
	}
	.el-upload{
		.commonBtn{
			width:auto;
			padding:0 10px
		}
	}
}	

</style>
