<template>
  <el-container class="container">
  	<maskTable :faShow="faShow" @closeMask = "closeMaskTable"></maskTable>
  <el-header class="header">
  	<el-row>
	  	<el-col :span="12">
		  	<el-breadcrumb separator-class="el-icon-arrow-right">
				  <el-breadcrumb-item :to="{ path: '/repository/in-manage' }">制度库</el-breadcrumb-item>
				  <el-breadcrumb-item class="txtColor">内规制度管理</el-breadcrumb-item>
				  <el-breadcrumb-item class="txtColor">新增内部制度</el-breadcrumb-item>
				</el-breadcrumb>
			</el-col>
			<el-col :span="9">
				<el-button type="primary" size="mini">返回</el-button>
		  	<el-button type="primary" @click="submitAll" size="mini">提交</el-button>
		  	<el-button type="primary" @click="submitAll" size="mini">保存</el-button>
		  </el-col>
	  </el-row>
  </el-header>
  <div class="render">
	  <div class="box">
			<div class="titIcon"><em></em><span>拆分导入</span></div>
			<regulationsCheck></regulationsCheck>
		</div>
  </div>
	<!--相关文件-->
		<div class="render mbtm20">
			<div class="box">
				<!--tittle-->
				<el-row>
					<el-col :span="12">
						<div class="titIcon"><em></em><span>相关文件</span></div>
					</el-col>
					<el-col :span="12">
						<el-upload class="upload-demo" :show-file-list="false" ref="upload" action="" :http-request="uploadFile" multiple>
						  <el-button size="small" type="primary">上传附件</el-button>
						</el-upload>
					</el-col>
				</el-row>
				<!--content-->
				<el-table :data="tableData" style="width: 100%;border: 1px solid #E9E9E9;">
					<el-table-column type="index" width="82" label="序号">
					</el-table-column>
					<el-table-column prop="name" label="文件名">
						<template slot-scope="scope">
							<i class="el-icon-document"></i> {{scope.row.name}}
						</template>
					</el-table-column>
					<el-table-column prop="address" label="文件类型">
						<template slot-scope="scope">
							<el-radio v-model="scope.row.radio" @change="getFileType(scope.$index,scope.row)"  :value="1" :label="1">制度</el-radio>
							<el-radio v-model="scope.row.radio" @change="getFileType(scope.$index,scope.row)"  :value="0" :label="0">附件</el-radio>
						</template>
					</el-table-column>
					<el-table-column prop="address" width="140" label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">拆分</el-button>
							<el-button size="mini" type="text" style="color: red;" @click="deleteFile(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

			</div>
		</div>
  <!--拆分导入-->
	<div class="section-rowdccs" v-if="tableShow">
		<div class="section-dealise">
			<div class="titIcon">
				<em></em><span>筛选查询</span>
				<span class="zdName">制度名称&nbsp;--</span>
				<span>{{fileName}}</span>
				<el-button type="primary" v-if="downLoadBtn" @click="downLoadTemplate">下载模板</el-button>
				<el-upload v-if="exportBtn" class="upload-demo exportUpload" ref="upload" :show-file-list="false" action=""  :http-request="uploadTemplate" multiple>
				  <el-button size="small" type="primary">上传附件</el-button>
				</el-upload>
				<el-button type="primary" v-if="deleteBtn" @click="deleteAll">删除列表</el-button>
				<el-button type="primary" v-if="createdBtn" @click="createFt">创建法条</el-button>
			</div>
		</div>
		<el-table :data="tableCont" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" row-key="id" border default-expand-all>
			<el-table-column prop="chapter" align="center" label="章节" width="180">
			</el-table-column>
			<el-table-column prop="clause" align="center" label="法条" width="180">
			</el-table-column>
			<el-table-column prop="content" align="left" label="制度内容">
			</el-table-column>
			<el-table-column v-if="handleShow" prop="address" align="center" width="120" label="操作">
				<template slot-scope="scope">
					<el-button  type="text" size="small">
						<el-button type="text" class='detail' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						<el-button type="text" class="edit" @click="tdEdit(scope.$index,scope.row)">编辑</el-button>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination style="text-align: center;margin-top: 16px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="total" ></el-pagination>
	</div>


  </el-container>
