<template>
	<div id="punishNotice">
		<div class="maskBox">
			<el-tag @close="backFunc" closable class="tag1"></el-tag>
			<div class="orglist">
				<div class="titIcon fontWeight"><em></em><span style="font-weight: 600;" v-if="noticeType==1">关联检查事项</span><span style="font-weight: 600;" v-if="noticeType==2">关联行政处罚事先告知书</span><span style="font-weight: 600;" v-if="noticeType==3">关联涉刑案件</span></div>
				<div v-if="noticeType == 1">
					<supervise-checkCX isNotice="1" isFlag="1"></supervise-checkCX>
					<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" @row-click="rowClick">
						<el-table-column width="50">
							<template slot-scope="scope">
								<el-radio :label="scope.row.id" v-model="sourceId">&nbsp;</el-radio>
							</template>
						</el-table-column>
						<el-table-column prop="sn" label="监管检查事项编号" align="center">
							<template slot-scope="scope">
								<span :title="scope.row.sn" class="textOverFlow">{{scope.row.sn == null||scope.row.sn == ''?'--':scope.row.sn}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="thingName" label="检查事项" align="center" width="100">
							<template slot-scope="scope">
								<span :title="scope.row.thingName" class="textOverFlow">{{scope.row.thingName == null||scope.row.thingName == ''?'--':scope.row.thingName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="subjectType" label="实施主体类型" align="center">
							<template slot-scope="scope">
								<span>{{scope.row.subjectType == null||scope.row.subjectType == ''?'--':subjectList.find(item =>{ return item.id == scope.row.subjectType}).name}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="orgName" label="被检查机构" align="center">
							<template slot-scope="scope">
								<span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null||scope.row.orgName == ''?'--':scope.row.orgName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="startDate" label="检查开始时间" align="center">
							<template slot-scope="scope">
								<span>{{scope.row.startDate == null||scope.row.startDate == ''?'--':timeFormat(scope.row.startDate)}}</span>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background layout="prev,pager,next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
				</div>
				<div v-if="noticeType == 2">
					<punish-checkCX isNotice="1" isFlag="1"></punish-checkCX>
					<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" @row-click="rowClick">
						<el-table-column width="50">
							<template slot-scope="scope">
								<el-radio :label="scope.row.id" v-model="sourceId">&nbsp;</el-radio>
							</template>
						</el-table-column>
						<el-table-column label="行政处罚事先告知书信息编号" align="center" prop="sn">
							<template slot-scope="scope">
								<span :title="scope.row.sn" class="textOverFlow">{{scope.row.sn == null||scope.row.sn == ''?'--':scope.row.sn}}</span>
							</template>
						</el-table-column>
						<el-table-column label="拟处罚类型" align="center" prop="punishType" width="100">
							<template slot-scope="scope">
								<span>{{scope.row.punishType == null||scope.row.punishType == ''?'--':punishList.find(item =>{ return item.id == scope.row.punishType}).name}}</span>
							</template>
						</el-table-column>
						<el-table-column label="拟处罚概述" align="center" prop="overView">
							<template slot-scope="scope">
								<span :title="scope.row.overView" class="textOverFlow">{{scope.row.overView == null||scope.row.overView == ''?'--':scope.row.overView}}</span>
							</template>
						</el-table-column>
						<el-table-column label="行政处罚事项告知书落款时间" align="center" prop="lkDate">
							<template slot-scope="scope">
								<span>{{scope.row.lkDate == null||scope.row.lkDate == ''?'--':timeFormat(scope.row.lkDate)}}</span>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background layout="prev,pager,next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
				</div>
				<div v-if="noticeType == 3">
					<justice-check isNotice="1" isFlag="1"></justice-check>
					<el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;" @row-click="rowClick">
						<el-table-column width="50">
							<template slot-scope="scope">
								<el-radio :label="scope.row.id" v-model="sourceId">&nbsp;</el-radio>
							</template>
						</el-table-column>
						<el-table-column label="案件信息编号" align="center" prop="sn">
							<template slot-scope="scope">
								<span :title="scope.row.sn" class="textOverFlow">{{scope.row.sn == null||scope.row.sn == ''?'--':scope.row.sn}}</span>
							</template>
						</el-table-column>
						<el-table-column label="案件名称" align="center" prop="punishType" width="100">
							<template slot-scope="scope">
								<span>{{scope.row.punishType == null||scope.row.punishType == ''?'--':puninshType[scope.row.punishType]}}</span>
							</template>
						</el-table-column>
						<el-table-column label="案件类型" align="center" prop="overView">
							<template slot-scope="scope">
								<span :title="scope.row.overView" class="textOverFlow">{{scope.row.overView == null||scope.row.overView == ''?'--':scope.row.overView}}</span>
							</template>
						</el-table-column>
						<el-table-column label="案件发生时间" align="center" prop="lkDate">
							<template slot-scope="scope">
								<span>{{scope.row.lkDate == null||scope.row.lkDate == ''?'--':timeFormat(scope.row.lkDate)}}</span>
							</template>
						</el-table-column>
						<el-table-column label="案件专报时间" align="center" prop="lkDate">
							<template slot-scope="scope">
								<span>{{scope.row.lkDate == null||scope.row.lkDate == ''?'--':timeFormat(scope.row.lkDate)}}</span>
							</template>
						</el-table-column>
						<el-table-column label="案件发生机构" align="center" prop="lkDate">
							<template slot-scope="scope">
								<span>{{scope.row.lkDate == null||scope.row.lkDate == ''?'--':timeFormat(scope.row.lkDate)}}</span>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background layout="prev,pager,next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
				</div>
				<el-button type="primary" class="search" @click="goSave">确定</el-button>
				<p class="textTip" v-if="noticeType==1">*如未查询到相关联的检查事项，请先将检查事项报送至生效库。</p>
				<p class="textTip" v-if="noticeType==2">*如未查询到相关联的行政处罚事先告知书，请先将行政处罚事先告知书报送至生效库。</p>
				<p class="textTip" v-if="noticeType==3">*如未查询到相关联的涉刑案件，请先将涉刑案件报送至生效库。</p>
			</div>
		</div>
	</div>
</template>

<script>
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import superviseCheckCX from 'src/components/infoManage/superviseCheckCX'
	import punishCheckCX from 'src/components/infoManage/punishNoticeCheck'
	import justiceCheck from 'src/components/infoManage/justiceCheck'
	import { mapState } from 'vuex'
	import qs from 'qs'
	export default {
		props:["noticeType"],
	    data () {
	    	return {
		        tableData:[],
		        currentPage:1,
		        totalResults:0,
		        pageNo:1,
		        pageSize:10,
				sourceId:"",
				sourceName:"",
	      	}
	    },
	    created () {
	    	Bus.$off('formDatas')
			Bus.$on('formDatas', (data) => {
				this.totalResults = data.totalResults == undefined ? 1 : data.totalResults;
				this.tableData = []
				this.tableData = data.data == undefined ? [] : data.data
				this.currentPage = data.currentPage == undefined ? 1 : data.currentPage;
			})
	    },
		computed: {
			...mapState(['subjectList','punishList']),
		},
	    components:{
	    	superviseCheckCX,
	    	punishCheckCX,
			justiceCheck
	    },
	    methods: {
			rowClick(row,type){
				this.sourceId = row.id
				if(row.overView){
					this.sourceName = row.overView
				}
				if(row.thingName){
					this.sourceName = row.thingName
				}
			},
	    	backFunc(){
	    		this.$emit('closeMask',{status:false,})
				sessionStorage.removeItem('askData1')
			},
			goSave(){
				this.$emit('closeMask',{status:false,sourceId:this.sourceId,sourceName:this.sourceName})
				sessionStorage.removeItem('askData1')
			},
			handleSizeChange (value) {
		        var askData = JSON.parse(sessionStorage.getItem('askData1'))
				askData.pageNo = value;
				sessionStorage.setItem('askData1', JSON.stringify(askData))
				this.refresh()
		    },
		    handleCurrentChange (value) {
		        var askData = JSON.parse(sessionStorage.getItem('askData1'))
				askData.pageNo = value;
				sessionStorage.setItem('askData1', JSON.stringify(askData))
				//下一页请求数据
				this.refresh()
		    },
		    refresh() {
				var askData = JSON.parse(sessionStorage.getItem('askData1'))
				let path = ""
				switch (this.noticeType){
					case 1:
						path = "cx_supervise/query"
						break;
					case 2:
						path = "cx_penalizeNotice/query"
						break;
					case 3:
						path = "cx_penalizeNotice/query"
						break;
				}
				this.axios.post(path, JSON.stringify(askData), {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then((res) => {
					if (res.code == 200) {
						if (res.data != null) {
							this.totalResults = res.data.totalResults
							this.tableData = []
							this.tableData = res.data.data == undefined ? [] : res.data.data
							this.currentPage = res.data.currentPage == undefined ? 1 : res.data.currentPage;
						}
					} else {
						this.$alert(res.message, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			timeFormat(str){
				return str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6,8)
			}
	    },
	}
</script>

<style lang="scss">
#punishNotice{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.4);
	z-index: 100000;
	padding-top: 8%;
	padding-left: 15%;
	padding-right: 100px;
	text-align: center;
	.maskBox{
		cursor:pointer;
		position: relative;
		width: 1000px;
		height:540px;
		overflow-y: auto;
		padding: 40px 0;
		background: #fff;
		margin:0 auto;
		.tag1{
			position:fixed;
			margin:-40px 460px;
		    background: transparent;
		    border: none;
		    padding: 4px;
			.el-icon-close{
				font-size: 18px;
				padding: 1px;
			}
			.el-icon-close:hover{
				background: transparent;
				color: #409eff;
			}
		}
		.orglist{
			text-align:center;
			font-size:16px;
			padding: 0 50px;
			.orgTitle{
				height: 26px;
				line-height:26px;
				margin-bottom:30px
			}
			.search{
			    width: 68px;
			    height: 26px;
			    margin-top:5px;
			    padding:0;
		    	font-size: 12px;
			}
		}
		.titIcon{
			width:100%;
			text-align:left;
			font-size:16px;
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
		.textOverFlow {
	        width: 100%;
	        text-overflow: ellipsis;
	        overflow: hidden;
	        white-space: nowrap;
	    }
		
		.el-table{
			margin:60px 0 30px 0
		}
	}
	.el-pagination{
		padding-bottom:20px!important;
	}
	.textTip{
		text-align: left;
		color:#F56C6C;
		margin-top:30px
	}
}	
</style>
