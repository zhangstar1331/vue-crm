<template>
	<div id="dfCOnt">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:13px">
			<el-breadcrumb-item id="top" class='separator-id'><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
			<el-breadcrumb-item class='separator-ic'><span class="bread" @click="turnDown()">{{detailName}}</span></el-breadcrumb-item>
			<el-breadcrumb-item class='separator-ie'>东方制度详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="sister-base">基础信息</div>
		<!--基础信息-->
		<div class="sister-title">
			<el-row>
				<el-col :span="8" style="padding-left:20px">
					<div class="grid-content bg-purple">
						<el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
							<el-form-item label="制度文号：" prop="region" required>
								<span>{{dfwindow}}</span>
							</el-form-item>
							<el-form-item label="有效期限：" required>
								<span>{{endDate == '3019-12-12'?'长期有效':endDate}}</span>
							</el-form-item>
							<el-form-item label="适用类型：" class="nameCss" required>
								<span>{{suitType}}</span>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="8" style="text-align: left;">
					<div class="grid-content bg-purple">
						<el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
							<el-form-item label="维护部门：" required prop="name">
								<span>{{departmentName}}</span>
							</el-form-item>
							<el-form-item label="发布日期：" prop="startDate" required>
								<span>{{issuedDate}}</span>
							</el-form-item>
							<el-form-item label="录入人员：" prop="operatorName">
								<span>{{operatorName}}</span>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<el-col :span="8" style="padding-left:20px">
					<div class="grid-content bg-purple">
						<el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
							<el-form-item label="生效日期：" required>
								<span>{{startDate}}</span>
							</el-form-item>
							<el-form-item label="制度名称：" class="nameCss" required>
								<span>{{name}}</span>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
				<!--<el-col :span="8">
	      	<div class="grid-content bg-purple">
		      	<el-form  :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic">
	            <el-form-item label="生效日期：" required>
		              <span>{{startDate}}</span>
		          </el-form-item>
		      		<el-form-item label="制度名称："required>
	              <span>{{name}}</span>
	            </el-form-item>
		      	</el-form>
	      	</div>
	      </el-col>-->
			</el-row>
		</div>
		<!--相关文件-->
		<div class="section-rowdcc" style="width: 100%">
			<div class="section-dealis">相关文件</div>
			<el-table :header-cell-style="getRowClass" :data="tableData" style="width:100%;margin:46px 0px 10px; background: #F9F9F9; border: 1px solid #E9E9E9;text-indent: 0px;" :row-class-name="tableRowClassName">
				<el-table-column prop="date" label="序号" width="100" type="index" :index="indexMethod" style="background: #F9F9F9; text-indent: 0px">
				</el-table-column>
				<el-table-column prop="name" @click.native="editSubmit(scope)" label="文件名" width="500" style="text-indent:125px; background: #F9F9F9;">
					<template slot-scope="scope">
						<el-button @click.native.prevent="loadFile(scope.$index, scope.row)" type="text" size="small">
							{{scope.row.name}}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="文件类型" @click.native.prevent="deleteRow(scope.$index,tableData)" style="text-indent: 271px;background: #F9F9F9;">
					<template slot-scope="scope">
						<el-button type="text" size="small">
							{{scope.row.type==1?"制度":"附件"}}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="addresse" label="操作" style="text-indent:271px;background: #F9F9F9;">
					<template slot-scope="scope">
						<el-button @click="change(scope.row)" type="text" size="small">
							查看拆分详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--拆分导入-->
		<div class="dfSection-rowdccs" id="dfSection-rowdccs" v-show="isShow">
			<div>
				<div class="section-dealise" style="font-weight: 700;">拆分导入</div>
				<div class="chrome-cli">{{name}} -- {{fileName}}</div>
			</div>
			<el-table :data="tableDatas" style="width: 100%;text-indent: 25px;background: #F9F9F9;
      border: 1px solid #E9E9E9;" row-key="id" border :header-cell-style="getRowClass" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
				<el-table-column prop="chapter" label="章节" width="240"></el-table-column>
				<el-table-column prop="clause" label="法条" width="180"></el-table-column>
				<el-table-column prop="content" label="制度内容"></el-table-column>
			</el-table>
			<el-pagination style="text-align: center;margin-top: 16px;" :current-page.sync="currentPage" background layout="prev, pager, next" prev-text="上一页" next-text="下一页" :total="totalPage" @size-change="" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<!--修订记录-->
		<div class="section-rowdccEnd" v-if="panelShow">
			<div class="section-dealisEnd">维护记录</div>
			<el-table :data="tableDatass" :header-cell-style="getRowClass" style="width: 100%;margin: 66px 10px 20px; background: #FFFFFF; border: 1px solid #E9E9E9;" :row-class-name="tableRowClassName">
				<el-table-column prop="date" label="序号" type="index" :index="indexMethod" width="100" style="
         text-indent: 0;background: #F9F9F9;
    border: 1px solid #E9E9E9;">
				</el-table-column>
				<el-table-column prop="fileName" label="制度文号" width="180" style="text-indent: 125px;">
				</el-table-column>
				<el-table-column prop="name,fileName" label="制度名称" style="text-indent: 271px;">
					<template slot-scope="scope">
						<span class="wgSpan textOverFlow" :title="scope.row.name" style="color: #4285F4;" :class="[scope.row.status == 9?'disabled':'']" @click="jumpLog(scope.$index,scope.row)"> <span v-show="scope.row.status == 3" class="wgSpan fzCss">废止</span>{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="startDate" label="生效日期" width="280" style="text-indent: 125px;">
				</el-table-column>
				<el-table-column prop="issueDate" label="发布日期" width="280" style="text-indent: 125px;">
				</el-table-column>
			</el-table>
		</div>
		<div class="section-scry" id="dfSectionBtn">
			<span class="section-return" @click="turnDown()">返回</span>
			<span class="section-beauted" v-if="reserveBtn" @click="reverseFt()">维护</span>
			<span class="section-edit" v-if="editBtn" @click="edit()">编辑</span>
		</div>
	</div>
</template>
<script>
import { fileDownload, fileNameCombine } from 'src/utils/utils.js'
import { mapState, mapActions } from 'vuex'
import qs from 'qs'
export default {
	name: 'newDetails',
	data() {
		return {
			operatorName: '',
			//基础信息
			totalPage: 0,
			id: [],
			editBtn: false,
			panelShow: true,
			reserveBtn: true,
			chapter: '',
			isShow: false,
			publish: '',
			department: '',
			startDates: '',
			issuedDate: '',
			detailName: '',
			endtimes: '',
			baseForm: [],
			categor: '',
			suitType: '',
			name: '',
			dynamicValidateForm: {
				domains: [{
					value: ''
				}],
				email: ''
			},
			dfwindow: '',
			ruleForm: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			},
			currentPage: 1, //初始页
			pagesize: 10, //每页的数据
			userList: [],
			fileId: "",
			tableDatass: [],
			tableData: [],
			tableDatas: [],
			outName: '',
			outFileNo: '',
			startDate: '',
			institutionId: [],
			categors: '',
			riskLevel: '',
			departmentName: '',
			fileName: '', //上传的文件名字
			endDate: ''
		}
	},
	created() {
		let ic = this.getUrlParam('ic');
		let fz = this.getUrlParam('fz');
		let whFlag = this.getUrlParam('whFlag')
		var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
		if (ic == '1' && handleIds.indexOf('1_cdfed') > -1) {
			this.panelShow = false;
			this.reserveBtn = false;
			if (whFlag != 1) {
				this.editBtn = true;
			}
		}
		if (handleIds.indexOf('1_cdfr') == -1 || ic == '1' || fz == '3' || fz == '1') {
			this.reserveBtn = false;
		}
	},
	mounted() {
		let id = this.$route.query.id
		this.init(id)
	},
	computed: {
		...mapState(['companySource']),
	},
	watch: {
		$route(to, from) {
			if (to.fullPath.includes('fz') || to.fullPath.includes('whFlag')) {
				this.editBtn = false;
				this.reserveBtn = false;
				return;
			}
			var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
			if (handleIds.indexOf('1_cdfr') > -1) {
				this.reserveBtn = true;
			}
			this.editBtn = false;
		}
	},
	methods: {
		init(id) {
			this.axios.post('/instweb/detail',
				JSON.stringify({
					"id": id,
					"key": "1",
					"type": "3"
				}), { headers: { 'Content-Type': 'application/json' } }
			).then((res) => {
				if (res.code == 200) {
					// 判断是从东方制度进来的还是从待维护制度库东方制度进来的
					if (this.$route.query.ic == 1) {
						if (this.companySource == '1') {
							this.detailName = '制度库（编辑中）';
						} else {
							this.detailName = '待维护制度库';
						}
						this.detailLang = '东方详情'
					} else {
						this.detailName = '东方制度库管理';
						this.detailLang = '东方制度详情'
					}
					if (res.data.file != undefined) {
						this.fileName = res.data.file[0].name;
						/*存id*/
						this.id = res.data.file;
					}
					this.operatorName = res.data.operatorName
					if (res.data.fileNoFoot == undefined || res.data.fileNoHead == undefined || res.data.fileNoBody == undefined) {
						res.data.fileNoFoot == '8.5.2';
						res.data.fileNoHead == '中东发';
						res.data.fileNoBody == '2019'
					}
					this.tableData.push({
						name: res.data.fileName,
					})
					this.dfwindow = res.data.fileNoHead + ' [ ' + res.data.fileNoBody + ' ] ' + res.data.fileNoFoot + '号'
					this.tableData = res.data.file;
					this.tableDatass = res.data.log;
					//维护部门
					this.department = res.data.department;
					//制度名称
					this.name = res.data.name;
					//发文机关
					this.publish = res.data.publish;
					//回填适用范围
					if (res.data.dfCategory == '1') {
						this.suitType = '执行类'
					} else {
						this.suitType = '参照类'
					}

					if (res.data.log != undefined) {
						res.data.log.forEach((item, index) => {
							let fileName = item.fileNoHead + ' [ ' + item.fileNoBody + ' ] ' + item.fileNoFoot + '号'
							this.tableDatass[index].fileName = fileName
						})
					}

					//拿生效日期
					this.startDate = res.data.startDate
					this.startDates = res.data.startDate;
					//issuedDate颁布日期
					this.issuedDate = res.data.issuedDate;
					this.departmentName = res.data.departmentName;
					//拿有效期限
					this.endDate = res.data.endDate;
					// var daste =res.data.query.data=='null'?[]:res.data.query.data
					const { daste } = []
					if (res.data.query == null) {
						return daste
					} else {
						this.daste = res.data.query.data
					}
					this.tableDatas = daste;
					if (res.data.query.data != null) {
						this.fileId = res.data.query.data[0].fileId
					}

					//	          this.totalPage=parseInt(res.data.query.totalResults)
					//管理类别
					if (res.data.riskLevel == 1) {
						this.riskLevel = '公司治理类'
					} else if (res.data.riskLevel == 2) {
						this.riskLevel = '行政管理类'
					} else if (res.data.riskLevel == 3) {
						this.riskLevel = '人力资源管理类'
					} else if (res.data.riskLevel == 4) {
						this.riskLevel = '财务管理类'
					} else if (res.data.riskLevel == 11) {
						this.riskLevel = '其他类'
					} else if (res.data.riskLevel == 5) {
						this.riskLevel = '战略管理类'
					} else if (res.data.riskLevel == 6) {
						this.riskLevel = '资金运用类'
					} else if (res.data.riskLevel == 7) {
						this.riskLevel == '风险管理类'
					} else if (res.data.riskLevel == 8) {
						this.riskLevel = '合规法务类'
					} else if (res.data.riskLevel == 9) {
						this.riskLevel = '稽核审计类'
					} else if (res.data.riskLevel == 10) {
						this.riskLevel = '监察类'
					}

					//风险类别
					if (res.data.manageCategory == '01') {
						this.categors = '一级'
					} else if (res.data.manageCategory == '02') {
						this.categors = '二级'
					} else if (res.data.manageCategory == '03') {
						this.categors = '三级'
					} else if (res.data.manageCategory == '04') {
						this.categors = '四级'
					}

					//拿制度类别
					if (res.data.category == '04') {
						this.categor = '部门规章'
					} else if (res.data.category == '01') {
						this.categor = '法律'
					} else if (res.data.category == '02') {
						this.categor = '行政法规'
					} else if (res.data.category == '03') {
						this.categor = '地方性法规'
					} else if (res.data.category == '00') {
						this.categor = '全部'
					} else if (res.data.category == '05') {
						this.categor = '规范性文件'
					}
				} else {
					this.$alert(res.message, '提示', {
						confirmButtonText: '确定'
					});
				}
			})
		},
		loadFile(index, row) {
			var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
			if (!(handleIds.indexOf('1_cdfdl') > -1)) {
				return;
			}
			var obj = new Object()
			obj.filePath = row.url;
			obj.fileName = encodeURIComponent(row.name);
			this.axios.post('comm/download/103', qs.stringify(obj), { responseType: 'arraybuffer' }).then((res) => {
				fileDownload(res, fileNameCombine(row.name, row.url));
			})
			//  	 	window.open(this.serveUrl+"/instweb/download/institutionfile?url="+row.url+"&fileName="+encodeURIComponent(row.name));
		},
		jumpLog(index, row) {
			this.isShow = false;
			if (row.status == 2) {
				//有效
				var element = document.getElementById("top");
				element.scrollIntoView({ block: 'start', behavior: "smooth" });
				this.init(row.id);
				var handleIds = JSON.parse(sessionStorage.getItem('handleData'))
				if (handleIds.indexOf('1_cdfr') > -1) {
					this.reserveBtn = true;
				}
			} else if (row.status == 3) {
				var element = document.getElementById("top");
				element.scrollIntoView({ block: 'start', behavior: "smooth" });
				// 废止
				this.init(row.id)
				this.reserveBtn = false;
			} else if (row.status == 9) {
				this.reserveBtn = false;
			}
			this.init(row.id)
			if (row.status == 3) {
				this.$router.push({
					path: '/dfnewDetail', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						'id': row.id,
						'fz': 1
					}
				})
			} else {
				this.$router.push({
					path: '/dfnewDetail', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						'id': row.id
					}
				})
			}

		},
		reverseFt() {
			let id = this.$route.query.id;
			this.$router.push({
				path: '/dfReverse', //跳转的路径
				query: { //路由传参时push和query搭配使用 ，作用时传递参数
					id: id
				}
			})
		},
		edit() {
			let id = this.$route.query.id;
			this.$router.push({
				path: '/dfReverseEdit', //跳转的路径
				query: { //路由传参时push和query搭配使用 ，作用时传递参数
					id: id
				}
			})
		},
		//返回
		turnDown() {
			function getUrlParam(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			}
			getUrlParam('ic');
			var ic = getUrlParam('ic');

			if (ic == 1) {
				this.$router.push({ path: '/repository/white-manage', query: { 'id': '1_cdw' } });
			} else {
				this.$router.push({ path: '/repository/df-manage', query: { 'id': '1_cdf' } });
			}
		},
		//修订外规
		turnDowns() {
			function getUrlParam(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			}
			getUrlParam('ic');
			var ic = getUrlParam('ic');
			this.$router.push({ path: '/repository/df-manage' });

		},
		//获取参数
		getParams() {
			// 取到路由带过来的参数
			const routerParams = this.$route.params.state
		},
		/*索引值*/
		indexMethod(index) {
			return index + 1;
		},
		//    deleteRow(){
		//      this.isShow = true;
		//    },
		change(row) {
			this.currentPage = 1;
			this.filename = row.name
			let institutionId = this.$route.query.id
			let id = row.id
			this.fileId = row.id;
			this.tableDatas = [];
			this.axios.post('instweb/item/query',
				JSON.stringify({
					"fileId": id,
					"institutionId": institutionId,
					"key": "1",
					resolve: 0
				}), { headers: { 'Content-Type': 'application/json' } }
			).then((res) => {
				if (res.code == 200) {
					this.fileName = row.name;
					this.isShow = true
					if (res.data.data == null) {
						this.tableDatas = [];
						this.totalPage = res.data.data === null ? 0 : res.data.totalPage / 1 * 10;
						return
					} else {
						this.tableDatas = res.data.data;
						this.totalPage = res.data.data === null ? 0 : res.data.totalPage / 1 * 10;
						this.currentPage = 1;
					}
				} else {
					this.$alert(res.message, '提示', {
						confirmButtonText: '确定'
					});
				}

			})
		},
		getUrlParam(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		removeDomain(item) {
			var index = this.dynamicValidateForm.domains.indexOf(item)
			if (index !== -1) {
				this.dynamicValidateForm.domains.splice(index, 1)
			}
		},
		tableRowClassName({ row, rowIndex }) {
			if (rowIndex === 1) {
				return 'warning-row';
			} else if (rowIndex === 3) {
				return 'success-row';
			}
			return '';
		},
		handleSizeChange(value) {
			this.currentpage = value;
			this.getfatiao();
		},
		handleCurrentChange(value) {
			this.currentpage = value;
			this.getfatiao()
		},
		getfatiao() {
			const { currentpage } = this;

			this.axios.post(
				'instweb/item/query', JSON.stringify({
					"institutionId": this.$route.query.id,
					"pageNo": currentpage,
					"pageSize": 10,
					"fileId": this.fileId,
					"key": "1",
					"resolve": 0
				}), { headers: { 'Content-Type': 'application/json' } }).then((res) => {
				if (res.code == 200) {
					var daste = res.data.data;
					this.tableDatas = daste == null ? [] : daste;
				} else {
					this.$alert(res.message, '提示', {
						confirmButtonText: '确定'
					});
				}
			})
		},
		addDomain() {
			this.dynamicValidateForm.domains.push({
				value: '',
				key: Date.now()
			});
		},
		//设置表格第一行的颜色
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return 'background:#F9F9F9'
			} else {
				return ''
			}
		}
	},
}
</script>
<style>
#dfCOnt .nameCss {
	display: inline-block;
	width: 80%;
}
#dfCOnt .bread:hover {
	cursor: pointer;
}
#dfCOnt .section-scry span {
	cursor: pointer;
}
#dfCOnt .el-table__empty-block {
	background: #fff;
}
#dfCOnt #dfCont .el-col {
	text-align: left;
}
.disabled {
	pointer-events: none;
	cursor: default;
	color: #9B9B9B !important
}
#dfCOnt .wgSpan {
	cursor: pointer;
}
#dfCOnt .fzCss {
	display: inline-block;
	width: 38px;
	height: 18px;
	line-height: 18px;
	text-align: center;
	color: #FFFFFF;
	background: #FF6363;
	font-size: 12px;
	margin-right: 10px;
}
/*按钮*/
#dfCOnt #dfSectionBtn {
	text-align: center;
	margin-top: 40px;
	margin-bottom: 36px;
}
#dfSectionBtn span {
	display: inline-block;
	width: 68px;
	height: 26px;
	line-height: 26px;
	font-size: 14px;
	background: #4285F4;
	color: #fff;
	margin-right: 20px;
	border-radius: 3px;
}
#dfCOnt /deep/ .el-table th {
	white-space: nowrap;
	overflow: hidden;
	-webkit-user-select: none;
	user-select: none;
	text-align: center;
}
#dfCOnt /deep/.el-table td,
.el-table th {
	padding: 12px 0;
	min-width: 0;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	text-overflow: ellipsis;
	vertical-align: middle;
	position: relative;
	text-align: center;
}
#dfCOnt .el-table_6_column_30 is-leaf {
	text-indent: -1px;
}
#dfCOnt .chrome-cli {
	text-indent: 90px;
	padding-bottom: 29px;
	margin-top: -46px;
	font-size: 14px;
}
#dfCOnt thead {
	background: #F9F9F9;
}
#dfCOnt .el-form-item {
	margin-bottom: 20px;
}
#dfCOnt .el-form-item__label {
	font-family: PingFangSC-Regular;
	color: #303030;
	letter-spacing: 0;
	line-height: 42px;
}
#dfCOnt .sister-title {
	background: #FFFFFF;
	box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
	border-radius: 8px;
	margin-top: 19px;
	padding-top: 41px;
}
#dfCOnt .sister-title .el-col:last-child {
	text-align: left;
}
#dfCOnt .sister-title .el-form-item__label {
	padding-right: 0 !important;
}
#dfCOnt .sister-base {
	font-family: PingFangSC-Medium;
	font-size: 14px;
	letter-spacing: 0;
	line-height: 21px;
	border-width: 0px;
	position: absolute;
	left: 20px;
	top: 45px;
	width: 1336px;
	height: 21px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	font-style: normal;
	font-weight: 600;
	text-align: left;
	border-left: solid 2px rgba(0, 121, 254, 1);
	text-indent: 9px;
}

