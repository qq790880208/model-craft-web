const Mock = require('mockjs')

let List = []
let count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@integer(1,10)',
    display_time: '@datetime',
    nums: '@integer(4,10)'
  }))
}

module.exports = [
  {
    url: '/team/getTeams',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/team/delTeams',
    type: 'get',
    response: config => {
      const { id, name } = config.params
      List = List.filter(item => item.name !== name)
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/team/addTeams',
    type: 'post',
    response: config => {
      const { name, descr, time} = config.params
      List = List.push({
        id: 156,
        name: name,
        display_time: '1970-11-15 17:42:06',
        nums: 8
      })
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },
  {
    url: '/team/editTeams',
    type: 'post',
    response: config => {
      const { id, name, display_time, nums } = config.params
      List = List.some(u => {
        if (u.id === id) {
          u.name = name
          u.display_time = display_time
          u.nums = nums
          return true
        }
      })
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  }

]
