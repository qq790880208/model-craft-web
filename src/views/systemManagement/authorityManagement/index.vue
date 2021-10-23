<template>
  <div class="app-container">
    <div>
      <H1>权限管理</H1>
    </div>
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAddRole">新增角色</el-button>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" size="mini" element-loading-text="Loading" fit border highlight-current-row>
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="角色编码" prop="name" align="center" />
        <el-table-column label="备注" prop="remarks" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <router-link :to="'/systemManage/roleSetting/'+scope.row.roleId"> -->
            <el-button type="primary" size="mini" style="width: 100px;margin-left: 10px;margin-right: 10px;" icon="el-icon-setting" plain @click="showPremission(scope.row.id)">
              权限设置
            </el-button>
            <el-button type="danger" size="mini" style="margin-left: 10px;margin-right: 10px;" icon="el-icon-delete" plain @click="delRole(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="分配权限" :visible.sync="dialogFormVisible" @close="handleDialogClose">
        <el-tree
          ref="menuTree"
          :check-strictly="false"
          :data="menuTree"
          show-checkbox
          node-key="id"
          highlight-current
          :default-checked-keys="defaultCheckedKeysMenu"
          :props="defaultPropsMenu"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRolePermission()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogAddRoleVisible" :title="新增角色" :before-close="handleClose">
        <el-form :model="roleForm" label-width="80px" label-position="left">
          <el-form-item label="角色编码">
            <el-input v-model="roleForm.name" placeholder="角色编码" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="roleForm.remarks"
              type="textarea"
              placeholder="角色描述"
            />
          </el-form-item>
          <el-form-item label="分配权限">
            <el-tree
              ref="menuTree"
              :check-strictly="false"
              :data="menuTree"
              show-checkbox
              node-key="id"
              highlight-current
              :default-checked-keys="defaultCheckedKeysMenu"
              :props="defaultPropsMenu"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" size="mini" @click="closeDialog">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmRole">添加</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>

import { getRoles, getRoleMenuByRoleId, addRoleMenu, addNewRoleApi, delRoleApi } from '@/api/role'
import { treeMenu } from '@/api/menu'

const defaultRole = {
  key: '',
  name: '',
  remarks: '',
  routes: []
}

export default {
  data() {
    return {
      roleForm: Object.assign({}, defaultRole),
      roleid: '',
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogAddRoleVisible: false,
      defaultCheckedKeysMenu: [],
      menuList: [],
      menuTree: [],
      // 格式化后端传过来的数据为vue树所需参数
      defaultPropsMenu: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
    this.getMenuTabData()
  },
  methods: {
    handleNodeClick(data) {
    },
    handleClose() {
      this.$confirm('确认关闭？').then(_ => {
        this.dialogAddRoleVisible = false
        // this.defaultCheckedKeysMenu = []
        // this.$refs.tree.setCheckedNodes([])
        this.roleForm = Object.assign({}, defaultRole)
      }).catch(_ => {})
    },
    handleAddRole() {
      this.dialogAddRoleVisible = true
      this.defaultCheckedKeysMenu = []
      this.$nextTick(() => {
        this.$refs.menuTree.setCheckedKeys([])
      })
      // this.$refs.tree.setCheckedNodes([])
    },
    closeDialog() {
      this.dialogAddRoleVisible = false
      this.defaultCheckedKeysMenu = []
      this.roleForm = Object.assign({}, defaultRole)
    },
    confirmRole() {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          var selectedIds = this.$refs.menuTree.getCheckedKeys()
          var menuids = selectedIds.toString()
          const params = {
            name: this.roleForm.name,
            remarks: this.roleForm.remarks,
            menuids: menuids
          }
          console.log('vvvvvvvvvvvvvv')
          console.log(params)
          addNewRoleApi(params).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.getList()
            this.dialogAddRoleVisible = false
            this.defaultCheckedKeysMenu = []
            this.roleForm = Object.assign({}, defaultRole)
            const that = this
            that.$nextTick(() => {
              that.$refs.tree.setCheckedKeys([])
            })
          })
        })
    },
    getList() {
      this.listLoading = true
      getRoles().then(res => {
        this.list = res.data.items
        this.listLoading = false
      })
    },
    getMenuTabData() {
      treeMenu().then(res => {
        this.menuList = res.data.menuList
        this.menuTree = res.data.menuTree
      })
    },
    handleDialogClose() {
      this.dialogFormVisible = false
      this.defaultCheckedKeysMenu = []
    },
    showPremission(id) {
      this.dialogFormVisible = true
      this.roleid = id
      var params = {
        id: id
      }
      getRoleMenuByRoleId(params).then(res => {
        var data = res.data.items
        if (data && data.length > 0) {
          console.log(data)
          data.map((item) => {
            this.defaultCheckedKeysMenu.push(item.id)
          })
          this.$refs.menuTree.setCheckedKeys(this.defaultCheckedKeysMenu)
        }
      })
    },
    delRole(id) {
      this.$confirm('确定要删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: id
        }
        delRoleApi(params).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.getList()
        })
      })
    },
    fresh() { // 刷新
      location.reload()
    },
    setRolePermission() {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          var selectedIds = this.$refs.menuTree.getCheckedKeys()
          var menuids = selectedIds.toString()
          console.log('nmnmnmnmnmnmnmnm')
          console.log(selectedIds)
          var params = {
            roleid: this.roleid,
            menuids: menuids
          }
          console.log('ccccccccccccccccc')
          console.log(params)
          // this.getList()
          // this.dialogFormVisible = false
          // this.defaultPropsMenu = []
          addRoleMenu(params).then(res => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.getList()
            this.dialogFormVisible = false
            this.$nextTick(() => {
              this.$refs.menuTree.setCheckedKeys([])
            })
            // this.defaultCheckedKeysMenu = []
            // this.$refs.tree.setCheckedNodes([])
            this.fresh()
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  padding: 15px 50px 30px 15px;
}
.table-container{
  padding: 15px 0px 0px 0px;
}
</style>
