<template>
  <div class="login-wrap">
    <div class="ms-title">XX市信访系统-欢迎登录</div>
    <div class="ms-login">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0px" class="demo-ruleForm">
        <div v-if="errorInfo" style="margin-bottom: 5px;">
          <span>{{ errInfo }}</span>
        </div>
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            placeholder="密码"
            @keyup.enter.native="submitForm('ruleForm')"
          />
        </el-form-item>
        <el-form-item prop="validate">
          <el-input v-model="ruleForm.validate" class="validate-code" placeholder="验证码" />
          <div class="code" @click="refreshCode">
            <s-identify :identify-code="identifyCode" />
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p class="register" @click="gotoRegister()">注册</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      identifyCodes: '1234567890',
      identifyCode: '',
      errorInfo: false,
      ruleForm: {
        name: '',
        password: '',
        validate: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        validate: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.identifyCode = '0928'
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    submitForm(formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          if (self.ruleForm.validate !== this.identifyCode) {
            self.errorInfo = true
            self.errInfo = '验证码错误'
            self.$message.error('验证码错误')
            this.refreshCode()
          } else {
            self.$http.post('/api/user/login', self.ruleForm)
              .then((response) => {
                console.log(response)
                if (response.data.code == -1) {
                  self.errorInfo = true
                  self.errInfo = response.data.msg
                  self.$message.error(response.data.msg)
                  // 重新生成验证码
                  this.refreshCode()
                } else if (response.data.code === 0) {
                  self.$message.success(response.data.msg)
                  self.$router.push('/home')
                  sessionStorage.setItem('session_username', self.ruleForm.name)
                  sessionStorage.setItem('session_user', JSON.stringify(self.ruleForm))
                  console.log(JSON.stringify(self.ruleForm))
                }
              }).then((error) => {
                console.log(error)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    gotoRegister() {
      this.$router.push('/register')
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
      console.log(this.identifyCode)
    }
  }
}
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 240px;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .ms-login span {
        color: red;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }

    .code {
        width: 112px;
        height: 35px;
        border: 1px solid #ccc;
        float: right;
        border-radius: 2px;
    }

    .validate-code {
        width: 136px;
        float: left;
    }

    .register {
        font-size: 14px;
        line-height: 30px;
        color: #999;
        cursor: pointer;
        float: right;
    }
</style>
