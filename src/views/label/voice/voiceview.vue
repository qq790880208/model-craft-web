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
      :audioUrl="this.testaudioArry[nownum]"
      ></wave>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import wave from "@/components/wave.vue"
import miniaudio from '@/components/miniaudio.vue'
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
  methods:{
    entermark(index){
      console.log("faaaaaaaaaaaatherenter!")
      this.nownum=index;
      //this.isnowlabel1();
      this.isaudioview=!this.isaudioview;
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
