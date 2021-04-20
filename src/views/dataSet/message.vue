<template>
  <div class="app-container">
    <div class="header">
      <div class="title">
        <span>{{this.$route.query.dataName}}</span>
        <el-button class="titlebutton" size="small" style="margin-left:100px; border: 0px" icon="el-icon-arrow-left" @click="toDataSet">
          返回数据集
        </el-button>
      </div>
      <div class="buttonlist">
        <el-button type="primary" plain size="mini" @click="toStartLabel">开始标注</el-button>
        <el-button type="primary" plain size="mini" @click="toDataManage">数据管理</el-button>
        <el-button type="primary" plain size="mini" @click="showTeamDialog">添加标注团队</el-button>
        <el-button size="mini" @click="change">修改</el-button>
      </div>
    </div>
    <el-divider class="divider2"></el-divider>
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
                          {{ dataSet.label_type | formatType}}
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
                        <span >
                          {{dataSet.input_path}}
                        </span>
                      </td>
                    </tr>
                  </table>
                </el-col>
                <el-col :span="8">
                  <table style = "border-collapse:separate; border-spacing:15px;">
                    <tr>
                      <td class="tdd">
                        <span>
                          版本
                        </span>
                      </td>
                      <td class="tdd">
                        <span>
                          --
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
                        <span>
                          /ww/ee/rr/
                        </span>
                      </td>
                    </tr>
                  </table>
                </el-col>
                <el-col :span="8">
                  <table style = "border-collapse:separate; border-spacing:15px;">
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
                          描述
                        </span>
                      </td>
                      <td>
                        <span>
                          {{ dataSet.descr }}
                        </span>
                      </td>
                    </tr>
                  </table>
                </el-col>
              </el-row>
            </div>
            <el-divider class="divider"></el-divider>
            <div class="label">
              <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :lg="8">
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
                                {{dataSet.tol}}
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
                                {{dataSet.tol - dataSet.done}}
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
                                {{dataSet.done}}
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
                <el-col :xs="24" :sm="24" :lg="8">
                  <div class="count">
                    <div>
                      标签统计
                    </div>
                    <div class="chart-wrapper">
                      <bar-chart :chartData="barChartData"></bar-chart>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="8">
                  <div class="chart-wrapper">
                    7777777777
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="changeDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="dataForm" label-width="70px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="dataForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            type="textarea"
            :rows="2" 
            v-model="dataForm.descr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签集">
          <el-tag
            :key="tag"
            v-for="tag in dataForm.tags"
            closable
            :disable-transitions="false"
            @close="handleCloseTag(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import  BarChart  from './BarChart'
import { getTags, updateTags } from '@/api/data'

export default {
  components: { BarChart },
  name: 'Dashboard',
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
      if (num == 0) {
        return '拉框标注';
      }
      if (num == 1) {
        return '多边形标注';
      }
      if (num == 2) {
        return '语音标注';
      }
      if (num == 3) {
        return '3D标注';
      }
    }
  },
  data() {
    return {
      changeDialogVisible: false,
      dataForm: {
        name: '',
        descr: '',
        tags: []
      },
      formLabelWidth: '120px',
      activeName: 'first',
      barChartData: {
        tags: ['car', 'cat', 'plane'],
        nums: [100, 120, 161],
        nums2: [120, 82, 91]
      },
      labelName: ['2D拉框', '像素级', '3D拉框', '语音'],
      // dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'dataSet'
    ])
  },
  methods: {
    // tabs 切换
    handleClick(tab, event) {
      console.log(tab, event);
    },

    // 
    toDataSet: function() {
      this.$router.push('/data')
    },

    toDataManage: function() {
      this.$router.push('/dataSet/userLabel')
    },

    // 修改标签
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
      .catch(_ => {});
    },

    // tag
    handleCloseTag(tag) {
      this.dataForm.tags.splice(this.dataForm.tags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dataForm.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  
    change: function() {
      this.dataForm.name = this.dataSet.name
      this.dataForm.descr = this.dataSet.descr
      this.changeDialogVisible = true
      this.dataForm.tags = this.barChartData.tags
    },

    // 提交表单
    addForm: function() {
      const params = {
        datasetuuid: this.dataSet.uuid,
        name: this.dataForm.name,
        descr: this.dataForm.descr,
        tags: this.dataForm.tags.toString()
      }
      console.log(params)
      updateTags(params).then( res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.changeDialogVisible = false
      })
      
    },

    // 得到tags
    getTag: function() {
      const params = {
        datasetuuid: this.dataSet.uuid
      }
      console.log(params)
      getTags(params).then( res => {
        this.barChartData.tags = res.data.items
      })
    }
  },
  created() {
    this.getTag()
  },
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
  word-wrap:
  break-word; 
  text-overflow:ellipsis; 
  white-space:nowrap; 
  overflow:hidden; 
}
table td:hover{ 
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
</style>
