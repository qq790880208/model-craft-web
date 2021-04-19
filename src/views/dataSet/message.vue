<template>
  <div class="app-container">
    <div class="header">
      <div class="title">
        <span>{{this.$route.query.dataName}}</span>
        <el-button size="small" style="margin-left:100px" icon="el-icon-arrow-left" @click="toDataSet">
          返回数据集
        </el-button>
      </div>
    </div>
    <div class="main">
      <div class="buttonlist">
        <el-button type="success" plain size="mini" @click="toStartLabel(scope.row.label_type)">开始标注</el-button>
        <el-button type="primary" plain size="mini" @click="showTeamDialog(scope.$index, scope.row)">添加标注团队</el-button>
        <el-button size="mini">修改</el-button>
      </div>
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="概览" name="first">
            <div class="datail">
              <table style = "border-collapse:separate; border-spacing:15px;">
                <tr>
                  <td>
                    <span>
                      标注类型
                    </span>
                  </td>
                  <td>
                    <span>
                      图像分类
                    </span>
                  </td>
                  <td>
                    <span>
                      版本
                    </span>
                  </td>
                  <td>
                    <span>
                      --
                    </span>
                  </td>
                  <td>
                    <span>
                      创建时间
                    </span>
                  </td>
                  <td>
                    <span>
                      2222222222222
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>
                      数据集输入位置
                    </span>
                  </td>
                  <td>
                    <span>
                      /ww/ww/ww
                    </span>
                  </td>
                  <td>
                    <span>
                      数据集输出位置
                    </span>
                  </td>
                  <td>
                    <span>
                      /ww/ee/rr
                    </span>
                  </td>
                  <td>
                    <span>
                      描述
                    </span>
                  </td>
                  <td>
                    <span>
                      2789
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="label" style=" margin: 20px 5px 5px 20px">
              <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :lg="8">
                  <div class="speed">
                    9999
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="8">
                  <div class="chart-wrapper">
                    888888
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="8">
                  <div class="chart-wrapper">
                    7777777777
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import table from '../newtrain/table.vue';

export default {
  components: { table },
  name: 'Dashboard',
  data() {
    return {
      message: 'hhhh',
      activeName: 'first'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {

    // tabs 切换
    handleClick(tab, event) {
      console.log(tab, event);
    },

    // 
    toDataSet: function() {
      this.$router.push('/data')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 5px 20px 20px 15px;
}
</style>
