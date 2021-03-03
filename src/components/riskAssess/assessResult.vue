<template>
  <div id="assessResults">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">风控评估</span></el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor">实施风控评估</el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor" :to="{path:'/riskAssess/bringAssess/taskReport?id=1_afkpgrwcb'}">风控评估任务呈报</el-breadcrumb-item>
		  <el-breadcrumb-item class="wgTxtColor1">详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="quoteSys">
			<div class="titIcon"><em></em>
				<span style="font-weight: 600;">填报风控评估任务</span>
				<el-button class="priBtn" type="primary" @click="back">返回</el-button>
  			<el-button class="priBtn" type="primary" v-if="isDetail != 1" @click="saveData">保存</el-button>
				<el-button class="priBtn" v-if="isDetail != 1" type="primary" @click="batchImport">导入风控评估结果</el-button>
				<el-button class="priBtn" v-if="isDetail != 1" type="primary" @click="loadPoint">下载风控评估表</el-button>
			</div>
			<el-table :data="tableData" :max-height="tableHeight" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:5px">
	      <el-table-column  type="index"  label="序号" align="center" > </el-table-column>
	      <el-table-column  prop="department" width="150" label="责任部门" align="center"></el-table-column>
	      <el-table-column  prop=""  label="流程名称" align="center">
	      	<el-table-column  prop="firstLevel" width="120" label="一级流程名称" align="center"></el-table-column>
	      	<el-table-column  prop="secondLevel" width="120" label="二级流程名称" align="center"></el-table-column>
	      </el-table-column>
	      <el-table-column prop=""  label="固有风险评估" align="center">
	      	<el-table-column prop="riskPointNo" width="120" label="风险点编号" align="center"></el-table-column>
	      	<el-table-column prop="riskPointDesc" width="150" label="风险点描述" :render-header="renderTip" align="center" show-overflow-tooltip></el-table-column>
	      	<el-table-column prop="" width="200" label="风险发生的可能性" :render-header="renderTip" align="center">
	      		<template slot-scope="scope">
	      			<el-select v-model="tableData[scope.$index].riskRate" v-if="isDetail != 1" @change="selectRiskRate(scope.$index,scope.row)" placeholder="请选择">
					   		<el-option v-for="(item,index) in riskGenerationPossable" :key="index" :label="item.name" :value="item.code"></el-option>
							</el-select>
							<p v-else>
								<span v-if="scope.row.riskRate == 1">1-每5年或更低频率</span>
								<span v-if="scope.row.riskRate == 2">2-每年</span>
								<span v-if="scope.row.riskRate == 3">3-每季度</span>
								<span v-if="scope.row.riskRate == 4">4-每月或更高频率</span>
							</p>
	      		</template>
	      	</el-table-column>
	      	<el-table-column prop="" width="220" label="风险发生的影响程度" :render-header="renderTip" align="center">
	      		<template slot-scope="scope">
	      			<el-select v-model="scope.row.riskEffect" v-if="isDetail != 1" @change="selectRenderTip(scope.$index,scope.row)" placeholder="请选择">
					   		<el-option v-for="(item,index) in riskGenerationInfluence" :key="index" :label="item.name" :value="item.code"></el-option>
							</el-select>
							<p v-else>
								<span v-if="scope.row.riskEffect == 1">1-极小</span>
								<span v-if="scope.row.riskEffect == 2">2-较小</span>
								<span v-if="scope.row.riskEffect == 3">3-中等</span>
								<span v-if="scope.row.riskEffect == 4">4-严重</span>
							</p>
	      		</template>
	      	</el-table-column>
	      	<el-table-column prop="theRiskLevel" width="120" label="固有风险等级（自动计算）" align="center">
	      		<template slot-scope="scope">
	      			<div :class="{'red':scope.row.theRiskLevel==1,'yellow':scope.row.theRiskLevel==2,'blue':scope.row.theRiskLevel==3}" style="width:100%;height:100%;">
	      				<span v-if="scope.row.theRiskLevel == 1">低风险</span>
	      				<span v-if="scope.row.theRiskLevel == 2">中风险</span>
	      				<span v-if="scope.row.theRiskLevel == 3">高风险</span>
	      			</div>
	      		</template>
	      	</el-table-column>
	      </el-table-column>
	      <el-table-column prop="" label="现有控制活动"  align="center"> 
	      	<el-table-column prop="ctrlPointNo" width="120" label="控制点编号"  align="center"> </el-table-column>
	      	<el-table-column prop="ctrlPointDesc" width="120" label="控制点描述"  align="center" show-overflow-tooltip> </el-table-column>
	      	<el-table-column prop="ctrlRate" width="180" label="控制频率"  align="center"> 
	      			<template slot-scope="scope">
	      				<p>	
									<span v-if="scope.row.ctrlRate == 1">每周一次或更高频率</span>
		          		<span v-if="scope.row.ctrlRate == 2">每月一次</span>
		          		<span v-if="scope.row.ctrlRate == 3">每季度一次</span>
		          		<span v-if="scope.row.ctrlRate == 4">每半年一次</span>
		          		<span v-if="scope.row.ctrlRate == 5">每年一次或更低频率</span>
		          		<span v-if="scope.row.ctrlRate == 6">不定期</span>
								</p>
	      			</template>
	      	</el-table-column>
	      	<el-table-column prop="ctrlType" width="180" label="控制方式（人工/人工依赖系统/系统控制）"  align="center"> 
	      			<template slot-scope="scope">
	      				<p>
									<span v-if="scope.row.ctrlType == 1">人工控制</span>
									<span v-if="scope.row.ctrlType == 2">人工依赖系统控制</span>
									<span v-if="scope.row.ctrlType == 3">系统控制</span>
								</p>
	      			</template>
	      	</el-table-column>
	      </el-table-column>
	      <el-table-column prop=""  label="剩余风险"  align="center"> 
	      	<el-table-column prop="hasBug" width="110"  label="是否存在缺陷"  align="center"> 
	      		<template slot-scope="scope">
	      			<el-select v-model="scope.row.hasBug" v-if="isDetail != 1" @change="((val)=>{isDefectSlect(val,scope.$index,scope.row)})" placeholder="请选择">
					   		<el-option v-for="(item,index) in isDefect" :key="index" :label="item.name" :value="item.code"></el-option>
							</el-select>
							<p v-else>
								<span v-if="scope.row.hasBug == 1">是</span>
								<span v-if="scope.row.hasBug == 0">否</span>
							</p>
	      		</template>
	      	</el-table-column>
	      	<el-table-column prop="bugLevel,hasBug" width="130" label="缺陷等级"  align="center"> 
	      		<template slot-scope="scope">
	      			<el-select v-model="scope.row.bugLevel" v-if="isDetail != 1" :disabled="scope.row.hasBug == 0" placeholder="请选择">
					   		<el-option v-for="(item,index) in defectLevel" :key="index" :label="item.name" :value="item.code"></el-option>
							</el-select>
							<p v-else>
								<span v-if="scope.row.bugLevel == 1">低风险</span>
								<span v-if="scope.row.bugLevel == 2">中风险</span>
								<span v-if="scope.row.bugLevel == 3">高风险</span>
							</p>
	      		</template>
	      	</el-table-column>
	      	<el-table-column prop="bugType,hasBug" width="130" label="缺陷类型"  align="center"> 
	      		<template slot-scope="scope">
	      			<el-select v-model="scope.row.bugType" v-if="isDetail != 1" :disabled="scope.row.hasBug == 0" placeholder="请选择">
					   		<el-option v-for="(item,index) in defectType" :key="index" :label="item.name" :value="item.code"></el-option>
							</el-select>
							<p v-else>
								<span v-if="scope.row.bugType == 1">设计缺陷</span>
								<span v-if="scope.row.bugType == 2">运行缺陷</span>
							</p>
	      		</template>
	      	</el-table-column>
	      </el-table-column>
	      <el-table-column prop="improvementPlan" width="250" label="整改计划（缺陷等级为中、高的应制定整改计划）"  align="center">
	      	<template slot-scope="scope">
	      		<div>
	      			<div v-if="scope.row.improvementPlan.dealBugPlan" @click="writePlan(scope.$index,scope.row)">
	      				<p class="improvementPlan">整改措施：{{scope.row.improvementPlan.dealBugPlan}}</p>
		      			<p class="improvementPlan">完成时间：{{scope.row.improvementPlan.overDate}}</p>
		      			<p class="improvementPlan">责任人：{{scope.row.improvementPlan.dutyer}}</p>
	      			</div>
	      			<span v-if="!scope.row.improvementPlan.dealBugPlan && isDetail != 1" @click="writePlan(scope.$index,scope.row)" style="color:red;cursor:pointer;">填写整改计划</span>
	      		</div>
	      	</template>
	      </el-table-column>
	    </el-table>
	    <div class="fileDetail" v-if="isDetail">
	    	<h4><i class="el-icon-paperclip"></i>附件：</h4>
	    	<div v-for="(item,index) in this.fileList"><span class="pName"><i class="el-icon-document"></i><span @click="goDownload(item.path)">{{item.name}}</span></span><i style="margin-left: 15px;" @click="loadFile(item.path,item.name)" title="下载" class="el-icon-download"></i></div>
	    </div>
	    <div class="maskFile" v-show="isOpen">
     		<div class="readTxt">
	     		<el-tag @close="closeMask" closable></el-tag>
					<iframe id="fileRead" src="" width="100%" height="100%"></iframe>
				</div>
     	</div>
		</div>
 		<improvement-plan v-if="isShow" :itemInfo="itemInfo" @closeMask="getMsgFormSon"></improvement-plan>
 		<div class="readTxt">
			<div class="uploadMask" v-if="maskShow">
				<div class="up">
					<i class="el-icon-close" @click="maskShow = false"></i>
    			<el-upload class="upload-demo" drag action="" ref="uploads" :http-request="uploadFile" :before-remove="beforeRemove" :on-remove="handleRemove" :beforeUpload="beforeAvatarUpload" accept=".Excel,.xls,.xlsx" :file-list="fileList1">
  						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
					<div class="btnBox" style="text-align: center;margin-bottom: 20px;">
						<el-button type="primary" @click="cancelFile" class="state_saveFile">取消</el-button>
						<el-button type="primary" @click="submitFile" class="state_saveFile">确定</el-button>
					</div>
				</div>
			</div>
			<div class="readBox"></div>
		</div>
  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import qs from 'qs'
	import {pie,fileDownload,fileNameCombine} from 'src/utils/utils.js'
	import improvementPlan from 'src/components/riskAssess/improvementPlan'
  export default {
  	data() {
      return {
      	tableData:[],
      	tableHeight: 0,
      	saveDataSj:[],
      	riskGenerationPossable:[{
      		name:'1-每5年或更低频率',
      		code:1
      	},{
      		name:'2-每年',
      		code:2
      	},{
      		name:'3-每季度',
      		code:3
      	},{
      		name:'4-每月或更高频率',
      		code:4
      	}],
      	riskGenerationInfluence:[{
      		name:'1-极小',
      		code:1
      	},{
      		name:'2-较小',
      		code:2
      	},{
      		name:'3-中等',
      		code:3
      	},{
      		name:'4-严重',
      		code:4
      	}],
      	isDefect:[{
      		name:'是',
      		code:1
      	},{
      		name:'否',
      		code:0
      	}],
      	defectLevel:[{
      		name:'低风险',
      		code:1
      	},{
      		name:'中风险',
      		code:2
      	},{
      		name:'高风险',
      		code:3
      	}],
      	defectType:[{
      		name:'设计缺陷',
      		code:1
      	},{
      		name:'运行缺陷',
      		code:2
      	}],
      	fileList:[],
      	isShow:false, //是否展示整改计划
      	writeIndex:'', //确认当前修改条目
      	noSlect:false,//缺陷等级表示
      	id:null,
      	itemInfo:null,
      	isDetail:this.$route.query.isDetail,
      	maskShow:false,
      	fileList1:[],
      	uploadData:'',
      	isOpen:false
			}
   	},
   	created(){
   		var isDetail = this.$route.query.isDetail;
   		this.id = this.$route.query.itemId
   		if(isDetail){
   			this.getSublistDetail(this.id)
   		}else{
   			this.getSubList(this.id)
   		}
   	},
   	mounted() {
   		this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 200;
	    })
   	},
   	methods:{
   		writePlan(index,row){
   			if(this.isDetail != 1){
   				this.isShow = true
   				var obj = new Object()
   				obj.dealBugPlan = row.improvementPlan ? row.improvementPlan.dealBugPlan:row.dealBugPlan
   				obj.overDate = row.improvementPlan ? row.improvementPlan.overDate : row.overDate
   				obj.dutyer = row.improvementPlan ? row.improvementPlan.dutyer : row.dutyer
   				this.itemInfo = obj
   				this.writeIndex = index
   			}
   		},
   		getMsgFormSon(data){
   			this.isShow = data.status
   			if(data.msg){
   				this.tableData[this.writeIndex].improvementPlan = data.msg
   				this.$set(this.tableData,this.writeIndex,this.tableData[this.writeIndex])
   			}
   		},
   		isDefectSlect(val,index,row){
				if(val == 0){
					this.noSlect = true
					this.$set(row,"bugLevel",null);
					this.$set(row,"bugType",null);
				}else{
					this.noSlect = false
				}
			},
			saveData(){
				this.saveDataSj = []
				for (var i = 0; i < this.tableData.length; i++) {
					var obj = new Object()
					obj.riskRate = this.tableData[i].riskRate
					obj.riskEffect = this.tableData[i].riskEffect
					obj.hasBug = this.tableData[i].hasBug
					obj.bugType = this.tableData[i].bugType
					obj.bugLevel = this.tableData[i].bugLevel
					obj.id = this.tableData[i].id
					obj.theRiskLevel = this.tableData[i].theRiskLevel
					obj.dealBugPlan = this.tableData[i].improvementPlan.dealBugPlan
					obj.overDate = this.tableData[i].improvementPlan.overDate
					obj.dutyer = this.tableData[i].improvementPlan.dutyer
					this.saveDataSj.push(obj)
				}
				var obj = new Object();
				obj.id = this.id;
				obj.itemList = this.saveDataSj;
				var jb=qs.stringify(obj).replace(/%5D%5B/g,'%5D.').replace(/%5D=/g,'=');
				this.axios.post('subrep/istoraddff',jb).then((res)=>{
					if(res.code == 200){
						this.$alert(res.message, '提示', {
		        	confirmButtonText: '确定'
		        })
					}else{
						this.$alert(res.message, '提示', {
		        	confirmButtonText: '确定'
		        })
					}
				})
			},
			selectRiskRate(index,row){
				if(row.riskEffect != undefined){
					var val = row.riskRate * row.riskEffect
					if(val < 6){
						row.theRiskLevel = 1
					}else if(6 <= val  && val <12){
						row.theRiskLevel = 2
					}else{
						row.theRiskLevel = 3
					}
				}
			},
			selectRenderTip(index,row){
				if(row.riskRate != undefined){
					var val = row.riskRate * row.riskEffect
					if(val < 6){
						row.theRiskLevel = 1
					}else if(6 <= val  && val <12){
						row.theRiskLevel = 2
					}else{
						row.theRiskLevel = 3
					}
				}
			},
			back(){
				this.$router.push({
					path:'/assessCB',
					query:{
						id:'1_afkpgrwcb'
					}
				})
			},
			//预览
  		goDownload(url){
	    	this.isOpen = true
	    	$('#fileRead').attr('src','http://10.196.23.34:8237/v1/view/preview?filePath='+encodeURIComponent(url))
		  },
  		//关闭预览
  		closeMask(){
  			this.isOpen = false;
  		},
			loadFile(url,name){
				var obj = new Object()
				obj.filePath = url;
				obj.fileName = name;
				this.axios.post('comm/download/801',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
					fileDownload(res, fileNameCombine(name,url));
				})
			},
   		renderTip (h,{column}) {
   			let propMessage = ''
   			if(column.label=="风险点描述"){
   				propMessage = "名词解释：<br>请评估人员结合被评估对象的主要职责及内控手册所列示的风险点描述，对风险点进行更新；<br>说明：每次评估前更新此风险点，更新方式：<br>（1）通过表单新增风险点或修改已有风险点<br>（2）通过流程图新增风险点或修改已有风险点"
   			}
   			if(column.label=="风险发生的可能性"){
   				propMessage = "名词解释：<br>* 风险发生的可能性：是指风险事件多久发生一次或一定期间内的发生概率。<br>在下拉菜单中选择，包括：每10年或更低频率、每5年、每年、每季度、每月或更高；"
   			}
   			if(column.label=="风险发生的影响程度"){
   				propMessage = "名词解释<br>*在下拉菜单中选择，包括：极小、较小、中等、严重；<br>影响程度定义：<br>极小：指无财产和声誉损失，仅对日常工作开展有轻微影响<br>较小：指有轻微财产损失，但是在公司可接受范围内；或者，在公司内外部传播开，造成内部员工的负面情绪或外部的负面宣传报道；或者，影响日常工作，导致部分工作不能正常开展<br>中等：指有较大财产损失，达到公司责任追究金额标准；或者，被监管机构处罚，或被主流媒体进行负面报道；或者，导致较大范围的日常工作不能正常开展<br>严重：指财产损失严重影响公司利润；或者，被监管机构多次处罚，或已经丧失部分社会公信力；或者，公司日常工作较短时间内处于停滞状态<br>巨灾：指公司严重亏损，或被监管机构责令停业整顿，或完全丧失社会公信力，或公司面临破产"
   			}
			  return h(
			    'div',{
			      style:'display:flex;margin:auto;'
			    },
			    [
			    	h('gl-prompt-message', {
			        props: {messages: propMessage}
			      }),
			      h('span', column.label)
			    ]
			  );
			},
			getSubList(params){
				this.axios.post('subrep/getsublistupdate',qs.stringify({id:params})).then((res)=>{
						if(res.code == 200){
							this.tableData = []
							if(res.data != null){
								this.tableData = res.data.data
								this.totalResults = res.data.totalResults
								for (var i = 0; i < this.tableData.length; i++) {
									this.tableData[i].improvementPlan = {
										dealBugPlan:this.tableData[i].dealBugPlan == undefined?null:this.tableData[i].dealBugPlan, 
										overDate:this.tableData[i].overDate == undefined?null:this.tableData[i].overDate, 
										dutyer:this.tableData[i].dutyer == undefined?null:this.tableData[i].dutyer
									}
								}
							}
						}else{
							this.$alert(res.message, '提示', {
			          confirmButtonText: '确定'
			        });
						}
				})
			},
			getSublistDetail(params){
				this.axios.post('subrep/getdetail',qs.stringify({id:params})).then((res)=>{
						this.tableData = []
						if(res.data != null && JSON.stringify(res.data) != '{}'){
							this.tableData = res.data.data
							this.totalResults = res.data.totalResults
							this.fileList = res.data.files
							for (var i = 0; i < this.tableData.length; i++) {
								this.tableData[i].improvementPlan = {
									dealBugPlan:this.tableData[i].dealBugPlan == undefined?null:this.tableData[i].dealBugPlan, 
									overDate:this.tableData[i].overDate == undefined?null:this.tableData[i].overDate, 
									dutyer:this.tableData[i].dutyer == undefined?null:this.tableData[i].dutyer
								}
							}
						}
				})
			},
			loadPoint(){	
				this.axios.post("subrep/downtpl",qs.stringify({taskId:this.id,departmentNo:this.$route.query.depId}),{responseType:'arraybuffer'}).then((res)=>{
					let filename = "风控评估表.xlsx";
					fileDownload(res,filename)
        })
			},
			uploadFile(param){
					var fileObj = param.file;
					var form = new FormData();
					form.append("file", fileObj);
					form.append('taskId',this.id)
					this.uploadData = form
		  },
		  beforeAvatarUpload(file) {
			        const isLt2M = file.size / 1024 / 1024 < 10
			        if(!isLt2M) {
									this.fileList = this.$refs.uploads.fileList
			            this.$message({
			                message: '上传文件大小不能超过 10MB!',
			                type: 'warning'
			            });
			        }
			        return isLt2M
			    },
			    beforeRemove(file, fileList) {
			    	if(file.size / 1024 / 1024 > 10){
			    		return;
			    	}
				    return this.$confirm(`确定移除 ${ file.name }附件吗？`);
			},
			handleRemove(file,fileList){
						for (var i = 0; i < this.fileList.length; i++) {
							if(this.fileList[i].uid == file.uid){
								this.fileList.splice(i,1)
							}
						}
			},
			batchImport(){
				// 把写的提示信心需要换行的地方分成数组 confirmText
				const confirmText = ['请确认已在“风控评估点库"更新了评估点。',  '导入风控评估结果时，如评估点与“风控评估点库”不一致，则数据导入失败。'] 
        const newDatas = []
        const h = this.$createElement
        for (const i in confirmText) {
          newDatas.push(h('p', null, confirmText[i]))
        }
        this.$confirm(
          '提示',
          {
            message: h('div', null, newDatas),
            showCancelButton: true,
            confirmButtonText: '已维护评估点，继续导入',
            cancelButtonText: '更新评估点',
            type: 'warning'
          }
        ).then(() => {
	        this.maskShow = true;
	      })
	      .catch(action => {
//	      	if(action=='cancel'){
//	      		this.$router.replace('/riskAssess/assessLibrary?id=1_afkpgdk')
//	      	}
	      })
			},
			cancelFile(){
				this.maskShow = false
			},
			submitFile(){
				if(this.uploadData){
					this.axios.post('/subrep/uptpl',this.uploadData).then((res)=>{
						if(res.code==200){
							this.$alert('上传成功', '提示', {
			                    confirmButtonText: '确定',
			                    callback:action=>{
			                      	this.maskShow = false
									this.getSubList(this.id)
			                    }
			                });
						} else{
							this.$alert(res.message, '提示', {
			                 	confirmButtonText: '确定'
			                })
						}
		  		})
				}else{
					this.$alert("请先上传文件！")
				}
			}
   	},
   	components:{
			improvementPlan
   	},
   	computed:{
			checkBr(){
				return (data)=>{
					var data = data.replace(/\<br\>/g,'\n')
					return data
				}
			}
		}
	}    
