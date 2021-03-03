<template>
	<div class="fileDetail">
	    <h4><i class="el-icon-paperclip"></i>附件：</h4>
	    <div v-for="(item,index) in this.fileList"><span class="pName"><i class="el-icon-document"></i><span @click="goDownload(item.path)">{{item.name}}</span></span><i style="margin-left: 15px;" @click="loadFile(item.path,item.name)" title="下载" class="el-icon-download"></i></div>
		<div class="maskFile" v-if="isOpen">
     		<div class="readTxt">
     			<el-tag @close="closeMask" closable></el-tag>
				<iframe id="fileRead" :src="fileUrl" width="100%" height="100%"></iframe>
			</div>
     	</div>
    </div>
</template>
<script>
	import qs from 'qs'
	import {fileDownload,fileNameCombine} from 'src/utils/utils.js'
	export default{
		props:['fileList'],
		data(){
			return {
				isOpen:false,
				fileUrl:''
			}
		},
		methods:{
			//预览
	  		goDownload(url){
		    	this.isOpen = true
		    	this.fileUrl = 'http://10.196.23.34:8237/v1/view/preview?filePath='+encodeURIComponent(url)
			},
	  		//关闭预览
	  		closeMask(){
	  			this.isOpen = false;
	  		},
	  		//下载
	  		loadFile(url,name){
				var obj = new Object()
				obj.filePath = url;
				obj.fileName = name;
				this.axios.post('comm/download/801',qs.stringify(obj),{responseType:'arraybuffer'}).then((res)=>{
					fileDownload(res, fileNameCombine(name,url));
				})
			}
		}
	}
</script>

<style lang="scss">
	.fileDetail{
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
</style>
