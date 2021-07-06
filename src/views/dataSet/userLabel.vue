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
      <el-tabs style="height: 200px;">
        <el-tab-pane label="全部数据">
          <el-container>
            <el-main>
              <el-row class="buttonList">
                <el-button plain type="mini" icon="el-icon-plus" @click="uploadobjectmsg">上传文件</el-button>
                <el-button plain type="mini" icon="el-icon-delete" @click="delData()">删除数据</el-button>
                <!-- <el-button plain type="mini" icon="el-icon-cloudy" style="right" @click="startLabel" :style="{ display: visible}">开始标注</el-button> -->
                <el-button plain type="mini" icon="el-icon-cloudy" style="right" @click="startLabel" >开始标注</el-button>
                <el-button plain type="mini" icon="el-icon-refresh" @click="fresh()">同步数据源</el-button>
                <el-button plain type="mini" icon="el-icon-refresh" @click="assign()">分配</el-button>
              </el-row>
              <!-- @click="select(item)" -->
              <div class="dataList" v-for="(item, index) in imagelargeArry" :key="index" style="
                float:left;
                margin-left:20px
                margin-top:20px
                " >
                <!-- :parentSelectList="selectList" -->
                <myimage
                  :fatherimagesrc="item.url"
                  :ismarked="item.islabel"
                  :parentSelectList="selectList"
                  :parentUuid="index"
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

    <el-dialog
      title="分配给团队成员"
      :visible.sync = "assignDiaglogVisible"
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

    <!--上传文件dialog-->
    <el-dialog title="上传文件" :visible.sync="uploadObjectVisible">
            <el-button-group>
                <el-button>上传路径</el-button>
                <el-button class="dir" plain>{{uploadBucketName}} : {{uploadObjectFolder}}</el-button>
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
        <el-divider></el-divider>
            <el-upload
                class="upload"
                ref="upload"
                action="string"
                :file-list="fileList"
                :auto-upload="false"
                :http-request="uplFile"
                :on-change="handleChange"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                multiple="multiple"
                v-loading="uploadLoading"
                element-loading-text="上传中"
                element-loading-spinner="el-icon-loading">
                <el-button slot="trigger" size="small" type="primary" @click="delFile">选取文件</el-button>
            </el-upload>
        <el-divider></el-divider>
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
import{ listBucket,uploadNew, listObject,listObjectByPrefix,createBucket,removeBucket,removeFile,upload,createFolder,listFolder,fileRename,fileURL,fileCopy } from '@/api/oss'
import store from '@/store'
import myimage from '@/components/myimage.vue'

