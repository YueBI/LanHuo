<template>
  <div class="whole" id="container">
    <!-- 页面的左部分 地图以及起止时间 -->
    <div class="left">
      <div class="choose">
        <!-- 选择地图的下拉框 -->
        <el-select
          v-model="selectedIndex"
          class="choosestyle"
          placeholder="请选择地图"
          @focus="showIndoorMap()"
          @change="map(selectedIndex)">
          <el-option
            v-for="(item,index) in maps"
            :key="item.mapID"
            :label="item.mapName"
            :value="index">
          </el-option>
        </el-select>
        <!-- 起止时间 这里的起止时间比较是自定义的 -->
        <div class="datestyle">
          <el-date-picker
            ref="starttimeInput"
            v-model="starttimeValue"
            type="datetime"
            placeholder="开始时间"
            align="right">
          </el-date-picker>
          <el-date-picker
            ref="endtimeInput"
            v-model="endtimeValue"
            type="datetime"
            placeholder="结束时间"
            align="right">
          </el-date-picker>
        </div>
      </div>
      <!-- 室内地图显示 -->
      <div class="map">
        <!-- <svg class="img" style="width: 100%;height: 100%" viewBox="0 0 4167 2190"></svg> -->
        <!-- 4167x2190 -->
        <!-- 1140x600 -->
        <svg class="img" style="width: 100%;height: 100%" viewBox="0 0 1140 600"></svg>
      </div>
    </div>
    <!-- 先显示左半部分，测试一下效果 -->
    <!-- 页面的右部分 用户的选择与相似度比较 -->
    <div class="right">
      <!-- 两个用户输入框 -->
      <div class="choose2">
        <el-input v-model="selectVal" class="choosestyle user1" placeholder="用户1" @focus="showList(1)"></el-input>
        <el-input v-model="selectVal2" class="choosestyle user2" placeholder="用户2" @focus="showList(2)"></el-input>
      </div>
      <!-- 一开始没选中用户没有用户列表显示时 -->
      <div v-show="!isShow && !isShowSimi" class="list-container-temp">请在上面先选择你要进行比较的两个用户</div>
      <!-- 用户列表 -->
      <el-table
        class="list-container"
        ref="singleTable"
        max-height="380"
        :data="userData"
        border
        highlight-current-row
        @row-click="handleRowClick"
        v-show="isShow"
      >
        <el-table-column
          property="userID"
          label="userID"
          align="center">
        </el-table-column>
        <el-table-column
          property="userName"
          label="userName"
          align="center">
        </el-table-column>
      </el-table>
      <!-- 确定按钮 -->
      <el-button v-show="isShow" class="btn" @click="hideList">确定</el-button>
      <!-- 相似度列表 -->
      <el-table
        class="list-container"
        ref="singleTable2"
        max-height="450"
        :data="similarityList"
        border
        highlight-current-row
        @row-click="showTrackSame"
        v-show="isShowSimi"
      >
        <el-table-column
          type="index"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          property="trajectoryAid"
          label="A轨迹id"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          property="trajectoryBid"
          label="B轨迹id"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          property="similarity"
          label="轨迹相似度"
          sortable
          align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import * as d3 from 'd3'
