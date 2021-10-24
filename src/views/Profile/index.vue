<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top:50px; margin-left:50px">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>个人信息中心</span>
          </div>
          <div class="name-role">
            <span class="sender"> {{ name }} </span>
          </div>
          <el-divider />
          <div class="relation-item">角色:  <div style="float: right; padding-right:20px;">{{ role }}</div></div>
          <div class="relation-item">描述:  <div style="float: right; padding-right:20px;">{{ descr }}</div></div>
          <el-divider />
          <el-button type="primary" style="margin-left: 65%" @click="changePassword">修改密码</el-button>
        </el-card>
      </el-col>
      <el-card v-show="show" style="margin-right:300px">
        <!-- <el-button style="float: right " type="text">操作按钮</el-button> -->
        <div slot="header" class="clearfix">
          <span>修改密码</span>
          <el-button style="float: right; padding: 3px 0" type="primary" icon="el-icon-close" @click="closeCard" />
        </div>
        <el-form ref="form" class="user-account-key" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="原密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入原密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" placeholder="请设置新密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="newPassword2">
            <el-input v-model="form.newPassword2" type="password" placeholder="请确认新密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="$refs['form'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePassword } from '@/api/userManage'
import md5 from 'js-md5'
import store from '@/store'

export default {
  name: 'Dashboard',
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value === this.form.password) {
        callback(new Error('新密码不能与原密码相同!'))
      } else {
        callback()
      }
    }
    const validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('与新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      label_type: 0,
      show: false,
      form: {},
      hhh: md5('123456'),
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请设置新密码', trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateNewPassword2, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
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
  created() {
    if (store.getters.register == 1) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`
    },
    // back: function() {
    //   if (this.label_type === 0) {
    //     this.$router.push('/teamManagement/annotateTeamManagement')
    //   } else if (this.label_type === 1) {
    //     this.$router.push('/')
    //   }
    // },
    changePassword() {
      this.show = true
      store.commit('SET_SET_PASSWORD')
    },
    closeCard() {
      this.show = false
      this.$refs['form'].resetFields()
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          let { newPassword, password } = this.form
          password = md5(password)
          newPassword = md5(newPassword)
          const params = {
            password: password,
            newpassword: newPassword,
            id: store.getters.userid
          }
          console.log(params)
          updatePassword(params).then(() => {
            this.show = false
            this.form = {}
            this.$message.success('密码已修改, 请重新登录')
            this.logout()
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
</style>
