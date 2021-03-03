<!-- 树形结构组件 -->
<template>
<div id="treeOrg">
    <el-form-item :label="label" class="searchBtn">
        <el-select v-model="form.mineStatus" multiple collapse-tags placeholder="请选择机构名称" ref="searchSelect" value-key="mineStatus" @remove-tag="deleteOrg" filterable :filter-method="keyFilter" @focus="selectFoucus" @visible-change="visibleChange">
            <el-option style="height:auto;background-color:#fff;" :value="form.mineStatus">
                <el-tree :props="insprops" :key="treeKey" ref="tree" @node-expand="getNodeInfo" @node-click="handleNodeClick" :load="loadNode" lazy node-key="groupId" show-checkbox @check="getNodeChange" :check-strictly="true" accordion :filter-node-method="filterNode"></el-tree>
            </el-option>
        </el-select>
        <el-button icon="el-icon-search" size="mini" class="commonBtn" @click="searchOrg"></el-button>
    </el-form-item>
    <org-search :searchResult="searchResult" v-if="isShow" @closeMask="closeMaskTable"></org-search>
</div>
</template>

<script>
import orgSearch from 'src/components/infoManage/orgSearch'
import qs from 'qs'
import {
    mapState
} from 'vuex';
export default {
    props: ["label"],
    components: {},
    data() {
        return {
            form: {
                region: "",
                mineStatus: [],
                viewList: [],
                arrLabel: [],
                copy: [],
                org: ''
            },
            id: {
                level_1: "",
                level_2: "",
                level_3: ""
            },
            insprops: {
                label: "name",
                isLeaf: false,
                id: ""
            },
            treeKey: "",
            orgType: "",
            isShow: false,
            searchResult: '',
            visible: false
        };
    },
    computed: {
        ...mapState(['companySource']),
        orgId() {
            return this.id.level_3 || this.id.level_2 || this.id.level_1;
        }
    },
    watch: {
        "form.region"(val) {
            if (!val) {
                this.id = {
                    level_1: "",
                    level_2: "",
                    level_3: ""
                }
            }
        }
    },
    components: {
        orgSearch
    },
    updated() {
        const org = $('.el-select__tags-text').eq(0)
        if (this.form.mineStatus.length > 0) {
            const name = this.form.mineStatus[0]
            org.text(name.split('*')[0])
        }
    },
    created() {
        if (this.label == "事件所属公司") {
            this.orgType = 8;
        } else {
            this.orgType = 7;
        }
    },
    methods: {
        handleNodeClick(node) {
        },
        getNodeInfo(node, resolve) {
        },
        getNodeChange(node, b) {
            this.getCheckedNodes(node, b, this.$refs.tree)
        },
        getCheckedNodes(node, b, ref) {
            var flag = true;
            if (this.form.arrLabel.length) {
                for (var i = 0; i < this.form.arrLabel.length; i++) {
                    if ((node.name + '*' + node.groupId) == this.form.arrLabel[i] || (node.name) == this.form.arrLabel[i]) {
                        flag = false;
                        this.form.arrLabel = this.delOne(this.form.arrLabel[i], this.form.arrLabel);
                        break;
                    }
                }
                if (flag) {
                    this.form.arrLabel.push(node.name + '*' + node.groupId)
                }
            } else {
                this.form.arrLabel.push(node.name + '*' + node.groupId)
            }
            this.form.mineStatus = this.form.arrLabel
            var arr = []
            for (var i = 0; i < this.form.mineStatus.length; i++) {
                arr.push(this.form.mineStatus[i].split('*')[1])
            }
            this.form.viewList = arr
            this.form.copy = this.form.mineStatus
            this.form.org = this.form.viewList.toString()
            this.$emit("orgChange", {
                id: this.form.viewList.toString(),
                region: this.form.mineStatus
            });
        },
        deleteOrg(tag) {
            this.form.viewList = this.delOne(tag.split('*')[1], this.form.viewList)
            this.form.arrLabel = this.delOne(tag, this.form.arrLabel)
            if (this.form.viewList.length > 0) {
                this.$nextTick(function () {
                    this.$refs.tree.setCheckedKeys(this.form.viewList)
                })
            } else {
                this.$nextTick(function () {
                    this.$refs.tree.setCheckedKeys([])
                })
            }
            if (this.form.org) {
                var arr = this.form.org.split(',')
                arr.splice(0, 1)
                this.form.org = arr.toString()
                this.$emit("orgChange", {
                    id: this.form.org,
                    region: this.form.mineStatus
                });
            }
            this.form.copy = this.form.mineStatus
        },
        delOne(itemId, arr) {
            var rmArr = arr;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == itemId) {
                    var index = arr.indexOf(itemId);
                    rmArr.splice(index, 1)
                }
            }
            return rmArr
        },
        //加载数据
        async loadNode(node, resolve) {
            let url;
            if (this.companySource == "1") { //财险
                if (node.level == 0) {
                    url = `rmUser/cxGroupName?parentId=1_01&type=${this.orgType}`;
                } else {
                    url = `rmUser/cxGroupName?parentId=${node.data.groupId}&type=${this.orgType}`;
                }
                //获取数据
                let respond = await this.axios.get(url);
                if (respond.code === 200 && respond.data) {
                    if (respond.data != null) {
                        for (var i = 0; i < respond.data.length; i++) {
                            if (respond.notCheck != null) {
                                for (var j = 0; j < respond.notCheck.length; j++) {
                                    if (respond.notCheck[j] == respond.data[i].groupId) {
                                        respond.data[i].disabled = true;
                                    }
                                }
                            }
                            //构建树结构
                            if (node.level == 0) {
                                respond.data[i].homeList = [respond.data[i].groupId]
                            } else {
                                respond.data[i].homeList = [...node.data.homeList, respond.data[i].groupId]
                            }
                        }
                    }
                    resolve(respond.data);
                } else {
                    resolve([]);
                }
            } else {
                if (node.level == 0) {
                    url = `rmUser/groupName?parentId=1_01&type=${this.orgType}`;
                } else {
                    url = `rmUser/groupName?parentId=${node.data.groupId}&type=${this.orgType}`;
                }
                //获取数据
                let respond = await this.axios.get(url);
                if (respond.code === 200 && respond.data.data) {
                    if (respond.data.data != null) {
                        for (var i = 0; i < respond.data.data.length; i++) {
                            if (respond.data.notCheck != null) {
                                for (var j = 0; j < respond.data.notCheck.length; j++) {
                                    if (respond.data.notCheck[j] == respond.data.data[i].groupId) {
                                        respond.data.data[i].disabled = true;
                                    }
                                }
                            }
                            //构建树结构
                            if (node.level == 0) {
                                respond.data.data[i].homeList = [respond.data.data[i].groupId]
                            } else {
                                respond.data.data[i].homeList = [...node.data.homeList, respond.data.data[i].groupId]
                            }
                        }
                    }
                    resolve(respond.data.data);
                } else {
                    resolve([]);
                }
            }
        },
        closeMaskTable(data) {
            this.isShow = data.status;
            if (data.orgChecked) {
                this.form.mineStatus = []
                this.form.arrLabel = []
                this.form.viewList = []
                this.form.org = data.orgChecked
            }
            if (data.orgNamelist) {
                this.form.mineStatus = data.orgNamelist
                this.form.copy = this.form.mineStatus
                this.treeKey = +new Date();
                this.$nextTick(function () {
                    this.$refs.tree.setCheckedKeys([])
                })
            }
            this.$emit("orgChange", {
                id: data.orgChecked,
                region: this.form.mineStatus
            });
        },
        keyFilter(val) {
            this.$set(this.form, 'region', val)
            setTimeout(() => {
                let input = this.$refs.searchSelect.$children[0].$refs.input;
                input.value = val
            })
        },
        filterNode(value, data) {
            return true
        },
        selectFoucus(e) {
            if (this.visible) {
                let input = this.$refs.searchSelect;
                input.blur()
            }
        },
        visibleChange(val) {
            this.visible = val
            if (!val) {
                this.form.mineStatus = this.form.copy
            } else {
                this.form.mineStatus = []
                setTimeout(() => {
                    let input = this.$refs.searchSelect.$children[0].$refs.input;
                    input.value = ''
                })
            }
        },
        searchOrg() {
            let input = this.$refs.searchSelect.$children[0].$refs.input;
            if (!input.value) {
                this.$alert('请输入机构名称', '提示', {
                    confirmButtonText: '确定'
                })
                return
            }
            var params = qs.stringify({
                name: this.form.region,
                type: 7,
                pageNumber: 1,
                pageSize: 10,
                status: 1
            })
            this.axios.post('/rmUser/searchGroup', params).then((res) => {
                if (res.code == 200) {
                    if (res.data !== null) {
                        if (res.data.data !== null) {
                            this.searchResult = res.data
                            this.$set(this.searchResult, 'orgName', this.form.region)
                            this.isShow = true
                        } else {
                            this.$alert('无对应查询结果，请重新选择查询条件', '提示', {
                                confirmButtonText: '确定'
                            })
                            return
                        }
                    }
                } else {
                    this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            })
        },
    }
};
</script>

<style>
#treeOrg .searchBtn .el-form-item__content {
    font-size: 0 !important;
    height: 32px;
	line-height: 32px;
}

#treeOrg .el-select__tags .el-select__input.is-mini {
    border: none;
    background: none;
    margin-left: 0;
    color: transparent!important;
	caret-color:#606266;
}

#treeOrg .searchBtn .el-icon-search:before {
    color: #606266
}

#treeOrg .searchBtn .el-select {
    width: calc(100% - 50px) !important
}
</style><style lang="less" scoped>
#treeOrg {
    .searchBtn .commonBtn {
        display: inline-block;
        margin-right: 0;
        width: 50px;
        height: 32px;
        line-height: 32px;
        padding: 0;
        font-size: 12px;
        background: #ecf5ff
    }
}
</style>