</template>
<script>
	import regulationsCheck from 'src/components/inCheck/inRegulationsCheck'
	import maskTable from 'src/components/inMaskTable/inMaskTable'
	import qs from 'qs'
  export default {
  	data() {
        return {
        	radios:'',
        	tableCont:[],
        	isHsow:false,
        	tableShow:false,
        	fileFlag:[],
        	fileName:'',//上传的文件名字
        	institutionId:'',//制度id,
        	fileId:'',//文件id
        	handleShow:true,//操作列是否显示
        	createdBtn:true,//创建法条按钮是否显示
        	exportBtn:true,//导出法条是否显示
        	deleteBtn:true,//删除法条是否显示
        	downLoadBtn:true,//下载模板按钮是否显示
        	faShow:false,
        	total:0,
        	saveAllData:{},
        	infoData:[],
        	singleTdTxt:{},
        	splitData:{
        		institutionId:'',
        		fileId:'',
        		pageSize:10,
        		pageNo:1
        	},
        	deleteSingleData:{
        		institutionId:'',
        		fileId:'',
        		id:''  //法条Id
        	},
        	deleteFileData:{

        	},
        	deleteAllData:{
        		institutionId:'',
        		fileId:'',
        		reviseId:''
        	},
        	saveAllData:{},
					tableData: []
				}
   },
    components:{
    		regulationsCheck,
    		maskTable
    },
    created(){
    		this.removeLocalStorage()
    },
    methods:{
    	//上传文件
        uploadFile(param){
        	var fileObj = param.file;
        	var form = new FormData();
        	const infoData = JSON.parse(localStorage.getItem('infoData'))
        	var id = infoData === null?'':infoData.institutionId
        	//设置保存时候的入参的制度id
    			const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
    			saveDatas.id = id;
        	form.append("file", fileObj);
          this.getInfoData();
        	form.append('id',id)
        	return this.$axios.post('instweb/saveFile',form).then((res)=>{
        		if(res.data.code === 200){
        			this.fileName = res.data.data.fileName;
        			this.tableData.push({
        				name:res.data.data.fileName,
        				fileId : res.data.data.FileId,
        				path : res.data.data.path
        			})
        			var fileKey = res.data.data.FileId;
        			this.fileFlag.push({
        				fileKey:fileKey+'_1'
        			})
        			const infoData = {
			    		'institutionId':'',//制度id
			    	};
			    		infoData.institutionId = res.data.data.id === undefined?'':res.data.data.id;
			    		infoData.fileId = res.data.data.FileId === undefined?'':res.data.data.FileId;
			    		infoData.reviseId = res.data.data.reviseId === undefined?'':res.data.data.reviseId;

			    		saveDatas.fileFlag = this.fileFlag;
			    		saveDatas.id = res.data.data.id === undefined?'':res.data.data.id;
			    		localStorage.setItem('infoData',JSON.stringify(infoData))
        			sessionStorage.setItem('saveDatas',JSON.stringify(saveDatas))
        		}
					})
        },
        getFileType(index,row){
        		const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
        		var str = this.fileFlag[index].fileKey;
        		str = this.fileFlag[index].fileKey.split('_')[0].toString();
        		str += '_' + row.radio;
        		saveDatas.fileFlag[index].fileKey = str;
        		sessionStorage.setItem('saveDatas',JSON.stringify(saveDatas))
        },
        //上传模板文件
        uploadTemplate(param){
        	const infoData = JSON.parse(localStorage.getItem('infoData'))
        	const fileID = localStorage.getItem('fileId')
        	var fileObj = param.file;
        	var form = new FormData();
        	form.append("file", fileObj);
        	form.append('fileId',fileID);
        	form.append('institutionId',infoData.institutionId)
        	return this.$axios.post('instweb/fileUpload',form).then((res)=>{
							//设置拆分时候入参用到的制度id 和 文件id
        			this.splitData.institutionId = res.data.data;
        			this.splitData.fileId = fileID;
	        		this.checkData(this.splitData)
					})
        },
        //查询法条数据
        checkData(data){
        	this.$axios.post('instweb/item/query',data).then((res)=>{
	        		this.tableCont = res.data.data.data === null?[]:res.data.data.data;
	        		this.total = res.data.data.data === null?0:res.data.data.totalPage / 1 *10;
					})
        },
        //创建法条 蒙版出现
    		createFt() {
    			localStorage.removeItem('singleData')
        	this.faShow = true;
				},
				//创建法条完毕，关闭蒙版
				closeMaskTable(data){
					this.faShow = data.status;
					if(data.handle === 'add'){
						this.getInfoData();
						this.splitData.institutionId = this.infoData.institutionId;
						this.splitData.fileId = localStorage.getItem('fileId');
						this.checkData(this.splitData)
					}
				},
				//下载法条模板
        downLoadTemplate(){
        	this.axios.post('tpl/download/101',qs.stringify({}),{responseType:'arraybuffer'}).then((res)=>{
						fileDownload(res, '法条模板.xlsx');
					})
        },
        //删除文件
        deleteFile(index,row){
	       	this.getInfoData();
        	this.deleteFileData.id = this.infoData.institutionId
        	this.deleteFileData.fileId = row.fileId;
        	this.$axios.post('instweb/delFile',this.deleteFileData).then((res)=>{
        		this.deleteFileData = {};
        		this.deleteFileData.institutionId = this.infoData.institutionId
        		this.deleteFileData.fileId = row.fileId;
        			if(res.data.code === 200){
        					this.tableData.splice(index,1)
        					this.tableShow = false;
        			}
					})
        },
        //拆分文件
        handleEdit(index,row){
        	this.tableShow = true
        	this.getInfoData();
        	this.splitData.institutionId = this.infoData.institutionId;
        	this.splitData.fileId = row.fileId;
        	localStorage.setItem('fileId',row.fileId)
        	this.checkData(this.splitData)
        },
        //删除单条制度
        handleDelete(index,row){
        	debugger;
        	this.getInfoData();
        	const fileID = localStorage.getItem('fileId')
        	this.deleteSingleData.id = row.id;
        	this.deleteSingleData.institutionId= this.infoData.institutionId;
        	this.deleteSingleData.fileId = fileID;
        	this.$axios.post('instweb/item/del',this.deleteSingleData).then((res)=>{
        		this.splitData.institutionId = this.infoData.institutionId;
        		this.splitData.fileId = fileID;
        			if(res.data.code === 200){
        				this.checkData(this.splitData)
        			}
					})
        },
        //删除所有法条
        deleteAll(){
        	const fileID = localStorage.getItem('fileId')
        	this.getInfoData();
        	this.deleteAllData.institutionId = this.infoData.institutionId;
        	this.deleteAllData.fileId = fileID;
        	this.deleteAllData.reviseId = this.infoData.reviseId;
        	this.$axios.post('instweb/item/delAll',this.deleteAllData).then((res)=>{
        			this.getInfoData();
		        	this.deleteAllData.institutionId = this.infoData.institutionId;
		        	this.deleteAllData.fileId = fileID;
		        	this.deleteAllData.reviseId = this.infoData.reviseId;
        			this.checkData(this.deleteAllData)
        	})
        },
        tdEdit(index,row){
        	this.getInfoData();
        	this.singleTdTxt.institutionId = this.infoData.institutionId;
        	this.singleTdTxt.chapter = row.chapter;
        	this.singleTdTxt.clause = row.clause;
        	this.singleTdTxt.content = row.content;
        	this.singleTdTxt.fileId = row.fileId;
        	this.singleTdTxt.id = row.id;
        	this.singleTdTxt.type = 1;
        	localStorage.setItem('singleData',JSON.stringify(this.singleTdTxt))
        	this.faShow = true;
        },
        getInfoData(){
        	var infoData = JSON.parse(localStorage.getItem('infoData'));
        	this.infoData = infoData;
        },
        removeLocalStorage(){
        	localStorage.removeItem('singleData');
        	localStorage.removeItem('infoData');
        	localStorage.removeItem('fileId');
        },
        handleSizeChange (value) {
        	//下一页请求数据
	      	this.getInfoData();
					this.splitData.institutionId = this.infoData.institutionId;
					this.splitData.fileId = localStorage.getItem('fileId');
					this.splitData.pageNo = value;
					this.checkData(this.splitData)
	      },
	      handleCurrentChange (value) {
	      	//下一页请求数据
	      	this.getInfoData();
					this.splitData.institutionId = this.infoData.institutionId;
					this.splitData.fileId = localStorage.getItem('fileId');
					this.splitData.pageNo = value;
					this.checkData(this.splitData)
	      },
        saveAll(){
        	const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
        	this.$axios.post('instweb/saveBase',saveDatas).then((res)=>{
        		this.$router.push({
				        path:'/repository/in-manage',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
						          '':'' ,
						        }
						  })
        	})
        },
        submitAll(){
        	const saveDatas = JSON.parse(sessionStorage.getItem('saveDatas'))
        	this.$axios.post('instweb/submit',saveDatas).then((res)=>{
        		this.$router.push({
				        path:'/repository/in-manage',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
						          '':'' ,
						        }
						  })
        	})
        }
    }
  };
