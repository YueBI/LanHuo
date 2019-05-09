<template>
  <div class="dashboard-container">
    <div id="myMap"></div>
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      markerArr: [
        {
          title: null,
          content: null,
          point: "116.318327|39.984703",
          isOpen: 0,
          icon: { w: 100, h: 21, l: 0, t: 0, x: 6, lb: 5 }
        },
        {
          title: null,
          content: null,
          point: "116.318337|39.984762",
          isOpen: 0,
          icon: { w: 100, h: 21, l: 0, t: 0, x: 6, lb: 5 }
        },
        {
          title: null,
          content: null,
          point: "116.318347|39.984842",
          isOpen: 0,
          icon: { w: 100, h: 21, l: 0, t: 0, x: 6, lb: 5 }
        },
        {
          title: null,
          content: null,
          point: "116.318347|39.984842",
          isOpen: 0,
          icon: { w: 100, h: 21, l: 0, t: 0, x: 6, lb: 5 }
        }
      ]
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    findTrack: function() {
      this.axios.put("http://localhost:8880/findTrack", {}).then(
        response => {
          console.log("successful");
          this.talbedata = response.data;
        },
        err => {
          console.log("fail");
        }
      );
    },
    initMap() {
      this.mymap(); //创建地图
      this.setMapEvent(); //设置地图事件
      this.addMapControl(); //向地图添加控件
      this.addMarker();
      this.addPolyline();
    },
    mymap() {
      var map = new BMap.Map("myMap"); //在百度地图容器中创建一个地图
      var point = new BMap.Point(116.395645, 39.937953); //定义一个中心点坐标
      map.centerAndZoom(point, 12); //设定地图的中心点和坐标并将地图显示在地图容器中
      window.map = map; //将map变量存储在全局
    },
    setMapEvent() {
      map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
      map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
      map.enableKeyboard(); //启用键盘上下左右键移动地图
    },
    addMapControl() {
      //向地图中添加缩放控件
      var ctrl_nav = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE
      });
      map.addControl(ctrl_nav);
      //向地图中添加缩略图控件
      var ctrl_ove = new BMap.OverviewMapControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen: 1
      });
      map.addControl(ctrl_ove);
      //向地图中添加比例尺控件
      var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
      map.addControl(ctrl_sca);
    },
    addMarker() {
      for (var i = 0; i < this.markerArr.length; i++) {
        console.log("!!!!!")
        var json = this.markerArr[i];
        var p0 = json.point.split("|")[0];
        var p1 = json.point.split("|")[1];
        var point = new BMap.Point(p0, p1);
        var iconImg = this.createIcon(json.icon);
        var marker = new BMap.Marker(point, { icon: iconImg });
        var iw = this.createInfoWindow(i);
        var label = new BMap.Label(json.title, {
          offset: new BMap.Size(json.icon.lb - json.icon.x + 10, -20)
        });
        marker.setLabel(label);
        map.addOverlay(marker);
        label.setStyle({
          borderColor: "#808080",
          color: "#333",
          cursor: "pointer"
        });
        (function() {
          var index = i;
          var _iw = this.createInfoWindow(i);
          var _marker = marker;
          _marker.addEventListener("click", function() {
            this.openInfoWindow(_iw);
          });
          _iw.addEventListener("open", function() {
            _marker.getLabel().hide();
          });
          _iw.addEventListener("close", function() {
            _marker.getLabel().show();
          });
          label.addEventListener("click", function() {
            _marker.openInfoWindow(_iw);
          });
          if (!!json.isOpen) {
            label.hide();
            _marker.openInfoWindow(_iw);
          }
        })();
      }
    },
    createInfoWindow(i) {
      var json = this.markerArr[i];
      var iw = new BMap.InfoWindow(
        "<b class='iw_poi_title' title='" +
          json.title +
          "'>" +
          json.title +
          "</b><div class='iw_poi_content'>" +
          json.content +
          "</div>"
      );
      return iw;
    },
    createIcon(json) {
      var icon = new BMap.Icon(
        "http://developer.baidu.com/map/jsdemo/img/car.png   ",
        new BMap.Size(json.w, json.h),
        {
          imageOffset: new BMap.Size(-json.l, -json.t),
          infoWindowOffset: new BMap.Size(json.lb + 5, 1),
          offset: new BMap.Size(json.x, json.h)
        }
      );
      return icon;
    },

    addPolyline() {
      for (var i = 0; i < plPoints.length; i++) {
        var json = plPoints[i];
        var points = [];
        for (var j = 0; j < json.points.length; j++) {
          var p1 = json.points[j].split("|")[0];
          var p2 = json.points[j].split("|")[1];
          points.push(new BMap.Point(p1, p2));
        }
        var line = new BMap.Polyline(points, {
          strokeStyle: json.style,
          strokeWeight: json.weight,
          strokeColor: json.color,
          strokeOpacity: json.opacity
        });
        map.addOverlay(line);
      }
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
#myMap {
  height: 500px;
}
</style>