export default {
  name: 'Dashboard',
  data() {
    return {
      bucket:'modelcraft',//双向绑定已选择的bucket(默认值设为modelcraft)
      visible: '',
      message: '',
      list:[],//bucket radio的数据
      objectData:[],//object table的数据
      assignDiaglogVisible: false,
      addDataDialogVisible: false,
      uploadObjectVisible:false,//上传文件dialog框信号
      choosefolder: false,
      uplbucket:'',//上传对象bucket
      uploadBucketName:'',//上传目标桶
      uploadObjectFolder:'',//上传目标路径
      uploadobjectName:'',//上传文件名
      uploadFile:'',//要给后端的文件
      uploadFilePostfix:'',//上传的后缀名
      uploadFilesignal:false,//上传文件判断信号
      uploadLoading:false,//文件上传加载
      objectuplData:[],//上传对象列表
      objectuplcurrentRow:'',//页面显式的上传路径
      objectuplPrefix:'',//后端调用的上传路径
      objectPrefix:'',//后端调用的路径
      oldCurrentRow:'',//上一级目录
      olduplCurrentRow:'',//上传的上一级目录
      oldObjectuplPrefix:'',//上传的后端调用上级目录
      selectBucketName:'',//内层dialog选中的bucket
      selectObjectFolder:'',//内层dialog选中的目录
      fileList: [],
      urls: [],
      tableData: [],
      doneurls: [],
      undoneurls: [],
      //存储图片url,是否已标注等信息的数组，用于获取远程图片信息
      imagelargeArry:[],
      selectList: [],
      multipleSelection: [],
      showData: [],
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

  created (){
    this.bucketlist()
    this.choosebucket("modelcraft")//(默认值设为modelcraft)
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
      console.log(this.selectList)
      console.log(params)
      let multData = this.selectList
      let list = this.showData
      console.log(list)
      let  multDataLen = multData.length;
      for(let i = 0; i < multDataLen; i++) {
        console.log(i)
        let n = multData[i]
        console.log(list[i])
        const params = {}
        params.bucketName = list[n].bucket
        params.folderName = list[n].dir_path
        params.objectName = list[n].file_name
        console.log('21312312312')
        console.log(params)
        this.removeobjs(params)
      }
      // deleteData(params).then(res => {
      //   this.$message({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      //   this.getData()
      // })
    },
    removeobjs(params){ 
      removeFile(params).then(response=>{
        if(20000 == response.code){
          this.suc()
          this.getData()
        }else{
          this.fai()
          this.getData()
        }
      })
    },

    suc(){//成功提醒
      this.$message({
        message: '成功',
          type: 'success'
      })
    },

    fai(){//失败提醒
      this.$message.error('发生错误');
    },

    //上传文件点击事件
    uploadobjectmsg(){
      this.uploadObjectVisible=true
      this.uploadObjectFolder = store.getters.dataSet.input_path
      this.uploadBucketName = store.getters.dataSet.bucket
      //this.uploadBucketName = store.getters.dataSet.bucket
    },

    uploadObject() {
        this.uploadLoading=true
        let multFileList = this.fileList
        let multFileListLen = multFileList.length
        let s=0
        console.log(multFileList);
        console.log(multFileListLen);
        if(multFileListLen==1){
            let formData = new FormData();
            formData.append("bucketName", this.uploadBucketName);
            console.log(this.uploadBucketName);
            formData.append("folderName", this.uploadObjectFolder);
            console.log(this.uploadObjectFolder);
            formData.append("file", multFileList[0].raw);
            console.log( multFileList[0].raw);
            formData.append("objectName", this.uploadobjectName);
            console.log(this.uploadobjectName);
            formData.append("userid", store.getters.userid)
            console.log('sssssssssssssssssssssssss')
            console.log(store.getters.uuid)
            formData.append("dataset_id", store.getters.uuid)
            uploadNew(formData).then(response=>{
                if(response.code==20000){
                    this.uploadLoading=false
                    this.suc()
                    this.getData()
                    this.uploadObjectVisible = false
                    this.uploadBucketName=''
                    this.uploadObjectFolder=''
                    this.uploadobjectName=''
                    this.uplbucket=''
                    this.objectuplcurrentRow=''
                    this.objectuplData=[]
                    this.fileList=[]
                    this.uploadFilePostfix=''
                }else{this.fai()}
            })
        }else{
            for(let i=0;i<multFileListLen;i++){
            let formData = new FormData();
            formData.append("bucketName", this.uploadBucketName);
            console.log(this.uploadBucketName);
            formData.append("folderName", this.uploadObjectFolder);
            console.log(this.uploadObjectFolder);
            formData.append("file", multFileList[i].raw);
            console.log( multFileList[i].raw);
            formData.append("objectName", '');
            formData.append("userid", store.getters.userid)
            console.log('sssssssssssssssssssssssss')
            console.log(store.getters.uuid)
            formData.append("dataset_id", store.getters.uuid)
            uploadNew(formData).then(response=>{
                if(response.code==20000){
                    s++
                    console.log(response);
                    if(s==multFileListLen-1){
                        this.uploadLoading=false
                        this.suc()
                        this.getData()
                        this.uploadObjectVisible = false 
                        this.uploadBucketName=''
                        this.uploadObjectFolder=''
                        this.uploadobjectName=''
                        this.uplbucket=''
                        this.objectuplcurrentRow=''
                        this.objectuplData=[]
                        this.fileList=[]
                        this.uploadFilePostfix=''
                    }
                }else{
                  this.fai()
                }
            })
        }
        }
    },

    //上传文件的取消键
    uploadObjectNull(){
        this.uploadBucketName=''
        this.uploadObjectFolder=''
        this.uploadobjectName=''
        this.uplbucket=''
        this.objectuplcurrentRow=''
        this.objectuplData=[]
        this.fileList=[]
        this.uploadFilePostfix=''
        this.uploadObjectVisible = false
    },

    //返回内层dialog
        returnuplFolder(){
            if(this.selectBucketName==''){this.selectBucketName=this.uplbucket}
            this.uploadBucketName=this.selectBucketName
            this.uploadObjectFolder=this.selectObjectFolder
            this.choosefolder = false
        },

        //清空内层dialog返回值
        returnNull(){
            this.uploadBucketName=''
            this.uploadObjectFolder=''
            this.uplbucket=''
            this.objectuplcurrentRow=''
            this.objectuplData=[]
            this.choosefolder = false
        },

    //上传对象的object列表数据,更新上传列表
        objectupllist(para){
            listObject(para).then(response=>{
                if(response){
                    console.log(response);
                    this.objectuplData = response.data
                }else{
                }
            }).catch()
        },

    //根据前缀名递归列上传object列表
        upllistbyPrefix(row,event,column){
            console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.objectuplcurrentRow = row.name;
                console.log(row.name.substring(0,row.name.length-1));
                this.objectuplPrefix = row.name.substring(0,row.name.length-1)
                para.bucketName = this.uplbucket
                para.objectPrefix = this.objectuplPrefix
                console.log(para);
                this.listuplObject(para)
                // this.oldCurrentRow = this.objectPrefix.split("").reverse().indexOf("/") 逆置然后求出第一个/在第几个位置 
                this.oldObjectuplPrefix = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/")-1)
                this.olduplCurrentRow = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/"))
            }else{
                console.log("isnotdir");
            }
            this.selectBucketName=this.uplbucket;
            this.selectObjectFolder=row.name;
        },

        //更新objectuplData的值
        listuplObject(para){
            listObjectByPrefix(para).then(response=>{
                this.objectuplData = response.data
            }).catch(error=>{console.log(error);})
        },

        //上传的返回上一级事件
        returnOlduplCurrentRow(){
            console.log(this.uplbucket);
            console.log(this.olduplCurrentRow);
            console.log(this.oldObjectuplPrefix);
            if(this.olduplCurrentRow==this.oldObjectuplPrefix){
                this.olduplCurrentRow=''
                this.oldObjectuplPrefix=''
                this.objectuplcurrentRow=''
                this.objectuplPrefix=''
                this.selectObjectFolder=''
            }
            const para={}
            para.bucketName = this.uplbucket;
            para.objectPrefix = this.oldObjectuplPrefix;
            console.log(para);
            this.listuplObject(para)
            this.objectuplcurrentRow = this.olduplCurrentRow
            this.objectuplPrefix = this.oldObjectuplPrefix
            this.olduplCurrentRow = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/"))
            this.oldObjectuplPrefix = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/")-1)
        },
    //获取bucketlist
        bucketlist(){
            listBucket().then(response=>{
            this.list = response.data}).catch(()=>{})
        },
    //选bucket
        choosebucket(val){
            this.objectData=[]
            this.objectcurrentRow=''
            this.objectPrefix=''
            const para = {bucketName : val}
            console.log(para);
            this.objectlist(para);
        },

        //根据bucket列object
        objectlist(para){
            listObject(para).then(response=>{
                if(response){
                    console.log(response);
                    this.objectData = response.data
                }else{
                }
            }).catch()
        },

        //选择上传对象的bucket
        chooseuplbucket(val){
            this.objectuplData=[]
            const para = {bucketName : val}
            console.log(para);
            this.objectupllist(para);
        },

    //根据object前缀递归列object
        listbyPrefix(row,event,column){
            console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.objectcurrentRow = row.name;
                console.log(row.name.substring(0,row.name.length-1));
                this.objectPrefix = row.name.substring(0,row.name.length-1)
                para.bucketName = this.bucket
                para.objectPrefix = this.objectPrefix
                console.log(para);
                this.listObject(para)
                // this.oldCurrentRow = this.objectPrefix.split("").reverse().indexOf("/") 逆置然后求出第一个/在第几个位置 
                this.oldObjectPrefix = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/")-1)
                this.oldCurrentRow = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/"))
            }else{
                console.log("isnotdir");
            }
        },
        //更新objectData的值
        listObject(para){
            listObjectByPrefix(para).then(response=>{
                this.objectData = response.data
            }).catch(error=>{console.log(error);})
        },

        //返回上一级
        returnOldCurrentRow(){
            console.log("start");
            console.log(this.bucket);
            console.log(this.oldCurrentRow);
            console.log(this.oldObjectPrefix);
            if(this.oldCurrentRow==this.oldObjectPrefix){
                this.oldCurrentRow=''
                this.oldObjectPrefix=''
                this.objectcurrentRow=''
                this.objectPrefix=''
            }
            const para={}
            para.bucketName = this.bucket;
            para.objectPrefix = this.oldObjectPrefix;
            console.log(para);
            this.listObject(para)
            this.objectcurrentRow = this.oldCurrentRow
            this.objectPrefix = this.oldObjectPrefix
            this.oldCurrentRow = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/"))
            this.oldObjectPrefix = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/")-1)
        },

        
    delFile() {
      this.fileList = [];
    },
    handleChange(file, fileList) {
        this.fileList = fileList;
        this.uploadFilePostfix = file.name.substring(file.name.indexOf('.'))
    },
    uplFile(file) {
        this.formData.append("file", file.file);
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePreview(file) {
        console.log(file);
    },

    fresh() {
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
      const params = {
        datasetuuid: store.getters.uuid,
        userid: store.getters.userid
      }
      assignByNewTeamUser(params).then(res => {
      })
      const param = {
        datasetuuid: store.getters.uuid,
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
      let _this = this;
      const params = {
        datasetuuid: store.getters.uuid
      }
      getLabel(params).then(response => {
        console.log("response",response)
        this.showData = response.data.items
        console.log('adasdad')
        console.log(this.showData)
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
    console.log("qweqweqwe")
    console.log(store.getters.dataSet.role_type)
    if(store.getters.dataSet.role_type !== "创建者") {
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
