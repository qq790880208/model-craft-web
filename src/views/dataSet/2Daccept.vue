<template>
  <div style="user-select: none;">
    <div class="dashboard-container" v-if="isimageview">
      <div>
        <el-button type="primary" plain size="mini" @click="returndataset" >返回数据集</el-button>
        <el-button type="primary" plain size="mini" @click="batchSave">批量通过</el-button>
        <el-button type="primary" plain size="mini" @click="batchUnAccept">批量不通过</el-button>
        <span class="checkAll">
          <input type="checkbox" @change="checkedAll()" :checked="checkedList.length === imagelargeArry.length"  />
          <span>全选</span>
        </span>
        
        <!-- <el-button type="primary" plain size="mini" @click="batchReSet">批量重置</el-button> -->
      </div>
      <div v-for="(item, index) in imagelargeArry" :key="index" style="
        display:inline-block;
        margin-left:20px
        " >
        <div>
            <div  style="margin-top:20px">
                <input type="checkbox" name="" @change="addToList(item.uuid)" :checked="checkedList.indexOf(item.uuid)!=-1">
                <!-- <el-checkbox @change="addToList(item.uuid)" v-if="item.uuid in this.checkedList" checked></el-checkbox> -->
            </div>
            <miniimage style="margin-top:1px"
                :fatherimagesrc="item.url"
                :ismarked="item.islabel"
                @entermark="entermark(index)"
            ></miniimage>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="dashboard-container" v-if="!isimageview" style="margin-left:100px">
      <el-button @click="returnimageview">返回图片预览</el-button>
      <el-button @click="nextimage">下一张(N)</el-button>
      <el-button @click="previousimage">上一张(P)</el-button>
      <!-- <el-button @click="skipimage">跳过当前图片(Q)</el-button> -->
      <el-button @click="pass">通过</el-button>
      <el-button @click="unAccept">不通过</el-button>
      <!-- <el-button @click="reset">重置</el-button> -->
      <imageselect style="margin-top:20px;" ref='imageselectref' 
        :fatherimagesrc="this.imageArry[nownum]"
        :imageindex="this.nownum"
        :premarktype="this.marktype"
        :lastlabelArry="this.lastinfoArry[nownum]"
        @saveimageinfo="saveimageinfo"
      ></imageselect>
    </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getLabel } from '@/api/data'  // zeng
import imageselect from "@/components/2daudit.vue";
import request from "@/utils/request";
// import miniimage from "@/components/miniimage.vue"
import miniimage from "@/components/acceptdatashow.vue"
import store from "@/store"
import {outTimeReAssign, getNewLabels} from '@/api/data'
import { getAcceptDataApi, batchAcceptApi, acceptApi, unAcceptApi, batchUnAcceptApi } from '@/api/accept'
import { getAuditDatasByUserId, getIsAuditApi, batchSaveApi, batchRejectApi, batchReSetApi, passApi, reSetApi, rejectApi } from '@/api/audit'
import { getTagApi } from '@/api/tag'

//import axios from 'node_modules/axios';
// import labelinfo from '@/components/labelinfo.vue'
//页面键盘监听
//document.onkeydown = keyDownSearch;
function keyDownSearch(e){
  console.log("keydown!!!!!!!!!!!!")
  let theEvent = e.event || window.event;
  let code = theEvent.keyCode ||  theEvent.which || theEvent.charCode
  if(code == 80){ //上一张
    console.log("pppppppp!!!!!!!!!!!!!")
    previousimage()
    //return false;     
  }
  if(code == 78){ //下一张
    console.log("nnnnnnnn!!!!!!!!!!!!!")
    nextimage()
  //return true;
  }
  if(code == 81){ //跳过
    console.log("qqqqqqqq!!!!!!!!!!!!!")
    skipimage()
  }
}

