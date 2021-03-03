<template>
	<div class="mask" v-if="faShow">
		<el-tag key="tag.name" @close="backFunc" id="dfTag" closable type="tag.type"> {{tag.name}} </el-tag>
		<div class="maskBox" style="height: 369px;overflow: auto;">
		  	<el-table :data="tableData" style="background: #F9F9F9!important;border: 1px solid #E9E9E9;">
			    <el-table-column type="index" width="200" label="章节" >
			    	<template slot-scope="scope">
				      <div class="input-box1" style="text-align: center;">
				         <el-input size="small" v-if="allBtn" @blur="handleInputBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="scope.row.chapterTxt" ></el-input>
				         <el-input size="small" v-if="singleBtn" @blur="singleBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="tableData[0].chapter" ></el-input>
				      </div>
				   </template>
			    </el-table-column>
			    <el-table-column prop="outFileNo" width="240" label="法条" >
			    	<template slot-scope="scope">
				      <div class="input-box1" style="text-align: center;">
				         <el-input size="small" v-if="allBtn" @blur="handleInputBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="scope.row.clauseTxt" ></el-input>
				         <el-input size="small" v-if="singleBtn" @blur="singleBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="tableData[0].clause" ></el-input>
				      </div>
				   </template>
			    </el-table-column>
			    <el-table-column prop="name" label="制度内容" >
			    	<template slot-scope="scope">
				      <div class="input-box">
				         <el-input size="small" v-if="allBtn" type="textarea" autosize @blur="handleInputBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="scope.row.contentTxt" ></el-input>
				         <el-input size="small" v-if="singleBtn" type="textarea" autosize @blur="singleBlur(scope.$index,scope.row)" show-overflow-tooltip v-model="tableData[0].content" ></el-input>
				      </div>
				   </template>
			    </el-table-column>
		  	</el-table>
		  	<div class="btnBox">
		  		<el-button type="primary" v-if="singleBtn" @click="upData()">更新</el-button>
		  		<el-button type="primary" v-if="allBtn" @click="submitData()">确认</el-button>
		  		<el-button @click="backFunc">返回</el-button>
		  	</div>
		</div>
	  </div>
</template>

<script>
	export default{
		name:'maskTable',
		props:['faShow'],
		data(){
			return {
				tag:{ name: '', type: '' },
				maskShow:false,
				allBtn:true,
				singleBtn:false,
				tableData:[],
				saveData:{
					institutionId:'',
        			fileId:'',
        			reviseId:'',
        			reviseId:''
				}
		    }
		},
		created(){},
		methods:{
			//input框失去焦点事件
			handleInputBlur:function(index,row){
				//当 input 失去焦点 时,input 切换为 span，并且让下方 表格消失（注意，与点击表格事件的执行顺序）
				this.tableData[index].chapter = row.chapterTxt === undefined?"":row.chapterTxt;
				this.tableData[index].clause = row.clauseTxt === undefined?"":row.clauseTxt;;
				this.tableData[index].content = row.contentTxt === undefined?"":row.contentTxt;
			},
			singleBlur(index,row){
				this.tableData[index].chapter = row.chapter;
				this.tableData[index].clause = row.clause;
				this.tableData[index].content = row.content;
			},
			submitData(){
				  const instId = sessionStorage.instId;
				  const infoData = JSON.parse(localStorage.getItem('infoData'));
				  const fileID = localStorage.getItem('fileId')
				  //如果是修订 制度id为这个
				  if(infoData.reviseId != ''){
				  	this.saveData.institutionId = instId;
				  }else{
				  	this.saveData.institutionId = infoData.institutionId;
				  }
				  this.saveData.reviseId = infoData.reviseId;
				  this.saveData.fileId = fileID;
				  this.saveData.data = this.tableData;
				  this.axios.post('instweb/item/add',JSON.stringify(this.saveData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
				  		sessionStorage.instId = res.data;
		      		 	this.backFunc()
					})
			},
			backFunc(){
				this.$emit('closeMask',{status:false,'handle':'add'})
			},
			upData(){
				  const singleData = JSON.parse(localStorage.getItem('singleData'));
				  this.saveData.institutionId = singleData.institutionId;
				  this.saveData.id = singleData.id;
				  this.saveData.chapter = this.tableData[0].chapter;
				  this.saveData.content = this.tableData[0].content;
				  this.saveData.clause = this.tableData[0].clause;
				  this.saveData.fileId = singleData.fileId;
				  this.saveData.reviseId = singleData.reviseId;
				  this.axios.post('instweb/item/update',JSON.stringify(this.saveData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
				  		sessionStorage.setItem('instId',res.data)
		      		 	this.backFunc()
					})
			},
			createTd(size){
				this.tableData = [];
				for (var i = 0; i < size; i++) {
					this.tableData.push({
		          		chapter:'',
		          		clause:'',
		          		content:''
					})
				}
			}
		},
		watch:{
			faShow(val){
				const singleTdTxt = JSON.parse(localStorage.getItem('singleData'))
				const type = singleTdTxt === null?10:1
				if(val){
					if(type === 1){
						this.tableData = [];
						this.tableData.push({
			          		chapter:'',
			          		clause:'',
			          		content:''
						})
						this.tableData[0].chapter = singleTdTxt.chapter;
						this.tableData[0].clause = singleTdTxt.clause;
						this.tableData[0].content = singleTdTxt.content;
						this.singleBtn = true;
						this.allBtn = false;
						return;
					}else{
						this.allBtn = true;
						this.singleBtn = false;
						this.createTd(10);
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	#dfTag .el-tag__close{
		left:30px;
	}
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
