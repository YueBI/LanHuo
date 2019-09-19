<template>
  <div>
    <div style="margin-top: 1px;margin-left: 15px;height: 80px">
      <el-button plain type="primary" style="margin-top: 20px" @click="toTrackList">显示用户路线</el-button>
      <!--<el-button plain type="primary" style="margin-top: 20px" @click="findTrackList">测试</el-button>-->
    </div>
    <div class="dashboard-container">
      <el-table ref="singleTable" :data="tableData" border style="width: 100%;margin-top: 1px" @row-click="showRow">
        <el-table-column label="选择" width="70" header-align="center" align="center">
          <template slot-scope="scope">
            <el-radio v-model="radio" class="radio" :label="scope.$index">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="180" align="center" />
        <el-table-column prop="userName" label="用户姓名" width="180" align="center" />
        <el-table-column prop="userInfo" label="用户信息" align="center" />
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
      tableData: [], // 存放用户列表
      // 选择楼层内容
      value: '',
      // 选择开始时间和结束时间
      startTime: '',
      endTime: '',
      // 单选
      radio: '', // 存放被选择序号
      send_radio: '' // 存放被选择的内容
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.findTrackList()
  },
  methods: {
    // 获取轨迹列表
    findTrackList: function() {
      // console.log('12345678')
      axios.post('http://112.74.189.126:8080/bluefire/Integererface/data_manage/getOutdoorUsers', {})
        .then(response => {
          console.log('成功获取轨迹列表')
          this.tableData = [response.data.content.list[1]] // 返回的轨迹列表与tableData绑定
        },
        err => {
          console.log(err)
          console.log('未成功获取轨迹列表')
        })
      // console.log('987654321')
    },
    // 单选函数
    showRow: function(row) {
      this.radio = this.tableData.indexOf(row)
      this.send_radio = row.userId
    },
    toTrackList: function() {
      if (this.send_radio === '') {
        this.$message({
          message: '尚未选择用户',
          type: 'warning'
        })
      } else {
        this.$router.push({
          path: '/wenyu/list',
          query: {
            userId: this.send_radio
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

  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
