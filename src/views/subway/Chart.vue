<template>
  <div id="chart" />
</template>

<script>
import echarts from 'echarts'
import Axios from 'axios'

export default {
  name: 'Chart',
  data() {
    return {}
  },
  mounted() {
    var that = this
    const chart = echarts.init(document.getElementById('chart'), 'roma')
    const option = {
      title: {
        text: '入站量和出站量',
        subtext: '火车东站'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['入站量', '出站量']
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: [
            '16:30',
            '16:40',
            '16:50',
            '17:00',
            '17:10',
            '17:20',
            '17:30',
            '17:40',
            '17:50',
            '18:00',
            '18:10',
            '18:20'
          ]
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '入站量',
          type: 'bar',
          data: [
            2.0,
            4.9,
            7.0,
            23.2,
            25.6,
            76.7,
            135.6,
            162.2,
            32.6,
            20.0,
            6.4,
            3.3
          ],
          markPoint: {
            data: [{ type: 'max', name: '最大值' }]
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }]
          }
        },
        {
          name: '出站量',
          type: 'bar',
          data: [
            2.6,
            5.9,
            9.0,
            26.4,
            28.7,
            70.7,
            175.6,
            182.2,
            48.7,
            18.8,
            6.0,
            2.3
          ],
          markPoint: {
            data: []
          }
        }
      ]
    }
    chart.setOption(option)
    window.addEventListener('message', function(e) {
      if (e.source === window.frames[0] || !isNaN(e.data)) {
        const get_station_url = 'http://127.0.0.1:8000/Flow/show_flow/'
        const now = new Date()
        let stand_name = '火车东站'
        let date = now.getDate()
        if (!isNaN(e.data)) {
          date = date + e.data - 2
        } else {
          stand_name = e.data
        }
        const hour = now.getHours()
        const minutes = now.getMinutes()
        const station_id_map = JSON.parse(localStorage.getItem('station_id_map'))
        const id = station_id_map[stand_name]
        // console.log(id)
        // console.log(id)
        Axios.post(get_station_url, {
          year: 2019,
          month: 5,
          dates: [date],
          stations: [id]
        })
          .then(response => {
            const data = response.data
            const station_info = JSON.parse(localStorage.getItem('stationInfo'))
            if (station_info != null) {
              const station_id = Object.keys(data)[0]
              if (station_info[station_id] === undefined) {
                station_info[station_id] = data[station_id]
              } else {
                // merge station dates info
                const dates = Object.keys(data[station_id])
                for (let index = 0; index < dates.length; index++) {
                  if (station_info[station_id][dates[index]] === undefined) {
                    station_info[station_id][dates[index]] =
                      data[station_id][dates[index]]
                  }
                }
              }
              localStorage.setItem('stationInfo', JSON.stringify(station_info))
              const station_name = stand_name
              if (!station_name.endsWith('站')) {
                option.title.subtext = station_name.concat('站')
              }
              let time_slide_now = hour * 6 + Math.floor(minutes / 10)
              time_slide_now = time_slide_now < 7 ? 7 : time_slide_now
              // console.log(time_slide_now);
              const range = 4
              const old_color = 'gray'
              for (let index = 0; index < 12; index++) {
                // console.log(date);
                // console.log(station_info)
                if (index < range) {
                  option.series[0].data[index] = {
                    value:
                      station_info[station_id]['date_'.concat(date.toString())][
                        time_slide_now - range + index
                      ]['in'],
                    itemStyle: {
                      color: '#CD5C5C'
                    }
                  }
                  option.series[1].data[index] = {
                    value:
                      station_info[station_id]['date_'.concat(date.toString())][
                        time_slide_now - range + index
                      ]['out'],
                    itemStyle: {
                      color: '#4ad2ff'
                    }
                  }
                } else if (index > range + 2) {
                  option.series[0].data[index] = {
                    value:
                      station_info[station_id]['date_'.concat(date.toString())][
                        time_slide_now - range + index
                      ]['in'],
                    itemStyle: {
                      color: '#771100'
                    }
                  }
                  option.series[1].data[index] = {
                    value:
                      station_info[station_id]['date_'.concat(date.toString())][
                        time_slide_now - range + index
                      ]['out'],
                    itemStyle: {
                      color: '#96B3D3'
                    }
                  }
                } else {
                  option.series[0].data[index] =
                    station_info[station_id]['date_'.concat(date.toString())][
                      time_slide_now - range + index
                    ]['in']
                  option.series[1].data[index] =
                    station_info[station_id]['date_'.concat(date.toString())][
                      time_slide_now - range + index
                    ]['out']
                }
                const hour_now = Math.floor((time_slide_now - range + index) / 6)
                const time_now = (time_slide_now - range + index) % 6
                // console.log(option.xAxis);
                option.xAxis[0].data[index] = String(hour_now)
                  .concat(':')
                  .concat(String(time_now).concat('0'))
              }
              chart.setOption(option)
            } else {
              localStorage.setItem('stationInfo', JSON.stringify(data))
            }
          })
          .catch(error => window.console.log(error))
      }
    })
  },
  methods: {
    randomInt: function(maxData) {
      return +(Math.random() * (maxData - 10)).toFixed(1)
    }
  }
}
</script>
<style>
#chart {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
