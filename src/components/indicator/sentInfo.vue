<template>
  <div id="sentInfo" class="contentBox">
  	<add-info v-if="isShow" :label="label" @closeMask="getMsgFormSon"></add-info>
		<div class="titIcon"><em></em><span style="font-weight: 600;">报送信息</span></div>
		<el-button type="primary" class="search" @click="addSentInfo" v-if="false">添加</el-button>
  	<div class="table-content">
  		<el-table :data="sentInfoData" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;cursor:pointer;">
				<el-table-column align="center" min-width="15%" prop="company" label="适用对象">
					<template slot-scope="scope">
			      <el-select class="bbb" :disabled="changeAble" v-model="sentInfoItem.company" placeholder="请选择">
				   	<el-option v-for="(item,index) in indicatorArr.sentInfo.company" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="15%" prop="department" label="报送部门">
					<template slot-scope="scope">
				    <el-select class="bbb" :disabled="changeAble" v-model="sentInfoItem.department" placeholder="请选择">
					   	<el-option v-for="(item,index) in indicatorArr.sentInfo.department" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="15%" prop="frequency" label="报送频率">
					<template slot-scope="scope">
					  <el-select class="bbb" :disabled="changeAble" v-model="sentInfoItem.frequency" placeholder="请选择">
						  <el-option v-for="(item,index) in indicatorArr.sentInfo.frequency" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="40%" prop="reportDate" label="有效期限">
					<template slot-scope="scope">
							<!--<div style="width:100%" v-for="(item,index) in scope.row.reportDate">
								<span v-if="item.month">{{item.month}}月{{item.day}}号 {{item.hour}}：00</span>
								<span v-else>每月{{item.day}}号 {{item.hour}}：00</span>
							</div>-->
	        		<div class="month" v-if="sentInfoItem.frequency=='1'||sentInfoItem.frequency=='月度'">
	        			<el-select class="aa bbb" v-model="sentInfoItem.reportDate[0].day" placeholder="请选择"> 
					   		<el-option v-for="item in indicatorArr.sentInfo.day" :key="item.id" :label="item.name" :value="item.id"> 
					   	</el-option> 
					   	</el-select>
					   	<el-select class="aa bbb" v-model="sentInfoItem.reportDate[0].hour" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.hour" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
	        		</div>
	        		<div class="quarter" v-for="(quarter,index) in sentInfoItem.reportDate" v-if="sentInfoItem.frequency=='2'||sentInfoItem.frequency=='季度'" style="margin:2px 0">
				  		<span class="titleCss" v-if="index==0">一季度：</span>
				  		<span class="titleCss" v-if="index==1">二季度：</span>
				  		<span class="titleCss" v-if="index==2">三季度：</span>
				  		<span class="titleCss" v-if="index==3">四季度：</span>
				  		<el-select class="aa bbb" v-model="quarter.month" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.month" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select class="aa bbb" v-model="quarter.day" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.day" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select class="aa bbb" v-model="quarter.hour" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.hour" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  	</div>
					<div class="quarter" v-for="(quarter,index) in sentInfoItem.reportDate" v-if="sentInfoItem.frequency=='4'||sentInfoItem.frequency=='半年度'" style="margin:2px 0">
				  		<span class="titleCss" v-if="index==0">上半年：</span>
				  		<span class="titleCss" v-if="index==1">下半年：</span>
				  		<el-select class="aa bbb" v-model="quarter.month" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.month" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select class="aa bbb" v-model="quarter.day" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.day" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select class="aa bbb" v-model="quarter.hour" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.hour" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  	</div>
				  	<div class="year" v-if="sentInfoItem.frequency=='3'||sentInfoItem.frequency=='年度'">
				  		<el-select class="aa bbb" v-model="sentInfoItem.reportDate[0].month" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.month" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select class="aa bbb" v-model="sentInfoItem.reportDate[0].day" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.day" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  		<el-select class="aa bbb" v-model="sentInfoItem.reportDate[0].hour" placeholder="请选择"> <el-option v-for="item in indicatorArr.sentInfo.hour" :key="item.id" :label="item.name" :value="item.id"> </el-option> </el-select>
				  	</div>
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="15%" prop="act" label="获取类型">
					<template slot-scope="scope">
					  <el-select class="bbb" v-model="sentInfoItem.act" placeholder="请选择">
					   	<el-option v-for="(item,index) in indicatorArr.sentInfo.act" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="sentInfoOpe" label="操作" width="100" v-if="false">
					<template slot-scope="scope">
						<span class="handleBtn" @click="goEdit(scope.$index)">编辑</span>
						<span class="handleBtn" @click="goDelet(scope.$index)">删除</span>
					</template>
				</el-table-column>
			</el-table>
  	</div>
  	<div v-if="indicator.category == '1'&& sentInfoItem.frequency == '1'">
  		<el-form :model="indicator" label-position="left" class="demo-ruleForm" size="mini">
			<el-row>
				<el-col :span="9">
	        		<el-form-item label="是否为月度报送，按照季度合计数判断红黄蓝状态">
						<el-radio-group class="radioframe" @change="vmodel('indicator.flag')" v-model="indicatorObj.flag">
							<el-radio :label="a">是</el-radio>
							<el-radio :label="c">否</el-radio>
						</el-radio-group>
					</el-form-item>
			    </el-col> 
				<el-col :span="8">
	        		<el-form-item label="提交月度指标时校验规则">
						  <el-select class="inpframe" @change="vmodel('indicator.desRule')" v-model="indicatorObj.desRule" placeholder="请选择指标等级" style="width:45%;">
						   	<el-option v-for="item in indicatorArr.desRule" :key="item.id" :label="item.name" :value="item.id"></el-option>
						  </el-select>
					</el-form-item>
			    </el-col>
	    	</el-row>
  		</el-form>
  	</div>
  </div>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import addInfo from 'src/components/indicator/addSentInfo'
	import Bus from 'src/bus/bus.js'
	import {formatDate} from 'src/utils/utils.js'
	import qs from 'qs'
	export default {
		data(){
			return {
				a:'1',
				b:'0',
				c:'',
				sentInfoData:[{
					company:'',
					department:'',
					frequency:'',
					reportDate:[],
					act:''
				}],
				sentInfoItem:{
					company:'',
					department:'',
					frequency:'',
					reportDate:[],
					act:''
				},
				sentInfoDataId:[],
				isShow:false,
				changeAble:false,//编辑页面，适用对象不可修改
				indicatorObj:{},
				label:{
					itemId:0,//0为添加，1为编辑
					data:'',
					row:''
				},
			}
		},
		methods:{
			...mapActions(['setData']),
			addSentInfo(){
				this.isShow = true;
				this.label.itemId = 0
				this.label.data = ''
				this.row = ''
			},
			getMsgFormSon(data){
				this.isShow = data.status;
			},
			goDelet(index){
				this.sentInfoData.splice(index,1)
				this.sentInfoDataId.splice(index,1)
				this.setData({'indicator.reportInfo':JSON.parse(JSON.stringify(this.sentInfoDataId))})
			},
			goEdit(index){
				this.label.itemId = 1
				this.label.data = this.sentInfoData[index]
				this.label.row = index
				this.isShow = true;
			},
			getAddInfo(){
				Bus.$on('addSentInfo',(data)=>{
					if(data.way == 0){
						var sentInfoItem = data.sentInfoItem
						var obj = {
							company:'',
							department:'',
							frequency:'',
							reportDate:[],
							act:''
						}
						var obj1 = {
							company:'',
							department:'',
							frequency:'',
							reportDate:[],
							act:''
						}
						Object.keys(sentInfoItem).forEach(function(key){
						  if(key != 'reportDate' && sentInfoItem[key].indexOf('~')!=-1){
						  	var arr = sentInfoItem[key].split('~')
						  	obj[key] = arr[0]
						  	obj1[key] = arr[1]
						  }else{
						  	obj[key] = sentInfoItem[key]
						  	obj1[key] = sentInfoItem[key]
						  }
						})
						this.sentInfoData.push(obj)
						this.sentInfoDataId.push(obj1)
						this.setData({'indicator.reportInfo':JSON.parse(JSON.stringify(this.sentInfoDataId))})
					}else{
						var sentInfoItem = data.sentInfoItem
						for(var key in sentInfoItem){
						  if(key!='reportDate'&&key!='companyName'&&key!='departmentName'&& sentInfoItem[key].indexOf('~')!=-1){
						  	var arr = sentInfoItem[key].split('~')
						  	this.sentInfoData[data.row][key]=arr[0]
						  	this.sentInfoDataId[data.row][key]=arr[1]
						  	this.setData({'indicator.reportInfo':JSON.parse(JSON.stringify(this.sentInfoDataId))})
						  }
						  if(key=='reportDate'){
						  	this.sentInfoData[data.row][key]=sentInfoItem[key]
						  	this.sentInfoDataId[data.row][key]=sentInfoItem[key]
						  	this.setData({'indicator.reportInfo':JSON.parse(JSON.stringify(this.sentInfoDataId))})
						  }
						}
					}
				})
			},
			vmodel(key){
	    		var obj = {}
	    		const arr = key.split(".");
	    		obj[key] = this.indicatorObj[arr[1]]
	    		this.setData(obj)
	    	}
		},
		components:{
			addInfo
		},
		created(){
			this.getAddInfo()
			if(this.indicator.reportInfo && this.indicator.reportInfo.length){
				//报送信息页面回值
				var sentInfoData = JSON.parse(JSON.stringify(this.indicator.reportInfo));
				this.sentInfoItem = sentInfoData[0];
				/*
				this.sentInfoDataId = JSON.parse(JSON.stringify(this.indicator.reportInfo));
				var sentInfo = JSON.parse(JSON.stringify(this.indicatorArr.sentInfo)); 
				for(var i = 0; i < sentInfoData.length; i++){
					Object.keys(sentInfoData[i]).forEach(function(key){
							if(key == 'department' || key == 'company'){
								sentInfoData[i][key] = sentInfo.codpNames[sentInfoData[i][key]]
							}else{
								Object.keys(sentInfo).forEach(function(key1){
						    	if(key == key1){
						    		for(var j = 0;j < sentInfo[key1].length; j++){
						    			if(sentInfo[key1][j].id == sentInfoData[i][key]){
						    				sentInfoData[i][key] = sentInfo[key1][j].name
						    			}
						    		}
						    	}
								})
							}
					});
				}
				this.sentInfoData = sentInfoData;
				*/
			}
			this.indicatorObj = JSON.parse(JSON.stringify(this.indicator)); 
		},
		mounted(){
			if(this.$route.params.editid){
				this.changeAble = true
			}
		},
		computed:{
			...mapState(['indicator','indicatorArr'])
		},
		watch:{
			'indicator':{
				handler(newVal){
					this.indicatorObj = JSON.parse(JSON.stringify(newVal)); 
				},
				deep:true
			},
			'indicator.reportInfo':{
				handler(newVal,oldVal){
					if(newVal){
						var company = []
						var sentInfoCompany = JSON.parse(JSON.stringify(this.indicatorArr.sentInfo.company)); 
						for(var i = 0; i < newVal.length; i++){
							var obj = {}
							var flag = true
							for(var j = 0; j < sentInfoCompany.length; j++){
								if(newVal[i].company == sentInfoCompany[j].id){
									obj.id = newVal[i].company
									obj.name = sentInfoCompany[j].name
									for(var k = 0; k < company.length; k++){
										if(company[k].id == sentInfoCompany[j].id){
											flag = false
										}
									}
								}
							}
							if(flag){
								company.push(obj)
							}
						}
						this.setData({'indicatorArr.threshold.company':company})
					}
				},
				deep:true,
				immediate: true
			},
			'sentInfoItem.company':{
				handler(newVal,oldVal){
					if(newVal && this.indicator.threshold.length){
						var arr = JSON.parse(JSON.stringify(this.indicator.threshold)); 
						arr[0].company = newVal;
						this.setData({'indicator.threshold':arr})
					}
					if(newVal && this.indicator.prefTolerance.length){
						var arr = JSON.parse(JSON.stringify(this.indicator.prefTolerance)); 
						arr[0].indType = newVal;
						this.setData({'indicator.prefTolerance':arr})
					}
					if(newVal && this.indicator.dfTolerance.length){
						var arr = JSON.parse(JSON.stringify(this.indicator.dfTolerance)); 
						arr[0].indType = newVal;
						this.setData({'indicator.dfTolerance':arr})
					}
					if(newVal && this.indicator.limitTolerance.length){
						var arr = JSON.parse(JSON.stringify(this.indicator.limitTolerance)); 
						arr[0].indType = newVal;
						this.setData({'indicator.limitTolerance':arr})
					}
					if(oldVal){
						this.sentInfoItem.department = ''
					}
					this.axios.post('/indicator/department',qs.stringify({company:newVal})).then((res)=>{
	   					if(res.code == 200){
	   						this.setData({'indicatorArr.sentInfo.department':res.data})
	   					}else{
	   						this.$alert('监测部门查询失败！')
	   					}
					})
				}
			},
			'sentInfoItem.frequency':{
				handler(newVal,oldVal){
					if(this.$route.params.editid && !oldVal){
						return
					}else{
						this.sentInfoItem.reportDate = []
					}
					if(newVal == '1'){
						this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.monthArr
					}
					if(newVal == '2'){
						for(var i = 0; i < 4; i++){
							this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.quarterArr
						}
					}
					if(newVal == '3'){
						this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.yearArr
					}
					if(newVal == '4'){
						for(var i = 0; i < 2; i++){
							this.sentInfoItem.reportDate = this.indicatorArr.sentInfo.halfyearArr
						}
					}
					if(this.indicator.category == '1' && newVal !== '1'){
						this.indicatorObj.flag = ''
						this.indicatorObj.desRule = '1'
						this.setData({'indicator.flag':''})
						this.setData({'indicator.desRule':'1'})
					} else{
						this.indicatorObj.flag = ''
						this.indicatorObj.desRule = ''
						this.setData({'indicator.flag':''})
						this.setData({'indicator.desRule':''})
					}
				}
			},
			'sentInfoItem':{
				handler(newVal,oldVal){
					this.sentInfoData = []
					this.sentInfoData.push(newVal)
					this.setData({'indicator.reportInfo':JSON.parse(JSON.stringify(this.sentInfoData))})
				},
				deep:true
			},
			'indicator.category':{
				handler(newVal){
					if(newVal !== '1'){
						this.indicatorObj.flag = ''
						this.indicatorObj.desRule = ''
						this.setData({'indicator.flag':''})
						this.setData({'indicator.desRule':''})
					} else{
						if(this.sentInfoItem.frequency&&this.sentInfoItem.frequency !== '1'){
							this.indicatorObj.flag = ''
							this.indicatorObj.desRule = '1'
							this.setData({'indicator.flag':''})
							this.setData({'indicator.desRule':'1'})
						}
					}
				},
				deep:true
			},
		}
	}
</script>
<style lang="scss">
	.bbb .el-input__inner,.bbb .el-input__icon{
		height:28px;
		line-height:28px;
	}
</style>
<style lang="scss" scoped>
  .table-content{
  	margin:0 auto 20px auto;
  }
  .search{
		margin-left:10px;
  	float:right;
	}
	.el-button{
		width:68px;
		height:26px;
		padding:0px;
		font-size: 12px;
	}
	.handleBtn{
		color:#4285F4;
	}
	.aa{
		width:27%;
	}
</style>
