import Mock from 'mockjs'

const indoorusers = Mock.mock({
  "list":
      [
        {
          "userID":'003',
          "userName":"ADMIN",
        },
        {
          "userID":'004',
          "userName":"boss",
        }
    ]    
})

export default [
  {
    url: '/dashboard/getindoorusers',
    type: 'post',
    response: config => {
      const items = indoorusers.items
      return {
        code: 20000,
        data: {
          userID: items.userID,
          userName: items.userName
        }
      }
    }
  },
  {
    url: '/dashboard/queryindoormap',
    type: 'post',
    response: config => {
      const items = indoormap.items
      return {
        code: 20000,
        data: {
          mapID: items.mapID,
          mapName: items.mapName,
          mapSrc: items.mapSrc
        }
      }
    }
  }
]

// Mock.mock('/dashboard/getindoorusers', 'post', treeAPI.getexamUploder);
// export default Mock;