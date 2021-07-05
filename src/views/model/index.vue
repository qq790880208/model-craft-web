<template>
  <div class="app-container">

    <!-- <form action="http://localhost:8082/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="multipartFile">
      <input type="file" name="multipartFile">
      <input type="submit" value="上传">
    </form> -->
    <el-button plain size="mini" type="primary" @click="onSubmit">从训练作业导入</el-button>
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
                  {{ scope0.row.version }}
                </template>
              </el-table-column>
              <el-table-column
                label="状态" width="100"> 
              </el-table-column>
              <!-- <el-table-column
                label="部署类型"  width="100">
                <template slot-scope="scope0"> 
                <span v-if="scope0.row.deploy_type == 0">在线部署</span>
                <span v-if="scope0.row.deploy_type == 1">边缘部署</span>
                </template>
              </el-table-column> -->
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
                label="描述"><template slot-scope="scope0"> {{ scope0.row.descr }}</template>
              </el-table-column>

              <!-- 子表格操作列 -->
              <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope0">
                  <el-button size="mini" type="primary">在线预测</el-button>
                  <el-button size="mini" type="gray">下载模型文件</el-button>
                  <el-button size="mini" type="danger" @click="handleSubDelete(scope0, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
                <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange0($event, scope.$index, scope.row)"
            @current-change="handleCurrentChange0($event, scope.$index, scope.row)"
            :current-page="queryInfo0[String(scope.$index)].pagenum"
            :page-sizes="[2,3,4,5,6,7,8,9,10]"
            :page-size="queryInfo0[String(scope.$index)].pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo0[String(scope.$index)].totalData">
          </el-pagination>
        </template>
      </el-table-column>
      <el-table-column label="模型名称" width="110" >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="最新版本" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.latest_ver }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="部署类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.deploy_type == 0">在线部署</span>
          <span v-if="scope.row.deploy_type == 1">边缘部署</span>
        </template> 
      </el-table-column>-->
      <el-table-column label="版本数量" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.ver_count }}
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
          {{ scope.row.descr }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="gray">创建新版本</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2,3,4, 10, 12, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.totalData">
    </el-pagination>
  </div>
  
</template>

<script>
import { getList, getListByName, delModelById } from '@/api/model'
import store from '@/store'

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
      sublistLoading: false,
      queryInfo:{//按照页数和也页面大小，定时请求后台渲染表格数据
          "user_id":store.getters.userid,
          "pagenum":1,
          "pagesize":10,
          "totalData" : 0
      },
      queryInfo0 : {},
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleExpendRow(row, expandedRows) {
      
      let index = this.list.findIndex(data => data.uuid == row.uuid).toString()
      if (!this.sublist[index]) {
        this.queryInfo0[index] = {}
        this.fetchSubData(index, row)
      }
    },
    fetchSubData(index, row) {
      let tmp = {
          "user_id": store.getters.userid,
          "name" : row.name,
          "curr": this.queryInfo0[index].hasOwnProperty("pagenum")?this.queryInfo0[index].pagenum:1,
          "size": this.queryInfo0[index].hasOwnProperty("pagesize")?this.queryInfo0[index].pagesize:10
        }
        this.sublistLoading = true
        getListByName(tmp).then(res => {
          this.queryInfo0[index] = {
            "pagenum":res.data.items.current,
            "pagesize":res.data.items.size,
            "totalData": res.data.items.total
            }
          this.sublist[index] = res.data.items.records
          this.sublistLoading = false
        })
    },
    fetchData() {
      let tmp = {
          "user_id": store.getters.userid,
          "curr": this.queryInfo.pagenum,
          "size": this.queryInfo.pagesize 
        }
      this.listLoading = true
      getList(tmp).then(res => {
        this.queryInfo.pagenum = res.data.items.current
        this.queryInfo.pagesize = res.data.items.size
        this.queryInfo.totalData = res.data.items.total
        this.list = res.data.items.records
        this.listLoading = false
      })
    },
    onSubmit() {
      this.$message('submit!')
    },
    handleSubDelete(scope0, listIndex) {
      this.$confirm('是否删除该模型', '请确认', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
       delModelById(scope0.row.uuid).then(response => {
        console.log(listIndex)
        this.sublist[listIndex].splice(scope0.$index, 1)
        this.$message('已删除')
      })
     }).catch(() => {
     })
    },handleDelete(scope) {
      this.$confirm('是否删除该模型', '请确认', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
       // delModelById(scope.row.uuid).then(response => {
      //   //this.$message('已删除')
      // })
      this.$message('已删除' + scope.$index + '')
      console.log(listIndex)
      this.sublist[listIndex].splice(scope.$index, 1)

     }).catch(() => {
     })
    },
     //分页的功能
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        //==重新发起数据请求
        this.fetchData()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //==重新发起数据请求
        this.fetchData()
      },
      //子分页的功能
      handleSizeChange0(newSize, index, row) {

        this.queryInfo0[index].pagesize = newSize
        //==重新发起数据请求
         this.fetchSubData(index, row)
      },
      handleCurrentChange0(newPage, index, row) {
        this.queryInfo0[index].pagenum = newPage
        //==重新发起数据请求
         this.fetchSubData(index, row)
      },
  }
}
</script>
