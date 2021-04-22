<template>
  <div class="app-container">
    <el-header>
      <span style="font-size: 20px">
        {{dataSet.name}}
      </span>
      <el-button class="titlebutton" size="small" style="margin-left:100px" icon="el-icon-arrow-left" @click="toDataSet">
        返回数据集
      </el-button>
    </el-header>
    <el-divider class="divider2"></el-divider>
    <div class="content">
      <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <el-tab-pane label="全部数据">
          <el-container>
            <el-main>
              <el-row class="buttonList">
                <el-button plain type="mini" icon="el-icon-plus" @click="addData()">添加数据</el-button>
                <el-button type="mini" icon="el-icon-delete" @click="delData()">删除数据</el-button>
                <el-button type="mini" icon="el-icon-cloudy" style="right" @click="startLabel" :style="{ display: visible}">开始标注</el-button>
              </el-row>
              <!-- @click="select(item)" -->
              <div class="dataList" v-for="(item, index) in imagelargeArry" :key="index" style="
                float:left;
                margin-left:20px
                margin-top:20px
                " >
                <myimage
                  :fatherimagesrc="item.url"
                  :ismarked="item.islabel"
                  :parentSelectList="selectList"
                  :parentUuid="item.uuid"
                  @select="select(index)"
                  @childSelectList = "fromChildList($event)"
                ></myimage>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
        <!-- <el-tab-pane label="未标注">未标注</el-tab-pane>
        <el-tab-pane label="已标注">已标注</el-tab-pane> -->
      </el-tabs>
    </div>
    <el-dialog
      title="添加数据"
      :visible.sync="addDataDialogVisible"
      width="30%"
      :before-close="handleClose">

      <!-- <div v-for="(item, index) in imagelargeArry" :key="index" style="
        float:left;
        margin-left:20px
        margin-top:20px
        " >
        <myimage 
          :fatherimagesrc="item.url"
          :ismarked="item.islabel"
          :parentSelectList="selectList"
          :parentUuid="item.uuid"
          @select="select(index)"
          @childSelectList = "fromChildList($event)"
        ></myimage>
      </div> -->

      <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%;"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="path"
      label="地址"
      show-overflow-tooltip>
    </el-table-column>
  </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabel, deleteData, addNewLabels, assignNewData, getNewFile } from '@/api/data'
import store from '@/store'
import myimage from '@/components/myimage.vue'

export default {
  name: 'Dashboard',
  data() {
    return {
      visible: '',
      message: '',
      addDataDialogVisible: false,
      urls: [],
      tableData: [],
      doneurls: [],
      undoneurls: [],
      //存储图片url,是否已标注等信息的数组，用于获取远程图片信息
      imagelargeArry:[],
      selectList: [],
      multipleSelection: [],
      newPaths: []  //新的文件路径
    }
  },
  components:{
    myimage
  },
  computed: {
    ...mapGetters([
      'name',
      'dataSet'
    ])
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.uuid).toString()
      console.log('sssssssssssss')
      console.log(this.multipleSelection)
    },
    select(index) {
      console.log('55555555555555555555555')
      console.log('我是父组件')
      console.log(this.selectList)
    },
    fromChildList(vara) {
      this.selectList = vara;
    },
    delData() {
      let uuidss = this.selectList.join(",");
      const params = {
        uuids: uuidss
      }
      console.log('uuuuuuuuuu')
      console.log(params)
      deleteData(params).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      })
    },
    addData() {
      this.addDataDialogVisible = true
      const params = {
        dataSetUuid: store.getters.uuid,
      }
      getNewFile(params).then(res => {
        this.tableData = res.data.items
      })
    },
    add() {
      console.log(this.multipleSelection)
      const params = {
        dataSetUuid: store.getters.uuid,
        fileUuids: this.multipleSelection
      }
      console.log(params)
      addNewLabels(params).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.getData()
        const newparams = {
        datasetuuid: store.getters.uuid
        }
        assignNewData(newparams).then(res => {
          this.$message({
            message: '成功',
            type: 'success'
          })
        })
      })
      this.addDataDialogVisible = false
    },
    cancel() {
      this.addDataDialogVisible = false
      this.tableData = []
      this.multipleSelection = []
    },
    toDataSet: function() {
      this.$router.push('/data')
    },
    getData: function() {
      this.imagelargeArry = []
      let _this = this;
      const params = {
        datasetuuid: store.getters.uuid
      }
      getLabel(params).then(response => {
        console.log("response",response)
        for (let i = 0; i < response.data.items.length; i++) {
          let a={};
          a["uuid"] = response.data.items[i].uuid  // label的uuid
          a["url"]=response.data.items[i].file_path
          a["islabel"]=response.data.items[i].is_label
          //a["index"]=i
          _this.imagelargeArry.push(a);
        }
      }) 
    },
    startLabel: function() {
      const type = store.getters.type
      if(type == 0) {
        this.$router.push('/label/d2imageview')
      }
      if(type == 1) {
        this.$router.push({path:'/label/polygonimageview'})
      }
      if(type == 2) {
        this.$router.push({path:'/label/d3'})
      }
      if(type == 3) {
        this.$router.push({path:'/label/voice'})
      }
    }
  },
  mounted() {
    this.getData()
    if(dataSet.role_type === 2) {
      this.visible = 'none'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 50px;
  }
}
.el-container {
  height: 600px;
}
.el-main{
  padding: 5px 10px 10px 10px;
}
.el-header {
    font: 20px;
    background-color: #EEF3FF;
    color: rgb(14, 13, 13);
    line-height: 60px;
}
.titlebutton{
  border: #EEF3FF;
  background: #EEF3FF;
}
.divider2{
  margin: 0px 20px 1px 20px;
}
.main {
  margin-left: 50px;
}
.content {
  margin: 5px 15px 10px 20px;
  height: 650px;
}
.buttonList {
  margin: 5px 10px 5px 10px ;
}
.dataList{
  margin: 5px 10px 0px 10px;
  padding: 1px 0px 2px 1px;
}
</style>
