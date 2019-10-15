<template>
  <div class="dashboard-container">
    <!--时间:
    <el-time-select
      v-model="startTime"
      placeholder="起始时间"
      :picker-options="{start: '08:30', step: '00:15', end: '18:30'}"
    />
    <el-time-select
      v-model="endTime"
      placeholder="结束时间"
      :picker-options="{start: '08:30', step: '00:15', end: '18:30', minTime: startTime}"
    />-->
    <!--<el-button type="primary" plain @click="findTrackList">查询</el-button>-->
    <el-table ref="singleTable" :data="tableData" border style="width: 100%; margin-top: 10px" @row-click="showRow">
      <el-table-column label="选择" width="70" header-align="center" align="center">
        <template slot-scope="scope">
          <el-radio v-model="radio" class="radio" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="trajectoryId" label="轨迹ID" width="180" />
      <el-table-column prop="userId" label="用户姓名" width="180" />
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column>
        <template slot="header">
          <el-button type="primary" plain @click="showTrack">显示用户轨迹</el-button>
          <el-button @click.native="trackDeal">轨迹预处理</el-button>
          <el-button @click.native="trackCondense">轨迹压缩</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      // //选择楼层内容
      // options: [
      //   {
      //     value: "选项1",
      //     label: "1F"
      //   },
      //   {
      //     value: "选项2",
      //     label: "2F"
      //   },
      //   {
      //     value: "选项3",
      //     label: "3F"
      //   },
      //   {
      //     value: "选项4",
      //     label: "4F"
      //   },
      //   {
      //     value: "选项5",
      //     label: "5F"
      //   }
      // ],
      value: '',
      // 选择开始时间和结束时间
      startTime: '',
      endTime: '',
      // 轨迹列表内容存放处
      tableData: [],
      // 单选
      radio: '', // 存放被选择序号
      send_radio: '', // 存放被选择的内容
      mapId: '',
      userId: '',
      afterCondense: [], // 保存压缩后的轨迹
      afterCorrect: [] // 保存纠错后的轨迹
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    // 测试查找轨迹功能
    this.findTrackList()
  },
  methods: {
    // 获取轨迹列表（发送从userList中选择后传递的信息，获取对应的轨迹列表，还未考虑时间数据，只传递了mapId和userId）
    findTrackList: function() {
      this.mapId = this.$route.query.mapId
      this.userId = this.$route.query.userId
      axios.post('http://112.74.189.126:8080/bluefire/Integererface/data_manage/getIndoorTrajectories', {
        mapId: this.mapId,
        userId: this.userId
      })
        .then(
          response => {
            console.log('成功获取轨迹列表')
            this.tableData = response.data.content.list // 返回的轨迹列表与tableData绑定
          },
          err => {
            console.log('没找到轨迹')
          }
        )
    },
    // 单选函数，获取选中轨迹信息
    showRow: function(row) {
      this.radio = this.tableData.indexOf(row)
      this.send_radio = row.trajectoryId
    },
    // 跳转到显示轨迹页面，并传递选择轨迹ID
    showTrack: function() {
      if (this.send_radio === '') {
        this.$message({
          message: '尚未选择用户轨迹',
          type: 'warning'
        })
      } else {
        this.$router.push({
          path: '/dengyuankang/showTrack',
          query: {
            trajectoryId: this.send_radio
          }
        })
      }
    },
    // 轨迹预处理(传递轨迹ID，得到处理后的数据)
    trackDeal: function() {
      axios.post('http://112.74.189.126:8080/bluefire/Integererface/pretreatment/correctIndoorTrajectory', {
        trajectoryId: this.send_radio
      })
        .then(
          response => {
            console.log('轨迹纠错成功')
            this.$message({
              message: '轨迹纠错成功',
              type: 'success'
            })
            this.afterCorrect = response.data
          },
          err => {
            console.log('轨迹纠错失败')
          }
        )
    },
    // 轨迹压缩(传递轨迹ID，得到处理后的数据)
    trackCondense: function() {
      axios.post('http://112.74.189.126:8080/bluefire/Integererface/pretreatment/compressIntdoorTrajectory', {
        trajectoryId: this.send_radio
      })
        .then(
          response => {
            console.log('轨迹压缩成功')
            this.$message({
              message: '轨迹压缩成功',
              type: 'success'
            })
            this.afterCondense = response.data
          },
          err => {
            console.log('轨迹压缩失败')
          }
        )
    }

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
