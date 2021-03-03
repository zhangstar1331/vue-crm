<template>
  <div id="accessDefend">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor" @click.native="submitReturn"><span style="cursor: pointer;">权限管理</span></el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">权限维护</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span style="font-weight: 600;">权限维护</span></div>
		<el-table id="qxTable" :data="accesstableData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;border-bottom:none">
			<el-table-column prop="accessMode1" label="一级模块" width="100"> 
				<template slot-scope="scope">
					<div v-for = '(item,index) in scope.row.accessMode1'>
						<span :id="item.id">{{item.name}}</span>
					</div>
    			</template>
			</el-table-column>
			<el-table-column prop="accessMode2" label="二级模块" width="200">
				<template slot-scope="scope">
					<p v-for = '(item,index) in newheight[scope.$index]' :style="{height:item.height,lineHeight:item.height}" class="space">
						{{item.name}}
					</p>
        		</template>
			</el-table-column>
			<el-table-column prop="accessMode2" label="三级模块" width="200">
				<template slot-scope="scope">
					<div v-for = '(item,index) in newheight[scope.$index]' :style="{height:item.height,lineHeight:item.height1}" class="space">
						<p v-for="(item1,index) in item.child" :id="item1.id" class="space" :style="{lineHeight:item1.height2}" >
							{{item1.name}}
						</p>
					</div>
        		</template>
			</el-table-column>
			<el-table-column prop="accessMode2" label="权限">
				<template slot-scope="scope">
					<div v-for = '(item,index) in scope.row.accessMode2' :ref="ele+scope.$index+index" class="space" style="text-align:left;padding-left:5%" :key="item.id">
						<p v-for="(item,index2) in item.opers" :id="item.id" class="setwidth" :key="item.id">
							<el-checkbox-group v-model="checked" @change="getId">
									<el-checkbox :label="item.id" :key = "item.id" :title="item.name">{{item.name}}</el-checkbox>
							</el-checkbox-group>
						</p>
						<div v-for="(item1,index1) in item.child" :id="item1.id" class="space" style="padding-left:5%;margin-left:-5%" :ref="eee+scope.$index+index+index1" :key="item1.id">
							<p v-for="(item,index) in item1.opers" :id="item.id" class="setwidth">
							<el-checkbox-group v-model="checked" @change="getId">
									<el-checkbox :label="item.id" :key = "item.id" :title="item.name">{{item.name}}</el-checkbox>
							</el-checkbox-group>
						</p>
						</div>
					</div>
        		</template>
			</el-table-column>
		</el-table>
		<div class="defendBtn">
			<el-button type="primary" @click="saveData">保存</el-button>
			<el-button plain @click="submitReturn">返回</el-button>
		</div>
  	</div>
  </div>
