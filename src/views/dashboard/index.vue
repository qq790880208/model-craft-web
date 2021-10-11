<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top:50px; margin-left:50px">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>个人信息中心</span>
          </div>
          <div class="name-role">
            <span class="sender"> {{name}} </span>  
          </div>
          <el-divider></el-divider>
          <div class="relation-item">角色:  <div style="float: right; padding-right:20px;">{{role}}</div></div> 
          <div class="relation-item">描述:  <div style="float: right; padding-right:20px;">{{descr}}</div></div>
          <el-divider></el-divider>
          <el-button type="primary" style="margin-left: 65%" @click="changePassword">修改密码</el-button>
        </el-card> 
      </el-col>
      <el-card style="margin-right:300px"  v-show="show">
        <el-form class="user-account-key" ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="原密码" prop="password">
            <el-input type="password" placeholder="请输入原密码" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" placeholder="请设置新密码" v-model="form.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="newPassword2">
            <el-input type="password" placeholder="请确认新密码" v-model="form.newPassword2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="$refs['form'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
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
        <el-form ref="forms" :model="forms" :rules="ruless">
          <el-form-item label="新密码" prop="newPasswords">
            <el-input v-model="forms.newPasswords" type="password" placeholder="请设置新密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="newPasswords2">
            <el-input v-model="forms.newPasswords2" type="password" placeholder="请确认新密码" />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmits()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePassword,changePasswordApi } from '@/api/userManage'
import crypto from 'crypto'
import md5 from 'js-md5'
import store from '@/store'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'role',
      'descr',
      'token',
      'labelrole',
      'userid'
    ])
  },
  data() {
    let validateNewPassword = (rule, value, callback) => {
      if (value === this.form.password) {
          callback(new Error('新密码不能与原密码相同!'))
      } else {
        callback()
      }
    }
    let validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('与新密码不一致!'))
      } else {
        callback()
      }
    }
    let validateNewPasswords2 = (rule, value, callback) => {
      if (value !== this.forms.newPasswords) {
        callback(new Error('与新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      label_type: 0,
      show: false,
      form: {},
      forms: {
        newPasswords: '',
        newPasswords2: ''
      },
      hhh: md5('123456'),
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请设置新密码', trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        newPassword2: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateNewPassword2, trigger: 'blur' },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ]
      },
      ruless: {
        newPasswords: [
          { required: true, message: '请设置新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPasswords2: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateNewPasswords2, trigger: 'blur' },
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
    format(percentage) {
        return percentage === 100 ? '满' : `${percentage}%`;
    },
    back: function () {
      if(this.label_type == 0){
        this.$router.push('/teamManagement/annotateTeamManagement')
      }else if(this.label_type == 1){
        this.$router.push('/')
      }
    },
    changePassword: function () {
      this.show = true
      store.commit('SET_SET_PASSWORD')
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
    onSubmits() {
      this.$refs.forms.validate(valid => {
        if (valid) {
          console.log(this.forms)
          let newPasswords = this.forms.newPasswords
          newPasswords = md5(newPasswords)
          const params = {
            new_pwn: newPasswords,
            id: store.getters.userid
          }
          console.log('9+9++9+++9++9')
          console.log(params)
          changePasswordApi(params).then(() => {
            this.centerDialogVisible = false
            this.forms = {}
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
    onSubmit: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          let { newPassword, password } = this.form
          password = md5(password)
          newPassword = md5(newPassword)
          const params = {
            password: password,
            new_pwn: newPassword,
            id: store.getters.userid
          }
          console.log(params)
          updatePassword(params).then(() => {
            this.show = false
            this.form = {}
            this.logout()
            this.$message.success('密码已修改')       
          })
        } else {
          this.$message.error('请正确填写表单')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.name-role {
  font-size: 16px;
  padding: 5px;
  text-align:center;
}
.relation-item {
  padding: 12px;
}
.box-card1 {
  width: 500px;
  margin:0 auto;
}
</style>
