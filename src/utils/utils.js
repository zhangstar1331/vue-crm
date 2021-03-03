import Vue from 'vue';
import echarts from 'echarts'
import axios from 'axios';
import qs from 'qs'
import { MessageBox } from 'element-ui'
import store from "../store/index";
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

export function getUrlKey(name){
  return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
 }

export function arrRemove(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
//时间戳转化为时间
export function fomatTime(nS,end) {
	return new Date(parseInt(nS) * 1000).toJSON().substr(0, end).replace('T', ' ');
}
//以某个字符串开头
String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
}
//以某个字符串结尾
export function endsWith(str){
	return this.slice(-str.length) == str;
}
//保留两位小数
// num为传入的值，n为保留的小数位
export function fomatFloat(num,n){   
	var f = parseFloat(num);
	if(isNaN(f)){
	    return false;
	}   
	f = Math.round(num*Math.pow(10, n))/Math.pow(10, n); // n 幂   
	var s = f.toString();
	var rs = s.indexOf('.');
	//判定如果是整数，增加小数点再补0
	if(rs < 0){
	    rs = s.length;
	    s += '.'; 
	}
	while(s.length <= rs + n){
	    s += '0';
	}
	return s;
}  
//ajax 请求
export function ajax(url,params,callback,error){
	axios.post(url,params).then((res)=>{
		callback(res)
	  }).catch((response) => {
		  MessageBox('操作失败', '提示', {
	          confirmButtonText: '确定'
	        });
	  	})
}
//获取后端请求数据
export async function getData(url,params,responseType) {
  return new Promise((resolve, reject) => {
  	axios.post(
	    url,
	    params,
	    {
	    	responseType,
		    headers:{
		        'tn':store.state.token
		    }
			}
	  ).then((res)=>{
	  	if(res.data.code==200){
	  		resolve(res.data.data)
	  	}else{
	  		MessageBox(res.data.message, '提示', {
	          confirmButtonText: '确定'
	        });
	  	}
	  }).catch((response) => {
		  MessageBox('操作失败', '提示', {
	          confirmButtonText: '确定'
	        });
	  })
  })
}
export function fileDownload(data, fileName) {//导出excel表格
	let blob = new Blob([data], {
    	type: "application/octet-stream"
  	})
  	let filename = fileName || "filename.xlsx";
  	if (typeof window.navigator.msSaveBlob !== "undefined") {
    	window.navigator.msSaveBlob(blob, filename);
  	} else {
        var blobURL = window.URL.createObjectURL(blob);
        var tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename);
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
  	}
}
export function fileNameCombine(name,path){
	let s = path.lastIndexOf(".")
	var str = path.substring(s, path.length);
	return name+str 
}
export function compare(num1,num2){//num1为仪表盘value值，num2为仪表盘蓝的最大值
  if(num1>num2){
		if(num2>50){
			num2 += 50
		}else{
			num2 += 5
		}
  	if(num1 > num2){
			return compare(num1,num2)	
		}else{
			return num2;
		}
  }else{
  		return num2
  }
}

