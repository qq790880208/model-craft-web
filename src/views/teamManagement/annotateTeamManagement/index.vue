<template>
  <div class="app-container">
    <el-container>
      <el-aside width="240px">
        <el-header style="text-align: right; font-size: 12px">
          <i class="team_manage"> 标注团队管理 </i>
        </el-header>
        <el-row :gutter="20">
          <el-button type="primary" @click="handleAdd">新增团队</el-button>
          <p>创建了{{ teamsList.length }}个团队</p>
        </el-row>
        <el-table :data="teamsList" border> <!-- @row-click="openDetails(scope.$index, scope.row)-->
          <el-table-column align="center" label="Team Name" width="60">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Operations" width="180">
            <template slot-scope="scope">
              <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
              <el-button type="primary" size="small" @click="openDetails(scope.$index, scope.row)">Show</el-button>
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
          <el-col style="font-size: 12px">
            <el-col>
              <table>
                <tr>
                  <td width="120">
                    <span style="float: left">团队名称：</span>
                    <li v-if='flag'>
                      <span @click='edit()'>{{ selectTeam.name }}</span>
                    </li>
                    <input type="text" v-else @change='input()' v-model="selectTeam.name">
                  </td>
                  <td width="120">
                    <span style="margin-right: 15px">团队成员：</span> <span>{{ rolesList.length }}</span>
                  </td>
                </tr>
                <tr>
                  <span style="float: left">团队信息：</span>
                  <textarea v-model="selectTeam.message" style="margin-left: 70px"></textarea>
                </tr>
              </table>
            </el-col>
            <!--<div style="float: left">
              <span>团队名称：</span>
              <li v-if='flag'>
                <span @click='edit()'>{{ selectTeam.name }}</span>
              </li>
              <input type="text" v-else @change='input()' v-model="selectTeam.name">
              &lt;!&ndash;<span>{{ selectTeam.name }}</span>&ndash;&gt;
              <span style="margin-right: 15px">团队成员：</span> <span>{{ rolesList.length }}</span>
            </div>
            <br>
            <div style="float: left">
              <span>团队信息：</span>
              <textarea v-model="selectTeam.message"></textarea>
            </div>-->
          </el-col>
          <el-col>
            <el-button type="primary" style="float:left;" @click="handleAddUser">新增成员</el-button>
          </el-col>
          <el-table :data="rolesList" style="width: 100%;" border @selection-change="selChange">
            <el-table-column type="selection" width="55" />
            <el-table-column align="center" label="Role Key" width="120">
              <template slot-scope="scope">
                {{ scope.row.key }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Role Name" width="120">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Character" width="120">
              <template slot-scope="scope">
                {{ scope.row.character }}
              </template>
            </el-table-column>
            <el-table-column align="header-center" label="Description">
              <template slot-scope="scope">
                {{ scope.row.description }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Operations">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="handleEditUser(scope.$index, scope.row)">Edit</el-button>
                <el-button type="danger" size="small" @click="handleDeleteUser(scope.$index, scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" class="tool-bar">
            <el-button type="danger" :disabled="this.seles.length===0" @click="batchRemove" style="float: left">批量删除</el-button>
            <el-pagination layout="total, sizes ,prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="rolesList.length" style="float: right"></el-pagination>
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
          <el-input v-model="editForm.addr" type="textarea" />
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
          <el-input v-model="editFormUser.character" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editFormUser.description" type="textarea" />
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

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      flag: 'true',
      nowDateTime: '',
      total: 0,
      page: 1,
      seles: [],
      selectTeam: [],
      teamsList: [
        { name: 'blue', nums: '20', message: 'hhhhh' },
        { name: 'red', nums: '20', message: 'hhhhh' },
        { name: 'black', nums: '20', message: 'hhhhh' }
      ],
      rolesList: [
        { key: '1', name: 'kobe', character: '标注员', description: 'wwwww' },
        { key: '1', name: 'kobe', character: '标注员', description: 'wwwww' },
        { key: '1', name: 'bean', character: '标注员', description: 'wwwww' },
        { key: '1', name: 'kobe', character: '标注员', description: 'wwwww' },
        { key: '1', name: 'kobe', character: '标注员', description: 'wwwww' },
        { key: '1', name: 'kobe', character: '审核员', description: 'wwwww' },
        { key: '2', name: 'james', character: '标注员', description: 'dddddd' }
      ],
      dialogStatus: '',
      dialogStatusUser: '',
      dialogFormVisible: false,
      dialogFormVisibleUser: false,
      filters: {
        name: ''
      },
      editForm: {
        name: '',
        addr: ''
      },
      editFormUser: {
        name: '',
        description: ''
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
  methods: {
    edit() {
      this.flag = false
    },
    input() {
      this.flag = true
    },
    /* 显示团队的信息 */
    openDetails: function(index, row) {
      this.selectTeam = Object.assign({}, row)
      console.log(this.selectTeam)
      this.rolesList = [
        { key: '2', name: 'james', description: 'dddddd' },
        { key: '2', name: 'james', description: 'dddddd' }
      ]
    },
    updateData: function() {
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    handleAdd: function() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        name: '',
        addr: ''
      }
    },
    handleEdit: function(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    handleDelete: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
      console.log(index, row)
    },
    handleDeleteUser: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
      console.log(index, row)
    },
    /* 添加用户数据 */
    handleAddUser: function() {
      this.dialogStatusUser = 'create'
      this.dialogFormVisibleUser = true
      this.editFormUser = {
        name: '',
        addr: ''
      }
    },
    /* edit 用户数据 */
    handleEditUser: function(index, row) {
      this.dialogStatusUser = 'update'
      this.dialogFormVisibleUser = true
      this.editFormUser = Object.assign({}, row)
    },
    getTeams: function() {
    },
    getUsers: function() {
    },
    updateDataUser: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editFormUser)
              console.log(para)
              this.dialogFormVisibleUser = false })
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
              console.log(para)
              this.dialogFormVisible = false })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    getTime: function() {
      var _this = this;
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth()+1
      let dd = new Date().getDate()
      let hh = new Date().getHours()
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes()
      /* let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds() */
      _this.nowDateTime = yy+'年 '+mm+'月'+dd+'日 '+hh+':'+mf
    },
    createTeam: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              this.getTime()
              const para = Object.assign({}, this.editForm)
              para.createTime = this.nowDateTime
              console.log(para)
              this.dialogFormVisible = false
              console.log(this.nowDateTime)
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
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          // this.listLoading = true;
          const para = { ids: ids }
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
  background-color: #E9EEF3;
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
  font-size: 15px;
  float: left;
}
</style>
