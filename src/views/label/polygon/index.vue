<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-button @click="nextimage">下一张</el-button>
    <el-button @click="previousimage">上一张</el-button>
    <!-- <el-button @click="requireimage">请求图片</el-button> -->
    <!-- <el-button @click="savelabel(nownum)">保存标注信息</el-button> -->
    <drawpolygon
      :fatherimagesrc="this.imageArry[nownum]"
      :imageindex="this.nownum"
      :premarktype="this.marktype"
      :lastlabelArry="this.lastinfoArry[nownum]"

      @saveimageinfo="saveimageinfo"
    ></drawpolygon>
    <!-- <canvas id="canvas" width='800' height='800'></canvas> -->
  </div>
</template>

<script>
      // :canvaswidth="this.imagesize[nownum].width"
      // :canvasheight="this.imagesize[nownum].height"
import { mapGetters } from "vuex";
import drawpolygon from "@/components/drawpolygon.vue";
import request from "@/utils/request";
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
      //预读取每张图片的分辨率，以适应画布
      imagesize:[],
      //后台读取的标注类别
      marktype: [
        {
          name:"car",
          color:"rgba(128,0,0,0.75)"
        },
        {
          name:"human",
          color:"rgba(0,128,0,0.75)"
        },
      ],
      nownum: 0,
    };
  },
  components: {
    drawpolygon,
  },
  mounted() {
    this.infoArry = new Array(this.imageArry.length);
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
    this.requireimage();
  },
  methods: {
    //下一张图片
    nextimage: function () {
      if (this.nownum < this.imageArry.length - 1) this.nownum++;
      console.log("nextimage",this.nownum);
      console.log("nextimage infoArry",this.infoArry, this.infoArry.length);
    },
    //上一张图片
    previousimage: function () {
      if (this.nownum > 0) this.nownum--;
      console.log("previousimage",this.nownum);
    },
    //保存图片标注信息
    saveimageinfo: function (markinfo, imageeindex) {
      this.infoArry[imageeindex] = markinfo;
      console.log("save success", markinfo, imageeindex);
      console.log("thisinfoArry", this.infoArry);
      this.savelabel(this.nownum)
    },
    //get请求
    requireimage: function () {
      let _this = this;
      return request({
        url: "http://127.0.0.1:8082/label?dataset_uuid=76cc3eb6689538d7feb9c571d7c355be&user_id=10",
        method: "get",
        //params: query
      }).then(function (response) {
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
          let tempa = JSON.parse(response.data.items[i].label_data)
          let len = eval(tempa).length;
          console.log("len", len);
          console.log("tempa",tempa)
          let arr=[];
          // for (let i = 0; i < len; i++) {
          //   arr[i] = []; //js中二维数组必须进行重复的声明，否则会undefind
          //   arr[i].x1 = tempa[i].x1;
          //   arr[i].y1 = tempa[i].y1;
          //   arr[i].x2 = tempa[i].x2;
          //   arr[i].y2 = tempa[i].y2;
          //   arr[i].info = tempa[i].info;
          // }
          _this.lastinfoArry.push(tempa)
          console.log("get response.data.items[i]",response.data.items[i]);
          console.log("get response.data.items[i].file_path",response.data.items[i].file_path);
          console.log("get response.data.items[i].uuid",response.data.items[i].uuid);
          console.log("get response.data.items[i].label_data",response.data.items[i].label_data);
          _this.uuidArry.push(response.data.items[i].uuid);
          console.log("_this.uuidArry", _this.uuidArry);
          _this.imageArry.push(response.data.items[i].file_path);
        }
        console.log("_this.imageArry",_this.imageArry);
        console.log("_this.lastinfoArry",_this.lastinfoArry);
        //console.log("transforjson",JSON.stringify(_this.infoArry[0][0]))
      });
    },
    //put请求
    savelabel(i) {
      console.log("put111",JSON.stringify(this.infoArry[i][0]),this.uuidArry[i]);
      return request({
        url: "http://127.0.0.1:8082/label",
        method: "put",
        data: {
          label_data: JSON.stringify(this.infoArry[i][0]),
          //"last_update_by": "liaoziheng",
          //file_type: "polygon",
          is_label: 1,
          uuid: this.uuidArry[i],
        },
      }).then(function (response) {
        console.log(response);
      });
    },
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
