<template>
	<div id="riskMask" v-if="faShow" >
		<div class="maskBox">
			<el-tag key="tag.name" @close="backFunc" closable type="tag.type"> {{tag.name}} </el-tag>
			<div class="newBox">
				<span class="titTip" style="padding-top: 3%;font-size:14px;display: block;">{{maskTitle}}</span>
		  		<el-form :inline="true" ref="roleForm" :model="roleForm">
			  		<el-form-item :label="isDetail == true?'风险大类名称：':'风险大类名称'" class="fxType">
					    <el-input v-model="submitData.name" v-if="notDetail"  @change="getInputName" placeholder="请输入风险名称"></el-input>
					    <div type="textarea" style="font-size: 14px;line-height: 20px;padding-top: 3%;padding-left:15px;color: #606266;" v-if="isDetail" class="detailBorder" readonly  @change="getInputName" placeholder="">{{submitData.name}}</div>
					</el-form-item>
					<el-form-item :label="isDetail== true?'风险大类级别：':'风险大类级别'" class="fxType">
					    <el-input v-model="value" v-if="isDetail" class="detailBorder" readonly  @change="getInputName" placeholder=""></el-input>
						<el-select v-model="value" v-if="notDetail" placeholder="请选择"  @change="getRiskLevel" :disabled="disabled">
							<el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.code"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="isDetail== true?'风险父类级别：':'风险父类级别'" class="fxType">
					    <el-input v-model="faValue" v-if="isDetail" class="detailBorder" readonly  @change="getInputName"></el-input>
						<el-select v-model="faValue" v-if="notDetail" placeholder="请选择" @change="getFatherLevel" :disabled="disabled">
							<el-option v-for="item in faOptions" :key="item.value" :label="item.value" :value="item.code"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="isDetail== true?'风险分类描述：':'风险分类描述'" prop="describe">
						<el-input type="textarea" :readonly="isDetail" autosize="" @change="getText" v-model="roleForm.describe" :placeholder="placehold"></el-input>
					</el-form-item>
					<el-form-item :label="isDetail== true?'创建部门：':'创建部门'" >
						 <el-input v-model="createDepart" v-if="isDetail" class="detailBorder" readonly  @change="getInputName"></el-input>
					     <el-input v-model="createDepart" v-if="notDetail" disabled></el-input>
					</el-form-item>
					<el-form-item :label="isDetail== true?'创建人：':'创建人'">
						 <el-input v-model="createMan" v-if="isDetail" class="detailBorder" readonly  @change="getInputName"></el-input>
					     <el-input v-model="createMan" v-if="notDetail" disabled></el-input>
					</el-form-item>
		  		</el-form>
	  		</div>
		  	<div class="btnBox">
		  		<el-button @click="backFunc" :class="{backCss:isDetail}">返回</el-button>
		  		<el-button type="primary" v-if="notDetail" @click="submit()">提交</el-button>
		  	</div>
		</div>
	  </div>
</template>

