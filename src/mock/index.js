// 将所有的 mock 文件引入
// require('@/mock/indooruser')
// require('@/mock/mapmock')

// 在这里可以做一些通用的配置
const Mock = require('mockjs')
// 设置所有 ajax 请求的超时时间，模拟网络传输耗时
// Mock.setup({
// timeout:0 - 300
// })

// 格式： Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/dashboard/queryindoormap', 'post', require('../static/json/map.json'))
Mock.mock('/dashboard/getindoorusers', 'post', require('../static/json/user.json'))
Mock.mock('/dashboard/getindoortrajectorydetail', 'post', require('../static/json/indoor.json'))
Mock.mock('/dashboard/getindoorsimilarity', 'post', require('../static/json/similarity.json'))
Mock.mock('/dashboard/getindoortrajectories', 'post', require('../static/json/indoortrajectory.json'))
Mock.mock('/dashboard/getsimilarityjectorydetail', 'post', require('../static/json/indoor2.json'))
