<template>
  	<el-container id="punishSpecialReportCX">
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
			  	<el-step title="整改情况"></el-step>
			  	<el-step title="问责情况"></el-step>
			</el-steps>
			<!-- 第一步 -->
			<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" v-if="active == 0" class="firstForm addStar el-form1">
				<el-row>
			        <el-col :span="12">
						<el-form-item label="处罚类型">
						    <el-select v-model="punishType.region" @change="((val)=>{getInputData(val,'punishType','base')})" placeholder="请选择处罚类型" :disabled="isDisabled[0]">
								<el-option v-for="item in punishType.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>		
						</el-form-item>
			        </el-col>
					<el-col :span="12" class="punishLabel">
						<el-form-item label="监管处罚决定书落款时间">
						    <el-date-picker type="date" @change="getlkDate" placeholder="选择日期" v-model="infoSpecial.base.lkDate" :picker-options="starDatePicker" :disabled="isDisabled[0]"></el-date-picker>
						</el-form-item>
			        </el-col>
			    </el-row>
				<el-row v-if="punishType.region == '' || punishType.region == '1'">
			        <el-col :span="12">
						<el-form-item label="处罚来源">
						    <el-select v-model="infoSpecial.base.punishSource" @change="((val)=>{getInputData(val,'punishSource','base')})" placeholder="请选择处罚来源" :disabled="isDisabled[0]">
								<el-option v-for="item in punishData.punishSource" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>		
						</el-form-item>
			        </el-col>
					<el-col :span="12" class="punishLabel" v-if="this.infoSpecial.base.punishSource !== '3'">
						<el-form-item class="max">
							<span slot="label">已&nbsp;&nbsp;关&nbsp;&nbsp;联&nbsp;&nbsp;的&nbsp;&nbsp;行&nbsp;&nbsp;政&nbsp;&nbsp;处&nbsp;&nbsp;罚事先告知书名称</span>
						    <el-input v-model="infoSpecial.base.sourceName" placeholder="已关联的行政处罚事先告知书名称" disabled></el-input>
						</el-form-item>
						<el-button type="primary" size="mini" class="commonBtn" @click="goConnect(2)" :disabled="isDisabled[0]">关联</el-button>
			        </el-col>
			    </el-row>
				<el-row v-if="punishType.region && punishType.region !== '1'">
			        <el-col :span="12">
						<el-form-item label="检查类型">
						    <el-select v-model="infoSpecial.base.punishSource" @change="((val)=>{getInputData(val,'punishSource','base')})" placeholder="请选择检查类型" :disabled="isDisabled[0]">
								<el-option v-for="item in punishData.superviseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>		
						</el-form-item>
			        </el-col>
					<el-col :span="12" class="punishLabel">
						<el-form-item label="已关联的监管检查事项名称">
						    <el-input v-model="infoSpecial.base.sourceName" placeholder="已关联的监管检查事项名称" disabled></el-input>
						</el-form-item>
						<el-button type="primary" size="mini" class="commonBtn" @click="goConnect(1)" :disabled="isDisabled[0]">关联</el-button>
			        </el-col>
			    </el-row>
			    <el-form-item label="处罚概述" class="punishWidth">
	        		<el-input type="textarea" v-model="infoSpecial.base.overView" placeholder="至少包含处罚主体，具体被处罚机构和处罚事由概述信息" @change="((val)=>{getInputData(val,'overView','base')})" :disabled="isDisabled[0]" :maxlength="maxLen" :rows="2" @keydown.native="textareaChange($event)"></el-input>
				</el-form-item>
				<el-form-item label="处罚事由" class="punishWidth">
	        		<el-input type="textarea" v-model="infoSpecial.base.cause" placeholder="请输入处罚事由" @change="((val)=>{getInputData(val,'cause','base')})" :disabled="isDisabled[0]" :maxlength="maxLen" :rows="2" @keydown.native="textareaChange($event)"></el-input>
				</el-form-item>
				<el-row>
			        <el-col :span="12">
						<el-form-item label="实施主体类型">
						    <el-select v-model="subject.region" @change="((val)=>{getInputData(val,'subjectType','base')})" placeholder="请选择实施主体类型" :disabled="isDisabled[0]">
								<el-option v-for="item in subject.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>		
						</el-form-item>
			        </el-col>
					<el-col :span="12" class="punishLabel">
						<el-form-item label="实施主体名称">
			        		<el-input v-model="infoSpecial.base.name" placeholder="请输入实施主体名称" @change="((val)=>{getInputData(val,'name','base')})" :disabled="isDisabled[0]" maxlength="50"></el-input>
						</el-form-item>
			        </el-col>
			    </el-row>
				<el-row>
			        <el-col :span="12">
						<el-form-item label="险种">
							<el-select multiple v-model="infoSpecial.base.insuranceType" placeholder="请选择险种" :disabled="isDisabled[0]" @change="((val)=>{getInputData(val,'insuranceType','base')})">
								<el-option v-for="item in insureList" :label="item.name" :value="item.id" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
			        </el-col>
					<el-col :span="12" class="punishLabel">
						<el-form-item class="noStar">
			        		<el-input v-model="infoSpecial.base.otherInsurance" placeholder="请输入其他险种" @change="((val)=>{getInputData(val,'otherInsurance','base')})" :disabled="isDisabled[0]" maxlength="50" v-if="infoSpecial.base.insuranceType&&infoSpecial.base.insuranceType.indexOf('9')>=0"></el-input>
						</el-form-item>
			        </el-col>
			    </el-row>
	      	</el-form>
	      	<!-- 第三步 -->
	      	<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" v-if="active == 1" align="center">
				<el-form-item label="是否整改">
					<el-radio-group v-model="infoSpecial.abarbeitung.type" @change="((val)=>{getInputData(val,'type','abarbeitung')})" :disabled="isDisabled[1]">
					    <el-radio label="1">是</el-radio>
					    <el-radio label="0">否</el-radio>
					</el-radio-group>		
				</el-form-item>
				<el-form-item label="整改情况">
	        		<el-input type="textarea" v-model="infoSpecial.abarbeitung.description" placeholder="请输入整改情况" @change="((val)=>{getInputData(val,'description','abarbeitung')})" maxlength="500" :disabled="isDisabled[1]"></el-input>
				</el-form-item>
				<el-form-item label="附件">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],1)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[1]">
						<el-button type="primary" size="mini" class="commonBtn" @click="curRowIndex=active" :disabled="isDisabled[1]">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
	      	</el-form>
	      	<!-- 第四步 -->
	      	<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" v-if="active == 2" class="firstForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="是否问责">
							<el-radio-group v-model="infoSpecial.duty.type" @change="((val)=>{getInputData(val,'type','duty')})" :disabled="isDisabled[2]">
								<el-radio label="1">是</el-radio>
								<el-radio label="0">否</el-radio>
							</el-radio-group>	
						</el-form-item>
					</el-col>
			        <el-col :span="24">
						<el-form-item label="问责情况" class="punishText">
							<el-input type="textarea" v-model="infoSpecial.duty.description" placeholder="请输入问责情况" @change="((val)=>{getInputData(val,'description','duty')})" maxlength="500" :disabled="isDisabled[2]"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="问责对象">
							<el-select v-model="infoSpecial.duty.wzType" placeholder="请选择问责对象" :disabled="isDisabled[2]" @change="((val)=>{getInputData(val,'wzType','duty')})">
								<el-option v-for="item in punishData.wzType" :label="item.name" :value="item.id" :key="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="infoSpecial.duty.wzType!=='2'">
						<el-form-item label="直接责任人" class="punishText">
							<el-table :data="infoSpecial.duty.wzPersonMaster" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" :header-cell-class-name="redStar">
								<el-table-column prop="n" label="姓名" align="center">
									<template slot-scope="scope">
										<el-input v-model="scope.row.n" placeholder="请输入姓名" @change="((val)=>{getTableData(val,scope.$index,'n','wzPersonMaster')})" :disabled="scope.row.isDisabled"></el-input>
									</template>
								</el-table-column>
								<el-table-column prop="x" label="性别" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.x" @change="((val)=>{getTableData(val,scope.$index,'x','wzPersonMaster')})" :disabled="scope.row.isDisabled" placeholder="请选择">
											<el-option v-for="item in sexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>		
									</template>
								</el-table-column>
								<el-table-column prop="org" label="所在机构" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.orgName" placeholder="请选择所在机构" :disabled="scope.row.isDisabled" :ref="searchSelect+3+scope.$index" @focus="((val)=>{selectFoucus(val,scope.$index,'',3)})" @visible-change="visibleChange">
											<el-option :value="scope.row.orgName" style="height:auto;background:#FFF">
												<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,scope.$index,'',3)})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
											</el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="job" label="职务" align="center">
									<template slot-scope="scope">
										<el-input v-model="scope.row.job" placeholder="请输入职务" @change="((val)=>{getTableData(val,scope.$index,'job','wzPersonMaster')})" :disabled="scope.row.isDisabled"></el-input>
									</template>
								</el-table-column>
								<el-table-column prop="pts" label="政治面貌" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.pts" placeholder="请输入纪律处分" @change="((val)=>{getTableData(val,scope.$index,'pts','wzPersonMaster')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.policyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="jl" label="纪律处分" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.jl" placeholder="请输入纪律处分" @change="((val)=>{getTableData(val,scope.$index,'jl','wzPersonMaster')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.jlType" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="zz" label="组织处理" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.zz" placeholder="请输入组织处理" @change="((val)=>{getTableData(val,scope.$index,'zz','wzPersonMaster')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.zzType" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="jj" label="经济处分" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.jj" placeholder="请输入经济处分" @change="((val)=>{getTableData(val,scope.$index,'jj','wzPersonMaster')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.jjType" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="amt" label="经济处分金额（元）" align="center" width="150">
									<template slot-scope="scope">
										<el-input @keydown.native="checkInput($event)" type="number" v-model="scope.row.amt" placeholder="请输入经济处分金额" @change="((val)=>{getTableData(val,scope.$index,'amt','wzPersonMaster')})" :disabled="scope.row.isDisabled" @input="((val)=>{getInput(val,scope.$index,scope.row,'amt','wzPersonMaster')})"></el-input>
										<el-button type="primary" size="mini" class="commonBtn" @click="goAdd('',4)" v-if="scope.$index == 0" :disabled="isDisabled[2]">添加</el-button>
										<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(scope.$index,'',4)" v-if="scope.$index !== 0" :disabled="scope.row.isDisabled">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="infoSpecial.duty.wzType!=='1'">
						<el-form-item label="间接责任人" class="punishText">
							<el-table :data="infoSpecial.duty.wzPersonIndirect" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" :header-cell-class-name="redStar">
								<el-table-column prop="n" label="姓名" align="center">
									<template slot-scope="scope">
										<el-input v-model="scope.row.n" placeholder="请输入姓名" @change="((val)=>{getTableData(val,scope.$index,'n','wzPersonIndirect')})" :disabled="scope.row.isDisabled"></el-input>
									</template>
								</el-table-column>
								<el-table-column prop="x" label="性别" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.x" @change="((val)=>{getTableData(val,scope.$index,'x','wzPersonIndirect')})" :disabled="scope.row.isDisabled" placeholder="请选择">
											<el-option v-for="item in sexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>		
									</template>
								</el-table-column>
								<el-table-column prop="org" label="所在机构" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.orgName" placeholder="请选择所在机构" :disabled="scope.row.isDisabled" :ref="searchSelect+4+scope.$index" @focus="((val)=>{selectFoucus(val,scope.$index,'',4)})" @visible-change="visibleChange">
											<el-option :value="scope.row.orgName" style="height:auto;background:#FFF">
												<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,scope.$index,'',4)})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
											</el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="job" label="职务" align="center">
									<template slot-scope="scope">
										<el-input v-model="scope.row.job" placeholder="请输入职务" @change="((val)=>{getTableData(val,scope.$index,'job','wzPersonIndirect')})" :disabled="scope.row.isDisabled"></el-input>
									</template>
								</el-table-column>
								<el-table-column prop="pts" label="政治面貌" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.pts" placeholder="请输入纪律处分" @change="((val)=>{getTableData(val,scope.$index,'pts','wzPersonIndirect')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.policyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="jl" label="纪律处分" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.jl" placeholder="请输入纪律处分" @change="((val)=>{getTableData(val,scope.$index,'jl','wzPersonIndirect')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.jlType" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="zz" label="组织处理" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.zz" placeholder="请输入组织处理" @change="((val)=>{getTableData(val,scope.$index,'zz','wzPersonIndirect')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.zzType" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="jj" label="经济处分" align="center">
									<template slot-scope="scope">
										<el-select v-model="scope.row.jj" placeholder="请输入经济处分" @change="((val)=>{getTableData(val,scope.$index,'jj','wzPersonIndirect')})" :disabled="scope.row.isDisabled">
											<el-option v-for="item in punishData.jjType" :key="item.id" :label="item.name" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="amt" label="经济处分金额（元）" align="center" width="150">
									<template slot-scope="scope">
										<el-input @keydown.native="checkInput($event)" type="number" v-model="scope.row.amt" placeholder="请输入经济处分金额" @change="((val)=>{getTableData(val,scope.$index,'amt','wzPersonIndirect')})" :disabled="scope.row.isDisabled" @input="((val)=>{getInput(val,scope.$index,scope.row,'amt','wzPersonIndirect')})"></el-input>
										<el-button type="primary" size="mini" class="commonBtn" @click="goAdd('',5)" v-if="scope.$index == 0" :disabled="isDisabled[2]">添加</el-button>
										<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(scope.$index,'',5)" v-if="scope.$index !== 0" :disabled="scope.row.isDisabled">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-form-item label="附件">
					<el-upload class="upload-demo" action="" ref="upload" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="function(file,fileList){return handleRemove(file,evidenceFiles[active],2)}" :beforeUpload="beforeAvatarUpload" accept=".doc,.docx,.pdf,.Excel,.xls,.xlsx,.rar,.zip" :file-list="evidenceFiles[active]" :disabled="isDisabled[2]">
						<el-button type="primary" size="mini" class="commonBtn" @click="curRowIndex=active" :disabled="isDisabled[2]">上传附件</el-button>
						<div slot="tip" class="el-upload__tip">
							<span>附件：</span>
							<p>1.支持扩展名：doc、docx、pdf、xls、xlsx、rar、zip<br>2.如果附件大小在10M以内，可以上传源文件，系统支持在线预览<br>3.如果附件大小超过10M，请上传压缩包，系统支持下载</p>
						</div>
					</el-upload>
				</el-form-item>
	      	</el-form>
	      	<el-row v-if="active !== 0">
		  		<el-col :span="24" align="center">
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goPrevious" v-if="active!==0">返回修改</el-button>
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goNext" v-if="active!==2">下一步</el-button>
		  		</el-col>
		  	</el-row>
		</div>
		<div class="contList newHeight" v-for="(penalize,index) in infoSpecial.base.penalizeFile" :key="index" v-if="active == 0">
			<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" v-if="active == 0" class="firstForm addStar">
				<el-row>
			        <el-col :span="12">
						<el-form-item label="监管处罚文件编号">
			        		<el-input v-model="penalize.fileNo" placeholder="请输入监管处罚文件编号" @change="((val)=>{getfileNo(val,index)})" :disabled="penalize.isDisabled"></el-input>
						</el-form-item>
			        </el-col>
			        <el-col :span="12" class="punishLabel">
						<el-form-item label="处罚对象">
			        		<el-select v-model="penalize.cfType" @change="((val)=>{changecfType(val, index)})" placeholder="请选择处罚对象" :disabled="penalize.isDisabled">
								<el-option v-for="item in cfType.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-button type="primary" size="mini" class="commonBtn" @click="goAdd('',1)" v-if="index == 0" :disabled="isDisabled[0]">添加</el-button>
						<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(index,'',1)" v-if="index !== 0" :disabled="penalize.isDisabled">删除</el-button>
			        </el-col>
			    </el-row>
			    <div v-for="(item,oindex) in penalize.orgMap" :key="item.id" v-if="penalize.cfType !== '2'">
			    	<el-row>
				        <el-col :span="12">
							<el-form-item label="被处罚机构" class="searchBtn">
							    <el-select v-model="item.orgName" placeholder="请选择被处罚机构" :disabled="item.isDisabled" filterable :filter-method="((val)=>{keyFilter(val,oindex,index,1)})" :ref="searchSelect+1+oindex+index" @focus="((val)=>{selectFoucus(val,oindex,index,1)})" @visible-change="visibleChange">
									<el-option :value="item.orgName" style="height:auto;background:#FFF">
										<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,oindex,index,1)})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
									</el-option>
								</el-select>
								<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(oindex,index,1)" :disabled="isDisabled[0]"></el-button>		
							</el-form-item>
				        </el-col>
						<el-col :span="12" class="punishLabel">
							<el-form-item label="处罚金额（万元）">
				        		<el-input @keydown.native="checkInput($event)" type="number" v-model="item.amt" placeholder="请输入处罚金额" @change="((val)=>{getpAmt(val,oindex,index)})" :disabled="item.isDisabled"></el-input>
							</el-form-item>
							<el-button type="primary" size="mini" class="commonBtn" @click="goAdd(index,2)" v-if="oindex == 0" :disabled="isDisabled[0]">添加</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(oindex,index,2)" v-if="oindex !== 0" :disabled="item.isDisabled">删除</el-button>
				        </el-col>
			        </el-row>
			        <el-row>
				        <el-col :span="12" class="noStar">
							<el-form-item label="其他机构处罚措施">
							    <el-select v-model="item.orgcs" @change="((val)=>{changeorgCs(val,oindex,index)})" placeholder="请选择其他机构处罚措施" :disabled="item.isDisabled">
									<el-option v-for="item in orgCs.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>	
							</el-form-item>
				        </el-col>
			        </el-row>
			        <el-row>
				        <el-col :span="24" class="noStar">
							<el-form-item label="  " class="punishText">
				        		<el-input type="textarea" v-model="item.orgdes" placeholder="请输入详细描述" @change="((val)=>{getorgDescription(val,oindex,index)})" :disabled="item.isDisabled" maxlength="500"></el-input>
							</el-form-item>
				        </el-col>
			        </el-row>
			    </div>
				<div v-for="(item,pindex) in penalize.personMap" :key="item.id" v-if="penalize.cfType !== '1'">
					<el-row>
				        <el-col :span="12">
							<el-form-item label="被处罚个人">
				        		<el-input v-model="item.name" placeholder="请输入被处罚个人名称" @change="((val)=>{getpersonName(val, pindex,index)})" :disabled="item.isDisabled"></el-input>
							</el-form-item>
				        </el-col>
						<el-col :span="12" class="punishLabel">
							<el-form-item label="所属机构" class="searchBtn">
							    <el-select v-model="item.orgName" placeholder="请选择被处罚个人隶属机构" :disabled="item.isDisabled" filterable :filter-method="((val)=>{keyFilter(val,pindex,index,2)})" :ref="searchSelect+2+pindex+index" @focus="((val)=>{selectFoucus(val,pindex,index,2)})" @visible-change="visibleChange">
									<el-option :value="item.orgName" style="height:auto;background:#FFF">
										<el-tree :data="treeData" :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="((val)=>{handleNodeClick(val,pindex,index,2)})" :load="loadNode" lazy node-key="id" :filter-node-method="filterNode"></el-tree>
									</el-option>
								</el-select>
								<el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg(pindex,index,2)" :disabled="isDisabled[0]"></el-button>		
							</el-form-item>
							<el-button type="primary" size="mini" class="commonBtn" @click="goAdd(index,3)" v-if="pindex == 0" :disabled="isDisabled[0]">添加</el-button>
							<el-button type="primary" size="mini" class="commonBtn" @click="goMinus(pindex,index,3)" v-if="pindex !== 0" :disabled="item.isDisabled">删除</el-button>
				        </el-col>
			        </el-row>
			        <el-row>
						<el-col :span="12">
							<el-form-item label="处罚金额（万元）">
				        		<el-input @keydown.native="checkInput($event)" type="number" v-model="item.amt" placeholder="请输入处罚金额" @change="((val)=>{getpersonAmt(val,pindex,index)})" :disabled="item.isDisabled"></el-input>
							</el-form-item>
				        </el-col>
				        <el-col :span="12">
							<el-form-item label="其他个人处罚措施" class="punishLabel noStar">
							    <el-select v-model="item.pcs" @change="((val)=>{changepersonCs(val,pindex,index)})" placeholder="请选择其他个人处罚措施" :disabled="item.isDisabled">
									<el-option v-for="item in personCs.unitsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>		
							</el-form-item>
				        </el-col>
			        </el-row>
			        <el-row>
				        <el-col :span="24" class="noStar">
							<el-form-item label=" " class="punishText">		
								<el-input type="textarea" v-model="item.pdes" placeholder="请输入详细描述" @change="((val)=>{getpersonDescription(val,pindex,index)})" :disabled="item.isDisabled" maxlength="500"></el-input>
							</el-form-item>
				        </el-col>
			        </el-row>
			    </div>
	      	</el-form>
		</div>
		<div class="contList" v-if="active == 0" style="padding-top:30px">
			<el-form ref="infoSpecial" :model="infoSpecial" :inline="true" v-if="active == 0" class="firstForm addStar el-form1">
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
	      	<el-row>
		  		<el-col :span="24" align="center">
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goPrevious" v-if="active!==0">返回修改</el-button>
	      			<el-button type="primary" size="mini" class="commonBtn" @click="goNext" v-if="active!==2">下一步</el-button>
		  		</el-col>
		  	</el-row>
		</div>
		<org-search :searchResult="searchResult" :chooseType="1" v-if="isShow" @closeMask="closeMaskTable"></org-search>
		<punish-notice :noticeType="noticeType" v-if="isNotice" @closeMask="closePunishNotice"></punish-notice>
  	</el-container>
  	</el-container>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate,fileTypeDiffer,fomatFloat} from 'src/utils/utils.js'
	import orgSearch from 'src/components/infoManage/orgSearch'
	import punishNotice from 'src/components/infoManage/punishNotice'
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
	  		var checklkDate = (rule, value, callback) => {
	  			if (value === '') {
		          	callback(new Error('事件发生时间不能为空'));
		        }
	  		};
	        return {
	        	active: 0,
	          	titMsg:"新建监管处罚信息",
	          	isDisabled:[false,false,false],
	          	curRowIndex:'',
	          	maxLen:500,
	          	//查询数据
	          	checkData:{
	          		base:{},
	          		duty:{},
	          		abarbeitung:{},
	          	},
	          	infoSpecial:{
	          		base:{
	          			cause:'',//检查事项
	          			overView:'',//处罚概述
				        name:'',//实施主体
				        orgDescription:'',//其他机构处罚描述
				        personDescription:'',//其他个人处罚措施描述
				        org:'',
				        orgId:'',
				        amt:'',
				        lkDate:'',
				        penalizeFile:[{
				        	fileNo:null,//检查事项
				        	cfType:null,
				        	orgMap:[{
					        	org:null,
					        	orgName:'',
					        	amt:null,
					        	orgcs:null,
					        	orgdes:null,
					        }],
					        personMap:[{
					        	name:null,
					        	org:null,
					        	orgName:'',
					        	amt:null,
					        	pcs:null,
					        	pdes:null,
					        }],
				        }],
				        personName:'',
				        personAmt:'',
						insuranceType:"",
						otherInsurance:"",
						punishSource:"",
						sourceName:"",
	          		},
	          		abarbeitung:{
	          			type:'',
	          			description:''
	          		},
	          		duty:{
	          			type:'',
	          			description:'',
						wzType:'',
						wzPersonMaster:[{
				        	n:null,
			    			x:null,
							org:null,
							job:null,
							pts:null,
							jl:null,
							zz:null,
							jj:null,
							amt:null
				        }],
						wzPersonIndirect:[{
				        	n:null,
			    			x:null,
							org:null,
							job:null,
							pts:null,
							jl:null,
							zz:null,
							jj:null,
							amt:null
				        }]
	          		}
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
			          	id:'4'
			        },{
			          	name:'其他',
			          	id:'5'
			        }]
		        },
		        // 处罚类型
		        punishType:{
			       	region: '',
			       	unitsData:[{
			          	name:'行政处罚',
			          	id:'1'
			        },{
			          	name:'监管函',
			          	id:'2'
			        },{
			          	name:'行政监管措施',
			          	id:'6'
			        },{
			          	name:'监管意见书',
			          	id:'3'
			        },{
			          	name:'监管提示函',
			          	id:'4'
			        },{
			          	name:'其他',
			          	id:'5'
			        }]
		        },
		        //其他机构处罚措施
		        orgCs:{
			       	region: '',
			       	unitsData:[{
			          	name:'没收违法所得',
			          	id:'1'
			        },{
			          	name:'责令停业整顿',
			          	id:'2'
			        },{
			          	name:'吊销金融（业务）许可证',
			          	id:'3'
			        },{
			          	name:'限制保险业机构业务范围',
			          	id:'4'
			        },{
			          	name:'责令保险业机构停止接收新业务',
			          	id:'5'
			        },{
			          	name:'其他',
			          	id:'7'
			        }]
		        },
		        //其他个人处罚措施
		        personCs:{
			       	region: '',
			       	unitsData:[{
			          	name:'警告',
			          	id:'1'
			        },{
			          	name:'没收违法所得',
			          	id:'2'
			        },{
			          	name:'取消（撤销）任职资格',
			          	id:'3'
			        },{
			          	name:'禁止从事银行业工作或者禁止进入保险业',
			          	id:'4'
			        },{
			          	name:'其他',
			          	id:'5'
			        }]
		        },
		        // 处罚对象
		        cfType:{
			       	region: '',
			       	unitsData:[{
			          	name:'处罚机构',
			          	id:'1'
			        },{
			          	name:'处罚个人',
			          	id:'2'
			        },{
			          	name:'处罚机构和个人',
			          	id:'3'
			        }]
		        },
		        starDatePicker:{
	  				disabledDate: (time) => {
		            	return time.getTime() > Date.now()
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
		       	seriousRiskFiles:[],
		       	companyList:{},
		       	rules:{
		       		name: [
	  					{validator: checkName, trigger: 'blur' }
	  				],
	  				lkDate: [
	  					{validator: checklkDate, trigger: 'blur' }
	  				],
		       	},
		        supervisePath:false,
		        defaultOrgMap:[{
  					org:null,
	    			orgName:'',
	    			amt:null,
	    			orgcs:null,
				    orgdes:null,
  				}],
  				defaultPersonMap:[{
  					name:null,
  					org:null,
				    orgName:'',
					amt:null,
					pcs:null,
				    pdes:null,
  				}],
  				isShow:false,
  				searchResult:'',
  				visible:false,
  				searchSelect:'searchSelect',
  				treeData:[],
				isNotice: false,
				requireList:{
					punishType:"处罚类型",
					lkDate:"监管处罚决定书落款时间",
					overView:"处罚概述",
					cause:"处罚事由",
					subjectType:"实施主体类型",
					name:"实施主体名称",
					insuranceType:"险种",
					punishSource:"处罚来源",
					punishSource1:"检查类型",
					sourceId:"已关联的行政处罚事先告知书",
					sourceId1:"已关联的监管检查事项",
				},
				noticeType:2,
				sexList:[{
		          	name:'男',
		          	id:'1'
		        },{
		          	name:'女',
		          	id:'2'
		        }],
			}
	   	},
	    created(){
	    	// 编辑页面
	    	if(this.$route.query.flag == 0 || this.$route.query.flag == 2 || this.$route.query.flag == 3){
	    		this.titMsg = "编辑监管处罚信息"
	    		this.getInfo()
	    	} else if(this.$route.query.flag == 1){
	    		this.active = parseInt(this.$route.query.step)
	    		this.titMsg = "维护监管处罚信息"
	    		this.isDisabled[0] = true
	    		this.getInfo()
	    	}
	    	this.connectAxios('1_01','','','1')
	    },
	    components:{
	    	orgSearch,
			punishNotice
	    },
		computed:{
			...mapState(['insureList','rTypeList','subjectList','punishData'])
		},
	    methods:{
			redStar(obj){
				if(obj.columnIndex == 0 || obj.columnIndex == 1 || obj.columnIndex == 2 || obj.columnIndex == 3 || obj.columnIndex == 4) {
					return 'redStar';
				}
			},
	    	// 步骤
	    	goNext(){
	    		if (this.active++ > 2) this.active = 2;
	    	},
	    	goPrevious(){
	    		this.active--
	    	},
	    	handleNodeClick(node,oindex,index,type) {
	    		if(node.disabled!=true){
					switch (type){
						case 1:
							this.infoSpecial.base.penalizeFile[index].orgMap[oindex].orgName = node.name
							this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
							if(node.groupId!==''){
								this.infoSpecial.base.penalizeFile[index].orgMap[oindex].org = node.groupId
							} else{
								delete this.infoSpecial.base.penalizeFile[index].orgMap[oindex].org
							}
							break;
						case 2:
							this.infoSpecial.base.penalizeFile[index].personMap[oindex].orgName = node.name
							this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
							if(node.groupId!==''){
								this.infoSpecial.base.penalizeFile[index].personMap[oindex].org = node.groupId
							} else{
								delete this.infoSpecial.base.penalizeFile[index].personMap[oindex].org
							}
							break;
						case 3:
							this.$set(this.infoSpecial.duty.wzPersonMaster[oindex],'orgName',node.name)
							this.checkData.duty.wzPersonMaster = this.infoSpecial.duty.wzPersonMaster
							if(node.groupId!==''){
								this.$set(this.checkData.duty.wzPersonMaster[oindex],'org',node.groupId)
							} else{
								delete this.checkData.duty.wzPersonMaster[oindex].org
							}
							break;
						case 4:
							this.$set(this.infoSpecial.duty.wzPersonIndirect[oindex],'orgName',node.name)
							this.checkData.duty.wzPersonIndirect = this.infoSpecial.duty.wzPersonIndirect
							if(node.groupId!==''){
								this.$set(this.checkData.duty.wzPersonIndirect[oindex],'org',node.groupId)
							} else{
								delete this.checkData.duty.wzPersonIndirect[oindex].org
							}
							break;
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
		        this.axios.post('/rmUser/cxGroupName', params).then((res)=>{
		        	var arr = []
	                if(res.data != null){
			          	for (var i = 0; i < res.data.length; i++) {
			           	var obj = new Object;
			           	obj.name = res.data[i].name;
			           	obj.groupId = res.data[i].groupId;
			           	if(res.notCheck != null){
			           		for (var j = 0; j < res.notCheck.length; j++){
			           			if(res.notCheck[j] == res.data[i].groupId){
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
			getInputData(val,name,type){
	    		if(val == ''){
	    			delete this.checkData[type][name]
	    		} else{
					this.$set(this.checkData[type],name,val)
				}
				if(name=="punishType"){
					this.infoSpecial.base.punishSource = ""
				}
	    	},
	  		getfileNo(val,index){
	  			this.infoSpecial.base.penalizeFile[index].fileNo = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
	  		},
	    	// 处罚对象
	    	changecfType(val,index){
	    		this.infoSpecial.base.penalizeFile[index].cfType = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
	    	},
	    	//检查开始时间
	    	getlkDate(val){
	    		if(val !== null){
	    			this.checkData.base.lkDate = formatDate(val,'yyyyMMdd');
		  			this.checkData.base.lkDate = this.checkData.base.lkDate.split('-').join('')
	    		} else{
	    			delete this.checkData.base.lkDate
	    		}
	    	},
	    	getpAmt(val,oindex,index){
	    		this.infoSpecial.base.penalizeFile[index].orgMap[oindex].amt = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
	    	},
	    	changeorgCs(val,oindex,index){
	    		this.infoSpecial.base.penalizeFile[index].orgMap[oindex].orgcs = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
	    	},
	    	changepersonCs(val,pindex,index){
	    		this.infoSpecial.base.penalizeFile[index].personMap[pindex].pcs = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
	    	},
	    	getorgDescription(val,oindex,index){
	    		this.infoSpecial.base.penalizeFile[index].orgMap[oindex].orgdes = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
	  		},
	  		getpersonDescription(val,pindex,index){
	  			this.infoSpecial.base.penalizeFile[index].personMap[pindex].pdes = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
	  		},
			getpersonName(val,pindex,index){
				this.infoSpecial.base.penalizeFile[index].personMap[pindex].name = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
			},
			getpersonAmt(val,pindex,index){
				this.infoSpecial.base.penalizeFile[index].personMap[pindex].amt = val
	    		this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
			}, 
			getTableData(val,index,name,type){
	    		this.$set(this.infoSpecial.duty[type][index],name,val)
	    		this.checkData.duty[type] = this.infoSpecial.duty[type]
	    		this.checkData.duty[type][index][name] = this.infoSpecial.duty[type][index][name]
	    	},
		    // 返回
	    	goback(){
	    		if(this.$route.query.flag == 3){
	    			this.$router.push({
			    		path:'punishSeasonReportCX',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				            id: this.$route.query.id
			            }
			    	})
	    		} else if(this.supervisePath == true){
	    			this.$router.push({
			    		path: 'superviseSpecialReportCX',
			    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
			              	infoId:this.$route.query.superviseId,
				            flag:1,
				            step:1,
				            id: this.$route.query.id
			            }
			    	})
	    		} else{
	    			sessionStorage.setItem('punishPath',this.$route.query.flag)
		    		this.$router.push({
			    		path:'/infoManage/infoManageSend/punish/punishSend',
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
				form.append('type',702)
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
							this.checkData.abarbeitung.attachment = this.evidenceFiles[this.curRowIndex]
						} else if(this.curRowIndex == 2){
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
						this.checkData.abarbeitung.attachment = this.evidenceFiles[type]
					} else{
						delete this.checkData.abarbeitung.attachment
					}
				} else if(type == 2){
					if(this.evidenceFiles[type].length>0){
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
				var requireArr = ["punishType","lkDate","punishSource","sourceId","overView","cause","subjectType","name","insuranceType"]
				for(var i = 0;i<requireArr.length;i++){
					if(this.checkData.base[requireArr[i]]==undefined){
						if(requireArr[i] == 'punishSource'||requireArr[i] == 'sourceId'){
							if(this.checkData.base.punishType && this.checkData.base.punishType !== '1'){
								this.$alert(this.requireList[requireArr[i]+'1']+'不能为空', '提示', {
									confirmButtonText: '确定'
								});
								return;
							}
						} else{
							this.$alert(this.requireList[requireArr[i]]+'不能为空', '提示', {
								confirmButtonText: '确定'
							});
							return;
						}
					}
				}
    			if(this.checkData.base.penalizeFile != undefined){
    				for(var m = 0;m<this.checkData.base.penalizeFile.length;m++){
	    				if(this.checkData.base.penalizeFile[m].fileNo == null){
		    				this.$alert('监管处罚文件编号不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			}
		    			if(this.checkData.base.penalizeFile[m].cfType == null){
		    				this.$alert('处罚对象不能为空', '提示', {
					        	confirmButtonText: '确定'
					        });
					        return
		    			} else if(this.checkData.base.penalizeFile[m].cfType == '1'){
		    				delete this.checkData.base.penalizeFile[m].personMap
		    				if(this.checkData.base.penalizeFile[m].orgMap != undefined){
								for(var i = 0;i<this.checkData.base.penalizeFile[m].orgMap.length;i++){
									if(this.checkData.base.penalizeFile[m].orgMap[i].org == null){
										this.$alert('被处罚机构不正确', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
									if(this.checkData.base.penalizeFile[m].orgMap[i].amt == null){
										this.$alert('处罚金额不能为空', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
								}
							} else{
								this.$alert('被处罚机构不能为空', '提示', {
						        	confirmButtonText: '确定'
						        });
						        return
							}
		    			} else if(this.checkData.base.penalizeFile[m].cfType == '2'){
		    				delete this.checkData.base.penalizeFile[m].orgMap
		    				if(this.checkData.base.penalizeFile[m].personMap != undefined){
								for(var i = 0;i<this.checkData.base.penalizeFile[m].personMap.length;i++){
									if(this.checkData.base.penalizeFile[m].personMap[i].name == null){
										this.$alert('被处罚个人不能为空', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
									if(this.checkData.base.penalizeFile[m].personMap[i].org == null){
										this.$alert('所属机构不正确', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
									if(this.checkData.base.penalizeFile[m].personMap[i].amt == null){
										this.$alert('处罚金额不能为空', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
								}
							} else{
								this.$alert('被处罚个人、处罚金额不能为空', '提示', {
						        	confirmButtonText: '确定'
						        });
						        return
							}
		    			} else {
		    				if(this.checkData.base.penalizeFile[m].orgMap != undefined){
								for(var i = 0;i<this.checkData.base.penalizeFile[m].orgMap.length;i++){
									if(this.checkData.base.penalizeFile[m].orgMap[i].org == null){
										this.$alert('被处罚机构不正确', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
									if(this.checkData.base.penalizeFile[m].orgMap[i].amt == null){
										this.$alert('处罚金额不能为空', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
								}
							} else{
								this.$alert('被处罚机构不能为空', '提示', {
						        	confirmButtonText: '确定'
						        });
						        return
							}
							if(this.checkData.base.penalizeFile[m].personMap != undefined){
								for(var i = 0;i<this.checkData.base.penalizeFile[m].personMap.length;i++){
									if(this.checkData.base.penalizeFile[m].personMap[i].name == null){
										this.$alert('被处罚个人不能为空', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
									if(this.checkData.base.penalizeFile[m].personMap[i].org == null){
										this.$alert('所属机构不正确', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
									if(this.checkData.base.penalizeFile[m].personMap[i].amt == null){
										this.$alert('处罚金额不能为空', '提示', {
								          confirmButtonText: '确定'
								        });
								        return
									}
								}
							} else{
								this.$alert('被处罚个人、处罚金额不能为空', '提示', {
						        	confirmButtonText: '确定'
						        });
						        return
							}
		    			}
					}
    			} else{
    				this.$alert('监管处罚文件编号不能为空', '提示', {
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
				if(this.checkData.duty){
					var arr = ['n','x','org','job','pts']
					var arrName = {
						'n':'姓名',
						'x':'性别',
						'org':'所在机构',
						'job':'职务',
						'pts':'政治面貌',
					}
					if(this.checkData.duty.wzType == '1'){
						delete this.checkData.duty.wzPersonIndirect
						if(this.checkData.duty.wzPersonMaster != undefined){
							for(var i = 0;i<this.checkData.duty.wzPersonMaster.length;i++){
								for(var j=0;j<arr.length;j++){
									if(this.checkData.duty.wzPersonMaster[i][arr[j]] == null){
										this.$alert('直接责任人'+arrName[arr[j]]+'不能为空', '提示', {
										confirmButtonText: '确定'
										});
										return
									}
								}
							}
						} else{
							this.$alert('直接责任人不能为空', '提示', {
								confirmButtonText: '确定'
							});
							return
						}
					} else if(this.checkData.duty.wzType == '2'){
						delete this.checkData.duty.wzPersonMaster
						if(this.checkData.duty.wzPersonIndirect != undefined){
							for(var i = 0;i<this.checkData.duty.wzPersonIndirect.length;i++){
								for(var j=0;j<arr.length;j++){
									if(this.checkData.duty.wzPersonIndirect[i][arr[j]] == null){
										this.$alert('间接责任人'+arrName[arr[j]]+'不能为空', '提示', {
										confirmButtonText: '确定'
										});
										return
									}
								}
							}
						} else{
							this.$alert('间接责任人不能为空', '提示', {
								confirmButtonText: '确定'
							});
							return
						}
					} else if(this.checkData.duty.wzType == '3'){
						if(this.checkData.duty.wzPersonMaster != undefined){
							for(var i = 0;i<this.checkData.duty.wzPersonMaster.length;i++){
								for(var j=0;j<arr.length;j++){
									if(this.checkData.duty.wzPersonMaster[i][arr[j]] == null){
										this.$alert('直接责任人'+arrName[arr[j]]+'不能为空', '提示', {
										confirmButtonText: '确定'
										});
										return
									}
								}
							}
						} else{
							this.$alert('直接责任人不能为空', '提示', {
								confirmButtonText: '确定'
							});
							return
						}
						if(this.checkData.duty.wzPersonIndirect != undefined){
							for(var i = 0;i<this.checkData.duty.wzPersonIndirect.length;i++){
								for(var j=0;j<arr.length;j++){
									if(this.checkData.duty.wzPersonIndirect[i][arr[j]] == null){
										this.$alert('间接责任人'+arrName[arr[j]]+'不能为空', '提示', {
										confirmButtonText: '确定'
										});
										return
									}
								}
							}
						} else{
							this.$alert('间接责任人不能为空', '提示', {
								confirmButtonText: '确定'
							});
							return
						}
					}
				}
	    		if(JSON.stringify(this.checkData.base) == "{}" || this.checkData.base==null){
	    			delete this.checkData.base
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
	    		if(this.$route.query.superviseId!==undefined){
	    			this.checkData.superviseId = this.$route.query.superviseId
	    		}
	    		if(this.infoSpecial.superviseId!==undefined){
	    			this.checkData.superviseId = this.infoSpecial.superviseId
	    		}
	    		this.axios.post('cx_penalize/submit',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
					if(res.code == 200){
						this.$alert('提交成功', '提示', {
							confirmButtonText: '确定',
							callback: action => {
								if(this.$route.query.flag == 3){
									this.$router.push({
										path:'/punishSeasonReportCX',
										query:{           //路由传参时push和query搭配使用 ，作用时传递参数
											id: this.$route.query.id
										}
									})
								} else{
									sessionStorage.setItem('punishPath',1)
									this.$router.push({
										path:'/infoManage/infoManageSend/punish/punishSend',
										query:{           //路由传参时push和query搭配使用 ，作用时传递参数
											id: '1_hjgcfxxbs',
											supervisePath:this.supervisePath
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
	    	},
	    	// 保存
	    	goSave(){
				if(this.checkData.base.penalizeFile == undefined){
					this.$alert('监管处罚文件不能为空', '提示', {
						confirmButtonText: '确定'
					});
					return
				}
	    		if(this.checkData.base&&this.checkData.base.penalizeFile){
	    			for(var m = 0;m<this.checkData.base.penalizeFile.length;m++){
	    				if(this.checkData.base.penalizeFile[m].cfType == '1'){
	    					delete this.checkData.base.penalizeFile[m].personMap
	    				}
	    				if(this.checkData.base.penalizeFile[m].cfType == '2'){
	    					delete this.checkData.base.penalizeFile[m].orgMap
	    				}
	    				if(this.checkData.base.penalizeFile[m].orgMap != undefined){
							for(var i = 0;i<this.checkData.base.penalizeFile[m].orgMap.length;i++){
								if(this.checkData.base.penalizeFile[m].orgMap[i].org == null){
									this.$alert('被处罚机构不正确', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
							}
						}
						if(this.checkData.base.penalizeFile[m].personMap != undefined){
							for(var i = 0;i<this.checkData.base.penalizeFile[m].personMap.length;i++){
								if(this.checkData.base.penalizeFile[m].personMap[i].org == null){
									this.$alert('所属机构不正确', '提示', {
							          confirmButtonText: '确定'
							        });
							        return
								}
							}
						}
					}
				}
	    		if(JSON.stringify(this.checkData.base) == "{}" || this.checkData.base==null){
	    			delete this.checkData.base
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
	    		if(this.$route.query.superviseId!==undefined){
	    			this.checkData.superviseId = this.$route.query.superviseId
	    		}
	    		if(this.infoSpecial.superviseId!==undefined){
	    			this.checkData.superviseId = this.infoSpecial.superviseId
	    		}
	    		this.axios.post('cx_penalize/save',JSON.stringify(this.checkData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
					if(res.code == 200){
						if(res.data !== null){
							this.$alert('保存成功', '提示', {
						    	confirmButtonText: '确定',
						      	callback: action => {
							      	if(this.$route.query.flag == 3){
						    			this.$router.push({
								    		path:'/punishSeasonReportCX',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
									            id: this.$route.query.id
								            }
								    	})
						    		} else{
								      	this.$router.push({
								    		path:'/infoManage/infoManageSend/punish/punishSend',
								    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
									           id: '1_hjgcfxxbs',
									           supervisePath:this.supervisePath
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
	    		this.axios.post('cx_penalize/detail',params).then((res)=>{
	    			if(res.code == '200'){
	    				if(res.data!==null){
	    					// 基本信息
	    					this.infoSpecial = res.data.detail == null?new Object:res.data.detail
							var arr = ['base','abarbeitung','duty']
							arr.forEach(item=>{
								if(res.data.detail[item]){
									this.$set(this.infoSpecial,item,res.data.detail[item])
								} else{
									this.$set(this.infoSpecial,item,new Object())
								}
							})
	    					// 接口数据
	    					this.checkData.base = JSON.parse(JSON.stringify(this.infoSpecial.base))
	    					this.checkData.abarbeitung = JSON.parse(JSON.stringify(this.infoSpecial.abarbeitung))
	    					this.checkData.duty =JSON.parse(JSON.stringify(this.infoSpecial.duty))

    						this.subject.region = this.infoSpecial.base.subjectType;
    						this.punishType.region = this.infoSpecial.base.punishType;
    						if(this.infoSpecial.base.lkDate){
    							this.infoSpecial.base.lkDate = this.infoSpecial.base.lkDate.substring(0,4)+'-'+this.infoSpecial.base.lkDate.substring(4,6)+'-'+this.infoSpecial.base.lkDate.substring(6,8)
    						}
    						if(this.infoSpecial.base.penalizeFile){
    							for(var i = 0;i<this.infoSpecial.base.penalizeFile.length;i++){
    								this.infoSpecial.base.penalizeFile[i].isDisabled = false
		    						if(this.$route.query.flag == 1){
		    							this.infoSpecial.base.penalizeFile[i].isDisabled = true
		    						}
		    						if(this.infoSpecial.base.penalizeFile[i].orgMap){
				    					for(var j = 0;j<this.infoSpecial.base.penalizeFile[i].orgMap.length;j++){
				    						this.infoSpecial.base.penalizeFile[i].orgMap[j].orgName = this.infoSpecial.base.penalizeFile[i].orgMap[j].orgName
				    						this.infoSpecial.base.penalizeFile[i].orgMap[j].isDisabled = false
				    						if(this.$route.query.flag == 1){
				    							this.infoSpecial.base.penalizeFile[i].orgMap[j].isDisabled = true
				    						}
				    					}
			    					} else{
			    						this.$set(this.infoSpecial.base.penalizeFile[i],'orgMap',this.defaultOrgMap)
			    					}
			    					if(this.infoSpecial.base.penalizeFile[i].personMap){
				    					for(var m = 0;m<this.infoSpecial.base.penalizeFile[i].personMap.length;m++){
				    						this.infoSpecial.base.penalizeFile[i].personMap[m].name = this.infoSpecial.base.penalizeFile[i].personMap[m].name
				    						this.infoSpecial.base.penalizeFile[i].personMap[m].isDisabled = false
				    						if(this.$route.query.flag == 1){
				    							this.infoSpecial.base.penalizeFile[i].personMap[m].isDisabled = true
				    						}
				    					}
			    					} else{
			    						this.$set(this.infoSpecial.base.penalizeFile[i],'personMap',this.defaultPersonMap)
			    					}
		    					}
    						} else{
    							let arr = [{
						        	fileNo:null,//检查事项
						        	cfType:null,
						        	orgMap:[{
							        	org:null,
							        	orgName:'',
							        	amt:null,
							        	orgcs:null,
							        	orgdes:null,
							        }],
							        personMap:[{
							        	name:null,
							        	org:null,
							        	orgName:'',
							        	amt:null,
							        	pcs:null,
							        	pdes:null,
							        }],
						        }]
    							this.$set(this.infoSpecial.base,'penalizeFile',arr)
    						}
							if(this.infoSpecial.duty.wzPersonMaster){
    							for(var i = 0;i<this.infoSpecial.duty.wzPersonMaster.length;i++){
									this.infoSpecial.duty.wzPersonMaster[i].orgName = this.infoSpecial.duty.wzPersonMaster[i].orgName
    								this.infoSpecial.duty.wzPersonMaster[i].isDisabled = false
		    						if(this.$route.query.flag == 1){
		    							this.infoSpecial.duty.wzPersonMaster[i].isDisabled = true
		    						}
		    					}
    						} else{
    							let arr = [{
						        	n:null,
									x:null,
									org:null,
									z:null,
									p:null,
									pts:null,
									jlType:null,
									zzType:null,
									jjType:null,
									jjAmount:null
						        }]
    							this.$set(this.infoSpecial.duty,'wzPersonMaster',arr)
    						}
							if(this.infoSpecial.duty.wzPersonIndirect){
    							for(var i = 0;i<this.infoSpecial.duty.wzPersonIndirect.length;i++){
									this.infoSpecial.duty.wzPersonIndirect[i].orgName = this.infoSpecial.duty.wzPersonIndirect[i].orgName
    								this.infoSpecial.duty.wzPersonIndirect[i].isDisabled = false
		    						if(this.$route.query.flag == 1){
		    							this.infoSpecial.duty.wzPersonIndirect[i].isDisabled = true
		    						}
		    					}
    						} else{
    							let arr = [{
						        	n:null,
									x:null,
									org:null,
									z:null,
									p:null,
									pts:null,
									jlType:null,
									zzType:null,
									jjType:null,
									jjAmount:null
						        }]
    							this.$set(this.infoSpecial.duty,'wzPersonIndirect',arr)
    						}
	    					this.evidenceFiles[0] = this.infoSpecial.base.attachment
	    					this.evidenceFiles[1] = this.infoSpecial.abarbeitung.attachment
	    					this.evidenceFiles[2] = this.infoSpecial.duty.attachment
	    					// 生效库置灰
	    					if(this.$route.query.flag == 1){
		    					if(res.data.detail.abarStatus == '1'){
	    							this.isDisabled[1] = true
	    						}
	    						if(res.data.detail.dutyStatus == '1'){
	    							this.isDisabled[2] = true
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
	    	// 被处罚机构增加
	    	goAdd(index,type){
				switch (type){
					case 1:
						this.infoSpecial.base.penalizeFile.push({
							fileNo:null,
							cfType:null,
							orgMap:[{
								org:null,
								orgName:'',
								amt:null,
								orgcs:null,
								orgdes:null,
							}],
							personMap:[{
								name:null,
								org:null,
								orgName:'',
								amt:null,
								pcs:null,
								pdes:null,
							}],
						})
						break;
					case 2:
						this.infoSpecial.base.penalizeFile[index].orgMap.push({
							org:null,
							orgName:'',
							amt:null,
							orgcs:null,
							orgdes:null,
						})
						break;
					case 3:
						this.infoSpecial.base.penalizeFile[index].personMap.push({
							name:null,
							org:null,
							orgName:'',
							amt:null,
							pcs:null,
							pdes:null,
						})
						break;
					case 4:
						this.infoSpecial.duty.wzPersonMaster.push({
							n:null,
			    			x:null,
							org:null,
							job:null,
							pts:null,
							jl:null,
							zz:null,
							jj:null,
							amt:null
						})
						break;
					case 5:
						this.infoSpecial.duty.wzPersonIndirect.push({
							n:null,
			    			x:null,
							org:null,
							job:null,
							pts:null,
							jl:null,
							zz:null,
							jj:null,
							amt:null
						})
						break;
				}
	    	},
	    	// 被处罚机构删除
	    	goMinus(oindex,index,type){
				switch (type){
					case 1:
						this.infoSpecial.base.penalizeFile.splice(oindex,1)
	    				this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
						break;
					case 2:
						this.infoSpecial.base.penalizeFile[index].orgMap.splice(oindex,1)
	    				this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
						break;
					case 3:
						this.infoSpecial.base.penalizeFile[index].personMap.splice(oindex,1)
	    				this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
						break;
					case 4:
						this.infoSpecial.duty.wzPersonMaster.splice(oindex,1)
	    				this.checkData.duty.wzPersonMaster = this.infoSpecial.duty.wzPersonMaster
					case 5:
						this.infoSpecial.duty.wzPersonIndirect.splice(oindex,1)
	    				this.checkData.duty.wzPersonIndirect = this.infoSpecial.duty.wzPersonIndirect
						break;
				}
	    		
	    	},
	    	checkInput(e){
			  	let prohibitInput= ["-", "e", "+", "E"];
			  	if(prohibitInput.includes(e.key)){
			    	e.preventDefault();
			  	}
			},
			getInput(value,index,row,name,type){
				if (value != '') {
			        if (value.indexOf('.') > -1) {
						this.$set(this.infoSpecial.duty[type][index],name,value.slice(0, value.indexOf('.') + 3))
			        } else { 
			        	this.$set(this.infoSpecial.duty[type][index],name,value)
			        }
					this.checkData.duty[type] = this.infoSpecial.duty[type]
					this.checkData.duty[type][index][name] = this.infoSpecial.duty[type][index][name]
			    }
	    	},
			textareaChange(e){
				setTimeout(()=>{
					var repEnter = /[\&]/
					var repOne = /["',，.。！!?？——_\-<>%;‘’；]/
					var str = e.target.value
				  	str = str.replace(/[\r\n]/g , '&')
				  	var strAttr = str.split('')
				  	var maxLen = 500
				  	if (strAttr.length == 0){
	                  return { 
	                    maxLen: maxLen
	                   } 
	                }else{
	                	strAttr.forEach(function(val, key){
							if (repEnter.test(val) || repOne.test(val)){
		                      maxLen++ // 最多输入增加 1个中文
		                    }
	                  	})
	                }
	                this.maxLen = Math.ceil( maxLen ) 
                },200)
			},
			closeMaskTable(data){
		    	this.isShow = data.status;
		    	if(data.orgChecked){
		    		switch (data.type){
			    		case 1:
			    			this.$set(this.checkData.base.penalizeFile[data.index].orgMap[data.oindex],'org',data.orgChecked)
			    			break;
			    		case 2:
			    			this.$set(this.checkData.base.penalizeFile[data.index].personMap[data.oindex],'org',data.orgChecked)
			    			break;
			    	}
		    	}
		    	if(data.orgName){
		    		switch (data.type){
			    		case 1:
			    			this.$set(this.infoSpecial.base.penalizeFile[data.index].orgMap[data.oindex],'orgName',data.orgName)
			    			break;
			    		case 2:
			    			this.$set(this.infoSpecial.base.penalizeFile[data.index].personMap[data.oindex],'orgName',data.orgName)
			    			break;
			    	}
		    	}
		    },
		    keyFilter(val,oindex,index,type){
		    	if(type ==1){
		    		this.infoSpecial.base.penalizeFile[index].orgMap[oindex].orgName = val
					this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
					delete this.infoSpecial.base.penalizeFile[index].orgMap[oindex].org
		    	} else{
		    		this.infoSpecial.base.penalizeFile[index].personMap[oindex].orgName = val
					this.checkData.base.penalizeFile = this.infoSpecial.base.penalizeFile
					delete this.infoSpecial.base.penalizeFile[index].personMap[oindex].org
		    	}
			},
			filterNode(value, data) {
				return true
		    },
		    selectFoucus(e,oindex,index,type){
		    	if(this.visible){
		    		let input = this.$refs['searchSelect'+ type + oindex + index]
		    		input[0].blur()
		    	}
		    },
		    visibleChange(val,oindex,index,type){
		    	this.visible = val
		    },
	      	searchOrg(oindex,index,type){
	      		var reOrgName = ''
	      		if(type == 1){
	      			reOrgName = this.infoSpecial.base.penalizeFile[index].orgMap[oindex].orgName
	      		} else{
	      			reOrgName = this.infoSpecial.base.penalizeFile[index].personMap[oindex].orgName
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
			        			this.$set(this.searchResult,'oindex',oindex)
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
			// 关联检查
			closePunishNotice(data) {
				this.isNotice = data.status
				if(data.sourceId){
					this.$set(this.checkData.base,'sourceId',data.sourceId)
				}
				if(data.sourceName){
					this.$set(this.infoSpecial.base,'sourceName',data.sourceName)
				}
			},
			goConnect(val) {
				if(this.infoSpecial.base.punishSource&&this.infoSpecial.base.punishSource == "2"){
					this.noticeType = 3
				} else{
					this.noticeType = val
				}
				this.isNotice = true
			},
	    },
	    beforeRouteEnter (to, from, next) {
			next((that) => {
			    if(from.fullPath.includes('/superviseSpecialReportCX')){
			    	that.supervisePath = true
			    }
			})
	    }
  	};
</script>
<style lang="scss">
#punishSpecialReportCX{
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
    	margin-top:75px;
	}
	.el-form{
		min-height:550px
	}
	.el-form1{
		min-height:250px
	}
	.newHeight{
		height:630px;
		overflow-y:auto;
		padding: 30px 16px 20px 16px!important;
	}
	.el-form-item{
		width:100%
	}
	.firstForm{
		.el-form-item__label{
			float:left;
			width:170px;
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
	    .punishWidth{
	    	.el-form-item__content{
				width:calc(100% - 170px)!important;
			}
			textarea{
				height:auto
			}
	    }
	    .punishText{
	    	.el-form-item__content{
				width:calc(calc(50% - 170px) + 230px + 30%)!important;
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
		.punishLabel{
			position: relative;
			.el-form-item__label{
				width:230px;
			}
			.commonBtn{
				position: absolute;
				right:0;
				top:0
			}
		}
		.el-upload__tip,.el-upload-list{
			margin-left:0
		}
	}
	.newFile{
		.el-form-item{
			padding-left:170px;
			.el-form-item__content{
				width:calc(60% - 170px);
			}
		}	}
	.el-upload--text{
		float: none;
	}
	.el-form-item__label{
		width:100px;
		text-align:right;
		height:32px;
		line-height:32px;
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
	.el-upload__tip,.el-upload-list{
		margin-left:-100px;
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
	.el-table th.redStar>.cell::before{
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
			margin-top:0;
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
	.max .el-form-item__label{
		line-height:18px!important;
	}
	.el-input__icon{
		line-height: 32px;
	}
}	

</style>
