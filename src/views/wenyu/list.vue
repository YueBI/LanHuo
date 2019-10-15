<template>
  <div>
    <div style="margin-top: 20px;margin-left: 15px">
      <!--选择查询时间:
      <el-time-select
        v-model="startTime"
        placeholder="起始时间"
        :picker-options="{start: '08:30', step: '00:15', end: '18:30'}"
      />
      <el-time-select
        v-model="endTime"
        placeholder="结束时间"
        :picker-options="{start: '08:30', step: '00:15', end: '18:30', minTime: startTime}"
        @change="findTrackList"
      />-->
        <el-button type="primary" plain @click="passTrack">显示路线轨迹</el-button>
    </div>
    <div class="dashboard-container">
      <el-table
        ref="singleTable"
        :data="tableData"
        border
        style="width: 100%"
        height="600"
        @row-click="showRow"
      >
        <el-table-column label="选择" width="70" header-align="center" align="center">
          <template scope="scope">
            <el-radio v-model="radio" class="radio" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="trajectoryId" label="轨迹ID" min-width="180" align="center" />
        <el-table-column prop="userId" label="用户姓名" min-width="180" align="center" />
        <el-table-column prop="startTime" label="开始时间" min-width="180" align="center" />
        <el-table-column prop="endTime" label="结束时间" min-width="180" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      userlist: [], // 存放用户列表
      // 选择楼层内容
      value: '',
      // 选择开始时间和结束时间
      startTime: '',
      endTime: '',
      // 轨迹列表内容存放处
      // 单选
      userId: '',
      tableData: [],
      radio: '', // 存放被选择序号
      send_radio: '' // 存放被选择的内容
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.showTrack()
  },
  methods: {
    showTrack: function() {
      this.userId = this.$route.query.userId
      axios
        .post(
          'http://112.74.189.126:8080/bluefire/Integererface/data_manage/getOutdoorTrajectories',
          { 'userId': this.userId }
        )
        .then(
          response => {
            this.tableData = response.data.content.list
            console.log('获得选择的轨迹信息，然后调转到地图界面并显示轨迹')
          },
          err => {
            console.log('没有轨迹信息')
          }
        )
    },
    showRow: function(row) {
      this.radio = this.tableData.indexOf(row)
      this.send_radio = row.trajectoryId
    },
    passTrack: function() {
      if (this.send_radio === '') {
        this.$message({
          message: '尚未选择路线',
          type: 'warning'
        })
      } else {
        this.$router.push({
          path: '/wenyu/showTrack',
          query: {
            trajectoryId: this.send_radio
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
      margin-top: 15px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
