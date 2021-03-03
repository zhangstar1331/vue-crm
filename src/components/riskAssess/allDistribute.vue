<template>
<div id="allDistribute">
    <div id="main" v-if="isShow" style="width: 600px;height:300px;margin:0 auto;"></div>
    <ul class="pieTip" v-if="isShow">
        <li v-for="(item,index) in pieTip" :key="index" :style="{color:pieTip[index].color}">
            <span :style="{backgroundColor:pieTip[index].color}"></span>
            {{item.name}}
        </li>
    </ul>
    <el-table :data="tableData" v-if="!isShow" style="width: 100%;background: #F9F9F9!important;border: 1px solid #E9E9E9;margin-top:10px;">
        <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.name" align="center"></el-table-column>
    </el-table>
    <p :class="{tip1:isShow,tip2:!isShow}" v-if="$route.name == 'surplusAssess'">注：依据“剩余风险-缺陷等级”形成该图。</p>
</div>
</template>

<script>
import {
    mapState,
    mapActions
} from 'vuex'
import qs from 'qs'
import {
    getData
} from 'src/utils/utils.js'
import assessResult from 'src/components/riskAssess/assessResult'
import {
    pie
} from 'src/utils/utils.js'
export default {
    props: ["isShow", "SuitObj"],
    data() {
        return {
            tableData: [],
            tableList: [{
                name: '风险分布',
                prop: 'name'
            }, {
                name: '低风险',
                prop: 'general'
            }, {
                name: '中风险',
                prop: 'important'
            }, {
                name: '高风险',
                prop: 'major'
            }],
            color: ['#4285F4', '#FFEB5B', '#FF6363'],
            pieTip: [{
                name: '低风险',
                color: '#4285F4'
            }, {
                name: '中风险',
                color: '#FFEB5B'
            }, {
                name: '高风险',
                color: '#FF6363'
            }]
        }
    },
    methods: {
        ...mapActions(['setData']),
        async initPage() {
            if (this.$route.name == 'surplusAssess') { //剩余
                var data = await getData('/rmAssTask/riskAssBugLevelNumber', qs.stringify(this.riskAssess.riskDistribute))
            } else { //固有
                var data = await getData('/rmAssTask/riskAssLevelNumber', qs.stringify(this.riskAssess.riskDistribute))
            }
            var pieData = []
            for (var i = 1; i <= 3; i++) {
                if (data['percen' + i]) {
                    pieData.push(data['percen' + i])
                } else {
                    pieData.push(0)
                }
            }
            this.tableData = [{
                name: '数量',
                general: data.num1,
                important: data.num2,
                major: data.num3
            }, {
                name: '占比',
                general: (parseFloat(data.percen1 ? data.percen1 : 0) * 100).toFixed(2) + '%',
                important: (parseFloat(data.percen2 ? data.percen2 : 0) * 100).toFixed(2) + '%',
                major: (parseFloat(data.percen3 ? data.percen3 : 0) * 100).toFixed(2) + '%'
            }]
            this.$nextTick(() => {
                pie('main', this.color, pieData, this.pieTip, this.$echarts, true)
            })
            //添加点击事件
            let volume = this.$echarts.init(document.getElementById('main'))
			var that = this;
			volume.off('click');
            volume.on('click', function (handler) {
                if (that.$route.name == 'surplusAssess') { //剩余
                    that.setData({
                        'riskAssess.reqDetail.bugLevel': handler.dataIndex + 1
                    })
                } else {
                    that.setData({
                        'riskAssess.reqDetail.riskLevel': handler.dataIndex + 1
                    })
                }
                getData('subrep/getrstdetail', qs.stringify(that.riskAssess.reqDetail)).then((data) => {
                    if (data) {
                        that.$emit('func', {
                            resultFlag: true,
                            data: data.data,
                            totalResults: data.totalResults
                        })
                    }
                })
            })
        }
    },
    mounted() {
        this.initPage()
        var that = this
        this.$on('allDistribute', () => {
            that.initPage()
        }) //设置接收父组件的方法
    },
    computed: {
        ...mapState(['riskAssess'])
    },
    watch: {
        isShow(newVal, oldVal) {
            if (newVal) {
                this.initPage()
            }
        }
    }
}
</script>

<style lang="scss">
#allDistribute {
    .pieTip {
        width: 20%;
        margin: 0 auto;

        span {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background-color: #FF6363;
            margin-right: 4px;
        }

        display: flex;
        flex-direction:row;

        li {
            width: 50%;
            text-align: center;
            font-size: 12px;
        }
    }

    .tip1 {
        width: 70%;
        margin: 10px auto 0;
    }

    .tip2 {
        width: 98%;
        margin: 10px auto 0;
    }
}
</style>
