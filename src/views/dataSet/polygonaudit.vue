<template>
  <div style="user-select: none;">
    <div v-if="isimageview" class="dashboard-container">
      <div>
        <el-button type="primary" plain size="mini" @click="returndataset">返回数据集</el-button>
        <el-button type="primary" plain size="mini" @click="batchSave">批量通过</el-button>
        <el-button type="primary" plain size="mini" @click="batchRejectDialog">批量不通过</el-button>
        <el-button type="primary" plain size="mini" @click="batchReSet">批量重置</el-button>
        <span class="checkAll">
          <input type="checkbox" :checked="checkedList.length === imagelargeArry.length" @change="checkedAll()">
          <span>全选</span>
        </span>
      </div>
      <div
        v-for="(item, index) in imagelargeArry"
        :key="index"
        style="
        display:inline-block;
        margin-left:20px
      "
      >
        <div>
          <div style="margin-top:20px">
            <input type="checkbox" name="" :checked="checkedList.indexOf(item.uuid)!=-1" @change="addToList(item.uuid)">
            <!-- <el-checkbox @change="addToList(item.uuid)" v-if="item.uuid in this.checkedList" checked></el-checkbox> -->
          </div>
          <miniimage
            style="margin-top:1px"
            :fatherimagesrc="item.url"
            :ismarked="item.islabel"
            @entermark="entermark(index)"
          />
        </div>

      </div>
    </div>
    <div v-if="!isimageview" class="dashboard-container" style="margin-left:100px">
      <!-- <div class="dashboard-text">name: {{ name }}</div> -->
      <el-button :disabled="isdisablebutton" @click="returnimageview">返回图片预览</el-button>
      <el-button :disabled="isdisablebutton" @click="nextimage">下一张(N)</el-button>
      <el-button :disabled="isdisablebutton" @click="previousimage">上一张(P)</el-button>
      <!-- <el-button :disabled="isdisablebutton" @click="skipimage">跳过当前图片(Q)</el-button> -->
      <el-button @click="pass">通过(A)</el-button>
      <el-button @click="rejectDialog">驳回(D)</el-button>
      <el-button @click="reset">重置(G)</el-button>
      <drawpolygon style="margin-top:20px" ref='drawpolygonref'
        :fatherimagesrc="this.imageArry[nownum]"
        :imageindex="this.nownum"
        :premarktype="this.marktype"
        :auditremakeinfo="this.auditinfoArry[nownum]"
        :acceptremakeinfo="this.acceptinfoArry[nownum]"
        :lastlabelArry="this.lastinfoArry[nownum]"
      ></drawpolygon>
    <!-- <canvas id="canvas" width='800' height='800'></canvas> -->
    </div>
    <el-dialog
      title="驳回备注"
      :visible.sync="batchRejectDiaglogShow"
      width="30%"
    >
      <el-input
        v-model="auditRemarks"
        placeholder="请输入备注"
        clearable
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchRejectDiaglogShow = false">取 消</el-button>
        <el-button type="primary" @click="submitBatchReject">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="驳回备注"
      :visible.sync="rejectDiaglogShow"
      width="30%"
    >
      <el-input
        v-model="auditRemark"
        placeholder="请输入备注"
        clearable
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDiaglogShow = false">取 消</el-button>
        <el-button type="primary" @click="submitReject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// :canvaswidth="this.imagesize[nownum].width"
// :canvasheight="this.imagesize[nownum].height"
import { mapGetters } from 'vuex'
import { getLabel } from '@/api/data' // zeng
import drawpolygon from '@/components/drawpolygonaudit.vue'
import request from '@/utils/request'
import miniimage from '@/components/auditdatashow.vue'
import store from '@/store'
import { getAuditDatasByUserId, getIsAuditApi, batchSaveApi, batchRejectApi, batchReSetApi, passApi, reSetApi, rejectApi } from '@/api/audit'
import { getTagApi } from '@/api/tag'

