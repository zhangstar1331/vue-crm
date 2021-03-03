<template>
  <div class="render2">
  	<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
      <el-breadcrumb-item  class="ngTxtColor" :to="{path:'/repository/in-manage?id=1_cinner'}">内部制度管理</el-breadcrumb-item>
		  <el-breadcrumb-item  v-if="panelShow" class="txtColor">{{titMsg}}</el-breadcrumb-item>
		</el-breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    		<!--风险管理类制度树-->
    		<el-tab-pane label="风险管理类制度树" v-if="tab3"  name="third">
          <el-button type="primary" v-if="newBuildBtn" @click="goAdd" class="newBuildBtnTree">新建制度</el-button>
			    		<div class="box tbox3" style="padding-bottom: 100px;">
			    			<div class="titIcon"><em></em><span style="font-weight: 600">风险管理类制度树</span></div>
			    			<div class="levelGroup">
										<p v-for="item in instNum">
											<span>{{item.name}}</span>
											<span>（{{item.count}}）</span>
										</p>
			          </div>
			    			<v-fxTree :treeData="treeData" v-if="isChildUpdate3"></v-fxTree>
			    		</div>
		    </el-tab-pane>
		    <!--公司管理类制度树-->
    		<el-tab-pane label="公司管理类制度树" v-if="tab4"  name="fourth" >
			    		<div class="box tbox4">
			    			<div class="titIcon"><em></em><span style="font-weight: 600">公司管理类制度树</span></div>
			    			<v-companyTree v-if="isChildUpdate4&&companySource == '0'" :companyData = "companyData"></v-companyTree>
			    			<v-companyTreeCX v-if="isChildUpdate4&&companySource == '1'" :companyData = "companyData"></v-companyTreeCX>
			    		</div>
		    </el-tab-pane>
    		<!--列表查询-->
          <el-tab-pane label="列表查询" v-if="tab1"  name="first">
            <!--查询组件-->
            <div class="box">
              <div class="titIcon"><em></em><span style="font-weight: 600;">筛选查询</span></div>
              <v-check :flag="flag" v-if="isChildUpdate1"></v-check>
            </div>

            <!--制度列表组件-->
	    		<div class="sysBox">
	    			<div class="titIcon"><em></em><span style="font-weight: 600;">制度列表</span></div>
	    			<v-sysList v-if="isChildUpdate1"></v-sysList>
	    		</div>
	    	</el-tab-pane>
				<!--全文检索-->
		    <el-tab-pane label="全文检索" v-if="tab2" style="font-weight: 600" name="second">
			    		<div class="box tbox">
			    			<div class="titIcon"><em></em><span>全文检索</span></div>
			    			<v-textSearch v-if="isChildUpdate2"></v-textSearch>
			    		</div>
		    </el-tab-pane>
		</el-tabs>
  </div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import vCheck from 'src/components/check/inCheck'
	import vSysList from 'src/components/sysList/inSysList'
	import vTextSearch from 'src/components/textSearch/textSearch'
	import vFxTree from 'src/components/inFxTree/inFxTree'
	import vCompanyTree from 'src/components/inCompanyTree/inCompanyTree'
	import vCompanyTreeCX from 'src/components/inCompanyTree/inCompanyTreeCX'
	import qs from 'qs'
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
  export default {
  	data() {
        return {
          panelShow:true,
        	flag:0,
        	tab1:true,
      		tab2:true,
      		tab3:true,
      		tab4:true,
			    activeName: "third",
			    isChildUpdate1:false,
          isChildUpdate2:false,
          isChildUpdate3:true,
          isChildUpdate4:false,
          newBuildBtn:false,
          titMsg:"风险管理类制度树",
          id:'',
          instNum:[],
          companyData:{},
          handleData:[],
          treeData:[],
          add:this.$route.params.isChildUpdate2
			}
   },
    components:{
    		vCheck,
    		vSysList,
    		vTextSearch,
    		vFxTree,
    		vCompanyTree,
    		vCompanyTreeCX
    },
    computed:{
    	...mapState(['companySource']),
  		f1(){
  			return this.$store.state.orgBtnData
  		}
  	},
  	watch:{
	  		f1(newdata,olddata){
	  			this.getData(newdata)
	  		}
	  	},
    created(){
    	Bus.$off("isCinner");
	    Bus.$on('isCinner', (data) => {
	        this.$alert('权限发生变化，请重新登录', '提示', {
	            confirmButtonText: '确定',
	            callback: action => {
	              this.axios.post('rmUser/authLogout').then((res)=>{
	                  if (res.code == 200) {
	                    this.$store.commit('SET_TOKEN', '');
	                    this.$store.commit('SET_USER', null);
	                    this.$router.replace({path: '/login'});
	                  } else {
	                    this.$alert(res.message, '提示', {
	                      confirmButtonText: '确定'
	                    });
	                  }
	              })
	            }
	          })
	    }) 
	    //获取不同制度条数
	    this.getInsitNum()
    	this.getData(this.$store.state.orgBtnData)
		sessionStorage.setItem('type',1)
    },
    methods:{
      returnTo(){
        this.activeName = 'third'
        this.handleClick({name:'third'})
        this.panelShow=false
      },
			getInsitNum(){
				this.axios.post('instweb/innerCount',JSON.stringify({}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
        	this.instNum = res.data.lm
        	this.companyData = res.data.mvcMap
        })
			},
      //接收参数
        app(){
          if(this.add ==isChildUpdate2 ){
            this.handleClick(tab.name == "first")
          }
        },

        handleClick(tab) {
            if(tab.name == "first") {
                this.panelShow=true
                this.isChildUpdate1 = true;
                this.isChildUpdate2 = false;
                this.isChildUpdate3 = false;
                this.isChildUpdate4 = false;
                this.titMsg = "列表查询"
            } else if(tab.name == "second") {
                this.panelShow=true
                this.isChildUpdate1 = false;
                this.isChildUpdate2 = true;
                this.isChildUpdate3 = false;
                this.isChildUpdate4 = false;
                this.titMsg = "全文检索"
            }else if(tab.name == "third"){
            		this.isChildUpdate1 = false;
                this.isChildUpdate2 = false;
                this.isChildUpdate3 = true;
                this.isChildUpdate4 = false;
                this.titMsg = "风险管理类制度树"
            }else{
                this.panelShow=true
            		this.isChildUpdate1 = false;
                this.isChildUpdate2 = false;
                this.isChildUpdate3 = false;
                this.isChildUpdate4 = true;
                this.titMsg = "公司管理类制度树"
            }
        },
        getTreeData(){
	    		this.axios.post('instweb/query/tree',JSON.stringify({id:this.id}),{headers:{'Content-Type':'application/json'}}).then((res)=>{
	            	this.treeData = res.data;
	            })
        },
        goAdd(){//新增机构
				this.$router.push({
	  				path: '/innewRegulations',
	  				query:{
	  					name:1,
	  					id: getUrlKey('id')
	  				}
	  			})
	  		},
         // 返回页面时加载数据
		   getData(aaa){
		   		this.handleData = aaa
		    	if(this.handleData !== undefined){
			  				//风险管理树
			  		if(this.handleData.indexOf('1_cinnerrt')>=0){
	            		this.tab3 = true
	            }else{
        					this.tab3 = false
	        		}
	            	//公司管理制度树
	          if(this.handleData.indexOf('1_cinnermt')>=0){
	            		this.tab4 = true
	            }else{
        					this.tab4 = false
	        		}
	            	//查看列表
	          if(this.handleData.indexOf('1_cinnerl')>=0){
	            		this.tab1 = true
	           	}else{
        					this.tab1 = false
	        		}
	            	//全文检索
	          if(this.handleData.indexOf('1_cinners')>=0){
	            		this.tab2 = true
	            }else{
        					this.tab2 = false
	        		}
	            //新建按钮
	        	if(this.handleData.indexOf('1_cinnera')>=0){
            		this.newBuildBtn = true
            	}else{
            		this.newBuildBtn = false
            	}	
	        	//tab切换初始默认值
	        	if(this.tab3){
	        		this.activeName = 'third'
	        		this.handleClick({name:'third'})
	        		return;
	        	}
	        	if(this.tab4){
	        		this.activeName = 'fourth'
	        		this.handleClick({name:'fourth'})
	        		return;
	        	}
						if(this.tab2){
								this.activeName = 'second'
								this.handleClick({name:'second'})
								return;
							}
						if(this.tab1){
								this.activeName = 'first'
								this.handleClick({name:'first'})
						}
	        }
		    }
    },
  //  路由导航钩子
    beforeRouteEnter (to, from, next) {
			  next((that) => {
			    if(from.fullPath.includes('/inReverse') || from.fullPath.includes('/inReverseEdit') || from.fullPath.includes('/innewRegulations') || from.fullPath.includes('/innewDetail')){
			    	that.activeName='first'
			      that.handleClick({name:'first'});
			    }
			  }
      )
    }
  };
