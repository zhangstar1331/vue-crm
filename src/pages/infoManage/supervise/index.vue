<!-- 合规信息库首页 -->
<template>
<div>
    <looseEventStore code='superviseInfo' :title="title" :bannerListProp="bannerList" :tableHeadProp="tableHeadFilter">
    </looseEventStore>
</div>
</template>

<script>
import looseEventStore from "../../lossEvent/lossEventStore";
import { mapState } from 'vuex'
export default {
    props: [],
    components: {
        looseEventStore
    },
    data() {
        return {
            title: {
                title: "监管检查信息库",
                routeInfo: {
                    text: '查看全部监管检查信息',
                    route: 'superviseInfo'
                },
            },
            bannerList: ["合规信息管理", "合规信息库", "监管检查信息库"],
            tableHead: [
				{
                    prop: "lossOneName",
					label: "公司",
					isShow:"0"
				},
				{
                    prop: "orgName",
					label: "公司",
					isShow:"1"
                },
                {
                    prop: "yBCount",
					label: "银保监系统检查次数",
					isShow:"0"
				},
				{
                    prop: "ybjCount",
					label: "银保监系统检查次数",
					isShow:"1"
                },
                {
                    prop: "noYBCount",
                    label: "非银保监系统检查次数",
					isShow:"0"
				},
				{
                    prop: "noYbjCount",
                    label: "非银保监系统检查次数",
					isShow:"1"
                },
                {
                    prop: "resultCount",
                    label: "已收到检查结果",
					isShow:"0+1"
				},
                {
                    prop: "resultCfjgCount",
                    label: "受到行政处罚或者其他监管措施次数",
					isShow:"0"
                },
                {
                    prop: "punishCount",
                    label: "受到行政处罚或者其他监管措施次数",
					isShow:"1"
                }
            ]
        };
    },
    computed: {
		...mapState(['companySource']),
		tableHeadFilter(){
			return this.tableHead.filter(
				item => item.isShow.includes(this.companySource)
			);
		}
	},
    methods: {}
};
</script>

<style lang='less' scoped>
</style>
