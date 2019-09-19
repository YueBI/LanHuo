<template>
  <div class="dashboard-container">
    楼层:
    <el-select v-model="value" placeholder="请选择" @change="chooseMap">
      <el-option v-for="item in mapTable" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-button @click="findUserList">查询</el-button>
    <el-table ref="singleTable" :data="tableData" border style="width: 100%" @row-click="showRow">
      <el-table-column label="选择" width="70" header-align="center" align="center">
        <template scope="scope">
          <el-radio v-model="radio" class="radio" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户ID" width="180" />
      <el-table-column prop="userName" label="用户姓名" width="180" />
      <el-table-column prop="userAnalysisId" label="用户信息" />
    </el-table>
    <el-button @click="toTrackList">查询轨迹列表</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      // 选择楼层内容
      mapTable: [],
      value: '',
      // 选择开始时间和结束时间
      startTime: '',
      endTime: '',
      // 轨迹列表内容存放处
      tableData: [],
      // 单选
      radio: '', // 存放被选择序号
      send_radio: '', // 存放被选择用户的ID
      selectMap: []// 选择的地图
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    // 初始化调用
    this.findMapList()
  },
  methods: {
    // 获取选择的地图id
    chooseMap: function(item) {
      this.selectMap = item
    },
    // 获取地图列表
    findMapList: function() {
      axios.post('http://112.74.189.126:8080/bluefire/Integererface/data_manage/queryIndoorMap', {})
        .then(
          response => {
            console.log('成功获取地图列表')
            var mapList = response.data.content.list
            var i = 0
            for (i in mapList) {
              var map = {
                value: mapList[i].mapId,
                label: mapList[i].mapName
              }
              this.mapTable.push(map)
            }
          },
          err => {
            console.log(err)
          }
        )
    },
    // 获取用户列表，发送选择的地图ID，得到对应的用户列表数据
    findUserList: function() {
      axios.post('http://112.74.189.126:8080/bluefire/Integererface/data_manage/getIndoorUsers', {
        mapId: this.selectMap
      })
        .then(
          response => {
            console.log('成功获取用户列表')
            this.tableData = response.data.content.list // 返回的轨迹列表与tableData绑定
          },
          err => {
            console.log(err)
          }
        )
    },
    // 单选函数
    showRow: function(row) {
      this.radio = this.tableData.indexOf(row)
      this.send_radio = row.userId
    },
    // 前往轨迹列表并传递查询轨迹要的列表
    toTrackList: function() {
      this.$router.push({
        path: '/dengyuankang/trackList',
        query: {
          mapId: this.selectMap,
          userId: this.send_radio
        }
      })
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
