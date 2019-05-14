<template>
  <div>
    <el-row>
      <el-col :span="17">
        <div id="container" />
      </el-col>
      <el-col :span="7">
        <div>
          <el-table
            ref="singleTable"
            class="table"
            :data="trackID"
            border
            style="width: 300px"
            height="calc(100vh)"
          >
            <el-table-column prop="trackID" label="轨迹编号" width="50" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="addforecastMarker(scope.$index)">预测终点</el-button>
                <el-button size="mini" type="danger" @click="addrealMarker(scope.$index)">实际终点</el-button>
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
import { join } from 'path'
var map
var tracknumber
export default {
  data() {
    return {
      trackID: [],
      list: [],
      currentRow: null,
      errored: false
    }
  },
  computed: {
    activeIndex() {
      return this.$route.path.replace('/', '')
    }
  },
  mounted: function() {
    this.init()
    this.fetchdata()
  },
  methods: {
    init: function() {
      map = new AMap.Map('container', {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 12,
        mapStyle: 'amap://styles/macaron'
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      })
    },
    fetchdata() {
      axios
        .get(
          'http://112.74.189.126:8080/bluefire/Integererface/data_manage/getTrajectoryPrediction'
        )
        .then(response => {
          console.log(response)
          this.list = response.data.content.list
          for (var i = 0; i < this.list.length; i++) {
            this.trackID.push({
              trackID: this.list[i].trajectory_id
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    addforecastMarker(index) {
      // var canvas = document.createElement("canvas");
      // canvas.width = canvas.height = 200;
      // var context = canvas.getContext("2d");
      // context.fillStyle = "rgb(0,100,255)";
      // context.strokeStyle = "white";
      // context.globalAlpha = 1;
      // context.lineWidth = 2;

      // var radious = 0;
      // var draw = function() {
      //   context.clearRect(0, 0, 200, 200);
      //   context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1;
      //   radious = (radious + 1) % 100;

      //   context.beginPath();
      //   context.arc(100, 100, radious, 0, 2 * Math.PI);
      //   context.fill();
      //   context.stroke();

      //   //2D视图时可以省略
      //   CanvasLayer.reFresh();

      //   AMap.Util.requestAnimFrame(draw);
      // };

      // var CanvasLayer = new AMap.CanvasLayer({
      //   canvas: canvas,
      //   bounds: new AMap.Bounds(
      //     [116.328931, 39.937229],
      //     [116.342659, 39.946275]
      //   ),
      //   zooms: [3, 18]
      // });

      // CanvasLayer.setMap(map);
      // draw();

      var forecastmarker = new AMap.Marker({
        position: new AMap.LngLat(
          this.list[index].present_longitude,
          this.list[index].present_latitude
        ),
        // icon: '../../static/icon1.png'
          icon: "//vdata.amap.com/icons/b18/1/2.png"
      })
      map.add(forecastmarker)
    },
    addrealMarker(index) {
      var realmarker = new AMap.Marker({
        position: new AMap.LngLat(
          this.list[index].original_longitude,
          this.list[index].original_latitude
        )
        // icon: "//vdata.amap.com/icons/b18/1/2.png"
      })
      map.add(realmarker)
    },
    handleCurrentChange(tracknumber) {
      this.currentRow.index = tracknumber
      console.log(this.currentRow.index)
    },
    clearmarker() {
      this.init()
    }
  }
}
</script>

<style>
.el-col {
  margin-top: 0px;
}
.table{

}
    #container{
        height: calc(100vh);
    }
</style>
