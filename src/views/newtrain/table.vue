<!--  -->
<template>
  <div class='training-jobs'>
    <!-- 头部 -->
    <el-row >
      <el-col :span="6">
        <el-button  @click="createbtn" size="medium" >  
          创建训练任务
        </el-button>
      </el-col>
      <el-col :span="3" :offset="9">
        <el-select v-model="selectedstatus" placeholder="请选择"
           @change="searchStatusTask">
          <el-option
            v-for="item in statusoptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input v-model="queryInfo.query" placeholder="请输入名称查询" style="width:75dx"
        :clearable="true" >
        </el-input>
      </el-col>
      <el-col :span="1" style="margin-left:5px">
        <el-button @click="searchTask">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column type="index" width="100" label="序号"></el-table-column>
      <el-table-column label="名称" width="120">
        <template slot-scope="scope">
          <span style="color:#5284DB">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="算法" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.train_algo_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span>{{ statusoptions[scope.row.status] }}</span>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="运行时长" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cost_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.descr}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="创建者" width="120">
        <template slot-scope="scope">
          <b>{{ scope.row.user_id }}</b>
        </template>
      </el-table-column>
      <el-table-column  label="进度" width="160">
        <template slot-scope="scope">
          <el-progress v-if="scope.row.status === 1" :text-inside="true" 
          :stroke-width="26" :percentage="70" status="success"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300"> 
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleStart(scope.$index, scope.row)">开始</el-button>
          <el-button
            size="mini"
            @click="handleStop(scope.$index, scope.row)">终止</el-button>
          <el-button
            size="mini"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            @click="handleShow(scope.$index, scope.row)">可视化</el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 12, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.total">
    </el-pagination>
    <!-- 可视化 -->
    <el-dialog :visible.sync="picVisible" title="当前训练">
      <div>
         <visualt :dData="drawData.first" id="2"></visualt>
         <visualf :Data="drawData.second" id="1"></visualf>
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
          <el-select v-model="taskForm.algorithm" placeholder="请选择" @change="currentAlgorithm = taskForm.algorithm">
            <div style="height:200px;" class="scrollbar">
              <el-scrollbar style="height:100%;">
               <el-option label="yolov3-tensorflow" value="0"></el-option>
               <el-option label="yolov3-pytorch" value="1"></el-option>
               <el-option label="deeplab-tensorflow" value="2"></el-option>
               <el-option label="deeplab-pytorch" value="3"></el-option>
               <el-option label="deepspeech-tensorflow" value="4"></el-option>
               <el-option label="deepspeech-pytorch" value="5"></el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源" prop="data">
          <el-select v-model="taskForm.data" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%;;">
                <el-option v-for="(item, index) in initialPara.inputData" :key="index"
                :label="item" :value="item">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="输出位置" prop="outpath">
          <el-select v-model="taskForm.outpath" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%;"> 
                <el-option v-for="(item, index) in initialPara.outpath" :key="index"
                :label="item" :value="item">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="参数选择">
          <el-form>
            <div style="height:150px; " class="scrollbar">
              <el-scrollbar style="height:100%; ">
                <el-form-item v-for="(item, index) in paraNameList[currentAlgorithm]" :key="index">
                  <el-input  autocomplete="off" style="width: 35%;" :value=item></el-input>
                  <b style="margin-left:15px;">=</b>
                  <el-input autocomplete="off" style="width: 35%; margin-left:15px;" v-model=paraValueList[currentAlgorithm][index]>
                  </el-input>
                </el-form-item>
              </el-scrollbar>
            </div>
          </el-form>
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
import visual from "./visual"
import visualf from "./visual1"
import visualt from "./visual2"
import {startTask, stopTask, getTableData1,deleteTask,  search, searchStatus, getVisualData, submitTask, getinitialPara} from '@/api/newTrain'
export default {
    components: {visual, visualf, visualt},
    data() {
      return {
        //主页面部分数据
        statusoptions:['初始化','运行中', '运行结束'],
        selectedstatus:'',//顶部选择的状态
        tableData:[],
        
        //可视化部分数据
        drawData:{
          first:{
            epoch:[],
            trainLoss:[],
            valLoss:[]
          },

          second:{
            epoch:[],
            valAccuaccy:[]
          }
        },
        picVisible:false,//可视化窗口
        //创建任务部分数据
        dialogFormVisible:false,//创建任务窗口
        taskForm: {//临时保存创建的任务信息
          name: '',
          algorithm: '',
          data:'',
          outpath:'',
          description: '',
          paras:[]
        },
        rules: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
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
        paraNameList:[//六个算法的参数名称
            ['epoch','batchsize','imgsize','epoch','batchsize','imgsize','epoch','batchsize','imgsize'],
            ['epoch','batchsize','imgsize'],
            ['epoch','batchsize','imgsize'],
            ['epoch','batchsize','imgsize'],
            ['epoch','batchsize'],
            ['epoch','batchsize'],
          ],
        paraValueList:[//六个算法的参数数值
            ['2','5','640','2','5','640','2','5','640'],
            ['2','5','640'],
            ['2','5','640'],
            ['2','5','640'],
            ['2','5'],
            ['2','5'],
        ],
        initialPara:{
          inputData:[],
          outpath:[]
        },//创建任务时从后台传入的数据源和输出路径
        currentAlgorithm:0,//创建任务时目前选中的代码


        //和后台交互传递的各种参数
        selectPara:{//顶部下拉框传递的参数
          'para':''
        },
        inputPara:{//顶部文本框传递的参数
          'para':''
        },
        taskPara:{//创建任务向后台提交的任务信息
          'para':null
        },
        queryInfo:{//按照页数和也页面大小，定时请求后台渲染表格数据
          query:10,
          pagenum:1,
          pagesize:10,
          total:0
        },
        startPara:{
          'index':0
        },
        stopPara:{
          'index':0
        },
        deletePara:{
          'index':0
        },
        visualPara:{
          'index':0
        },
        tablePara:{//读取后台表格传递的参数
          "user_id":10
        }, 
        JsPara:{
          'index':0
        },
        
        timer: null//定时器

      }
    },

    methods: {
      //主页面部分
      searchTask(){//输入框查询
        search(this.searchinput).then(res=>{
          console.log(res.data)
        })
        //==重新获取表格数据
        
      },
      searchStatusTask(){//下拉框排序查询
        searchStatus(this.selectedstatus).then(res =>{
          console.log(res.data)
        })
      },
      createbtn:function(){//点击桌面的创建按钮
        this.dialogFormVisible = true
        getinitialPara().then(res =>{
          this.initialPara.inputData = res.data.inputData
          this.initialPara.outpath = res.data.outpath
        })
        this.taskForm = {
          name: '',
          algorithm: '',
          data:'',
          outpath:'',
          description: '',
          paras:[]
        }
      }, 
      handleStart(index, row) {//开始某行训练
        this.startPara.para = index
        startTask(this.startPara).then(res=>{
          console.log(res)
        })
        //==重新获取表格数据
      },
      handleDelete(index, row) {//删除某行
        this.deletePara.index = index
        deleteTask(this.deletePara).then(res=>{
          console.log(res)
        })
        //==重新获取表格数据
      },
      handleStop(index, row) {//终止某行训练
        this.stopPara.index = index
        stopTask(this.stopPara).then(res=>{
          console.log(res)
        })
        //==重新获取表格数据
      },
      handleShow(index, row) {//可视化某行 
        this.picVisible = true
        this.visualPara.index = index
        getVisualData(this.visualPara).then(res =>{
          console.log(res)
          this.drawData.first.epoch = res.data.epoch
          this.drawData.second.epoch = res.data.epoch
          this.drawData.first.trainLoss = res.data.trainLoss
          this.drawData.first.valLoss = res.data.valLoss
          this.drawData.second.valAccuaccy = res.data.valAccuaccy
          // this.drawData.train.epoch = res.data.epoch
          // this.drawData.val.epoch = res.data.epoch
          // this.drawData.train.data = res.data.trainLoss
          // this.drawData.val.data1 = res.data.valLoss
          // this.drawData.val.data2 = res.data.valAccuaccy
        })
      },
      formatDate(nows) {//转化时间
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
        }
        else if (minute.toString().length < 2) {
          minute = '0' + minute
        }
        if (second == null) {
          second = '00'
        }
        else if (second.toString().length < 2) {
          second = '0' + second
        }
        return ' ' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      },
      fetchData(){//从后台拉取列表数据
        getTableData1(this.tablePara).then(res => { 
          console.log(res)
          for(let i = 0;i < res.data.items.length;i++){
            let obj = {}
            obj.name = res.data.items[i].name
            obj.train_algo_name = res.data.items[i].train_algo_name
            //obj.status = res.data.items[i].status
            obj.status = i
            obj.cost_time = res.data.items[i].cost_time
            obj.create_time = this.formatDate(res.data.items[i].create_time) 
            obj.descr = res.data.items[i].descr
            obj.user_id = res.data.items[i].user_id
            this.tableData.push(obj)
          }
        })
      },


      //创建任务部分
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
        this.taskForm.paras.push(this.paraNameList[this.taskForm.algorithm])
        this.taskForm.paras.push(this.paraValueList[this.taskForm.algorithm])
        this.taskPara.para = this.taskForm
        submitTask(this.taskPara).then(res => {
          console.log(res.data)
        })
        //==需要重新获取用户列表
        
      },
      cancelbtn(taskForm){
        this.dialogFormVisible = false
        this.$refs[taskForm].resetFields()
      },
     
       
      //分页的功能
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        //==重新发起数据请求
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //==重新发起数据请求
      },
      
      setTimer() {//定时器
        if(this.timer == null) {
          this.timer = setInterval( () => {
              console.log('开始定时...每过一秒执行一次')
              //]this.fetchData()
          }, 1000)
        }
      }

    },
    
    mounted() {
      this.fetchData()
      clearInterval(this.timer)
      this.timer = null
      //this.setTimer()
    }
}

</script>

<style lang='scss' scoped>

  .el-row {
    margin-top:30px;
  }
  .training-jobs{
    margin-left:30px;
    
  }
  .el-table{
    font-size: 12px;
    width: 100%; 
    margin-top:25px
  }

  .el-pagination{
    margin-top:25px
  }
</style>