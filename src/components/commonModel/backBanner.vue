<!-- 头部返回模块 -->
<template>
  <div>
    <el-header class="header" style="padding-left:218px">
      <div class="headBox">
        <stepBar :bannerList="bannerList"></stepBar>
        <el-button type="primary" @click="goback" size="mini">返回</el-button>
      </div>
    </el-header>
  </div>
</template>

<script>
import stepBar from "./stepBar";
export default {
  props: ["bannerList", "route"],
  components: {
    stepBar
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    goback() {
      if (typeof this.route === "string") {
        this.$router.push({ name: this.route });
      } else {
        this.$router.push({ name: this.route.name, params: this.route.params });
      }
    }
  },
  mounted() {}
};
</script>
<style lang='less' scoped>
.header {
  padding-left: 0;
  padding-right: 2.6%;
  position: fixed;
  width: 100%;
  padding-top: 15px;
  -webkit-box-shadow: 4px 2px 6px #888;
  height: 52px;
  top: 60px;
  left: 0;
  background: #fff;
  z-index: 99999;
  button {
    width: 68px;
    height: 26px;
    line-height: 1px;
    font-size: 12px;
    position: absolute;
    right: 0px;
    top: 12px;
  }
  .headBox {
    position: relative;
    top: -10px;
    height: 50px;
  }
}
</style>