#dfCOnt .section-beauted {
	background: #4285F4;
	border-radius: 3px;
	width: 68px;
	height: 26px;
	text-align: center;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #FFFFFF;
	letter-spacing: 0;
	text-align: center;
	line-height: 25px;
}
#dfCOnt .section-edit {
	background: #4285F4;
	border-radius: 3px;
	width: 68px;
	height: 26px;
	text-align: center;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #FFFFFF;
	letter-spacing: 0;
	text-align: center;
	line-height: 25px;
}
#dfCOnt .section-return {
	background: #4285F4;
	border-radius: 3px;
	width: 68px;
	height: 26px;
	text-align: center;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	margin-right: 12px;
	color: #FFFFFF;
	letter-spacing: 0;
	line-height: 25px;
}
#dfCOnt .section-dealisEnd {
	font-family: PingFangSC-Medium;
	font-size: 14px;
	letter-spacing: 0;
	line-height: 17px;
	border-width: 0px;
	position: absolute;
	left: 30px;
	top: 26px;
	width: 1336px;
	height: 18px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	font-style: normal;
	font-weight: 600;
	text-align: left;
	border-left: solid 2px rgba(0, 121, 254, 1);
	text-indent: 9px;
}
#dfCOnt .section-rowdccEnd {
	background: #FFFFFF;
	box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
	border-radius: 8px;
	display: flex;
	position: relative;
	padding: 20px;
	margin-top: 20px;
}
#dfCOnt t-body {
	text-indent: 0px;
}
#dfCOnt .section-dealis {
	font-family: PingFangSC-Medium;
	font-size: 14px;
	letter-spacing: 0;
	line-height: 20px;
	border-width: 0px;
	position: absolute;
	left: 30px;
	top: 29px;
	width: 1336px;
	height: 20px;
	display: flex;
	font-style: normal;
	font-weight: 600;
	text-align: left;
	border-left: solid 2px rgba(0, 121, 254, 1);
	text-indent: 9px;
}
#dfCOnt .section-dealise {
	font-family: PingFangSC-Medium;
	font-size: 14px;
	color: #515151;
	letter-spacing: 0;
	line-height: 20px;
	border-width: 0px;
	position: absolute;
	left: 30px;
	top: 32px;
	width: 1336px;
	height: 20px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	font-style: normal;
	font-weight: 550;
	text-align: left;
	text-indent: 9px;
	z-index: 1000;
	border-left: solid 2px rgba(0, 121, 254, 1);
}
#dfCOnt .section-rowdcc {
	text-indent: 48px;
	background: #FFFFFF;
	box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
	border-radius: 8px;
	display: flex;
	padding: 20px;
	position: relative;
	margin-top: 20px;
}
#dfCOnt .dfSection-rowdccs {
	padding: 80px 20px 20px;
	background: #FFFFFF;
	box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
	border-radius: 8px;
	display: flex;
	position: relative;
	flex-direction: column;
	margin-top: 20px;
}
#dfSection-rowdccs .el-table__body-wrapper /deep/ tr td:last-of-type>.cell {
	white-space: pre-line !important;
	text-indent: 0 !important;
	text-align: left !important;
	padding-left: 5%;
}
#dfCOnt #dfSection-rowdccs .el-table__body-wrapper /deep/ tr td {
	text-align: center;
	text-indent: 0;
	border-right: none !important;
}
#dfCOnt #dfSection-rowdccs .el-table__header /deep/ th {
	border-right: none !important;
}
#dfSection-rowdccs .el-table__header /deep/ th>.cell {
	text-align: center;
	float: left !important;
	text-indent: 0;
}
#dfCOnt .el-form-item .el-form-item__content {
	width: 100%;
}
#dfCOnt .el-breadcrumb__inner {
	color: #909191 !important;
	font-weight: 700;

}
#dfCOnt .separator-ie span {
	color: #4285F4 !important;
	font-weight: 700;
}
.textOverFlow {
	width: 80%;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

</style>
