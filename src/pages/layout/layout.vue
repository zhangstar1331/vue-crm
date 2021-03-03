<template>
    <div class="layout">
        <div class="logo-wrapper" :style="{width: this.isCollapsed?'140px':'200px'}" @click="backHome">
            <img class="logoImg" src="../../../static/login_lg.png" />
        </div>
        <div v-if="!this.isCollapsed" class="siderbar-wrapper" :style="{width: this.isCollapsed?'0px':'200px'}">
            <el-menu class="menu-wrapper" router unique-opened :collapse="isCollapsed" :default-active="$route.path" @select="handleSelect">
                <template v-for="(item, index) in sider_menu_data">
                    <el-menu-item class="menu-item" v-if="!item.child" :index="item.url+'?id='+item.id" :key="index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                    <el-submenu v-else :index="item.url+'?id='+item.id">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{item.title}}</span>
                        </template>
                        <div class="second-item" v-for="(sub_item, sub_index) in item.child" :index="sub_item.url+'?id='+sub_item.id" :key="sub_index">
                            <el-menu-item v-if="!sub_item.child" :index="sub_item.url+'?id='+sub_item.id" :key="index">
                                <span slot="title">{{sub_item.name}}</span>
                            </el-menu-item>
                            <el-submenu v-else :index="sub_item.url+'?id='+sub_item.id">
                                <template slot="title">
                                    <span slot="title">{{sub_item.name}}</span>
                                </template>
                                <el-menu-item v-for="(sub_third_item, sub_third_index) in sub_item.child" :index="sub_third_item.url+'?id='+sub_third_item.id" :key="sub_third_index" style="padding-left:55px;">
                                    <span slot="title" :title="sub_third_item.name" style="overflow: hidden; width: 130px!important; display: block; text-overflow: ellipsis; white-space: nowrap;">{{sub_third_item.name}}</span> </el-menu-item>
                            </el-submenu>
                        </div>
                    </el-submenu>
                </template>
            </el-menu>
        </div>
        <div class="topbar-wrapper" :style="{left: this.isCollapsed?'200px':'200px'}">
            <div class="menu-collapse-wrapper float-left">
                <i class="el-icon-s-fold" :style="{transform: 'rotateZ(' + (this.isCollapsed ? '90' : '0') + 'deg)'}"></i>
            </div>
            <div class="title float-left">风险管理信息系统</div>
            <ul class="menu-list float-right">
                <li v-if="user" class="menu-item">
                    <el-dropdown :show-timeout="10" :hide-timeout="10">
                        <div class="dropdown-content el-dropdown-link">
                            <i class="icon el-icon-adm-usersetup"></i>
                            <span class="text">{{user.name}}</span>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="" v-for="(item,index) in userRoles" :key="item.id">{{item.groupName}}-{{item.roleName}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li class="menu-item">
                    <el-select v-model="topOrg[0]" @change="((val)=>{getUser(val,1)})" class="org-list" @select="handleSelect">
                        <el-option v-for="item in topOrgList" :key="item.id" :label="item.groupName" :value="item.groupId"></el-option>
                    </el-select>
                </li>
                <li class="menu-item">
                    <span class="toprole">{{topRole}}&nbsp;&nbsp;&nbsp;&nbsp;{{source == 1?'财险':'集团'}}</span>
                </li>
                <li class="menu-item" @click="exit">
                    <span style=" color: #4285F4; display: inline; font-size: 16px;margin-right:10px">退出</span>
                    <i class="iconfont icontuichu" style="-webkit-text-fill-color:#DEDEDE;-webkit-text-stroke: 1px #4285F4;"></i>
                </li>
            </ul>
        </div>
        <div class="content-wrapper" ref="content-wrapper" :style="{left: this.isCollapsed?'0px':'200px',padding: this.isCollapsed?'16px 0 0':'16px'}">
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import { ajax } from 'src/utils/utils.js'
import { statusCode } from 'src/utils/utils.js'
import { getUrlKey } from 'src/utils/utils.js'
import qs from 'qs'
import { sessionStorage } from 'src/assets/js/storage'
import Bus from 'src/bus/bus.js'
import { mapState, mapActions } from 'vuex'
export default {
    data() {
        return {
            titTxt: '退出',
            userRoles: [], // 用户菜单
            askuserId: '', // 传值
            topOrg: [], // 用户部门
            topOrgList: [], // 用户部门列表
            topRole: '', // 用户角色
            handleRoleId: '', // 角色Id
            moduleId: '', // 模块ID
            handleData: [],
            isChange: [],
            roleId: '',
            moduleId: '',
            sider_menu_data: [ // 菜单列表
                {
                    title: '首页',
                    icon: 'iconfont iconicon',
                    url: '/home/index'
                }
            ],
            adminMenuShow: false,
            source: '0'
        }
    },
    computed: {
        ...mapState(['isCollapsed', 'caseSend', 'justiceSend', 'companySource']),
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        this.getUser()
    },
    watch: {
        topRole() {
            this.topRole = this.topRole
        },
        roleId: {
            handler(newdata, olddata) {
                this.getHandleData(newdata, this.moduleId)
            },
            immediate: true
        },
        moduleId: {
            handler(newdata, olddata) {
                this.getHandleData(this.roleId, newdata)
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions(['getData', 'setData']),
        showMenu() {
            this.isShowMenu = !this.isShowMenu;
        },
        handleSelect(index) {
            var moduleId = index.substr(index.indexOf('=') + 1)
            this.roleId = this.handleRoleId
            this.moduleId = moduleId
            // this.getHandleData(this.handleRoleId,moduleId)
        },
        // 获取用户名、机构、角色
        getUser(value, type) {
            if (type == 1) {
                this.askuserId = value
                sessionStorage.setItem('roleId', value)
                this.sider_menu_data = [{
                    title: '首页',
                    icon: 'iconfont iconicon',
                    url: '/home/index'
                }]
            }
            var params = qs.stringify({
                groupId: this.askuserId
            })
            this.axios.post('rmUser/userPage', params).then((res) => {
                if (res.code == 200) {
                    if (res.data.daRoleList != undefined) {
                        this.topOrgList = res.data.daRoleList
                        for (var i = 0; i < res.data.daRoleList.length; i++) {
                            if (res.data.daRoleList[i].isCheck != undefined && res.data.daRoleList[i].isCheck == true) {
                                this.$set(this.topOrg, i, res.data.daRoleList[i].groupName)
                                this.topRole = res.data.daRoleList[i].roleName
                                this.handleRoleId = res.data.daRoleList[i].roleId
                                if(type == 1){
                                    sessionStorage.setItem('roleId', res.data.daRoleList[i].roleId * 1)
                                     // 集团、财险视图
                                    if(res.data.daRoleList[i].source){
                                        this.source = res.data.daRoleList[i].source
                                        this.setData({'companySource':res.data.daRoleList[i].source})
                                    } else{
                                        this.setData({'companySource':'0'})
                                    }
                                } else{
                                    sessionStorage.setItem('roleId', res.data.daRoleList[0].roleId * 1)
                                    // 集团、财险视图
                                    if (res.data.daRoleList[0].source) {
                                        this.source = res.data.daRoleList[0].source
                                        this.setData({ 'companySource': res.data.daRoleList[0].source })
                                    } else {
                                        this.setData({ 'companySource': '0' })
                                    }
                                }
                            }
                        }
                    }
                    if (res.data.modules != undefined) {
                        var arr = []
                        for (var i = 0; i < res.data.modules.length; i++) {
                            if (res.data.modules[i].id == '1_h' && res.data.modules[i].child) {
                                for (var j = 0; j < res.data.modules[i].child.length; j++) {
                                    if (res.data.modules[i].child[j].id == "1_hhgxxbs" && res.data.modules[i].child[j].child) {
                                        for (var k = 0; k < res.data.modules[i].child[j].child.length; k++) {
                                            arr.push(res.data.modules[i].child[j].child[k].id)
                                        }
                                        if (arr.indexOf('1_hajfxbs') >= 0) {
                                            sessionStorage.setItem('caseSend', true)
                                        } else {
                                            sessionStorage.setItem('caseSend', false)
                                        }
                                        if (arr.indexOf('1_hsfajxxbs') >= 0) {
                                            sessionStorage.setItem('justiceSend', true)
                                        } else {
                                            sessionStorage.setItem('justiceSend', false)
                                        }
                                        if (sessionStorage.getItem('caseSend') && sessionStorage.getItem('justiceSend')) {
                                            res.data.modules[i].child[j].child.splice(arr.indexOf('1_hajfxbs'), 1)
                                        }
                                    }
                                    if (res.data.modules[i].child[j].id == "1_hhgxxtj" && res.data.modules[i].child[j].child) {
                                        for(var m=0;m<res.data.modules[i].child[j].child.length;m++){
                                            if(res.data.modules[i].child[j].child[m].id == "1_htjbb" && this.companySource == '1'){
                                                this.$set(res.data.modules[i].child[j].child[m], 'name', '历年情况统计')
                                            }
                                            if(res.data.modules[i].child[j].child[m].id == "1_hqdbb" && this.companySource == '1'){
                                                this.$set(res.data.modules[i].child[j].child[m], 'name', '台账')
                                            }
                                        }
                                    }
                                }
                            }
                            // 财险待维护
                            if (res.data.modules[i].id == '1_c' && res.data.modules[i].child) {
                                for (var j = 0; j < res.data.modules[i].child.length; j++) {
                                    if (res.data.modules[i].child[j].id == "1_cdw" && this.companySource == '1') {
                                        this.$set(res.data.modules[i].child[j], 'name', '制度库（编辑中）')
                                    }
                                }
                            }
                            var obj = new Object()
                            obj.title = res.data.modules[i].name
                            obj.url = res.data.modules[i].url
                            obj.icon = res.data.modules[i].ic
                            obj.child = res.data.modules[i].child
                            this.sider_menu_data.push(obj)
                        }
                    } else {
                        this.sider_menu_data = [{
                            title: '首页',
                            icon: 'iconfont iconicon',
                            url: '/home/index'
                        }]
                    }
                    if(type == 1){
                        this.roleId = this.handleRoleId
                        this.moduleId = getUrlKey('id')
                        this.$router.replace('/home/index')
                        this.handleSelect('/home/index')
                    } else{
                        let User = {
                            id: res.data.id,
                            name: res.data.name
                        }
                        this.$store.commit('SET_USER', User);
                        this.$nextTick(() => {
                            this.roleId = this.handleRoleId
                            this.moduleId = getUrlKey('id')
                        })
                    }
                } else{
                    this.$alert(res.message, '提示', {
                      confirmButtonText: '确定'
                    });
                }
            })
        },
        toggleMenu() {
            this.isCollapsed = !this.isCollapsed;
        },
        // 退出
        exit() {
            this.$confirm('即将退出系统登录，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$store.commit('SET_TOKEN', '');
                this.$store.commit('SET_USER', null);
                this.$router.replace({ path: '/login' });
            })
            .catch(() => {
                return false;
            })
        },
        //点击logo返回首页
        backHome() {
            this.$router.replace({ path: '/home/index' });
            this.setData({ 'isCollapsed': false })
        },
        // 获取操作集合
        getHandleData(roleId, moduleId) {
            this.$set(this.isChange, 0, roleId)
            this.$set(this.isChange, 1, moduleId)
            if (roleId && moduleId) {
                var params = qs.stringify({
                    roleId: roleId,
                    moduleId: moduleId
                })
                this.axios.post('rmUser/permissionIds', params).then((res) => {
                    if (res.code == 200) {
                        if (res.data != null) {
                            var orgBtnData = res.data
                            // 如果是待维护制度库 就不重新set值
                            if (moduleId != '1_cdw') {
                                sessionStorage.setItem('handleData', res.data)
                            }
                            // 机构管理
                            if (moduleId == '1_sgroup' && res.data.indexOf('1_sgroupl') < 0) {
                                Bus.$emit('isSgroup', 1)
                            }
                            // 用户管理
                            if (moduleId == '1_suser' && res.data.indexOf('1_suserl') < 0) {
                                Bus.$emit('isSuser', 1)
                            }
                            // 权限管理
                            if (moduleId == '1_srole' && res.data.indexOf('1_srolel') < 0) {
                                Bus.$emit('isSrole', 1)
                            }
                            // 日志管理
                            if (moduleId == '1_slog' && res.data.indexOf('1_slogl') < 0) {
                                Bus.$emit('isSlog', 1)
                            }
                            // 修改密码
                            if (moduleId == '1_spwd' && res.data.indexOf('1_spwdl') < 0) {
                                Bus.$emit('isSpwd', 1)
                            }
                            // 外规管理
                            if (moduleId == '1_couter' && res.data.indexOf('1_couterl') < 0 && res.data.indexOf('1_couters') < 0) {
                                Bus.$emit('isCouter', 1)
                            }
                            // 内部制度管理
                            if (moduleId == '1_cinner' && res.data.indexOf('1_cinnerrt') < 0 && res.data.indexOf('1_cinnermt') < 0 && res.data.indexOf('1_cinnerl') < 0 && res.data.indexOf('1_cinners') < 0) {
                                Bus.$emit('isCinner', 1)
                            }
                            // 东方制度管理
                            if (moduleId == '1_cdf' && res.data.indexOf('1_cdfl') < 0 && res.data.indexOf('1_cdfs') < 0) {
                                Bus.$emit('isCdf', 1)
                            }
                            // 风险偏好陈述管理
                            if (moduleId == '1_pstate' && res.data.indexOf('1_pstatel') < 0) {
                                Bus.$emit('isPstate', 1)
                            }
                            // 风险限额管理
                            if (moduleId == '1_plimit' && res.data.indexOf('1_plimitl') < 0) {
                                Bus.$emit('isPlimit', 1)
                            }
                            // this.$store.dispatch('getData',orgBtnData)
                            this.getData(orgBtnData)
                            // Bus.$emit('handleData',res.data)
                            // sessionStorage.setItem('newhandleData',res.data)
                        } else {
                            if (moduleId == '1_sgroup') {
                                Bus.$emit('isSgroup', 1)
                            }
                            if (moduleId == '1_suser') {
                                Bus.$emit('isSuser', 1)
                            }
                            if (moduleId == '1_srole') {
                                Bus.$emit('isSrole', 1)
                            }
                            if (moduleId == '1_slog') {
                                Bus.$emit('isSlog', 1)
                            }
                            if (moduleId == '1_spwd') {
                                Bus.$emit('isSpwd', 1)
                            }
                            if (moduleId == '1_couter') {
                                Bus.$emit('isCouter', 1)
                            }
                            if (moduleId == '1_cinner') {
                                Bus.$emit('isCinner', 1)
                            }
                            if (moduleId == '1_cdf') {
                                Bus.$emit('isCdf', 1)
                            }
                            if (moduleId == '1_cdw') {
                                Bus.$emit('isCdw', 1)
                            }
                            if (moduleId == '1_pstate') {
                                Bus.$emit('isPstate', 1)
                            }
                            if (moduleId == '1_plimit') {
                                Bus.$emit('isPlimit', 1)
                            }
                            this.getData(orgBtnData)
                        }
                    }
                })
            }
        },
    }
}

</script>
<style lang="scss">
/*菜单关闭*/
/*.el-submenu>.el-submenu__title .el-submenu__icon-arrow{
  -webkit-transform: rotateZ(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotateZ(-90deg);
}*/
.el-submenu>.el-submenu__title .el-submenu__icon-arrow:before {
    content: "\E6D9";
}
/*菜单展开*/
/*.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
  -webkit-transform: rotateZ(0deg);
  -ms-transform: rotate(0deg);
  transform: rotateZ(0deg);
}*/
.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow:before {
    content: '\E6D8';
}
.menu-item:hover {
    cursor: pointer;
}
@import '../../assets/styles/variable';
.iconfont {
    -webkit-text-fill-color: #DDDEDE;
    -webkit-text-stroke: 1px #505561;
}
.logo-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    color: #65CEA7;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e3e3e3;
    z-index: 11;
    .logoImg {
        display: inline-block;
        width: 110px;
        height: 25px;
        margin-top: 16px;
        margin-left: 37px;
    }
}
.siderbar-wrapper {
    position: fixed;
    top: 61px;
    bottom: 0;
    left: 0;
    width: $siderbarWidth;
    z-index: 11;
    background-color: $siderbarBackgroundColor;
    transition: all 0.3s ease-in-out;
    .menu-wrapper {
        position: absolute;
        top: 0px;
        bottom: 0;
        width: 100%;
        border-right: none;
        transition: all 0.3s ease-in-out;

        &:not(.el-menu--collapse) {
            overflow-y: auto;
            overflow-x: hidden;
        }
        span {
            color: #515151;
        }
        i {
            color: #909191;
        }

        .menu-item {

            &:hover {
                background-color: rgba(66, 133, 244, 0.10) !important;
                color: #4285F4 !important;
                span {
                    color: #4285F4 !important;
                }
                i {
                    -webkit-text-fill-color: #fff !important;
                    -webkit-text-stroke: 1px #4285F4 !important;
                    color: #4285F4 !important;
                }
            }

        }

        .el-submenu__title:hover {
            color: #4285F4 !important;
            span {
                color: #4285F4 !important;
            }
            i {
                -webkit-text-fill-color: #fff !important;
                -webkit-text-stroke: 1px #4285F4 !important;
                color: #4285F4 !important;
            }
        }

        .el-submenu,
        .el-menu-item {
            width: 100%;
        }
    }
}

.topbar-wrapper {
    line-height: 60px;
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: 0;
    height: 60px;
    line-height: 60px;
    background: #f3f3f3;
    border-bottom: 1px solid #e3e3e3 !important;
    /*background-color: $topbarBackgroundColor;*/
    /*box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);*/
    /*transition: all 0.3s ease-in-out;*/
    z-index: 12;

    .menu-collapse-wrapper {
        height: 100%;
        width: 48px;
        text-align: center;
        cursor: pointer;

        i {
            transition: all 0.3s ease-in-out;
        }
    }

    .title {
        height: 100%;
        font-weight: bold;
        font-size: 16px
    }

    .menu-list {
        .menu-item {
            position: relative;
            float: left;
            padding-right: 15px;
            min-width: 45px;
            height: 48px;
            text-align: center;
            font-size: 0px;

            /*&:hover {
          cursor: pointer;
          background-color: #F5F5F5;
        }*/

            .icon {
                vertical-align: middle;
                font-size: 24px;
            }

            .text {
                font-size: 16px;
            }
            .toprole {
                display: inline-block;
                vertical-align: middle;
                font-size: 16px;
                color: #606266;
                margin-right: 60px
            }
            .org-list input {
                font-size: 16px;
                background: none !important;
                border: none !important;
                padding-left: 0 !important;
                width: 110px;
                height: 60px;
                line-height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap
            }
            .el-select .el-input .el-select__caret {
                line-height: 60px !important;
            }
            .el-icon-arrow-up:before {
                color: #909191;
                content: "\e78f" !important;
            }
        }
    }
}
.content-wrapper {
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: $topbarHeight;
    bottom: 0;
    padding: 16px 0 0;
    overflow: auto;
    transition: all 0.3s ease-in-out;

    .content {
        position: relative;
        width: 100%;
        height: 100%;
    }
}

</style>