</template>
<script>
	import {ajax} from 'src/utils/utils.js'
    import {statusCode} from 'src/utils/utils.js'
    import qs from 'qs'
    export default {
  	data () {
  		return{
  			ele:'ele',
  			eee:'eee',
  			checked:[],
  			accesstableData:[],
  			objArr:{},
  			newheight:[],
  			count:''
  		}
  	},
  	created(){
  		var params = qs.stringify({
          roleId: this.$route.query.rowid
        })
  		this.axios.post('rmUser/rolePermissions',params).then((res)=>{
      		this.count = res.data.length
      		for (var i = 0; i < res.data.length; i++){
      			var obj = new Object()
      			var obj1 = new Object()
      			var arr = new Array()
      			obj1.name = res.data[i].name;
      			obj1.id = res.data[i].id;
      			obj1.child = res.data[i].child;
      			arr.push(obj1)
      			obj.accessMode1 = arr;
      			obj.accessMode2 = res.data[i].child;
      			this.accesstableData.push(obj)
      			for (var j = 0;  j < obj.accessMode2.length; j++) {
      				if(obj.accessMode2[j].opers != undefined){
	      				for (var k = 0; k < obj.accessMode2[j].opers.length; k++) {
	      					if(obj.accessMode2[j].opers[k].checked != undefined){
	      						this.checked.push(obj.accessMode2[j].opers[k].id)
	      					}
	      				}
      				} else{
      					for (var m = 0; m < obj.accessMode2[j].child.length; m++) {
	      					for (var n = 0; n < obj.accessMode2[j].child[m].opers.length; n++) {
		      					if(obj.accessMode2[j].child[m].opers[n].checked != undefined){
		      						this.checked.push(obj.accessMode2[j].child[m].opers[n].id)
		      					}
		      				}
	      				}
      				}
      				if(obj.accessMode2[j].child == undefined){
      					obj.accessMode2[j].child = [{name:"--"}]
      				}
      			}
      			this.objArr[i] = obj.accessMode2
      			this.$nextTick(()=>{
      				var newarr = new Array()
      				for (var j = 0;  j < this.count; j++) {
      					newarr.push(this.objArr[j])
      					for (var k = 0;  k < this.objArr[j].length; k++) {
      						if(this.$refs['ele'+j+k][0].clientHeight == 0){
      							newarr[j][k].height = 28 +'px'
      						} else{
      							newarr[j][k].height = this.$refs['ele'+j+k][0].clientHeight +'px'
      							if(newarr[j][k].child[0].name=="--"){
									newarr[j][k].height1 = this.$refs['ele'+j+k][0].clientHeight +'px'
      							} else{
      								for(var x = 0;  x < newarr[j][k].child.length; x++){
      									newarr[j][k].child[x].height2 = parseInt(this.$refs['eee'+j+k+x][0].clientHeight) +'px'
      								}
      							}
      						}
		  				}
		  				this.$set(this.newheight,j,newarr[j])
      				}
	  			})

      		}
      })
  	},
  	methods:{
  		getId(){
  			this.checked.join(',')
  		},
  		// 保存
  		saveData(){
  			if(this.checked.length == 0){
  				this.$alert('请选择用户权限', '提示', {
			          confirmButtonText: '确定'
			        });
			    return;    
  			}
  			var params = qs.stringify({
	          roleId: this.$route.query.rowid,
	          permId: this.checked.toString()
	        })
  			this.axios.post('rmUser/saveRolePerms',params).then((res)=>{
  				if(res.code == 200){
	          		if(res.data == true){
						this.$alert(res.message, '提示', {
				          	confirmButtonText: '确定',
					      	callback: action => {
						      	this.$router.push({
						    		path:'/setting/access',
						    		query:{
					  					'id': this.$route.query.id
					  				}
						    	})
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
  		// 返回
  		submitReturn(){
	    	this.$router.push({
	    		path:'/setting/access',
	    		query:{
  					id: this.$route.query.id
  				}
	    	})
	    },
  	}
  };
</script>
<style>
	#accessDefend .el-breadcrumb__inner{		
    	color: #4285F4!important;
    	font-weight: 700!important;
    }		
    #accessDefend .is-link{		
    	color: #909191!important;		
    }
    #accessDefend .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
</style>
<style lang="scss">
	*{
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
	#accessDefend{
		height: 100%;
		.el-breadcrumb{
			padding: 20px 0 16px 0
		}
		.cell{
			text-align: center;
			padding: 0;
			white-space:normal!important;
			p:last-child,div:last-child{
				border-bottom:none!important
			}
		}
		.setBox{
			min-height: calc(100% - 70px);
			padding: 16px 16px 0 16px;
			-webkit-box-shadow: 2px 2px 10px #888;
			border-radius: 8px;
			background: #FFF;
			.titIcon{
				font-size:0;
				margin-bottom:30px;
				em{
					display: inline-block;
					vertical-align: middle;
					width: 2px;
					height: 14px;
					margin-right:5px;
					background: #4285F4;
				}
				span{
					display: inline-block;
					vertical-align: middle;
					font-size:14px;
				}
			}
			.defendBtn{
				width: 100%;
				text-align: center;
				padding: 50px 0;
				button{
					width: 68px;
					height: 26px;
					padding: 0;
					font-size: 12px;
				}
			}
			.space{
				border-bottom: 1px solid #EBEEF5;
				box-sizing:content-box;
			}
			.setwidth{
				display: inline-block;
				width: 20%;
				padding-right: 2%
			}
		}
	}
	#qxTable table tbody /deep/ tr td:last-of-type .cell{
		text-align: left!important;
		padding: 0;
		line-height: 0!important;
	}
	#qxTable table tbody /deep/ tr td:last-of-type div{
		line-height: 1!important;
	}
	#accessDefend .el-breadcrumb__inner{
	    	color: #4285F4!important;
	    	font-weight: 700!important;
	    }
	#accessDefend .is-link{
	    	color: #909191!important;
	    }
	#accessDefend .el-form--inline .el-form-item{
	    	width:100%
	    }
	#qxTable td,#qxTable th{
		border-right: 1px solid #dedede;
	} 
	#qxTable tr td:last-child,#qxTable .has-gutter th:nth-child(3){
		border-right:none!important
	} 
	#qxTable td{
		padding:0
	}
	#qxTable .el-checkbox{
		height:38px;
		line-height:38px;
		width:100%
	}
	#qxTable .el-checkbox__label{
		color:#606266!important;
		width:calc(100% - 24px);
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow:hidden;
		vertical-align:middle
	}
</style>
