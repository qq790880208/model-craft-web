<template>
  <div class='main'>
    <el-breadcrumb separator-class="el-icon-arrow-right" 
    style="margin-top:20px; margin-left:20px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>作业参数管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import table from './table'
export default {

  components: {table},
  data() {

    return {

    };
  },

  computed: {},

  watch: {},

  methods: {

  },
}
</script>
<style lang='scss' scoped>


</style>