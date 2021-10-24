<template>
  <div class="app-container">
    <div class="header">
      <div class="title">
        <!-- <span>{{ this.$route.query.dataName }}</span> -->
        <spa>{{ dataSet.name }}</spa>
        <el-button class="titlebutton" size="small" style="margin-left:100px; border: 0px" icon="el-icon-arrow-left" @click="toDataSet">
          返回数据集
        </el-button>
      </div>
      <div class="buttonlist">
        <el-button type="primary" plain size="mini" @click="toStartLabel">开始标注</el-button>
        <el-button type="primary" plain size="mini" @click="toDataManage">数据管理</el-button>
        <el-button type="primary" plain size="mini" @click="showTeamDialog">添加团队任务</el-button>
        <el-button type="primary" plain size="mini" @click="delTeamTask">取消团队任务</el-button>
        <el-button type="primary" plain size="mini" @click="change">修改信息</el-button>
      </div>
    </div>
    <el-divider class="divider2" />
    <div class="main">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="概览" name="first">
            <div class="datail">
              <el-row :gutter="24">
                <el-col :span="8">
                  <table>
                    <tr>
                      <td>
                        <span>
                          标注类型
                        </span>
                      </td>
                      <td>
                        <span>
                          {{ dataSet.label_type | formatType }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>
                          数据集输入位置
                        </span>
                      </td>
                      <td>
                        <span class="test">
                          {{ dataSet.input_path }}
                        </span>
                      </td>
                    </tr>
                  </table>
                </el-col>
                <el-col :span="8">
                  <table>
                    <tr>
                      <td>
                        <span>
                          描述
                        </span>
                      </td>
                      <td>
                        <span>
                          {{ dataSet.descr }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>
                          数据集输出位置
                        </span>
                      </td>
                      <td>
                        <span class="test">
                          {{ dataSet.output_path }}
                        </span>
                      </td>
                    </tr>
                  </table>
                </el-col>
                <el-col :span="8">
                  <table>
                    <tr>
                      <td>
                        <span>
                          创建时间
                        </span>
                      </td>
                      <td>
                        <span>
                          {{ dataSet.create_time | formatDate }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>
                          数据集状态
                        </span>
                      </td>
                      <td>
                        <span>
                          {{ dataSet.accept | formatStatus }}
                        </span>
                      </td>
                    </tr>
                  </table>
                </el-col>
              </el-row>
            </div>
            <el-divider class="divider" />
            <div class="label">
              <el-row :gutter="24">
                <el-col :span="6">
                  <div class="speed">
                    <div>
                      <span> 标注进度 </span>
                    </div>
                    <div style="margin: 15px 10px 15px 0px">
                      <el-row :gutter="18">
                        <el-col :span="6">
                          <table>
                            <tr>
                              <td>
                                {{ dataSet.tol }}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span>
                                  全部
                                </span>
                              </td>
                            </tr>
                          </table>
                        </el-col>
                        <el-col :span="6">
                          <table>
                            <tr>
                              <td>
                                {{ dataSet.tol - dataSet.done }}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span>
                                  未标注
                                </span>
                              </td>
                            </tr>
                          </table>
                        </el-col>
                        <el-col :span="6">
                          <table>
                            <tr>
                              <td>
                                {{ dataSet.done }}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span>
                                  已标注
                                </span>
                              </td>
                            </tr>
                          </table>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="count">
                    <div>
                      标签统计
                    </div>
                    <div class="chart-wrapper">
                      <bar-chart :chart-data="barChartData" />
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div>
                    <div>
                      质检统计
                    </div>
                    <div class="chart-wrapper">
                      <pie-Chart :chart-data="pieChartDataTol" />
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div>
                    <div>
                      上次质检结果统计
                    </div>
                    <div class="chart-wrapper">
                      <pie-Chart :chart-data="pieChartDataPass" />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 修改数据集的tag -->
    <el-dialog
      title="修改数据集"
      :visible.sync="changeDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="dataForm" label-width="70px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="dataForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="dataForm.descr"
            type="textarea"
            :rows="2"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="标签集">
          <el-tag
            v-for="tag in tags"
            :key="tag.value"
            :color="tag.color"
            closable
            :disable-transitions="false"
            @close="handleCloseTagNew(tag)"
          >
            {{ tag.value }}
          </el-tag>
          <!-- <template
            v-if="inputVisible"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          > -->
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
          />
          <el-color-picker v-if="inputVisible" v-model="color1" class="mycolor" show-alpha="true" size="small" />
          <el-button v-if="inputVisible" type="primary" size="mini" icon="el-icon-finished" @keyup.enter.native="handleInputConfirm" @click="handleInputConfirm" />
          <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput">新标签</el-button>
          <!-- <el-tag
            v-for="tag in dataForm.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleCloseTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加标注团队 -->
    <el-dialog
      title="创建团队标注任务"
      :visible.sync="teamDialogVisible"
      :before-close="handleCloseDialog"
      width="40%"
    >
      <el-form ref="teamForm" :model="teamForm" label-width="100px" label-position="left">
        <el-form-item label="团队名称">
          <span>
            {{ teamForm.dataSetName }}
          </span>
        </el-form-item>
        <el-form-item label="标注团队">
          <template>
            <el-select
              v-model="teamForm.teamValue"
              placeholder="请选择团队"
              clearable
            >
              <el-option
                v-for="item in teams"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="addLabelTeam()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import BarChart from './BarChart'
import PieChart from './PieChart'
import { getTags, updateTags } from '@/api/data'
import { updateTagApi } from '@/api/tag'
import { getAllTeam, getSelectTeam } from '@/api/team'
import { getAcceptPieDataApi, getAcceptPieDataPassApi } from '@/api/message'
import { getLabel, getDataByName, createDataSet, deleteDataSet, assignLabel, getAssignData, addTags, delTeamTaskApi } from '@/api/data'
import store from '@/store'

export default {
  name: 'Dashboard',
  components: {
    BarChart,
    PieChart
  },
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
    },
    formatStatus(num) {
      if (num === 0) {
        return '未完成验收'
      }
      if (num === 1) {
        return '完成验收'
      }
    }
  },
  data() {
    return {
      dataSetDetails: '',
      changeDialogVisible: false,
      teamDialogVisible: false,
      oldTeam: '',
      teamForm: {
        dataSetName: '',
        teamValue: '',
        dataSetUuid: ''
      },
      teams: [], // 所有团队
      dataForm: {
        name: '',
        descr: '',
        tags: []
      },
      formLabelWidth: '120px',
      activeName: 'first',
      barChartData: {
        tags: [],
        nums: [],
        nums2: []
      },
      pieChartDataTol: [
        { value: 0, name: '总数' },
        { value: 0, name: '抽检数' }
      ],
      pieChartDataPass: [
        { value: 0, name: '总数' },
        { value: 0, name: '抽检数' }
      ],
      labelName: ['2D拉框', '像素级', '3D拉框', '语音'],
      // dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      // tags: [{
      //   value: '西瓜',
      //   color: 'rgba(255, 128, 255, 0.75)'
      // }],
      tags: [],
      color1: 'rgba(255, 128, 0, 0.75)'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'dataSet'
    ])
  },
  created() {
    this.getTag()
    this.getAcceptDataPieDataTol()
    this.getAcceptDataPieDataPass()
  },
  methods: {

    getDataSetDetails() {
      const params = {
        dataSetId: store.getters.uuid
      }
    },

    // dialog 关闭
    handleCloseDialog(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.teamDialogVisible = false
        })
        .catch(_ => {})
    },
    // tabs 切换
    handleClick(tab, event) {
      console.log(tab, event)
    },

    getAcceptDataPieDataTol() {
      const params = {
        dataSet_uuid: store.getters.dataSet.uuid
      }
      getAcceptPieDataApi(params).then(res => {
        this.pieChartDataTol = res.data.items
        console.log(res.data.items)
      })
    },

    getAcceptDataPieDataPass() {
      const params = {
        dataSet_uuid: store.getters.dataSet.uuid
      }
      getAcceptPieDataPassApi(params).then(res => {
        this.pieChartDataPass = res.data.items
        console.log(res.data.items)
      })
    },

    //
    toDataSet: function() {
      this.$router.push('/data')
    },

    toStartLabel: function() {
      const ttype = this.dataSet.label_type
      if (ttype == 0 || ttype == 3) {
        this.$router.push('/label/d2imageview')
      }
      if (ttype == 1 || ttype == 4) {
        this.$router.push({ path: '/label/polygonimageview' })
      }
      if (ttype == 2) {
        this.$router.push({ path: '/label/voice' })
      }
      // if(ttype == 3) {
      //   this.$router.push({path:'/label/voice'})
      // }
    },

    toDataManage: function() {
      this.$router.push('/dataSet/userLabel')
    },

    showTeamDialog: function() {
      this.getTeams(store.getters.uuid)
      this.teamForm.teamValue = ''
      // 得到标注团队
      const params = {
        dataSetUuid: store.getters.uuid
      }
      console.log(params)
      getSelectTeam(params).then(res => {
        this.selectTeams = res.data.items
        this.teamForm.teamValue = res.data.items.name
        this.oldTeam = res.data.items
        this.teamForm.dataSetName = store.getters.dataSet.name
        this.teamForm.dataSetUuid = store.getters.dataSet.uuid
        this.teamDialogVisible = true
      })
    },
    cancel() {
      this.dialogVisible = false
      this.teamDialogVisible = false
    },

    // 添加标注团队
    addLabelTeam() {
      if (this.teamForm.teamValue === this.oldTeam.name) {
        this.teamForm.teamValue = this.oldTeam.id
      }
      const params = {
        dataSetid: this.teamForm.dataSetUuid,
        teamid: this.teamForm.teamValue
      }
      console.log(params)
      assignLabel(params).then(res => {
        this.teamDialogVisible = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // this.teamDialogVisible = false
      }).catch()
    },

    delTeamTask() {
      const params = {
        dataSetid: store.getters.uuid
      }
      delTeamTaskApi(params).then(res => {
        this.$message({
          message: '成功',
          type: 'success'
        })
      })
    },

    // 得到所有的标注团队
    getTeams(uuid) {
      const params = {
        dataSetUuid: uuid,
        name: store.getters.name
      }
      getAllTeam(params).then(res => {
        var team = res.data.items
        this.teams = team
        console.log(this.teams)
      })
    },

    // 修改标签
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.changeDialogVisible = false
        })
        .catch(_ => {})
    },

    // tag
    handleCloseTag(tag) {
      this.dataForm.tags.splice(this.dataForm.tags.indexOf(tag), 1)
    },

    handleCloseTagNew(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      const color = this.color1
      if (inputValue) {
        const params = {
          value: inputValue,
          color: color
        }
        this.tags.push(params)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    change: function() {
      this.dataForm.name = this.dataSet.name
      this.dataForm.descr = this.dataSet.descr
      this.changeDialogVisible = true
      this.dataForm.tags = this.tags
    },

    // 提交表单
    addForm: function() {
      const params = {
        datasetuuid: this.dataSet.uuid,
        name: this.dataForm.name,
        descr: this.dataForm.descr,
        data: this.tags
      }
      console.log(params)
      // updateTags(params).then(res => {
      //   this.$message({
      //     message: res.message,
      //     type: 'success'
      //   })
      //   this.changeDialogVisible = false
      // })
      updateTagApi(params).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.changeDialogVisible = false
        this.$router.push({ path: '/data' })
      })
    },

    // 得到tags
    getTag: function() {
      const params = {
        datasetuuid: this.dataSet.uuid
      }
      console.log(params)
      getTags(params).then(res => {
        this.tags = res.data.item2
        this.barChartData.tags = res.data.items
        this.barChartData.nums = res.data.tagCounts
        this.barChartData.nums2 = res.data.labelCounts
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 5px 20px 20px 15px;
}
.title{
  padding: 0px 20px 0px 5px;
}
.titlebutton{
  border: #EEF3FF;
  background: #EEF3FF;
}
.content{
  margin: 12px 0px 0px 0px ;
}
.buttonlist{
  float: right;
  padding: 0px 20px 0px 0px ;
}
.datail{
  padding: 5px 30px 5px 10px;
}
.divider{
  margin: 5px 0px 5px 0px;
}
.divider2{
  margin: 32px 0px 5px 0px;
}
.chart-wrapper {
  background: #EEF3FF;
  margin: 15px 10px 15px 0px;
}
.label{
  border-top-style: 1px solid #f59797 ;
  margin: 15px 5px 10px 25px;
  padding: 5px 20px 10px 0px;
}
table{
  border-collapse:separate;
  border-spacing:15px;
  table-layout: fixed;
}
table td{
  max-width:275px;
  height: 40px;
  word-wrap:
  break-word;
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;
}
table .test:hover{
  white-space:normal;
  overflow:auto;
}
.el-tag + .el-tag {
   margin-left: 10px;
}
.old-tag{
  width: 80%;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.mycolor{
  background-color: #EEF3FF;
  margin-left: 0px;
  margin-right: 20px;
  vertical-align: bottom;
}
</style>
