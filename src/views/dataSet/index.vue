<template>
  <div class="dashboard-container">
    <el-tabs :tab-position="tabPosition" style="height: 200px;" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部数据" name="allData">
        <el-form :inline="true" :model="filter" >
          <el-button style="text-align: left" min type="primary">
            创建数据集
          </el-button>
          <el-form-item >
            <el-input v-model="filter.name" placeholder="请输入查询名称" >
              <el-button slot="append" icon="el-icon-search" @click="getDataSet()"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="dataSets" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.label_type)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="标注类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="标注进度" min-width="260" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" :format="format">
                </el-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>  
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="管理数据" name="manager">
        <el-form :inline="true" :model="filter" >
          <el-form-item>
            <el-input v-model="filter.name" placeholder="请输入查询名称" >
              <el-button slot="append" icon="el-icon-search" @click="getDataSetByManager()"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="dataSetByManager" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.label_type)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="标注类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="标注进度" min-width="260" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" :format="format">
                </el-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total1" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="标注数据" name="label">
        <el-form :inline="true" :model="filter" >
          <el-form-item class="find">
            <el-input v-model="filter.name" placeholder="请输入查询名称" >
              <el-button slot="append" icon="el-icon-search" @click="getDataSetByTeam()"></el-button>
            </el-input>
          </el-form-item> 
        </el-form>
        <el-table :data="dataSetByTeam" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toStartLabel(scope.row.uuid, scope.row.label_type)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="标注类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="标注进度" min-width="260" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" :format="format">
                  </el-progress>
                </div>
              </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total2" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabel, getDataByName, getDataByTeam, getDataByManager } from '@/api/data'
import store from '@/store'

export default {
  namespaced: true,
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
    },
    formatType(num) {
      if (num = 0) {
        return '拉框标注';
      }
      if (num = 1) {
        return '多边形标注';
      }
      if (num = 2) {
        return '语音标注';
      }
      if (num = 3) {
        return '3D标注';
      }
    }
  },
  data() {
    return {
      activeName: 'allData',
      message: '',
      filter: {
        name: ''
      },
      dataSets: [],
      dataSetByTeam: [],
      dataSetByManager: [],
      total: 0,
      total1: 0,
      total2: 0,
      page: 1,
      page_size: 20,
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.name)
      this.activeName = tab.name
    },
    setItemProgress(speed, tol) {
      if(speed == 0) {
        return 0
      }
      if(speed > tol) {
        return 100
      } else {
        return parseInt((speed/tol).toFixed(1) * 100)
      }
    },
    handleSizeChange(val) {
      this.page_size = val
      if (this.activeName == 'allData') {
        this.getDataSet()
      }
      if (this.activeName == 'manager') {
        this.getDataSetByManager()
      }
      if (this.activeName == 'label') {
        this.getDataSetByTeam()
      }    
    },
    handleCurrentChange(val) {
      this.page = val
      if (this.activeName == 'allData') {
        this.getDataSet()
      }
      if (this.activeName == 'manager') {
        this.getDataSetByManager()
      }
      if (this.activeName == 'label') {
        this.getDataSetByTeam()
      }
    },
    getDataSet: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name
      }
      console.log("dadadadadad" + params)
      getDataByName(params).then(res => {
        this.dataSets = res.data.items
        this.total = res.data.total
      })
      this.filter.name = ''
    },
    getDataSetByTeam: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name
      }
      console.log("ddddddddddd" + params)
      getDataByTeam(params).then(res => {
        this.dataSetByTeam = res.data.items
        this.total2 = res.data.total
      })
      this.filter.name = ''
    },
    getDataSetByManager: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name
      }
      getDataByManager(params).then(res => {
        this.dataSetByManager = res.data.items
        this.total1 = res.data.total
      })
      this.filter.name = ''
    },
    toDataSet: function(val, uuuid, ttype) {
      console.log(ttype)
      store.dispatch('data/changeUuid', uuuid)
      store.dispatch('data/changeType', ttype)
      console.log(store.getters.uuid)
      this.$router.push({path:'/dataSet/userLabel', query: {dataName: val, key: this.activeName}})
    },
    toStartLabel: function(uuuid, ttype) {
      store.dispatch('data/changeUuid', uuuid)
      store.dispatch('data/changeType', ttype)
      if(ttype == 0) {
        this.$router.push('/label/d2imageview')
      }
      if(ttype == 1) {
        this.$router.push({path:'/label/polygonimageview'})
      }
      if(ttype == 2) {
        this.$router.push({path:'/label/d3'})
      }
      if(ttype == 3) {
        this.$router.push({path:'/label/voice'})
      }
    }  
  },
  mounted() {
    this.getDataSet(),
    this.getDataSetByTeam(),
    this.getDataSetByManager()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
