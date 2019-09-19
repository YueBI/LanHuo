<template>
  <div class="whole" id="container">
    <div class="top">
      <el-menu
        default-active="1"
        @select="handleSelect">
        <el-menu-item index="1">
          <i class="el-icon-location"></i>
          <span slot="title">室内</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-location"></i>
          <span slot="title">室外</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 页面的左部分 地图以及起止时间 -->
    <div class="left">
      <div class="choose">
        <!-- 选择地图的下拉框 -->
        <el-select
          v-model="selectedIndex"
          class="choosestyle"
          :disabled="disabled"
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
        <div class="datestyle" v-show="showdata">
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
        <div class="datestyle" v-show="!showdata">
          <!-- <el-button type="primary" plain>显示轨迹</el-button> -->
          <el-autocomplete
            class="inline-input"
            size="default"
            v-model="namevalue"
            :fetch-suggestions="querySearch"
            placeholder="请输入要查询的用户名"
            @select="handleoutUserSelect">
            <i
              class="el-icon-search el-input__icon"
              slot="prefix">
            </i>
          </el-autocomplete>
          <el-autocomplete
            class="inline-input"
            size="default"
            v-model="idvalue"
            :fetch-suggestions="queryoutSearch"
            placeholder="请输入轨迹id"
            @select="handletrajectorySelect">
            <i
              class="el-icon-search el-input__icon"
              slot="prefix">
            </i>
          </el-autocomplete>
        </div>
      </div>
      <!-- 室内地图显示 -->
      <!-- v-show="!showOutmap"  -->
      <!-- <div class="smallbtn">       
      </div> -->
      <el-badge class="smallbtn" v-show="!showOutmap">
        <el-button icon="el-icon-view" @click="showdots"></el-button>
      </el-badge>
      <div class="map">
        <div
          v-show="showOutmap"
          id="myMap"
          style="width: 100%;height: 100%"
        ></div>
        <!-- <svg class="img" style="width: 100%;height: 100%" viewBox="0 0 4167 2190"></svg> -->
        <!-- <svg class="img" style="width: 100%;height: 100%" viewBox="0 0 4167 4167"></svg> -->
        <svg class="img" style="width: 100%;height: 100%" viewBox="0 0 4167 4167"></svg>
      </div>
    </div>
    <!-- 页面的右部分 用户的选择与相似度比较 -->
    <div class="right">
      <!-- 两个用户输入框 -->
      <div class="choose2">
        <!-- <el-input v-model="selectVal" class="choosestyle user1" placeholder="用户1" @focus="showList(1)">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix">
          </i>
        </el-input> -->
        <!-- <el-input v-model="selectVal2" class="choosestyle user2" placeholder="用户2" @focus="showList(2)">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix">
          </i>
        </el-input> -->
        <el-autocomplete
          class="inline-input choosestyle user1"
          size="medium"
          v-model="selectVal"
          :fetch-suggestions="querySearch"
          placeholder="用户1"
          :trigger-on-focus="false"
          @focus="showList(1)"
          @select="handleUserSelect">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix">
          </i>
        </el-autocomplete>
        <el-autocomplete
          class="inline-input choosestyle user2"
          size="medium"
          v-model="selectVal2"
          :fetch-suggestions="querySearch"
          placeholder="用户2"
          :trigger-on-focus="false"
          @focus="showList(2)"
          @select="handleUserSelect">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix">
          </i>
        </el-autocomplete>
      </div>
      <!-- 一开始没选中用户没有用户列表显示时 -->
      <div v-show="!isShow && !isShowSimi" class="list-container-temp">用户轨迹相似度比较
        （请在上面先选择你要进行比较的两个用户）</div>
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
          label="用户编号"
          width="70"
          align="center">
        </el-table-column>
        <el-table-column
          property="userName"
          label="用户名"
          align="center">
        </el-table-column>
      </el-table>
      <!-- 确定按钮 -->
      <el-button v-show="isShow" class="btn" @click="hideList" type="primary" plain>确定</el-button>
      <!-- 用户相似度 -->
      <!-- <el-table
        class="list-container"
        ref="singleTable3"
        max-height="450"
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        :data="userSimilarity"
        border
        v-show="isShowSimi">
        <el-table-column
          property="userSimilarity"
          label="用户相似度"
          width="55"
          align="center">
        </el-table-column>
      </el-table> -->
      <el-input
        class="list-container"
        style="margin-bottom:20px;"
        :readonly="true"
        v-model="userSimilarity"
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        v-show="isShowSimi">
        <template slot="prepend">用户相似度：</template>
      </el-input>
      <!-- <el-input v-model="userSimilarity" :disabled="true" v-show="isShowSimi"></el-input> -->
      <!-- 相似度列表 -->
      <el-table
        class="list-container"
        ref="singleTable2"
        max-height="450"
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        :data="similarityList"
        border
        highlight-current-row
        @row-click="showSame"
        v-show="isShowSimi">
        <el-table-column
          type="index"
          label="编号"
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
// import { constants } from 'crypto'
import api from '@/api/similarity.js'
import imglink from '@/assets/map1.png'
import startlink from '@/assets/start.png'
import endlink from '@/assets/end.png'
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      starttimeValue: null, // 开始时间
      endtimeValue: null, // 结束时间
      startTime: null, // 开始时间临时值
      endTime: null, // 结束时间临时值
      maps: [], // 存储地图列表
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
      track: null,
      activeName: 'in',// 室内或者室外
      disabled: false,
      showOutmap: false,
      trackoutData:{}, // 存储室外轨迹数据的临时列表
      trackDatas:[], // 存储总的数据
      times: 0,
      x_test:80,
      y_test:80,
      points_list_2:[],
      points_list_3:[],
      now:"",
      trajectoryId:0, //  记录室外地图轨迹id的选择
      nowpoints: [],
      markerArr: [],
      plPoints: [],
      loadingText: '正在拼命加载中，请稍等......', // 相似度列表读取数据加载中
      loading: false,
      showdata: true,
      userid: 0,
      trajectorys: [],
      namevalue: '',
      idvalue: '',
      showPath: false,
      userSimilarity: 0
    }
  },
  mounted() {
    Message.closeAll()
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
    // inputValue() {
    //   const { selectVal, selectVal2 } = this
    //   return {
    //     selectVal,
    //     selectVal2
    //   }
    // }
  },
  watch: {
    // 监测开始时间和结束时间，确保开始时间不能大于结束时间，以及两者都不能大于当前系统的时间，否则就会出现错误提示
    timeValue: {
      handler: function(time) {
        if (this.selectedIndex === '' && this.activeName === 'in') {
          this.starttimeValue = null
          this.endtimeValue = null
          this.errorMessage("请先选择地图，再进行时间段的选择")
        } else {
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
            svg.selectAll('g').remove()
            // svg.selectAll('.persentInf').remove();
            // svg.select('.inforContent').remove();
          } else if (new Date(this.startTime) > Date.now() || new Date(this.endTime) > Date.now()) {
            // this.$refs.starttimeInput.$refs.reference.$refs.input.focus()
            this.errorMessage('开始时间或结束时间都不能大于当前的时间！')
          } else if (this.startTime > this.endTime) {
            // this.$refs.starttimeInput.$refs.reference.$refs.input.focus()
            this.errorMessage('开始时间不能大于结束时间')
          } else {
            // if (this.activeName === 'in') {
            // 根据时间段绘制出该室内地图上的轨迹
            this.showTrack(this.starttimeValue, this.endtimeValue)
          }
        }
      },
      deep: true
    },
    trajectoryId: { // 监测轨迹id是否改变，一旦改变就更新存放数据的列表，绘制这个id轨迹
      handler: function() {
        console.log('数据开始传输')
        this.hello()
      }
    },
    selectedIndex: { // 监测地图选择框的变化
      handler: function() {
        // console.log(this.selectedIndex)
        Message.closeAll()
        // 当地图更换以后，更新该地图的室内用户
        this.showIndoorUsers()
        // 每当地图选择变换的时候，如果界面中存在轨迹，需要清空，并且重新绘制选择的地图的轨迹信息
        // 先将轨迹信息清空
        var svg = d3.select('.app-main').select('svg')
        svg.selectAll('circle').remove()
        svg.selectAll('path').remove()
        svg.selectAll('g').remove()
        svg.selectAll('img').remove()
        // 重新绘制
        this.showTrack(this.starttimeValue,this.endtimeValue)
      }
    }
    // inputValue: {
    //   handler: function() {
    //     // 先清空所有的轨迹
    //     var svg = d3.select('.app-main').select('svg')
    //     svg.selectAll('circle').remove()
    //     svg.selectAll('path').remove()
    //     svg.selectAll('g').remove()
    //     svg.selectAll('img').remove()
    //     if (this.selectVal != '' && this.selectVal2 != '') {
    //       this.showUserTrack(1)
    //       this.showUserTrack(2)
    //     } else if (this.selectVal == '' && this.selectVal2 != ''){
    //       this.showUserTrack(2)
    //     } else {
    //       this.showUserTrack(1)
    //     }
    //   }
    // }
  },
  methods: {
    ////////////////室内室外兼顾/////////////////////
    // 选择室内地图还是室外地图
    handleSelect(index) {
      Message.closeAll()
      var svg = d3.select('.app-main').select('svg')
      svg.selectAll('circle').remove()
      svg.selectAll('path').remove()
      svg.selectAll('g').remove()
      svg.selectAll('img').remove()
      this.starttimeValue = null
      this.endtimeValue = null
      this.selectVal = ''
      this.selectVal2 = ''
      console.log('清空数据')
      if (index == 1) {
        this.activeName = 'in' // 将标志设置为室内
        this.showOutmap = false // 去除室外地图
        this.disabled = false // 激活选择地图下拉框
        this.showdata = true
        // this.starttimeValue = null // 将时间清空，因为室内必须选择地图之后，才能进行时间段的选择
        // this.endtimeValue = null
      } else {
        this.mymap();
        this.setMapEvent() // 设置地图事件
        this.addMapControl() // 向地图添加控件
        // this.showAlltrajectory() // 更新室外地图轨迹信息
        this.activeName = 'out' // 将标志设置为室外
        this.disabled = true // 禁用选择地图选择下拉框
        this.showOutmap = true // 显示室外地图
        this.showdata = false
        this.showOutdoorUsers()
      }
      console.log(this.activeName)
      // console.log('清空数据')
      // 转换室内或者室外之后要清空数据
      // Message.closeAll()
    },
    // 当用户输入框获得焦点以后，则显示用户列表(当没有选择地图和时间段的时候会报错)
    showList(flag) {
      if (this.activeName === 'in') {
        if (this.selectedIndex !== '' && this.starttimeValue !== '' && this.endtimeValue !== '' && this.starttimeValue !== null && this.endtimeValue !== null) {
          Message.closeAll()
          this.isShow = true
          this.isShowSimi = false
          this.flag = flag
          this.showIndoorUsers()
        } else {
          this.errorMessage('请先选择地图和时间段')
        }
      } else {
          Message.closeAll()
          this.isShow = true
          this.isShowSimi = false
          this.flag = flag
          // this.showOutdoorUsers()
      }
    },
    // 根据输入内容提供对应的输入建议 查询并返回建议列表的数据
    querySearch(queryString, cb) {
        var userData = this.userData;
        let userdataList = [];
        for(let i=0;i<this.userData.length;i++){
          userdataList.push({'value':userData[i].userName,'id':userData[i].userID})
        }
        var results = queryString ? userdataList.filter(this.createFilter(queryString)) : userdataList;
        // 调用 callback 返回建议列表的数据
        cb(results)
    },
    createFilter(queryString) {
        return (userdataList) => {
          return (userdataList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    queryoutSearch(queryString, cb) {
      var trajectorys = this.trajectorys;
      let trajectorysList = [];
      for(let i=0;i<this.trajectorys.length;i++){
        trajectorysList.push({'value':String(trajectorys[i].trajectoryId)})
      }
      var results = queryString ? trajectorysList.filter(this.createFilter(queryString)) : trajectorysList;
      cb(results)
    },
    handleoutUserSelect(item){
      console.log(item)
      // print(item.id)
      this.userid = item.id // 更新用户的id
      let para = {
        "userId": this.userid,
        "startDate":"2018-3-5",
        "endDate":"2018-3-6"
      }
      var that = this
      api.getOutdoorTrajectories(para).then(response=>{
        console.log("接收成功")
        // console.log(response.data.content.list[1])
        this.trajectorys = response.data.content.list
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
    },
    handletrajectorySelect(item) {
      console.log(item)
      var that = this
      this.trajectoryId = parseInt(item.value)
      setTimeout(function (){
        that.showouttrack('black')
      }, 1000)
      var loadingInstance = Loading.service({
          lock: true,
          text:'拼命绘制轨迹地图中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(function (){
        loadingInstance.close();
      }, 1000)
    },
    handleUserSelect(item) {
      if (this.flag === 1) {
        // this.selectVal = item.value // 当检测到是第一个用户选择框的时候，则将第一个选择框的值进行更新
        this.userAid = item.id // 更新用户的id
        var linecolor = 'red'
        var tid = 172
      } else {
        // this.selectVal2 = row.userName // 当检测到是第二个用户选择框的时候，则将第二个选择框的值进行更新
        this.userBid = item.id // 更新用户的id
        var linecolor = 'blue'
        var tid = 173
      }
      // 判断是室内地图还是室外地图，然后进行用户地图绘制
      if (this.activeName === 'in') { // 室内地图
        this.showUserTrack(this.flag)
      } else { // 室外地图
        var that = this
        this.trajectoryId = tid
        setTimeout(function (){
          that.showouttrack(linecolor)
        }, 1000)
        const loadingInstance = Loading.service({
            lock: true,
            text: '拼命绘制轨迹地图中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(function (){
          loadingInstance.close();
        }, 1000)
      }
    },
    // 当点击确定按钮之后，需要隐藏用户列表
    hideList() {
      this.isShow = false
      this.currentRow = null
      if (this.selectVal !== '' && this.selectVal2 !== '') { // 如果两个用户都有值，则需要显示相似度列表
        this.isShowSimi = true
        if (this.activeName === 'in') {
          this.showIndoorSimilarity()
          // this.showOutdoorSimilarity()  // 当后台算法连接好接口以后偶，就可以转换成上面那一句
        }else {
          this.showOutdoorSimilarity()
        }
      }
      this.setCurrent()
    },
    // 选中列表中的值以后，更新输入框的值
    handleRowClick(row) {
      if (this.flag === 1) {
        this.selectVal = row.userName // 当检测到是第一个用户选择框的时候，则将第一个选择框的值进行更新
        this.userAid = row.userID // 更新用户的id
        var linecolor = 'red'
        // var tid = 172
        // var para = {
        //   userID : parseInt(row.userID)
        // }
      } else {
        this.selectVal2 = row.userName // 当检测到是第二个用户选择框的时候，则将第二个选择框的值进行更新
        this.userBid = row.userID // 更新用户的id
        var linecolor = 'blue'
        // var tid = 187
      }
      this.currentRow = row // 将当前行存储下来
      var para = {
        userID : parseInt(row.userID)
      }
      // 判断是室内地图还是室外地图，然后进行用户地图绘制
      if (this.activeName === 'in') { // 室内地图
        this.showUserTrack(this.flag)
      } else { // 室外地图
        var that = this
        api.getOutdoorTrajectories(para).then(response => {
          var data = response.data.content.list
          data.forEach((item) => {
            that.trajectoryId = item.trajectoryId
          },
          err=>{
            // console.log(err)
            console.log("接收失败")
          })
          setTimeout(function (){
            that.showouttrack(linecolor)
          }, 1000)
          let loadingInstance = Loading.service({
              lock: true,
              text:'拼命绘制轨迹地图中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(function (){
            loadingInstance.close();
          }, 1000)
        })
      }
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
    showSame(row) {
      // 如果界面中有图像，则要先清除
      if (this.activeName == 'in') {
        var svg = d3.select('.app-main').select('svg')
        svg.selectAll('circle').remove()
        svg.selectAll('path').remove()
        svg.selectAll('g').remove()
        svg.selectAll('img').remove()
        this.showTrackSame(row)
      } else {
        this.showoutTrackSame(row)
      }
    },
    ////////////////////室内////////////////////////////////
    // 获取室内地图列表
    showIndoorMap() {
      // 获取室内地图列表
      if (this.activeName === 'in') {
        api.queryIndoorMap().then(response => {
          this.maps = response.data.content.list
          console.log("获得地图列表的信息成功")
        },
        err=>{
          // console.log(err)
          console.log("接收失败")
        })
      }
    },
    // 显示地图图片
    map(selectedIndex) {
      // 获取图片位置以及地图的ID
      this.mapid = this.maps[selectedIndex].mapId
      var mapImg = this.maps[selectedIndex].mapSrc
      var mapImg = imglink // 暂时用本地图片替代
      // 通过接口获得图片，暂时还没测试成功
      // let para = {
      //   mapId: parseInt(this.mapid)
      // }
      // api.queryMapByMapId(para,{
      //   // responseType: 'arraybuffer'
      //   responseType: "blob"
      // }).then(res => {
      //   console.log('jinru')
      //   const content = res
      //   const blob = new Blob([content])
      //   let url = window.URL.createObjectURL(blob)
      //   console.log(url)
      //   // var temp = require(url)
      //   // console.log(temp)
      //   this.addMap(url, selectedIndex)
      //   // this.mapImg = url;
      // }).catch(err => {
      //   console.log('加载失败')
      // });
      // 添加图片
      this.addMap(mapImg, selectedIndex)
    },
    addMap(mapImg, selectedIndex) {
      // 切换，如果那个位置有图片，需要先移除那个地方的图片再添加
      if (d3.select('.app-main').selectAll('image').empty() === false) {
        d3.selectAll('image').remove()
      }
      // console.log(mapImg, selectedIndex)
      //  获得svg标签
      var svg = d3.select('.app-main').select('svg')
      var imgs = svg.selectAll('images' + selectedIndex)
      imgs.data([0])
        .enter()
        .append('svg:image')
        .attr('xlink:href', mapImg)
      // 添加位置标注图标，可用于用户位置的标注，目前还用不到
      // var location1 = svg.append('g').attr('transform', 'translate(100,100)')
      // location1.append('svg:image').attr('xlink:href', '../static/icon.png')
      // var location2 = svg.append('g').attr('transform', 'translate(101,101)')
      // location2.append('svg:image').attr('xlink:href', '../static/icon.png')
    },
    // 读取室内用户列表，并将用户列表进行更新
    showIndoorUsers() {
      var data
      var that = this
      let para = {
        mapId: parseInt(this.mapid)
      }
      api.getIndoorUsers(para).then(response => {
        data = response.data.content.list
        console.log("获得用户列表的信息")
        if (data) {
          var datalist = []
          data.forEach(function(item) {
            var lists = { 'userID': '', 'userName': '' }
            if (item){
              lists['userID'] = item['userId']
              lists['userName'] = item['userName']
              datalist.push(lists)
            } 
          })
          that.userData = datalist
        }
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
    },
    // 显示室内轨迹相似度
    showIndoorSimilarity() {
      this.loading = true
      var data
      var that = this
      let para = {
        userAID : parseInt(this.userAid),
        userBID : parseInt(this.userBid),
        mapID : parseInt(this.mapid),
        startDate : "2010-01-01",
        endDate : "2019-01-01"
      }
      console.log(para)
      api.getIndoorSimilarity(para).then(response => { // 获取室内用户相似度并更新相似度列表
        console.log('接收室内用户相似度成功')
        this.loading = false
        data = response.data.content.trajectory
        console.log(response.data.content)
        console.log("获得室内相似度的信息")
        var dataitem = []
        data.forEach(function(item) {
          dataitem.push({
            trajectoryAid: item['trajectoryAID'],
            trajectoryBid: item['trajectoryBID'],
            similarity: item['similarity']
          })
        })
        that.userSimilarity = response.data.content.userSimilarity
        that.similarityList = dataitem
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
    },
    // 当点击相似度那一行的时候，要在图中显示出轨迹
    showTrackSame(row) {
      // 如果界面中有图像，则要先清除
      var svg = d3.select('.app-main').select('svg')
      svg.selectAll('circle').remove()
      svg.selectAll('path').remove()
      svg.selectAll('g').remove()
      svg.selectAll('img').remove()
      var data
      var that = this
      var link
      let para = {
        trajectoryID: parseInt(row.trajectoryAid)
      }
      let parab = {
        trajectoryID: parseInt(row.trajectoryBid)
      }
      api.getIndoorTrajectoryDetail(para).then(response => {
        console.log(response.data.content.list)
        data = response.data.content.list
        console.log("获得该轨迹的详细信息")
        // console.log(data)
        this.showTrackdots(data,'blue')
      })
      api.getIndoorTrajectoryDetail(parab).then(response => {
        data = response.data.content.list
        console.log("获得该轨迹的详细信息")
        // console.log(data)
        this.showTrackdots(data,'red')
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
    },
    // 显示室内该时间段用户轨迹点
    showdots() {
      if (this.showPath) {
        this.showTrack(this.starttimeValue,this.endtimeValue)
      } else {
        // 添加
        var svg = d3.select('.app-main').select('svg')
        svg.selectAll('path').remove()
        svg.selectAll('g').remove()
        svg.selectAll('img').remove()
      }
      this.showPath = !this.showPath
    },
    // 显示室内单条轨迹
    showTrackdots(indoorItem,color) {
      // 添加轨迹
      var svg = d3.select('.app-main').select('svg')
      // var svg = d3.select('svg')
      var start = true
      var path = ''
      // foreach读取json中的每个坐标的位置，并连接坐标形成路径，用path画出
      indoorItem.forEach(function(item) {
        var x = (item.x / 1019) * 4167 // 获取x轴坐标
        var y = (item.y / 1019) * 4167 // 获取y轴坐标
        // var y = (item.y / 1219) * 2190 // 获取y轴坐标
        // 圆是最初想用来表示轨迹，发现坐标部分间隔太远，改用path
        // svg.append('circle') // 紫色圆圈绘制，位置半径
        //   .attr('cx', x)
        //   .attr('cy', y)
        //   .attr('r', 25)
        //   .style('fill', 'purple')
        svg.append('circle') // 紫色圆圈绘制，位置半径
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 15)
          .style('fill', 'purple')
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
        .attr('stroke', color)
        .attr('stroke-width', '15')
        .attr('stroke-linecap', 'round')
        .attr('v-bind:id', 'moveTrack')
        .attr('d', path)

      // 添加起点和终点的标注
      var startdot = indoorItem[0]
      var enddot = indoorItem[indoorItem.length - 1]
      // var startIcon = 'translate(' + ((startdot.x / 1019) * 4167 - 80) + ',' + ((startdot.y / 1219) * 2190 - 200) + ')'
      // var endIcon = 'translate(' + ((enddot.x / 1019) * 4167 - 80) + ',' + ((enddot.y / 1219) * 2190 - 200) + ')'
      var startIcon = 'translate(' + ((startdot.x / 1019) * 4167 - 80) + ',' + ((startdot.y / 1019) * 4167 - 80) + ')'
      var endIcon = 'translate(' + ((startdot.x / 1019) * 4167 - 80) + ',' + ((startdot.y / 1019) * 4167 - 80) + ')'
      var location1 = svg.append('g').attr('transform', startIcon)
      location1.append('svg:image')
        .attr('xlink:href', startlink)
        .attr('width', '200px')
        .attr('height', '200px')
      // location1.append('svg:image')
      //   .attr('xlink:href', '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png')
      //   .attr('width', '200px')
      //   .attr('height', '200px')
      var location2 = svg.append('g').attr('transform', endIcon)
      location2.append('svg:image')
        .attr('xlink:href', endlink)
        .attr('width', '200px')
        .attr('height', '200px')
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
      console.log(this.userData)
      this.userData.forEach((item) => {
        console.log("接收用户成功")
        let para = {
          userID : parseInt(item.userID),
          mapID : parseInt(this.mapid)
          // startDate : this.starttimeValue,
          // endDate : this.endtimeValue
        }
        api.getIndoorTrajectories(para).then(response => {
          console.log("接收成功")
          data = response.data.content.list
          // console.log("获取用户的轨迹")
          // data = data[para.trajectoryID]
          data.forEach(function(item) {
            // console.log(item)
            // item = item.trajectoryID
            let tid = {
              trajectoryId : parseInt(item.trajectoryId)
            }
            // console.log(tid)
            // this.showIndoorTrajectoryDetail(item.trajectoryID)
            api.getIndoorTrajectoryDetail(tid).then(response => {
              item = response.data.content.list
              // item = data[tid.trajectoryID]
              console.log("获得该轨迹的详细信息")
              var start = item[0]['timeStamp']
              // console.log(start)
              var end = item[item.length - 1]['timeStamp']
              var getTime = new Date(start)
              start = getTime.toLocaleString()
              getTime = new Date(end)
              end = getTime.toLocaleString()
              if (start >= new Date(starttime).toLocaleString() && end <= new Date(endtime).toLocaleString()) {
                console.log("绘制轨迹")
                that.trackDatas = item
                that.showTrackdots(item,"black")
              }
            },
            err=>{
              // console.log(err)
              console.log("接收失败")
            })
          })
        })
      })
    },
    // 用不同的颜色显示室内用户的轨迹
    showUserTrack(flag) {
      var para
      var linecolor
      var that = this
      if (flag === 1) {
        para = {
          userID : parseInt(this.userAid),
          mapID : parseInt(this.mapid)
          // startDate : "2008-09-03",
          // endDate : "2008-09-03"
        }
        linecolor = 'blue'
      } else {
        para = {
          userID : parseInt(this.userBid),
          mapID : parseInt(this.mapid)
          // startDate : "2008-09-03",
          // endDate : "2008-09-03"
        }
        linecolor = 'red'
      }
      // 对轨迹进行绘制
      api.getIndoorTrajectories(para).then(response => {
        let data = response.data.content.list
        data.forEach(function(item) {
          let tid = {
            trajectoryId : parseInt(item.trajectoryId)
          }
          api.getIndoorTrajectoryDetail(tid).then(response => {
              item = response.data.content.list
              that.showTrackdots(item,linecolor)
          },
          err=>{
            // console.log(err)
            console.log("接收失败")
          })
        })
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
    },
    ////////////////////室外////////////////////////////////
    // 百度地图 室外地图的创建引入
    mymap() {
      var map = new BMap.Map("myMap"); //在百度地图容器中创建一个地图
      var point = new BMap.Point(116.395645, 39.937953); //定义一个中心点坐标
      map.centerAndZoom(point, 12); //设定地图的中心点和坐标并将地图显示在地图容器中
      window.map = map; //将map变量存储在全局
    },
    // 设置一些地图默认事件
    setMapEvent() {
      map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
      map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
      map.enableKeyboard(); //启用键盘上下左右键移动地图
    },
    // 添加控件
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
    // 显示室外用户列表
    showOutdoorUsers() {
      var data
      var that = this
      api.getOutdoorUsers().then(response => {
        data = response.data.content.list
        console.log("获得室外用户列表的信息")
        console.log(data)
        if (data) {
          var datalist = []
          data.forEach(function(item) {
            var lists = { 'userID': '', 'userName': '' }
            if (item){
              lists['userID'] = item['userId']
              lists['userName'] = item['userName']
              datalist.push(lists)
            } 
          })
          that.userData = datalist
        }
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
    },
    // 显示室外轨迹相似度
    showOutdoorSimilarity() {
      var data
      var that = this
      let para = {
        userAID : parseInt(this.userAid),
        userBID : parseInt(this.userBid),
        startDate : "2008-07-04",
        endDate : "2009-09-04"
      }
      console.log(para)
      api.getOutdoorSimilarity(para).then(response => { // 获取室内用户相似度
        // console.log(response.data.content)
        data = response.data.content.trajectory
        console.log("获得相似度的信息")
        // console.log(data)
        var dataitem = []
        data.forEach(function(item) {
          dataitem.push({
            trajectoryAid: item['trajectoryAID'],
            trajectoryBid: item['trajectoryBID'],
            similarity: item['similarity']
          })
        })
        that.similarityList = dataitem
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
    },
    // 当点击相似度那一行的时候，要在图中显示出轨迹
    showoutTrackSame(row) {
      var data
      var that = this
      var link
      this.trajectoryId = row.trajectoryAid
      setTimeout(function (){
        that.showouttrack("red")
      }, 1000)
      var loadingInstance = Loading.service({
          lock: true,
          text:'拼命绘制轨迹地图中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(function (){
        loadingInstance.close();
      }, 1000)
      this.trajectoryId = row.trajectoryBid
      // this.trajectoryId = 175
      setTimeout(function (){
        that.showouttrack("red")
      }, 1000)
      var loadingInstance = Loading.service({
          lock: true,
          text:'拼命绘制轨迹地图中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(function (){
        loadingInstance.close();
      }, 1000)
      // let para = {
      //   "trajectoryID": parseInt(row.trajectoryAid)
      // }
      // let parab = {
      //   "trajectoryID": parseInt(row.trajectoryBid)
      // }
      // api.getOutdoorTrajectoryDetail(para).then(response => {
      //     console.log("接收成功")
      //     data = response.data.content.list
      //     this.trajectoryId = data.trajectoryId 
      //     that.showouttrack("blue");
      //     // that.showoutTrackdots(item,linecolor)
      // })
      // api.getOutdoorTrajectoryDetail(parab).then(response => {
      //     console.log("接收成功")
      //     data = response.data.content.list
      //     that.showouttrack("red");
      //     // that.showoutTrackdots(item,linecolor)
      // })
    },
    // 用不同的颜色显示室外用户的轨迹
    showUseroutTrack(flag) {
      var para
      var linecolor
      var that = this
      if (flag === 1) {
        para = {
          userID : parseInt(this.userAid)
          // startDate : this.starttimeValue,
          // endDate : this.endtimeValue
        }
        linecolor = 'blue'
      } else {
        para = {
          userID : parseInt(this.userBid)
          // startDate : this.starttimeValue,
          // endDate : this.endtimeValue
        }
        linecolor = 'red'
      }
      // 对轨迹进行绘制
      api.getOutdoorTrajectories(para).then(response => {
        let data = response.data.content.list
        data.forEach(function(item) {
          let tid = {
            trajectoryId : parseInt(item.trajectoryId)
          }
          api.getOutdoorTrajectoryDetail(tid).then(response => {
              item = response.data.content.list
              that.showouttrack(linecolor);
              // that.showoutTrackdots(item,linecolor)
          })
        })
      })
    },
    // 显示室外轨迹
    showouttrack(linecolor) {
      this.mymap(); //创建地图
      this.setMapEvent(); //设置地图事件
      this.addMapControl(); //向地图添加控件
      this.addPolyline(linecolor);
    },
    addPolyline(linecolor) {
      for (var i = 0; i < this.plPoints.length; i++) {
        var json = this.plPoints[i];
        var points = [];
        for (var j = 0; j < json.points.length; j++) {
          var p1 = json.points[j].split("|")[0];
          var p2 = json.points[j].split("|")[1];
          var point = new BMap.Point(p1, p2);
          map.centerAndZoom(point, 16);
          points.push(new BMap.Point(p1, p2));
        }
        var line = new BMap.Polyline(points, {
          strokeStyle: json.style,
          strokeWeight: json.weight,
          strokeColor: linecolor,
          strokeOpacity: json.opacity
        });
        map.addOverlay(line);
      }
    },
    showAlltrajectory(){
      let para = {
        "userId": 1,
        "startDate":"2018-3-5",
        "endDate":"2018-3-6"
      }
      var that = this
      api.getOutdoorTrajectories(para).then(response=>{
        console.log("接收成功")
        // console.log(response.data.content.list[1])
        var data = response.data.content.list
        data.forEach((item) => {
          // console.log(item)
          that.trajectoryId = item.trajectoryId
        })
      },
      err=>{
        console.log("接收失败")
      })
    },
    hello(){
      console.log(this.trajectoryId)
      //获取轨迹信息
      let para = {
        "trajectoryID": this.trajectoryId
      }
      // console.log(para)
      console.log("开始接收")
      api.getOutdoorTrajectoryDetail(para).then(response=>{
        console.log("接收成功")
        // console.log(response.data.content.list[1])
        var number1=0
        this.trackoutData = response.data.content.list
        // this.trackoutDatas.append(this.trackoutData)
        var i=0
        for(i in this.trackoutData){
          this.x_2=this.trackoutData[i]["latitude"]
          this.y_2=this.trackoutData[i]["longitude"]
          this.solepoint=this.y_2+"|"+this.x_2,
          this.points_list_2.push(this.solepoint)
        }
        for(i in this.trackoutData){
          this.x_2=this.trackoutData[i]["latitude"]
          this.y_2=this.trackoutData[i]["longitude"]
          this.solepoint=this.y_2+"|"+this.x_2,
          this.points_list_3.push(
            {
          title: null,
          content: null,
          point:this.solepoint,
          isOpen: 0,
          icon: { w: 100, h: 21, l: 0, t: 0, x: 6, lb: 5 }
        }
          )
        }
        this.markerArr=this.points_list_3
        this.plPoints=[
        {
          style: "solid",
          weight: 4,
          color: "#f00",
          opacity: 0.6,
          points: this.points_list_2
        }
      ]

        this.x_1=((this.trackoutData)[0]["latitude"])
        this.y_1=((this.trackoutData)[0]["longitude"])
        this.nowpoints[0]=
        {
          title: null,
          content: null,
          point:this.y_1+"|"+this.x_1,
          isOpen: 0,
          icon: { w: 100, h: 21, l: 0, t: 0, x: 6, lb: 5 }
        }
      },
      err=>{
        // console.log(err)
        console.log("接收失败")
      })
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
  .top{
    position: relative;
    margin: auto;
    margin-top: 15px;
    float: left;
    /* width: 10%; */
    /* height: 100%; */
  }
  /* 左部分的布局 */
  .left{
      position: relative;
      float: left;
      width: 60%;
      height: 100%;
  }
  /* 左部分的选择框--整体 */
  .choose{
      position: relative;
      width: 90%;
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
  .style{
    margin-top: 5px;
  }
  /* 地图 */
  .map{
      width: 90%;
      height: 90%;
      overflow: hidden;
      /* margin: 0 auto; */
      border:1px solid #c0c4cc;
      border-radius: 4px;
      margin-left: 5%;
  }
  .smallbtn{
    float: right;
  }
  /* 右部分的布局 */
  .right{
      position: relative;
      float: right;
      width: 30%;
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
    font-family: '宋体'
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
    margin-left: 28%;
  }
  input.disabled{
    background-color: #fff;
    /* background:#fff;
    opacity:1;
    color:black; */
  }
</style>
