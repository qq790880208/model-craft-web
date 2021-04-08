<template>
  <section class="out-main">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 10px;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="filter.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="logList" highlight-current-row style="width: 100%;" @selection-change="selsChange">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <!-- <el-table-column prop="id" align="center" label="id" width="100">
      </el-table-column> -->
      <el-table-column prop="user_name" align="center" label="用户名" width="120" sortable>
      </el-table-column>
      <el-table-column prop="ip" align="center" label="IP" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="message" align="center" label="信息" width="180" sortable>
      </el-table-column>
      <el-table-column prop="time" align="center" label="时间" width="100" sortable>
      </el-table-column>
      <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
        <template slot-scope="scope">
          {{ scope.row.create_time | formatDate }}
         </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" :disabled="sels.length===0" @click="batchRemove">批量删除</el-button>
      <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListByPage, batchRemoveList } from '@/api/loginlog'
export default {
  name: 'Dashboard',
  data() {
    return {
      total: 0,
      sels: [], // 列表选中列
      page: 1,
      page_size: 10,
      filter: {
        name: ''
      },
      logList: []
    }
  },
  filters: {
    formatDate(nows) {
      if (!nows) { // 在这里进行一次传递数据判断.如果传递进来的为空值,返回其空字符串.解决其问题
        return ''
      }
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
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleSizeChange(val) {
      this.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      const para = {
        page: this.page,
        pagesize: this.page_size,
        name: this.filter.name
      }
      console.log(para)
      getListByPage(para).then(res => {
        this.total = res.data.total
        this.logList = res.data.items
      })
    },
    // 全选单选多选
    selsChange: function(sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { ids: ids }
          console.log(para)
          batchRemoveList(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.getList()
  }
}

</script>

<style lang="scss" scoped>
.out-main{
    margin: 15px;
  }
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
