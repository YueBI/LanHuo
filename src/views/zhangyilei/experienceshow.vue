<template>
  <div>
    <el-row>
      <el-col :span="7">
        <div>
          <el-row>
            <template>
              <el-table
                :data="tableData"
                style="width: 300px"
                height="400px"
                :default-sort="{prop: 'empiricalValue', order: 'descending'}"
              >
                <el-table-column type="index" label="排名" width="50"></el-table-column>
                <el-table-column prop="userID" label="用户ID" width="100"></el-table-column>
                <el-table-column prop="empiricalValue" label="经验值"></el-table-column>
              </el-table>
            </template>
          </el-row>
          <el-row>
            <el-input v-model="input" style="margin-top:30px" placeholder="请输入用户id"></el-input>
          </el-row>
          <el-row>
            <el-button type="info" style="margin-top:30px" @click="initbar()">柱状图显示</el-button>
          </el-row>
        </div>
      </el-col>
      <el-col :span="7">
        <div
          style="display:inline-block;left:50px;"
          id="chart"
          :style=" {width: '600px' ,height: '400px' } "
        ></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import echarts from "echarts";
export default {
  mounted: function() {
    this.fetchdata();
  },

  data() {
    return {
      tableData: [],
      list: [],
      input:''
    };
  },

  methods: {
    handleSelect(key, keyPath) {
      console.log(this);
      console.log(key, keyPath);
    },
    initbar() {
      let myChart = echarts.init(document.getElementById("chart"));
      let option = {
        color: ["#f44"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        
        xAxis: [
          {
            name: "用户ID",
            type: "category",
            // data: [this.list[0].userID, this.list[1].userID],
            data: [
              this.list[0].userID,
              this.list[1].userID,
              this.list[2].userID,
              this.list[3].userID,
              this.list[4].userID,
              this.list[5].userID,
              this.list[6].userID,
              this.list[7].userID,
              this.list[8].userID,
              this.list[9].userID
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: "经验值",
            type: "value"
          }
        ],
        series: [
          {
            name: "经验值",
            type: "bar",
            barWidth: "60%",
            // data: [this.list[0].empiricalValue, this.list[1].empiricalValue]
            data: [
              this.list[0].empiricalValue,
              this.list[1].empiricalValue,
              this.list[2].empiricalValue,
              this.list[3].empiricalValue,
              this.list[4].empiricalValue,
              this.list[5].empiricalValue,
              this.list[6].empiricalValue,
              this.list[7].empiricalValue,
              this.list[8].empiricalValue
            ]
          }
        ]
      };
      myChart.setOption(option);
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
            this.list[i].empiricalValue =
              parseFloat(this.list[i].empiricalValue).toFixed(2) * 100;
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
