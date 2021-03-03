<template>
  <div id="timeOut">
		  <el-header class="header" style="padding-left:218px">
		  	<el-row>
			  	<el-col :span="12">
				  	<el-breadcrumb separator-class="el-icon-arrow-right">
						  <el-breadcrumb-item><span class="textColor1">风险监测指标管理</span></el-breadcrumb-item>
						  <el-breadcrumb-item><span class="textColor">定时任务时点配置</span></el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="9">
				  	<el-button type="primary" @click="submitAll" size="mini">提交</el-button>
				  </el-col>
			  </el-row>
		  </el-header>
			<!--制度列表组件-->
		<div class="timeOutlist">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">设置报送时效信息</span></div>
    			<div class="timeList">
    				<el-row class="monthSend">
						  <el-col :span="4" style="text-align: center;border-right: 1px solid #E9E9E9;"><div class="titles">月度指标报送时效</div></el-col>
						  <el-col :span="20">
						  	<div>
						  			<span class="titleCss">每 月：</span><el-select v-model="timeData.indicatorConfigRepMonth.day" @change="(val)=>getDay(val,'indicatorConfigRepMonth')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepMonth.huor" @change="(val)=>getTime(val,'indicatorConfigRepMonth')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  </el-col>
						</el-row>
						<el-row class="seasonSend">
						  <el-col :span="4" style="text-align: center;border-right: 1px solid #E9E9E9;height: 243px;line-height: 243px;"><div class="titles">季度指标报送时效</div></el-col>
						  <el-col :span="20" style="height: 243px;">
						  	<div>
						  		<span class="titleCss">一季度：</span><el-select v-model="timeData.indicatorConfigRepQuarter.q1.month" @change="(val)=>getMonth(val,'indicatorConfigRepQuarter1')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigRepQuarter.q1.day" @focus="(val)=>setDays(val,'indicatorConfigRepQuarter1')" @change="(val)=>getDay(val,'indicatorConfigRepQuarter1')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepQuarter.q1.huor"  @change="(val)=>getTime(val,'indicatorConfigRepQuarter1')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">二季度：</span><el-select v-model="timeData.indicatorConfigRepQuarter.q2.month" @change="(val)=>getMonth(val,'indicatorConfigRepQuarter2')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigRepQuarter.q2.day" @focus="(val)=>setDays(val,'indicatorConfigRepQuarter2')" @change="(val)=>getDay(val,'indicatorConfigRepQuarter2')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepQuarter.q2.huor"  @change="(val)=>getTime(val,'indicatorConfigRepQuarter2')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">三季度：</span><el-select v-model="timeData.indicatorConfigRepQuarter.q3.month" @change="(val)=>getMonth(val,'indicatorConfigRepQuarter3')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigRepQuarter.q3.day" @focus="(val)=>setDays(val,'indicatorConfigRepQuarter3')" @change="(val)=>getDay(val,'indicatorConfigRepQuarter3')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepQuarter.q3.huor"  @change="(val)=>getTime(val,'indicatorConfigRepQuarter3')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">四季度：</span><el-select v-model="timeData.indicatorConfigRepQuarter.q4.month"  @change="(val)=>getMonth(val,'indicatorConfigRepQuarter4')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigRepQuarter.q4.day" @focus="(val)=>setDays(val,'indicatorConfigRepQuarter4')" @change="(val)=>getDay(val,'indicatorConfigRepQuarter4')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepQuarter.q4.huor"  @change="(val)=>getTime(val,'indicatorConfigRepQuarter4')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  </el-col>
						</el-row>
						<el-row class="halfyearSend">
						  <el-col :span="4" style="text-align: center;border-right: 1px solid #E9E9E9;height: 120px;line-height: 120px;"><div class="titles">半年度指标报送时效</div></el-col>
						  <el-col :span="20" style="height: 120px;">
						  	<div>
						  		<span class="titleCss">上半年：</span><el-select v-model="timeData.indicatorConfigRepHalfYear.half1.month" @change="(val)=>getMonth(val,'indicatorConfigRepHalfYear1')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigRepHalfYear.half1.day" @focus="(val)=>setDays(val,'indicatorConfigRepHalfYear1')" @change="(val)=>getDay(val,'indicatorConfigRepHalfYear1')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepHalfYear.half1.huor" @change="(val)=>getTime(val, 'indicatorConfigRepHalfYear1')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">下半年：</span><el-select v-model="timeData.indicatorConfigRepHalfYear.half2.month" @change="(val)=>getMonth(val,'indicatorConfigRepHalfYear2')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigRepHalfYear.half2.day" @focus="(val)=>setDays(val,'indicatorConfigRepHalfYear2')" @change="(val)=>getDay(val,'indicatorConfigRepHalfYear2')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepHalfYear.half2.huor" @change="(val)=>getTime(val, 'indicatorConfigRepHalfYear2')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  </el-col>
						</el-row>
						<el-row class="yearSend" style="border: none;">
						  <el-col :span="4" style="text-align: center;border-right: 1px solid #E9E9E9;"><div class="titles">年度指标报送时效</div></el-col>
						  <el-col :span="20">
						  	<div>
						  		<span class="titleCss">每 年：</span><el-select v-model="timeData.indicatorConfigRepYear.month" @change="(val)=>getMonth(val,'indicatorConfigRepYear')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigRepYear.day" @focus="(val)=>setDays(val,'indicatorConfigRepYear')" @change="(val)=>getDay(val,'indicatorConfigRepYear')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigRepYear.huor" @change="(val)=>getTime(val, 'indicatorConfigRepYear')" class="timePick" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  </el-col>
						</el-row>
	      	</div>
	      	<div class="titIcon" style="margin-top: 25px;"><em></em><span style="font-weight: 600;">设置再保人集中度报送时效</span></div>
	      	<div class="timeList" style="margin-top: 65px;">
						<el-row class="seasonSend">
						  <el-col :span="4" style="text-align: center;border-right: 1px solid #E9E9E9;height: 243px;line-height: 243px;"><div class="titles">季度指标报送时效</div></el-col>
						  <el-col :span="20" style="height: 243px;">
						  	<div>
						  		<span class="titleCss">一季度：</span><el-select v-model="timeData.focusQuarter.q1.month" @change="(val)=>getMonth(val,'indicatorConfigFocusQuarter1')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.focusQuarter.q1.day" @focus="(val)=>setDays(val,'indicatorConfigFocusQuarter1')" @change="(val)=>getDay(val,'indicatorConfigFocusQuarter1')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.focusQuarter.q1.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigFocusQuarter1')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">二季度：</span><el-select v-model="timeData.focusQuarter.q2.month" @change="(val)=>getMonth(val,'indicatorConfigFocusQuarter2')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.focusQuarter.q2.day" @focus="(val)=>setDays(val,'indicatorConfigFocusQuarter2')"  @change="(val)=>getDay(val,'indicatorConfigFocusQuarter2')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.focusQuarter.q2.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigFocusQuarter2')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">三季度：</span><el-select v-model="timeData.focusQuarter.q3.month" @change="(val)=>getMonth(val,'indicatorConfigFocusQuarter3')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.focusQuarter.q3.day" @focus="(val)=>setDays(val,'indicatorConfigFocusQuarter3')" @change="(val)=>getDay(val,'indicatorConfigFocusQuarter3')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.focusQuarter.q3.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigFocusQuarter3')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">四季度：</span><el-select v-model="timeData.focusQuarter.q4.month" @change="(val)=>getMonth(val,'indicatorConfigFocusQuarter4')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.focusQuarter.q4.day" @focus="(val)=>setDays(val,'indicatorConfigFocusQuarter4')" @change="(val)=>getDay(val,'indicatorConfigFocusQuarter4')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.focusQuarter.q4.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigFocusQuarter4')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  </el-col>
						</el-row>
	      	</div>
	      	<div class="titIcon" style="margin-top: 25px;"><em></em><span style="font-weight: 600;">设置投资集中度报送时效</span></div>
	      	<div class="timeList" style="margin-top: 65px;">
						<el-row class="seasonSend">
						  <el-col :span="4" style="text-align: center;border-right: 1px solid #E9E9E9;height: 243px;line-height: 243px;"><div class="titles">季度指标报送时效</div></el-col>
						  <el-col :span="20" style="height: 243px;">
						  	<div>
						  		<span class="titleCss">一季度：</span><el-select v-model="timeData.indicatorConfigConcentrate.q1.month" @change="(val)=>getMonth(val,'indicatorConfigConcentrateQuarter1')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigConcentrate.q1.day" @focus="(val)=>setDays(val,'indicatorConfigConcentrateQuarter1')" @change="(val)=>getDay(val,'indicatorConfigConcentrateQuarter1')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigConcentrate.q1.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigConcentrateQuarter1')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">二季度：</span><el-select v-model="timeData.indicatorConfigConcentrate.q2.month" @change="(val)=>getMonth(val,'indicatorConfigConcentrateQuarter2')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigConcentrate.q2.day" @focus="(val)=>setDays(val,'indicatorConfigConcentrateQuarter2')" @change="(val)=>getDay(val,'indicatorConfigConcentrateQuarter2')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigConcentrate.q2.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigConcentrateQuarter2')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">三季度：</span><el-select v-model="timeData.indicatorConfigConcentrate.q3.month" @change="(val)=>getMonth(val,'indicatorConfigConcentrateQuarter3')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigConcentrate.q3.day" @focus="(val)=>setDays(val,'indicatorConfigConcentrateQuarter3')" @change="(val)=>getDay(val,'indicatorConfigConcentrateQuarter3')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigConcentrate.q3.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigConcentrateQuarter3')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  	<div>
						  		<span class="titleCss">四季度：</span><el-select v-model="timeData.indicatorConfigConcentrate.q4.month" @change="(val)=>getMonth(val,'indicatorConfigConcentrateQuarter4')" placeholder="请选择"> <el-option v-for="item in oneSeason" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-select v-model="timeData.indicatorConfigConcentrate.q4.day" @focus="(val)=>setDays(val,'indicatorConfigConcentrateQuarter4')" @change="(val)=>getDay(val,'indicatorConfigConcentrateQuarter4')" placeholder="请选择"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-time-select v-model="timeData.indicatorConfigConcentrate.q4.huor"  class="timePick"  @change="(val)=>getTime(val,'indicatorConfigConcentrateQuarter4')" :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }" placeholder="00：00"> </el-time-select>
						  	</div>
						  </el-col>
						</el-row>
	      	</div>
		</div>
		<div class="timeOutlist1" style="margin-top: 20px;margin-bottom: 20px;">
    			<div class="titIcon"><em></em><span style="font-weight: 600;">设置超时提醒</span></div>
    			<div class="timeList">
    				<el-row>
						  <el-col :span="24">
						  	<div>
						  		<span class="titleCss">截止日期前：</span><el-input v-model="submitData.remind"  placeholder="请输入截止日期前天数"></el-input> 天
						  		<span class="titleCss" style="margin-left: 110px;">超期后每间隔：</span><el-input v-model="submitData.interval"  placeholder="请输入截止日期前天数"></el-input> 天
						  	</div>
						  </el-col>
						</el-row>
	      	</div>
		</div>
  </div>
