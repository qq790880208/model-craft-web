import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    labelrole: '',
    avatar: '',
    roles: [],
    menus: [], // 菜单权限
    descr: '',
    userid: '',
    role: '',
    password: '',
    authority: [],
    register: '',
    dataSet: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_LABELROLE: (state, labelrole) => {
    state.labelrole = labelrole
  },
  SET_DESCR: (state, descr) => {
    state.descr = descr
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_DATASET: (state, dataSet) => {
    state.dataSet = dataSet
  },
  SET_AUTHORITY: (state, authority) => {
    state.authority = authority
  },
  SET_REGISTER: (state, register) => {
    state.register = register
  }
}

const actions = {
  changeDataSet({ commit }, data) {
    commit('SET_DATASET', data)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // md5 加密
    // var md5 = crypto.createHash("md5")
    // md5.update(password)
    // temppassword = md5.digest('hex');
    // console.log(password)
    const paras = {
      username: username.trim(),
      password: password
    }
    return new Promise((resolve, reject) => {
      login(paras).then(response => {
        const { data } = response
        console.log('111111111111111111111111111111111111111111111111')
        console.log(data)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('statetoken')
      console.log(state.token)
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(data.items)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, role, descr, id, password, is_assign } = data.items
        console.log("sssssssssssssssss")
        console.log(is_assign)
        console.log(role.split(','))
        commit('SET_ROLE', role)
        commit('SET_ROLES', role.split(','))
        commit('SET_NAME', name)
        commit('SET_USERID', id)
        // commit('SET_LABELROLE', labelrole)
        commit('SET_DESCR', descr)
        commit('SET_PASSWORD', password)
        commit('SET_REGISTER', is_assign)
        commit('SET_AUTHORITY', data.authority)
        commit('SET_REGISTER', is_assign)
        if (data.menus && data.menus.length > 0) { // 验证返回的menus是否是一个非空数组
          commit('SET_MENUS', data.menus)
        }
        console.log(state.roles)
        console.log(state.name)
        console.log(state.descr)
        console.log(state.userid)
        console.log(state.password)
        console.log(',.,.,.,.,.,.,.,.,.,.,.')
        console.log(state.register)
        console.log(state.menus)
        console.log(',.,.,.,.,.,.,.,.,.,.,.')
        console.log(state.register)
        // resolve(data.items)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        console.log("wwwwwwwwwww")
        console.log("qqqqqqqqqq")
        commit('RESET_STATE')
        console.log("2222222222222")
        console.log("eeeeeeee")
        console.log("121qweqweqweqwe31231")
        resetRouter()
        resolve()
        
      }).catch(error => {
        reject(error)
      })

    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