export default {
  name: "Imageselect",
  data() {
    return {
      isAudited: 0,
      checkedList: [],
      isCheckedAll: false,
      //存储图片url数组，用于获取远程图片信息
      imageArry: [],
      //与图片一一对应的标注信息数组
      infoArry: [],
      //存储上次标注的信息的数组
      lastinfoArry: [],
      //与图片对于的uuid数组，是后台数据库主键
      uuidArry: [],
      //存储图片url,是否已标注等信息的数组，用于获取远程图片信息
      imagelargeArry:[],
      //后台读取的标注类别
      testmarktype: [
        {
          name:"car",
          color:"rgba(128,0,0,0.75)"
        },
        {
          name:"person",
          color:"rgba(0,128,0,0.75)"
        },
        {
          name:"human1",
          color:"rgba(0,0,128,0.75)"
        },
        {
          name:"human2",
          color:"rgba(128,128,0,0.75)"
        },
        {
          name:"human3",
          color:"rgba(0,128,128,0.75)"
        },
        {
          name:"human4",
          color:"rgba(128,0,128,0.75)"
        },
      ],
      marktype: [],

      unable: false, //防止连续切换图片
      nownum: 0,
      isalllabeled: false,
      starttimer:null,
      nowseconds:0,
      isimageview: true,
      automarkbtntext:"开始自动标注",
      isloading:false,
    };
  },

  components: {
    imageselect,
    miniimage,
    // labelinfo
  },
  
  methods: {
    returndataset(){
        // this.$router.go(-1)
        this.$router.push('/data')
    },
    out(){
        console.log(this.checkedList)
    },
    pass() {
        this.isAudited = true;
        console.log(this.imagelargeArry)
        const params = {
            labelUuid: this.uuidArry[this.nownum],
            dataset_id: store.getters.uuid
        }
        acceptApi(params).then(res => {
            this.$message({
                message: '验收通过',
                duration:300,
                type: 'success'
            })
        }).catch(function(error) {
            this.$message({
                message: '验收失败',
                duration:300,
                type: 'error'
            })
        })
    },
    unAccept() {
        this.isAudited = true;
        const params = {
            labelUuid: this.uuidArry[this.nownum],
            dataset_id: store.getters.uuid
        }
        unAcceptApi(params).then(res => {
            this.$message({
                message: '验收不通过成功',
                duration:300,
                type: 'success'
            })
        }).catch(function(error) {
            this.$message({
                message: '验收不通过失败',
                duration:300,
                type: 'error'
            })
        })
    },
    // reset() {
    //     this.isAudited = true;
    //     const params = {
    //         labelUuid: this.uuidArry[this.nownum]
    //     }
    //     reSetApi(params).then(res => {
    //         this.$message({
    //             message: '重置成功',
    //             type: 'success'
    //         })
    //         this.getAcceptDataList()
    //     }).catch(function(error) {
    //         this.$message({
    //             message: '重置失败',
    //             type: 'error'
    //         })
    //     })
    // },
    addToList(uuid) {
        console.log(uuid)
        if(this.checkedList.indexOf(uuid)==-1){
            this.checkedList.push(uuid)
        }else{
            this.checkedList.splice(this.checkedList.indexOf(uuid), 1); 
        }
    },
    checkedAll () {
      this.isCheckedAll = !this.isCheckedAll
      if (this.isCheckedAll) {
        // 全选时
        this.checkedList = []
        this.imagelargeArry.forEach(function (item) {
          this.checkedList.push(item.uuid)
        }, this)
      } else {
        this.checkedList = []
      }
    },
    batchSave() {
        console.log(this.checkedList.join(","))
        const params = {
            labelUuids: this.checkedList.join(","),
            dataset_id: store.getters.uuid
        }
        batchAcceptApi(params).then(res => {
            this.$message({
                message: res.message,
                type: 'success'
            })
            this.getAcceptDataList()
            this.checkedList = []
        })
    },
    batchUnAccept() {
        console.log(this.checkedList.join(","))
        const params = {
            labelUuids: this.checkedList.join(","),
            dataset_id: store.getters.uuid
        }            
        batchUnAcceptApi(params).then(res => {
            this.$message({
                message: res.message,
                type: 'success'
            })
            this.getAcceptDataList()
            this.checkedList = []
        })
    },
    // batchReSet() {
    //     console.log(this.checkedList.join(","))
    //     const params = {
    //         labelUuids: this.checkedList.join(",")
    //     }
    //     batchReSetApi(params).then(res => {
    //         this.$message({
    //             message: res.message,
    //             type: 'success'
    //         })
    //         this.getAcceptDataList()
    //         this.checkedList = []
    //     })
    // },
    entermark(index){
      console.log("faaaaaaaaaaaatherenter!")
      this.nownum=index;
    //   this.isnowlabel();
      this.isimageview=!this.isimageview;
    },
    returnimageview(){
      this.getAcceptDataList()
   
      this.getTags()
        this.nopnum=0;
        // this.$refs.imageselectref.saveinfo()
        // this.nownum=0;
        this.isimageview=!this.isimageview;
    },
    markarray: function (childinfoArry) {
      this.infoArry = childinfoArry;
      console.log("222" + this.infoArry);
    },
    setAudited() {
        const params = {
            labelUuid: this.uuidArry[this.nownum]
        }
        getIsAuditApi(params).then(res => {
            this.isAudited = res.data.items
        })
    },
    //跳过图片
    skipimage() {
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if (this.nownum < this.imageArry.length - 1) {
        this.nownum++;
      }
      console.log("skipimage", this.nownum);
      this.nowseconds = 0;
    },
    //下一张图片
    nextimage() {     
      if(this.isimageview) {
        console.log("处于预览界面");
        return
      }
      if (this.nownum < this.imageArry.length - 1) {
        this.nownum++;
      }
      console.log("nextimage", this.nownum);
 
    },
    //上一张图片
    previousimage() {  
      if(this.isimageview) {
        console.log("处于预览界面");
        return
      }

      if (this.nownum > 0) {
        this.nownum--;
      }
      console.log("previousimage", this.nownum);
    },
    //get 请求图片
    getAcceptDataList() {
        let _this = this
        this.isalllabeled = true
        this.imageArry = []
        const params = {
            dataSetUuid: store.getters.uuid,
            userId: store.getters.userid
        }
        console.log(params)
        getAcceptDataApi(params).then(response => {
            _this.imageArry=[]
            _this.infoArry=[]
            _this.lastinfoArry=[]
            _this.uuidArry=[]
            _this.imagelargeArry=[]
            console.log("get图片结果", response);
            for (let i = 0; i < response.data.items.length; i++) {
                if(response.data.items[i].label_data==undefined||response.data.items[i].label_data==="[]"){
               _this.lastinfoArry.push([]);
                }
          //if(response.data.items[i].label_data!==undefined) {
                else{
                    console.log("testtttttttttt",JSON.parse(response.data.items[i].label_data).rectangle);
                    let tempa = JSON.parse(response.data.items[i].label_data).rectangle;
                    let len = eval(tempa).length;
                    //console.log("len", len);
                    let arr = [];
                    for (let i = 0; i < len; i++) {
                        arr[i] = []; //js中二维数组必须进行重复的声明，否则会undefind
                        arr[i].x1 = tempa[i].x1;
                        arr[i].y1 = tempa[i].y1;
                        arr[i].x2 = tempa[i].x2;
                        arr[i].y2 = tempa[i].y2;
                        arr[i].info = tempa[i].info;
                    }
                    _this.lastinfoArry.push(arr);
                    console.log("lastinfoArry",  _this.lastinfoArry,response.data.items[i].is_label);
                }
                let a={};
                a["url"]=response.data.items[i].file_path
                a["islabel"]=response.data.items[i].is_accept
                a["uuid"] = response.data.items[i].uuid
                //a["index"]=i
                _this.imagelargeArry.push(a);
        
                _this.uuidArry.push(response.data.items[i].uuid);
          
                _this.imageArry.push(response.data.items[i].file_path);
            }
        }).catch(function(error){
            console.log("error",error)
            _this.$message({
                message:"图片数据为0，重新设置验收比例",
                duration:1000,
                type: 'error'
            })
        })
    },
    // get请求数据集的标签集
    getTags() {
        let _this = this;
        this.marktype=[]
        const params = {
            dataset_uuid: store.getters.uuid
        }
        getTagApi(params).then(response =>{
            for (let i = 0; i < response.data.items.length; i++) {
                let a={};
                a["name"]=response.data.items[i].name
                a["color"]=response.data.items[i].color
                _this.marktype.push(a)
            }
            console.log("marktype",_this.marktype)
        }).catch(function(error){
            console.log("error",error)
            _this.$message({
                message:"请求标签集合失败",
                duration:1000,
                type: 'error'
            })
        })
    },
  },

  mounted: function () {
    //console.log(this.infoArry[0])
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
    console.log("mounted!!!!uuid",store.getters.uuid,"mounted!!!!store.getters.userid",store.getters.userid)
    this.getAcceptDataList()
    this.infoArry = new Array(this.imageArry.length);
    this.getTags()
    window.nextimage = this.nextimage;
    window.previousimage = this.previousimage;
    window.skipimage = this.skipimage;
    document.onkeydown = keyDownSearch;
    this.starttimer = setInterval(()=>{
      this.nowseconds++;
      //console.log(this.nowseconds,"my定时器！！！！")
      if(this.nowseconds>=30000){
        console.log("超时")
        const params = {
            userId: store.getters.userid,
            dataSetId: store.getters.dataSet.user_id,
            dataSetUuid: store.getters.uuid
        }
        outTimeReAssign(params)
        this.$store.dispatch('user/logout')
        this.$router.push('/login?redirect=${this.$route.fullPath}')
        location.reload()
      }
      },1000);
  },
  destroyed(){
    document.onkeydown = undefined;
    clearInterval(this.starttimer);
    this.starttimer=null;
    this.nowseconds=0;
  },
  computed: {
    ...mapGetters(["name"]),
  },
};
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
<style scoped>
.imageviewa{
  display:flex;
}
</style>
