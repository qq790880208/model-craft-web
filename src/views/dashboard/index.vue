<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './notAdmin'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    if (!(this.role === 'admin' || this.role === 'superAdmin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
