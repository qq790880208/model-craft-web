<template>
  <div class="app-container">
    <!--工具条-->
    <el-row :gutter="24" class="toolbar" style="padding-bottom: 10px;">
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名" style="width:150px" clearable></el-input>
            <el-input v-model="filters.email" placeholder="邮箱" style="width:150px; margin-left: 8px" clearable></el-input>
            <el-input v-model="filters.mobile" placeholder="手机号" style="width:150px; margin-left: 8px" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getUsers">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="padding-bottom: 10px;">
      <el-col :span="24">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="batchRemove" :disabled="sels.length===0">批量删除</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" align="center" label="index" show-overflow-tooltip width="70">
      </el-table-column>
      <el-table-column prop="name" align="center" label="姓名" show-overflow-tooltip width="150" sortable>
      </el-table-column>
      <el-table-column prop="role" align="center" label="身份" show-overflow-tooltip width="120" sortable>
      </el-table-column>
      <el-table-column prop="email" align="center" label="邮箱" show-overflow-tooltip width="120" sortable>
      </el-table-column>
      <el-table-column prop="mobile" align="center" label="手机号" show-overflow-tooltip width="120" sortable>
      </el-table-column>
      <el-table-column prop="password" align="center" label="密码" show-overflow-tooltip min-width="140" sortable>
      </el-table-column>
      <el-table-column prop="descr" align="center" label="用户描述" show-overflow-tooltip min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="create_time" align="center" label="创建时间" show-overflow-tooltip min-width="180" sortable>
        <template slot-scope="scope">
          {{ scope.row.create_time | formatDate }}
         </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="authority.indexOf('user:add')!==-1">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="sels.length===0">批量删除</el-button> -->
      <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="total" style="float:right;">-->
      <el-pagination layout="total, sizes ,prev, pager, next, jumper" :page-size="page_size" :total="total" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="editForm.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" placeholder="输入6位密码"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="editForm.descr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogFormVisible=false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
} from '@/api/userManage'
import { getRolesListApi } from '@/api/role'
import md5 from 'js-md5'
import { title } from '@/settings'
import store from '@/store'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    //验证邮箱的规则
    const checkEmail = (rule,value,cb) =>{
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(regEmail.test(value)){
        //合法的邮箱
        return cb()
      }
      cb(new Error("请输入合法的邮箱"))
    }
    //验证手机号码的规则
    const checkMobile = (rule,value,cb) =>{
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/ 
      if (regMobile.test(value)) { 
        //合法的手机号码
        return cb() 
      }
      cb(new Error('手机号码格式不正确'))     
    }
    return {
      authority: [],
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      dialogFormVisible: false,
      filters: {
        name: '',
        email: '',
        mobile: ''
      },
      users: [],
      statusOptions: ['admin', 'user', 'Manager'],
      total: 0,
      page: 1,
      page_size: 20,
      sels: [], // 列表选中列
      // editFormRules: {
      //   name: [
      //     { required: true, message: '尽量不要修改姓名', trigger: 'blur' }
      //   ],
      //   password: [
      //     { required: true, message: '密码不能为空', trigger: 'blur' },
      //     { min: 6, max: 20, message: '长度在 6 到 20 个字符', validator: validatePassword, trigger: 'blur' }
      //   ]
      // },
      // 编辑界面数据
      editForm: {
        id: '0',
        name: '',
        role: '',
        email: '',
        mobile: '',
        descr: '',
        password: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度不小于 6 个字符', validator: validatePassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
           { required: true, message: '请输入手机号码', trigger: 'blur' },
           { validator: checkMobile, trigger: 'blur'}
        ]
      }
    }
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
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page_size = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    // 获取用户列表
    getUsers() {
      const para = {
        page: this.page,
        pagesize: this.page_size,
        name: this.filters.name,
        email: this.filters.email,
        mobile: this.filters.mobile
      }
      console.log(para)
      getUserListPage(para).then(res => {
        this.total = res.data.total
        this.users = res.data.items
      })
    },
    // 删除
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          console.log(para)
          removeUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    },
    handleEdit: function(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
      this.editForm.password = ''
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        id: '0',
        name: '',
        role: '',
        descr: ''
      }
    },
    // 编辑
    updateData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', {})
            .then(() => {
              const temp = Object.assign({}, this.editForm)
              // md5 加密
              var temppassword = md5(temp.password)
              const para = {
                id: temp.id,
                role: temp.role,
                name: temp.name,
                password: temppassword,
                descr: temp.descr }
              console.log(para)
              editUser(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.getUsers()
              })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              // this.editForm.id = (parseInt(Math.random() * 100)).toString() // mock a id
              const para = Object.assign({}, this.editForm)
              // md5 加密
              para.password = md5(para.password)
              console.log(para)
              addUser(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.getUsers()
              })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 全选单选多选
    selsChange: function(sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { ids: ids }
          console.log(para)
          batchRemoveUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    },
    getRoles() {
      getRolesListApi().then(res =>{
        this.statusOptions = res.data.items
      })
    }
  },
  
  mounted() {
    this.getUsers()
    this.getRoles()
    this.authority = store.getters.authority
    console.log('jjjjjjjjjjjjjjjjj')
    console.log(this.authority)
    console.log(this.authority.indexOf("user:add"))
    console.log(this.authority.indexOf('user:add'))
  }
}
</script>

<style scoped>
  .out-main{
    margin: 15px;
  }
  .app-container {
    padding: 5px 20px 20px 15px;
  }
</style>
