<template>
  	<div id="punishSendCX">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">合规信息管理</span></el-breadcrumb-item>
			<el-breadcrumb-item class="wgTxtColor">合规信息报送</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane v-for="(item,index) in tabListFilter" :label="item.label" :name="item.name" :key="item.name">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">监管处罚信息报送查询</span></div>
					<component :key="index" :is="item.check" :isFlag="item.isFlag" v-if="activeName == item.name"></component>
				</div>
				<div class="sysBox">
					<div class="titIcon"><em></em><span style="font-weight: 600;">监管处罚信息报送列表</span></div>
					<component :key="index" :is="item.list" :isFlag="item.isFlag" v-if="activeName == item.name" @accessChange="accessChange"></component>
				</div>
			</el-tab-pane>
		</el-tabs>
  	</div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/infoManage/punishCheck'
	import vCheckCX from 'src/components/infoManage/punishCheckCX'
	import vSysList from 'src/components/infoManage/punishList'
	import vSysListCX from 'src/components/infoManage/punishListCX'
	import {mapState, mapActions} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	titMsg:"监管处罚信息报送",
        	activeName:'first',
        	tabList: [{
				label: "草稿箱",
				name: "first",
				check: "vCheck",
				list: "vSysList",
				isShow: '0',
				isFlag: 2,
				isAccess:true
			}, {
				label: "生效库",
				name: "second",
				check: "vCheck",
				list: "vSysList",
				isShow: '0',
				isFlag: 1,
				isAccess:true
			}, {
				label: "草稿箱",
				name: "first",
				check: "vCheckCX",
				list: "vSysListCX",
				isShow: '1',
				isFlag: 2,
				isAccess:true
			}, , {
				label: "生效库",
				name: "second",
				check: "vCheckCX",
				list: "vSysListCX",
				isShow: '1',
				isFlag: 1,
				isAccess:true
			}, {
				label: "集团生效库",
				name: "third",
				check: "vCheck",
				list: "vSysList",
				isShow: '1',
				isFlag: 3,
				isAccess:true
			}]
		}
   	},
   	components:{
		vCheck,
		vCheckCX,
		vSysList,
		vSysListCX,
	},
	computed: {
		...mapState(['companySource']),
		tabListFilter() {
			return this.tabList.filter(
				item => item.isShow === this.companySource && item.isAccess
			)
		}
	},
    created(){
    	// 专报提交返回生效库
    	var path = sessionStorage.getItem('punishPath')
    	if(path == 1){
    		this.activeName = 'second'
    	} else if (path == 3) {
			this.activeName = 'third'
			this.tabList.forEach(item =>{
				if(item.label == "集团生效库"){
					item.isAccess = true
				}
			})
		} else {
    		this.activeName = 'first'
    	}
    	this.handleClick({name:this.activeName})
    	sessionStorage.removeItem('punishPath')
    },
    methods:{
    	...mapActions(['setData']),
    	handleClick(tab) {
	       this.activeName = tab.name
		},
		accessChange(data){
			if(data){
				this.tabList.forEach(item =>{
					if(item.label == "集团生效库"){
						item.isAccess = data
					}
				})
			}
		}
  	},
  	beforeRouteLeave(to,from,next){
	    let arr = ['punishSpecialReport','punishDetail','punishSpecialReportCX','punishDetailCX']
	    if(arr.indexOf(to.name)<0){
	      sessionStorage.removeItem("askData1");
	      sessionStorage.removeItem("askData2");
	      sessionStorage.removeItem("askData3");
	    }
	    if(this.$route.query.supervisePath&&to.name == 'supervise/superviseSend'){
	    	this.axios.post('rmUser/permissionIds',qs.stringify({roleId: sessionStorage.getItem('roleId'),moduleId: "1_hjgjcsxxxbs"})).then((res)=>{
            	this.setData({orgBtnData:res.data})
          	})
		}
	    next()
	},
	beforeRouteEnter(to,from,next){
      next((that)=>{
        if(that.$route.query.supervisePath){
          that.axios.post('rmUser/permissionIds',qs.stringify({roleId: sessionStorage.getItem('roleId'),moduleId: "1_hjgcfxxbs"})).then((res)=>{
            that.setData({orgBtnData:res.data})
          })
        }
      })
    },
}    
</script>
<style lang="scss">
    #punishSendCX{
		.el-tabs__item{
	      	background: #fff;
	      	width: 130px;
	      	border-top-left-radius: 8px;
	      	border-top-right-radius: 8px;
	      	border-right: 1px solid #E9E9E9;
			padding:0;
	      	text-align: center;
	    }
    	.el-breadcrumb{
    		margin-bottom: 16px;
    		margin-top: 20px;
    	}
    	.el-tabs__header{
	      	margin:0;
	    }
    	.el-table__empty-block{
    		background: #fff;
    	}
	    .el-tabs__active-bar{
	      display: none;
	    }
    	.is-active{
	    	background: #4285F4!important;
	    	color: #fff!important;
	    	text-align: center;
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
		.box{
	      	min-height: 250px;
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
	    .sysBox{
	      	background: #fff;
	      	min-height: 250px;
	      	padding: 16px 16px 0 16px;
	      	-webkit-box-shadow: 2px 2px 10px #888;
	      	border-radius: 8px;
	      	margin-top: 23px;
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
    }
</style>
