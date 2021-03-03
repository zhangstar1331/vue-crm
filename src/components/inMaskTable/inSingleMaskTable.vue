<template>
	<div class="mask" v-if="singleFaShow">
		<el-tag key="tag.name" @close="backFunc" closable type="tag.type"> {{tag.name}} </el-tag>
		<div class="maskBox">
		  	<el-table :data="tableData" style="background: #F9F9F9!important;border: 1px solid #E9E9E9;">
			    <el-table-column type="index" width="200" label="章节" >
			    	<template slot-scope="scope">
				      <div class="input-box1" style="text-align: center;">
				         <el-input size="small" @blur="handleInputBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="scope.row.chapterTxt" ></el-input>
				      </div>
				   </template>
			    </el-table-column>
			    <el-table-column prop="outFileNo" width="240" label="法条" >
			    	<template slot-scope="scope">
				      <div class="input-box1" style="text-align: center;">
				         <el-input size="small" @blur="handleInputBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="scope.row.clauseTxt" ></el-input>
				      </div>
				   </template>
			    </el-table-column>
			    <el-table-column prop="name" label="制度内容" >
			    	<template slot-scope="scope">
				      <div class="input-box">
				         <el-input size="small" @blur="handleInputBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="scope.row.contentTxt" ></el-input>
				      </div>
				   </template>
			    </el-table-column>
		  	</el-table>
		  	<div class="btnBox">
		  		<el-button type="primary" @click="submitData()">确认</el-button>
		  		<el-button @click="backFunc">返回</el-button>
		  	</div>
		</div>
	  </div>
</template>

<script>
	export default{
		name:'maskTable',
		props:['singleFaShow'],
		data(){
			return {
				tag:{ name: '', type: '' },
				maskShow:false,
				tableData:[],
				saveData:{
					institutionId:'',
        			fileId:'',
        			reviseId:'',
        			data:''
				}
		    }
		},
		created(){
			for (var i = 0; i < 1; i++) {
					this.tableData.push({
		          		chapter:'',
		          		clause:'',
		          		content:''
					})
				}
			const singleTdTxt = JSON.parse(localStorage.getItem('singleData'))
			this.tableData[0].chapter = singleTdTxt === null?'':singleTdTxt.chapter;
			this.tableData[0].clause = singleTdTxt === null?'':singleTdTxt.clause;
			this.tableData[0].content = singleTdTxt === null?'':singleTdTxt.content;
		},
		methods:{
			//input框失去焦点事件
			handleInputBlur:function(index,row){ 
				//当 input 失去焦点 时,input 切换为 span，并且让下方 表格消失（注意，与点击表格事件的执行顺序）
				this.tableData[index].chapter = row.chapterTxt === undefined?"":row.chapterTxt;;
				this.tableData[index].clause = row.clauseTxt === undefined?"":row.clauseTxt;;
				this.tableData[index].content = row.contentTxt === undefined?"":row.contentTxt;
			},
			submitData(){
				  const infoData = JSON.parse(localStorage.getItem('infoData'));
				  this.saveData.institutionId = infoData.institutionId;
				  this.saveData.fileId = infoData.fileId;
				  this.saveData.data = this.tableData;
				  this.$axios.post('instweb/item/add',this.saveData).then((res)=>{
		      		 	this.backFunc()
					})
			},
			backFunc(){
				this.$emit('closeMask',{status:false,'handle':'add'})
			},
		}
	}
</script>

<style lang="scss" scoped>
.mask{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.4);	
	z-index: 100000;
	padding-top: 100px;
	padding-left: 15%;
	padding-right: 100px;
	text-align: center;
	.maskBox{
		padding: 50px 50px 88px 30px;
    	background: #fff;
    	.cell{
    		text-align: center;
    	}
    	.el-table_3_column_40{
    		.cell{
    			text-align: left;
    		}
    		.el-input__inner{
    			text-align: left;
    		}
    	}
    	.el-table th{
    		background: #F9F9F9;
    		color:#777;
    	}
    	.btnBox{
    		padding-top: 28px;
    		button{
    			padding:10px 28px;
    		}
    	}
	}
	.el-tag{
		float: left;
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
	.el-input__inner{
		text-align: center;
	}
	.tb-edit .input-box {
	   display: none
	}
	.tb-edit .current-cell .input-box {
	   display: block;
	   margin-left: -15px;
	}
}
</style>