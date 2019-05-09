<template>
  <div class="dashboard-container">
    楼层:
    <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button @click="findUserList">查询</el-button>
    <el-table :data="tableData" border ref="singleTable" style="width: 100%" @row-click="showRow">
      <el-table-column label="选择" width="70" header-align="center" align="center">
        <template scope="scope">
          <el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户ID" width="180"></el-table-column>
      <el-table-column prop="userName" label="用户姓名" width="180"></el-table-column>
      <el-table-column prop="userInfo" label="用户信息"></el-table-column>
    </el-table>
    <el-button @click="getRTL">显示</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      //选择楼层内容
      options: [
        {
          value: "选项1",
          label: "1F"
        },
        {
          value: "选项2",
          label: "2F"
        },
        {
          value: "选项3",
          label: "3F"
        },
        {
          value: "选项4",
          label: "4F"
        },
        {
          value: "选项5",
          label: "5F"
        }
      ],
      value: "",
      //选择开始时间和结束时间
      startTime: "",
      endTime: "",
      //轨迹列表内容存放处
      tableData: [
        {
          userId: "1",
          userName: "王小虎",
          userInfo: "人"
        },
        {
          userId: "2",
          userName: "虎",
          userInfo: "animal"
        },
        {
          userId: "3",
          userName: "小",
          userInfo: "word"
        }
      ],
      //单选
      radio: "", //存放被选择序号
      send_radio: "" //存放被选择的内容
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  methods: {
    //获取用户列表
    findUserList : function() {
      this.$router.push("/showTRL")
      this.axios
        .post("http://localhost:8880/api/getIndoorUsers", {})
        .then(
          response => {
            console.log("成功获取用户列表");
            this.tableData = response.data; //返回的轨迹列表与tableData绑定
          },
          err => {
            console.log("没找到用户");
          }
        );
    },
    //单选函数
    showRow: function(row) {
      this.radio = this.tableData.indexOf(row);
      this.send_radio = row.userId;
    },
    //获取实时位置
    getRTL: function() {
      this.$router.push("/getIndoorLocations")
      this.axios.put("http://localhost:8880/api/getAllIndoorTrajectoryDetails", {})
        .then(
          response => {
            console.log("获取实时位置");
          },
          err => {
            console.log("");
          }
        );
    }
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
