<template>
  <div class="app-container">
    <div class="header">
      <div class="title">
        <!-- <span>{{store.getters.dataSet.name}}</span> -->
<<<<<<< HEAD
        <span>{{ name }}</span>
=======
        <span>{{ this.name }}</span>
>>>>>>> dev
        <el-button class="titlebutton" size="small" style="margin-left:100px; border: 0px" icon="el-icon-arrow-left" @click="toDataList">
          返回数据集
        </el-button>
      </div>
      <div class="buttonlist">
        <el-button type="primary" plain size="mini" @click="toStartAudit">开始审核</el-button>
        <el-button type="primary" plain size="mini" @click="batchSave">批量通过</el-button>
        <el-button type="primary" plain size="mini" @click="batchReject">批量不通过</el-button>
        <el-button type="primary" plain size="mini" @click="batchReSet">批量重置</el-button>
      </div>
    </div>
    <el-divider class="divider2" />
    <div class="content">
      <el-tabs style="height: 200px;">
        <el-tab-pane label="全部数据">
          <el-container>
            <el-main>
              <div
                v-for="(item, index) in imageArry"
                :key="index"
                class="dataList"
                style="
                float:left;
                margin-left:20px
                margin-top:20px
                "
              >
                <!-- :parentSelectList="selectList" -->
                <myimage
                  :fatherimagesrc="item.url"
                  :ismarked="item.isAudit"
                  :parent-select-list="selectList"
                  :parent-uuid="item.uuid"
                  @select="select(item.uuid)"
                  @childSelectList="fromChildList($event)"
                />
                <!-- <div>
                                    <el-button type="mini"> 通过 </el-button>
                                    <el-button type="mini"> 不通过 </el-button>
                                    <el-button type="mini"> 重置 </el-button>
                                </div> -->
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getAuditDatasByUserId, batchSaveApi, batchRejectApi, batchReSetApi } from '@/api/audit'
import store from '@/store'
import myimage from '@/components/imageaudit.vue'

export default {
  components: {
    myimage
  },
  data() {
    return {
      name: '',
      imageArry: [],
      showData: [],
      selectList: []
    }
  },
  mounted() {
    this.getAuditDataList()
    this.name = store.getters.dataSet.name
  },
  methods: {
    select(index) {
      console.log('55555555555555555555555')
      console.log('我是父组件')
      console.log(this.selectList)
    },
    fromChildList(vara) {
      this.selectList = vara
    },
    toDataList() {
      this.$router.push('/data')
      // this.$router.push({path: '/dataSet/2DauditPre'})
    },
    toStartAudit() {
      this.$router.push({path: '/dataSet/2DauditPre'})
    },
    batchSave() {
      console.log(this.selectList.join(','))
      const params = {
        labelUuids: this.selectList.join(',')
      }
      batchSaveApi(params).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getAuditDataList()
        this.selectList = []
      })
    },
    batchReject() {
      console.log(this.selectList.join(','))
      const params = {
        labelUuids: this.selectList.join(',')
      }
      batchRejectApi(params).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getAuditDataList()
        this.selectList = []
      })
    },
    batchReSet() {
      console.log(this.selectList.join(','))
      const params = {
        labelUuids: this.selectList.join(',')
      }
      batchReSetApi(params).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getAuditDataList()
        this.selectList = []
      })
    },
    getAuditDataList() {
      this.imageArry = []
      let _this = this
      const params = {
        dataSetUuid: store.getters.uuid,
        userId: store.getters.userid
      }
      console.log(params)
      getAuditDatasByUserId(params).then(res => {
        this.showData = res.data.items
        for (let i = 0; i < res.data.items.length; i++) {
          let a = {}
          a['uuid'] = res.data.items[i].uuid // label的uuid
          a['url'] = res.data.items[i].file_path
          a['isAudit'] = res.data.items[i].is_audit
          _this.imageArry.push(a)
        }
      })
    }
  }
}
</script>

<style scoped>
.divider2{
  margin: 32px 0px 5px 0px;
}
.buttonlist{
  float: right;
  padding: 0px 20px 0px 0px ;
}
.content {
  margin: 5px 15px 10px 20px;
  height: 650px;
}
.title{
  padding: 0px 20px 0px 20px;
}
</style>