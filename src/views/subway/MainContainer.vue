<template>
  <el-container>
    <el-container direction="vertical">
      <subway-map />
      <switch-card />
      <el-footer v-if="current_role != 1" height="250px">
        <chart />
      </el-footer>
    </el-container>
    <card-side />
  </el-container>
</template>

<script>
import CardSide from './CardSide.vue'
import SubwayMap from './SubwayMap.vue'
import Chart from './Chart.vue'
import SwitchCard from './SwitchCard.vue'

export default {
  name: 'MainContainer',
  components: {
    CardSide,
    SubwayMap,
    Chart,
    SwitchCard
  },
  data() {
    return {
      current_role: 0
    }
  },
  created() {
    this.current_role = localStorage.getItem('role')
  }
}
</script>

<style scoped>
</style>
