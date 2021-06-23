<template>
<div style="user-select: none;">
    <div class="dashboard-container" v-if="isimageview">
      <div>
      <el-button @click="returndataset" >返回数据集</el-button>
      <el-button @click="automark()" :loading="isloading">{{automarkbtntext}}</el-button>
      <el-button @click="newlabel" v-if="isalllabeled">申请新任务</el-button>
      </div>
      <div v-for="(item, index) in imagelargeArry" :key="index" style="
        display:inline-block;
        margin-left:20px
      " >
      <miniimage style="margin-top:20px"
      :fatherimagesrc="item.url"
      :ismarked="item.islabel"
      @entermark="entermark(index)"
      ></miniimage>
      </div>
    </div>
  <div class="dashboard-container" v-if="!isimageview" style="margin-left:100px">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-button :disabled="isdisablebutton" @click="returnimageview">返回图片预览</el-button>
    <el-button :disabled="isdisablebutton" @click="nextimage">下一张(N)</el-button>
    <el-button :disabled="isdisablebutton" @click="previousimage" >上一张(P)</el-button>
    <el-button :disabled="isdisablebutton" @click="skipimage">跳过当前图片(Q)</el-button>
    <!-- <el-button @click="requireimage">请求图片</el-button> -->
    <!-- <el-button @click="savelabel(nownum)">保存标注信息</el-button> -->
    <drawpolygon style="margin-top:20px" ref='drawpolygonref'
      :fatherimagesrc="this.imageArry[nownum]"
      :imageindex="this.nownum"
      :premarktype="this.marktype"
      :lastlabelArry="this.lastinfoArry[nownum]"
      @closebutton="closebutton"
      @saveimageinfo="saveimageinfo"
    ></drawpolygon>
    <!-- <canvas id="canvas" width='800' height='800'></canvas> -->
  </div>
</div>
</template>

<script>
      // :canvaswidth="this.imagesize[nownum].width"
      // :canvasheight="this.imagesize[nownum].height"