//状态码
export function statusCode(num,msg){
	MessageBox(msg, '提示', {
      confirmButtonText: '确定'
    });
	// switch(num){
	//     case 400:
	//     	MessageBox('未登录', '提示', {
	//           confirmButtonText: '确定'
	//         });
	//     	break;
	//     case 405:
	//     	MessageBox('您不具备该权限 去登录页', '提示', {
	//           confirmButtonText: '确定'
	//         });
	//     	break;
	//     case 602:
	//     	MessageBox('msg', '提示', {
	//           confirmButtonText: '确定'
	//         });
	//     	break;
	//     case 611:
	//     	MessageBox(msg, '提示', {
	//           confirmButtonText: '确定'
	//         });
	//     	break;
	//  }
}
//图表封装
//柱状图
export function bar(id,data,xAxisData,echart){
  var option = {
    tooltip:{
    	position: function(point, params, dom, rect, size){
        //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
        var x = point[0];//
        var y = point[1];
        var viewWidth = size.viewSize[0];
        var viewHeight = size.viewSize[1];
        var boxWidth = size.contentSize[0];
        var boxHeight = size.contentSize[1];
        var posX = 0;//x坐标位置
        var posY = 0;//y坐标位置 
        if(x<boxWidth){//左边放不开
            posX = 5;    
        }else{//左边放的下
            posX = x-boxWidth; 
        }
        if(y<boxHeight){//上边放不开
            posY = 5; 
        }else{//上边放得下
            posY = y-boxHeight;
        }
        return [posX,posY];
 			}
    },
    legend: {//最上方显示
   	  show:false,
    },
    grid: {//内部距离
      top:'6px',
      left: '1px',
      right: '1px',
      bottom: '1px',
      containLabel: true
    },
    xAxis: [
      {
        type : 'category',
        splitLine: {show: false}, //去掉网格线
        axisTick: {//决定是否显示坐标刻度
          alignWithLabel: false, //内容是否指到坐标刻度
          show:false
        },
        axisLine:{//坐标字体颜色调整
          show:true, //是否隐藏坐标线
          lineStyle:{
            normal:{
              color:function (){
            	return new echarts.graphic.LinearGradient(0, 0, 1, 0,
                [
                    {offset: 0, color: 'rgba(63,193,238,1)'},
                    {offset: 1, color: 'rgba(80,55,221,1)'}
                ])
              },
            },
			color:'rgba(175,195,255,1)',
            width:1
          }
        },
        data:xAxisData
      }
    ],
    yAxis: {
      type : 'value',
      name:'(亿元)',
      nameTestStyle:{
      	color:'rgba(63,193,238,0.3)'
      },
      splitNumber:3,
      silent: true,
      splitLine: {
      	show: true,
      	lineStyle:{
          color:'rgba(63,193,238,0.3)',
          type:'dashed'
        }
      }, //去掉网格线
      axisTick : {show: false},
      axisLine:{//坐标字体颜色调整
        show:false,
        lineStyle:{
          color:'rgba(175,195,255,1)',
          width:4
        }
      }
    },
    series: [{
        type: 'bar', //图表类型
        barWidth: 8, //柱状宽度
        itemStyle:{
          normal: {
            color: function (params){//我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
            var colorList = [
              ['#fcc907','#f8a42a','#f58548'],
              ['#84d272','#47c794','#0dbdb4']
            ];
            var index=params.dataIndex;
            if(params.dataIndex >= colorList.length){
              index=params.dataIndex-colorList.length;
            }
            return new echarts.graphic.LinearGradient(0, 0, 0, 1,
              [
                {offset: 0, color: colorList[index][0]},
                {offset: 0.5, color: colorList[index][1]},
                {offset: 1, color: colorList[index][2]}
              ]);
            },
            barBorderRadius:[20, 20, 20, 20]
          }
        },
        data: data //图表数据
    }]
  }
  var volume = echart.init(document.getElementById(id));
  volume.setOption(option)
}

export function calcBar(id,xData,data,diffData,echart){
	var option = {
		    title: {
		        text: '',
		        subtext: '',
		        sublink: ''
		    },
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter: function (params) {
		            var tar = params[1];
		            return tar.name + ' : ' + tar.value + '亿元';
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        top:'10px',
		        containLabel: true
		    },
		    xAxis: {
	        type : 'category',
	        splitLine: {show: false}, //去掉网格线
	        axisTick: {//决定是否显示坐标刻度
	          alignWithLabel: false, //内容是否指到坐标刻度
	          show:false
	        },
	        axisLine:{//坐标字体颜色调整
	          show:true, //是否隐藏坐标线
	          lineStyle:{
	            normal:{
	              color:function (){
	            	return new echarts.graphic.LinearGradient(0, 0, 1, 0,
	                [
	                    {offset: 0, color: 'rgba(63,193,238,1)'},
	                    {offset: 1, color: 'rgba(80,55,221,1)'}
	                ])
	              },
	            },
						color:'rgba(175,195,255,1)',
	            width:1
	          }
	        },
	        data:xData
	      },
		    yAxis: {
	        type : 'value',
	        name:'(亿元)',
		      nameTestStyle:{
		      	color:'rgba(63,193,238,0.3)'
		      },
		      splitNumber:4,
		      silent: true,
		      splitLine: {
		      	show: true,
		      	lineStyle:{
		          color:'rgba(63,193,238,0.3)',
		          type:'dashed'
		        }
		      }, //去掉网格线
		      axisTick : {show: false},
		      axisLine:{//坐标字体颜色调整
		        show:false,
		        lineStyle:{
		          color:'rgba(175,195,255,1)',
		          width:4
		        }
		      }
		    },
		    series: [
		        {
		            name: 'aaa',
		            type: 'bar',
		            stack:  'bbb',
		          	itemStyle: {
	                normal: {
	                    barBorderColor: 'rgba(0,0,0,0)',
	                    color: 'rgba(0,0,0,0)'
	                },
	                emphasis: {
	                    barBorderColor: 'rgba(0,0,0,0)',
	                    color: 'rgba(0,0,0,0)'
	                }
		            },
		            data: diffData
		        },
		        {
		            name: 'aaa',
		            type: 'bar',
		            stack: 'bbb',
		            barWidth: 12, //柱状宽度
		            itemStyle:{
				          normal: {
				            color: function (params){//我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
				            var colorList = [
				              ['#16E8D7','#2a91d9','#4037DD'],
				              ['#9F25F5','#6519b7','#3D108D'],
				              ['#7EFA18','#48b216','#166F15']
				            ];
				            var index=params.dataIndex;
				            if(params.dataIndex >= colorList.length){
				              index=params.dataIndex-colorList.length;
				            }
				            return new echarts.graphic.LinearGradient(0, 0, 0, 1,
				              [
				                {offset: 0, color: colorList[index][0]},
				                {offset: 0.5, color: colorList[index][1]},
				                {offset: 1, color: colorList[index][2]}
				              ]);
				            },
				            barBorderRadius:[30, 30, 30, 30]
				          }
				        },
		            label: {
		                normal: {
		                    show: false,
		                    position: 'inside'
		                }
		            },
		            data:data
		        }
		    ]
		}
	let volume = echart.init(document.getElementById(id));
	volume.setOption(option)
}

