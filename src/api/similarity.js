import request from '@/utils/request'
import axios from 'axios'
const baseUrl = 'http://112.74.189.126:8080'
// const baseUrl = 'https://127.0.0.1:8080'
// const baseUrl = 'http://10.210.70.164:8080'
// const baseUrl = 'http://10.112.20.181:8080'
// const baseUrl = 'http://10.112.10.121:8080'
const instance = axios.create()
instance.defaults.timeout = 6000
instance.interceptors.request.use((config) => {
  instance.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
  return config
}, (error) => {
  return Promise.reject(error)
})
export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    instance.post(url, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        console.log(url)
        reject(error)
      })
  })
}

export default {
  // 查询地图列表
  queryIndoorMap(){
    return fetch(`${baseUrl}/bluefire/Integererface/data_manage/queryIndoorMap`)
  },
  // 获取室内用户列表
  getIndoorUsers(params){
    return fetch(`${baseUrl}/bluefire/Integererface/data_manage/getIndoorUsers`, params)
  },
  // 获取室内轨迹的详细信息
  getIndoorTrajectoryDetail(params){
    return fetch(`${baseUrl}/bluefire/Integererface/data_manage/getIndoorTrajectoryDetail`, params)
  },
  // 获取室内用户相似度
  getIndoorSimilarity(params){
    return fetch(`${baseUrl}/bluefire/Integererface/analyse/getIndoorSimilarity`, params)
  },
  // 获取室内轨迹信息
  getIndoorTrajectories(params){
    return fetch(`${baseUrl}/bluefire/Integererface/data_manage/getIndoorTrajectories`, params)
  }
}
