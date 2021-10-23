<template>
  <div class="app-container">
    <el-header>
      <span style="font-size: 20px">
        {{ dataSet.name }}
      </span>
      <el-button class="titlebutton" size="small" style="margin-left:100px" icon="el-icon-arrow-left" @click="toDataSet">
        返回数据集
      </el-button>
    </el-header>
    <el-divider class="divider2" />
    <div class="content">
      <el-tabs style="height: 200px;">
        <el-tab-pane label="全部数据">
          <el-container>
            <el-main>
              <el-row class="buttonList">
                <el-button plain type="mini" icon="el-icon-plus" @click="uploadobjectmsg">上传文件</el-button>
                <el-button plain type="mini" icon="el-icon-upload" @click="allCopy">拷贝文件</el-button>
                <el-button plain type="mini" icon="el-icon-download" @click="downPicture">下载图片</el-button>
                <el-button plain type="mini" icon="el-icon-download" @click="downAnnotation">下载标注文件</el-button>
                <el-button plain type="mini" icon="el-icon-delete" @click="delData()">删除数据</el-button>
                <!-- <el-button plain type="mini" icon="el-icon-cloudy" style="right" @click="startLabel" :style="{ display: visible}">开始标注</el-button> -->
                <el-button plain type="mini" icon="el-icon-cloudy" style="right" @click="startLabel">开始标注</el-button>
                <el-button plain type="mini" icon="el-icon-refresh" @click="fresh()">同步数据源</el-button>
                <el-button plain type="mini" icon="el-icon-refresh" @click="assign()">分配</el-button>
              </el-row>
              <!-- @click="select(item)" -->
              <div
                v-for="(item, index) in imagelargeArry"
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
                  :ismarked="item.islabel"
                  :parent-select-list="selectList"
                  :parent-uuid="index"
                  @select="select(index)"
                  @childSelectList="fromChildList($event)"
                />
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
      :before-close="handleClose"
    >
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="名称"
          width="120"
        />
        <el-table-column
          prop="path"
          label="地址"
          show-overflow-tooltip
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配给团队成员"
      :visible.sync="assignDiaglogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>
        hello
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDiaglogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignDiaglogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--批量拷贝弹出框-->
    <el-dialog title="选择目标路径" :visible.sync="multipleCopyVisible">
      <el-button-group>
        <el-button icon="el-icon-folder" size="medium" @click="copyFolder">目标路径</el-button>
        <el-button v-show="MultipleCopyBucketName" size="medium" class="dir" plain>{{ MultipleCopyBucketName }}:</el-button>
        <el-button v-show="MultipleCopyObjectRow" size="medium" class="dir" plain>{{ MultipleCopyObjectRow }}</el-button>
      </el-button-group>
      <el-dialog width="30%" title="选择路径" :visible.sync="copyFolderVisible" append-to-body :show-close="false">
        <el-form>
          <el-form-item label="请选择桶:">
            <el-radio-group v-model="copyBucket" @change="choosecopybucket">
              <el-radio-button v-for="item in list" :key="item.name" :label="item.name">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-divider />
        <el-row>
          <el-button icon="el-icon-upload2" type="text" @click="returnOldcopyCurrentRow">返回上级</el-button>
          <el-divider direction="vertical" />
          <el-tag type="info" effect="light">当前路径：{{ copyBucket }} ：{{ objectcopycurrentRow }}</el-tag>
        </el-row>
        <el-table ref="multipleTable" :data="objectcopyData" highlight-current-row @row-click="copylistbyPrefix" @selection-change="handleSelectionChangeCopy">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="请选择位置" />
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="returnMultipleCopyNull">取 消</el-button>
          <el-button type="primary" @click="returnMultipleCopyFolder">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="returnMultipleCopyCancel">取 消</el-button>
        <el-button type="primary" @click="returnMultipleCopy">确 定</el-button>
      </div>
    </el-dialog>

    <!--上传文件dialog-->
    <el-dialog title="上传文件" :visible.sync="uploadObjectVisible">
      <el-button-group>
        <el-button>上传路径</el-button>
        <el-button class="dir" plain>{{ uploadBucketName }} : {{ uploadObjectFolder }}</el-button>
      </el-button-group>
      <!-- <el-dialog width="30%" title="选择路径" :visible.sync="choosefolder" append-to-body :show-close="false">
            <el-form>
                <el-form-item label="请选择桶:">
                    <el-radio-group v-model="uplbucket" @change="chooseuplbucket">
                        <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        <el-divider></el-divider>
        <el-row>
            <el-button icon="el-icon-upload2" type="text"  @click="returnOlduplCurrentRow">返回上级</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tag type="info" effect="light">当前路径：{{uplbucket}} ：{{objectuplcurrentRow}}</el-tag>
        </el-row>
        <el-table :data="objectuplData" highlight-current-row @row-click="upllistbyPrefix">
            <el-table-column prop="name" label="请选择上传位置"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnNull">取 消</el-button>
            <el-button type="primary" @click="returnuplFolder" >确定</el-button>
        </div>
        </el-dialog> -->
      <el-divider />
      <el-upload
        ref="upload"
        v-loading="uploadLoading"
        class="upload"
        action="string"
        :file-list="fileList"
        :auto-upload="false"
        :http-request="uplFile"
        :on-change="handleChange"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple="multiple"
        element-loading-text="上传中"
        element-loading-spinner="el-icon-loading"
      >
        <el-button slot="trigger" size="small" type="primary" @click="delFile">选取文件</el-button>
      </el-upload>
      <el-divider />
      <el-input placeholder="请输入文件名" v-model="uploadobjectName" clearable>
        <template slot="prepend">文件名：</template>
        <template slot="append">{{uploadFilePostfix}}</template>
      </el-input>
      <h5> <font color="#e6a23c">*注：1个文件上传时可自定义命名</font></h5>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadObjectNull">取 消</el-button>
        <el-button type="primary" @click="uploadObject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabel, refresh, assignByNewTeamUser, assignLabelDataChange, deleteData, addNewLabels, assignNewData, getNewFile } from '@/api/data'
