<template>
  	<div id="seasonReport">
		<el-header class="header" style="padding-left:218px">
	  		<el-row>
		  		<el-col :span="12">
			  		<el-breadcrumb separator-class="el-icon-arrow-right">
					  	<el-breadcrumb-item><span style="color: #909191;font-weight: 700">合规信息管理</span></el-breadcrumb-item>
					  	<el-breadcrumb-item class="wgTxtColor" @click.native="goBack">合规信息报送</el-breadcrumb-item>
					  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>
				<el-col :span="9">
					<el-button type="primary" @click.native="goBatch" class="saveBtn">批量提交</el-button>
        			<el-button type="primary" @click.native="goBack" class="saveBtn">返回</el-button>
			  	</el-col>
		  	</el-row>
	  	</el-header>
		<div class="quoteSys">
    		<div class="titIcon"><em></em><span style="font-weight: 600;">监管检查事项信息季报</span></div>
			<el-upload class="upload-demo" accept=".Excel,.xls,.xlsx" :show-file-list="false" ref="upload" action="" :http-request="uploadFile">
			  <el-button type="primary" class="saveBtn" size="mini">导入数据</el-button>
			</el-upload>
        	<el-button type="primary" @click.native="goDownload" class="saveBtn">下载模板</el-button>
	        <el-table :data="tableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;">
	            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
				<el-table-column prop="thingName" label="检查事项" align="center" width="200">
					<template slot-scope="scope">
						<span :title="scope.row.thingName" class="textOverFlow">{{scope.row.thingName == null||scope.row.thingName == ''?'--':scope.row.thingName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="subjectType" label="实施主体类型" align="center" width="150">
					<template slot-scope="scope">
						<span>{{scope.row.subjectType == null||scope.row.subjectType == ''?'--':subject[scope.row.subjectType]}}</span>
					</template>
				</el-table-column>
	            <el-table-column prop="orgName" label="被检查机构" align="center" width="300">
	                <template slot-scope="scope">
	                    <span :title="scope.row.orgName" class="textOverFlow">{{scope.row.orgName == null||scope.row.orgName == ''?'--':scope.row.orgName}}</span>
	                </template>
	            </el-table-column>
				<el-table-column prop="startDate" label="检查开始时间" align="center" width="150">
					<template slot-scope="scope">
						<span>{{scope.row.startDate == null||scope.row.startDate == ''?'--':timeFormat(scope.row.startDate)}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="insuranceType" label="险种" align="center" width="100">
					<template slot-scope="scope">
						<span>{{scope.row.insuranceType == null||scope.row.insuranceType == ''?'--':insureList.find(item =>{ return item.id == scope.row.insuranceType}).name}}</span>
					</template>
				</el-table-column>
	            <el-table-column prop="bs,rs,ds,as" label="操作" align="center">
	              <template slot-scope="scope">
					<span class="handleBtn detailBtn" @click="goDetail(scope.$index, scope.row)" style="color: #4285F4;" v-if="scope.row.draftStatus==0||scope.row.draftStatus==1">详情</span>
                    <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;" v-if="scope.row.draftStatus==0">编辑</span>
                    <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row)" style="color: #4285F4;" v-if="scope.row.draftStatus==0">提交</span>
                    <span class="handleBtn detailBtn" @click="goDelete(scope.$index, scope.row)" style="color: #4285F4;" v-if="scope.row.draftStatus==0">删除</span>
                    <span class="handleBtn detailBtn" @click="goEdit(scope.$index, scope.row)" style="color: #4285F4;" v-if="scope.row.draftStatus==1">修改</span>
                    <span class="handleBtn detailBtn" @click="goSubmit(scope.$index, scope.row, 1)" style="color: #4285F4;" v-if="scope.row.draftStatus==1">审批通过</span>
                    <span class="handleBtn detailBtn" @click="goRollback(scope.$index, scope.row)" style="color: #4285F4;" v-if="scope.row.rollback==1">退回</span>
                    <span class="handleBtn detailBtn" @click="goMark(scope.$index, scope.row)" style="color: #4285F4;" v-if="scope.row.draftStatus==1">迟报/错报标记</span>
	              </template>
	            </el-table-column>
	        </el-table>
	        <el-pagination background layout="prev, pager, next" :current-page.sync="currentPage" prev-text="上一页" next-text="下一页" :total="totalResults"></el-pagination>
			<div v-if="isShow" class="mark">
				<div class="maskBox">
					<el-tag @close="isShow = false" closable></el-tag>
					<div class="markInfo">
						<div class="infoTitle">迟报/错报标记</div>
						<el-form ref="delay" :model="delay" label-position="left" size="mini" :rules="rules">
							<el-form-item label="基本信息首次报送时间" align="left">
								<span>{{delay.submitDate == null||delay.submitDate == ''?'--':timeFormat(delay.submitDate)}}</span>
							</el-form-item>
							<el-form-item label="迟报天数" prop="day">
								<el-input @keydown.native="checkInput($event)" type="number" v-model="delay.day" placeholder="请输入迟报天数"></el-input>天
							</el-form-item>
							<el-form-item label="错报/漏报" prop="type">
								<el-select v-model="delay.type" placeholder="请选择错报/漏报">
									<el-option v-for="item in delayList" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
						<el-button type="primary" class="search" @click="isShow = false">取消</el-button>
						<el-button type="primary" class="search" @click="goUpdate('delay')">提交</el-button>
					</div>
				</div>
			</div>
		</div>
  	</div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	quoteAssignForm:{},
    		tableData:[],
    		currentPage:1,
    		totalResults:0,
          	titMsg:"监管检查事项信息季报",
          	checkData:{
          		status:3,
	        	pageNo: 1,
				pageSize: 1000
	        },
	        subject:{
	          	'1':'银保监系统',
	          	'2':'人民银行',
	          	'3':'财政部',
	          	'4':'审计署',
	          	'5':'其他'
	        },
	        discoverWay:{
	          	'1':'外部检查',
	          	'2':'上级检查',
	          	'3':'公司自查',
	          	'4':'客户投诉',
	          	'5':'举报',
	          	'6':'其他'
			},
			isShow: false,
            isNotice:false,
            delay: {},
            delayList:[{
                name: "无错报/漏报",
                id: "1"
            }, {
                name: "一般",
                id: "2"
            }, {
                name: "重大",
                id: "3"
            }],
            rules:{
                day:[
                    {required: true, message: '请输入迟报天数', trigger: 'blur'}
                ],
                type:[
                    {required: true, message: '请选择错报/漏报', trigger: 'change'}
                ],
            }
		}
   	},
    created(){
    	// 获取列表数据
    	this.searchData(this.checkData)
	},
	computed: {
        ...mapState(['insureList']),
    },
    methods:{
    	// 查询列表数据
    	searchData(data){
	        this.axios.post('cx_supervise/query',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	            if(res.code == 200){
	            	if(res.data != null){
      					this.tableData = res.data.data==''?[]:res.data.data
      					this.totalResults = res.data.totalResults == undefined?1:res.data.totalResults
      				}
	            }else{
	              	this.$alert(res.message, '提示', {
	                	confirmButtonText: '确定'
	                })
	            }
	        })
	    },
	    // 下载模板
	    goDownload(){
	    	this.axios.post('/tpl/download/v2',qs.stringify({id:701}),{responseType:'arraybuffer'}).then((res)=>{
    			let filename = "监管检查事项信息季报.xlsx";
              	this.fileDownload(res, filename);
    		})
		},
		fileDownload(data, fileName) {
	      	let blob = new Blob([data], {
	        	type: "application/octet-stream"
	      	})
	      	let filename = fileName || "filename.xls";
	      	if (typeof window.navigator.msSaveBlob !== "undefined") {
	        	window.navigator.msSaveBlob(blob, filename);
	      	} else {
		        var blobURL = window.URL.createObjectURL(blob);
		        var tempLink = document.createElement("a");
		        tempLink.style.display = "none";
		        tempLink.href = blobURL;
		        tempLink.setAttribute("download", filename);
		        if (typeof tempLink.download === "undefined") {
		          tempLink.setAttribute("target", "_blank");
		        }
		        document.body.appendChild(tempLink);
		        tempLink.click();
		        document.body.removeChild(tempLink);
		        window.URL.revokeObjectURL(blobURL);
	      	}
	    },
	    // 导入数据
	    uploadFile(param){
    		var fileObj = param.file;
	    	var form = new FormData();
	    	form.append("file", fileObj);
	    	this.axios.post('/cx_supervise/import',form).then((res)=>{
				if(res.code == '200'){
					this.searchData(this.checkData)
				}else{
					this.$alert(res.message, '提示', {
		                confirmButtonText: '确定'
		            });
				}
    		})
        },
	    // 返回
	    goBack(){
	    	this.$router.push({
	    		path:'/infoManage/infoManageSend/supervise/superviseSend',
	    		query:{           //路由传参时push和query搭配使用 ，作用时传递参数
        			id: this.$route.query.id
	            }
	    	})	
	    },
	    goDetail(index,row){
	        this.$router.push({
	            path:'/superviseDetailCX',   //跳转的路径
	            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            	infoId:row.id,
	              	flag:4,
                	id: this.$route.query.id
	            }
	        })
	    },
	    goEdit(index,row){
	        this.$router.push({
	          path:'/superviseSpecialReportCX',   //跳转的路径
	          query:{           //路由传参时push和query搭配使用 ，作用时传递参数
	            infoId:row.id,
	            flag:3,
                id: this.$route.query.id
	          }
	        })
	    },
		// 提交
        goSubmit(index, row, type) {
            this.axios.post('cx_supervise/submit', JSON.stringify({ id: row.id, status: 3 }), { headers: { 'Content-Type': 'application/json' } }).then((res) => {
                if (res.code == 200) {
                    if (res.data == 0) {
                        this.$alert('请完善信息后再次提交', '提示', {
                            confirmButtonText: '确定'
                        });
                    } else {
                        var tip = "提交成功"
                        if(type == 1){
                            tip = '审批意见为"同意"，审批已通过'
                        }
                        this.$alert(tip, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.searchData(this.checkData);
                            }
                        });
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
      	goDelete(index,row){
	        this.$confirm('确认删除？', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        }).then(_ => {
	            this.axios.post('cx_supervise/delete',qs.stringify({id:row.id})).then((res)=>{
	                if(res.code == 200){
	                  	this.$alert('删除成功', '提示', {
	                      	confirmButtonText: '确定',
	                      	callback:action=>{
	                        	this.searchData(this.checkData);
	                      	}
	                	});
		            } else if(res.code == 500){
		                this.$alert('删除失败', '提示', {
		                    confirmButtonText: '确定'
		                })
		            }
	            })
	        })
	        .catch(_ => {});
	    },
	    goBatch(){
	    	this.axios.post('cx_supervise/submit',JSON.stringify({status:3}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
                if(res.code == 200){
                	if(res.data !== null){
                		var tip = ""
                		if(res.data.s!==null){
                			tip = "成功提交"+res.data.s+"条数据"
                		} else{
                			tip = "成功提交0条数据"
                		}
                		this.$alert(tip, '提示', {
	                      	confirmButtonText: '确定',
	                      	callback:action=>{
	                        	this.searchData(this.checkData);
	                      	}
	                	});
                	}
	            } else{
	                this.$alert(res.data, '提示', {
		                confirmButtonText: '确定'
		            });
	            }
            })
		},
		// 退回
        goRollback(index, row) {
            this.$prompt('请输入退回原因', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '返回',
                inputPattern: /\S/,
                inputErrorMessage: '退回原因不能为空'
            }).then(({ value }) => {
                this.axios.post('cx_supervise/rollback', qs.stringify({ id: row.id, msg: value,status: this.isFlag })).then((res) => {
                    if (res.code == 200) {
                        this.$alert('退回成功', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.searchData(this.checkData);
                            }
                        });
                    } else {
                        this.$alert(res.message, '提示', {
                            confirmButtonText: '确定'
                        })
                    }
                })
            })
		},
		// 标记
        goMark(index, row) {
            this.axios.post('cx_supervise/queryMark', qs.stringify({ id: row.id})).then((res) => {
                if (res.code == 200) {
                    this.isShow = true
                    this.delay = res.data
                    this.$set(this.delay,'id',row.id)
                    if(res.data.missDays){
                        this.$set(this.delay,'day',res.data.missDays)
                    }
                    if(res.data.missType){
                        this.$set(this.delay,'type',res.data.missType)
                    }
                    if(res.data.submitDate){
                        this.$set(this.delay,'submitDate',res.data.submitDate)
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
        goUpdate(formName){
            this.$refs[formName].validate(valid => {
		        if (valid) {
                    var params = qs.stringify({
                        id:this.delay.id,
                        type:this.delay.type,
                        day:this.delay.day
                    })
                    this.axios.post('cx_supervise/updateMark', params).then((res) => {
                        if (res.code == 200) {
                            this.$alert('提交成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.isShow = false
                                }
                            })
                        } else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: '确定'
                            })
                        }
                    })
                }
            })
		},
		timeFormat(str){
            return str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6,8)
        }
  	}
}    
</script>
<style lang="scss">
    #seasonReport{
    	cursor: pointer;
    	.header{
			padding-left: 0;
		    padding-right: 2.6%;
		    padding-top: 20px;
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
    	.el-form-item--mini.el-form-item{
			width: auto!important
		}
		.el-input-group__append{
			background: #4285F4;
		    width: 20%;
		    text-align: center;
		    font-size: 16px;
		    color: #fff;
		}
		.saveBtn{
			float:right;
			width: 68px;
			height: 26px;
			line-height: 1px;
			padding: 0;
			margin-left:10px;
			font-size: 12px;
		}
    	.el-table__body, .el-table__footer, .el-table__header{
			border-collapse: collapse
		}
    	table tr:last-child td{
			border-bottom: none
		}
		.el-table::before{
			background-color: transparent!important
		}
		.el-table .cell{
	  		cursor:pointer
	  	}
    	th{
    		background: #F9F9F9;
		    color: #909399;
		    font-weight: bold;
    	}
    	.el-tabs__content{
    		-webkit-box-shadow: 1px 0px 6px #888;
    		border-radius: 8px;
    	}
    	.el-table__empty-block{
    		background: #fff;
    	}
	    .el-pagination{
	    	display:none;
	    	text-align: center;
		    padding-bottom: 50px;
		    border: 0;
	    	margin-top: 30px;
	    }
	    .quoteSys{
	    	margin-top: 75px;
	    	background: #fff;
	    	min-height: 250px;
	    	padding: 16px 16px 30px 16px;
	    	border-radius: 8px;
	    	th{
	    		background: #F9F9F9 ;
	    	}
	    	-webkit-box-shadow: 2px 0px 6px #888;
	    	.titIcon{
	    		font-size:14px;
	    		margin-bottom:30px;
	    		float: left;
	    		em{
	    			display: inline-block;
	    			width: 2px;
	    			height: 14px;
	    			background: #4285F4;
	    			vertical-align: middle;
	    			margin-right: 5px;
	    		}
	    	}
	    }
	    .el-tabs__header{
		  	margin:0;
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
	    .handleBtn{
	    	display: inline-block;
	    	padding: 0 5px
	    }
	    .handleBtn:hover{
	    	cursor: pointer;
	    }
	    .el-breadcrumb__inner{
	    	color: #4285F4!important;
	    	font-weight: 700!important;
	    }
	    .is-link{
	    	color: #909191!important;
	    }
	    .wgTxtColor span{
	    	color: #909191 !important;
	    	font-weight: 700;
	    }
	    .textOverFlow{
			width: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.el-col{
			text-align:left
		}
		.upload-demo{
			float: right;
		}
		.mark {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, .4);
			z-index: 100000;
			padding-top: 15%;
			padding-left: 15%;
			padding-right: 100px;
			text-align: center;
			.maskBox {
				position: relative;
				width: 600px;
				padding: 40px 0;
				background: #fff;
				margin: 0 auto;
				.el-tag {
					position: fixed;
					margin: -40px 260px;
					background: transparent;
					border: none;
					padding: 4px;
					.el-icon-close {
						font-size: 18px;
						padding: 1px;
					}
					.el-icon-close:hover {
						background: transparent;
						color: #409eff;
					}
				}
				.markInfo {
					text-align: center;
					font-size: 16px;
					padding: 0 50px;
					.infoTitle {
						font-size: 20px;
						font-weight: 1000;
						margin-bottom: 40px
					}
				}
				.search {
					width: 68px;
					height: 26px;
					margin-right: 5px;
					margin-top: 20px;
					padding: 0;
					font-size: 12px;
				}
				.el-form-item__label {
					width: 35%;
					height: 36px;
					line-height: 36px;
					font-weight: normal;
					padding: 0 4% 0 0;
					text-align: right
				}
				.el-input__inner {
					height: 36px;
					line-height: 36px;
				}
				.el-form-item__content {
					float: left;
					width: 65%;
					height: 36px;
					line-height: 36px;
				}
				.el-input{
					float:left;
					width:90%
				}
				.el-select{
					width: 100%;
					.el-input{
						width:90%
					}
				}
			}
		}
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
		}
		input[type="number"] {
			-moz-appearance: textfield;
		}
    }
</style>
