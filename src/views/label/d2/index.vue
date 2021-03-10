<template>
  <el-row :gutter="20" style="margin-top:50px;">
    <div class="dashboard-container">
      <div class="dashboard-text">name: {{ name }}</div>
      <imageselect @markarray = "markarray"></imageselect>
      <!-- <labelinfo></labelinfo> -->
    </div>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import imageselect from '@/components/imageselect.vue'
import labelinfo from '@/components/labelinfo.vue'
export default {
  name: 'Imageselect',
  boxArry: [],
  components: {
    imageselect,
    labelinfo
  },
  methods: {
    markarray: function(childboxArry) {
      this.boxArry = childboxArry
      console.log("222"+this.boxArry)
    }
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