</template>
<script>
	import {mapState} from 'vuex'
	import {getUrlKey} from 'src/utils/utils.js'
	import qs from 'qs'
	import jquery from 'jquery'
  export default {
  	data() {
        return {
          panelShow:true,
        	totalResults:0,
        	tableData4:[],
        	timeData:{
        		indicatorConfigRepMonth:{
        			day:'',
        			huor:''
        		},
        		indicatorConfigRepQuarter:{
        			q1: {
								month: '',
								day: '',
								huor: '24'
							},
							q2: {
								month: '',
								day: '',
								huor: '24'
							},
							q3: {
								month: '',
								day: '',
								huor: '24'
							},
							q4: {
								month: '',
								day: '',
								huor: '24'
							},
        		},
        		indicatorConfigRepYear:{
        			month: '',
							day: '',
							huor: '24'
        		},
        		indicatorConfigConcentrate:{
        			q1: {
								month: '',
								day: '',
								huor: '24'
							},
							q2: {
								month: '',
								day: '',
								huor: '24'
							},
							q3: {
								month: '',
								day: '',
								huor: '24'
							},
							q4: {
								month: '',
								day: '',
								huor: '24'
							},
        		},
        		focusQuarter:{
        			q1: {
								month: '',
								day: '',
								huor: '24'
							},
							q2: {
								month: '',
								day: '',
								huor: '24'
							},
							q3: {
								month: '',
								day: '',
								huor: '24'
							},
							q4: {
								month: '',
								day: '',
								huor: '24'
							},
        		},
        		indicatorConfigRepHalfYear:{
        			half1: {
						month: '',
						day: '',
						huor: '24'
					},
					half2: {
						month: '',
						day: '',
						huor: '24'
					},
        		},
        		remind:'',
        		interval:''
        	},
        	submitData:{
        		indicatorConfigRepMonth:{
        			day:'',
        			huor:''
        		},
	    			indicatorConfigFocusQuarter1: {
								month: '',
								day: '',
								huor: '24'
							},
						indicatorConfigFocusQuarter2: {
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigFocusQuarter3: {
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigFocusQuarter4: {
							month: '',
							day: '',
							huor: '24'
						},
        		indicatorConfigRepYear:{
        			month: '',
							day: '',
							huor: '24'
        		},
	    			indicatorConfigRepQuarter1: {
								month: '',
								day: '',
								huor: '24'
							},
						indicatorConfigRepQuarter2: {
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigRepQuarter3: {
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigRepQuarter4: {
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigConcentrateQuarter1:{
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigConcentrateQuarter2:{
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigConcentrateQuarter3:{
							month: '',
							day: '',
							huor: '24'
						},
						indicatorConfigConcentrateQuarter4:{
							month: '',
							day: '',
							huor: '24'
						},
				indicatorConfigRepHalfYear1:{
					month: '',
					day: '',
					huor: '24'
				},
				indicatorConfigRepHalfYear2:{
					month: '',
					day: '',
					huor: '24'
				},
        		remind:'',
        		interval:''
        	},
          titMsg:"定时任务时点配置",
          oneSeason:[
	          	{
					      value: '01',
					      label: '01月'
					    },{
				      value: '02',
				      label: '02月'
				    },{
				      value: '03',
				      label: '03月'
				    },{
				      value: '04',
				      label: '04月'
				    },{
				      value: '05',
				      label: '05月'
				    },{
				      value: '06',
				      label: '06月'
				    },{
				      value: '07',
				      label: '07月'
				    },{
				      value: '08',
				      label: '08月'
				    },{
				      value: '09',
				      label: '09月'
				    },{
				      value: '10',
				      label: '10月'
				    },{
				      value: '11',
				      label: '11月'
				    },{
				      value: '12',
				      label: '12月'
				    }
          ],
          options: [{
			      value: '01',
			      label: '01号'
			    }, {
			      value: '02',
			      label: '02号'
			    }, {
			      value: '03',
			      label: '03号'
			    }, {
			      value: '04',
			      label: '04号'
			    }, {
			      value: '05',
			      label: '05号'
			    },{
			      value: '06',
			      label: '06号'
			    }, {
			      value: '07',
			      label: '07号'
			    }, {
			      value: '08',
			      label: '08号'
			    }, {
			      value: '09',
			      label: '09号'
			    }, {
			      value: '10',
			      label: '10号'
			    },{
			      value: '11',
			      label: '11号'
			    }, {
			      value: '12',
			      label: '12号'
			    }, {
			      value: '13',
			      label: '13号'
			    }, {
			      value: '14',
			      label: '14号'
			    }, {
			      value: '15',
			      label: '15号'
			    },{
			      value: '16',
			      label: '16号'
			    }, {
			      value: '17',
			      label: '17号'
			    }, {
			      value: '18',
			      label: '18号'
			    }, {
			      value: '19',
			      label: '19号'
			    }, {
			      value: '20',
			      label: '20号'
			    },{
			      value: '21',
			      label: '21号'
			    }, {
			      value: '22',
			      label: '22号'
			    }, {
			      value: '23',
			      label: '23号'
			    }, {
			      value: '24',
			      label: '24号'
			    }, {
			      value: '25',
			      label: '25号'
			    }, {
			      value: '26',
			      label: '26号'
			    }, {
			      value: '27',
			      label: '27号'
			    }, {
			      value: '28',
			      label: '28号'
			    }, {
			      value: '29',
			      label: '29号'
			    }, {
			      value: '30',
			      label: '30号'
			    }, {
			      value: '31',
			      label: '31号'
			    }],
			    options1: [{
			      value: '01',
			      label: '01号'
			    }, {
			      value: '02',
			      label: '02号'
			    }, {
			      value: '03',
			      label: '03号'
			    }, {
			      value: '04',
			      label: '04号'
			    }, {
			      value: '05',
			      label: '05号'
			    },{
			      value: '06',
			      label: '06号'
			    }, {
			      value: '07',
			      label: '07号'
			    }, {
			      value: '08',
			      label: '08号'
			    }, {
			      value: '09',
			      label: '09号'
			    }, {
			      value: '10',
			      label: '10号'
			    },{
			      value: '11',
			      label: '11号'
			    }, {
			      value: '12',
			      label: '12号'
			    }, {
			      value: '13',
			      label: '13号'
			    }, {
			      value: '14',
			      label: '14号'
			    }, {
			      value: '15',
			      label: '15号'
			    },{
			      value: '16',
			      label: '16号'
			    }, {
			      value: '17',
			      label: '17号'
			    }, {
			      value: '18',
			      label: '18号'
			    }, {
			      value: '19',
			      label: '19号'
			    }, {
			      value: '20',
			      label: '20号'
			    },{
			      value: '21',
			      label: '21号'
			    }, {
			      value: '22',
			      label: '22号'
			    }, {
			      value: '23',
			      label: '23号'
			    }, {
			      value: '24',
			      label: '24号'
			    }, {
			      value: '25',
			      label: '25号'
			    }, {
			      value: '26',
			      label: '26号'
			    }, {
			      value: '27',
			      label: '27号'
			    }, {
			      value: '28',
			      label: '28号'
			    }, {
			      value: '29',
			      label: '29号'
			    }, {
			      value: '30',
			      label: '30号'
			    }],
			    options2: [{
			      value: '01',
			      label: '01号'
			    }, {
			      value: '02',
			      label: '02号'
			    }, {
			      value: '03',
			      label: '03号'
			    }, {
			      value: '04',
			      label: '04号'
			    }, {
			      value: '05',
			      label: '05号'
			    },{
			      value: '06',
			      label: '06号'
			    }, {
			      value: '07',
			      label: '07号'
			    }, {
			      value: '08',
			      label: '08号'
			    }, {
			      value: '09',
			      label: '09号'
			    }, {
			      value: '10',
			      label: '10号'
			    },{
			      value: '11',
			      label: '11号'
			    }, {
			      value: '12',
			      label: '12号'
			    }, {
			      value: '13',
			      label: '13号'
			    }, {
			      value: '14',
			      label: '14号'
			    }, {
			      value: '15',
			      label: '15号'
			    },{
			      value: '16',
			      label: '16号'
			    }, {
			      value: '17',
			      label: '17号'
			    }, {
			      value: '18',
			      label: '18号'
			    }, {
			      value: '19',
			      label: '19号'
			    }, {
			      value: '20',
			      label: '20号'
			    },{
			      value: '21',
			      label: '21号'
			    }, {
			      value: '22',
			      label: '22号'
			    }, {
			      value: '23',
			      label: '23号'
			    }, {
			      value: '24',
			      label: '24号'
			    }, {
			      value: '25',
			      label: '25号'
			    }, {
			      value: '26',
			      label: '26号'
			    }, {
			      value: '27',
			      label: '27号'
			    }, {
			      value: '28',
			      label: '28号'
			    }, {
			      value: '29',
			      label: '29号'
			    }],
			    options3: [{
			      value: '01',
			      label: '01号'
			    }, {
			      value: '02',
			      label: '02号'
			    }, {
			      value: '03',
			      label: '03号'
			    }, {
			      value: '04',
			      label: '04号'
			    }, {
			      value: '05',
			      label: '05号'
			    },{
			      value: '06',
			      label: '06号'
			    }, {
			      value: '07',
			      label: '07号'
			    }, {
			      value: '08',
			      label: '08号'
			    }, {
			      value: '09',
			      label: '09号'
			    }, {
			      value: '10',
			      label: '10号'
			    },{
			      value: '11',
			      label: '11号'
			    }, {
			      value: '12',
			      label: '12号'
			    }, {
			      value: '13',
			      label: '13号'
			    }, {
			      value: '14',
			      label: '14号'
			    }, {
			      value: '15',
			      label: '15号'
			    },{
			      value: '16',
			      label: '16号'
			    }, {
			      value: '17',
			      label: '17号'
			    }, {
			      value: '18',
			      label: '18号'
			    }, {
			      value: '19',
			      label: '19号'
			    }, {
			      value: '20',
			      label: '20号'
			    },{
			      value: '21',
			      label: '21号'
			    }, {
			      value: '22',
			      label: '22号'
			    }, {
			      value: '23',
			      label: '23号'
			    }, {
			      value: '24',
			      label: '24号'
			    }, {
			      value: '25',
			      label: '25号'
			    }, {
			      value: '26',
			      label: '26号'
			    }, {
			      value: '27',
			      label: '27号'
			    }, {
			      value: '28',
			      label: '28号'
			    }, {
			      value: '29',
			      label: '29号'
			    }, {
			      value: '30',
			      label: '30号'
			    }, {
			      value: '31',
			      label: '31号'
			    }],
          checkData:{
          	source:'',
          	createDate:'',
          	name:'',
          	pageNo:1,
          	pageSize:10
          }
			}
   },
    created(){
    	this.searchData({})
    },
    methods:{
    	setDays(val,tag){
    		if(this.submitData[tag].month == '02'){
    			this.options = this.options2
    		}else if(this.submitData[tag].month == '04' || this.submitData[tag].month == '06' || this.submitData[tag].month == '08' || this.submitData[tag].month=="10"){
    			this.options = this.options1
    		}else{
    			this.options = this.options3
    		}
    	},
    	back(){
        	this.$router.push({  //核心语句
			        path:'riskMonitor/paramManage',//跳转的路径
			        query:{
			        	id:'111'
			        }
			      })
       },
      getTime(val,tag){
      	if(val == null){
      			this.submitData[tag].huor = '24'
      	}else{
      			this.submitData[tag].huor = val.substring(0,2)
      	}
      },
      getDay(val,tag){
      			this.submitData[tag].day = val  		
      },
      getMonth(val,tag){
      			this.submitData[tag].month = val  
      },
      submitAll(){
       	this.axios.post('riskconfig/updateConfig',JSON.stringify(this.submitData),{headers:{'Content-Type':'application/json'}}).then((res)=>{
       			if(res.code == 200){
       				this.$alert('操作成功', '提示', {
			          confirmButtonText: '确定'
			        });
       			}else{
       				this.$alert('操作失败', '提示', {
			          confirmButtonText: '确定'
			        });
       			}
       	})
      },
    	searchData(data){
    		this.axios.post('riskconfig/searchConfig',JSON.stringify(data),{headers:{'Content-Type':'application/json'}}).then((res)=>{
    				if(res.code == 200){
    					if(res.data != null){
								//月度指标
								if(res.data.indicatorConfigRepMonth != null){
									this.timeData.indicatorConfigRepMonth.day = res.data.indicatorConfigRepMonth.day+'号';
									this.timeData.indicatorConfigRepMonth.huor = res.data.indicatorConfigRepMonth.huor+':00';
								}
								//季度指标
								if(res.data.indicatorConfigFocusQuarter1 != null){
											this.timeData.indicatorConfigRepQuarter.q1.month = res.data.indicatorConfigRepQuarter1.month+'月'
											this.timeData.indicatorConfigRepQuarter.q1.day = res.data.indicatorConfigRepQuarter1.day+'号'
											this.timeData.indicatorConfigRepQuarter.q1.huor = res.data.indicatorConfigRepQuarter1.huor+':00'
										if(res.data.indicatorConfigRepQuarter2 != null){
											this.timeData.indicatorConfigRepQuarter.q2.month = res.data.indicatorConfigRepQuarter2.month+'月'
											this.timeData.indicatorConfigRepQuarter.q2.day = res.data.indicatorConfigRepQuarter2.day+'号'
											this.timeData.indicatorConfigRepQuarter.q2.huor = res.data.indicatorConfigRepQuarter2.huor+':00'
										}
										if(res.data.indicatorConfigRepQuarter3 != null){
											this.timeData.indicatorConfigRepQuarter.q3.month = res.data.indicatorConfigRepQuarter3.month+'月'
											this.timeData.indicatorConfigRepQuarter.q3.day = res.data.indicatorConfigRepQuarter3.day+'号'
											this.timeData.indicatorConfigRepQuarter.q3.huor = res.data.indicatorConfigRepQuarter3.huor+':00'
										}
										if(res.data.indicatorConfigRepQuarter4 != null){
											this.timeData.indicatorConfigRepQuarter.q4.month = res.data.indicatorConfigRepQuarter4.month+'月'
											this.timeData.indicatorConfigRepQuarter.q4.day = res.data.indicatorConfigRepQuarter4.day+'号'
											this.timeData.indicatorConfigRepQuarter.q4.huor = res.data.indicatorConfigRepQuarter4.huor+':00'
										}
								}
								//年度指标
								if(res.data.indicatorConfigRepYear != null){
									this.timeData.indicatorConfigRepYear.month = res.data.indicatorConfigRepYear.month+'月'
									this.timeData.indicatorConfigRepYear.day = res.data.indicatorConfigRepYear.day+'号'
									this.timeData.indicatorConfigRepYear.huor = res.data.indicatorConfigRepYear.huor+':00'
								}
								//在保人集中度
								if(res.data.indicatorConfigFocusQuarter1 != null){
									this.timeData.focusQuarter.q1.month = res.data.indicatorConfigFocusQuarter1.month+'月'
									this.timeData.focusQuarter.q1.day = res.data.indicatorConfigFocusQuarter1.day+'号'
									this.timeData.focusQuarter.q1.huor = res.data.indicatorConfigFocusQuarter1.huor+':00'
								}
								if(res.data.indicatorConfigFocusQuarter2 != null){
									this.timeData.focusQuarter.q2.month = res.data.indicatorConfigFocusQuarter2.month+'月'
									this.timeData.focusQuarter.q2.day = res.data.indicatorConfigFocusQuarter2.day+'号'
									this.timeData.focusQuarter.q2.huor = res.data.indicatorConfigFocusQuarter2.huor+':00'
								}
								if(res.data.indicatorConfigFocusQuarter3 != null){
									this.timeData.focusQuarter.q3.month = res.data.indicatorConfigFocusQuarter3.month+'月'
									this.timeData.focusQuarter.q3.day = res.data.indicatorConfigFocusQuarter3.day+'号'
									this.timeData.focusQuarter.q3.huor = res.data.indicatorConfigFocusQuarter3.huor+':00'
								}
								if(res.data.indicatorConfigFocusQuarter4 != null){
									this.timeData.focusQuarter.q4.month = res.data.indicatorConfigFocusQuarter4.month+'月'
									this.timeData.focusQuarter.q4.day = res.data.indicatorConfigFocusQuarter4.day+'号'
									this.timeData.focusQuarter.q4.huor = res.data.indicatorConfigFocusQuarter4.huor+':00'
								}
								//在保人集中度
								if(res.data.indicatorConfigConcentrateQuarter1 != null){
									this.timeData.indicatorConfigConcentrate.q1.month = res.data.indicatorConfigConcentrateQuarter1.month+'月'
									this.timeData.indicatorConfigConcentrate.q1.day = res.data.indicatorConfigConcentrateQuarter1.day+'号'
									this.timeData.indicatorConfigConcentrate.q1.huor = res.data.indicatorConfigConcentrateQuarter1.huor+':00'
								}
								if(res.data.indicatorConfigConcentrateQuarter2 != null){
									this.timeData.indicatorConfigConcentrate.q2.month = res.data.indicatorConfigConcentrateQuarter2.month+'月'
									this.timeData.indicatorConfigConcentrate.q2.day = res.data.indicatorConfigConcentrateQuarter2.day+'号'
									this.timeData.indicatorConfigConcentrate.q2.huor = res.data.indicatorConfigConcentrateQuarter2.huor+':00'
								}
								if(res.data.indicatorConfigConcentrateQuarter3 != null){
									this.timeData.indicatorConfigConcentrate.q3.month = res.data.indicatorConfigConcentrateQuarter3.month+'月'
									this.timeData.indicatorConfigConcentrate.q3.day = res.data.indicatorConfigConcentrateQuarter3.day+'号'
									this.timeData.indicatorConfigConcentrate.q3.huor = res.data.indicatorConfigConcentrateQuarter3.huor+':00'
								}
								if(res.data.indicatorConfigConcentrateQuarter4 != null){
									this.timeData.indicatorConfigConcentrate.q4.month = res.data.indicatorConfigConcentrateQuarter4.month+'月'
									this.timeData.indicatorConfigConcentrate.q4.day = res.data.indicatorConfigConcentrateQuarter4.day+'号'
									this.timeData.indicatorConfigConcentrate.q4.huor = res.data.indicatorConfigConcentrateQuarter4.huor+':00'
								}
								//截止日期前
								this.timeData.remind = res.data.remind
								//超期后每间隔
								this.timeData.interval = res.data.interval
								this.submitData = res.data
								//上半年度
								if(res.data.indicatorConfigRepHalfYear1 != null){
									this.timeData.indicatorConfigRepHalfYear.half1.month = res.data.indicatorConfigRepHalfYear1.month+'月'
									this.timeData.indicatorConfigRepHalfYear.half1.day = res.data.indicatorConfigRepHalfYear1.day+'号'
									this.timeData.indicatorConfigRepHalfYear.half1.huor = res.data.indicatorConfigRepHalfYear1.huor+':00'
								} else{
									this.submitData.indicatorConfigRepHalfYear1 ={
										month: '',
										day: '',
										huor: '24'
									}
								}
								//下半年度
								if(res.data.indicatorConfigRepHalfYear2 != null){
									this.timeData.indicatorConfigRepHalfYear.half2.month = res.data.indicatorConfigRepHalfYear2.month+'月'
									this.timeData.indicatorConfigRepHalfYear.half2.day = res.data.indicatorConfigRepHalfYear2.day+'号'
									this.timeData.indicatorConfigRepHalfYear.half2.huor = res.data.indicatorConfigRepHalfYear2.huor+':00'
								} else{
									this.submitData.indicatorConfigRepHalfYear2 ={
										month: '',
										day: '',
										huor: '24'
									}
								}
							}
    				}else{
    					this.$alert(res.data, '提示', {
			          confirmButtonText: '确定'
			        });
			        	return;
    				}
    		})
    },
  }
}    
</script>
<style lang="scss">
    #timeOut{
    	/*.el-date-picker__header{
    		display: none!important;
    	}*/
    	.header{
				padding-left: 0;
		    padding-right: 2.6%;
		    position: fixed;
		    width: 100%;
		    padding-top: 15px;
		    -webkit-box-shadow: 4px 2px 6px #888;
		    height: 52px;
		    top: 60px;
		    left: 0;
		    background: #fff;
		    z-index: 99999;
				.el-breadcrumb{
					line-height: 30px;
				}
				button{
					width: 68px;
			    height: 26px;
			    line-height: 1px;
			    padding-left: 2.5%;
			    font-size: 12px;
				}
				.textColor1{
					color: #909191 !important;
		    	font-weight: 700!important;
				}
				.textColor{
					color: #4285F4 !important;
		    	font-weight: 700!important;
				}
				.el-col-9{
					float: right;
					text-align: right;
				}
			}
			.el-input__prefix, .el-input__suffix{
				height: 68%;
			}
			.el-date-editor.el-input, .el-date-editor.el-input__inner{
				width: 18%;
			}
			.el-select{
				margin-right: 20px;
				width: 18%;
			}
			.el-input__inner{
				height: 32px;
				line-height: 32px;
			}
			.el-col{
				text-align: left;
			}
	    .el-tabs__content{
	    		-webkit-box-shadow: 1px 0px 6px #888;
	    		border-radius: 8px;
	    	}
	    	.el-table__empty-block{
	    		background: #fff;
	    	}
	    .el-pagination{
	    	margin-top: 30px;
	    }
	    .timeOutlist,.timeOutlist1{
	    	margin-top: 70px;
	    	background: #fff;
	    	padding: 16px 16px 30px 16px;
	    	border-radius: 8px;
	    	th{
	    		background: #F9F9F9 ;
	    	}
	    	-webkit-box-shadow: 2px 0px 6px #888;
	    	.titIcon{
	    		font-size:14px;
	    		float: left;
	    		width: 100%;
	    		em{
	    			display: inline-block;
	    			width: 2px;
	    			height: 14px;
	    			background: #4285F4;
	    			vertical-align: middle;
	    			margin-right: 5px;
	    		}
	    	}
	    	.titleCss{
	    		display: inline-block;
	    		width: 10%;
	    		text-align: right;
	    		font-size: 14px;
	    		margin-right: 10px;
	    	}
	    	.timeList{
	    		margin-top: 41.5px;
	    		border: 1px solid #E9E9E9;
	    		.monthSend,.seasonSend,.halfyearSend,.yearSend{
	    			height: 60px;
	    			line-height: 60px;
	    			border-bottom: 1px solid #E9E9E9;
	    			color: #303030!important;
	    			.datePick{
	    				margin-right: 20px;
	    			}
	    			.datePick input{
	    				height: 32px;
	    				line-height: 32px;
	    			}
	    			.timePick input{
	    				height: 32px;
	    				line-height: 32px;
	    			}
	    			.titles{
	    				height: auto;
	    				font-size: 14px;
	    			}
	    		}
	    		.seasonSend,.halfyearSend{
	    			height: auto;
	    		}
	    	}
	    }
	    .timeOutlist1{
	    	.timeList{
	    		border: none;
	    	}
	    	border: none;
	    	.el-input{
	    	width: 15%;
	    	margin-right: 10px;
		    	.el-input__inner{
		    		height: 32px;
		    		line-height: 32px;
		    	}
		    }
	    }
	    .wgTxtColor span{
	    	color: #909191 !important;
	    	font-weight: 700;
	    }
    }
</style>
