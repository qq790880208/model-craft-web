const Mock = require('mockjs')

let users = []
const count = 25

for (let i = 0; i < count; i++) {
  users.push(Mock.mock({
    id: i + 1,
    name: '@cname',
    role: '@integer(1,3)',
    password: '@title(1)',
    descr: '@integer(4,10)',
    team: '@integer(1,10)'
  }))
}

module.exports = [
  {
    url: '/userManage/getUserListPage',
    type: 'get',
    response: config => {
      let { page, name, pagesize } = config.params
      let mockUser = users.filter(user => {
        if (name && user.name.indexOf(name) === -1) return false
        return true
      })
      let total = mockUser.length
      mockUser = mockUser.filter((u, index) => index < 20 * page && index >= 20 * (page - 1))
      return {
        code: 20000,
        data: {
          total: total,
          items: users
        }
      }
    }
  },
  {
    url: '/userManage/editUser',
    type: 'get',
    response: config => {
      let { id, name, role, password, descr, team } = config.params
      users.some(u => {
        if (u.id === id) {
          u.name = name
          u.descr = descr
          u.role = role
          u.password = password
          u.team = team
          return true
        }
      })
      const total = users.length
      return {
        code: 20000,
        data: {
          total: total,
          items: users
        }
      }
    }
  },
  /* addUser */
  {
    url: '/userManage/addUser',
    type: 'post',
    response: config => {
      let { id, name, role, password, descr, team } = config.params
      users.push({
        id: id,
        name: name,
        descr: descr,
        role: role,
        team: team
      })
      const total = users.length
      return {
        code: 20000,
        data: {
          total: total,
          items: users
        }
      }
    }
  },
  /* removeUser */
  {
    url: '/userManage/removeUser',
    type: 'get',
    response: config => {
      let { id } = config.params
      users = users.filter(u => u.id !== id)
      const total = users.length
      return {
        code: 20000,
        data: {
          total: total,
          items: users
        }
      }
    }
  },
  /* batchRemove */
  {
    url: '/userManage/batchRemoveUser',
    type: 'get',
    response: config => {
      let { ids } = config.params
      ids = (ids||'').split(',')
      users = users.filter(u => !ids.includes(u.id))
      const total = users.length
      return {
        code: 20000,
        data: {
          total: total,
          items: users
        }
      }
    }
  }
]
