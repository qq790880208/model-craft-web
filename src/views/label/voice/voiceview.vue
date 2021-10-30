<template>
  <div>
    <div class="dashboard-container" v-if="isaudioview">
      <div>
      <el-button @click="returndataset" >返回数据集</el-button>
      <!-- <el-button @click="automark1()" :loading="isloading">{{automarkbtntext}}</el-button> -->
      <!-- <el-button @click="generateXML">生成标注文件</el-button> -->
      <!-- <el-button @click="newlabel" v-if="isalllabeled">申请新任务</el-button> -->
      </div>
      <div v-for="(item, index) in audiolargeArry" :key="index" style="
        display:inline-block;
        margin-left:50px
      " >
      <miniaudio style="margin-top:20px"
      :audioname="item"
      :ismarked="item.islabel"
      @entermark="entermark(index)"
      ></miniaudio>
      </div>
    </div>
    <div class="dashboard-container" v-if="!isaudioview"  style="margin-left:100px">
      <el-button :disabled="isdisablebutton" @click="returnaudioview">保存并返回音频预览</el-button>
      <el-button :disabled="isdisablebutton" @click="skipaudiopre">上一个(A)</el-button>
      <el-button :disabled="isdisablebutton" @click="previousaudio">保存并上一个(S)</el-button>
      <el-button :disabled="isdisablebutton" @click="nextaudio">保存并下一个D)</el-button>   
      <el-button :disabled="isdisablebutton" @click="skipaudionext">下一个(F)</el-button>
      <el-button :disabled="isdisablebutton" @click="nomarkedaudio">无可标注类型(G)</el-button>
      <!-- <el-button @click="returnaudioview">保存并返回音频预览</el-button>
      <el-button @click="skipaudiopre">上一个(A)</el-button>
      <el-button @click="previousaudio">保存并上一个(S)</el-button>
      <el-button @click="nextaudio">保存并下一个D)</el-button>   
      <el-button @click="skipaudionext">下一个(F)</el-button>
      <el-button @click="nomarkedaudio">无可标注类型(G)</el-button> -->
      <wave ref='waveref' style="margin-top:20px"
      :premarktype="this.marktype" 
      :audioindex="this.nownum"
      :fatheraudioUrl="this.audioArry[nownum]"
      :lastlabelArry="this.lastinfoArry[nownum]"
      @closebutton="closebutton"
      @saveaudioinfo="saveaudioinfo"
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
//页面键盘监听
function keyDownSearch(e){
  console.log("keydown!!!!!!!!!!!!")
  let theEvent = e.event || window.event;
  let code = theEvent.keyCode ||  theEvent.which || theEvent.charCode
  if(code == 83){ //保存并上一张
    console.log("ssssssssss!!!!!!!!!!!!!")
    previousaudio()
    //return false;     
  }
  if(code == 68){ //保存并下一张
    console.log("dddddddddd!!!!!!!!!!!!!")
    nextaudio()
  //return true;
  }
  if(code == 70){ //下一张
    console.log("ffffffffff!!!!!!!!!!!!!")
    skipaudionext()
  }
  if(code == 65){ //上一张
    console.log("aaaaaaaaaa!!!!!!!!!!!!!")
    skipaudiopre()
  }
  if(code == 71){ //无可标注下一张
    console.log("gggggggggg!!!!!!!!!!!!!")
    nomarkedaudio()
  }
  if(code == 46){ //删除快捷键
    console.log("ddddddddddelete!!!!!!!!!!!!!")
    deleteSelect();
  //return true;
  }
}
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
      nopnum: 0,
      nownum: 0, 
      isdisablebutton:false,
    }
  },
  mounted() {
    this.infoArry = new Array(this.audioArry.length);
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
    console.log("mounted!!!!uuid",store.getters.uuid,"mounted!!!!store.getters.userid",store.getters.userid)
    this.requireaudio();
    this.requiretag();
    window.nextaudio = this.nextaudio;
    window.previousaudio = this.previousaudio;
    window.skipaudionext = this.skipaudionext;
    window.skipaudiopre = this.skipaudiopre;
    window.nomarkedaudio = this.nomarkedaudio;
    window.deleteSelect = this.deleteSelect;
    //window.undochild = this.undochild;
    document.onkeydown = keyDownSearch;
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
    returndataset(){
      this.$router.go(-1)
    },
    returnaudioview(){
      this.nopnum=0;
      this.$refs.waveref.saveinfo(true,false)
      this.nownum=0;
      this.isaudioview=!this.isaudioview;
    },
    returnaudioviewNoSave(){
      this.nopnum=0;
      this.nownum=0;
      this.isaudioview=!this.isaudioview;
    },
    closebutton(){
      console.log("fatherdisbtnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
      this.isdisablebutton=!this.isdisablebutton
    },
    deleteSelect(){
      if(this.unable) return
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改图片")
        return
      }
      this.$refs.waveref.deletemarkedbi();
    },
    //保存并下一个音频
    nextaudio() {
      if(this.unable) {
        console.log("uuuuuuuuuuuuuuuuunnnnnnnnnnnnnnnnaaaaaaaaaaaaaableeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        return
      }
      if(this.isaudioview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改音频")
        return
      }
      if (this.nownum < this.audioArry.length) {
        this.nopnum=1;
        this.unable=true
        this.$refs.waveref.saveinfo(true,false)
        //this.nownum++;
      }
      console.log("nextaudio",this.nownum);
      console.log("nextaudio infoArry",this.infoArry, this.infoArry.length);
    },
    //保存并上一个音频
    previousaudio() {
      if(this.unable) return
      if(this.isaudioview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改音频")
        return
      }
      if (this.nownum >= 0) {
        this.nopnum=2;
        this.unable=true
        this.$refs.waveref.saveinfo(true,false)
        //this.nownum--;
      }
      console.log("previousaudio",this.nownum);
    },
    //无标注类型
    nomarkedaudio(){
      if(this.unable) {
        //console.log("unable!!!!!!!!!!!!!!!!!!!!")
        return
      }
      if(this.isaudioview) {
        console.log("处于预览界面");
        return
      }
      if(this.isdisablebutton) {
        console.log("您现在正在修改音频")
        return
      }
      if (this.nownum < this.audioArry.length) {
        this.nopnum=1;
        this.unable=true
        this.$refs.waveref.saveinfo(false,false)
        //this.nownum++;
      }
      console.log("nextaudio", this.nownum);
    },
    //下一个
    skipaudionext(){
      if(this.isaudioview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改音频")
        return
      }
      if (this.nownum < this.audioArry.length - 1) {
        this.$refs.waveref.saveinfo(true,true)
        this.nownum++;
      }
      else {
        this.$refs.waveref.saveinfo(true,true)
        this.returnaudioviewNoSave();
      }
      console.log("skipaudio", this.nownum);
      this.nowseconds = 0;
    },
    //上一个
    skipaudiopre(){
      if(this.isaudioview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改音频")
        return
      }
      if (this.nownum > 0) {
        this.$refs.waveref.saveinfo(true,true)
        this.nownum--;
      }
      else {
        this.$refs.waveref.saveinfo(true,true)
        this.returnaudioviewNoSave();
      }
      console.log("skipaudio", this.nownum);
      this.nowseconds = 0;
    },
    entermark(index){
      this.nownum=index;
      console.log("faaaaaaaaaaaatherenter!",this.nownum)
      //this.isnowlabel1();
      this.isaudioview=!this.isaudioview;
    },
    //post修改正在标注标识
    isnowlabel1:function(){
      const params = {
        uuid: this.uuidArry[this.nownum]
      }
      console.log(params)
      isnowlabel(params).then(response => {
        console.log("isnowlabel",response);
      })
    },
    //保存音频标注信息
    saveaudioinfo: function (markinfo, audioeindex,infoFlag,changeFlag) {
      this.infoArry[audioeindex] = markinfo;
      console.log("save success", markinfo, audioeindex);
      console.log("thisinfoArry", this.infoArry);
      this.savelabel1(this.nownum,infoFlag,changeFlag)
    },
    //get请求音频数据
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
          //读取音频分辨率
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
          _this.lastinfoArry.push({audio:[]})
          console.log("lastinfoArry", _this.lastinfoArry[i]);
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
          message:"请求音频失败",
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
          console.log("response",response)
        _this.audioArry=[]
        _this.infoArry=[]
        _this.lastinfoArry=[]
        _this.uuidArry=[]
        _this.audiolargeArry=[]
        _this.audioislabelArry=[]
        // _this.auditinfoArry=[]
        // _this.acceptinfoArry=[]
        console.log("get response.data.items",response.data.items);
        for (let i = 0; i < response.data.items.length; i++) {
          console.log(response.data.items[i]);
          // _this.auditinfoArry[i]=response.data.items[i].audit_remark
          // _this.acceptinfoArry[i]=response.data.items[i].accept_remark
          if(response.data.items[i].label_data==undefined||response.data.items[i].label_data==="[]"){
          _this.lastinfoArry.push({audio:[]})
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
          message:"请求音频失败",
          type: 'error'
          })
      });
      }
    },
    //get请求数据集的标签集
    requiretag() {
      let _this = this;
      this.marktype=[]
      const params = {
        dataset_uuid:store.getters.uuid
      }
      return getTagApi(params).then(function (response) {
        console.log("taggggggggggggggggggggggggggggggggggggg",response)
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
          type: 'error'
          })
      });
    },
    //put请求
    savelabel1(i,infoFlag,changeFlag) {
      let _this=this
      this.nowseconds = 0;
      if(changeFlag){
        console.log("onlyislabel")
          let data={
          is_label: this.audioislabelArry[i],
          uuid: this.uuidArry[i],
          dataset_id: store.getters.uuid
      }
      savelabel(data).then(function (response) {
        console.log("change!!!!!!!!!!!!!!!!!!!!!!!",response)
        if(!_this.isDestroy) _this.isnowlabel1();
      })
      }
      else{
      console.log("put000no",i,this.infoArry[i])
      console.log("put000",JSON.stringify(this.infoArry[i]))
      let data1 = {
        dataSetId: store.getters.uuid
      }
      setUnAccept(data1).then(response=>{
        console.log("setUnAcceptsetUnAcceptsetUnAccept",response);
      })
      let isab
      if(this.infoArry[i].audio.length>0||!infoFlag) isab=1
      else isab=2
      let data = {
          label_data: JSON.stringify(this.infoArry[i]),
          is_label: isab,
          uuid: this.uuidArry[i],
          dataset_id: store.getters.uuid
      }
      savelabel(data).then(function (response) {
        console.log(response);
        //console.log("isab",isab);
        _this.$message({
          message:"保存成功",
          duration:300,
          type: 'success'
          });
        _this.requireaudio();
        _this.requiretag().then(function(){
          console.log("thenthenthenthen")
          if(_this.nopnum==1) {
            if(_this.nownum < _this.audioArry.length - 1){
            _this.nownum++;
            _this.isnowlabel1();
            }
            else {
              _this.returnaudioviewNoSave();
            }
          }
          if(_this.nopnum==2) {
            if(_this.nownum > 0){
            _this.nownum--;
            _this.isnowlabel1();
            }
            else {
              _this.returnaudioviewNoSave();
            }
          }
          _this.unable=false;
        });;
      }).catch(function(error){
        console.log("error",error)
          _this.$message({
          message:"保存失败",
          type: 'error'
          })
        _this.requireaudio();
        _this.requiretag();
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
