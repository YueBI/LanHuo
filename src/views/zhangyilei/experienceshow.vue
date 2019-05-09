<template>
  <div>
    <el-row>
      <el-col>
        <template>
          <el-table :data="tableData" style="width: 500px" max-height="300">
            <el-table-column fixed prop="rank" label="排名" width="100"></el-table-column>
            <el-table-column prop="userID" label="用户ID" width="150"></el-table-column>
            <el-table-column prop="empiricalValue" label="经验值"></el-table-column>
          </el-table>
          <div
            style="display:inline-block;left:230px;"
            id="myBar"
            :style=" {width: '600px' ,height: '500px' ,} "
          ></div>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted: function() {
    this.fetchdata();
  },

  data() {
    return {
      tableData: [],
      list: []
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(this);
      console.log(key, keyPath);
    },
    fetchdata() {
      axios
        .post(
          "http://112.74.189.126:8080/bluefire/Integererface/analysis/getEmpiricalandIntegererest",
          {
            startDate: "2000-1-1",
            endDate: "2019-1-1"
          }
        )
        .then(response => {
          // 请求成功以后的回调函数
          console.log(response);
          this.list = response.data.content.empiricalList;
          for (var i = 0; i < this.list.length; i++) {
            this.tableData.push({
              rank: i + 1,
              userID: this.list[i].userID,
              empiricalValue: this.list[i].empiricalValue
            });
          }
        })
        .catch(error => {
          // 请求失败以后的回调函数
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
