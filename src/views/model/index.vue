<template>
  <div class="app-container">
    <el-button plain size="mini" type="primary" @click="onSubmit">导入</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @expand-change="handleExpendRow"
    >
      <!-- <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column> -->
      <el-table-column type="expand" align="center">

        <template slot-scope="scope">
            <el-table 
              :data="sublist[String(scope.$index)]"
              v-loading="sublistLoading"
            >
              <el-table-column label="版本" width="100">
                <template slot-scope="scope0"> 
                  {{ scope0.row.mversion }}
                </template>
              </el-table-column>
              <el-table-column
                label="状态" width="100"> 
              </el-table-column>
              <el-table-column
                label="部署类型"  width="100">
                <template slot-scope="scope0"> 
                <span v-if="scope0.row.mdeploy == 0">在线部署</span>
                <span v-if="scope0.row.mdeploy == 1">边缘部署</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="模型大小"  width="100">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="创建时间" width="200">
                <template slot-scope="scope0"> 
                <i class="el-icon-time" />{{ scope0.row.create_time | formatDate }}
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                label="描述"><template slot-scope="scope0"> {{ scope0.row.mdesc }}</template>
              </el-table-column>

              <!-- 子表格操作列 -->
              <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary">部署</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row.muuid)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </template>
      </el-table-column>
      <el-table-column label="模型名称" width="110" >
        <template slot-scope="scope">
          {{ scope.row.mname }}
        </template>
      </el-table-column>
      <el-table-column label="最新版本" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mlatest_ver }}</span>
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
          {{ scope.row.mver_count }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.mdesc }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="gray">创建新版本</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.muuid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, getListByName } from '@/api/model'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    formatDate(nows) {
      var year = nows[0]
      var month = nows[1]
      var day = nows[2]
      var hour = nows[3]
      var minute = nows[4]
      var second = nows[5]
      if (hour.toString().length < 2) {
        hour = '0' + hour
      }
      if (minute == null) {
        minute = '00'
      } else if (minute.toString().length < 2) {
        minute = '0' + minute
      }
      if (second == null) {
        second = '00'
        console.log(hour.length)
      } else if (second.toString().length < 2) {
        second = '0' + second
      }
      return ' ' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }
  },
  data() {
    return {
      list: null,
      sublist: {},
      listLoading: true,
      sublistLoading: false
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
    },
    onSubmit() {
      this.$message('submit!')
    },
    handleExpendRow(row, expandedRows) {
      let index = this.list.findIndex(data => data.muuid == row.muuid).toString()
      if (!this.sublist[index]) {
        this.sublistLoading = true
        getListByName(row.mname).then(response => {
          this.sublist[index] = response.data.items
          this.sublistLoading = false
        })
      }
    }
  }
}
</script>
