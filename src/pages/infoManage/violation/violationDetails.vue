<!-- 内部违规信息详情 -->
<template>
  <div>
    <judicialDetails code='violationDetails' :bannerListProp='bannerList'></judicialDetails>
  </div>
</template>

<script>
import judicialDetails from '../judicial/judicialDetails'
export default {
  props:[],
  components: {
    judicialDetails
  },
  data () {
    return {
      bannerList:[
        "合规信息管理",
        "合规信息库",
        "内部违规信息库",
        "内部违规信息详情"
      ]
    };
  },
  computed: {},
  methods: {}
}

</script>
<style lang='less' scoped>
</style>