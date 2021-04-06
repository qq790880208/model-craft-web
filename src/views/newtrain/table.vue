<!--  -->
<template>
  <div class='training-jobs' style="margin-top:30px; margin-left:40px">
    <!-- 头部 -->
    <el-row style="margin-top:30px;">
      <el-button  @click="createbtn" style="font-size:30px;">  
        创建训练任务
      </el-button>
      <el-select v-model="selectedstatus" placeholder="请选择"
      style="position:relative;right:-1000px;" @change="searchStatusTask">
        <el-option
          v-for="item in statusoptions"
          :key="item.value"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-input v-model="searchinput" placeholder="请输入名称查询"
      style="width:200px; position:relative;right:-1100px;"
      @keyup.enter.native='searchTask'>
      </el-input>
    </el-row>
    
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%; margin-top:25px">
      <el-table-column label="名称" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.task }}</span>
        </template>
      </el-table-column>
      <el-table-column label="引擎类型" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.algorithm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本数量" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行时长" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="创建者" width="180">
        <template slot-scope="scope">
          <b>{{ scope.row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleStart(scope.$index, scope.row)">开始</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleStop(scope.$index, scope.row)">暂停</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleShow(scope.$index, scope.row)">可视化</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页脚 -->
    <el-pagination
    layout="prev, pager, next"
    :total="50" style="margin-top:25px">
    </el-pagination>

    <!-- 可视化 -->
    <el-dialog :visible.sync="picVisible" title="当前训练">
      <div>
         <visual :lineData="lineData" id="1" ></visual>
         <visual :lineData="lineData1" id="2"></visual>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="picVisible = false" >终止训练</el-button>
      </div>
    </el-dialog>

    <!-- 创建任务对话框 -->
    <el-dialog title="任务信息" :visible.sync="dialogFormVisible">
      <el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="100px" class="demo-taskForm">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="taskForm.description"></el-input>
        </el-form-item>
        <el-form-item label="算法来源" prop="algorithm">
          <el-select v-model="taskForm.algorithm" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-option v-for="(item, index) in taskForm.algorithm" 
                :key="index" @click.native.prevent="currentAlgorithm = index"
                :label="item" :value="item">
                 </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源" prop="data">
          <el-select v-model="taskForm.data" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-option v-for="(item, index) in taskForm.data" :key="index"
                :label="item" :value="item">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="输出位置" prop="outpath">
          <el-select v-model="taskForm.outpath" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-option v-for="(item, index) in taskForm.outpath" :key="index"
                :label="item" :value="item">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="参数选择">
          <el-form>
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-form-item >
                  <el-input  autocomplete="off" style="width: 35%;"></el-input>
                  <b style="margin-left:15px;">=</b>
                  <el-input autocomplete="off" style="width: 35%; margin-left:15px;" >
                  </el-input>
                </el-form-item>
              </el-scrollbar>
            </div>
          </el-form>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type='warning' @click="resetForm('taskForm')">重置</el-button>
        <el-button type="primary" @click="create('taskForm')" >提交</el-button>
      </div>
  </el-dialog>
  </div>
 
</template>

<script>
import visual from "./visual"
import {startTask, stopTask, deleteTask, getTableData, search, searchStatus, getVisualData} from '@/api/newTrain'
export default {
    components: {visual},
    data() {
      return {
        statusoptions:[
          {
            name: '全部状态',
            value: '0',
          },
          {
            name: '初始化',
            value: '1',
          },
          {
            name: '提供失败',
            value: '2',
          },
          {
            name: '排队中',
            value: '3',
          },
          {
            name: '运行中',
            value: '4',
          },
          {
            name: '停止中',
            value: '5',
          },
          {
            name: '运行成功',
            value: '6',
          },
          {
            name: '运行失败',
            value: '7',
          }
        ],
        selectedstatus:'',//顶部选择的状态
        searchinput:'',//顶部选择的名称
        tableData:[],
        picVisible:false,//可视化窗口
        lineData:{//可视化的数据
            title:'训练集',
            series: 
              {
                name: 'train-loss',
                data: [],
                type: 'line',
                color:'	#F08080'
              },
            epoch:[]
        },
        lineData1:{//可视化的数据
            title:'测试集',
            series: [
              {
                name: 'val-loss',
                data: [],
                type: 'line',
                color:'#00FF00'
              },
              {
                name: 'val-accuracy',
                data: [],
                type: 'line',
                color:'#FFD700'
              }
            ],
            epoch:[]
        },
        dialogFormVisible:false,//创建任务窗口
        taskForm: {
          name: '',
          algorithm: '',
          data:'',
          outpath:'',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          algorithm: [
            { required: true, message: '请选择算法', trigger: 'change' }
          ],
          data: [
            { required: true, message: '请选择数据', trigger: 'change' }
          ],
          outpath: [
            { required: true, message: '请选择输出位置', trigger: 'change' }
          ]
        },
        currentAlgorithm:0
      }
      
    },

    computed: {},

    watch: {},
 
    methods: {
      createbtn:function(){//桌面的创建按钮
        // console.log('this is createbtn')
        // console.log(this.selectedstatus)
        this.dialogFormVisible = true
      }, 
      handleStart(index, row) {//开始某行训练
        startTask(index).then(res=>{
          console.log(res)
        })
      },
      handleDelete(index, row) {//删除某行
        deleteTask(index).then(res=>{
          console.log(res.data)
        })
      },
      handleStop(index, row) {//终止某行训练
        stopTask(index).then(res=>{
          console.log(res.data)
        })
      },
      handleShow(index, row) {//可视化某行
        this.picVisible = true
        getVisualData(index).then(res =>{
          this.lineData.epoch = res.data.epoch
          this.lineData1.epoch = res.data.epoch
          this.lineData.series.data = res.data.trainLoss
          this.lineData1.series[0].data = res.data.valLoss
          this.lineData1.series[1].data = res.data.valAccuaccy
        })
      },
      create(taskForm){//提交创建
        this.$refs[taskForm].validate((valid) => {
          if (valid) {
            alert('创建成功!');
            this.dialogFormVisible = false
          } else {
            console.log('创建失败!!');
            return false;
          }
        })
      },
      resetForm(taskForm){//创建时重置
        this.$refs[taskForm].resetFields();

      },
      searchTask(){//输入框查询
        search(this.searchinput).then(res=>{
          console.log(res.data)
        })
      },
      searchStatusTask(){//下拉框排序查询
        searchStatus(this.selectedstatus).then(res =>{
          console.log(res.data)
        })
      }
    },

    mounted() {
        getTableData().then(res => { 
          console.log(res)
          this.tableData = res.data
        }) 
    }
}
</script>

<style lang='scss' scoped>


</style>