<script>
	import qs from 'qs'
	export default{
		name:'maskTable',
		props:['faShow'],
		data(){
			return {
				maskTitle:'新建风险分类',
				disabled:false,
				tag:{ name: '', type: '' },
				labelName:'风险大类名称：',
				maskShow:false,
				createDepart:'',
				createMan:'',
				placehold:'请输入风险分类描述',
				notDetail:true,
				isDetail:false,
				submitData:{
					id:'',
					name:'',
					level:'',
					fatherId:'',
					fatherName:'',
					describe:''
				},
				options: [{
			          code: '1',
			          value: '一级风险'
			        }, {
			          code: '2',
			          value: '二级风险'
			        }, {
			          code: '3',
			          value: '三级风险'
			        }],
			    faOptions: [],    
		        value: '',
		        faValue:'',
				roleForm:{
					rolename: '',
					describe: '',
					riskOption: [],
				}
		    }
		},
		methods:{
			//input框失去焦点事件
			handleInputBlur:function(index,row){
				//当 input 失去焦点 时,input 切换为 span，并且让下方 表格消失（注意，与点击表格事件的执行顺序）
				this.tableData[index].chapter = row.chapterTxt === undefined?"":row.chapterTxt;
				this.tableData[index].clause = row.clauseTxt === undefined?"":row.clauseTxt;;
				this.tableData[index].content = row.contentTxt === undefined?"":row.contentTxt;
			},
			init(){
				this.submitData.id = '';
				this.submitData.name = ''
				this.submitData.fatherId = ''
				//清空描述
				this.submitData.describe = ''
				this.roleForm.describe = ''
				//清空风险大类名称
				this.value = '';
				//清空风险父类级别
				this.faValue = '';
				this.faOptions = [];
				this.submitData.createDepart = ''
				this.submitData.createMan = ''
				this.submitData.level='',
				this.submitData.fatherName = ''
			},
			singleBlur(index,row){
				this.tableData[index].chapter = row.chapter;
				this.tableData[index].clause = row.clause;
				this.tableData[index].content = row.content;
			},
			backFunc(){
				this.$emit('closeMask',{status:false,'handle':'add'})
			},
			getText(val){
	  			this.roleForm.describe = val;
	  		},
	  		getTit(val){
	  			this.roleForm.rolename = val;
	  		},
	  		getFatherLevel(val){
	  			let obj = {};
	  			obj = this.faOptions.find((item)=>{
		           return item.code == val;
	       		});
	       		this.submitData.fatherName = obj.value;
	       		this.submitData.fatherId = val;
	  		},
	  		getInputName(val){
	  			this.submitData.name = val;
	  		},
	  		getRiskLevel(val){
	  			this.submitData.level = val*1
	  			if(val == 1){
	  				this.faValue = '';
	  				this.fatherId = '';
	  				this.faOptions = [];
	  				return;
	  			}
	  			this.axios.post('riskkind/risklevel',qs.stringify({'level':val*1-1})).then((res)=>{
	  				this.faOptions = [];
	  				this.faValue = '';
	  				this.fatherId = '';
	  				for (var i = 0; i < res.data.length; i++) {
	  					var obj = new Object();
	  					obj.code = res.data[i].id;
	  					obj.value = res.data[i].name;
	  					obj.id = res.data[i].id;
	  					this.faOptions.push(obj)		
	  				}
	  			})
	  		},
	  		getText(val){
	  			this.submitData.describe = val;
	  		},
	  		reWrite(id){
	  			this.axios.post('riskkind/bigkindDetail',qs.stringify({id:id})).then((res)=>{
					if(res.code == 200){
						if(sessionStorage.riskStatus == 2){
							//风险大类名称
							this.submitData.level=res.data.level;
							if(res.data.level == 1){
								this.value = '二级风险';
								this.submitData.level = 2; 
							}else if(res.data.level == 2){
								this.value = '三级风险';
								this.submitData.level = 3; 
							}
							//风险父类级别
							this.faValue = res.data.name;
							this.submitData.fatherId = res.data.id;
							this.submitData.fatherName = res.data.name
						
							this.createDepart = res.data.createDepart;
							this.createMan = res.data.createMan;
						}else{
							this.submitData.id = id;
							this.submitData.name = res.data.name;
							//描述
							this.submitData.describe = res.data.describe;
							this.roleForm.describe = res.data.describe;
							//风险大类名称
							this.submitData.level=res.data.level;
							if(res.data.level == 1){
								this.value = '一级风险';
							}else if(res.data.level == 2){
								this.value = '二级风险'
							}else{
								this.value = '三级风险'
							}
							//风险父类级别
							this.faValue = res.data.fatherName;
							this.faOptions = [];
							if(res.data.fatherId != 0){
								var obj = new Object();
			  					obj.code = res.data.fatherId;
			  					obj.value = res.data.fatherName;
			  					obj.id = res.data.fatherId;
			  					this.faOptions.push(obj)
							}
							this.submitData.fatherId = res.data.fatherId;
							this.submitData.fatherName = res.data.fatherName
						
							this.createDepart = res.data.createDepart;
							this.createMan = res.data.createMan;
						}
						
					}
				})
	  		},
	  		submit(){
	  			if(this.submitData.name == ''){
	  				this.$alert('风险大类名称不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return;
	  			}else if(this.value == ''){
	  				this.$alert('风险大类级别不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        return;
	  			}else if(this.value != '1'){
	  				if(this.faValue == ''){
	  					this.$alert('风险父类级别不能为空', '提示', {
			        	confirmButtonText: '确定'
			        });
			        	return;
	  				}
	  			}
	  			if(sessionStorage.riskStatus == 2){
	  				this.submitData.id = ''
	  			}
	  			this.axios.post('riskkind/addOrEdit',JSON.stringify(this.submitData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	  				if(res.code == 200){
	  					this.$alert("操作成功", '提示', {
				        	confirmButtonText: '确定',
				        	callback:action=>{
				        	this.backFunc()
		          			}
				        });
	  				}else{
	  					this.$alert(res.data, '提示', {
				        	confirmButtonText: '确定'
				        });
	  				}
	  			})
	  		}
		},
		watch:{
			faShow(val){
				if(val){
					let status = sessionStorage.riskStatus;
					let id = sessionStorage.riskId;
					this.init()
					if(status == 1){
						//编辑
						this.reWrite(id)
						this.maskTitle = '编辑风险分类'
						this.disabled = false;
						this.isDetail = false;
						this.notDetail = true;
						this.placehold = '请输入风险分类描述'
					}else if(status == 2){
						//添加
						this.maskTitle = '添加风险分类'
						this.disabled = true;
						this.isDetail = false;
						this.notDetail = true;
						this.reWrite(id)
						this.placehold = '请输入风险分类描述'
					}else if(status == 3){
						//详情
						this.maskTitle = '风险分类详情'
						this.reWrite(id)
						this.isDetail = true;
						this.notDetail = false;
						this.placehold = '暂无风险分类描述'
					}else{
						//新建
						this.maskTitle = '新建风险分类'
						this.placehold = '请输入风险分类描述'
						this.isDetail = false;
						this.notDetail = true;
						this.disabled = false;
						this.axios.post('riskkind/userMsg',{},{headers:{'Content-Type':'application/json'}}).then((res)=>{
			      		 	this.createDepart = res.data.ornName;
			      		 	this.createMan = res.data.userName;
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
#riskMask{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.4);
	z-index: 100000;
	padding-top: 5%;
	padding-left: 15%;
	padding-right: 100px;
	text-align: center;
	.maskBox{
		position: relative;
		width: 610px;
		padding-bottom: 40px;
    	background: #fff;
    	margin:0 auto;
    	.el-form{
    		padding: 20px 60px 0px 60px;
    	}
    	.el-form-item__content{
    		width: 72%;
    	}
    	.el-table th{
    		background: #F9F9F9;
    		color:#777;
    	}
    	.el-input__inner{
    		height: 32px;
    		font-size: 14px;
    	}
    	.el-form-item__content{
    		text-indent: 0;
    	}
    	.el-form-item{
    		text-align: left;
    	}
    	.btnBox{
    		button{
    			width: 68px;
    			height: 26px;
    			line-height: 0;
    			font-size: 12px;
    		}
    	}
    	.el-form-item__label{
    		width:120px;
    		padding: 0;
    		text-align: right;
    		font-size: 14px;
    		text-indent: 0;
    		padding-right: 10px;
    	}
    	.el-form--inline .el-form-item{
    		display: block;
    	}
    	.el-select{
    		width: 100%;
    	}
    	.el-textarea__inner{
    		height: 150px!important;
    		font-size: 14px;
    	}
    	.fxType .el-form-item__label::before{
		    content: '*';
		    color: #F56C6C;
		    margin-right: 4px;
		}
		.detailBorder{
			.el-input__inner{
				border: none;
				white-space:normal;
			}
		}
	}
	.backCss{
		color: #FFF!important;
    	background-color: #409EFF!important;
    	border-color: #409EFF!important;

	}
	.el-tag{
		float: right;
	    background: transparent;
	    border: none;
	    padding: 4px;
	    margin-right: 25px;
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
