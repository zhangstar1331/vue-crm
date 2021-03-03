<template>
  	<div id="justiceSend">
  		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item><span style="color: #909191;font-weight: 700">合规信息管理</span></el-breadcrumb-item>
			<el-breadcrumb-item class="wgTxtColor">合规信息报送</el-breadcrumb-item>
		  	<el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane v-for="(item,index) in tabList" :label="item.name" :name="item.limit" :key="item.limit">
				<div class="box">
					<div class="titIcon"><em></em><span style="font-weight: 600;">{{sendName}}报送查询</span></div>
					<div v-if="!caseSend">
						<components :key="index" :is="item.name1" :isFlag="item.isFlag" :isJusticeType="item.justiceType" v-if="activeName == item.limit" :checkList="checkList[index+2]" @changeSessionStorage="changeSessionStorage"></components>
					</div>
					<div v-else>
						<components :key="index" :is="item.name1" :isFlag="item.isFlag" :isJusticeType="item.justiceType" v-if="activeName == item.limit" :checkList="checkList[index]" @changeSessionStorage="changeSessionStorage"></components>
					</div>
				</div>
				<div class="sysBox">
					<div class="titIcon"><em></em><span style="font-weight: 600;">{{sendName}}报送列表</span></div>
					<component :key="index" :is="item.name2" :isFlag="item.isFlag" :isJusticeType="item.justiceType" v-if="activeName == item.limit"></component>
				</div>
			</el-tab-pane>
		</el-tabs>
  	</div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/infoManage/justiceCheck'
	import vSysList from 'src/components/infoManage/justiceList'
	import vCheck1 from 'src/components/infoManage/caseCheck'
	import vSysList1 from 'src/components/infoManage/caseList'
	import {mapState, mapActions} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
  	export default {
  	data() {
        return {
        	titMsg:"涉刑案件信息报送",
        	activeName:'first',
        	tab1:true,
        	tab2:true,
        	isChildUpdate1:true,
	        isChildUpdate2:false,
	        sendName:'案件风险事件',
	        tabList:[],
	        checkList:[],
	        caseSend:'',
	        justiceSend:'',
		}
   	},
   	components:{
		vCheck,
		vCheck1,
		vSysList,
		vSysList1,
    },
    created(){
    	var path = sessionStorage.getItem('justicePath')
    	this.caseSend = sessionStorage.getItem('caseSend') === 'false'?false:true
    	this.justiceSend = sessionStorage.getItem('justiceSend') === 'false'?false:true
    	if(!this.caseSend){
    		this.activeName = path?path:'third'
			this.sendName = '业内案件'
    		this.tabList=[{
	        	name:'业内案件-草稿箱',
	        	name1:'vCheck',
	        	name2:'vSysList',
	        	limit:'third',
	        	isFlag:'2',
	        	justiceType:'1',
	        },{
	        	name:'业内案件-生效库',
	        	name1:'vCheck',
	        	name2:'vSysList',
	        	limit:'fourth',
	        	isFlag:'1',
	        	justiceType:'1',
	        },{
	        	name:'业外案件-草稿箱',
	        	name1:'vCheck',
	        	name2:'vSysList',
	        	limit:'fifth',
	        	isFlag:'2',
	        	justiceType:'2',
	        },{
	        	name:'业外案件-生效库',
	        	name1:'vCheck',
	        	name2:'vSysList',
	        	limit:'sixth',
	        	isFlag:'1',
	        	justiceType:'2',
	        }]
    	} else{
    		this.activeName = path?path:'first'
    		if(this.$route.query.id!='1_hajfxbs'){
				if(this.activeName == 'first' || this.activeName == 'second'){
					this.getPermission('1_hajfxbs')
				}
			}
    		if(!this.justiceSend){
    			this.tabList = [{
		        	name:'案件风险事件-草稿箱',
		        	name1:'vCheck1',
		        	name2:'vSysList1',
		        	limit:'first',
		        	isFlag:'2',
		        },{
		        	name:'案件风险事件-生效库',
		        	name1:'vCheck1',
		        	name2:'vSysList1',
		        	limit:'second',
		        	isFlag:'1',
		        }]
    		} else{
	    		this.tabList = [{
		        	name:'案件风险事件-草稿箱',
		        	name1:'vCheck1',
		        	name2:'vSysList1',
		        	limit:'first',
		        	isFlag:'2',
		        },{
		        	name:'案件风险事件-生效库',
		        	name1:'vCheck1',
		        	name2:'vSysList1',
		        	limit:'second',
		        	isFlag:'1',
		        },
		        {
		        	name:'业内案件-草稿箱',
		        	name1:'vCheck',
		        	name2:'vSysList',
		        	limit:'third',
		        	isFlag:'2',
		        	justiceType:'1',
		        },{
		        	name:'业内案件-生效库',
		        	name1:'vCheck',
		        	name2:'vSysList',
		        	limit:'fourth',
		        	isFlag:'1',
		        	justiceType:'1',
		        },{
		        	name:'业外案件-草稿箱',
		        	name1:'vCheck',
		        	name2:'vSysList',
		        	limit:'fifth',
		        	isFlag:'2',
		        	justiceType:'2',
		        },{
		        	name:'业外案件-生效库',
		        	name1:'vCheck',
		        	name2:'vSysList',
		        	limit:'sixth',
		        	isFlag:'1',
		        	justiceType:'2',
		        }]
	        }
    	}
    	sessionStorage.removeItem('justicePath')
    	this.getCheckList()
    },
    // computed: {
    // 	...mapState(['caseSend','justiceSend'])
    // },
    methods:{
    	...mapActions(['setData']),
    	handleClick(tab) {
    		this.activeName = tab.name
    		this.sendName = tab.label.split('-')[0]
    		var caseSend = sessionStorage.getItem('caseSend') === 'false'?false:true
			if(caseSend&&this.$route.query.id!='1_hajfxbs'){
				if(this.activeName == 'first' || this.activeName == 'second'){
						this.getPermission('1_hajfxbs')
    			} else{
    					this.getPermission('1_hsfajxxbs')
    			}
			}
    		this.getCheckList()
          	sessionStorage.removeItem("askData1");
          	sessionStorage.removeItem("askData2");
	    },
	    changeSessionStorage(data){
          this.checkList[data.no] = data.data
          sessionStorage.setItem('checkList',JSON.stringify(this.checkList))
        },
        getCheckList(){
          if(JSON.parse(sessionStorage.getItem('checkList'))){
            var checkList = JSON.parse(sessionStorage.getItem('checkList'))
            for(var i =0;i<checkList.length;i++){
               this.checkList[i] = checkList[i]
            }
          }
        },
	    getPermission(val){
	    	this.axios.post('rmUser/permissionIds',qs.stringify({roleId: sessionStorage.getItem('roleId'),moduleId: val})).then((res)=>{
            	this.setData({orgBtnData:res.data})
          	})
	    },
  	},
  	beforeRouteLeave(to,from,next){
	    let arr = ['justiceSpecialReport','justiceDetail','caseSpecialReport','caseDetail']
	    if(arr.indexOf(to.name)<0){
	      	sessionStorage.removeItem("askData1");
	      	sessionStorage.removeItem("askData2");
	      	sessionStorage.removeItem("checkList");
	    } else{
	    	sessionStorage.setItem('checkList',JSON.stringify(this.checkList))
	    }
	    next()
	},
}    
</script>
<style lang="scss">
    #justiceSend{
		.el-tabs__item{
	      	background: #fff;
	      	width: 160px;
	      	border-top-left-radius: 8px;
	      	border-top-right-radius: 8px;
	      	border-right: 1px solid #E9E9E9;
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
    	.el-tabs__item{
	      	padding:0;
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
