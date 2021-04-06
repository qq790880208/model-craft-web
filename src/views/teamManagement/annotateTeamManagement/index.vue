<template>
  <div class="app-container">
    <el-container>
      <el-aside width="200px">
        <el-header style="text-align:left">
          <span class="team_manage"> 标注团队管理 </span>
        </el-header>
        <el-row>
          <el-button type="primary" size="small" :disabled="isRole !=='admin'" @click="handleAdd">新增团队</el-button>
          <el-button type="danger" size="small" :disabled="isRole !=='admin'" @click="handleDelete()">Del</el-button>
        </el-row>
        <el-table :data="teamsList" style="width: 100%;" fit> <!--@mouseover="mouseOn()" @mouseleave="mouseGo()" @row-click="openDetails(scope.$index, scope.row)-->
          <!-- <el-table-column align="center" label="Team Name" width="200">
            <template slot-scope="scope">
              <span class="link-type" @click="openDetails(scope.$index, scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column> -->
          <el-table-column align="left" width="200">
            <template slot="header" slot-scope="scope">   <!-- slot-scope="scope" -->
              <span>创建了<span style="font-size:20px"> {{ teamsList.length }} </span>个团队</span>
            </template>
            <template slot-scope="scope">
              <span class="link-type" @click="openDetails(scope.$index, scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <span class="team_data">团队详情</span>
          <el-dropdown>
            <i class="el-icon-setting" style="text-align: left">使用指南</i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="showUseGuidance">查看</el-dropdown-item>
              <el-dropdown-item @click.native="showManage">联系</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <el-col style="font-size: 15px">
            <table width="600" @click="mouseOver">
              <tr>
                <td width="350">
                  <span style="float: left">团队名称：</span>
                  <div v-if="flag">
                    <div style="float: left">{{ selectTeam.name }}</div>
                  </div>
                  <div v-else>
                    <input v-model="selectTeam.name" type="text" style="float: left">
                  </div>
                </td>
                <td width="250">
                  <span style="float: left">团队成员：</span> <span>{{ rolesList.length }}</span>
                </td>
              </tr>
              <tr>
                <td width="350">
                  <span style="float: left">团队信息：</span>
                  <div v-if="flag">
                    <div style="float: left">{{ selectTeam.descr }}</div>
                  </div>
                  <div v-else>
                    <input v-model="selectTeam.descr" style="float: left">
                  </div>
                </td>
                <td width="250">
                  <span style="float: left">创建时间：</span> <span>{{ selectTeam.create_time | formatDate }}</span>
                </td>
              </tr>
            </table>
          </el-col>
          <el-col>
            <el-button type="primary" style="float:left;" size="small" :disabled="isRole !=='admin' && idLabel !=='TeamManager'" @click="handleAddUser">新增成员</el-button>
            <el-button type="primary" style="float:left;" size="small" :disabled="isRole !=='admin' && idLabel !=='TeamManager'" @click="mouseLeave">保存编辑</el-button>
          </el-col>
          <el-table class="teamUser" :data="rolesList" style="width: 100%;" border @selection-change="selChange">
            <el-table-column type="selection" width="55" :disabled="isRole !=='admin' && idLabel !=='TeamManager'" />
            <el-table-column align="center" label="Role Key" width="120">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Role Name" width="120">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="标注角色" width="120">
              <template slot-scope="scope">
                {{ scope.row.label_role }}
              </template>
            </el-table-column>
            <el-table-column align="header-center" label="Description">
              <template slot-scope="scope">
                {{ scope.row.descr }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Operations">
              <template slot-scope="scope">
                <el-button type="primary" size="small" :disabled="isRole !=='admin' && idLabel !=='TeamManager'" @click="handleEditUser(scope.$index, scope.row)">Edit</el-button>
                <el-button type="danger" size="small" :disabled="isRole !=='admin' && idLabel !=='TeamManager'" @click="handleDeleteUser(scope.$index, scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="tool-bar">
            <el-button type="danger" :disabled="seles.length===0 || isRole !=='admin' && idLabel !=='TeamManager'" style="float: left" @click="batchRemove">批量删除</el-button>
            <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="rolesList.length" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </el-col>
        </el-main>
      </el-container>
    </el-container>

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
        <el-form-item label="名字" prop="name">
          <el-input v-model="editFormUser.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="character">
          <!--<el-input v-model="editFormUser.character" auto-complete="off" />-->
          <el-select v-model="editFormUser.character" class="filter-item" placeholder="Please select">
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
import { getTeamPerm } from '@/api/userManage'
import store from '@/store'

export default {
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
    }
  },
  data() {
    return {
      isRole: store.getters.role,
      seen: 'false',
      selectTeamId: '',
      showClickIcon: false,
      listLoading: true,
      flag: 'true',
      nowDateTime: '',
      total: 0,
      page: 1,
      page_size: 10,
      seles: [],
      selectTeam: [],
      teamsList: [],
      rolesList: [],
      statusOptions: ['Label', 'TeamManager'],
      idLabel: '',
      dialogStatus: '',
      dialogStatusUser: '',
      dialogFormVisible: false,
      dialogFormVisibleUser: false,
      editForm: {
        name: '',
        descr: ''
      },
      editFormUser: {
        name: '',
        character: '',
        descr: ''
      },
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      editFormRulesUser: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
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
    edit() {
      this.flag = false
    },
    mouseOn: function() {
      this.seen = true
    },
    mouseGo: function() {
      this.seen = false
    },
    mouseOver: function() {
      if (this.isRole !== 'admin' || this.idLabel !== 'TeamManager') {
        this.flag = true
      } else {
        this.flag = false
      }
    },
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
    getTeamsList: function() {
      const para = {
        name: store.getters.name,
        id: store.getters.userid
      }
      getTeams(para).then(response => {
        this.teamsList = response.data.items
      })
    },
    handleSizeChange(val) {
      this.page_size = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    getUsers: function() {
      const para = {}
      para.id = this.selectTeam.id
      para.name = this.selectTeam.name
      para.page = this.page
      para.pagesize = this.page_size
      console.log(para)
      getTeamsUserPage(para).then(response => {
        this.total = response.data.total
        this.rolesList = response.data.items
      })
    },
    /* 显示团队的信息 */
    openDetails: function(index, row) {
      this.flag = true
      this.idLabel = ''
      this.selectTeam = Object.assign({}, row)
      this.selectTeam.descr = this.teamsList[index].descr
      console.log(index)
      console.log(this.selectTeam)
      this.selectTeamId = this.selectTeam.id
      const paras = {
        team_id: this.selectTeamId,
        user_id: store.getters.userid
      }
      console.log(paras)
      getTeamPerm(paras).then(res => {
        this.idLabel = res.data.items.label_role
      })
      console.log(this.idLabel)
      this.getUsers()
    },
    updateData: function() {
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
          })
        })
      console.log(index, row)
    },
    /* 添加用户数据 */
    handleAddUser: function() {
      this.dialogStatusUser = 'create'
      this.dialogFormVisibleUser = true
      this.editFormUser = {
        name: '',
        character: '',
        descr: ''
      }
    },
    /* edit 用户数据 */
    handleEditUser: function(index, row) {
      this.dialogStatusUser = 'update'
      this.dialogFormVisibleUser = true
      this.editFormUser = Object.assign({}, row)
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
                character: temp.character
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
              const para = Object.assign({}, this.editFormUser)
              para.team = this.selectTeam.id
              console.log(222222222222222222222)
              console.log(para)
              addUser(para).then(res => {
                this.message({
                  message: '提交成功',
                  type: 'success'
                })
              })
              this.dialogFormVisibleUser = false
              this.getUsers()
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
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #fcfcfc;
    color: #333;
    text-align: center;
    /*line-height: 400px;*/
  }

  .el-main {
    background-color: #fcfcfc;
    color: #333;
    text-align: center;
    /*line-height: 360px;*/
  }

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
    background: red;
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
  .team_manage{
    font-size: 25px;
    float: left;
  }
  // .teamUser{
  //   margin-top: 10px;
  // }
</style>