import axios from 'axios'
import { constants } from 'crypto'
import api from '@/api/similarity.js'
export default {
  data() {
    return {
      starttimeValue: null, // 开始时间
      endtimeValue: null, // 结束时间
      startTime: null, // 开始时间临时值
      endTime: null, // 结束时间临时值
      maps: [], // 存储地图列表
      // maps: this.showIndoorMap(), // 存储地图列表
      selectedIndex: '', // 下拉框选择地图时的索引值
      mapid: '',
      userAid: '',
      userBid: '',
      userData: [], // 用户列表
      similarityList: [], // 相似度列表
      selectVal: '', // 用户输入框1 用户值
      selectVal2: '', // 用户输入框2 用户值
      isShow: false, // 是否显示用户列表以及确定按钮
      flag: 0, // 确定是哪个用户输入框
      currentRow: null, // 用户列表选中的行
      isShowSimi: false, // 是否显示相似度列表
      indoorTrackData: '', // 存放轨迹json文件
      outdoorTrackData: '', // 存放轨迹json文件
      num: 0, // 回放时的轨迹点的索引
      timer: null, // 定时器名称
      track: null
    }
  },
  computed: {
    // 将开始时间和结束时间组成一个总的，之后就可以两者同时监测
    timeValue() {
      const { starttimeValue, endtimeValue } = this
      return {
        starttimeValue,
        endtimeValue
      }
    }
  },
  watch: {
    // 监测开始时间和结束时间，确保开始时间不能大于结束时间，以及两者都不能大于当前系统的时间，否则就会出现错误提示
    timeValue: {
      handler: function(time) {
        this.startTime = time.starttimeValue
        this.endTime = time.endtimeValue
        Message.closeAll()
        if (this.startTime === null || this.endTime === null || this.startTime === '' || this.endTime === '') {
          this.errorMessage('开始时间或者结束时间都不能为空!')
          // 当起止时间有一个清空的时候，那么右侧的用户列表、相似度列表以及用户都要清空
          this.selectVal = ''
          this.selectVal2 = ''
          this.isShow = false
          this.isShowSimi = false
          // 并且显示出的筛选过的轨迹也要清空
          var svg = d3.select('.app-main').select('svg')
          svg.selectAll('circle').remove()
          svg.selectAll('path').remove()
          // svg.selectAll('g').remove()
          // svg.selectAll('.persentInf').remove();
          // svg.select('.inforContent').remove();
        } else if (new Date(this.startTime) > Date.now() || new Date(this.endTime) > Date.now()) {
          // this.$refs.starttimeInput.$refs.reference.$refs.input.focus()
          this.errorMessage('开始时间或结束时间都不能大于当前的时间！')
        } else if (this.startTime > this.endTime) {
          // this.$refs.starttimeInput.$refs.reference.$refs.input.focus()
          this.errorMessage('开始时间不能大于结束时间')
        } else {
          this.showTrack(this.starttimeValue, this.endtimeValue)
        }
      },
      deep: true
    }
    // 监测地图选择框的变化
    // selectedIndex: {
    //   handler: function() {
    //     console.log(this.selectedIndex)
    //     // 每当地图选择变换的时候，如果界面中存在轨迹，需要清空，并且重新绘制选择的地图的轨迹信息
    //     // 先将轨迹信息清空
    //     // var svg = d3.select('svg')
    //     // svg.selectAll('circle').remove()
    //     // svg.selectAll('path').remove()
    //     // svg.selectAll('g').remove()
    //     // svg.selectAll('img').remove()
    //     // 重新绘制
    //     // this.showTrack(this.starttimeValue,this.endtimeValue)
    //   }
    // }
  },
  methods: {
    // 获取室内地图列表
    showIndoorMap() {
      api.queryIndoorMap().then(response => {
        this.maps = response.data.content.list
        console.log("获得地图列表的信息")
      })
    },
    showIndoorUsers(mapID) {
      var data
      var that = this
      if (mapID.length >0) {
        let para = {
          mapID: parseInt(mapID)
        }
        console.log("kaishi")
        api.getIndoorUsers(para).then(response => {
          data = response.data.content.list
          console.log("获得用户列表的信息")
          if (data) {
            var datalist = []
            data.forEach(function(item) {
              var lists = { 'userID': '', 'userName': '' }
              if (item['mapID'] === para.mapID) {
                lists['userID'] = item['userID']
                lists['userName'] = item['userName']
                datalist.push(lists)
              }
            })
            that.userData = datalist
          }
        })
      }
    },
    showIndoorTrajectoryDetail(trajectoryID) {
      var data
      var that = this
      var link
      let para = {
        trajectoryID: parseInt(trajectoryID)
      }
      api.getIndoorTrajectoryDetail(para).then(response => {
        data = response.data.content.list
        data = data[para.trajectoryID]
        console.log("获得该轨迹的详细信息")
        return data
        // that.track = data
        // that.$forceUpdate()
      })
      // let para = {
      //   userID : parseInt(this.userAid),
      //   mapID : parseInt(this.mapid)
      //   // startDate : this.starttimeValue,
      //   // endDate : this.endtimeValue
      // }
      // api.getIndoorTrajectories(para).then(response => {
      //   data = response.data.content.list
      //   console.log("获得轨迹的信息")
      //   data.forEach(function(itemi) {
      //     // console.log(itemi)
      //     if(itemi.trajectoryID === para.trajectoryID) {
      //       link = itemi.trajectorySrc
      //       // console.log(link)
      //     } 
      //   })
      //   if(link) {
      //       // 读取该轨迹的详细信息
      //       api.getIndoorTrajectoryDetail(para).then(response => {
      //         data = response.data.content.list
      //         console.log("获得该轨迹的详细信息")
      //         that.track = data
      //         that.$forceUpdate()
      //       })
      //   }
      // })
      // axios.post('/dashboard/getsimilarityjectorydetail')
      //   .then(function(item) {
      //     console.log('进入')
      //     console.log(item)
      //     console.log(trajectoryID)
      //     data = item.data[trajectoryID]
      //     // that.track.splice(data)
      //     // that.$forceUpdate()
      //     // console.log('详细轨迹')
      //     // console.log(that.track)
      //     return data
      //   })
    },
    // 显示轨迹相似度
    showIndoorSimilarity() {
      var data
      var that = this
      let para = {
        userAID : parseInt(this.userAid),
        userBID : parseInt(this.userBid),
        mapID : parseInt(this.mapid)
        // startDate : this.starttimeValue,
        // endDate : this.endtimeValue
      }
      api.getIndoorSimilarity(para).then(response => {
        data = response.data.content.list
        console.log("获得室内相似度的信息")
        var dataitem = []
        data.forEach(function(item) {
          dataitem.push({
            trajectoryAid: item['trajectoryAID'],
            trajectoryBid: item['trajectoryBID'],
            similarity: item['similarity']
          })
        })
        that.similarityList = dataitem
      })
      // axios.post('/dashboard/getindoorsimilarity')
      //   .then(function(item) {
      //     // console.log(item.data)
      //     data = item.data.trajectory
      //     // console.log(data)
      //     var dataitem = []
      //     data.forEach(function(item) {
      //       // console.log(item)
      //       // 记录两条轨迹的id和相似度，然后可以显示在列表中
      //       dataitem.push({
      //         trajectoryAid: item['trajectoryAID'],
      //         trajectoryBid: item['trajectoryBID'],
      //         similarity: item['similarity']
      //       })
      //     })
      //     that.similarityList = dataitem
      //   })
    },
    // 当点击相似度那一行的时候，要在图中显示出轨迹
    showTrackSame(row) {
      // 如果界面中有图像，则要先清除
      var svg = d3.select('.app-main').select('svg')
      svg.selectAll('circle').remove()
      svg.selectAll('path').remove()
      svg.selectAll('g').remove()
      svg.selectAll('img').remove()
      // 获取两个轨迹的详细内容
      // console.log('点击行：'+row.trajectoryAid)
      // console.log(this.track)
      // axios.all(this.showIndoorTrajectoryDetail(row.trajectoryAid),this.showIndoorTrajectoryDetail(row.trajectoryBid)).then(axios.spread(function (acct, perms){
      //   console.log(acct)
      //   console.log(perms)
      // }))
      var trackA =this.showIndoorTrajectoryDetail(row.trajectoryAid) // 根据选中行的轨迹的id获取该条轨迹的详细信息
      // var trackB = this.track
      var trackB =this.showIndoorTrajectoryDetail(row.trajectoryBid) // 根据选中行的轨迹的id获取该条轨迹的详细信息
      //   this.$forceUpdate()
      //   console.log("给B赋值")
      // var trackB = this.track
      // // })
      // 将两个轨迹绘制在图上
      console.log(trackA, trackB)
      if (trackA) {
        this.showTrackdots(trackA)
      }
      if (trackB) {
        this.showTrackdots(trackB)
      }
    },
    // 当用户输入框获得焦点以后，则显示用户列表(当没有选择地图和时间段的时候会报错)
    showList(flag) {
      if (this.selectedIndex !== '' && this.starttimeValue !== '' && this.endtimeValue !== '' && this.starttimeValue !== null && this.endtimeValue !== null) {
        Message.closeAll()
        this.showIndoorUsers(this.mapid)
        // this.userData = this.showIndoorUsers(this.mapid)
        // console.log(this.userData)
        this.isShow = true
        this.isShowSimi = false
        this.flag = flag
      } else {
        this.errorMessage('请先选择地图和时间段')
      }
    },
    // 当点击确定按钮之后，需要隐藏用户列表
    hideList() {
      this.isShow = false
      this.currentRow = null
      if (this.selectVal !== '' && this.selectVal2 !== '') { // 如果两个用户都有值，则需要显示相似度列表
        this.isShowSimi = true
        this.showIndoorSimilarity()
      }
      this.setCurrent()
    },
    // 选中列表中的值以后，更新输入框的值
    handleRowClick(row) {
      if (this.flag === 1) {
        this.selectVal = row.userName // 当检测到是第一个用户选择框的时候，则将第一个选择框的值进行更新
        this.userAid = row.userID // 更新用户的id
      } else {
        this.selectVal2 = row.userName // 当检测到是第二个用户选择框的时候，则将第二个选择框的值进行更新
        this.userBid = row.userID // 更新用户的id
      }
      this.currentRow = row // 将当前行存储下来
    },
    // 设置当前点击的行，传进去空的话就是取消选中状态
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    // 错误信息方法
    errorMessage(mes) {
      Message({
        showClose: false,
        message: mes,
        type: 'error',
        duration: 0
      })
    },
    // 显示地图图片
    map(selectedIndex) {
      // 获取图片位置以及地图的ID
      this.mapid = this.maps[selectedIndex].mapID
      var mapImg = this.maps[selectedIndex].mapSrc
      // 添加地图
      // this.addMap(mapImg, selectedIndex, viewBoxvalue)
      this.addMap(mapImg, selectedIndex)
      this.$forceUpdate()
    },
    addMap(mapImg, selectedIndex) {
      // 切换，如果那个位置有图片，需要先移除那个地方的图片再添加
      if (d3.select('.app-main').selectAll('image').empty() === false) {
        d3.selectAll('image').remove()
      }
      // console.log(mapImg, selectedIndex)
      //  获得svg标签
      // var svg = d3.select('body').select('div').select('selection').select('svg')
      var svg = d3.select('.app-main').select('svg')
      // console.log(svg)
      // 设置svg中图片的自动缩放
      // svg.attr('viewBox', '0 0 4167 2190');
      // 添加以及设置svg中图片的属性
      var imgs = svg.selectAll('images' + selectedIndex)
      imgs.data([0])
        .enter()
        .append('svg:image')
        .attr('xlink:href', mapImg)
      // this.$forceUpdate()
      // console.log("绘制完成")
      // 添加位置标注图标，可用于用户位置的标注，目前还用不到
      var location1 = svg.append('g').attr('transform', 'translate(100,100)')
      location1.append('svg:image').attr('xlink:href', '../static/icon.png')
      var location2 = svg.append('g').attr('transform', 'translate(101,101)')
      location2.append('svg:image').attr('xlink:href', '../static/icon.png')
    },
    // 显示室内单条轨迹
    showTrackdots(indoorItem) {
      // if (starttime == null || endtime == null || starttime == '' || endtime == ''){
      //   return;
      // }
      // console.log(indoorItem)
      // 添加轨迹
      var svg = d3.select('.app-main').select('svg')
      // var svg = d3.select('svg')
      var start = true
      var path = ''
      // var indoorData = this.indoorTrackData[user]
      // console.log("indoorItem")
      // foreach读取json中的每个坐标的位置，并连接坐标形成路径，用path画出
      indoorItem.forEach(function(item) {
        var x = (item.x / 1019) * 4167 // 获取x轴坐标
        var y = (item.y / 1219) * 2190 // 获取y轴坐标
        // var x = (item.x / 1019) * 1140 // 获取x轴坐标
        // var y = (item.y / 1219) * 600 // 获取y轴坐标
        // 判断轨迹点的时间是否在所选时间段中，如果在则绘制显示出来
        // if (time >= new Date(starttime).toLocaleString() && time <= new Date(endtime).toLocaleString()) {
        // 圆是最初想用来表示轨迹，发现坐标部分间隔太远，改用path
        svg.append('circle') // 紫色圆圈绘制，位置半径
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 5)
          .style('fill', 'purple')
        // svg.append('circle') // 紫色圆圈绘制，位置半径
        //   .attr('cx', item.x)
        //   .attr('cy', item.y)
        //   .attr('r', 5)
        //   .style('fill', 'purple')
        if (start) {
          path += 'M' + x + ' ' + y + ' '
          start = false
        } else {
          path += 'L' + x + ' ' + y + ' '
        }
      })
      // 添加路径
      svg.append('path')
        .attr('fill', 'transparent')
        .attr('stroke', '#000000')
        .attr('stroke-width', '6')
        .attr('stroke-linecap', 'round')
        .attr('v-bind:id', 'moveTrack')
        .attr('d', path)

      // 添加起点和终点的标注
      var startdot = indoorItem[0]
      var enddot = indoorItem[indoorItem.length - 1]
      // var startIcon = 'translate(' + ((startdot.x / 1019) * 1140 - 10) + ',' + ((startdot.y / 1219) * 600 - 20) + ')'
      // var endIcon = 'translate(' + ((enddot.x / 1019) * 1140 - 10) + ',' + ((enddot.y / 1219) * 600 - 20) + ')'
      var startIcon = 'translate(' + ((startdot.x / 1019) * 4167 - 80) + ',' + ((startdot.y / 1219) * 2190 - 200) + ')'
      var endIcon = 'translate(' + ((enddot.x / 1019) * 4167 - 80) + ',' + ((enddot.y / 1219) * 2190 - 200) + ')'
      var location1 = svg.append('g').attr('transform', startIcon)
      location1.append('svg:image')
        .attr('xlink:href', 'https://img01.sogoucdn.com/net/a/04/link?appid=100520145&url=http%3A%2F%2Fimg03.sogoucdn.com%2Fapp%2Fa%2F100520146%2F8991ef4b9a4ffbc2dcc19185280061b4')
        .attr('width', '20px')
        .attr('height', '20px')
      var location2 = svg.append('g').attr('transform', endIcon)
      location2.append('svg:image')
        .attr('xlink:href', 'https://img.mp.itc.cn/upload/20161226/56af5926ca36493c9a473de688492a77_th.jpg')
        .attr('width', '20px')
        .attr('height', '20px')
    },
    // 显示符合条件的一条或者多条轨迹
    showTrack(starttime, endtime) {
      // 先判断这是哪个地图,找到这个地图中的所有轨迹
      // imgs[selectedIndex].maplabel
      // tracks = []
      // 判断这些轨迹是否在时间段内，如果在则绘制出来轨迹；否则就不再绘制
      // 可使用的思路是 判断轨迹的起点和终点的时间是否在时间段中，如果在则绘制，否则就跳过
      if (starttime === null || endtime === null || starttime === '' || endtime === '') {
        return
      }
      var data
      var that = this
      let para = {
        userID : parseInt(this.userAid),
        mapID : parseInt(this.mapid)
        // startDate : this.starttimeValue,
        // endDate : this.endtimeValue
      }
      let para2 = {
        userID : parseInt(this.userBid),
        mapID : parseInt(this.mapid)
        // startDate : this.starttimeValue,
        // endDate : this.endtimeValue
      }
      api.getIndoorTrajectories(para).then(response => {
        data = response.data.content.list
        // let tid = {
        //   trajectoryID : data.
        // }
        console.log("获取用户1的轨迹")
        // data = data[para.trajectoryID]
        data.forEach(function(item) {
          // console.log(item)
          item = item.trajectorySrc
          console.log("获取用户1单个的轨迹")
          var start = item[0]['timeStamp']
          var end = item[item.length - 1]['timeStamp']
          var getTime = new Date(start)
          start = getTime.toLocaleString()
          getTime = new Date(end)
          end = getTime.toLocaleString()
          if (start >= new Date(starttime).toLocaleString() && end <= new Date(endtime).toLocaleString()) {
            that.showTrackdots(item)
          }
        })
      })
      api.getIndoorTrajectories(para2).then(response => {
        data = response.data.content.list
        console.log("获取用户2的轨迹")
        // data = data[para2.trajectoryID]
        data.forEach(function(item) {
          item = item.trajectorySrc
          console.log("获取用户2单个的轨迹")
          var start = item[0]['timeStamp']
          var end = item[item.length - 1]['timeStamp']
          var getTime = new Date(start)
          start = getTime.toLocaleString()
          getTime = new Date(end)
          end = getTime.toLocaleString()
          if (start >= new Date(starttime).toLocaleString() && end <= new Date(endtime).toLocaleString()) {
            that.showTrackdots(item)
          }
        })
      })
      // axios.post('/dashboard/getindoortrajectorydetail')
      //   .then(function(item) {
      //     if (item) {
      //       var indoorData1 = item.data.list
      //       indoorData1.forEach(function(item) {
      //         // console.log(item)
      //         var start = item[0]['timeStamp']
      //         var end = item[item.length - 1]['timeStamp']
      //         var getTime = new Date(start)
      //         start = getTime.toLocaleString()
      //         getTime = new Date(end)
      //         end = getTime.toLocaleString()
      //         if (start >= new Date(starttime).toLocaleString() && end <= new Date(endtime).toLocaleString()) {
      //           that.showTrackdots(item)
      //         }
      //       })
      //     }
      //   })
      // getIndoorTrajectories(this.userAid, this.mapid, starttime, endtime).then(response => {
      //   this.indoorTrackData = response.data.list
      // })
      // var indoorData1 = this.indoorTrackData
      // axios.post('/dashboard/getindoortrajectorydetail')
      //   .then(function(item) {
      //     var indoorData2 = item.data.list
      //     indoorData2.forEach(function(item) {
      //       var start = item[0]['timeStamp']
      //       var end = item[item.length - 1]['timeStamp']
      //       var getTime = new Date(start)
      //       start = getTime.toLocaleString()
      //       getTime = new Date(end)
      //       end = getTime.toLocaleString()
      //       if (start >= new Date(starttime).toLocaleString() && end <= new Date(endtime).toLocaleString()) {
      //         that.showTrackdots(item)
      //       }
      //     })
      //   })
      // getIndoorTrajectories(this.userBid, this.mapid, starttime, endtime).then(response => {
      //   this.indoorTrackData = response.data.list
      // })
    }
  }
}
</script>

