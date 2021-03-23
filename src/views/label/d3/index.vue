<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-button @click="nextimage">下一张</el-button>
    <el-button @click="previousimage">上一张</el-button>
    <el-button @click="requireimage">请求图片</el-button>
    <!-- <el-button @click="savelabel(nownum)">保存标注信息</el-button> -->
    <drawpolygon
      :fatherimagesrc="this.imageArry[nownum]"
      :imageindex="this.nownum"
      :premarktype="this.marktype"
      @saveimageinfo="saveimageinfo"
    ></drawpolygon>
    <!-- <canvas id="canvas" width='800' height='800'></canvas> -->
  </div>
</template>

<script>
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
      //后台读取的标注类别
      marktype: [
        {
          name:"car",
          color:"rgba(128,0,0,0.3)"
        },
        {
          name:"human",
          color:"rgba(0,128,0,0.3)"
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
      console.log(this.nownum);
      console.log(this.infoArry, this.infoArry.length, "sadasdas");
    },
    //上一张图片
    previousimage: function () {
      if (this.nownum > 0) this.nownum--;
      console.log(this.nownum);
    },
    //保存图片标注信息
    saveimageinfo: function (markinfo, imageeindex) {
      this.infoArry[imageeindex] = markinfo;
      console.log("save success", markinfo, imageeindex);
      console.log("this", this.infoArry);
      this.savelabel(this.nownum)
    },
    //get请求
    requireimage: function () {
      let _this = this;
      return request({
        url: "http://192.168.19.237:8082/label/?user_id=10",
        method: "get",
        //params: query
      }).then(function (response) {
        console.log("get",response.data.items);
        for (let i = 0; i < response.data.items.length; i++) {
          console.log("get1",response.data.items[i]);
          console.log("get2",response.data.items[i].file_path);
          console.log("get3",response.data.items[i].uuid);
          console.log("get4",response.data.items[i].label_data);
          _this.uuidArry.push(response.data.items[i].uuid);
          console.log("3213331232", _this.uuidArry);
          _this.imageArry.push(response.data.items[i].file_path);
        }
        console.log(_this.imageArry);
        //console.log("transforjson",JSON.stringify(_this.infoArry[0][0]))
      });
    },
    //post请求
    savelabel(i) {
      console.log(JSON.stringify(this.infoArry[i][0]));
      return request({
        url: "http://192.168.19.237:8082/label",
        method: "post",
        data: {
          label_data: JSON.stringify(this.infoArry[i][0]),
          //"last_update_by": "liaoziheng",
          file_type: "polygon",
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
