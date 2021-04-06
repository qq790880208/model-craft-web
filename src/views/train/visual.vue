<template>
  <div class="training-jobs" style="margin-top:50px; margin-left:25px">
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
         <el-progress :percentage="100" :format="format"></el-progress>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okbtn2" >终止训练</el-button>
      </div>
    </el-dialog>

    
  </div>
  </template>

  <script>
    import mutiLine from "./mutiLine"
    import {getVisualData, getTableData, getcreateInfo,sendTaskInfo} from '@/api/train'
    export default {
      name: "index-train",
      components:{ mutiLine },
      data() {
        return {
          tableData: [//表格中的数据
           {
            name: '2016-05-02',
            status: '运行中',
            RunningTime: '3h',
            startTime: '2021/3/10',
            description: '第一个',
            creator: "Aaron",
           }
          ],
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
          picVisible: false,
          formLabelWidth: '120px',
          currentRow:0, //表中行的索引
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

        okbtn2(){//确认可视化
          this.picVisible = false
        },

        format(percentage) {
            return percentage === 100 ? '满' : `${percentage}%`;
        }

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
