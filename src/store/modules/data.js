const getDefaultState = () => {
    return {
      uuid: '',
      type: '',
      dirPath: '',
      dataSet: []
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
  },
  SET_DATASET: (state, dataSet) => {
    state.dataSet = dataSet
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
  },
  changeDataSet({ commit }, data) {
    commit('SET_DATASET', data)
  }
}

export default {   
  namespaced: true,
  state,
  mutations,
  actions
}
  