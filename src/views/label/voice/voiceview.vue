<template>
  <div>
    <div class="dashboard-container" v-if="isaudioview">
      <!-- <el-button @click="returndataset" >返回数据集</el-button> -->
      <!-- <el-button @click="automark1()" :loading="isloading">{{automarkbtntext}}</el-button> -->
      <!-- <el-button @click="generateXML">生成标注文件</el-button>
      <el-button @click="newlabel" v-if="isalllabeled">申请新任务</el-button> -->
      <div v-for="(item, index) in testaudioArry" :key="index" style="
        display:inline-block;
        margin-left:50px
      " >
      <miniaudio style="margin-top:20px"
      :audioname="item"
      @entermark="entermark(index)"
      ></miniaudio>
      </div>
    </div>
    <div class="dashboard-container" v-if="!isaudioview">
      <wave 
      :premarktype="this.testmarktype" 
      :audioUrl="this.audioArry[nownum]"
      ></wave>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import wave from "@/components/wave.vue"
import miniaudio from '@/components/miniaudio.vue'
import { getLabel, getAssignData, getLabelDataApi} from '@/api/data'  // zeng
import request from "@/utils/request";
import store from "@/store"
import {outTimeReAssign} from '@/api/data'
import {isnowlabel,savelabel,automark,generateInfo,setUnAccept} from '@/api/mark'
import {getTagApi} from '@/api/tag'
export default {
  name: 'Dashboard',
  data(){
    return{
      //存储音频url数组，用于获取远程音频信息
      audioArry: [],
      //与音频一一对应的标注信息数组
      infoArry: [],
      //存储上次标注的信息的数组
      lastinfoArry: [],
      //与音频对于的uuid数组，是后台数据库主键
      uuidArry: [],
      //存储音频url,是否已标注等信息的数组，用于获取远程音频信息,预览界面的组件使用
      audiolargeArry:[],
      //标注状态的数组
      audioislabelArry:[],

      testaudioArry:["@/music/abc.mp3","@/music/abc1.mp3","@/music/abc2.mp3","@/music/abc3.mp3"],

      isaudioview:true,
        
      //后台读取的标注类别
      testmarktype: [
        {
          name:"man1",
          color:"rgba(128,0,0,0.5)"
        },
        {
          name:"man2",
          color:"rgba(0,128,0,0.5)"
        },
                {
          name:"man3",
          color:"rgba(0,0,128,0.5)"
        },
                {
          name:"woman1",
          color:"rgba(128,128,0,0.5)"
        },
                {
          name:"woman2",
          color:"rgba(0,128,128,0.5)"
        },
                {
          name:"woman3",
          color:"rgba(128,0,128,0.5)"
        },
      ],
      marktype: [],
      nownum: 0, 
    }
  },
  mounted() {
    this.infoArry = new Array(this.audioArry.length);
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
    console.log("mounted!!!!uuid",store.getters.uuid,"mounted!!!!store.getters.userid",store.getters.userid)
    this.requireaudio();
    //this.requiretag();
    // window.nextaudio = this.nextaudio;
    // window.previousaudio = this.previousaudio;
    // window.skipaudionext = this.skipaudionext;
    // window.skipaudiopre = this.skipaudiopre;
    // window.nomarkedaudio = this.nomarkedaudio;
    // window.undochild = this.undochild;
    // document.onkeydown = keyDownSearch;
    // this.starttimer = setInterval(()=>{
    //   this.nowseconds++;
    //   //console.log(this.nowseconds,"my定时器！！！！")
    //   if(this.nowseconds>=60000){
    //     console.log("超时")
    //     const params = {
    //         userId: store.getters.userId,
    //         dataSetId: store.getters.dataSet.user_id,
    //         dataSetUuid: store.getters.uuid
    //     }
    //     //outTimeReAssign(params)
    //     this.$store.dispatch('user/logout')
    //     this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    //     location.reload()
    //   }
    //   },1000);
  },
  methods:{
    entermark(index){
      console.log("faaaaaaaaaaaatherenter!")
      this.nownum=index;
      //this.isnowlabel1();
      this.isaudioview=!this.isaudioview;
    },
    //get请求图片数据
    requireaudio() {
      console.log("uuid",store.getters.uuid,"store.getters.userid",store.getters.userid)
      console.log("store.getters.dataSet.role_type",store.getters.dataSet.role_type,"store.getters.predictcontrol",store.getters.predictcontrol)
      let _this = this;
      this.isalllabeled = true;
      if(store.getters.dataSet.role_type === "创建者" || store.getters.predictcontrol === '1') {
        const params = {
          datasetuuid: store.getters.uuid
        }
        getLabel(params).then(function (response) {
        console.log("response",response)
        _this.audioArry=[]
        _this.infoArry=[]
        _this.lastinfoArry=[]
        _this.uuidArry=[]
        _this.audiolargeArry=[]
        _this.audioislabelArry=[]
        _this.auditinfoArry=[]
        _this.acceptinfoArry=[]
        console.log("get response.data.items",response.data.items);
        for (let i = 0; i < response.data.items.length; i++) {
          console.log("get items",[i],response.data.items[i]);
          //读取图片分辨率
          // let audio = new audio();
          // audio.src = response.data.items[i].file_path; 
          // console.log("audiosize",audio)       
          // audio.onload=() =>{
          //   console.log("audioonloadsuccess",audio.width,audio.height)
          //   let audioa={}
          //   audioa["width"]=audio.width
          //   audioa["height"]=audio.height
          //   _this.audiosize.push(audioa)
          // }
          // console.log("ima",_this.audiosize)
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
          let a={};
          a["url"]=response.data.items[i].file_path
          a["islabel"]=response.data.items[i].is_label
          //a["index"]=i
          _this.audiolargeArry.push(a);
        //   console.log("lastinfoArry", _this.lastinfoArry);
        //   console.log("url", response.data.items[i].file_path);
        //   console.log("uuid", response.data.items[i].uuid);
        //   console.log("is_label", response.data.items[i].is_label);
          //_this.islabelArry.push(response.data.items[i].is_label)
          console.log("3ffafnzxvnkzjxc", _this.audiolargeArry);
        //   console.log("get response.data.items[i]",response.data.items[i]);
        //   console.log("get response.data.items[i].file_path",response.data.items[i].file_path);
        //   console.log("get response.data.items[i].uuid",response.data.items[i].uuid);
        //   console.log("get response.data.items[i].label_data",response.data.items[i].label_data);
          _this.uuidArry.push(response.data.items[i].uuid);
        //   console.log("_this.uuidArry", _this.uuidArry);
          _this.audioArry.push(response.data.items[i].file_path);
          _this.audioislabelArry.push(response.data.items[i].is_label)
        }
        console.log("audioislabelArry",_this.audioislabelArry)
        console.log("_this.audioArry",_this.audioArry);
        console.log("_this.lastinfoArry",_this.lastinfoArry);
        //console.log("transforjson",JSON.stringify(_this.infoArry[0][0]))
      }).catch(function(error){
        console.log("error",error)
          _this.$message({
          message:"请求图片失败",
          type: 'error'
          })
      });
      }
      ///////////////////////////////////////
      else {
      const params = {
            dataset_uuid: store.getters.uuid,
            user_id: store.getters.userid
        }
        console.log(params)
        getLabelDataApi(params).then(function (response) {
        _this.audioArry=[]
        _this.infoArry=[]
        _this.lastinfoArry=[]
        _this.uuidArry=[]
        _this.audiolargeArry=[]
        _this.audioislabelArry=[]
        _this.auditinfoArry=[]
        _this.acceptinfoArry=[]
        console.log("get response.data.items",response.data.items);
        for (let i = 0; i < response.data.items.length; i++) {
          console.log(response.data.items[i]);
          //读取图片分辨率
          // let audio = new audio();
          // audio.src = response.data.items[i].file_path; 
          // console.log("audiosize",audio)       
          // audio.onload=() =>{
          //   console.log("audioonloadsuccess",audio.width,audio.height)
          //   let audioa={}
          //   audioa["width"]=audio.width
          //   audioa["height"]=audio.height
          //   _this.audiosize.push(audioa)
          // }
          // console.log("ima",_this.audiosize)
          _this.auditinfoArry[i]=response.data.items[i].audit_remark
          _this.acceptinfoArry[i]=response.data.items[i].accept_remark
          if(response.data.items[i].label_data==undefined||response.data.items[i].label_data==="[]"){
          _this.lastinfoArry.push({})
          }
          //if(response.data.items[i].label_data!==undefined) {
          else{
          let tempa = JSON.parse(response.data.items[i].label_data)
          let len = eval(tempa).length;
          console.log("len", len);
          console.log("tempa",tempa)
          //   let arr=[];
          // for (let i = 0; i < len; i++) {
          //   arr[i] = []; //js中二维数组必须进行重复的声明，否则会undefind
          //   arr[i].x1 = tempa[i].x1;
          //   arr[i].y1 = tempa[i].y1;
          //   arr[i].x2 = tempa[i].x2;
          //   arr[i].y2 = tempa[i].y2;
          //   arr[i].info = tempa[i].info;
          // }
          _this.lastinfoArry.push(tempa)
          console.log("lastinfoArry", response.data.items[i].is_label);
        }
          let a={};
          a["url"]=response.data.items[i].file_path
          a["islabel"]=response.data.items[i].is_label
          //a["index"]=i
          _this.audiolargeArry.push(a);
        //   console.log("lastinfoArry", _this.lastinfoArry);
        //   console.log("url", response.data.items[i].file_path);
        //   console.log("uuid", response.data.items[i].uuid);
        //   console.log("is_label", response.data.items[i].is_label);
          //_this.islabelArry.push(response.data.items[i].is_label)
          console.log("3ffafnzxvnkzjxc", _this.audiolargeArry);
        //   console.log("get response.data.items[i]",response.data.items[i]);
        //   console.log("get response.data.items[i].file_path",response.data.items[i].file_path);
        //   console.log("get response.data.items[i].uuid",response.data.items[i].uuid);
        //   console.log("get response.data.items[i].label_data",response.data.items[i].label_data);
          _this.uuidArry.push(response.data.items[i].uuid);
        //   console.log("_this.uuidArry", _this.uuidArry);
          _this.audioArry.push(response.data.items[i].file_path);
          _this.audioislabelArry.push(response.data.items[i].is_label)
        }
        console.log("audioislabelArry",_this.audioislabelArry)
        console.log("_this.audioArry",_this.audioArry);
        console.log("_this.lastinfoArry",_this.lastinfoArry);
        //console.log("transforjson",JSON.stringify(_this.infoArry[0][0]))
      }).catch(function(error){
        console.log("error",error)
          _this.$message({
          message:"请求图片失败",
          type: 'error'
          })
      });
      }
    },
  },
  components:{
     wave,
     miniaudio
  },
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
</style>
