<template>
  <div class="dashboard-container">
    <el-tabs :tab-position="tabPosition" style="height: 200px;">
      <el-tab-pane label="全部数据">
        <el-form :inline="true" :model="filter" >
        <el-button style="text-align: left" min type="primary">
          创建数据集
        </el-button>
        <el-form-item class="find">
          <el-input v-model="filter.name" placeholder="请输入查询名称" >
            <el-button slot="append" icon="el-icon-search" @click="getDataSet()"></el-button>
          </el-input>
        </el-form-item>
        <el-button type="danger" @click="toDataSet()">
          开始标注
        </el-button>
        </el-form>
        <el-table :data="dataSets" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.type)">{{ scope.row.name }}</span>
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
          <el-tab-pane label="管理数据">
          <el-table :data="dataSetByManager" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.type)">{{ scope.row.name }}</span>
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
    </el-tabs>
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 10px; margin: right"> 
      <el-form :inline="true" :model="filter" >
        <el-button style="text-align: left" min type="primary">
          创建数据集
        </el-button>
        <el-form-item class="find">
          <el-input v-model="filter.name" placeholder="请输入查询名称" >
            <el-button slot="append" icon="el-icon-search" @click="getDataSet()"></el-button>
          </el-input>
        </el-form-item>
        <el-button type="danger" @click="toDataSet()">
          开始标注
        </el-button>
      </el-form>
    </el-col> -->
    
    <!-- <el-col>
      <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <el-tab-pane label="全部数据">
        </el-tab-pane>
      </el-tabs>
    </el-col> -->
    <!-- <el-table :data="dataSets" highlight-current-row style="width: 100%;">
      <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
        <template slot-scope="scope">
          <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.type)">{{ scope.row.name }}</span>
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

    <el-table :data="dataSetByManager" highlight-current-row style="width: 100%;">
      <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
        <template slot-scope="scope">
          <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.type)">{{ scope.row.name }}</span>
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


    <el-table :data="dataSetByTeam" highlight-current-row style="width: 100%;">
      <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
        <template slot-scope="scope">
          <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.type)">{{ scope.row.name }}</span>
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
    </el-col> -->

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
      message: '',
      filter: {
        name: ''
      },
      dataSets: [],
      dataSetByTeam: [],
      dataSetByManager: [],
      total: 0,
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
      this.getDataSet()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getDataSet()
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
    },
    getDataSetByTeam: function() {
      const params = {
        id: store.getters.userid
      }
      console.log("ddddddddddd" + params)
      getDataByTeam(params).then(res => {
        this.dataSetByTeam = res.data.items
      })
      getDataByManager(params).then(res => {
        this.dataSetByManager = res.data.items
      })
    },
    toDataSet: function(val, uuuid, ttype) {
      store.dispatch('data/changeUuid', uuuid),
      store.dispatch('data/changeType', ttype),
      console.log(store.getters.uuid)
      this.$router.push({path:'/dataSet/userLabel', query: {dataName: val}})
    }   
  },
  mounted() {
    this.getDataSet(),
    this.getDataSetByTeam()
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
.find {
  position: right;
}
</style>
