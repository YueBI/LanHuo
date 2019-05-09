<template>
  <div class="dashboard-container">
      显示实时位置界面
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Dashboard',
  data(){
    return{

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods:{
    
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