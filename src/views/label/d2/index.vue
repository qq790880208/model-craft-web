<template>
  <el-row :gutter="20" style="margin-top: 50px">
    <div class="dashboard-container">
      <el-button @click="nextimage">下一张</el-button>
      <el-button @click="previousimage">上一张</el-button>
      <el-button @click="requireimage">请求图片</el-button>
      <el-button @click="savelabel(nownum)">保存标注信息</el-button>
      <!-- <div class="dashboard-text">name: {{ name }}</div> -->
      <imageselect
        :fatherimagesrc="this.imageArry[nownum]"
        :imageindex="this.nownum"
        @saveimageinfo="saveimageinfo"
      ></imageselect>
      <!-- <labelinfo></labelinfo> -->
    </div>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import imageselect from "@/components/imageselect.vue";
import request from "@/utils/request";
//import axios from 'node_modules/axios';
// import labelinfo from '@/components/labelinfo.vue'
export default {
  name: "Imageselect",
  data() {
    return {
      imageArry: [],
      infoArry: [],
      uuidArry:[],
      //networkimage: [],
      // createinfoArry: function(){
      //   return infoArry[this.imageArry.length]
      // },
      nownum: 0,
    };
  },

  components: {
    imageselect,
    // labelinfo
  },
  methods: {
    markarray: function (childinfoArry) {
      this.infoArry = childinfoArry;
      console.log("222" + this.infoArry);
    },
    nextimage: function () {
      if (this.nownum < this.imageArry.length - 1) this.nownum++;
      console.log(this.nownum);
      console.log(this.infoArry, this.infoArry.length, "sadasdas");
    },
    previousimage: function () {
      if (this.nownum > 0) this.nownum--;
      console.log(this.nownum);
    },
    saveimageinfo: function (markinfo, imageeindex) {
      //this.infoArry.push(markinfo)
      // this.infoArry[imageeindex].push(markinfo)
      // this.infoArry[imageeindex][1]=imageesrc
      // this.infoArry[imageeindex][2]=imageeindex
      this.infoArry[imageeindex] = markinfo;
      console.log("save success", markinfo, imageeindex);
      console.log("this", this.infoArry);
    },
    requireimage: function () {
      let _this = this 
      return request({
        url: "http://192.168.19.237:8082/label/?user_id=2",
        method: "get",
        //params: query
      }).then(function (response) {
        //console.log(response.data.items);
        for(let i = 0;i<response.data.items.length;i++){
          console.log(response.data.items[i])
          console.log(response.data.items[i].file.path)
          console.log(response.data.items[i].uuid)
          _this.uuidArry.push(response.data.items[i].uuid)
          console.log("3213331232",_this.uuidArry)
          _this.imageArry.push(response.data.items[i].file.path);
        }

        console.log(_this.imageArry)
        console.log("transforjson",JSON.stringify(_this.infoArry[0][0]))
      });
    },
    savelabel(i){
      return request({
        url: "http://192.168.19.237:8082/label/"+this.uuidArry[i],
        method: "post",
        data:{"name":JSON.stringify(this.infoArry[i][0])}
      }).then(function (response) {
        console.log(response)
      })
    },
    // savelabel(){
    //   axios.post("http://192.168.19.237:8082/label",{
    //     label_data:"aaaaabbbbb"
    //   })
    // }
  },
  mounted: function () {
    //console.log(this.infoArry[0])
    this.infoArry = new Array(this.imageArry.length);
    console.log("mounted!!!!", this.infoArry.length, this.infoArry);
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