</script>
<style lang="scss">
    .render2{
    	.el-breadcrumb{
	    		margin-bottom: 16px;
	    		margin-top: 20px;
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
	    .tbox{
	    	padding-bottom:50px;
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
	    #tab-first{
	    	background: #fff;
	    	width: 100px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
	    }
	    #tab-second{
	    	background: #fff;
	    	width: 100px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
	    }
	    #tab-third{
	    	background: #fff;
	    	width: 136px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
	    }
	    #tab-fourth{
	    	background: #fff;
	    	width: 136px;
	    	border-top-left-radius: 8px;
	    	border-top-right-radius: 8px;
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
	    .levelGroup{
	    	overflow: hidden;
	    	width: 100%;
	    	height: 30px;
	    	padding-left: 25px;
	    	p{
	    		float: left;
	    		margin-right:20px;
	    		font-size: 14px;
	    	}
	    }
    }
    .el-breadcrumb__inner{
    	color: #4285F4!important;
    	font-weight: 700!important;
    }
    .is-link{
    	color: #909191!important;
    }
    .exportBtn,.newBuildBtn{
    	  float: right;
    	  margin-right: 5px;
		    width: 68px;
		    height: 26px;
		    padding: 0;
		    font-size: 12px;
    }
    .exportBtn{
    	margin-right: 20px;
    }
  .newBuildBtnTree{
    margin-top: 27px;
    margin-right: 27px;
    float: right;
    width: 68px;
    height: 26px;
    padding: 0;
    font-size: 12px;
    a{
      color: white;
    }
  }
  .ngTxtColor span{
  	color: #909191 !important;
    font-weight: 700;
  }
</style>
