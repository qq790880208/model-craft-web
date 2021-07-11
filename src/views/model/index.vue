<template>
  <div class="app-container">

    <!-- <form action="http://localhost:8082/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="multipartFile">
      <input type="file" name="multipartFile">
      <input type="submit" value="上传">
    </form> -->
    <el-button plain size="mini" type="primary" @click="createbtn">从训练作业导入</el-button>
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
                  <!-- <el-button size="mini" type="primary">在线预测</el-button> -->
                  <el-button size="mini" type="gray" @click="handleDownload(scope0.row.model_oss_path)">下载模型文件</el-button>
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
          <el-button size="mini" type="gray" @click="handleNewVersion(scope)">创建新版本</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope, scope.$index)">删除</el-button>
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
    <!-- 创建任务对话框 -->
    <el-dialog title="模型信息" :visible.sync="dialogFormVisible" :show-close="true" >
      <el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="100px" class="demo-taskForm" v-if="dialogFormVisible">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="taskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模型描述">
          <el-input type="textarea" v-model="taskForm.description"></el-input>
        </el-form-item>
        <el-form-item label="模型版本号">
          <el-input type="textarea" v-model="taskForm.version"></el-input>
        </el-form-item>
        <el-form-item label="选择训练" prop="model_path">
          <el-select v-model="taskForm.trainjob_index" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%;;">
                <el-option v-for="(item, index) in initialPara.trainjob_names" :key="index"
                :label="item" :value="index">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="模型文件" prop="model_path" >
          <el-select v-model="taskForm.trainjob_index" placeholder="请选择" style="width:100%">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%;">
                <el-option v-for="(item, index) in initialPara.trainjob_path" :key="index"
                :label="item" :value="index">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelbtn('taskForm')">取 消</el-button>
        <el-button type="primary" @click="create('taskForm')" >提交</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { getList, getListByName, delModelById, addModel } from '@/api/model'
