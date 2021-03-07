<template>
  <div class="app-container">
    <el-container>
      <el-aside width="240px">
        <el-header style="text-align: right; font-size: 12px">
          <i class="team_manage"> 标注团队管理 </i>
        </el-header>
        <el-row :gutter="20">
          <el-button type="primary" @click="handleAdd">新增团队</el-button>
          <p>创建了{{teamsList.length}}个团队</p>
        </el-row>
        <el-table :data="teamsList" border @row-click="openDetails()">  <!--el-table-column-->
          <el-table-column align="center" label="Team Name" width="60" @click="handleAdd">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="成员数量" width="80" @click="handleAdd">
            <template slot-scope="scope">
              {{ scope.row.nums }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Operations" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <span class="team_data">团队详情</span>
          <el-dropdown >
            <i class="el-icon-setting" style="text-align: left"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="useManage">使用指南</span>
        </el-header>
        <el-main>
          <el-table :data="rolesList" style="width: 100%;" border>
            <el-table-column align="center" label="Role Key" width="220">
              <template slot-scope="scope">
                {{ scope.row.key }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Role Name" width="220">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="header-center" label="Description">
              <template slot-scope="scope">
                {{ scope.row.description }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Operations">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
                <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <!--编辑界面-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="名字" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="dialogFormVisible=false">添加</el-button>
        <el-button v-else type="primary" @click="dialogFormVisible=false">修改</el-button>
        <el-button type="danger" @click.native="dialogFormVisible=false">取消</el-button>
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
      teamsList: [
        { name: 'blue', nums: '20' },
        { name: 'red', nums: '20' },
        { name: 'black', nums: '20' }
      ],
      rolesList: [
        { key: '1', name: 'kobe', description: 'wwwww' },
        { key: '1', name: 'kobe', description: 'wwwww' },
        { key: '1', name: 'kobe', description: 'wwwww' },
        { key: '1', name: 'kobe', description: 'wwwww' },
        { key: '1', name: 'kobe', description: 'wwwww' },
        { key: '2', name: 'james', description: 'dddddd' }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      editForm: {
        name: '',
        addr: ''
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleAdd: function() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = 'true'
      this.editForm = {
        name: '',
        addr: ''
      }
    },
    openDetails: function() {
      this.rolesList = [
        { key: '2', name: 'james', description: 'dddddd' },
        { key: '2', name: 'james', description: 'dddddd' }
      ]
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
