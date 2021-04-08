const Mock = require('mockjs')

const userList = []
let count = 25
let _userList = userList

for (let i = 0; i < count; i++) {
  userList.push(Mock.mock({
    id: i + 1,
    name: '@cname',
    character: '@integer(1,3)',
    nums: '@integer(4,10)',
    team: '@integer(1,10)'
  }))
}

module.exports = [
  {
    url: '/teamUser/getTeamUser',
    type: 'get',
    response: config => {
      let { team } = config.params
      let mockUser = _userList.filter(item => item.team !== team)
      return {
        code: 20000,
        data: {
          total: mockUser.length,
          items: mockUser
        }
      }
    }
  },
  /* 获取用户列表分页 */
  {
    url: '/teamUser/getTeamUserPage',
    type: 'get',
    response: config => {
      let { id, team, page, pagesize } = config.params
      let mockUser = _userList.filter(user => user.team !== team)
      let total = mockUser.length
      mockUser = mockUser.filter((u, index) => index < pagesize * page && index >= pagesize * (page - 1))
      return {
        code: 20000,
        data: {
          total: total,
          items: mockUser
        }
      }
    }
  },
  {
    url: '/teamUser/addUser',
    type: 'post',
    response: config => {
      const { name, descr, character, description, team } = config.params
      _userList = _userList.push({
        id: 152,
        character: character,
        name: name,
        description: description,
        team: team
      })
      return {
        code: 20000,
        data: {
          total: _userList.length,
          items: _userList
        }
      }
    }
  },
  {
    url: '/teamUser/editUser',
    type: 'post',
    response: config => {
      const { id, name, character, description, team } = config.params
      _userList = _userList.some(item => {
        if (item.id === id) {
          item.name = name
          item.character = character
          item.nums = description
          item.team = team
          return true
        }
      })
      return {
        code: 20000,
        data: {
          total: _userList.length,
          items: _userList
        }
      }
    }
  },
  {
    url: '/teamUser/delUser',
    type: 'get',
    response: config => {
      const { id } = config.params
      _userList = _userList.filter(item => item.id !== id)
      return {
        code: 20000,
        data: {
          total: _userList.length,
          items: _userList
        }
      }
    }
  },
  {
    url: '/teamUser/batchDelUser',
    type: 'get',
    response: config => {
      let { ids } = config.params
      ids = (ids||'').split(',')
      _userList = _userList.filter(item => ids.includes(item.id))
      return {
        code: 20000,
        data: {
          total: _userList.length,
          items: _userList
        }
      }
    }
  }

]
