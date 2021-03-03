<template>
  <div class="tooltip">
    <el-tooltip effect="dark" placement="right">
      <div slot="content">
        <p style="width:400px;" v-html="messages"></p>
      </div>
      <i class="el-icon-question" style="color:#409eff;font-size:5px;cursor:pointer;"></i>
    </el-tooltip>
  </div>
</template>
<script>
  export default {
    props:['messages']
  };
</script>
<style lang="scss">
	
</style>