//仪表盘
export function chart(id,msg,fontSize,size,lineSite,echart){
  	var colorTemplate1 = [
        [
            msg.rybRate[0], new echarts.graphic.LinearGradient(
            0, 0, 1, 0, [{
                offset: 0,
                color: '#EA1B1B'
            },
                {
                    offset: 1,
                    color: '#FFA200'
                }
            ])
        ],
        [
            msg.rybRate[1], new echarts.graphic.LinearGradient(
            0, 0, 1, 0, [{
                offset: 0,
                color: '#F6650D'
            },
                {
                    offset: 1,
                    color: '#FFE600'
                }
            ])
        ],
        [
            1, new echarts.graphic.LinearGradient(
            0, 0, 1, 0, [{
                offset: 0,
                color: '#FEDA01'
            },
                {
                    offset: 1,
                    color: '#18BFFF'
                }
            ])
        ]
    ]
  // 指定图表的配置项和数据
  var option = {
      backgroundColor: "",
      tooltip: {              // 本系列特定的 tooltip 设定。
              show: false,
              trigger:'item',
              formatter: "{b}：{c}%",
              backgroundColor: "rgba(50,50,50,0.7)",  // 提示框浮层的背景颜色。注意：series.tooltip 仅在 tooltip.trigger 为 'item' 时有效。
              borderColor: "#333",        // 提示框浮层的边框颜色。...
              borderWidth: 0,             // 提示框浮层的边框宽。...
              padding: 5,                 // 提示框浮层内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。...
              textStyle: {                // 提示框浮层的文本样式。...
                  // color ,fontStyle ,fontWeight ,fontFamily ,fontSize ,lineHeight ,.......
              },
      },
      series: [
          //仪表盘内圈
          {
              name: "仪表盘1",     // 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
              type: "gauge",          // 系列类型
              radius: "75%",          // 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
              center: ["50%", "60%"], // 仪表盘位置(圆心坐标)
              startAngle: 215,        // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
              endAngle: -35,          // 仪表盘结束角度,默认 -45
              clockwise: true,        // 仪表盘刻度是否是顺时针增长,默认 true。
              min: 0,                 // 最小的数据值,默认 0 。映射到 minAngle。
              max: msg.max,               // 最大的数据值,默认 100 。映射到 maxAngle。
              splitNumber: 10,        // 仪表盘刻度的分割段数,默认 10。

              axisLine: {             // 仪表盘轴线(轮廓线)相关配置。
                  show: true,             // 是否显示仪表盘轴线(轮廓线),默认 true。
                  lineStyle: {            // 仪表盘轴线样式。
                      color: [[msg.rybRate[0], '#EA1B1B'], [msg.rybRate[1], '#FFE600'], [1, '#18BFFF']],  //仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                      opacity: 1,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 4,                  //轴线宽度,默认 30。
                      shadowBlur: 20,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  }
              },

              splitLine: {            // 分隔线样式。
                  show: true,             // 是否显示分隔线,默认 true。
                  length: lineSite,             // 分隔线线长。支持相对半径的百分比,默认 30。
                  lineStyle: {            // 分隔线样式。
                      color: "#eee",              //线的颜色,默认 #eee。
                      opacity: 0,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 2,                   //线度,默认 2。
                      type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  }
              },

              axisTick: {             // 刻度(线)样式。
                  show: true,             // 是否显示刻度(线),默认 true。
                  splitNumber: 5,         // 分隔线之间分割的刻度数,默认 5。
                  length: 0,              // 刻度线长。支持相对半径的百分比,默认 8。
                  lineStyle: {            // 刻度线样式。
                      color: "#eee",              //线的颜色,默认 #eee。
                      opacity: 1,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 1,                   //线度,默认 1。
                      type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  },
              },

              axisLabel: {            // 刻度标签。
                  show: true,             // 是否显示标签,默认 true。
                  distance: 5,            // 标签与刻度线的距离,默认 5。
                  color: "#fff",          // 文字的颜色,默认 #fff。
                  fontSize: size,           // 文字的字体大小,默认 5。
                  formatter: "{value}%",   // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
              },

              pointer: {              // 仪表盘指针。
                  show: true,             // 是否显示指针,默认 true。
                  length: "80%",          // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
                  width: 2,               // 指针宽度,默认 8。
              },

              itemStyle: {            // 仪表盘指针样式。
                  color: "#fff",          // 指针颜色，默认(auto)取数值所在的区间的颜色
                  opacity: 1,             // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                  borderWidth: 0,         // 描边线宽,默认 0。为 0 时无描边。
                  borderType: "solid",    // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
                  borderColor: "#000",    // 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
                  shadowBlur: 10,         // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                  shadowColor: "#fff",    // 阴影颜色。支持的格式同color。
              },

              title: {                // 仪表盘标题。
                  show: true,             // 是否显示标题,默认 true。
                  offsetCenter: [0,"20%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                  color: "#fff",          // 文字的颜色,默认 #333。
                  fontSize: 20,           // 文字的字体大小,默认 15。
              },

              detail: {               // 仪表盘详情，用于显示数据。
                  show: true,             // 是否显示详情,默认 true。
                  offsetCenter: [0,"60%"],// 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                  color: "#fff",          // 文字的颜色,默认 auto。
                  fontSize: fontSize,           // 文字的字体大小,默认 15。
                  formatter:function(value){// 格式化函数或者字符串"{value}"+msg.unit
                  	return value?fomatFloat(value,2)+msg.unit:'--'+msg.unit
                  }
              },
              data: msg.data.value?msg.data:'0'
          },
          //仪表盘外圈
          {
              name: "仪表盘",
              type: "gauge",          // 系列类型
              radius: "115%",          // 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
              center: ["50%", "60%"], // 仪表盘位置(圆心坐标)
              startAngle: 215,        // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
              endAngle: -35,          // 仪表盘结束角度,默认 -45
              clockwise: true,        // 仪表盘刻度是否是顺时针增长,默认 true。
              min: 0,                 // 最小的数据值,默认 0 。映射到 minAngle。
              max: msg.max,               // 最大的数据值,默认 100 。映射到 maxAngle。
              splitNumber: 10,        // 仪表盘刻度的分割段数,默认 10。
              axisLine: {             // 仪表盘轴线(轮廓线)相关配置。
                  show: true,             // 是否显示仪表盘轴线(轮廓线),默认 true。
                  lineStyle: {            // 仪表盘轴线样式。
                      color: [[1,'#31314b']],
                      opacity: 0.2,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 1,                  //轴线宽度,默认 30。
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  }
              },
              splitLine: {            // 分隔线样式。
                  show: false
              },
              axisTick: {             // 刻度(线)样式。
                  show: false
              },
              axisLabel: {            // 刻度标签。
                  show: false
              },
              pointer: {              // 仪表盘指针。
                  show: false
              },
              title: {                // 仪表盘标题。
                  show: false
              },
              detail: {               // 仪表盘详情，用于显示数据。
                  show: false            // 是否显示详情,默认 true。
              },
              data: [{name:'',value:''}]
          }
      ]
  };
  let volume = echart.init(document.getElementById(id));
  volume.setOption(option)
}
//仪表盘
export function chart1(id,msg,fontSize,size,lineSite1,lineSite2,echart){
  	var colorTemplate1 = [
        [
            msg.rybRate[0], new echarts.graphic.LinearGradient(
            0, 0, 1, 0, [{
                offset: 0,
                color: '#EA1B1B'
            },
                {
                    offset: 1,
                    color: '#FFA200'
                }
            ])
        ],
        [
            msg.rybRate[1], new echarts.graphic.LinearGradient(
            0, 0, 1, 0, [{
                offset: 0,
                color: '#F6650D'
            },
                {
                    offset: 1,
                    color: '#FFE600'
                }
            ])
        ],
        [
            1, new echarts.graphic.LinearGradient(
            0, 0, 1, 0, [{
                offset: 0,
                color: '#FEDA01'
            },
                {
                    offset: 1,
                    color: '#18BFFF'
                }
            ])
        ]
    ]
  // 指定图表的配置项和数据
  var option = {
      backgroundColor: "",
      tooltip: {              // 本系列特定的 tooltip 设定。
              show: false,
              trigger:'item',
              formatter: "{b}：{c}%",
              backgroundColor: "rgba(50,50,50,0.7)",  // 提示框浮层的背景颜色。注意：series.tooltip 仅在 tooltip.trigger 为 'item' 时有效。
              borderColor: "#333",        // 提示框浮层的边框颜色。...
              borderWidth: 0,             // 提示框浮层的边框宽。...
              padding: 5,                 // 提示框浮层内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。...
              textStyle: {                // 提示框浮层的文本样式。...
                  // color ,fontStyle ,fontWeight ,fontFamily ,fontSize ,lineHeight ,.......
              },
      },
      series: [
          //仪表盘内圈
          {
              name: "仪表盘1",     // 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
              type: "gauge",          // 系列类型
              radius: "75%",          // 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
              center: ["50%", "60%"], // 仪表盘位置(圆心坐标)
              startAngle: 215,        // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
              endAngle: -35,          // 仪表盘结束角度,默认 -45
              clockwise: true,        // 仪表盘刻度是否是顺时针增长,默认 true。
              min: 0,                 // 最小的数据值,默认 0 。映射到 minAngle。
              max: msg.max,               // 最大的数据值,默认 100 。映射到 maxAngle。
              splitNumber: 10,        // 仪表盘刻度的分割段数,默认 10。

              axisLine: {             // 仪表盘轴线(轮廓线)相关配置。
                  show: true,             // 是否显示仪表盘轴线(轮廓线),默认 true。
                  lineStyle: {            // 仪表盘轴线样式。
                      color: [[msg.rybRate[0], '#EA1B1B'], [msg.rybRate[1], '#FFE600'], [1, '#18BFFF']],  //仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                      opacity: 1,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 4,                  //轴线宽度,默认 30。
                      shadowBlur: 20,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  }
              },

              splitLine: {            // 分隔线样式。
                  show: true,             // 是否显示分隔线,默认 true。
                  length: lineSite1,             // 分隔线线长。支持相对半径的百分比,默认 30。
                  lineStyle: {            // 分隔线样式。
                      color: "#eee",              //线的颜色,默认 #eee。
                      opacity: 0,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 2,                   //线度,默认 2。
                      type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  }
              },

              axisTick: {             // 刻度(线)样式。
                  show: true,             // 是否显示刻度(线),默认 true。
                  splitNumber: 5,         // 分隔线之间分割的刻度数,默认 5。
                  length: 0,              // 刻度线长。支持相对半径的百分比,默认 8。
                  lineStyle: {            // 刻度线样式。
                      color: "#eee",              //线的颜色,默认 #eee。
                      opacity: 1,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 1,                   //线度,默认 1。
                      type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  },
              },

              axisLabel: {            // 刻度标签。
                  show: false,             // 是否显示标签,默认 true。
                  distance: 30,            // 标签与刻度线的距离,默认 5。
                  color: "#fff",          // 文字的颜色,默认 #fff。
                  fontSize: size,           // 文字的字体大小,默认 5。
                  formatter: "{value}%",   // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
              },

              pointer: {              // 仪表盘指针。
                  show: true,             // 是否显示指针,默认 true。
                  length: "80%",          // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
                  width: 2,               // 指针宽度,默认 8。
              },

              itemStyle: {            // 仪表盘指针样式。
                  color: "#fff",          // 指针颜色，默认(auto)取数值所在的区间的颜色
                  opacity: 1,             // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                  borderWidth: 0,         // 描边线宽,默认 0。为 0 时无描边。
                  borderType: "solid",    // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
                  borderColor: "#000",    // 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
                  shadowBlur: 10,         // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                  shadowColor: "#fff",    // 阴影颜色。支持的格式同color。
              },

              title: {                // 仪表盘标题。
                  show: false,             // 是否显示标题,默认 true。
                  offsetCenter: [0,"20%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                  color: "#fff",          // 文字的颜色,默认 #333。
                  fontSize: 20,           // 文字的字体大小,默认 15。
              },

              detail: {               // 仪表盘详情，用于显示数据。
                  show: true,             // 是否显示详情,默认 true。
                  offsetCenter: [0,"60%"],// 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                  color: "#fff",          // 文字的颜色,默认 auto。
                  fontSize: fontSize,           // 文字的字体大小,默认 15。
                  formatter:function(value){// 格式化函数或者字符串"{value}"+msg.unit
                  	return value?fomatFloat(value,2)+msg.unit+"(压一)":'--'+msg.unit+"(压一)"
                  }
              },

              data: msg.data.child0[0].value?msg.data.child0:'0'
          },
          //仪表盘外圈
          {
              name: "仪表盘",
              type: "gauge",          // 系列类型
              radius: "115%",          // 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
              center: ["50%", "60%"], // 仪表盘位置(圆心坐标)
              startAngle: 215,        // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
              endAngle: -35,          // 仪表盘结束角度,默认 -45
              clockwise: true,        // 仪表盘刻度是否是顺时针增长,默认 true。
              min: 0,                 // 最小的数据值,默认 0 。映射到 minAngle。
              max: msg.max,               // 最大的数据值,默认 100 。映射到 maxAngle。
              splitNumber: 10,        // 仪表盘刻度的分割段数,默认 10。
              axisLine: {             // 仪表盘轴线(轮廓线)相关配置。
                  show: true,             // 是否显示仪表盘轴线(轮廓线),默认 true。
                  lineStyle: {            // 仪表盘轴线样式。
                      color: [[msg.rybRate[0], '#EA1B1B'], [msg.rybRate[1], '#FFE600'], [1, '#18BFFF']],
                      opacity: 1,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 4,                  //轴线宽度,默认 30。
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  }
              },
              splitLine: {            // 分隔线样式。
                  show: true,             // 是否显示分隔线,默认 true。
                  length: lineSite2,             // 分隔线线长。支持相对半径的百分比,默认 30。
                  lineStyle: {            // 分隔线样式。
                      color: "#eee",              //线的颜色,默认 #eee。
                      opacity: 0,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 2,                   //线度,默认 2。
                      type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  }
              },

              axisTick: {             // 刻度(线)样式。
                  show: true,             // 是否显示刻度(线),默认 true。
                  splitNumber: 5,         // 分隔线之间分割的刻度数,默认 5。
                  length: 0,              // 刻度线长。支持相对半径的百分比,默认 8。
                  lineStyle: {            // 刻度线样式。
                      color: "#eee",              //线的颜色,默认 #eee。
                      opacity: 1,                 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                      width: 1,                   //线度,默认 1。
                      type: "solid",              //线的类型,默认 solid。 此外还有 dashed,dotted
                      shadowBlur: 1,             //(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                      shadowColor: "#fff",        //阴影颜色。支持的格式同color。
                  },
              },

              axisLabel: {            // 刻度标签。
                  show: true,             // 是否显示标签,默认 true。
                  distance: 30,            // 标签与刻度线的距离,默认 5。
                  color: "#fff",          // 文字的颜色,默认 #fff。
                  fontSize: size,           // 文字的字体大小,默认 5。
                  formatter: "{value}%",   // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
              },

              pointer: {              // 仪表盘指针。
                  show: true,             // 是否显示指针,默认 true。
                  length: "80%",          // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
                  width: 2,               // 指针宽度,默认 8。
              },

              itemStyle: {            // 仪表盘指针样式。
                  color: "#fff",          // 指针颜色，默认(auto)取数值所在的区间的颜色
                  opacity: 1,             // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                  borderWidth: 0,         // 描边线宽,默认 0。为 0 时无描边。
                  borderType: "solid",    // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
                  borderColor: "#000",    // 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
                  shadowBlur: 10,         // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                  shadowColor: "#fff",    // 阴影颜色。支持的格式同color。
              },

              title: {                // 仪表盘标题。
                  show: true,             // 是否显示标题,默认 true。
                  offsetCenter: [0,"20%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                  color: "#fff",          // 文字的颜色,默认 #333。
                  fontSize: 20,           // 文字的字体大小,默认 15。
              },

              detail: {               // 仪表盘详情，用于显示数据。
                  show: true,             // 是否显示详情,默认 true。
                  offsetCenter: [0,"55%"],// 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                  color: "#fff",          // 文字的颜色,默认 auto。
                  fontSize: fontSize,           // 文字的字体大小,默认 15。
                  formatter:function(value){// 格式化函数或者字符串"{value}"+msg.unit
                  	return value?fomatFloat(value,2)+msg.unit+"(压二)":'--'+msg.unit+"(压二)"
                  }
              },
              data: msg.data.child1[0].value?msg.data.child1:'0'
          }
      ]
  };
  let volume = echart.init(document.getElementById(id));
  volume.setOption(option)
}
//折线图
export function line(id,xData,data,echart,tip,data1){
	//取比数组的最小值小一部分的值作为纵坐标最小值
	let minY = 0;
	let maxY = 10;
	let arr = []
	let arrData = JSON.parse(JSON.stringify(data))
	if(data1){
		arr = arrData.concat(data1).sort((a, b) => a - b);
	}else{
		arr = arrData.sort((a, b) => a - b);
	}
	for(var i = 0; i < arr.length; i++){
		if(arr[i]){
			if(parseInt(arr[i])>100){
				minY = parseInt(parseInt(arr[i])/100)*100;
				break
			}
			if(Math.floor(arr[i])<0){
				minY = parseInt(Math.floor(arr[i])/5-1)*5;
				break
			}
			break
		}
	}
	for(var i = arr.length-1; i >= 0; i--){
		if(arr[i]){
			if(parseInt(arr[i])>100){
				maxY = parseInt(parseInt(arr[i])/100+1)*100;
				break
			}
			if(parseInt(arr[i])>10){
				maxY = parseInt(parseInt(arr[i])/10+1)*10;
				break
			}
			break
		}
	}
  //指定图标的配置和数据
  var option = {
      title:{
          //text:'集中度风险'
      },
      tooltip:{},
      legend:{
      	show:false
      },
      grid: {//内部距离
        top:'10px',
        left: '1px',
        right: '20px',
        bottom: '1px',
        containLabel: true
      },
      xAxis:[
        {
            name:'',
            type:'category',
            boundaryGap: true,//从起点开始
            splitLine: {//隐藏网格线
              "show": false
            },
            axisTick:{ //隐藏刻度线
              "show":false
            },
            axisLine:{//坐标字体颜色调整
	            show:true,
	            lineStyle:{
	              color:'#AFC3FF'
	            }
	        },
            data:xData
        }
      ],
      yAxis:{
          name:'%',
          max: maxY,
          min: minY, //取数据在该轴上的最小值作为最小刻度
          splitNumber:5,
          splitLine: {
          	show: true,
          	lineStyle:{
              color:'rgba(63,193,238,0.3)',
              type:'dashed'
            }
          },
          axisTick:{       //y轴刻度线
            "show":false
          },
          axisLine:{//坐标字体颜色调整
            show:false,
            lineStyle:{
              color:'rgba(175,195,255,1)',
              width:4
            }
          }
      },
      series:[{
          name:tip,
          type:'line',
          symbol: 'circle', // 拐点类型
          smooth: true, // 当为true时，就是光滑的曲线（默认为true）；当为false，就是折线不是曲线的了，那这个设为true，下面的（吃饭）数据中设置smooth为false，这个就不是光滑的曲线了。
          symbolSize: 5, // 拐点圆的大小
          areaStyle: {normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00c1de'
                }, {
                    offset: 1,
                    color: '#0f0f2e'
                }]),
          }},
          itemStyle: {
            normal: {
                color: '#49F9FF', // 折线条的颜色
                borderColor: '#9AD5FF', // 拐点边框颜色
            }
          },
          data:data
      },{
          name:tip,
          type:'line',
          symbol: 'circle', // 拐点类型
          smooth: true, // 当为true时，就是光滑的曲线（默认为true）；当为false，就是折线不是曲线的了，那这个设为true，下面的（吃饭）数据中设置smooth为false，这个就不是光滑的曲线了。
          symbolSize: 3, // 拐点圆的大小
          areaStyle: {normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00c1de'
                }, {
                    offset: 1,
                    color: '#0f0f2e'
                }]),
          }},
          itemStyle: {
            normal: {
                color: '#49F9FF', // 折线条的颜色
                borderColor: '#9AD5FF', // 拐点边框颜色
            }
          },
          data:data1
      }]
  };
  let volume = echart.init(document.getElementById(id));
  volume.setOption(option);
  return volume;
}

