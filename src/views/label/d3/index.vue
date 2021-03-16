<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <drawpolygon></drawpolygon>
    <!-- <canvas id="canvas" width='800' height='800'></canvas> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import drawpolygon from '@/components/drawpolygon.vue'
export default {
  name: 'Dashboard',
  components:{
    drawpolygon
  },
  computed: {
    ...mapGetters([
      'name'
    ])
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
