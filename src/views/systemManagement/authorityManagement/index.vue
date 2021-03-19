<template>
  <div class="app-container">
    <el-table :data="authList" style="width: 100%;">
      <el-table-column prop="id" align="center" label="index" width="70">
      </el-table-column>
      <el-table-column prop="name" align="center" label="角色名" width="160" sortable>
      </el-table-column>
      <el-table-column prop="remark" align="center" label="备注" width="160" sortable>
      </el-table-column>
      <el-table-column prop="create" align="center" label="创建人" width="160" sortable>
      </el-table-column>
      <el-table-column prop="description" align="center" label="描述" min-width="180" sortable>
      </el-table-column>
    </el-table>
    <!--新增编辑界面-->
  </div>
</template>

<script>

export default {
  data() {
    return {
      authList: [
        {
          id: 1,
          name: 'admin',
          remark: '管理员',
          create: 'admin',
          description: ''
        },
        {
          id: 2,
          name: 'user',
          remark: '普通用户',
          create: 'admin',
          description: ''
        },
        {
          id: 3,
          name: 'teamManage',
          remark: '团队管理员',
          create: 'admin',
          description: ''
        },
        {
          id: 4,
          name: 'teamLabel',
          remark: '团队标注员',
          create: 'admin',
          description: ''
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