</script>
<style lang="scss">
	.header{
		padding-left: 218px;
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
	}
	.exportUpload{
		float: right;
	}
	.edit,.detail{
		float: right;
		display: block;
		padding:0;
		background: transparent;
		border: none;
	}
	.edit{
		color:#4285F4;
	}
	.detail{
		color: #FF2B2B;
	}
	.detail:visited{
		color: #FF2B2B;
	}
	.edit{
		margin-right: 20px;
	}
	.container{
		padding-top: 20px;
	}
	.section-dealise{
				font-size:14px;
	    	.titIcon{
		    		em{
		    			display: inline-block;
		    			width: 2px;
		    			height: 14px;
		    			background: #4285F4;
		    			vertical-align: middle;
		    			margin-right: 6px;
		    		}
		    		.zdName{
		    			margin-left: 20px;
		    		}
		    		.el-button--primary{
		    			float: right;
		    			padding:6px 10px;
		    			font-size: 12px;
		    			margin-right: 20px;
		    			margin-left: 0;
		    			margin-top: 20px;
		    		}
		    	}
	    }
    .render{
    	.el-breadcrumb{
	    		margin-bottom: 16px;
	    	}
	    	.box{
		    	min-height: 300px;
		    	background: #fff;
		    	padding: 16px 16px 0 16px;
		    	-webkit-box-shadow: 4px 2px 6px #888;
		    	margin-top: 2px;
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
		    	}
	    }
	    .el-tabs__active-bar{
	    	display: none;
	    }
    	.is-active{
	    	background: #4285F4!important;
	    	color: #fff!important;
	    	text-align: center;
	    }
    }
    .exportBtn,.newBuildBtn{
    	  float: right;
    	  margin-right: 5px;
		    width: 68px;
		    height: 26px;
		    padding: 0;
		    font-size: 12px;
    }
    .exportBtn{
    	margin-right: 20px;
    }

		.el-table__row {
			text-indent: 0px;
		}

		t-body {
			text-indent: 0px;
		}
	.section-rowdccs {
		margin-bottom: 50px;
		padding: 0 10px 10px;
		background: #FFFFFF;
		box-shadow: 4px 2px 6px #888;
		border-radius: 8px;
		top: 56px;
		display: flex;
		position: relative;
		flex-direction: column;
	}
	.section-dealise{
		line-height: 70px;
	}
	.el-table--border td,
	.el-table--border th {
		border-right: none;
	}
	.mbtm20 {
		margin-top: 20px;
		.cell {
			text-align: center;
		}
	}

</style>