<style>
  .whole{
    position: absolute;
    float: center;
    width: 100%;
    height: 85%;
    /* overflow: hidden; */
  }
  /* 左部分的布局 */
  .left{
      position: relative;
      float: left;
      width: 65%;
      height: 100%;
  }
  /* 左部分的选择框--整体 */
  .choose{
      position: relative;
      width: 85%;
      margin: 0 auto;
      margin-top: 1%;
      margin-bottom: 20px;
  }
  /* 左部分的选择框--部分 */
  .choosestyle{
      position: relative;
      width: 28%;
      margin-top: 5px;
      /* height: 42px; */
      /* border:1px solid #cccccc;
      border-radius: 2px; */
  }
  .datestyle{
    float: right;
    margin-top: 5px;
    /* margin-bottom: 15px; */
  }
  /* 地图 */
  .map{
      width: 85%;
      height: 90%;
      overflow: hidden;
      margin: 0 auto;
      border:1px solid #c0c4cc;
      border-radius: 4px;
  }
  /* 右部分的布局 */
  .right{
      position: relative;
      float: right;
      width: 35%;
      height: 100%;
  }
  /* 右部分的选择框 */
  .choose2{
    position: relative;
    width: 80%;
    height: 45px;
    margin-top: 2%;
    margin-left: 5%;
    margin-bottom: 20px;
  }
  .list-container-temp{
    width: 60%;
    font-size: 25px;
    margin-left: 30px;
    margin-top: 100px;
    color: gray;
  }
  .list-container{
    width: 350px;
  }
  .user1{
    float: left;
    text-align: center;
  }
  .user2{
    margin-left: 70px;
    text-align: center;
  }
  .btn{
    margin-top: 5%;
    margin-left: 23%;
  }
</style>
