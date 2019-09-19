<template>
  <div>
    <div class="showTable" style="margin-top: 1px">
      <div style="display: flex; flex-flow: column">
        <el-table
          :data="tableData"
          style="margin-left: 50px; margin-top: 20px; width: 400px"
          :default-sort="{prop: 'empiricalValue', order: 'descending'}"
        >
          <el-table-column type="index" label="序号" min-width="100" sortable />
          <el-table-column prop="userID" label="用户ID" min-width="100" sortable />
          <el-table-column prop="empiricalValue" label="经验值" sortable />
        </el-table>
        <!--
        <el-row>
          <el-input v-model="input" style="margin-top:30px" placeholder="请输入用户id" />
        </el-row>-->
          <el-button type="primary" style="margin-left: 50px" plain @click="initbar()">柱状图显示</el-button>
      </div>
      <div
        id="chart"
        class="bar"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
export default {

  data() {
    return {
      tableData: [],
      list: [],
      input: '',
      userID: [],
      Value: []
    }
  },
  mounted: function() {
    this.fetchdata()
    // this.initbar()
  },

  methods: {
    handleSelect(key, keyPath) {
      console.log(this)
      console.log(key, keyPath)
    },
    initbar: function() {
      // this.fetchdata()
      const myChart = echarts.init(document.getElementById('chart'))
      const option = {
        color: ['#f44'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: [
          {
            name: '用户ID',
            type: 'category',
            // data: [this.list[0].userID, this.list[1].userID],
            data: this.userID,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '经验值',
            type: 'value'
          }
        ],
        series: [
          {
            name: '经验值',
            type: 'bar',
            barWidth: '60%',
            // data: [this.list[0].empiricalValue, this.list[1].empiricalValue]
            data: this.Value
          }
        ]
      }
      myChart.setOption(option)
    },
    fetchdata() {
      axios
        .post(
          'http://112.74.189.126:8080/bluefire/Integererface/analysis/getEmpiricalandIntegererest',
          {
            startDate: '2000-1-1',
            endDate: '2019-1-1'
          }
        )
        .then(response => {
          // 请求成功以后的回调函数
          console.log(response)
          this.list = response.data.content.empiricalList

          for (var i = 0; i < this.list.length; i++) {
            this.list[i].empiricalValue =
              parseFloat(this.list[i].empiricalValue).toFixed(2) * 100
            this.tableData.push({
              rank: i + 1,
              userID: this.list[i].userID,
              empiricalValue: this.list[i].empiricalValue
            })
          }
          this.tableData.forEach(element => {
            this.userID.push(element.userID)
            this.Value.push((element.empiricalValue))
          })
        })
        .catch(error => {
          // 请求失败以后的回调函数
          console.log(error)
        })
    }
  }
}
</script>

<style>
    .showTable{
        display: flex;
        flex-flow: row;
    }
    .bar{
        margin-left: 100px;
        width: 500px;
        height: 500px;
    }
</style>