import { listBucket, uploadNew, listObject, listObjectByPrefix, createBucket, removeBucket, removeFile, upload, createFolder, listFolder, fileRename, fileURL, fileCopy, fileCopyNew, downloadZipByPrefixApi } from '@/api/oss'
import store from '@/store'
import myimage from '@/components/myimage.vue'

export default {
  name: 'Dashboard',
  components: {
    myimage
  },
  data() {
    return {
      bucket: 'modelcraft', // 双向绑定已选择的bucket(默认值设为modelcraft)
      visible: '',
      message: '',
      list: [], // bucket radio的数据
      objectData: [], // object table的数据
      assignDiaglogVisible: false,
      addDataDialogVisible: false,
      uploadObjectVisible: false, // 上传文件dialog框信号
      choosefolder: false,

      copyBucket: '', // 拷贝文件的目标桶
      objectcopyData: '', // 拷贝文件对象列表
      objectcopycurrentRow: '', // 拷贝文件的当前显示列表
      multipleCopyVisible: false, // 批量拷贝弹出框信号
      copyFolderVisible: false, // 拷贝文件选择性目标路径框信号
      MultipleCopyBucketName: '', // 批量拷贝的目标桶
      MultipleCopyObjectRow: '', // 批量拷贝的目标路径
      multipleCopySignal: 0, // 批量拷贝计数
      multipleSelection: [], // 多选选项
      copySeleFolder: false, // 拷贝是否选择文件夹
      copysignal: false, // 拷贝的选择具体文件信号控制

      uplbucket: '', // 上传对象bucket
      uploadBucketName: '', // 上传目标桶
      uploadObjectFolder: '', // 上传目标路径
      uploadobjectName: '', // 上传文件名
      uploadFile: '', // 要给后端的文件
      uploadFilePostfix: '', // 上传的后缀名
      uploadFilesignal: false, // 上传文件判断信号
      uploadLoading: false, // 文件上传加载
      objectuplData: [], // 上传对象列表
      objectuplcurrentRow: '', // 页面显式的上传路径
      objectuplPrefix: '', // 后端调用的上传路径
      objectPrefix: '', // 后端调用的路径
      oldCurrentRow: '', // 上一级目录
      olduplCurrentRow: '', // 上传的上一级目录
      oldObjectuplPrefix: '', // 上传的后端调用上级目录
      selectBucketName: '', // 内层dialog选中的bucket
      selectObjectFolder: '', // 内层dialog选中的目录
      fileList: [],
      urls: [],
      tableData: [],
      doneurls: [],
      undoneurls: [],
      // 存储图片url,是否已标注等信息的数组，用于获取远程图片信息
      imagelargeArry: [],
      selectList: [],
      multipleSelection: [],
      showData: [],
      newPaths: [] // 新的文件路径
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'dataSet'
    ])
  },

  created() {
    this.bucketlist()
    this.choosebucket('modelcraft')// (默认值设为modelcraft)
  },
  mounted() {
    this.getData()
    console.log('qweqweqwe')
    console.log(store.getters.dataSet.role_type)
    if (store.getters.dataSet.role_type !== '创建者') {
      this.visible = 'none'
    }
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
      this.selectList = vara
    },
    downPicture() {
      console.log(process.env)
      const params = {
        bucketName: store.getters.dataSet.bucket,
        objectPrefix: store.getters.dataSet.input_path.substring(0, store.getters.dataSet.input_path.length - 1)
      }
      const a = document.createElement('a')
      console.log(process)
      a.href = process.env.VUE_APP_BASE_API2 + '/minio-service/downloadZipByPrefix/?bucketName=' + encodeURI(params.bucketName) +
      '&objectPrefix=' + encodeURI(params.objectPrefix)
      a.click()
    },
    downAnnotation() {
      const params = {
        bucketName: store.getters.dataSet.bucket,
        objectPrefix: store.getters.dataSet.annotation_path.substring(0, store.getters.dataSet.annotation_path.length - 1)
      }
      console.log(params)
      console.log(process.env)
      const a = document.createElement('a')
      a.href = process.env.VUE_APP_BASE_API2 + '/minio-service/downloadZipByPrefix/?bucketName=' + encodeURI(params.bucketName) +
      '&objectPrefix=' + encodeURI(params.objectPrefix)
      a.click()
    },
    delData() {
      const uuidss = this.selectList.join(',')
      const params = {
        uuids: uuidss
      }
      console.log('uuuuuuuuuu')
      console.log(this.selectList)
      console.log(params)
      const multData = this.selectList
      const list = this.showData
      console.log(list)
      const multDataLen = multData.length
      for (let i = 0; i < multDataLen; i++) {
        console.log(i)
        const n = multData[i]
        console.log(list[i])
        const params = {}
        params.bucketName = list[n].bucket
        params.folderName = list[n].dir_path
        params.objectName = list[n].file_name
        console.log('21312312312')
        console.log(params)
        this.removeobjs(params)
      }
      this.selectList = []
      // deleteData(params).then(res => {
      //   this.$message({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      //   this.getData()
      // })
    },
    removeobjs(params) {
      removeFile(params).then(response => {
        if (response.code === 20000) {
          this.suc()
          this.getData()
        } else {
          this.fai()
          this.getData()
        }
      })
    },

    suc() { // 成功提醒
      this.$message({
        message: '成功',
        type: 'success'
      })
    },

    fai() { // 失败提醒
      this.$message.error('发生错误')
    },

    // 上传文件点击事件
    uploadobjectmsg() {
      this.uploadObjectVisible = true
      this.uploadObjectFolder = store.getters.dataSet.input_path
      this.uploadBucketName = store.getters.dataSet.bucket
      // this.uploadBucketName = store.getters.dataSet.bucket
    },

    uploadObject() {
      this.uploadLoading = true
      const multFileList = this.fileList
      const multFileListLen = multFileList.length
      let s = 0
      console.log(multFileList)
      console.log(multFileListLen)
      if (multFileListLen === 1) {
        const formData = new FormData()
        formData.append('bucketName', this.uploadBucketName)
        console.log(this.uploadBucketName)
        formData.append('folderName', this.uploadObjectFolder)
        console.log(this.uploadObjectFolder)
        formData.append('file', multFileList[0].raw)
        console.log(multFileList[0].raw)
        formData.append('objectName', this.uploadobjectName)
        console.log(this.uploadobjectName)
        formData.append('userid', store.getters.userid)
        console.log('sssssssssssssssssssssssss')
        console.log(store.getters.uuid)
        formData.append('dataset_id', store.getters.uuid)
        uploadNew(formData).then(response => {
          if (response.code === 20000) {
            this.uploadLoading = false
            this.suc()
            this.getData()
            this.uploadObjectVisible = false
            this.uploadBucketName = ''
            this.uploadObjectFolder = ''
            this.uploadobjectName = ''
            this.uplbucket = ''
            this.objectuplcurrentRow = ''
            this.objectuplData = []
            this.fileList = []
            this.uploadFilePostfix = ''
          } else { this.$message.error('网络延迟,请同步数据源') }
        })
      } else {
        for (let i = 0; i < multFileListLen; i++) {
          const formData = new FormData()
          formData.append('bucketName', this.uploadBucketName)
          console.log(this.uploadBucketName)
          formData.append('folderName', this.uploadObjectFolder)
          console.log(this.uploadObjectFolder)
          formData.append('file', multFileList[i].raw)
          console.log(multFileList[i].raw)
          formData.append('objectName', '')
          formData.append('userid', store.getters.userid)
          console.log('sssssssssssssssssssssssss')
          console.log(store.getters.uuid)
          formData.append('dataset_id', store.getters.uuid)
          uploadNew(formData).then(response => {
            if (response.code === 20000) {
              s++
              console.log(response)
              if (s === multFileListLen - 1) {
                this.uploadLoading = false
                this.suc()
                this.getData()
                this.uploadObjectVisible = false
                this.uploadBucketName = ''
                this.uploadObjectFolder = ''
                this.uploadobjectName = ''
                this.uplbucket = ''
                this.objectuplcurrentRow = ''
                this.objectuplData = []
                this.fileList = []
                this.uploadFilePostfix = ''
              }
            } else {
              this.$message.error('网络延迟,请同步数据源')
            }
          })
        }
        this.getData()
      }
    },

    // 上传文件的取消键
    uploadObjectNull() {
      this.uploadBucketName = ''
      this.uploadObjectFolder = ''
      this.uploadobjectName = ''
      this.uplbucket = ''
      this.objectuplcurrentRow = ''
      this.objectuplData = []
      this.fileList = []
      this.uploadFilePostfix = ''
      this.uploadObjectVisible = false
    },

    // 返回内层dialog
    returnuplFolder() {
      if (this.selectBucketName == '') { this.selectBucketName = this.uplbucket }
      this.uploadBucketName = this.selectBucketName
      this.uploadObjectFolder = this.selectObjectFolder
      this.choosefolder = false
    },

    // 清空内层dialog返回值
    returnNull() {
      this.uploadBucketName = ''
      this.uploadObjectFolder = ''
      this.uplbucket = ''
      this.objectuplcurrentRow = ''
      this.objectuplData = []
      this.choosefolder = false
    },

    // 上传对象的object列表数据,更新上传列表
    objectupllist(para) {
      listObject(para).then(response => {
        if (response) {
          console.log(response)
          this.objectuplData = response.data
        } else {
        }
      }).catch()
    },

    // 根据前缀名递归列上传object列表
    upllistbyPrefix(row, event, column) {
      console.log(row.name)
      const para = {}
      if (((row.name.split('').reverse().join('')).substring(0, 1)).split('').reverse().join('') == '/') {
        console.log('isdir')
        this.objectuplcurrentRow = row.name
        console.log(row.name.substring(0, row.name.length - 1))
        this.objectuplPrefix = row.name.substring(0, row.name.length - 1)
        para.bucketName = this.uplbucket
        para.objectPrefix = this.objectuplPrefix
        console.log(para)
        this.listuplObject(para)
        // this.oldCurrentRow = this.objectPrefix.split("").reverse().indexOf("/") 逆置然后求出第一个/在第几个位置
        this.oldObjectuplPrefix = this.objectuplPrefix.substring(0, this.objectuplPrefix.length - this.objectuplPrefix.split('').reverse().indexOf('/') - 1)
        this.olduplCurrentRow = this.objectuplPrefix.substring(0, this.objectuplPrefix.length - this.objectuplPrefix.split('').reverse().indexOf('/'))
      } else {
        console.log('isnotdir')
      }
      this.selectBucketName = this.uplbucket
      this.selectObjectFolder = row.name
    },

    // 更新objectuplData的值
    listuplObject(para) {
      listObjectByPrefix(para).then(response => {
        this.objectuplData = response.data
      }).catch(error => { console.log(error) })
    },

    // 上传的返回上一级事件
    returnOlduplCurrentRow() {
      console.log(this.uplbucket)
      console.log(this.olduplCurrentRow)
      console.log(this.oldObjectuplPrefix)
      if (this.olduplCurrentRow == this.oldObjectuplPrefix) {
        this.olduplCurrentRow = ''
        this.oldObjectuplPrefix = ''
        this.objectuplcurrentRow = ''
        this.objectuplPrefix = ''
        this.selectObjectFolder = ''
      }
      const para = {}
      para.bucketName = this.uplbucket
      para.objectPrefix = this.oldObjectuplPrefix
      console.log(para)
      this.listuplObject(para)
      this.objectuplcurrentRow = this.olduplCurrentRow
      this.objectuplPrefix = this.oldObjectuplPrefix
      this.olduplCurrentRow = this.objectuplPrefix.substring(0, this.objectuplPrefix.length - this.objectuplPrefix.split('').reverse().indexOf('/'))
      this.oldObjectuplPrefix = this.objectuplPrefix.substring(0, this.objectuplPrefix.length - this.objectuplPrefix.split('').reverse().indexOf('/') - 1)
    },
    // 获取bucketlist
    bucketlist() {
      listBucket().then(response => {
        this.list = response.data
      }).catch(() => {})
    },
    // 选bucket
    choosebucket(val) {
      this.objectData = []
      this.objectcurrentRow = ''
      this.objectPrefix = ''
      const para = { bucketName: val }
      console.log(para)
      this.objectlist(para)
    },

    // 根据bucket列object
    objectlist(para) {
      listObject(para).then(response => {
        if (response) {
          console.log(response)
          this.objectData = response.data
        } else {
        }
      }).catch()
    },

    // 选择上传对象的bucket
    chooseuplbucket(val) {
      this.objectuplData = []
      const para = { bucketName: val }
      console.log(para)
      this.objectupllist(para)
    },

    // 根据object前缀递归列object
    listbyPrefix(row, event, column) {
      console.log(row.name)
      const para = {}
      if (((row.name.split('').reverse().join('')).substring(0, 1)).split('').reverse().join('') == '/') {
        console.log('isdir')
        this.objectcurrentRow = row.name
        console.log(row.name.substring(0, row.name.length - 1))
        this.objectPrefix = row.name.substring(0, row.name.length - 1)
        para.bucketName = this.bucket
        para.objectPrefix = this.objectPrefix
        console.log(para)
        this.listObject(para)
        // this.oldCurrentRow = this.objectPrefix.split("").reverse().indexOf("/") 逆置然后求出第一个/在第几个位置
        this.oldObjectPrefix = this.objectPrefix.substring(0, this.objectPrefix.length - this.objectPrefix.split('').reverse().indexOf('/') - 1)
        this.oldCurrentRow = this.objectPrefix.substring(0, this.objectPrefix.length - this.objectPrefix.split('').reverse().indexOf('/'))
      } else {
        console.log('isnotdir')
      }
    },
    // 更新objectData的值
    listObject(para) {
      listObjectByPrefix(para).then(response => {
        this.objectData = response.data
      }).catch(error => { console.log(error) })
    },

    // 返回上一级
    returnOldCurrentRow() {
      console.log('start')
      console.log(this.bucket)
      console.log(this.oldCurrentRow)
      console.log(this.oldObjectPrefix)
      if (this.oldCurrentRow == this.oldObjectPrefix) {
        this.oldCurrentRow = ''
        this.oldObjectPrefix = ''
        this.objectcurrentRow = ''
        this.objectPrefix = ''
      }
      const para = {}
      para.bucketName = this.bucket
      para.objectPrefix = this.oldObjectPrefix
      console.log(para)
      this.listObject(para)
      this.objectcurrentRow = this.oldCurrentRow
      this.objectPrefix = this.oldObjectPrefix
      this.oldCurrentRow = this.objectPrefix.substring(0, this.objectPrefix.length - this.objectPrefix.split('').reverse().indexOf('/'))
      this.oldObjectPrefix = this.objectPrefix.substring(0, this.objectPrefix.length - this.objectPrefix.split('').reverse().indexOf('/') - 1)
    },
    // 当选择项发生变化时触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
      const data = this.multipleSelection
      const datalen = data.length
      for (let i = 0; i < datalen; i++) {
        console.log(data[i].name)
        if (data[i].name.substring(data[i].name.length - 1) === '/') {
          console.log('is dir')
          this.removeSeleFolder = true
          this.copySeleFolder = true
        }
      }
      console.log(this.multipleSelection)
    },

    // 当选择项发生变化时触发该事件
    handleSelectionChangeCopy(val) {
      this.multipleSelection = val
      const data = this.multipleSelection
      const datalen = data.length
      for (let i = 0; i < datalen; i++) {
        console.log(data[i].name)
        if (data[i].name.substring(data[i].name.length - 1) == '/') {
          console.log('is dir')
          this.removeSeleFolder = true
          this.copySeleFolder = true
        }
      }
      console.log(this.multipleSelection)
    },

    delFile() {
      this.fileList = []
    },
    handleChange(file, fileList) {
      this.fileList = fileList
      this.uploadFilePostfix = file.name.substring(file.name.indexOf('.'))
    },
    uplFile(file) {
      this.formData.append('file', file.file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },

    fresh() {
      console.log('fresh=================')
      const params = {
        dataSetUuid: store.getters.uuid,
        path: store.getters.dataSet.input_path,
        bucketName: store.getters.dataSet.bucket,
        userid: store.getters.userid
      }
      refresh(params).then(res => {
        this.suc()
        this.getData()
      })
    },

    assign() {
      // const params = {
      //   datasetuuid: store.getters.uuid,
      //   userid: store.getters.userid
      // }
      // assignByNewTeamUser(params).then(res => {
      //   this.$message({
      //     message: '分配成功',
      //     type: 'success'
      //   })
      // })
      const param = {
        datasetuuid: store.getters.uuid
      }
      assignLabelDataChange(param).then(res => {
        this.$message({
          message: '分配成功',
          type: 'success'
        })
      })
    },

    // addData() {
    //   this.addDataDialogVisible = true
    //   const params = {
    //     dataSetUuid: store.getters.uuid,
    //   }
    //   getNewFile(params).then(res => {
    //     this.tableData = res.data.items
    //   })
    // },
    // add() {
    //   console.log(this.multipleSelection)
    //   const params = {
    //     dataSetUuid: store.getters.uuid,
    //     fileUuids: this.multipleSelection
    //   }
    //   console.log(params)
    //   addNewLabels(params).then(res => {
    //     this.$message({
    //       message: '添加成功',
    //       type: 'success'
    //     })
    //     this.getData()
    //     const newparams = {
    //     datasetuuid: store.getters.uuid
    //     }
    //     assignNewData(newparams).then(res => {
    //       this.$message({
    //         message: '成功',
    //         type: 'success'
    //       })
    //     })
    //   })
    //   this.addDataDialogVisible = false
    // },
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
      const _this = this
      const params = {
        datasetuuid: store.getters.uuid
      }
      getLabel(params).then(response => {
        console.log('response', response)
        this.showData = response.data.items
        console.log('adasdad')
        console.log(this.showData)
        for (let i = 0; i < response.data.items.length; i++) {
          const a = {}
          a['uuid'] = response.data.items[i].uuid // label的uuid
          a['url'] = response.data.items[i].file_path
          a['islabel'] = response.data.items[i].is_label
          // a["index"]=i
          _this.imagelargeArry.push(a)
        }
      })
    },

    // 批量拷贝
    allCopy() {
      this.multipleCopyVisible = true
      // if(multDataLen<1){
      //     this.choosefile()//判断是否选了
      // }else if(this.copySeleFolder==true){
      //     this.choosefile()//判断选的是不是文件
      //     this.copySeleFolder=false
      // }else{
      //     this.multipleCopyVisible=true
      // }
    },

    // 拷贝文件的目标路径
    copyFolder() {
      this.copyFolderVisible = true
    },

    // 提示选择路径进行拷贝
    choosedir() {
      this.$message.error('请选择文件目录')
    },

    // 选择拷贝目标桶
    choosecopybucket(val) {
      this.objectcopyData = []
      const para = { bucketName: val }
      console.log(para)
      this.objectcopylist(para)
    },

    // 拷贝对象的object列表数据,更新上传列表
    objectcopylist(para) {
      listObject(para).then(response => {
        if (response) {
          console.log(response)
          this.objectcopyData = response.data
        } else {
        }
      }).catch()
    },

    copylistbyPrefix(row, event, column) {
      console.log(row.name)
      const para = {}
      if (((row.name.split('').reverse().join('')).substring(0, 1)).split('').reverse().join('') == '/') {
        console.log('isdir')
        this.copysignal = true // 选择路径
        this.objectcopycurrentRow = row.name
        console.log(row.name.substring(0, row.name.length - 1))
        this.objectcopyPrefix = row.name.substring(0, row.name.length - 1)
        para.bucketName = this.copyBucket
        para.objectPrefix = this.objectcopyPrefix
        console.log(para)
        this.listCopyObject(para)
        this.oldObjectcopyPrefix = this.objectuplPrefix.substring(0, this.objectuplPrefix.length - this.objectuplPrefix.split('').reverse().indexOf('/') - 1)
        this.oldcopyCurrentRow = this.objectuplPrefix.substring(0, this.objectuplPrefix.length - this.objectuplPrefix.split('').reverse().indexOf('/'))
        this.selectBucketName = this.copyBucket
        this.selectObjectFolder = row.name
      } else {
        console.log('isnotdir')
        this.copysignal = false // 选择的不是路径
      }
    },

    // 更新objectcopyData的值
    listCopyObject(para) {
      listObjectByPrefix(para).then(response => {
        this.objectcopyData = response.data
      }).catch(error => { console.log(error) })
    },

    // 拷贝的返回上级
    returnOldcopyCurrentRow() {
      console.log(this.copyBucket)
      console.log(this.oldcopyCurrentRow)
      console.log(this.oldObjectcopyPrefix)
      if (this.oldcopyCurrentRow == this.oldObjectcopyPrefix) {
        this.oldcopyCurrentRow = ''
        this.oldObjectcopyPrefix = ''
        this.objectcopycurrentRow = ''
        this.objectcopyPrefix = ''
        this.selectObjectFolder = ''
      }
      const para = {}
      para.bucketName = this.copyBucket
      para.objectPrefix = this.oldObjectcopyPrefix
      console.log(para)
      this.listCopyObject(para)
      this.objectcopycurrentRow = this.oldcopyCurrentRow
      this.objectcopyPrefix = this.oldObjectcopyPrefix
      this.oldcopyCurrentRow = this.objectcopyPrefix.substring(0, this.objectcopyPrefix.length - this.objectcopyPrefix.split('').reverse().indexOf('/'))
      this.oldObjectcopyPrefix = this.objectcopyPrefix.substring(0, this.objectcopyPrefix.length - this.objectcopyPrefix.split('').reverse().indexOf('/') - 1)
    },

    // 确定拷贝目标路径
    returnCopyFolder() {
      if (this.copysignal == true) {
        if (this.selectBucketName == '') { this.selectBucketName = this.copyBucket }
        this.copyBucketName = this.selectBucketName
        this.copyObjectRow = this.selectObjectFolder
        this.copyFolderVisible = false
        this.copysignal = false
      } else {
        this.choosedir()
      }
    },

    // 提示选择文件进行删除
    choosefile() {
      this.$message.error('请选择文件')
    },

    // 返回批量拷贝目标文件路径
    returnMultipleCopyFolder() {
      console.log('hhhhhhhhhhhh', this.multipleSelection)
      const multData = this.multipleSelection
      const multDataLen = multData.length
      if (this.copySeleFolder == true) {
        this.choosefile()// 判断选的是不是文件
        this.copySeleFolder = false
      } else {
        if (this.selectBucketName == '') { this.selectBucketName = this.copyBucket }
        this.MultipleCopyBucketName = this.selectBucketName
        this.MultipleCopyObjectRow = this.selectObjectFolder
        this.copyFolderVisible = false
        this.copysignal = false
      }
    },

    // 批量拷贝路径的取消键
    returnMultipleCopyNull() {
      this.MultipleCopyBucketName = ''
      this.copyBucket = ''
      this.MultipleCopyObjectRow = ''
      this.objectcopycurrentRow = ''
      this.objectcopyData = []
      this.copyFolderVisible = false
      this.copysignal = false
    },

    // 批量拷贝确认
    returnMultipleCopy() {
      const multData = this.multipleSelection
      const multDataLen = multData.length
      const promiseArr = []
      for (let i = 0; i < multDataLen; i++) {
        const para = {}
        para.datasetId = store.getters.dataSet.uuid
        para.bucketName = store.getters.dataSet.bucket
        para.folderName = store.getters.dataSet.input_path
        para.bucketNameOrg = this.MultipleCopyBucketName
        para.folderNameOrg = this.MultipleCopyObjectRow
        para.userid = store.getters.userid
        para.objectNameOrg = multData[i].name.substring(this.MultipleCopyObjectRow.length)
        console.log(para)
        this.multipleCopySignal++
        promiseArr.push(fileCopyNew(para))
      }
      Promise.all(promiseArr).then(res => {
        this.fresh()
      })
      console.log(multDataLen)
      console.log(this.multipleCopySignal)

      if (this.multipleCopySignal == multDataLen) {
        // this.suc()
        // this.fresh()
        this.multipleCopySignal = 0
        this.multipleCopyVisible = false
      } else {
        // this.fai()
        // this.fresh()
      }
    },

    // 批量拷贝取消
    returnMultipleCopyCancel() {
      this.MultipleCopyBucketName = ''
      this.MultipleCopyObjectRow = ''
      this.copyBucket = ''
      this.objectcopycurrentRow = ''
      this.objectcopyData = []
      this.multipleCopyVisible = false
    },

    // 取消拷贝目标路径
    returnCopyNull() {
      this.copyBucketName = ''
      this.copyBucket = ''
      this.copyObjectRow = ''
      this.objectcopycurrentRow = ''
      this.objectcopyData = []
      this.copyFolderVisible = false
      this.copysignal = false
    },

    // 确认拷贝
    returnCopy() {
      const para = {}
      para.bucketNameOrg = this.bucket
      para.bucketName = this.copyBucketName
      para.folderNameOrg = this.objectcurrentRow
      para.folderName = this.copyObjectRow
      para.objectNameOrg = this.copyNameOrg
      if (this.copyName != '') { this.copyName = this.copyName + this.copyNameOrg.substring(this.copyNameOrg.indexOf('.')) }
      para.objectName = this.copyName
      para.userid = store.getters.userid
      console.log(para)
      fileCopy(para).then(response => {
        if (response.code == 20000) {
          this.suc()
          this.copyBucketName = ''
          this.copyBucket = ''
          this.copyObjectRow = ''
          this.objectcopycurrentRow = ''
          this.objectcopyData = []
          this.copyName = ''
        } else {
          this.fai()
          this.copyBucketName = ''
          this.copyBucket = ''
          this.copyObjectRow = ''
          this.objectcopycurrentRow = ''
          this.objectcopyData = []
          this.copyName = ''
        }
      }).catch(response => {
        console.log('response', response)
      })
      this.copyVisible = false
    },

    // 取消拷贝
    returnCopyCancel() {
      this.copyBucketName = ''
      this.copyObjectRow = ''
      this.copyName = ''
      this.copyBucketName = ''
      this.copyBucket = ''
      this.objectcopycurrentRow = ''
      this.objectcopyData = []
      this.copyVisible = false
    },

    startLabel: function() {
      const type = store.getters.type
      if (type == 0 || type == 3) {
        this.$router.push('/label/d2imageview')
      }
      if (type == 1 || type == 4) {
        this.$router.push({ path: '/label/polygonimageview' })
      }
      if (type == 2) {
        this.$router.push({ path: '/label/voice' })
      }
      // if(type == 3) {
      //   this.$router.push({path:'/label/voice'})
      // }
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
