<template>
  <div class="dashboard-container">
    时间:
    <el-time-select
      placeholder="起始时间"
      v-model="startTime"
      :picker-options="{start: '08:30', step: '00:15', end: '18:30'}"
    ></el-time-select>
    <el-time-select
      placeholder="结束时间"
      v-model="endTime"
      :picker-options="{start: '08:30', step: '00:15', end: '18:30', minTime: startTime}"
    ></el-time-select>
    <el-button @click="findTrackList">查询</el-button>
    <el-table :data="tableData" border ref="singleTable" style="width: 100%" @row-click="showRow">
      <el-table-column label="选择" width="70" header-align="center" align="center">
        <template scope="scope">
          <el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="trajectoryId" label="轨迹ID" width="180"></el-table-column>
      <el-table-column prop="userId" label="用户姓名" width="180"></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
    </el-table>
    <el-button @click="passTrack">显示</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      userlist: [], //存放用户列表
      //选择楼层内容
      value: "",
      //选择开始时间和结束时间
      startTime: "",
      endTime: "",
      //轨迹列表内容存放处
      //单选
      userId: "",
      tableData: [],
      radio: "", //存放被选择序号
      send_radio: "" //存放被选择的内容
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  mounted() {
    this.showTrack();
  },
  methods: {
    showTrack: function() {
      this.userId = this.$route.query.userId;
      axios
        .post(
          "http://112.74.189.126:8080/bluefire/Integererface/data_manage/getOutdoorTrajectories",
          { "userId": this.userId }
        )
        .then(
          response => {
            this.tableData = response.data.content.list;
            console.log("获得选择的轨迹信息，然后调转到地图界面并显示轨迹");
          },
          err => {
            console.log("没有轨迹信息");
          }
        );
    },
    showRow: function(row) {
      this.radio = this.tableData.indexOf(row);
      this.send_radio = row.trajectoryId;
    },
    passTrack: function() {
      this.$router.push({
        path:"/showTrack",
        query:{
          trajectoryId: this.send_radio
        }
      });
    },
  }
};
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