import { mapGetters } from "vuex";
import { getLabel } from '@/api/data'  // zeng
import drawpolygon from "@/components/testdrawpolygon.vue";
import request from "@/utils/request";
import miniimage from "@/components/miniimage.vue"
import store from "@/store"
import {outTimeReAssign} from '@/api/data'
//页面键盘监听
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
  name: "Dashboard",
  data() {
    return {
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
    //   //预读取每张图片的分辨率，以适应画布
    //   imagesize:[],
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
      nopnum: 0, //标记上一张下一张的数字
      unable:false,
      nownum: 0,
      isalllabeled: false,
      starttimer:null,
      nowseconds:0,
      isdisablebutton:false,
      isimageview: true,
      automarkbtntext:"开始自动标注",
      isloading:false,
    };
  },
  components: {
    drawpolygon,
    miniimage,
  },
  mounted() {
    this.infoArry = new Array(this.imageArry.length);
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
    console.log("mounted!!!!uuid",store.getters.uuid,"mounted!!!!store.getters.userid",store.getters.userid)
    this.requireimage();
    this.requiretag();
    window.nextimage = this.nextimage;
    window.previousimage = this.previousimage;
    window.skipimage = this.skipimage;
    document.onkeydown = keyDownSearch;
        this.starttimer = setInterval(()=>{
      this.nowseconds++;
      //console.log(this.nowseconds,"my定时器！！！！")
      if(this.nowseconds>=60000){
        console.log("超时")
        const params = {
            userId: store.getters.userId,
            dataSetId: store.getters.dataSet.user_id,
            dataSetUuid: store.getters.uuid
        }
        //outTimeReAssign(params)
        this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        location.reload()
      }
      },1000);
  },
  methods: {
    returndataset(){
      this.$router.go(-1)
    },
    entermark(index){
      console.log("faaaaaaaaaaaatherenter!")
      this.nownum=index;
      this.isnowlabel();
      this.isimageview=!this.isimageview;
    },
    returnimageview(){
        this.nopnum=0;
        this.$refs.drawpolygonref.saveinfo()
        this.nownum=0;
        this.isimageview=!this.isimageview;
    },
    newlabel(){
      console.log("申请新图片")
    },
    //下一张图片
    nextimage: function () {
      if(this.unable) {
        console.log("uuuuuuuuuuuuuuuuunnnnnnnnnnnnnnnnaaaaaaaaaaaaaableeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        return
      }
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改图片")
        return
      }
      if (this.nownum < this.imageArry.length - 1) {
        this.nopnum=1;
        this.unable=true
        this.$refs.drawpolygonref.saveinfo()
        //this.nownum++;
      }
      console.log("nextimage",this.nownum);
      console.log("nextimage infoArry",this.infoArry, this.infoArry.length);
    },
    //上一张图片
    previousimage: function () {
      if(this.unable) return
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改图片")
        return
      }
      if (this.nownum > 0) {
        this.nopnum=2;
        this.unable=true
        this.$refs.drawpolygonref.saveinfo()
        //this.nownum--;
      }
      console.log("previousimage",this.nownum);
    },
    //跳过图片
    skipimage: function(){
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if(this.isdisablebutton) {
        console.log("您现在正在修改图片")
        return
      }
      if (this.nownum < this.imageArry.length - 1) {
        this.nownum++;
      }
      console.log("skipimage", this.nownum);
      this.nowseconds = 0;
    },
    closebutton: function(){
      console.log("fatherdisbtnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
      this.isdisablebutton=!this.isdisablebutton
    },
    //post修改正在标注标识
    isnowlabel:function(){
      let _this = this;
      return request({
        url:
          "http://10.19.1.77:8085/label/setLabeling?uuid="+this.uuidArry[this.nownum],
        method: "post",
        //timeout:_this.lastinfoArry.length*5000,
        //params: query
      }).then(function (response) {
        console.log(response);
      })
    },
    //保存图片标注信息
    saveimageinfo: function (markinfo, imageeindex) {
      this.infoArry[imageeindex] = markinfo;
      console.log("save success", markinfo, imageeindex);
      console.log("thisinfoArry", this.infoArry);
      this.savelabel(this.nownum)
    },
    //get请求图片数据
    requireimage: function () {
      console.log("uuid",store.getters.uuid,"store.getters.userid",store.getters.userid)
      let _this = this;
      this.isalllabeled = true;
      if(store.getters.dataSet.role_type === 2) {
        const params = {
          datasetuuid: store.getters.uuid
        }
        getLabel(params).then(function (response) {
        _this.imageArry=[]
        _this.infoArry=[]
        _this.lastinfoArry=[]
        _this.uuidArry=[]
        _this.imagelargeArry=[]
        console.log("get response.data.items",response.data.items);
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
          if(response.data.items[i].is_label!=1) _this.isalllabeled=false;
          if(response.data.items[i].label_data!==undefined) {
          
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
          _this.imagelargeArry.push(a);
        //   console.log("lastinfoArry", _this.lastinfoArry);
        //   console.log("url", response.data.items[i].file_path);
        //   console.log("uuid", response.data.items[i].uuid);
        //   console.log("is_label", response.data.items[i].is_label);
          //_this.islabelArry.push(response.data.items[i].is_label)
          console.log("3ffafnzxvnkzjxc", _this.imagelargeArry);
        //   console.log("get response.data.items[i]",response.data.items[i]);
        //   console.log("get response.data.items[i].file_path",response.data.items[i].file_path);
        //   console.log("get response.data.items[i].uuid",response.data.items[i].uuid);
        //   console.log("get response.data.items[i].label_data",response.data.items[i].label_data);
          _this.uuidArry.push(response.data.items[i].uuid);
        //   console.log("_this.uuidArry", _this.uuidArry);
          _this.imageArry.push(response.data.items[i].file_path);
        }
        console.log("_this.imageArry",_this.imageArry);
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
      return request({
        url: 
        "http://10.19.1.181:8082/label?dataset_uuid="+store.getters.uuid+"&user_id="+store.getters.userid,
        method: "get",
        //params: query
      }).then(function (response) {
        _this.imageArry=[]
        _this.infoArry=[]
        _this.lastinfoArry=[]
        _this.uuidArry=[]
        _this.imagelargeArry=[]
        console.log("get response.data.items",response.data.items);
        for (let i = 0; i < response.data.items.length; i++) {
          console.log(response.data.items[i]);
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
          if(response.data.items[i].label_data!==undefined) {
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
          _this.imagelargeArry.push(a);
        //   console.log("lastinfoArry", _this.lastinfoArry);
        //   console.log("url", response.data.items[i].file_path);
        //   console.log("uuid", response.data.items[i].uuid);
        //   console.log("is_label", response.data.items[i].is_label);
          //_this.islabelArry.push(response.data.items[i].is_label)
          console.log("3ffafnzxvnkzjxc", _this.imagelargeArry);
        //   console.log("get response.data.items[i]",response.data.items[i]);
        //   console.log("get response.data.items[i].file_path",response.data.items[i].file_path);
        //   console.log("get response.data.items[i].uuid",response.data.items[i].uuid);
        //   console.log("get response.data.items[i].label_data",response.data.items[i].label_data);
          _this.uuidArry.push(response.data.items[i].uuid);
        //   console.log("_this.uuidArry", _this.uuidArry);
          _this.imageArry.push(response.data.items[i].file_path);
        }
        console.log("_this.imageArry",_this.imageArry);
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
    //get请求数据集的标签集
    requiretag: function () {
      let _this = this;
      this.marktype=[]
      return request({
        url:
          "http://10.19.1.181:8082/dataset/tag?dataset_uuid="+store.getters.uuid,
        method: "get",
        //params: query
      }).then(function (response) {
        console.log(response)
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
    savelabel(i) {
      let _this=this
      this.nowseconds = 0;
      console.log("put000no",this.infoArry[i])
      console.log("put000",JSON.stringify(this.infoArry[i]))
      let isab
      if(this.infoArry[i].polygon.length>0||this.infoArry[i].line.length>0) isab=1
      else isab=2
      return request({
        url: "http://10.19.1.181:8082/label",
        method: "put",
        data: {
          label_data: JSON.stringify(this.infoArry[i]),
          //"last_update_by": "liaoziheng",
          //file_type: "polygon",
          is_label: isab,
          uuid: this.uuidArry[i],
          dataset_id: store.getters.uuid
        },
      }).then(function (response) {
        console.log(response);
        //console.log("isab",isab);
        _this.$message({
          message:"保存成功",
          duration:300,
          type: 'success'
          });
        _this.requireimage();
        _this.requiretag().then(function(){
          if(_this.nopnum==1) {
            _this.nownum++;
            _this.isnowlabel();
          }
          if(_this.nopnum==2) {
            _this.nownum--;
            _this.isnowlabel();
          }
          _this.unable=false;
        });;
      }).catch(function(error){
        console.log("error",error)
          _this.$message({
          message:"保存失败",
          type: 'error'
          })
        _this.requireimage();
        _this.requiretag();
      });
    },
        //post半自动标注
    automark(){
      let _this = this;
      _this.$message('开始像素级拉框自动标注');
      _this.automarkbtntext="标注中";
      _this.isloading=true;
      return request({
        url:
          "http://10.19.1.181:8082/dataset/auto?dataset_id="+store.getters.uuid,
        method: "post",
        timeout:15000,
        //params: query
      }).then(function (response) {
        console.log(response);
        _this.$message({
          message:"像素级自动标注成功",
          type: 'success'
          });
        _this.automarkbtntext="开始自动标注";
        _this.isloading=false;
        _this.requireimage();
        _this.requiretag();
      }).catch(function(error){
        console.log("error111",error)
          _this.$message({
          message:"像素级自动标注失败",
          type: 'error'
          });
        _this.automarkbtntext="开始自动标注";
        _this.isloading=false;
        _this.requireimage();
        _this.requiretag();
      });
    },
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
</style>
