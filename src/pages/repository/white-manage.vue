<template>
    <div class="render1">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><span style="color: #909191;font-weight: 700">制度库</span></el-breadcrumb-item>
            <el-breadcrumb-item class="dwTxtColor">{{this.companySource == '1'?'制度库（编辑中）':'待维护制度库'}}</el-breadcrumb-item>
            <el-breadcrumb-item class="txtColor">{{titMsg}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!--外规-->
            <el-tab-pane label="外规" v-if="tab1" class-name="tabname" name="first" :key="'first'">
                <!--查询组件-->
                <div class="box">
                    <div class="titIcon"><em></em><span style="font-weight: 600;">筛选查询</span></div>
                    <w-check :flag="this.flag" v-if="isChildUpdate1"></w-check>
                </div>
                <!--制度列表组件-->
                <div class="sysBox">
                    <div class="titIcon"><em></em><span style="font-weight: 600;">制度列表</span></div>
                    <sysList v-if="isChildUpdate1" :showRecord="showRecord"></sysList>
                </div>
            </el-tab-pane>
            <!--内规-->
            <el-tab-pane label="内部制度" v-if="tab2" class-name="tasbname" name="second" :key="'second'">
                <div class="box tbox" style="padding-bottom: 0;">
                    <div class="titIcon"><em></em><span style="font-weight: 600">筛选查询</span></div>
                    <w-TextSearchTwo v-if="isChildUpdate2" :flag="this.flag"></w-TextSearchTwo>
                </div>
                <div class="sysBox">
                    <div class="titIcon"><em></em><span style="font-weight: 600">制度列表</span></div>
                    <in-sysList v-if="isChildUpdate2" :showRecord="showRecord"></in-sysList>
                </div>
            </el-tab-pane>
            <!--东方制度-->
            <el-tab-pane label="东方制度" v-if="tab3" class-name="tabname" name="three" :key="'three'">
                <div class="box tbox" style="padding-bottom: 0;">
                    <div class="titIcon"><em></em><span style="font-weight: 600">筛选查询</span></div>
                    <w-textSearch v-if="isChildUpdate3" v-bind:flag="this.flag"></w-textSearch>
                </div>
                <div class="sysBox">
                    <div class="titIcon"><em></em><span style="font-weight: 600">制度列表</span></div>
                    <df-sysList v-if="isChildUpdate3" :showRecord="showRecord"></df-sysList>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Bus from 'src/bus/bus.js'
import wCheck from 'src/components/check/check'
import wSysList from 'src/components/sysList/wsysList'
import dfSysList from 'src/components/sysList/dfSysList'
import inSysList from 'src/components/sysList/inSysList'
import sysList from 'src/components/sysList/sysList'
import wTextSearch from 'src/components/check/dfCheck'
import wTextSearchTwo from 'src/components/check/inCheck'
import qs from 'qs'
import { mapState, mapActions } from 'vuex'
import { getUrlKey } from 'src/utils/utils.js'
export default {
    data() {
        return {
            showRecord: '1',
            flag: 1,
            tab1: true,
            tab2: false,
            tab3: false,
            handleData: [],
            activeName: "first",
            isChildUpdate1: false,
            isChildUpdate2: false,
            isChildUpdate3: false,
            titMsg: "列表查询",
            tabname: ''
        }
    },
    components: {
        wCheck,
        sysList,
        dfSysList,
        inSysList,
        wSysList,
        wTextSearch,
        wTextSearchTwo,

    },
    created() {
        Bus.$off("isCdw");
        Bus.$on('isCdw', (data) => {
            this.$alert('权限发生变化，请重新登录', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.axios.post('rmUser/authLogout').then((res) => {
                        if (res.code == 200) {
                            this.$store.commit('SET_TOKEN', '');
                            this.$store.commit('SET_USER', null);
                            this.$router.replace({ path: '/login' });
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
        sessionStorage.setItem('flag', 1);
    },
    computed: {
        ...mapState(['companySource']),
        f1() {
            return this.$store.state.orgBtnData
        }
    },
    watch: {
        f1(newdata, olddata) {
            this.getData(newdata)
        }
    },
    methods: {
        ...mapActions(['getData']),
        handleClick(tab) {
            if (tab.name == "first") {
                sessionStorage.setItem('tabname', 2)
                this.isChildUpdate1 = true;
                this.isChildUpdate2 = false;
                this.isChildUpdate3 = false;
                this.titMsg = "外规"
            } else if (tab.name == "second") {
                sessionStorage.setItem('tabname', 1)
                this.isChildUpdate1 = false;
                this.isChildUpdate2 = true;
                this.isChildUpdate3 = false;
                this.titMsg = "内部制度"
            } else if (tab.name == "three") {
                sessionStorage.setItem('tabname', 3)
                this.isChildUpdate1 = false;
                this.isChildUpdate2 = false;
                this.isChildUpdate3 = true;
                this.titMsg = "东方制度"
            }
        }, // 获取操作集合
        // 返回页面时加载数据
        getData(aaa) {
            var roleId = sessionStorage.getItem('roleId')
            this.handleData = aaa
            if (this.handleData !== undefined) {
                //外规tab
                if (this.handleData.indexOf('1_cdwlw') >= 0) {
                    this.tab1 = true
                } else {
                    this.tab1 = false
                }
                //内规tab 
                if (this.handleData.indexOf('1_cdwln') >= 0) {
                    this.tab2 = true
                } else {
                    this.tab2 = false
                }
                //东方tab 
                if (this.handleData.indexOf('1_cdwld') >= 0) {
                    this.tab3 = true
                } else {
                    this.tab3 = false
                }
                //tab切换初始默认值
                if (!this.tab1) {
                    if (this.tab2) {
                        this.activeName = 'second'
                        this.handleClick({ name: 'second' })
                    } else {
                        this.activeName = 'three'
                        this.handleClick({ name: 'three' })
                    }
                }
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next((that) => {
            const config = {
                '/innewDetail': 'second',
                '/dfnewDetail': 'three',
                '/newDetail': 'first',
                '/inReverseEdit': 'second',
                '/dfReverseEdit': 'three',
            };
            that.activeName = config[from.path] || 'first';
            that.handleClick({ name: that.activeName });
        })
    }
};

</script>
<style lang="scss">
.render1 {
    .el-breadcrumb {
        margin-bottom: 16px;
        margin-top: 20px;
    }
    .box {
        min-height: 250px;
        background: #fff;
        padding: 16px 16px 0 16px;
        -webkit-box-shadow: 4px 2px 6px #888;
        margin-top: 2px;
        border-radius: 8px;
        .titIcon {
            font-size: 14px;
            margin-bottom: 30px;
            em {
                display: inline-block;
                width: 2px;
                height: 14px;
                background: #4285F4;
                vertical-align: middle;
                margin-right: 6px;
            }
        }
    }
    .tbox {
        padding-bottom: 50px;
    }
    .sysBox {
        background: #fff;
        min-height: 250px;
        padding: 16px 16px 0 16px;
        -webkit-box-shadow: 2px 2px 10px #888;
        border-radius: 8px;
        margin-top: 23px;
        .titIcon {
            font-size: 14px;
            margin-bottom: 30px;
            float: left;
            em {
                display: inline-block;
                width: 2px;
                height: 14px;
                background: #4285F4;
                vertical-align: middle;
                margin-right: 5px;
            }
        }
    }
    #tab-first {
        background: #fff;
        width: 100px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-right: 1px solid #E9E9E9;
    }
    #tab-second {
        background: #fff;
        width: 100px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-right: 1px solid #E9E9E9;
    }
    #tab-three {
        background: #fff;
        width: 100px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .el-tabs__header {
        margin: 0;
    }
    .el-tabs__item {
        padding: 0;
        width: 100px;
        text-align: center;
    }
    .el-tabs__active-bar {
        display: none;
    }
    .is-active {
        background: #4285F4 !important;
        color: #fff !important;
        text-align: center;
    }
}
.el-breadcrumb__inner {
    color: #4285F4 !important;
    font-weight: 700 !important;
}
.is-link {
    color: #909191 !important;
}
.exportBtn,
.newBuildBtn {
    float: right;
    margin-right: 5px;
    width: 68px;
    height: 26px;
    padding: 0;
    font-size: 12px;
}
.exportBtn {
    margin-right: 20px;
}
.dwTxtColor span {
    color: #909191 !important;
    font-weight: 700;
}

</style>
