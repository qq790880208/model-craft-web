import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
// MockAdapter是一个模拟后台get的请求，es6语法
import { Teams, Users } from './data/user'
// 同样以LoginUsers, Users 的方式来接收，from的url
let _Users = Users
let _Teams = Teams

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios)
    // 获取用户列表
    mock.onGet('/user/list').reply(config => {
      console.log(config)
      //config.params放的是用户输入的name,params是user.vue中传递的
      let { name } = config.params
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) === -1) return false
        return true
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }])
        }, 1000)
      })
    })
    // 分页
    mock.onGet('/user/listpage').reply(config => {

      let { page, name } = config.params
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) === -1) return false
        return true
      })
      let total = mockUsers.length
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1))
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }])
        }, 1000)
      })
    })

    // 删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params
      _Users = _Users.filter(u => u.id !== id)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }])
        }, 500)
      })
    })
    // 显示team
    mock.onGet('/team/getTeams').reply(config => {
      console.log(config)
      //config.params放的是用户输入的name,params是user.vue中传递的
      let { name } = config.params
      let mockTeams = _Teams.filter(user => {
        if (name && user.name.indexOf(name) === -1) return false
        return true
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockTeams
          }])
        }, 1000)
      })
    })
  }
}
