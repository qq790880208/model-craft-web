<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>项目介绍</h3>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="always">
              <el-tag>总的用户数</el-tag>
              {{ userCount }}人
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <el-tag type="success">在线人数数量</el-tag>
              {{ activeUserCount }}人
            </el-card>
          </el-col>
          <!-- <el-col :span="8">
            <el-card shadow="never">
              从不显示
            </el-card>
          </el-col> -->
        </el-row>
      </div>
    </el-card>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="首次登录,请修改密码"
      :visible.sync="centerDialogVisible"
      width="45%"
      top="15vh"
      fullscreen="true"
      center
      :before-close="handleCloseChangePassword">
      <!-- <span>需要注意的是内容是默认不居中的</span> -->
      <el-card class="box-card1">
        <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" placeholder="请设置新密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="newPassword2">
            <el-input v-model="form.newPassword2" type="password" placeholder="请确认新密码" />
          </el-form-item>
      </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-tag
      v-for="tag in tags"
      :key="tag.value"
      :color="tag.color"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
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
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { getAllUserCountApi, getActiveUserCountApi } from '@/api/dashboard'
import { saveTagApi } from '@/api/tag'
import { updatePassword, changePasswordApi } from '@/api/userManage'
import store from '@/store'
import md5 from 'js-md5'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    const validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('与新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      lineChartData: lineChartData.newVisitis,
      activeNum: Math.round(Math.random() * 10000),
      faceNum: Math.round(Math.random() * 10000),
      userCount: 100,
      activeUserCount: 100,
      tags: [{
        value: '西瓜',
        color: 'rgba(255, 128, 255, 0.75)'
      }],
      inputVisible: false,
      inputValue: '',
      color1: 'rgba(255, 128, 0, 0.75)',
      dataSetUuid: 'wangjie',
      data: 10,
      form: {
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        newPassword: [
          { required: true, message: '请设置新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateNewPassword2, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      centerDialogVisible: ''
    }
  },
  created() {
    // this.getAllUserCount()
    // this.getActiveUserCount()
    this.changeDialog()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getAllUserCount() {
      getAllUserCountApi().then(res => {
        this.userCount = res.data.items
      })
    },
    getActiveUserCount() {
      getActiveUserCountApi().then(res => {
        this.activeUserCount = res.data.items
      })
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleCloseChangePassword() {
      alert('请修改密码');
    },
    changeDialog() {
      console.log(store.getters.register)
      if (store.getters.register == 1) {
        console.log('klklklklklklk')
        this.centerDialogVisible = true
      } else {
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzz')
        this.centerDialogVisible = false
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          let newPassword = this.form.newPassword
          newPassword = md5(newPassword)
          const params = {
            newpassword: newPassword,
            id: store.getters.userid
          }
          console.log('9+9++9+++9++9')
          console.log(params)
          changePasswordApi(params).then(() => {
            this.centerDialogVisible = false
            this.form = {}
            this.$message.success('密码已修改,请重新登录')
            this.logout()
          })
          // this.logout()
        } else {
          this.$message.error('请正确填写表单')
          return false
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
      console.log(this.tags)
      this.inputVisible = false
      this.inputValue = ''
      const params = {
        data: this.tags,
        uuid: this.dataSetUuid
      }
      saveTagApi(params).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #EEF3FF;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.box-card {
  margin-bottom: 50px;
}
.el-tag + .el-tag {
    margin-left: 10px;
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
.box-card1 {
  width: 500px;
  margin:0 auto;
}
</style>
