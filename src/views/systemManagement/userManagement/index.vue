<template>
  <div class="app-container">
    <!--工具条-->
    <el-row :gutter="24" class="toolbar" style="padding-bottom: 10px;">
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名" style="width:100px" clearable />
            <el-input v-model="filters.email" placeholder="邮箱" style="width:150px; margin-left: 8px" clearable />
            <el-input v-model="filters.mobile" placeholder="手机号" style="width:150px; margin-left: 8px" clearable />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.role" class="filter-item" placeholder="请选择角色" style="width:120px" clearable>
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="filters.type"
              placeholder="请选择状态"
              style="width:120px"
              clearable
            >
              <el-option
                v-for="item in flagList"
                :key="item.key"
                :label="item.status"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" icon="el-icon-search" @click="getUsers">查询</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="padding-bottom: 10px;">
      <el-col :span="24">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button type="primary" icon="el-icon-search" @click="getUsers">查询</el-button>
        <el-button type="danger" :disabled="sels.length===0" icon="el-icon-delete" @click="batchRemove">批量删除</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      style="width: 100%;"
      @selection-change="selsChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="60" />
      <el-table-column type="index" align="center" label="index" show-overflow-tooltip width="70" />
      <el-table-column prop="name" align="center" label="姓名" show-overflow-tooltip width="120" :sortable="'custom'" />
      <el-table-column prop="role" align="center" label="身份" show-overflow-tooltip width="120" :sortable="'custom'" />
      <el-table-column prop="email" align="center" label="邮箱" show-overflow-tooltip width="120" :sortable="'custom'" />
      <el-table-column prop="mobile" align="center" label="手机号" show-overflow-tooltip width="120" :sortable="'custom'" />
      <!-- <el-table-column prop="password" align="center" label="密码" show-overflow-tooltip min-width="140" sortable /> -->
      <el-table-column label="状态" prop="status" min-width="80" :sortable="'custom'">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'success' : 'danger'"
            hit
          >{{ scope.row.status == 1 ? '在线' : '离线' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="descr" align="center" label="用户描述" show-overflow-tooltip min-width="100" :sortable="'custom'" />
      <el-table-column prop="create_time" align="center" label="创建时间" show-overflow-tooltip min-width="160" :sortable="'custom'">
        <template slot-scope="scope">
          {{ scope.row.create_time | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button v-if="authority.indexOf('user:add')!==-1" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="sels.length===0">批量删除</el-button> -->
      <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="total" style="float:right;">-->
      <el-pagination layout="total, sizes ,prev, pager, next, jumper" :page-size="page_size" :total="total" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-col>

    <!--编辑界面-->
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="addFormRules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="editForm.role" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="输入邮箱" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" placeholder="输入6位密码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.descr" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="createData">添加</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button> -->
        <!-- <el-button v-else type="primary" @click="updateData">修改</el-button> -->
        <!-- <el-button type="primary" @click="updateData">修改</el-button> -->
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogFormEditVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="editForm.role" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="输入邮箱" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" placeholder="输入6位密码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.descr" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogFormEditVisible=false">取消</el-button>
        <!-- <el-button type="primary" @click="createData">添加</el-button> -->
        <el-button type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getAuthorityApi } from '@/api/userManage'
import { getRolesListApi } from '@/api/role'
import md5 from 'js-md5'
import store from '@/store'

function keyDownSearch(e) {
  console.log('keydown!!!!!!!!!!!!')
  const theEvent = e.event || window.event
  const code = theEvent.keyCode || theEvent.which || theEvent.charCode
  // eslint-disable-next-line eqeqeq
  if (code == 13) { // 保存并上一张
    console.log('enter!!!!!!!!!!!!!')
    // eslint-disable-next-line no-undef
    getUsers()
    // return false;
  }
}

export default {
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
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const validateEditPassword = (rule, value, callback) => {
      if (value.length < 6 && value.length > 1) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号码
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
      ruleMap: {
        update: this.editFormRules,
        create: this.addFormRules
      },
      flagList: [
        { key: 1, status: '在线' },
        { key: 0, status: '离线' }
      ],
      dialogFormVisible: false,
      dialogFormEditVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      filters: {
        name: '',
        role: '',
        email: '',
        mobile: '',
        type: '',
        createTime: []
      },
      colorder: '',
      ordering: '',
      users: [],
      // statusOptions: ['admin', 'user', 'Manager'],
      statusOptions: [],
      total: 0,
      page: 1,
      page_size: 20,
      sels: [], // 列表选中列
      editFormRules: {
        name: [
          { required: true, message: '尽量不要修改姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        password: [
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', validator: validateEditPassword, trigger: 'blur' }
        ]
      },
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
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    window.getUsers = this.getUsers
    document.onkeydown = keyDownSearch
    this.getUsers()
    this.getRoles()
    this.authority = store.getters.authority
    console.log('jjjjjjjjjjjjjjjjj')
    console.log(this.authority)
    console.log(this.authority.indexOf('user:add'))
    console.log(this.authority.indexOf('user:add'))
  },
  destroyed() {
    document.onkeydown = undefined
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
    sortChange(column) {
      console.log('排序', column.prop, column.order)
      this.colorder = column.prop
      this.ordering = column.order
      this.getUsers()
    },

    // 获取用户列表
    getUsers() {
      const para = {
        page: this.page,
        pagesize: this.page_size,
        name: this.filters.name,
        email: this.filters.email,
        mobile: this.filters.mobile,
        role: this.filters.role,
        type: this.filters.type,
        createTime: this.filters.createTime.toString(),
        colorder: this.colorder,
        ordering: this.ordering
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
          const params = {
            srcRole: store.getters.role,
            dstRole: row.role
          }
          getAuthorityApi(params).then(res => {
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
        })
        .catch(() => {})
    },
    handleEdit: function(index, row) {
      const params = {
        srcRole: store.getters.role,
        dstRole: row.role
      }
      getAuthorityApi(params).then(res => {
        this.dialogStatus = 'update'
        this.dialogFormEditVisible = true
        this.editForm = Object.assign({}, row)
        this.editForm.password = ''
      })
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        id: '',
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
              var temppassword = '0'
              const temp = Object.assign({}, this.editForm)
              if (temp.password.length >= 1) {
                temppassword = md5(temp.password)
              }
              // md5 加密
              const para = {
                id: temp.id,
                role: temp.role,
                name: temp.name,
                password: temppassword,
                descr: temp.descr,
                mobile: temp.mobile,
                email: temp.email
              }
              console.log(para)
              editUser(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormEditVisible = false
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
          const para = {
            ids: ids,
            role: store.getters.role
          }
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
    // getUserAuthority(role) {
    //   const params = {
    //     srcRole: store.getters.role,
    //     dstRole: role
    //   }
    //   getAuthorityApi(params).then(res => {

    //   })
    // },
    getRoles() {
      getRolesListApi().then(res => {
        this.statusOptions = res.data.items
      })
    }
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
