<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <three-d></three-d>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import threeD from "@/components/3dmark.vue";
//页面键盘监听
//document.onkeydown = keyDownSearch;
function keyDownSearch1(e){
  console.log("keydown in!!!!!!!!!!!!")
  let theEvent = e.event || window.event;
  let code = theEvent.keyCode ||  theEvent.which || theEvent.charCode
  if(code == 27){ //保存并上一张
    console.log("eeeeeeeeeeeeeeeeeeeeessssssssssccccccccccccccccccc!!!!!!!!!!!!!")
    //previousimage()
    //return false;     
  }
  if(code == 46){ //保存并下一张
    console.log("ddddddddddelete!!!!!!!!!!!!!")
    //nextimage()
  //return true;
  }
}
export default {
  name: 'Dashboard',
  components:{
    threeD
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted(){
    //this.checkDivScroolTop
    document.onkeydown = keyDownSearch1;
  },
  destroyed() {
    document.onkeydown = undefined;
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
