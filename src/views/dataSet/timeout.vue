<template>
  <div style="padding:30px;" />
</template>

<script>
import { outTimeReAssign } from '@/api/data'
import store from '@/store'
export default {
  timeOut() {
    const params = {
      userId: store.getters.userId,
      dataSetId: store.getters.dataSet.user_id,
      dataSetUuid: store.getters.uuid
    }
    outTimeReAssign(params)
    this.logout()
  },

  async logout() {
    await this.$store.dispatch('user/logout')
    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }
}
</script>

<style scoped>

</style>
