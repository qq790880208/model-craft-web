<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
    <el-dialog
      title="首次登录,请修改密码"
      :visible.sync="centerDialogVisible"
      width="45%"
      top="15vh"
      fullscreen="true"
      center
      :before-close="handleCloseChangePassword"
    >
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './notAdmin'
import { changePasswordApi } from '@/api/userManage'
import store from '@/store'
import md5 from 'js-md5'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    const validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('与新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      currentRole: 'adminDashboard',
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
      centerDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    if (!(this.role === 'admin' || this.role === 'superAdmin')) {
      this.currentRole = 'editorDashboard'
    }
    this.changeDialog()
  },
  methods: {
    changeDialog() {
      console.log(store.getters.register)
      if (store.getters.register === 1) {
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card1 {
  width: 500px;
  margin:0 auto;
}
</style>
