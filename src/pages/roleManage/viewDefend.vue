<template>
  <div class="viewDefend">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item><span style="color: #909191;font-weight: 700">系统设置</span></el-breadcrumb-item>
		<el-breadcrumb-item class="wgTxtColor" @click.native="submitReturn"><span style="cursor: pointer;">权限管理</span></el-breadcrumb-item>
		<el-breadcrumb-item class="txtColor">视图维护</el-breadcrumb-item>
  	</el-breadcrumb>
  	<div class="setBox">
  		<div class="titIcon"><em></em><span style="font-weight: 600;">视图维护</span></div>
		<div class="view-form">
	  		<el-form :inline="true" ref="accessForm" :model="accessForm" label-width="110px">
				<el-form-item label="允许访问视图">
					 <el-tabs v-model="chooseData" @tab-click="handleClick">
						<el-tab-pane v-for="(item,index) in chooseList" :key="item.tid" :label="item.name" :name="item.tid" v-if="isTab[index]=='1'">
							<span slot="label">{{item.name}}<i :class="item.checked?'el-icon-check choosed':'el-icon-check'"></i></span>
						</el-tab-pane>
					</el-tabs>
				</el-form-item>
				<el-form-item label="允许访问机构">
					<div v-if="this.chooseData == '2' || this.viewType == '2'" style="margin-bottom;10px">
						<el-select v-model="term1.region" placeholder="请选择" class="term" @change="changeTerm">
							<el-option v-for="item in term1.list" :label="item.name" :value="item.id" :key="item.id"></el-option>
						</el-select>
						<el-select v-model="term2.region" placeholder="请选择" class="term" @change="changeTerm">
							<el-option v-for="item in term2.list" :label="item.name" :value="item.id" :key="item.id"></el-option>
						</el-select>
					</div>
					<div v-if="this.chooseData == '11' || this.viewType == '11'">
						<el-select v-model="term3.region" placeholder="请选择">
							<el-option v-for="item in term3.list" :label="item.name" :value="item.id" :key="item.id"></el-option>
						</el-select>
					</div>
					<el-select v-model="mineStatus" multiple placeholder="请选择" popper-class="select-tree" value-key="mineStatus" @remove-tag="deleteOrg" v-if="saveBtn&&this.viewType != '11'">
						<el-option :value="mineStatus" style="height:auto">
							<el-tree :props="props" :key="treeKey" :ref="ref" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id" show-checkbox @check="getNodeChange" :check-strictly="true" accordion>
							</el-tree>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitAll" v-if="saveBtn">保存</el-button>
					<el-button plain @click="submitReturn" v-if="saveBtn">返回</el-button>
				</el-form-item>
	  		</el-form>
  		</div>
  	</div>
  </div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {ajax} from 'src/utils/utils.js'
  	import {statusCode} from 'src/utils/utils.js'
  	import {mapState, mapActions} from 'vuex'
  	import qs from 'qs'
    export default {
  	data () {
  		return{
  			ref:'tree',
  			chooseData:'1',
  			tabIndex: 1,
  			chooseList:[],
  			accessForm: {
  				askView: [],
  				askProduct: []
  			},
  			props:{
  				label: 'name',
  				children: 'zones',
  				isLeaf: 'leaf',
  				id:'',
  				name:'',
  				node:{},
  				resolve:{},
  				value:"id"
  			},
  			mineStatus:[],
  			viewType:'',   //视图类型
  			viewList:[],
  			arrLabel:[],
  			count:'',
  			checkedId:[],
  			chooseId:[],
  			tip: true,
  			treeKey:'',
  			saveBtn: true,
  			abc:'',
  			objList:[],
  			aaa:false,
  			isTab:[],
  			bbb:[],
  			arr:[],
  			newarr:[],
  			term1:{
  				region:'0',
  				list:[{
  					id:'0',
  					name:'查询权限'
  				},{
  					id:'1',
  					name:'编辑权限'
  				}]
  			},
  			term2:{
  				region:'0',
  				list:[{
  					id:'0',
  					name:'外规'
  				},{
  					id:'1',
  					name:'内规'
  				},{
  					id:'2',
  					name:'东方'
  				}]
  			},
  			term3:{
  				region:'',
  				list:[]
  			}
  		}
  	},
  	created(){
  		var yhbtn = sessionStorage.getItem('yhbtn')
  		var zdbtn = sessionStorage.getItem('zdbtn')
  		var zbbtn = sessionStorage.getItem('zbbtn')
  		var hgbtn = sessionStorage.getItem('hgbtn')
  		var ssbtn = sessionStorage.getItem('ssbtn')
  		var jzdbtn = sessionStorage.getItem('jzdbtn')
  		var zbFormbtn = sessionStorage.getItem('zbFormbtn')
  		var cxbtn = sessionStorage.getItem('cxbtn')
  		this.isTab = [yhbtn,zdbtn,zbbtn,jzdbtn,hgbtn,ssbtn,zbFormbtn,cxbtn]
  		var params = qs.stringify({
        	typeId: this.viewType,
        	roleId: this.$route.query.rowid
        })
  		// 获取视图数据
  		this.axios.post('rmUser/view', params).then((res)=>{
  			if(res.data.check){
  				this.abc = true;
  				for(var i=0;i<res.data.check.length;i++){
	  				this.arrLabel.push(res.data.check[i].name + '*' +res.data.check[i].groupId)
	  				this.chooseId.push(res.data.check[i].groupId)//设置树勾选项
	  			}
  			}
  			this.mineStatus = this.arrLabel
  			this.viewList = this.chooseId
  			this.chooseList = res.data.viewType
  			if(res.data.viewType[0]){
  				this.viewType = res.data.viewType[0].tid
  			}
  			if(yhbtn == 0&&zdbtn == 1){//制度管理机构
  				this.viewType = 2
  				this.chooseData = '2'
  				this.handleClick({name:2})
  			}
  			if(yhbtn == 0&&zdbtn == 0&&zbbtn == 1){//指标报送视图
  				this.viewType = 3
  				this.chooseData = '3'
  				this.init(this.viewType,'rmUser/indexOrgView')
  			}
  			if(yhbtn == 0&&zdbtn == 0&&zbbtn == 0&&jzdbtn == 1){//集中度报送视图
  				this.viewType = 6
  				this.chooseData = '6'
  				this.init(this.viewType,'rmUser/conObjView')
  			}
  			if(yhbtn == 0&&zdbtn == 0&&zbbtn == 0&&jzdbtn == 0&&hgbtn == 1){//合规报送视图
  				this.viewType = 7
  				this.chooseData = '7'
  				this.init(this.viewType,'rmUser/view')
  			}
  			if(yhbtn == 0&&zdbtn == 0&&zbbtn == 0&&jzdbtn == 0&&hgbtn == 0&&ssbtn == 1){//损失报送视图
  				this.viewType = 8
  				this.chooseData = '8'
  				this.init(this.viewType,'rmUser/view')
  			}
  			if(yhbtn == 0&&zdbtn == 0&&zbbtn == 0&&jzdbtn == 0&&hgbtn == 0&&ssbtn == 0&&zbFormbtn == 1){//损失报送视图
  				this.viewType = 9
  				this.chooseData = '9'
  				this.init(this.viewType,'rmUser/conObjView')
  			}
  			if(yhbtn == 0&&zdbtn == 0&&zbbtn == 0&&jzdbtn == 0&&hgbtn == 0&&ssbtn == 0&&zbFormbtn == 0&&cxbtn == 1){//损失报送视图
  				this.viewType = 11
  				this.chooseData = '11'
  				this.handleClick({name:11})
  			}
  			if(yhbtn == 0&&zdbtn == 0&&zbbtn == 0&&jzdbtn == 0&&hgbtn == 0&&ssbtn == 0&&zbFormbtn == 0&&cxbtn == 0){
  				this.saveBtn = false
  			}
    	})
    	this.$nextTick(function() {
		   	this.$refs.tree.setCheckedKeys(this.chooseId)
		})
  	},
  	updated(){
  		if(this.count && !this.abc){
  			const org = $($('.el-select__tags-text')[this.count-1])
  			org.text(org.text().split('*')[0])
  		}
  		if(this.abc){
  			if($('.el-select__tags-text').length>this.arrLabel.length){
  				for(var i = 0; i < $('.el-select__tags-text').length; i++){
	  				const org = $($('.el-select__tags-text')[i])
	  				org.text(org.text().split('*')[0])
	  			}
  			}else{
  				for(var i = 0; i < this.arrLabel.length; i++){
	  				const org = $($('.el-select__tags-text')[i])
	  				org.text(org.text().split('*')[0])
	  			}
  			}
  		}
  	},
  	computed:{
  		...mapState(['zdList','zdListName']),
  	},
  	methods:{
  		...mapActions(['setData']),
  		firstTree(resolve){
  			var params = qs.stringify({})
  			if(this.viewType == 7||this.viewType == 8){
  				params = qs.stringify({type: this.viewType})
  			}
  			this.axios.post('/rmUser/groupName',params).then((res)=>{
  				if(res.data.isShow == 0){
  					return resolve([]);
  				} else {
  					if(res.data.notCheck != null && res.data.notCheck[0] == '1_01'){
  						return resolve([{ name: '中华保险集团',id:'1_01',disabled:true}]);
  					} else{
  						return resolve([{ name: '中华保险集团',id:'1_01'}]);
  					}
  				}
  			})
  		},
  		deleteOrg(tag){
			this.viewList = this.delOne(tag.split('*')[1],this.viewList)
			this.arrLabel = this.delOne(tag,this.arrLabel)
  			if(this.viewList.length > 0){
				this.$nextTick(function() {
					this.$refs.tree.setCheckedKeys(this.viewList)
				})
			} else {
				this.$nextTick(function() {
					this.$refs.tree.setCheckedKeys([])
				})
			}
			if(this.viewType == 3){
				this.newarr = this.viewList
			}
  		},
  		//数组删除指定项
  		delOne(itemId,arr){
  			var rmArr = arr;
  			for(var i = 0;i<arr.length;i++){
  				if(arr[i]==itemId){
  					var index = arr.indexOf(itemId);
  					rmArr.splice(index,1)
  				}
  			}
  			return rmArr
  		},
  		handleClick(tab,event){
  			this.abc = true
  			this.mineStatus = []
  			this.arrLabel = []
  			this.viewList = []
  			this.chooseId = []
  			this.viewType = tab.name
  			this.newarr = []
  			this.setData({'zdList':{}})
  			this.setData({'zdListName':{}})
  			this.$set(this.term1,'region','0')
  			this.$set(this.term2,'region','0')
  			if(tab.name == 3){
  				this.init(tab.name,'rmUser/indexOrgView')
  			} else if(tab.name == 6||tab.name == 9){
  				this.init(tab.name,'rmUser/conObjView')
  			} else if(tab.name == 2){
	  			var params = qs.stringify({
		        	typeId: tab.name,
		        	roleId: this.$route.query.rowid
		        })
		  		// 获取视图数据
		  		this.axios.post('rmUser/view', params).then((res)=>{
	  				if(res.data != null){
			  			for(let key in res.data){
				    		var arr1 = []
							var arr2 = []
				    		if(res.data[key]&&res.data[key].length>0){
				  				for(var i=0;i<res.data[key].length;i++){
					  				arr2.push(res.data[key][i].name+'*'+res.data[key][i].groupId)
					  				arr1.push(res.data[key][i].groupId)
					  			}
				  			}
				  			switch(key){
				  				case 'ch_out_s':
				  					this.arrLabel = arr2
				  					this.chooseId = arr1
				  					this.mineStatus = this.arrLabel
				  					this.viewList = this.chooseId
				  					this.setData({'zdList.00':arr1})
			        				this.setData({'zdListName.00':arr2})
				  					break;
				  				case 'ch_inner_s':
				  					this.setData({'zdList.01':arr1})
			        				this.setData({'zdListName.01':arr2})
				  					break;
				  				case 'ch_df_s':
				  					this.setData({'zdList.02':arr1})
			        				this.setData({'zdListName.02':arr2})
				  					break;
				  				case 'ch_out_u':
				  					this.setData({'zdList.10':arr1})
			        				this.setData({'zdListName.10':arr2})
				  					break;
				  				case 'ch_inner_u':
				  					this.setData({'zdList.11':arr1})
			        				this.setData({'zdListName.11':arr2})
				  					break;
				  				case 'ch_df_u':
				  					this.setData({'zdList.12':arr1})
			        				this.setData({'zdListName.12':arr2})
				  					break;
				  			}
				    	}
	  				}
					this.treeKey = +new Date();
			    	this.$nextTick(function() {
					   	this.$refs.tree.setCheckedKeys(this.chooseId)
					})
		    	})
	    	} else if(tab.name == 11){
	    		this.init(tab.name,'rmUser/cxOrgLvView')
	    	} else{
	    		this.init(tab.name,'rmUser/view')
	    	}
  		},
  		init(tab,urlName){
  			this.abc = true
  			this.mineStatus = []
  			this.arrLabel = []
  			this.viewList = []
  			this.chooseId = []
  			this.viewType = tab
  			this.newarr =[]
  			if(tab == 2){
  				var params = qs.stringify({
		        	typeId: tab
		        })
  			} else if(tab == 11){
  				var params = qs.stringify({
		        	id: this.term3.region,
		        	roleId: this.$route.query.rowid
		        })
  			} else {
  				var params = qs.stringify({
		        	typeId: tab,
		        	roleId: this.$route.query.rowid
		        })
  			}
  			this.axios.post(urlName, params).then((res)=>{
  				if(tab == 1 || tab == 7 || tab == 8){//损失、合规报送视图
  					if(res.data.check){
		  				for(var i=0;i<res.data.check.length;i++){
			  				this.arrLabel.push(res.data.check[i].name+'*'+res.data.check[i].groupId)
			  				this.chooseId.push(res.data.check[i].groupId)
			  			}
			  			this.mineStatus = this.arrLabel
			  			this.viewList = this.chooseId
		  			} else{
		  				this.mineStatus = []
		  				this.viewList = []
		  			}
  				} else if(tab == 11){//财险机构级别
  					if(res.code == 200){
						this.$set(this.term3,'region',res.data.id)
						this.$set(this.term3,'list',res.data.list)
		          	}else{
						this.$alert(res.message, '提示', {
				          confirmButtonText: '确定'
				        });
		          	}
  				} else{
		  			if(res.data!=null){
		  				if(tab == 2){//制度视图
		  					for(var i=0;i<res.data.length;i++){
				  				this.arrLabel.push(res.data[i].name + '*' + res.data[i].groupId)
				  				this.chooseId.push(res.data[i].groupId)
				  			}
		  				} else{
		  					for(var i=0;i<res.data.length;i++){
				  				this.arrLabel.push(res.data[i].name+'*'+res.data[i].id)
				  				this.chooseId.push(res.data[i].id)
				  			}
		  				}
			  			this.mineStatus = this.arrLabel
			  			this.viewList = this.chooseId
		  			} else{
		  				this.mineStatus = []
		  				this.viewList = []
		  			}
	  			}
	  			if(tab != 11){
		  			this.treeKey = +new Date();
			    	this.$nextTick(function() {
					   	this.$refs.tree.setCheckedKeys(this.chooseId)
					})
				}
	    	})
  		},
  		getNodeInfo(node,resolve) {

		},
		handleNodeClick(node,a,b){

		},
		getNodeChange(node,b){
			this.getCheckedNodes(node,b,this.$refs.tree)
		},
		getCheckedNodes(node,b,ref) {
			// 2020.3.18指标报送机构去掉互斥效果
			// if(this.viewType == 3){
			// 	if(this.newarr.length){
			// 		if(this.newarr.indexOf(node.id)>=0){
			// 			this.newarr.splice(this.newarr.indexOf(node.id),1)
			// 			// if(this.newarr.length == 1&&this.newarr.indexOf(node.id.substr(0,3))>=0){
			// 			// 	this.newarr=[]
			// 			// 	// this.arrLabel.splice(0,1)
			// 			// 	// this.arrLabel.push(node.name+'*'+node.id)
			// 			// 	console.log(this.arrLabel)
			// 			// }
			// 		}else{
			// 			if(node.id.substr(0,3) == this.newarr[0].substr(0,3)){
			// 				this.newarr.push(node.id)
			// 			}else{
			// 				this.newarr = []
			// 				this.newarr.push(node.id)
			// 				// if(node.id.length != 3){
			// 				// 	this.newarr.push(node.id.substr(0,3))
			// 				// }
			// 				// this.newarr.push(node.id)
			// 				this.arrLabel=[]
			// 				this.mineStatus=[]
			// 				this.viewList=[]
			// 			}
			// 		}
			// 	}else{
			// 		this.newarr.push(node.id)
			// 		// if(node.id.length != 3){
			// 		// 	this.newarr.push(node.id.substr(0,3))
			// 		// }
			// 	}
			// 	this.$refs.tree.setCheckedKeys(this.newarr)
			// 	if(this.newarr.length>0){
			// 		this.objList = [node.id.substr(0,3)]
			// 	} else{
			// 		this.objList = []
			// 	}
			// }
			this.abc = false;
			var flag = true;
			if(this.arrLabel.length){
				for(var i = 0; i < this.arrLabel.length;i++){
					if((node.name+'*'+node.id)==this.arrLabel[i]||(node.name)==this.arrLabel[i]){
						flag = false;
						this.arrLabel = this.delOne(this.arrLabel[i],this.arrLabel);
						break;
					}
				}
				if(flag){
					this.arrLabel.push(node.name+'*'+node.id)
				}	
			}else{
				this.arrLabel.push(node.name+'*'+node.id)
				// 2020.3.18指标报送机构去掉互斥效果
				// if(this.viewType==3){
				// 	this.arrLabel.push(node.name)
				// } else{
				// 	this.arrLabel.push(node.name+'*'+node.id)
				// }
			}
			this.mineStatus = this.arrLabel
			// 获取勾选ID
	        // let res = this.$refs.tree.getCheckedNodes()
	        // var arr = []
	        // res.forEach(item =>{
	        // 	var mid = item.id === undefined?'1_01':item.id
	        // 	arr.push(mid)
	        // })
	        var arr = []
			for(var i=0;i<this.mineStatus.length;i++){
				arr.push(this.mineStatus[i].split('*')[1])
			}
	        this.viewList = arr
	        this.count = this.arrLabel.length
	        // 2020.3.18指标报送机构去掉互斥效果
	        // if(this.viewType==3){
	        // 	if(this.viewList.indexOf(this.objList[0])>=0){
	        // 		this.viewList.splice(this.viewList.indexOf(this.objList[0]),1)
	        // 	}
	        // }
	    },
  		loadNode(node,resolve){
  			if(this.viewType == '' || this.viewType == 1 || this.viewType == 7 || this.viewType == 8) {//首次和用户管理获取机构数据
  				if (node.level === 0) {
  					this.firstTree(resolve)
		        }else{
		  			this.node = node
		  			this.resolve = resolve
		  			var mid = node.data.id === undefined?'1_01':node.data.id;
		  			var params = qs.stringify({
			        	parentId: mid
			        })
		  			if(this.viewType == 7||this.viewType == 8){
		  				params = qs.stringify({
				        	parentId: mid,
				        	type:this.viewType
				        })
		  			}
			        this.axios.post('/rmUser/groupName', params).then((res)=>{
			       		var arr = [];
		                if(res.data.data != null){
				          	for (var i = 0; i < res.data.data.length; i++) {
				           	var obj = new Object;
				           	obj.name = res.data.data[i].name;
				           	obj.id = res.data.data[i].groupId;
				           	if(res.data.notCheck != null){
				           		for (var j = 0; j < res.data.notCheck.length; j++){
				           			if(res.data.notCheck[j] == res.data.data[i].groupId){
				           				obj.disabled = true
				           			}
				           		}
				           	}
				           	arr.push(obj);
				          } 
		                }
						resolve(arr)
			        })
				}
  			} else if (this.viewType == 2) {//制度管理获取机构数据
  				if (node.level === 0) {
  					this.connectAxios('',node,resolve,'/rmUser/insViews')
		        }else{
		  			var mid = node.data.id === undefined?'1_01':node.data.id;
			        this.connectAxios(mid,node,resolve,'/rmUser/insViews')
				}
  			} else if (this.viewType == 3) {//制度管理获取机构数据
  				if (node.level === 0) {
					this.node = node
					this.resolve = resolve
					var params = qs.stringify({
				        objId: ''
				    })
				    this.axios.post('/rmUser/insObj', params).then((res)=>{
			       		var arr = [];
		                if(res.data != null){
				          	for (var i = 0; i < res.data.length; i++) {
				           	var obj = new Object;
				           	obj.name = res.data[i].name;
				           	obj.id = res.data[i].id;
				           	obj.disabled = false;
				           	arr.push(obj);
				          } 
		                }
						resolve(arr)
			        })
		        }else{
		  			var mid = node.data.id
		  			var params = qs.stringify({
				        objId: mid
				    })
			        // this.connectAxios(mid,node,resolve,'/rmUser/objId')
			        this.axios.post('/rmUser/insObj', params).then((res)=>{
			       		var arr = [];
		                if(res.data != null){
				          	for (var i = 0; i < res.data.length; i++) {
				           	var obj = new Object;
				           	obj.name = res.data[i].name;
				           	obj.id = res.data[i].id;
				           	arr.push(obj);
				          } 
		                }
						resolve(arr)

			        })

				}
  			} else if (this.viewType == 6||this.viewType == 9) {//制度管理获取机构数据
  				if (node.level === 0) {
					this.node = node
					this.resolve = resolve
					var params = qs.stringify({
				        objId: '',
				        type:this.viewType
				    })
				    this.axios.post('/rmUser/insObj', params).then((res)=>{
			       		var arr = [];
		                if(res.data != null){
				          	for (var i = 0; i < res.data.length; i++) {
				           	var obj = new Object;
				           	obj.name = res.data[i].name;
				           	obj.id = res.data[i].id;
				           	obj.disabled = false;
				           	arr.push(obj);
				          } 
		                }
						resolve(arr)
			        })
		        } else{
		        	resolve([])
		        }
  			}
  		},
  		// 制度管理调接口
  		connectAxios(val,node,resolve,path){
  			this.node = node
			this.resolve = resolve
  			var params = qs.stringify({
		        groupId: val
		    })
  			this.axios.post(path, params).then((res)=>{
	       		var arr = [];
                if(res.data != null){
		          	for (var i = 0; i < res.data.length; i++) {
		           	var obj = new Object;
		           	obj.name = res.data[i].name;
		           	obj.id = res.data[i].groupId;
		           	arr.push(obj);
		          } 
                }
				resolve(arr)
	        })
  		},
  		//返回
	    submitReturn(){
	    	this.$router.push({
	    		path:'/setting/access',
	    		query:{
  					id: this.$route.query.id
  				}
	    	})
	    },
	    //保存
	    submitAll(num){
	        if(this.viewType == 1||this.viewType == 7||this.viewType == 8){
	        	var typeId = this.viewType 
	        	var params = qs.stringify({
		    		roleId: this.$route.query.rowid,
		        	typeId: this.viewType,
		        	ids: this.viewList.toString()
		        })
	        	this.axios.post('rmUser/dealView',params).then((res)=>{
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
	        } else if(this.viewType == 2){
		        var params = JSON.stringify({
		    		roleId: this.$route.query.rowid,
		        	typeId: this.viewType,
		        	// ids: this.viewList.toString(),
		        	ch_out_s:this.zdList['00'] == undefined?[]:this.zdList['00'],
		        	ch_inner_s:this.zdList['01'] == undefined?[]:this.zdList['01'],
		        	ch_df_s:this.zdList['02'] == undefined?[]:this.zdList['02'],
		        	ch_out_u:this.zdList['10'] == undefined?[]:this.zdList['10'],
		        	ch_inner_u:this.zdList['11'] == undefined?[]:this.zdList['11'],
		        	ch_df_u:this.zdList['12'] == undefined?[]:this.zdList['12'],
		        })
	        	this.axios.post('rmUser/dealInsView',params,{headers:{'Content-Type':'application/json'}}).then((res)=>{
		  			if(res.code == 200){
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
		          	}else{
						this.$alert(res.message, '提示', {
				          confirmButtonText: '确定'
				        });
		          	}
		    	})
	        } else if(this.viewType == 3){
	        	if(this.viewList.length>0){
	        		var params = qs.stringify({
			    		roleId: this.$route.query.rowid,
			        	typeId: this.viewType,
			        	depIds: this.viewList.toString()
			        })
	        	} else{
	        		var params = qs.stringify({
			    		roleId: this.$route.query.rowid,
			        	typeId: this.viewType,
			        	objIds: this.objList.toString(),
			        	depIds: this.viewList.toString()
			        })
	        	}
	        	this.axios.post('rmUser/dealIndOrgView',params).then((res)=>{
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
	        } else if(this.viewType == 6||this.viewType == 9){
	        	var params = qs.stringify({
		    		roleId: this.$route.query.rowid,
		        	typeId: this.viewType,
		        	objIds: this.viewList.toString()
		        })
	        	this.axios.post('rmUser/dealConObjView',params).then((res)=>{
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
	        } else if(this.viewType == 11){
	        	var params = qs.stringify({
		    		roleId: this.$route.query.rowid,
		        	id: this.term3.region
		        })
	        	this.axios.post('rmUser/cxOrgLvView',params).then((res)=>{
		  			if(res.code == 200){
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
		          	}else{
						this.$alert(res.message, '提示', {
				          confirmButtonText: '确定'
				        });
		          	}
		    	})
	        }
	    },
	    changeTerm(val){
	    	this.abc = true
  			this.mineStatus = []
  			this.arrLabel = []
  			this.viewList = []
  			this.chooseId = []
  			this.newarr=[]
	    	if(this.zdList[this.term1.region + this.term2.region]){
	  			this.chooseId = this.zdList[this.term1.region + this.term2.region]
	  			this.viewList = this.chooseId
			}
			if(this.zdListName[this.term1.region + this.term2.region]){
	  			this.arrLabel = this.zdListName[this.term1.region + this.term2.region]
	  			this.mineStatus = this.arrLabel
			}
			this.treeKey = +new Date();
			this.$nextTick(function() {
			   	this.$refs.tree.setCheckedKeys(this.chooseId)
			})
	    }
  	},
  	watch:{
  		viewList(newVal,oldVal){
  			if(this.viewType == 2){
				if(this.term1.region == '0'){
		        	switch(this.term2.region){
		        		case '0':
		        			this.setData({'zdList.00':this.viewList})
		        			this.setData({'zdListName.00':this.arrLabel})
		        			break;
		        		case '1':
		        			this.setData({'zdList.01':this.viewList})
		        			this.setData({'zdListName.01':this.arrLabel})
		        			break;
		        		case '2':
		        			this.setData({'zdList.02':this.viewList})
		        			this.setData({'zdListName.02':this.arrLabel})
		        			break;
		        	}
		        } else{
		        	switch(this.term2.region){
		        		case '0':
		        			this.setData({'zdList.10':this.viewList})
		        			this.setData({'zdListName.10':this.arrLabel})
		        			break;
		        		case '1':
		        			this.setData({'zdList.11':this.viewList})
		        			this.setData({'zdListName.11':this.arrLabel})
		        			break;
		        		case '2':
		        			this.setData({'zdList.12':this.viewList})
		        			this.setData({'zdListName.12':this.arrLabel})
		        			break;
		        	}
		        }
	        }
  		}
  	},
  	beforeRouteLeave(to,from,next){
	    this.setData({'zdList':{}})
	    this.setData({'zdListName':{}})
	    next()
	},
  };
</script>
<style>
	.viewDefend .el-breadcrumb__inner{		
    	color: #4285F4!important;
    	font-weight: 700!important;
    }		
    .viewDefend .is-link{		
    	color: #909191!important;		
    }
    .viewDefend .wgTxtColor span{
    	color: #909191 !important;
    	font-weight: 700;
    }
	.view-form .el-input__inner{
		width: 430px;
		height: 32px;
	}
	.view-form .term .el-input__inner{
		width: 212px!important;
	}
	.view-form .el-form-item:last-child{
		text-align:center;
		padding-top:50px;
		position: absolute;
		bottom: 100px
	}
	.view-form .el-form-item__label{
		text-align: left;
		padding: 0 12px 0 0;
	}
	.view-form .el-form-item__content{
		width: calc(100% - 150px);
	}
	.view-form .el-tabs__nav-wrap::after{
		background: none!important
	}
	.select-tree .el-scrollbar .el-scrollbar__view{
		padding:6px 20px;
	}
    .select-tree .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
	    height: auto;
	    max-height: 274px;
	    overflow:visible !important;
	    background:#FFF;
	    padding:0!important;
    }
    .view-form .el-tabs__item i{
    	margin-left:10px;
    	color: #C0C4CC
    }
    .view-form .el-tabs__active-bar{
    	background: none!important
    }
    .view-form .choosed{
    	color: #4285F4!important
    }
</style>
<style lang="scss" scoped>
	*{
		-moz-user-select:none;/*火狐*/
		-webkit-user-select:none;/*webkit浏览器*/
		-ms-user-select:none;/*IE10*/
		user-select:none;
	}
	.viewDefend{
		height: 100%;
		.el-breadcrumb{
			padding: 20px 0 16px 0
		}
		.setBox{
			height: calc(100% - 70px);
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
			button{
				width: 68px;
				height: 26px;
				padding: 0;
				font-size: 12px;
			}
		}
	}
    .el-form--inline .el-form-item{
    	width:100%;
    	margin-bottom:0
    }
</style>
