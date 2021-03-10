<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div>{{message}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { author } from "@/views/systemManagement/authorityManagement/index"

export default {
  name: 'Dashboard',
  data() {
    return {
      message: author
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
