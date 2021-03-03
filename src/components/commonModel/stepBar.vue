<!-- 步骤菜单 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="myBanner">
      <el-breadcrumb-item
        v-for="(banner,index) in bannerList"
        :key="index"
        :class="{focus:index===bannerList.length-1}"
      >{{banner}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['bannerList'],
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
<style lang='less' scoped>
.el-breadcrumb {
  padding-top: 16px;
  height:14px;
}
/deep/.myBanner .focus .el-breadcrumb__inner {
  color: #4285f4 !important;
  font-weight: 700 !important;
}
/deep/.myBanner .el-breadcrumb__inner {
  color: #606266 !important;
  font-weight: 700;
}
</style>