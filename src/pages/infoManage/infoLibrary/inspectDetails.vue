<!-- 监管检查事项信息详情 -->
<template>
  <div>
    <backBanner :bannerList='bannerList' route='leStoreAall'></backBanner>
    <div class='shadowBox' style='margin-top:75px'>
      <div class="titIcon">
        <em></em>
        <span style="font-weight: 600;">基本信息</span>
      </div>
    </div>
  </div>
</template>

<script>
import backBanner from 'src/components/commonModel/backBanner'
export default {
  props:[],
  components: {
    backBanner
  },
  data () {
    return {
      bannerList:['合规信息管理','合规信息库','监管检查事项信息库','监管检查事项信息详情']
    };
  },
  computed: {},
  methods: {}
}

</script>
<style lang='less' scoped>
</style>