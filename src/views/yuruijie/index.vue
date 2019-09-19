<template>
  <div class="dashboard-container">
    <div class="line" />
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">区域</template>
        <el-menu-item index="1-1">室内</el-menu-item>
        <el-menu-item index="1-2">室外</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">建筑</template>
        <el-menu-item index="2-1">北邮科研楼</el-menu-item>
        <el-menu-item index="2-2">北邮学六</el-menu-item>
        <el-menu-item index="2-3">北邮明光楼</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">中科院</template>
          <el-menu-item index="2-4-1">1层</el-menu-item>
          <el-menu-item index="2-4-2">2层</el-menu-item>
          <el-menu-item index="2-4-3">3层</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3">
        <template>
          <div class="block">
            <el-date-picker v-model="value2" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions" />
          </div>
        </template>
      </el-menu-item>
      <el-menu-item index="4">显示热力图</el-menu-item>
      <el-submenu index="5">
        <template slot="title">热力图分析</template>
        <el-menu-item index="5-1">
          <template>
            <el-button type="text" @click="open">密度高的位置</el-button>
          </template>
        </el-menu-item>
        <el-menu-item index="5-2">
          <a href="https://www.ele.me" target="_blank">该位置的流量</a>
        </el-menu-item>
      </el-submenu>
    </el-menu>

    <template />
    <!-- <template>
      <div>
        baidu
        <div class="mybaidumap" id="allmap" style="height:800px;">
        </div>
      </div>
    </template> -->
    <el-steps :active="active" finish-status="success">
      <el-step title=" 1:00" @click.native="light(1)" />
      <el-step title=" 2:00" @click.native="light(2)" />
      <el-step title=" 3:00" @click.native="light(3)" />
      <el-step title=" 4:00" @click.native="light(4)" />
      <el-step title=" 5:00" @click.native="light(5)" />
      <el-step title=" 6:00" @click.native="light(6)" />
      <el-step title=" 7:00" @click.native="light(7)" />
      <el-step title=" 8:00" @click.native="light(8)" />
      <el-step title=" 9:00" @click.native="light(9)" />
      <el-step title=" 10:00" @click.native="light(10)" />
      <el-step title=" 11:00" @click.native="light(11)" />
      <el-step title=" 12:00" @click.native="light(12)" />
      <el-step title=" 13:00" @click.native="light(13)" />
      <el-step title=" 14:00" @click.native="light(14)" />
      <el-step title=" 15:00" @click.native="light(15)" />
      <el-step title=" 16:00" @click.native="light(16)" />
      <el-step title=" 17:00" @click.native="light(17)" />
      <el-step title=" 18:00" @click.native="light(18)" />
      <el-step title=" 19:00" @click.native="light(19)" />
      <el-step title=" 20:00" @click.native="light(20)" />
      <el-step title=" 21:00" @click.native="light(21)" />
      <el-step title=" 22:00" @click.native="light(22)" />
      <el-step title=" 23:00" @click.native="light(23)" />
      <el-step title=" 24:00" @click.native="light(24)" />
    </el-steps>
    <el-button style="margin-top: 12px;" @click="next">动态展示</el-button>
  </div>
</template>

<script>
// import BMap from 'BMap'
// import BMapSymbolSHAPEPOINT from 'BMap_Symbol_SHAPE_POINT'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  // mounted(){
  //   this.baiduMap();
  // },
  computed: {
    ...mapGetters(['name'])
  },
  data() {
    return {
      active: 0,
      activeIndex: '1',
      activeIndex2: '1',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value1: '',
      value2: ''
    }
  },
  methods: {
    next() {
      if (this.active++ > 22) this.active = 0
    },
    light(index) {
      this.active = index - 1
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    open() {
      this.$alert('A区，B区', '密度高的位置', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    }
    // baiduMap(){
    //   var map = new BMap.Map("allmap");
    //   map.centerAndZoom(new BMap.Point(116.404,39.915),11);
    //   map.addControl(new BMap.MapTypeControl({
    //     mapTypes:[
    //       BMAP_NORMAL_MAP,
    //       BMAP_HYBRID_MAP
    //     ]
    //   }));
    //   map.setCurrentCity("Beijing");
    //   map.enableScrollWheelZoom(true);
    // }
  }
}
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
