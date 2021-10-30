<!--  -->
<template>
  <div class='training-jobs'>
    <!-- 头部 -->
    <el-row >
      <el-col :span="5">
        <el-button  @click="createbtn" size="medium" >  
          创建训练任务
        </el-button>
      </el-col>
      <el-col :span="3" :offset="9">
        <el-select v-model="selectedstatus" placeholder="请选择"
           @change="searchStatusTask">
           <el-option label="全部状态" value="5"></el-option>
           <el-option label="未开始" value="0"></el-option>
           <!-- <el-option label="初始化" value="1"></el-option> -->
           <el-option label="运行中" value="1"></el-option>
           <el-option label="结束成功" value="2"></el-option>
           <el-option label="结束失败" value="3"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input v-model="queryInfo.query" placeholder="请输入名称查询" style="width:75dx"
        :clearable="true" @change="resetSearch">
        </el-input>
      </el-col>
      <el-col :span="1" style="margin-left:5px">
        <el-button @click="searchTask">搜索</el-button>
      </el-col>
      <el-col :span="1" style="margin-left:5px">
        <el-button @click="resetSearch">重置</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="名称" width="120">
        <template slot-scope="scope">
          <span style="color:#5284DB">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
       <el-table-column label="训练数据集" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.dataset_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="算法" width="160">
        <template slot-scope="scope">
          <span>{{ algorithmArray[scope.row.algo_id]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span>{{ statusoptions[scope.row.status] }}</span>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="运行时长" width="120">
        
        <template slot-scope="scope" >
          <span  v-if="scope.row.cost_time != 0">{{ scope.row.cost_time }} 秒</span>
          <span v-if="scope.row.cost_time == 0">-</span>
        </template>
          
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.descr}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  label="创建者" width="120">
        <template slot-scope="scope">
          <b>{{ scope.row.user_id }}</b>
        </template>
      </el-table-column> -->
      <!-- <el-table-column  label="进度" width="250">
        <template slot-scope="scope">
          <el-progress v-if="scope.row.status === 0" :text-inside="true" 
          :stroke-width="26" :percentage="Mockprocess" status="success"></el-progress>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="400"> 
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleStart(scope.$index, scope.row)">开始</el-button>
          <el-button
            size="mini"
            @click="handleStop(scope.$index, scope.row)">终止</el-button>
          <el-button
            size="mini"
            @click="handleShow()">可视化</el-button> -->
          <el-button
            size="mini" v-if="scope.row.status!=0"
            @click="handleShowlog(scope.$index, scope)" >日志</el-button>
          <el-button
            size="mini" v-if="scope.row.status==0"
            @click="handleShowlog(scope.$index, scope)"  disabled>日志</el-button>
            <el-button
            size="mini" type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      :total="totalData">
    </el-pagination>
    <!-- 可视化 -->
    <el-dialog :visible.sync="picVisible" title="当前训练" :show-close="false">
      <div>
         <visualt :dData="drawData.first" id="2"></visualt>
         <visualf :Data="drawData.second" id="1"></visualf>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleStop()" >终止训练</el-button>
      </div>
    </el-dialog>
    <!-- 日志可视化 -->
    <el-dialog
      title="训练日志"
      @close="closeShowLog"
      :visible.sync="logdialogVisible"
      :show-close="false">
      <el-input
        type="textarea"
        id="textarea_id"
        :disabled="true"
        :autosize="{ minRows: 20, maxRows: 20}"
        placeholder="获取中......"
        v-model="logText">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeShowLog()">取 消</el-button>
        <el-button type="primary" @click="closeShowLog()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建任务对话框 -->
    <el-dialog title="任务信息" :visible.sync="dialogFormVisible" :show-close="true" >
      <el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="100px" class="demo-taskForm" v-if="dialogFormVisible" >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name"></el-input>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="taskForm.description"></el-input>
        </el-form-item>
        <el-form-item label="数据集选择" prop="dataset_index">
          <el-select v-model="taskForm.dataset_index" placeholder="请选择" @change="pathChange(taskForm.dataset_index)">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%;;">
                <el-option v-for="(item, index) in initialPara.inputData.name" :key="index"
                :label="item" :value="index">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="训练算法" prop="data">
                <el-input v-model="algorithmArray[this.useAlgorithm]" :disabled="true" placeholder="none">
                </el-input>
                          <!-- <el-select v-model="taskForm.algorithm" placeholder="请选择" @change="cachange(taskForm.algorithm)">
            <div style="height:200px;" class="scrollbar">
              <el-scrollbar style="height:100%;">
               <el-option v-for="(item, index) in algorithmArray" :key="index"
                :label="item" :value="index">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select> -->
        </el-form-item>

        <el-form-item label="数据集图片位置" prop="data">
                <el-input v-model="imageOssPath" :disabled="true">
                </el-input>
        </el-form-item>
        <el-form-item label="数据集标注结果位置" prop="data">
                <el-input v-model="textOssPath" :disabled="true">
                </el-input>
        </el-form-item>
        <el-form-item label="模型生成位置" prop="data">
                <el-input v-model="modelOssPath" :disabled="true">
                </el-input>
        </el-form-item>


        <!-- <el-form-item label="输出位置" prop="outpath">
          <el-select v-model="taskForm.outpath" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%;"> 
                <el-option v-for="(item, index) in initialPara.outpath" :key="index"
                :label="item" :value="item">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item> -->
        <el-form-item label="参数选择" >
          <el-form>
            <el-form-item >
                <el-select v-model="value" clearable placeholder="根据任务名称选取参数" @change="search">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item >      
            
              <div style="height:150px; " class="scrollbar">
              <!-- <el-scrollbar style="height:100%; "> 
                <el-form-item v-for="(item, index) in paraNameList[currentAlgorithm]" :key="index">
                  <p sty autocomplete="off" style="width: 15%;display: inline-block" >{{item}}</p>
                  <b style="margin-left:15px;">=</b>
                  <el-input autocomplete="off" style="width: 35%; margin-left:15px;"  v-model=paraValueList[currentAlgorithm][index]>
                  </el-input>
                </el-form-item>
                <div v-if="isdisplaytl">
                  <p sty autocomplete="off" style="width: 15%;display: inline-block" >transferLearning</p>
                  <b style="margin-left:15px;" >=</b>
                  <el-select v-model="transferLearningValue" placeholder="请选择" style="width: 35%; margin-left:15px;" >
                    <div style="height:150px;" class="scrollbar" >
                      <el-scrollbar style="height:100%;">
                        <el-option v-for="(item, index) in transferLearningList" :key="index"
                        :label="item" :value="item">
                        </el-option>
                      </el-scrollbar>
                    </div>
                  </el-select>
                </div>
              </el-scrollbar> -->
                <el-form-item  v-for="(item, index) in list_model_para" :key="index">
                    <el-col :span="5">
                        <el-input v-model="item[0]"></el-input>
                    </el-col>
                    <el-col :span="2" style="text-align:center;"> = </el-col>
                    <el-col :span="5">
                        <el-input v-model="item[1]"></el-input>
                    </el-col>
                    <el-col :span="5" style="text-align:center;"> 
                        <el-button icon="el-icon-plus" circle @click="addpara" size="small"></el-button>
                        <el-button icon="el-icon-minus" circle @click="deletepara(index)" size="small"></el-button>
                    </el-col>
                </el-form-item>

              </div>
            </el-form-item>
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
import {startTask, showLog,getAcceptData,stopTask, getTableData1,deleteTask,  search, searchStatus, getVisualData, submitTask, getinitialPara} from '@/api/newTrain'
import store from '@/store'

function keyDownSearch(e){
  console.log("keydown!!!!!!!!!!!!")
  let theEvent = e.event || window.event;
  let code = theEvent.keyCode ||  theEvent.which || theEvent.charCode
  if(code == 13){ //保存并上一张
    console.log("enter!!!!!!!!!!!!!")
    searchTask()
    //return false;     
  }
}

export default {
    components: {visual, visualf, visualt},
    data() {
      return {
        all_list_model_para:
                [
                    ['epoch', 100], 
                    ['size', 512], 
                    ['learning_rate', 0.01]
                ],
                    
                list_model_para:
                [
                    ['epoch', 100],
                    ['size', 512], 
                    ['learning_rate', 0.01]
                ],
                options:
                [
                    {
                        value: 'Option1',
                        label: 'Option1',
                    },
                    {
                        value: 'Option2',
                        label: 'Option2',
                    },
                    {
                        value: 'Option3',
                        label: 'Option3',
                    },
                    {
                        value: 'Option4',
                        label: 'Option4',
                    },
                    {
                        value: 'Option5',
                        label: 'Option5',
                    }
                ],
                value:'',













        //2021/07/08新增数据
        imageOssPath:"none",
        textOssPath:"none",
        modelOssPath:"none",
        useAlgorithm:-1,
        //主页面部分数据
        statusoptions:['未开始','运行中', '结束成功', '结束失败'],
        selectedstatus:'5',//顶部选择的状态
        tableData:[],
        //currentAlgorithm = taskForm.algorithm">
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
        logdialogVisible:false,//日志可视化窗口
        logText:'',//日志内容
        //创建任务部分数据
        dialogFormVisible:false,//创建任务窗口
        taskForm: {//临时保存创建的任务信息
          user_id:'',
          name: '',
          algorithm: '',
          data:'',
          outpath:'',
          description: '',
          paras:[],
          uuid:'',
          dataset_index : ''
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
        algorithmArray:[//算法名称
          "Yolov3-TensorFlow",
          "DeepLab-TensorFlow",
          "voice",
          "Yolov3-Pytorch",
        ],
        paraNameList:[//算法的参数名称
            ['epoch','batchsize'],
            ['epoch','batchsize'],
            [],
            ['epoch','batchsize'],
            ['epoch','batchsize']
          ],
        paraValueList:[//算法的参数数值
            ['100','2'],
            ['100','2'],
            [],
            ['100','2'],
            ['100','2']
        ],
        transferLearningList:[//transferLearning参数
          "none",
          "darknet",
          "no_output",
          "fine_tune",
          "frozen",
        ],
        transferLearningValue:"none",
        initialPara:{
          inputData:{
            name:[],
            uuid:[],
            algorithmType:[]
          },
          outpath:[],
        },//创建任务时从后台传入的数据源和输出路径
        currentAlgorithm:0,//创建任务时目前选中的代码
        isdisplaytl:false,

        //和后台交互传递的各种参数
        selectPara:{//顶部下拉框传递的参数
          'para':this.selectedstatus
        },
        // inputPara:{//顶部文本框传递的参数
        //   'para':''
        // },
        taskPara:{//创建任务向后台提交的任务信息
          "algo_id": 0,
          "args": "string",
          "cost_time": "0",
          "dataset_id": "string",
          "dataset_name": "string",
          "dataset_label_type": "number",
          "descr": "string",
          "name": "string",
          "status": "0",
          "user_id": 0,
          "uuid": "string"
        },
        queryInfo:{//按照页数和也页面大小，定时请求后台渲染表格数据
          "user_id":store.getters.userid,
          "pagenum":1,
          "pagesize":10,
          "query":""
        },
        commonPara:{//三个按钮给后台传递的参数
          'trainjob_id':0
        },
        showPara:{
          'trainjob_id': 0
        },
        timer: null,//定时器
        timerLog:null,//日志定时器
        totalData:0,//主界面显示数据库任务总数
        Mockprocess:0, //模拟进度条
        isSearchingFlag:false//是否处于搜索状态的标记
      }
    },

    methods: {
      pathChange(index){
        let data = this.initialPara.inputData.uuid[this.taskForm.dataset_index];
        this.taskForm.data = data
        console.log("data",data)
        this.imageOssPath = "data/dataset/"+data+"/input/source/"
        this.textOssPath =  "data/dataset/"+data+"/input/annotation/"
        this.modelOssPath = "data/dataset/"+data+"/output/ckpt/"
        this.useAlgorithm = this.initialPara.inputData.algorithmType[index]
        // this.initialPara.inputData.uuid.forEach((item,index) => {
        //   //console.log("item",item,"index",index)
        //   if(data==item) this.useAlgorithm = this.initialPara.inputData.algorithmType[data];
        // })
        this.cachange(this.useAlgorithm)
      },
      cachange(testdata){
        console.log("testdata",testdata)
        this.currentAlgorithm=testdata;
        if(testdata==0) this.isdisplaytl=true;
        else this.isdisplaytl=false;
      },
      clearForm(){
        this.isdisplaytl=false;
        this.$refs['taskForm'].resetFields()
      },
      resetSearch(){
        this.fetchData()
        this.isSearchingFlag=false;
      },
      //主页面部分
      searchTask(){//输入框查询
      //console.log("312321321321321")
      if(this.queryInfo.query=="") {
        this.isSearchingFlag=false;
        return
      }
      this.isSearchingFlag=true;
      let tmp = {
          "user_id": store.getters.userid,
          "curr": this.queryInfo.pagenum,
          "size": this.queryInfo.pagesize,
          "tj_name": this.queryInfo.query
        }
        search(tmp).then(res=>{
          console.log(res.data)
          this.queryInfo.pagenum = res.data.items.current
          this.queryInfo.pagesize = res.data.items.size
          this.totalData = res.data.items.total
          this.tableData = res.data.items.records
          // this.tableData = []
          // for(let i = 0;i < res.data.items.records.length;i++){
          //   let obj = {}
          //   obj.name = res.data.items.records[i].name
          //   obj.train_algo_name = res.data.items.records[i].train_algo_name
          //   //obj.status = res.data.items[i].status
          //   obj.status = res.data.items.records[i].status
          //   obj.cost_time = res.data.items.records[i].cost_time
          //   obj.create_time = this.formatDate(res.data.items.records[i].create_time) 
          //   obj.descr = res.data.items.records[i].descr
          //   obj.userId = res.data.items.records[i].user_id
          //   this.tableData.push(obj)
          // }
        })
        //==重新获取表格数据
        
      },
      searchStatusTask(){//下拉框排序查询
        this.selectPara.para = this.selectedstatus
        if (this.selectedstatus == 5) this.resetSearch()
        else {
        this.isSearchingFlag=true;
        let tmp = {
          "user_id": store.getters.userid,
          "curr": this.queryInfo.pagenum,
          "size": this.queryInfo.pagesize,
          "tj_status": this.selectPara.para
        }
        search(tmp).then(res=>{
          console.log("search",res.data)
          this.queryInfo.pagenum = res.data.items.current
          this.queryInfo.pagesize = res.data.items.size
          this.totalData = res.data.items.total
          this.tableData = res.data.items.records
        })
        }
      },
      createbtn:function(){//点击桌面的创建按钮
        this.dialogFormVisible = true
        this.taskForm.uuid = this.generateUUID()
        this.taskForm.user_id = store.getters.userid
        this.taskForm.name = 'train-' + this.taskForm.uuid.slice(0,4)
        //this.taskForm.label_type=''
        this.useAlgorithm = ''
        this.taskForm.data = ''
        this.taskForm.outpath = ''
        this.taskForm.description = ''
        this.taskForm.paras = []
        console.log(" store.getters", store.getters)
        console.log(" taskForm",this.taskForm)
        const params = {
          id: store.getters.userid,
      }
      console.log("preprepreprepreprepreprepre")
        getAcceptData(params).then(res =>{//从后台读取数据来源的目录
          console.log("getAcceptData",res)
          //console.log("type",typeof(res.data.items[0].label_type))
          this.initialPara.inputData.name = []
          this.initialPara.inputData.uuid = []
          this.initialPara.inputData.algorithmType = []
          for(let i = 0;i < res.data.items.length;i++){
            this.initialPara.inputData.name.push(res.data.items[i].name)
            this.initialPara.inputData.uuid.push(res.data.items[i].uuid)
            this.initialPara.inputData.algorithmType.push(res.data.items[i].label_type)
          }
          console.log(this.initialPara)
        })
        // getinitialPara().then(res =>{
        //   this.initialPara.outpath = res.data.outpath
        // })
        
      }, 
      handleStart(index, row) {//开始某行训练
        this.commonPara.trainjob_id = row.uuid
        startTask(this.commonPara).then(res=>{
          console.log(res)
          //==需要重新获取用户列表
          this.fetchData()
        })
        
      },
      handleDelete(index, row) {//删除某行
        this.$confirm('此操作将永久删除该训练记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.commonPara.trainjob_id = row.uuid
          deleteTask(this.commonPara).then(res=>{
            //==需要重新获取用户列表
            console.log(res)
            this.fetchData()
            if(res.code === 20000){
              this.$message({
              type: 'success',
              message: '删除成功!'
              });  
            }
          })
        })
        // .catch(() => { 
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });       
        // });
        
        
      },
      handleStop() {//终止某行训练
         this.$confirm('此操作将终止该任务训练, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopTask(this.showPara).then(res=>{
            console.log(res)
            //==需要重新获取用户列表
            this.fetchData()
          })
          this.$message({
            type: 'success',
            message: '终止成功!'
          });  
        })
        // .catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消终止'
        //   });          
        // });
        
        
      },
      handleShow(index, row) {//可视化某行 
      console.log(this.showPara,index,row)
        this.picVisible = true
        this.showPara.trainjob_id = row.trainjob_id
        let tmp = {
          'index': index
        }
        getVisualData(this.tmp).then(res =>{
          console.log(res)
          this.drawData.first.epoch = res.data.epoch
          this.drawData.second.epoch = res.data.epoch
          this.drawData.first.trainLoss = res.data.trainLoss
          this.drawData.first.valLoss = res.data.valLoss
          this.drawData.second.valAccuaccy = res.data.valAccuaccy
        })
      },
      handleShowlog(index, row){//日志可视化
        this.logdialogVisible = true
        clearInterval(this.timerLog)
        this.timerLog = null
        this.setTimerLog(row.row.uuid)
      },
      closeShowLog(){
        this.logdialogVisible = false
        clearInterval(this.timerLog)
        this.timerLog = null
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
        let tmp = {
          "user_id": store.getters.userid,
          "curr": this.queryInfo.pagenum,
          "size": this.queryInfo.pagesize 
        }
        getTableData1(tmp).then(res => { 
          console.log("fetchData",res)
          this.queryInfo.pagenum = res.data.items.current
          this.queryInfo.pagesize = res.data.items.size
          this.totalData = res.data.items.total
          this.tableData = res.data.items.records
          // this.tableData = []
          // for(let i = 0;i < res.data.items.records.length;i++){
          //   let obj = {}
          //   obj.name = res.data.items.records[i].name
          //   obj.train_algo_name = res.data.items.records[i].train_algo_name
          //   //obj.status = res.data.items[i].status
          //   obj.status = res.data.items.records[i].status
          //   obj.cost_time = res.data.items.records[i].cost_time
          //   obj.create_time = this.formatDate(res.data.items.records[i].create_time) 
          //   obj.descr = res.data.items.records[i].descr
          //   obj.userId = res.data.items.records[i].user_id
            
          //   this.tableData.push(obj)
          // }
        })
        
      },


      //创建任务部分
      create(taskForm){//提交创建
        this.$refs[taskForm].validate((valid) => {
          console.log("vaild",valid)
          if (valid) {
            alert('创建成功!');
            this.dialogFormVisible = false
          } else {
            console.log('创建失败!!');
            return callback();
          }
        })
        
        let temlist1 = JSON.parse(JSON.stringify(this.paraNameList[this.useAlgorithm]))
        let temlist2 = JSON.parse(JSON.stringify(this.paraValueList[this.useAlgorithm]))
        if(this.isdisplaytl) {
          temlist1.push("transferLearning")
          temlist2.push(this.transferLearningValue)
        }
        console.log(this.paraNameList[this.useAlgorithm],"das",this.paraValueList[this.useAlgorithm])
        this.taskForm.paras.push(this.paraNameList[this.useAlgorithm])
        this.taskForm.paras.push(this.paraValueList[this.useAlgorithm])

        this.taskPara.algo_id = this.useAlgorithm
        this.taskPara.args = JSON.stringify(this.taskForm.paras)
        this.taskPara.dataset_id = this.initialPara.inputData.uuid[this.taskForm.dataset_index]
        this.taskPara.dataset_name = this.initialPara.inputData.name[this.taskForm.dataset_index]
        this.taskPara.dataset_label_type = this.initialPara.inputData.algorithmType[this.taskForm.dataset_index]
        this.taskPara.descr = this.taskForm.description
        this.taskPara.name = this.taskForm.name
        this.taskPara.user_id = JSON.stringify(this.taskForm.user_id)

        //this.taskPara.uuid = this.taskForm.uuid  /////
        this.taskPara.source_oss_path = this.imageOssPath
        this.taskPara.annotation_oss_path = this.textOssPath
        this.taskPara.model_oss_path = this.modelOssPath
        this.isdisplaytl=false
        //console.log(this.isdisplaytl);
        console.log("this.taskPara",this.taskPara)

        submitTask(this.taskPara).then(res => {
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
     
       
      //分页的功能
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        //==重新发起数据请求
        if(this.queryInfo.query != ""){
          console.log(this.queryInfo.query)
        }
        else if(this.selectedstatus != "5"){
          this.searchStatusTask()
        }
        else{
          this.fetchData()
        }
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //==重新发起数据请求
        if(this.queryInfo.query != ""){
          console.log(this.queryInfo.query)
        }
        else if(this.selectedstatus != "5"){
          this.searchStatusTask()
        }
        else{
          this.fetchData()
        }
      },
      
      setTimer() {//定时器
        if(this.timer == null) {
          this.timer = setInterval( () => {
              console.log('开始定时...每过一秒执行一次,刷新页面')
              //if(!this.isSearchingFlag)  this.fetchData()
              // if (this.Mockprocess != 100){
              //   this.Mockprocess = this.Mockprocess + 0.5
              // }
          }, 1000)
        }
      },
      setTimerLog(train_id) {//读取日志的定时器
      console.log("this.timerLog",this.timerLog)
      this.logText = ''
      let parm = {
        'trainjob_id' : train_id
      }
        if(this.timerLog == null) {
          this.timerLog = setInterval( () => {
              //console.log('开始定时...每过一秒执行一次')
              showLog(parm).then(res =>{
                console.log(res)
                this.logText = res.data.content
                const textarea = document.getElementById('textarea_id');
                textarea.scrollTop = textarea.scrollHeight;
              })
              //this.fetchData();
          }, 1000)
        }
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
        });
        return uuid;
      }

    },
    
    mounted() {
      window.searchTask = this.searchTask;
      document.onkeydown = keyDownSearch;
      this.fetchData()
      // clearInterval(this.timer)
      // this.timer = null
      this.setTimer()
    },
    created(){
    if (store.getters.register == 1) {
      this.$router.push('/dashboard')
    }
    },
    destroyed() {
      document.onkeydown = undefined;
      clearInterval(this.timer)
      this.timer = null
    }
}

</script>

<style lang='scss' scoped>

  .el-row {
    margin-top:30px;
  }
  .training-jobs{
    margin-left:30px;
    //display: inline;
  }
  .el-table{
    font-size: 12px;
    width: 100%; 
    margin-top:25px
  }

  .el-pagination{
    margin-top:25px
  }

  .scrollbar {
    overflow: auto;
  }

  .scrollbar::-webkit-scrollbar {
    width: 10px;
    height: 2px;
  }

  .scrollbar::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background-color: rgba(0,0,0,0.4);
  }

  .scrollbar::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: rgba(0,0,0,0.1);
  }
</style>