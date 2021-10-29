<template>
  <div style="user-select: none;">
    <div class="dashboard-container" v-if="isimageview">
      <div>
      <el-button @click="returndataset" >返回数据集</el-button>
      <!-- <el-button @click="automark1()" :loading="isloading">{{automarkbtntext}}</el-button> -->
      <el-button @click="generateXML">生成标注文件</el-button>
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
    <el-button :disabled="isdisablebutton" @click="returnimageview">保存并返回图片预览</el-button>
    <el-button :disabled="isdisablebutton" @click="skipimagepre">上一张(A)</el-button>
    <el-button :disabled="isdisablebutton" @click="previousimage">保存并上一张(S)</el-button>
    <el-button :disabled="isdisablebutton" @click="nextimage">保存并下一张D)</el-button>   
    <el-button :disabled="isdisablebutton" @click="skipimagenext">下一张(F)</el-button>
    <el-button :disabled="isdisablebutton" @click="nomarkedimage">无可标注类型(G)</el-button>
      <imageselect style="margin-top:20px;" ref='imageselectref' 
        :fatherimagesrc="this.imageArry[nownum]"
        :imageindex="this.nownum"
        :premarktype="this.marktype"
        :auditremakeinfo="this.auditinfoArry[nownum]"
        :acceptremakeinfo="this.acceptinfoArry[nownum]"
        :lastlabelArry="this.lastinfoArry[nownum]"
        @closebutton="closebutton"
        @saveimageinfo="saveimageinfo"
      ></imageselect>
    </div>
    </div>
  <!-- </el-row> -->
</template>

<script>
import { mapGetters } from "vuex";
import { getLabel, getLabelDataApi } from '@/api/data'  // zeng
import imageselect from "@/components/2dmark.vue";
import request from "@/utils/request";
import miniimage from "@/components/miniimage.vue"
import store from "@/store"
import {outTimeReAssign, getNewLabels, getAssignData} from '@/api/data'
import { getAuditDatasByUserId} from '@/api/audit'
import {isnowlabel,savelabel,automark,generateInfo,setUnAccept} from '@/api/mark'
import {getTagApi} from '@/api/tag'
//import axios from 'node_modules/axios';
// import labelinfo from '@/components/labelinfo.vue'
//页面键盘监听
//document.onkeydown = keyDownSearch;
function keyDownSearch(e){
  console.log("keydown!!!!!!!!!!!!")
  let theEvent = e.event || window.event;
  let code = theEvent.keyCode ||  theEvent.which || theEvent.charCode
  if(code == 83){ //保存并上一张
    console.log("ssssssssss!!!!!!!!!!!!!")
    previousimage()
    //return false;     
  }
  if(code == 68){ //保存并下一张
    console.log("dddddddddd!!!!!!!!!!!!!")
    nextimage()
  //return true;
  }
  if(code == 70){ //下一张
    console.log("ffffffffff!!!!!!!!!!!!!")
    skipimagenext()
  }
  if(code == 65){ //上一张
    console.log("aaaaaaaaaa!!!!!!!!!!!!!")
    skipimagepre()
  }
  if(code == 71){ //无可标注下一张
    console.log("gggggggggg!!!!!!!!!!!!!")
    nomarkedimage()
  }
  if(code == 46){ //删除快捷键
    console.log("ddddddddddelete!!!!!!!!!!!!!")
    deleteSelect();
  //return true;
  }
  if(code == 27){ //保存并上一张
    console.log("eeeeeeeeeeeeeeeeeeeeessssssssssccccccccccccccccccc!!!!!!!!!!!!!")
    undochild()
    //return false;     
  }
}