import { getTableData2} from '@/api/predict'

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
      initialPara:{
          inputData:{
            name:[],
            uuid:[]
          },
          outpath:[],
          trainjob_names: [],
          trainjob_uuids: [],
          trainjob_path: []
        },//创建任务时从后台传入的数据源和输出路径
      //创建任务部分数据
        dialogFormVisible:false,//创建任务窗口
        taskForm: {//临时保存创建的任务信息
          user_id:'',
          name: '',
          algorithm: '',
          data:'',
          model_path:'',
          outpath:'',
          description: '',
          paras:[],
          uuid:'',
          version: '',
          oss_path: '',
          trainjob_index: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
          // model_path: [
          //   { required: true, message: '请选择模型路径', trigger: 'change' }
          // ],
          data: [
            { required: true, message: '请选择要预测的数据集', trigger: 'change' }
          ],
          outpath: [
            { required: true, message: '请选择输出位置', trigger: 'change' }
          ]
        }
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
    handleSubDelete(scope0, listIndex) {
      this.$confirm('是否删除该模型', '请确认', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
       delModelById(scope0.row.uuid).then(response => {
        //console.log(listIndex)
        this.sublist[listIndex].splice(scope0.$index, 1)
        this.$message('已删除')
      })
     }).catch(() => {
     })
    },handleDelete(scope, listIndex) {
      this.$confirm('是否删除该模型', '请确认', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
       delModelById(scope.row.uuid).then(response => {
        this.$message('已删除')
      })
      //this.$message('已删除' + scope.$index + '')
      //console.log(listIndex)
      this.list[listIndex].splice(scope.$index, 1)

     }).catch(() => {
     })
    },handleNewVersion(scope) {
      this.dialogFormVisible = true
        this.taskForm.uuid = this.generateUUID()
        this.taskForm.user_id = store.getters.userid
        this.taskForm.name = scope.row.name
        this.taskForm.algorithm = ''
        this.taskForm.description = scope.row.descr
        this.taskForm.version = scope.row.latest_ver
//         const params = {
//           'page': 1,
//           'pagesize': 100,
//           'id': store.getters.userid,
//           'name':''
//         }
//         getDataByName(params).then(res =>{//从后台读取数据来源的目录
//           //console.log(res)
//           this.initialPara.inputData.name = []
//           this.initialPara.inputData.uuid = []
//           for(let i = 0;i < res.data.total;i++){
//             this.initialPara.inputData.name.push(res.data.items[i].name)
//             this.initialPara.inputData.uuid.push(res.data.items[i].uuid)
//           }
//         })
        const params1 = {
          'curr': 1,
          'size': 100,
          'user_id': store.getters.userid,
          'tj_status': 2,
        }
        getTableData2(params1).then(res =>{
          console.log(res.data.items)
          this.initialPara.trainjob_names = []
          this.initialPara.trainjob_uuids = []
          this.initialPara.trainjob_path = []
          for(let i = 0;i < res.data.items.total;i++){

            this.initialPara.trainjob_names.push(res.data.items.records[i].name)
            this.initialPara.trainjob_uuids.push(res.data.items.records[i].uuid)
            this.initialPara.trainjob_path.push(res.data.items.records[i].model_oss_path)
          }
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
      createbtn(){//点击桌面的创建按钮
        this.dialogFormVisible = true
        this.taskForm.uuid = this.generateUUID()
        this.taskForm.user_id = store.getters.userid
        this.taskForm.name = 'model-' + this.taskForm.uuid.slice(0,4)
        this.taskForm.algorithm = ''
        this.taskForm.data = ''
        this.taskForm.outpath = ''
        this.taskForm.description = ''
        this.taskForm.paras = []
        this.taskForm.version = '0.0.1'
//         const params = {
//           'page': 1,
//           'pagesize': 100,
//           'id': store.getters.userid,
//           'name':''
//         }
//         getDataByName(params).then(res =>{//从后台读取数据来源的目录
//           //console.log(res)
//           this.initialPara.inputData.name = []
//           this.initialPara.inputData.uuid = []
//           for(let i = 0;i < res.data.total;i++){
//             this.initialPara.inputData.name.push(res.data.items[i].name)
//             this.initialPara.inputData.uuid.push(res.data.items[i].uuid)
//           }
//         })
        const params1 = {
          'curr': 1,
          'size': 100,
          'user_id': store.getters.userid,
          'tj_status': 2,
        }
        getTableData2(params1).then(res =>{
          console.log(res.data.items)
          this.initialPara.trainjob_names = []
          this.initialPara.trainjob_uuids = []
          this.initialPara.trainjob_path = []
          for(let i = 0;i < res.data.items.total;i++){
            this.initialPara.trainjob_names.push(res.data.items.records[i].name)
            this.initialPara.trainjob_uuids.push(res.data.items.records[i].uuid)
            this.initialPara.trainjob_path.push(res.data.items.records[i].model_oss_path)
          }
        })
        // getinitialPara().then(res =>{
        //   this.initialPara.outpath = res.data.outpath
        // })
        
      },
      generateUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
          d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        }).replace(/-/g, '');
        return uuid;
      },
      cancelbtn(taskForm){
        this.dialogFormVisible = false
        this.$refs[taskForm].resetFields()
      },
      //创建任务部分
      create(taskForm){//提交创建
        // this.$refs[taskForm].validate((valid) => {
        //   console.log("vaild",valid)
        //   if (valid) {
        //     alert('创建成功!');
        //     this.dialogFormVisible = false
        //   } else {
        //     console.log('创建失败!!');
        //     return callback();
        //   }
        // })


        const params0 = {
          'name': this.taskForm.name,
          'version': this.taskForm.version,
          'uuid': this.taskForm.uuid,
          'user_id': store.getters.userid,
          'tj_id': this.initialPara.trainjob_uuids[this.taskForm.trainjob_index],
          'model_oss_path': this.initialPara.trainjob_path[this.taskForm.trainjob_index],
          'descr': this.taskForm.description
        }
        console.log(params0)
        addModel(params0).then(res => {
          console.log(res.data)
          this.fetchData()
        })
        //==需要重新获取用户列表
        this.dialogFormVisible = false
        this.$refs[taskForm].resetFields()
      },
      cancelbtn(taskForm){
        this.dialogFormVisible = false
        this.$refs[taskForm].resetFields()
      },
      handleDownload(model_oss_path){
        window.open("http://124.70.81.35:9000/minio/modelcraft/" + model_oss_path, '_blank')
      }
  }
}
</script>
