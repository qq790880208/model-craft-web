<template>
  <div class="app-container">
    <!-- <el-table
      :data="teamManage"
      style="width: 90%">
      <el-table-column type="expand">
        <template>
          添加成员
          修改成员
        </template>
      </el-table-column>
      <el-table-column
        prop="name" align="center" width="200">
      </el-table-column>
      <el-table-column
        prop="remark" align="center" width="200">
      </el-table-column>
      <el-table-column
        prop="description" align="center" width="200">
      </el-table-column>
    </el-table>

    <el-table
      :data="Label"
      style="width: 90%">
      <el-table-column type="expand">
        <template>
          查看所属团队
        </template>
      </el-table-column>
      <el-table-column
        prop="name" align="center" width="200">
      </el-table-column>
      <el-table-column
        prop="remark" align="center" width="200">
      </el-table-column>
      <el-table-column
        prop="description" align="center" width="200">
      </el-table-column>
    </el-table> -->
    <div>
      <H1>权限管理</H1>
    </div>
    <!-- <el-button>hhh</el-button> -->
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" size="mini" element-loading-text="Loading" fit border highlight-current-row>
          <el-table-column label="ID" prop="id" align="center"></el-table-column>
          <el-table-column label="角色编码" prop="name" align="center"></el-table-column>
          <el-table-column label="备注" prop="remarks" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <!-- <router-link :to="'/systemManage/roleSetting/'+scope.row.roleId"> -->
                <el-button type="primary" size="mini" style="width: 100px;margin-left: 10px;margin-right: 10px;" icon="el-icon-setting" plain @click="showPremission(scope.row.id)">
                  权限设置
                </el-button>
            </template>
          </el-table-column>
      </el-table>

      <el-dialog title="分配权限" :visible.sync="dialogFormVisible" @close="handleDialogClose">
        <el-tree
          :check-strictly="true"
          :data="menuTree"
          show-checkbox
          node-key="id"
          ref="menuTree"
          highlight-current
          :default-checked-keys="defaultCheckedKeysMenu"
          :props="defaultPropsMenu">
        </el-tree>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRolePermission()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>

import { getRoles, getRoleMenuByRoleId, addRoleMenu } from '@/api/role'
import { treeMenu } from '@/api/menu'

export default {
  data() {
    return {
      roleid: '',
      list: null,
      listLoading: true,
      dialogFormVisible: false,
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
            this.defaultCheckedKeysMenu = []
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
