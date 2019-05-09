<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/FenceCreate' }">围栏创建</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--表格数据-->
      <el-row style="margin-top:10px">
          <el-col :span="22">
              <baidu-map class="map" :scroll-wheel-zoom= "true" :center="{lng: 116.404, lat: 39.915}" :zoom="14" @click="selectPoint">
                <bm-marker v-if=pointShow :position="{lng: this.fenceShape[0], lat: this.fenceShape[1]}" :dragging="true">
                </bm-marker>
                <!-- <bm-polygon v-if=polygonShow :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath" @dblclick="sendPath"/> -->
                <bm-circle v-if=circleShow  :center="circlePath.center" :radius="circlePath.radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" @lineupdate="updateCirclePath" @dblclick="sendPath" :editing="true"></bm-circle>
              </baidu-map>
            <!-- <div id="allmap" class="map" style="overflow:hidden;zoom:1;position:relative;">	
              <div id="map" ref="map" style="height:100%;-webkit-transition: all 0.5s ease-in-out;transition: all 0.5s ease-in-out;"></div>
            </div> -->
          </el-col>
          <el-col :span="2" style="border:1px;dashed #000">
          	<div style="border:10px;dashed #000">
            <div style="margin-left:2px;text-align:center;font-size:20px">工具栏</div>
          	<div style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px"  @click="draw('point')"><i class="fa fa-hand-o-up fa-lg"></i></div>
          	<div style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px" @click="draw('circle')"><i class="fa fa-circle-thin fa-lg"></i></div>
          	<!-- <div style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px"  @click="draw('polygon')"><i class="fa fa-square-o fa-lg"></i></div> -->
          	<!-- <div class="" style="margin-left:2px;margin-top:30px;text-align:center;font-size:30px"><i class="fa fa-eye fa-lg"></i></div> -->
          	<div class="" style="margin-left:2px;margin-top:35px;text-align:center;font-size:30px" @click="draw('clear')"><i class="fa fa-close fa-lg"></i></div>
            </div>
          </el-col>
      </el-row>
      <!-- 表格下方分页 -->
      <el-row>
           <el-button type="primary" @click="fenceCreate()" style="width:300px;margin-top:20px;margin-left:500px;">创建电子围栏</el-button>
      </el-row>
    </div>
</template>
<script>
// import '../../static/css/gateMana/common.css'
import '@/static/font/css/font-awesome.css'
// import '../../static/css/gateMana/dianziweilan.css'
// import BMap from 'BMap'
// import BMapLib from 'BMapLib'
// import BMapSymbolSHAPEPOINT from 'BMap_Symbol_SHAPE_POINT'
export default {
  created () {
  },
  data () {
    return {
      polygonPath: [
        {lng: 116.411689, lat: 39.914059},
        {lng: 116.403641, lat: 39.914059},
        {lng: 116.403641, lat: 39.921336},
        {lng: 116.411689, lat: 39.921336}
      ],
      para: [],
      circleShow: false,
      polygonShow: false,
      pointShow: false,
      fenceShape: [],
      circlePath: {
        center: {
          lng: 116.404,
          lat: 39.915
        },
        radius: 500
      }
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    fenceCreate () {
      this.sendPath()
      this.$router.push({
        name: 'fenceCreateInfo',
        // path: '/fenceCreateInfo',
        params: {
          shape: this.para
        }
      })
    },
    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
    },
    updateCirclePath (e) {
      // console.log('target center:' + e.target.getCenter())
      // console.log('target radius:' + e.target.getRadius())
      this.circlePath.center = e.target.getCenter()
      this.circlePath.radius = e.target.getRadius()
      console.log('fenceShape[0] is:' + this.fenceShape[0])
      console.log('Now new circlePath center lng is:' + this.circlePath.center.lng)
      console.log('Now new circlePath center lnt is:' + this.circlePath.center.lat)
      console.log('Now new circlePath radius is:' + this.circlePath.radius)
    },
    draw (type) {
      if (type === 'circle') {
        this.circleShow = true
        console.log('Now circleShow is true')
        this.polygonShow = false
        if (this.pointShow === true) {
          this.circlePath.center.lng = this.fenceShape[0]
          this.circlePath.center.lat = this.fenceShape[1]
          this.pointShow = false
          this.fenceShape = []
        }
      } else if (type === 'polygon') {
        this.polygonShow = true
        this.circleShow = false
        if (this.pointShow === true) {
          this.polygonPath[0].lng = this.fenceShape[0] + 0.008
          this.polygonPath[0].lat = this.fenceShape[1] - 0.006
          this.polygonPath[1].lng = this.fenceShape[0] - 0.008
          this.polygonPath[1].lat = this.fenceShape[1] - 0.006
          this.polygonPath[2].lng = this.fenceShape[0] - 0.008
          this.polygonPath[2].lat = this.fenceShape[1] + 0.006
          this.polygonPath[3].lng = this.fenceShape[0] + 0.008
          this.polygonPath[3].lat = this.fenceShape[1] + 0.006
          this.pointShow = false
          this.fenceShape = []
        }
        this.pointShow = false
        this.fenceShape = []
      } else if (type === 'point') {
        this.pointShow = true
      } else {
        this.circleShow = false
        this.polygonShow = false
        this.pointShow = false
        this.fenceShape = []
      }
    },
    selectPoint (e) {
      if (this.pointShow === true) {
        this.fenceShape.push(e.point.lng)
        this.fenceShape.push(e.point.lat)
        // this.pointShow = false
        // this.circlePath.center = e.target
      }
      console.log('fenceShape is:' + this.fenceShape)
      console.log('circlePath1=' + this.circlePath)
    },
    sendPath () {
      if (this.circleShow === true) {
        // if (this.circlePath !== null) {
        //   para.push({
        //     Longitude: this.circlePath.center.lng,
        //     Latitude: this.circlePath.center.lat,
        //     Radius: this.circlePath.radius
        //   })
        //   console.log('circlePath2=' + this.circlePath)
        // }

      }
      this.para.Longitude = this.circlePath.center.lng
      this.para.Latitude = this.circlePath.center.lat
      this.para.Radius = this.circlePath.radius
      console.log('Para is:' + this.para.Longitude)
    }
  },
  mounted () {
    this.tableWidth = document.body.scrollWidth - 259 - 20
    // this.baiduMap()
  }
}
</script>
<style scoped>
.hide-dialog{
  display:none;
}
.map {
 width: 100%;
 height: 500px;
 overflow: hidden;
 zoom: 1;
 position: relative;
 -webkit-transition: all 0.5s ease-in-out;
 transition: all 0.5s ease-in-out;
}
.fontIcon {
 margin-left:2px;
 width: 50px;
 height: 50px;
}
</style>
