<template>
  <div class="app-container">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="标注数据集" name="manager">
          <el-form :inline="true" :model="filter">
            <el-form-item>
              <el-input v-model="filter.name" placeholder="请输入查询名称" clearable>
                <el-button slot="append" icon="el-icon-search" @click="getAssignDataSet()" />
              </el-input>
            </el-form-item>
          </el-form>
          <!-- toDataSet(scope.row.name, scope.row.role_type, scope.row.uuid, scope.row.label_type) -->
          <el-table :data="dataSetAssigned" highlight-current-row style="width: 100%;" @sort-change="sortChange">
            <el-table-column prop="name" align="center" label="名称" min-width="200" :sortable="'custom'">
              <template slot-scope="scope">
                <span class="link-type" @click="toDataSet(scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="label_type" align="center" label="标注类型" min-width="120" :sortable="'custom'">
              <template slot-scope="scope">
                {{ scope.row.label_type | formatType }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="标注进度" min-width="260">
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
            <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :page-sizes="[1,5,10,20]" :total="total1" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { getAssignData } from '@/api/data'

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
      activeName: 'manager',
      filter: {
        name: ''
      },
      colorder: '',
      ordering: '',
      dataSetAssigned: [],
      page: 1,
      page_size: 20,
      total1: 0
    }
  },
  mounted() {
    this.getAssignDataSet()
  },
  methods: {
    // 排序
    sortChange(column) {
      console.log('排序', column.prop, column.order)
      this.colorder = column.prop
      if (column.order != null) {
        this.ordering = column.order
      }
      this.getAssignDataSet()
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
      this.getAssignDataSet()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getAssignDataSet()
    },
    // 展示数据
    toDataSet: function(val) {
      console.log('vallllllllllllllllllllllllllll', val)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('user/changeDataSet', val)
      console.log(store.getters.uuid)
      console.log(store.getters.type)
      console.log(store.getters.dataSet)
      if (val.role_type !== '标注员') {
        // this.$router.push({ path: '/dataSet/message', query: { dataName: val.name, key: this.activeName }})
        this.$router.push({ path: '/dataSet/message' })
      } else {
        console.log('898989')
        this.toStartLabel(val, val.label_type)
      }
    },
    // 开始标注
    toStartLabel: function(val, type) {
      console.log('wodedededed')
      console.log(val)
      console.log(val.labelType)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('user/changeDataSet', val)
      if (type === 0 || type === 3) {
        this.$router.push('/label/d2imageview')
        // this.$router.push({path: '/dataSet/2DauditPre'})
      }
      if (type === 1 || type === 4) {
        this.$router.push({ path: '/label/polygonimageview' })
        // this.$router.push({path: '/dataSet/2DauditPre'})
      }
      if (type === 2) {
        this.$router.push({ path: '/label/voice' })
      }
      // if(type === 3) {
      //   this.$router.push({path:'/label/voice'})
      // }
    },
    // 得到用户所分配到的数据集
    getAssignDataSet() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name,
        colorder: this.colorder,
        ordering: this.ordering
      }
      getAssignData(params).then(res => {
        this.dataSetAssigned = res.data.items
        this.total1 = res.data.total
      })
      this.filter.name = ''
    }

  }
}

</script>

<style lang="scss" scoped>
.app-container{
  padding: 10px 20px 50px 20px !important;
}
</style>
