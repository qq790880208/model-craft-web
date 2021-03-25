<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <three-d></three-d>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import threeD from "@/components/3dmark.vue";
export default {
  name: 'Dashboard',
  components:{
    threeD
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
