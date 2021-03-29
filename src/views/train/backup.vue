<template>
  <div class="training-jobs" style="margin-top:50px; margin-left:25px">
      <el-button  @click="createbtn" style="font-size:30px;">创建训练任务</el-button>
    <!-- 创建任务对话框 -->
    <el-dialog title="任务信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="预置算法" :label-width="formLabelWidth">
          <el-select v-model="form.algorithm" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-option v-for="(item, index) in createInfo.algorithm" 
                :key="index" @click.native.prevent="chooseAlgorithm(index)"
                :label="item" :value="item">
                 </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="预置模型" :label-width="formLabelWidth">
          <el-select v-model="form.model" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-option v-for="(item, index) in createInfo.model" :key="index"
                :label="item" :value="item">
                </el-option>

              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源" :label-width="formLabelWidth">
          <el-select v-model="form.inputdata" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-option v-for="(item, index) in createInfo.inputdata" :key="index"
                :label="item" :value="item">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="输出位置" :label-width="formLabelWidth">
          <el-select v-model="form.outpath" placeholder="请选择">
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-option v-for="(item, index) in createInfo.outpath" :key="index"
                :label="item" :value="item">
                </el-option>
              </el-scrollbar>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="参数选择" :label-width="formLabelWidth">
          <el-form>
            <div style="height:150px;" class="scrollbar">
              <el-scrollbar style="height:100%; overflow-x:hidden;">
                <el-form-item v-for="(item, index) in paraNameList[currentAlgorithm]" :key="index">
                  <el-input  autocomplete="off" style="width: 35%;" :value=item></el-input>
                  <b style="margin-left:15px;">=</b>
                  <el-input autocomplete="off" style="width: 35%; margin-left:15px;" 
                  v-model=paraValueList[currentAlgorithm][index]>
                  </el-input>
                </el-form-item>
              </el-scrollbar>
            </div>
          </el-form>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="okbtn1" >确 定</el-button>
      </div>
    </el-dialog>




    <!-- 表格数据展示 -->
    <el-table :data="tableData" style="width: 100%; margin-top:50px;">
      <el-table-column
        prop="name"
        label="名称"
        width="215">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="215">
      </el-table-column>
      <el-table-column
        prop="num_version"
        label="版本数量"
        width="215">
      </el-table-column>
      <el-table-column
        prop="RunningTime"
        label="运行时间"
        width="215">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        width="215">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="215">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="创建者"
        width="215">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="stopclick(scope.$index)"
            size="small">
            暂停
          </el-button>
          <el-button
            @click.native.prevent="deleteclick(scope.$index, tableData)"
            size="small">
            移除
          </el-button>
          <el-button
            @click.native.prevent="showclick(scope.$index)"
            size="small">
            可视化
          </el-button>
        </template>
      </el-table-column>
    </el-table>



    <!-- 可视化 -->
    <el-dialog :visible.sync="picVisible" :title="'当前训练任务： '+tableData[currentRow].name">
      <div>
         <muti-line :lineData="lineData" id="1" ></muti-line>
         <muti-line :lineData="lineData1" id="2"></muti-line>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okbtn2" >终止训练</el-button>
      </div>
    </el-dialog>
  </div>
  </template>

  <script>
    import axios from 'axios'
    require('./mock.js')
    import mutiLine from "./mutiLine"
    import {getVisualData, getTableData, getcreateInfo,sendTaskInfo} from '@/api/train'
    export default {
      name: "index-train",
      components:{ mutiLine },
      data() {
        return {
          createInfo:{//创建任务时显示的数据
            algorithm:['yolov3-Tensorflow', 'yolov3-Pytorch','deeplab-Tensorflow', 'deeplab-Pytorch','fastspeech2-Tensorflow', 'fastspeech2-Pytorch'],
            model:[],
            inputdata:[],
            outpath:[],
          },
          tableData: [//表格中的数据
           {
            name: '2016-05-02',
            status: '运行中',
            num_version: '1',
            RunningTime: '3h',
            startTime: '2021/3/10',
            description: '第一个',
            creator: "Aaron",
           }
          ],
          form: {//创建任务指定后的数据
            name: '',
            description:'',
            algorithm:'',
            model:'',
            inputdata:'',
            outpath:'',
          },
          
          lineData:{//可视化的数据
            title:'训练集',
            series: [
              {
                name: 'train-loss',
                data: [],
                type: 'line',
                color:'	#F08080'
              }
            ],
            yData:[]
          } ,
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
            yData:[]
          } ,

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

          dialogFormVisible: false,
          picVisible: false,
          formLabelWidth: '120px',
          currentRow:0, //表中行的索引
          currentAlgorithm:0
        }
      },



      methods:{
        stopclick(index){
          console.log(index + '暂停')
        },
        deleteclick(index, rows) {//删除某一行记录
          rows.splice(index, 1);
        },
        showclick(index){//点击可视化
          this.currentRow = index
          this.picVisible = true
          getVisualData().then(res => {
            console.log(res)
            this.lineData.series[0].data = res.data.data
            this.lineData.yData = res.data.yData
            this.lineData1.series[0].data = res.data.data1
            this.lineData1.series[1].data = res.data.data2
            this.lineData1.yData = res.data.yData
          })
          
        },
        okbtn1(){//确认创建训练任务
          this.dialogFormVisible = false
          console.log(this.form)
          console.log(this.paraNameList[this.currentAlgorithm])
          console.log(this.paraValueList[this.currentAlgorithm])
          sendTaskInfo(this.form).then(res => { 
            console.log(res.message)
          })
          this.form.name = ''
          this.form.description = ''
          this.form.algorithm = ''
          this.form.model = ''
          this.form.inputdata = ''
          this.form.outpath = ''
          
        },
        okbtn2(){//确认可视化
          this.picVisible = false
        },
        createbtn(){//点击创建训练项目任务
          this.dialogFormVisible = true
          getcreateInfo().then(
            res => { // url即在mock.js中定义的
            console.log(res.data)
            this.createInfo.model = res.data.model
            this.createInfo.inputdata = res.data.inputdata
            this.createInfo.outpath = res.data.outpath
          })
        },
        chooseAlgorithm(index){//创建时选择特定模型的索引
          this.currentAlgorithm = index
        },
      },


      mounted() {
        getTableData().then(res => { 
            console.log(res)
            this.tableData.push(res.data)
        }) 
      }

    }
  </script>

<style>
    .el-scrollbar__wrap{
      overflow-x: hidden;
      
    }
</style>
