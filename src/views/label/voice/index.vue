<template>
  <div>
    <div class="dashboard-container" v-if="isvoiceview">
      <!-- <div class="dashboard-text">name: {{ name }}</div> -->
      <wave :premarktype="this.testmarktype"></wave>
    </div>
    <div class="dashboard-container" v-if="!isvoiceview">
      <!-- <div class="dashboard-text">name: {{ name }}</div> -->
      <wave :premarktype="this.testmarktype"></wave>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import wave from "@/components/wave.vue"
export default {
  name: 'Dashboard',
  data(){
    return{
      //存储图片url数组，用于获取远程图片信息
      imageArry: [],
      //与图片一一对应的标注信息数组
      infoArry: [],
      //存储上次标注的信息的数组
      lastinfoArry: [],
      //与图片对于的uuid数组，是后台数据库主键
      uuidArry: [],
      //存储图片url,是否已标注等信息的数组，用于获取远程图片信息,小图片组件使用
      imagelargeArry:[],
      //标注状态的数组
      imageislabelArry:[],
      isvoiceview : false,
        
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
    }
  },
  components:{
     wave
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
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