</script>
<style lang="css">
  .el-tooltip__popper{
    max-width:50%
  }
</style>
<style lang="scss">
  #assessResults{
  	padding-bottom: 50px;
  	.saveBtn{
				min-width: 68px;
				height: 26px;
				line-height: 1px;
				font-size: 12px;
				padding:0 2px;
			}
		.quoteSys{
	    	margin-top: 25px;
	    	background: #fff;
	    	min-height: 250px;
	    	padding: 16px 16px 30px 16px;
	    	border-radius: 8px;
	    	th{
	    		background: #F9F9F9 ;
	    	}
	    	::-webkit-scrollbar {   
	    			width: 11px;
				    height: 14px;  /*滚动条高度*/
				} 
				td{
					border: none;
				}
	    	-webkit-box-shadow: 2px 0px 6px #888;
	    	.titIcon{
	    		font-size:14px;
	    		margin-bottom:30px;
	    		float: left;
	    		width: 100%;
	    		em{
	    			display: inline-block;
	    			width: 2px;
	    			height: 14px;
	    			background: #4285F4;
	    			vertical-align: middle;
	    			margin-right: 5px;
	    		}
	    		.priBtn{
	    			float: right;
				    min-width: 68px;
				    height: 26px;
				    padding: 0 10px;
			    	font-size: 12px;
			    	margin-left: 10px;
	    		}
	    	}
	    }
		.btnBox{
			margin-top: 50px;
			text-align: center;
			button{
				width: 68px;
				height: 26px;
				line-height: 0;
				font-size: 12px;
			}
		}	
		th{
			background: #F9F9F9;
		    color: #909399;
		    font-weight: bold;
		}
		.el-breadcrumb{
	    		margin-bottom: 30px;
	    		margin-top: 20px;
	    	}
	    	.el-tabs__content{
	    		-webkit-box-shadow: 1px 0px 6px #888;
	    		border-radius: 8px;
	    	}
	    	.el-table__empty-block{
	    		background: #fff;
	    	}
	    .el-pagination{
	    	margin-top: 30px;
	    }
    .red{
    	background:#4285F4;
    	color: #fff;
    }
    .yellow{
    	background:#FFEB5B;
    	color: #fff;
    }
    .blue{
    	background:#FF6363;
    	color: #fff;
    }
    .wgTxtColor span{
	    	color: rgb(144, 145, 145) !important;
	    	font-weight: 700;
	    }
	  .wgTxtColor1 span{
	  	font-weight: 700;
	  	color: #409EFF;
	  }
    .improvementPlan{
    	text-align:left!important
    }
    .improvementPlan:nth-child(1){
    	word-break:keep-all;   
	    white-space:nowrap;  
	    overflow:hidden;      
	    text-overflow:ellipsis;
    }
    .fileDetail{
			padding-left: 1%;
			padding-top: 2%;
			.pName:hover{
				cursor: pointer;
				color: #4285F4;
			}
			.pName{
				color: #909191;
				font-size: 12px;
				line-height: 24px;
				width: 40%;
				i{
					display: inline-block;
					margin-right: 10px;
				}
			}
			h4{
				color: #909191;
				font-size: 12px;
				font-weight: normal;
				margin-bottom: 5px;
			}
			.el-icon-download{
				font-size: 14px;
			}
			.el-icon-download:hover{
				cursor: pointer;
			}
		}
		.readTxt{
	  	width: 100%;
	  	/*height: 494px;*/
	  	/*border: 1px solid #E9E9E9;*/
	  	margin: 12px 0 14px 0;
	  }
	  .uploadMask{
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0,0,0,.3);
			z-index: 99;
			.up{
				width: 700px;
				height: 365px;
				overflow:auto;
				background: #fff;
				margin:25vh auto 0;
				position: relative;
				.el-icon-close{
					float: right;
					margin-top: 10px;
					margin-right: 10px;
				}
				.el-icon-close:hover{
					color: #4285F4;
				}
				.upload-demo{
					overflow: hidden;
					.el-icon-close{
						margin:0!important;
					}
					.el-upload-list{
						float: left;
						width: 96%;
					}
					.el-upload--text{
						width: 100%;
					}
				}
				.el-upload-dragger{
					width: 640px;
					height: 210px;
					left: 30px;
					top: 22px;
					margin-top: 20px;
				}
				.el-icon-upload:before{
					color: #4285F4;
					font-size: 50px;
	    			vertical-align: top;
				}
				.el-icon-upload{
					width: 88px;
					height: 88px;
					line-height: 88px;
					border-radius: 50%;
					background: #ECF5FF;
				}
				.el-upload-list{
					padding: 24px;
				}
				.state_saveFile{
					width: 68px;
					height: 26px;
					padding:0;
					font-size: 12px;
					bottom: 24px;
				}
			}
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
					position: absolute;
					right: 0;
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
