<template>
  <div>
    <el-table :data="dataSets" highlight-current-row style="width: 100%;">
      <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
        <template slot-scope="scope">
          <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.type)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" align="center" label="标注类型" min-width="120" sortable>
        <template slot-scope="scope">
          {{ scope.row.label_type | formatType }}
        </template>
      </el-table-column>
      <el-table-column prop="done" align="center" label="标注进度" min-width="260" sortable>
        <template slot-scope="scope">
          <div style="width: 250px; margin:0px auto;">
            <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" :format="format">
            </el-progress>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
        <template slot-scope="scope">
          {{ scope.row.create_time | formatDate }}
         </template>
      </el-table-column>
      
    </el-table>

    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>
  </div>

</template>

<script>

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.find {
  position: right;
}
</style>