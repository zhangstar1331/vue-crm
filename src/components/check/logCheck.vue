<template>
	<div id="logCheck">
        <el-form :inline="true" :model="logForm" label-position="left" ref="logForm" size="mini">
            <el-form-item label="工号">
                <el-input v-model="logForm.userJobNo" @change='getJobNo' placeholder="请输入工号"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
				<el-select v-model="logForm.status" @change="getStatus" placeholder="请选择">
			    	<el-option v-for="item in stateArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="IP">
                <el-input v-model="logForm.ip" @change='getIP' placeholder="请输入IP"></el-input>
            </el-form-item>
            <el-form-item label="时间">
			    <el-date-picker type="date" @change="getStarDate" placeholder="选择日期" v-model="logForm.date1" :picker-options="pickerOptions1"></el-date-picker>
			</el-form-item>
			<el-form-item label="至">
			    <el-date-picker type="date" @change="getEndDate" placeholder="选择日期" v-model="logForm.date2" :picker-options="pickerOptions2"></el-date-picker>
			</el-form-item>
			<el-button type="primary" @click.native="searchData" class="searchBtn">搜索</el-button>
        </el-form>
	</div>
</template>
<script>
	import Bus from 'src/bus/bus.js'
	import {ajax} from 'src/utils/utils.js'
  	import qs from 'qs'
  	import {getUrlKey} from 'src/utils/utils.js'
  	import {mapState} from 'vuex'
	import {formatDate} from 'src/utils/utils.js'
	import {arrRemove} from 'src/utils/utils.js'
	export default {
		props:['flag'],
	    data () {
	      return {
	        logForm: {
	            userJobNo:'',
	            ip:'',
	            status: '',
	            date1:'',
	            date2:'',
	        },
	        stateArr:[{
	        	value: '',
	            label: '全部'
	        },{
	        	value: '1',
	            label: '成功'
	        }, {
	            value: '2',
	            label: '失败'
	        }],
	        logaskData:{
	        	jobNo:'',
	        	ip:'',
	        	startDate:'',
	            endDate:'',
	      		status:'',
	      		pageNumber:'1',
	      		pageSize:'10'
	        },
	        handleData:[], //操作数据
  			btnData:{   //按钮显示隐藏
  				openbtn: false,
  				exportbtn: false
  			},
  			pickerOptions1:{
  				disabledDate: (time) => {
	            	if (this.logForm.date2) {
                        return time.getTime() > Date.now() || time.getTime() > this.logForm.date2;
                    } else {
                        return time.getTime() > Date.now();
                    }
	          	},
  			},
  			pickerOptions2:{
  				disabledDate: (time) => {
	            	return time.getTime() < this.logForm.date1 || time.getTime() > Date.now();
	          	},
  			}
	      }
	    },
	    computed:{
	  		f1(){
	  			return this.$store.state.orgBtnData
	  		}
	  	},
	  	watch:{
	  		f1(newdata,olddata){
	  			this.getData(newdata)
	  		}
	  	},
	    created () {
	    	Bus.$off("isSlog");
	  		Bus.$on('isSlog', (data) => {
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
	    	this.getData(this.$store.state.orgBtnData)
		  	this.searchData();
	    },
	    methods: {
	      	// 员工工号
	      	getJobNo(val){
	      		if(val !== '' && !val.match(/^[-_a-zA-Z0-9]+$/)){
	      			this.$alert('工号不能包含特殊字符','提示', {
			          confirmButtonText: '确定'
			        });
	      		} 
	      		this.logaskData.jobNo = val
	      	},
	      	// IP
	      	getIP(val){
	      		if(val !== '' && !val.match(/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/)){
	      			this.$alert('IP格式不正确','提示', {
			          confirmButtonText: '确定'
			        });
	      		} 
	      		this.logaskData.ip = val;
	      	},
	      	// 状态
	      	getStatus(val){
	      		this.logaskData.status = val;
	      	},
	      	// 开始时间
	      	getStarDate(val){
      			if(val != null){
      				this.logaskData.startDate = formatDate(val,'yyyy-MM-dd');
      			}else{
      				this.logaskData.startDate = '';
      			}
	      	},
	      	// 结束时间
	      	getEndDate(val){
	     		if(val != null){
      				this.logaskData.endDate = formatDate(val,'yyyy-MM-dd');
      			}else{
      				this.logaskData.endDate = '';
      			}
	     	},
	     	// 搜索
	      	searchData () {
	      		// 工号验证
	      		if(this.logaskData.jobNo !== '' && !this.logaskData.jobNo.match(/^[-_a-zA-Z0-9]+$/)){
	      			this.$alert('工号不能包含特殊字符','提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		}
	      		if(this.logaskData.ip !== '' && !this.logaskData.ip.match(/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/)){
	      			this.$alert('IP格式不正确','提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		}
	      		if(this.logaskData.startDate == '' && this.logaskData.endDate !== ''){
      				this.$alert('开始日期不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		} else if(this.logaskData.startDate !== '' && this.logaskData.endDate == ''){
      				this.$alert('结束日期不能为空', '提示', {
			          confirmButtonText: '确定'
			        });
			        return
	      		}
      			var params = qs.stringify({
		    		jobNo: this.logaskData.jobNo,
		        	ip: this.logaskData.ip,
		        	startDate: this.logaskData.startDate,
		        	endDate:this.logaskData.endDate,
		        	status:this.logaskData.status,//1成功，2失败
		        	pageNumber:'1',
		        	pageSize:'10'
	        	})
	      		sessionStorage.logaskData = JSON.stringify(this.logaskData)
	      		Bus.$emit('logaskData',this.logaskData)
	      		this.axios.post('rmUser/getLog',params).then((res)=>{
	      			if(res.code == 200){
	      				if(res.data != null){
	      					Bus.$emit('logtableData',res.data)
	      				}else{
	      					Bus.$emit('logtableData',[]);
	      				}
	      			} else{
	      				this.$alert(res.message, '提示', {
				          confirmButtonText: '确定'
				        });
				        return
	      			}
				})
	      	},
	      	// 返回页面时加载数据
		    getData(aaa){
		    	this.handleData = aaa
		    	if(this.handleData !== undefined){
		    		if(this.handleData.indexOf('1_slogl')>=0){
	            		this.btnData.openbtn = true
	            	}else{
	            		this.btnData.openbtn = false
	            	}
	            	if(this.handleData.indexOf('1_sloge')>=0){
	            		this.btnData.exportbtn = true
	            	}else{
	            		this.btnData.exportbtn = false
	            	}
		    	}
		    }
	    }
	  }
</script>
<style>
	#logCheck .el-form-item--mini.el-form-item{
		width: auto!important
	}
	#logCheck .el-date-editor.el-input, #logCheck .el-date-editor.el-input__inner,#logCheck .el-form-item .el-form-item__content{
		width:142px;
	}
	#logCheck .el-form-item__label{
		padding: 0 12px 0 0;
	}
</style>
<style lang="scss" scoped="scoped">
	#logCheck{
		margin-bottom:10px
	}
	.searchBtn,.saveBtn{
		width: 68px;
		height: 28px;
		line-height: 1px
	}
</style>
