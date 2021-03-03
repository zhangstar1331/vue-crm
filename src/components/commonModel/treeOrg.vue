<!-- 树形结构组件 -->
<template>
<div>
    <el-form-item :label="label">
        <el-select v-model="form.region" ref="comSelect">
            <el-option style="height:auto;background-color:#fff;" :value="form.region">
                <el-tree :props="insprops" :key="treeKey" ref="tree" @node-click="handleNodeClick" :load="loadNode" lazy node-key="id"></el-tree>
            </el-option>
        </el-select>
    </el-form-item>
</div>
</template>

<script>
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
                id:""
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
                };
            }
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
            if (node.disabled != true) {
                this.id = {
                    level_1: "",
                    level_2: "",
                    level_3: ""
                };
                this.form.region = node.name;
                this.form.id = node.groupId
                node.homeList.forEach((item, index) => {
                    this.id["level_" + (index + 1)] = item;
                });
                // this.$refs.comSelect.blur();
                this.$emit("orgChange", {
                    id: this.id,
                    region: this.form.region
                });
            }
        },
        //加载数据
        async loadNode(node, resolve) {
            let url;
            if (this.companySource == "1") {//财险
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
            } else{
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
        }
    }
};
</script>

<style lang="less" scoped></style>