//多柱状图
export function bar1(id,xData,data,echart){
  //指定图标的配置和数据
  let option = {
	  legend: {
	    data: [{
	      name: '余额',
	      textStyle: {
	        color: '#fff',
	      }
	    }],
	    right:"20",
	  },
	  tooltip:{
	  	show:true
	  },
	  xAxis: {
	    axisLine:{
	      show:false
	    },
	    axisTick: {//坐标轴刻度相关设置。
	      show: false
	    },
	    data: xData,
	    axisLabel: {
	      interval:0,
	      rotate:40,
	      margin:20,
	      fontSize: 8,
	      fontWeight:'lighter'
	    }
	  },
	  grid: {
	    bottom:"90",
	    top:'15'
	  },
	  yAxis: [{
	    splitLine: {show: false}, //去掉网格线
	    axisLine:{
	      show:false
	    },
	    axisTick: {//坐标轴刻度相关设置。
	      show: false
	    },
	    axisLabel: {
	      fontSize: 10,
	      fontWeight:'lighter'
	    }
	  }],
	  series: [{
	    name:'余额',
	    type: 'bar',
	    barWidth: 10, //柱状宽度
	    data: data,
	    cursor:'normal',
	    itemStyle:{
	      normal: {
	        color: function (params){
	        var colorList = [];
	        for(var i = 0; i < data.length; i++){
	        	colorList.push(['#16E8D7','#2a91d9','#4037DD'])
	        }
	        var index=params.dataIndex;
	        if(params.dataIndex >= colorList.length){
	          index=params.dataIndex-colorList.length;
	        }
	        return new echarts.graphic.LinearGradient(0, 0, 0, 1,
	          [
	            {offset: 0, color: colorList[index][0]},
	            {offset: 0.5, color: colorList[index][1]},
	            {offset: 1, color: colorList[index][2]}
	          ]);
	        },
	        barBorderRadius:[6, 6, 6, 6]
	      }
	    }
	  }],
	  textStyle:{
	    color:"#fff",
	    opacity:0.5
	  },
	};
  let volume = echart.init(document.getElementById(id));
  volume.setOption(option);
  return volume;
}
//层叠柱状图
export function stackBar(id,xData,blueData,yellowData,redData,echart){
	let option = {
		title:{
			show:false,
			textStyle:{
				color:'#909399'
			},
			text:'暂无数据',
			left:'center',
			top:'center'
		},
		grid: {//内部距离
      top:'20px',
      left: '1px',
      right: '1px',
      bottom: '10px',
      containLabel: true
    },
    color:['#4285F4','#FFD824','#FF6363'],
  	tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: ''        // 默认为直线，可选为：'line' | 'shadow'
        },
        // formatter:'{b0}<br/>{a0}：{c0}%'
        formatter: function (params) {
			    let html=params[0].name+"<br>";
			    for(let i=0;i<params.length;i++){
			    	html+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+';"></span>'
			        html+=params[i].seriesName+"："+params[i].value +"<br>";
			    }
			    return html;
				}
    },
  	toolbox: {
        show: false,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: false, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
  	},
  	calculable: true,
  	xAxis: [
	    {
	      type: 'category',
       	axisLine: {
			    show: false
				},
				axisTick:{       //y轴刻度线
	          "show":false
	      },
    		data: xData
      }
  	],
  	yAxis: [
      {
      	type: 'value',
      	axisLine: {//y轴坐标线
	    			show: false,
					},
					axisLabel: {//y轴文字
		      	show:true,
		      	interval:'auto'
        	},
	        axisTick: { //y轴刻度线
	          "show":false
	        },
        	splitLine: {//虚线
            show: true,
            lineStyle:{
                type:'dashed'
            }
        }
    	}
    ],
  	series: [
  			{
          	name: '低风险',
          	type: 'bar',
          	stack: '总量',
          	barWidth:20,
          	smooth:true,
          	symbol:'square',
          	symbolSize: 14, 
          	// hoverAnimation: false,
          	itemStyle: {
          		normal: {
          			label: {
          				show: false, 
          				color:'#FFF'
          			}
          		}
          	},
          	data: blueData
        },
        {
          	name: '中风险',
          	type: 'bar',
          	stack: '总量',
          	barWidth:20,
          	smooth:true,
          	symbol:'square',
          	symbolSize: 14, 
          	// hoverAnimation: false,
          	itemStyle: {
          		normal: {
          			label: {
          				show: false, 
          				color:'#FFF'
          			}
          		}
          	},
          	data: yellowData
        },
        {
          	name: '高风险',
          	type: 'bar',
          	stack: '总量',
          	barWidth:20,
          	smooth:true,
          	symbol:'square',
          	symbolSize: 14, 
          	// hoverAnimation: false,
          	itemStyle: {
          		normal: {
          			label: {
          				show: false, 
          				color:'#FFF'
          			}
          		}
          	},
          	data: redData
        },
  	]
	}
	let volume = echart.init(document.getElementById(id));
  volume.setOption(option);
  return volume;
}
//饼图
export function pie(id,color,data,nameArr,echart,lableShow){
	let option = {
    color:color,
    tooltip:{
    	formatter: function (params) {
	      if(nameArr[params.dataIndex].name){
	      	return nameArr[params.dataIndex].name + ' : ' + params.percent +'%';
	      }else{
	      	return nameArr[params.dataIndex] + ' : ' + params.percent +'%';
	      }
	    }
    },
    series: {
      type: 'pie',
      radius:'70%',//饼图的半径大小  
      label: {
					normal:{
						show:lableShow,
            // \n\n可让文字居于牵引线上方，很关键
            //  {b}  代表显示的内容标题
            // {c}代表数据
            //formatter: '：{c}% \n\n'
            formatter:function(params){
            	return nameArr[params.dataIndex].name + ':' + params.percent +'%'
            }
	        }
     	},
      data: data
    }
  }
	let volume = echart.init(document.getElementById(id));
  volume.setOption(option);
  return volume;
}
// 千位分隔符
export function numFormat(num){
    var res=((num*100)/100).toFixed(2).toString().replace(/\d+/, function(n){ // 先提取整数部分
       return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
          return $1+",";
        });
    })
    return res;
}
// 附件格式大小限制
export function fileTypeDiffer(file) {
  // var fileType = file.name.substring(file.name.lastIndexOf('.')+1)
  // const extension = fileType === 'zip' || fileType === 'rar'
  // const isLt20M = file.size / 1024 / 1024 < 20
  const isLt50M = file.size / 1024 / 1024 <= 49.5
  if(!isLt50M) {
        MessageBox('文件过大，无法上传!', '提示', {
        confirmButtonText: '确定'
      });
    }
  return isLt50M
}

export function datedifference(sDate1,sDate2){
    var dateSpan,iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
}






