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
            <el-button type="primary" plain size="small" :disabled="isRole !=='admin'" @click="handleAdd()">新增团队</el-button>
            <el-button type="danger" plain size="small" :disabled="isRole !=='admin'" @click="handleDelete()">删除</el-button>
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
              :style="{ border: '1px solid ' + markcolor(item.id) }">
                <div slot="header">
                  <span>{{ item.name }}</span>
                </div>
                <div>
                  <i class="el-icon-user"> 1 </i> <span style="float: right"> {{item.create_time | formatDate}} </span> 
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
      <div class="right">

        <h1>
        右面
        </h1>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTeams, delTeams, addTeams, editTeams } from '@/api/team'
import { addUser, batchDelUser, delUser, editUser, getTeamsUserPage } from '@/api/teamUser'
import { getTeamPerm, getAllUser } from '@/api/userManage'
import store from '@/store'
import table from '@/views/newtrain/table.vue'

export default {
  components: { table },
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
      options: [], // 所有用户
      editForm: {
        name: '',
        descr: ''
      },
      editFormUser: {
        email: '',
        character: '',
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
        update: '编辑',
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
    ]),
    boardColer(id) {
      if (id == this.selectTeamId) {
        return 'blue'
      } else {
        return 'white'
      }
    }
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
      getTeamsUserPage(para).then(response => {
        this.total = response.data.total
        this.rolesList = response.data.items
      })
    },

    /* 显示团队的信息 */
    openDetails: function(row, event, column) {
      console.log(row.id)
      this.selectTeamId = row.id
      this.flag = true
      this.idLabel = ''
      this.selectTeam = Object.assign({}, row)
      console.log(selectTeam)
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
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.getUsers()
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
  padding: 20px 20px 20px 5px;
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
  min-height: 660px;
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
  .team_manage{
    font-size: 25px;
    float: left;
  }
  // .teamUser{
  //   margin-top: 10px;
  // }
</style>