// 页面键盘监听
function keyDownSearch(e) {
  console.log('keydown!!!!!!!!!!!!')
  const theEvent = e.event || window.event
  const code = theEvent.keyCode || theEvent.which || theEvent.charCode
  if (code == 80) { // 上一张
    console.log('pppppppp!!!!!!!!!!!!!')
    previousimage()
    // return false;
  }
  if (code == 78) { // 下一张
    console.log('nnnnnnnn!!!!!!!!!!!!!')
    nextimage()
  // return true;
  }
  if (code == 81) { // 跳过
    console.log('qqqqqqqq!!!!!!!!!!!!!')
    skipimage()
  }
  if (code === 65) { // 通过  A
    this.pass()
  }
  if (code === 68) { // 不通过 D
    this.rejectDialog()
  }
  if (code === 71) { // 重置 G
    this.reset()
  }
}

export default {
  name: 'Dashboard',
  components: {
    drawpolygon,
    miniimage
  },
  data() {
    return {
      isAudited: 1,
      isCheckedAll: false,
      checkedList: [],
      // 存储图片url数组，用于获取远程图片信息
      imageArry: [],
      // 与图片一一对应的标注信息数组
      infoArry: [],
      // 存储上次标注的信息的数组
      lastinfoArry: [],
      // 与图片对于的uuid数组，是后台数据库主键
      uuidArry: [],
      // 存储图片url,是否已标注等信息的数组，用于获取远程图片信息
      imagelargeArry: [],
      //   //预读取每张图片的分辨率，以适应画布
      //   imagesize:[],
      // 后台读取的标注类别
      testmarktype: [
        {
          name: 'car',
          color: 'rgba(128,0,0,0.75)'
        },
        {
          name: 'person',
          color: 'rgba(0,128,0,0.75)'
        },
        {
          name: 'human1',
          color: 'rgba(0,0,128,0.75)'
        },
        {
          name: 'human2',
          color: 'rgba(128,128,0,0.75)'
        },
        {
          name: 'human3',
          color: 'rgba(0,128,128,0.75)'
        },
        {
          name: 'human4',
          color: 'rgba(128,0,128,0.75)'
        }
      ],
      marktype: [],
      nopnum: 0, // 标记上一张下一张的数字
      unable: false,
      nownum: 0,
      isalllabeled: false,
      starttimer: null,
      nowseconds: 0,
      isdisablebutton: false,
      isimageview: true,
      automarkbtntext: '开始自动标注',
      isloading: false,
      batchRejectDiaglogShow: false,
      rejectDiaglogShow: false,
      auditRemarks: '',
      auditRemark: ''
    }
  },
  mounted() {
    this.infoArry = new Array(this.imageArry.length)
    console.log('mounted!!!!', this.infoArry.length, this.infoArry)
    console.log('mounted!!!!uuid', store.getters.uuid, 'mounted!!!!store.getters.userid', store.getters.userid)
    this.getAuditDataList()
    this.getTags()
    window.nextimage = this.nextimage
    window.previousimage = this.previousimage
    window.skipimage = this.skipimage
    window.pass=this.pass
    window.rejectDialog=this.rejectDialog
    window.reset=this.reset
    document.onkeydown = keyDownSearch
    this.starttimer = setInterval(() => {
      this.nowseconds++
      // console.log(this.nowseconds,"my定时器！！！！")
      if (this.nowseconds >= 60000) {
        console.log('超时')
        const params = {
          userId: store.getters.userId,
          dataSetId: store.getters.dataSet.user_id,
          dataSetUuid: store.getters.uuid
        }
        // outTimeReAssign(params)
        this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        location.reload()
      }
    }, 1000)
  },
  destroyed() {
    document.onkeydown = undefined
    clearInterval(this.starttimer)
    this.starttimer = null
    this.nowseconds = 0
  },
  methods: {
    batchRejectDialog() {
      this.batchRejectDiaglogShow = true
      this.auditRemarks = ''
    },
    rejectDialog() {
      this.rejectDiaglogShow = true
      this.auditRemark = ''
    },
    submitBatchReject() {
      this.batchReject()
      this.batchRejectDiaglogShow = false
    },
    submitReject() {
      this.reject()
      this.rejectDiaglogShow = false
    },
    returndataset() {
      // this.$router.go(-1)
      this.$router.push('/data')
    },
    pass() {
      console.log(this.imagelargeArry)
      const params = {
        labelUuid: this.uuidArry[this.nownum]
      }
      passApi(params).then(res => {
        this.$message({
          message: '审核通过',
          duration: 300,
          type: 'success'
        })
      }).catch(function(error) {
        this.$message({
          message: '审核失败',
          duration: 300,
          type: 'error'
        })
      })
    },
    reject() {
      const params = {
        labelUuid: this.uuidArry[this.nownum],
        audit_remark: this.auditRemark
      }
      rejectApi(params).then(res => {
        this.$message({
          message: '驳回成功',
          duration: 300,
          type: 'success'
        })
        this.rejectDiaglogShow = false
      }).catch(function(error) {
        this.$message({
          message: '驳回失败',
          duration: 300,
          type: 'error'
        })
      })
    },
    reset() {
      const params = {
        labelUuid: this.uuidArry[this.nownum]
      }
      reSetApi(params).then(res => {
        this.$message({
          message: '重置成功',
          duration: 300,
          type: 'success'
        })
        this.getAuditDataList()
      }).catch(function(error) {
        this.$message({
          message: '重置失败',
          duration: 300,
          type: 'error'
        })
      })
    },
    addToList(uuid) {
      console.log(uuid)
      if (this.checkedList.indexOf(uuid) == -1) {
        this.checkedList.push(uuid)
      } else {
        this.checkedList.splice(this.checkedList.indexOf(uuid), 1)
      }
    },
    checkedAll() {
      this.isCheckedAll = !this.isCheckedAll
      if (this.isCheckedAll) {
        // 全选时
        this.checkedList = []
        this.imagelargeArry.forEach(function(item) {
          this.checkedList.push(item.uuid)
        }, this)
      } else {
        this.checkedList = []
      }
    },
    batchSave() {
      console.log(this.checkedList.join(','))
      const params = {
        labelUuids: this.checkedList.join(',')
      }
      batchSaveApi(params).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getAuditDataList()
        this.checkedList = []
      })
    },
    batchReject() {
      console.log(this.checkedList.join(','))
      const params = {
        labelUuids: this.checkedList.join(','),
        audit_remark: this.auditRemarks
      }
      batchRejectApi(params).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getAuditDataList()
        this.checkedList = []
        this.batchRejectDiaglogShow = false
      })
    },
    batchReSet() {
      console.log(this.checkedList.join(','))
      const params = {
        labelUuids: this.checkedList.join(',')
      }
      batchReSetApi(params).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getAuditDataList()
        this.checkedList = []
      })
    },
    async setAudited() {
      const params = {
        labelUuid: this.uuidArry[this.nownum]
      }

      await getIsAuditApi(params).then(res => {
        this.isAudited = res.data.items
      })
    },
    entermark(index) {
      console.log('faaaaaaaaaaaatherenter!', this.nownum, this.uuidArry[this.nownum])
      this.nownum = index
      // this.isnowlabel();
      this.isimageview = !this.isimageview
    },
    returnimageview() {
      this.getAuditDataList()
      this.getTags()
      this.nownum = 0
      this.isimageview = !this.isimageview
    },
    // 下一张图片
    async nextimage() {
      await this.setAudited()
      console.log('llllokonojiojo', this.isAudited)
      if (this.isAudited == 1) {
        this.$message('请进行审核操作')
      } else {
        if (this.isimageview) {
          console.log('处于预览界面')
          return
        }
        if (this.nownum < this.imageArry.length - 1) {
          this.nownum++
        }
        console.log('nextimage', this.nownum)
      }
    },
    // 上一张图片
    async previousimage() {
      await this.setAudited()

      if (this.isAudited == 1) {
        this.$message('请进行审核操作')
      } else {
        if (this.isimageview) {
          console.log('处于预览界面')
          return
        }
        if (this.nownum > 0) {
          this.nownum--
        }
        console.log('previousimage', this.nownum)
      }
    },
    // 跳过图片
    skipimage() {
      if (this.isimageview) {
        console.log('处于预览界面')
        return
      }
      if (this.isdisablebutton) {
        console.log('您现在正在修改图片')
        return
      }
      if (this.nownum < this.imageArry.length - 1) {
        this.nownum++
      }
      console.log('skipimage', this.nownum)
      this.nowseconds = 0
    },

    // get 请求图片
    getAuditDataList() {
      const _this = this
      this.isalllabeled = true
      this.imageArry = []
      const params = {
        dataSetUuid: store.getters.uuid,
        userId: store.getters.userid
      }
      console.log(params)
      getAuditDatasByUserId(params).then(response => {
        _this.imageArry = []
        _this.infoArry = []
        _this.lastinfoArry = []
        _this.uuidArry = []
        _this.imagelargeArry = []
        _this.auditinfoArry=[]
        _this.acceptinfoArry=[]
        console.log('get图片结果', response)
        for (let i = 0; i < response.data.items.length; i++) {
          console.log("get items",[i],response.data.items[i]);
          //读取图片分辨率
          // let image = new Image();
          // image.src = response.data.items[i].file_path; 
          // console.log("imagesize",image)       
          // image.onload=() =>{
          //   console.log("imageonloadsuccess",image.width,image.height)
          //   let imagea={}
          //   imagea["width"]=image.width
          //   imagea["height"]=image.height
          //   _this.imagesize.push(imagea)
          // }
          // console.log("ima",_this.imagesize)
          _this.auditinfoArry[i]=response.data.items[i].audit_remark
          _this.acceptinfoArry[i]=response.data.items[i].accept_remark
          if(response.data.items[i].is_label!=1) _this.isalllabeled=false;
          if(response.data.items[i].label_data==undefined||response.data.items[i].label_data==="[]"){
          _this.lastinfoArry.push({})
          }
          //if(response.data.items[i].label_data!==undefined) {
          else{
          let tempa = JSON.parse(response.data.items[i].label_data)
          // let len = eval(tempa).length;
          // console.log("len", len);
          console.log("tempa",tempa)
          _this.lastinfoArry.push(tempa)
          console.log("lastinfoArry", _this.lastinfoArry[i]);
        } 
          const a = {}
          a['url'] = response.data.items[i].file_path
          a['islabel'] = response.data.items[i].is_audit
          a['uuid'] = response.data.items[i].uuid
          // a["index"]=i
          _this.imagelargeArry.push(a)

          _this.uuidArry.push(response.data.items[i].uuid)

          _this.imageArry.push(response.data.items[i].file_path)
        }
      }).catch(function(error) {
        console.log('error', error)
        _this.$message({
          message: '图片数量不足',
          duration: 1000,
          type: 'error'
        })
      })
      // this.setAudited()
    },
    // get请求数据集的标签集
    getTags() {
      const _this = this
      this.marktype = []
      const params = {
        dataset_uuid: store.getters.uuid
      }
      getTagApi(params).then(response => {
        for (let i = 0; i < response.data.items.length; i++) {
          const a = {}
          a['name'] = response.data.items[i].name
          a['color'] = response.data.items[i].color
          _this.marktype.push(a)
        }
        console.log('marktype', _this.marktype)
      }).catch(function(error) {
        console.log('error', error)
        _this.$message({
          message: '请求标签集合失败',
          duration: 1000,
          type: 'error'
        })
      })
    }
  },
  computed: {
    ...mapGetters(['name'])
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
    line-height: 46px;
  }
}
.checkAll{
  padding: 0px 5px 0px 15px;
}
</style>
