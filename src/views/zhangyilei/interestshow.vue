<template>
  <div>
    <!-- <el-row>
      <el-col :span="6">
        <el-date-picker
          v-model="datestart"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择开始日期"
        ></el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="dateend"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择结束日期"
        ></el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button type="warning" plain @click.native="getPage()">确认</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click.native="init()">取消</el-button>
      </el-col>
    </el-row>-->
    <el-row>
      <el-col :span="16">
        <div id="container" style="width:800px; height:500px"></div>
      </el-col>
      <el-col :span="7">
        <div>
          <el-table
            :data="tableData"
            border
            style="width:300px"
            height="500px"
            :default-sort="{prop: 'integererestValue', order: 'descending'}"
          >
            <el-table-column type="index" label="排名" width="50"></el-table-column>
            <el-table-column prop="integererestValue" label="兴趣度"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="addMarker(scope.$index)">查看位置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
var map;
export default {
  mounted: function() {
    this.init();
    this.getPage();
  },
  methods: {
    init: function() {
      map = new AMap.Map("container", {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 10,
        mapStyle: "amap://styles/normal"
      });
    },

    getPage() {
      axios
        .post(
          "http://112.74.189.126:8080/bluefire/Integererface/analysis/getEmpiricalandIntegererest",
          {
            startDate: "2000-1-1",
            endDate: "2019-1-1"
            // startDate: this.datestart,
            // endDate: this.dateend
          }
        )
        .then(response => {
          console.log(response.data);
          this.list = response.data.content.integererestValue;
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].integererestValue=(parseFloat(this.list[i].integererestValue)).toFixed(2)*100;
            this.tableData.push({
              rank: i + 1,
              integererestValue: this.list[i].integererestValue
            });
          }
        })
        .catch(error => {
          // 请求失败以后的回调函数
          console.log(error);
        });
    },
    addMarker(index) {
      map = new AMap.Map("container", {
        center: [this.list[index].longitude, this.list[index].latitude],
        resizeEnable: true,
        zoom: 14,
        mapStyle: "amap://styles/normal"
      });
      var marker = new AMap.Marker({
        position: new AMap.LngLat(
          this.list[index].longitude,
          this.list[index].latitude
        )
      });
      marker.setAnimation("AMAP_ANIMATION_BOUNCE");
      map.add(marker);
      AMap.event.addListener(marker, "click", function() {
        infoWindow.open(map, marker.getPosition());
      });
    }
  },

  data() {
    return {
      datestart: "",
      dateend: "",
      tableData: [],
      list: [],
      markerlatitude: [],
      markerlongitude: []
    };
  }
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
</style>
