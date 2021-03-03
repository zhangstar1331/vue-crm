<!--  -->
<template>
  <div class='riskTable'>
      <el-table
      :data='message.secondContent' style="cursor:pointer;">
      <el-table-column
      label="序号"
       align="center"
      type="index"
      width="40">
    </el-table-column>
     <el-table-column 
     align="center" 
     prop="object" 
     width="120"
     label="适用对象">
     </el-table-column>
     <el-table-column 
     align="center" 
     prop="cause" 
     label="事件描述">
     	<template slot-scope="scope">
     		<div style="text-align:left;">{{scope.row.cause}}</div>
     	</template>
     </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props:['message']
}
</script>
<style lang='less' scoped>
</style>