<template>
  <div>
    <el-row>
      <el-col :span="18">
        <div id="container" style="width:100%; height: calc(100vh - 50px)" />
      </el-col>
      <el-col :span="6">
        <div>
          <el-table
            :data="tableData"
            border
            style="width:100%"
            height="calc(100vh - 50px)"
            :default-sort="{prop: 'integererestValue', order: 'descending'}"
          >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="integererestValue" label="兴趣度" sortable/>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="addMarker(scope.$index)" type='danger' plain>查看位置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
var map
export default {

  data() {
    return {
      datestart: '',
      dateend: '',
      tableData: [],
      list: [],
      markerlatitude: [],
      markerlongitude: []
    }
  },
  mounted: function() {
    this.init()
    this.getPage()
  },
  methods: {
    init: function() {
      map = new AMap.Map('container', {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 10,
        mapStyle: 'amap://styles/normal'
      })
    },

    getPage() {
      axios
        .post(
          'http://112.74.189.126:8080/bluefire/Integererface/analysis/getEmpiricalandIntegererest',
          {
            startDate: '2000-1-1',
            endDate: '2019-1-1'
            // startDate: this.datestart,
            // endDate: this.dateend
          }
        )
        .then(response => {
          console.log(response.data)
          this.list = response.data.content.integererestValue
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].integererestValue = (parseFloat(this.list[i].integererestValue)).toFixed(2) * 100
            this.tableData.push({
              rank: i + 1,
              integererestValue: this.list[i].integererestValue
            })
          }
        })
        .catch(error => {
          // 请求失败以后的回调函数
          console.log(error)
        })
    },
    addMarker(index) {
      map = new AMap.Map('container', {
        center: [this.list[index].longitude, this.list[index].latitude],
        resizeEnable: true,
        zoom: 14,
        mapStyle: 'amap://styles/normal'
      })
      var marker = new AMap.Marker({
        position: new AMap.LngLat(
          this.list[index].longitude,
          this.list[index].latitude
        )
      })
      marker.setAnimation('AMAP_ANIMATION_BOUNCE')
      map.add(marker)
      AMap.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker.getPosition())
      })
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
</style>
