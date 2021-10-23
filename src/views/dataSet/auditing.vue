<template>
  <div class="app-container">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="审核数据集" name="audit">
          <el-form :inline="true" :model="filter">
            <el-form-item>
              <el-input v-model="filter.name" placeholder="请输入查询名称" clearable>
                <el-button slot="append" icon="el-icon-search" @click="getAuditDataSet()" />
              </el-input>
            </el-form-item>
          </el-form>
          <el-table :data="dataSetAudit" highlight-current-row style="width: 100%;" @sort-change="sortChange">
            <el-table-column prop="name" align="center" label="名称" min-width="200" :sortable="'custom'">
              <template slot-scope="scope">
                <span class="link-type" @click="toAudit(scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="label_type" align="center" label="审核类型" min-width="120" :sortable="'custom'">
              <template slot-scope="scope">
                {{ scope.row.label_type | formatType }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="审核进度" min-width="260">
              <template slot-scope="scope">
                <div style="width: 250px; margin:0px auto;">
                  <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" />
                  {{ scope.row.done }} / {{ scope.row.tol }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="descr" align="center" label="描述" min-width="150" :sortable="'custom'" />
            <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" :sortable="'custom'">
              <template slot-scope="scope">
                {{ scope.row.create_time | formatDate }}
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :page-sizes="[1,5,10,20]" :total="total2" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import store from '@/store'
import { getAuditData } from '@/api/audit'

export default {
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
      } else if (second.toString().length < 2) {
        second = '0' + second
      }
      return ' ' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    },
    formatType(num) {
      if (num === 0) {
        return 'tensorflow-2D拉框标注'
      }
      if (num === 1 || num === 4) {
        return 'tensorflow-多边形标注'
      }
      if (num === 2) {
        return '语音标注'
      }
      if (num === 3) {
        return 'pytorch-2D拉框'
      }
    }
  },
  data() {
    return {
      activeName: 'audit',
      filter: {
        name: ''
      },
      colorder: '',
      ordering: '',
      total2: 0,
      dataSetAudit: [],
      page: 1,
      page_size: 20
    }
  },
  mounted() {
    this.getAuditDataSet()
  },
  methods: {
    // 排序
    sortChange(column) {
      console.log('排序', column.prop, column.order)
      this.colorder = column.prop
      this.ordering = column.order
      this.getAuditDataSet()
    },
    // 设置标注进度条
    setItemProgress(speed, tol) {
      if (speed === 0) {
        return 0
      }
      if (speed > tol) {
        return 100
      } else {
        return parseInt((speed / tol).toFixed(1) * 100)
      }
    },
    // 分页查询
    handleSizeChange(val) {
      this.page_size = val
      this.getAuditDataSet()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getAuditDataSet()
    },
    // 得到审核数据集
    getAuditDataSet() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        userId: store.getters.userid,
        name: this.filter.name,
        colorder: this.colorder,
        ordering: this.ordering
      }
      getAuditData(params).then(res => {
        this.dataSetAudit = res.data.items
        this.total2 = res.data.total
      })
      this.filters.name = ''
    },

    // 前往审核界面
    toAudit: function(val) {
      console.log(val)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('data/changeDataSet', val)
      // this.$router.push({path:'/dataSet/audit'})
      // this.$router.push({path: '/dataSet/polygonaudit'})
      // this.$router.push({ path: '/dataSet/3Daudit' })
      if (val.label_type === 0) {
        this.$router.push({ path: '/dataSet/2DauditPre' })
      }
      if (val.label_type === 1) {
        this.$router.push({ path: '/dataSet/polygonaudit' })
      }
      if (val.label_type === 2) {
        this.$router.push({ path: '/dataSet/3Daudit' })
      }
      if (val.label_type === 3) {
        this.$router.push({ path: '/dataSet/2DauditPre' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding: 10px 20px 50px 20px !important;
}
</style>
