<template>
  <div class="dashboard-container">
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
    <el-button @click="toTrackList">显示</el-button>
    <el-button @click="findTrackList">测试</el-button>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Dashboard",
  mounted(){
    this.findTrackList();
  },
  data() {
    return {
      tableData:[],//存放用户列表
      //选择楼层内容
      value: "",
      //选择开始时间和结束时间
      startTime: "",
      endTime: "",  
      //单选
      radio: "", //存放被选择序号
      send_radio: "" //存放被选择的内容
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  methods: {
    //获取轨迹列表
    findTrackList : function() {
      axios.post("http://112.74.189.126:8080/bluefire/Integererface/data_manage/getOutdoorUsers", {})
        .then(
          response => { 
            console.log("成功获取轨迹列表");
            this.tableData = [response.data.content.list[1]]; //返回的轨迹列表与tableData绑定            
          },
          err => {
            console.log("没找到轨迹");
          }
        );
    },
    //单选函数
    showRow: function(row) {
      this.radio = this.tableData.indexOf(row);
      this.send_radio = row.userId;
    },
    toTrackList: function() {
      this.$router.push({
        path:"/list",
        query:{
          userId: this.send_radio
        }
      });
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
