<template>
  <div class="app-container">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="验收数据集" name="accept">
          <el-form :inline="true" :model="filter">
            <el-form-item>
              <el-input v-model="filter.name" placeholder="请输入查询名称" clearable>
                <el-button slot="append" icon="el-icon-search" @click="getAcceptDataSet()" />
              </el-input>
            </el-form-item>
          </el-form>
          <el-table :data="dataSetAccept" highlight-current-row style="width: 100%;" @sort-change="sortChange">
            <el-table-column prop="name" align="center" label="名称" min-width="200" :sortable="'custom'">
              <template slot-scope="scope">
                <span class="link-type" @click="toAccept(scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="label_type" align="center" label="验收类型" min-width="120" :sortable="'custom'">
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
            <el-table-column prop="rate" align="center" label="验收比例" min-width="150" :sortable="'custom'">
              <template slot-scope="scope">
                <div class="block">
                  <el-slider v-model="scope.row.rate" :step="10" show-stops />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :page-sizes="[1,5,10,20]" :total="total3" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import store from '@/store'
import { getAcceptData, setAcceptDataApi } from '@/api/accept'

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
      activeName: 'accept',
      filter: {
        name: ''
      },
      colorder: '',
      ordering: '',
      total3: 0,
      dataSetAccept: [],
      page: 1,
      page_size: 20
    }
  },
  mounted() {
    this.getAcceptDataSet()
  },
  methods: {
    // 排序
    sortChange(column) {
      console.log('排序', column.prop, column.order)
      this.colorder = column.prop
      this.ordering = column.order
      this.getAcceptDataSet()
    },
    // 分页查询
    handleSizeChange(val) {
      this.page_size = val
      this.getAcceptDataSet()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getAcceptDataSet()
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
    // 得到验收数据集
    getAcceptDataSet() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        userId: store.getters.userid,
        name: this.filter.name,
        colorder: this.colorder,
        ordering: this.ordering
      }
      getAcceptData(params).then(res => {
        this.dataSetAccept = res.data.items
        this.total3 = res.data.total
      })
      this.filters.name = ''
    },
    // 前往审核界面
    toAccept: function(val) {
      console.log(val)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('data/changeDataSet', val)
      // this.$router.push({path:'/dataSet/audit'})
      // this.$router.push({path: '/dataSet/polygonaudit'})
      // this.$router.push({path: '/dataSet/3Daudit'})
      const params = {
        dataSetUuid: val.uuid,
        rate: val.rate,
        userId: store.getters.userid
      }
      console.log(params)
      // setAcceptDataApi(params)
      this.setAuditDatas(params)
      if (val.label_type === 0 || val.label_type === 3) {
        this.$router.push({ path: '/dataSet/2Daccept' })
      }
      if (val.label_type === 1 || val.label_type === 4) {
        this.$router.push({ path: '/dataSet/polygonaccept' })
      }
      if (val.label_type === 2) {
        this.$router.push({ path: '/label/voice' })
      }
      // if(val.label_type === 3) {
      //   this.$router.push({path:'/label/voice'})
      // }
    },
    setAuditDatas(params) {
      setAcceptDataApi(params).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding: 10px 20px 50px 20px !important;
}
</style>
