<template>
  <div class="app-container">
    <div class="header">
      <span class="title">
        标注团队
      </span>
    </div>
    <div class="content">
      <div class="left">
        <div class="button">
          <el-row>
            <!-- <el-button type="primary" plain size="mini" :disabled="isRole !=='admin'" @click="handleAdd()">新增团队</el-button> -->
            <el-button type="primary" plain size="mini" @click="handleAdd()">新增团队</el-button>
            <el-button type="danger" plain size="mini" @click="handleDelete()">删除</el-button>
          </el-row>
        </div>
        <div class="teamNum">
          <span>团队列表</span>
        </div>
        <div class="teamdata">
          <div class="list">
            <div class="teamList" v-for="item in teamsList" v-bind:key="item.id"
              @click="openDetails(item)" 
              >
              <el-card class="box-card" v-bind="item"
              :style="{ border: '1px solid ' + markcolor(item.id) 
                      }"
                      >
                <div slot="header">
                  <span>{{ item.name }}</span>
                </div>
                <div>
                  <i class="el-icon-user"> {{item.nums}} </i> <span style="float: right"> <i class="el-icon-date"> {{item.create_time | formatDate}}</i> </span> 
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="teamTitle">
          <span>
            团队详情
          </span>
        </div>
        <div class="teamMssage">
          <table style = "border-collapse:separate; border-spacing:10px;">
            <tr class="teamTr">
              <td width="350">
                <span style="float: left">团队名称：</span>
                <span>{{ selectTeam.name }} </span>
              </td>
              <td width="250">
                <span style="float: left">团队成员：</span>
                <span> {{ userTotal}} </span>
              </td>
            </tr>
            <tr>
              <td width="250">
                <span style="float: left">创建时间：</span> <span>{{ selectTeam.create_time | formatDate }}</span>
              </td>
              <td width="350">
                <span style="float: left">团队信息：</span>
                  <div v-if="flag">
                    <div style="float: left">{{ selectTeam.descr }}</div>
                  </div>
                  <div v-else>
                    <input class="teamDescr" type="text" v-model="selectTeam.descr" style="float: left">
                  </div>
                  <div>
                    <el-button class="edit" size="mini" icon="el-icon-edit" @click="editClick"></el-button>
                  </div>
                </td>
            </tr>
          </table>
        </div>
        <el-row>
          <div class="teamuserButton">
            <!-- <el-button type="primary" style="float:left;" size="mini" plain :disabled="idLabel !=='团队管理员'" @click="handleAddUser">新增成员</el-button> -->
            <el-button type="primary" style="float:left;" size="mini" plain :disabled="idLabel !=='团队管理员'" @click="handleAddUser">新增成员</el-button>
            <el-button type="danger" size="mini" plain :disabled="seles.length===0 || idLabel !=='团队管理员'" style="float: left" @click="batchRemove">批量删除</el-button>
          </div>
        </el-row>
        <div class="teamUserMessage">
          <el-table class="showuser" :data="rolesList"
            style="width: 100%; font-size: 10px" border
            @selection-change="selChange"
            :cell-style="{padding: '8px'}">
            <el-table-column type="selection" align="center" width="60" :disabled=" idLabel !=='团队管理员'" />
            <el-table-column align="center" label="用户名字" show-overflow-tooltip width="130" sortable>
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="角色" show-overflow-tooltip width="130" sortable>
              <template slot-scope="scope">
                {{ scope.row.label_role }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="邮箱" show-overflow-tooltip min-width="140" sortable>
              <template slot-scope="scope">
                {{scope.row.email}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="描述" show-overflow-tooltip min-width="150" sortable>
              <template slot-scope="scope">
                {{ scope.row.descr }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" show-overflow-tooltip width="120" sortable>
              <template slot-scope="scope">
                {{ scope.row.create_time | formatDate}}
              </template>
            </el-table-column>
            <el-table-column align="left" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button class="me" size="mini" :disabled="idLabel !=='团队管理员'" @click="handleEditUser(scope.$index, scope.row)">编辑</el-button>
                <el-button class="me" size="mini" :disabled="idLabel !=='团队管理员'" @click="handleDeleteUser(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="tool-bar">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" 
            :page-size="page_size" 
            :page-sizes="[2,3,4, 10, 12, 15]"
            :total="userTotal" style="float: right" 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" />
          </el-col>
        </div>
      </div>
    </div>

    <!--团队编辑界面-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item label="名字" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.descr" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click.native="dialogFormVisible=false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createTeam">添加</el-button>
        <el-button v-else type="primary" @click="dialogFormVisible=false, updateData">修改</el-button>
      </div>
    </el-dialog>

    <!--用户编辑界面-->
    <el-dialog :title="textMap[dialogStatusUser]" :visible.sync="dialogFormVisibleUser" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editFormUser" label-width="80px" :rules="editFormRulesUser">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormUser.email" placeholder="请输入邮箱" :disabled="dialogStatusUser === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="label_role">
          <el-select v-model="editFormUser.label_role" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editFormUser.descr" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click.native="dialogFormVisibleUser=false">取消</el-button>
        <el-button v-if="dialogStatusUser=='create'" type="primary" @click="createUser">添加</el-button>
        <el-button v-else type="primary" @click="updateDataUser">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTeams, delTeams, addTeams, editTeams } from '@/api/team'
import { addUser, batchDelUser, delUser, editUser, getTeamsUserPage } from '@/api/teamUser'
import { getTeamPerm, getAllUser } from '@/api/userManage'
import store from '@/store'
//import table from '@/views/newtrain/table.vue'

export default {
  //components: { table },
  //name: 'Dashboard',
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
    //验证邮箱的规则
    const checkEmail = (rule,value,cb) =>{
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(regEmail.test(value)){
        //合法的邮箱
        return cb()
      }
      cb(new Error("请输入合法的邮箱"))
    }
    return {
      isRole: store.getters.role,
      selectTeamId: '',
      flag: 'true',
      nowDateTime: '',
      total: 0,
      page: 1,
      page_size: 10,
      seles: [],
      selectTeam: [],
      teamsList: [],
      rolesList: [],
      userTotal: 0,
      statusOptions: [ '标注员', '团队管理员','审核员','验收员'],
      idLabel: '',
      dialogStatus: '',
      dialogStatusUser: '',
      dialogFormVisible: false,
      dialogFormVisibleUser: false,
      options: [], // 所有用户
      editForm: {
        email: '',
        descr: ''
      },
      editFormUser: {
        email: '',
        label_role: '',
        descr: ''
      },
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      editFormRulesUser: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userid'
    ])
  },
  created() {
    this.getTeamsList()
  },
  methods: {
    markcolor(id){
        if(id === this.selectTeamId) return 'blue'
        else return 'white'
    },
    edit() {
      this.flag = false
    },
    editClick() {
      this.flag = ! this.flag
      if(this.flag) {
        const params = {
          id: this.selectTeam.id,
          descr: this.selectTeam.descr
        }
        editTeams(params).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.getTeamsList()
        })
      }
    },
    mouseOver: function() {
      if (this.isRole !== 'admin' || this.idLabel !== '团队管理员') {
        this.flag = true
      } else {
        this.flag = false
      }
    },
    // 保存编辑
    mouseLeave: function() {
      this.flag = true
      // const para = Object.assign({}, this.selectTeam)
      const para = {}
      para.descr = this.selectTeam.descr
      para.name = this.selectTeam.name
      para.id = this.selectTeam.id
      console.log(para)
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          editTeams(para).then(res => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.getTeamsList()
          })
        })
    },

    // 得到团队列表
    getTeamsList: function() {
      const para = {
        name: store.getters.name,
        id: store.getters.userid
      }
      getTeams(para).then(response => {
        this.teamsList = response.data.items
      })
    },

    // 分页
    handleSizeChange(val) {
      this.page_size = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },

    // 得到team的用户
    getUsers: function() {
      const para = {}
      para.id = this.selectTeam.id
      para.name = this.selectTeam.name
      para.page = this.page
      para.pagesize = this.page_size
      console.log(para)
      getTeamsUserPage(para).then(res => {
        this.rolesList = res.data.items
        this.userTotal = res.data.total

      })
    },

    /* 显示团队的信息 */
    openDetails: function(row) {
      this.selectTeamId = row.id
      this.flag = true
      this.idLabel = ''
      this.selectTeam = Object.assign({}, row)
      console.log(this.selectTeam)
      const params = {
        team_id: this.selectTeamId,
        user_id: store.getters.userid
      }
      console.log(params)
      getTeamPerm(params).then(res => {
        this.idLabel = res.data.items.label_role
      })
      console.log(this.idLabel)
      this.getUsers()
    },
    handleAdd: function() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        name: '',
        descr: ''
      }
    },
    handleEdit: function(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
    
    },

    // 删除团队
    handleDelete: function() {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: this.selectTeamId }
          console.log(para)
          delTeams(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTeamsList()
          })
        })
        .catch(() => {})
    },

    // 删除团队用户
    handleDeleteUser: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          para.teamid = this.selectTeam.id
          console.log(para)
          delUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
            this.getTeamsList()
          })
        })
      console.log(index, row)
    },

    /* 添加用户数据 */
    handleAddUser: function() {
      this.dialogStatusUser = 'create'
      this.dialogFormVisibleUser = true
      this.editFormUser = {
        email: '',
        label_role: '',
        descr: ''
      }
      this.getAllUserList()
    },

    // 得到所有的用户
    getAllUserList: function() {
      getAllUser().then(res => {
        this.options = res.data.items
      })
    },
    /* edit 用户数据 */
    handleEditUser: function(index, row) {
      this.dialogStatusUser = 'update'
      this.dialogFormVisibleUser = true
      console.log(row)
      this.editFormUser = Object.assign({}, row)
      console.log(this.editFormUser)
    },
    updateDataUser: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const temp = Object.assign({}, this.editFormUser)
              console.log(temp)
              const para = {
                id: temp.id,
                name: temp.name,
                descr: temp.descr,
                teamid: this.selectTeam.id,
                character: temp.label_role
              }
              console.log(para)
              editUser(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormVisibleUser = false
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
    createUser: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              console.log(this.editFormUser)
              const params = {
                email: this.editFormUser.email,
                descr: this.editFormUser.descr,
                character: this.editFormUser.label_role,
                team: this.selectTeamId
              }
              console.log(222222222222222222222)
              console.log(params)
              addUser(params).then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.getUsers()
                this.getTeamsList()
              })
              this.dialogFormVisibleUser = false
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    createTeam: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              para.createBy = store.getters.name
              para.userid = store.getters.userid
              console.log(para)
              addTeams(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.getTeamsList()
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
    selChange: function(sel) {
      this.seles = sel
    },
    batchRemove: function() {
      var ids = this.seles.map(item => item.id).toString()
      console.log(ids)
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { ids: ids }
          para.teamid = this.selectTeam.id
          console.log(para)
          batchDelUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
            this.getTeamsList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 360px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-button--goon:hover {
  background: rgb(243, 10, 10);
}
.dialog-footer{
  text-align:center
}
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
  padding: 5px 20px 20px 5px;
  background: #EEF3FF;
  float:left;
  width:100%;
}
.header {
  width:100%;
  padding: 16px 20px;
}
.header .title {
  font-size: 18px;
  font-weight: bolder;
}
.content {
  width:100%;
  padding: 0px 20px;
}
.left{
  font-size: 16px;
  width:20%;
  min-height: 760px;
  padding: 0px 2px;
  float: left;
    // position:absolute;
    // display: flex;
    // display: -webkit-flex;
    // align-items:center;
    // color: #008cff;
  border-right:1px solid #b7d1f8;
}
.left .button {
  margin-left: 12px;
}
.left .teamNum {
  margin: 20px 0 10px 0px;
}
::v-deep .el-card__header {
  padding: 8px 18px;
  margin-left: 0px;
  border-bottom: 1px solid #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
::v-deep .el-card__body {
    padding: 6px 18px;
}
.box-card {
  border: 1px solid #faf4f4;
}

.teamList {
  font-size: 14px;
  padding: 2px 8px 2px 0px;
  margin: 2px 5px 2px 0px;
}
.el-card__body {
    padding: 10px;
}
.right{
  float: right;
  padding: 0px 5px;
  width: 79%;
}
.team_wapper {
  display: flex;
  align-items: center;
  margin-left: 40px;
}
.team_data{
  float: left;
  font-size: 25px;
}
.useManage{
  float: right;
  font-size: 20px;
}
.edit{
  background: #EEF3FF;
  border: 0px;
}
.teamTitle{
  margin: 0px 5px 5px 2px;
}
.teamMssage{
  font-size: 14px;
  margin: 5px 5px 5px 0px;
  padding: 10px 5px 10px 0px;
}
.teamDescr {
  background: #f8f8f8;
  border: 0px;
}
.teamTr{
  margin: 0px 0px 50px 0px;
}
.teamUserMessage{
  font-size: 13px;
  margin: 10px 5px 10px 0px;
}
.team_manage{
  font-size: 25px;
  float: left;
}
.me {
  border: 0px;
  color: #9B6ECF;
  padding: 2px 2px 2px 2px;
}

</style>
