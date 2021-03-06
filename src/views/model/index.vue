<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="模型名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.mname }}
        </template>
      </el-table-column>
      <el-table-column label="最新版本" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mversion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部署类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.mdeploy == 0">在线部署</span>
          <span v-if="scope.row.mdeploy == 1">边缘部署</span>
        </template>
      </el-table-column>
      <el-table-column label="版本数量" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.mdesc }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
          <el-tag type="gray">创建新版本</el-tag> <el-tag type="danger">删除</el-tag>
      </el-table-column>
      
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/model'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
