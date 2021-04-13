const getDefaultState = () => {
    return {
      uuid: '',
      type: '',
      dirPath: ''
    }
  }
  
const state = getDefaultState()
  
const mutations = {
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_DIRPATH: (state, dirPath) => {
    state.dirPath = dirPath
  }
  
}
  
const actions = {
  changeUuid({ commit }, data) {
    commit('SET_UUID', data)
  },
  changeType({ commit }, data) {
    commit('SET_TYPE', data)
  },
  changeDirPath({ commit }, data) {
    commit('SET_DIRPATH', data)
  }
}

export default {   
  namespaced: true,
  state,
  mutations,
  actions
}
  