export default {
  name: "Imageselect",
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
      //标注状态的数组
      imageislabelArry:[],
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
      nopnum: 0, //标记下一张上一张还是返回的数字
      unable: false, //防止连续切换图片
      nownum: 0,
      isalllabeled: false,
      starttimer:null,
      nowseconds:0,
      isdisablebutton:false,
      isimageview: true,
      automarkbtntext:"开始自动标注",
      isloading:false,
      isDestroy:false,
    };
  },

  components: {
    imageselect,
    miniimage,
    // labelinfo
  },
  methods: {
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
      this.$refs.imageselectref.deletemarkedbi();
    },
    undochild(){
      this.$refs.imageselectref.undo()
    },
    returndataset(){
      this.$router.go(-1)
    },
    entermark(index){
      console.log("faaaaaaaaaaaatherenter!",this.lastinfoArry,this.nownum,this.lastinfoArry[this.nownum])
      this.nownum=index;
      this.isnowlabel1();
      this.isimageview=!this.isimageview;
    },
    returnimageview(){
        this.nopnum=0;
        this.$refs.imageselectref.saveinfo(true,false)
        this.nownum=0;
        this.isimageview=!this.isimageview;
    },
    returnimageviewNoSave(){
        this.nopnum=0;
        this.nownum=0;
        this.isimageview=!this.isimageview;
    },
    // markarray: function (childinfoArry) {
    //   this.infoArry = childinfoArry;
    //   console.log("222" + this.infoArry);
    // },
    newlabel(){
      console.log("申请新图片")
      console.log(store.getters.userid)
      const params = {
        id: store.getters.userid,
        datasetuuid: store.getters.dataSet.uuid
      }
      getNewLabels(params).then(res => {
        this.requireimage()
      })
    },
    //下一张
    skipimagenext(){
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if (this.nownum < this.imageArry.length - 1) {
        this.$refs.imageselectref.saveinfo(true,true)
        this.nownum++;
      }
      else {
        this.$refs.imageselectref.saveinfo(true,true)
        this.returnimageviewNoSave();
      }
      
      console.log("skipimage", this.nownum);
      this.nowseconds = 0;
    },
    //上一张
    skipimagepre(){
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if (this.nownum > 0) {
        this.$refs.imageselectref.saveinfo(true,true)
        this.nownum--;
      }
      else {
        this.$refs.imageselectref.saveinfo(true,true)
        this.returnimageviewNoSave();
      }

      console.log("skipimage", this.nownum);
      this.nowseconds = 0;
    },
    //保存并下一张图片
    nextimage() {
      if(this.unable) {
        //console.log("unable!!!!!!!!!!!!!!!!!!!!")
        return
      }
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if (this.nownum < this.imageArry.length) {
        this.nopnum=1;
        this.unable=true
        this.$refs.imageselectref.saveinfo(true,false)
        //this.nownum++;
      }
      console.log("nextimage", this.nownum);
      //console.log("nextimage infoArry", this.infoArry, this.infoArry.length);
    },
    //保存并上一张图片
    previousimage() {
        if(this.unable) return
        if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      //if() return
      if (this.nownum >= 0) {
        this.nopnum=2;
        this.unable=true
        this.$refs.imageselectref.saveinfo(true,false)
        //this.nownum--;
      }
      console.log("previousimage", this.nownum);
    },
    //无标注类型
    nomarkedimage(){
      if(this.unable) {
        //console.log("unable!!!!!!!!!!!!!!!!!!!!")
        return
      }
      if(this.isimageview) {
        console.log("处于预览界面");
        return
        }
      if (this.nownum < this.imageArry.length) {
        this.nopnum=1;
        this.unable=true
        this.$refs.imageselectref.saveinfo(false,false)
        //this.nownum++;
      }
      console.log("nextimage", this.nownum);
    },
    //post修改正在标注标识
    // isnowlabel:function(){
    //   let _this = this;
    //   return request({
    //     url:
    //       "http://127.0.0.1:8085/label/setLabeling?uuid="+this.uuidArry[this.nownum],
    //     method: "post",
    //     //timeout:_this.lastinfoArry.length*5000,
    //     //params: query
    //   }).then(function (response) {
    //     console.log(response);
    //   })
    // },
    isnowlabel1(){
      const params = {
          uuid: this.uuidArry[this.nownum]
      }
      console.log(params)
      isnowlabel(params).then(response => {
        console.log("isnowlabel",response);
      })
    },
    //post生成xml
          // return request({
      //   url:
      //     "http://127.0.0.1:8082/dataset/save?dataset_id="+store.getters.uuid,
      //   method: "post",
      //   //timeout:_this.lastinfoArry.length*5000,
      //   //params: query
      // })
    generateXML:function () {
      let _this = this;
      _this.$message({
          message:"开始生产xml标注文件",
          duration:300,
          type: 'success'
      });
      const params = {
        dataset_id:store.getters.uuid
      }
      // return request({
      //   url:
      //     "http://127.0.0.1:8082/dataset/save?dataset_id="+store.getters.uuid,
      //   method: "post",
      //   //timeout:_this.lastinfoArry.length*5000,
      //   //params: query
      // })
      generateInfo(params)
      .then(function (response) {
        console.log(response);
        _this.$message({
          message:"xml生成成功",
          duration:300,
          type: 'success'
          });
      }).catch(function(error){
        console.log("error",error)
          _this.$message({
          message:"xml生成失败",
          type: 'error'
          })
      });
    },
    //保存图片标注信息
    saveimageinfo: function (markinfo, imageeindex,infoFlag,changeFlag) {
      this.infoArry[imageeindex] = markinfo;
      console.log("save success", markinfo, imageeindex);
      console.log("thisinfoArry", this.infoArry);
      this.savelabel1(this.nownum,infoFlag,changeFlag);
    },
    //get请求图片数据
    requireimage() {
      console.log("uuid",store.getters.uuid,"store.getters.userid",store.getters.userid)
      console.log("store.getters.dataSet.role_type",store.getters.dataSet.role_type,"store.getters.predictcontrol",store.getters.predictcontrol)
      let _this = this;
      this.isalllabeled = true;
      //if(store.getters.dataSet.role_type === "创建者" || store.getters.predictcontrol === '1') {
      if(1){
        const params = {
          datasetuuid: store.getters.uuid
        }
        getLabel(params).then(function (response) {
        console.log("response",response)
        _this.imageArry=[]
        _this.infoArry=[]
        _this.lastinfoArry=[]
        _this.uuidArry=[]
        _this.imagelargeArry=[]
        _this.imageislabelArry=[]
        _this.auditinfoArry=[]
        _this.acceptinfoArry=[]
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
          _this.imageislabelArry.push(response.data.items[i].is_label)
        }
        console.log("imageislabelArry",_this.imageislabelArry)
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
      const params = {
            dataset_uuid: store.getters.uuid,
            user_id: store.getters.userid
        }
        console.log(params)
        getLabelDataApi(params).then(function (response) {
        _this.imageArry=[]
        _this.infoArry=[]
        _this.lastinfoArry=[]
        _this.uuidArry=[]
        _this.imagelargeArry=[]
        _this.imageislabelArry=[]
        _this.auditinfoArry=[]
        _this.acceptinfoArry=[]
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
          _this.imageislabelArry.push(response.data.items[i].is_label)
        }
        console.log("imageislabelArry",_this.imageislabelArry)
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
    //put更新数据
    savelabel1(i,infoFlag,changeFlag) {
      let _this=this
      this.nowseconds = 0;
      //_this.$message('开始保存');
      if(changeFlag){
        console.log("onlyislabel")
          let data={
          is_label: this.imageislabelArry[i],
          uuid: this.uuidArry[i],
          dataset_id: store.getters.uuid
      }
      savelabel(data).then(function (response) {
        console.log("change!!!!!!!!!!!!!!!!!!!!!!!",response)
        if(!_this.isDestroy) _this.isnowlabel1();
      })
      }
      else{
      let data1 = {
        dataSetId: store.getters.uuid
      }
      setUnAccept(data1).then(response=>{
        console.log("setUnAcceptsetUnAcceptsetUnAccept",response);
      })
      console.log("save",JSON.stringify(this.infoArry[i]));
      let isab
      if(this.infoArry[i].rectangle.length>0||!infoFlag) isab=1
      else isab=2
      let data={
          label_data: JSON.stringify(this.infoArry[i]),
          is_label: isab,
          uuid: this.uuidArry[i],
          dataset_id: store.getters.uuid
      }
      savelabel(data).then(function (response) {
        console.log(response);
        console.log("isab",isab);
        _this.$message({
          message:"保存成功",
          duration:300,
          type: 'success'
          });
        console.log("save success!!!!!!!!!!!!!!")
        _this.requireimage();
        _this.requiretag().then(function () {
          console.log("thenthenthenthen")
          if(_this.nopnum==1) {
            if(_this.nownum < _this.imageArry.length - 1){
            _this.nownum++;
            _this.isnowlabel1();
            }
            else {
              _this.returnimageviewNoSave();
            }
          }
          if(_this.nopnum==2) {
            if(_this.nownum > 0){
            _this.nownum--;
            _this.isnowlabel1();
            }
            else {
              _this.returnimageviewNoSave();
            }
          }
          
          _this.unable=false;
        });

      }).catch(function(error){
        console.log("error",error)
          _this.$message({
          message:"保存失败",
          type: 'error'
          })
        _this.requireimage();
        _this.requiretag();
      });
      }
    },

    //post半自动标注
    automark1(){
      let _this = this;
      _this.$message('开始2D拉框自动标注');
      _this.automarkbtntext="标注中";
      _this.isloading=true;
      console.log("图片长度预留时间",_this.lastinfoArry.length*5000)
      // return request({
      //   url:
      //     "http://127.0.0.1:8082/dataset/auto?dataset_id="+store.getters.uuid,
      //   method: "post",
      //   timeout:_this.lastinfoArry.length*5000,
      //   //params: query
      // })
      const params = {
        dataset_id:store.getters.uuid
      }
      automark(params,_this.lastinfoArry.length)
      .then(function (response) {
        console.log(response);
        _this.$message({
          message:"2D拉框自动标注成功",
          type: 'success'
          });
        _this.automarkbtntext="开始自动标注";
        _this.isloading=false;
        _this.requireimage();
        _this.requiretag();
      }).catch(function(error){
        console.log("error111",error)
          _this.$message({
          message:"等待....2D拉框自动标注",
          type: 'success'
          });
        _this.automarkbtntext="开始自动标注";
        _this.isloading=false;
        _this.requireimage();
        _this.requiretag();
      });
    }
  },

  mounted: function () {
    //console.log(this.infoArry[0])
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
    console.log("mounted!!!!uuid",store.getters.uuid,"mounted!!!!store.getters.userid",store.getters.userid)
    this.requireimage();
    this.infoArry = new Array(this.imageArry.length);
    this.requiretag();
    window.nextimage = this.nextimage;
    window.previousimage = this.previousimage;
    window.skipimagenext = this.skipimagenext;
    window.skipimagepre = this.skipimagepre;
    window.nomarkedimage = this.nomarkedimage;
    window.undochild = this.undochild;
    window.deleteSelect = this.deleteSelect;
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
    if(this.nownum>-1) {
      this.isDestroy=true
      this.savelabel1(this.nownum,true,true)
    }
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
<style scoped>
.imageviewa{
  display:flex;
}
</style>
