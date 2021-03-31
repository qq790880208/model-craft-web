<template>
  <el-row :gutter="20" style="margin-top: 50px">
    <div class="dashboard-container" v-if="isimageview">
      <div v-for="(item, index) in imagelargeArry" :key="index" style="width:500px; height:500px; display:inline" >
      <miniimage style="width:100px; height:100px; display:inline"
      :fatherimagesrc="item.url"
      :ismarked="item.islabel"
      @entermark="entermark(index)"
      ></miniimage>
      </div>
    </div>
    <div class="dashboard-container" v-if="!isimageview">
      <el-button @click="returnimageview">返回</el-button>
      <el-button @click="nextimage">下一张</el-button>
      <el-button @click="previousimage">上一张</el-button>
      <imageselect
        :fatherimagesrc="this.imageArry[nownum]"
        :imageindex="this.nownum"
        :lastlabelArry="this.lastinfoArry[nownum]"
        @saveimageinfo="saveimageinfo"
      ></imageselect>
    </div>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import imageselect from "@/components/2dmark.vue";
import request from "@/utils/request";
import miniimage from "@/components/miniimage.vue"
//import axios from 'node_modules/axios';
// import labelinfo from '@/components/labelinfo.vue'
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
      nownum: 0,
      isimageview: true,
    };
  },

  components: {
    imageselect,
    miniimage,
    // labelinfo
  },
  methods: {
    entermark(index){
      console.log("faaaaaaaaaaaatherenter!")
      this.nownum=index;
      this.isimageview=!this.isimageview;
    },
    returnimageview(){
        this.isimageview=!this.isimageview;
    },
    markarray: function (childinfoArry) {
      this.infoArry = childinfoArry;
      console.log("222" + this.infoArry);
    },
    //下一张图片
    nextimage: function () {
      if (this.nownum < this.imageArry.length - 1) this.nownum++;
      console.log("nextimage", this.nownum);
      console.log("nextimage infoArry", this.infoArry, this.infoArry.length);
    },
    //上一张图片
    previousimage: function () {
      if (this.nownum > 0) this.nownum--;
      console.log("previousimage", this.nownum);
    },
    //保存图片标注信息
    saveimageinfo: function (markinfo, imageeindex) {
      this.infoArry[imageeindex] = markinfo;
      console.log("save success", markinfo, imageeindex);
      console.log("thisinfoArry", this.infoArry);
      this.savelabel(this.nownum);
    },
    //get请求
    requireimage: function () {
      let _this = this;
      return request({
        url:
          "http://192.168.19.237:8082/label?dataset_uuid=0022f6831fbe40b0bd4aae781f202517&user_id=10",
        method: "get",
        //params: query
      }).then(function (response) {
         _this.imageArry=[]
         _this.infoArry=[]
         _this.lastinfoArry=[]
         _this.uuidArry=[]
         _this.imagelargeArry=[]
        console.log("mkxlvmxclkvjkcov", response);
        for (let i = 0; i < response.data.items.length; i++) {
          //console.log(response.data.items[i]);
          let tempa = JSON.parse(response.data.items[i].label_data);
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
          console.log("lastinfoArry", response.data.items[i].is_label);
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
          _this.uuidArry.push(response.data.items[i].uuid);
          //console.log("3213331232", _this.uuidArry);
          _this.imageArry.push(response.data.items[i].file_path);
        }

        //console.log("imageArry", _this.imageArry);
        //console.log("transforjson",JSON.stringify(_this.infoArry[0][0]))
      });
    },
    //put
    savelabel(i) {
      let _this=this
      console.log("save",JSON.stringify(this.infoArry[i][0]));
      let isab
      if(this.infoArry[i][0].length>0) isab=1
      else isab=0
      return request({
        url: "http://192.168.19.237:8082/label",
        method: "put",
        data: {
          label_data: JSON.stringify(this.infoArry[i][0]),
          //"last_update_by": "liaoziheng",
          //file_type: "rectangle",
          is_label: isab,
          uuid: this.uuidArry[i],
        },
      }).then(function (response) {
        console.log(response);
        console.log("isab",isab);
        _this.requireimage();
      });
    },
  },
  mounted: function () {
    //console.log(this.infoArry[0])
    this.infoArry = new Array(this.imageArry.length);
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
    this.requireimage();
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
