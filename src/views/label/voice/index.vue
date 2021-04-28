<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <wave :premarktype="this.testmarktype"></wave>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import wave from "@/components/wave.vue"
export default {
  name: 'Dashboard',
  data(){
    return{
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
