<template>
  <div style="height:100%">
    <el-button class="float" type="primary" title="Refresh" @click="refresh()">Refresh</el-button>
    <baidu-map class="map" :scroll-wheel-zoom="true" :center="{lng: 116.404, lat: 39.915}" :zoom="14">
      <bm-marker v-show="this.pointShow[0].show" :title="users[0].username" :position="{lng: this.fenceShape[0].lng, lat: this.fenceShape[0].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[1].show" :title="users[1].username" :position="{lng: this.fenceShape[1].lng, lat: this.fenceShape[1].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[2].show" :title="users[2].username" :position="{lng: this.fenceShape[2].lng, lat: this.fenceShape[2].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[3].show" :title="users[3].username" :position="{lng: this.fenceShape[3].lng, lat: this.fenceShape[3].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[4].show" :title="users[4].username" :position="{lng: this.fenceShape[4].lng, lat: this.fenceShape[4].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[5].show" :title="users[5].username" :position="{lng: this.fenceShape[5].lng, lat: this.fenceShape[5].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[6].show" :title="users[6].username" :position="{lng: this.fenceShape[6].lng, lat: this.fenceShape[6].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[7].show" :title="users[7].username" :position="{lng: this.fenceShape[7].lng, lat: this.fenceShape[7].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[8].show" :title="users[8].username" :position="{lng: this.fenceShape[8].lng, lat: this.fenceShape[8].lat}" :dragging="false" />
      <bm-marker v-show="pointShow[9].show" :title="users[9].username" :position="{lng: this.fenceShape[9].lng, lat: this.fenceShape[9].lat}" :dragging="false" />
      <bm-circle v-if="circleShow[0].show" :center="circlePath[0].center" :radius="circlePath[0].radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" />
      <bm-circle v-if="circleShow[1].show" :center="circlePath[1].center" :radius="circlePath[1].radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" />
      <bm-circle v-if="circleShow[2].show" :center="circlePath[2].center" :radius="circlePath[2].radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false" />
      <bm-circle v-if="circleShow[3].show" :center="circlePath[3].center" :radius="circlePath[3].radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="false" />
    </baidu-map>
  </div>
</template>
<script>
import api from '@/api/hardware/api.js'
export default {
  data() {
    return {
      show: true,
      users: [
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' },
        { username: 'peter' }
      ],
      polygonPath: [
        { lng: 116.411689, lat: 39.914059 },
        { lng: 116.403641, lat: 39.914059 },
        { lng: 116.403641, lat: 39.921336 },
        { lng: 116.411689, lat: 39.921336 }
      ],
      para: [],
      filterFormFro: {
        tableData: [],
        totalCount: 0
      },
      circleShow: [
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      polygonShow: false,
      pointShow: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      fenceShape: [
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 },
        { lng: 0.0, lat: 0.0 }
      ],
      circlePath: [
        {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          radius: 300
        },
        {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          radius: 500
        },
        {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          radius: 500
        },
        {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          radius: 500
        }
      ]
    }
  },
  created() {
    this.getLocations()
  },
  mounted() {
    this.tableWidth = document.body.scrollWidth - 259 - 20
  },
  methods: {
    infoWindowClose() {
      this.show = false
    },
    infoWindowOpen() {
      this.show = true
    },
    getLocations() {
      const para = {}
      api.getLocation(para).then(res => {
        if (res.result === 1000) {
          const data = res.content
          if (data.list.length > 0) {
            for (var k = 0; k < 10; k++) {
              this.pointShow[k] = false
            }
            for (var j = 0; j < data.number; j++) {
              this.pointShow[j] = true
              this.users[j].username = data.list[j].user
            }
            for (var l = 0; l < 10; l++) {
              console.log(l + ':' + this.pointShow[l])
            }
          }
          if (data.list.length > 0) {
            const num = res.content.number
            for (var i = 0; i < num; i++) {
              this.fenceShape[i].lng = data.list[i].longtitude
              this.fenceShape[i].lat = data.list[i].latitude
              console.log(this.fenceShape[i].lng)
              console.log(this.fenceShape[i].lat)
              console.log('num:' + num)
            }
          } else {
            this.$message.warning('Nothing Found')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    refresh() {
      this.getLocations()
    }
  }
}
</script>
<style scoped>
.hide-dialog{
  display:none;
}
.map {
 width: 100%;
 height: calc(100vh);
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
.float{
    overflow: hidden;
    z-index: 9999;
    position: fixed;
    padding:5px;
    width: 300px;
    height: 50px;
    text-align: center;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    right: 35%;
    bottom: 20%;
}
</style>
